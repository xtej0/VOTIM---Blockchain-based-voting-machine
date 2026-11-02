"use client"

import { useState, useEffect } from "react"

interface Provider {
  request(args: { method: string; params?: unknown[] }): Promise<any>
  on?(event: string, listener: (...args: any[]) => void): void
  removeListener?(event: string, listener: (...args: any[]) => void): void
}
declare global { interface Window { ethereum?: Provider } }

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)

  useEffect(() => {
    const provider = window.ethereum
    if (!provider) return
    let active = true
    const accountsChanged = (accounts: string[]) => { if (active) setAccount(accounts[0] ?? null) }
    const chainChanged = (chain: string) => { if (active) setChainId(chain) }
    const disconnected = () => { if (active) { setAccount(null); setChainId(null) } }
    provider.on?.("accountsChanged", accountsChanged)
    provider.on?.("chainChanged", chainChanged)
    provider.on?.("disconnect", disconnected)
    Promise.all([provider.request({ method: "eth_accounts" }), provider.request({ method: "eth_chainId" })])
      .then(([accounts, chain]) => { accountsChanged(accounts); chainChanged(chain) })
      .catch(() => { if (active) setError("Unable to read wallet connection") })
    return () => {
      active = false
      provider.removeListener?.("accountsChanged", accountsChanged)
      provider.removeListener?.("chainChanged", chainChanged)
      provider.removeListener?.("disconnect", disconnected)
    }
  }, [])

  const connectWallet = async () => {
    const provider = window.ethereum
    if (!provider) { alert("Please install MetaMask or another Web3 wallet"); return }
    setIsLoading(true)
    setError(null)
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" })
      if (!accounts.length) throw new Error("No wallet account selected")
      try {
        await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: "0x13882" }] })
      } catch (switchError: any) {
        if (switchError.code !== 4902) throw switchError
        await provider.request({ method: "wallet_addEthereumChain", params: [{
          chainId: "0x13882", chainName: "Polygon Amoy Testnet",
          nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
          rpcUrls: ["https://rpc-amoy.polygon.technology/"],
          blockExplorerUrls: ["https://amoy.polygonscan.com/"],
        }] })
      }
      const chain = await provider.request({ method: "eth_chainId" })
      if (chain !== "0x13882") throw new Error("Select Polygon Amoy to continue")
      setChainId(chain)
      setAccount(accounts[0])
      // Notify other hook instances after explicit connection, including providers without events.
      window.dispatchEvent(new Event("votim-wallet-connected"))
    } catch (cause: any) {
      const message = cause.code === 4001 ? "Wallet request rejected. You can try again." : (cause.message || "Wallet connection failed")
      setError(message)
      setAccount(null)
      alert(message)
    } finally { setIsLoading(false) }
  }

  useEffect(() => {
    const refresh = () => {
      const provider = window.ethereum
      if (!provider) return
      Promise.all([provider.request({ method: "eth_accounts" }), provider.request({ method: "eth_chainId" })])
        .then(([accounts, chain]) => { setAccount(accounts[0] ?? null); setChainId(chain) })
        .catch(() => setAccount(null))
    }
    window.addEventListener("votim-wallet-connected", refresh)
    return () => window.removeEventListener("votim-wallet-connected", refresh)
  }, [])

  return { account, isConnected: !!account && chainId === "0x13882", isLoading, error, chainId,
    connectWallet, disconnectWallet: () => { setAccount(null); setChainId(null) } }
}
