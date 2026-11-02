import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Votim - Decentralized Voting Platform",
  description: "Voting interface prototype with simulated election data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><div role="note" className="bg-slate-900 px-4 py-2 text-center text-sm text-slate-300">Demo mode: votes and election data are simulated locally. No blockchain transactions are sent.</div>{children}</body>
    </html>
  )
}
