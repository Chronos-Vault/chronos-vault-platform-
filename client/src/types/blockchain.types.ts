/**
 * Blockchain Types
 * 
 * This file contains common blockchain type definitions
 * used throughout the application.
 */

// Supported blockchain types
export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'BTC';

// Blockchain network types
export type BlockchainNetwork = 'mainnet' | 'testnet' | 'devnet';

// Transaction status
export type TransactionStatus = 
  | 'pending'
  | 'confirming'
  | 'confirmed'
  | 'failed'
  | 'rejected';

// Zero-knowledge proof type
export enum ZkProofType {
  VAULT_OWNERSHIP = 'VAULT_OWNERSHIP',
  ASSET_VERIFICATION = 'ASSET_VERIFICATION',
  ACCESS_AUTHORIZATION = 'ACCESS_AUTHORIZATION',
  TRANSACTION_VERIFICATION = 'TRANSACTION_VERIFICATION',
  CROSS_CHAIN = 'CROSS_CHAIN',
  MULTI_SIG = 'MULTI_SIG',
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION'
}

// Verification method
export enum VerificationMethod {
  STANDARD = 'STANDARD',
  CROSS_CHAIN = 'CROSS_CHAIN',
  MULTI_SIG = 'MULTI_SIG',
  ZERO_KNOWLEDGE = 'ZERO_KNOWLEDGE'
}

// Blockchain-specific configuration
export interface BlockchainConfig {
  chain: BlockchainType;
  network: BlockchainNetwork;
  rpcUrl?: string;
  explorerUrl?: string;
  chainId?: number | string;
  simulationMode: boolean;
}

// Verification level
export type VerificationLevel = 'basic' | 'standard' | 'advanced';

// Cross-chain verification status
export type VerificationStatus = 
  | 'pending'
  | 'in_progress'
  | 'verified'
  | 'failed';