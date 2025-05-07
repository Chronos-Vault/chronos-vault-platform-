import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDevMode } from './dev-mode-context';
import { useBlockchainErrors } from './blockchain-error-boundary';
import { useTon } from './ton-context';
import { useEthereum } from './ethereum-context';
import { useSolana } from './solana-context';
import { useBitcoin } from './bitcoin-context';
import type { 
  BlockchainNetwork,
  CrossChainTransaction,
  TransactionCache,
  TransactionGroup,
  TransactionStatus,
  VerificationStatus,
  VerificationAttempt
} from '@shared/transaction-types';

// Initial empty transaction cache
const createEmptyCache = (): TransactionCache => ({
  byId: {},
  byCorrelationId: {},
  byNetwork: {
    'Ethereum': [],
    'Solana': [],
    'TON': [],
    'Bitcoin': []
  },
  byStatus: {
    'pending': [],
    'confirming': [],
    'confirmed': [],
    'failed': []
  },
  byVerificationStatus: {
    'not_required': [],
    'pending': [],
    'verified': [],
    'failed': [],
    'timeout': []
  },
  groups: {}
});

interface TransactionContextType {
  // Transaction data
  transactions: CrossChainTransaction[];
  transactionGroups: TransactionGroup[];
  recentTransactions: CrossChainTransaction[];
  pendingTransactions: CrossChainTransaction[];
  
  // Transaction retrieval methods
  getTransactionById: (id: string) => CrossChainTransaction | undefined;
  getTransactionsByCorrelationId: (correlationId: string) => CrossChainTransaction[];
  getTransactionsByNetwork: (network: BlockchainNetwork) => CrossChainTransaction[];
  getTransactionsByStatus: (status: TransactionStatus) => CrossChainTransaction[];
  getTransactionsByVerificationStatus: (status: VerificationStatus) => CrossChainTransaction[];
  
  // Transaction group operations
  getTransactionGroup: (correlationId: string) => TransactionGroup | undefined;
  
  // Transaction monitoring actions
  refreshTransactions: () => Promise<void>;
  getMonitoringStatus: () => { 
    isMonitoring: boolean; 
    lastUpdated: number | null;
    pollingInterval: number;
  };
  
  // Transaction verification operations
  verifyTransaction: (txId: string) => Promise<boolean>;
  getVerificationAttempts: (correlationId: string) => VerificationAttempt[];
  
  // Clear data (mainly for development)
  clearAllTransactions: () => void;
}

const TransactionMonitoringContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactionMonitoring = () => {
  const context = useContext(TransactionMonitoringContext);
  if (!context) {
    throw new Error('useTransactionMonitoring must be used within a TransactionMonitoringProvider');
  }
  return context;
};

interface TransactionMonitoringProviderProps {
  children: ReactNode;
  pollingInterval?: number; // Milliseconds between polling for updates
  maxTransactionsToKeep?: number; // Max number of transactions to keep in memory
}

