"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import { useAuth } from "./AuthContext"

type FamilyMember = {
  id: string
  userId: string
  name: string
  relationship: string
  dateOfBirth: string
  gender: string
  email?: string
  phone?: string
  isDependent: boolean
  policies: string[]
  createdAt: firebase.firestore.Timestamp
}

type FamilyGroup = {
  id: string
  ownerId: string
  name: string
  members: string[]
  invitedMembers: { email: string; role: string }[]
  createdAt: firebase.firestore.Timestamp
}

type FamilyContextType = {
  familyMembers: FamilyMember[]
  familyGroup: FamilyGroup | null
  isLoading: boolean
  addFamilyMember: (member: Omit<FamilyMember, "id" | "userId" | "createdAt" | "policies">) => Promise<string>
  updateFamilyMember: (id: string, data: Partial<Omit<FamilyMember, "id" | "userId" | "createdAt">>) => Promise<void>
  deleteFamilyMember: (id: string) => Promise<void>
  createFamilyGroup: (name: string) => Promise<string>
  inviteMemberToGroup: (email: string, role: string) => Promise<void>
  removeMemberFromGroup: (memberId: string) => Promise<void>
  leaveFamilyGroup: () => Promise<void>
  getFamilyMemberById: (id: string) => FamilyMember | undefined
  sortFamilyMembers: (sortBy: "name" | "relationship" | "age") => void
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setFamilyMembers([])
      setFamilyGroup(null)
      setIsLoading(false)
      return
    }

    const fetchFamilyData = async () => {
      setIsLoading(true)
      try {
        // Fetch family members
        const membersSnapshot = await firebase
          .firestore()
          .collection("familyMembers")
          .where("userId", "==", user.id)
          .get()

        const members: FamilyMember[] = []
        membersSnapshot.forEach((doc) => {
          members.push({ id: doc.id, ...doc.data() } as FamilyMember)
        })
        setFamilyMembers(members)

        // Fetch family group
        const groupsSnapshot = await firebase
          .firestore()
          .collection("familyGroups")
          .where("members", "array-contains", user.id)
          .limit(1)
          .get()

        if (!groupsSnapshot.empty) {
          const groupDoc = groupsSnapshot.docs[0]
          setFamilyGroup({ id: groupDoc.id, ...groupDoc.data() } as FamilyGroup)
        } else {
          // Check if user is invited to any group
          const invitedGroupsSnapshot = await firebase
            .firestore()
            .collection("familyGroups")
            .where("invitedMembers", "array-contains", { email: user.email, role: "member" })
            .limit(1)
            .get()

          if (!invitedGroupsSnapshot.empty) {
            const groupDoc = invitedGroupsSnapshot.docs[0]
            setFamilyGroup({ id: groupDoc.id, ...groupDoc.data() } as FamilyGroup)
          } else {
            setFamilyGroup(null)
          }
        }
      } catch (error) {
        console.error("Error fetching family data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilyData()
  }, [user])

  const addFamilyMember = async (
    member: Omit<FamilyMember, "id" | "userId" | "createdAt" | "policies">,
  ): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const newMember = {
        ...member,
        userId: user.id,
        policies: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      const docRef = await firebase.firestore().collection("familyMembers").add(newMember)

      const createdMember: FamilyMember = {
        id: docRef.id,
        ...newMember,
        createdAt: firebase.firestore.Timestamp.now(),
      }

      setFamilyMembers([...familyMembers, createdMember])

      return docRef.id
    } catch (error) {
      throw error
    }
  }

  const updateFamilyMember = async (
    id: string,
    data: Partial<Omit<FamilyMember, "id" | "userId" | "createdAt">>,
  ): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await firebase.firestore().collection("familyMembers").doc(id).update(data)

      setFamilyMembers(familyMembers.map((member) => (member.id === id ? { ...member, ...data } : member)))
    } catch (error) {
      throw error
    }
  }

  const deleteFamilyMember = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await firebase.firestore().collection("familyMembers").doc(id).delete()
      setFamilyMembers(familyMembers.filter((member) => member.id !== id))
    } catch (error) {
      throw error
    }
  }

  const createFamilyGroup = async (name: string): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const newGroup = {
        ownerId: user.id,
        name,
        members: [user.id],
        invitedMembers: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      const docRef = await firebase.firestore().collection("familyGroups").add(newGroup)

      const createdGroup: FamilyGroup = {
        id: docRef.id,
        ...newGroup,
        createdAt: firebase.firestore.Timestamp.now(),
      }

      setFamilyGroup(createdGroup)

      return docRef.id
    } catch (error) {
      throw error
    }
  }

  const inviteMemberToGroup = async (email: string, role: string): Promise<void> => {
    if (!user || !familyGroup) throw new Error("User not authenticated or no family group")

    try {
      // Check if user is the owner
      if (familyGroup.ownerId !== user.id) {
        throw new Error("Only the group owner can invite members")
      }

      // Check if email is already invited
      const isAlreadyInvited = familyGroup.invitedMembers.some((member) => member.email === email)
      if (isAlreadyInvited) {
        throw new Error("This email is already invited")
      }

      // Update the group
      const updatedInvitedMembers = [...familyGroup.invitedMembers, { email, role }]

      await firebase.firestore().collection("familyGroups").doc(familyGroup.id).update({
        invitedMembers: updatedInvitedMembers,
      })

      setFamilyGroup({
        ...familyGroup,
        invitedMembers: updatedInvitedMembers,
      })
    } catch (error) {
      throw error
    }
  }

  const removeMemberFromGroup = async (memberId: string): Promise<void> => {
    if (!user || !familyGroup) throw new Error("User not authenticated or no family group")

    try {
      // Check if user is the owner
      if (familyGroup.ownerId !== user.id) {
        throw new Error("Only the group owner can remove members")
      }

      // Cannot remove the owner
      if (memberId === familyGroup.ownerId) {
        throw new Error("Cannot remove the group owner")
      }

      // Update the group
      const updatedMembers = familyGroup.members.filter((id) => id !== memberId)

      await firebase.firestore().collection("familyGroups").doc(familyGroup.id).update({
        members: updatedMembers,
      })

      setFamilyGroup({
        ...familyGroup,
        members: updatedMembers,
      })
    } catch (error) {
      throw error
    }
  }

  const leaveFamilyGroup = async (): Promise<void> => {
    if (!user || !familyGroup) throw new Error("User not authenticated or no family group")

    try {
      // Cannot leave if you're the owner
      if (familyGroup.ownerId === user.id) {
        throw new Error("Group owner cannot leave. Transfer ownership or delete the group.")
      }

      // Update the group
      const updatedMembers = familyGroup.members.filter((id) => id !== user.id)

      await firebase.firestore().collection("familyGroups").doc(familyGroup.id).update({
        members: updatedMembers,
      })

      setFamilyGroup(null)
    } catch (error) {
      throw error
    }
  }

  const getFamilyMemberById = (id: string): FamilyMember | undefined => {
    return familyMembers.find((member) => member.id === id)
  }

  const sortFamilyMembers = (sortBy: "name" | "relationship" | "age"): void => {
    const sortedMembers = [...familyMembers]

    if (sortBy === "name") {
      sortedMembers.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "relationship") {
      sortedMembers.sort((a, b) => a.relationship.localeCompare(b.relationship))
    } else if (sortBy === "age") {
      sortedMembers.sort((a, b) => {
        const dateA = new Date(a.dateOfBirth)
        const dateB = new Date(b.dateOfBirth)
        return dateA.getTime() - dateB.getTime()
      })
    }

    setFamilyMembers(sortedMembers)
  }

  const value = {
    familyMembers,
    familyGroup,
    isLoading,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    createFamilyGroup,
    inviteMemberToGroup,
    removeMemberFromGroup,
    leaveFamilyGroup,
    getFamilyMemberById,
    sortFamilyMembers,
  }

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export const useFamily = () => {
  const context = useContext(FamilyContext)
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider")
  }
  return context
}
