"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import { Ionicons } from "@expo/vector-icons"
import { notificationService, type PushNotification } from "../services/notification-service"
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns"
import { SwipeRow } from "react-native-swipe-list-view"
import Button from "../components/Button"

const NotificationsScreen = () => {
  const { theme } = useTheme()
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const unsubscribe = notificationService.addNotificationListener((updatedNotifications) => {
      setNotifications(updatedNotifications)
    })

    return unsubscribe
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    // In a real app, you might fetch new notifications from the server here
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const handleRemoveNotification = (id: string) => {
    const animation = new Animated.Value(1)

    Animated.timing(animation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      notificationService.removeNotification(id)
    })
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const handleClearAll = () => {
    notificationService.clearAllNotifications()
  }

  const formatNotificationDate = (timestamp: number) => {
    const date = new Date(timestamp)

    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true })
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "MMM d, yyyy")
    }
  }

  const renderNotificationItem = ({ item }: { item: PushNotification }) => {
    return (
      <SwipeRow rightOpenValue={-75} leftOpenValue={75} stopRightSwipe={-100} stopLeftSwipe={100}>
        {/* Hidden view (shown when swiped) */}
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={[styles.backLeftBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleMarkAsRead(item.id)}
          >
            <Ionicons name="checkmark" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backRightBtn, { backgroundColor: theme.colors.error }]}
            onPress={() => handleRemoveNotification(item.id)}
          >
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Visible view */}
        <TouchableOpacity
          style={[
            styles.notificationItem,
            { backgroundColor: theme.colors.background },
            !item.read && { borderLeftWidth: 4, borderLeftColor: theme.colors.primary },
          ]}
          onPress={() => handleMarkAsRead(item.id)}
        >
          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.notificationTitle,
                {
                  color: theme.colors.text,
                  fontFamily: item.read ? theme.typography.fontFamily.regular : theme.typography.fontFamily.medium,
                },
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>

            <Text style={[styles.notificationBody, { color: theme.colors.gray[600] }]} numberOfLines={2}>
              {item.body}
            </Text>

            <Text style={[styles.notificationTime, { color: theme.colors.gray[500] }]}>
              {formatNotificationDate(item.timestamp)}
            </Text>
          </View>

          {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.colors.primary }]} />}
        </TouchableOpacity>
      </SwipeRow>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off-outline" size={64} color={theme.colors.gray[400]} />
      <Text style={[styles.emptyText, { color: theme.colors.gray[600] }]}>No notifications yet</Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.gray[500] }]}>
        We'll notify you when something important happens
      </Text>
    </View>
  )

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionHeader, { color: theme.colors.gray[600] }]}>{title}</Text>
  )

  // Group notifications by date
  const todayNotifications = notifications.filter((n) => isToday(new Date(n.timestamp)))
  const yesterdayNotifications = notifications.filter((n) => isYesterday(new Date(n.timestamp)))
  const olderNotifications = notifications.filter(
    (n) => !isToday(new Date(n.timestamp)) && !isYesterday(new Date(n.timestamp)),
  )

  return (
    <ResponsiveLayout>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Notifications
        </Text>

        <View style={styles.headerButtons}>
          {notifications.some((n) => !n.read) && (
            <Button
              title="Mark All Read"
              onPress={handleMarkAllAsRead}
              variant="outline"
              size="small"
              style={{ marginRight: 8 }}
            />
          )}

          {notifications.length > 0 && (
            <Button title="Clear All" onPress={handleClearAll} variant="outline" size="small" />
          )}
        </View>
      </View>

      {notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={[
            ...(todayNotifications.length > 0 ? [{ isHeader: true, title: "Today" }] : []),
            ...todayNotifications,
            ...(yesterdayNotifications.length > 0 ? [{ isHeader: true, title: "Yesterday" }] : []),
            ...yesterdayNotifications,
            ...(olderNotifications.length > 0 ? [{ isHeader: true, title: "Earlier" }] : []),
            ...olderNotifications,
          ]}
          keyExtractor={(item) =>
            (item as any).isHeader ? `header-${(item as any).title}` : `notification-${(item as PushNotification).id}`
          }
          renderItem={({ item }) => {
            if ((item as any).isHeader) {
              return renderSectionHeader((item as any).title)
            }
            return renderNotificationItem({ item: item as PushNotification })
          }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
  },
  headerButtons: {
    flexDirection: "row",
  },
  listContent: {
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f5f5f5",
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  rowBack: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backLeftBtn: {
    width: 75,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  backRightBtn: {
    width: 75,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default NotificationsScreen
