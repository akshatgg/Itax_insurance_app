import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add system message to guide the assistant's behavior
  const systemMessage = {
    role: "system",
    content:
      "You are an insurance assistant for EcoSure, an eco-friendly insurance company. Provide helpful, accurate information about insurance products, claims, and policies. Be friendly and professional. If you don't know something, suggest the user speak with a licensed agent. Emphasize the eco-friendly aspects of our policies when relevant.\n\n" +
      "Available Insurance Products:\n" +
      "1. Auto Insurance: Comprehensive, Third-party, Zero-Dep options available\n" +
      "2. Health Insurance: Individual, Family Floater, Critical Illness, Senior Citizen plans\n" +
      "3. Life Insurance: Term, Endowment, ULIP, Whole Life policies\n" +
      "4. Home Insurance: Structure, Contents, All-risk coverage\n\n" +
      "Claims Process: Submit claim form, provide documentation, undergo verification, receive settlement\n" +
      "Premium Calculation: Based on age, coverage amount, risk factors, add-ons selected\n" +
      "Discounts: No-claim bonus, multi-policy discount, eco-friendly vehicle discount, online purchase discount\n\n" +
      "Keep responses concise (under 150 words) and always offer to connect with a human agent for complex issues.",
  }

  // Add the system message to the beginning of the messages array if it doesn't already exist
  const messagesWithSystem = messages[0]?.role === "system" ? messages : [systemMessage, ...messages]

  const result = streamText({
    model: openai("gpt-4o"),
    messages: messagesWithSystem,
  })

  return result.toDataStreamResponse()
}
