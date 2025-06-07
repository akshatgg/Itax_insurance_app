"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Check, X } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Premium Due Reminder",
      message: "Your life insurance premium of ₹5,000 is due on 15th June",
      time: "2 hours ago",
      read: false,
      type: "payment",
    },
    {
      id: 2,
      title: "Claim Approved",
      message: "Your health insurance claim of ₹25,000 has been approved",
      time: "1 day ago",
      read: false,
      type: "claim",
    },
    {
      id: 3,
      title: "Policy Renewal",
      message: "Your auto insurance policy will expire in 30 days",
      time: "3 days ago",
      read: true,
      type: "policy",
    },
    {
      id: 4,
      title: "Welcome to EcoSure",
      message: "Thank you for choosing EcoSure Insurance. Your journey starts here!",
      time: "1 week ago",
      read: true,
      type: "welcome",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return "💳"
      case "claim":
        return "✅"
      case "policy":
        return "📋"
      case "welcome":
        return "🎉"
      default:
        return "🔔"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-semibold text-lg">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount} new</span>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No notifications</h3>
            <p className="text-gray-400">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-4 ${!notification.read ? "border-l-4 border-l-teal-500" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
              className="text-teal-600 font-medium hover:text-teal-700"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
