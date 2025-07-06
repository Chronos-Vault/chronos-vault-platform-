import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  Shield, 
  Check,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Type declarations for wallet interfaces
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    ton?: any;
  }
}

interface WalletState {
  connected: boolean;
  address: string;
  type: string;
  blockchain: string;
  connecting: boolean;
}

const WalletPage: React.FC = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<Record<string, WalletState>>({
    metamask: { connected: false, address: '', type: 'metamask', blockchain: 'ethereum', connecting: false },
    phantom: { connected: false, address: '', type: 'phantom', blockchain: 'solana', connecting: false },
    tonkeeper: { connected: false, address: '', type: 'tonkeeper', blockchain: 'ton', connecting: false }
  });
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('wallet_session');
    if (storedToken) {
      setSessionToken(storedToken);
      validateSession(storedToken);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('/api/wallet/session/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        localStorage.removeItem('wallet_session');
        setSessionToken(null);
      }
    } catch (error) {
      localStorage.removeItem('wallet_session');
      setSessionToken(null);
    }
  };

  const connectMetaMask = async () => {
    setWallets(prev => ({ ...prev, metamask: { ...prev.metamask, connecting: true } }));
    
    try {
      if (!window.ethereum?.isMetaMask) {
        throw new Error('MetaMask not installed');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      
      // Request authentication
      const authResponse = await fetch('/api/wallet/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'metamask',
          blockchain: 'ethereum'
        })
      });

      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error('Failed to request authentication');
      }

      // Sign message
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [authData.message, address]
      });

      // Verify signature
      const verifyResponse = await fetch('/api/wallet/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: authData.attemptId,
          signature
        })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error('Signature verification failed');
      }

      // Connect wallet
      const connectResponse = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'metamask',
          blockchain: 'ethereum',
          signature,
          message: authData.message
        })
      });

      const connectData = await connectResponse.json();
      if (!connectData.success) {
        throw new Error('Failed to connect wallet');
      }

      // Update state and store session
      setWallets(prev => ({ 
        ...prev, 
        metamask: { ...prev.metamask, connected: true, address, connecting: false } 
      }));
      setSessionToken(connectData.session.id);
      localStorage.setItem('wallet_session', connectData.session.id);

      toast({
        title: "MetaMask Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      setWallets(prev => ({ ...prev, metamask: { ...prev.metamask, connecting: false } }));
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect MetaMask",
        variant: "destructive",
      });
    }
  };

  const connectPhantom = async () => {
    setWallets(prev => ({ ...prev, phantom: { ...prev.phantom, connecting: true } }));
    
    try {
      if (!window.solana?.isPhantom) {
        throw new Error('Phantom wallet not installed');
      }

      // Connect to Phantom
      const response = await window.solana.connect();
      const address = response.publicKey.toString();

      // Request authentication
      const authResponse = await fetch('/api/wallet/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'phantom',
          blockchain: 'solana'
        })
      });

      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error('Failed to request authentication');
      }

      // Sign message
      const messageBytes = new TextEncoder().encode(authData.message);
      const signedMessage = await window.solana.signMessage(messageBytes);
      const signature = Array.from(signedMessage.signature);

      // Verify signature
      const verifyResponse = await fetch('/api/wallet/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: authData.attemptId,
          signature
        })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error('Signature verification failed');
      }

      // Connect wallet
      const connectResponse = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'phantom',
          blockchain: 'solana',
          signature: JSON.stringify(signature),
          message: authData.message
        })
      });

      const connectData = await connectResponse.json();
      if (!connectData.success) {
        throw new Error('Failed to connect wallet');
      }

      // Update state and store session
      setWallets(prev => ({ 
        ...prev, 
        phantom: { ...prev.phantom, connected: true, address, connecting: false } 
      }));
      setSessionToken(connectData.session.id);
      localStorage.setItem('wallet_session', connectData.session.id);

      toast({
        title: "Phantom Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error: any) {
      console.error('Phantom connection error:', error);
      setWallets(prev => ({ ...prev, phantom: { ...prev.phantom, connecting: false } }));
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Phantom",
        variant: "destructive",
      });
    }
  };

  const connectTonKeeper = async () => {
    setWallets(prev => ({ ...prev, tonkeeper: { ...prev.tonkeeper, connecting: true } }));
    
    try {
      // For TON, we'll use a simulated connection in development
      const address = `0:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Request authentication
      const authResponse = await fetch('/api/wallet/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'tonkeeper',
          blockchain: 'ton'
        })
      });

      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error('Failed to request authentication');
      }

      // Simulate signature for TON
      const signature = 'ton_signature_' + Date.now();

      // Verify signature
      const verifyResponse = await fetch('/api/wallet/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: authData.attemptId,
          signature
        })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error('Signature verification failed');
      }

      // Connect wallet
      const connectResponse = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType: 'tonkeeper',
          blockchain: 'ton',
          signature,
          message: authData.message
        })
      });

      const connectData = await connectResponse.json();
      if (!connectData.success) {
        throw new Error('Failed to connect wallet');
      }

      // Update state and store session
      setWallets(prev => ({ 
        ...prev, 
        tonkeeper: { ...prev.tonkeeper, connected: true, address, connecting: false } 
      }));
      setSessionToken(connectData.session.id);
      localStorage.setItem('wallet_session', connectData.session.id);

      toast({
        title: "TON Keeper Connected",
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`,
      });

    } catch (error: any) {
      console.error('TON Keeper connection error:', error);
      setWallets(prev => ({ ...prev, tonkeeper: { ...prev.tonkeeper, connecting: false } }));
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect TON Keeper",
        variant: "destructive",
      });
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const walletData = [
    {
      id: 'metamask',
      name: 'MetaMask',
      blockchain: 'Ethereum',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-500',
      connect: connectMetaMask,
      available: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'phantom',
      name: 'Phantom',
      blockchain: 'Solana',
      icon: '👻',
      color: 'from-purple-500 to-pink-500',
      connect: connectPhantom,
      available: typeof window !== 'undefined' && window.solana?.isPhantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      blockchain: 'TON',
      icon: '💎',
      color: 'from-blue-500 to-cyan-500',
      connect: connectTonKeeper,
      available: true // TON is always available in development
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Wallet Connection
          </h1>
          <p className="text-gray-400 text-lg">
            Connect your cryptocurrency wallets to access Chronos Vault
          </p>
        </div>

        {sessionToken && (
          <Card className="mb-6 bg-green-900/20 border-green-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Check className="w-5 h-5" />
                Session Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                You have an active wallet session. You can connect additional wallets or access your vaults.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {walletData.map((wallet) => {
            const state = wallets[wallet.id as keyof typeof wallets];
            
            return (
              <Card key={wallet.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wallet.icon}</span>
                      <div>
                        <div className="text-white font-semibold">{wallet.name}</div>
                        <div className="text-sm text-gray-400">{wallet.blockchain}</div>
                      </div>
                    </div>
                    {state.connected && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        Connected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.connected ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">Address</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-mono text-gray-300">
                            {state.address.slice(0, 8)}...{state.address.slice(-6)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAddress(state.address)}
                            className="p-1 h-auto"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(`/vault-types?wallet=${wallet.id}`, '_blank')}
                      >
                        Create Vault
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!wallet.available && (
                        <div className="flex items-center gap-2 text-yellow-500 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          Wallet not installed
                        </div>
                      )}
                      <Button
                        onClick={wallet.connect}
                        disabled={state.connecting || !wallet.available}
                        className={`w-full bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white`}
                      >
                        {state.connecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-4 h-4 mr-2" />
                            Connect {wallet.name}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-gray-800/30 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-2">
            <p>• Your private keys never leave your wallet</p>
            <p>• We only store wallet addresses and signatures for authentication</p>
            <p>• All transactions are signed locally in your wallet</p>
            <p>• Sessions expire automatically for security</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletPage;