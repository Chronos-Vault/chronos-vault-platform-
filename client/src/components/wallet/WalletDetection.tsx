import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WalletDetectionProps {
  onConnect: (walletType: string, address: string) => void;
}

export function WalletDetection({ onConnect }: WalletDetectionProps) {
  const { toast } = useToast();
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkWallets = async () => {
      const detected = [];
      
      // Wait for providers to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check for Ethereum providers
      if ((window as any).ethereum) {
        detected.push('MetaMask/Ethereum');
      }
      
      // Check for Solana providers
      if ((window as any).solana?.isPhantom) {
        detected.push('Phantom');
      }
      
      // Check for TON providers
      if ((window as any).tonkeeper || (window as any).ton) {
        detected.push('TON Keeper');
      }
      
      setDetectedWallets(detected);
      setIsChecking(false);
    };
    
    checkWallets();
  }, []);

  const connectEthereum = async () => {
    try {
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        toast({
          title: "Ethereum Wallet Required",
          description: "Please install MetaMask or another Ethereum wallet",
          variant: "destructive",
        });
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts?.length > 0) {
        const chainId = await ethereum.request({
          method: 'eth_chainId'
        });
        
        const authResponse = await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: accounts[0],
            chainId,
            walletType: 'metamask',
            blockchain: 'ethereum'
          }),
        });

        if (authResponse.ok) {
          onConnect('metamask', accounts[0]);
          toast({
            title: "Ethereum Wallet Connected",
            description: `Connected: ${accounts[0].slice(0, 8)}...${accounts[0].slice(-6)}`,
          });
        }
      }
    } catch (error: any) {
      if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the wallet connection request",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Please unlock your wallet and try again",
          variant: "destructive",
        });
      }
    }
  };

  const connectSolana = async () => {
    try {
      const solana = (window as any).solana;
      
      if (!solana?.isPhantom) {
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom wallet for Solana",
          variant: "destructive",
        });
        return;
      }

      const response = await solana.connect();
      
      if (response?.publicKey) {
        const address = response.publicKey.toString();
        
        const authResponse = await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType: 'phantom',
            blockchain: 'solana'
          }),
        });

        if (authResponse.ok) {
          onConnect('phantom', address);
          toast({
            title: "Phantom Connected",
            description: `Connected: ${address.slice(0, 8)}...${address.slice(-6)}`,
          });
        }
      }
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes('rejected')) {
        toast({
          title: "Connection Rejected",
          description: "Please accept the wallet connection request",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Please unlock Phantom and try again",
          variant: "destructive",
        });
      }
    }
  };

  const connectTON = async () => {
    try {
      // For TON, we'll provide instructions for real wallet connection
      toast({
        title: "TON Wallet Setup Required",
        description: "Please install TON Keeper or Tonhub wallet to connect to TON network",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "TON Connection Error",
        description: "Unable to connect to TON wallet",
        variant: "destructive",
      });
    }
  };

  if (isChecking) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p>Detecting installed wallets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Detected wallets: {detectedWallets.length > 0 ? detectedWallets.join(', ') : 'None detected'}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={connectEthereum}
          className="flex items-center gap-2 p-4 h-auto"
          variant={detectedWallets.some(w => w.includes('MetaMask')) ? "default" : "outline"}
        >
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            Ξ
          </div>
          <div className="text-left">
            <div className="font-semibold">Ethereum</div>
            <div className="text-xs opacity-75">MetaMask, etc.</div>
          </div>
        </Button>

        <Button 
          onClick={connectSolana}
          className="flex items-center gap-2 p-4 h-auto"
          variant={detectedWallets.includes('Phantom') ? "default" : "outline"}
        >
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            ◎
          </div>
          <div className="text-left">
            <div className="font-semibold">Solana</div>
            <div className="text-xs opacity-75">Phantom</div>
          </div>
        </Button>

        <Button 
          onClick={connectTON}
          className="flex items-center gap-2 p-4 h-auto"
          variant={detectedWallets.includes('TON Keeper') ? "default" : "outline"}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            T
          </div>
          <div className="text-left">
            <div className="font-semibold">TON</div>
            <div className="text-xs opacity-75">TON Keeper</div>
          </div>
        </Button>
      </div>

      {detectedWallets.length === 0 && (
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800">
            No wallet extensions detected. Please install a wallet browser extension to connect to Chronos Vault.
          </p>
        </div>
      )}
    </div>
  );
}