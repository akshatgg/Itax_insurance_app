import type firebase from "firebase/app"
import "firebase/firestore"

/**
 * User profile data structure
 */
export interface User {
  email: string
  displayName: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  address: Address
  panVerified: boolean
  panVerifiedAt?: firebase.firestore.Timestamp
  aadhaarVerified: boolean
  aadhaarVerifiedAt?: firebase.firestore.Timestamp
  isEkycVerified: boolean
  ekycVerifiedAt?: firebase.firestore.Timestamp
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  profilePhotoUrl?: string
}

/**
 * Address data structure
 */
export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

/**
 * Insurance application data structure
 */
export interface InsuranceApplication {
  userId: string
  insuranceType: "auto" | "health" | "life" | "home"
  personalInfo: {
    name: string
    email: string
    phone: string
    dateOfBirth: string
    address: Address
  }
  vehicleInfo?: {
    make: string
    model: string
    year: number
    registrationNumber: string
    chassisNumber: string
    engineNumber: string
  }
  healthInfo?: {
    height: number
    weight: number
    bloodGroup: string
    existingConditions: string[]
    smoker: boolean
    alcoholConsumption: "none" | "occasional" | "regular"
  }
  lifeInfo?: {
    occupation: string
    annualIncome: number
    nominees: Array<{
      name: string
      relationship: string
      dateOfBirth: string
      share: number
    }>
  }
  homeInfo?: {
    propertyType: "apartment" | "independent" | "villa"
    constructionYear: number
    builtUpArea: number
    address: Address
    securitySystems: boolean
  }
  coverageInfo: {
    coverageType: string
    addOns: string[]
    startDate: Date
    idv?: number
    sumInsured?: number
  }
  premium: {
    basePremium: number
    tax: number
    discounts: number
    totalPremium: number
  }
  documents: Record<string, string>
  status: "draft" | "pending" | "approved" | "rejected"
  policyNumber?: string
  rejectionReason?: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
  approvedAt?: firebase.firestore.Timestamp
}

/**
 * Insurance policy data structure
 */
export interface InsurancePolicy {
  userId: string
  applicationId: string
  policyNumber: string
  insuranceType: "auto" | "health" | "life" | "home"
  personalInfo: any
  vehicleInfo?: any
  healthInfo?: any
  lifeInfo?: any
  homeInfo?: any
  coverageInfo: any
  premium: {
    basePremium: number
    tax: number
    discounts: number
    totalPremium: number
  }
  startDate: Date
  endDate: Date
  status: "active" | "expired" | "cancelled" | "lapsed"
  documents: {
    policyDocument: string | null
    receiptDocument: string | null
  }
  payments: Array<{
    id: string
    amount: number
    date: firebase.firestore.Timestamp
    method: string
    status: string
    transactionId?: string
  }>
  claims: Array<{
    id: string
    claimNumber: string
    date: firebase.firestore.Timestamp
    amount: number
    reason: string
    status: string
    documents: Record<string, string>
  }>
  createdAt: firebase.firestore.Timestamp
}

/**
 * Claim data structure
 */
export interface Claim {
  userId: string
  policyId: string
  policyNumber: string
  claimNumber?: string
  insuranceType: "auto" | "health" | "life" | "home"
  incidentDate: Date
  reportDate: firebase.firestore.Timestamp
  reason: string
  description: string
  amount: number
  documents: Record<string, string>
  status: "draft" | "pending" | "processing" | "approved" | "rejected" | "paid"
  approvalDetails?: {
    approvedAmount: number
    approvedDate: firebase.firestore.Timestamp
    approvedBy: string
    notes: string
  }
  rejectionReason?: string
  submittedAt?: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

/**
 * Document scan data structure
 */
export interface DocumentScan {
  userId: string
  documentType: "pan" | "aadhaar" | "driving_license" | "vehicle_rc" | "passport" | "voter_id" | "other"
  fields: Record<string, any>
  fullText: string
  imageUrl: string | null
  createdAt: firebase.firestore.Timestamp
  status: "processing" | "processed" | "failed"
  errorMessage?: string
}

/**
 * eKYC verification data structure
 */
export interface EkycVerification {
  userId: string
  aadhaarNumber: string
  name: string
  dob: string
  gender: string
  address: string
  verifiedAt: firebase.firestore.Timestamp
  status: "pending" | "verified" | "failed"
  errorMessage?: string
}

/**
 * Family member data structure
 */
export interface FamilyMember {
  userId: string
  name: string
  relationship: "spouse" | "child" | "parent" | "sibling" | "other"
  dateOfBirth: string
  gender: "male" | "female" | "other"
  aadhaarNumber?: string
  isNominee: boolean
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

/**
 * Notification data structure
 */
export interface Notification {
  userId: string
  title: string
  message: string
  type:
    | "welcome"
    | "policy_approval"
    | "policy_expiry"
    | "claim_submission"
    | "claim_update"
    | "payment_reminder"
    | "other"
  read: boolean
  createdAt: firebase.firestore.Timestamp
  readAt?: firebase.firestore.Timestamp
}

/**
 * Payment data structure
 */
export interface Payment {
  userId: string
  policyId: string
  policyNumber: string
  amount: number
  tax: number
  totalAmount: number
  paymentDate: firebase.firestore.Timestamp
  dueDate: firebase.firestore.Timestamp
  paymentMethod: "credit_card" | "debit_card" | "net_banking" | "upi" | "wallet" | "other"
  transactionId?: string
  status: "pending" | "completed" | "failed" | "refunded"
  receiptUrl?: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}
