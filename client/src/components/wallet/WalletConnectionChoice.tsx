import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Smartphone, Wallet } from 'lucide-react';
import { BrowserWalletConnect } from './BrowserWalletConnect';
import { SimpleMobileWallet } from './SimpleMobileWallet';

interface WalletConnectionChoiceProps {
  walletType: 'metamask' | 'phantom' | 'tonkeeper';
  onConnect: (walletType: string, address: string) => void;
  children: React.ReactNode;
}

export function WalletConnectionChoice({ walletType, onConnect, children }: WalletConnectionChoiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState<'choose' | 'browser' | 'mobile'>('choose');

  const walletInfo = {
    metamask: { name: 'MetaMask', color: 'from-orange-500 to-yellow-600' },
    phantom: { name: 'Phantom', color: 'from-purple-500 to-indigo-600' },
    tonkeeper: { name: 'TON Keeper', color: 'from-blue-500 to-cyan-600' }
  };

  const wallet = walletInfo[walletType];

  const handleConnect = (type: string, address: string) => {
    onConnect(type, address);
    setIsOpen(false);
    setConnectionMethod('choose');
  };

  const handleCancel = () => {
    setConnectionMethod('choose');
  };

  const renderContent = () => {
    if (connectionMethod === 'browser') {
      return (
        <BrowserWalletConnect
          walletType={walletType}
          onConnect={handleConnect}
          onCancel={handleCancel}
        />
      );
    }

    if (connectionMethod === 'mobile') {
      return (
        <SimpleMobileWallet
          walletType={walletType}
          onConnect={handleConnect}
          onCancel={handleCancel}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${wallet.color} flex items-center justify-center mx-auto mb-4`}>
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Connect {wallet.name}</h3>
          <p className="text-gray-600 mt-2">Choose your connection method</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setConnectionMethod('browser')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Monitor className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium">Browser Extension</h4>
                  <p className="text-sm text-gray-600">Connect using {wallet.name} browser extension</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setConnectionMethod('mobile')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium">Mobile App</h4>
                  <p className="text-sm text-gray-600">Connect using {wallet.name} mobile app via QR code</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {connectionMethod === 'choose' && `Connect ${wallet.name}`}
            {connectionMethod === 'browser' && `${wallet.name} Browser Extension`}
            {connectionMethod === 'mobile' && `${wallet.name} Mobile App`}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}