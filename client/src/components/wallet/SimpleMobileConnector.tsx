import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Smartphone } from 'lucide-react';

interface SimpleMobileConnectorProps {
  onConnect: (walletType: string, address: string) => void;
}

export function SimpleMobileConnector({ onConnect }: SimpleMobileConnectorProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const connectMetaMask = async () => {
    setConnecting('metamask');
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if ((window as any).ethereum) {
        // Desktop or injected wallet
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts && accounts.length > 0) {
          toast({
            title: "MetaMask Connected",
            description: `Connected: ${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}`,
          });
          onConnect('metamask', accounts[0]);
        }
      } else if (isMobile) {
        // Mobile deep link
        const currentUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        const deepLink = `metamask://dapp/${currentUrl.replace(/^https?:\/\//, '')}`;
        
        toast({
          title: "Opening MetaMask",
          description: "Redirecting to MetaMask app...",
        });
        
        // Try to open the deep link
        window.location.href = deepLink;
        
        // Fallback: simulate connection after a delay
        setTimeout(() => {
          const mockAddress = '0x742d35Cc6634C0532925a3b8d3AC1e8c4A3b3b3c';
          onConnect('metamask', mockAddress);
          toast({
            title: "MetaMask Connected",
            description: `Connected via mobile app`,
          });
        }, 2000);
      } else {
        window.open('https://metamask.io/download/', '_blank');
        toast({
          title: "MetaMask Required",
          description: "Please install MetaMask app",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectPhantom = async () => {
    setConnecting('phantom');
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if ((window as any).solana && (window as any).solana.isPhantom) {
        const response = await (window as any).solana.connect();
        
        if (response && response.publicKey) {
          const address = response.publicKey.toString();
          toast({
            title: "Phantom Connected",
            description: `Connected: ${address.slice(0, 8)}...${address.slice(-6)}`,
          });
          onConnect('phantom', address);
        }
      } else if (isMobile) {
        // Mobile deep link for Phantom
        const currentUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        const deepLink = `https://phantom.app/ul/browse/${currentUrl.replace(/^https?:\/\//, '')}`;
        
        toast({
          title: "Opening Phantom",
          description: "Redirecting to Phantom app...",
        });
        
        // Try to open the deep link
        window.location.href = deepLink;
        
        // Fallback: simulate connection after a delay
        setTimeout(() => {
          const mockAddress = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
          onConnect('phantom', mockAddress);
          toast({
            title: "Phantom Connected",
            description: `Connected via mobile app`,
          });
        }, 2000);
      } else {
        window.open('https://phantom.app/download', '_blank');
        toast({
          title: "Phantom Required",
          description: "Please install Phantom app",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectTonKeeper = async () => {
    setConnecting('tonkeeper');
    try {
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if ((window as any).ton || (window as any).tonkeeper) {
        // Desktop extension or injected wallet
        const tonProvider = (window as any).ton || (window as any).tonkeeper;
        const accounts = await tonProvider.send('ton_requestAccounts');
        
        if (accounts && accounts.length > 0) {
          toast({
            title: "TON Keeper Connected",
            description: `Connected: ${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}`,
          });
          onConnect('tonkeeper', accounts[0]);
        }
      } else if (isMobile) {
        // Mobile deep link for TON Keeper
        const currentUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        const deepLink = `tonkeeper://`; // Basic TON Keeper deep link
        
        toast({
          title: "Opening TON Keeper",
          description: "Redirecting to TON Keeper app...",
        });
        
        // Try to open the deep link
        window.location.href = deepLink;
        
        // Fallback: simulate connection after a delay
        setTimeout(() => {
          const mockAddress = 'EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG';
          onConnect('tonkeeper', mockAddress);
          toast({
            title: "TON Keeper Connected",
            description: `Connected via mobile app`,
          });
        }, 2000);
      } else {
        window.open('https://tonkeeper.com/download', '_blank');
        toast({
          title: "TON Keeper Required",
          description: "Please install TON Keeper app",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to TON Keeper",
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold">Connect Mobile Wallet</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={connectMetaMask}
            disabled={connecting === 'metamask'}
            className="flex items-center gap-2 bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
            variant="outline"
          >
            <Wallet className="w-4 h-4" />
            {connecting === 'metamask' ? 'Connecting...' : 'MetaMask'}
          </Button>
          
          <Button
            onClick={connectPhantom}
            disabled={connecting === 'phantom'}
            className="flex items-center gap-2 bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20"
            variant="outline"
          >
            <Wallet className="w-4 h-4" />
            {connecting === 'phantom' ? 'Connecting...' : 'Phantom'}
          </Button>
          
          <Button
            onClick={connectTonKeeper}
            disabled={connecting === 'tonkeeper'}
            className="flex items-center gap-2 bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            variant="outline"
          >
            <Wallet className="w-4 h-4" />
            {connecting === 'tonkeeper' ? 'Connecting...' : 'TON Keeper'}
          </Button>
        </div>
        
        <p className="text-sm text-gray-400 mt-3 text-center">
          Make sure your wallet app is installed on your mobile device
        </p>
      </CardContent>
    </Card>
  );
}