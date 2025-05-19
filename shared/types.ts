// Shared types used across the application

export type BlockchainType = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';

// Define roles for different chains in the system
export enum ChainRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  VERIFICATION = 'verification',
  FALLBACK = 'fallback'
}

// Define security levels
export enum SecurityLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  ADVANCED = 'advanced',
  QUANTUM_RESISTANT = 'quantum_resistant'
}

// Define recovery strategies
export enum RecoveryStrategy {
  RETRY = 'retry',
  FALLBACK_CHAIN = 'fallback_chain',
  MANUAL_RESOLUTION = 'manual_resolution',
  NOTIFY_USER = 'notify_user',
  AUTO_RESOLVE = 'auto_resolve'
}

// Define error categories for cross-chain operations
export enum CrossChainErrorCategory {
  // Network related
  CONNECTION_FAILURE = 'connection_failure',
  NETWORK_FAILURE = 'network_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NODE_SYNCING = 'node_syncing',
  
  // Transaction related
  TRANSACTION_FAILURE = 'transaction_failure',
  VALIDATION_FAILURE = 'validation_failure',
  
  // Cross-chain specific
  CROSS_CHAIN_SYNC_ERROR = 'cross_chain_sync_error',
  CHAIN_UNAVAILABLE = 'chain_unavailable',
  VERIFICATION_TIMEOUT = 'verification_timeout',
  
  // Security related
  SECURITY_VIOLATION = 'security_violation',
  
  // Fallback
  UNKNOWN = 'unknown'
}