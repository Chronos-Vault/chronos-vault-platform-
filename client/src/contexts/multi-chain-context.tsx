import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEthereum, EthereumWalletInfo } from './ethereum-context';
import { useSolana } from './solana-context';
import { useTon } from './ton-context';

// Define blockchain types
export enum BlockchainType {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton',
  BITCOIN = 'bitcoin',
}

interface WalletInfo {
  address: string;
  balance?: string;
  network?: string;
  isConnected: boolean;
}

interface ChainStatus {
  chain: BlockchainType;
  status: 'online' | 'offline' | 'degraded';
  latestBlock?: number;
  latency?: number;
  active: boolean;
  synced: boolean;
  blockHeight: number;
}

interface MultiChainContextType {
  isAnyWalletConnected: boolean;
  isConnected: boolean;
  walletInfo: {
    ethereum: WalletInfo;
    solana: WalletInfo;
    ton: WalletInfo;
  };
  connectAll: () => Promise<void>;
  disconnectAll: () => Promise<void>;
  getSignature: (message: string, chain: string) => Promise<string | null>;
  // Chain-specific functions
  connectChain: (chain: BlockchainType) => Promise<void>;
  disconnectChain: (chain: BlockchainType) => Promise<void>;
  setActiveChain: (chain: BlockchainType) => void;
  activeChain?: BlockchainType;
  availableWallets: (chain: BlockchainType) => Array<{name: string, installed: boolean}>;
  formatAddress: (address: string, chain: BlockchainType) => string;
  // Additional properties used by other components
  chainStatus: Record<BlockchainType, any>;
  isTestnet?: boolean;
}

const defaultWalletInfo: WalletInfo = {
  address: '',
  balance: '0',
  network: '',
  isConnected: false,
};

const MultiChainContext = createContext<MultiChainContextType>({
  isAnyWalletConnected: false,
  isConnected: false,
  walletInfo: {
    ethereum: defaultWalletInfo,
    solana: defaultWalletInfo,
    ton: defaultWalletInfo,
  },
  connectAll: async () => {},
  disconnectAll: async () => {},
  getSignature: async () => null,
  connectChain: async () => {},
  disconnectChain: async () => {},
  setActiveChain: () => {},
  availableWallets: () => [],
  formatAddress: () => '',
  chainStatus: {
    [BlockchainType.ETHEREUM]: {chain: BlockchainType.ETHEREUM, status: 'offline', latestBlock: 0, latency: 0, active: false, synced: false, blockHeight: 0},
    [BlockchainType.SOLANA]: {chain: BlockchainType.SOLANA, status: 'offline', latestBlock: 0, latency: 0, active: false, synced: false, blockHeight: 0},
    [BlockchainType.TON]: {chain: BlockchainType.TON, status: 'offline', latestBlock: 0, latency: 0, active: false, synced: false, blockHeight: 0},
    [BlockchainType.BITCOIN]: {chain: BlockchainType.BITCOIN, status: 'offline', latestBlock: 0, latency: 0, active: false, synced: false, blockHeight: 0},
  }
});

