export default function PaymentSuccess() {
  return (
    <div className="container">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>

        <div className="payment-details">
          <h3>Payment Details</h3>
          <div className="detail-row">
            <span>Transaction ID:</span>
            <span>TXN{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span>Amount:</span>
            <span>₹5,000</span>
          </div>
          <div className="detail-row">
            <span>Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="success-actions">
          <a href="/" className="btn btn-primary">
            Back to Home
          </a>
          <a href="/dashboard" className="btn btn-secondary">
            View Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
