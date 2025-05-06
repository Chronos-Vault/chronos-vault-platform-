/**
 * Shared Types
 * 
 * Common type definitions used across the application.
 */

// Supported blockchain types
export enum BlockchainType {
  TON = 'TON',
  ETHEREUM = 'ETH',
  SOLANA = 'SOL',
  POLYGON = 'POLYGON',
  BITCOIN = 'BTC'
}

// Transaction types
export enum TransactionType {
  CREATE_VAULT = 'CREATE_VAULT',
  MODIFY_VAULT = 'MODIFY_VAULT',
  DELETE_VAULT = 'DELETE_VAULT',
  DEPOSIT_ASSET = 'DEPOSIT_ASSET',
  WITHDRAW_ASSET = 'WITHDRAW_ASSET',
  TRANSFER_ASSET = 'TRANSFER_ASSET',
  UNLOCK_VAULT = 'UNLOCK_VAULT',
  ADD_BENEFICIARY = 'ADD_BENEFICIARY',
  REMOVE_BENEFICIARY = 'REMOVE_BENEFICIARY',
  MODIFY_BENEFICIARY = 'MODIFY_BENEFICIARY',
  SIGNATURE_OPERATION = 'SIGNATURE_OPERATION'
}

// Vault metadata type
export interface VaultMetadata {
  name?: string;
  description?: string;
  tags?: string[];
  customData?: Record<string, any>;
  [key: string]: any; // Allow for flexible additional fields
}

// Cross-chain transaction status
export enum CrossChainTxStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERTED = 'REVERTED'
}

// Security incident types
export enum SecurityIncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_TRANSACTION = 'SUSPICIOUS_TRANSACTION',
  MULTI_SIG_FAILURE = 'MULTI_SIG_FAILURE',
  CROSS_CHAIN_DISCREPANCY = 'CROSS_CHAIN_DISCREPANCY',
  INTEGRITY_VIOLATION = 'INTEGRITY_VIOLATION',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  UNUSUAL_GEOLOCATION = 'UNUSUAL_GEOLOCATION'
}

// Security incident severity
export enum SecurityIncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Cross-chain transaction type for bridge operations
export interface CrossChainTransaction {
  id: string;
  vaultId: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceTxHash: string;
  targetTxHash?: string;
  amount: string;
  assetType: string;
  status: CrossChainTxStatus;
  createdAt: Date;
  completedAt?: Date;
  verificationProof?: string;
  metadata?: Record<string, any>;
}

// Security verification result type
export interface SecurityVerification {
  isVerified: boolean;
  timestamp: number;
  vaultId: string;
  integrityScore: number; // 0-100
  securityAlerts: {
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    code?: string;
  }[];
  chainId: string;
  verificationMethod: string;
  metadata?: Record<string, any>;
}

// Extension to Express Request for security features
declare global {
  namespace Express {
    interface Request {
      securityAlert?: any;
      securityChallenge?: boolean;
    }
    
    interface Session {
      userId?: string;
      userRole?: string;
      nonce?: string;
      siwe?: {
        address: string;
      };
    }
  }
}
