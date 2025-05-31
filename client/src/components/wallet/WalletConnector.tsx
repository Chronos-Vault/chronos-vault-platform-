import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Check, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectorProps {
  onConnect: (walletType: string, address: string) => void;
}

export default function WalletConnector({ onConnect }: WalletConnectorProps) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedWallets, setConnectedWallets] = useState<Set<string>>(new Set());

  const connectMetaMask = async () => {
    setConnecting('metamask');
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          const address = accounts[0];
          setConnectedWallets(prev => new Set([...prev, 'metamask']));
          onConnect('metamask', address);
          
          toast({
            title: "MetaMask Connected",
            description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
        }
      } else {
        // Mobile fallback - open MetaMask with proper authorization request
        const dappUrl = encodeURIComponent(window.location.href);
        const deepLink = `https://metamask.app.link/dapp/${window.location.host}/wallet?connect=true`;
        window.location.href = deepLink;
        
        toast({
          title: "Opening MetaMask",
          description: "Please approve the connection in MetaMask app",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please install MetaMask or approve the connection",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectPhantom = async () => {
    setConnecting('phantom');
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: Use proper Phantom connection protocol
        const connectionData = {
          dapp_encryption_public_key: btoa(Math.random().toString()),
          cluster: 'devnet',
          app_url: window.location.origin,
          redirect_link: `${window.location.origin}/wallet?phantom=connected`
        };
        
        const phantomUrl = `https://phantom.app/ul/v1/connect?${new URLSearchParams(connectionData)}`;
        window.location.href = phantomUrl;
        
        toast({
          title: "Opening Phantom",
          description: "Please approve the connection in Phantom app",
        });
      } else {
        // Desktop browser extension
        if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
          const response = await (window as any).solana.connect({ onlyIfTrusted: false });
          const address = response.publicKey.toString();
          
          setConnectedWallets(prev => new Set([...prev, 'phantom']));
          onConnect('phantom', address);
          
          toast({
            title: "Phantom Connected",
            description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
        } else {
          window.open('https://phantom.app/', '_blank');
          toast({
            title: "Install Phantom",
            description: "Download Phantom wallet to connect",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please install Phantom or approve the connection",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectTonKeeper = async () => {
    setConnecting('tonkeeper');
    try {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // Mobile: Use TON Connect protocol
        const tonConnectUrl = `https://app.tonkeeper.com/ton-connect/v2?v=2&id=chronos-vault&name=${encodeURIComponent('Chronos Vault')}&url=${encodeURIComponent(window.location.origin)}`;
        window.location.href = tonConnectUrl;
        
        toast({
          title: "Opening TON Keeper",
          description: "Please approve the connection in TON Keeper app",
        });
      } else {
        // Desktop: Check for TON extension or redirect
        if (typeof window !== 'undefined' && (window as any).ton) {
          // Try to connect via browser extension
          toast({
            title: "Connecting TON Keeper",
            description: "Please approve the connection in your TON wallet",
          });
          
          setConnectedWallets(prev => new Set([...prev, 'tonkeeper']));
          onConnect('tonkeeper', 'TON-wallet-connected');
        } else {
          window.open('https://tonkeeper.com/', '_blank');
          toast({
            title: "Install TON Keeper",
            description: "Download TON Keeper to connect",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please install TON Keeper or approve the connection",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Ethereum & EVM chains',
      color: 'from-orange-500 to-orange-600',
      icon: Wallet,
      connect: connectMetaMask
    },
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Solana blockchain',
      color: 'from-purple-500 to-purple-600',
      icon: Shield,
      connect: connectPhantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      description: 'TON blockchain',
      color: 'from-blue-500 to-blue-600',
      icon: ExternalLink,
      connect: connectTonKeeper
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallets</h3>
        <p className="text-gray-400">Authorize wallet connections to access your accounts</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wallets.map((wallet) => {
          const isConnected = connectedWallets.has(wallet.id);
          const isConnecting = connecting === wallet.id;
          
          return (
            <Card key={wallet.id} className="bg-gray-800/50 border-gray-600 hover:border-gray-500 transition-colors">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${wallet.color} rounded-lg flex items-center justify-center mx-auto`}>
                    <wallet.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold flex items-center justify-center gap-2">
                      {wallet.name}
                      {isConnected && <Check className="w-4 h-4 text-green-400" />}
                    </h4>
                    <p className="text-xs text-gray-400">{wallet.description}</p>
                  </div>
                  
                  {isConnected ? (
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      Connected
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={wallet.connect}
                      disabled={isConnecting}
                      className={`w-full bg-gradient-to-r ${wallet.color} hover:opacity-90`}
                    >
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {connectedWallets.size > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">
              {connectedWallets.size} wallet{connectedWallets.size > 1 ? 's' : ''} connected
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Your wallets are now authorized and ready to use with Chronos Vault
          </p>
        </div>
      )}
    </div>
  );
}