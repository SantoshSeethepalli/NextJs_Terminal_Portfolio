"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { DigitalRain } from "@/components/digital-rain"
import { Terminal } from "@/components/terminal"
import { MatrixWakeup } from "@/components/matrix-wakeup"

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false)
  const [wakeupComplete, setWakeupComplete] = useState(false)

  const handleWakeupComplete = () => {
    setWakeupComplete(true)
    setTimeout(() => {
      setShowTerminal(true)
    }, 500)
  }

  return (
    <div className="relative min-h-screen bg-black text-zinc-300 font-mono overflow-hidden">
      <DigitalRain opacity={wakeupComplete ? 1 : 0} />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {!wakeupComplete && <MatrixWakeup onComplete={handleWakeupComplete} />}

          {showTerminal && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl"
            >
              <Terminal />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}