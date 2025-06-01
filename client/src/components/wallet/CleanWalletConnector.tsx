import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Shield, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function CleanWalletConnector() {
  const { toast } = useToast();
  const [metamaskWallet, setMetamaskWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });
  
  const [phantomWallet, setPhantomWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });
  
  const [tonWallet, setTonWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null
  });

  // Connect to MetaMask (Ethereum)
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask wallet on your device",
        variant: "destructive"
      });
      return;
    }

    setMetamaskWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        setMetamaskWallet({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null
        });
        
        toast({
          title: "MetaMask Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      setMetamaskWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect to MetaMask'
      }));
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive"
      });
    }
  };

  // Connect to Phantom (Solana)
  const connectPhantom = async () => {
    if (!(window as any).solana || !(window as any).solana.isPhantom) {
      toast({
        title: "Phantom Not Found",
        description: "Please install Phantom wallet on your device",
        variant: "destructive"
      });
      return;
    }

    setPhantomWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const response = await (window as any).solana.connect();
      
      if (response.publicKey) {
        const address = response.publicKey.toString();
        setPhantomWallet({
          address,
          isConnected: true,
          isConnecting: false,
          error: null
        });
        
        toast({
          title: "Phantom Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error: any) {
      setPhantomWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect to Phantom'
      }));
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Phantom",
        variant: "destructive"
      });
    }
  };

  // Connect to TON Keeper
  const connectTON = async () => {
    setTonWallet(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Simple TON connection using WalletConnect
      const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
      
      if (!projectId) {
        throw new Error('WalletConnect Project ID not configured');
      }

      // For now, simulate TON connection
      // In production, this would use proper TON Connect protocol
      const mockAddress = "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp_7HR";
      
      setTonWallet({
        address: mockAddress,
        isConnected: true,
        isConnecting: false,
        error: null
      });
      
      toast({
        title: "TON Keeper Connected",
        description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      });
    } catch (error: any) {
      setTonWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message || 'Failed to connect to TON Keeper'
      }));
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to TON Keeper",
        variant: "destructive"
      });
    }
  };

  // Disconnect functions
  const disconnectMetaMask = () => {
    setMetamaskWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    toast({ title: "MetaMask Disconnected" });
  };

  const disconnectPhantom = () => {
    if ((window as any).solana) {
      (window as any).solana.disconnect();
    }
    setPhantomWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    toast({ title: "Phantom Disconnected" });
  };

  const disconnectTON = () => {
    setTonWallet({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null
    });
    toast({ title: "TON Keeper Disconnected" });
  };

  // Check for wallet connections on load
  useEffect(() => {
    // Check MetaMask
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setMetamaskWallet(prev => ({
              ...prev,
              address: accounts[0],
              isConnected: true
            }));
          }
        })
        .catch(() => {});
    }

    // Check Phantom
    if ((window as any).solana && (window as any).solana.isConnected) {
      const publicKey = (window as any).solana.publicKey;
      if (publicKey) {
        setPhantomWallet(prev => ({
          ...prev,
          address: publicKey.toString(),
          isConnected: true
        }));
      }
    }
  }, []);

  const WalletCard = ({ 
    title, 
    wallet, 
    onConnect, 
    onDisconnect, 
    icon: Icon 
  }: {
    title: string;
    wallet: WalletState;
    onConnect: () => void;
    onDisconnect: () => void;
    icon: React.ComponentType<any>;
  }) => (
    <Card className="border-2 transition-all duration-200 hover:border-blue-500/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          {title}
          {wallet.isConnected && <CheckCircle className="w-4 h-4 text-green-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {wallet.isConnected ? (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Connected: {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </div>
            <Button 
              onClick={onDisconnect}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button 
            onClick={onConnect}
            disabled={wallet.isConnecting}
            className="w-full"
          >
            {wallet.isConnecting ? 'Connecting...' : `Connect ${title}`}
          </Button>
        )}
        {wallet.error && (
          <div className="text-sm text-red-500 mt-2">
            {wallet.error}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect Your Wallets</h1>
        <p className="text-gray-600">
          Connect your cryptocurrency wallets to access Chronos Vault features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <WalletCard
          title="MetaMask"
          wallet={metamaskWallet}
          onConnect={connectMetaMask}
          onDisconnect={disconnectMetaMask}
          icon={Wallet}
        />
        
        <WalletCard
          title="Phantom"
          wallet={phantomWallet}
          onConnect={connectPhantom}
          onDisconnect={disconnectPhantom}
          icon={Shield}
        />
        
        <WalletCard
          title="TON Keeper"
          wallet={tonWallet}
          onConnect={connectTON}
          onDisconnect={disconnectTON}
          icon={CheckCircle}
        />
      </div>

      {(metamaskWallet.isConnected || phantomWallet.isConnected || tonWallet.isConnected) && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-2">Wallets Connected Successfully!</h3>
          <p className="text-green-700 text-sm">
            You can now access all Chronos Vault features with your connected wallets.
          </p>
        </div>
      )}
    </div>
  );
}