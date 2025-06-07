/**
 * Google Doc upload result type
 */
export interface GoogleDocUploadResult {
  fileId: string | null
  fileName: string | null
  webViewLink: string | null
  success: boolean
  error?: string
}
