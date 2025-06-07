"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"

type User = {
  id: string
  email: string
  name: string
  photoURL?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error("Failed to get user from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "123456",
        email,
        name: "Demo User",
      }

      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "123456",
        email,
        name,
      }

      await AsyncStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      Alert.alert("Registration Failed", "Could not create account")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await AsyncStorage.removeItem("user")
      setUser(null)
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      Alert.alert("Password Reset", "If your email exists in our system, you will receive a password reset link")
    } catch (error) {
      Alert.alert("Error", "Failed to send password reset email")
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
