import { Platform } from "react-native"
import * as Crypto from "expo-crypto"
import type { EKYCResponse, EKYCVerificationResult } from "../types/ekyc"

declare const __DEV__: boolean

// UIDAI API endpoints
const UIDAI_SANDBOX_URL = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2"
const UIDAI_PRODUCTION_URL = "https://authapi.uidai.gov.in/api/v2"

// Use sandbox for development, production for release
const UIDAI_BASE_URL = __DEV__ ? UIDAI_SANDBOX_URL : UIDAI_PRODUCTION_URL

// API keys and credentials - should be stored in environment variables
const UIDAI_API_KEY = process.env.UIDAI_API_KEY || ""
const UIDAI_AUTH_LICENSE_KEY = process.env.UIDAI_AUTH_LICENSE_KEY || ""
const UIDAI_AUA_CODE = process.env.UIDAI_AUA_CODE || ""
const UIDAI_SUB_AUA_CODE = process.env.UIDAI_SUB_AUA_CODE || ""

/**
 * Service for handling eKYC operations with UIDAI
 */
export class EKYCService {
  /**
   * Performs Aadhaar eKYC verification
   * @param aadhaarNumber Aadhaar number (12 digits)
   * @param captchaCode Captcha code from UIDAI
   * @param captchaTxnId Captcha transaction ID from UIDAI
   * @returns eKYC verification result
   */
  static async verifyAadhaarOTP(
    aadhaarNumber: string,
    captchaCode: string,
    captchaTxnId: string,
  ): Promise<EKYCVerificationResult> {
    try {
      // Remove spaces from Aadhaar number
      const cleanAadhaar = aadhaarNumber.replace(/\s/g, "")

      if (cleanAadhaar.length !== 12 || !/^\d{12}$/.test(cleanAadhaar)) {
        throw new Error("Invalid Aadhaar number format. Must be 12 digits.")
      }

      // Generate transaction ID
      const txnId = await this.generateTransactionId()

      // Prepare request body
      const requestBody = {
        uid: cleanAadhaar,
        txnId: txnId,
        captchaValue: captchaCode,
        captchaTxnId: captchaTxnId,
        authType: "OTP",
      }

      // Call UIDAI API to generate OTP
      const response = await fetch(`${UIDAI_BASE_URL}/generate-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": UIDAI_API_KEY,
          "x-auth-license-key": UIDAI_AUTH_LICENSE_KEY,
          "x-aua-code": UIDAI_AUA_CODE,
          "x-sub-aua-code": UIDAI_SUB_AUA_CODE,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`UIDAI API error: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        txnId: txnId,
        message: "OTP sent successfully to registered mobile number",
        data: data,
      }
    } catch (error) {
      console.error("eKYC OTP generation error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        data: null,
      }
    }
  }

  /**
   * Verifies OTP for Aadhaar eKYC
   * @param txnId Transaction ID from OTP generation
   * @param otp OTP received on registered mobile
   * @returns eKYC verification result with user data
   */
  static async verifyOTP(txnId: string, otp: string): Promise<EKYCVerificationResult> {
    try {
      if (!txnId || !otp) {
        throw new Error("Transaction ID and OTP are required")
      }

      // Hash the OTP for security
      const hashedOTP = await this.hashOTP(otp)

      // Prepare request body
      const requestBody = {
        txnId: txnId,
        otp: hashedOTP,
        authType: "OTP",
        consent: "Y", // User consent for eKYC
      }

      // Call UIDAI API to verify OTP
      const response = await fetch(`${UIDAI_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": UIDAI_API_KEY,
          "x-auth-license-key": UIDAI_AUTH_LICENSE_KEY,
          "x-aua-code": UIDAI_AUA_CODE,
          "x-sub-aua-code": UIDAI_SUB_AUA_CODE,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`UIDAI API error: ${errorData.message || response.statusText}`)
      }

      const data: EKYCResponse = await response.json()

      // Process and decrypt eKYC data if needed
      const processedData = this.processEKYCData(data)

      return {
        success: true,
        txnId: txnId,
        message: "eKYC verification successful",
        data: processedData,
      }
    } catch (error) {
      console.error("eKYC OTP verification error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
        data: null,
      }
    }
  }

  /**
   * Generates a UIDAI captcha for OTP generation
   * @returns Captcha data with image and transaction ID
   */
  static async generateCaptcha(): Promise<{
    captchaBase64: string
    captchaTxnId: string
  }> {
    try {
      // Generate transaction ID
      const txnId = await this.generateTransactionId()

      // Prepare request body
      const requestBody = {
        langCode: "en",
        txnId: txnId,
      }

      // Call UIDAI API to generate captcha
      const response = await fetch(`${UIDAI_BASE_URL}/generate-captcha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": UIDAI_API_KEY,
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`UIDAI API error: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()

      return {
        captchaBase64: data.captchaBase64,
        captchaTxnId: data.captchaTxnId,
      }
    } catch (error) {
      console.error("UIDAI captcha generation error:", error)
      throw error
    }
  }

  /**
   * Generates a unique transaction ID for UIDAI API calls
   * @returns Transaction ID
   */
  private static async generateTransactionId(): Promise<string> {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 1000000)
    const deviceId = await this.getDeviceId()

    return `${deviceId}-${timestamp}-${random}`
  }

  /**
   * Gets a unique device ID for transaction ID generation
   * @returns Device ID
   */
  private static async getDeviceId(): Promise<string> {
    try {
      // Generate a random device ID if not available
      const randomBytes = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `${Platform.OS}-${new Date().getTime()}-${Math.random()}`,
      )

      return randomBytes.substring(0, 16)
    } catch (error) {
      console.error("Error generating device ID:", error)
      return `${Platform.OS}-${new Date().getTime()}`
    }
  }

  /**
   * Hashes the OTP for secure transmission
   * @param otp OTP to hash
   * @returns Hashed OTP
   */
  private static async hashOTP(otp: string): Promise<string> {
    try {
      const hashedOTP = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, otp)

      return hashedOTP
    } catch (error) {
      console.error("Error hashing OTP:", error)
      throw new Error("Failed to secure OTP. Please try again.")
    }
  }

  /**
   * Processes and decrypts eKYC data if needed
   * @param data Raw eKYC response data
   * @returns Processed eKYC data
   */
  private static processEKYCData(data: EKYCResponse): EKYCResponse {
    // In a real implementation, this would decrypt and process the eKYC XML data
    // For this example, we'll just return the data as is
    return data
  }
}
