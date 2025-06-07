"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Linking } from "react-native"
import { Text, Button, Card, Divider, FAB, useTheme, Searchbar } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import * as DocumentPicker from "expo-document-picker"
import { useNavigation } from "@react-navigation/native"
import { GoogleDocsService } from "../../services/google-docs-service"
import { useAuth } from "../../contexts/AuthContext"

interface GoogleDocument {
  id: string
  name: string
  mimeType: string
  webViewLink: string
  iconName: string
}

const GoogleDocsScreen: React.FC = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [documents, setDocuments] = useState<GoogleDocument[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState<GoogleDocument[]>([])

  const [request, response, promptAsync] = GoogleDocsService.initGoogleAuth()

  useEffect(() => {
    // Handle authentication response
    if (response?.type === "success") {
      const { authentication } = response
      if (authentication) {
        GoogleDocsService.setAccessToken(authentication.accessToken)
        if (authentication.refreshToken) {
          GoogleDocsService.setRefreshToken(authentication.refreshToken)
        }
        setIsAuthenticated(true)
        fetchDocuments()
      }
    }
  }, [response])

  useEffect(() => {
    // Filter documents based on search query
    if (searchQuery) {
      const filtered = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredDocuments(filtered)
    } else {
      setFilteredDocuments(documents)
    }
  }, [searchQuery, documents])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const files = await GoogleDocsService.listDriveFiles()

      const formattedDocs = files.map((file: any) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        webViewLink: file.webViewLink,
        iconName: getIconForMimeType(file.mimeType),
      }))

      setDocuments(formattedDocs)
    } catch (error) {
      console.error("Error fetching documents:", error)
      Alert.alert("Error", "Failed to fetch documents. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getIconForMimeType = (mimeType: string): string => {
    if (mimeType === "application/vnd.google-apps.document") {
      return "document-text-outline"
    } else if (mimeType === "application/vnd.google-apps.spreadsheet") {
      return "grid-outline"
    } else if (mimeType === "application/vnd.google-apps.presentation") {
      return "easel-outline"
    } else if (mimeType === "application/pdf") {
      return "document-outline"
    } else if (mimeType.startsWith("image/")) {
      return "image-outline"
    } else {
      return "file-tray-outline"
    }
  }

  const handleSignIn = async () => {
    try {
      await promptAsync()
    } catch (error) {
      console.error("Google sign-in error:", error)
      Alert.alert("Authentication Error", "Failed to sign in with Google. Please try again.")
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setDocuments([])
    setFilteredDocuments([])
  }

  const handleRefresh = () => {
    fetchDocuments()
  }

  const handleUploadDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        return
      }

      const asset = result.assets?.[0]
      if (!asset) {
        return
      }

      setIsUploading(true)

      const fileName = asset.name || `Document_${Date.now()}`
      const mimeType = asset.mimeType || "application/octet-stream"

      const uploadResult = await GoogleDocsService.uploadFileToDrive(asset.uri, fileName, mimeType)

      if (uploadResult.success) {
        Alert.alert("Success", "Document uploaded successfully")
        fetchDocuments()
      } else {
        Alert.alert("Upload Failed", uploadResult.error || "Failed to upload document")
      }
    } catch (error) {
      console.error("Document upload error:", error)
      Alert.alert("Upload Error", "Failed to upload document. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateDocument = async () => {
    Alert.prompt(
      "Create New Document",
      "Enter a name for your new document",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create",
          onPress: async (title) => {
            if (!title) return

            setIsUploading(true)
            try {
              const result = await GoogleDocsService.createGoogleDoc(title, "")

              if (result.success) {
                Alert.alert("Success", "Document created successfully")
                fetchDocuments()

                // Open the document in browser
                if (result.webViewLink) {
                  Linking.openURL(result.webViewLink)
                }
              } else {
                Alert.alert("Creation Failed", result.error || "Failed to create document")
              }
            } catch (error) {
              console.error("Document creation error:", error)
              Alert.alert("Creation Error", "Failed to create document. Please try again.")
            } finally {
              setIsUploading(false)
            }
          },
        },
      ],
      "plain-text",
    )
  }

  const handleOpenDocument = (document: GoogleDocument) => {
    if (document.webViewLink) {
      Linking.openURL(document.webViewLink)
    } else {
      Alert.alert("Error", "Cannot open this document. No web view link available.")
    }
  }

  const renderDocumentItem = ({ item }: { item: GoogleDocument }) => (
    <Card style={styles.documentCard} onPress={() => handleOpenDocument(item)}>
      <Card.Content style={styles.documentCardContent}>
        <View style={styles.documentIconContainer}>
          <Ionicons name={item.iconName} size={32} color={theme.colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
            {item.name}
          </Text>
          <Text style={styles.documentType}>{item.mimeType.split("/").pop()?.replace("vnd.google-apps.", "")}</Text>
        </View>
        <TouchableOpacity style={styles.documentAction} onPress={() => handleOpenDocument(item)}>
          <Ionicons name="open-outline" size={24} color="#666" />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  )

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Ionicons name="document-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            {isAuthenticated
              ? "No documents found. Upload a document to get started."
              : "Sign in with Google to access your documents."}
          </Text>
          {isAuthenticated && (
            <Button
              mode="outlined"
              onPress={handleUploadDocument}
              style={styles.emptyButton}
              icon="cloud-upload-outline"
            >
              Upload Document
            </Button>
          )}
        </>
      )}
    </View>
  )

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <>
          <View style={styles.header}>
            <Searchbar
              placeholder="Search documents"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            <Button mode="text" onPress={handleRefresh} loading={isLoading} disabled={isLoading} icon="refresh">
              Refresh
            </Button>
          </View>

          <FlatList
            data={filteredDocuments}
            renderItem={renderDocumentItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyList}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          />

          <FAB.Group
            open={false}
            icon="plus"
            actions={[
              {
                icon: "upload",
                label: "Upload Document",
                onPress: handleUploadDocument,
              },
              {
                icon: "file-document-outline",
                label: "Create Document",
                onPress: handleCreateDocument,
              },
              {
                icon: "logout",
                label: "Sign Out",
                onPress: handleSignOut,
              },
            ]}
            onStateChange={() => {}}
            fabStyle={{ backgroundColor: theme.colors.primary }}
          />

          {isUploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.uploadingText}>Uploading document...</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.signInContainer}>
          <Ionicons name="cloud-outline" size={80} color={theme.colors.primary} />
          <Text style={styles.signInTitle}>Google Docs Integration</Text>
          <Text style={styles.signInText}>
            Sign in with your Google account to access, upload, and manage your documents.
          </Text>
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={[styles.signInButton, { backgroundColor: theme.colors.primary }]}
            icon="google"
            loading={request?.loading}
            disabled={request?.loading}
          >
            Sign in with Google
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  documentCard: {
    marginBottom: 8,
    elevation: 1,
  },
  documentCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "500",
  },
  documentType: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textTransform: "capitalize",
  },
  documentAction: {
    padding: 8,
  },
  divider: {
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    marginTop: 16,
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  signInTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 16,
  },
  signInText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  signInButton: {
    width: "80%",
    borderRadius: 8,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  uploadingText: {
    fontSize: 16,
    marginTop: 16,
  },
})

export default GoogleDocsScreen
