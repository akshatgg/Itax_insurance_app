import * as FileSystem from "expo-file-system"
import * as WebBrowser from "expo-web-browser"
import { Platform } from "react-native"
import type { GoogleDocUploadResult } from "../types/google-docs"
import { useAuthRequest } from "expo-auth-session/providers/google"

// Register for redirect URI
WebBrowser.maybeCompleteAuthSession()

// Google API configuration
const GOOGLE_API_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
]

const GOOGLE_API_CONFIG = {
  expoClientId: process.env.EXPO_GOOGLE_CLIENT_ID,
  iosClientId: process.env.IOS_GOOGLE_CLIENT_ID,
  androidClientId: process.env.ANDROID_GOOGLE_CLIENT_ID,
  webClientId: process.env.WEB_GOOGLE_CLIENT_ID,
}

/**
 * Service for handling Google Docs/Drive operations
 */
export class GoogleDocsService {
  private static accessToken: string | null = null
  private static refreshToken: string | null = null

  /**
   * Initializes Google authentication
   * @returns Authentication request, response, and prompt async function
   */
  static initGoogleAuth() {
    const [request, response, promptAsync] = useAuthRequest({
      clientId: Platform.select({
        ios: GOOGLE_API_CONFIG.iosClientId,
        android: GOOGLE_API_CONFIG.androidClientId,
        default: GOOGLE_API_CONFIG.webClientId,
      }),
      scopes: GOOGLE_API_SCOPES,
    })

    return { request, response, promptAsync }
  }

  /**
   * Sets the access token for Google API calls
   * @param token Access token from Google authentication
   */
  static setAccessToken(token: string) {
    this.accessToken = token
  }

  /**
   * Sets the refresh token for Google API calls
   * @param token Refresh token from Google authentication
   */
  static setRefreshToken(token: string) {
    this.refreshToken = token
  }

  /**
   * Uploads a file to Google Drive
   * @param fileUri URI of the file to upload
   * @param fileName Name for the file in Google Drive
   * @param mimeType MIME type of the file
   * @returns Upload result with file ID and web view URL
   */
  static async uploadFileToDrive(fileUri: string, fileName: string, mimeType: string): Promise<GoogleDocUploadResult> {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Google. Please sign in first.")
      }

      // First, create a metadata request to get an upload URL
      const metadataResponse = await fetch("https://www.googleapis.com/drive/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: mimeType,
        }),
      })

      if (!metadataResponse.ok) {
        throw new Error(`Failed to initialize upload: ${metadataResponse.statusText}`)
      }

      const metadataResult = await metadataResponse.json()
      const fileId = metadataResult.id

      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Upload the file content
      const uploadResponse = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": mimeType,
          },
          body: fileContent,
        },
      )

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
      }

      // Get the file details including webViewLink
      const fileDetailsResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      )

      if (!fileDetailsResponse.ok) {
        throw new Error(`Failed to get file details: ${fileDetailsResponse.statusText}`)
      }

      const fileDetails = await fileDetailsResponse.json()

      return {
        fileId: fileDetails.id,
        fileName: fileDetails.name,
        webViewLink: fileDetails.webViewLink,
        success: true,
      }
    } catch (error) {
      console.error("Google Drive upload error:", error)
      return {
        fileId: null,
        fileName: null,
        webViewLink: null,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Creates a new Google Doc
   * @param title Title of the document
   * @param content Initial content (HTML format)
   * @returns Upload result with document ID and web view URL
   */
  static async createGoogleDoc(title: string, content: string): Promise<GoogleDocUploadResult> {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Google. Please sign in first.")
      }

      // Create a new Google Doc
      const createResponse = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      })

      if (!createResponse.ok) {
        throw new Error(`Failed to create document: ${createResponse.statusText}`)
      }

      const createResult = await createResponse.json()
      const documentId = createResult.documentId

      // Insert content into the document
      if (content) {
        const updateResponse = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                insertText: {
                  location: {
                    index: 1,
                  },
                  text: content,
                },
              },
            ],
          }),
        })

        if (!updateResponse.ok) {
          throw new Error(`Failed to update document content: ${updateResponse.statusText}`)
        }
      }

      return {
        fileId: documentId,
        fileName: title,
        webViewLink: `https://docs.google.com/document/d/${documentId}/edit`,
        success: true,
      }
    } catch (error) {
      console.error("Google Docs creation error:", error)
      return {
        fileId: null,
        fileName: null,
        webViewLink: null,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Lists files from Google Drive
   * @param folderId Optional folder ID to list files from
   * @returns Array of file metadata
   */
  static async listDriveFiles(folderId?: string) {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Google. Please sign in first.")
      }

      let url = "https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,webViewLink)"

      if (folderId) {
        url += `&q='${folderId}' in parents`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to list files: ${response.statusText}`)
      }

      const result = await response.json()
      return result.files
    } catch (error) {
      console.error("Google Drive list files error:", error)
      throw error
    }
  }

  /**
   * Refreshes the access token using the refresh token
   * @returns New access token
   */
  static async refreshAccessToken(): Promise<string> {
    try {
      if (!this.refreshToken) {
        throw new Error("No refresh token available")
      }

      const tokenEndpoint = "https://oauth2.googleapis.com/token"
      const params = new URLSearchParams()
      params.append("client_id", GOOGLE_API_CONFIG.webClientId || "")
      params.append("refresh_token", this.refreshToken)
      params.append("grant_type", "refresh_token")

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        throw new Error(`Failed to refresh token: ${response.statusText}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      return data.access_token
    } catch (error) {
      console.error("Token refresh error:", error)
      throw error
    }
  }
}
