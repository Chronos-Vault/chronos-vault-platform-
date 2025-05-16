import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Diamond, Hexagon, Circle, Loader2, CheckCircle2 } from 'lucide-react';
import { TonkeeperIcon, TonhubIcon, OpenMaskIcon, MyTonWalletIcon } from './ton-wallet-icons';
import { useToast } from '@/hooks/use-toast';

// Chain types
export type ChainType = 'ton' | 'ethereum' | 'solana' | 'bitcoin';

// Wallet info interface
export interface WalletInfo {
  address: string;
  balance: string;
  name: string;
  chainId?: string;
}

interface WalletConnectProps {
  isOpen: boolean;
  onClose: () => void;
  initialChain?: ChainType;
  onWalletConnected: (chain: ChainType, walletInfo: WalletInfo) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  isOpen,
  onClose,
  initialChain = 'ton',
  onWalletConnected
}) => {
  const [selectedChain, setSelectedChain] = useState<ChainType>(initialChain);
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { toast } = useToast();

  // TON wallet options
  const tonWallets = [
    {
      id: 'tonkeeper',
      name: 'Tonkeeper',
      description: 'Popular mobile wallet',
      icon: <TonkeeperIcon />
    },
    {
      id: 'tonhub',
      name: 'TON Hub',
      description: 'Reliable & secure',
      icon: <TonhubIcon />
    },
    {
      id: 'openmask',
      name: 'OpenMask',
      description: 'Browser extension',
      icon: <OpenMaskIcon />
    },
    {
      id: 'mytonwallet',
      name: 'MyTonWallet',
      description: 'Web & mobile wallet',
      icon: <MyTonWalletIcon />
    }
  ];

  // Ethereum wallet options
  const ethereumWallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Popular browser extension',
      icon: <Hexagon className="h-10 w-10 text-[#E2761B]" />
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect via QR code',
      icon: <Hexagon className="h-10 w-10 text-[#3B99FC]" />
    }
  ];

  // Solana wallet options
  const solanaWallets = [
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Popular Solana wallet',
      icon: <Circle className="h-10 w-10 text-[#AB9FF2]" />
    },
    {
      id: 'solflare',
      name: 'Solflare',
      description: 'Feature-rich wallet',
      icon: <Circle className="h-10 w-10 text-[#FF6D41]" />
    }
  ];

  // Get wallets based on selected chain
  const getWallets = () => {
    switch (selectedChain) {
      case 'ton':
        return tonWallets;
      case 'ethereum':
        return ethereumWallets;
      case 'solana':
        return solanaWallets;
      default:
        return [];
    }
  };

  // Connect wallet
  const connectWallet = (walletId: string) => {
    setSelectedWallet(walletId);
    setConnecting(true);

    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(false);
      
      // Generate mock wallet info for development
      const walletInfo: WalletInfo = {
        address: selectedChain === 'ton' 
          ? 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb'
          : selectedChain === 'ethereum'
          ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
          : selectedChain === 'solana'
          ? '9kcaMKQZTeELZvhiGPJYLTCrNyQrbbrV6ys8BqhWB2XK'
          : 'bc1q7m7vxavfjgzr57pwuk0kq5qfkrxzr609ua8a3c',
        balance: selectedChain === 'ton'
          ? '10.5 TON'
          : selectedChain === 'ethereum'
          ? '2.5 ETH'
          : selectedChain === 'solana'
          ? '15.2 SOL'
          : '0.1 BTC',
        name: getWallets().find(w => w.id === walletId)?.name || 'Unknown Wallet'
      };
      
      // Notify user
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${walletInfo.name} on ${selectedChain.toUpperCase()}`,
      });
      
      // Call parent callback
      onWalletConnected(selectedChain, walletInfo);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !connecting && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose your blockchain network and connect your wallet to access Chronos Vault.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={selectedChain} onValueChange={(value) => setSelectedChain(value as ChainType)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="ton" className="flex items-center gap-2">
              <Diamond className="h-4 w-4" />
              <span>TON</span>
            </TabsTrigger>
            <TabsTrigger value="ethereum" className="flex items-center gap-2">
              <Hexagon className="h-4 w-4" />
              <span>Ethereum</span>
            </TabsTrigger>
            <TabsTrigger value="solana" className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              <span>Solana</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ton" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tonWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  className={`flex items-center p-4 rounded-lg border transition-colors hover:bg-accent ${
                    selectedWallet === wallet.id && selectedChain === 'ton' 
                      ? 'border-primary ring-1 ring-primary/30' 
                      : 'border-border'
                  }`}
                  onClick={() => connectWallet(wallet.id)}
                  disabled={connecting}
                >
                  <div className="mr-3 flex-shrink-0">
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
                  {selectedWallet === wallet.id && selectedChain === 'ton' && connecting && (
                    <div className="ml-auto animate-spin h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ethereum" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ethereumWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  className={`flex items-center p-4 rounded-lg border transition-colors hover:bg-accent ${
                    selectedWallet === wallet.id && selectedChain === 'ethereum' 
                      ? 'border-primary ring-1 ring-primary/30' 
                      : 'border-border'
                  }`}
                  onClick={() => connectWallet(wallet.id)}
                  disabled={connecting}
                >
                  <div className="mr-3 flex-shrink-0">
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
                  {selectedWallet === wallet.id && selectedChain === 'ethereum' && connecting && (
                    <div className="ml-auto animate-spin h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="solana" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {solanaWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  className={`flex items-center p-4 rounded-lg border transition-colors hover:bg-accent ${
                    selectedWallet === wallet.id && selectedChain === 'solana' 
                      ? 'border-primary ring-1 ring-primary/30' 
                      : 'border-border'
                  }`}
                  onClick={() => connectWallet(wallet.id)}
                  disabled={connecting}
                >
                  <div className="mr-3 flex-shrink-0">
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
                  {selectedWallet === wallet.id && selectedChain === 'solana' && connecting && (
                    <div className="ml-auto animate-spin h-5 w-5 rounded-full border-2 border-primary border-t-transparent"></div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnect;