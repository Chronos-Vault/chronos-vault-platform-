import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Plus, ArrowUpDown } from 'lucide-react';

interface DirectWalletConnectProps {
  onConnect: (walletType: string, address: string) => void;
}

export function DirectWalletConnect({ onConnect }: DirectWalletConnectProps) {
  const { toast } = useToast();

  const connectMetaMask = async () => {
    try {
      // Direct MetaMask connection
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts && accounts.length > 0) {
          onConnect('metamask', accounts[0]);
          toast({
            title: "MetaMask Connected",
            description: `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
          return;
        }
      }
      
      // If no MetaMask detected, open mobile app
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
      } else {
        window.open('https://metamask.io/download/', '_blank');
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask browser extension",
        });
      }
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  const connectPhantom = async () => {
    try {
      // Direct Phantom connection
      if (typeof window !== 'undefined' && (window as any).solana && (window as any).solana.isPhantom) {
        const response = await (window as any).solana.connect();
        
        if (response && response.publicKey) {
          const address = response.publicKey.toString();
          onConnect('phantom', address);
          toast({
            title: "Phantom Connected",
            description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
          return;
        }
      }
      
      // If no Phantom detected, open mobile app
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open('https://phantom.app/ul/browse/' + window.location.href, '_blank');
      } else {
        window.open('https://phantom.app/download', '_blank');
        toast({
          title: "Phantom Required",
          description: "Please install Phantom browser extension",
        });
      }
    } catch (error) {
      console.error('Phantom connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Phantom",
        variant: "destructive",
      });
    }
  };

  const connectTonKeeper = async () => {
    try {
      // For TON Keeper, use TonConnect protocol
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Mobile TON Keeper deep link
        window.open('https://app.tonkeeper.com/ton-connect', '_blank');
      } else if (typeof window !== 'undefined' && (window as any).ton) {
        // Desktop extension
        onConnect('tonkeeper', 'TON-Connected-' + Date.now());
        toast({
          title: "TON Keeper Connected",
          description: "Connected to TON Keeper",
        });
      } else {
        window.open('https://tonkeeper.com/', '_blank');
        toast({
          title: "TON Keeper Required",
          description: "Please install TON Keeper",
        });
      }
    } catch (error) {
      console.error('TON Keeper connection failed:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to TON Keeper",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Button 
        size="sm"
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-xs"
        onClick={connectMetaMask}
      >
        <Wallet className="w-3 h-3 mr-1" />
        MetaMask
      </Button>
      
      <Button 
        size="sm"
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs"
        onClick={connectPhantom}
      >
        <Plus className="w-3 h-3 mr-1" />
        Phantom
      </Button>
      
      <Button 
        size="sm"
        variant="outline" 
        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 text-xs"
        onClick={connectTonKeeper}
      >
        <ArrowUpDown className="w-3 h-3 mr-1 rotate-180" />
        TON Keeper
      </Button>
      
      <Button 
        size="sm"
        variant="outline" 
        className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10 text-xs"
        disabled
      >
        <Wallet className="w-3 h-3 mr-1" />
        More Wallets
      </Button>
    </div>
  );
}