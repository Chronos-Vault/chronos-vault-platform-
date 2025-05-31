import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface MobileWalletAuthProps {
  onConnect: (walletType: string, address: string) => void;
}

interface WalletApp {
  name: string;
  type: string;
  installed: boolean;
  connecting: boolean;
  connected: boolean;
  address?: string;
  icon: string;
  blockchain: string;
}

export function MobileWalletAuth({ onConnect }: MobileWalletAuthProps) {
  const [wallets, setWallets] = useState<WalletApp[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    initializeWallets();
    checkForWalletCallback();
  }, []);

  const initializeWallets = () => {
    const walletConfigs: WalletApp[] = [
      {
        name: 'MetaMask',
        type: 'metamask',
        icon: '🦊',
        blockchain: 'Ethereum',
        installed: true, // Assume installed since user confirmed
        connecting: false,
        connected: false
      },
      {
        name: 'Phantom',
        type: 'phantom',
        icon: '👻',
        blockchain: 'Solana',
        installed: true,
        connecting: false,
        connected: false
      },
      {
        name: 'TON Keeper',
        type: 'tonkeeper',
        icon: '💎',
        blockchain: 'TON',
        installed: true,
        connecting: false,
        connected: false
      }
    ];

    setWallets(walletConfigs);
  };

  const checkForWalletCallback = () => {
    // Check if we're returning from a wallet app
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('address') || urlParams.get('account');
    const walletType = urlParams.get('wallet');
    
    if (walletAddress && walletType) {
      processWalletConnection(walletType, walletAddress);
      
      // Clean up URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  };

  const processWalletConnection = async (type: string, address: string) => {
    try {
      console.log('Processing wallet connection:', { type, address });

      // Update wallet status
      setWallets(prev => prev.map(w => 
        w.type === type 
          ? { ...w, connected: true, address, connecting: false }
          : w
      ));

      // Authorize with backend
      const response = await fetch('/api/vault/authorize-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          walletType: type,
          blockchain: type === 'metamask' ? 'ethereum' : type === 'phantom' ? 'solana' : 'ton'
        })
      });

      const result = await response.json();

      if (response.ok) {
        onConnect(type, address);
        toast({
          title: "Wallet Connected",
          description: `${type} wallet connected successfully`,
        });
      } else {
        throw new Error(result.message || 'Authorization failed');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to authorize wallet",
        variant: "destructive"
      });
    }
  };

  const connectWallet = async (wallet: WalletApp) => {
    if (wallet.connected || wallet.connecting) return;

    setWallets(prev => prev.map(w => 
      w.type === wallet.type 
        ? { ...w, connecting: true }
        : w
    ));

    try {
      // Create a connection request
      const connectionRequest = {
        dapp: 'Chronos Vault',
        url: window.location.origin,
        timestamp: Date.now()
      };

      localStorage.setItem(`${wallet.type}_connection`, JSON.stringify(connectionRequest));

      let walletUrl = '';
      
      if (wallet.type === 'metamask') {
        // MetaMask mobile deep link
        walletUrl = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`;
      } else if (wallet.type === 'phantom') {
        // Phantom mobile deep link
        walletUrl = `https://phantom.app/ul/browse/${window.location.hostname}${window.location.pathname}?cluster=devnet`;
      } else if (wallet.type === 'tonkeeper') {
        // TON Keeper deep link
        walletUrl = `https://app.tonkeeper.com/browser/${window.location.hostname}${window.location.pathname}`;
      }

      toast({
        title: `Opening ${wallet.name}`,
        description: 'Please approve the connection in your wallet app',
      });

      // Open wallet app
      window.location.href = walletUrl;

    } catch (error) {
      console.error(`${wallet.name} connection error:`, error);
      
      setWallets(prev => prev.map(w => 
        w.type === wallet.type 
          ? { ...w, connecting: false }
          : w
      ));

      toast({
        title: "Connection Failed",
        description: `Failed to open ${wallet.name}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          Mobile Wallet Authorization
        </CardTitle>
        <p className="text-sm text-gray-400">
          Connect your installed wallet apps to authorize transactions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {wallets.map((wallet) => (
          <div key={wallet.type} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div>
                <h4 className="font-medium text-white">{wallet.name}</h4>
                <p className="text-sm text-gray-400">{wallet.blockchain} Network</p>
                {wallet.connected && wallet.address && (
                  <p className="text-xs text-green-400 font-mono">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wallet.connected ? (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Connected</span>
                </div>
              ) : wallet.connecting ? (
                <div className="flex items-center gap-1 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Opening...</span>
                </div>
              ) : wallet.installed ? (
                <Button
                  onClick={() => connectWallet(wallet)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Connect
                </Button>
              ) : (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Not Installed</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {wallets.some(w => w.connected) && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {wallets.filter(w => w.connected).length} wallet(s) authorized with Chronos Vault
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <p className="text-blue-400 text-sm">
            Make sure you have MetaMask, Phantom, and TON Keeper installed on your mobile device. 
            Clicking "Connect" will open your wallet app to authorize the connection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}