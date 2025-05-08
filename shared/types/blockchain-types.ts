/**
 * Blockchain Types
 * 
 * Common type definitions for blockchain operations across 
 * Ethereum, Solana, TON, and Bitcoin connectors.
 */

/**
 * Parameters for creating a new vault
 */
export interface VaultCreationParams {
  // Vault owner address (default: connected wallet)
  owner?: string;
  
  // Time when the vault can be unlocked
  unlockDate: Date;
  
  // Optional label for the vault
  label?: string;
  
  // Optional security level (defaults based on implementation)
  // low: standard time-lock
  // medium: time-lock + access control
  // high: time-lock + access control + cross-chain verification
  securityLevel?: 'low' | 'medium' | 'high';
  
  // Optional list of beneficiary addresses
  beneficiaries?: string[];
  
  // Optional chain-specific parameters
  chainSpecificParams?: Record<string, any>;
  
  // Optional zero-knowledge privacy settings
  zkPrivacy?: {
    enabled: boolean;
    hideBalance?: boolean;
    hideUnlockDate?: boolean;
    hideOwner?: boolean;
    hideBeneficiaries?: boolean;
    encryptedNotes?: string;
  };
  
  // Multi-signature configuration (if applicable)
  multiSigConfig?: {
    requiredSignatures: number;
    signers: string[];
  };
  
  // Cross-chain verification settings (if applicable)
  crossChainVerification?: {
    enabled: boolean;
    verificationChains: string[]; // e.g., ['ethereum', 'solana', 'ton']
  };
}

/**
 * Information about a vault's status
 */
export interface VaultStatusInfo {
  // Vault ID (implementation-specific format)
  id: string;
  
  // Vault owner address
  owner: string;
  
  // Time when the vault can be unlocked
  unlockDate: Date;
  
  // Whether the vault is currently locked
  isLocked: boolean;
  
  // Current asset balance in the vault
  balance: string;
  
  // Blockchain chain ID
  chainId: string;
  
  // Network version
  network: string;
  
  // Security level of the vault
  securityLevel: 'low' | 'medium' | 'high';
  
  // Time of last activity
  lastActivity: Date;
  
  // Optional vault label
  label?: string;
  
  // Optional list of beneficiary addresses
  beneficiaries?: string[];
  
  // Optional multi-signature configuration
  multiSigConfig?: {
    requiredSignatures: number;
    signers: string[];
    currentApprovals?: number;
  };
  
  // Optional cross-chain verification status
  crossChainVerification?: {
    enabled: boolean;
    verificationChains: string[];
    lastVerified?: Date;
  };
  
  // Optional zero-knowledge privacy status
  zkPrivacy?: {
    enabled: boolean;
    hideBalance: boolean;
    hideUnlockDate: boolean;
    hideOwner: boolean;
    hideBeneficiaries: boolean;
    encryptionScheme: string;
  };
  
  // Additional chain-specific properties
  [key: string]: any;
}

/**
 * Result of a blockchain transaction
 */
export interface TransactionResult {
  // Whether the transaction was successful
  success: boolean;
  
  // Transaction hash/ID if available
  transactionHash?: string;
  
  // Optional error message if transaction failed
  error?: string;
  
  // Optional vault ID related to the transaction
  vaultId?: string;
  
  // Chain ID where the transaction occurred
  chainId: string;
  
  // Additional chain-specific data
  [key: string]: any;
}

/**
 * Security verification result
 */
export interface SecurityVerification {
  // Whether the verification was successful
  isValid: boolean;
  
  // Optional error message if verification failed
  error?: string;
  
  // Optional array of cryptographic signatures
  signatures?: string[];
  
  // Time of verification
  verifiedAt: Date;
  
  // Chain ID where the verification occurred
  chainId: string;
  
  // Additional chain-specific verification data
  [key: string]: any;
}

/**
 * Cross-chain transaction information
 */
export interface CrossChainTransaction {
  // Transaction ID
  id: string;
  
  // Source chain ID
  sourceChain: string;
  
  // Target chain ID
  targetChain: string;
  
  // Source vault ID
  sourceVaultId: string;
  
  // Target vault ID (if available)
  targetVaultId?: string;
  
  // Transaction status
  status: 'pending' | 'completed' | 'failed';
  
  // Transaction timestamps
  createdAt: Date;
  completedAt?: Date;
  
  // Error message if failed
  error?: string;
  
  // Chain-specific transaction hashes
  transactionHashes: Record<string, string>;
}

/**
 * Multi-signature request status
 */
export interface MultiSigRequestStatus {
  // Request ID
  requestId: string;
  
  // Operation being requested
  operation: string;
  
  // Related vault ID
  vaultId: string;
  
  // Address that initiated the request
  initiator: string;
  
  // Current number of approvals
  approvals: number;
  
  // Number of approvals required
  requiredApprovals: number;
  
  // Whether the request has been executed
  executed: boolean;
  
  // Timestamp when executed (if applicable)
  executionTimestamp?: Date;
  
  // Chain ID where the request exists
  chainId: string;
  
  // Additional chain-specific data
  [key: string]: any;
}

/**
 * Event type for security logging
 */
export interface SecurityEventType {
  // Event category
  category: 'transaction' | 'vault' | 'authentication' | 'cross-chain' | 'system';
  
  // Event severity
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  // Detailed event information
  details: Record<string, any>;
  
  // Event timestamp
  timestamp?: Date;
  
  // Related chain IDs
  chainIds?: string[];
  
  // Related vault ID
  vaultId?: string;
  
  // Related user/address
  userAddress?: string;
}

/**
 * Chain-specific features
 */
export interface ChainFeatures {
  // Chain ID
  chainId: string;
  
  // Chain name
  name: string;
  
  // Whether the chain is a testnet
  isTestnet: boolean;
  
  // Native token symbol
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  
  // Chain capabilities
  capabilities: Record<string, boolean>;
  
  // Block time in seconds (approximate)
  blockTime: number;
  
  // Fee estimation mechanism
  feeEstimationSupported: boolean;
  
  // Any chain-specific properties
  [key: string]: any;
}