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
}