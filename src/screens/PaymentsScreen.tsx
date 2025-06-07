"use client"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { useData } from "../context/DataContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"

const PaymentsScreen = () => {
  const { theme } = useTheme()
  const { payments, policies } = useData()

  const pendingPayments = payments.filter((payment) => payment.status === "pending")
  const paidPayments = payments.filter((payment) => payment.status === "paid")

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  const getPolicyName = (policyId: string) => {
    const policy = policies.find((p) => p.id === policyId)
    return policy ? policy.name : "Unknown Policy"
  }

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <ResponsiveLayout>
      <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
        Payments
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
        Upcoming Payments
      </Text>

      {pendingPayments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            No upcoming payments
          </Text>
        </Card>
      ) : (
        pendingPayments.map((payment) => {
          const daysUntilDue = getDaysUntilDue(payment.dueDate)
          const isOverdue = daysUntilDue < 0

          return (
            <Card
              key={payment.id}
              style={[styles.paymentCard, isOverdue && { borderLeftWidth: 4, borderLeftColor: theme.colors.error }]}
            >
              <View style={styles.paymentHeader}>
                <View>
                  <Text
                    style={[
                      styles.paymentTitle,
                      { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                    ]}
                  >
                    {getPolicyName(payment.policyId)}
                  </Text>
                  <Text
                    style={[
                      styles.paymentSubtitle,
                      { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                    ]}
                  >
                    Due: {formatDate(payment.dueDate)}
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
                  {isOverdue ? (
                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.error }]}>
                      <Text
                        style={[
                          styles.statusText,
                          { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                        ]}
                      >
                        Overdue
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: daysUntilDue <= 3 ? theme.colors.warning : theme.colors.info },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                        ]}
                      >
                        {daysUntilDue <= 3 ? "Due Soon" : `${daysUntilDue} days left`}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.paymentActions}>
                <Button
                  title="Pay Now"
                  onPress={() => {
                    // Handle payment
                  }}
                  size="small"
                />
                <Button
                  title="Details"
                  onPress={() => {
                    // Navigate to payment details
                  }}
                  variant="outline"
                  size="small"
                />
              </View>
            </Card>
          )
        })
      )}

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: theme.spacing.l },
        ]}
      >
        Payment History
      </Text>

      {paidPayments.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="document-text-outline" size={48} color={theme.colors.gray[400]} />
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            No payment history
          </Text>
        </Card>
      ) : (
        paidPayments.map((payment) => (
          <Card key={payment.id} style={styles.historyCard}>
            <View style={styles.paymentHeader}>
              <View>
                <Text
                  style={[
                    styles.paymentTitle,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {getPolicyName(payment.policyId)}
                </Text>
                <Text
                  style={[
                    styles.paymentSubtitle,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  Paid on: {formatDate(payment.date)}
                </Text>
              </View>
              <View style={styles.paymentAmount}>
                <Text
                  style={[
                    styles.paymentAmountValue,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {formatCurrency(payment.amount)}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.success }]}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: theme.colors.white, fontFamily: theme.typography.fontFamily.medium },
                    ]}
                  >
                    Paid
                  </Text>
                </View>
              </View>
            </View>

            <Button
              title="View Receipt"
              onPress={() => {
                // Navigate to receipt
              }}
              variant="outline"
              size="small"
              style={{ alignSelf: "flex-start", marginTop: theme.spacing.s }}
            />
          </Card>
        ))
      )}
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
  emptyCard: {
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  paymentCard: {
    marginBottom: 12,
  },
  historyCard: {
    marginBottom: 12,
    backgroundColor: "#fafafa",
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
  paymentSubtitle: {
    fontSize: 14,
  },
  paymentAmount: {
    alignItems: "flex-end",
  },
  paymentAmountValue: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
  },
  paymentActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 12,
    gap: 8,
  },
})

export default PaymentsScreen
