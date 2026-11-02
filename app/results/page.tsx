"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Trophy, Download, BarChart3, Users, Crown, FileText } from "lucide-react"
import { useContract } from "@/hooks/use-contract"
import Link from "next/link"

interface Candidate {
  id: number
  name: string
  imageUrl: string
  voteCount: number
}

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"]

export default function ResultsPage() {
  const { candidates, electionStatus, totalVotes, winner } = useContract()
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const data = candidates.map((candidate, index) => ({
      name: candidate.name,
      votes: candidate.voteCount,
      percentage: totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0,
      fill: COLORS[index % COLORS.length],
    }))
    setChartData(data)
  }, [candidates, totalVotes])

  const downloadPDF = () => {
    // Implementation for PDF download
    window.print()
  }

  const getStatusBadge = () => {
    switch (electionStatus) {
      case "upcoming":
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            Upcoming
          </Badge>
        )
      case "live":
        return (
          <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
            Live
          </Badge>
        )
      case "ended":
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/30">
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
                <BarChart3 className="h-8 w-8 mr-3 text-green-400" />
                Election Results
              </h1>
              <p className="text-slate-400 mt-1">Live results and analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getStatusBadge()}
            <Button
              onClick={downloadPDF}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Winner Announcement */}
        {winner && electionStatus === "ended" && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="h-12 w-12 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">🎉 Winner Announced! 🎉</h2>
              <div className="flex items-center justify-center space-x-6 mt-6">
                <img
                  src={winner.imageUrl || "/placeholder.svg"}
                  alt={winner.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400"
                />
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">{winner.name}</h3>
                  <p className="text-yellow-300 text-lg">{winner.voteCount} votes</p>
                  <p className="text-slate-300">
                    {totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(1) : 0}% of total votes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{totalVotes}</h3>
              <p className="text-slate-400">Total Votes</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{candidates.length}</h3>
              <p className="text-slate-400">Candidates</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {winner && totalVotes > 0 ? `${((winner.voteCount / totalVotes) * 100).toFixed(1)}%` : "0%"}
              </h3>
              <p className="text-slate-400">Leading Vote Share</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Vote Distribution</CardTitle>
              <CardDescription className="text-slate-400">Votes received by each candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                  <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Vote Percentage</CardTitle>
              <CardDescription className="text-slate-400">Percentage breakdown of votes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="votes"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F9FAFB",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Detailed Results
            </CardTitle>
            <CardDescription className="text-slate-400">Complete breakdown of election results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Rank</TableHead>
                    <TableHead className="text-slate-300">Candidate</TableHead>
                    <TableHead className="text-slate-300">Votes</TableHead>
                    <TableHead className="text-slate-300">Percentage</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...candidates]
                    .sort((a, b) => b.voteCount - a.voteCount)
                    .map((candidate, index) => (
                      <TableRow key={candidate.id} className="border-slate-700">
                        <TableCell className="text-white font-semibold">
                          {index === 0 && electionStatus === "ended" ? (
                            <div className="flex items-center">
                              <Crown className="h-4 w-4 text-yellow-400 mr-1" />
                              {index + 1}
                            </div>
                          ) : (
                            index + 1
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={candidate.imageUrl || "/placeholder.svg"}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-white font-semibold">{candidate.name}</p>
                              <p className="text-slate-400 text-sm">ID: {candidate.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">{candidate.voteCount}</TableCell>
                        <TableCell className="text-white">
                          {totalVotes > 0 ? ((candidate.voteCount / totalVotes) * 100).toFixed(1) : 0}%
                        </TableCell>
                        <TableCell>
                          {index === 0 && electionStatus === "ended" ? (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Winner</Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-500 text-slate-300">
                              Candidate
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
