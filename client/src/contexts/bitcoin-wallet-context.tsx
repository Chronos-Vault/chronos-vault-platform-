import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BitcoinWalletConnector, BitcoinWalletInfo } from '@/lib/bitcoin/bitcoin-wallet-connector';
import { useDevMode } from './dev-mode-context';
import { toast } from '@/hooks/use-toast';

// Context type definition
interface BitcoinWalletContextType {
  walletInfo: BitcoinWalletInfo | null;
  isConnecting: boolean;
  isConnected: boolean;
  connectWallet: (provider?: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletInfo: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (receiverAddress: string, amountBTC: number) => Promise<string>;
  availableProviders: string[];
}

// Create the context
const BitcoinWalletContext = createContext<BitcoinWalletContextType | undefined>(undefined);

// Props interface
interface BitcoinWalletProviderProps {
  children: ReactNode;
}

// Bitcoin wallet provider component
export function BitcoinWalletProvider({ children }: BitcoinWalletProviderProps) {
  const [walletInfo, setWalletInfo] = useState<BitcoinWalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const { devModeEnabled } = useDevMode();
  
  // Get wallet connector instance
  const walletConnector = BitcoinWalletConnector.getInstance();
  
  // Initialize and set up listeners
  useEffect(() => {
    // Handle wallet changes from connector
    const handleWalletChange = (info: BitcoinWalletInfo | null) => {
      setWalletInfo(info);
    };
    
    // Subscribe to wallet changes
    walletConnector.subscribe(handleWalletChange);
    
    // Initial check for available providers
    updateAvailableProviders();
    
    // Set up interval to check for available providers
    const providerCheckInterval = setInterval(updateAvailableProviders, 2000);
    
    // If dev mode is enabled, create a mock wallet
    if (devModeEnabled && !walletInfo) {
      setWalletInfo({
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        balance: 1.25,
        network: 'testnet',
        isConnected: true
      });
    }
    
    // Cleanup function
    return () => {
      walletConnector.unsubscribe(handleWalletChange);
      clearInterval(providerCheckInterval);
    };
  }, [devModeEnabled]);
  
  // Update available providers
  const updateAvailableProviders = () => {
    const providers = walletConnector.getAvailableProviders();
    if (JSON.stringify(providers) !== JSON.stringify(availableProviders)) {
      setAvailableProviders(providers);
    }
  };
  
  // Connect to wallet
  const connectWallet = async (provider: string = 'Unisat'): Promise<void> => {
    try {
      setIsConnecting(true);
      
      // If in dev mode, create mock wallet
      if (devModeEnabled) {
        setWalletInfo({
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          balance: 1.25,
          network: 'testnet',
          isConnected: true
        });
        return;
      }
      
      // Otherwise connect to actual wallet
      await walletConnector.connect(provider);
      
      toast({
        title: 'Wallet connected',
        description: `Successfully connected to ${provider} wallet`,
      });
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      
      toast({
        title: 'Connection failed',
        description: error instanceof Error ? error.message : 'Failed to connect to wallet',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = (): void => {
    walletConnector.disconnect();
    
    toast({
      title: 'Wallet disconnected',
      description: 'Your Bitcoin wallet has been disconnected',
    });
  };
  
  // Refresh wallet info
  const refreshWalletInfo = async (): Promise<void> => {
    try {
      if (devModeEnabled && walletInfo) {
        // In dev mode, simulate a balance update
        setWalletInfo({
          ...walletInfo,
          balance: Number((Math.random() * 2 + 0.5).toFixed(8))
        });
        return;
      }
      
      await walletConnector.refreshWalletInfo();
    } catch (error) {
      console.error('Error refreshing wallet info:', error);
      
      toast({
        title: 'Refresh failed',
        description: 'Could not update wallet information',
        variant: 'destructive',
      });
    }
  };
  
  // Sign message
  const signMessage = async (message: string): Promise<string> => {
    try {
      if (devModeEnabled) {
        // In dev mode, return a mock signature
        return 'MOCK_SIGNATURE_FOR_DEVELOPMENT_MODE_' + Date.now();
      }
      
      const signature = await walletConnector.signMessage(message);
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      
      toast({
        title: 'Signing failed',
        description: error instanceof Error ? error.message : 'Failed to sign message',
        variant: 'destructive',
      });
      
      throw error;
    }
  };
  
  // Send transaction
  const sendTransaction = async (receiverAddress: string, amountBTC: number): Promise<string> => {
    try {
      if (devModeEnabled) {
        // In dev mode, return a mock transaction ID
        return 'MOCK_TXID_' + Date.now();
      }
      
      const txid = await walletConnector.sendTransaction(receiverAddress, amountBTC);
      
      toast({
        title: 'Transaction sent',
        description: `Successfully sent ${amountBTC} BTC to ${receiverAddress.substring(0, 6)}...`,
      });
      
      return txid;
    } catch (error) {
      console.error('Error sending transaction:', error);
      
      toast({
        title: 'Transaction failed',
        description: error instanceof Error ? error.message : 'Failed to send transaction',
        variant: 'destructive',
      });
      
      throw error;
    }
  };
  
  // Create context value
  const contextValue: BitcoinWalletContextType = {
    walletInfo,
    isConnecting,
    isConnected: walletInfo?.isConnected || false,
    connectWallet,
    disconnectWallet,
    refreshWalletInfo,
    signMessage,
    sendTransaction,
    availableProviders,
  };
  
  return (
    <BitcoinWalletContext.Provider value={contextValue}>
      {children}
    </BitcoinWalletContext.Provider>
  );
}

// Custom hook to use the Bitcoin wallet context
export function useBitcoinWallet() {
  const context = useContext(BitcoinWalletContext);
  
  if (context === undefined) {
    throw new Error('useBitcoinWallet must be used within a BitcoinWalletProvider');
  }
  
  return context;
}