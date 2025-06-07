/**
 * Google Vision API response type
 */
export interface GoogleVisionResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string
      boundingPoly: {
        vertices: Array<{
          x: number
          y: number
        }>
      }
    }>
    fullTextAnnotation?: {
      text: string
      pages: any[]
      blocks: any[]
    }
  }>
}

/**
 * Processed OCR result type
 */
export interface OCRResult {
  fullText: string
  documentType: "pan" | "aadhaar" | "unknown"
  fields: Record<string, string>
}
