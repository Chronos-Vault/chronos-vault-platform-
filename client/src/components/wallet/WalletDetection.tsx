import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle, AlertCircle, Smartphone, Monitor } from 'lucide-react';

interface WalletDetectionProps {
  onConnect: (walletType: string, address: string) => void;
}

interface WalletStatus {
  name: string;
  detected: boolean;
  connected: boolean;
  address?: string;
  provider: any;
  icon: string;
  installUrl: string;
  mobileDeepLink?: string;
}

export function WalletDetection({ onConnect }: WalletDetectionProps) {
  const { toast } = useToast();
  const [walletStatuses, setWalletStatuses] = useState<WalletStatus[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(checkMobile);

    const checkWallets = async () => {
      // Wait for wallet providers to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const wallets: WalletStatus[] = [
        {
          name: 'MetaMask',
          detected: !!(window as any).ethereum,
          connected: false,
          provider: (window as any).ethereum,
          icon: '🦊',
          installUrl: 'https://metamask.io/download/',
          mobileDeepLink: checkMobile ? 'metamask://dapp/' : undefined
        },
        {
          name: 'Phantom',
          detected: !!(window as any).solana?.isPhantom,
          connected: false,
          provider: (window as any).solana,
          icon: '👻',
          installUrl: 'https://phantom.app/',
          mobileDeepLink: checkMobile ? 'phantom://' : undefined
        },
        {
          name: 'TON Keeper',
          detected: !!(window as any).tonkeeper || !!(window as any).ton,
          connected: false,
          provider: (window as any).tonkeeper || (window as any).ton,
          icon: '💎',
          installUrl: 'https://tonkeeper.com/',
          mobileDeepLink: checkMobile ? 'tonkeeper://connect' : undefined
        }
      ];
      
      setWalletStatuses(wallets);
      setIsChecking(false);
    };
    
    checkWallets();
  }, []);

  const authorizeWalletWithBackend = async (address: string, walletType: string, blockchain: string, wallet: WalletStatus) => {
    try {
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
      
      if (response.ok && result.status === 'success') {
        setWalletStatuses(prev => prev.map(w => 
          w.name === wallet.name 
            ? { ...w, connected: true, address }
            : w
        ));
        
        onConnect(walletType, address);
        
        toast({
          title: "Wallet Authorized",
          description: `${wallet.name} connected to Chronos Vault successfully`,
        });
      } else {
        throw new Error(result.message || 'Authorization failed');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      toast({
        title: "Authorization Failed",
        description: `Failed to authorize ${wallet.name} with Chronos Vault`,
        variant: "destructive"
      });
    }
  };

  const connectWallet = async (wallet: WalletStatus) => {
    if (!wallet.detected) {
      toast({
        title: "Wallet Not Found",
        description: `${wallet.name} is not installed. Please install the wallet extension first.`,
        variant: "destructive"
      });
      installWallet(wallet);
      return;
    }

    // Show immediate feedback that connection is starting
    toast({
      title: "Connecting...",
      description: `Opening ${wallet.name} for authorization`,
    });

    try {
      let address = '';
      let walletType = '';
      
      if (wallet.name === 'MetaMask') {
        if (wallet.provider) {
          // Request account access if needed
          const accounts = await wallet.provider.request({
            method: 'eth_requestAccounts'
          });
          address = accounts[0];
          walletType = 'metamask';
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "Please install MetaMask extension to connect",
            variant: "destructive"
          });
          return;
        }
        
        // Send to backend for authorization
        if (address && walletType) {
          await authorizeWalletWithBackend(address, walletType, 'ethereum', wallet);
        } else {
          throw new Error('Failed to get wallet address');
        }
        
      } else if (wallet.name === 'Phantom') {
        if (wallet.provider) {
          const response = await wallet.provider.connect();
          address = response.publicKey.toString();
          walletType = 'phantom';
        } else {
          toast({
            title: "Phantom Not Found",
            description: "Please install Phantom extension to connect",
            variant: "destructive"
          });
          return;
        }
        
        // Send to backend for authorization
        if (address && walletType) {
          await authorizeWalletWithBackend(address, walletType, 'solana', wallet);
        } else {
          throw new Error('Failed to get wallet address');
        }
        
      } else if (wallet.name === 'TON Keeper') {
        if (wallet.provider) {
          // Try TON Connect approach
          if (wallet.provider.connect) {
            await wallet.provider.connect();
            const walletInfo = wallet.provider.wallet;
            address = walletInfo?.account?.address || '';
            walletType = 'tonkeeper';
          }
        } else {
          toast({
            title: "TON Keeper Not Found",
            description: "Please install TON Keeper extension to connect",
            variant: "destructive"
          });
          return;
        }
        
        if (address && walletType) {
          await authorizeWalletWithBackend(address, walletType, 'ton', wallet);
        } else {
          throw new Error('Failed to get wallet address');
        }
      }
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Authorization Failed",
        description: `Failed to authorize ${wallet.name}. Please ensure your wallet is unlocked.`,
        variant: "destructive"
      });
    }
  };



  const installWallet = (wallet: WalletStatus) => {
    if (isMobile && wallet.mobileDeepLink) {
      // On mobile, try to open the wallet app
      window.location.href = wallet.mobileDeepLink;
    } else {
      // On desktop, open installation page
      window.open(wallet.installUrl, '_blank');
    }
  };

  if (isChecking) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Detecting wallets...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Device Type Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            Wallet Connection - {isMobile ? 'Mobile' : 'Desktop'} Device
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Wallet Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {walletStatuses.map((wallet) => (
          <Card key={wallet.name} className="relative">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="text-lg">{wallet.name}</span>
                </div>
                {wallet.detected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Detected
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Found
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {wallet.connected && wallet.address && (
                <div className="mb-3 p-2 bg-green-50 rounded">
                  <div className="text-sm font-medium text-green-800">Connected</div>
                  <div className="text-xs text-green-600 font-mono">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                  </div>
                </div>
              )}
              
              {wallet.detected ? (
                <Button 
                  onClick={() => connectWallet(wallet)}
                  disabled={wallet.connected}
                  className="w-full"
                  variant={wallet.connected ? "outline" : "default"}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {wallet.connected ? 'Connected' : 'Connect Wallet'}
                </Button>
              ) : (
                <Button 
                  onClick={() => installWallet(wallet)}
                  variant="outline"
                  className="w-full"
                >
                  {isMobile ? 'Open App' : 'Install Wallet'}
                </Button>
              )}
              
              {!wallet.detected && (
                <p className="text-xs text-gray-500 mt-2">
                  {isMobile 
                    ? 'Tap to open wallet app or install from app store'
                    : 'Click to install wallet extension'
                  }
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <div className="space-y-2 text-sm">
              <p>• Install wallet apps from official app stores</p>
              <p>• Open this page in your wallet's built-in browser</p>
              <p>• Or use WalletConnect for compatible wallets</p>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p>• Install wallet browser extensions from official sources</p>
              <p>• Refresh this page after installation</p>
              <p>• Click "Connect Wallet" to authorize access</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel */}
      <Card className="bg-gray-900/50 border-gray-700 mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Debug & Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button 
              onClick={() => {
                console.log('Testing backend authorization...');
                fetch('/api/vault/authorize-wallet', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    address: '0x1234567890123456789012345678901234567890',
                    walletType: 'test',
                    blockchain: 'ethereum'
                  })
                }).then(res => res.json()).then(data => {
                  console.log('Backend response:', data);
                  toast({
                    title: data.status === 'success' ? "Backend Working" : "Backend Error",
                    description: data.message,
                    variant: data.status === 'success' ? "default" : "destructive"
                  });
                }).catch(err => {
                  console.error('Backend error:', err);
                  toast({
                    title: "Connection Failed",
                    description: "Cannot reach backend",
                    variant: "destructive"
                  });
                });
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Test Backend Authorization
            </Button>
            
            <Button 
              onClick={() => {
                console.log('Checking wallet providers...');
                console.log('window.ethereum:', !!(window as any).ethereum);
                console.log('window.solana:', !!(window as any).solana);
                console.log('window.ton:', !!(window as any).ton);
                
                toast({
                  title: "Wallet Check",
                  description: `MetaMask: ${!!(window as any).ethereum}, Phantom: ${!!(window as any).solana}, TON: ${!!(window as any).ton}`,
                });
              }}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Check Wallet Extensions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}