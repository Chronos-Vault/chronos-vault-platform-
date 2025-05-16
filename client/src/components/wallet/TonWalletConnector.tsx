import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { TonkeeperIcon, TonhubIcon, OpenMaskIcon, MyTonWalletIcon } from './ton-wallet-icons';
import { useToast } from '@/hooks/use-toast';

// TON wallet types
export enum TonWalletType {
  TONKEEPER = 'tonkeeper',
  TONHUB = 'tonhub',
  OPENMASK = 'openmask',
  MYTONWALLET = 'mytonwallet'
}

// Interface for connected wallet info
export interface TonWalletInfo {
  name: string;
  address: string;
  balance: string;
  type: TonWalletType;
}

interface TonWalletConnectorProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (walletInfo: TonWalletInfo) => void;
}

const TonWalletConnector: React.FC<TonWalletConnectorProps> = ({
  isOpen,
  onClose,
  onWalletConnected
}) => {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<TonWalletType | null>(null);
  const { toast } = useToast();

  const wallets = [
    {
      type: TonWalletType.TONKEEPER,
      name: 'Tonkeeper',
      description: 'Popular mobile wallet',
      icon: <TonkeeperIcon />
    },
    {
      type: TonWalletType.TONHUB,
      name: 'TON Hub',
      description: 'Reliable & secure',
      icon: <TonhubIcon />
    },
    {
      type: TonWalletType.OPENMASK,
      name: 'OpenMask',
      description: 'Browser extension',
      icon: <OpenMaskIcon />
    },
    {
      type: TonWalletType.MYTONWALLET,
      name: 'MyTonWallet',
      description: 'Web & mobile wallet',
      icon: <MyTonWalletIcon />
    }
  ];

  const connectWallet = async (walletType: TonWalletType) => {
    setSelectedWallet(walletType);
    setConnecting(true);

    // Simulate TON wallet connection
    // In a real app, this would use TON SDK to connect to the selected wallet
    setTimeout(() => {
      setConnecting(false);
      
      // Mock successful connection
      const walletInfo: TonWalletInfo = {
        name: wallets.find(w => w.type === walletType)?.name || 'TON Wallet',
        address: 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
        balance: '10.5 TON',
        type: walletType
      };
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletInfo.name}`,
      });
      
      onWalletConnected(walletInfo);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !connecting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect TON Wallet</DialogTitle>
          <DialogDescription>
            Select a wallet to connect to The Open Network (TON).
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {wallets.map((wallet) => (
            <button
              key={wallet.type}
              className={`flex items-center p-4 rounded-lg border transition-colors hover:bg-accent ${
                selectedWallet === wallet.type ? 'border-primary ring-1 ring-primary/30' : 'border-border'
              }`}
              onClick={() => connectWallet(wallet.type)}
              disabled={connecting}
            >
              <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden">
                {wallet.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {wallet.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  {wallet.description}
                </div>
              </div>
              {selectedWallet === wallet.type && (
                <div className="ml-auto">
                  {connecting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TonWalletConnector;