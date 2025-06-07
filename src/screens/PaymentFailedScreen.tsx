"use client"
import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../context/ThemeContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import LottieView from "lottie-react-native"

const PaymentFailedScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { error } = route.params as { error: string }

  return (
    <ResponsiveLayout style={styles.container}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../../assets/animations/payment-failed.json")}
            autoPlay
            loop={false}
            style={styles.lottieAnimation}
          />
        </View>

        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Payment Failed
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.gray[500] }]}>
          We couldn't process your payment. Please try again or use a different payment method.
        </Text>

        <View
          style={[
            styles.errorCard,
            { backgroundColor: theme.colors.error + "10", borderColor: theme.colors.error + "30" },
          ]}
        >
          <Ionicons name="alert-circle-outline" size={24} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || "An error occurred during payment processing"}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Try Again" onPress={() => navigation.goBack()} fullWidth />

          <Button
            title="Back to Dashboard"
            onPress={() => navigation.navigate("Main")}
            variant="outline"
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
    marginBottom: 24,
    textAlign: "center",
  },
  errorCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 32,
  },
  errorText: {
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    width: "100%",
  },
})

export default PaymentFailedScreen
