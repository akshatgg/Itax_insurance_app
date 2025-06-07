"use client"
import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { offlineService, QueueKeys, CacheKeys } from "../services/offline-service"
import { notificationService } from "../services/notification-service"
import { useNetInfo } from "@react-native-community/netinfo"

// Mock data types
interface Policy {
  id: string
  name: string
  type: string
  coverageAmount: number
  premium: number
  startDate: string
  endDate: string
  status: string
}

interface Payment {
  id: string
  policyId: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  date?: string
}

interface Claim {
  id: string
  policyId: string
  amount: number
  date: string
  status: "pending" | "approved" | "rejected"
  description: string
}

interface DataContextType {
  policies: Policy[]
  payments: Payment[]
  claims: Claim[]
  isLoading: boolean
  refreshData: () => Promise<void>
  processPayment: (paymentId: string, paymentData: any, offline?: boolean) => Promise<void>
  submitClaim: (claimData: any, offline?: boolean) => Promise<string>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Mock data
const mockPolicies: Policy[] = [
  {
    id: "policy1",
    name: "Auto Insurance",
    type: "auto",
    coverageAmount: 500000,
    premium: 12000,
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    status: "active",
  },
  {
    id: "policy2",
    name: "Health Insurance",
    type: "health",
    coverageAmount: 1000000,
    premium: 24000,
    startDate: "2023-02-15",
    endDate: "2024-02-15",
    status: "active",
  },
  {
    id: "policy3",
    name: "Home Insurance",
    type: "home",
    coverageAmount: 2000000,
    premium: 18000,
    startDate: "2023-03-10",
    endDate: "2024-03-10",
    status: "active",
  },
]

const mockPayments: Payment[] = [
  {
    id: "payment1",
    policyId: "policy1",
    amount: 3000,
    dueDate: "2023-04-01",
    status: "paid",
    date: "2023-03-28",
  },
  {
    id: "payment2",
    policyId: "policy1",
    amount: 3000,
    dueDate: "2023-07-01",
    status: "paid",
    date: "2023-06-25",
  },
  {
    id: "payment3",
    policyId: "policy1",
    amount: 3000,
    dueDate: "2023-10-01",
    status: "paid",
    date: "2023-09-30",
  },
  {
    id: "payment4",
    policyId: "policy1",
    amount: 3000,
    dueDate: "2024-01-01",
    status: "pending",
  },
  {
    id: "payment5",
    policyId: "policy2",
    amount: 6000,
    dueDate: "2023-05-15",
    status: "paid",
    date: "2023-05-10",
  },
  {
    id: "payment6",
    policyId: "policy2",
    amount: 6000,
    dueDate: "2023-08-15",
    status: "paid",
    date: "2023-08-12",
  },
  {
    id: "payment7",
    policyId: "policy2",
    amount: 6000,
    dueDate: "2023-11-15",
    status: "pending",
  },
  {
    id: "payment8",
    policyId: "policy3",
    amount: 4500,
    dueDate: "2023-06-10",
    status: "paid",
    date: "2023-06-05",
  },
  {
    id: "payment9",
    policyId: "policy3",
    amount: 4500,
    dueDate: "2023-09-10",
    status: "paid",
    date: "2023-09-08",
  },
  {
    id: "payment10",
    policyId: "policy3",
    amount: 4500,
    dueDate: "2023-12-10",
    status: "pending",
  },
]

const mockClaims: Claim[] = [
  {
    id: "claim1",
    policyId: "policy1",
    amount: 25000,
    date: "2023-05-15",
    status: "approved",
    description: "Car accident repair",
  },
  {
    id: "claim2",
    policyId: "policy2",
    amount: 45000,
    date: "2023-07-20",
    status: "pending",
    description: "Hospital treatment",
  },
]

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const netInfo = useNetInfo()

  useEffect(() => {
    loadData()

    // Set up connectivity listener to refresh data when coming back online
    const unsubscribe = offlineService.addConnectivityListener((isConnected) => {
      if (isConnected) {
        refreshData()
      }
    })

    return unsubscribe
  }, [])

