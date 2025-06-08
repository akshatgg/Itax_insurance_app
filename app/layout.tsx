import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SuggestionPanel } from "@/components/suggestions/suggestion-panel"
import { QuickActions } from "@/components/suggestions/quick-actions"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecureLife Insurance - Your Trusted Insurance Partner",
  description: "Comprehensive insurance solutions for life, health, auto, and home insurance",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
    
<Navbar />
        <main>{children}</main>

        {/* Floating Suggestion Components */}
        <SuggestionPanel />
        <QuickActions />
<Footer />

        </AuthProvider>
      </body>
    </html>
  )
}
