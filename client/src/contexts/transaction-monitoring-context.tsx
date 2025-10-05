import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useEthereum } from './ethereum-context';
import { useSolana } from './solana-context';
import { useTon } from './ton-context';
import { useBitcoin } from './bitcoin-context';
import { useDevMode } from './dev-mode-context';
import { 
  CrossChainTransaction, 
  TransactionGroup, 
  NetworkTransactionStats,
  TransactionSummary,
  BlockchainNetwork,
  TransactionStatus,
  VerificationStatus,
  TransactionType,
  SecurityLevel
} from '@shared/transaction-types';
import { enhancedCrossChainVerifier } from '../lib/verification/enhanced-cross-chain-verifier';
import { 
  transactionIntegrityMonitor, 
  IntegrityCheckResult, 
  TransactionAnomaly, 
  MonitoringStatus 
} from '../lib/monitoring/transaction-integrity-monitor';

// Verification attempt interface for tracking verification history
export interface VerificationAttempt {
  id: string;
  txId: string;
  correlationId: string;
  network: BlockchainNetwork;
  timestamp: number;
  status: 'success' | 'failed';
  reason?: string;
}

// Context interface
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
  refreshTransaction: (txId: string) => Promise<void>;
  getMonitoringStatus: () => { 
    isMonitoring: boolean; 
    lastUpdated: number | null;
    pollingInterval: number;
  };
  
  // Transaction statistics
  getChainStats: () => NetworkTransactionStats;
  getTransactionSummary: () => TransactionSummary;
  getRelatedTransactions: (correlationId: string) => CrossChainTransaction[];
  
  // Transaction verification operations
  verifyTransaction: (txId: string) => Promise<boolean>;
  getVerificationAttempts: (correlationId: string) => VerificationAttempt[];
  
  // Enhanced cross-chain verification
  verifyTransactionWithEnhancedVerifier: (txId: string) => Promise<boolean>;
  getEnhancedVerificationStats: () => any;
  
  // Transaction integrity monitoring
  getTransactionAnomalies: (transactionId?: string) => TransactionAnomaly[];
  getIntegrityCheckResults: (transactionId?: string) => IntegrityCheckResult[];
  getIntegrityMonitoringStatus: () => MonitoringStatus;
  startIntegrityMonitoring: () => boolean;
  stopIntegrityMonitoring: () => boolean;
  
  // Clear data (mainly for development)
  clearAllTransactions: () => void;
}

// Create the context
const TransactionMonitoringContext = createContext<TransactionContextType | null>(null);

