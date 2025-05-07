import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  tonService, 
  TonConnectionStatus as TonConnectionStatusEnum, 
  TONWalletInfo 
} from '@/lib/ton/ton-service';
import { useBlockchainErrors } from './blockchain-error-boundary';

// Re-export the TonConnectionStatus enum for use in components
export const TonConnectionStatus = TonConnectionStatusEnum;
import { tonContractService } from '@/lib/ton/ton-contract-service';

/**
 * Transaction history interface for tracking past transactions
 */
export interface TONTransactionHistory {
  txHash: string;
  amount: string;
  type: 'send' | 'receive' | 'vault' | 'contract';
  timestamp: number;
  recipient?: string;
  sender?: string;
  comment?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

/**
 * Enhanced wallet metadata interface
 */
export interface TONWalletMetadata {
  name?: string;         // Wallet name/label (user-defined)
  connectorType?: string; // Type of connector used (TonKeeper, TonHub, etc.)
  lastConnected?: number; // Timestamp of last connection
  deviceInfo?: string;   // Information about the connected device
}

/**
 * Interface for the TON context that provides TON blockchain functionality
 */
interface TonContextType {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  walletInfo: TONWalletInfo | null;
  connectionStatus: typeof TonConnectionStatus[keyof typeof TonConnectionStatus];
  metadata: TONWalletMetadata | null;
  
  // Transaction history
  transactionHistory: TONTransactionHistory[];
  isLoadingHistory: boolean;
  refreshTransactionHistory: () => Promise<void>;
  
  // Connection management
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  
  // Session management
  saveSession: () => Promise<boolean>;
  restoreSession: () => Promise<boolean>;
  clearSession: () => Promise<void>;
  
  // Account preferences
  updateWalletMetadata: (metadata: Partial<TONWalletMetadata>) => Promise<void>;
  
  // Transaction functions
  sendTON: (toAddress: string, amount: string, comment?: string) => Promise<{ 
    success: boolean; 
    transactionHash?: string; 
    error?: string 
  }>;
  
  createVault: (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }) => Promise<{ 
    success: boolean; 
    vaultAddress?: string; 
    transactionHash?: string;
    error?: string 
  }>;
  
  // Advanced operations
  signMessage: (message: string) => Promise<{ 
    success: boolean; 
    signature?: string; 
    error?: string 
  }>;
}

const TonContext = createContext<TonContextType | null>(null);

// Define hook for using TON context
function useTonContext(): TonContextType {
  const context = useContext(TonContext);
  if (!context) {
    throw new Error('useTon must be used within a TonProvider');
  }
  return context;
}

// Export the hook
export const useTon = useTonContext;

interface TonProviderProps {
  children: ReactNode;
}

