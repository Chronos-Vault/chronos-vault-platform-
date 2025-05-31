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

  const connectWallet = async (wallet: WalletStatus) => {
    if (!wallet.detected) {
      installWallet(wallet);
      return;
    }

    try {
      let address = '';
      let walletType = '';
      
      if (wallet.name === 'MetaMask' && wallet.provider) {
        // Request account access if needed
        const accounts = await wallet.provider.request({
          method: 'eth_requestAccounts'
        });
        address = accounts[0];
        walletType = 'metamask';
        
        // Send to backend for authorization
        const response = await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType,
            blockchain: 'ethereum'
          })
        });
        
        if (response.ok) {
          // Update wallet status
          setWalletStatuses(prev => prev.map(w => 
            w.name === wallet.name 
              ? { ...w, connected: true, address }
              : w
          ));
          
          onConnect(walletType, address);
          
          toast({
            title: "Wallet Authorized",
            description: `${wallet.name} connected to Chronos Vault`,
            variant: "default"
          });
        }
        
      } else if (wallet.name === 'Phantom' && wallet.provider) {
        const response = await wallet.provider.connect();
        address = response.publicKey.toString();
        walletType = 'phantom';
        
        // Send to backend for authorization
        const authResponse = await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType,
            blockchain: 'solana'
          })
        });
        
        if (authResponse.ok) {
          setWalletStatuses(prev => prev.map(w => 
            w.name === wallet.name 
              ? { ...w, connected: true, address }
              : w
          ));
          
          onConnect(walletType, address);
          
          toast({
            title: "Wallet Authorized",
            description: `${wallet.name} connected to Chronos Vault`,
            variant: "default"
          });
        }
        
      } else if (wallet.name === 'TON Keeper' && wallet.provider) {
        // Try TON Connect approach
        if (wallet.provider.connect) {
          await wallet.provider.connect();
          const walletInfo = wallet.provider.wallet;
          address = walletInfo?.account?.address || '';
          walletType = 'tonkeeper';
        }
        
        if (address) {
          const authResponse = await fetch('/api/vault/authorize-wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              address,
              walletType,
              blockchain: 'ton'
            })
          });
          
          if (authResponse.ok) {
            setWalletStatuses(prev => prev.map(w => 
              w.name === wallet.name 
                ? { ...w, connected: true, address }
                : w
            ));
            
            onConnect(walletType, address);
            
            toast({
              title: "Wallet Authorized",
              description: `${wallet.name} connected to Chronos Vault`,
              variant: "default"
            });
          }
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
    </div>
  );
}