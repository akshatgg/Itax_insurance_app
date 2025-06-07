"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import { useData } from "../context/DataContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Input from "../components/Input"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"

const NewClaimScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { policies } = useData()

  const [selectedPolicy, setSelectedPolicy] = useState("")
  const [claimAmount, setClaimAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activePolicies = policies.filter((policy) => policy.status === "active")

  const handleSubmit = async () => {
    if (!selectedPolicy) {
      Alert.alert("Error", "Please select a policy")
      return
    }

    if (!claimAmount || isNaN(Number(claimAmount)) || Number(claimAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid claim amount")
      return
    }

    if (!description) {
      Alert.alert("Error", "Please enter a description")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      Alert.alert("Claim Submitted", "Your claim has been submitted successfully and is under review.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      Alert.alert("Error", "Failed to submit claim. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveLayout>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
        File a New Claim
      </Text>

      <Card>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
        >
          Select Policy
        </Text>

        {activePolicies.length === 0 ? (
          <View style={styles.emptyPolicies}>
            <Ionicons name="alert-circle-outline" size={24} color={theme.colors.warning} />
            <Text
              style={[
                styles.emptyPoliciesText,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              You don't have any active policies to file a claim against.
            </Text>
          </View>
        ) : (
          activePolicies.map((policy) => (
            <TouchableOpacity
              key={policy.id}
              style={[
                styles.policyOption,
                selectedPolicy === policy.id && {
                  borderColor: theme.colors.primary,
                  backgroundColor: `${theme.colors.primary}10`,
                },
              ]}
              onPress={() => setSelectedPolicy(policy.id)}
            >
              <View style={styles.policyOptionContent}>
                <View style={[styles.policyIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                  <Ionicons
                    name={
                      policy.type === "auto"
                        ? "car-outline"
                        : policy.type === "health"
                          ? "medkit-outline"
                          : policy.type === "life"
                            ? "heart-outline"
                            : "home-outline"
                    }
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.policyInfo}>
                  <Text
                    style={[
                      styles.policyName,
                      { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                    ]}
                  >
                    {policy.name}
                  </Text>
                  <Text
                    style={[
                      styles.policyType,
                      { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                    ]}
                  >
                    {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedPolicy === policy.id && {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primary,
                  },
                ]}
              >
                {selectedPolicy === policy.id && (
                  <View style={[styles.radioButtonInner, { backgroundColor: theme.colors.white }]} />
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </Card>

      <Card style={{ marginTop: theme.spacing.m }}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
        >
          Claim Details
        </Text>

        <Input
          label="Claim Amount (₹)"
          value={claimAmount}
          onChangeText={setClaimAmount}
          placeholder="Enter claim amount"
          keyboardType="numeric"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Describe what happened"
          multiline
          numberOfLines={4}
          style={{ height: 100 }}
        />

        <Button
          title="Submit Claim"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || activePolicies.length === 0}
          style={{ marginTop: theme.spacing.m }}
        />
      </Card>

      <Card style={{ marginTop: theme.spacing.m }}>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
        >
          Claim Process
        </Text>

        <View style={styles.stepContainer}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text
              style={[
                styles.stepNumberText,
                { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold },
              ]}
            >
              1
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text
              style={[styles.stepTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
            >
              Submit Claim
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Fill out the claim form with all required details.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text
              style={[
                styles.stepNumberText,
                { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold },
              ]}
            >
              2
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text
              style={[styles.stepTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
            >
              Claim Review
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Our team will review your claim within 24-48 hours.
            </Text>
          </View>
        </View>

        <View style={styles.stepContainer}>
          <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
            <Text
              style={[
                styles.stepNumberText,
                { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold },
              ]}
            >
              3
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text
              style={[styles.stepTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
            >
              Claim Settlement
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Once approved, the claim amount will be transferred to your account.
            </Text>
          </View>
        </View>
      </Card>
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emptyPolicies: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff9db",
    borderRadius: 8,
  },
  emptyPoliciesText: {
    fontSize: 14,
    marginLeft: 8,
  },
  policyOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
  },
  policyOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  policyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  policyInfo: {
    flex: 1,
  },
  policyName: {
    fontSize: 16,
    marginBottom: 2,
  },
  policyType: {
    fontSize: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
  },
})

export default NewClaimScreen
