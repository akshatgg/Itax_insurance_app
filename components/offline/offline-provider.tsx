"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { WifiOff, Wifi } from "lucide-react"

interface OfflineContextType {
  isOnline: boolean
  offlineActions: any[]
  addOfflineAction: (action: any) => void
  syncOfflineActions: () => Promise<void>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider")
  }
  return context
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineActions, setOfflineActions] = useState<any[]>([])
  const [showOfflineBanner, setShowOfflineBanner] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineBanner(false)
      // Auto sync when coming back online
      syncOfflineActions()
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineBanner(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Set initial status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addOfflineAction = (action: any) => {
    setOfflineActions((prev) => [...prev, { ...action, timestamp: new Date() }])
  }

  const syncOfflineActions = async () => {
    if (offlineActions.length === 0) return

    try {
      // Simulate API calls to sync offline actions
      for (const action of offlineActions) {
        console.log("Syncing action:", action)
        // Here you would make actual API calls
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setOfflineActions([])
      console.log("All offline actions synced successfully")
    } catch (error) {
      console.error("Failed to sync offline actions:", error)
    }
  }

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        offlineActions,
        addOfflineAction,
        syncOfflineActions,
      }}
    >
      {children}

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-3 text-center z-50 animate-slide-down">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline. Some features may be limited.</span>
          </div>
        </div>
      )}

      {/* Online Banner (briefly shown when coming back online) */}
      {isOnline && offlineActions.length > 0 && (
        <div className="fixed top-0 left-0 right-0 bg-green-500 text-white p-3 text-center z-50 animate-slide-down">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back online! Syncing {offlineActions.length} pending actions...</span>
          </div>
        </div>
      )}
    </OfflineContext.Provider>
  )
}
