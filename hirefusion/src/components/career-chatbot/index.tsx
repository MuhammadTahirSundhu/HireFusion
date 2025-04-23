"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Send, X } from "lucide-react"
import ChatMessage from "./chat-message"
import ChatButton from "./chat-button"
import SoundToggle from "./sound-toggle"
import { useMobile } from "./hooks/use-mobile"
import { useSoundEffects } from "./hooks/use-sound-effects"
import "./styles.css"

// Message type definition
export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  complete?: boolean
}

export interface CareerChatbotProps {
  /** API endpoint for chat requests (default: "/api/chat") */
  apiEndpoint?: string
  /** Initial state of the chat window (default: false) */
  initiallyOpen?: boolean
  /** Position of the chat button (default: "bottom-right") */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  /** Custom bot name (default: "Career Advisor") */
  botName?: string
  /** Path to bot avatar image (default: "/images/bot-avatar.png") */
  botAvatar?: string
  /** Initial messages to populate the chat (default: []) */
  initialMessages?: Message[]
  /** Whether sound effects are initially muted (default: false) */
  initialMuted?: boolean
  /** Custom theme colors */
  theme?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
  }
  /** Callback when a message is sent */
  onMessageSent?: (message: Message) => void
  /** Callback when a message is received */
  onMessageReceived?: (message: Message) => void
}

/**
 * CareerChatbot - A fully featured chatbot component that can be easily integrated into any website
 */
