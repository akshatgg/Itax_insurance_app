"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
export default function LoginPage() {
  const { setToken } = useAuth();
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user

      if (user) {
        // Get user data from Firestore
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        let userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          isLoggedIn: true,
        }

        if (userDoc.exists()) {
          // User exists in Firestore, use that data
          const firestoreData = userDoc.data()
          userData = {
            ...userData,
            name: firestoreData.name || user.displayName || "User",
            ...firestoreData
          }

           const idToken = await user.getIdToken(); // get current token
           localStorage.setItem("token", idToken); 
          setToken(idToken); // Store token in context
          } else {
          // Create user document in Firestore if it doesn't exist
          await setDoc(userDocRef, {
            name: user.displayName || "User",
            email: user.email,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          })
        }

        // Store user data in localStorage (optional - you might want to use context instead)
         localStorage.setItem("user", JSON.stringify(userData))        
        toast.success("Login successful!")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      // Handle specific Firebase auth errors
      let errorMessage = "An error occurred during login"
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please register first."
          break
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again."
          break
        case "auth/invalid-email":
          errorMessage = "Invalid email address format."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        case "auth/user-disabled":
          errorMessage = "This account has been disabled."
          break
        case "auth/invalid-credential":
          errorMessage = "Invalid credentials. Please check your email and password."
          break
        default:
          errorMessage = error.message || "Login failed. Please try again."
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      if (user) {
        // Check if user exists in Firestore, if not create them
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)

        if (!userDoc.exists()) {
          // Create new user document
          await setDoc(userDocRef, {
            name: user.displayName || "User",
            email: user.email,
            photoURL: user.photoURL || "",
            provider: "google",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          })
        } else {
          // Update last login
          await setDoc(userDocRef, {
            lastLogin: new Date().toISOString(),
          }, { merge: true })
        }

        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          photoURL: user.photoURL || "",
          isLoggedIn: true,
        }

        localStorage.setItem("user", JSON.stringify(userData))
        toast.success("Google sign-in successful!")
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error)
      const errorMessage = error.message || "Google sign-in failed"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-bold text-blue-600">SecureLife</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-gray-600">Access your insurance dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2">📱</span>
                Google
              </button>
              <button 
                disabled
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2">📞</span>
                OTP (Coming Soon)
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}