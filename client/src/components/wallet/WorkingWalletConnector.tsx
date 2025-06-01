import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface WorkingWalletConnectorProps {
  onWalletConnected: (walletType: string, address: string) => void;
}

export function WorkingWalletConnector({ onWalletConnected }: WorkingWalletConnectorProps) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedWallets, setConnectedWallets] = useState<{[key: string]: string}>({});

  // Check if wallets are installed
  const [walletStatus, setWalletStatus] = useState({
    metamask: false,
    phantom: false,
    tonkeeper: false
  });

  useEffect(() => {
    const checkWallets = () => {
      setWalletStatus({
        metamask: typeof (window as any).ethereum !== 'undefined',
        phantom: typeof (window as any).solana !== 'undefined' && (window as any).solana.isPhantom,
        tonkeeper: typeof (window as any).ton !== 'undefined' || typeof (window as any).tonkeeper !== 'undefined'
      });
    };

    checkWallets();
    const interval = setInterval(checkWallets, 2000);
    return () => clearInterval(interval);
  }, []);

  const connectMetaMask = async () => {
    if (!walletStatus.metamask) {
      window.open('https://metamask.io/download/', '_blank');
      toast({
        title: "Install MetaMask",
        description: "Please install MetaMask browser extension to continue",
        variant: "destructive",
      });
      return;
    }

    setConnecting('metamask');
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setConnectedWallets(prev => ({ ...prev, metamask: address }));
        onWalletConnected('metamask', address);
        
        toast({
          title: "MetaMask Connected",
          description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`,
        });
      }
    } catch (error: any) {
      console.error('MetaMask connection failed:', error);
      toast({
        title: "MetaMask Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectPhantom = async () => {
    if (!walletStatus.phantom) {
      window.open('https://phantom.app/download', '_blank');
      toast({
        title: "Install Phantom",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return;
    }

    setConnecting('phantom');
    try {
      // Connect to Phantom
      const response = await (window as any).solana.connect();
      const address = response.publicKey.toString();
      
      setConnectedWallets(prev => ({ ...prev, phantom: address }));
      onWalletConnected('phantom', address);
      
      toast({
        title: "Phantom Connected",
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`,
      });
    } catch (error: any) {
      console.error('Phantom connection failed:', error);
      toast({
        title: "Phantom Connection Failed", 
        description: error.message || "Failed to connect to Phantom",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectTonKeeper = async () => {
    setConnecting('tonkeeper');
    try {
      // Try different TON wallet connection methods
      let tonProvider = null;
      
      // Check for TON Connect
      if ((window as any).ton) {
        tonProvider = (window as any).ton;
      } else if ((window as any).tonkeeper) {
        tonProvider = (window as any).tonkeeper;
      }

      if (tonProvider) {
        try {
          const accounts = await tonProvider.send('ton_requestAccounts');
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            setConnectedWallets(prev => ({ ...prev, tonkeeper: address }));
            onWalletConnected('tonkeeper', address);
            
            toast({
              title: "TON Keeper Connected",
              description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`,
            });
            return;
          }
        } catch (tonError) {
          console.log('TON provider method failed, trying alternative...');
        }
      }

      // If no provider found or method failed, open TON Keeper install page
      window.open('https://tonkeeper.com/', '_blank');
      toast({
        title: "Install TON Keeper",
        description: "Please install TON Keeper wallet to continue",
        variant: "destructive",
      });

    } catch (error: any) {
      console.error('TON Keeper connection failed:', error);
      toast({
        title: "TON Keeper Connection Failed",
        description: error.message || "Failed to connect to TON Keeper",
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
      chain: 'Ethereum',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-600',
      connect: connectMetaMask,
      installed: walletStatus.metamask,
      connected: !!connectedWallets.metamask
    },
    {
      id: 'phantom', 
      name: 'Phantom',
      chain: 'Solana',
      icon: '👻',
      color: 'from-purple-500 to-indigo-600',
      connect: connectPhantom,
      installed: walletStatus.phantom,
      connected: !!connectedWallets.phantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      chain: 'TON',
      icon: '💎',
      color: 'from-blue-500 to-cyan-600', 
      connect: connectTonKeeper,
      installed: walletStatus.tonkeeper,
      connected: !!connectedWallets.tonkeeper
    }
  ];

  const getStatusIcon = (wallet: any) => {
    if (wallet.connected) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (connecting === wallet.id) return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
    if (!wallet.installed) return <AlertCircle className="w-5 h-5 text-red-400" />;
    return <Wallet className="w-5 h-5 text-gray-400" />;
  };

  const getButtonText = (wallet: any) => {
    if (wallet.connected) return `Connected: ${connectedWallets[wallet.id]?.slice(0, 8)}...${connectedWallets[wallet.id]?.slice(-6)}`;
    if (connecting === wallet.id) return 'Connecting...';
    if (!wallet.installed) return 'Install Wallet';
    return 'Connect Wallet';
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Connect Your Wallets
        </CardTitle>
        <p className="text-sm text-gray-400">
          Connect your wallets to access Chronos Vault features
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallets.map((wallet) => (
          <Button
            key={wallet.id}
            onClick={wallet.connect}
            disabled={connecting === wallet.id}
            className={`w-full h-16 justify-between bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white ${
              wallet.connected ? 'ring-2 ring-green-400' : ''
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
              {getStatusIcon(wallet)}
              <span className="text-sm">{getButtonText(wallet)}</span>
            </div>
          </Button>
        ))}
        
        {Object.keys(connectedWallets).length > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 font-medium">
              ✓ Connected Wallets: {Object.keys(connectedWallets).length}/3
            </div>
            <div className="text-xs text-green-300 mt-1">
              Your wallets are connected and ready to use with Chronos Vault
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}