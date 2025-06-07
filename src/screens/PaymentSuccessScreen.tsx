"use client"
import { useEffect } from "react"
import { View, Text, StyleSheet, Animated, Easing } from "react-native"
import { useTheme } from "../context/ThemeContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import LottieView from "lottie-react-native"

const PaymentSuccessScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { amount, method, bank, offlineMode } = route.params as {
    amount: number
    method: string
    bank?: string
    offlineMode?: boolean
  }

  const spinValue = new Animated.Value(0)

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start()
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  const getMethodName = (methodId: string) => {
    switch (methodId) {
      case "phonepe":
        return "PhonePe"
      case "paytm":
        return "Paytm"
      case "bhim":
        return "BHIM UPI"
      case "gpay":
        return "Google Pay"
      case "amazonpay":
        return "Amazon Pay"
      case "netbanking":
        return "Net Banking"
      case "card":
        return "Credit/Debit Card"
      default:
        return methodId
    }
  }

  const getBankName = (bankId?: string) => {
    if (!bankId) return ""

    const banks: Record<string, string> = {
      sbi: "State Bank of India",
      hdfc: "HDFC Bank",
      icici: "ICICI Bank",
      axis: "Axis Bank",
      kotak: "Kotak Mahindra Bank",
      pnb: "Punjab National Bank",
      bob: "Bank of Baroda",
      idfc: "IDFC First Bank",
      yes: "Yes Bank",
      federal: "Federal Bank",
    }

    return banks[bankId] || bankId
  }

  return (
    <ResponsiveLayout style={styles.container}>
      <View style={styles.content}>
        {offlineMode ? (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning + "20" }]}>
            <Ionicons name="time-outline" size={64} color={theme.colors.warning} />
          </View>
        ) : (
          <View style={styles.animationContainer}>
            <LottieView
              source={require("../../assets/animations/payment-success.json")}
              autoPlay
              loop={false}
              style={styles.lottieAnimation}
            />
          </View>
        )}

        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          {offlineMode ? "Payment Queued" : "Payment Successful!"}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.gray[500] }]}>
          {offlineMode
            ? "Your payment will be processed when you're back online."
            : "Your payment has been processed successfully."}
        </Text>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.gray[500] }]}>Amount</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{formatCurrency(amount)}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.gray[500] }]}>Payment Method</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{getMethodName(method)}</Text>
          </View>

          {bank && (
            <>
              <View style={styles.separator} />
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.gray[500] }]}>Bank</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>{getBankName(bank)}</Text>
              </View>
            </>
          )}

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.gray[500] }]}>Date & Time</Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>{new Date().toLocaleString()}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.colors.gray[500] }]}>Status</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: offlineMode ? theme.colors.warning : theme.colors.success },
              ]}
            >
              <Text style={styles.statusText}>{offlineMode ? "Pending" : "Successful"}</Text>
            </View>
          </View>
        </View>

        {offlineMode && (
          <View style={[styles.offlineNotice, { backgroundColor: theme.colors.warning + "20" }]}>
            <Ionicons name="information-circle-outline" size={20} color={theme.colors.warning} />
            <Text style={[styles.offlineText, { color: theme.colors.text }]}>
              Your payment will be automatically processed when your device is back online.
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="View Receipt"
            onPress={() => {
              // Navigate to receipt
            }}
            variant={offlineMode ? "outline" : "primary"}
            fullWidth
            disabled={offlineMode}
          />

          <Button
            title="Back to Dashboard"
            onPress={() => navigation.navigate("Main")}
            variant={offlineMode ? "primary" : "outline"}
            fullWidth
            style={{ marginTop: 12 }}
          />
        </View>
      </View>
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  animationContainer: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "100%",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 24,
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
  },
  offlineText: {
    marginLeft: 8,
    flex: 1,
  },
})

export default PaymentSuccessScreen
