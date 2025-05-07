import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { solanaService } from '../lib/solana/solana-service';
import { SolanaConnectionStatus, SolanaWalletInfo, SolanaCluster } from '../types/solana';

interface SolanaWallet {
  name: string;
  adapter: any;
}

interface SolanaContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: SolanaWalletInfo | null;
  connectionStatus: SolanaConnectionStatus;
  availableWallets: SolanaWallet[];
  connect: (walletName?: string) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  sendSOL: (toAddress: string, amount: string) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
  createVault: (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }) => Promise<{ success: boolean; vaultAddress?: string; error?: string }>;
  switchNetwork: (cluster: SolanaCluster) => void;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export function useSolana(): SolanaContextType {
  const context = useContext(SolanaContext);
  if (!context) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
}

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<SolanaConnectionStatus>(SolanaConnectionStatus.DISCONNECTED);
  const [walletInfo, setWalletInfo] = useState<SolanaWalletInfo | null>(null);
  const [availableWallets, setAvailableWallets] = useState<SolanaWallet[]>([]);
  
  // Initialize available wallets on component mount
  useEffect(() => {
    const wallets = solanaService.getAvailableWallets();
    setAvailableWallets(wallets);
    
    // Check for wallet changes (like extension install/uninstall)
    const walletCheckInterval = setInterval(() => {
      const currentWallets = solanaService.getAvailableWallets();
      if (currentWallets.length !== availableWallets.length) {
        setAvailableWallets(currentWallets);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(walletCheckInterval);
  }, []);

  // Poll for updates to wallet info
  useEffect(() => {
    if (connectionStatus === SolanaConnectionStatus.CONNECTED) {
      const interval = setInterval(() => {
        const currentWalletInfo = solanaService.getWalletInfo();
        if (currentWalletInfo) {
          setWalletInfo(currentWalletInfo);
        }
      }, 10000); // Poll every 10 seconds

      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const connect = async (walletName?: string): Promise<boolean> => {
    try {
      setConnectionStatus(SolanaConnectionStatus.CONNECTING);
      const success = await solanaService.connect(walletName);
      
      if (success) {
        setConnectionStatus(SolanaConnectionStatus.CONNECTED);
        setWalletInfo(solanaService.getWalletInfo());
      } else {
        setConnectionStatus(SolanaConnectionStatus.DISCONNECTED);
      }
      
      return success;
    } catch (error) {
      console.error("Failed to connect to Solana wallet:", error);
      setConnectionStatus(SolanaConnectionStatus.DISCONNECTED);
      return false;
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      const success = await solanaService.disconnect();
      
      if (success) {
        setConnectionStatus(SolanaConnectionStatus.DISCONNECTED);
        setWalletInfo(null);
      }
      
      return success;
    } catch (error) {
      console.error("Failed to disconnect Solana wallet:", error);
      return false;
    }
  };

  const sendSOL = async (
    toAddress: string,
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    try {
      const result = await solanaService.sendSOL(toAddress, amount);
      
      // Update wallet info if transaction was successful
      if (result.success) {
        setWalletInfo(solanaService.getWalletInfo());
      }
      
      return result;
    } catch (error: any) {
      console.error("Error sending SOL:", error);
      return { success: false, error: error.message || "Unknown error occurred" };
    }
  };

  const createVault = async (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> => {
    try {
      const result = await solanaService.createVault(params);
      
      // Update wallet info if vault creation was successful
      if (result.success) {
        setWalletInfo(solanaService.getWalletInfo());
      }
      
      return result;
    } catch (error: any) {
      console.error("Error creating Solana vault:", error);
      return { success: false, error: error.message || "Unknown error occurred" };
    }
  };

  const switchNetwork = (cluster: SolanaCluster): void => {
    solanaService.setCluster(cluster);
    
    // If connected, update wallet info for the new network
    if (connectionStatus === SolanaConnectionStatus.CONNECTED) {
      setWalletInfo(solanaService.getWalletInfo());
    }
  };

  const contextValue: SolanaContextType = {
    isConnected: connectionStatus === SolanaConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === SolanaConnectionStatus.CONNECTING,
    walletInfo,
    connectionStatus,
    availableWallets,
    connect,
    disconnect,
    sendSOL,
    createVault,
    switchNetwork
  };

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
};