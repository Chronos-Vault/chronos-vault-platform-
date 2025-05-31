import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ethereumService, 
  EthereumConnectionState, 
  VaultCreationParams,
  TransactionResponse,
  VaultCreationResponse 
} from '@/lib/ethereum/ethereum-service';

// Available Ethereum networks
type EthereumNetwork = 'mainnet' | 'goerli' | 'sepolia';

// Ethereum wallet info
export interface EthereumWalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

// Connection status
export type EthereumConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// Context type
interface EthereumContextType {
  isConnected: boolean;
  isConnecting: boolean;
  isDevelopmentMode: boolean;
  walletInfo: EthereumWalletInfo | null;
  connectionStatus: EthereumConnectionStatus;
  availableNetworks: { id: string; name: string; chainId: number }[];
  currentNetwork: EthereumNetwork;
  walletAddress: string;
  account: string | null;
  
  // Methods
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  
  sendETH: (toAddress: string, amount: string) => Promise<{ 
    success: boolean; 
    transactionHash?: string; 
    error?: string 
  }>;
  
  createVault: (params: VaultCreationParams) => Promise<{ 
    success: boolean; 
    vaultAddress?: string; 
    error?: string 
  }>;
  
  switchNetwork: (network: EthereumNetwork) => Promise<boolean>;
  
  // Error handling
  error: string | null;
}

// Create the context
const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

// Provider props
interface EthereumProviderProps {
  children: ReactNode;
}

/**
 * Ethereum Provider Component
 */
export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
  // State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionState, setConnectionState] = useState<EthereumConnectionState>(
    ethereumService.getConnectionState()
  );
  const [currentNetwork, setCurrentNetwork] = useState<EthereumNetwork>('sepolia'); // Default to Sepolia testnet for development
  const [availableNetworks, setAvailableNetworks] = useState<{ id: string; name: string; chainId: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize
  useEffect(() => {
    // Get available networks
    const networks = ethereumService.getAvailableNetworks();
    setAvailableNetworks(networks);
    
    // Check if MetaMask is already connected
    checkConnection();
    
    // Setup listeners
    const intervalId = setInterval(() => {
      updateConnectionState();
    }, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  
  // Check if already connected
  const checkConnection = async () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      try {
        setIsConnecting(true);
        const success = await ethereumService.connect();
        if (success) {
          updateConnectionState();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      } finally {
        setIsConnecting(false);
      }
    }
  };
  
  // Update connection state
  const updateConnectionState = () => {
    const state = ethereumService.getConnectionState();
    setConnectionState(state);
    
    if (state.error) {
      setError(state.error);
    } else {
      setError(null);
    }
  };
  
  // Derive wallet info from connection state
  const getWalletInfo = (): EthereumWalletInfo | null => {
    if (!connectionState.isConnected || !connectionState.address) {
      return null;
    }
    
    return {
      address: connectionState.address,
      balance: connectionState.balance || '0',
      network: connectionState.networkName || 'Unknown',
      chainId: connectionState.chainId || 0
    };
  };
  
  // Connect to Ethereum
  const connect = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const success = await ethereumService.connect();
      updateConnectionState();
      return success;
    } catch (err: any) {
      console.error('Error connecting to Ethereum:', err);
      setError(err.message || 'Failed to connect to Ethereum');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Disconnect from Ethereum
  const disconnect = async (): Promise<boolean> => {
    try {
      const success = ethereumService.disconnect();
      updateConnectionState();
      return success;
    } catch (err: any) {
      console.error('Error disconnecting from Ethereum:', err);
      setError(err.message || 'Failed to disconnect from Ethereum');
      return false;
    }
  };
  
  // Send ETH
  const sendETH = async (
    toAddress: string, 
    amount: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    try {
      setError(null);
      return await ethereumService.sendETH(toAddress, amount);
    } catch (err: any) {
      console.error('Error sending ETH:', err);
      setError(err.message || 'Failed to send ETH');
      return { success: false, error: err.message || 'Unknown error' };
    }
  };
  
  // Create vault
  const createVault = async (
    params: VaultCreationParams
  ): Promise<{ success: boolean; vaultAddress?: string; error?: string }> => {
    try {
      setError(null);
      return await ethereumService.createVault(params);
    } catch (err: any) {
      console.error('Error creating vault:', err);
      setError(err.message || 'Failed to create vault');
      return { success: false, error: err.message || 'Unknown error' };
    }
  };
  
  // Switch network
  const switchNetwork = async (network: EthereumNetwork): Promise<boolean> => {
    try {
      setError(null);
      const success = await ethereumService.switchNetwork(network);
      
      if (success) {
        setCurrentNetwork(network);
        updateConnectionState();
      }
      
      return success;
    } catch (err: any) {
      console.error('Error switching network:', err);
      setError(err.message || 'Failed to switch network');
      return false;
    }
  };
  
  // Get connection status
  const getConnectionStatus = (): EthereumConnectionStatus => {
    if (isConnecting) return 'connecting';
    if (connectionState.error) return 'error';
    if (connectionState.isConnected) return 'connected';
    return 'disconnected';
  };
  
  // Context value
  const contextValue: EthereumContextType = {
    isConnected: connectionState.isConnected,
    isConnecting,
    isDevelopmentMode: connectionState.developmentMode || false,
    walletInfo: getWalletInfo(),
    connectionStatus: getConnectionStatus(),
    availableNetworks,
    currentNetwork,
    walletAddress: getWalletInfo()?.address || '',
    account: getWalletInfo()?.address || null,
    connect,
    disconnect,
    sendETH,
    createVault,
    switchNetwork,
    error
  };
  
  return (
    <EthereumContext.Provider value={contextValue}>
      {children}
    </EthereumContext.Provider>
  );
};

/**
 * Custom hook to use the Ethereum context
 */
export function useEthereum(): EthereumContextType {
  const context = useContext(EthereumContext);
  
  if (context === undefined) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  
  return context;
}