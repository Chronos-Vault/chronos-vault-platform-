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
      if ((window as any).ethereum) {
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
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask mobile app",
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
      } else {
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom mobile app",
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
      // For TON Keeper, try direct window object first
      if ((window as any).ton) {
        const accounts = await (window as any).ton.send('ton_requestAccounts');
        
        if (accounts && accounts.length > 0) {
          toast({
            title: "TON Keeper Connected",
            description: `Connected: ${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}`,
          });
          onConnect('tonkeeper', accounts[0]);
        }
      } else {
        toast({
          title: "TON Keeper Not Found",
          description: "Please install TON Keeper mobile app",
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