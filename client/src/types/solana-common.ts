/**
 * Core Solana type definitions for Chronos Vault
 * This is the central source of truth for Solana types
 */

/**
 * Solana connection status enumeration
 */
export enum SolanaConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

/**
 * Solana error types categorized for better error handling
 */
export enum SolanaErrorType {
  NETWORK_ERROR = 'network_error',       // Network connectivity issues
  RPC_ERROR = 'rpc_error',               // RPC endpoint issues
  WALLET_ERROR = 'wallet_error',         // Wallet-related issues (connection, permissions)
  PROGRAM_ERROR = 'program_error',       // Smart contract program errors
  TRANSACTION_ERROR = 'transaction_error', // Transaction construction, signing, or sending errors
  VALIDATION_ERROR = 'validation_error', // Transaction or data validation errors
  RATE_LIMIT_ERROR = 'rate_limit_error', // Rate limiting from RPC providers
  UNKNOWN_ERROR = 'unknown_error'        // Fallback for unclassified errors
}

/**
 * Connection quality assessment
 */
export type ConnectionQuality = 'excellent' | 'good' | 'poor' | 'failed';

/**
 * Enhanced Solana connection state with more detailed error information
 */
export interface EnhancedSolanaConnectionState {
  isConnected: boolean;
  connectionQuality: ConnectionQuality;
  lastError: string | null;
  errorType: SolanaErrorType | null;
  lastSyncTimestamp: number;
  retryAttempt: number;
  circuitBreakerOpen: boolean;
}

/**
 * Solana network cluster enumeration
 */
export enum SolanaCluster {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

/**
 * Solana wallet information interface
 */
export interface SolanaWalletInfo {
  address: string;
  balance: number;
  network: string;
}

/**
 * Solana wallet adapter interface
 */
export interface SolanaWallet {
  name: string;
  adapter: any;
  publicKey?: any; // Allow PublicKey for development mode
}

/**
 * RPC Endpoint configuration
 */
export interface SolanaRpcEndpoint {
  url: string;
  priority: number; // Lower values = higher priority
  weight: number;   // Higher values = more requests routed here
  isHealthy: boolean;
  lastChecked: number; // timestamp
  responseTime?: number; // ms
}

/**
 * Transaction verification result
 */
export interface SolanaTransactionVerification {
  isValid: boolean;
  confirmations: number;
  blockTime?: number;
  slot?: number;
  error?: string;
  errorType?: SolanaErrorType;
}