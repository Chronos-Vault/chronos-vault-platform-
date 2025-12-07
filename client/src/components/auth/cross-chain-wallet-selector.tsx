/**
 * Cross-Chain Wallet Selector
 * 
 * A component for selecting and connecting to different blockchain wallets
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserWallets } from '@/hooks/use-user-wallets';
import { Wallet, Check, AlertCircle } from 'lucide-react';
import { SiEthereum, SiSolana } from 'react-icons/si';

export interface WalletOption {
  id: string;
  name: string;
  blockchain: string;
  icon: React.ReactNode;
  supported: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    blockchain: 'ethereum',
    icon: <SiEthereum className="h-5 w-5" />,
    supported: true
  },
  {
    id: 'phantom',
    name: 'Phantom',
    blockchain: 'solana', 
    icon: <SiSolana className="h-5 w-5" />,
    supported: true
  },
  {
    id: 'tonkeeper',
    name: 'TON Keeper',
    blockchain: 'ton',
    icon: <Wallet className="h-5 w-5" />,
    supported: true
  }
];

interface CrossChainWalletSelectorProps {
  onWalletSelect?: (wallet: WalletOption) => void;
  compact?: boolean;
  className?: string;
}

const CrossChainWalletSelector: React.FC<CrossChainWalletSelectorProps> = ({ 
  onWalletSelect,
  compact = false,
  className = ''
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();
  const { connectedWallets, addWallet, isWalletConnected } = useUserWallets();

  const handleWalletSelect = (walletId: string) => {
    const wallet = walletOptions.find(w => w.id === walletId);
    if (wallet) {
      setSelectedWallet(walletId);
      onWalletSelect?.(wallet);
    }
  };

  const handleConnect = async () => {
    if (!selectedWallet) {
      toast({
        title: 'No wallet selected',
        description: 'Please select a wallet to connect',
        variant: 'destructive'
      });
      return;
    }

    const wallet = walletOptions.find(w => w.id === selectedWallet);
    if (!wallet) return;

    setConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockConnection = {
        address: `${wallet.blockchain.slice(0,3).toUpperCase()}...${Math.random().toString(36).slice(2, 8)}`,
        blockchain: wallet.blockchain,
        walletType: wallet.id,
        connected: true,
        authorized: true
      };

      addWallet(mockConnection);
      
      toast({
        title: 'Wallet connected',
        description: `Successfully connected ${wallet.name} wallet`,
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Failed to connect wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setConnecting(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Select value={selectedWallet} onValueChange={handleWalletSelect}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select wallet" />
          </SelectTrigger>
          <SelectContent>
            {walletOptions.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id}>
                <div className="flex items-center gap-2">
                  {wallet.icon}
                  {wallet.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleConnect}
          disabled={!selectedWallet || connecting}
          size="sm"
        >
          {connecting ? 'Connecting...' : 'Connect'}
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Choose a wallet to connect to the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {walletOptions.map((wallet) => {
            const isConnected = isWalletConnected(wallet.blockchain);
            
            return (
              <div
                key={wallet.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedWallet === wallet.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                } ${!wallet.supported ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => wallet.supported && handleWalletSelect(wallet.id)}
              >
                <div className="flex items-center gap-3">
                  {wallet.icon}
                  <div>
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {wallet.blockchain.charAt(0).toUpperCase() + wallet.blockchain.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isConnected && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                  
                  {!wallet.supported && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedWallet && (
          <Button 
            onClick={handleConnect}
            disabled={connecting}
            className="w-full"
          >
            {connecting ? 'Connecting...' : `Connect ${walletOptions.find(w => w.id === selectedWallet)?.name}`}
          </Button>
        )}

        {connectedWallets.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Connected Wallets:</div>
            {connectedWallets.map((wallet, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{wallet.walletType} ({wallet.blockchain})</span>
                <span className="text-muted-foreground">{wallet.address}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossChainWalletSelector;