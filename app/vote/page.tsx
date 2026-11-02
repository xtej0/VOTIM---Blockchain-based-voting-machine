"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Wallet, Vote, CheckCircle, AlertCircle, Clock, Play, Square, Users } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useContract } from "@/hooks/use-contract"
import Link from "next/link"

interface Candidate {
  id: number
  name: string
  imageUrl: string
  voteCount: number
}

export default function VotePage() {
  const { account, connectWallet, isConnected } = useWallet()
  const { candidates, electionStatus, vote, hasVoted, isLoading } = useContract()

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setShowConfirmDialog(true)
  }

  const handleConfirmVote = async () => {
    if (!selectedCandidate) return

    setIsVoting(true)
    try {
      await vote(selectedCandidate.id)
      setShowConfirmDialog(false)
      setSelectedCandidate(null)
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
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

  const canVote = electionStatus === "live" && isConnected && !hasVoted

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
                <Vote className="h-8 w-8 mr-3 text-blue-400" />
                Voters Portal
              </h1>
              <p className="text-slate-400 mt-1">Cast your vote securely on the blockchain</p>
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
              <div className="space-y-4">
                <p className="text-slate-400">Connect your wallet to participate in the election</p>
                <Button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-white">
                    Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                </div>
                {hasVoted && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-300">
                      You have already voted in this election. Thank you for participating!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Election Status Alert */}
        {electionStatus !== "live" && (
          <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-300">
              {electionStatus === "upcoming" &&
                "The election has not started yet. Please wait for the admin to start the election."}
              {electionStatus === "ended" && "The election has ended. You can view the results on the Results page."}
              {electionStatus === "unknown" && "Election status is unknown. Please check back later."}
            </AlertDescription>
          </Alert>
        )}

        {/* Candidates Grid */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Candidates
            </CardTitle>
            <CardDescription className="text-slate-400">Choose your preferred candidate</CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No candidates available yet</p>
                <p className="text-slate-500 text-sm">Please wait for the admin to add candidates</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="bg-slate-700/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <img
                          src={candidate.imageUrl || "/placeholder.svg"}
                          alt={candidate.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-slate-600"
                        />
                        <h3 className="text-xl font-bold text-white mb-2">{candidate.name}</h3>
                        <Badge variant="outline" className="border-slate-500 text-slate-300">
                          ID: {candidate.id}
                        </Badge>
                      </div>

                      <Button
                        onClick={() => handleVoteClick(candidate)}
                        disabled={!canVote || isLoading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700"
                      >
                        <Vote className="h-4 w-4 mr-2" />
                        {hasVoted ? "Already Voted" : "Vote"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vote Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-white">Confirm Your Vote</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to vote for {selectedCandidate?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            {selectedCandidate && (
              <div className="flex items-center space-x-4 p-4 bg-slate-700/50 rounded-lg">
                <img
                  src={selectedCandidate.imageUrl || "/placeholder.svg"}
                  alt={selectedCandidate.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedCandidate.name}</h3>
                  <p className="text-slate-400">Candidate ID: {selectedCandidate.id}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isVoting}
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmVote}
                disabled={isVoting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isVoting ? "Voting..." : "Confirm Vote"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
