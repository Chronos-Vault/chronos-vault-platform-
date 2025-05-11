/**
 * Blockchain types
 */

// Chain types
export type BlockchainType = 'ethereum' | 'solana' | 'ton' | 'bitcoin';

// Network types
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

// Transaction status
export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

// Asset type
export interface Asset {
  symbol: string;
  name: string;
  decimals: number;
  contractAddress?: string;
  logoUrl?: string;
}

// Blockchain transaction
export interface BlockchainTransaction {
  id: string;
  hash: string;
  blockNumber?: number;
  timestamp: string;
  from: string;
  to: string;
  value: string;
  fee: string;
  status: TransactionStatus;
  chain: BlockchainType;
  confirmations: number;
}

// Wallet balance
export interface WalletBalance {
  total: string;
  formatted: string;
  symbol: string;
  decimals: number;
  usdValue?: string;
}

// Wallet data
export interface WalletData {
  address: string;
  network: string;
  balance: WalletBalance;
  isConnected: boolean;
  isTestnet: boolean;
}

// Cross-chain bridge configuration
export interface BridgeConfig {
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  supportedAssets: Asset[];
  minAmount: Record<string, string>;
  maxAmount: Record<string, string>;
  estimatedTime: number; // in seconds
  fee: {
    percentage: number;
    fixed: Record<string, string>;
  };
}

// Bridge status
export interface BridgeStatus {
  status: 'operational' | 'degraded' | 'down';
  latency: number;
  pendingTransactions: number;
  successRate: number;
}

// Bridge transaction
export interface BridgeTransaction {
  id: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  amount: number;
  assetType: string;
  senderAddress: string;
  recipientAddress: string;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  sourceTransactionId?: string;
  targetTransactionId?: string;
  timestamp: string;
  lastUpdated: string;
  error?: string;
}

// Atomic swap transaction
export interface AtomicSwapTransaction {
  id: string;
  initiatorChain: BlockchainType;
  responderChain: BlockchainType;
  initiatorAsset: string;
  responderAsset: string;
  initiatorAmount: number;
  responderAmount: number;
  initiatorAddress: string;
  responderAddress?: string;
  status: 'initiated' | 'participant_joined' | 'completed' | 'refunded' | 'expired';
  timelock: number;
  hashLock?: string;
  secret?: string;
  initiatorTransactionId?: string;
  responderTransactionId?: string;
  timestamp: string;
  lastUpdated: string;
  error?: string;
}