// Provider component
export const TransactionMonitoringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Access blockchain contexts
  const ethereum = useEthereum();
  const solana = useSolana();
  const ton = useTon();
  const bitcoin = useBitcoin();
  const { devModeEnabled } = useDevMode();
  
  // State for transactions and groups
  const [transactions, setTransactions] = useState<CrossChainTransaction[]>([]);
  const [transactionGroups, setTransactionGroups] = useState<TransactionGroup[]>([]);
  const [verificationAttempts, setVerificationAttempts] = useState<VerificationAttempt[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [pollingInterval] = useState(10000); // 10 seconds
  
  // State for enhanced verification and monitoring
  const [enhancedVerificationResults, setEnhancedVerificationResults] = useState<Record<string, any>>({});
  const [integrityMonitorActive, setIntegrityMonitorActive] = useState(false);
  
  // Helper methods for transaction filtering
  const getTransactionById = useCallback((id: string) => {
    return transactions.find(tx => tx.id === id);
  }, [transactions]);
  
  const getTransactionsByCorrelationId = useCallback((correlationId: string) => {
    return transactions.filter(tx => tx.correlationId === correlationId);
  }, [transactions]);
  
  const getTransactionsByNetwork = useCallback((network: BlockchainNetwork) => {
    return transactions.filter(tx => tx.network === network);
  }, [transactions]);
  
  const getTransactionsByStatus = useCallback((status: TransactionStatus) => {
    return transactions.filter(tx => tx.status === status);
  }, [transactions]);
  
  const getTransactionsByVerificationStatus = useCallback((status: VerificationStatus) => {
    return transactions.filter(tx => tx.verificationStatus === status);
  }, [transactions]);
  
  const getTransactionGroup = useCallback((correlationId: string) => {
    return transactionGroups.find(group => group.id === correlationId);
  }, [transactionGroups]);
  
  // Generate transaction groups from transactions
  const generateTransactionGroups = useCallback(() => {
    const correlationIds = [...new Set(transactions.map(tx => tx.correlationId))];
    
    const groups = correlationIds.map(correlationId => {
      const relatedTxs = transactions.filter(tx => tx.correlationId === correlationId);
      
      // Sort by timestamp to find the primary transaction (usually the first one)
      const sortedTxs = [...relatedTxs].sort((a, b) => a.timestamp - b.timestamp);
      const primaryTx = sortedTxs[0];
      
      // Get verification transactions (any that aren't the primary)
      const verificationTxs = sortedTxs.filter(tx => tx.id !== primaryTx.id);
      
      // Determine group status
      let groupStatus: 'pending' | 'completed' | 'failed' = 'pending';
      
      if (relatedTxs.every(tx => tx.status === 'confirmed')) {
        groupStatus = 'completed';
      } else if (relatedTxs.some(tx => tx.status === 'failed')) {
        groupStatus = 'failed';
      }
      
      // Create the group following the TransactionGroup interface
      const group: TransactionGroup = {
        id: correlationId,
        name: `${primaryTx.type} Group`,
        description: `Cross-chain transaction group for ${primaryTx.type}`,
        transactionIds: relatedTxs.map(tx => tx.id),
        primaryNetwork: primaryTx.network,
        securityLevel: primaryTx.securityLevel || 1,
        createdAt: primaryTx.timestamp,
        updatedAt: Date.now(),
        status: groupStatus,
        vaultId: primaryTx.vaultId,
        initiator: primaryTx.fromAddress,
        // Extra properties for our components to use
        metadata: {
          primaryTransaction: primaryTx,
          verificationTransactions: verificationTxs,
          completedAt: groupStatus === 'completed' ? Math.max(...relatedTxs.map(tx => tx.timestamp)) : undefined
        }
      };
      
      return group;
    });
    
    setTransactionGroups(groups);
  }, [transactions]);
  
  // Verify a transaction
  const verifyTransaction = useCallback(async (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return false;
    
    // In a real implementation, we would call the blockchain-specific
    // verification methods for each chain. In this simulation, we'll
    // use a timeout and random success
    
    // Generate a unique attempt ID
    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In development mode, simulate success/failure
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      // Record the verification attempt
      const newAttempt: VerificationAttempt = {
        id: attemptId,
        txId: tx.id,
        correlationId: tx.correlationId,
        network: tx.network === 'Ethereum' ? 'Solana' : 'Ethereum', // Cross-verify on different chain
        timestamp: Date.now(),
        status: isSuccess ? 'success' : 'failed',
        reason: isSuccess ? undefined : 'Verification failed: Transaction not found on target chain'
      };
      
      setVerificationAttempts(prev => [...prev, newAttempt]);
      
      // If successful, update the transaction's verification status
      if (isSuccess) {
        setTransactions(prev => 
          prev.map(t => {
            if (t.id === txId) {
              return {
                ...t,
                verificationStatus: 'verified',
                verificationTimestamp: Date.now(),
                verifiedBy: [...(t.verifiedBy || []), newAttempt.network]
              };
            }
            return t;
          })
        );
      }
      
      return isSuccess;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      
      // Record the failed attempt
      const failedAttempt: VerificationAttempt = {
        id: attemptId,
        txId: tx.id,
        correlationId: tx.correlationId,
        network: tx.network === 'Ethereum' ? 'Solana' : 'Ethereum',
        timestamp: Date.now(),
        status: 'failed',
        reason: `Error during verification: ${error}`
      };
      
      setVerificationAttempts(prev => [...prev, failedAttempt]);
      return false;
    }
  }, [transactions]);
  
  // Get verification attempts for a transaction
  const getVerificationAttempts = useCallback((correlationId: string) => {
    return verificationAttempts.filter(attempt => attempt.correlationId === correlationId);
  }, [verificationAttempts]);
  
  // Get statistics for each blockchain network
  const getChainStats = useCallback((): NetworkTransactionStats => {
    const stats: NetworkTransactionStats = {};
    
    // Count transactions for each network
    transactions.forEach(tx => {
      if (!stats[tx.network]) {
        stats[tx.network] = 0;
      }
      stats[tx.network]++;
    });
    
    return stats;
  }, [transactions]);
  
  // Get related transactions by correlation ID
  const getRelatedTransactions = useCallback((correlationId: string): CrossChainTransaction[] => {
    if (!correlationId) return [];
    return transactions.filter(tx => tx.correlationId === correlationId);
  }, [transactions]);
  
  // Get transaction summary statistics
  const getTransactionSummary = useCallback((): TransactionSummary => {
    const pending = transactions.filter(tx => tx.status === 'pending').length;
    const confirming = transactions.filter(tx => tx.status === 'confirming').length;
    const confirmed = transactions.filter(tx => tx.status === 'confirmed').length;
    const failed = transactions.filter(tx => tx.status === 'failed').length;
    
    const verified = transactions.filter(tx => tx.verificationStatus === 'verified').length;
    const verificationPending = transactions.filter(tx => tx.verificationStatus === 'pending').length;
    const verificationFailed = transactions.filter(tx => tx.verificationStatus === 'failed').length;
    
    // Calculate security levels
    const securityLevels = transactions.map(tx => tx.securityLevel || 1);
    const avgSecurityLevel = securityLevels.length > 0 
      ? securityLevels.reduce((sum, level) => sum + level, 0) / securityLevels.length 
      : 0;
    
    // For demo purposes, generate a random percent change
    const pendingChangePercent = Math.floor(Math.random() * 21) - 10; // -10% to +10%
    
    return {
      total: transactions.length,
      pending,
      confirming,
      confirmed,
      failed,
      verified,
      verificationPending,
      verificationFailed,
      verificationTimeout: Math.floor(Math.random() * 3), // Simulated for demo
      avgSecurityLevel,
      pendingChangePercent
    };
  }, [transactions]);
  
  // Refresh a specific transaction by ID
  const refreshTransaction = useCallback(async (txId: string): Promise<void> => {
    // In a real implementation, we would fetch the specific transaction from the blockchain
    // For this simulation, just update the status
    
    if (devModeEnabled) {
      setTransactions(prev => 
        prev.map(tx => {
          if (tx.id === txId) {
            // Simulate progress through transaction lifecycle
            if (tx.status === 'pending') {
              return { ...tx, status: 'confirming' };
            }
            if (tx.status === 'confirming') {
              return { 
                ...tx, 
                status: 'confirmed',
                confirmations: (tx.confirmations || 0) + 1
              };
            }
          }
          return tx;
        })
      );
    }
    
    return;
  }, [devModeEnabled]);
  
  // Refresh transactions from all chains - NOW USING REAL BACKEND API
  const refreshTransactions = useCallback(async () => {
    try {
      // Fetch REAL transaction data from backend API
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.transactions) {
        // Transform backend transaction data to frontend format
        const transformedTransactions: CrossChainTransaction[] = data.transactions.map((tx: any) => ({
          id: tx.id,
          txHash: tx.hash,
          correlationId: tx.id, // Use transaction ID as correlation ID
          blockchain: tx.chain,
          network: tx.chain === 'ETH' ? 'Ethereum' : tx.chain === 'SOL' ? 'Solana' : tx.chain === 'TON' ? 'TON' : 'Bitcoin',
          fromAddress: tx.metadata?.from || '0x0000000000000000000000000000000000000000',
          toAddress: tx.metadata?.to || '0x0000000000000000000000000000000000000000',
          amount: tx.metadata?.amount || 0,
          status: tx.status,
          timestamp: new Date(tx.createdAt).getTime(),
          confirmations: tx.confirmations,
          type: tx.operation as TransactionType || 'transfer',
          direction: 'outgoing',
          verificationStatus: tx.status === 'confirmed' ? 'verified' : tx.status === 'failed' ? 'failed' : 'pending',
          securityLevel: tx.metadata?.securityLevel || 1,
          vaultId: tx.metadata?.vaultId,
          error: tx.error
        }));
        
        setTransactions(transformedTransactions);
        console.log(`Fetched ${transformedTransactions.length} transactions from backend API`);
      } else if (devModeEnabled && data.transactions.length === 0) {
        // If no transactions in backend and dev mode, generate mock data
        if (transactions.length === 0) {
          const mockTransactions = generateMockTransactions();
          setTransactions(mockTransactions);
          console.log('No backend transactions, using mock data in dev mode');
        }
      }
      
      setLastUpdated(Date.now());
    } catch (error) {
      console.error('Error fetching transactions from backend:', error);
      
      // Fallback to mock data in dev mode if API fails
      if (devModeEnabled && transactions.length === 0) {
        const mockTransactions = generateMockTransactions();
        setTransactions(mockTransactions);
        console.log('API error, using mock data in dev mode');
      }
      
      setLastUpdated(Date.now());
    }
  }, [devModeEnabled, transactions]);
  
  // Get monitoring status
  const getMonitoringStatus = useCallback(() => {
    return {
      isMonitoring,
      lastUpdated,
      pollingInterval
    };
  }, [isMonitoring, lastUpdated, pollingInterval]);
  
  // Enhanced cross-chain verification methods
  const verifyTransactionWithEnhancedVerifier = useCallback(async (txId: string): Promise<boolean> => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return false;
    
    try {
      console.log(`Verifying transaction ${txId} with enhanced cross-chain verifier`);
      
      // Execute verification through enhanced verifier
      const result = await enhancedCrossChainVerifier.verifyTransaction({
        transactionId: tx.id,
        correlationId: tx.correlationId || tx.id,
        sourceNetwork: tx.network,
        initiatedAt: tx.timestamp,
        securityLevel: tx.securityLevel as SecurityLevel || 1,
        requireAllPaths: tx.securityLevel === 3 // Require all paths for highest security level
      });
      
      // Store result for reference
      setEnhancedVerificationResults(prev => ({
        ...prev,
        [txId]: result
      }));
      
      // Update the transaction's verification status based on result
      if (result.overallResult) {
        setTransactions(prev => 
          prev.map(t => {
            if (t.id === txId) {
              return {
                ...t,
                verificationStatus: 'verified',
                verificationTimestamp: Date.now()
              };
            }
            return t;
          })
        );
      } else {
        // If verification failed, update status
        setTransactions(prev => 
          prev.map(t => {
            if (t.id === txId) {
              return {
                ...t,
                verificationStatus: 'failed'
              };
            }
            return t;
          })
        );
      }
      
      // Return overall success
      return result.overallResult;
    } catch (error) {
      console.error('Error using enhanced verification:', error);
      return false;
    }
  }, [transactions]);
  
  // Get statistics for enhanced verification
  const getEnhancedVerificationStats = useCallback(() => {
    return enhancedCrossChainVerifier.getVerificationStats();
  }, []);
  
  // Transaction integrity monitoring integration
  
  // Get anomalies for a transaction or all transactions
  const getTransactionAnomalies = useCallback((transactionId?: string): TransactionAnomaly[] => {
    return transactionIntegrityMonitor.getAnomalies(transactionId);
  }, []);
  
  // Get integrity check results
  const getIntegrityCheckResults = useCallback((transactionId?: string): IntegrityCheckResult[] => {
    if (transactionId) {
      return transactionIntegrityMonitor.getTransactionIntegrityHistory(transactionId);
    }
    return transactionIntegrityMonitor.getIntegrityCheckHistory();
  }, []);
  
  // Get integrity monitoring status
  const getIntegrityMonitoringStatus = useCallback((): MonitoringStatus => {
    return transactionIntegrityMonitor.getMonitoringStatus();
  }, []);
  
  // Start integrity monitoring
  const startIntegrityMonitoring = useCallback((): boolean => {
    const result = transactionIntegrityMonitor.startMonitoring();
    setIntegrityMonitorActive(result);
    return result;
  }, []);
  
  // Stop integrity monitoring
  const stopIntegrityMonitoring = useCallback((): boolean => {
    const result = transactionIntegrityMonitor.stopMonitoring();
    setIntegrityMonitorActive(!result);
    return result;
  }, []);
  
  // Register transactions with integrity monitor when they change
  useEffect(() => {
    // Register all transactions with the integrity monitor
    transactions.forEach(tx => {
      transactionIntegrityMonitor.monitorTransaction(tx);
    });
  }, [transactions]);
  
  // Clear all transactions
  const clearAllTransactions = useCallback(() => {
    setTransactions([]);
    setTransactionGroups([]);
    setVerificationAttempts([]);
    setEnhancedVerificationResults({});
  }, []);
  
  // Set up periodic transaction refresh
  useEffect(() => {
    if (isMonitoring) {
      const intervalId = setInterval(() => {
        refreshTransactions();
      }, pollingInterval);
      
      return () => clearInterval(intervalId);
    }
  }, [isMonitoring, pollingInterval, refreshTransactions]);
  
  // Generate transaction groups whenever transactions change
  useEffect(() => {
    generateTransactionGroups();
  }, [transactions, generateTransactionGroups]);
  
  // Initial refresh
  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);
  
  // Computed derived state
  const recentTransactions = transactions.slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
  const pendingTransactions = transactions.filter(tx => tx.status === 'pending' || tx.status === 'confirming');
  
  // Context value
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
    refreshTransaction,
    getMonitoringStatus,
    getChainStats,
    getTransactionSummary,
    getRelatedTransactions,
    verifyTransaction,
    getVerificationAttempts,
    clearAllTransactions,
    // Enhanced verification methods
    verifyTransactionWithEnhancedVerifier,
    getEnhancedVerificationStats,
    // Transaction integrity monitoring
    getTransactionAnomalies,
    getIntegrityCheckResults,
    getIntegrityMonitoringStatus,
    startIntegrityMonitoring,
    stopIntegrityMonitoring
  };
  
  return (
    <TransactionMonitoringContext.Provider value={contextValue}>
      {children}
    </TransactionMonitoringContext.Provider>
  );
};

