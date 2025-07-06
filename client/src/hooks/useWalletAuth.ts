import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface WalletAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: number;
    username: string;
    walletAddress: string;
    email?: string;
  } | null;
  sessionToken: string | null;
  walletInfo: {
    address: string;
    blockchain: string;
    verified: boolean;
  } | null;
}

export interface WalletAuthActions {
  authenticateWallet: (walletType: string, walletAddress: string, blockchain: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export function useWalletAuth(): WalletAuthState & WalletAuthActions {
  const [state, setState] = useState<WalletAuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    sessionToken: localStorage.getItem('wallet_session_token'),
    walletInfo: null
  });
  
  const { toast } = useToast();

  const checkAuthStatus = useCallback(async () => {
    const sessionToken = localStorage.getItem('wallet_session_token');
    
    if (!sessionToken) {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      return;
    }

    try {
      const response = await fetch('/api/auth/status', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          user: data.user,
          sessionToken,
          walletInfo: {
            address: data.session.walletAddress,
            blockchain: data.session.blockchain,
            verified: true
          }
        }));
      } else {
        localStorage.removeItem('wallet_session_token');
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          sessionToken: null,
          user: null,
          walletInfo: null
        }));
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const authenticateWallet = async (walletType: string, walletAddress: string, blockchain: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Step 1: Get authentication nonce
      const nonceResponse = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, blockchain })
      });

      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication nonce');
      }

      const { nonce, message } = await nonceResponse.json();

      // Step 2: Sign the message with the user's wallet
      let signature: string;
      
      switch (walletType.toLowerCase()) {
        case 'metamask':
        case 'ethereum':
          if (!window.ethereum) {
            throw new Error('MetaMask not detected');
          }
          signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress]
          });
          break;

        case 'phantom':
        case 'solana':
          if (!window.solana || !window.solana.isPhantom) {
            throw new Error('Phantom wallet not detected');
          }
          const encodedMessage = new TextEncoder().encode(message);
          const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
          signature = Array.from(signedMessage.signature).map(b => b.toString(16).padStart(2, '0')).join('');
          break;

        case 'tonkeeper':
        case 'ton':
          // For TON, we'll use a simplified approach for now
          signature = `ton_signature_${Date.now()}`;
          break;

        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      // Step 3: Verify signature and create session
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          blockchain,
          signature,
          message,
          nonce
        })
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const authData = await verifyResponse.json();

      // Store session token
      localStorage.setItem('wallet_session_token', authData.sessionToken);

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: authData.user,
        sessionToken: authData.sessionToken,
        walletInfo: authData.walletInfo
      });

      toast({
        title: "Authentication Successful",
        description: `Connected to ${blockchain} wallet successfully`,
      });

      return true;
    } catch (error) {
      console.error('Wallet authentication failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "Failed to authenticate wallet",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const logout = async () => {
    const sessionToken = localStorage.getItem('wallet_session_token');
    
    if (sessionToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    localStorage.removeItem('wallet_session_token');
    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      sessionToken: null,
      walletInfo: null
    });

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    ...state,
    authenticateWallet,
    logout,
    checkAuthStatus
  };
}

// Extend window types for wallet detection
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}