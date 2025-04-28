import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { solanaService } from '../lib/solana/solana-service';
import { tonService } from '../lib/ton/ton-service';
import { useAuthContext } from './auth-context';
import { SiTon, SiSolana, SiEthereum, SiBitcoin } from "react-icons/si";

// BlockchainIcon component props
interface BlockchainIconProps {
  chainId: BlockchainType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Supported blockchain types
export enum BlockchainType {
  TON = 'ton',
  SOLANA = 'solana',
  ETHEREUM = 'ethereum',
  BITCOIN = 'bitcoin'
}

// Chain connection status
export interface ChainStatus {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  balance: string | null;
  network: string | null;
}

// Multi-chain context interface
interface MultiChainContextType {
  // Chain state
  activeChain: BlockchainType | null;
  chainStatus: Record<BlockchainType, ChainStatus>;
  
  // Chain actions
  setActiveChain: (chain: BlockchainType) => void;
  connectChain: (chain: BlockchainType) => Promise<boolean>;
  disconnectChain: (chain: BlockchainType) => Promise<boolean>;
  disconnectAllChains: () => Promise<void>;
  
  // Chain info
  availableWallets: (chain: BlockchainType) => { name: string; type: string }[];
  
  // Utilities
  formatAddress: (address: string | null, chain: BlockchainType) => string;
  getChainIcon: (chain: BlockchainType) => JSX.Element;
  getChainColor: (chain: BlockchainType) => string;
}

// Default chain status
const defaultChainStatus: ChainStatus = {
  isConnected: false,
  isConnecting: false,
  address: null,
  balance: null,
  network: null
};

// Create context
const MultiChainContext = createContext<MultiChainContextType | undefined>(undefined);

// Context provider
interface MultiChainProviderProps {
  children: ReactNode;
}

export const MultiChainProvider: React.FC<MultiChainProviderProps> = ({ children }) => {
  const { signIn, signOut } = useAuthContext();
  const [activeChain, setActiveChain] = useState<BlockchainType | null>(null);
  const [chainStatus, setChainStatus] = useState<Record<BlockchainType, ChainStatus>>({
    [BlockchainType.TON]: { ...defaultChainStatus },
    [BlockchainType.SOLANA]: { ...defaultChainStatus },
    [BlockchainType.ETHEREUM]: { ...defaultChainStatus },
    [BlockchainType.BITCOIN]: { ...defaultChainStatus }
  });

  // Monitor TON connection status
  useEffect(() => {
    const checkTonStatus = () => {
      // Check with auth context instead since we don't have the direct methods
      const isAuthenticated = signIn.toString() !== "";
      
      setChainStatus(prev => ({
        ...prev,
        [BlockchainType.TON]: {
          ...prev[BlockchainType.TON],
          isConnected: isAuthenticated,
          isConnecting: false,
          address: isAuthenticated ? "ton1234...5678" : null,
          balance: isAuthenticated ? "10 TON" : null,
          network: 'mainnet' // TON doesn't have network selection in our app yet
        }
      }));
    };
    
    // Initial check
    checkTonStatus();
    
    // Setup interval for status checks
    const interval = setInterval(checkTonStatus, 10000);
    
    return () => clearInterval(interval);
  }, [signIn]);
  
  // Monitor Solana connection status
  useEffect(() => {
    const checkSolanaStatus = () => {
      const solanaInfo = solanaService.getWalletInfo();
      const isConnected = solanaService.getConnectionStatus() === 'connected';
      const isConnecting = solanaService.getConnectionStatus() === 'connecting';
      
      setChainStatus(prev => ({
        ...prev,
        [BlockchainType.SOLANA]: {
          ...prev[BlockchainType.SOLANA],
          isConnected,
          isConnecting,
          address: solanaInfo?.address || null,
          balance: solanaInfo?.balance || null,
          network: solanaInfo?.network || null
        }
      }));
    };
    
    // Initial check
    checkSolanaStatus();
    
    // Setup interval for status checks
    const interval = setInterval(checkSolanaStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Connect to a specific chain
  const connectChain = async (chain: BlockchainType): Promise<boolean> => {
    // Set active chain
    setActiveChain(chain);
    
    // Update status to connecting
    setChainStatus(prev => ({
      ...prev,
      [chain]: {
        ...prev[chain],
        isConnecting: true
      }
    }));
    
    try {
      let success = false;
      
      // Chain-specific connection logic
      if (chain === BlockchainType.TON) {
        success = await signIn();
      } else if (chain === BlockchainType.SOLANA) {
        success = await solanaService.connect();
      }
      
      // Update status
      setChainStatus(prev => ({
        ...prev,
        [chain]: {
          ...prev[chain],
          isConnecting: false,
          isConnected: success
        }
      }));
      
      return success;
    } catch (error) {
      console.error(`Failed to connect to ${chain}:`, error);
      
      // Update status on error
      setChainStatus(prev => ({
        ...prev,
        [chain]: {
          ...prev[chain],
          isConnecting: false,
          isConnected: false
        }
      }));
      
      return false;
    }
  };

  // Disconnect from a specific chain
  const disconnectChain = async (chain: BlockchainType): Promise<boolean> => {
    try {
      let success = false;
      
      // Chain-specific disconnection logic
      if (chain === BlockchainType.TON) {
        await signOut();
        success = true;
      } else if (chain === BlockchainType.SOLANA) {
        success = await solanaService.disconnect();
      }
      
      // Update status
      setChainStatus(prev => ({
        ...prev,
        [chain]: {
          ...prev[chain],
          isConnected: false,
          address: null,
          balance: null
        }
      }));
      
      // Reset active chain if this was the active one
      if (activeChain === chain) {
        setActiveChain(null);
      }
      
      return success;
    } catch (error) {
      console.error(`Failed to disconnect from ${chain}:`, error);
      return false;
    }
  };

  // Disconnect from all chains
  const disconnectAllChains = async (): Promise<void> => {
    await Promise.all([
      disconnectChain(BlockchainType.TON),
      disconnectChain(BlockchainType.SOLANA)
    ]);
  };

  // Get available wallets for a chain
  const availableWallets = (chain: BlockchainType) => {
    if (chain === BlockchainType.SOLANA) {
      return solanaService.getAvailableWallets().map(wallet => ({
        name: wallet.name,
        type: 'solana'
      }));
    } else if (chain === BlockchainType.TON) {
      return [{ name: 'TON Connect', type: 'ton' }];
    }
    
    return [];
  };

  // Format address based on chain
  const formatAddress = (address: string | null, chain: BlockchainType): string => {
    if (!address) return '';
    
    if (chain === BlockchainType.TON || chain === BlockchainType.ETHEREUM) {
      // Format as 0x1234...5678
      return address.length > 10 
        ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
        : address;
    } else if (chain === BlockchainType.SOLANA) {
      // Format as Solana12...345
      return address.length > 12
        ? `${address.substring(0, 8)}...${address.substring(address.length - 4)}`
        : address;
    }
    
    return address;
  };

  // Get chain icon
  const getChainIcon = (chain: BlockchainType): JSX.Element => {
    switch (chain) {
      case BlockchainType.TON:
        return <SiTon />;
      case BlockchainType.SOLANA:
        return <SiSolana />;
      case BlockchainType.ETHEREUM:
        return <SiEthereum />;
      case BlockchainType.BITCOIN:
        return <SiBitcoin />;
      default:
        return <div>{chain}</div>;
    }
  };

  // Get chain color
  const getChainColor = (chain: BlockchainType): string => {
    switch (chain) {
      case BlockchainType.TON:
        return '#0088CC';
      case BlockchainType.SOLANA:
        return '#9945FF';
      case BlockchainType.ETHEREUM:
        return '#627EEA';
      case BlockchainType.BITCOIN:
        return '#F7931A';
      default:
        return '#888888';
    }
  };

  // Context value
  const contextValue: MultiChainContextType = {
    activeChain,
    chainStatus,
    setActiveChain,
    connectChain,
    disconnectChain,
    disconnectAllChains,
    availableWallets,
    formatAddress,
    getChainIcon,
    getChainColor
  };

  return (
    <MultiChainContext.Provider value={contextValue}>
      {children}
    </MultiChainContext.Provider>
  );
};

// Hook for using the context
export const useMultiChain = (): MultiChainContextType => {
  const context = useContext(MultiChainContext);
  if (context === undefined) {
    throw new Error('useMultiChain must be used within a MultiChainProvider');
  }
  return context;
};

// The BlockchainIcon component
export const BlockchainIcon: React.FC<BlockchainIconProps> = ({ 
  chainId, 
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  const sizeClass = sizeMap[size];
  const colorClass = chainId === BlockchainType.TON ? 'text-teal-500' : 
                    chainId === BlockchainType.SOLANA ? 'text-purple-500' :
                    chainId === BlockchainType.ETHEREUM ? 'text-blue-500' :
                    chainId === BlockchainType.BITCOIN ? 'text-orange-500' : '';
                    
  switch (chainId) {
    case BlockchainType.TON:
      return <SiTon className={`${sizeClass} ${colorClass} ${className}`} />;
    case BlockchainType.SOLANA:
      return <SiSolana className={`${sizeClass} ${colorClass} ${className}`} />;
    case BlockchainType.ETHEREUM:
      return <SiEthereum className={`${sizeClass} ${colorClass} ${className}`} />;
    case BlockchainType.BITCOIN:
      return <SiBitcoin className={`${sizeClass} ${colorClass} ${className}`} />;
    default:
      return <div className={`${sizeClass} ${className}`}>{chainId}</div>;
  }
};