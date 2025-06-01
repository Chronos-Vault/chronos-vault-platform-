import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Shield, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

interface RealWalletAuthProps {
  onAuthenticated: (walletType: string, address: string, signature: string) => void;
}

export function RealWalletAuth({ onAuthenticated }: RealWalletAuthProps) {
  const [authenticating, setAuthenticating] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{[key: string]: 'idle' | 'pending' | 'success' | 'error'}>({});
  const [connectedWallets, setConnectedWallets] = useState<{[key: string]: any}>({});
  const { toast } = useToast();

  // Check if wallets are available
  const [walletAvailability, setWalletAvailability] = useState({
    metamask: false,
    phantom: false,
    tonkeeper: false
  });

  useEffect(() => {
    // Check wallet availability
    const checkWallets = () => {
      setWalletAvailability({
        metamask: !!(window as any).ethereum,
        phantom: !!(window as any).solana && (window as any).solana.isPhantom,
        tonkeeper: !!(window as any).ton || !!(window as any).tonkeeper
      });
    };

    checkWallets();
    // Recheck periodically in case wallets are installed
    const interval = setInterval(checkWallets, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateNonce = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const createSignMessage = (address: string, nonce: string) => {
    return `Chronos Vault Authentication\n\nSign this message to prove ownership of your wallet.\n\nAddress: ${address}\nNonce: ${nonce}\nTimestamp: ${Date.now()}`;
  };

  const authenticateMetaMask = async () => {
    if (!walletAvailability.metamask) {
      window.open('https://metamask.io/download/', '_blank');
      toast({
        title: "Install MetaMask",
        description: "Please install MetaMask extension to continue",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating('metamask');
    setAuthStatus(prev => ({ ...prev, metamask: 'pending' }));

    try {
      // Switch to Ethereum mainnet or testnet
      try {
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }], // Mainnet
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          toast({
            title: "Network Switch",
            description: "Please switch to Ethereum Mainnet in MetaMask",
            variant: "destructive",
          });
          return;
        }
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in MetaMask');
      }

      const address = accounts[0];
      const nonce = generateNonce();
      const message = createSignMessage(address, nonce);

      // Request signature using personal_sign
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });

      // Verify signature on backend
      const response = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'metamask',
          address,
          message,
          signature,
          blockchain: 'ethereum'
        })
      });

      const result = await response.json();

      if (result.verified) {
        setAuthStatus(prev => ({ ...prev, metamask: 'success' }));
        setConnectedWallets(prev => ({ ...prev, metamask: { address, signature, sessionToken: result.sessionToken } }));
        
        toast({
          title: "MetaMask Authenticated",
          description: `Successfully signed with ${address.slice(0, 8)}...${address.slice(-6)}`,
        });

        onAuthenticated('metamask', address, signature);
      } else {
        throw new Error('Signature verification failed');
      }

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, metamask: 'error' }));
      toast({
        title: "MetaMask Authentication Failed",
        description: error.message || "Failed to authenticate with MetaMask",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const authenticatePhantom = async () => {
    if (!walletAvailability.phantom) {
      window.open('https://phantom.app/download', '_blank');
      toast({
        title: "Install Phantom",
        description: "Please install Phantom wallet to continue",
        variant: "destructive",
      });
      return;
    }

    setAuthenticating('phantom');
    setAuthStatus(prev => ({ ...prev, phantom: 'pending' }));

    try {
      // Connect to Phantom
      const response = await (window as any).solana.connect();
      const address = response.publicKey.toString();
      const nonce = generateNonce();
      const message = createSignMessage(address, nonce);

      // Create message for signing
      const encodedMessage = new TextEncoder().encode(message);

      // Request signature from Phantom
      const signatureResult = await (window as any).solana.signMessage(encodedMessage, 'utf8');
      const signature = Array.from(signatureResult.signature).map((b: number) => b.toString(16).padStart(2, '0')).join('');

      // Verify signature on backend
      const verifyResponse = await fetch('/api/wallet/verify-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletType: 'phantom',
          address,
          message,
          signature,
          blockchain: 'solana',
          publicKey: response.publicKey.toString()
        })
      });

      const result = await verifyResponse.json();

      if (result.verified) {
        setAuthStatus(prev => ({ ...prev, phantom: 'success' }));
        setConnectedWallets(prev => ({ ...prev, phantom: { address, signature, sessionToken: result.sessionToken } }));
        
        toast({
          title: "Phantom Authenticated",
          description: `Successfully signed with ${address.slice(0, 8)}...${address.slice(-6)}`,
        });

        onAuthenticated('phantom', address, signature);
      } else {
        throw new Error('Signature verification failed');
      }

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, phantom: 'error' }));
      toast({
        title: "Phantom Authentication Failed",
        description: error.message || "Failed to authenticate with Phantom",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const authenticateTonKeeper = async () => {
    setAuthenticating('tonkeeper');
    setAuthStatus(prev => ({ ...prev, tonkeeper: 'pending' }));

    try {
      // Try to use TON Connect if available
      if ((window as any).ton || (window as any).tonkeeper) {
        const tonProvider = (window as any).ton || (window as any).tonkeeper;
        
        try {
          const accounts = await tonProvider.send('ton_requestAccounts');
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            const nonce = generateNonce();
            const message = createSignMessage(address, nonce);
            
            // Request signature
            const signature = await tonProvider.send('ton_personalSign', {
              data: message
            });

            // Verify on backend
            const response = await fetch('/api/wallet/verify-signature', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                walletType: 'tonkeeper',
                address,
                message,
                signature,
                blockchain: 'ton'
              })
            });

            const result = await response.json();

            if (result.verified) {
              setAuthStatus(prev => ({ ...prev, tonkeeper: 'success' }));
              setConnectedWallets(prev => ({ ...prev, tonkeeper: { address, signature, sessionToken: result.sessionToken } }));
              
              toast({
                title: "TON Keeper Authenticated",
                description: `Successfully signed with ${address.slice(0, 8)}...${address.slice(-6)}`,
              });

              onAuthenticated('tonkeeper', address, signature);
              return;
            }
          }
        } catch (tonError) {
          console.log('TON provider error:', tonError);
          // Fall through to alternative method
        }
      }

      // If no TON provider or error, guide user to install
      window.open('https://tonkeeper.com/download', '_blank');
      toast({
        title: "Install TON Keeper",
        description: "Please install TON Keeper wallet to continue",
        variant: "destructive",
      });

    } catch (error: any) {
      setAuthStatus(prev => ({ ...prev, tonkeeper: 'error' }));
      toast({
        title: "TON Keeper Authentication Failed",
        description: error.message || "Failed to authenticate with TON Keeper",
        variant: "destructive",
      });
    } finally {
      setAuthenticating(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      blockchain: 'Ethereum',
      icon: '🦊',
      color: 'from-orange-500 to-yellow-600',
      authenticate: authenticateMetaMask,
      available: walletAvailability.metamask
    },
    {
      id: 'phantom',
      name: 'Phantom',
      blockchain: 'Solana',
      icon: '👻',
      color: 'from-purple-500 to-indigo-600',
      authenticate: authenticatePhantom,
      available: walletAvailability.phantom
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      blockchain: 'TON',
      icon: '💎',
      color: 'from-blue-500 to-cyan-600',
      authenticate: authenticateTonKeeper,
      available: walletAvailability.tonkeeper
    }
  ];

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Real Wallet Authentication
        </CardTitle>
        <p className="text-sm text-gray-400">
          Connect and sign with your actual wallet to prove ownership
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              onClick={wallet.authenticate}
              disabled={authenticating === wallet.id}
              className={`w-full h-20 justify-between bg-gradient-to-r ${wallet.color} hover:opacity-90 text-white ${
                authStatus[wallet.id] === 'success' ? 'ring-2 ring-green-400' : ''
              } ${!wallet.available ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-lg">{wallet.name}</div>
                  <div className="text-sm opacity-80">{wallet.blockchain}</div>
                  <div className="text-xs opacity-70">
                    {!wallet.available ? 'Not Installed' : 
                     connectedWallets[wallet.id] ? 
                     `${connectedWallets[wallet.id].address?.slice(0, 8)}...${connectedWallets[wallet.id].address?.slice(-6)}` :
                     'Ready to Connect'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                {getStatusIcon(authStatus[wallet.id] || 'idle')}
                {!wallet.available ? (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    <span className="text-xs">Install</span>
                  </div>
                ) : (
                  <span className="text-xs">
                    {authenticating === wallet.id ? 'Signing...' : 
                     authStatus[wallet.id] === 'success' ? 'Verified' :
                     authStatus[wallet.id] === 'error' ? 'Failed' : 'Sign Message'}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-center text-sm text-gray-400 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Shield className="w-4 h-4 inline mr-2" />
          Real cryptographic signatures prove wallet ownership securely
        </div>

        {Object.keys(connectedWallets).length > 0 && (
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="text-sm text-green-400 font-medium">
              ✓ Authenticated Wallets: {Object.keys(connectedWallets).length}
            </div>
            <div className="text-xs text-green-300 mt-1">
              Your wallet signatures have been verified and you can now use Chronos Vault
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}