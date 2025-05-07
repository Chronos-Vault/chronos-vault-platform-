/**
 * SOLANA TYPES - CENTRAL DEFINITION FILE
 * 
 * This is the ONLY source of truth for all Solana-related types
 * in the Chronos Vault application. All other files should import
 * types from this file to avoid circular dependencies and compilation issues.
 */

/**
 * Solana connection status
 */
export enum SolanaConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

/**
 * Solana network cluster
 */
export enum SolanaCluster {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

/**
 * Solana wallet information
 */
export interface SolanaWalletInfo {
  address: string;
  balance: number;
  network: string;
}

/**
 * Solana wallet adapter
 */
export interface SolanaWallet {
  name: string;
  adapter: any;
}