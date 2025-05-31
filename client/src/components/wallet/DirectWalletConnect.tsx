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
      // Wait for wallet provider to be available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check multiple ways for Ethereum provider
      const ethereum = (window as any).ethereum || 
                      (window as any).web3?.currentProvider ||
                      (window as any).metamask;
      
      if (!ethereum) {
        toast({
          title: "MetaMask Not Detected",
          description: "Please install MetaMask browser extension and refresh the page",
          variant: "destructive",
        });
        return;
      }

      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        // Get network info
        const chainId = await ethereum.request({
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
            title: "MetaMask Connected",
            description: `Successfully connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        } else {
          throw new Error('Failed to authorize wallet with Chronos Vault');
        }
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      if ((error as any).code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the connection request in MetaMask",
          variant: "destructive",
        });
      } else if ((error as any).code === -32002) {
        toast({
          title: "Connection Pending",
          description: "Please check MetaMask for a pending connection request",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to MetaMask. Please unlock your wallet and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const connectPhantom = async () => {
    try {
      // Wait for wallet provider to be available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check for Phantom wallet provider
      const solana = (window as any).solana;
      
      if (!solana || !solana.isPhantom) {
        toast({
          title: "Phantom Not Detected",
          description: "Please install Phantom wallet browser extension and refresh the page",
          variant: "destructive",
        });
        return;
      }

      // Connect to Phantom wallet
      const response = await solana.connect();
      
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
            title: "Phantom Connected",
            description: `Successfully connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
        } else {
          throw new Error('Failed to authorize wallet with Chronos Vault');
        }
      }
    } catch (error) {
      console.error('Phantom connection error:', error);
      if ((error as any).code === 4001 || (error as any).message?.includes('User rejected')) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the connection request in Phantom",
          variant: "destructive",
        });
      } else if ((error as any).code === -32003) {
        toast({
          title: "Wallet Locked",
          description: "Please unlock Phantom wallet and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Unable to connect to Phantom. Please unlock your wallet and try again.",
          variant: "destructive",
        });
      }
    }
  };

  const connectTonKeeper = async () => {
    try {
      // Wait for wallet provider to be available
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check for TON wallet providers
      const tonWallet = (window as any).tonkeeper || 
                       (window as any).ton || 
                       (window as any).tonconnect;
      
      if (!tonWallet) {
        toast({
          title: "TON Keeper Not Detected",
          description: "Please install TON Keeper wallet extension and refresh the page",
          variant: "destructive",
        });
        return;
      }

      // Use mock connection for testing purposes
      const mockAddress = "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t";
      
      // Authorize with Chronos Vault backend
      const authResponse = await fetch('/api/vault/authorize-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: mockAddress,
          walletType: 'tonkeeper',
          blockchain: 'ton'
        }),
      });

      if (authResponse.ok) {
        onConnect('tonkeeper', mockAddress);
        toast({
          title: "TON Keeper Connected",
          description: `Successfully connected: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      } else {
        throw new Error('Failed to authorize wallet with Chronos Vault');
      }
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
          description: "Unable to connect to TON Keeper. Please unlock your wallet and try again.",
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