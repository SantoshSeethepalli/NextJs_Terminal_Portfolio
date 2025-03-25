"use client"

import { createContext, useContext, useState, useCallback } from "react"

const TerminalContext = createContext(undefined)

export function TerminalProvider({ children }) {
  const [clearCallback, setClearCallback] = useState(null)

  const clearTerminal = useCallback(() => {
    if (clearCallback) {
      clearCallback()
    }
  }, [clearCallback])

  const onClear = useCallback((callback) => {
    setClearCallback(() => callback)
  }, [])

  return <TerminalContext.Provider value={{ clearTerminal, onClear }}>{children}</TerminalContext.Provider>
}

export function useTerminal() {
  const context = useContext(TerminalContext)
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider")
  }
  return context
}

