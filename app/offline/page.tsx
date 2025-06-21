"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi, Clock, FolderSyncIcon as Sync, Trash2, CheckCircle, AlertCircle } from "lucide-react"

interface OfflineAction {
  id: string
  type: "payment" | "claim" | "policy_update"
  title: string
  description: string
  timestamp: Date
  status: "pending" | "syncing" | "failed"
  data: any
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineActions, setOfflineActions] = useState<OfflineAction[]>([])
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOnline(navigator.onLine)

    // Mock offline actions
    const mockActions: OfflineAction[] = [
      {
        id: "1",
        type: "payment",
        title: "Premium Payment",
        description: "Auto Insurance - ₹3,000",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "pending",
        data: { amount: 3000, policyId: "auto-001" },
      },
      {
        id: "2",
        type: "claim",
        title: "New Claim Submission",
        description: "Car accident claim - ₹25,000",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: "pending",
        data: { amount: 25000, description: "Car accident repair" },
      },
      {
        id: "3",
        type: "policy_update",
        title: "Policy Information Update",
        description: "Updated contact information",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "failed",
        data: { phone: "+91 9876543210", email: "user@example.com" },
      },
    ]

    // Only show offline actions when offline or if there are pending actions
    if (!navigator.onLine || localStorage.getItem("offlineActions")) {
      setOfflineActions(mockActions)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const syncOfflineActions = async () => {
    setIsSyncing(true)

    // Simulate sync process
    for (let i = 0; i < offlineActions.length; i++) {
      if (offlineActions[i].status === "pending") {
        setOfflineActions((prev) =>
          prev.map((action, index) => (index === i ? { ...action, status: "syncing" } : action)),
        )

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Randomly succeed or fail for demo
        const success = Math.random() > 0.2

        setOfflineActions((prev) =>
          prev.map((action, index) =>
            index === i
              ? {
                  ...action,
                  status: success ? "syncing" : "failed",
                }
              : action,
          ),
        )

        if (success) {
          // Remove successful actions after a short delay
          setTimeout(() => {
            setOfflineActions((prev) => prev.filter((_, index) => index !== i))
          }, 1000)
        }
      }
    }

    setIsSyncing(false)
  }

  const retryAction = async (actionId: string) => {
    setOfflineActions((prev) =>
      prev.map((action) => (action.id === actionId ? { ...action, status: "syncing" } : action)),
    )

    // Simulate retry
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = Math.random() > 0.3

    setOfflineActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? {
              ...action,
              status: success ? "syncing" : "failed",
            }
          : action,
      ),
    )

    if (success) {
      setTimeout(() => {
        setOfflineActions((prev) => prev.filter((action) => action.id !== actionId))
      }, 1000)
    }
  }

  const deleteAction = (actionId: string) => {
    setOfflineActions((prev) => prev.filter((action) => action.id !== actionId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "syncing":
        return <Sync className="h-4 w-4 text-blue-600 animate-spin" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      syncing: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
    }

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status === "syncing" ? "Syncing..." : status}
      </Badge>
    )
  }

const formatTime = (input: any) => {
  if (input?.toDate) {
    return input.toDate().toLocaleString() // Firestore Timestamp
  }
  if (input instanceof Date) {
    return input.toLocaleString()
  }
  return "Invalid date"
}


  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isOnline ? <Wifi className="h-6 w-6 text-green-600" /> : <WifiOff className="h-6 w-6 text-red-600" />}
          <div>
            <h1 className="text-2xl font-bold">Offline Support</h1>
            <p className="text-gray-600">
              {isOnline ? "You're online" : "You're offline"} • {offlineActions.length} pending actions
            </p>
          </div>
        </div>

        {isOnline && offlineActions.length > 0 && (
          <Button onClick={syncOfflineActions} disabled={isSyncing} className="flex items-center gap-2">
            <Sync className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync All"}
          </Button>
        )}
      </div>

      {/* Connection Status */}
      <Alert className={`mb-6 ${isOnline ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
          <AlertDescription className={isOnline ? "text-green-800" : "text-red-800"}>
            {isOnline
              ? "You're connected to the internet. Offline actions will be synced automatically."
              : "You're currently offline. Your actions will be saved and synced when you're back online."}
          </AlertDescription>
        </div>
      </Alert>

      {/* Offline Actions Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pending Actions</h2>
          {offlineActions.length > 0 && <Badge variant="outline">{offlineActions.length} items</Badge>}
        </div>

        {offlineActions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All synced!</h3>
              <p className="text-gray-600">No pending offline actions. All your data is up to date.</p>
            </CardContent>
          </Card>
        ) : (
          offlineActions.map((action) => (
            <Card key={action.id} className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getStatusIcon(action.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Created: {formatTime(action.timestamp)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusBadge(action.status)}
                        <div className="flex gap-1">
                          {action.status === "failed" && isOnline && (
                            <Button variant="outline" size="sm" onClick={() => retryAction(action.id)}>
                              Retry
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => deleteAction(action.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Offline Features Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Offline Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Available Offline:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• View policy details</li>
                <li>• Browse claim history</li>
                <li>• Access payment history</li>
                <li>• View downloaded documents</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Requires Internet:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Make payments</li>
                <li>• Submit new claims</li>
                <li>• Update policy information</li>
                <li>• Download new documents</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
