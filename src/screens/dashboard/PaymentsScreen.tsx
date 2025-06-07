"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native"
import { Text, Card, Button, ActivityIndicator, Divider, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { useStripe } from "@stripe/stripe-react-native"
import firebase from "firebase/app"
import "firebase/firestore"
import { useAuth } from "../../contexts/AuthContext"
import { useNotifications } from "../../contexts/NotificationContext"

type Payment = {
  id: string
  policyId: string
  policyType: string
  policyName: string
  amount: number
  dueDate: firebase.firestore.Timestamp
  status: "pending" | "paid" | "overdue"
  paymentMethod?: string
  paymentDate?: firebase.firestore.Timestamp
}

const PaymentsScreen = () => {
  const { user } = useAuth()
  const { sendPushNotification } = useNotifications()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const theme = useTheme()

  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([])
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchPayments = async () => {
      try {
        const paymentsSnapshot = await firebase
          .firestore()
          .collection("payments")
          .where("userId", "==", user.id)
          .orderBy("dueDate", "asc")
          .get()

        const upcoming: Payment[] = []
        const history: Payment[] = []

        paymentsSnapshot.forEach((doc) => {
          const payment = { id: doc.id, ...doc.data() } as Payment
          if (payment.status === "paid") {
            history.push(payment)
          } else {
            upcoming.push(payment)
          }
        })

        setUpcomingPayments(upcoming)
        setPaymentHistory(history)
      } catch (error) {
        console.error("Error fetching payments:", error)
        Alert.alert("Error", "Failed to load payment information")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [user])

  const initializePayment = async (payment: Payment) => {
    if (!user) return

    setProcessingPayment(payment.id)

    try {
      // In a real app, you would call your backend to create a payment intent
      // This is a simplified example
      const response = await fetch("https://your-backend.com/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: payment.amount * 100, // Convert to cents for Stripe
          currency: "usd",
          paymentMethodType: "card",
        }),
      })

      const { clientSecret } = await response.json()

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "EcoSure Insurance",
      })

      if (error) {
        Alert.alert("Error", error.message)
        setProcessingPayment(null)
        return
      }

      const { error: presentError } = await presentPaymentSheet()

      if (presentError) {
        Alert.alert("Error", presentError.message)
        setProcessingPayment(null)
        return
      }

      // Payment successful
      await completePayment(payment)
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during payment")
    } finally {
      setProcessingPayment(null)
    }
  }

  const completePayment = async (payment: Payment) => {
    if (!user) return

    try {
      // Update payment status in Firestore
      await firebase.firestore().collection("payments").doc(payment.id).update({
        status: "paid",
        paymentMethod: "card",
        paymentDate: firebase.firestore.FieldValue.serverTimestamp(),
      })

      // Update local state
      setUpcomingPayments(upcomingPayments.filter((p) => p.id !== payment.id))

      const updatedPayment = {
        ...payment,
        status: "paid",
        paymentMethod: "card",
        paymentDate: firebase.firestore.Timestamp.now(),
      }

      setPaymentHistory([updatedPayment, ...paymentHistory])

      // Send notification
      await sendPushNotification(
        "Payment Successful",
        `Your payment of $${payment.amount.toFixed(2)} for ${payment.policyName} has been processed.`,
        { type: "payment", paymentId: payment.id },
      )

      Alert.alert("Success", "Payment processed successfully")
    } catch (error) {
      console.error("Error completing payment:", error)
      Alert.alert("Error", "Failed to update payment status")
    }
  }

  const formatDate = (timestamp: firebase.firestore.Timestamp) => {
    const date = timestamp.toDate()
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const getDaysUntilDue = (dueDate: firebase.firestore.Timestamp) => {
    const now = new Date()
    const due = dueDate.toDate()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading payment information...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Payments</Text>
      </View>

      {/* Upcoming Payments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Payments</Text>

        {upcomingPayments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyCardContent}>
              <Ionicons name="checkmark-circle" size={48} color={theme.colors.primary} />
              <Text style={styles.emptyText}>No upcoming payments</Text>
              <Text style={styles.emptySubtext}>You're all caught up!</Text>
            </Card.Content>
          </Card>
        ) : (
          upcomingPayments.map((payment, index) => {
            const daysUntilDue = getDaysUntilDue(payment.dueDate)
            const isOverdue = daysUntilDue < 0
            const isUrgent = daysUntilDue <= 3 && !isOverdue

            return (
              <Animatable.View key={payment.id} animation="fadeInUp" delay={index * 100} duration={500}>
                <Card style={[styles.paymentCard, isOverdue && styles.overdueCard]}>
                  <Card.Content>
                    <View style={styles.paymentHeader}>
                      <View>
                        <Text style={styles.policyName}>{payment.policyName}</Text>
                        <Text style={styles.policyType}>{payment.policyType}</Text>
                      </View>
                      <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount Due</Text>
                        <Text style={styles.amount}>${payment.amount.toFixed(2)}</Text>
                      </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.paymentDetails}>
                      <View style={styles.dueDateContainer}>
                        <Text style={styles.dueDateLabel}>Due Date</Text>
                        <Text style={styles.dueDate}>{formatDate(payment.dueDate)}</Text>
                        {isOverdue ? (
                          <Text style={styles.overdueBadge}>Overdue</Text>
                        ) : isUrgent ? (
                          <Text style={styles.urgentBadge}>Due Soon</Text>
                        ) : (
                          <Text style={styles.daysUntilDue}>
                            {daysUntilDue} {daysUntilDue === 1 ? "day" : "days"} left
                          </Text>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                  <Card.Actions style={styles.cardActions}>
                    <Button
                      mode="contained"
                      onPress={() => initializePayment(payment)}
                      loading={processingPayment === payment.id}
                      disabled={processingPayment !== null}
                      style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
                    >
                      Pay Now
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        /* Navigate to payment details */
                      }}
                      style={styles.detailsButton}
                    >
                      Details
                    </Button>
                  </Card.Actions>
                </Card>
              </Animatable.View>
            )
          })
        )}
      </View>

      {/* Payment History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment History</Text>

        {paymentHistory.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyCardContent}>
              <Ionicons name="document-text-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No payment history</Text>
              <Text style={styles.emptySubtext}>Your payment history will appear here</Text>
            </Card.Content>
          </Card>
        ) : (
          paymentHistory.map((payment, index) => (
            <Animatable.View key={payment.id} animation="fadeInUp" delay={index * 100} duration={500}>
              <Card style={styles.historyCard}>
                <Card.Content>
                  <View style={styles.paymentHeader}>
                    <View>
                      <Text style={styles.policyName}>{payment.policyName}</Text>
                      <Text style={styles.policyType}>{payment.policyType}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text style={styles.amountLabel}>Amount Paid</Text>
                      <Text style={styles.amount}>${payment.amount.toFixed(2)}</Text>
                    </View>
                  </View>

                  <Divider style={styles.divider} />

                  <View style={styles.paymentDetails}>
                    <View style={styles.paymentInfoRow}>
                      <Text style={styles.paymentInfoLabel}>Payment Date</Text>
                      <Text style={styles.paymentInfoValue}>
                        {payment.paymentDate ? formatDate(payment.paymentDate) : "N/A"}
                      </Text>
                    </View>
                    <View style={styles.paymentInfoRow}>
                      <Text style={styles.paymentInfoLabel}>Payment Method</Text>
                      <Text style={styles.paymentInfoValue}>{payment.paymentMethod || "Card"}</Text>
                    </View>
                    <View style={styles.paymentInfoRow}>
                      <Text style={styles.paymentInfoLabel}>Status</Text>
                      <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                        <Text style={[styles.statusText, { color: theme.colors.success }]}>Paid</Text>
                      </View>
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      /* Navigate to payment details */
                    }}
                    style={styles.detailsButton}
                  >
                    View Receipt
                  </Button>
                </Card.Actions>
              </Card>
            </Animatable.View>
          ))
        )}
      </View>

      {/* Payment Methods Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <Card style={styles.paymentMethodsCard}>
          <Card.Content>
            <TouchableOpacity style={styles.addPaymentMethod}>
              <View style={[styles.addPaymentIcon, { borderColor: theme.colors.primary }]}>
                <Ionicons name="add" size={24} color={theme.colors.primary} />
              </View>
              <Text style={[styles.addPaymentText, { color: theme.colors.primary }]}>Add Payment Method</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  paymentCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  policyName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  policyType: {
    fontSize: 14,
    color: "#666",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 12,
    color: "#666",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  paymentDetails: {
    marginTop: 5,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  dueDateLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 10,
  },
  daysUntilDue: {
    fontSize: 12,
    color: "#666",
  },
  overdueBadge: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  urgentBadge: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingHorizontal: 8,
  },
  payButton: {
    marginRight: 8,
  },
  detailsButton: {
    borderColor: "#ddd",
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: "#fafafa",
  },
  paymentInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentInfoLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentInfoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  emptyCard: {
    borderRadius: 12,
    elevation: 1,
  },
  emptyCardContent: {
    alignItems: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  paymentMethodsCard: {
    borderRadius: 12,
    elevation: 1,
  },
  addPaymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  addPaymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: "500",
  },
})

export default PaymentsScreen
