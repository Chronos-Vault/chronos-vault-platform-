/**
 * Transaction types for the Chronos Vault Transaction Monitoring system
 * Provides interfaces for cross-chain transaction tracking
 */

export type BlockchainNetwork = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin' | string;
export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed' | string;
export type VerificationStatus = 'verified' | 'pending' | 'failed' | 'not_required' | string;
export type TransactionType = 
  'vault_creation' | 
  'vault_update' | 
  'vault_release' | 
  'signature_request' | 
  'signature_submission' | 
  'cross_chain_verification' | 
  'token_transfer' | 
  'token_stake' | 
  'atomic_swap' | 
  string;

export type SecurityLevel = 1 | 2 | 3;

/**
 * Represents a transaction on any supported blockchain
 */
export interface CrossChainTransaction {
  // Core transaction properties
  id: string;
  txHash: string;
  network: 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin' | string;
  status: 'pending' | 'confirming' | 'confirmed' | 'failed' | string;
  type: string;
  timestamp: number;
  
  // Transaction details
  fromAddress: string;
  toAddress?: string;
  amount?: string | number;
  symbol?: string;
  fee?: string | number;
  feeCurrency?: string;
  blockNumber?: number;
  confirmations?: number;
  
  // Display properties
  label?: string;
  description?: string;
  
  // Security and verification
  securityLevel?: number;
  verificationStatus?: 'verified' | 'pending' | 'failed' | 'not_required' | string;
  verifiedAt?: number;
  verifierAddress?: string;
  securityNotes?: string;
  
  // Cross-chain correlation
  correlationId?: string;
  relatedTxIds?: string[];
}

/**
 * Represents a group of related cross-chain transactions
 */
export interface TransactionGroup {
  id: string;
  name?: string;
  description?: string;
  transactionIds: string[];
  primaryNetwork?: string;
  securityLevel: number;
  createdAt: number;
  updatedAt: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | string;
  vaultId?: string;
  initiator?: string;
  metadata?: Record<string, any>;
}

/**
 * Transaction monitoring context interface
 */
export interface TransactionContextType {
  // Transaction data
  transactions: CrossChainTransaction[];
  transactionGroups: TransactionGroup[];
  
  // Fetching and refreshing
  refreshTransactions: () => Promise<void>;
  refreshTransaction: (txId: string) => Promise<void>;
  
  // Transaction utility functions
  getRelatedTransactions: (correlationId: string) => CrossChainTransaction[];
  getMonitoringStatus: () => { 
    isMonitoring: boolean;
    lastUpdated: number | null;
    pollingInterval: number;
  };
}

/**
 * Transaction filtering options
 */
export interface TransactionFilterOptions {
  network?: string;
  status?: string;
  fromAddress?: string;
  toAddress?: string;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: number;
  toDate?: number;
  type?: string;
  securityLevel?: number;
}

/**
 * Transaction network statistics
 */
export interface NetworkTransactionStats {
  [network: string]: number;
}

/**
 * Transaction summary statistics
 */
export interface TransactionSummary {
  total: number;
  pending: number;
  confirming: number;
  confirmed: number;
  failed: number;
  verified: number;
  verificationPending: number;
  verificationFailed: number;
  verificationTimeout: number;
  avgSecurityLevel: number;
  pendingChangePercent: number;
}