  const loadData = async () => {
    setIsLoading(true)

    try {
      // Try to load from cache first
      const cachedPolicies = await offlineService.getCache<Policy[]>(CacheKeys.POLICIES)
      const cachedPayments = await offlineService.getCache<Payment[]>(CacheKeys.PAYMENTS)
      const cachedClaims = await offlineService.getCache<Claim[]>(CacheKeys.CLAIMS)

      if (cachedPolicies) setPolicies(cachedPolicies)
      if (cachedPayments) setPayments(cachedPayments)
      if (cachedClaims) setClaims(cachedClaims)

      // If we're online, fetch fresh data
      if (netInfo.isConnected) {
        await fetchFreshData()
      } else if (!cachedPolicies) {
        // If offline and no cache, use mock data
        setPolicies(mockPolicies)
        setPayments(mockPayments)
        setClaims(mockClaims)

        // Cache the mock data
        await offlineService.setCache(CacheKeys.POLICIES, mockPolicies)
        await offlineService.setCache(CacheKeys.PAYMENTS, mockPayments)
        await offlineService.setCache(CacheKeys.CLAIMS, mockClaims)
      }
    } catch (error) {
      console.error("Error loading data:", error)

      // Fallback to mock data
      setPolicies(mockPolicies)
      setPayments(mockPayments)
      setClaims(mockClaims)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFreshData = async () => {
    // In a real app, this would fetch from an API
    // For now, we'll simulate a network request with mock data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPolicies(mockPolicies)
    setPayments(mockPayments)
    setClaims(mockClaims)

    // Cache the fresh data
    await offlineService.setCache(CacheKeys.POLICIES, mockPolicies)
    await offlineService.setCache(CacheKeys.PAYMENTS, mockPayments)
    await offlineService.setCache(CacheKeys.CLAIMS, mockClaims)

    // Send a notification about new data
    notificationService.addNotification({
      title: "Data Updated",
      body: "Your insurance information has been refreshed with the latest data.",
    })
  }

  const refreshData = async () => {
    if (!netInfo.isConnected) {
      notificationService.addNotification({
        title: "Offline Mode",
        body: "You're currently offline. Data will be refreshed when you're back online.",
      })
      return
    }

    setIsLoading(true)

    try {
      await fetchFreshData()
    } catch (error) {
      console.error("Error refreshing data:", error)

      notificationService.addNotification({
        title: "Refresh Failed",
        body: "There was an error refreshing your data. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const processPayment = async (paymentId: string, paymentData: any, offline = false) => {
    if (!netInfo.isConnected && !offline) {
      // If we're offline and not explicitly handling it, queue the payment
      await offlineService.addToQueue(QueueKeys.PAYMENT, "process", {
        paymentId,
        ...paymentData,
      })

      notificationService.addNotification({
        title: "Payment Queued",
        body: "Your payment will be processed when you're back online.",
      })

      return
    }

    if (offline) {
      // Store in offline queue for later processing
      await offlineService.addToQueue(QueueKeys.PAYMENT, "process", {
        paymentId,
        ...paymentData,
      })

      // Update local state to reflect the pending payment
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === paymentId ? { ...payment, status: "pending", offlineQueued: true } : payment,
        ),
      )

      return
    }

    // In a real app, this would call an API
    // For now, we'll simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Update local state
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "paid", date: new Date().toISOString() } : payment,
      ),
    )

    // Update cache
    const updatedPayments = payments.map((payment) =>
      payment.id === paymentId ? { ...payment, status: "paid", date: new Date().toISOString() } : payment,
    )
    await offlineService.setCache(CacheKeys.PAYMENTS, updatedPayments)

    // Send a notification
    notificationService.addNotification({
      title: "Payment Successful",
      body: `Your payment of ₹${paymentData.amount.toLocaleString("en-IN")} has been processed successfully.`,
    })
  }

  const submitClaim = async (claimData: any, offline = false) => {
    if (!netInfo.isConnected && !offline) {
      // If we're offline and not explicitly handling it, queue the claim
      const queueId = await offlineService.addToQueue(QueueKeys.CLAIM, "create", claimData)

      notificationService.addNotification({
        title: "Claim Queued",
        body: "Your claim will be submitted when you're back online.",
      })

      return queueId
    }

    const claimId = `claim${Date.now()}`

    if (offline) {
      // Store in offline queue for later processing
      await offlineService.addToQueue(QueueKeys.CLAIM, "create", {
        id: claimId,
        ...claimData,
      })

      // Update local state to reflect the pending claim
      const newClaim: Claim = {
        id: claimId,
        policyId: claimData.policyId,
        amount: claimData.amount,
        date: new Date().toISOString(),
        status: "pending",
        description: claimData.description,
      }

      setClaims((prev) => [...prev, newClaim])

      // Update cache
      await offlineService.setCache(CacheKeys.CLAIMS, [...claims, newClaim])

      return claimId
    }

    // In a real app, this would call an API
    // For now, we'll simulate a network request
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create new claim
    const newClaim: Claim = {
      id: claimId,
      policyId: claimData.policyId,
      amount: claimData.amount,
      date: new Date().toISOString(),
      status: "pending",
      description: claimData.description,
    }

    // Update local state
    setClaims((prev) => [...prev, newClaim])

    // Update cache
    await offlineService.setCache(CacheKeys.CLAIMS, [...claims, newClaim])

    // Send a notification
    notificationService.addNotification({
      title: "Claim Submitted",
      body: `Your claim for ₹${claimData.amount.toLocaleString("en-IN")} has been submitted successfully.`,
    })

    return claimId
  }

  const value = {
    policies,
    payments,
    claims,
    isLoading,
    refreshData,
    processPayment,
    submitClaim,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