export default function CareerChatbot({
  apiEndpoint = "/api/chat",
  initiallyOpen = false,
  position = "bottom-right",
  botName = "Career Advisor",
  botAvatar = "/images/bot-avatar.png",
  initialMessages = [],
  initialMuted = false,
  theme = {},
  onMessageSent,
  onMessageReceived,
}: CareerChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(initiallyOpen)
  const [isFocused, setIsFocused] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Initialize sound effects
  const { playSound, muted, toggleMute, initialize, initialized, soundsLoaded } = useSoundEffects({
    initialMuted,
    basePath: "",
  })

  // Set position classes based on the position prop
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }

  const chatPositionClasses = {
    "bottom-right": "bottom-24 right-8",
    "bottom-left": "bottom-24 left-8",
    "top-right": "top-24 right-8",
    "top-left": "top-24 left-8",
  }

  // Apply custom theme if provided
  const themeStyles = {
    "--primary-color": theme.primary || "#00BFFF",
    "--secondary-color": theme.secondary || "#0077FF",
    "--background-color": theme.background || "#1E1E1E",
    "--text-color": theme.text || "#f3f4f6",
  } as React.CSSProperties

  // Initialize sound system on first user interaction
  useEffect(() => {
    if (!soundsLoaded) return

    const handleUserInteraction = () => {
      if (!initialized) {
        initialize()
      }
    }

    // Add event listeners for user interaction
    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [initialize, initialized, soundsLoaded])

  // Scroll to bottom of messages
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isChatOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isChatOpen])

  // Vibration effect during streaming
  useEffect(() => {
    let vibrationInterval: NodeJS.Timeout

    if (isStreaming && isMobile && "vibrate" in navigator) {
      // Vibrate every 2 seconds while streaming
      vibrationInterval = setInterval(() => {
        navigator.vibrate(20)
      }, 2000)
    }

    return () => {
      if (vibrationInterval) clearInterval(vibrationInterval)
    }
  }, [isStreaming, isMobile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Play message sent sound
    if (soundsLoaded && initialized) {
      playSound("messageSent")
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    // Create placeholder for assistant message
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      role: "assistant",
      complete: false,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsStreaming(true)

    // Call onMessageSent callback if provided
    if (onMessageSent) {
      onMessageSent(userMessage)
    }

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.body) throw new Error("Response body is null")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ""
      let isFirstChunk = true

      while (true) {
        const { value, done: doneReading } = await reader.read()
        if (doneReading) break

        if (value) {
          const chunkText = decoder.decode(value, { stream: true })
          // Split by newlines to handle multiple JSON objects
          const lines = chunkText.split("\n")

          for (const line of lines) {
            if (line.trim()) {
              try {
                const json = JSON.parse(line)
                if (json.message && json.message.content) {
                  accumulatedContent += json.message.content

                  // Play typing sound on first chunk
                  if (isFirstChunk && soundsLoaded && initialized) {
                    playSound("typing")
                    isFirstChunk = false
                  }

                  // Update the assistant message with the accumulated content
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id ? { ...m, content: accumulatedContent } : m
                    )
                  )
                }
                // Check if the stream is done
                if (json.done) {
                  break
                }
              } catch (error) {
                console.error("Error parsing JSON chunk:", error)
              }
            }
          }
        }
      }

      // Play message received sound when complete
      if (soundsLoaded && initialized) {
        playSound("messageReceived")
      }

      // Mark the message as complete
      const completedMessage = { ...assistantMessage, content: accumulatedContent, complete: true }
      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? completedMessage : m)))

      // Call onMessageReceived callback if provided
      if (onMessageReceived) {
        onMessageReceived(completedMessage)
      }
    } catch (error) {
      console.error("Error processing stream:", error)
      // Update the assistant message with an error
      const errorMessage = {
        ...assistantMessage,
        content: "Sorry, there was an error processing your request.",
        complete: true,
      }

      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? errorMessage : m)))

      // Call onMessageReceived callback with error message if provided
      if (onMessageReceived) {
        onMessageReceived(errorMessage)
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const toggleChat = () => {
    setIsChatOpen((prev) => {
      const newState = !prev
      // Play open/close sound
      if (soundsLoaded && initialized) {
        playSound(newState ? "chatOpen" : "chatClose")
      }
      return newState
    })
  }

  const handleButtonClick = () => {
    if (soundsLoaded && initialized) {
      playSound("buttonClick")
    }
  }

  return (
    <div className="career-chatbot-container" style={themeStyles}>
      {/* Chat button */}
      <ChatButton
        onClick={() => {
          handleButtonClick()
          toggleChat()
        }}
        isOpen={isChatOpen}
        isSignaling={!isChatOpen && messages.length > 0}
        position={positionClasses[position]}
        botAvatar={botAvatar}
      />

      {/* Chat interface */}
      <div
        ref={chatContainerRef}
        className={`career-chatbot-window ${chatPositionClasses[position]} ${
          isChatOpen ? "career-chatbot-window-open" : "career-chatbot-window-closed"
        }`}
      >
        {/* Chat header */}
        <div className="career-chatbot-header">
          <div className="career-chatbot-header-title">
            <div className="career-chatbot-avatar-small">
              <img src={botAvatar || "/placeholder.svg"} alt="Bot Avatar" className="career-chatbot-avatar-img" />
            </div>
            <h2 className="career-chatbot-title">{botName}</h2>
          </div>
          <div className="career-chatbot-header-actions">
            {soundsLoaded && <SoundToggle muted={muted} toggleMute={toggleMute} />}
            <button
              onClick={() => {
                handleButtonClick()
                toggleChat()
              }}
              className="career-chatbot-close-button"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="career-chatbot-messages">
          {messages.length === 0 ? (
            <div className="career-chatbot-empty-state">
              <div className="career-chatbot-avatar-large">
                <img src={botAvatar || "/placeholder.svg"} alt="Bot Avatar" className="career-chatbot-avatar-img" />
              </div>
              <h3 className="career-chatbot-empty-title">{botName}</h3>
              <p className="career-chatbot-empty-text">
                Ask me anything about career planning, resume building, interview preparation, or professional
                development.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isStreaming={isStreaming && !message.complete && message.role === "assistant"}
                botAvatar={botAvatar}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="career-chatbot-input-area">
          <form onSubmit={handleSubmit} className="career-chatbot-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                setIsFocused(true)
                if (input.length === 0 && soundsLoaded && initialized) {
                  playSound("typing")
                }
              }}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask about your career..."
              className={`career-chatbot-input ${isFocused ? "career-chatbot-input-focused" : ""}`}
              disabled={isStreaming}
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              onClick={handleButtonClick}
              className="career-chatbot-send-button"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          {isStreaming && (
            <div className="career-chatbot-typing-indicator">
              <span className="career-chatbot-typing-text">AI is thinking</span>
              <div className="career-chatbot-typing-dots">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}