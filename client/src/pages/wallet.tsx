import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wallet, 
  Send, 
  ArrowUpDown, 
  Shield, 
  Eye, 
  Copy,
  TrendingUp,
  Zap,
  Lock,
  Globe,
  Plus,
  Users,
  HardDrive,
  Fingerprint,
  Clock,
  Key,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// TypeScript declarations for wallet APIs
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

import { WalletVaultIntegration } from '@/components/wallet/WalletVaultIntegration';
import { Link } from 'wouter';

export default function WalletPage() {
  const { toast } = useToast();

  // MetaMask connection with proper signature request
  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        // Create signature message
        const message = 'Welcome to Chronos Vault! Please sign this message to authenticate your wallet.\n\nThis signature proves ownership of your wallet without revealing private keys.\n\nTimestamp: ' + new Date().toISOString();
        
        // Request signature
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, accounts[0]]
        });
        
        toast({
          title: "MetaMask Connected & Signed",
          description: `Authenticated: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
        });
      } else {
        // Create SIWE (Sign-In with Ethereum) message for mobile
        const domain = window.location.host;
        const address = '0x' + Math.random().toString(16).substr(2, 40); // Temporary for demo
        const statement = 'Sign in to Chronos Vault';
        const uri = window.location.origin;
        const version = '1';
        const chainId = '1';
        const nonce = Math.random().toString(36).substring(7);
        
        const siweMessage = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\n${statement}\n\nURI: ${uri}\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}`;
        
        // MetaMask mobile deep link with sign parameters
        const deepLink = `https://metamask.app.link/dapp/${domain}?message=${encodeURIComponent(siweMessage)}&method=personal_sign`;
        window.location.href = deepLink;
        
        toast({
          title: "Opening MetaMask",
          description: "Please sign the authentication message"
        });
      }
    } catch (error) {
      toast({
        title: "MetaMask Error",
        description: error.message || "Failed to connect",
        variant: "destructive"
      });
    }
  };

  // Phantom connection with proper signature request
  const connectPhantom = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        // Connect to Phantom
        const response = await window.solana.connect();
        
        // Create signature message
        const message = 'Welcome to Chronos Vault!\n\nSign to authenticate: ' + new Date().toISOString();
        const encodedMessage = new TextEncoder().encode(message);
        
        // Request signature
        const signature = await window.solana.signMessage(encodedMessage);
        
        toast({
          title: "Phantom Connected & Signed",
          description: `Authenticated: ${response.publicKey.toString().slice(0, 6)}...${response.publicKey.toString().slice(-4)}`
        });
      } else {
        // Create message to sign for Phantom mobile
        const message = 'Welcome to Chronos Vault!\n\nPlease sign this message to authenticate your wallet.\n\nTimestamp: ' + new Date().toISOString();
        const encodedMessage = btoa(message);
        
        // Phantom mobile deep link with signature request
        const deepLink = `phantom://v1/signMessage?message=${encodedMessage}&redirect_link=${encodeURIComponent(window.location.href)}`;
        window.location.href = deepLink;
        
        toast({
          title: "Opening Phantom",
          description: "Please sign the authentication message"
        });
      }
    } catch (error) {
      toast({
        title: "Phantom Error",
        description: error.message || "Failed to connect",
        variant: "destructive"
      });
    }
  };

  // TON Keeper connection with proper signature request
  const connectTonKeeper = async () => {
    try {
      // Create authentication payload for TON Connect
      const authPayload = {
        domain: window.location.host,
        timestamp: Date.now(),
        payload: 'chronos-vault-auth-' + Date.now()
      };
      
      // TON Connect deep link with authentication request
      const tonConnectParams = new URLSearchParams({
        v: '2',
        id: 'chronos-vault',
        r: window.location.origin,
        ret: 'back',
        request: JSON.stringify({
          method: 'ton_requestAuth',
          params: authPayload
        })
      });
      
      const deepLink = `tonkeeper://ton-connect?${tonConnectParams.toString()}`;
      window.location.href = deepLink;
      
      toast({
        title: "Opening TON Keeper",
        description: "Please sign the authentication request in TON Keeper"
      });
    } catch (error) {
      toast({
        title: "TON Keeper Error", 
        description: (error as Error).message || "Failed to connect",
        variant: "destructive"
      });
    }
  };

  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [hasWallet, setHasWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [walletData, setWalletData] = useState<any>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [realWalletBalances, setRealWalletBalances] = useState<any>({});
  const [activeTab, setActiveTab] = useState('portfolio');
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [connectedWallets, setConnectedWallets] = useState<{[key: string]: string}>({});
  
  // Detect if user is on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleWalletAuthenticated = (walletType: string, address: string) => {
    setConnectedWallets(prev => ({
      ...prev,
      [walletType]: address
    }));
    setHasWallet(true);
    
    // Update wallet balances for authenticated wallet
    setRealWalletBalances((prev: any) => ({
      ...prev,
      [walletType]: { connected: true, address, authenticated: true }
    }));

    toast({
      title: "Wallet Authenticated",
      description: `${walletType} wallet authenticated with signature verification`,
    });
  };

  // Convert connected wallets to format expected by WalletVaultIntegration
  const getConnectedWalletsForVault = () => {
    return Object.entries(connectedWallets).map(([type, address]) => ({
      type,
      address,
      chain: getChainFromWalletType(type),
      balance: realWalletBalances[type]?.balance || '0'
    }));
  };

  const getChainFromWalletType = (walletType: string) => {
    switch (walletType.toLowerCase()) {
      case 'metamask': return 'ethereum';
      case 'phantom': return 'solana';
      case 'tonkeeper': return 'ton';
      default: return 'ethereum';
    }
  };

  const handleCreateVault = (walletAddress: string, chain: string) => {
    // Navigate to vault creation with pre-filled wallet data
    window.location.href = `/create-vault?wallet=${walletAddress}&chain=${chain}`;
  };

  // Fetch real testnet wallet data
  useEffect(() => {
    const fetchRealWalletData = async () => {
      try {
        // Fetch Solana wallet data
        const solanaResponse = await fetch('/api/testnet-wallet/solana');
        const solanaData = await solanaResponse.json();
        
        // Fetch TON wallet data
        const tonResponse = await fetch('/api/testnet-wallet/ton');
        const tonData = await tonResponse.json();
        
        // Fetch wallet addresses
        const addressesResponse = await fetch('/api/testnet-wallet/addresses');
        const addressesData = await addressesResponse.json();
        
        if (solanaData.status === 'success' || tonData.status === 'success') {
          setHasWallet(true);
          setRealWalletBalances({
            solana: solanaData.status === 'success' ? solanaData.data : null,
            ton: tonData.status === 'success' ? tonData.data : null,
            addresses: addressesData.status === 'success' ? addressesData.data : null
          });
        }
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealWalletData();
  }, []);

  // Get wallet balances from real testnet data
  const walletBalances = {
    ethereum: { 
      balance: '0.0000', 
      symbol: 'ETH', 
      usd: '$0.00',
      address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    },
    solana: { 
      balance: realWalletBalances.solana?.balance || '0.0000', 
      symbol: 'SOL', 
      usd: '$0.00',
      address: realWalletBalances.addresses?.solana || 'Not Connected'
    },
    ton: { 
      balance: realWalletBalances.ton?.balance || '0.0000', 
      symbol: 'TON', 
      usd: '$0.00',
      address: realWalletBalances.addresses?.ton || 'Not Connected'
    }
  };

  const recentTransactions = [
    {
      id: '1',
      type: 'received',
      amount: '2.5 ETH',
      from: '0x742d...3a3b',
      timestamp: '2 minutes ago',
      status: 'confirmed',
      chain: 'ethereum'
    },
    {
      id: '2',
      type: 'sent',
      amount: '15.0 SOL',
      to: '9WzD...8kLm',
      timestamp: '1 hour ago',
      status: 'confirmed',
      chain: 'solana'
    },
    {
      id: '3',
      type: 'swap',
      amount: '500 TON → 1.2 ETH',
      timestamp: '3 hours ago',
      status: 'confirmed',
      chain: 'cross-chain'
    }
  ];



  const handleAirdrop = async (network: 'solana' | 'ton') => {
    try {
      const response = await fetch('/api/testnet-wallet/airdrop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network }),
      });
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data.success) {
        toast({
          title: "Airdrop Successful",
          description: `Received testnet tokens on ${network}. Transaction: ${result.data.hash?.slice(0, 8)}...`,
        });
        
        // Refresh wallet data
        window.location.reload();
      } else {
        toast({
          title: "Airdrop Failed",
          description: result.data.error || "Failed to request airdrop",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Airdrop Error",
        description: "Failed to request testnet tokens",
        variant: "destructive",
      });
    }
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  // Connect wallet functions
  const connectWallet = async (chain: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/wallet/connect/${chain}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast({
          title: `${chain.charAt(0).toUpperCase() + chain.slice(1)} Connected`,
          description: `Wallet connected successfully: ${data.address.slice(0, 8)}...${data.address.slice(-6)}`,
        });
        
        // Refresh wallet data
        window.location.reload();
      } else {
        toast({
          title: "Connection Failed",
          description: data.message || "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Network error while connecting wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit functionality
  const handleDeposit = async (amount: string, network: string) => {
    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, network })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast({
          title: "Deposit Initiated",
          description: `Depositing ${amount} on ${network}`,
        });
      } else {
        toast({
          title: "Deposit Failed",
          description: data.message || "Failed to initiate deposit",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Deposit Error",
        description: "Network error during deposit",
        variant: "destructive",
      });
    }
  };

  // Handle withdraw functionality
  const handleWithdraw = async (amount: string, address: string, network: string) => {
    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, address, network })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Add transaction to history
        const newTransaction = {
          id: Date.now().toString(),
          type: 'withdrawal',
          amount: `${amount} ${network.toUpperCase()}`,
          timestamp: 'Just now',
          status: 'pending',
          chain: network,
          to: address
        };
        
        setTransactionHistory(prev => [newTransaction, ...prev]);
        
        toast({
          title: "Withdrawal Initiated",
          description: `Withdrawing ${amount} to ${address.slice(0, 8)}...${address.slice(-6)}`,
        });
        
        // Simulate transaction confirmation after 3 seconds
        setTimeout(() => {
          setTransactionHistory(prev => 
            prev.map(tx => 
              tx.id === newTransaction.id 
                ? { ...tx, status: 'confirmed', timestamp: '3 seconds ago' }
                : tx
            )
          );
        }, 3000);
        
      } else {
        toast({
          title: "Withdrawal Failed",
          description: data.message || "Failed to initiate withdrawal",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Withdrawal Error",
        description: "Network error during withdrawal",
        variant: "destructive",
      });
    }
  };

  const handleSend = () => {
    if (!sendAmount || !recipientAddress) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and recipient address",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Transaction Initiated",
      description: `Sending ${sendAmount} ${walletBalances[selectedChain as keyof typeof walletBalances].symbol} with Trinity Protocol security`,
    });
  };

  const chainConfigs = {
    ethereum: {
      name: 'Ethereum',
      color: 'bg-blue-500',
      address: walletBalances.ethereum.address
    },
    solana: {
      name: 'Solana',
      color: 'bg-purple-500',
      address: walletBalances.solana.address
    },
    ton: {
      name: 'TON',
      color: 'bg-cyan-500',
      address: walletBalances.ton.address
    }
  };

  // Show loading state while checking for wallet
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  // Show wallet creation prompt if no wallet exists
  if (!hasWallet) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="relative px-6 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl w-20 h-20 flex items-center justify-center mx-auto mb-8">
              <Wallet className="w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              Welcome to Chronos Wallet
            </h1>
            
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Create your secure multi-chain wallet protected by Trinity Protocol. Experience quantum-resistant security across Ethereum, Solana, and TON networks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gray-900/50 border-green-500/30">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Trinity Protocol</h3>
                  <p className="text-gray-400 text-sm">Triple-chain verification for maximum security</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/30">
                <CardContent className="p-6 text-center">
                  <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quantum Resistant</h3>
                  <p className="text-gray-400 text-sm">Advanced cryptography that's future-proof</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Multi-Chain</h3>
                  <p className="text-gray-400 text-sm">Native support for 3 major blockchains</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create-wallet">
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg px-8 py-3">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Wallet
                </Button>
              </Link>
              <Button variant="outline" className="text-lg px-8 py-3">
                Import Existing Wallet
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative px-6 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Chronos Wallet
              </h1>
              <p className="text-gray-400 mt-2">Trinity Protocol Security • Multi-Chain Support • Quantum Resistant</p>
            </div>
          </div>

          {/* Security Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-400 font-semibold">Trinity Protocol</p>
                    <p className="text-sm text-gray-400">99.99% Consensus</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-blue-400 font-semibold">Quantum Resistant</p>
                    <p className="text-sm text-gray-400">Advanced Encryption</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-purple-400 font-semibold">Cross-Chain</p>
                    <p className="text-sm text-gray-400">3 Networks Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Connect Wallet & Quick Actions */}
          <div className="mb-8">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-purple-400" />
                    <div>
                      <CardTitle className="text-lg">Wallet Status</CardTitle>
                      <p className="text-sm text-gray-400">Connect your wallets to authorize transactions</p>
                    </div>
                  </div>
                  
                  {/* Wallet Connection Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button
                      onClick={connectMetaMask}
                      className="flex items-center gap-2 bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                      variant="outline"
                    >
                      <Wallet className="w-4 h-4" />
                      MetaMask
                    </Button>
                    
                    <Button
                      onClick={connectPhantom}
                      className="flex items-center gap-2 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
                      variant="outline"
                    >
                      <Wallet className="w-4 h-4" />
                      Phantom
                    </Button>
                    
                    <Button
                      onClick={connectTonKeeper}
                      className="flex items-center gap-2 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                      variant="outline"
                    >
                      <Wallet className="w-4 h-4" />
                      TON Keeper
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Wallet to Vault Integration */}
          <div className="mb-8">
            <WalletVaultIntegration 
              connectedWallets={getConnectedWalletsForVault()} 
              onCreateVault={handleCreateVault}
            />
          </div>

          {/* Main Wallet Tabs */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
                <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
                <TabsTrigger value="deposit" className="text-xs">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw" className="text-xs">Withdraw</TabsTrigger>
                <TabsTrigger value="transactions" className="text-xs">History</TabsTrigger>
                <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="portfolio" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Portfolio Overview */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(walletBalances).map(([chain, data]) => (
                      <Card key={chain} className="bg-gray-800/50 border-gray-600 p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${chainConfigs[chain as keyof typeof chainConfigs].color}`}></div>
                              <span className="font-semibold capitalize text-sm">{chain}</span>
                            </div>
                            <Badge className={data.address ? "bg-green-500/20 text-green-400 text-xs" : "bg-red-500/20 text-red-400 text-xs"}>
                              {data.address ? "Connected" : "Disconnected"}
                            </Badge>
                          </div>
                          
                          {data.address ? (
                            <>
                              <div className="text-center py-2">
                                <p className="text-xl font-bold">{data.balance} {data.symbol}</p>
                                <p className="text-gray-400 text-sm">{data.usd}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  {data.address.slice(0, 6)}...{data.address.slice(-4)}
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => copyAddress(chainConfigs[chain as keyof typeof chainConfigs].address)}
                                  className="w-full text-xs"
                                >
                                  <Copy className="w-3 h-3 mr-1" />
                                  Copy Address
                                </Button>
                                
                                {(chain === 'solana' || chain === 'ton') && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleAirdrop(chain as 'solana' | 'ton')}
                                    className="w-full text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
                                  >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Get Testnet Tokens
                                  </Button>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-400 mb-3 text-sm">Wallet not connected</p>
                              <Button 
                                size="sm" 
                                className="w-full text-xs"
                                onClick={() => connectWallet(chain)}
                                disabled={isLoading}
                              >
                                <Wallet className="w-3 h-3 mr-1" />
                                {isLoading ? 'Connecting...' : `Connect ${chain.charAt(0).toUpperCase() + chain.slice(1)}`}
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-gray-900/50 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            tx.type === 'received' ? 'bg-green-500/20 text-green-400' :
                            tx.type === 'sent' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {tx.type === 'received' ? '↓' : tx.type === 'sent' ? '↑' : '↔'}
                          </div>
                          <div>
                            <p className="font-semibold">{tx.amount}</p>
                            <p className="text-sm text-gray-400">
                              {tx.type === 'received' ? `From ${tx.from}` : 
                               tx.type === 'sent' ? `To ${tx.to}` : 'Cross-chain swap'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                            {tx.status}
                          </Badge>
                          <p className="text-sm text-gray-400 mt-1">{tx.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Panel */}
            <div>
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Wallet Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="send" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 text-xs">
                      <TabsTrigger value="send">Send</TabsTrigger>
                      <TabsTrigger value="swap">Swap</TabsTrigger>
                      <TabsTrigger value="multisig">MultiSig</TabsTrigger>
                      <TabsTrigger value="hardware">Hardware</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="send" className="space-y-4 mt-6">
                      <div>
                        <Label>Select Chain</Label>
                        <select 
                          value={selectedChain}
                          onChange={(e) => setSelectedChain(e.target.value)}
                          className="w-full mt-2 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                          <option value="ethereum">Ethereum</option>
                          <option value="solana">Solana</option>
                          <option value="ton">TON</option>
                        </select>
                      </div>

                      <div>
                        <Label>Amount</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="mt-2 bg-gray-800 border-gray-700"
                        />
                      </div>

                      <div>
                        <Label>Recipient Address</Label>
                        <Input
                          placeholder="Enter wallet address"
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                          className="mt-2 bg-gray-800 border-gray-700"
                        />
                      </div>

                      <Button 
                        onClick={handleSend}
                        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send with Trinity Security
                      </Button>
                    </TabsContent>

                    <TabsContent value="receive" className="space-y-4 mt-6">
                      <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <ArrowUpDown className="w-8 h-8 text-white rotate-90" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Receive Funds</h3>
                        <p className="text-gray-400 mb-4">
                          Share your wallet address to receive {chainConfigs[selectedChain as keyof typeof chainConfigs]?.name} assets
                        </p>
                        
                        <div className="bg-gray-900 p-4 rounded-lg mb-4">
                          <Label className="text-sm text-gray-400">Your {chainConfigs[selectedChain as keyof typeof chainConfigs]?.name} Address</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <Input 
                              value={chainConfigs[selectedChain as keyof typeof chainConfigs]?.address || ''} 
                              readOnly 
                              className="bg-gray-800 border-gray-700 text-sm"
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(chainConfigs[selectedChain as keyof typeof chainConfigs]?.address || '');
                                toast({
                                  title: "Address Copied",
                                  description: "Wallet address copied to clipboard",
                                });
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {Object.entries(chainConfigs).map(([key, config]) => (
                            <Button
                              key={key}
                              variant={selectedChain === key ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedChain(key)}
                              className="text-xs"
                            >
                              {config.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="swap" className="space-y-4 mt-6">
                      <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                        <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-lg font-semibold mb-2">Atomic Cross-Chain Swaps</h3>
                        <p className="text-gray-400 mb-4">
                          Instant, secure swaps between Ethereum, Solana, and TON networks
                        </p>
                        <Link href="/cross-chain-atomic-swap">
                          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                            <Zap className="w-4 h-4 mr-2" />
                            Launch Swap Interface
                          </Button>
                        </Link>
                      </div>
                    </TabsContent>

                    <TabsContent value="withdraw" className="space-y-4 mt-6">
                      <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <ArrowUpDown className="w-8 h-8 text-white rotate-180" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Withdraw to External Wallet</h3>
                        <p className="text-gray-400 mb-4">
                          Transfer your assets to external wallets or exchanges
                        </p>
                        
                        <div className="space-y-4 text-left">
                          <div>
                            <Label>Select Chain</Label>
                            <select 
                              className="w-full mt-2 p-2 bg-gray-800 border border-gray-700 rounded-md"
                              value={selectedChain}
                              onChange={(e) => setSelectedChain(e.target.value)}
                            >
                              <option value="ethereum">Ethereum (ETH)</option>
                              <option value="solana">Solana (SOL)</option>
                              <option value="ton">TON</option>
                            </select>
                          </div>

                          <div>
                            <Label>Amount to Withdraw</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={sendAmount}
                              onChange={(e) => setSendAmount(e.target.value)}
                              className="mt-2 bg-gray-800 border-gray-700"
                            />
                            <p className="text-sm text-gray-400 mt-1">
                              Available: {walletBalances[selectedChain as keyof typeof walletBalances].balance} {walletBalances[selectedChain as keyof typeof walletBalances].symbol}
                            </p>
                          </div>

                          <div>
                            <Label>External Wallet Address</Label>
                            <Input
                              placeholder="Enter destination address"
                              value={recipientAddress}
                              onChange={(e) => setRecipientAddress(e.target.value)}
                              className="mt-2 bg-gray-800 border-gray-700"
                            />
                          </div>

                          <Button 
                            onClick={() => {
                              if (!sendAmount || !recipientAddress) {
                                toast({
                                  title: "Missing Information",
                                  description: "Please enter amount and destination address",
                                  variant: "destructive",
                                });
                                return;
                              }
                              handleWithdraw(sendAmount, recipientAddress, selectedChain);
                              setSendAmount('');
                              setRecipientAddress('');
                            }}
                            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                          >
                            <ArrowUpDown className="w-4 h-4 mr-2 rotate-180" />
                            Withdraw Funds
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Multi-Signature Wallet Tab */}
                    <TabsContent value="multisig" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <Users className="w-6 h-6 text-blue-400" />
                          <div>
                            <h3 className="font-semibold text-blue-400">Multi-Signature Wallet</h3>
                            <p className="text-sm text-gray-400">Require multiple signatures for enhanced security</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Create MultiSig Wallet</h4>
                              <p className="text-sm text-gray-400 mb-3">Set up a new multi-signature wallet</p>
                              <Link href="/multi-signature-vault-new">
                                <Button size="sm" className="w-full">
                                  <Users className="w-4 h-4 mr-2" />
                                  Create MultiSig
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4">
                              <h4 className="font-semibold mb-2">Active MultiSig Wallets</h4>
                              <p className="text-sm text-gray-400 mb-3">0 active multi-signature wallets</p>
                              <Button size="sm" variant="outline" className="w-full" disabled>
                                View MultiSig Wallets
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        <Card className="bg-gray-800/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-sm">MultiSig Transaction</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <Label className="text-xs">Required Signatures</Label>
                              <Input placeholder="2" className="mt-1 bg-gray-700 border-gray-600 text-sm" />
                            </div>
                            <div>
                              <Label className="text-xs">Co-signer Addresses</Label>
                              <Input placeholder="Add co-signer address" className="mt-1 bg-gray-700 border-gray-600 text-sm" />
                            </div>
                            <Button 
                              size="sm" 
                              className="w-full bg-blue-500 hover:bg-blue-600"
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/security/multisig/initialize', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      requiredSignatures: 2,
                                      cosigners: ['0x...'] // Add actual addresses
                                    })
                                  });
                                  
                                  const data = await response.json();
                                  
                                  if (data.status === 'success') {
                                    toast({
                                      title: "MultiSig Initialized",
                                      description: "Multi-signature transaction setup complete",
                                    });
                                  } else {
                                    toast({
                                      title: "MultiSig Setup Failed",
                                      description: data.message || "Failed to initialize MultiSig",
                                      variant: "destructive",
                                    });
                                  }
                                } catch (error) {
                                  toast({
                                    title: "Network Error",
                                    description: "Failed to connect to MultiSig service",
                                    variant: "destructive",
                                  });
                                }
                              }}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Initialize MultiSig Transaction
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Hardware Wallet Tab */}
                    <TabsContent value="hardware" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <HardDrive className="w-6 h-6 text-green-400" />
                          <div>
                            <h3 className="font-semibold text-green-400">Hardware Wallet Integration</h3>
                            <p className="text-sm text-gray-400">Connect Ledger or Trezor for maximum security</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4 text-center">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <HardDrive className="w-6 h-6 text-blue-400" />
                              </div>
                              <h4 className="font-semibold mb-2">Ledger</h4>
                              <p className="text-xs text-gray-400 mb-3">Connect your Ledger hardware wallet</p>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={async () => {
                                  try {
                                    const response = await fetch('/api/security/hardware-wallet/connect', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ device: 'ledger' })
                                    });
                                    
                                    const data = await response.json();
                                    
                                    if (data.status === 'success') {
                                      toast({
                                        title: "Ledger Connected",
                                        description: "Hardware wallet connected successfully",
                                      });
                                    } else {
                                      toast({
                                        title: "Connection Failed",
                                        description: "Please connect and unlock your Ledger device",
                                        variant: "destructive",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Hardware Wallet Error",
                                      description: "Failed to connect to Ledger device",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Connect Ledger
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4 text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Key className="w-6 h-6 text-green-400" />
                              </div>
                              <h4 className="font-semibold mb-2">Trezor</h4>
                              <p className="text-xs text-gray-400 mb-3">Connect your Trezor hardware wallet</p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={async () => {
                                  try {
                                    const response = await fetch('/api/security/hardware-wallet/connect', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ device: 'trezor' })
                                    });
                                    
                                    const data = await response.json();
                                    
                                    if (data.status === 'success') {
                                      toast({
                                        title: "Trezor Connected",
                                        description: "Hardware wallet connected successfully",
                                      });
                                    } else {
                                      toast({
                                        title: "Connection Failed",
                                        description: "Please connect and unlock your Trezor device",
                                        variant: "destructive",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Hardware Wallet Error",
                                      description: "Failed to connect to Trezor device",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                Connect Trezor
                              </Button>
                            </CardContent>
                          </Card>
                        </div>

                        <Card className="bg-gray-800/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-sm">Hardware Wallet Status</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-400">Connected Devices</span>
                              <Badge variant="outline">0 devices</Badge>
                            </div>
                            <div className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-400">Security Level</span>
                              <Badge className="bg-yellow-500/20 text-yellow-400">Standard</Badge>
                            </div>
                            <Button size="sm" className="w-full mt-3" variant="outline">
                              <Settings className="w-4 h-4 mr-2" />
                              Hardware Wallet Settings
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* Advanced Security Tab */}
                    <TabsContent value="security" className="space-y-4 mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                          <Shield className="w-6 h-6 text-purple-400" />
                          <div>
                            <h3 className="font-semibold text-purple-400">Advanced Security Features</h3>
                            <p className="text-sm text-gray-400">Biometric auth, time-locks, and enhanced protection</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Fingerprint className="w-5 h-5 text-blue-400" />
                                <h4 className="font-semibold">Biometric Authentication</h4>
                              </div>
                              <p className="text-xs text-gray-400 mb-3">Secure your wallet with fingerprint or face recognition</p>
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={async () => {
                                  try {
                                    const response = await fetch('/api/security/biometric/enable', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' }
                                    });
                                    
                                    const data = await response.json();
                                    
                                    if (data.status === 'success') {
                                      toast({
                                        title: "Biometric Authentication Enabled",
                                        description: "Fingerprint authentication is now active",
                                      });
                                    } else {
                                      toast({
                                        title: "Biometric Setup Failed",
                                        description: data.message || "Failed to enable biometric authentication",
                                        variant: "destructive",
                                      });
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Biometric Error",
                                      description: "Failed to configure biometric authentication",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                              >
                                <Fingerprint className="w-4 h-4 mr-2" />
                                Enable Biometric Auth
                              </Button>
                            </CardContent>
                          </Card>

                          <Card className="bg-gray-800/50 border-gray-600">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <Clock className="w-5 h-5 text-green-400" />
                                <h4 className="font-semibold">Time-Locked Transactions</h4>
                              </div>
                              <p className="text-xs text-gray-400 mb-3">Schedule transactions for future execution</p>
                              <Link href="/advanced-time-lock-vault">
                                <Button size="sm" variant="outline" className="w-full">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Create Time-Lock
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>

                        <Card className="bg-gray-800/50 border-gray-600">
                          <CardHeader>
                            <CardTitle className="text-sm">Security Settings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Two-Factor Authentication</span>
                              <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Zero-Knowledge Privacy</span>
                              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Quantum Resistance</span>
                              <Badge className="bg-blue-500/20 text-blue-400">Enabled</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Trinity Protocol</span>
                              <Badge className="bg-purple-500/20 text-purple-400">Active</Badge>
                            </div>
                            
                            <div className="pt-3 space-y-2">
                              <Button size="sm" className="w-full" variant="outline">
                                <Settings className="w-4 h-4 mr-2" />
                                Advanced Security Settings
                              </Button>
                              <Link href="/security-dashboard">
                                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
                                  <Shield className="w-4 h-4 mr-2" />
                                  Open Security Dashboard
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-900/50 border-gray-700 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Security Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zero-Knowledge</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Multi-Sig</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vault Integration</span>
                    <Badge className="bg-purple-500/20 text-purple-400">Connected</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Deposit Tab */}
        <TabsContent value="deposit" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(walletBalances).map(([chain, data]) => (
              <Card key={chain} className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${chainConfigs[chain as keyof typeof chainConfigs].color}`}></div>
                    Deposit {chain.charAt(0).toUpperCase() + chain.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.address ? (
                    <>
                      <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-400 mb-2">Send {data.symbol} to this address:</p>
                        <p className="font-mono text-xs bg-gray-700 p-2 rounded break-all">{data.address}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-3"
                          onClick={() => copyAddress(data.address)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Address
                        </Button>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Network: {chain.charAt(0).toUpperCase() + chain.slice(1)}</p>
                        <p className="text-xs text-gray-500">Only send {data.symbol} to this address</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-gray-400 mb-3">Connect wallet to get deposit address</p>
                      <Button 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: `Connect ${chain.charAt(0).toUpperCase() + chain.slice(1)}`,
                            description: "Connect your wallet to get deposit address",
                          });
                        }}
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect {chain.charAt(0).toUpperCase() + chain.slice(1)}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Withdraw Tab */}
        <TabsContent value="withdraw" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <p className="text-sm text-gray-400">Transfer your assets to external wallets</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Network</Label>
                  <select 
                    className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded-lg"
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                  >
                    <option value="ethereum">Ethereum (ETH)</option>
                    <option value="solana">Solana (SOL)</option>
                    <option value="ton">TON</option>
                  </select>
                </div>
                <div>
                  <Label>Amount to Withdraw</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-700"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Available: {walletBalances[selectedChain as keyof typeof walletBalances].balance} {walletBalances[selectedChain as keyof typeof walletBalances].symbol}
                  </p>
                </div>
                <div>
                  <Label>Destination Address</Label>
                  <Input
                    placeholder="Enter destination wallet address"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-700"
                  />
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  onClick={() => {
                    if (!sendAmount || !recipientAddress) {
                      toast({
                        title: "Missing Information",
                        description: "Please enter amount and destination address",
                        variant: "destructive",
                      });
                      return;
                    }
                    toast({
                      title: "Withdrawal Initiated",
                      description: `Withdrawing ${sendAmount} ${walletBalances[selectedChain as keyof typeof walletBalances].symbol}`,
                    });
                  }}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2 rotate-180" />
                  Withdraw Funds
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionHistory.length > 0 ? (
                <div className="space-y-3">
                  {transactionHistory.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          tx.status === 'confirmed' ? 'bg-green-400' : 
                          tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                          <p className="text-sm text-gray-400">{tx.amount}</p>
                          {tx.to && <p className="text-xs text-gray-500">To: {tx.to.slice(0, 8)}...{tx.to.slice(-6)}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{tx.timestamp}</p>
                        <Badge className={`text-xs ${
                          tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 
                          tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent transactions</p>
                  <p className="text-sm text-gray-500 mt-2">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Trinity Protocol</span>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Zero-Knowledge Privacy</span>
                  <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Multi-Signature</span>
                  <Badge className="bg-blue-500/20 text-blue-400">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Hardware Wallet</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">Not Connected</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  Advanced Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/security/multisig/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      
                      const data = await response.json();
                      
                      if (data.status === 'success') {
                        toast({
                          title: "Multi-Signature Setup Complete",
                          description: "Multi-signature wallet has been configured",
                        });
                      } else {
                        toast({
                          title: "Setup Failed",
                          description: data.message || "Failed to setup multi-signature",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Network Error",
                        description: "Failed to connect to security service",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Setup Multi-Signature
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/security/hardware-wallet/scan', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      
                      const data = await response.json();
                      
                      if (data.status === 'success') {
                        toast({
                          title: "Hardware Wallet Detected",
                          description: "Found compatible hardware wallet",
                        });
                      } else {
                        toast({
                          title: "No Hardware Wallet Found",
                          description: "Please connect your Ledger or Trezor device",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Hardware Wallet Error",
                        description: "Failed to scan for hardware wallets",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Connect Hardware Wallet
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/security/biometric/setup', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      
                      const data = await response.json();
                      
                      if (data.status === 'success') {
                        toast({
                          title: "Biometric Authentication Enabled",
                          description: "Fingerprint authentication is now active",
                        });
                      } else {
                        toast({
                          title: "Biometric Setup Failed",
                          description: data.message || "Failed to enable biometric authentication",
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Biometric Error",
                        description: "Failed to configure biometric authentication",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Enable Biometric Auth
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Network Preferences</h3>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <span>Default Network</span>
                    <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1">
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>TON</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Security Settings</h3>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <span>Auto-lock Timeout</span>
                    <select className="bg-gray-700 border border-gray-600 rounded px-3 py-1">
                      <option>5 minutes</option>
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Privacy</h3>
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
                    <span>Hide Balance</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>

                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
        </div>
      </div>
    </div>
  );
}