import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"

// Queue keys
const PAYMENT_QUEUE_KEY = "offline_payment_queue"
const CLAIM_QUEUE_KEY = "offline_claim_queue"
const PROFILE_QUEUE_KEY = "offline_profile_queue"
const POLICY_QUEUE_KEY = "offline_policy_queue"

// Cache keys
const POLICIES_CACHE_KEY = "policies_cache"
const PAYMENTS_CACHE_KEY = "payments_cache"
const CLAIMS_CACHE_KEY = "claims_cache"
const USER_CACHE_KEY = "user_cache"

export interface QueueItem {
  id: string
  action: string
  data: any
  timestamp: number
  retryCount: number
}

class OfflineService {
  private isOnline = true
  private isProcessing = false
  private listeners: Array<(status: boolean) => void> = []

  constructor() {
    this.setupNetworkListener()
  }

  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline
      this.isOnline = state.isConnected !== null ? state.isConnected : false

      // Notify listeners of status change
      if (wasOffline && this.isOnline) {
        this.notifyListeners(true)
        this.processQueues()
      } else if (!wasOffline && !this.isOnline) {
        this.notifyListeners(false)
      }
    })
  }

  private notifyListeners(status: boolean) {
    this.listeners.forEach((listener) => listener(status))
  }

  public addConnectivityListener(listener: (status: boolean) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  public isConnected(): boolean {
    return this.isOnline
  }

  // Queue management
  public async addToQueue(queueKey: string, action: string, data: any): Promise<string> {
    try {
      const queue = await this.getQueue(queueKey)
      const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newItem: QueueItem = {
        id,
        action,
        data,
        timestamp: Date.now(),
        retryCount: 0,
      }

      queue.push(newItem)
      await AsyncStorage.setItem(queueKey, JSON.stringify(queue))

      // If we're online, try to process immediately
      if (this.isOnline && !this.isProcessing) {
        this.processQueues()
      }

      return id
    } catch (error) {
      console.error(`Error adding to queue ${queueKey}:`, error)
      throw error
    }
  }

  private async getQueue(queueKey: string): Promise<QueueItem[]> {
    try {
      const queueData = await AsyncStorage.getItem(queueKey)
      return queueData ? JSON.parse(queueData) : []
    } catch (error) {
      console.error(`Error getting queue ${queueKey}:`, error)
      return []
    }
  }

  public async removeFromQueue(queueKey: string, id: string): Promise<void> {
    try {
      const queue = await this.getQueue(queueKey)
      const updatedQueue = queue.filter((item) => item.id !== id)
      await AsyncStorage.setItem(queueKey, JSON.stringify(updatedQueue))
    } catch (error) {
      console.error(`Error removing from queue ${queueKey}:`, error)
    }
  }

  public async getQueueSize(queueKey: string): Promise<number> {
    const queue = await this.getQueue(queueKey)
    return queue.length
  }

  public async getTotalQueueSize(): Promise<number> {
    const paymentQueueSize = await this.getQueueSize(PAYMENT_QUEUE_KEY)
    const claimQueueSize = await this.getQueueSize(CLAIM_QUEUE_KEY)
    const profileQueueSize = await this.getQueueSize(PROFILE_QUEUE_KEY)
    const policyQueueSize = await this.getQueueSize(POLICY_QUEUE_KEY)

    return paymentQueueSize + claimQueueSize + profileQueueSize + policyQueueSize
  }

  // Cache management
  public async setCache<T>(key: string, data: T, expiryMinutes = 60): Promise<void> {
    try {
      const cacheItem = {
        data,
        expiry: Date.now() + expiryMinutes * 60 * 1000,
      }
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem))
    } catch (error) {
      console.error(`Error setting cache ${key}:`, error)
    }
  }

  public async getCache<T>(key: string): Promise<T | null> {
    try {
      const cacheData = await AsyncStorage.getItem(key)
      if (!cacheData) return null

      const cacheItem = JSON.parse(cacheData)

      // Check if cache has expired
      if (cacheItem.expiry < Date.now()) {
        await AsyncStorage.removeItem(key)
        return null
      }

      return cacheItem.data as T
    } catch (error) {
      console.error(`Error getting cache ${key}:`, error)
      return null
    }
  }

  public async clearCache(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error clearing cache ${key}:`, error)
    }
  }

  public async clearAllCaches(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([POLICIES_CACHE_KEY, PAYMENTS_CACHE_KEY, CLAIMS_CACHE_KEY, USER_CACHE_KEY])
    } catch (error) {
      console.error("Error clearing all caches:", error)
    }
  }

  // Queue processing
  private async processQueues() {
    if (!this.isOnline || this.isProcessing) return

    this.isProcessing = true

    try {
      await this.processQueue(PAYMENT_QUEUE_KEY, this.processPaymentItem.bind(this))
      await this.processQueue(CLAIM_QUEUE_KEY, this.processClaimItem.bind(this))
      await this.processQueue(PROFILE_QUEUE_KEY, this.processProfileItem.bind(this))
      await this.processQueue(POLICY_QUEUE_KEY, this.processPolicyItem.bind(this))
    } catch (error) {
      console.error("Error processing queues:", error)
    } finally {
      this.isProcessing = false
    }
  }

  private async processQueue(queueKey: string, processor: (item: QueueItem) => Promise<boolean>) {
    const queue = await this.getQueue(queueKey)
    if (queue.length === 0) return

    const updatedQueue: QueueItem[] = []

    for (const item of queue) {
      try {
        const success = await processor(item)

        if (!success) {
          // If processing failed, increment retry count and keep in queue
          if (item.retryCount < 3) {
            updatedQueue.push({
              ...item,
              retryCount: item.retryCount + 1,
            })
          } else {
            // TODO: Handle permanent failures (e.g., notify user)
            console.warn(`Item ${item.id} failed processing after 3 attempts`)
          }
        }
      } catch (error) {
        console.error(`Error processing queue item ${item.id}:`, error)
        updatedQueue.push({
          ...item,
          retryCount: item.retryCount + 1,
        })
      }
    }

    await AsyncStorage.setItem(queueKey, JSON.stringify(updatedQueue))
  }

  private async processPaymentItem(item: QueueItem): Promise<boolean> {
    // This would call your API service to process the payment
    // For now, we'll just simulate success
    console.log("Processing payment item:", item)
    return true
  }

  private async processClaimItem(item: QueueItem): Promise<boolean> {
    // This would call your API service to process the claim
    console.log("Processing claim item:", item)
    return true
  }

  private async processProfileItem(item: QueueItem): Promise<boolean> {
    // This would call your API service to update profile
    console.log("Processing profile item:", item)
    return true
  }

  private async processPolicyItem(item: QueueItem): Promise<boolean> {
    // This would call your API service to update policy
    console.log("Processing policy item:", item)
    return true
  }
}

export const offlineService = new OfflineService()

// Export queue keys for use in other services
export const QueueKeys = {
  PAYMENT: PAYMENT_QUEUE_KEY,
  CLAIM: CLAIM_QUEUE_KEY,
  PROFILE: PROFILE_QUEUE_KEY,
  POLICY: POLICY_QUEUE_KEY,
}

// Export cache keys for use in other services
export const CacheKeys = {
  POLICIES: POLICIES_CACHE_KEY,
  PAYMENTS: PAYMENTS_CACHE_KEY,
  CLAIMS: CLAIMS_CACHE_KEY,
  USER: USER_CACHE_KEY,
}
