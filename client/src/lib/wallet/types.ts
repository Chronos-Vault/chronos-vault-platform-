/**
 * Unified blockchain wallet system for Chronos Vault
 * Provides a common interface for connecting to different blockchain wallets
 */

/**
 * Supported blockchain types in the application
 */
export enum BlockchainType {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton',
  BITCOIN = 'bitcoin'
}

/**
 * Connection status for any wallet
 */
export enum WalletConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected'
}

/**
 * Network type for each blockchain
 */
export type NetworkType = 'mainnet' | 'testnet' | 'devnet' | 'localnet';

/**
 * Base wallet information interface
 */
export interface WalletInfo {
  address: string;
  balance: string;
  network: NetworkType;
  publicKey?: string;
  blockchain: BlockchainType;
}

/**
 * Base transaction result interface
 */
export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Base vault creation result interface
 */
export interface VaultCreationResult {
  success: boolean;
  vaultAddress?: string;
  error?: string;
}

/**
 * Parameters for vault creation
 */
export interface CreateVaultParams {
  unlockTime: number;
  recipient?: string;
  amount: string;
  comment?: string;
}

/**
 * Common wallet interface that all blockchain-specific wallet providers should implement
 */
export interface IWalletProvider {
  // Connection methods
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  
  // Status and info
  getConnectionStatus(): WalletConnectionStatus;
  getWalletInfo(): WalletInfo | null;
  
  // Blockchain specific
  getBlockchainType(): BlockchainType;
  switchNetwork(network: NetworkType): void;
  
  // Transaction methods
  sendTransaction(params: any): Promise<TransactionResult>;
  createVault(params: CreateVaultParams): Promise<VaultCreationResult>;
}