export type BlockchainType = "ETH" | "SOL" | "TON";

export type VaultStatus = "active" | "locked" | "unlocked" | "pending";

export interface ChainExplorerInfo {
  name: string;
  logo: string;
  mainnet: {
    url: string;
    address: string;
    transaction: string;
    token: string;
    block: string;
  };
  testnet: {
    url: string;
    address: string;
    transaction: string;
    token: string;
    block: string;
  };
}

export interface ChainStatus {
  chain: BlockchainType;
  status: "online" | "degraded" | "offline";
  lastUpdated: number;
  blockHeight?: number;
  networkVersion?: string;
  message?: string;
}

export interface VaultInfo {
  id: string;
  name: string;
  owner: string;
  blockchain: BlockchainType;
  status: VaultStatus;
  unlockDate: Date | null;
  value: string;
  txHash?: string;
  securityLevel: "standard" | "enhanced" | "maximum";
  createdAt: Date;
}

export interface ExplorerSearchParams {
  vaultId?: string;
  blockchain?: BlockchainType;
  address?: string;
  txHash?: string;
}

export interface ExplorerStats {
  totalVaults: number;
  byChain: Record<BlockchainType, number>;
  byStatus: Record<VaultStatus, number>;
  totalValue: Record<BlockchainType, string>;
}