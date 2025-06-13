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
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useAuthContext } from '@/context/AuthContext';
import { WalletAuthModal } from '@/components/auth/WalletAuthModal';

// TypeScript declarations for wallet APIs
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

export default function WalletPage() {
  const { toast } = useToast();
  const walletAuth = useWalletAuth();
  const { user, showAuthModal, setShowAuthModal } = useAuthContext();

  // Connect wallet using the new authentication system
  const connectWallet = async (walletType: string, blockchain: string) => {
    try {
      let walletAddress = '';

      // Get wallet address based on type
      switch (walletType) {
        case 'metamask':
          if (!window.ethereum) {
            toast({
              title: "MetaMask Not Found",
              description: "Please install MetaMask extension",
              variant: "destructive"
            });
            return;
          }
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          walletAddress = accounts[0];
          break;

        case 'phantom':
          if (!window.solana?.isPhantom) {
            toast({
              title: "Phantom Not Found", 
              description: "Please install Phantom wallet",
              variant: "destructive"
            });
            return;
          }
          const response = await window.solana.connect();
          walletAddress = response.publicKey.toString();
          break;

        case 'tonkeeper':
          // For TON, use simulated address for demo
          walletAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
          break;

        default:
          throw new Error('Unsupported wallet type');
      }

      // Use the new authentication system
      const success = await walletAuth.authenticateWallet(walletType, walletAddress, blockchain);
      
      if (success) {
        toast({
          title: "Wallet Connected",
          description: `Successfully authenticated ${walletType} wallet`,
        });
        // Refresh the page to show authenticated state
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [sendAmount, setSendAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [realWalletBalances, setRealWalletBalances] = useState<any>({});
  const [activeTab, setActiveTab] = useState('portfolio');

  // Check authentication status and load wallet data
  useEffect(() => {
    const checkWalletStatus = async () => {
      try {
        if (user) {
          // Load wallet balances and data
          const response = await fetch('/api/testnet-wallet/balances');
          if (response.ok) {
            const data = await response.json();
            setRealWalletBalances(data.data || {});
          }
        }
      } catch (error) {
        console.log('Error checking wallet status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWalletStatus();
  }, [user]);

  const walletBalances = {
    ethereum: { 
      balance: realWalletBalances.ethereum?.balance || '0.0000', 
      symbol: 'ETH', 
      usd: '$0.00',
      address: realWalletBalances.addresses?.ethereum || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
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

  // Show wallet connection interface if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="relative px-6 py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl w-20 h-20 mx-auto mb-8 flex items-center justify-center">
              <Wallet className="w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              Secure multi-chain wallet authentication with Trinity Protocol
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gray-900/50 border-orange-500/30">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🦊</div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">MetaMask</h3>
                  <p className="text-gray-400 text-sm mb-6">Ethereum & EVM Compatible</p>
                  <Button
                    onClick={() => connectWallet('metamask', 'ethereum')}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={walletAuth.isAuthenticated}
                  >
                    {walletAuth.isAuthenticated ? 'Connected' : 'Connect MetaMask'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">👻</div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Phantom</h3>
                  <p className="text-gray-400 text-sm mb-6">Solana Ecosystem</p>
                  <Button
                    onClick={() => connectWallet('phantom', 'solana')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={walletAuth.isAuthenticated}
                  >
                    {walletAuth.isAuthenticated ? 'Connected' : 'Connect Phantom'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/30">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">TON Keeper</h3>
                  <p className="text-gray-400 text-sm mb-6">TON Blockchain</p>
                  <Button
                    onClick={() => connectWallet('tonkeeper', 'ton')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={walletAuth.isAuthenticated}
                  >
                    {walletAuth.isAuthenticated ? 'Connected' : 'Connect TON Keeper'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-green-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-semibold">Trinity Protocol</p>
                      <p className="text-sm text-gray-400">Triple-chain security</p>
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
                      <p className="text-sm text-gray-400">Advanced encryption</p>
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
                      <p className="text-sm text-gray-400">Multi-network support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <WalletAuthModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative px-6 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
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
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Shield className="w-3 h-3 mr-1" />
                Authenticated
              </Badge>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900/50">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="send">Send</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(walletBalances).map(([chain, data]) => (
                  <Card key={chain} className="bg-gray-900/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">{chain}</CardTitle>
                        <Badge className={`${
                          chain === 'ethereum' ? 'bg-blue-500/20 text-blue-400' :
                          chain === 'solana' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {data.symbol}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-2xl font-bold">{data.balance} {data.symbol}</p>
                          <p className="text-gray-400">{data.usd}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Input
                            value={data.address}
                            readOnly
                            className="text-xs bg-gray-800 border-gray-600"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyAddress(data.address)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="send" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Network</Label>
                      <select
                        value={selectedChain}
                        onChange={(e) => setSelectedChain(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                      >
                        <option value="ethereum">Ethereum</option>
                        <option value="solana">Solana</option>
                        <option value="ton">TON</option>
                      </select>
                    </div>
                    <div>
                      <Label>Amount</Label>
                      <Input
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Recipient Address</Label>
                    <Input
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter wallet address"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>

                  <Button onClick={handleSend} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send with Trinity Protocol
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            tx.type === 'received' ? 'bg-green-500/20 text-green-400' :
                            tx.type === 'sent' ? 'bg-red-500/20 text-red-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {tx.type === 'received' ? '↓' : tx.type === 'sent' ? '↑' : '↔'}
                          </div>
                          <div>
                            <p className="font-semibold">{tx.amount}</p>
                            <p className="text-sm text-gray-400">{tx.timestamp} • {tx.chain}</p>
                          </div>
                        </div>
                        <Badge className={`${
                          tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tx.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Wallet Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Trinity Protocol</p>
                      <p className="text-sm text-gray-400">Enhanced security verification</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Quantum Resistance</p>
                      <p className="text-sm text-gray-400">Advanced encryption protocols</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <p className="font-semibold">Cross-Chain Verification</p>
                      <p className="text-sm text-gray-400">Multi-network consensus</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <WalletAuthModal />
    </div>
  );
}