"use client"

import { useState } from "react"
import Link from "next/link"

export default function ClaimsPage() {
  const [activeTab, setActiveTab] = useState("new")
  const [claimForm, setClaimForm] = useState({
    policyNumber: "",
    claimType: "",
    incidentDate: "",
    description: "",
    amount: "",
    documents: [],
  })

  const [existingClaims] = useState([
    {
      id: "CLM001",
      policyNumber: "POL123456",
      type: "Health",
      amount: "₹25,000",
      status: "Under Review",
      date: "2024-01-15",
      statusColor: "text-yellow-600 bg-yellow-100",
    },
    {
      id: "CLM002",
      policyNumber: "POL789012",
      type: "Auto",
      amount: "₹15,000",
      status: "Approved",
      date: "2024-01-10",
      statusColor: "text-green-600 bg-green-100",
    },
    {
      id: "CLM003",
      policyNumber: "POL345678",
      type: "Home",
      amount: "₹8,000",
      status: "Rejected",
      date: "2024-01-05",
      statusColor: "text-red-600 bg-red-100",
    },
  ])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setClaimForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setClaimForm((prev) => ({ ...prev, documents: [...prev.documents, ...files] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Claim submitted successfully! You will receive a confirmation email shortly.")
    setClaimForm({
      policyNumber: "",
      claimType: "",
      incidentDate: "",
      description: "",
      amount: "",
      documents: [],
    })
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Claims Management</h2>
          <p className="text-gray-600">File new claims or track existing ones</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("new")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "new" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                File New Claim
              </button>
              <button
                onClick={() => setActiveTab("existing")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "existing"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Track Claims
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "new" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">File a New Claim</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                      <input
                        type="text"
                        name="policyNumber"
                        value={claimForm.policyNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your policy number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type</label>
                      <select
                        name="claimType"
                        value={claimForm.claimType}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Claim Type</option>
                        <option value="health">Health/Medical</option>
                        <option value="auto">Auto/Vehicle</option>
                        <option value="home">Home/Property</option>
                        <option value="life">Life Insurance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date</label>
                      <input
                        type="date"
                        name="incidentDate"
                        value={claimForm.incidentDate}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Claim Amount (₹)</label>
                      <input
                        type="number"
                        name="amount"
                        value={claimForm.amount}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter claim amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={claimForm.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the incident in detail"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2">📎</div>
                        <p className="text-gray-600">Click to upload documents</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG files up to 10MB</p>
                      </label>
                    </div>
                    {claimForm.documents.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Uploaded Files:</h4>
                        <ul className="space-y-1">
                          {claimForm.documents.map((file, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              📄 {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit Claim
                  </button>
                </form>
              </div>
            )}

            {activeTab === "existing" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Your Claims</h3>
                <div className="space-y-4">
                  {existingClaims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="text-lg font-semibold">Claim #{claim.id}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${claim.statusColor}`}>
                              {claim.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Policy:</span> {claim.policyNumber}
                            </div>
                            <div>
                              <span className="font-medium">Type:</span> {claim.type}
                            </div>
                            <div>
                              <span className="font-medium">Amount:</span> {claim.amount}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Filed on:</span> {claim.date}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">Need Help with Your Claim?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-semibold text-blue-900">Call Us</h4>
              <p className="text-blue-700">1800-123-4567</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💬</div>
              <h4 className="font-semibold text-blue-900">Live Chat</h4>
              <p className="text-blue-700">Available 24/7</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-semibold text-blue-900">Email</h4>
              <p className="text-blue-700">claims@securelife.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
