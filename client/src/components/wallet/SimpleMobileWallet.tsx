import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { QrCode, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface SimpleMobileWalletProps {
  walletType: 'metamask' | 'phantom' | 'tonkeeper';
  onConnect: (walletType: string, address: string) => void;
}

const walletInfo = {
  metamask: {
    name: 'MetaMask',
    icon: '🦊',
    color: 'from-orange-500 to-yellow-500',
    downloadUrl: 'https://metamask.io/download/',
    deepLink: 'https://metamask.app.link/dapp/'
  },
  phantom: {
    name: 'Phantom',
    icon: '👻',
    color: 'from-purple-500 to-pink-500',
    downloadUrl: 'https://phantom.app/download',
    deepLink: 'https://phantom.app/ul/browse/'
  },
  tonkeeper: {
    name: 'TON Keeper',
    icon: '💎',
    color: 'from-blue-500 to-cyan-500',
    downloadUrl: 'https://tonkeeper.com/',
    deepLink: 'https://app.tonkeeper.com/ton-connect'
  }
};

export const SimpleMobileWallet: React.FC<SimpleMobileWalletProps> = ({
  walletType,
  onConnect
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [connectionUri, setConnectionUri] = useState('');
  const { toast } = useToast();

  const generateConnectionUri = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const projectId = 'f1a006966920cbcac785194f58b6e073';
    const appUrl = window.location.origin;
    
    switch (walletType) {
      case 'metamask':
        // WalletConnect v2 URI for MetaMask
        const wcUri = `wc:${sessionId}@2?relay-protocol=irn&symKey=${btoa(sessionId)}&projectId=${projectId}`;
        return wcUri;
      case 'phantom':
        // Phantom connect URI
        return `phantom://v1/connect?dapp_encryption_public_key=${sessionId}&cluster=devnet&app_url=${encodeURIComponent(appUrl)}&redirect_link=${encodeURIComponent(appUrl)}`;
      case 'tonkeeper':
        // TON Connect URI
        return `tc://tonconnect?v=2&id=${sessionId}&r=${encodeURIComponent(appUrl + '/tonconnect-manifest.json')}&ret=${encodeURIComponent(appUrl)}`;
      default:
        return `session:${sessionId}`;
    }
  };

  const generateQRCode = async (data: string) => {
    try {
      const qrCodeDataURL = await QRCodeLib.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    const uri = generateConnectionUri();
    setConnectionUri(uri);
    await generateQRCode(uri);
    
    // Check if we're on mobile device
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile, show QR code and provide app opening button
      setShowQR(true);
      
      // Try to open the app after a short delay
      setTimeout(() => {
        const mobileDeepLinks = {
          metamask: `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`,
          phantom: uri, // Use the phantom:// URI directly
          tonkeeper: uri // Use the tc:// URI directly
        };
        
        // Create invisible link and click it to trigger app opening
        const link = document.createElement('a');
        link.href = mobileDeepLinks[walletType];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    } else {
      // For desktop, show QR code immediately
      setShowQR(true);
    }

    // Check for real wallet connection
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/wallet/check-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletType, 
            connectionUri: uri,
            timestamp: Date.now()
          })
        });
        
        const result = await response.json();
        
        if (result.connected && result.address) {
          setIsConnecting(false);
          setShowQR(false);
          onConnect(walletType, result.address);
          toast({
            title: `${walletInfo[walletType].name} Connected`,
            description: `Connected: ${result.address.slice(0, 6)}...${result.address.slice(-4)}`,
          });
        } else {
          // Continue checking for connection
          setTimeout(checkConnection, 2000);
        }
      } catch (error) {
        console.error('Connection check failed:', error);
        setTimeout(checkConnection, 2000);
      }
    };

    // Start checking for connection after a delay
    setTimeout(checkConnection, 3000);
  };

  const wallet = walletInfo[walletType];

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className={`w-full h-12 bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white font-medium text-sm`}
      >
        {isConnecting ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Connecting...
          </>
        ) : (
          <>
            <span className="text-lg mr-2">{wallet.icon}</span>
            {wallet.name}
          </>
        )}
      </Button>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-sm mx-4 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="text-2xl mr-2">{wallet.icon}</span>
              Connect {wallet.name}
            </DialogTitle>
            <DialogDescription className="text-center">
              Scan this QR code with your {wallet.name} app or tap to open
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 p-4">
            {qrCodeImage ? (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img 
                  src={qrCodeImage} 
                  alt="QR Code" 
                  className="w-48 h-48 sm:w-56 sm:h-56"
                />
              </div>
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full" />
              </div>
            )}
            
            <div className="text-center space-y-2">
              {isConnecting ? (
                <>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ {wallet.name} app opened
                  </p>
                  <p className="text-sm text-gray-600">
                    Please authorize the connection in your {wallet.name} app
                  </p>
                  <p className="text-xs text-gray-500">
                    Waiting for authorization...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    1. Open your {wallet.name} app
                  </p>
                  <p className="text-sm text-gray-600">
                    2. Scan this QR code or tap "Open App" below
                  </p>
                  <p className="text-sm text-gray-600">
                    3. Approve the connection
                  </p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2 w-full">
              <Button
                onClick={() => {
                  const appLinks = {
                    metamask: `https://metamask.app.link/wc?uri=${encodeURIComponent(connectionUri)}`,
                    phantom: connectionUri, // Use the phantom:// URI directly
                    tonkeeper: connectionUri // Use the tc:// URI directly
                  };
                  
                  // Try multiple methods to open the app
                  const link = document.createElement('a');
                  link.href = appLinks[walletType];
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  // Also try window.open as backup
                  setTimeout(() => {
                    window.open(appLinks[walletType], '_blank');
                  }, 100);
                }}
                className={`bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white`}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Open {wallet.name} App
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open(wallet.downloadUrl, '_blank')}
                size="sm"
              >
                Don't have {wallet.name}? Download it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};