export const TonProvider: React.FC<TonProviderProps> = ({ children }) => {
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<typeof TonConnectionStatus[keyof typeof TonConnectionStatus]>(TonConnectionStatus.DISCONNECTED);
  const [walletInfo, setWalletInfo] = useState<TONWalletInfo | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Account management
  const [metadata, setMetadata] = useState<TONWalletMetadata | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<TONTransactionHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Error handling
  const { addError, clearChainErrors } = useBlockchainErrors();

  // Initialize TON service and setup connection
  useEffect(() => {
    let isComponentMounted = true;
    let initInterval: NodeJS.Timeout | null = null;
    let updateInterval: NodeJS.Timeout | null = null;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 5; // Maximum number of attempts before showing an error
    
    const initTon = async () => {
      try {
        // Attempt to initialize TON service
        initAttempts++;
        const success = await tonService.initialize();
        
        if (success && isComponentMounted) {
          // If successfully initialized, update state and clear init interval
          setConnectionStatus(tonService.getConnectionStatus());
          setWalletInfo(tonService.getWalletInfo());
          setIsInitializing(false);
          
          // Clear any existing TON errors since initialization succeeded
          clearChainErrors('TON');
          
          if (initInterval) {
            clearInterval(initInterval);
            initInterval = null;
          }
          
          // Start update interval only after successful initialization
          updateInterval = setInterval(() => {
            if (isComponentMounted) {
              setConnectionStatus(tonService.getConnectionStatus());
              setWalletInfo(tonService.getWalletInfo());
            }
          }, 3000);
          
          // Try to restore session after successful initialization
          try {
            await restoreSession();
          } catch (error) {
            console.warn('Failed to restore TON session:', error);
          }
        } else if (initAttempts >= MAX_INIT_ATTEMPTS) {
          // Add an error after several failed attempts
          addError({
            chain: 'TON',
            message: 'Failed to initialize TON connection after multiple attempts. You can continue using other features.',
            critical: false
          });
          
          // Stop trying to initialize
          if (initInterval) {
            clearInterval(initInterval);
            initInterval = null;
          }
          
          // Still set initializing to false so the app continues
          setIsInitializing(false);
        }
      } catch (error: any) {
        console.error("Failed to initialize TON service:", error);
        
        if (initAttempts >= MAX_INIT_ATTEMPTS) {
          // Add error to the blockchain error context
          addError({
            chain: 'TON',
            message: `TON initialization error: ${error?.message || 'Unknown error'}`,
            critical: false
          });
          
          // Stop trying to initialize
          if (initInterval) {
            clearInterval(initInterval);
            initInterval = null;
          }
          
          // Still set initializing to false so the app continues
          setIsInitializing(false);
        }
      }
    };

    // First attempt immediately
    initTon();
    
    // If not successful, try again periodically
    initInterval = setInterval(initTon, 1000);

    return () => {
      isComponentMounted = false;
      if (initInterval) clearInterval(initInterval);
      if (updateInterval) clearInterval(updateInterval);
    };
  }, []);
  
  // Load transaction history when wallet is connected
  useEffect(() => {
    if (walletInfo?.address && connectionStatus === TonConnectionStatus.CONNECTED) {
      refreshTransactionHistory();
      
      // Set up an interval to periodically refresh transaction history
      const historyRefreshInterval = setInterval(() => {
        refreshTransactionHistory();
      }, 30000); // Refresh every 30 seconds
      
      return () => {
        clearInterval(historyRefreshInterval);
      };
    }
  }, [walletInfo?.address, connectionStatus]);

  // Connect to TON wallet
  const connect = async (): Promise<boolean> => {
    setConnectionStatus(TonConnectionStatus.CONNECTING);
    try {
      const connected = await tonService.connect();
      setConnectionStatus(tonService.getConnectionStatus());
      
      // Clear any existing TON errors since connection attempt completed
      clearChainErrors('TON');
      
      // Update wallet info
      const wallet = tonService.getWalletInfo();
      setWalletInfo(wallet);
      
      // If connected successfully, save session and update metadata
      if (connected && wallet) {
        // Add/update metadata with connection information
        await updateWalletMetadata({
          connectorType: 'TonConnect',
          lastConnected: Date.now(),
          deviceInfo: navigator.userAgent
        });
        
        // Save session for future automatic reconnection
        await saveSession();
      } else {
        // User might have rejected the connection
        addError({
          chain: 'TON',
          message: 'TON wallet connection was not completed. You may need to approve the connection in your wallet.',
          critical: false
        });
      }
      
      return connected;
    } catch (error: any) {
      console.error('Error connecting to TON wallet:', error);
      
      // Report the error
      addError({
        chain: 'TON',
        message: `Failed to connect to TON wallet: ${error?.message || 'Unknown error'}`,
        critical: false
      });
      
      setConnectionStatus(TonConnectionStatus.DISCONNECTED);
      return false;
    }
  };

  // Disconnect from TON wallet
  const disconnect = async (): Promise<boolean> => {
    try {
      // Attempt to disconnect from TON service
      const disconnected = await tonService.disconnect();
      
      // Update connection status
      setConnectionStatus(TonConnectionStatus.DISCONNECTED);
      
      // Clear session from storage
      await clearSession();
      
      return disconnected;
    } catch (error) {
      console.error('Error disconnecting from TON wallet:', error);
      // Ensure we still clear the session even if the service disconnect fails
      try {
        await clearSession();
      } catch (clearError) {
        console.error('Error clearing TON session after disconnect failure:', clearError);
      }
      return false;
    }
  };

  // This legacy sendTON function is only here for compatibility and will be removed
  // All new code should use the enhanced version with comment support
  const sendTON = async (toAddress: string, amount: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    return enhancedSendTON(toAddress, amount);
  };

  // Create time-locked vault
  const createVault = async (params: {
    unlockTime: number;
    recipient?: string;
    amount: string;
    comment?: string;
  }): Promise<{ success: boolean; vaultAddress?: string; transactionHash?: string; error?: string }> => {
    try {
      const result = await tonService.createVault(params);
      
      // Refresh wallet info after vault creation
      setWalletInfo(tonService.getWalletInfo());
      
      // Track this transaction in history if successful
      if (result.success && result.transactionHash) {
        const newTx: TONTransactionHistory = {
          txHash: result.transactionHash,
          amount: params.amount,
          type: 'vault',
          timestamp: Math.floor(Date.now() / 1000),
          recipient: params.recipient || walletInfo?.address,
          comment: params.comment,
          status: 'confirmed'
        };
        setTransactionHistory(prev => [newTx, ...prev]);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to create vault' };
    }
  };

  // Enhanced sendTON with comment support
  const enhancedSendTON = async (toAddress: string, amount: string, comment?: string): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    try {
      const result = await tonService.sendTON(toAddress, amount);
      
      // Refresh wallet info after transaction
      setWalletInfo(tonService.getWalletInfo());
      
      // Track this transaction in history if successful
      if (result.success && result.transactionHash) {
        const newTx: TONTransactionHistory = {
          txHash: result.transactionHash,
          amount: amount,
          type: 'send',
          timestamp: Math.floor(Date.now() / 1000),
          recipient: toAddress,
          comment: comment,
          status: 'confirmed'
        };
        setTransactionHistory(prev => [newTx, ...prev]);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send TON' };
    }
  };

  // Transaction history management
  const refreshTransactionHistory = async (): Promise<void> => {
    if (!walletInfo?.address) return;
    
    setIsLoadingHistory(true);
    try {
      // This would typically call an API to fetch transaction history
      // For now, we'll fetch basic data from TON API
      const apiKey = import.meta.env.VITE_TON_API_KEY || import.meta.env.TON_API_KEY || '5216ae7e1e4328d7c3e07bc4d32d2694db47f2c5dd20e56872b766b2fdb7fb02';
      
      if (!apiKey) {
        console.warn('No TON API key provided, cannot fetch transaction history');
        return;
      }
      
      const endpoint = 'https://testnet.toncenter.com/api/v2/getTransactions';
      const params = new URLSearchParams({
        address: walletInfo.address,
        limit: '10'
      });
      
      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.result) {
          // Process transactions into our format
          const formattedHistory: TONTransactionHistory[] = data.result.map((tx: any) => {
            const isOutgoing = tx.out_msgs && tx.out_msgs.length > 0;
            const amountNano = isOutgoing 
              ? tx.out_msgs?.[0]?.value || '0'
              : tx.in_msg?.value || '0';
            const tonAmount = (parseInt(amountNano) / 1e9).toFixed(2);
            
            return {
              txHash: tx.transaction_id?.hash || 'unknown',
              amount: tonAmount,
              type: isOutgoing ? 'send' : 'receive',
              timestamp: tx.utime || Math.floor(Date.now() / 1000),
              recipient: isOutgoing ? tx.out_msgs?.[0]?.destination : undefined,
              sender: !isOutgoing ? tx.in_msg?.source : undefined,
              comment: tx.in_msg?.message || tx.out_msgs?.[0]?.message,
              status: 'confirmed'
            };
          });
          
          setTransactionHistory(formattedHistory);
        }
      }
    } catch (error) {
      console.error('Failed to refresh transaction history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Save transaction history to localStorage
  const saveTransactionHistory = async (): Promise<boolean> => {
    try {
      if (transactionHistory.length > 0) {
        localStorage.setItem('ton_transaction_history', JSON.stringify(transactionHistory));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to save transaction history:', error);
      return false;
    }
  };

  // Restore transaction history from localStorage
  const restoreTransactionHistory = async (): Promise<boolean> => {
    try {
      const savedHistory = localStorage.getItem('ton_transaction_history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setTransactionHistory(parsedHistory);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore transaction history:', error);
      return false;
    }
  };

  // Effect to save transaction history when it changes
  useEffect(() => {
    if (transactionHistory.length > 0) {
      saveTransactionHistory();
    }
  }, [transactionHistory]);

  // Session management methods
  const saveSession = async (): Promise<boolean> => {
    try {
      if (!walletInfo) return false;
      
      // Store wallet info and metadata in localStorage
      localStorage.setItem('ton_wallet_info', JSON.stringify(walletInfo));
      localStorage.setItem('ton_metadata', JSON.stringify(metadata || { 
        lastConnected: Date.now() 
      }));
      
      // Also save current transaction history
      await saveTransactionHistory();
      
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  };

  const restoreSession = async (): Promise<boolean> => {
    try {
      console.log('Attempting to restore TON wallet session...');
      
      // Retrieve wallet info and metadata from localStorage
      const savedWalletInfo = localStorage.getItem('ton_wallet_info');
      const savedMetadata = localStorage.getItem('ton_metadata');
      
      // First restore the localStorage data
      if (savedWalletInfo) {
        const parsedWalletInfo = JSON.parse(savedWalletInfo);
        setWalletInfo(parsedWalletInfo);
      }
      
      if (savedMetadata) {
        const parsedMetadata = JSON.parse(savedMetadata);
        setMetadata(parsedMetadata);
      }
      
      // Also restore transaction history
      await restoreTransactionHistory();
      
      // Important: Now attempt to reconnect to the wallet using the TON service
      // This ensures the wallet connection is actually active, not just our local state
      if (savedWalletInfo) {
        try {
          // If TON service is already connected, we don't need to reconnect
          if (tonService.getConnectionStatus() === TonConnectionStatus.CONNECTED) {
            console.log('TON wallet already connected, no need to reconnect');
            setConnectionStatus(TonConnectionStatus.CONNECTED);
            return true;
          }
          
          // Otherwise try to reconnect
          console.log('Attempting to reconnect to TON wallet');
          const connected = await tonService.connect();
          
          if (connected) {
            console.log('Successfully reconnected to TON wallet');
            setConnectionStatus(TonConnectionStatus.CONNECTED);
            return true;
          } else {
            console.log('Failed to reconnect to TON wallet');
            return false;
          }
        } catch (reconnectError) {
          console.error('Error reconnecting to TON wallet:', reconnectError);
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Failed to restore session:', error);
      return false;
    }
  };

  const clearSession = async (): Promise<void> => {
    try {
      localStorage.removeItem('ton_wallet_info');
      localStorage.removeItem('ton_metadata');
      localStorage.removeItem('ton_transaction_history');
      setWalletInfo(null);
      setMetadata(null);
      setTransactionHistory([]);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  };

  // Update wallet metadata
  const updateWalletMetadata = async (newMetadata: Partial<TONWalletMetadata>): Promise<void> => {
    try {
      const updated = { ...metadata, ...newMetadata, lastConnected: Date.now() };
      setMetadata(updated);
      localStorage.setItem('ton_metadata', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update wallet metadata:', error);
    }
  };

  // Sign message
  const signMessage = async (message: string): Promise<{ success: boolean; signature?: string; error?: string }> => {
    try {
      // This would typically call a method on the tonService to sign a message
      // As the direct signing method is not implemented yet, this is a placeholder
      console.log('Signing message:', message);
      
      // For now, return a notice that this functionality is not yet available
      return { 
        success: false, 
        error: 'Message signing not yet implemented in TonConnect' 
      };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to sign message' };
    }
  };

  const contextValue: TonContextType = {
    // Connection state
    isConnected: connectionStatus === TonConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === TonConnectionStatus.CONNECTING || isInitializing,
    walletInfo,
    connectionStatus,
    metadata,
    
    // Transaction history
    transactionHistory,
    isLoadingHistory,
    refreshTransactionHistory,
    
    // Connection management
    connect,
    disconnect,
    
    // Session management
    saveSession,
    restoreSession,
    clearSession,
    
    // Account preferences
    updateWalletMetadata,
    
    // Transaction functions
    sendTON: enhancedSendTON,
    createVault,
    
    // Advanced operations
    signMessage,
  };

  return (
    <TonContext.Provider value={contextValue}>
      {children}
    </TonContext.Provider>
  );
};