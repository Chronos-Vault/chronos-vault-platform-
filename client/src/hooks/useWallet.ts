import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WalletState {
  connected: boolean;
  address: string;
  type: string;
  blockchain: string;
  sessionToken: string | null;
}

export const useWallet = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    type: '',
    blockchain: '',
    sessionToken: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const sessionToken = localStorage.getItem('wallet_session');
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      const data = await response.json();
      
      if (data.authenticated) {
        setWallet(prev => ({
          ...prev,
          connected: true,
          sessionToken,
        }));
      } else {
        localStorage.removeItem('wallet_session');
      }
    } catch (error) {
      console.error('Session check error:', error);
      localStorage.removeItem('wallet_session');
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async (walletType: 'metamask' | 'phantom' | 'tonkeeper') => {
    try {
      let address = '';
      let blockchain = '';

      // Determine blockchain and get address
      switch (walletType) {
        case 'metamask':
          if (!window.ethereum?.isMetaMask) {
            throw new Error('MetaMask not installed');
          }
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          address = accounts[0];
          blockchain = 'ethereum';
          break;
          
        case 'phantom':
          if (!window.solana?.isPhantom) {
            throw new Error('Phantom wallet not installed');
          }
          const response = await window.solana.connect();
          address = response.publicKey.toString();
          blockchain = 'solana';
          break;
          
        case 'tonkeeper':
          address = `0:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
          blockchain = 'ton';
          break;
      }

      // Request authentication
      const authResponse = await fetch('/api/wallet/auth/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType,
          blockchain
        })
      });

      const authData = await authResponse.json();
      if (!authData.success) {
        throw new Error('Failed to request authentication');
      }

      // Sign message
      let signature = '';
      if (walletType === 'metamask') {
        signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [authData.message, address]
        });
      } else if (walletType === 'phantom') {
        const messageBytes = new TextEncoder().encode(authData.message);
        const signedMessage = await window.solana.signMessage(messageBytes);
        signature = JSON.stringify(Array.from(signedMessage.signature));
      } else if (walletType === 'tonkeeper') {
        signature = 'ton_signature_' + Date.now();
      }

      // Verify signature
      const verifyResponse = await fetch('/api/wallet/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: authData.attemptId,
          signature
        })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyData.success) {
        throw new Error('Signature verification failed');
      }

      // Connect wallet
      const connectResponse = await fetch('/api/wallet/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          walletType,
          blockchain,
          signature,
          message: authData.message
        })
      });

      const connectData = await connectResponse.json();
      if (!connectData.success) {
        throw new Error('Failed to connect wallet');
      }

      // Update state and store session
      setWallet({
        connected: true,
        address,
        type: walletType,
        blockchain,
        sessionToken: connectData.session.id,
      });

      localStorage.setItem('wallet_session', connectData.session.id);

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

      return connectData;

    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('wallet_session');
    setWallet({
      connected: false,
      address: '',
      type: '',
      blockchain: '',
      sessionToken: null,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return {
    wallet,
    loading,
    connectWallet,
    disconnectWallet,
    isConnected: wallet.connected,
  };
};

// Global wallet interfaces
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
    ton?: any;
  }
}