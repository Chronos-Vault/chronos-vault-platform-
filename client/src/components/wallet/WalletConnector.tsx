import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  connected: boolean;
  address: string;
  type: string;
  blockchain: string;
  connecting: boolean;
}

interface WalletConnectorProps {
  onWalletConnected?: (wallet: WalletState) => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ onWalletConnected }) => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<Record<string, WalletState>>({
    metamask: { connected: false, address: '', type: 'metamask', blockchain: 'ethereum', connecting: false },
    phantom: { connected: false, address: '', type: 'phantom', blockchain: 'solana', connecting: false },
    tonkeeper: { connected: false, address: '', type: 'tonkeeper', blockchain: 'ton', connecting: false }
  });

  const connectWallet = async (walletType: string) => {
    const wallet = wallets[walletType];
    setWallets(prev => ({ 
      ...prev, 
      [walletType]: { ...prev[walletType], connecting: true } 
    }));

    try {
      let address = '';
      let signature = '';
      let message = '';

      // Get wallet address based on type
      if (walletType === 'metamask') {
        if (!window.ethereum?.isMetaMask) {
          throw new Error('MetaMask not installed');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
      } else if (walletType === 'phantom') {
        if (!window.solana?.isPhantom) {
          throw new Error('Phantom wallet not installed');
        }
        const response = await window.solana.connect();
        address = response.publicKey.toString();
      } else if (walletType === 'tonkeeper') {
        // Simulate TON wallet connection
        address = `0:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      }

      // Request authentication from backend
      const authResponse = await fetch('/api/wallet/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType,
          blockchain: wallet.blockchain
        })
      });

      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error('Failed to request authentication');
      }

      // Sign message based on wallet type
      if (walletType === 'metamask') {
        signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [authData.message, address]
        });
      } else if (walletType === 'phantom') {
        const messageBytes = new TextEncoder().encode(authData.message);
        const signedMessage = await window.solana.signMessage(messageBytes);
        signature = JSON.stringify(Array.from(signedMessage.signature));
      } else if (walletType === 'tonkeeper') {
        signature = 'ton_signature_' + Date.now();
      }

      message = authData.message;

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
          walletType,
          blockchain: wallet.blockchain,
          signature,
          message
        })
      });

      const connectData = await connectResponse.json();
      if (!connectData.success) {
        throw new Error('Failed to connect wallet');
      }

      // Update state
      const connectedWallet = { 
        ...wallet, 
        connected: true, 
        address, 
        connecting: false 
      };
      
      setWallets(prev => ({ 
        ...prev, 
        [walletType]: connectedWallet
      }));

      // Store session
      localStorage.setItem('wallet_session', connectData.session.id);

      // Notify parent component
      onWalletConnected?.(connectedWallet);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error: any) {
      console.error(`${walletType} connection error:`, error);
      setWallets(prev => ({ 
        ...prev, 
        [walletType]: { ...prev[walletType], connecting: false } 
      }));
      
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect ${walletType}`,
        variant: "destructive",
      });
    }
  };

  const walletData = [
    {
      id: 'metamask',
      name: 'MetaMask',
      blockchain: 'Ethereum',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-500',
      available: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'phantom',
      name: 'Phantom',
      blockchain: 'Solana',
      icon: '👻',
      color: 'from-purple-500 to-pink-500',
      available: typeof window !== 'undefined' && window.solana?.isPhantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      blockchain: 'TON',
      icon: '💎',
      color: 'from-blue-500 to-cyan-500',
      available: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {walletData.map((wallet) => {
        const state = wallets[wallet.id];
        
        return (
          <Card key={wallet.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{wallet.icon}</span>
                  <div>
                    <div className="text-white text-sm">{wallet.name}</div>
                    <div className="text-xs text-gray-400">{wallet.blockchain}</div>
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
                <div className="text-xs text-gray-300 font-mono">
                  {state.address.slice(0, 6)}...{state.address.slice(-4)}
                </div>
              ) : (
                <div className="space-y-2">
                  {!wallet.available && (
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      Not installed
                    </div>
                  )}
                  <Button
                    onClick={() => connectWallet(wallet.id)}
                    disabled={state.connecting || !wallet.available}
                    className={`w-full text-xs bg-gradient-to-r ${wallet.color} hover:opacity-90`}
                    size="sm"
                  >
                    {state.connecting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-3 h-3 mr-1" />
                        Connect
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
  );
};

export default WalletConnector;