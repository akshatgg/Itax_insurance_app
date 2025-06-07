"use client"

import { useState } from "react"

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your insurance assistant. How can I help you today?", sender: "bot" },
  ])
  const [input, setInput] = useState("")

  const quickQuestions = [
    "What insurance do I need?",
    "How to file a claim?",
    "Premium calculation help",
    "Policy renewal process",
  ]

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = { id: Date.now(), text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        sender: "bot",
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInput("")
  }

  const getBotResponse = (question: string) => {
    const responses = {
      insurance:
        "We offer Auto, Health, Life, and Home insurance. Each provides comprehensive coverage tailored to your needs.",
      claim:
        "To file a claim, visit our claims section, fill out the form with incident details, and upload required documents.",
      premium: "Premium depends on coverage amount, age, and risk factors. Use our calculator for instant estimates.",
      renewal: "You'll receive renewal notices 30 days before expiry. You can renew online through our portal.",
    }

    for (const [key, response] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return response
      }
    }

    return "I understand you're asking about insurance. Could you please be more specific? I can help with policies, claims, premiums, and renewals."
  }

  return (
    <div className="container">
      <div className="chat-container">
        <h1>Insurance Support Chat</h1>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
        </div>

        <div className="quick-questions">
          <h4>Quick Questions:</h4>
          <div className="questions-grid">
            {quickQuestions.map((question, index) => (
              <button key={index} onClick={() => setInput(question)} className="quick-question">
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
