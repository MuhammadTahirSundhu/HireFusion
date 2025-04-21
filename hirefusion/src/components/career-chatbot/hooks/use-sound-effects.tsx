"use client"

import { useState, useEffect, useCallback, useRef } from "react"

type SoundType = "messageSent" | "messageReceived" | "chatOpen" | "chatClose" | "buttonClick" | "typing"

interface SoundEffectsOptions {
  initialMuted?: boolean
  basePath?: string
}

export function useSoundEffects(options: SoundEffectsOptions = {}) {
  const { initialMuted = false, basePath = "" } = options

  const [muted, setMuted] = useState(initialMuted)
  const [initialized, setInitialized] = useState(false)
  const [volume, setVolume] = useState(0.5) // 50% volume by default
  const [soundsLoaded, setSoundsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Use refs to store audio elements to avoid recreating them on each render
  const audioRefs = useRef<Record<SoundType, HTMLAudioElement | null>>({
    messageSent: null,
    messageReceived: null,
    chatOpen: null,
    chatClose: null,
    buttonClick: null,
    typing: null,
  })

  // Sound file paths with fallbacks
  const soundPaths = {
    messageSent: `${basePath}/sounds/message-sent.mp3`,
    messageReceived: `${basePath}/sounds/message-received.mp3`,
    chatOpen: `${basePath}/sounds/chat-open.mp3`,
    chatClose: `${basePath}/sounds/chat-close.mp3`,
    buttonClick: `${basePath}/sounds/button-click.mp3`,
    typing: `${basePath}/sounds/typing.mp3`,
  }

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined") return

    // Function to load a sound with error handling
    const loadSound = (type: SoundType, path: string): Promise<HTMLAudioElement> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio()

        // Set up event handlers
        audio.addEventListener("canplaythrough", () => resolve(audio), { once: true })
        audio.addEventListener("error", (e) => {
          console.warn(`Failed to load sound: ${path}`, e)
          reject(e)
        })

        // Set audio properties
        audio.preload = "auto"
        audio.volume = volume
        audio.src = path
      })
    }

    // Load all sounds
    const loadAllSounds = async () => {
      try {
        // Create a dummy audio element to test if audio is supported
        const testAudio = new Audio()
        if (!testAudio.canPlayType) {
          console.warn("Audio playback not supported in this browser")
          setLoadError(true)
          return
        }

        // Load each sound
        const soundPromises = Object.entries(soundPaths).map(async ([type, path]) => {
          try {
            const audio = await loadSound(type as SoundType, path)
            audioRefs.current[type as SoundType] = audio
            return true
          } catch (e) {
            console.warn(`Could not load sound: ${type}`, e)
            // Create a silent audio element as fallback
            const silentAudio = new Audio()
            silentAudio.volume = 0
            audioRefs.current[type as SoundType] = silentAudio
            return false
          }
        })

        // Wait for all sounds to load (or fail)
        const results = await Promise.all(soundPromises)
        const allLoaded = results.some((result) => result)

        if (allLoaded) {
          setSoundsLoaded(true)
        } else {
          setLoadError(true)
        }
      } catch (error) {
        console.error("Error loading sounds:", error)
        setLoadError(true)
      }
    }

    loadAllSounds()

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [volume])

  // Initialize sound system on first user interaction
  const initialize = useCallback(() => {
    if (initialized || !soundsLoaded) return

    // Try to play and immediately pause all sounds to initialize them
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audio.pause()
              audio.currentTime = 0
            })
            .catch((error) => {
              // Auto-play was prevented, which is fine
              console.log("Audio initialization prevented:", error)
            })
        }
      }
    })

    setInitialized(true)
  }, [initialized, soundsLoaded])

  // Play a sound effect with error handling
  const playSound = useCallback(
    (type: SoundType) => {
      if (muted || !initialized || loadError) return

      const audio = audioRefs.current[type]
      if (!audio) return

      // Create a clone to allow overlapping sounds
      try {
        // Stop the audio if it's already playing
        audio.pause()
        audio.currentTime = 0

        // Play the sound
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Error playing sound (${type}):`, error)
          })
        }
      } catch (error) {
        console.warn(`Error playing sound (${type}):`, error)
      }
    },
    [muted, initialized, loadError],
  )

  // Update volume for all audio elements
  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)

    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.volume = clampedVolume
      }
    })
  }, [])

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev)
  }, [])

  return {
    playSound,
    muted,
    toggleMute,
    volume,
    updateVolume,
    initialize,
    initialized,
    soundsLoaded,
    loadError,
  }
}
