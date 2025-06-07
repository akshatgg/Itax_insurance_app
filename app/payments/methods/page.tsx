"use client"

import { useState } from "react"

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState("")
  const [amount, setAmount] = useState(5000)

  const paymentMethods = [
    { id: "phonepe", name: "PhonePe", icon: "📱", color: "purple" },
    { id: "paytm", name: "Paytm", icon: "💙", color: "blue" },
    { id: "gpay", name: "Google Pay", icon: "🟢", color: "green" },
    { id: "bhim", name: "BHIM UPI", icon: "🇮🇳", color: "orange" },
  ]

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank",
  ]

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method")
      return
    }

    // Simulate payment processing
    alert(`Processing payment of ₹${amount} via ${selectedMethod}...`)

    // Redirect to success page
    setTimeout(() => {
      window.location.href = "/payments/success"
    }, 2000)
  }

  return (
    <div className="container">
      <div className="payment-container">
        <h1>Payment Methods</h1>

        <div className="amount-section">
          <h3>Payment Amount</h3>
          <div className="amount-display">₹{amount.toLocaleString()}</div>
          <input
            type="range"
            min="1000"
            max="100000"
            step="500"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="payment-methods">
          <h3>UPI Payments</h3>
          <div className="methods-grid">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`payment-method ${selectedMethod === method.name ? "selected" : ""}`}
                onClick={() => setSelectedMethod(method.name)}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-name">{method.name}</div>
              </div>
            ))}
          </div>

          <h3>NetBanking</h3>
          <div className="banks-grid">
            {banks.map((bank, index) => (
              <div
                key={index}
                className={`bank-option ${selectedMethod === bank ? "selected" : ""}`}
                onClick={() => setSelectedMethod(bank)}
              >
                🏦 {bank}
              </div>
            ))}
          </div>

          <h3>Cards</h3>
          <div className="card-options">
            <div
              className={`card-option ${selectedMethod === "Credit Card" ? "selected" : ""}`}
              onClick={() => setSelectedMethod("Credit Card")}
            >
              💳 Credit Card
            </div>
            <div
              className={`card-option ${selectedMethod === "Debit Card" ? "selected" : ""}`}
              onClick={() => setSelectedMethod("Debit Card")}
            >
              💳 Debit Card
            </div>
          </div>

          <button onClick={handlePayment} className="btn btn-primary pay-button">
            Pay ₹{amount.toLocaleString()} via {selectedMethod || "Selected Method"}
          </button>
        </div>
      </div>
    </div>
  )
}
