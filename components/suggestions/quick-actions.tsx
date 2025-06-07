"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Zap, Settings, HelpCircle, Bell, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  action: () => void
}

export function QuickActions() {
  const [showActions, setShowActions] = useState(false)

  const quickActions: QuickAction[] = [
    {
      id: "new-policy",
      title: "New Policy",
      description: "Get a quick quote",
      icon: <Plus className="h-5 w-5" />,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => (window.location.href = "/quote"),
    },
    {
      id: "file-claim",
      title: "File Claim",
      description: "Submit new claim",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-red-500 hover:bg-red-600",
      action: () => (window.location.href = "/claims"),
    },
    {
      id: "calculator",
      title: "Calculator",
      description: "Premium calculator",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-green-500 hover:bg-green-600",
      action: () => (window.location.href = "/calculator"),
    },
    {
      id: "support",
      title: "Support",
      description: "Get help",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => (window.location.href = "/chat-support"),
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "View updates",
      icon: <Bell className="h-5 w-5" />,
      color: "bg-yellow-500 hover:bg-yellow-600",
      action: () => alert("Notifications feature coming soon!"),
    },
    {
      id: "download",
      title: "Download App",
      description: "Mobile app",
      icon: <Download className="h-5 w-5" />,
      color: "bg-teal-500 hover:bg-teal-600",
      action: () => alert("Mobile app download coming soon!"),
    },
  ]

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {showActions && (
        <Card className="mb-4 shadow-xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 w-64">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} text-white p-3 rounded-lg transition-colors flex flex-col items-center gap-2`}
                >
                  {action.icon}
                  <div className="text-center">
                    <div className="text-xs font-medium">{action.title}</div>
                    <div className="text-xs opacity-80">{action.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setShowActions(!showActions)}
        className={`rounded-full h-12 w-12 shadow-lg transition-transform ${
          showActions ? "rotate-45 bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
