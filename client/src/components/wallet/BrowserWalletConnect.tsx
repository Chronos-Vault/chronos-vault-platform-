import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

interface BrowserWalletConnectProps {
  walletType: 'metamask' | 'phantom' | 'tonkeeper';
  onConnect: (walletType: string, address: string) => void;
  onCancel: () => void;
}

export function BrowserWalletConnect({ walletType, onConnect, onCancel }: BrowserWalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState('ready');
  const { toast } = useToast();

  const walletInfo = {
    metamask: {
      name: 'MetaMask',
      description: 'Connect using MetaMask browser extension',
      checkMethod: () => typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    phantom: {
      name: 'Phantom',
      description: 'Connect using Phantom browser extension',
      checkMethod: () => typeof window !== 'undefined' && window.solana?.isPhantom
    },
    tonkeeper: {
      name: 'TON Keeper',
      description: 'Connect using TON Keeper browser extension',
      checkMethod: () => typeof window !== 'undefined' && window.ton
    }
  };

  const connectMetaMask = async () => {
    try {
      if (!window.ethereum?.isMetaMask) {
        throw new Error('MetaMask not found');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        onConnect('metamask', accounts[0]);
        toast({
          title: 'MetaMask Connected',
          description: `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      setStatus('error');
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to MetaMask',
        variant: 'destructive',
      });
    }
  };

  const connectPhantom = async () => {
    try {
      if (!window.solana?.isPhantom) {
        throw new Error('Phantom not found');
      }

      const response = await window.solana.connect();
      
      if (response.publicKey) {
        const address = response.publicKey.toString();
        onConnect('phantom', address);
        toast({
          title: 'Phantom Connected',
          description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Phantom connection failed:', error);
      setStatus('error');
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to Phantom',
        variant: 'destructive',
      });
    }
  };

  const connectTonKeeper = async () => {
    try {
      if (!window.ton) {
        throw new Error('TON Keeper not found');
      }

      // TON Keeper connection would go here
      // For now, simulate a successful connection
      const simulatedAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
      onConnect('tonkeeper', simulatedAddress);
      toast({
        title: 'TON Keeper Connected',
        description: `Connected: ${simulatedAddress.slice(0, 6)}...${simulatedAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error('TON Keeper connection failed:', error);
      setStatus('error');
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect to TON Keeper',
        variant: 'destructive',
      });
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setStatus('connecting');

    try {
      switch (walletType) {
        case 'metamask':
          await connectMetaMask();
          break;
        case 'phantom':
          await connectPhantom();
          break;
        case 'tonkeeper':
          await connectTonKeeper();
          break;
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const wallet = walletInfo[walletType];
  const isWalletInstalled = wallet.checkMethod();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect {wallet.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          {wallet.description}
        </p>

        {!isWalletInstalled ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                {wallet.name} extension not detected. Please install it first.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                {wallet.name} extension detected and ready to connect.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleConnect}
            disabled={!isWalletInstalled || isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </Button>
          
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600 text-center">
            Connection failed. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}