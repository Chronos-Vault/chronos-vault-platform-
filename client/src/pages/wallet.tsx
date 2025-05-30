import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

export default function WalletPage() {
  const { toast } = useToast();
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [hasWallet, setHasWallet] = useState(false); // Check if user has created a wallet

  // Mock wallet data - replace with real API calls
  const walletBalances = {
    ethereum: { balance: '12.5847', symbol: 'ETH', usd: '$41,423.50' },
    solana: { balance: '245.32', symbol: 'SOL', usd: '$8,932.15' },
    ton: { balance: '1,847.90', symbol: 'TON', usd: '$3,695.80' }
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

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
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
      address: '0x742d35cc6aa31ae21a60bf2c8d10b1e5a3e33a3b'
    },
    solana: {
      name: 'Solana',
      color: 'bg-purple-500',
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
    },
    ton: {
      name: 'TON',
      color: 'bg-cyan-500',
      address: 'EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG'
    }
  };

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

          {/* Main Wallet Interface */}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(walletBalances).map(([chain, data]) => (
                      <div key={chain} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${chainConfigs[chain as keyof typeof chainConfigs].color}`}></div>
                          <span className="font-semibold capitalize">{chain}</span>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{data.balance} {data.symbol}</p>
                          <p className="text-gray-400">{data.usd}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyAddress(chainConfigs[chain as keyof typeof chainConfigs].address)}
                            className="text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy Address
                          </Button>
                        </div>
                      </div>
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
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="send">Send</TabsTrigger>
                      <TabsTrigger value="swap">Swap</TabsTrigger>
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

                    <TabsContent value="swap" className="space-y-4 mt-6">
                      <div className="text-center p-8 bg-gray-800/50 rounded-lg">
                        <ArrowUpDown className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                        <h3 className="text-lg font-semibold mb-2">Atomic Cross-Chain Swaps</h3>
                        <p className="text-gray-400 mb-4">
                          Instant, secure swaps between Ethereum, Solana, and TON networks
                        </p>
                        <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
                          <Zap className="w-4 h-4 mr-2" />
                          Launch Swap Interface
                        </Button>
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
        </div>
      </div>
    </div>
  );
}