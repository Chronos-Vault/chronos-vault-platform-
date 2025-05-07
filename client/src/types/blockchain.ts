/**
 * Common blockchain types for Chronos Vault
 */

// ===== SOLANA TYPES =====

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

// ===== ETHEREUM TYPES =====

/**
 * Ethereum connection status
 */
export enum EthereumConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

/**
 * Ethereum network
 */
export enum EthereumNetwork {
  MAINNET = 'mainnet',
  SEPOLIA = 'sepolia',
  GOERLI = 'goerli',
  LOCALHOST = 'localhost'
}

/**
 * Ethereum wallet information
 */
export interface EthereumWalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

// ===== TON TYPES =====

/**
 * TON connection status
 */
export enum TONConnectionStatus {
  CONNECTED = 'connected',
  CONNECTING = 'connecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error'
}

/**
 * TON network
 */
export enum TONNetwork {
  MAINNET = 'mainnet',
  TESTNET = 'testnet'
}

/**
 * TON wallet information
 */
export interface TONWalletInfo {
  address: string;
  balance: string;
  network: string;
}

// ===== CROSS-CHAIN TYPES =====

/**
 * Supported blockchains in Triple-Chain Security
 */
export enum Blockchain {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton'
}

/**
 * Cross-chain transaction status
 */
export enum CrossChainTxStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

/**
 * Cross-chain verification status
 */
export enum VerificationStatus {
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  FAILED = 'failed'
}

/**
 * Cross-chain transaction
 */
export interface CrossChainTransaction {
  id: string;
  sourceChain: Blockchain;
  targetChain: Blockchain;
  sourceAddress: string;
  targetAddress: string;
  amount: string;
  status: CrossChainTxStatus;
  timestamp: number;
  hash?: string;
  vaultId?: string;
}

/**
 * Security level for vaults
 */
export enum SecurityLevel {
  BASIC = 1,
  ENHANCED = 2,
  MAXIMUM = 3
}