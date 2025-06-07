"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native"
import { Text, Button, useTheme, Card, Divider } from "react-native-paper"
import { Camera } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { OCRService } from "../../services/ocr-service"
import type { OCRResult } from "../../types/ocr"
import { useAuth } from "../../contexts/AuthContext"
import { FirebaseService } from "../../services/firebase-service"

type DocumentType = "pan" | "aadhaar" | "other"

interface DocumentScannerScreenProps {
  documentType?: DocumentType
  onScanComplete?: (result: OCRResult) => void
}

const DocumentScannerScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const theme = useTheme()
  const { user } = useAuth()

  const { documentType = "pan", onScanComplete } = route.params as DocumentScannerScreenProps

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<OCRResult | null>(null)
  const [documentBoundary, setDocumentBoundary] = useState<any>(null)

  const cameraRef = useRef<Camera | null>(null)

  useEffect(() => {
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(status === "granted")
    })()
  }, [])

  const onCameraReady = () => {
    setIsCameraReady(true)
  }

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) return

    setIsCapturing(true)
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      })

      setCapturedImage(photo.uri)
      processImage(photo.uri)
    } catch (error) {
      console.error("Error taking picture:", error)
      Alert.alert("Error", "Failed to capture image. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [4, 3],
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri)
        processImage(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to select image. Please try again.")
    }
  }

  const processImage = async (imageUri: string) => {
    setIsProcessing(true)
    try {
      // Perform OCR on the image
      const result = await OCRService.performOCR(imageUri)
      setScanResult(result)

      // If the document type doesn't match what we're looking for, show a warning
      if (documentType !== "other" && result.documentType !== documentType) {
        Alert.alert(
          "Document Mismatch",
          `This appears to be a ${result.documentType === "pan" ? "PAN" : result.documentType === "aadhaar" ? "Aadhaar" : "unknown"} document, but you selected ${documentType === "pan" ? "PAN" : "Aadhaar"}.`,
          [
            { text: "Try Again", onPress: () => resetScan() },
            { text: "Continue Anyway", style: "default" },
          ],
        )
      }

      // If callback is provided, call it with the result
      if (onScanComplete) {
        onScanComplete(result)
      }

      // Save the scan result if user is logged in
      if (user) {
        await saveDocumentScan(imageUri, result)
      }
    } catch (error) {
      console.error("Error processing image:", error)
      Alert.alert("Processing Error", "Failed to process the document. Please try again with a clearer image.")
    } finally {
      setIsProcessing(false)
    }
  }

  const saveDocumentScan = async (imageUri: string, result: OCRResult) => {
    try {
      // Upload image to Firebase Storage
      const storagePath = `users/${user?.id}/documents/${result.documentType}_${Date.now()}.jpg`
      const downloadURL = await FirebaseService.uploadFile(imageUri, storagePath)

      // Save document data to Firestore
      await FirebaseService.addDocument("documentScans", {
        userId: user?.id,
        documentType: result.documentType,
        fields: result.fields,
        imageUrl: downloadURL,
        fullText: result.fullText,
        createdAt: new Date().toISOString(),
      })

      console.log("Document scan saved successfully")
    } catch (error) {
      console.error("Error saving document scan:", error)
      // Don't show alert to user, just log the error
    }
  }

  const resetScan = () => {
    setCapturedImage(null)
    setScanResult(null)
    setDocumentBoundary(null)
  }

  const confirmScan = () => {
    if (!scanResult) return

    // Navigate back with the result
    navigation.navigate({
      name: route.params?.returnScreen || "IdentityVerification",
      params: {
        scanResult,
        documentType,
        imageUri: capturedImage,
      },
      merge: true,
    })
  }

  const toggleCameraType = () => {
    setCameraType(cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
  }

  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off,
    )
  }

  if (hasCameraPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    )
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off-outline" size={60} color="#666" />
        <Text style={styles.text}>Camera access is required to scan documents.</Text>
        <Button
          mode="contained"
          onPress={() => pickImage()}
          style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 20 }]}
        >
          Select from Gallery
        </Button>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={[styles.button, { marginTop: 10 }]}>
          Go Back
        </Button>
      </View>
    )
  }

  if (capturedImage && scanResult) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultContainer}>
          <Text style={styles.title}>
            {documentType === "pan" ? "PAN Card" : documentType === "aadhaar" ? "Aadhaar Card" : "Document"} Scan Result
          </Text>

          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: capturedImage }} style={styles.resultImage} />
          </Card>

          <Card style={styles.resultCard}>
            <Card.Content>
              <Text style={styles.resultTitle}>Extracted Information</Text>

              {Object.entries(scanResult.fields).map(([key, value]) => (
                <View key={key} style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Text>
                  <Text style={styles.fieldValue}>{value}</Text>
                </View>
              ))}

              {Object.keys(scanResult.fields).length === 0 && (
                <Text style={styles.noDataText}>No data could be extracted from this document.</Text>
              )}
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={resetScan} style={[styles.button, styles.resetButton]} icon="refresh">
              Rescan
            </Button>
            <Button
              mode="contained"
              onPress={confirmScan}
              style={[styles.button, styles.confirmButton, { backgroundColor: theme.colors.primary }]}
              icon="check"
            >
              Confirm
            </Button>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.processingText}>Processing document...</Text>
        </View>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={cameraType}
              flashMode={flashMode}
              onCameraReady={onCameraReady}
              ratio="4:3"
            >
              <View style={styles.overlay}>
                <View style={styles.documentFrame}>
                  {/* Document frame overlay */}
                  <View style={styles.cornerTL} />
                  <View style={styles.cornerTR} />
                  <View style={styles.cornerBL} />
                  <View style={styles.cornerBR} />
                </View>

                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.controlButton} onPress={toggleFlashMode}>
                    <Ionicons
                      name={flashMode === Camera.Constants.FlashMode.off ? "flash-off" : "flash"}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePicture}
                    disabled={!isCameraReady || isCapturing}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
                    <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Camera>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>
              Scan your {documentType === "pan" ? "PAN Card" : documentType === "aadhaar" ? "Aadhaar Card" : "Document"}
            </Text>
            <Text style={styles.instructionsText}>
              Position the{" "}
              {documentType === "pan" ? "PAN Card" : documentType === "aadhaar" ? "Aadhaar Card" : "document"} within
              the frame and ensure all text is clearly visible.
            </Text>

            <Divider style={styles.divider} />

            <Button mode="outlined" onPress={pickImage} style={styles.galleryButton} icon="image">
              Select from Gallery
            </Button>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    paddingHorizontal: 24,
  },
  cameraContainer: {
    flex: 1,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
  },
  documentFrame: {
    flex: 1,
    margin: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    borderStyle: "dashed",
    borderRadius: 8,
    position: "relative",
  },
  cornerTL: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#fff",
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#fff",
    borderTopRightRadius: 8,
  },
  cornerBL: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#fff",
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#fff",
    borderBottomRightRadius: 8,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  instructionsContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  galleryButton: {
    marginTop: 8,
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  processingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  imageCard: {
    marginBottom: 16,
    elevation: 2,
  },
  resultImage: {
    height: 200,
    resizeMode: "contain",
  },
  resultCard: {
    marginBottom: 16,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  resetButton: {
    borderColor: "#ccc",
  },
  confirmButton: {
    borderRadius: 8,
  },
})

export default DocumentScannerScreen
