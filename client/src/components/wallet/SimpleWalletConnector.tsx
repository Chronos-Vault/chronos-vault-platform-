import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Check, ExternalLink } from 'lucide-react';

interface ConnectedWallet {
  name: string;
  address: string;
  type: string;
  blockchain: string;
}

interface SimpleWalletConnectorProps {
  onConnect: (walletType: string, address: string) => void;
}

export function SimpleWalletConnector({ onConnect }: SimpleWalletConnectorProps) {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const connectMetaMask = async () => {
    setIsConnecting('MetaMask');
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum?.isMetaMask) {
        if (isMobile) {
          // Open MetaMask mobile app
          const deepLink = `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`;
          window.open(deepLink, '_self');
          return;
        } else {
          throw new Error('MetaMask is not installed. Please install MetaMask extension.');
        }
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      const address = accounts[0];
      await authorizeWallet(address, 'metamask', 'ethereum', 'MetaMask');

    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      toast({
        title: "MetaMask Connection Failed",
        description: error.message || "Failed to connect to MetaMask",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const connectPhantom = async () => {
    setIsConnecting('Phantom');
    try {
      const solana = (window as any).solana;
      
      if (!solana?.isPhantom) {
        if (isMobile) {
          // Open Phantom mobile app
          const deepLink = `https://phantom.app/ul/browse/${window.location.host}${window.location.pathname}`;
          window.open(deepLink, '_self');
          return;
        } else {
          throw new Error('Phantom is not installed. Please install Phantom extension.');
        }
      }

      const response = await solana.connect();
      
      if (!response?.publicKey) {
        throw new Error('Failed to get Phantom wallet address');
      }

      const address = response.publicKey.toString();
      await authorizeWallet(address, 'phantom', 'solana', 'Phantom');

    } catch (error: any) {
      console.error('Phantom connection error:', error);
      toast({
        title: "Phantom Connection Failed",
        description: error.message || "Failed to connect to Phantom",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const connectTonKeeper = async () => {
    setIsConnecting('TON Keeper');
    try {
      const ton = (window as any).ton;
      
      if (!ton) {
        if (isMobile) {
          // Open TON Keeper mobile app
          const deepLink = `https://tonkeeper.com/browser/${window.location.host}${window.location.pathname}`;
          window.open(deepLink, '_self');
          return;
        } else {
          throw new Error('TON Keeper is not installed. Please install TON Keeper extension.');
        }
      }

      const response = await ton.connect();
      
      if (!response?.address) {
        throw new Error('Failed to get TON Keeper wallet address');
      }

      const address = response.address;
      await authorizeWallet(address, 'tonkeeper', 'ton', 'TON Keeper');

    } catch (error: any) {
      console.error('TON Keeper connection error:', error);
      toast({
        title: "TON Keeper Connection Failed",
        description: error.message || "Failed to connect to TON Keeper",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const authorizeWallet = async (address: string, walletType: string, blockchain: string, displayName: string) => {
    try {
      console.log('Authorizing wallet:', { address, walletType, blockchain });
      
      const response = await fetch('/api/vault/authorize-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          walletType,
          blockchain
        })
      });

      const result = await response.json();
      console.log('Authorization response:', result);

      if (response.ok && result.status === 'success') {
        const wallet: ConnectedWallet = {
          name: displayName,
          address,
          type: walletType,
          blockchain
        };

        setConnectedWallets(prev => {
          const filtered = prev.filter(w => w.type !== walletType);
          return [...filtered, wallet];
        });

        onConnect(walletType, address);

        toast({
          title: "Wallet Connected",
          description: `${displayName} connected successfully to Chronos Vault`,
        });
      } else {
        throw new Error(result.message || 'Authorization failed');
      }
    } catch (error: any) {
      console.error('Authorization error:', error);
      throw new Error(`Failed to authorize ${displayName}: ${error.message}`);
    }
  };

  const isWalletConnected = (type: string) => {
    return connectedWallets.some(w => w.type === type);
  };

  const getWalletAddress = (type: string) => {
    const wallet = connectedWallets.find(w => w.type === type);
    return wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to access Chronos Vault features</p>
      </div>

      <div className="grid gap-4">
        {/* MetaMask */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">MetaMask</CardTitle>
                  <CardDescription className="text-xs">Ethereum Wallet</CardDescription>
                </div>
              </div>
              {isWalletConnected('metamask') && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isWalletConnected('metamask') ? (
              <div className="text-sm text-green-500">
                Connected: {getWalletAddress('metamask')}
              </div>
            ) : (
              <Button
                onClick={connectMetaMask}
                disabled={isConnecting === 'MetaMask'}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {isConnecting === 'MetaMask' ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Phantom */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">Phantom</CardTitle>
                  <CardDescription className="text-xs">Solana Wallet</CardDescription>
                </div>
              </div>
              {isWalletConnected('phantom') && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isWalletConnected('phantom') ? (
              <div className="text-sm text-green-500">
                Connected: {getWalletAddress('phantom')}
              </div>
            ) : (
              <Button
                onClick={connectPhantom}
                disabled={isConnecting === 'Phantom'}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isConnecting === 'Phantom' ? 'Connecting...' : 'Connect Phantom'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* TON Keeper */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-sm">TON Keeper</CardTitle>
                  <CardDescription className="text-xs">TON Wallet</CardDescription>
                </div>
              </div>
              {isWalletConnected('tonkeeper') && (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {isWalletConnected('tonkeeper') ? (
              <div className="text-sm text-green-500">
                Connected: {getWalletAddress('tonkeeper')}
              </div>
            ) : (
              <Button
                onClick={connectTonKeeper}
                disabled={isConnecting === 'TON Keeper'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isConnecting === 'TON Keeper' ? 'Connecting...' : 'Connect TON Keeper'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {connectedWallets.length > 0 && (
        <div className="text-center">
          <p className="text-green-500 text-sm">
            ✓ {connectedWallets.length} wallet{connectedWallets.length > 1 ? 's' : ''} connected to Chronos Vault
          </p>
        </div>
      )}
    </div>
  );
}