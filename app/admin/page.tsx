"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  Plus,
  Trash2,
  Play,
  Square,
  RotateCcw,
  Download,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"
import Link from "next/link"

interface Candidate {
  id: number
  name: string
  imageUrl: string
  voteCount: number
}

interface VotingLog {
  id: string
  voter: string
  candidate: string
  timestamp: string
  txHash: string
}

export default function AdminPage() {
  const { account, connectWallet, isConnected } = useWallet()
  const {
    candidates,
    electionStatus,
    votingLogs,
    addCandidate,
    removeCandidate,
    startElection,
    endElection,
    resetElection,
    downloadLogs,
    isLoading,
  } = useContract()

  const [newCandidateName, setNewCandidateName] = useState("")
  const [newCandidateImage, setNewCandidateImage] = useState("")
  const [isAddingCandidate, setIsAddingCandidate] = useState(false)

  // Admin wallet address - replace with your actual admin address
  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "0x741d732440D87454a9f01758250ADBef8F3f2610"
  const isAdmin = account?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const handleAddCandidate = async () => {
    if (!newCandidateName.trim()) return

    setIsAddingCandidate(true)
    try {
      await addCandidate(newCandidateName, newCandidateImage || "/placeholder.svg?height=100&width=100")
      setNewCandidateName("")
      setNewCandidateImage("")
    } catch (error) {
      console.error("Error adding candidate:", error)
    } finally {
      setIsAddingCandidate(false)
    }
  }

  const getStatusBadge = () => {
    switch (electionStatus) {
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        )
      case "live":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            <Play className="h-3 w-3 mr-1" />
            Live
          </Badge>
        )
      case "ended":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
            <Square className="h-3 w-3 mr-1" />
            Ended
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                ← Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center">
                <Shield className="h-8 w-8 mr-3 text-red-400" />
                Admin Portal
              </h1>
              <p className="text-slate-400 mt-1">Manage elections and candidates</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Wallet Connection */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
                {!isAdmin && (
                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-300">
                      You are not authorized to access admin functions. Admin access is restricted to:{" "}
                      {ADMIN_ADDRESS.slice(0, 6)}...{ADMIN_ADDRESS.slice(-4)}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {isConnected && isAdmin && (
          <>
            {/* Election Controls */}
            <Card className="mb-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Election Controls</CardTitle>
                <CardDescription className="text-slate-400">Manage the election lifecycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={startElection}
                    disabled={electionStatus === "live" || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Election
                  </Button>
                  <Button
                    onClick={endElection}
                    disabled={electionStatus !== "live" || isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Election
                  </Button>
                  <Button
                    onClick={resetElection}
                    disabled={isLoading}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Election
                  </Button>
                  <Button
                    onClick={downloadLogs}
                    disabled={isLoading}
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Logs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Management */}
            <Card className="mb-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Candidate Management
                </CardTitle>
                <CardDescription className="text-slate-400">Add or remove candidates from the election</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add Candidate Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <Label htmlFor="candidateName" className="text-white">
                      Candidate Name
                    </Label>
                    <Input
                      id="candidateName"
                      value={newCandidateName}
                      onChange={(e) => setNewCandidateName(e.target.value)}
                      placeholder="Enter candidate name"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="candidateImage" className="text-white">
                      Image URL (Optional)
                    </Label>
                    <Input
                      id="candidateImage"
                      value={newCandidateImage}
                      onChange={(e) => setNewCandidateImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleAddCandidate}
                      disabled={!newCandidateName.trim() || isAddingCandidate}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isAddingCandidate ? "Adding..." : "Add Candidate"}
                    </Button>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={candidate.imageUrl || "/placeholder.svg"}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{candidate.name}</h3>
                            <p className="text-slate-400 text-sm">ID: {candidate.id}</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="destructive" disabled={electionStatus === "live"}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-800 border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-white">Remove Candidate</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                  Are you sure you want to remove {candidate.name} from the election? This action cannot
                                  be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" className="border-slate-600 text-white bg-transparent">
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={() => removeCandidate(candidate.id)}>
                                  Remove Candidate
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Voting Logs */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Voting Logs</CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time voting activity (auto-refreshes every 10 seconds)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Voter Address</TableHead>
                        <TableHead className="text-slate-300">Candidate</TableHead>
                        <TableHead className="text-slate-300">Timestamp</TableHead>
                        <TableHead className="text-slate-300">Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {votingLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                            No voting activity yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        votingLogs.map((log) => (
                          <TableRow key={log.id} className="border-slate-700">
                            <TableCell className="text-white font-mono">
                              {log.voter.slice(0, 6)}...{log.voter.slice(-4)}
                            </TableCell>
                            <TableCell className="text-white">{log.candidate}</TableCell>
                            <TableCell className="text-slate-300">{log.timestamp}</TableCell>
                            <TableCell>
                              <a
                                href={`https://amoy.polygonscan.com/tx/${log.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-mono text-sm"
                              >
                                {log.txHash.slice(0, 8)}...
                              </a>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
