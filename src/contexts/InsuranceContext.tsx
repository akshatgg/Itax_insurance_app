"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import firebase from "firebase/app"
import "firebase/firestore"
import { useAuth } from "./AuthContext"

type InsuranceType = "auto" | "health" | "life" | "home"

type PersonalInfo = {
  fullName: string
  email: string
  phone: string
  dateOfBirth: Date
  gender: string
  address: string
  city: string
  state: string
  pincode: string
}

type VehicleInfo = {
  vehicleType: string
  make: string
  model: string
  year: number
  registrationNumber: string
  engineNumber: string
  chassisNumber: string
}

type CoverageInfo = {
  coverageType: string
  coverageAmount: number
  addOns: string[]
  startDate: Date
}

type InsuranceApplication = {
  id?: string
  userId: string
  insuranceType: InsuranceType
  personalInfo: PersonalInfo
  vehicleInfo?: VehicleInfo
  coverageInfo: CoverageInfo
  status: "pending" | "approved" | "rejected"
  premium?: number
  policyNumber?: string
  submittedAt: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
}

type InsurancePolicy = {
  id: string
  userId: string
  insuranceType: InsuranceType
  policyNumber: string
  personalInfo: PersonalInfo
  vehicleInfo?: VehicleInfo
  coverageInfo: CoverageInfo
  premium: number
  startDate: string
  endDate: string
  status: "active" | "expired" | "cancelled"
  documents: {
    policyDocument?: string
    receiptDocument?: string
  }
  payments: {
    id: string
    amount: number
    date: string
    status: "paid" | "pending" | "failed"
    method: string
    reference?: string
  }[]
  claims: {
    id: string
    claimNumber: string
    date: string
    amount: number
    reason: string
    status: "pending" | "approved" | "rejected"
    documents: string[]
  }[]
}

type InsuranceContextType = {
  applications: InsuranceApplication[]
  policies: InsurancePolicy[]
  isLoading: boolean
  isSubmitting: boolean
  submitInsuranceApplication: (data: Omit<InsuranceApplication, "id">) => Promise<string>
  getApplications: () => Promise<InsuranceApplication[]>
  getPolicies: () => Promise<InsurancePolicy[]>
  cancelPolicy: (policyId: string) => Promise<void>
  makePayment: (policyId: string, amount: number, method: string) => Promise<void>
  fileClaim: (policyId: string, claimData: { reason: string; amount: number; documents: string[] }) => Promise<void>
}

const InsuranceContext = createContext<InsuranceContextType | undefined>(undefined)

