"use client"

import { useState, useEffect } from "react"
import { csvCell } from "../lib/csv.mjs"
import { useWallet } from "./use-wallet"

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

export function useContract() {
  const { account, isConnected } = useWallet()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [electionStatus, setElectionStatus] = useState<"upcoming" | "live" | "ended" | "unknown">("upcoming")
  const [votingLogs, setVotingLogs] = useState<VotingLog[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)
  const [winner, setWinner] = useState<Candidate | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    // Initialize with mock data
    const mockCandidates: Candidate[] = [
      {
        id: 1,
        name: "Alice Johnson",
        imageUrl: "/placeholder.svg?height=100&width=100&text=Alice",
        voteCount: 45,
      },
      {
        id: 2,
        name: "Bob Smith",
        imageUrl: "/placeholder.svg?height=100&width=100&text=Bob",
        voteCount: 32,
      },
      {
        id: 3,
        name: "Carol Davis",
        imageUrl: "/placeholder.svg?height=100&width=100&text=Carol",
        voteCount: 28,
      },
    ]

    setCandidates(mockCandidates)
    setElectionStatus("live")
    setTotalVotes(105)
    setWinner(mockCandidates[0])

    // Mock voting logs
    const mockLogs: VotingLog[] = [
      {
        id: "1",
        voter: "0x1234567890123456789012345678901234567890",
        candidate: "Alice Johnson",
        timestamp: new Date().toLocaleString(),
        txHash: "demo-seeded-record",
      },
      {
        id: "2",
        voter: "0x0987654321098765432109876543210987654321",
        candidate: "Bob Smith",
        timestamp: new Date(Date.now() - 300000).toLocaleString(),
        txHash: "demo-seeded-record",
      },
    ]

    setVotingLogs(mockLogs)
  }, [])

  const addCandidate = async (name: string, imageUrl: string) => {
    setIsLoading(true)
    try {
      // Mock implementation - in real app, this would call smart contract
      const newCandidate: Candidate = {
        id: Math.max(0, ...candidates.map((candidate) => candidate.id)) + 1,
        name,
        imageUrl,
        voteCount: 0,
      }
      setCandidates((prev) => [...prev, newCandidate])

      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Error adding candidate:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeCandidate = async (candidateId: number) => {
    setIsLoading(true)
    try {
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId))
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Error removing candidate:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const startElection = async () => {
    setIsLoading(true)
    try {
      setElectionStatus("live")
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Error starting election:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const endElection = async () => {
    setIsLoading(true)
    try {
      setElectionStatus("ended")
      // Determine winner
      const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount)
      if (sortedCandidates.length > 0) {
        setWinner(sortedCandidates[0])
      }
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Error ending election:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetElection = async () => {
    setIsLoading(true)
    try {
      setCandidates((prev) => prev.map((c) => ({ ...c, voteCount: 0 })))
      setElectionStatus("upcoming")
      setVotingLogs([])
      setHasVoted(false)
      setTotalVotes(0)
      setWinner(null)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    } catch (error) {
      console.error("Error resetting election:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const vote = async (candidateId: number) => {
    if (!account || !isConnected) throw new Error("Connect a wallet first")
    if (hasVoted || isLoading) throw new Error("Vote already recorded or pending")
    if (electionStatus !== "live") throw new Error("Election is not live")
    if (!candidates.some((candidate) => candidate.id === candidateId)) throw new Error("Unknown candidate")

    setIsLoading(true)
    try {
      // Update candidate vote count
      setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, voteCount: c.voteCount + 1 } : c)))

      // Add to voting logs
      const candidate = candidates.find((c) => c.id === candidateId)
      if (candidate) {
        const newLog: VotingLog = {
          id: Date.now().toString(),
          voter: account,
          candidate: candidate.name,
          timestamp: new Date().toLocaleString(),
          txHash: `demo-${crypto.randomUUID()}`,
        }
        setVotingLogs((prev) => [newLog, ...prev])
      }

      setHasVoted(true)
      setTotalVotes((prev) => prev + 1)

      await new Promise((resolve) => setTimeout(resolve, 3000))
    } catch (error) {
      console.error("Error voting:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const downloadLogs = () => {
    const csvContent = "Voter,Candidate,Timestamp,Demo Reference\r\n" +
      votingLogs.map((log) => [log.voter, log.candidate, log.timestamp, log.txHash].map(csvCell).join(",")).join("\r\n")
    const url = URL.createObjectURL(new Blob([csvContent], { type: "text/csv;charset=utf-8" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "voting_logs.csv"
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return {
    candidates,
    electionStatus,
    votingLogs,
    hasVoted,
    isLoading,
    totalVotes,
    winner,
    addCandidate,
    removeCandidate,
    startElection,
    endElection,
    resetElection,
    vote,
    downloadLogs,
  }
}
