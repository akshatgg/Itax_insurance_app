"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, ArrowDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useChat } from "ai/react"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
}

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "👋 Hello! I'm your EcoSure AI assistant. How can I help you with your insurance needs today?",
      },
    ],
  })

  // Suggested questions for quick replies
  const suggestedQuestions = [
    "What insurance plans do you offer?",
    "How do I file a claim?",
    "How is my premium calculated?",
    "What discounts are available?",
    "How long does claim processing take?",
  ]

  // Handle scroll behavior
  useEffect(() => {
    const checkScroll = () => {
      if (!chatContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
      setShowScrollButton(isScrolledUp && messages.length > 3)
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      return () => container.removeEventListener("scroll", checkScroll)
    }
  }, [messages.length])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isLoading && messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isOpen])

  // Handle quick reply selection
  const handleQuickReply = (question: string) => {
    const fakeEvent = {
      preventDefault: () => {},
      currentTarget: {
        elements: {
          message: { value: question },
        },
      },
    } as unknown as React.FormEvent<HTMLFormElement>

    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => handleSubmit(fakeEvent), 100)
  }

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-teal-600 hover:bg-teal-700"
          size="icon"
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat interface */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-xl flex flex-col z-50 border-teal-200">
          <CardHeader className="bg-teal-600 text-white py-3 px-4 flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarImage src="/support-agent.png" alt="AI Assistant" />
                <AvatarFallback className="bg-teal-700">AI</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">EcoSure Assistant</h3>
                <p className="text-xs text-teal-100">Online</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-teal-700 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            <div ref={chatContainerRef} className="flex-1 flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 max-w-[90%]", message.role === "user" ? "ml-auto flex-row-reverse" : "")}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src="/support-agent.png" alt="AI Assistant" />
                      <AvatarFallback className="bg-teal-100 text-teal-700">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.role === "user" ? "bg-teal-600 text-white rounded-tr-none" : "bg-gray-100 rounded-tl-none",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-blue-600 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[90%]">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src="/support-agent.png" alt="AI Assistant" />
                    <AvatarFallback className="bg-teal-100 text-teal-700">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg rounded-tl-none p-4 flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  Sorry, there was an error processing your request. Please try again.
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {showScrollButton && (
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-[80px] right-4 h-8 w-8 rounded-full shadow-md border-teal-200"
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}

          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-teal-50 transition-colors py-1"
                    onClick={() => handleQuickReply(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <CardFooter className="p-3 pt-2">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1 focus-visible:ring-teal-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