export const TransactionMonitoringProvider: React.FC<TransactionMonitoringProviderProps> = ({
  children,
  pollingInterval = 15000, // Default to 15 seconds
  maxTransactionsToKeep = 100, // Default to keep 100 transactions
}) => {
  // Access blockchain contexts
  const { devModeEnabled } = useDevMode();
  const { addError } = useBlockchainErrors();
  
  // State for transaction cache
  const [transactionCache, setTransactionCache] = useState<TransactionCache>(createEmptyCache());
  
  // Monitoring status
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  
  // Verification attempts tracking
  const [verificationAttempts, setVerificationAttempts] = useState<Record<string, VerificationAttempt[]>>({});
  
  // Blockchain services
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  const bitcoin = useBitcoin();
  
  // Retrieval helper methods
  const getTransactionById = (id: string): CrossChainTransaction | undefined => {
    return transactionCache.byId[id];
  };
  
  const getTransactionsByCorrelationId = (correlationId: string): CrossChainTransaction[] => {
    const ids = transactionCache.byCorrelationId[correlationId] || [];
    return ids.map(id => transactionCache.byId[id]).filter(Boolean);
  };
  
  const getTransactionsByNetwork = (network: BlockchainNetwork): CrossChainTransaction[] => {
    const ids = transactionCache.byNetwork[network] || [];
    return ids.map(id => transactionCache.byId[id]).filter(Boolean);
  };
  
  const getTransactionsByStatus = (status: TransactionStatus): CrossChainTransaction[] => {
    const ids = transactionCache.byStatus[status] || [];
    return ids.map(id => transactionCache.byId[id]).filter(Boolean);
  };
  
  const getTransactionsByVerificationStatus = (status: VerificationStatus): CrossChainTransaction[] => {
    const ids = transactionCache.byVerificationStatus[status] || [];
    return ids.map(id => transactionCache.byId[id]).filter(Boolean);
  };
  
  const getTransactionGroup = (correlationId: string): TransactionGroup | undefined => {
    return transactionCache.groups[correlationId];
  };
  
  // Update transaction in the cache
  const updateTransaction = (transaction: CrossChainTransaction) => {
    setTransactionCache(prevCache => {
      // Create a new cache to maintain immutability
      const newCache: TransactionCache = {
        byId: { ...prevCache.byId },
        byCorrelationId: { ...prevCache.byCorrelationId },
        byNetwork: { ...prevCache.byNetwork },
        byStatus: { ...prevCache.byStatus },
        byVerificationStatus: { ...prevCache.byVerificationStatus },
        groups: { ...prevCache.groups }
      };
      
      const existingTransaction = prevCache.byId[transaction.id];
      
      // If this is a new transaction
      if (!existingTransaction) {
        // Add to byId index
        newCache.byId[transaction.id] = transaction;
        
        // Add to byCorrelationId index
        if (!newCache.byCorrelationId[transaction.correlationId]) {
          newCache.byCorrelationId[transaction.correlationId] = [];
        }
        newCache.byCorrelationId[transaction.correlationId].push(transaction.id);
        
        // Add to byNetwork index
        if (!newCache.byNetwork[transaction.network]) {
          newCache.byNetwork[transaction.network] = [];
        }
        newCache.byNetwork[transaction.network].push(transaction.id);
        
        // Add to byStatus index
        if (!newCache.byStatus[transaction.status]) {
          newCache.byStatus[transaction.status] = [];
        }
        newCache.byStatus[transaction.status].push(transaction.id);
        
        // Add to byVerificationStatus index
        if (!newCache.byVerificationStatus[transaction.verificationStatus]) {
          newCache.byVerificationStatus[transaction.verificationStatus] = [];
        }
        newCache.byVerificationStatus[transaction.verificationStatus].push(transaction.id);
        
        // Update transaction group
        updateTransactionGroup(newCache, transaction);
      } 
      // If this is updating an existing transaction
      else {
        // Update byId index
        newCache.byId[transaction.id] = transaction;
        
        // Update byStatus index if status changed
        if (existingTransaction.status !== transaction.status) {
          // Remove from old status array
          newCache.byStatus[existingTransaction.status] = 
            newCache.byStatus[existingTransaction.status].filter(id => id !== transaction.id);
          
          // Add to new status array
          if (!newCache.byStatus[transaction.status]) {
            newCache.byStatus[transaction.status] = [];
          }
          newCache.byStatus[transaction.status].push(transaction.id);
        }
        
        // Update byVerificationStatus index if verification status changed
        if (existingTransaction.verificationStatus !== transaction.verificationStatus) {
          // Remove from old verification status array
          newCache.byVerificationStatus[existingTransaction.verificationStatus] = 
            newCache.byVerificationStatus[existingTransaction.verificationStatus].filter(id => id !== transaction.id);
          
          // Add to new verification status array
          if (!newCache.byVerificationStatus[transaction.verificationStatus]) {
            newCache.byVerificationStatus[transaction.verificationStatus] = [];
          }
          newCache.byVerificationStatus[transaction.verificationStatus].push(transaction.id);
        }
        
        // Update transaction group
        updateTransactionGroup(newCache, transaction);
      }
      
      return newCache;
    });
  };
  
  // Helper function to update transaction groups
  const updateTransactionGroup = (cache: TransactionCache, transaction: CrossChainTransaction) => {
    const correlationId = transaction.correlationId;
    let group = cache.groups[correlationId];
    
    // If group doesn't exist, create it
    if (!group) {
      group = {
        correlationId,
        primaryTransaction: null!,
        verificationTransactions: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'pending'
      };
    }
    
    // Update group
    group.updatedAt = Date.now();
    
    // If this is a verification transaction
    if (transaction.type === 'verification') {
      // Add or update verification transaction
      const existingVerificationIndex = 
        group.verificationTransactions.findIndex(tx => tx.id === transaction.id);
      
      if (existingVerificationIndex >= 0) {
        group.verificationTransactions[existingVerificationIndex] = transaction;
      } else {
        group.verificationTransactions.push(transaction);
      }
    } 
    // Otherwise, it's a primary transaction
    else {
      group.primaryTransaction = transaction;
    }
    
    // Update group status based on transactions
    if (group.primaryTransaction) {
      if (group.primaryTransaction.status === 'failed') {
        group.status = 'failed';
      } else if (group.primaryTransaction.status === 'confirmed') {
        // If all verification transactions are confirmed or none are required
        const allVerificationsComplete = 
          group.verificationTransactions.length === 0 ||
          group.verificationTransactions.every(tx => tx.status === 'confirmed');
        
        if (allVerificationsComplete) {
          group.status = 'completed';
          group.completedAt = Date.now();
        }
      }
    }
    
    cache.groups[correlationId] = group;
  };
  
  // Track verification attempts
  const recordVerificationAttempt = (correlationId: string, attempt: VerificationAttempt) => {
    setVerificationAttempts(prev => {
      const prevAttempts = prev[correlationId] || [];
      return {
        ...prev,
        [correlationId]: [...prevAttempts, attempt]
      };
    });
  };
  
  // Get verification attempts for a transaction
  const getVerificationAttempts = (correlationId: string): VerificationAttempt[] => {
    return verificationAttempts[correlationId] || [];
  };
  
  // Manually trigger verification of a transaction
  const verifyTransaction = async (txId: string): Promise<boolean> => {
    const tx = getTransactionById(txId);
    if (!tx) return false;
    
    try {
      // Create new verification attempt
      const attemptId = uuidv4();
      const attemptNumber = getVerificationAttempts(tx.correlationId).length + 1;
      
      // For now, simulate verification in dev mode
      if (devModeEnabled) {
        // Simulate verification delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 80% chance of success in dev mode
        const success = Math.random() < 0.8;
        
        // Record the attempt
        const attempt: VerificationAttempt = {
          id: attemptId,
          correlationId: tx.correlationId,
          timestamp: Date.now(),
          network: tx.network,
          status: success ? 'success' : 'failed',
          reason: success ? undefined : 'Simulated failure',
          attemptNumber
        };
        
        recordVerificationAttempt(tx.correlationId, attempt);
        
        // Update the transaction if successful
        if (success) {
          const updatedTx: CrossChainTransaction = {
            ...tx,
            verificationStatus: 'verified',
            verificationTimestamp: Date.now(),
            verifiedBy: [...(tx.verifiedBy || []), tx.network]
          };
          
          updateTransaction(updatedTx);
        }
        
        return success;
      }
      
      // In production mode, perform actual verification
      // This would need implementation specific to each blockchain
      
      return false;
    } catch (error) {
      console.error('Transaction verification failed:', error);
      
      // Add error notification
      addError({
        chain: tx.network,
        message: `Failed to verify transaction: ${error.message}`,
        critical: false
      });
      
      return false;
    }
  };
  
  // Refresh all transactions
  const refreshTransactions = async (): Promise<void> => {
    if (!isMonitoring) return;
    
    try {
      // Set last updated timestamp
      setLastUpdated(Date.now());
      
      if (devModeEnabled) {
        // In development mode, we can simulate transaction updates
        simulateTransactionUpdates();
      } else {
        // In production, we would fetch actual transaction updates from each chain
        // These will be implemented as we build out the real blockchain integrations
        await Promise.all([
          fetchEthereumTransactions(),
          fetchSolanaTransactions(),
          fetchTONTransactions(),
          fetchBitcoinTransactions()
        ]);
      }
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
    }
  };
  
  // Simulated transaction updates for development
  const simulateTransactionUpdates = () => {
    // Update existing transactions
    Object.values(transactionCache.byId).forEach(tx => {
      // If transaction is pending, simulate it moving to confirming with 70% probability
      if (tx.status === 'pending' && Math.random() < 0.7) {
        const updatedTx: CrossChainTransaction = {
          ...tx,
          status: 'confirming',
          confirmations: 1
        };
        updateTransaction(updatedTx);
      }
      // If transaction is confirming, simulate it moving to confirmed with 50% probability
      else if (tx.status === 'confirming' && Math.random() < 0.5) {
        const updatedTx: CrossChainTransaction = {
          ...tx,
          status: 'confirmed',
          confirmations: Math.floor(Math.random() * 10) + 5, // Random 5-15 confirmations
          blockNumber: Math.floor(Math.random() * 1000000) + 9000000 // Random block number
        };
        updateTransaction(updatedTx);
      }
      // If transaction is pending verification, simulate verification with 30% probability
      if (tx.verificationStatus === 'pending' && Math.random() < 0.3) {
        const verificationSuccess = Math.random() < 0.8; // 80% success rate
        
        const updatedTx: CrossChainTransaction = {
          ...tx,
          verificationStatus: verificationSuccess ? 'verified' : 'failed',
          verificationTimestamp: Date.now(),
          verifiedBy: verificationSuccess 
            ? [...(tx.verifiedBy || []), getRandomNetwork(tx.network)]
            : tx.verifiedBy
        };
        
        // Record the verification attempt
        const attemptId = uuidv4();
        const attemptNumber = getVerificationAttempts(tx.correlationId).length + 1;
        
        const attempt: VerificationAttempt = {
          id: attemptId,
          correlationId: tx.correlationId,
          timestamp: Date.now(),
          network: getRandomNetwork(tx.network),
          status: verificationSuccess ? 'success' : 'failed',
          reason: verificationSuccess ? undefined : 'Simulated verification failure',
          attemptNumber
        };
        
        recordVerificationAttempt(tx.correlationId, attempt);
        updateTransaction(updatedTx);
      }
    });
    
    // Generate a new random transaction with 20% probability
    if (Math.random() < 0.2 && Object.keys(transactionCache.byId).length < maxTransactionsToKeep) {
      const newTransaction = generateRandomTransaction();
      updateTransaction(newTransaction);
    }
  };
  
  // Helper for simulation: Get a random network different from the provided one
  const getRandomNetwork = (excludeNetwork?: BlockchainNetwork): BlockchainNetwork => {
    const networks: BlockchainNetwork[] = ['Ethereum', 'Solana', 'TON', 'Bitcoin'];
    if (excludeNetwork) {
      const filteredNetworks = networks.filter(n => n !== excludeNetwork);
      return filteredNetworks[Math.floor(Math.random() * filteredNetworks.length)];
    }
    return networks[Math.floor(Math.random() * networks.length)];
  };
  
  // Helper for simulation: Generate a random transaction
  const generateRandomTransaction = (): CrossChainTransaction => {
    const txId = uuidv4();
    const network = getRandomNetwork();
    const correlationId = Math.random() < 0.7 
      ? uuidv4() // New correlation ID
      : Object.keys(transactionCache.groups)[Math.floor(Math.random() * Math.max(1, Object.keys(transactionCache.groups).length))] || uuidv4(); // Existing or new
    
    const transactionTypes: Array<CrossChainTransaction['type']> = [
      'transfer', 'vault_creation', 'vault_unlock', 'verification', 
      'cross_chain_bridge', 'multi_signature', 'contract_interaction'
    ];
    
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    // Sample addresses for simulation
    const addresses = {
      'Ethereum': ['0x742d35Cc6634C0532925a3b844Bc454e4438f44e', '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF'],
      'Solana': ['GS6HRQbZt3d2CsrqHNF9JmzLsi871SqKku8CKcpvbfP3', 'DdsF1Lnr3SOSAzBz7kNPJ3UT3JjZG8WTAsvno1bEj8U9'],
      'TON': ['EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb', 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N'],
      'Bitcoin': ['bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2']
    };
    
    // Generate the transaction 
    return {
      id: txId,
      txHash: `0x${Math.random().toString(16).substring(2, 34)}`,
      network,
      timestamp: Date.now(),
      type,
      status: 'pending',
      fromAddress: addresses[network][0],
      toAddress: addresses[network][1],
      amount: (Math.random() * 10).toFixed(4),
      symbol: network === 'Ethereum' ? 'ETH' : 
              network === 'Solana' ? 'SOL' : 
              network === 'TON' ? 'TON' : 'BTC',
      correlationId,
      verificationStatus: type === 'verification' ? 'pending' : 'not_required',
      label: `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}`,
      description: `Simulated ${type.replace('_', ' ')} transaction on ${network}`,
      securityLevel: Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3,
    };
  };
  
  // Actual blockchain transaction fetching functions (to be implemented)
  const fetchEthereumTransactions = async () => {
    // Actual implementation would use the Ethereum service
    // For now, just log that we'd fetch here
    if (ethereum?.isConnected && !devModeEnabled) {
      console.log('Would fetch Ethereum transactions here');
    }
  };
  
  const fetchSolanaTransactions = async () => {
    // Actual implementation would use the Solana service
    if (solana?.connected && !devModeEnabled) {
      console.log('Would fetch Solana transactions here');
    }
  };
  
  const fetchTONTransactions = async () => {
    // Actual implementation would use the TON service
    if (ton?.isConnected && !devModeEnabled) {
      console.log('Would fetch TON transactions here');
    }
  };
  
  const fetchBitcoinTransactions = async () => {
    // Actual implementation would use the Bitcoin service
    if (bitcoin?.isConnected && !devModeEnabled) {
      console.log('Would fetch Bitcoin transactions here');
    }
  };
  
  // Clear all transactions (for development)
  const clearAllTransactions = () => {
    setTransactionCache(createEmptyCache());
    setVerificationAttempts({});
  };
  
  // Set up polling interval
  useEffect(() => {
    // Perform initial refresh
    refreshTransactions();
    
    // Set up interval for polling
    const intervalId = setInterval(() => {
      refreshTransactions();
    }, pollingInterval);
    
    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [isMonitoring, pollingInterval, devModeEnabled]);
  
  // Prepare data for consumers
  const transactions = Object.values(transactionCache.byId);
  const transactionGroups = Object.values(transactionCache.groups);
  const recentTransactions = [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);
  const pendingTransactions = [
    ...getTransactionsByStatus('pending'),
    ...getTransactionsByStatus('confirming')
  ];
  
  // Create context value
  const contextValue: TransactionContextType = {
    transactions,
    transactionGroups,
    recentTransactions, 
    pendingTransactions,
    getTransactionById,
    getTransactionsByCorrelationId,
    getTransactionsByNetwork,
    getTransactionsByStatus,
    getTransactionsByVerificationStatus,
    getTransactionGroup,
    refreshTransactions,
    getMonitoringStatus: () => ({ 
      isMonitoring, 
      lastUpdated, 
      pollingInterval 
    }),
    verifyTransaction,
    getVerificationAttempts,
    clearAllTransactions
  };
  
  return (
    <TransactionMonitoringContext.Provider value={contextValue}>
      {children}
    </TransactionMonitoringContext.Provider>
  );
};