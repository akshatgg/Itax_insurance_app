"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { Bell, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "warning"
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  removeNotification: (id: string) => void
  requestPermission: () => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permission, setPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Check current permission status
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }

    // Simulate some notifications
    const timer = setTimeout(() => {
      addNotification({
        title: "Welcome to EcoSure!",
        message: "Your insurance journey starts here.",
        type: "success",
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === "granted"
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show browser notification if permission granted
    if (permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
      })
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        requestPermission,
      }}
    >
      {children}

      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 animate-slide-in ${
              notification.type === "success"
                ? "border-l-4 border-green-500"
                : notification.type === "error"
                  ? "border-l-4 border-red-500"
                  : notification.type === "warning"
                    ? "border-l-4 border-yellow-500"
                    : "border-l-4 border-blue-500"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Bell
                    className={`h-5 w-5 ${
                      notification.type === "success"
                        ? "text-green-500"
                        : notification.type === "error"
                          ? "text-red-500"
                          : notification.type === "warning"
                            ? "text-yellow-500"
                            : "text-blue-500"
                    }`}
                  />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
