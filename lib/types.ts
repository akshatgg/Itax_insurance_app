// Utility types and type guards

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Type guards
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}

// Environment variables with proper typing
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test"
      NEXT_PUBLIC_API_URL: string
      DATABASE_URL: string
      JWT_SECRET: string
      RAZORPAY_KEY_ID: string
      RAZORPAY_KEY_SECRET: string
      TWILIO_ACCOUNT_SID: string
      TWILIO_AUTH_TOKEN: string
      TWILIO_PHONE_NUMBER: string
    }
  }
}
