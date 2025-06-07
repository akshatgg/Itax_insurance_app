"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useData } from "../context/DataContext"
import { useNetInfo } from "@react-native-community/netinfo"

// Bank logos
const BANK_LOGOS = {
  sbi: require("../../assets/banks/sbi.png"),
  hdfc: require("../../assets/banks/hdfc.png"),
  icici: require("../../assets/banks/icici.png"),
  axis: require("../../assets/banks/axis.png"),
  kotak: require("../../assets/banks/kotak.png"),
  pnb: require("../../assets/banks/pnb.png"),
  bob: require("../../assets/banks/bob.png"),
  idfc: require("../../assets/banks/idfc.png"),
  yes: require("../../assets/banks/yes.png"),
  federal: require("../../assets/banks/federal.png"),
}

// UPI app logos
const UPI_LOGOS = {
  phonepe: require("../../assets/upi/phonepe.png"),
  paytm: require("../../assets/upi/paytm.png"),
  bhim: require("../../assets/upi/bhim.png"),
  gpay: require("../../assets/upi/gpay.png"),
  amazonpay: require("../../assets/upi/amazonpay.png"),
}

const PaymentMethodsScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { amount, policyId, paymentId } = route.params as { amount: number; policyId: string; paymentId: string }
  const { processPayment } = useData()
  const netInfo = useNetInfo()

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [showBanks, setShowBanks] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Run entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleMethodSelect = (method: string) => {
    const animation = Animated.spring(new Animated.Value(1.0), {
      toValue: 1.1,
      friction: 4,
      useNativeDriver: true,
    })

    animation.start()

    setSelectedMethod(method)
    if (method === "netbanking") {
      setShowBanks(true)
    } else {
      setShowBanks(false)
      setSelectedBank(null)
    }
  }

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank)
  }

  const handlePayment = async () => {
    if (!selectedMethod || (selectedMethod === "netbanking" && !selectedBank)) {
      return
    }

    setIsProcessing(true)

    try {
      // If offline, store the payment request for later processing
      if (!netInfo.isConnected) {
        await processPayment(
          paymentId,
          {
            method: selectedMethod,
            bank: selectedBank,
            amount,
            policyId,
            status: "pending",
            offlineQueued: true,
            timestamp: new Date().toISOString(),
          },
          true,
        )

        navigation.navigate("PaymentSuccess", {
          offlineMode: true,
          amount,
          method: selectedMethod,
          bank: selectedBank,
        })
        return
      }

      // Process payment online
      await processPayment(paymentId, {
        method: selectedMethod,
        bank: selectedBank,
        amount,
        policyId,
        status: "completed",
        timestamp: new Date().toISOString(),
      })

      navigation.navigate("PaymentSuccess", {
        amount,
        method: selectedMethod,
        bank: selectedBank,
      })
    } catch (error) {
      console.error("Payment error:", error)
      navigation.navigate("PaymentFailed", { error: "Payment processing failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  const banks = [
    { id: "sbi", name: "State Bank of India" },
    { id: "hdfc", name: "HDFC Bank" },
    { id: "icici", name: "ICICI Bank" },
    { id: "axis", name: "Axis Bank" },
    { id: "kotak", name: "Kotak Mahindra Bank" },
    { id: "pnb", name: "Punjab National Bank" },
    { id: "bob", name: "Bank of Baroda" },
    { id: "idfc", name: "IDFC First Bank" },
    { id: "yes", name: "Yes Bank" },
    { id: "federal", name: "Federal Bank" },
  ]

  const paymentMethods = [
    { id: "phonepe", name: "PhonePe", logo: UPI_LOGOS.phonepe },
    { id: "paytm", name: "Paytm", logo: UPI_LOGOS.paytm },
    { id: "bhim", name: "BHIM UPI", logo: UPI_LOGOS.bhim },
    { id: "gpay", name: "Google Pay", logo: UPI_LOGOS.gpay },
    { id: "amazonpay", name: "Amazon Pay", logo: UPI_LOGOS.amazonpay },
    { id: "netbanking", name: "Net Banking", icon: "globe-outline" },
    { id: "card", name: "Credit/Debit Card", icon: "card-outline" },
  ]

  return (
    <ResponsiveLayout>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Payment Methods
        </Text>

        <Card style={styles.amountCard}>
          <Text style={[styles.amountLabel, { color: theme.colors.gray[500] }]}>Amount to Pay</Text>
          <Text style={[styles.amount, { color: theme.colors.text }]}>{formatCurrency(amount)}</Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Select Payment Method</Text>

        <ScrollView style={styles.methodsContainer} showsVerticalScrollIndicator={false}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && {
                  borderColor: theme.colors.primary,
                  backgroundColor: `${theme.colors.primary}10`,
                },
              ]}
              onPress={() => handleMethodSelect(method.id)}
            >
              {method.logo ? (
                <Image source={method.logo} style={styles.methodLogo} resizeMode="contain" />
              ) : (
                <Ionicons name={method.icon as any} size={28} color={theme.colors.primary} />
              )}
              <Text style={[styles.methodName, { color: theme.colors.text }]}>{method.name}</Text>
              <Ionicons
                name={selectedMethod === method.id ? "checkmark-circle" : "chevron-forward"}
                size={24}
                color={selectedMethod === method.id ? theme.colors.primary : theme.colors.gray[400]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showBanks && (
          <Animated.View entering={Animated.FadeInDown.duration(300)}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>Select Bank</Text>
            <ScrollView style={styles.banksContainer} horizontal showsHorizontalScrollIndicator={false}>
              {banks.map((bank) => (
                <TouchableOpacity
                  key={bank.id}
                  style={[
                    styles.bankCard,
                    selectedBank === bank.id && {
                      borderColor: theme.colors.primary,
                      backgroundColor: `${theme.colors.primary}10`,
                    },
                  ]}
                  onPress={() => handleBankSelect(bank.id)}
                >
                  <Image
                    source={BANK_LOGOS[bank.id as keyof typeof BANK_LOGOS]}
                    style={styles.bankLogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.bankName, { color: theme.colors.text }]}>{bank.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Pay Now"
            onPress={handlePayment}
            loading={isProcessing}
            disabled={!selectedMethod || (selectedMethod === "netbanking" && !selectedBank)}
            fullWidth
            size="large"
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            fullWidth
            style={{ marginTop: 12 }}
          />
        </View>

        {!netInfo.isConnected && (
          <View style={[styles.offlineNotice, { backgroundColor: theme.colors.warning }]}>
            <Ionicons name="cloud-offline-outline" size={20} color="white" />
            <Text style={styles.offlineText}>You're offline. Payment will be processed when you're back online.</Text>
          </View>
        )}
      </Animated.View>
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  amountCard: {
    padding: 20,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  methodsContainer: {
    maxHeight: 300,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 12,
  },
  methodLogo: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  banksContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  bankCard: {
    width: 120,
    height: 120,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bankLogo: {
    width: 60,
    height: 40,
    marginBottom: 12,
  },
  bankName: {
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  offlineText: {
    color: "white",
    marginLeft: 8,
    flex: 1,
  },
})

export default PaymentMethodsScreen
