"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, ActivityIndicator } from "react-native"
import { Text, Button, Card, TextInput, useTheme, ProgressBar } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { EKYCService } from "../../services/ekyc-service"
import { useAuth } from "../../contexts/AuthContext"
import { FirebaseService } from "../../services/firebase-service"

const EKYCVerificationScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const theme = useTheme()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [captchaImage, setCaptchaImage] = useState<string | null>(null)
  const [captchaCode, setCaptchaCode] = useState("")
  const [captchaTxnId, setCaptchaTxnId] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [txnId, setTxnId] = useState("")
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (currentStep === 1) {
      generateCaptcha()
    }
  }, [currentStep])

  const generateCaptcha = async () => {
    setIsLoading(true)
    try {
      const captchaData = await EKYCService.generateCaptcha()
      setCaptchaImage(`data:image/png;base64,${captchaData.captchaBase64}`)
      setCaptchaTxnId(captchaData.captchaTxnId)
    } catch (error) {
      console.error("Captcha generation error:", error)
      Alert.alert("Error", "Failed to generate captcha. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatAadhaarNumber = (text: string) => {
    // Remove all spaces first
    const digitsOnly = text.replace(/\s/g, "")
    // Add a space after every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted.substring(0, 14) // Limit to 14 chars (12 digits + 2 spaces)
  }

  const handleAadhaarChange = (text: string) => {
    const formatted = formatAadhaarNumber(text)
    setAadhaarNumber(formatted)
  }

  const handleSendOTP = async () => {
    if (!aadhaarNumber || !captchaCode) {
      Alert.alert("Error", "Please enter Aadhaar number and captcha code")
      return
    }

    setIsLoading(true)
    try {
      const result = await EKYCService.verifyAadhaarOTP(aadhaarNumber, captchaCode, captchaTxnId)

      if (result.success && result.txnId) {
        setTxnId(result.txnId)
        setOtpSent(true)
        setCurrentStep(2)
        Alert.alert("Success", "OTP sent to your registered mobile number")
      } else {
        Alert.alert("Error", result.message || "Failed to send OTP. Please try again.")
        generateCaptcha()
      }
    } catch (error) {
      console.error("OTP sending error:", error)
      Alert.alert("Error", "Failed to send OTP. Please try again.")
      generateCaptcha()
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP")
      return
    }

    setIsLoading(true)
    try {
      const result = await EKYCService.verifyOTP(txnId, otp)

      if (result.success && result.data) {
        setUserData(result.data.eKycUser)
        setVerificationComplete(true)
        setCurrentStep(3)

        // Save verification data if user is logged in
        if (user) {
          await saveVerificationData(result.data.eKycUser)
        }
      } else {
        Alert.alert("Verification Failed", result.message || "Failed to verify OTP. Please try again.")
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      Alert.alert("Error", "Failed to verify OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const saveVerificationData = async (ekycData: any) => {
    try {
      // Save eKYC verification data to Firestore
      await FirebaseService.addDocument("ekycVerifications", {
        userId: user?.id,
        aadhaarNumber: ekycData.aadhaarNumber,
        name: ekycData.name,
        dob: ekycData.dob,
        gender: ekycData.gender,
        address: ekycData.address,
        verifiedAt: new Date().toISOString(),
        status: "verified",
      })

      // Update user's verification status
      await FirebaseService.updateDocument("users", user?.id, {
        isEkycVerified: true,
        ekycVerifiedAt: new Date().toISOString(),
      })

      console.log("eKYC verification data saved successfully")
    } catch (error) {
      console.error("Error saving eKYC verification data:", error)
      // Don't show alert to user, just log the error
    }
  }

  const handleComplete = () => {
    // Navigate back with the verification result
    navigation.navigate({
      name: route.params?.returnScreen || "IdentityVerification",
      params: {
        ekycVerified: true,
        userData,
      },
      merge: true,
    })
  }

  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <ProgressBar progress={currentStep / 3} color={theme.colors.primary} style={styles.progressBar} />
        <View style={styles.stepsTextContainer}>
          <Text style={styles.stepText}>
            Step {currentStep} of 3: {getStepTitle(currentStep)}
          </Text>
        </View>
      </View>
    )
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Aadhaar Verification"
      case 2:
        return "OTP Verification"
      case 3:
        return "Verification Complete"
      default:
        return ""
    }
  }

  const renderAadhaarVerificationStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Aadhaar eKYC Verification</Text>
        <Text style={styles.stepDescription}>
          Enter your 12-digit Aadhaar number and solve the captcha to receive an OTP on your registered mobile number.
        </Text>

        <Card style={styles.formCard}>
          <Card.Content>
            <TextInput
              label="Aadhaar Number"
              value={aadhaarNumber}
              onChangeText={handleAadhaarChange}
              style={styles.input}
              keyboardType="numeric"
              maxLength={14} // 12 digits + 2 spaces
              placeholder="XXXX XXXX XXXX"
            />

            {captchaImage && (
              <View style={styles.captchaContainer}>
                <Image source={{ uri: captchaImage }} style={styles.captchaImage} resizeMode="contain" />
                <TouchableOpacity style={styles.refreshCaptchaButton} onPress={generateCaptcha}>
                  <Ionicons name="refresh" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            )}

            <TextInput
              label="Captcha Code"
              value={captchaCode}
              onChangeText={setCaptchaCode}
              style={styles.input}
              placeholder="Enter captcha code"
            />

            <Button
              mode="contained"
              onPress={handleSendOTP}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              loading={isLoading}
              disabled={isLoading || !aadhaarNumber || !captchaCode}
            >
              Send OTP
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Why eKYC Verification?</Text>
          <Text style={styles.infoText}>
            eKYC (Electronic Know Your Customer) is a paperless process that verifies your identity using your Aadhaar
            details. This helps us provide you with a seamless insurance experience while ensuring security and
            compliance.
          </Text>
        </View>
      </View>
    )
  }

  const renderOTPVerificationStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>OTP Verification</Text>
        <Text style={styles.stepDescription}>
          Enter the OTP sent to your registered mobile number linked with your Aadhaar.
        </Text>

        <Card style={styles.formCard}>
          <Card.Content>
            <View style={styles.otpContainer}>
              <TextInput
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
                placeholder="XXXXXX"
              />
            </View>

            <Button
              mode="contained"
              onPress={handleVerifyOTP}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              loading={isLoading}
              disabled={isLoading || !otp}
            >
              Verify OTP
            </Button>

            <View style={styles.resendContainer}>
              <Button
                mode="text"
                onPress={() => {
                  setCurrentStep(1)
                  setCaptchaCode("")
                  generateCaptcha()
                }}
                style={styles.resendButton}
              >
                Try Again
              </Button>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>OTP Verification</Text>
          <Text style={styles.infoText}>
            The OTP has been sent to the mobile number registered with your Aadhaar. This OTP is valid for 10 minutes.
            Please do not share this OTP with anyone.
          </Text>
        </View>
      </View>
    )
  }

  const renderVerificationCompleteStep = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.primary} />
        </View>

        <Text style={styles.stepTitle}>Verification Complete</Text>
        <Text style={styles.stepDescription}>Your Aadhaar has been successfully verified through eKYC.</Text>

        {userData && (
          <Card style={styles.userDataCard}>
            <Card.Content>
              <Text style={styles.userDataTitle}>Verified Information</Text>

              <View style={styles.userDataItem}>
                <Text style={styles.userDataLabel}>Name</Text>
                <Text style={styles.userDataValue}>{userData.name}</Text>
              </View>

              <View style={styles.userDataItem}>
                <Text style={styles.userDataLabel}>Date of Birth</Text>
                <Text style={styles.userDataValue}>{userData.dob}</Text>
              </View>

              <View style={styles.userDataItem}>
                <Text style={styles.userDataLabel}>Gender</Text>
                <Text style={styles.userDataValue}>{userData.gender}</Text>
              </View>

              <View style={styles.userDataItem}>
                <Text style={styles.userDataLabel}>Address</Text>
                <Text style={styles.userDataValue}>
                  {`${userData.address.house}, ${userData.address.street}, ${userData.address.locality}, ${userData.address.district}, ${userData.address.state} - ${userData.address.pincode}`}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={handleComplete}
          style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 24 }]}
        >
          Complete Verification
        </Button>
      </View>
    )
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderAadhaarVerificationStep()
      case 2:
        return renderOTPVerificationStep()
      case 3:
        return renderVerificationCompleteStep()
      default:
        return null
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {renderStepIndicator()}
      {renderCurrentStep()}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {currentStep === 1 ? "Sending OTP..." : currentStep === 2 ? "Verifying OTP..." : "Processing..."}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
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
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
  },
  formCard: {
    marginBottom: 24,
    elevation: 2,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  captchaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  captchaImage: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  refreshCaptchaButton: {
    position: "absolute",
    right: 8,
    top: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 4,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  otpContainer: {
    marginBottom: 16,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  resendButton: {
    marginHorizontal: 8,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  userDataCard: {
    marginTop: 24,
    elevation: 2,
  },
  userDataTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  userDataItem: {
    marginBottom: 12,
  },
  userDataLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userDataValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
})

export default EKYCVerificationScreen
