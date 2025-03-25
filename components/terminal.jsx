"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { commandProcessor } from "@/utils/command-processor"
import { useTerminal } from "@/components/terminal-provider"
import { TypeAnimation } from "@/components/type-animation"

export function Terminal() {
  const [history, setHistory] = useState([])
  const [input, setInput] = useState("")
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isTyping, setIsTyping] = useState(false)
  const [interrupted, setInterrupted] = useState(false)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)
  const { onClear } = useTerminal()

  // Auto-focus the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Initial welcome message with typing effect
  useEffect(() => {
    setIsTyping(true)
    setTimeout(() => {
      setHistory([
        {
          type: "output",
          content: 'Welcome to Mendax Terminal Portfolio. Type "ls" to see available commands.',
        },
      ])
      setIsTyping(false)
    }, 1000)
  }, [])

  // Register clear terminal function - use useCallback to prevent infinite loops
  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  useEffect(() => {
    onClear(clearHistory)
  }, [onClear, clearHistory])

  // Auto-scroll to the bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history, isTyping])

  // Handle Ctrl+C to interrupt typing
  const handleCtrlC = useCallback(() => {
    if (isTyping) {
      setInterrupted(true)
      setIsTyping(false)
      setHistory((prev) => [...prev, { type: "output", content: "^C - User interrupted" }])
    }
  }, [isTyping])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "c") {
        handleCtrlC()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleCtrlC])

  // Handle command submission
  const handleSubmit = async () => {
    if (!input.trim() || isTyping) return

    const trimmedInput = input.trim()
    setHistory((prev) => [...prev, { type: "input", content: trimmedInput }])
    setInput("")
    setIsTyping(true)
    setInterrupted(false)

    try {
      const output = await commandProcessor(trimmedInput)

      if (output === "CLEAR_TERMINAL") {
        setHistory([])
        setIsTyping(false)
      } else {
        // Add output to history with typing animation
        setHistory((prev) => [...prev, { type: "output", content: output }])
        // Wait for typing animation to complete before allowing new input
        const typingTime = output.length * 20 // Approximate typing time
        setTimeout(() => {
          if (!interrupted) {
            setIsTyping(false)
          }
        }, typingTime + 500) // Add buffer time
      }
    } catch (error) {
      setHistory((prev) => [...prev, { type: "output", content: "Error: " + error.message }])
      setIsTyping(false)
    }

    setCommandHistory((prev) => [trimmedInput, ...prev])
    setHistoryIndex(-1)
  }

  // Handle key presses
  const handleKeyDown = (e) => {
    if (isTyping && !interrupted) return

    if (e.key === "Enter") {
      handleSubmit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for commands
      const commands = [
        "ls",
        "help",
        "about",
        "clear",
        "cls",
        "education",
        "skills",
        "projects",
        "project",
        "contact",
        "cv",
        "social",
        "github",
        "linkedin",
        "leetcode",
        "instagram",
        "sudo",
      ]

      if (input) {
        const matchingCommands = commands.filter((cmd) => cmd.startsWith(input.toLowerCase()))
        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0])
        }
      }
    }
  }

  // Handle click on terminal to focus input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="bg-[#0d0d0d] border border-zinc-800 rounded-lg overflow-hidden shadow-xl shadow-black/30 h-[80vh] flex flex-col" onClick={handleTerminalClick}>
      <div className="relative flex items-center px-4 py-2 bg-[#1a1a1a] border-b border-zinc-800">
        <div className="absolute left-4 flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div>
        </div>
        <div className="flex-1 text-center text-xs text-zinc-400">mendax@matrix:~</div>
      </div>

      <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto font-mono text-zinc-300 bg-[#0d0d0d] text-sm">
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            {entry.type === "input" ? (
              <div>
                <span className="text-green-500">mendax@matrix:~$</span> <span>{entry.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-line text-zinc-300">
                <TypeAnimation text={entry.content} interrupted={interrupted && index === history.length - 1} />
              </div>
            )}
          </div>
        ))}

        {!isTyping && (
          <div className="flex">
            <span className="text-green-500">mendax@matrix:~$</span>
            <div className="flex-1 relative ml-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-zinc-300"
                aria-label="Terminal input"
                disabled={isTyping}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

