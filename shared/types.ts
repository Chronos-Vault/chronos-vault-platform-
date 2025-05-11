/**
 * Shared Types
 *
 * Common types used across the application for consistent interfaces.
 */

export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'BTC';

export enum VerificationMethod {
  STANDARD = 'STANDARD',
  CROSS_CHAIN = 'CROSS_CHAIN',
  MULTI_SIG = 'MULTI_SIG',
  ZERO_KNOWLEDGE = 'ZERO_KNOWLEDGE'
}

export enum VaultType {
  STANDARD = 'STANDARD',
  TIME_LOCKED = 'TIME_LOCKED',
  MULTI_SIG = 'MULTI_SIG',
  CROSS_CHAIN = 'CROSS_CHAIN',
  CONDITION_BASED = 'CONDITION_BASED',
  BITCOIN_HALVING = 'BITCOIN_HALVING',
  BITCOIN_PRICE = 'BITCOIN_PRICE'
}

export enum SecurityLevel {
  BASIC = 1,
  ADVANCED = 2,
  MAXIMUM = 3
}

/**
 * Blockchain role in the Triple-Chain Security architecture
 */
export enum ChainRole {
  PRIMARY = 'PRIMARY',         // Main ownership and access control (Ethereum)
  MONITORING = 'MONITORING',   // High-speed monitoring (Solana)
  RECOVERY = 'RECOVERY',       // Backup and recovery (TON)
  FALLBACK = 'FALLBACK'        // Extra fallback chain
}

/**
 * Recovery strategies for cross-chain failover
 */
export enum RecoveryStrategy {
  NONE = 'NONE',                  // No recovery needed
  RETRY = 'RETRY',                // Retry the operation with exponential backoff
  SWITCH_PRIMARY = 'SWITCH_PRIMARY', // Switch to a different primary chain
  PARTIAL_VERIFICATION = 'PARTIAL_VERIFICATION', // Use partial verification with available chains
  EMERGENCY_PROTOCOL = 'EMERGENCY_PROTOCOL' // Activate emergency protocol
}

/**
 * Chain status for monitoring
 */
export interface ChainStatus {
  blockchain: BlockchainType;
  isConnected: boolean;
  latestBlockNumber?: number;
  latestBlockTimestamp?: number;
  syncStatus: 'synced' | 'syncing' | 'error';
  latency: number;
  error?: string;
  lastUpdated: number;
}

/**
 * Quantum-resistant encryption level
 */
export enum QuantumResistanceLevel {
  STANDARD = 'STANDARD',   // Basic protection (e.g., Kyber-512, Dilithium2)
  ENHANCED = 'ENHANCED',   // Medium protection (e.g., Kyber-768, Dilithium3)
  MAXIMUM = 'MAXIMUM'      // Maximum protection (e.g., Kyber-1024, Dilithium5)
}

/**
 * Cross-chain verification result for Triple-Chain security
 */
export interface TripleChainVerificationResult {
  vaultId: string;
  primaryChain: {
    blockchain: BlockchainType;
    verified: boolean;
    confirmations: number;
    timestamp: number;
  };
  monitoringChain: {
    blockchain: BlockchainType;
    verified: boolean;
    confirmations: number;
    timestamp: number;
  };
  recoveryChain: {
    blockchain: BlockchainType;
    verified: boolean;
    confirmations: number;
    timestamp: number;
  };
  overallStatus: 'secure' | 'warning' | 'compromised';
  confidenceScore: number;
  zkProofVerified: boolean;
  timestamp: number;
}

export interface StressTestConfig {
  iterations: number;
  concurrency: number;
  delay: number;
  timeoutMs: number;
  chains: BlockchainType[];
  isDevelopmentMode: boolean;
}