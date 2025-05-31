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
    
    switch (walletType) {
      case 'metamask':
        return `wc:${sessionId}@2?relay-protocol=irn&symKey=${sessionId}&projectId=${projectId}`;
      case 'phantom':
        return `https://phantom.app/ul/v1/connect?dapp_encryption_public_key=${sessionId}&cluster=devnet&app_url=${encodeURIComponent(window.location.origin)}`;
      case 'tonkeeper':
        return `tc://tonconnect?v=2&id=${sessionId}&r=${encodeURIComponent(window.location.origin + '/tonconnect-manifest.json')}&ret=back`;
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
    setShowQR(true);

    // Try to open wallet app on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const wallet = walletInfo[walletType];
      const deepLinkUrl = `${wallet.deepLink}${encodeURIComponent(window.location.href)}`;
      
      setTimeout(() => {
        window.open(deepLinkUrl, '_blank');
      }, 2000);
    }

    // Simulate connection after 8 seconds
    setTimeout(() => {
      const addresses = {
        metamask: '0x742d35Cc6635C0532925a3b8D92C5A6Cdc3B',
        phantom: 'BfYXwvd4jMYoFnphtf9vkAe8ZiU7roYZSEFGsi2oXhjz',
        tonkeeper: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t'
      };
      
      setIsConnecting(false);
      setShowQR(false);
      onConnect(walletType, addresses[walletType]);
      toast({
        title: `${walletInfo[walletType].name} Connected`,
        description: `Connected: ${addresses[walletType].slice(0, 6)}...${addresses[walletType].slice(-4)}`,
      });
    }, 8000);
  };

  const wallet = walletInfo[walletType];

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <span className="text-2xl">{wallet.icon}</span>
            {wallet.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`w-full h-32 bg-gradient-to-r ${wallet.color} rounded-lg flex items-center justify-center`}>
            <Smartphone className="h-12 w-12 text-white" />
          </div>
          
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <QrCode className="h-4 w-4 mr-2" />
                Connect {wallet.name}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {wallet.name}</DialogTitle>
            <DialogDescription>
              Scan this QR code with your {wallet.name} app to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            {qrCodeImage && (
              <img 
                src={qrCodeImage} 
                alt="QR Code" 
                className="w-64 h-64 border rounded-lg"
              />
            )}
            
            <p className="text-sm text-gray-600 text-center">
              Open your {wallet.name} app and scan this QR code to connect
            </p>
            
            <Button
              variant="outline"
              onClick={() => window.open(wallet.downloadUrl, '_blank')}
              className="w-full"
            >
              Don't have {wallet.name}? Download it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};