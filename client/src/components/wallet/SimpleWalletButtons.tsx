import React from 'react';
import { Button } from '@/components/ui/button';
import { WalletConnectionChoice } from './WalletConnectionChoice';
import { Wallet, Plus, ArrowUpDown, Settings } from 'lucide-react';

interface SimpleWalletButtonsProps {
  onConnect: (walletType: string, address: string) => void;
}

export function SimpleWalletButtons({ onConnect }: SimpleWalletButtonsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <WalletConnectionChoice 
        walletType="metamask" 
        onConnect={onConnect}
      >
        <Button 
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xs"
        >
          <Wallet className="w-3 h-3 mr-1" />
          MetaMask
        </Button>
      </WalletConnectionChoice>
      
      <WalletConnectionChoice 
        walletType="phantom" 
        onConnect={onConnect}
      >
        <Button 
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Phantom
        </Button>
      </WalletConnectionChoice>
      
      <WalletConnectionChoice 
        walletType="tonkeeper" 
        onConnect={onConnect}
      >
        <Button 
          size="sm"
          variant="outline" 
          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-xs"
        >
          <ArrowUpDown className="w-3 h-3 mr-1 rotate-180" />
          TON Keeper
        </Button>
      </WalletConnectionChoice>
      
      <Button 
        size="sm"
        variant="outline" 
        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-xs"
      >
        <Wallet className="w-3 h-3 mr-1" />
        Settings
      </Button>
    </div>
  );
}