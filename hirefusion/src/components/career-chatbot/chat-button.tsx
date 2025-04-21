"use client"
import { useState } from "react"

type ChatButtonProps = {
  onClick: () => void
  isOpen: boolean
  isSignaling: boolean
  position: string
  botAvatar: string
}

export default function ChatButton({ onClick, isOpen, isSignaling, position, botAvatar }: ChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`career-chatbot-button ${position} ${
        isOpen ? "career-chatbot-button-open" : "career-chatbot-button-closed"
      } ${isHovered && !isOpen ? "career-chatbot-button-hovered" : ""} ${
        !isSignaling && !isHovered ? "" : "career-chatbot-button-signaling"
      }`}
    >
      {/* Bot icon with animation */}
      <div className="career-chatbot-button-content">
        {/* Signal waves */}
        {isSignaling && (
          <div className="career-chatbot-signal-waves">
            <div className="signal-wave wave-1"></div>
            <div className="signal-wave wave-2"></div>
            <div className="signal-wave wave-3"></div>
          </div>
        )}

        {/* Bot image with floating animation */}
        <div
          className={`career-chatbot-button-avatar ${isOpen ? "" : "animate-float"} ${
            isHovered && !isOpen ? "career-chatbot-button-avatar-hovered" : ""
          }`}
        >
          <img
            src={botAvatar || "/placeholder.svg"}
            alt="Bot Avatar"
            className={`career-chatbot-avatar-img ${isOpen ? "career-chatbot-avatar-img-open" : ""}`}
          />
        </div>
      </div>
    </button>
  )
}