export const MultiChainProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const ethereum = useEthereum();
  const solana = useSolana();
  const ton = useTon();
  
  const [isAnyWalletConnected, setIsAnyWalletConnected] = useState(false);
  const [activeChain, setActiveChain] = useState<BlockchainType>(BlockchainType.TON);
  
  // Aggregate wallet info
  const walletInfo = {
    ethereum: {
      address: ethereum.walletInfo?.address || '',
      balance: ethereum.walletInfo?.balance || '0',
      network: ethereum.walletInfo?.chainId ? `Chain ID: ${ethereum.walletInfo?.chainId}` : '',
      isConnected: ethereum.isConnected,
    },
    solana: {
      address: solana.walletAddress || '',
      balance: solana.balance || '0',
      network: solana.network || '',
      isConnected: solana.isConnected,
    },
    ton: {
      address: ton.walletAddress || '',
      balance: ton.balance || '0',
      network: ton.network || '',
      isConnected: ton.isConnected,
    }
  };
  
  // Determine if at least one wallet is connected
  useEffect(() => {
    const anyConnected = ethereum.isConnected || solana.isConnected || ton.isConnected;
    setIsAnyWalletConnected(anyConnected);
  }, [ethereum.isConnected, solana.isConnected, ton.isConnected]);
  
  // Connect all wallets
  const connectAll = async () => {
    try {
      await Promise.all([
        ethereum.connect(),
        solana.connect(),
        ton.connect()
      ]);
    } catch (error) {
      console.error('Failed to connect all wallets:', error);
    }
  };
  
  // Disconnect all wallets
  const disconnectAll = async () => {
    try {
      await Promise.all([
        ethereum.disconnect && ethereum.disconnect(),
        solana.disconnect && solana.disconnect(),
        ton.disconnect && ton.disconnect()
      ]);
    } catch (error) {
      console.error('Failed to disconnect all wallets:', error);
    }
  };
  
  // Connect to specific chain
  const connectChain = async (chain: BlockchainType) => {
    try {
      switch (chain) {
        case BlockchainType.ETHEREUM:
          await ethereum.connect();
          break;
        case BlockchainType.SOLANA:
          await solana.connect();
          break;
        case BlockchainType.TON:
          await ton.connect();
          break;
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error connecting to ${chain}:`, error);
      throw error;
    }
  };

  // Disconnect from specific chain
  const disconnectChain = async (chain: BlockchainType) => {
    try {
      switch (chain) {
        case BlockchainType.ETHEREUM:
          await ethereum.disconnect?.();
          break;
        case BlockchainType.SOLANA:
          await solana.disconnect?.();
          break;
        case BlockchainType.TON:
          await ton.disconnect?.();
          break;
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }
    } catch (error) {
      console.error(`Error disconnecting from ${chain}:`, error);
      throw error;
    }
  };

  // Get available wallets for a specific chain
  const availableWallets = (chain: BlockchainType): Array<{name: string, installed: boolean}> => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return [{name: 'MetaMask', installed: !!window.ethereum}];
      case BlockchainType.SOLANA:
        return [{name: 'Phantom', installed: !!(window as any).solana}];
      case BlockchainType.TON:
        return [{name: 'TON Wallet', installed: true}];
      default:
        return [];
    }
  };

  // Format address for display based on chain
  const formatAddress = (address: string, chain: BlockchainType): string => {
    if (!address) return '';
    
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };
  
  // Get signature for a message (on specified chain)
  const getSignature = async (message: string, chain: string): Promise<string | null> => {
    try {
      switch (chain.toLowerCase()) {
        case 'ethereum':
          // Using ethereum service directly (to avoid type errors)
          if (ethereum.isConnected) {
            // This would be implemented in production
            console.log('Would sign message on Ethereum:', message);
            return `0x${Array.from({length: 64}, () => 
              Math.floor(Math.random() * 16).toString(16)).join('')}`;
          }
          break;
        case 'solana':
          if (solana.isConnected) {
            // This would be implemented in production
            console.log('Would sign message on Solana:', message);
            return `0x${Array.from({length: 64}, () => 
              Math.floor(Math.random() * 16).toString(16)).join('')}`;
          }
          break;
        case 'ton':
          if (ton.isConnected) {
            // This would be implemented in production
            console.log('Would sign message on TON:', message);
            return `0x${Array.from({length: 64}, () => 
              Math.floor(Math.random() * 16).toString(16)).join('')}`;
          }
          break;
        default:
          throw new Error(`Unsupported chain: ${chain}`);
      }
      return null;
    } catch (error) {
      console.error(`Error signing message on ${chain}:`, error);
      return null;
    }
  };
  
  // Dummy chain status for now (in production, this would be dynamically updated)
  const chainStatus = new Map<BlockchainType, ChainStatus>([
    [BlockchainType.ETHEREUM, {
      chain: BlockchainType.ETHEREUM,
      status: 'online',
      latestBlock: 18500000,
      latency: 250,
      active: true,
      synced: true,
      blockHeight: 18500000
    }],
    [BlockchainType.SOLANA, {
      chain: BlockchainType.SOLANA,
      status: 'online',
      latestBlock: 225000000,
      latency: 120,
      active: true,
      synced: true,
      blockHeight: 225000000
    }],
    [BlockchainType.TON, {
      chain: BlockchainType.TON,
      status: 'online',
      latestBlock: 32500000,
      latency: 180,
      active: true,
      synced: true,
      blockHeight: 32500000
    }]
  ]);

  // Always use testnet for this project
  const isTestnet = true;

  // Convert Map to Record type for easier usage
  const chainStatusRecord: Record<BlockchainType, any> = {
    [BlockchainType.ETHEREUM]: chainStatus.get(BlockchainType.ETHEREUM),
    [BlockchainType.SOLANA]: chainStatus.get(BlockchainType.SOLANA),
    [BlockchainType.TON]: chainStatus.get(BlockchainType.TON),
    [BlockchainType.BITCOIN]: {
      chain: BlockchainType.BITCOIN,
      status: 'degraded',
      latestBlock: 0,
      latency: 0,
      active: false,
      synced: false,
      blockHeight: 0
    }
  };

  return (
    <MultiChainContext.Provider
      value={{
        isAnyWalletConnected,
        isConnected: isAnyWalletConnected, // Alias for convenience
        walletInfo,
        connectAll,
        disconnectAll,
        getSignature,
        chainStatus: chainStatusRecord,
        isTestnet,
        // Add the new functions
        connectChain,
        disconnectChain,
        setActiveChain,
        activeChain,
        availableWallets,
        formatAddress
      }}
    >
      {children}
    </MultiChainContext.Provider>
  );
};

export const useMultiChain = () => useContext(MultiChainContext);
