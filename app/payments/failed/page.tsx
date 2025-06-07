"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { XCircle, RefreshCw, ArrowLeft, Phone, MessageCircle } from "lucide-react"

export default function PaymentFailedPage() {
  const router = useRouter()

  const commonIssues = [
    {
      issue: "Insufficient Balance",
      solution: "Please check your account balance and try again",
    },
    {
      issue: "Network Timeout",
      solution: "Check your internet connection and retry the payment",
    },
    {
      issue: "Bank Server Down",
      solution: "Try using a different payment method or try again later",
    },
    {
      issue: "Card Declined",
      solution: "Contact your bank or try a different card",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center space-y-6">
        {/* Failure Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
          <p className="text-gray-600">We couldn't process your payment. Please try again.</p>
        </div>

        {/* Error Details */}
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error Code:</strong> PAYMENT_DECLINED
            <br />
            <strong>Reason:</strong> Transaction was declined by your bank
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/payments/methods")} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Common Issues */}
        <Card className="text-left">
          <CardHeader>
            <CardTitle className="text-lg">Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commonIssues.map((item, index) => (
              <div key={index} className="border-l-4 border-teal-500 pl-4">
                <p className="font-medium text-gray-900">{item.issue}</p>
                <p className="text-sm text-gray-600">{item.solution}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call Support: 1800-123-4567
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Live Chat
              </Button>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Our support team is available 24/7 to help you with payment issues
            </p>
          </CardContent>
        </Card>

        {/* Alternative Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Try Alternative Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["UPI", "Net Banking", "Credit Card", "Debit Card"].map((method) => (
                <Button key={method} variant="outline" size="sm" onClick={() => router.push("/payments/methods")}>
                  {method}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
