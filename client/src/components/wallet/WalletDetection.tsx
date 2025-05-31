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

    // Check for wallet connection callback from mobile apps
    const handleWalletCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const walletAddress = urlParams.get('address') || urlParams.get('account');
      const walletType = urlParams.get('wallet') || urlParams.get('type');
      
      // Check localStorage for pending connection
      const pendingConnection = localStorage.getItem('wallet_connection_attempt');
      
      if (pendingConnection && (walletAddress || walletType)) {
        try {
          const connectionData = JSON.parse(pendingConnection);
          console.log('Processing wallet callback:', { walletAddress, walletType, connectionData });
          
          // Clear the pending connection
          localStorage.removeItem('wallet_connection_attempt');
          
          // Process the real wallet connection
          if (walletAddress && connectionData.type) {
            handleRealWalletConnection(connectionData.type, walletAddress);
          }
          
          // Clean up URL parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (error) {
          console.error('Error processing wallet callback:', error);
        }
      }
    };

    const handleRealWalletConnection = async (type: string, address: string) => {
      try {
        console.log('Processing real wallet connection:', { type, address });
        
        const blockchain = type === 'metamask' ? 'ethereum' : 
                          type === 'phantom' ? 'solana' : 
                          type === 'tonkeeper' ? 'ton' : 'ethereum';
        
        // Authorize with backend using real wallet data
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
        
        if (response.ok && result.status === 'success') {
          // Update wallet status
          setWalletStatuses(prev => prev.map(w => 
            w.name.toLowerCase().includes(type) 
              ? { ...w, connected: true, address }
              : w
          ));
          
          onConnect(type, address);
          
          toast({
            title: "Real Wallet Connected",
            description: `${type} wallet connected successfully with address ${address.slice(0, 8)}...${address.slice(-6)}`,
          });
        }
      } catch (error) {
        console.error('Real wallet connection error:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect real wallet",
          variant: "destructive"
        });
      }
    };

    // Check for callback on page load
    handleWalletCallback();

    const checkWallets = async () => {
      // Wait for wallet providers to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const wallets: WalletStatus[] = [
        {
          name: 'MetaMask',
          detected: checkMobile ? true : !!(window as any).ethereum,
          connected: false,
          provider: (window as any).ethereum,
          icon: '🦊',
          installUrl: 'https://metamask.io/download/',
          mobileDeepLink: checkMobile ? 'metamask://dapp/' : undefined
        },
        {
          name: 'Phantom',
          detected: checkMobile ? true : !!(window as any).solana?.isPhantom,
          connected: false,
          provider: (window as any).solana,
          icon: '👻',
          installUrl: 'https://phantom.app/',
          mobileDeepLink: checkMobile ? 'phantom://' : undefined
        },
        {
          name: 'TON Keeper',
          detected: checkMobile ? true : (!!(window as any).tonkeeper || !!(window as any).ton),
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
      console.log('Authorizing wallet with backend:', { address, walletType, blockchain });
      
      const requestData = {
        address,
        walletType,
        blockchain
      };
      
      console.log('Sending authorization request:', requestData);
      
      const response = await fetch('/api/vault/authorize-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      console.log('Authorization response status:', response.status);
      const result = await response.json();
      console.log('Authorization response:', result);
      
      if (response.ok && result.status === 'success') {
        // Update wallet status to show connected
        setWalletStatuses(prev => {
          const updated = prev.map(w => 
            w.name === wallet.name 
              ? { ...w, connected: true, address }
              : w
          );
          console.log('Updated wallet statuses:', updated);
          return updated;
        });
        
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
      
      console.log('Starting wallet connection for:', wallet.name);
      
      if (wallet.name === 'MetaMask') {
        console.log('Attempting MetaMask connection...');
        const ethereum = (window as any).ethereum;
        
        if (ethereum && ethereum.isMetaMask) {
          console.log('MetaMask provider found, requesting accounts...');
          // Request account access if needed
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts'
          });
          console.log('MetaMask accounts received:', accounts);
          
          if (accounts && accounts.length > 0) {
            address = accounts[0];
            walletType = 'metamask';
            console.log('MetaMask connected successfully:', address);
          } else {
            throw new Error('No accounts returned from MetaMask');
          }
        } else if (isMobile) {
          console.log('Mobile device detected, connecting via MetaMask mobile...');
          // For real mobile wallet connection
          try {
            // For mobile, try to trigger native wallet connection
            console.log('Attempting to connect with installed MetaMask mobile app...');
            
            // Check if we're in MetaMask's in-app browser
            const isMetaMaskApp = (window as any).ethereum?.isMetaMask;
            
            if (isMetaMaskApp) {
              // We're inside MetaMask app, request accounts directly
              const accounts = await (window as any).ethereum.request({
                method: 'eth_requestAccounts'
              });
              address = accounts[0];
              walletType = 'metamask';
              console.log('Connected via MetaMask in-app browser:', address);
            } else {
              // For mobile, create a universal link that will work with installed MetaMask
              console.log('Creating MetaMask mobile connection...');
              
              // Create a connection session
              const sessionId = Date.now().toString();
              const connectionData = {
                sessionId,
                dappName: 'Chronos Vault',
                dappUrl: window.location.origin,
                dappIcon: `${window.location.origin}/favicon.ico`,
                timestamp: Date.now()
              };
              
              localStorage.setItem(`metamask_session_${sessionId}`, JSON.stringify(connectionData));
              
              // Create MetaMask universal link
              const metamaskUniversalLink = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}?session=${sessionId}`;
              
              toast({
                title: "Opening MetaMask",
                description: "Please approve the connection in your MetaMask mobile app",
              });
              
              // Open MetaMask app
              setTimeout(() => {
                window.location.href = metamaskUniversalLink;
              }, 1000);
              
              return;
            }
            return;
          } catch (error) {
            console.error('Mobile MetaMask connection error:', error);
            throw new Error('Failed to connect to MetaMask mobile app');
          }
        } else {
          console.log('MetaMask not detected');
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
        console.log('Attempting Phantom connection...');
        const solana = (window as any).solana;
        
        if (solana && solana.isPhantom) {
          console.log('Phantom provider found, connecting...');
          const response = await solana.connect();
          console.log('Phantom response received:', response);
          
          if (response && response.publicKey) {
            address = response.publicKey.toString();
            walletType = 'phantom';
            console.log('Phantom connected successfully:', address);
          } else {
            throw new Error('No public key returned from Phantom');
          }
        } else if (isMobile) {
          console.log('Mobile device detected, connecting via Phantom mobile...');
          // For real mobile wallet connection
          try {
            const dappUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            const phantomDeepLink = `https://phantom.app/ul/browse/${window.location.host}${window.location.pathname}?cluster=devnet&redirect=${encodeURIComponent(dappUrl)}`;
            
            // Store connection attempt in localStorage for callback
            localStorage.setItem('wallet_connection_attempt', JSON.stringify({
              type: 'phantom',
              timestamp: Date.now()
            }));
            
            // Redirect to Phantom app
            window.location.href = phantomDeepLink;
            return;
          } catch (error) {
            console.error('Mobile Phantom connection error:', error);
            throw new Error('Failed to connect to Phantom mobile app');
          }
        } else {
          console.log('Phantom not detected');
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
        const ton = (window as any).ton || (window as any).tonkeeper;
        if (ton) {
          const response = await ton.connect();
          address = response.address || response.account?.address || '';
          walletType = 'tonkeeper';
        } else if (isMobile) {
          console.log('Mobile device detected, connecting via TON Keeper mobile...');
          // For real mobile wallet connection
          try {
            const dappUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
            const tonkeeperDeepLink = `https://app.tonkeeper.com/browser/${window.location.host}${window.location.pathname}?redirect=${encodeURIComponent(dappUrl)}`;
            
            // Store connection attempt in localStorage for callback
            localStorage.setItem('wallet_connection_attempt', JSON.stringify({
              type: 'tonkeeper',
              timestamp: Date.now()
            }));
            
            // Redirect to TON Keeper app
            window.location.href = tonkeeperDeepLink;
            return;
          } catch (error) {
            console.error('Mobile TON Keeper connection error:', error);
            throw new Error('Failed to connect to TON Keeper mobile app');
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