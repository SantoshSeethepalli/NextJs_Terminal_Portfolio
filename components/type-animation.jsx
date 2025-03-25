"use client"

import { useState, useEffect, useRef } from "react"

export function TypeAnimation({ text, typingSpeed = 1, interrupted = false }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const charIndexRef = useRef(0)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("")
    charIndexRef.current = 0
    setIsComplete(false)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If interrupted, show full text immediately
    if (interrupted) {
      setDisplayedText(text)
      setIsComplete(true)
      return
    }

    // Start typing effect with a simpler, more reliable approach
    const typeNextChar = () => {
      if (charIndexRef.current < text.length) {
        setDisplayedText(text.substring(0, charIndexRef.current + 1))
        charIndexRef.current++

        // Random typing speed
        const delay = typingSpeed * (10 + Math.floor(Math.random() * 30))
        timeoutRef.current = setTimeout(typeNextChar, delay)
      } else {
        setIsComplete(true)
      }
    }

    // Start typing
    timeoutRef.current = setTimeout(typeNextChar, 20)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, typingSpeed, interrupted])

  // Handle HTML content safely
  const createMarkup = () => {
    return { __html: displayedText }
  }

  return (
    <span>
      <span dangerouslySetInnerHTML={createMarkup()} />
      {!isComplete && !interrupted && <span className="inline-block w-2 h-4 bg-zinc-300 ml-1 animate-pulse"></span>}
    </span>
  )
}

