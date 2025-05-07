export type BlockchainNetwork = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';

export type TransactionType = 
  | 'transfer' 
  | 'vault_creation' 
  | 'vault_unlock' 
  | 'verification' 
  | 'cross_chain_bridge' 
  | 'multi_signature' 
  | 'contract_interaction';

export type TransactionStatus = 
  | 'pending' 
  | 'confirming' 
  | 'confirmed' 
  | 'failed';

export type VerificationStatus = 
  | 'not_required' 
  | 'pending'
  | 'verified'
  | 'failed'
  | 'timeout';

/**
 * Base transaction interface with common properties
 */
export interface BaseTransaction {
  // Core transaction data
  id: string;
  txHash: string;
  network: BlockchainNetwork;
  timestamp: number;
  type: TransactionType;
  status: TransactionStatus;
  
  // Addresses involved
  fromAddress: string;
  toAddress?: string;
  
  // Asset information
  amount?: string;
  symbol?: string;
  
  // Metadata
  blockNumber?: number;
  confirmations?: number;
  fee?: string;
  nonce?: number;
  gasUsed?: string;
  
  // UI enhancement fields
  label?: string;
  description?: string;
}

/**
 * Extended transaction interface for cross-chain operations
 */
export interface CrossChainTransaction extends BaseTransaction {
  // The correlation ID that links transactions across chains
  correlationId: string;
  
  // References to related transactions
  relatedTransactions?: string[];
  
  // Cross-chain verification status
  verificationStatus: VerificationStatus;
  
  // Details about verification
  verifiedBy?: BlockchainNetwork[];
  verificationTimestamp?: number;
  
  // Vault information if related to a vault
  vaultId?: string;
  unlockTime?: number;
  
  // Additional security features
  securityLevel?: 1 | 2 | 3;
  multiSigRequired?: boolean;
  multiSigApprovals?: number;
  multiSigThreshold?: number;
  
  // When verification times out
  verificationTimeout?: number;
  
  // Contract-specific information
  contractAddress?: string;
  functionName?: string;
  parameters?: Record<string, any>;
}

/**
 * Group of related cross-chain transactions
 */
export interface TransactionGroup {
  correlationId: string;
  primaryTransaction: CrossChainTransaction;
  verificationTransactions: CrossChainTransaction[];
  createdAt: number;
  updatedAt: number;
  status: 'pending' | 'completed' | 'failed';
  completedAt?: number;
}

/**
 * Interface for recording verification attempts
 */
export interface VerificationAttempt {
  id: string;
  correlationId: string;
  timestamp: number;
  network: BlockchainNetwork;
  status: 'success' | 'failed';
  reason?: string;
  attemptNumber: number;
}

/**
 * Transaction cache structure for the monitoring service
 */
export interface TransactionCache {
  byId: Record<string, CrossChainTransaction>;
  byCorrelationId: Record<string, string[]>;
  byNetwork: Record<BlockchainNetwork, string[]>;
  byStatus: Record<TransactionStatus, string[]>;
  byVerificationStatus: Record<VerificationStatus, string[]>;
  groups: Record<string, TransactionGroup>;
}