// Helper to generate mock transactions for development
function generateMockTransactions(): CrossChainTransaction[] {
  const mockTransactions: CrossChainTransaction[] = [];
  const networks: BlockchainNetwork[] = ['Ethereum', 'Solana', 'TON', 'Bitcoin'];
  const types: TransactionType[] = [
    'vault_creation', 
    'vault_update', 
    'vault_release', 
    'signature_request', 
    'signature_submission', 
    'cross_chain_verification', 
    'token_transfer', 
    'token_stake', 
    'atomic_swap'
  ];
  
  // Generate 5 transaction groups with primary + verification txs
  for (let i = 0; i < 5; i++) {
    const timestamp = Date.now() - Math.floor(Math.random() * 86400000); // Random time in last 24h
    const correlationId = `tx-group-${timestamp}-${i}`;
    const securityLevel = (Math.floor(Math.random() * 3) + 1) as SecurityLevel;
    
    // Create primary transaction
    const primaryNetwork = networks[Math.floor(Math.random() * networks.length)];
    const primaryType = types[Math.floor(Math.random() * types.length)];
    
    const primaryTx: CrossChainTransaction = {
      id: `tx-${timestamp}-${i}-primary`,
      network: primaryNetwork,
      type: primaryType,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      fromAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      toAddress: Math.random() > 0.3 ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined,
      amount: Math.random() > 0.5 ? (Math.random() * 10).toFixed(4) : undefined,
      symbol: Math.random() > 0.5 ? 'ETH' : undefined,
      fee: (Math.random() * 0.01).toFixed(6),
      timestamp,
      status: Math.random() > 0.7 ? 'confirmed' : Math.random() > 0.5 ? 'confirming' : 'pending',
      correlationId,
      verificationStatus: securityLevel === 1 ? 'not_required' : Math.random() > 0.6 ? 'verified' : 'pending',
      securityLevel,
      label: getTransactionLabel(primaryType)
    };
    
    mockTransactions.push(primaryTx);
    
    // Add verification transactions for security levels > 1
    if (securityLevel > 1) {
      const verificationCount = securityLevel === 3 ? 2 : 1;
      
      for (let j = 0; j < verificationCount; j++) {
        // Select a different network for verification
        const availableNetworks = networks.filter(n => n !== primaryNetwork);
        const verificationNetwork = availableNetworks[Math.floor(Math.random() * availableNetworks.length)];
        
        const verificationTx: CrossChainTransaction = {
          id: `tx-${timestamp}-${i}-verification-${j}`,
          network: verificationNetwork,
          type: 'cross_chain_verification',
          txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          fromAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          timestamp: timestamp + 60000 + Math.floor(Math.random() * 300000), // 1-6 min after primary
          status: Math.random() > 0.6 ? 'confirmed' : Math.random() > 0.5 ? 'confirming' : 'pending',
          correlationId,
          verificationStatus: 'not_required', // Verification txs don't need verification themselves
          fee: (Math.random() * 0.005).toFixed(6),
          label: 'Cross-Chain Verification'
        };
        
        mockTransactions.push(verificationTx);
      }
    }
  }
  
  // Add some standalone transactions
  for (let i = 0; i < 10; i++) {
    const timestamp = Date.now() - Math.floor(Math.random() * 86400000);
    const txType = types[Math.floor(Math.random() * types.length)];
    const network = networks[Math.floor(Math.random() * networks.length)];
    
    const tx: CrossChainTransaction = {
      id: `tx-single-${timestamp}-${i}`,
      network,
      type: txType,
      txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      fromAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      toAddress: Math.random() > 0.3 ? `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}` : undefined,
      amount: Math.random() > 0.5 ? (Math.random() * 10).toFixed(4) : undefined,
      symbol: Math.random() > 0.5 ? getSymbolForNetwork(network) : undefined,
      fee: (Math.random() * 0.01).toFixed(6),
      timestamp,
      status: Math.random() > 0.7 ? 'confirmed' : Math.random() > 0.5 ? 'confirming' : 'pending',
      correlationId: `tx-single-${timestamp}-${i}`,
      verificationStatus: 'not_required',
      securityLevel: 1,
      label: getTransactionLabel(txType)
    };
    
    mockTransactions.push(tx);
  }
  
  return mockTransactions;
}

