"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Auth } from "firebase-admin/auth"
import { AuthProvider } from "@/context/AuthContext"

export default function HomePage() {
  const [selectedInsurance, setSelectedInsurance] = useState("")
 
  const insuranceTypes = [
    {
      id: "health",
      title: "Health Insurance",
      icon: "🏥",
      description: "Complete medical coverage for you and family",
      price: "Starting ₹5,000/year",
    },
    {
      id: "auto",
      title: "Auto Insurance",
      icon: "🚗",
      description: "Comprehensive vehicle protection",
      price: "Starting ₹3,000/year",
    },
    {
      id: "home",
      title: "Home Insurance",
      icon: "🏠",
      description: "Protect your home and belongings",
      price: "Starting ₹2,500/year",
    },
    {
      id: "life",
      title: "Life Insurance",
      icon: "💼",
      description: "Financial security for loved ones",
      price: "Starting ₹8,000/year",
    },
  ]

  return (
  <AuthProvider>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Protect What <span className="text-blue-600">Matters Most</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant insurance quotes, manage policies online, and file claims in minutes. Trusted by over 1 million
            families across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/quote"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Instant Quote
            </Link>
            <Link
              href="/calculator"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Calculate Premium
            </Link>
          </div>
        </div>

        {/* Insurance Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {insuranceTypes.map((insurance) => (
            <div
              key={insurance.id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200"
              onClick={() => setSelectedInsurance(insurance.id)}
            >
              <div className="text-4xl mb-4 text-center">{insurance.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-center">{insurance.title}</h3>
              <p className="text-gray-600 mb-4 text-center">{insurance.description}</p>
              <p className="text-blue-600 font-semibold text-center mb-4">{insurance.price}</p>
              <Link
                href={`/quote?type=${insurance.id}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Get Quote
              </Link>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose SecureLife?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-semibold mb-3">Instant Approval</h4>
              <p className="text-gray-600">Get your policy approved in under 5 minutes with our AI-powered system</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-3">Best Prices</h4>
              <p className="text-gray-600">Compare quotes from 20+ insurers and save up to 40% on premiums</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h4 className="text-xl font-semibold mb-3">Easy Claims</h4>
              <p className="text-gray-600">File and track claims online with our simple mobile-first interface</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Existing Customer?</h3>
            <p className="mb-6">Access your dashboard to view policies, make payments, and file claims</p>
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="mb-6">Chat with our insurance experts or call our 24/7 helpline</p>
            <Link
              href="/support"
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Support
            </Link>
          </div>
        </div>
      </section>

   
    </div>
    </AuthProvider>
  )
}
