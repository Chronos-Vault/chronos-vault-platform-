/**
 * Blockchain Types
 * 
 * Shared type definitions for blockchain operations across the application.
 * These types are used by both the frontend and backend.
 */

// Chain enum for type safety
export enum ChainType {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton',
  BITCOIN = 'bitcoin',
}

// Blockchain type for API parameters
export type BlockchainType = 'ethereum' | 'solana' | 'ton' | 'bitcoin' | 'ETH' | 'SOL' | 'TON' | 'BTC';

// Transaction status
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

// Network types
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

// Generic transaction result
export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  blockHash?: string;
  timestamp?: Date;
  from?: string;
  to?: string;
  value?: string;
  gasUsed?: number;
  chainId: string;
  error?: string;
  message?: string;
  vaultId?: string;
}

// Vault creation parameters
export interface VaultCreationParams {
  name: string;
  description?: string;
  unlockDate: Date;
  beneficiaries?: string[];
  assetType: string; // e.g., 'token', 'nft', 'data'
  amount?: string;
  securityLevel: 1 | 2 | 3; // 1: Basic, 2: Enhanced, 3: Triple-Chain
  multiSigThreshold?: number; // Required signatures for multi-sig
  geolocationRestriction?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  accessKey?: string; // Optional access key/password
  metadata?: Record<string, any>; // Additional metadata
}

// Vault data
export interface VaultData {
  id: string;
  owner: string;
  name: string;
  description?: string;
  createdAt: Date;
  unlockDate: Date;
  beneficiaries: string[];
  assetType: string;
  amount: string;
  securityLevel: 1 | 2 | 3;
  multiSigThreshold?: number;
  geolocationRestriction?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  isLocked: boolean;
  status: 'pending' | 'active' | 'expired' | 'withdrawn';
  transactions: string[]; // Transaction hashes
  mainChain: string;
  verificationChains?: string[];
}

// Multi-signature request status
export interface MultiSigRequestStatus {
  requestId: string;
  operation: 'create' | 'withdraw' | 'update' | 'transfer';
  vaultId: string;
  initiator: string;
  timestamp: Date;
  approved: number;
  required: number;
  executed: boolean;
  approvals: string[]; // Addresses that have approved
  rejections: string[]; // Addresses that have rejected
}

// Security verification result
export interface SecurityVerification {
  isValid: boolean;
  signatures: string[];
  verifiedAt: Date;
  chainId: string;
  verificationMethod?: string;
  message?: string;
}

// Cross-chain transaction
export interface CrossChainTransaction {
  id: string;
  sourceChain: string;
  targetChain: string;
  sourceVaultId: string;
  targetVaultId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  transactionHashes: Record<string, string>;
  error?: string;
}

// Blockchain wallet data
export interface WalletData {
  address: string;
  network: NetworkType;
  balance: {
    total: string;
    formatted: string;
    symbol: string;
    decimals: number;
  };
  isConnected: boolean;
  isTestnet: boolean;
}

// Bitcoin-specific data
export interface BitcoinData {
  // Current block height from blockchain
  blockHeight: number;
  
  // Blocks until next halving
  blocksUntilHalving: number;
  
  // Estimated date of next halving
  estimatedHalvingDate: Date;
  
  // Days until halving
  daysUntilHalving: number;
  
  // Current block reward
  currentReward: number;
  
  // Future reward after next halving
  nextReward: number;
  
  // Price information
  price: {
    usd: number;
    usd_24h_change: number;
  };
}

// Security event types for logging
export interface SecurityEventType {
  // Event data varies based on the context
  [key: string]: any;
}

// Vault status info (used by blockchain connectors)
export interface VaultStatusInfo {
  id: string;
  owner: string;
  unlockDate: Date;
  isLocked: boolean;
  balance: string;
  chainId: string;
  network: string;
  securityLevel: string | number;
  lastActivity: Date;
  beneficiaries?: string[];
  metadata?: Record<string, any>;
}

// Zero-Knowledge Proof
export interface ZKProof {
  proof: string;
  publicSignals: string[];
  verified: boolean;
  timestamp: Date;
}

// Vault fee structure
export interface VaultFeeStructure {
  baseFee: number; // Base fee in USD
  securityLevelMultiplier: number; // Multiplier based on security level
  timeLockMultiplier: number; // Multiplier based on time lock duration
  valueBasedFee?: number; // Fee based on vault value
  discountedFee?: number; // Fee after any discounts
  tokenDiscount?: number; // Discount for CVT token holders
}

// Token data (for CVT token)
export interface TokenData {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  totalSupply: string;
  circulatingSupply: string;
  price: number;
  marketCap: number;
  holderCount: number;
  chainId: string;
}

// Bridge status for cross-chain bridges
export interface BridgeStatus {
  sourceChain: string;
  targetChain: string;
  status: 'operational' | 'degraded' | 'offline';
  lastChecked: Date;
  latency: number; // Milliseconds
  isActive: boolean;
  pendingTransactions: number;
  totalTransactions: number;
  successRate: number; // Percentage
  message?: string;
}

// Status for atomic swaps between chains
export type AtomicSwapStatus = 'initiated' | 'locked' | 'completed' | 'expired' | 'refunded' | 'failed';

// Atomic swap parameters for creation
export interface AtomicSwapParams {
  initiatorChain: BlockchainType;
  responderChain: BlockchainType;
  initiatorAsset: string;
  responderAsset: string;
  initiatorAmount: number;
  responderAmount: number;
  initiatorAddress: string;
  responderAddress: string;
  timelock: number; // Seconds
}

// Bridge transaction parameters
export interface BridgeTransactionParams {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  amount: number;
  assetType: string;
  senderAddress: string;
  recipientAddress: string;
}

// Cross-chain message relay
export interface CrossChainMessage {
  id: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  message: any;
  status: 'pending' | 'delivered' | 'failed';
  timestamp: Date;
  deliveredAt?: Date;
  transactionHashes: Record<string, string>;
  error?: string;
}

// Cross-chain verification protocol status
export interface VerificationProtocolStatus {
  protocol: string;
  status: 'active' | 'inactive';
  lastUpdated: Date;
  supportedChains: BlockchainType[];
  verificationLatency: number; // Milliseconds
  reliability: number; // Percentage
}

// Cross-chain asset data
export interface CrossChainAsset {
  name: string;
  symbol: string;
  nativeChain: BlockchainType;
  supportedChains: BlockchainType[];
  decimals: Record<BlockchainType, number>;
  addresses: Record<BlockchainType, string>;
  bridgeSupport: boolean;
  atomicSwapSupport: boolean;
}

// TVL (Total Value Locked) in bridge
export interface BridgeTVL {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  totalValueLocked: Record<string, number>; // Asset symbol to value in USD
  lastUpdated: Date;
}

// Atomic swap fee structure
export interface AtomicSwapFee {
  initiatorChain: BlockchainType;
  responderChain: BlockchainType;
  baseFee: number; // In USD
  percentageFee: number; // Percentage of swap amount
  gasEstimation: Record<BlockchainType, number>; // Estimated gas cost per chain
  totalFeeUsd: number; // Total fee in USD
}