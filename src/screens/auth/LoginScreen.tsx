"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import ResponsiveLayout from "../../components/ResponsiveLayout"
import Input from "../../components/Input"
import Button from "../../components/Button"
import Card from "../../components/Card"
import { responsive } from "../../theme"

const LoginScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (validate()) {
      try {
        await login(email, password)
      } catch (error) {
        console.log("Login error:", error)
      }
    }
  }

  return (
    <ResponsiveLayout>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.appName, { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            EcoSure
          </Text>
        </View>

        <Card style={[styles.card, responsive.isLargeDevice && { maxWidth: 500, width: "100%", alignSelf: "center" }]}>
          <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            Welcome Back
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            Sign in to your account to continue
          </Text>

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            style={styles.forgotPassword}
          >
            <Text
              style={[
                styles.forgotPasswordText,
                { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium },
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            style={{ marginTop: theme.spacing.m }}
          />

          <View style={styles.registerContainer}>
            <Text
              style={[
                styles.registerText,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}>
              <Text
                style={[
                  styles.registerLink,
                  { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.medium },
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 24,
    marginTop: 8,
  },
  card: {
    padding: 24,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
  },
})

export default LoginScreen
