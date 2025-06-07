"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, ThumbsUp, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface FeatureRequest {
  id: string
  title: string
  description: string
  votes: number
  status: "pending" | "in-progress" | "completed"
  submittedBy: string
  submittedAt: string
}

export function FeatureRequests() {
  const [requests, setRequests] = useState<FeatureRequest[]>([
    {
      id: "1",
      title: "Dark Mode Support",
      description: "Add dark theme option for better user experience",
      votes: 15,
      status: "in-progress",
      submittedBy: "User123",
      submittedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Biometric Authentication",
      description: "Add fingerprint/face ID login support",
      votes: 23,
      status: "pending",
      submittedBy: "SecureUser",
      submittedAt: "2024-01-10",
    },
    {
      id: "3",
      title: "Offline Mode",
      description: "Allow app to work without internet connection",
      votes: 8,
      status: "completed",
      submittedBy: "MobileUser",
      submittedAt: "2024-01-05",
    },
  ])

  const [newRequest, setNewRequest] = useState({ title: "", description: "" })
  const [showForm, setShowForm] = useState(false)

  const handleVote = (id: string) => {
    setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, votes: req.votes + 1 } : req)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRequest.title.trim() || !newRequest.description.trim()) return

    const request: FeatureRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      votes: 1,
      status: "pending",
      submittedBy: "You",
      submittedAt: new Date().toISOString().split("T")[0],
    }

    setRequests((prev) => [request, ...prev])
    setNewRequest({ title: "", description: "" })
    setShowForm(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in-progress":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50"
      case "in-progress":
        return "text-blue-600 bg-blue-50"
      case "completed":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Feature Requests</CardTitle>
            <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Request Feature"}</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-4">
                <Input
                  placeholder="Feature title..."
                  value={newRequest.title}
                  onChange={(e) => setNewRequest((prev) => ({ ...prev, title: e.target.value }))}
                />
                <textarea
                  placeholder="Describe the feature..."
                  value={newRequest.description}
                  onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border rounded-md resize-none h-24"
                />
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{request.title}</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    By {request.submittedBy} • {request.submittedAt}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(request.id)}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {request.votes}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
