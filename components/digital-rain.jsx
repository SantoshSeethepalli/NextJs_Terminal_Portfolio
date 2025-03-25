"use client"

import { useEffect, useRef } from "react"

export function DigitalRain({ opacity = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Matrix rain characters
    const characters =
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const charArray = characters.split("")

    // Create raindrops
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Initialize drops at random positions
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1
    }

    // Draw the matrix rain
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text color and font - using darker green
      ctx.fillStyle = "#0A3A0A" // Darker Matrix green
      ctx.font = `${fontSize}px monospace`

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)]

        // Calculate x position
        const x = i * fontSize

        // Calculate y position
        const y = drops[i] * fontSize

        // Add glow effect to some characters
        if (Math.random() > 0.975) {
          ctx.fillStyle = "#0C4D0C" // Slightly brighter green for glow
          ctx.shadowBlur = 5
          ctx.shadowColor = "#052505"
        } else {
          ctx.fillStyle = "#0A3A0A" // Regular dark green
          ctx.shadowBlur = 0
        }

        // Draw the character
        ctx.fillText(char, x, y)

        // Reset shadow
        ctx.shadowBlur = 0

        // Move drop down
        drops[i]++

        // Reset drop to top if it reaches bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
      }
    }

    // Animation loop
    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 transition-opacity duration-1000"
      style={{ opacity }}
    />
  )
}

