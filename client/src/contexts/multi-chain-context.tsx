/**
 * Context for managing multi-chain functionality across different blockchains
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ChainId } from '@/lib/contract-interfaces';
import { useToast } from '@/hooks/use-toast';

// Network configurations
const NETWORK_CONFIG = {
  [ChainId.ETHEREUM]: {
    name: 'Ethereum',
    icon: 'ethereum',
    chainIdHex: '0x1', // Mainnet
    testnetChainIdHex: '0xaa36a7', // Sepolia
    blockExplorer: 'https://etherscan.io',
    testnetBlockExplorer: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    testnetRpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/your-api-key',
  },
  [ChainId.TON]: {
    name: 'TON',
    icon: 'ton',
    apiEndpoint: 'https://toncenter.com/api/v2/jsonRPC',
    testnetApiEndpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    blockExplorer: 'https://tonscan.org',
    testnetBlockExplorer: 'https://testnet.tonscan.org',
  },
  [ChainId.SOLANA]: {
    name: 'Solana',
    icon: 'solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    testnetRpcUrl: 'https://api.devnet.solana.com',
    blockExplorer: 'https://explorer.solana.com',
    testnetBlockExplorer: 'https://explorer.solana.com/?cluster=devnet',
  },
};

// Interface for wallet types
interface WalletType {
  id: string;
  name: string;
  icon: string;
  supportsChains: ChainId[];
  isInstalled: () => boolean;
}

// Available wallet types
const WALLET_TYPES: WalletType[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask',
    supportsChains: [ChainId.ETHEREUM],
    isInstalled: () => typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'walletconnect',
    supportsChains: [ChainId.ETHEREUM],
    isInstalled: () => true, // Always available
  },
  {
    id: 'tonkeeper',
    name: 'Tonkeeper',
    icon: 'tonkeeper',
    supportsChains: [ChainId.TON],
    isInstalled: () => typeof window !== 'undefined' && typeof (window as any).tonkeeper !== 'undefined',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: 'phantom',
    supportsChains: [ChainId.SOLANA],
    isInstalled: () => typeof window !== 'undefined' && typeof (window as any).phantom !== 'undefined',
  },
];

// Multi-chain context type
interface MultiChainContextType {
  // Current state
  currentChain: ChainId;
  isTestnet: boolean;
  availableWallets: WalletType[];
  
  // Actions
  switchChain: (chainId: ChainId) => Promise<boolean>;
  toggleTestnet: () => void;
  getChainExplorer: (address: string) => string;
  
  // Network info
  getNetworkConfig: (chainId: ChainId) => any;
  isSupportedChain: (chainId: ChainId) => boolean;
}

// Create context
const MultiChainContext = createContext<MultiChainContextType | undefined>(undefined);

// Context provider props
interface MultiChainProviderProps {
  children: ReactNode;
}

export const MultiChainProvider: React.FC<MultiChainProviderProps> = ({ children }) => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();
  
  // State
  const [currentChain, setCurrentChain] = useState<ChainId>(ChainId.ETHEREUM);
  const [isTestnet, setIsTestnet] = useState<boolean>(false);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  
  // Initialize available wallets based on browser capabilities
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const wallets = WALLET_TYPES.filter(wallet => wallet.isInstalled());
    setAvailableWallets(wallets);
  }, []);
  
  // Switch to a different blockchain
  const switchChain = async (chainId: ChainId): Promise<boolean> => {
    try {
      if (chainId === ChainId.ETHEREUM) {
        // Handle Ethereum chain switching
        const targetChainHex = isTestnet ? 
          NETWORK_CONFIG[ChainId.ETHEREUM].testnetChainIdHex : 
          NETWORK_CONFIG[ChainId.ETHEREUM].chainIdHex;
          
        // Request wallet to switch chains
        if (window.ethereum) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: targetChainHex }],
            });
          } catch (error: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (error.code === 4902) {
              toast({
                title: 'Network Not Available',
                description: 'Please add this network to your wallet first',
                variant: 'destructive',
              });
              return false;
            }
            throw error;
          }
        } else {
          toast({
            title: 'No Ethereum Provider',
            description: 'Please install MetaMask or another Ethereum wallet',
            variant: 'destructive',
          });
          return false;
        }
      } else if (chainId === ChainId.TON) {
        // Switching to TON would require specific TON wallet interaction
        toast({
          title: 'TON Integration',
          description: 'Please open TON wallet to interact with TON blockchain',
        });
      } else if (chainId === ChainId.SOLANA) {
        // Switching to Solana would require Phantom wallet interaction
        toast({
          title: 'Solana Integration',
          description: 'Please open Phantom wallet to interact with Solana blockchain',
        });
      }
      
      setCurrentChain(chainId);
      return true;
    } catch (error) {
      console.error('Error switching chains:', error);
      toast({
        title: 'Network Switch Failed',
        description: 'Failed to switch blockchain networks',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  // Toggle between mainnet and testnet
  const toggleTestnet = () => {
    setIsTestnet(!isTestnet);
    
    // If on Ethereum, also switch the network in the wallet
    if (currentChain === ChainId.ETHEREUM && window.ethereum) {
      const targetChainHex = !isTestnet ? 
        NETWORK_CONFIG[ChainId.ETHEREUM].testnetChainIdHex : 
        NETWORK_CONFIG[ChainId.ETHEREUM].chainIdHex;
        
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainHex }],
      }).catch(console.error);
    }
    
    toast({
      title: `Switched to ${!isTestnet ? 'Testnet' : 'Mainnet'}`,
      description: `Now using ${!isTestnet ? 'test' : 'main'} network for ${NETWORK_CONFIG[currentChain].name}`,
    });
  };
  
  // Get blockchain explorer URL for an address
  const getChainExplorer = (address: string): string => {
    const config = NETWORK_CONFIG[currentChain];
    const baseUrl = isTestnet 
      ? config.testnetBlockExplorer 
      : config.blockExplorer;
    
    // Different explorer address formats
    if (currentChain === ChainId.ETHEREUM) {
      return `${baseUrl}/address/${address}`;
    } else if (currentChain === ChainId.TON) {
      return `${baseUrl}/address/${address}`;
    } else if (currentChain === ChainId.SOLANA) {
      return `${baseUrl}/address/${address}`;
    }
    
    return '';
  };
  
  // Get network configuration for a chain
  const getNetworkConfig = (chainId: ChainId) => {
    return NETWORK_CONFIG[chainId];
  };
  
  // Check if a chain is supported
  const isSupportedChain = (chainId: ChainId): boolean => {
    return Object.keys(NETWORK_CONFIG).includes(chainId.toString());
  };
  
  const value = {
    currentChain,
    isTestnet,
    availableWallets,
    switchChain,
    toggleTestnet,
    getChainExplorer,
    getNetworkConfig,
    isSupportedChain,
  };
  
  return (
    <MultiChainContext.Provider value={value}>
      {children}
    </MultiChainContext.Provider>
  );
};

// Hook to use the multi-chain context
export const useMultiChain = () => {
  const context = useContext(MultiChainContext);
  if (context === undefined) {
    throw new Error('useMultiChain must be used within a MultiChainProvider');
  }
  return context;
};

// Create a blockchain icon component
export const BlockchainIcon: React.FC<{ chainId: ChainId, size?: 'sm' | 'md' | 'lg' }> = ({ 
  chainId, 
  size = 'md' 
}) => {
  const { getNetworkConfig } = useMultiChain();
  const config = getNetworkConfig(chainId);
  
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  // This would use actual blockchain icons in production
  return (
    <div className={`rounded-full bg-[#1A1A1A] flex items-center justify-center ${sizeClass}`}>
      {config.icon === 'ethereum' && <span className="text-blue-500">ETH</span>}
      {config.icon === 'ton' && <span className="text-blue-400">TON</span>}
      {config.icon === 'solana' && <span className="text-purple-500">SOL</span>}
    </div>
  );
};