"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function MatrixWakeup({ onComplete }) {
  const messages = [
    "Wake up, Mendax...",
    "The Matrix has you...",
    "Follow the white rabbit."
  ]

  const [messageIndex, setMessageIndex] = useState(0)
  const [typedText, setTypedText] = useState("")
  const typingSpeed = 100 // Speed in milliseconds

  useEffect(() => {
    setTypedText("") // Reset text when a new message starts

    if (messageIndex < messages.length) {
      let charIndex = 0
      const typingInterval = setInterval(() => {
        if (charIndex < messages[messageIndex].length) {
          setTypedText(messages[messageIndex].slice(0, charIndex + 1)) // Fix first letter issue
          charIndex++
        } else {
          clearInterval(typingInterval)
          setTimeout(() => {
            setMessageIndex((prev) => prev + 1) // Move to next message
          }, 1000) // Delay before switching messages
        }
      }, typingSpeed)

      return () => clearInterval(typingInterval)
    } else {
      setTimeout(onComplete, 1000)
    }
  }, [messageIndex]) // Re-run only when `messageIndex` changes

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute top-8 left-8 z-50"
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[#00ff41] text-xl md:text-2xl font-mono"
      >
        {typedText}
      </motion.div>
    </motion.div>
  )
}
