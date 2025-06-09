import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';

export interface WalletInfo {
  address: string;
  chainId: number | string;
  type: 'ethereum' | 'ton' | 'solana' | 'bitcoin';
  publicKey?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  authError: Error | null;
  wallet: WalletInfo | null;
  user: {
    id: number;
    username: string;
    walletAddress: string;
    email?: string;
  } | null;
  connectWallet: (type: 'ethereum' | 'ton' | 'solana' | 'bitcoin') => Promise<boolean>;
  disconnectWallet: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const walletAuth = useWalletAuth();
  const [authError, setAuthError] = useState<Error | null>(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Update wallet info when wallet auth changes
  useEffect(() => {
    if (walletAuth.isAuthenticated && walletAuth.walletInfo) {
      setWallet({
        address: walletAuth.walletInfo.address,
        chainId: walletAuth.walletInfo.blockchain === 'ethereum' ? 1 : 
                 walletAuth.walletInfo.blockchain === 'solana' ? 'mainnet-beta' : 'mainnet',
        type: walletAuth.walletInfo.blockchain as 'ethereum' | 'ton' | 'solana' | 'bitcoin',
        publicKey: walletAuth.walletInfo.address
      });
    } else {
      setWallet(null);
    }
  }, [walletAuth.isAuthenticated, walletAuth.walletInfo]);

  // Connect to a blockchain wallet
  const connectWallet = async (type: 'ethereum' | 'ton' | 'solana' | 'bitcoin'): Promise<boolean> => {
    setShowAuthModal(true);
    return false; // Modal will handle the actual connection
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    walletAuth.logout();
    setWallet(null);
    setAuthError(null);
  };

  const value: AuthContextType = {
    isAuthenticated: walletAuth.isAuthenticated,
    isAuthenticating: walletAuth.isLoading,
    authError,
    wallet,
    user: walletAuth.user,
    connectWallet,
    disconnectWallet,
    showAuthModal,
    setShowAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}