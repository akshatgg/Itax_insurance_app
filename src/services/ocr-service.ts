import { CameraRoll } from "@react-native-camera-roll/camera-roll"
import * as FileSystem from "expo-file-system"
import * as ImageManipulator from "expo-image-manipulator"
import type { GoogleVisionResponse, OCRResult } from "../types/ocr"

// Google Cloud Vision API key - should be stored in environment variables
const GOOGLE_CLOUD_VISION_API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY || ""

/**
 * Service for handling OCR (Optical Character Recognition) operations
 */
export class OCRService {
  /**
   * Performs OCR on an image using Google Cloud Vision API
   * @param imageUri URI of the image to process
   * @returns Processed OCR result with extracted text
   */
  static async performOCR(imageUri: string): Promise<OCRResult> {
    try {
      // Resize and compress the image for faster upload
      const processedImage = await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 800 } }], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      })

      // Convert image to base64
      const base64Image = await this.imageToBase64(processedImage.uri)

      // Call Google Cloud Vision API
      const googleVisionRes = await this.callGoogleVisionApi(base64Image)

      // Process the OCR result
      return this.processOCRResult(googleVisionRes)
    } catch (error) {
      console.error("OCR processing error:", error)
      throw new Error("Failed to process document with OCR. Please try again.")
    }
  }

  /**
   * Converts an image to base64 format
   * @param uri URI of the image
   * @returns Base64 string of the image
   */
  private static async imageToBase64(uri: string): Promise<string> {
    try {
      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })
      return base64
    } catch (error) {
      console.error("Error converting image to base64:", error)
      throw new Error("Failed to process image. Please try again.")
    }
  }

  /**
   * Calls the Google Cloud Vision API for text detection
   * @param base64Image Base64 encoded image
   * @returns Google Vision API response
   */
  private static async callGoogleVisionApi(base64Image: string): Promise<GoogleVisionResponse> {
    try {
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Google Vision API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Google Vision API error:", error)
      throw new Error("Failed to connect to OCR service. Please check your internet connection and try again.")
    }
  }

  /**
   * Processes the Google Vision API response to extract relevant information
   * @param googleVisionRes Google Vision API response
   * @returns Processed OCR result
   */
  private static processOCRResult(googleVisionRes: GoogleVisionResponse): OCRResult {
    try {
      // Extract the full text from the response
      const fullText = googleVisionRes.responses[0]?.fullTextAnnotation?.text || ""

      // Initialize result object
      const result: OCRResult = {
        fullText,
        documentType: "unknown",
        fields: {},
      }

      // Determine document type and extract relevant fields
      if (this.isPanCard(fullText)) {
        result.documentType = "pan"
        result.fields = this.extractPanCardFields(fullText)
      } else if (this.isAadhaarCard(fullText)) {
        result.documentType = "aadhaar"
        result.fields = this.extractAadhaarCardFields(fullText)
      }

      return result
    } catch (error) {
      console.error("Error processing OCR result:", error)
      return {
        fullText: "",
        documentType: "unknown",
        fields: {},
      }
    }
  }

  /**
   * Checks if the text is from a PAN card
   * @param text OCR extracted text
   * @returns Boolean indicating if it's a PAN card
   */
  private static isPanCard(text: string): boolean {
    const panCardKeywords = ["INCOME TAX DEPARTMENT", "GOVT. OF INDIA", "Permanent Account Number", "PAN"]

    return panCardKeywords.some((keyword) => text.toUpperCase().includes(keyword.toUpperCase()))
  }

  /**
   * Checks if the text is from an Aadhaar card
   * @param text OCR extracted text
   * @returns Boolean indicating if it's an Aadhaar card
   */
  private static isAadhaarCard(text: string): boolean {
    const aadhaarCardKeywords = [
      "UNIQUE IDENTIFICATION AUTHORITY OF INDIA",
      "UIDAI",
      "Aadhaar",
      "आधार",
      "Government of India",
    ]

    return aadhaarCardKeywords.some((keyword) => text.toUpperCase().includes(keyword.toUpperCase()))
  }

  /**
   * Extracts relevant fields from PAN card text
   * @param text OCR extracted text
   * @returns Extracted PAN card fields
   */
  private static extractPanCardFields(text: string): Record<string, string> {
    const fields: Record<string, string> = {}

    // Extract PAN number using regex (format: AAAAA0000A)
    const panNumberRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/g
    const panNumberMatch = text.match(panNumberRegex)
    if (panNumberMatch && panNumberMatch.length > 0) {
      fields.panNumber = panNumberMatch[0]
    }

    // Extract name (usually after "Name" keyword)
    const nameRegex = /Name\s*[:\s]\s*([A-Z\s]+)/i
    const nameMatch = text.match(nameRegex)
    if (nameMatch && nameMatch.length > 1) {
      fields.fullName = nameMatch[1].trim()
    }

    // Extract date of birth (format: DD/MM/YYYY)
    const dobRegex = /(\d{2}\/\d{2}\/\d{4})/
    const dobMatch = text.match(dobRegex)
    if (dobMatch && dobMatch.length > 0) {
      fields.dateOfBirth = dobMatch[0]
    }

    return fields
  }

  /**
   * Extracts relevant fields from Aadhaar card text
   * @param text OCR extracted text
   * @returns Extracted Aadhaar card fields
   */
  private static extractAadhaarCardFields(text: string): Record<string, string> {
    const fields: Record<string, string> = {}

    // Extract Aadhaar number (format: 0000 0000 0000)
    const aadhaarNumberRegex = /\d{4}\s\d{4}\s\d{4}/g
    const aadhaarNumberMatch = text.match(aadhaarNumberRegex)
    if (aadhaarNumberMatch && aadhaarNumberMatch.length > 0) {
      fields.aadhaarNumber = aadhaarNumberMatch[0]
    }

    // Extract name (usually after "Name:" or similar)
    const nameLines = text.split("\n")
    for (let i = 0; i < nameLines.length; i++) {
      if (nameLines[i].includes("DOB:") && i > 0) {
        // Name is usually above DOB line
        fields.fullName = nameLines[i - 1].trim()
        break
      }
    }

    // Extract address (usually multiple lines after name and DOB)
    let addressStarted = false
    const addressLines: string[] = []

    for (const line of nameLines) {
      if (line.includes("Address:") || line.includes("पता:")) {
        addressStarted = true
        continue
      }

      if (addressStarted && line.trim() && !line.includes("UID:") && !line.includes("आधार:")) {
        addressLines.push(line.trim())
      } else if (addressStarted && (line.includes("UID:") || line.includes("आधार:"))) {
        break
      }
    }

    if (addressLines.length > 0) {
      fields.address = addressLines.join(", ")
    }

    return fields
  }

  /**
   * Saves an image to the device's gallery
   * @param uri URI of the image to save
   * @returns Path to the saved image
   */
  static async saveImageToGallery(uri: string): Promise<string> {
    try {
      // Save the image to the gallery
      const asset = await CameraRoll.save(uri, {
        type: "photo",
      })

      return asset
    } catch (error) {
      console.error("Error saving image to gallery:", error)
      throw new Error("Failed to save image to gallery. Please check app permissions.")
    }
  }
}
