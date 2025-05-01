/**
 * Cross-Chain Interfaces
 * 
 * This file contains interfaces and types for cross-chain functionality.
 */

// Supported blockchain types
export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'MATIC' | 'BTC';

// Base transaction interface
export interface TransactionData {
  txHash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  blockchain: BlockchainType;
}

// Security incident types and severity - moved to SecurityServiceExports.ts

// Security risk level enum
export enum SecurityRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Security incident interface
export interface SecurityIncident {
  id: string;
  timestamp: number;
  vaultId: string;
  severity: SecurityRiskLevel;
  type: string;
  description: string;
  blockchainData?: {
    chain: BlockchainType;
    txHash: string;
    blockNumber: number;
  };
  resolved?: boolean;
  resolution?: string;
  detectionMethod?: string;
}

export interface CrossChainValidationResult {
  verified: boolean;
  sourceChain: BlockchainType;
  confirmations: number;
  tripleChainConsensus: boolean;
  validationChains: BlockchainType[];
}

export interface TripleChainValidator {
  role: 'primary-security' | 'speed-verification' | 'backup-recovery';
  requiredConfirmations: number;
  validateTransaction: (txHash: string) => Promise<boolean>;
}

// Chain status interface
export interface ChainStatus {
  chain: BlockchainType;
  status: 'online' | 'offline' | 'degraded';
  latestBlock: number;
  lastSyncTime: number;
  pendingValidations: number;
}

// Cross-chain security metrics
export interface SecurityMetrics {
  incidentCount: number;
  criticalIncidents: number;
  highIncidents: number;
  mediumIncidents: number;
  lowIncidents: number;
  resolvedIncidents: number;
  activeAlerts: number;
  securityScore: number;
  crossChainConsistency: number;
  lastUpdated: number;
}

// Vault creation parameters
export interface VaultCreationParams {
  unlockTime: number;
  amount: string;
  recipient?: string;
  comment?: string;
  securityLevel?: number;
}