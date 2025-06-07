import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import Constants from "expo-constants"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export interface PushNotification {
  id: string
  title: string
  body: string
  data?: any
  read: boolean
  timestamp: number
}

class NotificationService {
  private pushToken: string | null = null
  private notifications: PushNotification[] = []
  private listeners: Array<(notifications: PushNotification[]) => void> = []
  private notificationListener: any = null
  private responseListener: any = null

  constructor() {
    this.initialize()
  }

  private async initialize() {
    // Load saved notifications
    await this.loadNotifications()

    // Register for push notifications
    await this.registerForPushNotifications()

    // Set up notification listeners
    this.setupNotificationListeners()
  }

  private async loadNotifications() {
    try {
      const savedNotifications = await AsyncStorage.getItem("notifications")
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications)
        this.notifyListeners()
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  private async saveNotifications() {
    try {
      await AsyncStorage.setItem("notifications", JSON.stringify(this.notifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]))
  }

  public addNotificationListener(listener: (notifications: PushNotification[]) => void) {
    this.listeners.push(listener)
    // Immediately notify with current state
    listener([...this.notifications])

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private async registerForPushNotifications() {
    if (!Device.isDevice) {
      console.log("Push notifications are not available in the simulator")
      return
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== "granted") {
        console.log("Permission not granted for push notifications")
        return
      }

      // Get the token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })

      this.pushToken = tokenData.data

      // Save the token to AsyncStorage
      await AsyncStorage.setItem("pushToken", this.pushToken)

      // Platform-specific setup
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        })
      }

      console.log("Push notification token:", this.pushToken)
    } catch (error) {
      console.error("Error registering for push notifications:", error)
    }
  }

  private setupNotificationListeners() {
    // Handle received notifications
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification)
      this.addNotification({
        id: notification.request.identifier,
        title: notification.request.content.title || "New Notification",
        body: notification.request.content.body || "",
        data: notification.request.content.data,
        read: false,
        timestamp: Date.now(),
      })
    })

    // Handle notification responses (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response:", response)
      // Mark as read when tapped
      this.markAsRead(response.notification.request.identifier)

      // Handle navigation or other actions based on notification data
      // This would typically involve navigation to a specific screen
    })
  }

  public cleanup() {
    // Remove notification listeners
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener)
    }

    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener)
    }
  }

  // Add a new notification
  public addNotification(
    notification: Omit<PushNotification, "id" | "timestamp" | "read"> & {
      id?: string
      timestamp?: number
      read?: boolean
    },
  ) {
    const newNotification: PushNotification = {
      id: notification.id || `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      read: notification.read || false,
      timestamp: notification.timestamp || Date.now(),
    }

    this.notifications = [newNotification, ...this.notifications]
    this.saveNotifications()
    this.notifyListeners()

    return newNotification.id
  }

  // Mark a notification as read
  public markAsRead(id: string) {
    this.notifications = this.notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )
    this.saveNotifications()
    this.notifyListeners()
  }

  // Mark all notifications as read
  public markAllAsRead() {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }))
    this.saveNotifications()
    this.notifyListeners()
  }

  // Remove a notification
  public removeNotification(id: string) {
    this.notifications = this.notifications.filter((notification) => notification.id !== id)
    this.saveNotifications()
    this.notifyListeners()
  }

  // Clear all notifications
  public clearAllNotifications() {
    this.notifications = []
    this.saveNotifications()
    this.notifyListeners()
  }

  // Get all notifications
  public getNotifications(): PushNotification[] {
    return [...this.notifications]
  }

  // Get unread notifications count
  public getUnreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length
  }

  // Schedule a local notification
  public async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {},
    trigger: Notifications.NotificationTriggerInput = null,
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      })

      return notificationId
    } catch (error) {
      console.error("Error scheduling notification:", error)
      throw error
    }
  }

  // Cancel a scheduled notification
  public async cancelScheduledNotification(id: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(id)
    } catch (error) {
      console.error(`Error canceling notification ${id}:`, error)
      throw error
    }
  }

  // Get the push token
  public getPushToken(): string | null {
    return this.pushToken
  }
}

export const notificationService = new NotificationService()
