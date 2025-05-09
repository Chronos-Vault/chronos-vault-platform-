/**
 * User Wallets Hook
 * 
 * This hook provides access to the user's connected blockchain wallets
 * and related functionality.
 */

import { useState, useEffect, useCallback } from 'react';
import { BlockchainType } from '../types/blockchain.types';

interface UseUserWalletsResult {
  connectedWallets: BlockchainType[];
  getWalletAddress: (chain: BlockchainType) => string | null;
  isWalletConnected: (chain: BlockchainType) => boolean;
  connectWallet: (chain: BlockchainType) => Promise<boolean>;
  disconnectWallet: (chain: BlockchainType) => Promise<void>;
}

export function useUserWallets(): UseUserWalletsResult {
  // In a real implementation, these would come from stores or contexts
  // that manage wallet connections. For this demo, we'll use a simplified
  // version that simulates wallet connections in development mode.
  
  const [connectedWallets, setConnectedWallets] = useState<BlockchainType[]>([]);
  
  // Simulated wallet addresses for development mode
  const walletAddresses: Record<BlockchainType, string> = {
    'ETH': '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    'SOL': '9kcaMKQZTeELZvhiGPJYLTCrNyQrbbrV6ys8BqhWB2XK',
    'TON': 'EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb',
    'BTC': 'bc1q7m7vxavfjgzr57pwuk0kq5qfkrxzr609ua8a3c'
  };
  
  // Initialize with connected wallets from localStorage or set development mode wallets
  useEffect(() => {
    const isDevelopmentMode = true; // In a real app, check from a context or env var
    
    if (isDevelopmentMode) {
      // In development mode, simulate all wallets are connected
      setConnectedWallets(['ETH', 'SOL', 'TON', 'BTC']);
    } else {
      // In production, load connected wallets from localStorage
      const savedWallets = localStorage.getItem('connectedWallets');
      if (savedWallets) {
        try {
          const parsed = JSON.parse(savedWallets) as BlockchainType[];
          setConnectedWallets(parsed);
        } catch (e) {
          console.error('Failed to parse connected wallets from localStorage');
        }
      }
    }
  }, []);
  
  // Get a wallet address for a specific blockchain
  const getWalletAddress = useCallback((chain: BlockchainType): string | null => {
    if (!connectedWallets.includes(chain)) {
      return null;
    }
    
    // In a real implementation, these would be fetched from the corresponding
    // wallet providers or contexts. Here we return simulated addresses.
    return walletAddresses[chain];
  }, [connectedWallets]);
  
  // Check if a specific wallet is connected
  const isWalletConnected = useCallback((chain: BlockchainType): boolean => {
    return connectedWallets.includes(chain);
  }, [connectedWallets]);
  
  // Connect a wallet for a specific blockchain
  const connectWallet = useCallback(async (chain: BlockchainType): Promise<boolean> => {
    // In a real implementation, this would trigger the wallet connection flow
    // for the specific blockchain. Here we simulate a successful connection.
    
    if (!connectedWallets.includes(chain)) {
      const newConnectedWallets = [...connectedWallets, chain];
      setConnectedWallets(newConnectedWallets);
      
      // Save to localStorage in a real implementation
      localStorage.setItem('connectedWallets', JSON.stringify(newConnectedWallets));
    }
    
    return true;
  }, [connectedWallets]);
  
  // Disconnect a wallet for a specific blockchain
  const disconnectWallet = useCallback(async (chain: BlockchainType): Promise<void> => {
    // In a real implementation, this would disconnect the wallet
    // for the specific blockchain. Here we simulate disconnection.
    
    const newConnectedWallets = connectedWallets.filter(c => c !== chain);
    setConnectedWallets(newConnectedWallets);
    
    // Save to localStorage in a real implementation
    localStorage.setItem('connectedWallets', JSON.stringify(newConnectedWallets));
  }, [connectedWallets]);
  
  return {
    connectedWallets,
    getWalletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet
  };
}