/**
 * User Wallets Hook
 * 
 * Manages user wallet connections across multiple blockchains
 */

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface WalletConnection {
  address: string;
  blockchain: string;
  walletType: string;
  connected: boolean;
  authorized: boolean;
}

export function useUserWallets() {
  const [connectedWallets, setConnectedWallets] = useState<WalletConnection[]>([]);

  // Query for wallet connections
  const { data: wallets, isLoading } = useQuery({
    queryKey: ['/api/wallets/connected'],
    queryFn: async () => {
      // Return empty array for now - this will be populated by actual wallet connections
      return [];
    },
  });

  const getWalletAddress = (blockchain?: string) => {
    if (!blockchain) {
      return connectedWallets[0]?.address || null;
    }
    
    const wallet = connectedWallets.find(w => 
      w.blockchain.toLowerCase() === blockchain.toLowerCase() && w.connected
    );
    
    return wallet?.address || null;
  };

  const getConnectedWallet = (blockchain: string) => {
    return connectedWallets.find(w => 
      w.blockchain.toLowerCase() === blockchain.toLowerCase() && w.connected
    );
  };

  const isWalletConnected = (blockchain?: string) => {
    if (!blockchain) {
      return connectedWallets.some(w => w.connected);
    }
    
    return connectedWallets.some(w => 
      w.blockchain.toLowerCase() === blockchain.toLowerCase() && w.connected
    );
  };

  const addWallet = (wallet: WalletConnection) => {
    setConnectedWallets(prev => {
      const existing = prev.findIndex(w => 
        w.blockchain === wallet.blockchain && w.walletType === wallet.walletType
      );
      
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = wallet;
        return updated;
      }
      
      return [...prev, wallet];
    });
  };

  const removeWallet = (blockchain: string, walletType: string) => {
    setConnectedWallets(prev => 
      prev.filter(w => !(w.blockchain === blockchain && w.walletType === walletType))
    );
  };

  useEffect(() => {
    if (wallets) {
      setConnectedWallets(wallets);
    }
  }, [wallets]);

  return {
    connectedWallets,
    getWalletAddress,
    getConnectedWallet,
    isWalletConnected,
    addWallet,
    removeWallet,
    isLoading
  };
}