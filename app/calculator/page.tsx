"use client"

import { useState } from "react"
import Link from "next/link"

export default function CalculatorPage() {
  const [calculatorType, setCalculatorType] = useState("health")
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    sumInsured: "",
    city: "",
    familyMembers: "1",
    vehicleType: "",
    vehicleAge: "",
    propertyValue: "",
    propertyType: "",
    lifeStage: "",
    income: "",
  })
  const [result, setResult] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculatePremium = () => {
    let basePremium = 0
    let multiplier = 1

    switch (calculatorType) {
      case "health":
        basePremium = 5000
        multiplier =
          (Number.parseInt(formData.age) / 30) *
          (Number.parseInt(formData.sumInsured) / 100000) *
          Number.parseInt(formData.familyMembers)
        break
      case "auto":
        basePremium = 3000
        multiplier = (formData.vehicleType === "car" ? 1.2 : 0.8) * (Number.parseInt(formData.vehicleAge) / 5 + 1)
        break
      case "home":
        basePremium = 2500
        multiplier =
          (Number.parseInt(formData.propertyValue) / 1000000) * (formData.propertyType === "apartment" ? 0.8 : 1.2)
        break
      case "life":
        basePremium = 8000
        multiplier = (Number.parseInt(formData.age) / 35) * (Number.parseInt(formData.income) / 500000)
        break
    }

    const premium = Math.round(basePremium * multiplier)
    setResult({
      premium,
      type: calculatorType,
      breakdown: getBreakdown(calculatorType, premium),
    })
  }

  const getBreakdown = (type, premium) => {
    const base = Math.round(premium * 0.7)
    const tax = Math.round(premium * 0.18)
    const fees = Math.round(premium * 0.12)

    return { base, tax, fees }
  }

  const resetCalculator = () => {
    setFormData({
      age: "",
      gender: "",
      sumInsured: "",
      city: "",
      familyMembers: "1",
      vehicleType: "",
      vehicleAge: "",
      propertyValue: "",
      propertyType: "",
      lifeStage: "",
      income: "",
    })
    setResult(null)
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Calculator</h2>
          <p className="text-gray-600">Calculate your insurance premium instantly</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Type Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Select Insurance Type</h3>
            <div className="space-y-3">
              {[
                { id: "health", name: "Health Insurance", icon: "🏥" },
                { id: "auto", name: "Auto Insurance", icon: "🚗" },
                { id: "home", name: "Home Insurance", icon: "🏠" },
                { id: "life", name: "Life Insurance", icon: "💼" },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setCalculatorType(type.id)
                    resetCalculator()
                  }}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    calculatorType === type.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Enter Details</h3>
            <div className="space-y-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your city"
                />
              </div>

              {/* Health Insurance Fields */}
              {calculatorType === "health" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sum Insured (₹)</label>
                    <select
                      name="sumInsured"
                      value={formData.sumInsured}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Sum Insured</option>
                      <option value="100000">₹1,00,000</option>
                      <option value="300000">₹3,00,000</option>
                      <option value="500000">₹5,00,000</option>
                      <option value="1000000">₹10,00,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Members</label>
                    <select
                      name="familyMembers"
                      value={formData.familyMembers}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1">Individual</option>
                      <option value="2">Self + Spouse</option>
                      <option value="3">Self + Spouse + 1 Child</option>
                      <option value="4">Self + Spouse + 2 Children</option>
                      <option value="5">Family Floater (5+)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Auto Insurance Fields */}
              {calculatorType === "auto" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="car">Car</option>
                      <option value="bike">Motorcycle</option>
                      <option value="commercial">Commercial Vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Age (Years)</label>
                    <input
                      type="number"
                      name="vehicleAge"
                      value={formData.vehicleAge}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter vehicle age"
                    />
                  </div>
                </>
              )}

              {/* Home Insurance Fields */}
              {calculatorType === "home" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Value (₹)</label>
                    <input
                      type="number"
                      name="propertyValue"
                      value={formData.propertyValue}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter property value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Property Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">Independent House</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                </>
              )}

              {/* Life Insurance Fields */}
              {calculatorType === "life" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter annual income"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Life Stage</label>
                    <select
                      name="lifeStage"
                      value={formData.lifeStage}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Life Stage</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="parent">Parent</option>
                      <option value="senior">Senior Citizen</option>
                    </select>
                  </div>
                </>
              )}

              <button
                onClick={calculatePremium}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Calculate Premium
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Premium Calculation</h3>
            {!result ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧮</div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Calculate Your Premium</h4>
                <p className="text-gray-500">Fill in the details and click calculate to see your premium</p>
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">₹{result.premium.toLocaleString()}</div>
                  <p className="text-gray-600">Annual Premium</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Premium Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Premium:</span>
                      <span>₹{result.breakdown.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Tax (18%):</span>
                      <span>₹{result.breakdown.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Fees:</span>
                      <span>₹{result.breakdown.fees.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Premium:</span>
                      <span>₹{result.premium.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href={`/quote?type=${result.type}`}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors block text-center"
                  >
                    Get Detailed Quote
                  </Link>
                  <button
                    onClick={resetCalculator}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Calculate Again
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">💡 Money Saving Tips</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Pay annually to save up to 10%</li>
                    <li>• Bundle policies for additional discounts</li>
                    <li>• Maintain claim-free record for no-claim bonus</li>
                    <li>• Choose higher deductible to lower premium</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Why Use Our Premium Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">Instant Results</h4>
              <p className="text-gray-600 text-sm">Get premium estimates in seconds with our advanced algorithm</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-semibold mb-2">Accurate Pricing</h4>
              <p className="text-gray-600 text-sm">Based on real market data and insurance company rates</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="font-semibold mb-2">Secure & Private</h4>
              <p className="text-gray-600 text-sm">Your personal information is completely secure with us</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
