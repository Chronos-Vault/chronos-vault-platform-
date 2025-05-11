/**
 * Blockchain Hook
 * 
 * This hook provides access to wallet connections for different blockchain networks.
 * It manages connection state, wallet addresses, and balance information.
 */

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ChainType, WalletData } from '@shared/types/blockchain-types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Blockchain connection context type
interface BlockchainContextType {
  connected: boolean;
  connecting: boolean;
  wallets: Record<ChainType, WalletData | null>;
  connect: (chain: ChainType) => Promise<boolean>;
  disconnect: (chain: ChainType) => Promise<boolean>;
  disconnectAll: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  isSimulationMode: boolean;
  toggleSimulationMode: () => void;
}

// Create context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  connected: false,
  connecting: false,
  wallets: {
    [ChainType.ETHEREUM]: null,
    [ChainType.SOLANA]: null,
    [ChainType.TON]: null,
    [ChainType.BITCOIN]: null,
  },
  connect: async () => false,
  disconnect: async () => false,
  disconnectAll: async () => {},
  refreshBalances: async () => {},
  isSimulationMode: false,
  toggleSimulationMode: () => {},
});

/**
 * Blockchain Provider Component
 * Manages blockchain connection state and provides methods for wallet interactions
 */
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [wallets, setWallets] = useState<Record<ChainType, WalletData | null>>({
    [ChainType.ETHEREUM]: null,
    [ChainType.SOLANA]: null,
    [ChainType.TON]: null,
    [ChainType.BITCOIN]: null,
  });
  const [isSimulationMode, setIsSimulationMode] = useState(() => {
    // Check localStorage for saved preference, default to true in development
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simulationMode');
      return saved !== null ? saved === 'true' : import.meta.env.DEV;
    }
    return import.meta.env.DEV;
  });

  // Determine if any wallet is connected
  const connected = Object.values(wallets).some(wallet => wallet?.isConnected);

  // Load any existing wallet connections on mount
  useEffect(() => {
    const loadExistingConnections = async () => {
      try {
        const response = await apiRequest('GET', '/api/blockchain/wallets');
        const data = await response.json();
        
        if (data.success && data.data) {
          const loadedWallets: Record<ChainType, WalletData | null> = {
            ...wallets
          };
          
          // Update wallets with any connected ones
          Object.entries(data.data).forEach(([chain, walletData]) => {
            if (walletData && (walletData as WalletData).isConnected) {
              loadedWallets[chain as ChainType] = walletData as WalletData;
            }
          });
          
          setWallets(loadedWallets);
        }
      } catch (error) {
        console.error('Error loading existing connections:', error);
      }
    };
    
    loadExistingConnections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save simulation mode preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('simulationMode', isSimulationMode.toString());
    }
  }, [isSimulationMode]);

  /**
   * Connect to a blockchain wallet
   * 
   * @param chain The blockchain to connect to
   * @returns Success status
   */
  const connect = async (chain: ChainType): Promise<boolean> => {
    try {
      setConnecting(true);
      
      // If in simulation mode, use simulated wallet
      if (isSimulationMode) {
        // Generate a simulated wallet
        const simulatedAddress = `simulated_${chain}_${Date.now().toString().substring(8)}`;
        const simulatedWallet: WalletData = {
          address: simulatedAddress,
          network: 'testnet',
          balance: {
            total: '1000',
            formatted: '1,000.00',
            symbol: chain === ChainType.ETHEREUM ? 'ETH' : 
                   chain === ChainType.SOLANA ? 'SOL' : 
                   chain === ChainType.TON ? 'TON' : 'BTC',
            decimals: 18
          },
          isConnected: true,
          isTestnet: true
        };
        
        setWallets(prev => ({
          ...prev,
          [chain]: simulatedWallet
        }));
        
        toast({
          title: 'Simulation Mode',
          description: `Connected to simulated ${chain} wallet`,
        });
        
        return true;
      }
      
      // Make real connection request to backend
      const response = await apiRequest('POST', '/api/blockchain/connect', {
        chain
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWallets(prev => ({
          ...prev,
          [chain]: data.data
        }));
        
        toast({
          title: 'Connected',
          description: `Successfully connected to ${chain}`,
        });
        
        return true;
      } else {
        toast({
          title: 'Connection Failed',
          description: data.error || `Failed to connect to ${chain}`,
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      console.error(`Error connecting to ${chain}:`, error);
      toast({
        title: 'Connection Error',
        description: `An error occurred while connecting to ${chain}`,
        variant: 'destructive',
      });
      
      return false;
    } finally {
      setConnecting(false);
    }
  };

  /**
   * Disconnect from a blockchain wallet
   * 
   * @param chain The blockchain to disconnect from
   * @returns Success status
   */
  const disconnect = async (chain: ChainType): Promise<boolean> => {
    try {
      // If in simulation mode, just remove the simulated wallet
      if (isSimulationMode) {
        setWallets(prev => ({
          ...prev,
          [chain]: null
        }));
        
        toast({
          title: 'Disconnected',
          description: `Disconnected from simulated ${chain} wallet`,
        });
        
        return true;
      }
      
      // Make real disconnection request
      const response = await apiRequest('POST', '/api/blockchain/disconnect', {
        chain
      });
      
      const data = await response.json();
      
      if (data.success) {
        setWallets(prev => ({
          ...prev,
          [chain]: null
        }));
        
        toast({
          title: 'Disconnected',
          description: `Successfully disconnected from ${chain}`,
        });
        
        return true;
      } else {
        toast({
          title: 'Disconnection Failed',
          description: data.error || `Failed to disconnect from ${chain}`,
          variant: 'destructive',
        });
        
        return false;
      }
    } catch (error) {
      console.error(`Error disconnecting from ${chain}:`, error);
      toast({
        title: 'Disconnection Error',
        description: `An error occurred while disconnecting from ${chain}`,
        variant: 'destructive',
      });
      
      return false;
    }
  };

  /**
   * Disconnect from all blockchain wallets
   */
  const disconnectAll = async (): Promise<void> => {
    const chains = Object.keys(wallets) as ChainType[];
    
    for (const chain of chains) {
      if (wallets[chain]?.isConnected) {
        await disconnect(chain);
      }
    }
  };

  /**
   * Refresh wallet balances for all connected blockchains
   */
  const refreshBalances = async (): Promise<void> => {
    try {
      const connectedChains = Object.entries(wallets)
        .filter(([_, wallet]) => wallet?.isConnected)
        .map(([chain]) => chain as ChainType);
      
      if (connectedChains.length === 0) return;
      
      // If in simulation mode, just update the simulated balances
      if (isSimulationMode) {
        const updatedWallets = { ...wallets };
        
        connectedChains.forEach(chain => {
          if (updatedWallets[chain]) {
            const currentWallet = updatedWallets[chain]!;
            updatedWallets[chain] = {
              ...currentWallet,
              balance: {
                ...currentWallet.balance,
                total: (parseFloat(currentWallet.balance.total) + Math.random() * 10).toFixed(4),
                formatted: (parseFloat(currentWallet.balance.total) + Math.random() * 10).toFixed(4),
              }
            };
          }
        });
        
        setWallets(updatedWallets);
        return;
      }
      
      // Make real balance refresh request
      const response = await apiRequest('POST', '/api/blockchain/refresh-balances', {
        chains: connectedChains
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedWallets = { ...wallets };
        
        Object.entries(data.data).forEach(([chain, balance]) => {
          if (updatedWallets[chain as ChainType]) {
            updatedWallets[chain as ChainType] = {
              ...updatedWallets[chain as ChainType]!,
              balance: balance as WalletData['balance']
            };
          }
        });
        
        setWallets(updatedWallets);
      }
    } catch (error) {
      console.error('Error refreshing balances:', error);
      toast({
        title: 'Balance Refresh Failed',
        description: 'Failed to refresh wallet balances',
        variant: 'destructive',
      });
    }
  };

  /**
   * Toggle simulation mode
   */
  const toggleSimulationMode = () => {
    // Disconnect all wallets first
    disconnectAll().then(() => {
      setIsSimulationMode(prev => !prev);
      
      toast({
        title: `Simulation Mode ${!isSimulationMode ? 'Enabled' : 'Disabled'}`,
        description: `Wallet connections are now ${!isSimulationMode ? 'simulated' : 'real'}`,
      });
    });
  };

  // Context value
  const value: BlockchainContextType = {
    connected,
    connecting,
    wallets,
    connect,
    disconnect,
    disconnectAll,
    refreshBalances,
    isSimulationMode,
    toggleSimulationMode,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

/**
 * Use Blockchain Hook
 * 
 * Hook for accessing blockchain connection context
 * 
 * @returns Blockchain context
 */
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  
  return context;
};

export default useBlockchain;