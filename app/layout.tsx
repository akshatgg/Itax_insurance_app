import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SuggestionPanel } from "@/components/suggestions/suggestion-panel"
import { QuickActions } from "@/components/suggestions/quick-actions"

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
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-xl font-bold text-teal-600">
                  SecureLife
                </a>
                <div className="hidden md:flex space-x-6">
                  <a href="/quote" className="text-gray-600 hover:text-teal-600">
                    Get Quote
                  </a>
                  <a href="/claims" className="text-gray-600 hover:text-teal-600">
                    Claims
                  </a>
                  <a href="/dashboard" className="text-gray-600 hover:text-teal-600">
                    Dashboard
                  </a>
                  <a href="/calculator" className="text-gray-600 hover:text-teal-600">
                    Calculator
                  </a>
                  <a href="/chat-support" className="text-gray-600 hover:text-teal-600">
                    Support
                  </a>
                  <a href="/suggestions" className="text-gray-600 hover:text-teal-600">
                    Suggestions
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/auth/login" className="text-gray-600 hover:text-teal-600">
                  Login
                </a>
                <a href="/auth/register" className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Floating Suggestion Components */}
        <SuggestionPanel />
        <QuickActions />

        <footer className="bg-gray-900 text-white py-12 mt-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">SecureLife</h3>
                <p className="text-gray-400">Your trusted insurance partner for comprehensive coverage solutions.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <a href="/quote" className="block text-gray-400 hover:text-white">
                    Get Quote
                  </a>
                  <a href="/claims" className="block text-gray-400 hover:text-white">
                    File Claim
                  </a>
                  <a href="/suggestions" className="block text-gray-400 hover:text-white">
                    Suggestions
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <a href="/chat-support" className="block text-gray-400 hover:text-white">
                    Live Chat
                  </a>
                  <a href="tel:1800-123-4567" className="block text-gray-400 hover:text-white">
                    1800-123-4567
                  </a>
                  <a href="mailto:support@securelife.com" className="block text-gray-400 hover:text-white">
                    support@securelife.com
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white">
                    Facebook
                  </a>
                  <a href="#" className="block text-gray-400 hover:text-white">
                    Twitter
                  </a>
                  <a href="#" className="block text-gray-400 hover:text-white">
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 SecureLife Insurance. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
