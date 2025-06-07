"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import firebase from "firebase/app"
import "firebase/auth"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as AppleAuthentication from "expo-apple-authentication"
import * as Crypto from "expo-crypto"

type User = {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  phoneNumber: string | null
  emailVerified: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  googleSignIn: () => Promise<void>
  appleSignIn: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
  verifyEmail: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
    })

    // Listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber,
          emailVerified: firebaseUser.emailVerified,
        }
        setUser(userData)
        await AsyncStorage.setItem("userToken", await firebaseUser.getIdToken())
      } else {
        setUser(null)
        await AsyncStorage.removeItem("userToken")
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true)
    try {
      const { user: firebaseUser } = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebaseUser?.updateProfile({ displayName })
      // Create user document in Firestore
      await firebase.firestore().collection("users").doc(firebaseUser?.uid).set({
        email,
        displayName,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: "user",
      })
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      await firebase.auth().signOut()
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email)
    } catch (error) {
      throw error
    }
  }

  const googleSignIn = async () => {
    setIsLoading(true)
    try {
      await GoogleSignin.hasPlayServices()
      const { idToken } = await GoogleSignin.signIn()
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken)
      await firebase.auth().signInWithCredential(googleCredential)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const appleSignIn = async () => {
    setIsLoading(true)
    try {
      const nonce = Math.random().toString(36).substring(2, 10)
      const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)

      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      })

      const { identityToken } = appleCredential

      if (!identityToken) {
        throw new Error("Apple Sign-In failed - no identity token returned")
      }

      const credential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce)
      await firebase.auth().signInWithCredential(credential)

      // Update user profile with Apple name if available and not already set
      const currentUser = firebase.auth().currentUser
      if (currentUser && !currentUser.displayName && appleCredential.fullName) {
        const { familyName, givenName } = appleCredential.fullName
        const displayName = [givenName, familyName].filter(Boolean).join(" ")
        if (displayName) {
          await currentUser.updateProfile({ displayName })
        }
      }
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      const currentUser = firebase.auth().currentUser
      if (!currentUser) throw new Error("No user is signed in")

      // Update Firebase Auth profile
      const authUpdates: { displayName?: string; photoURL?: string } = {}
      if (data.displayName) authUpdates.displayName = data.displayName
      if (data.photoURL) authUpdates.photoURL = data.photoURL

      if (Object.keys(authUpdates).length > 0) {
        await currentUser.updateProfile(authUpdates)
      }

      // Update Firestore user document
      const userDocRef = firebase.firestore().collection("users").doc(currentUser.uid)
      const updateData: { [key: string]: any } = {}

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && key !== "id" && key !== "email" && key !== "emailVerified") {
          updateData[key] = value
        }
      })

      if (Object.keys(updateData).length > 0) {
        await userDocRef.update(updateData)
      }

      // Update local user state
      if (user) {
        setUser({ ...user, ...data })
      }
    } catch (error) {
      throw error
    }
  }

  const verifyEmail = async () => {
    try {
      const currentUser = firebase.auth().currentUser
      if (!currentUser) throw new Error("No user is signed in")
      await currentUser.sendEmailVerification()
    } catch (error) {
      throw error
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const currentUser = firebase.auth().currentUser
      if (!currentUser || !currentUser.email) throw new Error("No user is signed in")

      // Re-authenticate user
      const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, currentPassword)
      await currentUser.reauthenticateWithCredential(credential)

      // Update password
      await currentUser.updatePassword(newPassword)
    } catch (error) {
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      const currentUser = firebase.auth().currentUser
      if (!currentUser) throw new Error("No user is signed in")

      // Delete user document from Firestore
      await firebase.firestore().collection("users").doc(currentUser.uid).delete()

      // Delete user from Firebase Auth
      await currentUser.delete()
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    googleSignIn,
    appleSignIn,
    updateUserProfile,
    verifyEmail,
    updatePassword,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
