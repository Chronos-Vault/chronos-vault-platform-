/**
 * Solana types for Chronos Vault
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