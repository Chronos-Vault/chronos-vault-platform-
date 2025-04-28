/**
 * Cross-Chain Interfaces
 * 
 * Defines common interfaces and types for cross-chain functionality
 */

/**
 * Supported blockchain types
 */
export type BlockchainType = 'ETH' | 'TON' | 'SOL' | 'MATIC' | 'BNB';

/**
 * Transfer priority for optimizing routes
 */
export type TransferPriority = 'speed' | 'cost' | 'security';

/**
 * Security risk levels
 */
export enum SecurityRiskLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

/**
 * Security incident types
 */
export enum SecurityIncidentType {
  BRIDGE_EXPLOIT = 'bridge_exploit',
  VALIDATOR_COMPROMISE = 'validator_compromise',
  NETWORK_CONGESTION = 'network_congestion',
  LIQUIDITY_SHORTAGE = 'liquidity_shortage',
  EXCHANGE_HACK = 'exchange_hack',
  SMART_CONTRACT_VULNERABILITY = 'smart_contract_vulnerability'
}

/**
 * Vault creation parameters
 */
export interface VaultCreationParams {
  unlockTime: number;
  amount: string;
  recipient?: string;
  comment?: string;
}

/**
 * Security status for a blockchain
 */
export interface BlockchainSecurityStatus {
  blockchain: BlockchainType;
  status: 'healthy' | 'warning' | 'critical';
  riskLevel: SecurityRiskLevel;
  lastIncident?: SecurityIncident;
  activeThreats: number;
  healthScore: number; // 0-100
  timestamp: number;
}

/**
 * Security incident for monitoring
 */
export interface SecurityIncident {
  id: string;
  type: SecurityIncidentType;
  blockchain: BlockchainType;
  description: string;
  severity: SecurityRiskLevel;
  timestamp: number;
  status: 'active' | 'mitigated' | 'resolved';
  affectedAssets?: string[];
  mitigationSteps?: string[];
}

/**
 * Asset transfer request
 */
export interface TransferRequest {
  id: string;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  sourceAsset: string;
  destinationAsset: string;
  amount: string;
  sender: string;
  recipient: string;
  priority: TransferPriority;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletionTime?: number;
  securityChecks?: {
    passedChecks: number;
    totalChecks: number;
    status: 'pending' | 'passed' | 'failed';
  };
}

/**
 * Network configuration for each blockchain
 */
export interface NetworkConfig {
  name: string;
  icon: string;
  color: string;
  nativeToken: string;
  blockTime: number; // In seconds
  confirmations: number;
  explorers: string[];
  testnet: boolean;
  supportedAssets: string[];
}

/**
 * Multi-signature operation
 */
export interface MultiSigOperation {
  id: string;
  blockchain: BlockchainType;
  type: 'transfer' | 'approval' | 'configuration';
  requiredSignatures: number;
  collectedSignatures: number;
  signatories: string[];
  timestamps: {
    created: number;
    expiration?: number;
    executed?: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';
  metadata: Record<string, any>;
}