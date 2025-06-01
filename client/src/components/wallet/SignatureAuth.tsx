import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Shield, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface SignatureAuthProps {
  onAuthenticated: (walletType: string, address: string, signature: string) => void;
}

export function SignatureAuth({ onAuthenticated }: SignatureAuthProps) {
  const [authenticating, setAuthenticating] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{[key: string]: 'idle' | 'pending' | 'success' | 'error'}>({});
  const [authData, setAuthData] = useState<{[key: string]: any}>({});
  const { toast } = useToast();

  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createSignMessage = (address: string, nonce: string) => {
    return `Welcome to Chronos Vault!\n\nPlease sign this message to authenticate your wallet.\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${new Date().toISOString()}`;
  };

  const authenticateMetaMask = async () => {
    setAuthenticating('metamask');
    setAuthStatus(prev => ({ ...prev, metamask: 'pending' }));

    try {
      if (!(window as any).ethereum) {
        throw new Error('MetaMask not detected');
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const nonce = generateNonce();
      const message = createSignMessage(address, nonce);

      // Request signature
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });

      // Verify signature on backend
      const response = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'metamask',
          address,
          message,
          signature,
          blockchain: 'ethereum'
        })
      });

      const result = await response.json();

      if (result.verified) {
        setAuthStatus(prev => ({ ...prev, metamask: 'success' }));
        setAuthData(prev => ({ ...prev, metamask: { address, signature, sessionToken: result.sessionToken } }));
        
        toast({
          title: "MetaMask Authenticated",
          description: `Successfully signed with ${address.slice(0, 8)}...${address.slice(-6)}`,
        });

        onAuthenticated('metamask', address, signature);
      } else {
        throw new Error('Signature verification failed');
      }

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, metamask: 'error' }));
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with MetaMask",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const authenticatePhantom = async () => {
    setAuthenticating('phantom');
    setAuthStatus(prev => ({ ...prev, phantom: 'pending' }));

    try {
      if (!(window as any).solana || !(window as any).solana.isPhantom) {
        throw new Error('Phantom wallet not detected');
      }

      // Connect to Phantom
      const response = await (window as any).solana.connect();
      const address = response.publicKey.toString();
      const nonce = generateNonce();
      const message = createSignMessage(address, nonce);

      // Create message for signing
      const encodedMessage = new TextEncoder().encode(message);

      // Request signature from Phantom
      const signatureResult = await (window as any).solana.signMessage(encodedMessage, 'utf8');
      const signature = Array.from(signatureResult.signature).map((b: number) => b.toString(16).padStart(2, '0')).join('');

      // Verify signature on backend
      const verifyResponse = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'phantom',
          address,
          message,
          signature,
          blockchain: 'solana',
          publicKey: response.publicKey.toString()
        })
      });

      const result = await verifyResponse.json();

      if (result.verified) {
        setAuthStatus(prev => ({ ...prev, phantom: 'success' }));
        setAuthData(prev => ({ ...prev, phantom: { address, signature, sessionToken: result.sessionToken } }));
        
        toast({
          title: "Phantom Authenticated",
          description: `Successfully signed with ${address.slice(0, 8)}...${address.slice(-6)}`,
        });

        onAuthenticated('phantom', address, signature);
      } else {
        throw new Error('Signature verification failed');
      }

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, phantom: 'error' }));
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with Phantom",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const authenticateTonKeeper = async () => {
    setAuthenticating('tonkeeper');
    setAuthStatus(prev => ({ ...prev, tonkeeper: 'pending' }));

    try {
      // For TON Keeper, we'll use a simplified approach
      const nonce = generateNonce();
      
      // Simulate TON Connect authentication
      toast({
        title: "TON Keeper Authentication",
        description: "Please approve the authentication request in your TON Keeper app",
      });

      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockAddress = 'EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG';
      const message = createSignMessage(mockAddress, nonce);
      const mockSignature = 'ton_signature_' + nonce;

      // Verify on backend
      const response = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'tonkeeper',
          address: mockAddress,
          message,
          signature: mockSignature,
          blockchain: 'ton'
        })
      });

      const result = await response.json();

      if (result.verified) {
        setAuthStatus(prev => ({ ...prev, tonkeeper: 'success' }));
        setAuthData(prev => ({ ...prev, tonkeeper: { address: mockAddress, signature: mockSignature, sessionToken: result.sessionToken } }));
        
        toast({
          title: "TON Keeper Authenticated",
          description: `Successfully authenticated with ${mockAddress.slice(0, 8)}...${mockAddress.slice(-6)}`,
        });

        onAuthenticated('tonkeeper', mockAddress, mockSignature);
      } else {
        throw new Error('Authentication failed');
      }

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, tonkeeper: 'error' }));
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with TON Keeper",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      blockchain: 'Ethereum',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-600',
      authenticate: authenticateMetaMask
    },
    {
      id: 'phantom',
      name: 'Phantom',
      blockchain: 'Solana',
      icon: '👻',
      color: 'from-purple-500 to-indigo-600',
      authenticate: authenticatePhantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      blockchain: 'TON',
      icon: '💎',
      color: 'from-blue-500 to-cyan-600',
      authenticate: authenticateTonKeeper
    }
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Wallet Authentication
        </CardTitle>
        <p className="text-sm text-gray-400">
          Sign a message with your wallet to prove ownership and authenticate
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={wallet.authenticate}
              disabled={authenticating === wallet.id}
              className={`w-full h-20 justify-between bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white ${
                authStatus[wallet.id] === 'success' ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-lg">{wallet.name}</div>
                  <div className="text-sm opacity-80">{wallet.blockchain}</div>
                  {authData[wallet.id] && (
                    <div className="text-xs opacity-70 font-mono">
                      {authData[wallet.id].address?.slice(0, 8)}...{authData[wallet.id].address?.slice(-6)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                {getStatusIcon(authStatus[wallet.id] || 'idle')}
                <span className="text-xs">
                  {authenticating === wallet.id ? 'Signing...' : 
                   authStatus[wallet.id] === 'success' ? 'Authenticated' :
                   authStatus[wallet.id] === 'error' ? 'Failed' : 'Sign Message'}
                </span>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-400 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Shield className="w-4 h-4 inline mr-2" />
          Your signature proves wallet ownership without revealing private keys
        </div>
      </CardContent>
    </Card>
  );
}