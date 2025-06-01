import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle } from 'lucide-react';

interface SimpleWalletAuthProps {
  onWalletConnected: (walletType: string, address: string) => void;
}

export function SimpleWalletAuth({ onWalletConnected }: SimpleWalletAuthProps) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedWallets, setConnectedWallets] = useState<{[key: string]: string}>({});

  const signWithWallet = async (walletType: string) => {
    setConnecting(walletType);
    
    try {
      const message = `Sign this message to authenticate with Chronos Vault\nTimestamp: ${Date.now()}`;
      let signature = '';
      let address = '';

      if (walletType === 'metamask') {
        // For MetaMask - try to connect and sign
        if (typeof (window as any).ethereum !== 'undefined') {
          const accounts = await (window as any).ethereum.request({
            method: 'eth_requestAccounts'
          });
          address = accounts[0];
          signature = await (window as any).ethereum.request({
            method: 'personal_sign',
            params: [message, address]
          });
        } else {
          // Mobile deep link for MetaMask
          const wcUri = `wc:${Math.random().toString(36).substring(7)}@1?bridge=https%3A%2F%2Fbridge.walletconnect.org&key=${Math.random().toString(36)}`;
          window.location.href = `https://metamask.app.link/wc?uri=${encodeURIComponent(wcUri)}`;
          // For demo - simulate signature after 3 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));
          address = '0x' + Math.random().toString(16).substr(2, 40);
          signature = '0x' + Math.random().toString(16).substr(2, 128);
        }
      } 
      else if (walletType === 'phantom') {
        // For Phantom - try to connect and sign
        if (typeof (window as any).solana !== 'undefined' && (window as any).solana.isPhantom) {
          const response = await (window as any).solana.connect();
          address = response.publicKey.toString();
          const encodedMessage = new TextEncoder().encode(message);
          const signedMessage = await (window as any).solana.signMessage(encodedMessage, 'utf8');
          signature = Array.from(signedMessage.signature).map((b: number) => b.toString(16).padStart(2, '0')).join('');
        } else {
          // Mobile deep link for Phantom
          window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`;
          // For demo - simulate signature after 3 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));
          address = Array.from({length: 44}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
          signature = Math.random().toString(16).substr(2, 64);
        }
      }
      else if (walletType === 'tonkeeper') {
        // For TON Keeper
        if (typeof (window as any).ton !== 'undefined') {
          const accounts = await (window as any).ton.send('ton_requestAccounts');
          address = accounts[0];
          signature = await (window as any).ton.send('ton_personalSign', { data: message });
        } else {
          // Mobile deep link for TON Keeper
          window.location.href = `tonkeeper://`;
          // For demo - simulate signature after 3 seconds
          await new Promise(resolve => setTimeout(resolve, 3000));
          address = `EQ${Array.from({length: 46}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='[Math.floor(Math.random() * 65)]).join('')}`;
          signature = Math.random().toString(16).substr(2, 64);
        }
      }

      // Verify signature on backend
      const response = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType,
          address,
          message,
          signature,
          blockchain: walletType === 'metamask' ? 'ethereum' : walletType === 'phantom' ? 'solana' : 'ton'
        })
      });

      const result = await response.json();

      if (result.verified) {
        setConnectedWallets(prev => ({ ...prev, [walletType]: address }));
        onWalletConnected(walletType, address);
        
        toast({
          title: `${walletType} Connected`,
          description: `Signed and verified: ${address.slice(0, 8)}...${address.slice(-6)}`,
        });
      } else {
        throw new Error('Signature verification failed');
      }

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect ${walletType}`,
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask', chain: 'Ethereum', icon: '🦊' },
    { id: 'phantom', name: 'Phantom', chain: 'Solana', icon: '👻' },
    { id: 'tonkeeper', name: 'TON Keeper', chain: 'TON', icon: '💎' }
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Wallet Authentication
        </CardTitle>
        <p className="text-sm text-gray-400">
          Sign a message to prove wallet ownership
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallets.map((wallet) => (
          <Button
            key={wallet.id}
            onClick={() => signWithWallet(wallet.id)}
            disabled={connecting === wallet.id}
            className={`w-full h-16 justify-between bg-gradient-to-r ${
              wallet.id === 'metamask' ? 'from-orange-500 to-yellow-600' :
              wallet.id === 'phantom' ? 'from-purple-500 to-indigo-600' : 
              'from-blue-500 to-cyan-600'
            } hover:opacity-90 text-white ${
              connectedWallets[wallet.id] ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{wallet.name}</div>
                <div className="text-sm opacity-80">{wallet.chain}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectedWallets[wallet.id] ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Wallet className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm">
                {connecting === wallet.id ? 'Signing...' : 
                 connectedWallets[wallet.id] ? 'Signed' : 'Sign Message'}
              </span>
            </div>
          </Button>
        ))}
        
        {Object.keys(connectedWallets).length > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 font-medium">
              ✓ Authenticated: {Object.keys(connectedWallets).length} wallet(s)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}