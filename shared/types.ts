/**
 * Shared Type Definitions
 * 
 * Common types used across the application for consistency
 */

export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'BTC';

export enum SecurityLevel {
  BASIC = 0,
  ADVANCED = 1,
  MAXIMUM = 2
}

export enum RecoveryStrategy {
  NONE = 0,
  SWITCH_PRIMARY = 1,
  PARTIAL_VERIFICATION = 2,
  EMERGENCY_PROTOCOL = 3,
  RETRY = 4
}

export enum ChainRole {
  PRIMARY = 'PRIMARY',
  MONITORING = 'MONITORING',
  RECOVERY = 'RECOVERY',
  FALLBACK = 'FALLBACK'
}

export interface ChainStatus {
  blockchain: BlockchainType;
  isAvailable: boolean;
  latency: number;
  lastBlockNumber?: number;
  lastSyncTimestamp: number;
  error?: string;
}

export interface SecurityDashboardStatus {
  chainStatuses: Record<BlockchainType, ChainStatus>;
  primaryChain: BlockchainType;
  securityLevel: SecurityLevel;
  crossChainSyncStatus: {
    isSynced: boolean;
    syncPercentage: number;
    lastSyncTime: number;
  };
  activeFailovers: {
    vaultId: string;
    primaryChain: BlockchainType;
    fallbackChain?: BlockchainType;
    strategy: RecoveryStrategy;
    reason: string;
    timestamp: number;
  }[];
  securityAlerts: {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: number;
    resolved: boolean;
  }[];
}

export interface ChainHealth {
  role: ChainRole;
  status: 'healthy' | 'warning' | 'error';
  blockHeight: number;
  syncPercentage: number;
  verifiedTransactions: number;
  pendingTransactions: number;
  lastVerifiedBlock: number;
  latency: number;
}

export interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface FailoverEvent {
  vaultId: string;
  primaryChain: BlockchainType;
  fallbackChain?: BlockchainType;
  strategy: RecoveryStrategy;
  reason: string;
  timestamp: number;
  success?: boolean;
  errorMessage?: string;
}