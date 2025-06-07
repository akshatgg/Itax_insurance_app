import type React from "react"
// Global type definitions for the insurance app

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  dateOfBirth?: string
  address?: Address
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Policy {
  id: string
  userId: string
  type: PolicyType
  provider: string
  policyNumber: string
  premium: number
  coverage: number
  startDate: Date
  endDate: Date
  status: PolicyStatus
  documents: Document[]
}

export type PolicyType = "health" | "auto" | "life" | "home" | "travel"

export type PolicyStatus = "active" | "expired" | "cancelled" | "pending"

export interface Claim {
  id: string
  policyId: string
  userId: string
  type: string
  amount: number
  description: string
  status: ClaimStatus
  submittedAt: Date
  updatedAt: Date
  documents: Document[]
}

export type ClaimStatus = "submitted" | "under-review" | "approved" | "rejected" | "paid"

export interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedAt: Date
}

export interface Quote {
  id: string
  type: PolicyType
  coverage: number
  premium: number
  provider: string
  features: string[]
  validUntil: Date
}

export interface Payment {
  id: string
  userId: string
  policyId?: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transactionId: string
  createdAt: Date
}

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet"

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"

// Form types
export interface QuoteFormData {
  type: PolicyType
  age: number
  coverage: number
  location: string
  additionalInfo?: Record<string, any>
}

export interface ClaimFormData {
  policyId: string
  type: string
  amount: number
  description: string
  incidentDate: Date
  documents: File[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component Props types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}
