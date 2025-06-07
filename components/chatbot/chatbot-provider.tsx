"use client"

import { ChatInterface } from "./chat-interface"
import { useState, useEffect } from "react"

export function ChatbotProvider() {
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <ChatInterface />
}
