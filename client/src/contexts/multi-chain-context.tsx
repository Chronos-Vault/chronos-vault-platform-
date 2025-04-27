/**
 * Context for managing multi-chain functionality across different blockchains
 */
import React, { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import { NETWORK_CONFIG } from '@/lib/cross-chain/bridge';
import { BlockchainType } from '@/lib/cross-chain/interfaces';

interface WalletType {
  id: string;
  name: string;
  icon: string;
  supportsChains: BlockchainType[];
  isInstalled: () => boolean;
}

interface MultiChainContextType {
  // Current state
  currentChain: BlockchainType;
  isTestnet: boolean;
  availableWallets: WalletType[];
  
  // Actions
  switchChain: (chainId: BlockchainType) => Promise<boolean>;
  toggleTestnet: () => void;
  getChainExplorer: (address: string) => string;
  
  // Network info
  getNetworkConfig: (chainId: BlockchainType) => any;
  isSupportedChain: (chainId: BlockchainType) => boolean;
}

const MultiChainContext = createContext<MultiChainContextType | undefined>(undefined);

interface MultiChainProviderProps {
  children: ReactNode;
}

export const MultiChainProvider: React.FC<MultiChainProviderProps> = ({ children }) => {
  const [currentChain, setCurrentChain] = useState<BlockchainType>('ETH');
  const [isTestnet, setIsTestnet] = useState(false);
  
  // Available wallets (would be populated based on detected browser extensions)
  const availableWallets: WalletType[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'metamask',
      supportsChains: ['ETH', 'MATIC', 'BNB'],
      isInstalled: () => true
    },
    {
      id: 'tonkeeper',
      name: 'TON Keeper',
      icon: 'tonkeeper',
      supportsChains: ['TON'],
      isInstalled: () => true
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: 'phantom',
      supportsChains: ['SOL'],
      isInstalled: () => true
    }
  ];
  
  const switchChain = async (chainId: BlockchainType): Promise<boolean> => {
    // In a real implementation, this would request wallet to switch networks
    setCurrentChain(chainId);
    return true;
  };
  
  const toggleTestnet = () => {
    setIsTestnet(prev => !prev);
  };
  
  const getChainExplorer = (address: string): string => {
    const baseUrl = NETWORK_CONFIG[currentChain].explorers[0];
    return `${baseUrl}/address/${address}`;
  };
  
  const getNetworkConfig = (chainId: BlockchainType) => {
    return NETWORK_CONFIG[chainId];
  };
  
  const isSupportedChain = (chainId: BlockchainType): boolean => {
    return Object.keys(NETWORK_CONFIG).includes(chainId);
  };
  
  const contextValue: MultiChainContextType = {
    currentChain,
    isTestnet,
    availableWallets,
    switchChain,
    toggleTestnet,
    getChainExplorer,
    getNetworkConfig,
    isSupportedChain
  };
  
  return (
    <MultiChainContext.Provider value={contextValue}>
      {children}
    </MultiChainContext.Provider>
  );
};

export const useMultiChain = () => {
  const context = useContext(MultiChainContext);
  if (context === undefined) {
    throw new Error('useMultiChain must be used within a MultiChainProvider');
  }
  return context;
};

export const BlockchainIcon: React.FC<{ chainId: BlockchainType, size?: 'sm' | 'md' | 'lg' }> = ({ 
  chainId, 
  size = 'md' 
}) => {
  const config = NETWORK_CONFIG[chainId];
  const sizeClass = {
    'sm': 'w-5 h-5',
    'md': 'w-8 h-8',
    'lg': 'w-12 h-12'
  }[size];
  
  return (
    <div 
      className={`${sizeClass} rounded-full bg-opacity-20`}
      style={{ backgroundColor: `${config.color}30` }}
    >
      {/* This would use actual blockchain icons - for now just render initials */}
      <div 
        className="w-full h-full flex items-center justify-center font-bold text-center"
        style={{ color: config.color }}
      >
        {config.name.substring(0, 3)}
      </div>
    </div>
  );
};