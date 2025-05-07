export type TransactionStatus = 'pending' | 'confirming' | 'confirmed' | 'failed';
export type VerificationStatus = 'not_required' | 'pending' | 'verified' | 'failed' | 'timeout';
export type BlockchainNetwork = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';
export type TransactionType = 
  | 'vault_creation' 
  | 'vault_update' 
  | 'vault_release' 
  | 'signature_request' 
  | 'signature_submission' 
  | 'cross_chain_verification' 
  | 'token_transfer' 
  | 'token_stake' 
  | 'atomic_swap';

export type SecurityLevel = 1 | 2 | 3;

export interface CrossChainTransaction {
  id: string;
  network: BlockchainNetwork;
  type: TransactionType;
  txHash: string;
  fromAddress: string;
  toAddress?: string;
  contractAddress?: string;
  amount?: string;
  symbol?: string;
  fee?: string;
  timestamp: number;
  status: TransactionStatus;
  blockNumber?: number;
  confirmations?: number;
  securityLevel?: SecurityLevel;
  
  // Cross-chain verification related fields
  correlationId: string; // Used to link related transactions across chains
  verificationStatus: VerificationStatus;
  verificationTimestamp?: number;
  verifiedBy?: BlockchainNetwork[];
  label?: string; // Human-readable label
}

export interface TransactionGroup {
  id: string;
  primaryTransaction: CrossChainTransaction;
  verificationTransactions: CrossChainTransaction[];
  status: 'pending' | 'completed' | 'failed';
  securityLevel: SecurityLevel;
  createdAt: number;
  completedAt?: number;
}

export interface VerificationAttempt {
  id: string;
  transactionId: string;
  correlationId: string;
  network: BlockchainNetwork;
  timestamp: number;
  status: 'success' | 'failed';
  reason?: string;
}

export interface TransactionStatistics {
  totalTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  crossChainVerifications: number;
  succeededVerifications: number;
  failedVerifications: number;
  networkBreakdown: Record<BlockchainNetwork, number>;
  averageConfirmationTime: number;
}