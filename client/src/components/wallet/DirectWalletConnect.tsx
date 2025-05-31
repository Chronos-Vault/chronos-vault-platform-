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
      // Force MetaMask connection without download fallback
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Try to connect to any Ethereum provider
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts && accounts.length > 0) {
          // Get network info
          const chainId = await (window as any).ethereum.request({
            method: 'eth_chainId'
          });
          
          // Authorize with Chronos Vault backend
          const authResponse = await fetch('/api/vault/authorize-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: accounts[0],
              chainId: chainId,
              walletType: 'metamask',
              blockchain: 'ethereum'
            }),
          });

          if (authResponse.ok) {
            onConnect('metamask', accounts[0]);
            toast({
              title: "MetaMask Authorized",
              description: `Wallet authorized for Chronos Vault: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
            });
          } else {
            throw new Error('Failed to authorize wallet with Chronos Vault');
          }
          return;
        }
      }
      
      // If no provider available, show connection error
      toast({
        title: "MetaMask Not Available",
        description: "Please ensure MetaMask is installed and unlocked",
        variant: "destructive",
      });
    } catch (error) {
      console.error('MetaMask connection error:', error);
      if ((error as any).code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the connection request in MetaMask",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to MetaMask. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const connectPhantom = async () => {
    try {
      // Force Phantom connection without download fallback
      if (typeof window !== 'undefined' && (window as any).solana) {
        // Connect to Phantom wallet
        const response = await (window as any).solana.connect();
        
        if (response && response.publicKey) {
          const address = response.publicKey.toString();
          
          // Authorize with Chronos Vault backend
          const authResponse = await fetch('/api/vault/authorize-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: address,
              publicKey: address,
              walletType: 'phantom',
              blockchain: 'solana'
            }),
          });

          if (authResponse.ok) {
            onConnect('phantom', address);
            toast({
              title: "Phantom Authorized",
              description: `Wallet authorized for Chronos Vault: ${address.slice(0, 6)}...${address.slice(-4)}`,
            });
          } else {
            throw new Error('Failed to authorize wallet with Chronos Vault');
          }
          return;
        }
      }
      
      // If no provider available, show connection error
      toast({
        title: "Phantom Not Available",
        description: "Please ensure Phantom wallet is installed and unlocked",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Phantom connection error:', error);
      if ((error as any).code === 4001 || (error as any).message?.includes('User rejected')) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the connection request in Phantom",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to Phantom. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const connectTonKeeper = async () => {
    try {
      // Force TON Keeper connection without download fallback
      if (typeof window !== 'undefined' && (window as any).ton) {
        // Use TonConnect protocol for proper authorization
        const tonConnector = (window as any).ton;
        
        const connectResult = await tonConnector.send('ton_requestAccounts');
        
        if (connectResult && connectResult.length > 0) {
          const address = connectResult[0];
          
          // Authorize with Chronos Vault backend
          const authResponse = await fetch('/api/vault/authorize-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: address,
              walletType: 'tonkeeper',
              blockchain: 'ton'
            }),
          });

          if (authResponse.ok) {
            onConnect('tonkeeper', address);
            toast({
              title: "TON Keeper Authorized",
              description: `Wallet authorized for Chronos Vault: ${address.slice(0, 6)}...${address.slice(-4)}`,
            });
          } else {
            throw new Error('Failed to authorize wallet with Chronos Vault');
          }
          return;
        }
      }
      
      // If no provider available, show connection error
      toast({
        title: "TON Keeper Not Available",
        description: "Please ensure TON Keeper wallet is installed and unlocked",
        variant: "destructive",
      });
    } catch (error) {
      console.error('TON Keeper connection error:', error);
      if ((error as any).code === 4001 || (error as any).message?.includes('User rejected')) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the connection request in TON Keeper",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to TON Keeper. Please try again.",
          variant: "destructive",
        });
      }
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