// Helper to get token symbol for network
function getSymbolForNetwork(network: BlockchainNetwork): string {
  switch (network) {
    case 'Ethereum':
      return 'ETH';
    case 'Solana':
      return 'SOL';
    case 'TON':
      return 'TON';
    case 'Bitcoin':
      return 'BTC';
    default:
      return 'CRYPTO';
  }
}

// Helper to get human-readable transaction label
function getTransactionLabel(type: TransactionType): string {
  switch (type) {
    case 'vault_creation':
      return 'Vault Creation';
    case 'vault_update':
      return 'Vault Update';
    case 'vault_release':
      return 'Vault Release';
    case 'signature_request':
      return 'Signature Request';
    case 'signature_submission':
      return 'Signature Submission';
    case 'cross_chain_verification':
      return 'Cross-Chain Verification';
    case 'token_transfer':
      return 'Token Transfer';
    case 'token_stake':
      return 'Token Staking';
    case 'atomic_swap':
      return 'Atomic Swap';
    default:
      return type.replace('_', ' ');
  }
}

// Hook to use the transaction context
export const useTransactionMonitoring = () => {
  const context = useContext(TransactionMonitoringContext);
  if (!context) {
    throw new Error('useTransactionMonitoring must be used within a TransactionMonitoringProvider');
  }
  return context;
};