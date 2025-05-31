import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle, Smartphone, ExternalLink } from 'lucide-react';

interface RealMobileWalletConnectorProps {
  onConnect: (walletType: string, address: string) => void;
}

interface WalletConfig {
  name: string;
  type: string;
  blockchain: string;
  icon: string;
  universalLink: string;
  deepLink: string;
  connected: boolean;
  address?: string;
}

export function RealMobileWalletConnector({ onConnect }: RealMobileWalletConnectorProps) {
  const [wallets, setWallets] = useState<WalletConfig[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const walletConfigs: WalletConfig[] = [
      {
        name: 'MetaMask',
        type: 'metamask',
        blockchain: 'ethereum',
        icon: '🦊',
        universalLink: `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`,
        deepLink: `metamask://dapp/${window.location.hostname}${window.location.pathname}`,
        connected: false
      },
      {
        name: 'Phantom',
        type: 'phantom',
        blockchain: 'solana',
        icon: '👻',
        universalLink: `https://phantom.app/ul/browse/${window.location.hostname}${window.location.pathname}?cluster=devnet`,
        deepLink: `phantom://browse/${window.location.hostname}${window.location.pathname}`,
        connected: false
      },
      {
        name: 'TON Keeper',
        type: 'tonkeeper',
        blockchain: 'ton',
        icon: '💎',
        universalLink: `https://app.tonkeeper.com/browser/${window.location.hostname}${window.location.pathname}`,
        deepLink: `tonkeeper://browser/${window.location.hostname}${window.location.pathname}`,
        connected: false
      }
    ];

    setWallets(walletConfigs);

    // Check for returning wallet connections
    checkForWalletCallback();
  }, []);

  const checkForWalletCallback = () => {
    // Check URL parameters for wallet responses
    const urlParams = new URLSearchParams(window.location.search);
    const walletAddress = urlParams.get('address') || urlParams.get('account') || urlParams.get('publicKey');
    const walletType = urlParams.get('wallet') || urlParams.get('type');
    const signature = urlParams.get('signature');

    if (walletAddress && walletType) {
      console.log('Wallet callback detected:', { walletAddress, walletType, signature });
      processWalletConnection(walletType, walletAddress);
      
      // Clean URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Check localStorage for session data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('wallet_session_') || key.startsWith('metamask_session_') || key.startsWith('phantom_session_') || key.startsWith('tonkeeper_session_')) {
        const sessionData = localStorage.getItem(key);
        if (sessionData) {
          try {
            const data = JSON.parse(sessionData);
            if (data.address && data.type) {
              console.log('Session wallet found:', data);
              processWalletConnection(data.type, data.address);
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error parsing session data:', error);
          }
        }
      }
    });
  };

  const processWalletConnection = async (type: string, address: string) => {
    try {
      console.log('Processing real wallet connection:', { type, address });

      const blockchain = type === 'metamask' ? 'ethereum' : 
                        type === 'phantom' ? 'solana' : 
                        type === 'tonkeeper' ? 'ton' : 'ethereum';

      // Authorize with Chronos Vault backend
      const response = await fetch('/api/vault/authorize-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          walletType: type,
          blockchain
        })
      });

      const result = await response.json();
      console.log('Authorization response:', result);

      if (response.ok && result.status === 'success') {
        // Update wallet status
        setWallets(prev => prev.map(w => 
          w.type === type 
            ? { ...w, connected: true, address }
            : w
        ));

        onConnect(type, address);

        toast({
          title: "Wallet Connected",
          description: `${type} wallet authorized with Chronos Vault successfully`,
        });
      } else {
        throw new Error(result.message || 'Authorization failed');
      }
    } catch (error) {
      console.error('Wallet authorization error:', error);
      toast({
        title: "Authorization Failed",
        description: "Failed to authorize wallet with Chronos Vault",
        variant: "destructive"
      });
    }
  };

  const connectWallet = async (wallet: WalletConfig) => {
    if (wallet.connected) return;

    setConnecting(wallet.type);

    try {
      console.log(`Connecting to ${wallet.name} mobile app...`);

      // Create session for tracking
      const sessionId = Date.now().toString();
      const sessionData = {
        sessionId,
        type: wallet.type,
        dappName: 'Chronos Vault',
        dappUrl: window.location.origin,
        timestamp: Date.now()
      };

      localStorage.setItem(`${wallet.type}_session_${sessionId}`, JSON.stringify(sessionData));

      toast({
        title: `Opening ${wallet.name}`,
        description: `Please approve the connection in your ${wallet.name} app`,
      });

      // Use proper mobile wallet connection with real address
      try {
        let realAddress = '';
        
        if (wallet.type === 'metamask') {
          // Try to connect via WalletConnect or injected provider
          if ((window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({
              method: 'eth_requestAccounts'
            });
            realAddress = accounts[0];
          } else {
            // Request WalletConnect integration
            throw new Error('MetaMask connection requires WalletConnect setup');
          }
        } else if (wallet.type === 'phantom') {
          // Try to connect via Solana provider
          if ((window as any).solana && (window as any).solana.isPhantom) {
            const response = await (window as any).solana.connect();
            realAddress = response.publicKey.toString();
          } else {
            throw new Error('Phantom wallet not detected on mobile');
          }
        } else if (wallet.type === 'tonkeeper') {
          // Use TON Connect
          if ((window as any).TonConnectUI) {
            const tonConnectUI = new (window as any).TonConnectUI({
              manifestUrl: `${window.location.origin}/tonconnect-manifest.json`
            });
            const connectedWallet = await tonConnectUI.connectWallet();
            realAddress = connectedWallet.account.address;
          } else {
            throw new Error('TON Connect not available');
          }
        }
        
        if (realAddress) {
          console.log(`${wallet.name} connected with real address:`, realAddress);
          processWalletConnection(wallet.type, realAddress);
        }
      } catch (connectionError) {
        console.error(`${wallet.name} connection failed:`, connectionError);
        throw connectionError;
      }

    } catch (error) {
      console.error(`${wallet.name} connection error:`, error);
      toast({
        title: "Connection Failed",
        description: `Failed to open ${wallet.name} app`,
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setConnecting(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Connect Your Wallet</h3>
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
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                      size="sm"
                    >
                      {connecting === wallet.type ? (
                        'Opening...'
                      ) : (
                        <>
                          <ExternalLink className="w-3 h-3" />
                          Connect
                        </>
                      )}
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
            ✓ {wallets.filter(w => w.connected).length} wallet(s) authorized with Chronos Vault
          </p>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
        <p className="text-blue-400 text-sm">
          Make sure you have the wallet apps installed on your device for the connection to work properly.
        </p>
      </div>
    </div>
  );
}