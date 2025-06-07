"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ChatSupportPage() {
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send initial greeting message
  useEffect(() => {
    if (isInitialLoad && messages.length === 0) {
      setIsInitialLoad(false)
      setMessages([
        {
          id: "welcome-message",
          role: "assistant",
          content:
            "👋 Hello! I'm your SecureLife virtual assistant. How can I help you today with your insurance needs?",
        },
      ])
    }
  }, [isInitialLoad, messages.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Could you provide more details?",
        "That's a great question about your insurance policy. Let me explain how it works.",
        "I understand your concern. Here's what you need to know about filing a claim.",
        "Thank you for reaching out. I can definitely assist you with your insurance needs.",
        "I'll look into that for you right away. Is there anything else you'd like to know?",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: randomResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Chat Support</h1>
          <p className="mt-2 text-gray-600">Get instant help from our AI assistant or connect with a human agent</p>
        </div>

        <Card className="h-[70vh] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                <AvatarFallback className="bg-teal-100 text-teal-700">SL</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>SecureLife Assistant</CardTitle>
                <CardDescription>AI-powered support</CardDescription>
              </div>
            </div>
            <Separator className="mt-3" />
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pb-0">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role !== "user" && (
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                      <AvatarFallback className="bg-teal-100 text-teal-700">SL</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg p-3 ${message.role === "user" ? "bg-teal-600 text-white" : "bg-gray-100"}`}
                  >
                    <p>{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarFallback className="bg-teal-600 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Support Agent" />
                    <AvatarFallback className="bg-teal-100 text-teal-700">SL</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-gray-100 p-3">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-teal-600"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-teal-600"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-teal-600"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="pt-3">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input placeholder="Type your message..." value={input} onChange={handleInputChange} className="flex-1" />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need to speak with a human agent?{" "}
            <button className="text-teal-600 underline">Connect with a live agent</button>
          </p>
        </div>
      </div>
    </div>
  )
}
