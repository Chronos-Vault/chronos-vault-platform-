/**
 * Blockchain Hook
 * 
 * This hook provides access to wallet connections for different blockchain networks.
 * It manages connection state, wallet addresses, and balance information.
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { crossChainBridgeService } from '@/services/CrossChainBridgeService';
import { useToast } from '@/hooks/use-toast';

// Chain types
export type ChainType = 'ethereum' | 'solana' | 'ton' | 'bitcoin';

// Wallet data structure
export interface WalletData {
  address: string;
  network: string;
  balance: {
    total: string;
    formatted: string;
    symbol: string;
    decimals: number;
  };
  isConnected: boolean;
  isTestnet: boolean;
}

// Blockchain context interface
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
const BlockchainContext = createContext<BlockchainContextType | null>(null);

/**
 * Blockchain Provider Component
 * Manages blockchain connection state and provides methods for wallet interactions
 */
export const BlockchainProvider = ({ children }: { children: ReactNode }) => {
  const [wallets, setWallets] = useState<Record<ChainType, WalletData | null>>({
    ethereum: null,
    solana: null,
    ton: null,
    bitcoin: null
  });
  const [connecting, setConnecting] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(() => {
    // Read from localStorage if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('blockchainSimulationMode');
      return stored ? stored === 'true' : false;
    }
    return false;
  });
  
  const { toast } = useToast();
  
  // Check if any wallet is connected
  const connected = Object.values(wallets).some(wallet => wallet?.isConnected);
  
  // Store simulation mode in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('blockchainSimulationMode', isSimulationMode.toString());
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
      
      if (isSimulationMode) {
        // Simulated connection for testing/development
        const simulatedWallet: WalletData = {
          address: `simulated_${chain}_address_${Date.now().toString(36)}`,
          network: 'testnet',
          balance: {
            total: '1000',
            formatted: '1,000.00',
            symbol: chain === 'ethereum' ? 'ETH' : 
                   chain === 'solana' ? 'SOL' : 
                   chain === 'ton' ? 'TON' : 'BTC',
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
          title: `Simulation Mode`,
          description: `Connected to simulated ${chain.toUpperCase()} wallet`,
          variant: 'default',
        });
        
        return true;
      }
      
      // Real blockchain connection
      const walletData = await crossChainBridgeService.connectWallet(chain);
      
      setWallets(prev => ({
        ...prev,
        [chain]: walletData
      }));
      
      toast({
        title: 'Connected',
        description: `Connected to ${chain.toUpperCase()} wallet`,
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error(`Error connecting to ${chain}:`, error);
      
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : `Failed to connect to ${chain}`,
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
      if (isSimulationMode) {
        // Simulated disconnection
        setWallets(prev => ({
          ...prev,
          [chain]: null
        }));
        
        toast({
          title: `Simulation Mode`,
          description: `Disconnected from simulated ${chain.toUpperCase()} wallet`,
          variant: 'default',
        });
        
        return true;
      }
      
      // Real blockchain disconnection
      await crossChainBridgeService.disconnectWallet(chain);
      
      setWallets(prev => ({
        ...prev,
        [chain]: null
      }));
      
      toast({
        title: 'Disconnected',
        description: `Disconnected from ${chain.toUpperCase()} wallet`,
        variant: 'default',
      });
      
      return true;
    } catch (error) {
      console.error(`Error disconnecting from ${chain}:`, error);
      
      toast({
        title: 'Disconnection Failed',
        description: error instanceof Error ? error.message : `Failed to disconnect from ${chain}`,
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  /**
   * Disconnect from all blockchain wallets
   */
  const disconnectAll = async (): Promise<void> => {
    const chains: ChainType[] = ['ethereum', 'solana', 'ton', 'bitcoin'];
    
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
      
      if (isSimulationMode) {
        // Update simulated balances
        setWallets(prev => {
          const updated = { ...prev };
          
          connectedChains.forEach(chain => {
            if (updated[chain]) {
              const currentBalance = parseFloat(updated[chain]!.balance.total);
              const newBalance = (currentBalance + Math.random() * 0.5).toFixed(4);
              
              updated[chain] = {
                ...updated[chain]!,
                balance: {
                  ...updated[chain]!.balance,
                  total: newBalance,
                  formatted: Number(newBalance).toLocaleString()
                }
              };
            }
          });
          
          return updated;
        });
        
        return;
      }
      
      // Real balance refresh
      const updatedBalances = await crossChainBridgeService.refreshBalances(connectedChains);
      
      setWallets(prev => {
        const updated = { ...prev };
        
        Object.entries(updatedBalances).forEach(([chain, balance]) => {
          if (updated[chain as ChainType]) {
            updated[chain as ChainType] = {
              ...updated[chain as ChainType]!,
              balance
            };
          }
        });
        
        return updated;
      });
    } catch (error) {
      console.error('Error refreshing balances:', error);
      
      toast({
        title: 'Balance Refresh Failed',
        description: error instanceof Error ? error.message : 'Failed to refresh balances',
        variant: 'destructive',
      });
    }
  };
  
  /**
   * Toggle simulation mode
   */
  const toggleSimulationMode = () => {
    setIsSimulationMode(prev => !prev);
    
    // Clear all connections when toggling
    setWallets({
      ethereum: null,
      solana: null,
      ton: null,
      bitcoin: null
    });
    
    toast({
      title: 'Simulation Mode',
      description: !isSimulationMode ? 'Enabled' : 'Disabled',
      variant: 'default',
    });
  };
  
  const value: BlockchainContextType = {
    connected,
    connecting,
    wallets,
    connect,
    disconnect,
    disconnectAll,
    refreshBalances,
    isSimulationMode,
    toggleSimulationMode
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
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};