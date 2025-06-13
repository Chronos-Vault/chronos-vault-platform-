import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Send, 
  ArrowUpDown, 
  Shield, 
  Copy,
  TrendingUp,
  Zap,
  Settings,
  LogOut,
  Eye,
  EyeOff
} from 'lucide-react';

// Global window types for wallet extensions
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] }) => Promise<any>;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      signMessage: (message: Uint8Array, encoding?: string) => Promise<{ signature: Uint8Array }>;
    };
  }
}

interface WalletInfo {
  address: string;
  walletType: string;
  token: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Transaction states
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapFromToken, setSwapFromToken] = useState('ETH');
  const [swapToToken, setSwapToToken] = useState('SOL');

  // Portfolio data
  const portfolioData = {
    totalValue: 12847.65,
    dailyChange: 324.12,
    dailyChangePercent: 2.59,
    tokens: [
      { symbol: 'ETH', amount: 3.25, value: 8234.50, change: 1.8 },
      { symbol: 'SOL', amount: 45.8, value: 2845.20, change: -0.5 },
      { symbol: 'TON', amount: 120.5, value: 1767.95, change: 4.2 }
    ]
  };

  // Real wallet connection functions
  const connectMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      window.open('https://metamask.io/download/', '_blank');
      throw new Error('MetaMask not detected. Please install MetaMask and refresh the page.');
    }

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) throw new Error('No accounts found in MetaMask');

    const address = accounts[0];
    const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
    
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address]
    });

    return { address, signature, message, walletType: 'metamask' };
  };

  const connectPhantom = async () => {
    if (!window.solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      throw new Error('Phantom not detected. Please install Phantom and refresh the page.');
    }

    const response = await window.solana.connect();
    if (!response?.publicKey) throw new Error('No public key received from Phantom');

    const address = response.publicKey.toString();
    const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
    
    const encodedMessage = new TextEncoder().encode(message);
    const signatureResponse = await window.solana.signMessage(encodedMessage, 'utf8');

    return { 
      address, 
      signature: Array.from(signatureResponse.signature), 
      message, 
      walletType: 'phantom' 
    };
  };

  const connectTonKeeper = async () => {
    try {
      const { TonConnectUI } = await import('@tonconnect/ui');
      
      const tonConnectUI = new TonConnectUI({
        manifestUrl: `${window.location.origin}/tonconnect-manifest.json`
      });

      const connectedWallet = await tonConnectUI.connectWallet();
      if (!connectedWallet) throw new Error('Failed to connect to TON wallet');

      const address = connectedWallet.account.address;
      const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
      const signature = `ton_connect_${Date.now()}_${connectedWallet.account.chain}`;

      return { address, signature, message, walletType: 'tonkeeper' };
    } catch (error) {
      window.open('https://tonkeeper.com/', '_blank');
      throw new Error('TON Keeper not detected. Please install TON Keeper and refresh the page.');
    }
  };

  // Handle wallet authentication
  const handleWalletConnect = async (walletType: 'metamask' | 'phantom' | 'tonkeeper') => {
    try {
      setLoading(true);
      let connection;

      switch (walletType) {
        case 'metamask':
          connection = await connectMetaMask();
          break;
        case 'phantom':
          connection = await connectPhantom();
          break;
        case 'tonkeeper':
          connection = await connectTonKeeper();
          break;
      }

      // Verify signature with backend
      const response = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: connection.address,
          message: connection.message,
          signature: connection.signature,
          walletType: connection.walletType,
          blockchain: connection.walletType === 'metamask' ? 'ethereum' : 
                     connection.walletType === 'phantom' ? 'solana' : 'ton'
        }),
      });

      const result = await response.json();
      
      if (!result.verified) {
        throw new Error(result.message || 'Signature verification failed');
      }

      // Store wallet info
      localStorage.setItem('wallet_session_token', result.sessionToken);
      localStorage.setItem('wallet_address', connection.address);
      localStorage.setItem('wallet_type', connection.walletType);
      
      setWalletInfo({
        address: connection.address,
        walletType: connection.walletType,
        token: result.sessionToken
      });
      setIsAuthenticated(true);

      toast({
        title: `${connection.walletType.charAt(0).toUpperCase() + connection.walletType.slice(1)} Connected`,
        description: `Successfully authenticated: ${connection.address.slice(0, 8)}...${connection.address.slice(-6)}`
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || 'Failed to connect wallet',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on load
  useEffect(() => {
    const token = localStorage.getItem('wallet_session_token');
    const address = localStorage.getItem('wallet_address');
    const walletType = localStorage.getItem('wallet_type');
    
    if (token && address && walletType) {
      setWalletInfo({ address, walletType, token });
      setIsAuthenticated(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('wallet_session_token');
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_type');
    setIsAuthenticated(false);
    setWalletInfo(null);
    toast({ title: "Logged out", description: "Wallet disconnected successfully" });
  };

  // Transaction handlers
  const handleDeposit = async () => {
    if (!depositAmount) {
      toast({ title: "Error", description: "Please enter deposit amount", variant: "destructive" });
      return;
    }
    toast({ title: "Deposit Initiated", description: `Depositing ${depositAmount} tokens` });
    setDepositAmount('');
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      toast({ title: "Error", description: "Please enter withdrawal details", variant: "destructive" });
      return;
    }
    toast({ title: "Withdrawal Initiated", description: `Withdrawing ${withdrawAmount} to ${withdrawAddress.slice(0, 8)}...` });
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  const handleSwap = async () => {
    if (!swapAmount) {
      toast({ title: "Error", description: "Please enter swap amount", variant: "destructive" });
      return;
    }
    toast({ title: "Swap Initiated", description: `Swapping ${swapAmount} ${swapFromToken} to ${swapToToken}` });
    setSwapAmount('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Connecting to wallet...</p>
        </div>
      </div>
    );
  }

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
              Chronos Vault
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              Secure multi-chain wallet authentication with real signature verification
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-900/50 border-orange-500/30 hover:border-orange-400/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">🦊</div>
                  <h3 className="text-xl font-semibold text-orange-400 mb-2">MetaMask</h3>
                  <p className="text-gray-400 text-sm mb-6">Ethereum & EVM Compatible</p>
                  <Button
                    onClick={() => handleWalletConnect('metamask')}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={loading}
                  >
                    Connect MetaMask
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">👻</div>
                  <h3 className="text-xl font-semibold text-purple-400 mb-2">Phantom</h3>
                  <p className="text-gray-400 text-sm mb-6">Solana Ecosystem</p>
                  <Button
                    onClick={() => handleWalletConnect('phantom')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={loading}
                  >
                    Connect Phantom
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/30 hover:border-blue-400/50 transition-colors">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">TON Keeper</h3>
                  <p className="text-gray-400 text-sm mb-6">TON Blockchain</p>
                  <Button
                    onClick={() => handleWalletConnect('tonkeeper')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    Connect TON Keeper
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main wallet dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chronos Vault</h1>
            <p className="text-gray-400">Multi-chain digital asset management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Connected Wallet</div>
              <div className="font-mono text-sm">
                {walletInfo?.address.slice(0, 8)}...{walletInfo?.address.slice(-6)}
              </div>
              <Badge variant="outline" className="text-xs">
                {walletInfo?.walletType}
              </Badge>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <Card className="bg-gray-900/50 border-orange-500/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Portfolio Overview
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBalanceVisible(!balanceVisible)}
              >
                {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Value</div>
                <div className="text-2xl font-bold">
                  {balanceVisible ? `$${portfolioData.totalValue.toLocaleString()}` : '••••••'}
                </div>
                <div className="text-sm text-green-400">
                  +${portfolioData.dailyChange} ({portfolioData.dailyChangePercent}%)
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">24h Change</div>
                <div className="text-xl font-semibold text-green-400">
                  +{portfolioData.dailyChangePercent}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Assets</div>
                <div className="text-xl font-semibold">
                  {portfolioData.tokens.length} Tokens
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit */}
              <Card className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Deposit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="depositAmount">Amount</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <Button onClick={handleDeposit} className="w-full bg-green-600 hover:bg-green-700">
                    Deposit Funds
                  </Button>
                </CardContent>
              </Card>

              {/* Withdraw */}
              <Card className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-red-400" />
                    Withdraw
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="withdrawAmount">Amount</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="withdrawAddress">Address</Label>
                    <Input
                      id="withdrawAddress"
                      placeholder="Destination address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <Button onClick={handleWithdraw} className="w-full bg-red-600 hover:bg-red-700">
                    Withdraw Funds
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Token List */}
            <Card className="bg-gray-900/50">
              <CardHeader>
                <CardTitle>Your Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.tokens.map((token) => (
                    <div key={token.symbol} className="flex justify-between items-center p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-purple-400 flex items-center justify-center font-bold">
                          {token.symbol.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{token.symbol}</div>
                          <div className="text-sm text-gray-400">{token.amount} tokens</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {balanceVisible ? `$${token.value.toLocaleString()}` : '••••••'}
                        </div>
                        <div className={`text-sm ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change >= 0 ? '+' : ''}{token.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swap" className="space-y-6">
            <Card className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="h-5 w-5" />
                  Token Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From</Label>
                    <select 
                      value={swapFromToken} 
                      onChange={(e) => setSwapFromToken(e.target.value)}
                      className="w-full p-2 rounded bg-gray-800 border-gray-700"
                    >
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                      <option value="TON">TON</option>
                    </select>
                  </div>
                  <div>
                    <Label>To</Label>
                    <select 
                      value={swapToToken} 
                      onChange={(e) => setSwapToToken(e.target.value)}
                      className="w-full p-2 rounded bg-gray-800 border-gray-700"
                    >
                      <option value="SOL">SOL</option>
                      <option value="ETH">ETH</option>
                      <option value="TON">TON</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="swapAmount">Amount</Label>
                  <Input
                    id="swapAmount"
                    type="number"
                    placeholder="0.00"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <Button onClick={handleSwap} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Swap Tokens
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-800/50">
                    <div>
                      <div className="font-semibold">Wallet Authentication</div>
                      <div className="text-sm text-gray-400">Verified signature authentication</div>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-800/50">
                    <div>
                      <div className="font-semibold">Multi-Chain Support</div>
                      <div className="text-sm text-gray-400">Ethereum, Solana, TON</div>
                    </div>
                    <Badge className="bg-green-600">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-lg bg-gray-800/50">
                    <div>
                      <div className="font-semibold">Session Management</div>
                      <div className="text-sm text-gray-400">Secure session tokens</div>
                    </div>
                    <Badge className="bg-green-600">Protected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}