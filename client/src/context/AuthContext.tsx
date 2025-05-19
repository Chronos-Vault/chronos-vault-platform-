import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  connectWallet: (type: 'ethereum' | 'ton' | 'solana' | 'bitcoin') => Promise<boolean>;
  disconnectWallet: () => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);

  // Check for existing authentication on component mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // Check for stored wallet info in localStorage or sessionStorage
        const storedWalletInfo = localStorage.getItem('walletInfo');
        
        if (storedWalletInfo) {
          const parsedWalletInfo = JSON.parse(storedWalletInfo) as WalletInfo;
          setWallet(parsedWalletInfo);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to restore authentication:', error);
        // Clear potentially corrupted auth data
        localStorage.removeItem('walletInfo');
      }
    };
    
    checkExistingAuth();
  }, []);

  // Connect to a blockchain wallet
  const connectWallet = async (type: 'ethereum' | 'ton' | 'solana' | 'bitcoin'): Promise<boolean> => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      // In a real implementation, this would use the blockchain services to connect to real wallets
      // For development purposes, we simulate a connection
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let mockWalletInfo: WalletInfo;
      
      switch (type) {
        case 'ethereum':
          mockWalletInfo = {
            address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            chainId: 1,
            type: 'ethereum'
          };
          break;
        case 'ton':
          mockWalletInfo = {
            address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
            chainId: 'mainnet',
            type: 'ton'
          };
          break;
        case 'solana':
          mockWalletInfo = {
            address: '8xpmcLdq9F3JfpVwZBBpdeM8F7SdxKiWiKmBE1JFQPx6',
            chainId: 'mainnet-beta',
            type: 'solana',
            publicKey: '8xpmcLdq9F3JfpVwZBBpdeM8F7SdxKiWiKmBE1JFQPx6'
          };
          break;
        case 'bitcoin':
          mockWalletInfo = {
            address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            chainId: 'mainnet',
            type: 'bitcoin'
          };
          break;
        default:
          throw new Error(`Unsupported wallet type: ${type}`);
      }
      
      // Store wallet info in localStorage
      localStorage.setItem('walletInfo', JSON.stringify(mockWalletInfo));
      
      setWallet(mockWalletInfo);
      setIsAuthenticated(true);
      setIsAuthenticating(false);
      
      return true;
    } catch (error) {
      console.error(`Failed to connect ${type} wallet:`, error);
      setAuthError(error instanceof Error ? error : new Error(`Failed to connect ${type} wallet`));
      setIsAuthenticating(false);
      return false;
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    localStorage.removeItem('walletInfo');
    setWallet(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isAuthenticating,
    authError,
    wallet,
    connectWallet,
    disconnectWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}