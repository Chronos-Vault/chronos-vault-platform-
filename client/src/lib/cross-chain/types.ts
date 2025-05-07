export type BlockchainType = 'ETH' | 'SOL' | 'TON';

export type ChainStatus = 'online' | 'degraded' | 'offline';

export type VaultStatus = 'active' | 'locked' | 'unlocked' | 'pending';

export type SecurityLevel = 'standard' | 'enhanced' | 'maximum';

export interface VaultInfo {
  id: string;
  name: string;
  owner: string;
  blockchain: BlockchainType;
  status: VaultStatus;
  unlockDate: Date | null;
  value: string;
  txHash: string;
  securityLevel: SecurityLevel;
  createdAt: Date;
}

export interface ExplorerStats {
  totalVaults: number;
  byChain: {
    ETH: number;
    SOL: number;
    TON: number;
  };
  byStatus: {
    active: number;
    locked: number;
    unlocked: number;
    pending: number;
  };
  totalValue: {
    ETH: string;
    SOL: string;
    TON: string;
  };
}

export interface ChainMetrics {
  status: ChainStatus;
  blockHeight: number;
  avgBlockTime: number;
  activeVaults: number;
  transactions24h: number;
  totalValueLocked: string;
}

export interface SecurityMetrics {
  crossChainVerifications: number;
  activeSecurityChecks: number;
  zkProofsGenerated: number;
  anomaliesDetected: number;
}

export interface MultiChainStatus {
  ETH: ChainStatus;
  SOL: ChainStatus;
  TON: ChainStatus;
  lastUpdated: Date;
}

export type ChainExplorer = {
  name: string;
  logo: string;
  baseUrl: string;
  getAddressUrl: (address: string) => string;
  getTransactionUrl: (txHash: string) => string;
  getTokenUrl: (tokenAddress: string) => string;
  getBlockUrl: (blockNumber: string | number) => string;
  formatAddress: (address: string) => string;
};