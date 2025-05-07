/**
 * Solana Types for Chronos Vault
 * 
 * Common types used across the Solana integration
 */

// Connection status
export enum SolanaConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

// Cluster type
export enum SolanaCluster {
  MAINNET = 'mainnet-beta',
  DEVNET = 'devnet',
  TESTNET = 'testnet'
}

// Wallet info type
export interface SolanaWalletInfo {
  address: string;
  balance: number;
  network: string;
}