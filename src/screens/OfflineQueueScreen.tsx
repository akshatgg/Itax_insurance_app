"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { useTheme } from "../context/ThemeContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import { Ionicons } from "@expo/vector-icons"
import { offlineService, QueueKeys, type QueueItem } from "../services/offline-service"
import { format } from "date-fns"
import Button from "../components/Button"
import { useNetInfo } from "@react-native-community/netinfo"

const OfflineQueueScreen = () => {
  const { theme } = useTheme()
  const netInfo = useNetInfo()
  const [isLoading, setIsLoading] = useState(true)
  const [queueItems, setQueueItems] = useState<(QueueItem & { queueType: string })[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadQueueItems()

    // Set up connectivity listener
    const unsubscribe = offlineService.addConnectivityListener((isConnected) => {
      if (isConnected) {
        loadQueueItems()
      }
    })

    return unsubscribe
  }, [])

  const loadQueueItems = async () => {
    setIsLoading(true)

    try {
      const paymentQueue = await offlineService.getQueue(QueueKeys.PAYMENT)
      const claimQueue = await offlineService.getQueue(QueueKeys.CLAIM)
      const profileQueue = await offlineService.getQueue(QueueKeys.PROFILE)
      const policyQueue = await offlineService.getQueue(QueueKeys.POLICY)

      const allItems = [
        ...paymentQueue.map((item) => ({ ...item, queueType: "payment" })),
        ...claimQueue.map((item) => ({ ...item, queueType: "claim" })),
        ...profileQueue.map((item) => ({ ...item, queueType: "profile" })),
        ...policyQueue.map((item) => ({ ...item, queueType: "policy" })),
      ].sort((a, b) => b.timestamp - a.timestamp)

      setQueueItems(allItems)
    } catch (error) {
      console.error("Error loading queue items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProcessAll = async () => {
    if (!netInfo.isConnected) {
      // Show error or toast that we need internet connection
      return
    }

    setIsProcessing(true)

    try {
      // This would trigger processing of all queues
      // In a real app, you'd have more sophisticated logic here
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await loadQueueItems()
    } catch (error) {
      console.error("Error processing queues:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getQueueTypeIcon = (queueType: string) => {
    switch (queueType) {
      case "payment":
        return "card-outline"
      case "claim":
        return "document-text-outline"
      case "profile":
        return "person-outline"
      case "policy":
        return "shield-outline"
      default:
        return "ellipsis-horizontal-outline"
    }
  }

  const getQueueTypeLabel = (queueType: string) => {
    switch (queueType) {
      case "payment":
        return "Payment"
      case "claim":
        return "Claim"
      case "profile":
        return "Profile Update"
      case "policy":
        return "Policy Update"
      default:
        return "Unknown"
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create":
        return "Create"
      case "update":
        return "Update"
      case "delete":
        return "Delete"
      case "process":
        return "Process"
      default:
        return action
    }
  }

  const renderQueueItem = ({ item }: { item: QueueItem & { queueType: string } }) => {
    return (
      <View style={[styles.queueItem, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.queueTypeIcon, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Ionicons name={getQueueTypeIcon(item.queueType)} size={24} color={theme.colors.primary} />
        </View>

        <View style={styles.queueItemContent}>
          <Text style={[styles.queueItemTitle, { color: theme.colors.text }]}>
            {getQueueTypeLabel(item.queueType)}: {getActionLabel(item.action)}
          </Text>

          <Text style={[styles.queueItemTime, { color: theme.colors.gray[500] }]}>
            {format(new Date(item.timestamp), "MMM d, yyyy h:mm a")}
          </Text>

          {item.retryCount > 0 && (
            <Text style={[styles.retryText, { color: theme.colors.warning }]}>Retry attempts: {item.retryCount}/3</Text>
          )}
        </View>

        <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={64} color={theme.colors.success} />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>No pending offline actions</Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.gray[500] }]}>
        All your actions have been synchronized
      </Text>
    </View>
  )

  return (
    <ResponsiveLayout>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Offline Queue
        </Text>

        {queueItems.length > 0 && netInfo.isConnected && (
          <Button
            title="Process All"
            onPress={handleProcessAll}
            loading={isProcessing}
            disabled={isProcessing}
            size="small"
          />
        )}
      </View>

      {!netInfo.isConnected && (
        <View style={[styles.offlineNotice, { backgroundColor: theme.colors.warning + "20" }]}>
          <Ionicons name="cloud-offline-outline" size={20} color={theme.colors.warning} />
          <Text style={[styles.offlineText, { color: theme.colors.text }]}>
            You're currently offline. Connect to the internet to process pending actions.
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.gray[600] }]}>Loading queue items...</Text>
        </View>
      ) : queueItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={queueItems}
          keyExtractor={(item) => `${item.queueType}-${item.id}`}
          renderItem={renderQueueItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => (
            <View style={[styles.separator, { backgroundColor: theme.colors.gray[200] }]} />
          )}
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
  listContent: {
    flexGrow: 1,
  },
  queueItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  queueTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  queueItemContent: {
    flex: 1,
  },
  queueItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  queueItemTime: {
    fontSize: 12,
  },
  retryText: {
    fontSize: 12,
    marginTop: 4,
  },
  separator: {
    height: 1,
    marginLeft: 64,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  offlineNotice: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  offlineText: {
    marginLeft: 8,
    flex: 1,
  },
})

export default OfflineQueueScreen
