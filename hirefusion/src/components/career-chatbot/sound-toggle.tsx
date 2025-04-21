"use client"

import { Volume2, VolumeX } from "lucide-react"

interface SoundToggleProps {
  muted: boolean
  toggleMute: () => void
  className?: string
}

export default function SoundToggle({ muted, toggleMute, className = "" }: SoundToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleMute()
      }}
      className={`career-chatbot-sound-toggle ${className}`}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {muted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
    </button>
  )
}
