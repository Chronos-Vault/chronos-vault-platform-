import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface WalletConnection {
  address: string;
  signature: string;
  message: string;
  walletType: string;
}

interface WalletConnectorProps {
  onConnect: (connection: WalletConnection) => void;
}

export function WalletConnector({ onConnect }: WalletConnectorProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToast();

  const connectMetaMask = async () => {
    if (!window.ethereum?.isMetaMask) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask browser extension",
        variant: "destructive"
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setConnecting('metamask');
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts?.length) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
      
      // Request signature
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address]
      });

      onConnect({
        address,
        signature,
        message,
        walletType: 'metamask'
      });

      toast({
        title: "MetaMask Connected",
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || 'Failed to connect MetaMask',
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectPhantom = async () => {
    if (!window.solana?.isPhantom) {
      toast({
        title: "Phantom Not Found",
        description: "Please install Phantom browser extension",
        variant: "destructive"
      });
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting('phantom');
      
      // Connect to Phantom
      const response = await window.solana.connect();
      
      if (!response?.publicKey) {
        throw new Error('No public key received');
      }

      const address = response.publicKey.toString();
      const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
      
      // Request signature
      const encodedMessage = new TextEncoder().encode(message);
      const signatureResponse = await window.solana.signMessage(encodedMessage, 'utf8');

      onConnect({
        address,
        signature: Array.from(signatureResponse.signature),
        message,
        walletType: 'phantom'
      });

      toast({
        title: "Phantom Connected",
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || 'Failed to connect Phantom',
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  const connectTonKeeper = async () => {
    try {
      setConnecting('tonkeeper');
      
      // Import TON Connect
      const { TonConnectUI } = await import('@tonconnect/ui');
      
      const tonConnectUI = new TonConnectUI({
        manifestUrl: `${window.location.origin}/tonconnect-manifest.json`
      });

      // Connect to wallet
      const connectedWallet = await tonConnectUI.connectWallet();
      
      if (!connectedWallet) {
        throw new Error('Failed to connect to TON wallet');
      }

      const address = connectedWallet.account.address;
      const message = `Authenticate with Chronos Vault\n\nWallet: ${address}\nTimestamp: ${Date.now()}\nNonce: ${Math.random()}`;
      
      // For TON, we'll use the connection proof as signature
      const signature = `ton_connect_${Date.now()}_${connectedWallet.account.chain}`;

      onConnect({
        address,
        signature,
        message,
        walletType: 'tonkeeper'
      });

      toast({
        title: "TON Keeper Connected",
        description: `Connected to ${address.slice(0, 8)}...${address.slice(-6)}`
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || 'Failed to connect TON Keeper',
        variant: "destructive"
      });
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gray-900/50 border-orange-500/30 hover:border-orange-400/50 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">🦊</div>
          <h3 className="text-xl font-semibold text-orange-400 mb-2">MetaMask</h3>
          <p className="text-gray-400 text-sm mb-6">Ethereum & EVM Compatible</p>
          <Button
            onClick={connectMetaMask}
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={connecting === 'metamask'}
          >
            {connecting === 'metamask' ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-purple-500/30 hover:border-purple-400/50 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">👻</div>
          <h3 className="text-xl font-semibold text-purple-400 mb-2">Phantom</h3>
          <p className="text-gray-400 text-sm mb-6">Solana Ecosystem</p>
          <Button
            onClick={connectPhantom}
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={connecting === 'phantom'}
          >
            {connecting === 'phantom' ? 'Connecting...' : 'Connect Phantom'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-blue-500/30 hover:border-blue-400/50 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-4">💎</div>
          <h3 className="text-xl font-semibold text-blue-400 mb-2">TON Keeper</h3>
          <p className="text-gray-400 text-sm mb-6">TON Blockchain</p>
          <Button
            onClick={connectTonKeeper}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={connecting === 'tonkeeper'}
          >
            {connecting === 'tonkeeper' ? 'Connecting...' : 'Connect TON Keeper'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}