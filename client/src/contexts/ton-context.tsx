import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  tonService, 
  TonConnectionStatus, 
  TONWalletInfo 
} from '@/lib/ton/ton-service';

interface TonContextType {
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: TONWalletInfo | null;
  connectionStatus: TonConnectionStatus;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  sendTON: (toAddress: string, amount: string) => Promise<{ success: boolean; transactionHash?: string; error?: string }>;
  createVault: (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }) => Promise<{ success: boolean; vaultAddress?: string; error?: string }>;
}

const TonContext = createContext<TonContextType | null>(null);

// Define hook for using TON context
export const useTon = (): TonContextType => {
  const context = useContext(TonContext);
  if (!context) {
    throw new Error('useTon must be used within a TonProvider');
  }
  return context;
}

interface TonProviderProps {
  children: ReactNode;
}

export const TonProvider: React.FC<TonProviderProps> = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState<TonConnectionStatus>(TonConnectionStatus.DISCONNECTED);
  const [walletInfo, setWalletInfo] = useState<TONWalletInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initTon = async () => {
      try {
        await tonService.initialize();
        setConnectionStatus(tonService.getConnectionStatus());
        setWalletInfo(tonService.getWalletInfo());
      } catch (error) {
        console.error("Failed to initialize TON service:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initTon();

    // Setup the interval to check wallet status
    const intervalId = setInterval(() => {
      setConnectionStatus(tonService.getConnectionStatus());
      setWalletInfo(tonService.getWalletInfo());
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Connect to TON wallet
  const connect = async (): Promise<boolean> => {
    setConnectionStatus(TonConnectionStatus.CONNECTING);
    try {
      const connected = await tonService.connect();
      setConnectionStatus(tonService.getConnectionStatus());
      setWalletInfo(tonService.getWalletInfo());
      return connected;
    } catch (error) {
      setConnectionStatus(TonConnectionStatus.DISCONNECTED);
      return false;
    }
  };

  // Disconnect from TON wallet
  const disconnect = async (): Promise<boolean> => {
    try {
      const disconnected = await tonService.disconnect();
      setConnectionStatus(TonConnectionStatus.DISCONNECTED);
      setWalletInfo(null);
      return disconnected;
    } catch (error) {
      return false;
    }
  };

  // Send TON tokens
  const sendTON = async (toAddress: string, amount: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    try {
      const result = await tonService.sendTON(toAddress, amount);
      // Refresh wallet info after transaction
      setWalletInfo(tonService.getWalletInfo());
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send TON' };
    }
  };

  // Create time-locked vault
  const createVault = async (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; error?: string }> => {
    try {
      const result = await tonService.createVault(params);
      // Refresh wallet info after vault creation
      setWalletInfo(tonService.getWalletInfo());
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create vault' };
    }
  };

  const contextValue: TonContextType = {
    isConnected: connectionStatus === TonConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === TonConnectionStatus.CONNECTING || isInitializing,
    walletInfo,
    connectionStatus,
    connect,
    disconnect,
    sendTON,
    createVault,
  };

  return (
    <TonContext.Provider value={contextValue}>
      {children}
    </TonContext.Provider>
  );
};