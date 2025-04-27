import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { tonService, TonConnectionStatus } from '@/lib/ton/ton-service';
import { useToast } from '@/hooks/use-toast';

interface TONWalletInfo {
  address: string;
  balance: string;
  network: string;
  publicKey?: string;
}

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

const TonContext = createContext<TonContextType | undefined>(undefined);

export const useTon = () => {
  const context = useContext(TonContext);
  if (context === undefined) {
    throw new Error('useTon must be used within a TonProvider');
  }
  return context;
};

interface TonProviderProps {
  children: ReactNode;
}

export const TonProvider: React.FC<TonProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<TonConnectionStatus>(TonConnectionStatus.DISCONNECTED);
  const [walletInfo, setWalletInfo] = useState<TONWalletInfo | null>(null);
  
  // Initialize TON service
  useEffect(() => {
    const initService = async () => {
      try {
        await tonService.initialize();
        setConnectionStatus(tonService.getConnectionStatus());
        setWalletInfo(tonService.getWalletInfo());
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize TON service:', error);
        toast({
          title: 'TON Initialization Failed',
          description: 'Could not initialize TON wallet service. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    
    initService();
    
    // Poll for wallet updates
    const interval = setInterval(() => {
      setConnectionStatus(tonService.getConnectionStatus());
      setWalletInfo(tonService.getWalletInfo());
    }, 3000);
    
    return () => clearInterval(interval);
  }, [toast]);
  
  const connect = async (): Promise<boolean> => {
    try {
      const success = await tonService.connect();
      if (success) {
        setConnectionStatus(TonConnectionStatus.CONNECTED);
        setWalletInfo(tonService.getWalletInfo());
        toast({
          title: 'TON Wallet Connected',
          description: 'Successfully connected to TON wallet.',
          variant: 'default',
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to connect TON wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to TON wallet. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const disconnect = async (): Promise<boolean> => {
    try {
      const success = await tonService.disconnect();
      if (success) {
        setConnectionStatus(TonConnectionStatus.DISCONNECTED);
        setWalletInfo(null);
        toast({
          title: 'TON Wallet Disconnected',
          description: 'Successfully disconnected from TON wallet.',
          variant: 'default',
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to disconnect TON wallet:', error);
      return false;
    }
  };
  
  const sendTON = async (toAddress: string, amount: string) => {
    try {
      const result = await tonService.sendTON(toAddress, amount);
      if (result.success) {
        toast({
          title: 'Transaction Successful',
          description: `Successfully sent ${amount} TON to ${toAddress.substring(0, 6)}...${toAddress.substring(toAddress.length - 4)}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Transaction Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
      return result;
    } catch (error: any) {
      console.error('Failed to send TON:', error);
      toast({
        title: 'Transaction Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  };
  
  const createVault = async (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }) => {
    try {
      const result = await tonService.createVault(params);
      if (result.success) {
        toast({
          title: 'Vault Created',
          description: `Successfully created a TON vault that unlocks on ${new Date(params.unlockTime * 1000).toLocaleDateString()}`,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Vault Creation Failed',
          description: result.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
      return result;
    } catch (error: any) {
      console.error('Failed to create TON vault:', error);
      toast({
        title: 'Vault Creation Failed',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  };
  
  const contextValue: TonContextType = {
    isConnected: connectionStatus === TonConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === TonConnectionStatus.CONNECTING,
    walletInfo,
    connectionStatus,
    connect,
    disconnect,
    sendTON,
    createVault
  };
  
  if (!isInitialized) {
    return <>{children}</>; // Render children while initializing
  }
  
  return (
    <TonContext.Provider value={contextValue}>
      {children}
    </TonContext.Provider>
  );
};