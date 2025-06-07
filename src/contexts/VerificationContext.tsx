"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import { useAuth } from "./AuthContext"

type VerificationStatus = "pending" | "approved" | "rejected" | "incomplete"

type PanCardData = {
  panNumber: string
  fullName: string
  dateOfBirth: string
  imageUri: string | null
}

type AadhaarCardData = {
  aadhaarNumber: string
  fullName: string
  address: string
  frontImageUri: string | null
  backImageUri: string | null
}

type VerificationData = {
  userId: string
  panCard: PanCardData
  aadhaarCard: AadhaarCardData
  selfieImageUri: string | null
  biometricVerified: boolean
  submittedAt: string
  status: VerificationStatus
  rejectionReason?: string
  approvedAt?: string
}

type VerificationContextType = {
  verificationStatus: VerificationStatus | null
  isVerifying: boolean
  submitVerification: (data: VerificationData) => Promise<void>
  checkVerificationStatus: () => Promise<VerificationStatus | null>
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined)

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const uploadImage = async (uri: string, path: string): Promise<string> => {
    const response = await fetch(uri)
    const blob = await response.blob()
    const ref = firebase.storage().ref().child(path)
    await ref.put(blob)
    return await ref.getDownloadURL()
  }

  const submitVerification = async (data: VerificationData): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    setIsVerifying(true)
    try {
      // Upload images to Firebase Storage
      const uploadTasks = []
      let panCardImageUrl = null
      let aadhaarCardFrontImageUrl = null
      let aadhaarCardBackImageUrl = null
      let selfieImageUrl = null

      if (data.panCard.imageUri) {
        const path = `verifications/${user.id}/pan_card.jpg`
        uploadTasks.push(
          uploadImage(data.panCard.imageUri, path).then((url) => {
            panCardImageUrl = url
          }),
        )
      }

      if (data.aadhaarCard.frontImageUri) {
        const path = `verifications/${user.id}/aadhaar_front.jpg`
        uploadTasks.push(
          uploadImage(data.aadhaarCard.frontImageUri, path).then((url) => {
            aadhaarCardFrontImageUrl = url
          }),
        )
      }

      if (data.aadhaarCard.backImageUri) {
        const path = `verifications/${user.id}/aadhaar_back.jpg`
        uploadTasks.push(
          uploadImage(data.aadhaarCard.backImageUri, path).then((url) => {
            aadhaarCardBackImageUrl = url
          }),
        )
      }

      if (data.selfieImageUri) {
        const path = `verifications/${user.id}/selfie.jpg`
        uploadTasks.push(
          uploadImage(data.selfieImageUri, path).then((url) => {
            selfieImageUrl = url
          }),
        )
      }

      await Promise.all(uploadTasks)

      // Save verification data to Firestore
      const verificationData = {
        userId: user.id,
        panCard: {
          panNumber: data.panCard.panNumber,
          fullName: data.panCard.fullName,
          dateOfBirth: data.panCard.dateOfBirth,
          imageUrl: panCardImageUrl,
        },
        aadhaarCard: {
          aadhaarNumber: data.aadhaarCard.aadhaarNumber,
          fullName: data.aadhaarCard.fullName,
          address: data.aadhaarCard.address,
          frontImageUrl: aadhaarCardFrontImageUrl,
          backImageUrl: aadhaarCardBackImageUrl,
        },
        selfieImageUrl,
        biometricVerified: data.biometricVerified,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "pending" as VerificationStatus,
      }

      // Check if a verification document already exists
      const verificationRef = firebase.firestore().collection("verifications").doc(user.id)
      const verificationDoc = await verificationRef.get()

      if (verificationDoc.exists) {
        // Update existing verification
        await verificationRef.update(verificationData)
      } else {
        // Create new verification
        await verificationRef.set(verificationData)
      }

      // Update user document with verification status
      await firebase.firestore().collection("users").doc(user.id).update({
        verificationStatus: "pending",
        verificationSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

      setVerificationStatus("pending")
    } catch (error) {
      console.error("Error submitting verification:", error)
      throw new Error("Failed to submit verification. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const checkVerificationStatus = async (): Promise<VerificationStatus | null> => {
    if (!user) return null

    try {
      const verificationDoc = await firebase.firestore().collection("verifications").doc(user.id).get()

      if (verificationDoc.exists) {
        const status = verificationDoc.data()?.status as VerificationStatus
        setVerificationStatus(status)
        return status
      }

      setVerificationStatus(null)
      return null
    } catch (error) {
      console.error("Error checking verification status:", error)
      return null
    }
  }

  const value = {
    verificationStatus,
    isVerifying,
    submitVerification,
    checkVerificationStatus,
  }

  return <VerificationContext.Provider value={value}>{children}</VerificationContext.Provider>
}

export const useVerification = () => {
  const context = useContext(VerificationContext)
  if (context === undefined) {
    throw new Error("useVerification must be used within a VerificationProvider")
  }
  return context
}
