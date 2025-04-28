import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletFactory } from '../lib/wallet/wallet-factory';
import { 
  BlockchainType, 
  WalletConnectionStatus, 
  WalletInfo,
  NetworkType,
  TransactionResult,
  VaultCreationResult,
  CreateVaultParams
} from '../lib/wallet/types';

interface WalletContextType {
  // Current state
  currentBlockchain: BlockchainType;
  connectionStatus: WalletConnectionStatus;
  walletInfo: WalletInfo | null;
  supportedBlockchains: BlockchainType[];
  
  // Actions
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  switchBlockchain: (blockchain: BlockchainType) => void;
  switchNetwork: (network: NetworkType) => void;
  
  // Transactions
  sendTransaction: (params: any) => Promise<TransactionResult>;
  createVault: (params: CreateVaultParams) => Promise<VaultCreationResult>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [currentBlockchain, setCurrentBlockchain] = useState<BlockchainType>(
    walletFactory.getCurrentBlockchain()
  );
  const [connectionStatus, setConnectionStatus] = useState<WalletConnectionStatus>(
    WalletConnectionStatus.DISCONNECTED
  );
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [supportedBlockchains, setSupportedBlockchains] = useState<BlockchainType[]>(
    walletFactory.getSupportedBlockchains()
  );

  // Update connection status and wallet info when blockchain changes
  useEffect(() => {
    const updateWalletState = () => {
      const provider = walletFactory.getProvider(currentBlockchain);
      if (!provider) {
        setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
        setWalletInfo(null);
        return;
      }

      setConnectionStatus(provider.getConnectionStatus());
      setWalletInfo(provider.getWalletInfo());
    };

    updateWalletState();

    // Poll for updates
    const interval = setInterval(updateWalletState, 5000);
    
    return () => clearInterval(interval);
  }, [currentBlockchain]);

  // Connect to the current wallet
  const connect = async (): Promise<boolean> => {
    try {
      setConnectionStatus(WalletConnectionStatus.CONNECTING);
      
      const provider = walletFactory.getProvider(currentBlockchain);
      if (!provider) {
        setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
        return false;
      }
      
      const success = await provider.connect();
      
      if (success) {
        setConnectionStatus(provider.getConnectionStatus());
        setWalletInfo(provider.getWalletInfo());
      } else {
        setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
      }
      
      return success;
    } catch (error) {
      console.error(`Failed to connect to ${currentBlockchain} wallet:`, error);
      setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
      return false;
    }
  };

  // Disconnect from the current wallet
  const disconnect = async (): Promise<boolean> => {
    try {
      const provider = walletFactory.getProvider(currentBlockchain);
      if (!provider) return false;
      
      const success = await provider.disconnect();
      
      if (success) {
        setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
        setWalletInfo(null);
      }
      
      return success;
    } catch (error) {
      console.error(`Failed to disconnect from ${currentBlockchain} wallet:`, error);
      return false;
    }
  };

  // Switch to a different blockchain
  const switchBlockchain = (blockchain: BlockchainType): void => {
    if (!walletFactory.isBlockchainSupported(blockchain)) {
      console.error(`Blockchain ${blockchain} is not supported`);
      return;
    }
    
    setCurrentBlockchain(blockchain);
    walletFactory.setCurrentBlockchain(blockchain);
    
    // Update connection status and wallet info
    const provider = walletFactory.getProvider(blockchain);
    if (provider) {
      setConnectionStatus(provider.getConnectionStatus());
      setWalletInfo(provider.getWalletInfo());
    } else {
      setConnectionStatus(WalletConnectionStatus.DISCONNECTED);
      setWalletInfo(null);
    }
  };

  // Switch network for the current blockchain
  const switchNetwork = (network: NetworkType): void => {
    const provider = walletFactory.getProvider(currentBlockchain);
    if (!provider) return;
    
    provider.switchNetwork(network);
    
    // Update wallet info
    setWalletInfo(provider.getWalletInfo());
  };

  // Send a transaction on the current blockchain
  const sendTransaction = async (params: any): Promise<TransactionResult> => {
    const provider = walletFactory.getProvider(currentBlockchain);
    if (!provider) {
      return { 
        success: false, 
        error: `No provider available for ${currentBlockchain}` 
      };
    }
    
    if (provider.getConnectionStatus() !== WalletConnectionStatus.CONNECTED) {
      return { 
        success: false, 
        error: `Not connected to ${currentBlockchain} wallet` 
      };
    }
    
    try {
      const result = await provider.sendTransaction(params);
      
      // Update wallet info after transaction
      setWalletInfo(provider.getWalletInfo());
      
      return result;
    } catch (error: any) {
      console.error(`Failed to send transaction on ${currentBlockchain}:`, error);
      return { 
        success: false, 
        error: error.message || `Unknown error occurred when sending transaction on ${currentBlockchain}` 
      };
    }
  };

  // Create a vault on the current blockchain
  const createVault = async (params: CreateVaultParams): Promise<VaultCreationResult> => {
    const provider = walletFactory.getProvider(currentBlockchain);
    if (!provider) {
      return { 
        success: false, 
        error: `No provider available for ${currentBlockchain}` 
      };
    }
    
    if (provider.getConnectionStatus() !== WalletConnectionStatus.CONNECTED) {
      return { 
        success: false, 
        error: `Not connected to ${currentBlockchain} wallet` 
      };
    }
    
    try {
      const result = await provider.createVault(params);
      
      // Update wallet info after vault creation
      setWalletInfo(provider.getWalletInfo());
      
      return result;
    } catch (error: any) {
      console.error(`Failed to create vault on ${currentBlockchain}:`, error);
      return { 
        success: false, 
        error: error.message || `Unknown error occurred when creating vault on ${currentBlockchain}` 
      };
    }
  };

  const contextValue: WalletContextType = {
    currentBlockchain,
    connectionStatus,
    walletInfo,
    supportedBlockchains,
    connect,
    disconnect,
    switchBlockchain,
    switchNetwork,
    sendTransaction,
    createVault
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};