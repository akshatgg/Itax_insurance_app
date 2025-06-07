"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
} from "react-native"
import { Text, Button, ProgressBar, useTheme, TextInput, Divider } from "react-native-paper"
import { Formik } from "formik"
import * as Yup from "yup"
import { useNavigation } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import { Camera } from "expo-camera"
import * as LocalAuthentication from "expo-local-authentication"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"
import { useVerification } from "../../contexts/VerificationContext"
import LoadingOverlay from "../../components/common/LoadingOverlay"

// Validation schemas
const PanCardSchema = Yup.object().shape({
  panNumber: Yup.string()
    .required("PAN number is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  fullName: Yup.string().required("Full name is required"),
  dateOfBirth: Yup.string()
    .required("Date of birth is required")
    .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, "Date format should be DD/MM/YYYY"),
})

const AadhaarCardSchema = Yup.object().shape({
  aadhaarNumber: Yup.string()
    .required("Aadhaar number is required")
    .matches(/^\d{4}\s\d{4}\s\d{4}$/, "Invalid Aadhaar number format (XXXX XXXX XXXX)"),
  fullName: Yup.string().required("Full name is required"),
  address: Yup.string().required("Address is required"),
})

const IdentityVerificationScreen = () => {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user } = useAuth()
  const { submitVerification, isVerifying } = useVerification()

  const [currentStep, setCurrentStep] = useState(1)
  const [panCardImage, setPanCardImage] = useState<string | null>(null)
  const [aadhaarCardFrontImage, setAadhaarCardFrontImage] = useState<string | null>(null)
  const [aadhaarCardBackImage, setAadhaarCardBackImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null)
  const [isCameraVisible, setIsCameraVisible] = useState(false)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [cameraRef, setCameraRef] = useState<Camera | null>(null)
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)
  const [isBiometricVerified, setIsBiometricVerified] = useState(false)
  const [panCardData, setPanCardData] = useState({
    panNumber: "",
    fullName: "",
    dateOfBirth: "",
  })
  const [aadhaarCardData, setAadhaarCardData] = useState({
    aadhaarNumber: "",
    fullName: "",
    address: "",
  })

  useEffect(() => {
    // Check camera permissions
    ;(async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(status === "granted")
    })()

    // Check biometric support
    checkBiometricSupport()
  }, [])

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    setIsBiometricSupported(compatible)
  }

  const verifyBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your identity with biometrics",
        fallbackLabel: "Use passcode",
      })

      if (result.success) {
        setIsBiometricVerified(true)
        Alert.alert("Success", "Biometric verification successful")
        return true
      } else {
        Alert.alert("Verification Failed", "Biometric verification failed. Please try again.")
        return false
      }
    } catch (error) {
      console.error("Biometric error:", error)
      Alert.alert("Error", "Biometric verification encountered an error")
      return false
    }
  }

  const pickImage = async (setImageFunction: React.Dispatch<React.SetStateAction<string | null>>, title: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageFunction(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          skipProcessing: true,
        })
        setSelfieImage(photo.uri)
        setIsCameraVisible(false)
      } catch (error) {
        console.error("Error taking picture:", error)
        Alert.alert("Error", "Failed to take picture")
      }
    }
  }

  const formatAadhaarNumber = (text: string) => {
    // Remove all spaces first
    const digitsOnly = text.replace(/\s/g, "")
    // Add a space after every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.substring(0, 14) // Limit to 14 chars (12 digits + 2 spaces)
  }

  const handleNextStep = async () => {
    if (currentStep === 4 && !isBiometricVerified) {
      const verified = await verifyBiometric()
      if (!verified) return
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission
      try {
        if (!user) {
          Alert.alert("Error", "User not authenticated")
          return
        }

        await submitVerification({
          userId: user.id,
          panCard: {
            ...panCardData,
            imageUri: panCardImage,
          },
          aadhaarCard: {
            ...aadhaarCardData,
            frontImageUri: aadhaarCardFrontImage,
            backImageUri: aadhaarCardBackImage,
          },
          selfieImageUri: selfieImage,
          biometricVerified: isBiometricVerified,
          submittedAt: new Date().toISOString(),
          status: "pending",
        })

        Alert.alert(
          "Verification Submitted",
          "Your identity verification has been submitted successfully and is under review.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Dashboard" as never),
            },
          ],
        )
      } catch (error: any) {
        Alert.alert("Submission Error", error.message)
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <ProgressBar progress={currentStep / 5} color={theme.colors.primary} style={styles.progressBar} />
        <View style={styles.stepsTextContainer}>
          <Text style={styles.stepText}>
            Step {currentStep} of 5: {getStepTitle(currentStep)}
          </Text>
        </View>
      </View>
    )
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "PAN Card Details"
      case 2:
        return "PAN Card Upload"
      case 3:
        return "Aadhaar Card Details"
      case 4:
        return "Aadhaar Card Upload"
      case 5:
        return "Biometric Verification"
      default:
        return ""
    }
  }

  const renderPanCardDetailsStep = () => {
    return (
      <Formik
        initialValues={panCardData}
        validationSchema={PanCardSchema}
        onSubmit={(values) => {
          setPanCardData(values)
          handleNextStep()
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Enter PAN Card Details</Text>
            <Text style={styles.formDescription}>
              Please enter your PAN (Permanent Account Number) card details exactly as they appear on your card.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="PAN Number"
                value={values.panNumber}
                onChangeText={(text) => setFieldValue("panNumber", text.toUpperCase())}
                onBlur={handleBlur("panNumber")}
                error={touched.panNumber && !!errors.panNumber}
                style={styles.input}
                autoCapitalize="characters"
                maxLength={10}
              />
              {touched.panNumber && errors.panNumber && <Text style={styles.errorText}>{errors.panNumber}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Full Name (as on PAN Card)"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={touched.fullName && !!errors.fullName}
                style={styles.input}
              />
              {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Date of Birth (DD/MM/YYYY)"
                value={values.dateOfBirth}
                onChangeText={handleChange("dateOfBirth")}
                onBlur={handleBlur("dateOfBirth")}
                error={touched.dateOfBirth && !!errors.dateOfBirth}
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                placeholder="DD/MM/YYYY"
              />
              {touched.dateOfBirth && errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handlePrevStep}
                style={[styles.button, styles.backButton]}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={[styles.button, styles.nextButton, { backgroundColor: theme.colors.primary }]}
              >
                Next
              </Button>
            </View>
          </View>
        )}
      </Formik>
    )
  }

  const renderPanCardUploadStep = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Upload PAN Card</Text>
        <Text style={styles.formDescription}>
          Please upload a clear photo of your PAN card. Ensure all details are clearly visible.
        </Text>

        <View style={styles.uploadContainer}>
          {panCardImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: panCardImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setPanCardImage(null)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setPanCardImage, "PAN Card")}>
              <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Tap to upload PAN Card</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.uploadTipsContainer}>
          <Text style={styles.uploadTipsTitle}>Tips for a good scan:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Place the card on a dark, non-reflective surface</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Ensure good lighting without shadows</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Make sure all text is clearly visible</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handlePrevStep} style={[styles.button, styles.backButton]}>
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNextStep}
            style={[styles.button, styles.nextButton, { backgroundColor: theme.colors.primary }]}
            disabled={!panCardImage}
          >
            Next
          </Button>
        </View>
      </View>
    )
  }

  const renderAadhaarCardDetailsStep = () => {
    return (
      <Formik
        initialValues={aadhaarCardData}
        validationSchema={AadhaarCardSchema}
        onSubmit={(values) => {
          setAadhaarCardData(values)
          handleNextStep()
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Enter Aadhaar Card Details</Text>
            <Text style={styles.formDescription}>
              Please enter your Aadhaar card details exactly as they appear on your card.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="Aadhaar Number"
                value={values.aadhaarNumber}
                onChangeText={(text) => {
                  const formatted = formatAadhaarNumber(text)
                  setFieldValue("aadhaarNumber", formatted)
                }}
                onBlur={handleBlur("aadhaarNumber")}
                error={touched.aadhaarNumber && !!errors.aadhaarNumber}
                style={styles.input}
                keyboardType="numeric"
                maxLength={14} // 12 digits + 2 spaces
                placeholder="XXXX XXXX XXXX"
              />
              {touched.aadhaarNumber && errors.aadhaarNumber && (
                <Text style={styles.errorText}>{errors.aadhaarNumber}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Full Name (as on Aadhaar Card)"
                value={values.fullName}
                onChangeText={handleChange("fullName")}
                onBlur={handleBlur("fullName")}
                error={touched.fullName && !!errors.fullName}
                style={styles.input}
              />
              {touched.fullName && errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Address"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                error={touched.address && !!errors.address}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
              {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={handlePrevStep} style={[styles.button, styles.backButton]}>
                Back
              </Button>
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={[styles.button, styles.nextButton, { backgroundColor: theme.colors.primary }]}
              >
                Next
              </Button>
            </View>
          </View>
        )}
      </Formik>
    )
  }

  const renderAadhaarCardUploadStep = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Upload Aadhaar Card</Text>
        <Text style={styles.formDescription}>Please upload clear photos of both sides of your Aadhaar card.</Text>

        <View style={styles.uploadContainer}>
          <Text style={styles.uploadSectionTitle}>Front Side</Text>
          {aadhaarCardFrontImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: aadhaarCardFrontImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setAadhaarCardFrontImage(null)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setAadhaarCardFrontImage, "Aadhaar Card Front")}
            >
              <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Tap to upload front side</Text>
            </TouchableOpacity>
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.uploadContainer}>
          <Text style={styles.uploadSectionTitle}>Back Side</Text>
          {aadhaarCardBackImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: aadhaarCardBackImage }} style={styles.imagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => setAadhaarCardBackImage(null)}>
                <Ionicons name="close-circle" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickImage(setAadhaarCardBackImage, "Aadhaar Card Back")}
            >
              <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.primary} />
              <Text style={styles.uploadText}>Tap to upload back side</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handlePrevStep} style={[styles.button, styles.backButton]}>
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNextStep}
            style={[styles.button, styles.nextButton, { backgroundColor: theme.colors.primary }]}
            disabled={!aadhaarCardFrontImage || !aadhaarCardBackImage}
          >
            Next
          </Button>
        </View>
      </View>
    )
  }

  const renderBiometricVerificationStep = () => {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Biometric Verification</Text>
        <Text style={styles.formDescription}>
          Please complete the biometric verification process to confirm your identity.
        </Text>

        <View style={styles.biometricContainer}>
          {isBiometricSupported ? (
            <>
              <View style={styles.biometricIconContainer}>
                <Ionicons
                  name={isBiometricVerified ? "checkmark-circle" : "finger-print-outline"}
                  size={80}
                  color={isBiometricVerified ? theme.colors.primary : "#666"}
                />
              </View>

              <Text style={styles.biometricStatus}>
                {isBiometricVerified
                  ? "Biometric verification successful!"
                  : "Please verify your identity using your fingerprint or face ID"}
              </Text>

              {!isBiometricVerified && (
                <Button
                  mode="contained"
                  onPress={verifyBiometric}
                  style={[styles.biometricButton, { backgroundColor: theme.colors.primary }]}
                >
                  Verify Now
                </Button>
              )}
            </>
          ) : (
            <View style={styles.biometricNotSupportedContainer}>
              <Ionicons name="alert-circle-outline" size={60} color="#666" />
              <Text style={styles.biometricNotSupportedText}>
                Biometric authentication is not supported on this device.
              </Text>
              <Text style={styles.biometricAlternativeText}>
                As an alternative, please take a selfie for manual verification.
              </Text>

              {selfieImage ? (
                <View style={styles.selfiePreviewContainer}>
                  <Image source={{ uri: selfieImage }} style={styles.selfiePreview} />
                  <TouchableOpacity style={styles.removeSelfieButton} onPress={() => setSelfieImage(null)}>
                    <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <Button
                  mode="contained"
                  onPress={() => setIsCameraVisible(true)}
                  style={[styles.selfieButton, { backgroundColor: theme.colors.primary }]}
                  disabled={!hasCameraPermission}
                >
                  Take Selfie
                </Button>
              )}

              {!hasCameraPermission && (
                <Text style={styles.cameraPermissionText}>Camera permission is required to take a selfie.</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={handlePrevStep} style={[styles.button, styles.backButton]}>
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNextStep}
            style={[styles.button, styles.nextButton, { backgroundColor: theme.colors.primary }]}
            disabled={!isBiometricVerified && !selfieImage}
          >
            Submit Verification
          </Button>
        </View>
      </View>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPanCardDetailsStep()
      case 2:
        return renderPanCardUploadStep()
      case 3:
        return renderAadhaarCardDetailsStep()
      case 4:
        return renderAadhaarCardUploadStep()
      case 5:
        return renderBiometricVerificationStep()
      default:
        return null
    }
  }

  if (isCameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        {hasCameraPermission ? (
          <>
            <Camera style={styles.camera} type={cameraType} ref={(ref) => setCameraRef(ref)}>
              <View style={styles.cameraControlsContainer}>
                <TouchableOpacity
                  style={styles.flipCameraButton}
                  onPress={() => {
                    setCameraType(
                      cameraType === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    )
                  }}
                >
                  <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
                  <View style={styles.takePictureButtonInner} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsCameraVisible(false)}>
                  <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
              </View>
            </Camera>
          </>
        ) : (
          <View style={styles.cameraPermissionContainer}>
            <Text style={styles.cameraPermissionText}>Camera permission not granted</Text>
            <Button mode="contained" onPress={() => setIsCameraVisible(false)} style={{ marginTop: 20 }}>
              Go Back
            </Button>
          </View>
        )}
      </View>
    )
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderStepIndicator()}
        {renderCurrentStep()}
      </ScrollView>

      {isVerifying && <LoadingOverlay message="Submitting verification..." />}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  stepIndicatorContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  stepsTextContainer: {
    marginTop: 8,
    alignItems: "center",
  },
  stepText: {
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  formDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  backButton: {
    borderColor: "#ccc",
  },
  nextButton: {
    borderRadius: 8,
  },
  uploadContainer: {
    marginVertical: 16,
  },
  uploadSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  uploadButton: {
    height: 160,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  uploadText: {
    marginTop: 8,
    color: "#666",
  },
  imagePreviewContainer: {
    position: "relative",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
  },
  uploadTipsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  uploadTipsTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  divider: {
    marginVertical: 16,
  },
  biometricContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  biometricIconContainer: {
    marginBottom: 24,
  },
  biometricStatus: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 24,
    color: "#666",
  },
  biometricButton: {
    width: "80%",
    borderRadius: 8,
  },
  biometricNotSupportedContainer: {
    alignItems: "center",
  },
  biometricNotSupportedText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    color: "#666",
  },
  biometricAlternativeText: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 24,
    color: "#666",
  },
  selfieButton: {
    width: "80%",
    borderRadius: 8,
    marginBottom: 16,
  },
  selfiePreviewContainer: {
    position: "relative",
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    marginVertical: 16,
  },
  selfiePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeSelfieButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
  },
  cameraPermissionText: {
    textAlign: "center",
    fontSize: 14,
    color: "red",
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControlsContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
  },
  flipCameraButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  takePictureButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  takePictureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  closeCameraButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  cameraPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default IdentityVerificationScreen
