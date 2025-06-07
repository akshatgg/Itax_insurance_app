"use client"
import { View, Text, StyleSheet } from "react-native"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useData } from "../context/DataContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"

const PolicyDetailsScreen = () => {
  const route = useRoute()
  const { theme } = useTheme()
  const { policies, claims, payments } = useData()

  const { policyId } = route.params as { policyId: string }
  const policy = policies.find((p) => p.id === policyId)

  if (!policy) {
    return (
      <ResponsiveLayout>
        <Text style={[styles.errorText, { color: theme.colors.error, fontFamily: theme.typography.fontFamily.medium }]}>
          Policy not found
        </Text>
      </ResponsiveLayout>
    )
  }

  const policyClaims = claims.filter((claim) => claim.policyId === policyId)
  const policyPayments = payments.filter((payment) => payment.policyId === policyId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <ResponsiveLayout>
      <View style={styles.header}>
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
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View>
          <Text style={[styles.policyName, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
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

      <Card style={styles.summaryCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Policy Summary
        </Text>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Policy Status
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    policy.status === "active"
                      ? theme.colors.success
                      : policy.status === "pending"
                        ? theme.colors.warning
                        : theme.colors.error,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                ]}
              >
                {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Coverage Amount
            </Text>
            <Text
              style={[styles.summaryValue, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}
            >
              {formatCurrency(policy.coverageAmount)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Premium
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
              ]}
            >
              {formatCurrency(policy.premium)}/year
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Start Date
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
              ]}
            >
              {formatDate(policy.startDate)}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              End Date
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
              ]}
            >
              {formatDate(policy.endDate)}
            </Text>
          </View>
        </View>
      </Card>

      <View style={styles.actionsContainer}>
        <Button
          title="File a Claim"
          onPress={() => {
            // Navigate to new claim
          }}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Download Policy"
          onPress={() => {
            // Download policy
          }}
          variant="outline"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: theme.spacing.l },
        ]}
      >
        Claims History
      </Text>

      {policyClaims.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            No claims filed for this policy
          </Text>
        </Card>
      ) : (
        policyClaims.map((claim) => (
          <Card key={claim.id} style={styles.claimCard}>
            <View style={styles.claimHeader}>
              <View>
                <Text
                  style={[
                    styles.claimDescription,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {claim.description}
                </Text>
                <Text
                  style={[
                    styles.claimDate,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  Filed on: {formatDate(claim.date)}
                </Text>
              </View>
              <View style={styles.claimAmount}>
                <Text
                  style={[
                    styles.claimAmountValue,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold },
                  ]}
                >
                  {formatCurrency(claim.amount)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        claim.status === "approved"
                          ? theme.colors.success
                          : claim.status === "pending"
                            ? theme.colors.warning
                            : theme.colors.error,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                    ]}
                  >
                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))
      )}

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: theme.spacing.l },
        ]}
      >
        Payment History
      </Text>

      {policyPayments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            No payments for this policy
          </Text>
        </Card>
      ) : (
        policyPayments.map((payment) => (
          <Card key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <View>
                <Text
                  style={[
                    styles.paymentTitle,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {payment.status === "paid" ? "Payment" : "Due Payment"}
                </Text>
                <Text
                  style={[
                    styles.paymentDate,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  {payment.status === "paid"
                    ? `Paid on: ${formatDate(payment.date)}`
                    : `Due on: ${formatDate(payment.dueDate)}`}
                </Text>
              </View>
              <View style={styles.paymentAmount}>
                <Text
                  style={[
                    styles.paymentAmountValue,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold },
                  ]}
                >
                  {formatCurrency(payment.amount)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: payment.status === "paid" ? theme.colors.success : theme.colors.warning,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                    ]}
                  >
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))
      )}
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  policyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  policyName: {
    fontSize: 20,
    marginBottom: 4,
  },
  policyType: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  summaryCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  summaryItem: {
    width: "50%",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  emptyCard: {
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  claimCard: {
    marginBottom: 12,
  },
  claimHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  claimDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  claimDate: {
    fontSize: 14,
  },
  claimAmount: {
    alignItems: "flex-end",
  },
  claimAmountValue: {
    fontSize: 16,
    marginBottom: 4,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  paymentTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 14,
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  paymentAmountValue: {
    fontSize: 16,
    marginBottom: 4,
  },
})

export default PolicyDetailsScreen
