/**
 * eKYC verification result type
 */
export interface EKYCVerificationResult {
  success: boolean
  txnId?: string
  message: string
  data: EKYCResponse | null
}

/**
 * UIDAI eKYC response type
 */
export interface EKYCResponse {
  status: string
  statusCode: string
  txnId: string
  responseCode: string
  responseMessage: string
  ekycXml?: string // Base64 encoded and encrypted eKYC XML
  eKycUser?: {
    aadhaarNumber: string
    name: string
    dob: string
    gender: string
    address: {
      careOf: string
      house: string
      street: string
      landmark: string
      locality: string
      vtc: string
      district: string
      state: string
      pincode: string
    }
    photo: string // Base64 encoded photo
    email?: string
    mobile?: string
  }
  [key: string]: any // For additional fields
}
