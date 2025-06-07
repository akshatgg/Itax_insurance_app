"use client"

import type React from "react"

import { useState } from "react"
import { Lightbulb, X, ChevronRight, Star, TrendingUp, Shield, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Suggestion {
  id: string
  title: string
  description: string
  category: "feature" | "improvement" | "integration" | "optimization"
  priority: "high" | "medium" | "low"
  icon: React.ReactNode
  action?: () => void
}

const suggestions: Suggestion[] = [
  {
    id: "1",
    title: "Add Real-time Premium Calculator",
    description: "Implement dynamic premium calculation based on user inputs with live API integration",
    category: "feature",
    priority: "high",
    icon: <Calculator className="h-5 w-5" />,
  },
  {
    id: "2",
    title: "Integrate Payment Gateway",
    description: "Add Razorpay/PayU integration for seamless premium payments",
    category: "integration",
    priority: "high",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "3",
    title: "Document Upload & OCR",
    description: "Allow users to upload documents with automatic text extraction",
    category: "feature",
    priority: "medium",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: "4",
    title: "SMS/Email Notifications",
    description: "Send policy updates and claim status via SMS/Email",
    category: "feature",
    priority: "medium",
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: "5",
    title: "Multi-language Support",
    description: "Add Hindi, Tamil, Telugu language support",
    category: "improvement",
    priority: "medium",
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    id: "6",
    title: "Progressive Web App (PWA)",
    description: "Make app installable on mobile devices",
    category: "optimization",
    priority: "low",
    icon: <TrendingUp className="h-5 w-5" />,
  },
]

export function SuggestionPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredSuggestions =
    selectedCategory === "all" ? suggestions : suggestions.filter((s) => s.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "feature":
        return "text-blue-600 bg-blue-50"
      case "improvement":
        return "text-purple-600 bg-purple-50"
      case "integration":
        return "text-orange-600 bg-orange-50"
      case "optimization":
        return "text-teal-600 bg-teal-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-teal-600 hover:bg-teal-700 shadow-lg"
        >
          <Lightbulb className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-teal-600" />
              Suggestions
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {["all", "feature", "improvement", "integration", "optimization"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-teal-600 mt-1">{suggestion.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}
                      >
                        {suggestion.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(suggestion.category)}`}
                      >
                        {suggestion.category}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
