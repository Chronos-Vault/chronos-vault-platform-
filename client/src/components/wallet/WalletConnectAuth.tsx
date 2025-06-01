import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CheckCircle, Clock } from 'lucide-react';

interface WalletConnectAuthProps {
  onWalletConnected: (walletType: string, address: string) => void;
}

export function WalletConnectAuth({ onWalletConnected }: WalletConnectAuthProps) {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connectedWallets, setConnectedWallets] = useState<{[key: string]: string}>({});
  const [signClient, setSignClient] = useState<any>(null);

  useEffect(() => {
    const initWalletConnect = async () => {
      try {
        const { SignClient } = await import('@walletconnect/sign-client');
        
        // Get project ID from environment
        const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
        
        if (!projectId) {
          console.error('WalletConnect Project ID is missing');
          return;
        }
        
        const client = await SignClient.init({
          projectId,
          metadata: {
            name: 'Chronos Vault',
            description: 'Multi-chain digital vault platform',
            url: window.location.origin,
            icons: ['https://chronos-vault.com/icon.png']
          }
        });
        
        setSignClient(client);
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
      }
    };

    initWalletConnect();
  }, []);

  const connectWallet = async (walletType: string) => {
    if (!signClient) {
      toast({
        title: "WalletConnect Not Ready",
        description: "Please wait for WalletConnect to initialize",
        variant: "destructive",
      });
      return;
    }

    setConnecting(walletType);

    try {
      let chainId = '';
      let methods = [''];
      
      if (walletType === 'metamask') {
        chainId = 'eip155:1'; // Ethereum mainnet
        methods = ['personal_sign', 'eth_sendTransaction'];
      } else if (walletType === 'phantom') {
        chainId = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'; // Solana mainnet
        methods = ['solana_signMessage', 'solana_signTransaction'];
      } else if (walletType === 'tonkeeper') {
        chainId = 'ton:mainnet';
        methods = ['ton_personalSign', 'ton_sendTransaction'];
      }

      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          [walletType === 'metamask' ? 'eip155' : walletType === 'phantom' ? 'solana' : 'ton']: {
            methods,
            chains: [chainId],
            events: ['accountsChanged', 'chainChanged']
          }
        }
      });

      if (uri) {
        // Open wallet app with deep link
        if (walletType === 'metamask') {
          window.location.href = `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
        } else if (walletType === 'phantom') {
          window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}?wc=${encodeURIComponent(uri)}`;
        } else if (walletType === 'tonkeeper') {
          window.location.href = `https://app.tonkeeper.com/tonconnect?ret=back&r=tc&v=2&id=chronos-vault&n=Chronos%20Vault&u=${encodeURIComponent(uri)}`;
        }

        // Wait for approval
        const session = await approval();
        
        if (session) {
          const accounts = Object.values(session.namespaces)[0]?.accounts || [];
          if (accounts.length > 0) {
            const address = accounts[0].split(':')[2]; // Extract address from account format
            
            // Request signature
            const message = `Sign this message to authenticate with Chronos Vault\nTimestamp: ${Date.now()}`;
            
            let signature = '';
            try {
              if (walletType === 'metamask') {
                const result = await signClient.request({
                  topic: session.topic,
                  chainId,
                  request: {
                    method: 'personal_sign',
                    params: [message, address]
                  }
                });
                signature = result;
              } else if (walletType === 'phantom') {
                const result = await signClient.request({
                  topic: session.topic,
                  chainId,
                  request: {
                    method: 'solana_signMessage',
                    params: {
                      message: Buffer.from(message).toString('base64'),
                      display: 'utf8'
                    }
                  }
                });
                signature = result.signature;
              } else if (walletType === 'tonkeeper') {
                const result = await signClient.request({
                  topic: session.topic,
                  chainId,
                  request: {
                    method: 'ton_personalSign',
                    params: { data: message }
                  }
                });
                signature = result;
              }

              // Verify signature on backend
              const response = await fetch('/api/wallet/verify-signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  walletType,
                  address,
                  message,
                  signature,
                  blockchain: walletType === 'metamask' ? 'ethereum' : walletType === 'phantom' ? 'solana' : 'ton'
                })
              });

              const result = await response.json();

              if (result.verified) {
                setConnectedWallets(prev => ({ ...prev, [walletType]: address }));
                onWalletConnected(walletType, address);
                
                toast({
                  title: `${walletType} Connected`,
                  description: `Signed and verified: ${address.slice(0, 8)}...${address.slice(-6)}`,
                });
              } else {
                throw new Error('Signature verification failed');
              }

            } catch (signError) {
              console.error('Signing failed:', signError);
              toast({
                title: "Signing Failed",
                description: "Failed to sign authentication message",
                variant: "destructive",
              });
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Wallet connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect ${walletType}`,
        variant: "destructive",
      });
    } finally {
      setConnecting(null);
    }
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask', chain: 'Ethereum', icon: '🦊', color: 'from-orange-500 to-yellow-600' },
    { id: 'phantom', name: 'Phantom', chain: 'Solana', icon: '👻', color: 'from-purple-500 to-indigo-600' },
    { id: 'tonkeeper', name: 'TON Keeper', chain: 'TON', icon: '💎', color: 'from-blue-500 to-cyan-600' }
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          WalletConnect Authentication
        </CardTitle>
        <p className="text-sm text-gray-400">
          Connect and sign with your mobile wallets
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallets.map((wallet) => (
          <Button
            key={wallet.id}
            onClick={() => connectWallet(wallet.id)}
            disabled={connecting === wallet.id || !signClient}
            className={`w-full h-16 justify-between bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white ${
              connectedWallets[wallet.id] ? 'ring-2 ring-green-400' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{wallet.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{wallet.name}</div>
                <div className="text-sm opacity-80">{wallet.chain}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {connectedWallets[wallet.id] ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : connecting === wallet.id ? (
                <Clock className="w-5 h-5 text-yellow-400 animate-spin" />
              ) : (
                <Wallet className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-sm">
                {connecting === wallet.id ? 'Connecting...' : 
                 connectedWallets[wallet.id] ? 'Connected' : 
                 !signClient ? 'Loading...' : 'Connect & Sign'}
              </span>
            </div>
          </Button>
        ))}
        
        {Object.keys(connectedWallets).length > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 font-medium">
              ✓ Authenticated: {Object.keys(connectedWallets).length} wallet(s)
            </div>
            <div className="text-xs text-green-300 mt-1">
              Wallets connected and signatures verified
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}