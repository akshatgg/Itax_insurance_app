"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { Text, TextInput, Button, Checkbox, RadioButton, Divider, ProgressBar, useTheme } from "react-native-paper"
import { Formik } from "formik"
import * as Yup from "yup"
import { useNavigation, useRoute } from "@react-navigation/native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useAuth } from "../../contexts/AuthContext"
import { useVerification } from "../../contexts/VerificationContext"
import { useInsurance } from "../../contexts/InsuranceContext"
import LoadingOverlay from "../../components/common/LoadingOverlay"

// Define validation schemas for each step
const PersonalInfoSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number")
    .required("Phone number is required"),
  dateOfBirth: Yup.date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  gender: Yup.string().oneOf(["male", "female", "other"], "Please select a gender").required("Gender is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, "Pincode must be a valid 6-digit Indian pincode")
    .required("Pincode is required"),
})

const VehicleInfoSchema = Yup.object().shape({
  vehicleType: Yup.string().required("Vehicle type is required"),
  make: Yup.string().required("Make is required"),
  model: Yup.string().required("Model is required"),
  year: Yup.number()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Year is required"),
  registrationNumber: Yup.string()
    .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/, "Registration number must be in the format XX00XX0000")
    .required("Registration number is required"),
  engineNumber: Yup.string().required("Engine number is required"),
  chassisNumber: Yup.string().required("Chassis number is required"),
})

const CoverageInfoSchema = Yup.object().shape({
  coverageType: Yup.string().required("Coverage type is required"),
  coverageAmount: Yup.number()
    .min(100000, "Coverage amount must be at least ₹1,00,000")
    .required("Coverage amount is required"),
  addOns: Yup.array().of(Yup.string()),
  startDate: Yup.date().min(new Date(), "Start date cannot be in the past").required("Start date is required"),
})

const InsuranceFormScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const theme = useTheme()
  const { user } = useAuth()
  const { verificationStatus, checkVerificationStatus } = useVerification()
  const { submitInsuranceApplication, isSubmitting } = useInsurance()

  const [currentStep, setCurrentStep] = useState(1)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerMode, setDatePickerMode] = useState<"date" | "time">("date")
  const [datePickerField, setDatePickerField] = useState<string>("")
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: new Date(1990, 0, 1),
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    // Vehicle Info
    vehicleType: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    registrationNumber: "",
    engineNumber: "",
    chassisNumber: "",
    // Coverage Info
    coverageType: "comprehensive",
    coverageAmount: 500000,
    addOns: [] as string[],
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
  })

  const insuranceType = route.params?.insuranceType || "auto"

  useEffect(() => {
    checkVerificationStatus()
  }, [])

  const handleNextStep = (values: any) => {
    // Update form data with values from current step
    setFormData({ ...formData, ...values })

    // If this is the last step, submit the form
    if (currentStep === 3) {
      handleSubmitForm({ ...formData, ...values })
    } else {
      // Otherwise, move to the next step
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitForm = async (values: any) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to submit an insurance application")
      return
    }

    if (verificationStatus !== "approved") {
      Alert.alert(
        "Verification Required",
        "You need to complete identity verification before submitting an insurance application.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Verify Now",
            onPress: () => navigation.navigate("IdentityVerification" as never),
          },
        ],
      )
      return
    }

    try {
      const applicationData = {
        userId: user.id,
        insuranceType,
        personalInfo: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          gender: values.gender,
          address: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        vehicleInfo:
          insuranceType === "auto"
            ? {
                vehicleType: values.vehicleType,
                make: values.make,
                model: values.model,
                year: values.year,
                registrationNumber: values.registrationNumber,
                engineNumber: values.engineNumber,
                chassisNumber: values.chassisNumber,
              }
            : undefined,
        coverageInfo: {
          coverageType: values.coverageType,
          coverageAmount: values.coverageAmount,
          addOns: values.addOns,
          startDate: values.startDate,
        },
        status: "pending",
        submittedAt: new Date().toISOString(),
      }

      await submitInsuranceApplication(applicationData)

      Alert.alert(
        "Application Submitted",
        "Your insurance application has been submitted successfully and is under review.",
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate && datePickerField) {
      setFormData({ ...formData, [datePickerField]: selectedDate })
    }
  }

  const showDatePickerModal = (field: string, mode: "date" | "time" = "date") => {
    setDatePickerField(field)
    setDatePickerMode(mode)
    setShowDatePicker(true)
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
        return "Personal Information"
      case 2:
        return insuranceType === "auto" ? "Vehicle Information" : "Property Information"
      case 3:
        return "Coverage Details"
      default:
        return ""
    }
  }

  const renderPersonalInfoStep = () => {
    return (
      <Formik
        initialValues={{
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }}
        validationSchema={PersonalInfoSchema}
        onSubmit={handleNextStep}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Personal Information</Text>
            <Text style={styles.formDescription}>
              Please provide your personal details for the insurance application.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                label="Full Name"
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
                label="Email"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                error={touched.email && !!errors.email}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Phone Number"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                error={touched.phone && !!errors.phone}
                style={styles.input}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {touched.phone && errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={() => showDatePickerModal("dateOfBirth")}
                style={[styles.datePickerButton, touched.dateOfBirth && errors.dateOfBirth ? styles.inputError : null]}
              >
                <Text style={styles.datePickerLabel}>Date of Birth</Text>
                <Text style={styles.datePickerValue}>{values.dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {touched.dateOfBirth && errors.dateOfBirth && (
                <Text style={styles.errorText}>{errors.dateOfBirth as string}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.radioLabel}>Gender</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="male"
                    status={values.gender === "male" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("gender", "male")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Male</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="female"
                    status={values.gender === "female" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("gender", "female")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Female</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="other"
                    status={values.gender === "other" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("gender", "other")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Other</Text>
                </View>
              </View>
              {touched.gender && errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
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
                numberOfLines={2}
              />
              {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            <View style={styles.rowContainer}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <TextInput
                  label="City"
                  value={values.city}
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  error={touched.city && !!errors.city}
                  style={styles.input}
                />
                {touched.city && errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
              </View>

              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <TextInput
                  label="State"
                  value={values.state}
                  onChangeText={handleChange("state")}
                  onBlur={handleBlur("state")}
                  error={touched.state && !!errors.state}
                  style={styles.input}
                />
                {touched.state && errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Pincode"
                value={values.pincode}
                onChangeText={handleChange("pincode")}
                onBlur={handleBlur("pincode")}
                error={touched.pincode && !!errors.pincode}
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
              />
              {touched.pincode && errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
            </View>

            <View style={styles.buttonContainer}>
              <Button mode="outlined" onPress={() => navigation.goBack()} style={[styles.button, styles.backButton]}>
                Cancel
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

  const renderVehicleInfoStep = () => {
    return (
      <Formik
        initialValues={{
          vehicleType: formData.vehicleType,
          make: formData.make,
          model: formData.model,
          year: formData.year,
          registrationNumber: formData.registrationNumber,
          engineNumber: formData.engineNumber,
          chassisNumber: formData.chassisNumber,
        }}
        validationSchema={VehicleInfoSchema}
        onSubmit={handleNextStep}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Vehicle Information</Text>
            <Text style={styles.formDescription}>Please provide details about the vehicle you want to insure.</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.radioLabel}>Vehicle Type</Text>
              <View style={styles.radioGroup}>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="car"
                    status={values.vehicleType === "car" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("vehicleType", "car")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Car</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="bike"
                    status={values.vehicleType === "bike" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("vehicleType", "bike")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Bike</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton
                    value="commercial"
                    status={values.vehicleType === "commercial" ? "checked" : "unchecked"}
                    onPress={() => setFieldValue("vehicleType", "commercial")}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.radioText}>Commercial</Text>
                </View>
              </View>
              {touched.vehicleType && errors.vehicleType && <Text style={styles.errorText}>{errors.vehicleType}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Make"
                value={values.make}
                onChangeText={handleChange("make")}
                onBlur={handleBlur("make")}
                error={touched.make && !!errors.make}
                style={styles.input}
              />
              {touched.make && errors.make && <Text style={styles.errorText}>{errors.make}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Model"
                value={values.model}
                onChangeText={handleChange("model")}
                onBlur={handleBlur("model")}
                error={touched.model && !!errors.model}
                style={styles.input}
              />
              {touched.model && errors.model && <Text style={styles.errorText}>{errors.model}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Year"
                value={values.year.toString()}
                onChangeText={(text) => setFieldValue("year", Number.parseInt(text) || "")}
                onBlur={handleBlur("year")}
                error={touched.year && !!errors.year}
                style={styles.input}
                keyboardType="numeric"
                maxLength={4}
              />
              {touched.year && errors.year && <Text style={styles.errorText}>{errors.year as string}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Registration Number"
                value={values.registrationNumber}
                onChangeText={(text) => setFieldValue("registrationNumber", text.toUpperCase())}
                onBlur={handleBlur("registrationNumber")}
                error={touched.registrationNumber && !!errors.registrationNumber}
                style={styles.input}
                autoCapitalize="characters"
              />
              {touched.registrationNumber && errors.registrationNumber && (
                <Text style={styles.errorText}>{errors.registrationNumber}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Engine Number"
                value={values.engineNumber}
                onChangeText={handleChange("engineNumber")}
                onBlur={handleBlur("engineNumber")}
                error={touched.engineNumber && !!errors.engineNumber}
                style={styles.input}
              />
              {touched.engineNumber && errors.engineNumber && (
                <Text style={styles.errorText}>{errors.engineNumber}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Chassis Number"
                value={values.chassisNumber}
                onChangeText={handleChange("chassisNumber")}
                onBlur={handleBlur("chassisNumber")}
                error={touched.chassisNumber && !!errors.chassisNumber}
                style={styles.input}
              />
              {touched.chassisNumber && errors.chassisNumber && (
                <Text style={styles.errorText}>{errors.chassisNumber}</Text>
              )}
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

  const renderCoverageInfoStep = () => {
    return (
      <Formik
        initialValues={{
          coverageType: formData.coverageType,
          coverageAmount: formData.coverageAmount,
          addOns: formData.addOns,
          startDate: formData.startDate,
        }}
        validationSchema={CoverageInfoSchema}
        onSubmit={handleNextStep}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Coverage Details</Text>
            <Text style={styles.formDescription}>Please select your preferred coverage options.</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.radioLabel}>Coverage Type</Text>
              <View style={styles.coverageOptions}>
                <TouchableOpacity
                  style={[
                    styles.coverageCard,
                    values.coverageType === "comprehensive" && {
                      borderColor: theme.colors.primary,
                      backgroundColor: `${theme.colors.primary}10`,
                    },
                  ]}
                  onPress={() => setFieldValue("coverageType", "comprehensive")}
                >
                  <View style={styles.coverageCardHeader}>
                    <Text style={styles.coverageCardTitle}>Comprehensive</Text>
                    <RadioButton
                      value="comprehensive"
                      status={values.coverageType === "comprehensive" ? "checked" : "unchecked"}
                      onPress={() => setFieldValue("coverageType", "comprehensive")}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.coverageCardDescription}>
                    Covers damages to your vehicle, third-party liability, and personal accident coverage.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.coverageCard,
                    values.coverageType === "thirdParty" && {
                      borderColor: theme.colors.primary,
                      backgroundColor: `${theme.colors.primary}10`,
                    },
                  ]}
                  onPress={() => setFieldValue("coverageType", "thirdParty")}
                >
                  <View style={styles.coverageCardHeader}>
                    <Text style={styles.coverageCardTitle}>Third Party</Text>
                    <RadioButton
                      value="thirdParty"
                      status={values.coverageType === "thirdParty" ? "checked" : "unchecked"}
                      onPress={() => setFieldValue("coverageType", "thirdParty")}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.coverageCardDescription}>
                    Covers only third-party liability as mandated by law.
                  </Text>
                </TouchableOpacity>
              </View>
              {touched.coverageType && errors.coverageType && (
                <Text style={styles.errorText}>{errors.coverageType}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                label="Coverage Amount (₹)"
                value={values.coverageAmount.toString()}
                onChangeText={(text) => setFieldValue("coverageAmount", Number.parseInt(text) || "")}
                onBlur={handleBlur("coverageAmount")}
                error={touched.coverageAmount && !!errors.coverageAmount}
                style={styles.input}
                keyboardType="numeric"
              />
              {touched.coverageAmount && errors.coverageAmount && (
                <Text style={styles.errorText}>{errors.coverageAmount as string}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.checkboxLabel}>Add-ons (Optional)</Text>
              <View style={styles.checkboxGroup}>
                <View style={styles.checkboxOption}>
                  <Checkbox
                    status={values.addOns.includes("zeroDep") ? "checked" : "unchecked"}
                    onPress={() => {
                      const newAddOns = values.addOns.includes("zeroDep")
                        ? values.addOns.filter((addon) => addon !== "zeroDep")
                        : [...values.addOns, "zeroDep"]
                      setFieldValue("addOns", newAddOns)
                    }}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.checkboxText}>Zero Depreciation</Text>
                </View>
                <View style={styles.checkboxOption}>
                  <Checkbox
                    status={values.addOns.includes("roadside") ? "checked" : "unchecked"}
                    onPress={() => {
                      const newAddOns = values.addOns.includes("roadside")
                        ? values.addOns.filter((addon) => addon !== "roadside")
                        : [...values.addOns, "roadside"]
                      setFieldValue("addOns", newAddOns)
                    }}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.checkboxText}>Roadside Assistance</Text>
                </View>
                <View style={styles.checkboxOption}>
                  <Checkbox
                    status={values.addOns.includes("engine") ? "checked" : "unchecked"}
                    onPress={() => {
                      const newAddOns = values.addOns.includes("engine")
                        ? values.addOns.filter((addon) => addon !== "engine")
                        : [...values.addOns, "engine"]
                      setFieldValue("addOns", newAddOns)
                    }}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.checkboxText}>Engine Protection</Text>
                </View>
                <View style={styles.checkboxOption}>
                  <Checkbox
                    status={values.addOns.includes("ncb") ? "checked" : "unchecked"}
                    onPress={() => {
                      const newAddOns = values.addOns.includes("ncb")
                        ? values.addOns.filter((addon) => addon !== "ncb")
                        : [...values.addOns, "ncb"]
                      setFieldValue("addOns", newAddOns)
                    }}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.checkboxText}>NCB Protection</Text>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={() => showDatePickerModal("startDate")}
                style={[styles.datePickerButton, touched.startDate && errors.startDate ? styles.inputError : null]}
              >
                <Text style={styles.datePickerLabel}>Policy Start Date</Text>
                <Text style={styles.datePickerValue}>{values.startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {touched.startDate && errors.startDate && (
                <Text style={styles.errorText}>{errors.startDate as string}</Text>
              )}
            </View>

            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Premium Estimate</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Base Premium:</Text>
                <Text style={styles.summaryValue}>₹{calculateBasePremium(values)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Add-ons:</Text>
                <Text style={styles.summaryValue}>₹{calculateAddOnsPremium(values)}</Text>
              </View>
              <Divider style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTotalLabel}>Total Premium:</Text>
                <Text style={styles.summaryTotalValue}>
                  ₹{calculateBasePremium(values) + calculateAddOnsPremium(values)}
                </Text>
              </View>
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
                Submit Application
              </Button>
            </View>
          </View>
        )}
      </Formik>
    )
  }

  const calculateBasePremium = (values: any) => {
    // This is a simplified premium calculation for demonstration
    let basePremium = 0

    if (insuranceType === "auto") {
      if (values.coverageType === "comprehensive") {
        basePremium = values.coverageAmount * 0.02
      } else {
        basePremium = values.coverageAmount * 0.01
      }
    } else {
      if (values.coverageType === "comprehensive") {
        basePremium = values.coverageAmount * 0.015
      } else {
        basePremium = values.coverageAmount * 0.008
      }
    }

    return Math.round(basePremium)
  }

  const calculateAddOnsPremium = (values: any) => {
    // Calculate add-ons premium
    let addOnsPremium = 0

    if (values.addOns.includes("zeroDep")) {
      addOnsPremium += 1500
    }
    if (values.addOns.includes("roadside")) {
      addOnsPremium += 800
    }
    if (values.addOns.includes("engine")) {
      addOnsPremium += 1200
    }
    if (values.addOns.includes("ncb")) {
      addOnsPremium += 1000
    }

    return addOnsPremium
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep()
      case 2:
        return renderVehicleInfoStep()
      case 3:
        return renderCoverageInfoStep()
      default:
        return null
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderStepIndicator()}
        {renderCurrentStep()}
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={datePickerField === "dateOfBirth" ? formData.dateOfBirth : formData.startDate}
          mode={datePickerMode}
          display="default"
          onChange={handleDateChange}
        />
      )}

      {isSubmitting && <LoadingOverlay message="Submitting application..." />}
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  rowContainer: {
    flexDirection: "row",
  },
  radioLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  radioText: {
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  checkboxGroup: {
    flexDirection: "column",
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxText: {
    fontSize: 14,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  datePickerLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  datePickerValue: {
    fontSize: 16,
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
  coverageOptions: {
    marginTop: 8,
  },
  coverageCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  coverageCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  coverageCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  coverageCardDescription: {
    fontSize: 14,
    color: "#666",
  },
  summaryContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  summaryDivider: {
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default InsuranceFormScreen
