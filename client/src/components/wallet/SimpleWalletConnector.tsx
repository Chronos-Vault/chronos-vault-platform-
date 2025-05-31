import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WalletInfo {
  name: string;
  icon: string;
  detected: boolean;
  provider: any;
}

export function SimpleWalletConnector() {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check for wallet extensions
    const checkWallets = () => {
      const walletList: WalletInfo[] = [
        {
          name: 'MetaMask',
          icon: '🦊',
          detected: typeof (window as any).ethereum !== 'undefined',
          provider: (window as any).ethereum
        },
        {
          name: 'Phantom',
          icon: '👻',
          detected: typeof (window as any).solana?.isPhantom !== 'undefined',
          provider: (window as any).solana
        },
        {
          name: 'TonKeeper',
          icon: '💎',
          detected: typeof (window as any).ton !== 'undefined' || typeof (window as any).tonkeeper !== 'undefined',
          provider: (window as any).ton || (window as any).tonkeeper
        }
      ];
      
      setWallets(walletList);
      console.log('Wallets detected:', walletList.filter(w => w.detected).map(w => w.name));
    };

    checkWallets();
    
    // Re-check after a delay in case extensions load later
    const timer = setTimeout(checkWallets, 2000);
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async (wallet: WalletInfo) => {
    if (!wallet.detected) {
      toast({
        title: "Wallet Not Found",
        description: `${wallet.name} extension is not installed`,
        variant: "destructive"
      });
      return;
    }

    setConnecting(wallet.name);

    try {
      let address = '';
      let blockchain = '';

      if (wallet.name === 'MetaMask') {
        // Connect to MetaMask
        const accounts = await wallet.provider.request({
          method: 'eth_requestAccounts'
        });
        address = accounts[0];
        blockchain = 'ethereum';
        
        toast({
          title: "MetaMask Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } 
      else if (wallet.name === 'Phantom') {
        // Connect to Phantom
        const response = await wallet.provider.connect();
        address = response.publicKey.toString();
        blockchain = 'solana';
        
        toast({
          title: "Phantom Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
      else if (wallet.name === 'TonKeeper') {
        // For TON, we'll simulate connection
        address = 'ton_address_placeholder';
        blockchain = 'ton';
        
        toast({
          title: "TonKeeper Connection",
          description: "TON wallet connection initiated",
        });
      }

      // Send to backend
      if (address && blockchain) {
        const response = await fetch('/api/vault/authorize-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address,
            walletType: wallet.name.toLowerCase(),
            blockchain
          })
        });

        const result = await response.json();
        
        if (response.ok) {
          toast({
            title: "Authorization Successful",
            description: `${wallet.name} authorized for Chronos Vault`,
          });
          console.log('Backend authorization success:', result);
        } else {
          throw new Error(result.message || 'Authorization failed');
        }
      }

    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect ${wallet.name}`,
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle>Connect Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <div key={wallet.name} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-gray-400">
                    {wallet.detected ? 'Ready to connect' : 'Extension not installed'}
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => connectWallet(wallet)}
                disabled={!wallet.detected || connecting === wallet.name}
                variant={wallet.detected ? "default" : "outline"}
                size="sm"
              >
                {connecting === wallet.name ? 'Connecting...' : 
                 wallet.detected ? 'Connect' : 'Install'}
              </Button>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400">
            Extensions detected: {wallets.filter(w => w.detected).length} of {wallets.length}
          </p>
          <Button
            onClick={() => {
              console.log('Manual wallet check:');
              console.log('window.ethereum:', !!(window as any).ethereum);
              console.log('window.solana:', !!(window as any).solana);
              console.log('window.ton:', !!(window as any).ton);
              
              toast({
                title: "Extension Check",
                description: `MetaMask: ${!!(window as any).ethereum}, Phantom: ${!!(window as any).solana}, TON: ${!!(window as any).ton}`,
              });
            }}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Check Extensions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}