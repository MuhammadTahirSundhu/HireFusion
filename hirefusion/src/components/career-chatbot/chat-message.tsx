"use client"

import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"
import type { Message } from "./index"

type MessageProps = {
  message: Message
  isStreaming: boolean
  botAvatar: string
}

export default function ChatMessage({ message, isStreaming, botAvatar }: MessageProps) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)

  // Animation on mount
  useEffect(() => {
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setCursorVisible((prev) => !prev)
      }, 500)
      return () => clearInterval(interval)
    } else {
      setCursorVisible(false)
    }
  }, [isStreaming])

  // Set the displayed content
  useEffect(() => {
    setDisplayedContent(message.content)
  }, [message.content])

  const isUser = message.role === "user"

  return (
    <div
      ref={messageRef}
      className={`career-chatbot-message ${isUser ? "career-chatbot-message-user" : "career-chatbot-message-bot"} ${
        isVisible ? (isUser ? "message-out" : "message-in") : "career-chatbot-message-hidden"
      }`}
      style={{ animationDelay: "50ms" }}
    >
      <div
        className={`career-chatbot-message-content ${isUser ? "career-chatbot-message-content-user" : "career-chatbot-message-content-bot"}`}
      >
        <div
          className={`career-chatbot-message-avatar ${isUser ? "career-chatbot-message-avatar-user" : "career-chatbot-message-avatar-bot"}`}
        >
          {isUser ? (
            <div className="career-chatbot-user-avatar">
              <User className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="career-chatbot-bot-avatar">
              <img src={botAvatar || "/placeholder.svg"} alt="Bot Avatar" className="career-chatbot-avatar-img" />
            </div>
          )}
        </div>

        <div
          className={`career-chatbot-message-bubble ${isUser ? "career-chatbot-message-bubble-user" : "career-chatbot-message-bubble-bot"}`}
        >
          <div className="career-chatbot-message-text">
            {displayedContent}
            {isStreaming && cursorVisible && <span className="career-chatbot-cursor"></span>}
          </div>
        </div>
      </div>
    </div>
  )
}
