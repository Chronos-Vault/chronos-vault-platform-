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
      // Check for MetaMask availability
      if (typeof window !== 'undefined' && (window as any).ethereum && (window as any).ethereum.isMetaMask) {
        // Request account access
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
      
      // If no MetaMask detected, provide installation guidance
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        toast({
          title: "Install MetaMask",
          description: "Please install MetaMask mobile app to continue",
        });
        window.open('https://metamask.io/download/', '_blank');
      } else {
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask browser extension to connect",
        });
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('MetaMask authorization failed:', error);
      toast({
        title: "Authorization Failed",
        description: "Unable to authorize MetaMask with Chronos Vault",
        variant: "destructive",
      });
    }
  };

  const connectPhantom = async () => {
    try {
      // Check for Phantom wallet availability
      if (typeof window !== 'undefined' && (window as any).solana && (window as any).solana.isPhantom) {
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
      
      // If no Phantom detected, provide installation guidance
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        toast({
          title: "Install Phantom",
          description: "Please install Phantom mobile app to continue",
        });
        window.open('https://phantom.app/download', '_blank');
      } else {
        toast({
          title: "Phantom Required",
          description: "Please install Phantom browser extension to connect",
        });
        window.open('https://phantom.app/download', '_blank');
      }
    } catch (error) {
      console.error('Phantom authorization failed:', error);
      toast({
        title: "Authorization Failed",
        description: "Unable to authorize Phantom with Chronos Vault",
        variant: "destructive",
      });
    }
  };

  const connectTonKeeper = async () => {
    try {
      // Check for TON Keeper availability
      if (typeof window !== 'undefined' && (window as any).tonkeeper) {
        // Use TonConnect protocol for proper authorization
        const connector = (window as any).tonkeeper;
        
        const connectResult = await connector.connect({
          manifestUrl: '/tonconnect-manifest.json',
          items: [{
            name: "ton_addr",
            payload: "chronos-vault-auth"
          }]
        });
        
        if (connectResult && connectResult.address) {
          // Authorize with Chronos Vault backend
          const authResponse = await fetch('/api/vault/authorize-wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: connectResult.address,
              walletType: 'tonkeeper',
              blockchain: 'ton',
              proof: connectResult.proof
            }),
          });

          if (authResponse.ok) {
            onConnect('tonkeeper', connectResult.address);
            toast({
              title: "TON Keeper Authorized",
              description: `Wallet authorized for Chronos Vault: ${connectResult.address.slice(0, 6)}...${connectResult.address.slice(-4)}`,
            });
          } else {
            throw new Error('Failed to authorize wallet with Chronos Vault');
          }
          return;
        }
      }
      
      // If no TON Keeper detected, provide installation guidance
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        toast({
          title: "Install TON Keeper",
          description: "Please install TON Keeper mobile app to continue",
        });
        window.open('https://tonkeeper.com/', '_blank');
      } else {
        toast({
          title: "TON Keeper Required",
          description: "Please install TON Keeper browser extension to connect",
        });
        window.open('https://tonkeeper.com/', '_blank');
      }
    } catch (error) {
      console.error('TON Keeper authorization failed:', error);
      toast({
        title: "Authorization Failed",
        description: "Unable to authorize TON Keeper with Chronos Vault",
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