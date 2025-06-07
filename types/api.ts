// API-specific type definitions

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface QuoteRequest {
  type: PolicyType
  personalInfo: {
    age: number
    gender: "male" | "female" | "other"
    location: string
  }
  coverage: {
    amount: number
    duration: number
  }
  additionalInfo?: Record<string, any>
}

export interface ClaimRequest {
  policyId: string
  incidentType: string
  incidentDate: string
  description: string
  estimatedAmount: number
  documents: string[] // Document IDs
}

// Import User, PolicyType from main types
import type { User, PolicyType } from "./index"
