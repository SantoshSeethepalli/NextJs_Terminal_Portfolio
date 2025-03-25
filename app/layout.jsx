import "./globals.css"
import { TerminalProvider } from "@/components/terminal-provider"

export const metadata = {
  title: "Mendax47",
  description: "Interactive terminal portfolio of Satya Santosh Seethepalli"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <TerminalProvider>{children}</TerminalProvider>
      </body>
    </html>
  )
}



import './globals.css'