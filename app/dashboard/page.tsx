"use client"

import { useState } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [user] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 9876543210",
    memberSince: "2022",
  })

  const [policies] = useState([
    {
      id: "POL123456",
      type: "Health Insurance",
      premium: "₹12,000",
      status: "Active",
      expiryDate: "2024-12-31",
      sumInsured: "₹5,00,000",
    },
    {
      id: "POL789012",
      type: "Auto Insurance",
      premium: "₹8,500",
      status: "Active",
      expiryDate: "2024-08-15",
      sumInsured: "₹3,00,000",
    },
    {
      id: "POL345678",
      type: "Home Insurance",
      premium: "₹6,000",
      status: "Expiring Soon",
      expiryDate: "2024-02-28",
      sumInsured: "₹10,00,000",
    },
  ])

  const [recentClaims] = useState([
    {
      id: "CLM001",
      type: "Health",
      amount: "₹25,000",
      status: "Under Review",
      date: "2024-01-15",
    },
    {
      id: "CLM002",
      type: "Auto",
      amount: "₹15,000",
      status: "Approved",
      date: "2024-01-10",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100"
      case "Expiring Soon":
        return "text-yellow-600 bg-yellow-100"
      case "Expired":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getClaimStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100"
      case "Under Review":
        return "text-yellow-600 bg-yellow-100"
      case "Rejected":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-2xl font-bold text-blue-600">SecureLife Insurance</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-blue-100">Manage your policies, track claims, and make payments all in one place.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">📋</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{policies.length}</h3>
                <p className="text-gray-600">Active Policies</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🔄</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{recentClaims.length}</h3>
                <p className="text-gray-600">Recent Claims</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">💰</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">₹26,500</h3>
                <p className="text-gray-600">Total Premium</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center">
              <div className="text-3xl mr-4">⭐</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.memberSince}</h3>
                <p className="text-gray-600">Member Since</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Policies */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">My Policies</h3>
              <Link href="/quote" className="text-blue-600 hover:text-blue-700 font-medium">
                Add New Policy
              </Link>
            </div>
            <div className="space-y-4">
              {policies.map((policy) => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{policy.type}</h4>
                      <p className="text-sm text-gray-600">Policy #{policy.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Premium:</span> {policy.premium}
                    </div>
                    <div>
                      <span className="font-medium">Sum Insured:</span> {policy.sumInsured}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {policy.expiryDate}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                      View Details
                    </button>
                    <button className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Renew
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Claims</h3>
              <Link href="/claims" className="text-blue-600 hover:text-blue-700 font-medium">
                File New Claim
              </Link>
            </div>
            <div className="space-y-4">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Claim #{claim.id}</h4>
                      <p className="text-sm text-gray-600">{claim.type} Insurance</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClaimStatusColor(claim.status)}`}>
                      {claim.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Amount:</span> {claim.amount}
                    </div>
                    <div>
                      <span className="font-medium">Filed:</span> {claim.date}
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Track Status
                  </button>
                </div>
              ))}
              {recentClaims.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-gray-600">No recent claims</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/quote"
              className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
            >
              <div className="text-2xl mb-2">➕</div>
              <p className="font-medium">Buy New Policy</p>
            </Link>
            <Link
              href="/claims"
              className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors"
            >
              <div className="text-2xl mb-2">📋</div>
              <p className="font-medium">File a Claim</p>
            </Link>
            <Link
              href="/payments"
              className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors"
            >
              <div className="text-2xl mb-2">💳</div>
              <p className="font-medium">Make Payment</p>
            </Link>
            <Link
              href="/support"
              className="bg-orange-600 text-white p-4 rounded-lg text-center hover:bg-orange-700 transition-colors"
            >
              <div className="text-2xl mb-2">🎧</div>
              <p className="font-medium">Get Support</p>
            </Link>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">{user.memberSince}</p>
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
