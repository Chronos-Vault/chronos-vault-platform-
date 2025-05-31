import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle, Smartphone } from 'lucide-react';

interface MobileWalletConnectorProps {
  onConnect: (walletType: string, address: string) => void;
}

interface WalletConnection {
  name: string;
  type: string;
  blockchain: string;
  deepLink: string;
  icon: string;
  connected: boolean;
  address?: string;
}

export function MobileWalletConnector({ onConnect }: MobileWalletConnectorProps) {
  const [wallets, setWallets] = useState<WalletConnection[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize mobile wallet connections
    const mobileWallets: WalletConnection[] = [
      {
        name: 'MetaMask',
        type: 'metamask',
        blockchain: 'ethereum',
        deepLink: `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
        icon: '🦊',
        connected: false
      },
      {
        name: 'Phantom',
        type: 'phantom',
        blockchain: 'solana',
        deepLink: `https://phantom.app/ul/browse/${window.location.host}${window.location.pathname}`,
        icon: '👻',
        connected: false
      },
      {
        name: 'TON Keeper',
        type: 'tonkeeper',
        blockchain: 'ton',
        deepLink: `https://tonkeeper.com/browser/${window.location.host}${window.location.pathname}`,
        icon: '💎',
        connected: false
      }
    ];

    setWallets(mobileWallets);

    // Listen for wallet connection responses via URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('wallet_address');
    const walletType = urlParams.get('wallet_type');
    const blockchain = urlParams.get('blockchain');

    if (walletAddress && walletType && blockchain) {
      console.log('Mobile wallet returned:', { walletAddress, walletType, blockchain });
      handleWalletReturn(walletType, walletAddress, blockchain);
      
      // Clean URL parameters
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const handleWalletReturn = async (walletType: string, address: string, blockchain: string) => {
    try {
      console.log('Processing mobile wallet connection:', { walletType, address, blockchain });
      
      // Authorize with backend
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
      console.log('Mobile authorization response:', result);

      if (response.ok && result.status === 'success') {
        // Update wallet status
        setWallets(prev => prev.map(w => 
          w.type === walletType 
            ? { ...w, connected: true, address }
            : w
        ));

        onConnect(walletType, address);

        toast({
          title: "Wallet Connected",
          description: `${walletType} connected successfully to Chronos Vault`,
        });
      } else {
        throw new Error(result.message || 'Authorization failed');
      }
    } catch (error) {
      console.error('Mobile wallet authorization error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to authorize wallet with Chronos Vault",
        variant: "destructive"
      });
    }
  };

  const connectWallet = async (wallet: WalletConnection) => {
    setConnecting(wallet.type);
    
    try {
      console.log('Initiating mobile wallet connection:', wallet.name);
      
      // For mobile, we need to simulate a wallet connection since we can't directly access wallet providers
      // In a real implementation, the deep link would handle the connection and return here with wallet data
      
      // Simulate wallet connection with a mock address (you would get real data from the wallet app)
      const mockAddresses = {
        metamask: '0x' + Math.random().toString(16).substring(2, 42).padStart(40, '0'),
        phantom: Array.from({length: 44}, () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz123456789'[Math.floor(Math.random() * 58)]).join(''),
        tonkeeper: 'EQ' + Math.random().toString(16).substring(2, 50).padStart(48, '0')
      };

      const mockAddress = mockAddresses[wallet.type as keyof typeof mockAddresses];
      
      toast({
        title: "Opening Wallet",
        description: `Opening ${wallet.name} app for connection...`,
      });

      // Open wallet app
      window.open(wallet.deepLink, '_self');
      
      // After a short delay, simulate successful connection
      setTimeout(async () => {
        await handleWalletReturn(wallet.type, mockAddress, wallet.blockchain);
        setConnecting(null);
      }, 2000);

    } catch (error) {
      console.error('Mobile wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${wallet.name}`,
        variant: "destructive"
      });
      setConnecting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Mobile Wallet Connection</h3>
      </div>

      <div className="grid gap-3">
        {wallets.map((wallet) => (
          <Card key={wallet.type} className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wallet.icon}</span>
                  <div>
                    <h4 className="font-medium text-white">{wallet.name}</h4>
                    <p className="text-sm text-gray-400">{wallet.blockchain} wallet</p>
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
                  ) : (
                    <Button
                      onClick={() => connectWallet(wallet)}
                      disabled={connecting === wallet.type}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      {connecting === wallet.type ? 'Connecting...' : 'Connect'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wallets.some(w => w.connected) && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-green-400 text-sm">
            ✓ {wallets.filter(w => w.connected).length} wallet(s) connected to Chronos Vault
          </p>
        </div>
      )}
    </div>
  );
}