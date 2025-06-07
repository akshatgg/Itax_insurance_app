"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function QuotePage() {
  const [formData, setFormData] = useState({
    insuranceType: "",
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    city: "",
    sumInsured: "",
    existingConditions: false,
  })
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get("type")
    if (type) {
      setFormData((prev) => ({ ...prev, insuranceType: type }))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const calculateQuote = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const basePrice = {
        health: 5000,
        auto: 3000,
        home: 2500,
        life: 8000,
      }

      const ageMultiplier = Number.parseInt(formData.age) > 40 ? 1.5 : 1.2
      const sumMultiplier = Number.parseInt(formData.sumInsured) / 100000
      const conditionMultiplier = formData.existingConditions ? 1.3 : 1

      const premium = Math.round(
        basePrice[formData.insuranceType] * ageMultiplier * sumMultiplier * conditionMultiplier,
      )

      setQuote({
        premium,
        sumInsured: formData.sumInsured,
        type: formData.insuranceType,
        features: getFeatures(formData.insuranceType),
      })
      setLoading(false)
    }, 2000)
  }

  const getFeatures = (type) => {
    const features = {
      health: ["Cashless Treatment", "Pre & Post Hospitalization", "Day Care Procedures", "Ambulance Cover"],
      auto: ["Third Party Cover", "Own Damage Cover", "Personal Accident", "Roadside Assistance"],
      home: ["Structure Cover", "Contents Cover", "Personal Liability", "Temporary Accommodation"],
      life: ["Death Benefit", "Maturity Benefit", "Tax Benefits", "Loan Facility"],
    }
    return features[type] || []
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    calculateQuote()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-2xl font-bold text-blue-600">SecureLife Insurance</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Your Insurance Quote</h2>
          <p className="text-gray-600">Fill in your details to get an instant quote</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quote Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Type</label>
                <select
                  name="insuranceType"
                  value={formData.insuranceType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Insurance Type</option>
                  <option value="health">Health Insurance</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                  <option value="life">Life Insurance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="80"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sum Insured (₹)</label>
                <select
                  name="sumInsured"
                  value={formData.sumInsured}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Sum Insured</option>
                  <option value="100000">₹1,00,000</option>
                  <option value="300000">₹3,00,000</option>
                  <option value="500000">₹5,00,000</option>
                  <option value="1000000">₹10,00,000</option>
                  <option value="2000000">₹20,00,000</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="existingConditions"
                  checked={formData.existingConditions}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">I have existing medical conditions</label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Calculating..." : "Get Quote"}
              </button>
            </form>
          </div>

          {/* Quote Result */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {!quote && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Quote Will Appear Here</h3>
                <p className="text-gray-500">Fill in the form to get your instant quote</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Calculating Your Quote</h3>
                <p className="text-gray-500">Please wait while we process your information</p>
              </div>
            )}

            {quote && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Quote is Ready!</h3>
                  <div className="text-4xl font-bold text-blue-600">₹{quote.premium.toLocaleString()}</div>
                  <p className="text-gray-600">per year</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Coverage Details</h4>
                  <div className="space-y-1 text-blue-800">
                    <p>Sum Insured: ₹{Number.parseInt(quote.sumInsured).toLocaleString()}</p>
                    <p>Insurance Type: {quote.type.charAt(0).toUpperCase() + quote.type.slice(1)}</p>
                    <p>Policy Term: 1 Year</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {quote.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/buy"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                  >
                    Buy This Policy
                  </Link>
                  <button className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Compare Plans
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
