"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Vote, Shield, BarChart3, Sparkles } from "lucide-react"
import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
              <Vote className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Votim
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Blockchain voting interface prototype with simulated election workflows and optional wallet connectivity
            targeting Polygon Amoy testnet.
          </p>
          <Badge variant="secondary" className="mt-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Polygon Amoy Testnet
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Admin Portal Card */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm shadow-2xl hover:shadow-purple-500/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 rounded-full bg-gradient-to-r from-red-500 to-pink-600 shadow-lg group-hover:shadow-red-500/30 transition-all duration-300 mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
              <CardDescription className="text-slate-400">
                Manage elections, candidates, and voting processes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-slate-300 mb-6 space-y-2">
                <li>• Add/Remove Candidates</li>
                <li>• Start/End Elections</li>
                <li>• Monitor Voting Logs</li>
                <li>• Download Reports</li>
              </ul>
              <Link href="/admin">
                <Button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 shadow-lg hover:shadow-red-500/30 transition-all duration-300">
                  Access Admin Panel
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Voters Portal Card */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm shadow-2xl hover:shadow-blue-500/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 mb-4">
                <Vote className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Voters Portal</CardTitle>
              <CardDescription className="text-slate-400">Cast your vote securely and transparently</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-slate-300 mb-6 space-y-2">
                <li>• View All Candidates</li>
                <li>• Simulated Vote Casting</li>
                <li>• Real-time Status Updates</li>
                <li>• Vote Confirmation</li>
              </ul>
              <Link href="/vote">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  Cast Your Vote
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Results Page Card */}
          <Card className="group hover:scale-105 transition-all duration-300 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm shadow-2xl hover:shadow-green-500/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:shadow-green-500/30 transition-all duration-300 mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Results Page</CardTitle>
              <CardDescription className="text-slate-400">View election results and analytics</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-sm text-slate-300 mb-6 space-y-2">
                <li>• Live Vote Counting</li>
                <li>• Winner Announcement</li>
                <li>• Interactive Charts</li>
                <li>• Download PDF Reports</li>
              </ul>
              <Link href="/results">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-green-500/30 transition-all duration-300">
                  View Results
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-400 text-sm">
            Powered by blockchain technology • Secure • Transparent • Decentralized
          </p>
        </div>
      </div>
    </div>
  )
}
