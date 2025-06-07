"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import Constants from "expo-constants"
import { Platform } from "react-native"
import firebase from "firebase/app"
import "firebase/firestore"
import { useAuth } from "./AuthContext"

type Notification = {
  id: string
  title: string
  body: string
  data?: any
  read: boolean
  createdAt: firebase.firestore.Timestamp
}

type NotificationContextType = {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  sendPushNotification: (title: string, body: string, data?: any) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      // Handle received notification
      console.log("Notification received:", notification)
    })

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      // Handle notification response (user tapped on notification)
      console.log("Notification response:", response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setIsLoading(false)
      return
    }

    const fetchNotifications = async () => {
      setIsLoading(true)
      try {
        // Save the push token to the user's document if it exists
        if (expoPushToken) {
          await firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .update({
              pushTokens: firebase.firestore.FieldValue.arrayUnion(expoPushToken),
            })
        }

        // Set up listener for notifications
        const unsubscribe = firebase
          .firestore()
          .collection("notifications")
          .where("userId", "==", user.id)
          .orderBy("createdAt", "desc")
          .onSnapshot((snapshot) => {
            const notificationsList: Notification[] = []
            snapshot.forEach((doc) => {
              notificationsList.push({ id: doc.id, ...doc.data() } as Notification)
            })
            setNotifications(notificationsList)
            setIsLoading(false)
          })

        return unsubscribe
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setIsLoading(false)
      }
    }

    const unsubscribe = fetchNotifications()
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe()
      }
    }
  }, [user, expoPushToken])

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const markAsRead = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await firebase.firestore().collection("notifications").doc(id).update({
        read: true,
      })

      setNotifications(
        notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      )
    } catch (error) {
      throw error
    }
  }

  const markAllAsRead = async (): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const batch = firebase.firestore().batch()

      notifications
        .filter((notification) => !notification.read)
        .forEach((notification) => {
          const notificationRef = firebase.firestore().collection("notifications").doc(notification.id)
          batch.update(notificationRef, { read: true })
        })

      await batch.commit()

      setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    } catch (error) {
      throw error
    }
  }

  const deleteNotification = async (id: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      await firebase.firestore().collection("notifications").doc(id).delete()
      setNotifications(notifications.filter((notification) => notification.id !== id))
    } catch (error) {
      throw error
    }
  }

  const clearAllNotifications = async (): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const batch = firebase.firestore().batch()

      notifications.forEach((notification) => {
        const notificationRef = firebase.firestore().collection("notifications").doc(notification.id)
        batch.delete(notificationRef)
      })

      await batch.commit()

      setNotifications([])
    } catch (error) {
      throw error
    }
  }

  const sendPushNotification = async (title: string, body: string, data?: any): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      // First, save the notification to Firestore
      await firebase.firestore().collection("notifications").add({
        userId: user.id,
        title,
        body,
        data,
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })

      // Then, send the push notification if we have a token
      if (expoPushToken) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: data || {},
          },
          trigger: null, // Immediate delivery
        })
      }
    } catch (error) {
      throw error
    }
  }

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    sendPushNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#14B8A6",
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data
  } else {
    console.log("Must use physical device for Push Notifications")
  }

  return token
}