export const InsuranceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [applications, setApplications] = useState<InsuranceApplication[]>([])
  const [policies, setPolicies] = useState<InsurancePolicy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitInsuranceApplication = async (data: Omit<InsuranceApplication, "id">): Promise<string> => {
    if (!user) throw new Error("User not authenticated")

    setIsSubmitting(true)
    try {
      // Calculate premium (simplified for demo)
      let premium = 0
      if (data.coverageInfo.coverageType === "comprehensive") {
        premium = data.coverageInfo.coverageAmount * 0.02
      } else {
        premium = data.coverageInfo.coverageAmount * 0.01
      }

      // Add add-ons premium
      data.coverageInfo.addOns.forEach((addon) => {
        switch (addon) {
          case "zeroDep":
            premium += 1500
            break
          case "roadside":
            premium += 800
            break
          case "engine":
            premium += 1200
            break
          case "ncb":
            premium += 1000
            break
        }
      })

      // Round premium
      premium = Math.round(premium)

      // Save application to Firestore
      const applicationData = {
        ...data,
        premium,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }

      const docRef = await firebase.firestore().collection("insuranceApplications").add(applicationData)

      // Update local state
      const newApplication: InsuranceApplication = {
        id: docRef.id,
        ...data,
        premium,
      }
      setApplications([...applications, newApplication])

      return docRef.id
    } catch (error) {
      console.error("Error submitting insurance application:", error)
      throw new Error("Failed to submit insurance application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getApplications = async (): Promise<InsuranceApplication[]> => {
    if (!user) return []

    setIsLoading(true)
    try {
      const snapshot = await firebase
        .firestore()
        .collection("insuranceApplications")
        .where("userId", "==", user.id)
        .orderBy("submittedAt", "desc")
        .get()

      const fetchedApplications: InsuranceApplication[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        fetchedApplications.push({
          id: doc.id,
          userId: data.userId,
          insuranceType: data.insuranceType,
          personalInfo: data.personalInfo,
          vehicleInfo: data.vehicleInfo,
          coverageInfo: data.coverageInfo,
          status: data.status,
          premium: data.premium,
          policyNumber: data.policyNumber,
          submittedAt: data.submittedAt.toDate().toISOString(),
          approvedAt: data.approvedAt ? data.approvedAt.toDate().toISOString() : undefined,
          rejectedAt: data.rejectedAt ? data.rejectedAt.toDate().toISOString() : undefined,
          rejectionReason: data.rejectionReason,
        })
      })

      setApplications(fetchedApplications)
      return fetchedApplications
    } catch (error) {
      console.error("Error fetching insurance applications:", error)
      throw new Error("Failed to fetch insurance applications. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPolicies = async (): Promise<InsurancePolicy[]> => {
    if (!user) return []

    setIsLoading(true)
    try {
      const snapshot = await firebase
        .firestore()
        .collection("insurancePolicies")
        .where("userId", "==", user.id)
        .orderBy("startDate", "desc")
        .get()

      const fetchedPolicies: InsurancePolicy[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        fetchedPolicies.push({
          id: doc.id,
          userId: data.userId,
          insuranceType: data.insuranceType,
          policyNumber: data.policyNumber,
          personalInfo: data.personalInfo,
          vehicleInfo: data.vehicleInfo,
          coverageInfo: data.coverageInfo,
          premium: data.premium,
          startDate: data.startDate.toDate().toISOString(),
          endDate: data.endDate.toDate().toISOString(),
          status: data.status,
          documents: data.documents,
          payments: data.payments,
          claims: data.claims,
        })
      })

      setPolicies(fetchedPolicies)
      return fetchedPolicies
    } catch (error) {
      console.error("Error fetching insurance policies:", error)
      throw new Error("Failed to fetch insurance policies. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const cancelPolicy = async (policyId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await firebase.firestore().collection("insurancePolicies").doc(policyId).update({
        status: "cancelled",
        cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

      // Update local state
      setPolicies(policies.map((policy) => (policy.id === policyId ? { ...policy, status: "cancelled" } : policy)))
    } catch (error) {
      console.error("Error cancelling policy:", error)
      throw new Error("Failed to cancel policy. Please try again.")
    }
  }

  const makePayment = async (policyId: string, amount: number, method: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const paymentData = {
        id: paymentId,
        amount,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        status: "paid",
        method,
        reference: `REF-${paymentId}`,
      }

      const policyRef = firebase.firestore().collection("insurancePolicies").doc(policyId)

      // Get current policy data
      const policyDoc = await policyRef.get()
      if (!policyDoc.exists) {
        throw new Error("Policy not found")
      }

      const policyData = policyDoc.data()
      const payments = policyData?.payments || []

      // Update policy with new payment
      await policyRef.update({
        payments: [...payments, paymentData],
      })

      // Update local state
      setPolicies(
        policies.map((policy) => {
          if (policy.id === policyId) {
            return {
              ...policy,
              payments: [
                ...policy.payments,
                {
                  id: paymentId,
                  amount,
                  date: new Date().toISOString(),
                  status: "paid",
                  method,
                  reference: `REF-${paymentId}`,
                },
              ],
            }
          }
          return policy
        }),
      )
    } catch (error) {
      console.error("Error making payment:", error)
      throw new Error("Failed to process payment. Please try again.")
    }
  }

  const fileClaim = async (
    policyId: string,
    claimData: { reason: string; amount: number; documents: string[] },
  ): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const claimId = `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const newClaim = {
        id: claimId,
        claimNumber: claimId,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        amount: claimData.amount,
        reason: claimData.reason,
        status: "pending",
        documents: claimData.documents,
      }

      const policyRef = firebase.firestore().collection("insurancePolicies").doc(policyId)

      // Get current policy data
      const policyDoc = await policyRef.get()
      if (!policyDoc.exists) {
        throw new Error("Policy not found")
      }

      const policyData = policyDoc.data()
      const claims = policyData?.claims || []

      // Update policy with new claim
      await policyRef.update({
        claims: [...claims, newClaim],
      })

      // Update local state
      setPolicies(
        policies.map((policy) => {
          if (policy.id === policyId) {
            return {
              ...policy,
              claims: [
                ...policy.claims,
                {
                  id: claimId,
                  claimNumber: claimId,
                  date: new Date().toISOString(),
                  amount: claimData.amount,
                  reason: claimData.reason,
                  status: "pending",
                  documents: claimData.documents,
                },
              ],
            }
          }
          return policy
        }),
      )
    } catch (error) {
      console.error("Error filing claim:", error)
      throw new Error("Failed to file claim. Please try again.")
    }
  }

  const value = {
    applications,
    policies,
    isLoading,
    isSubmitting,
    submitInsuranceApplication,
    getApplications,
    getPolicies,
    cancelPolicy,
    makePayment,
    fileClaim,
  }

  return <InsuranceContext.Provider value={value}>{children}</InsuranceContext.Provider>
}

export const useInsurance = () => {
  const context = useContext(InsuranceContext)
  if (context === undefined) {
    throw new Error("useInsurance must be used within an InsuranceProvider")
  }
  return context
}
