/**
 * Shared Types
 * 
 * This module provides shared types used across the frontend and backend.
 */

// Blockchain types
export type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'POLYGON' | 'BTC';

// Security levels
export type SecurityLevel = 1 | 2 | 3;

// Vault types
export type VaultType = 'personal' | 'multisig' | 'timed' | 'geolocked' | 'diamond-hands';

// Vault status
export type VaultStatus = 'pending' | 'active' | 'locked' | 'unlocked' | 'closed' | 'breached';

// Cross-chain verification status
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'partial';

// Signature request status
export type SignatureRequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

// User roles
export type UserRole = 'user' | 'admin' | 'vault-owner' | 'beneficiary' | 'signer';

// Vault interfaces
export interface IVault {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  type: VaultType;
  securityLevel: SecurityLevel;
  status: VaultStatus;
  primaryChain: BlockchainType;
  secondaryChains?: BlockchainType[];
  createdAt: Date;
  updatedAt: Date;
  unlockDate?: Date;
  requiredSignatures?: number;
  totalSigners?: number;
  geoLocation?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
}

// User interfaces
export interface IUser {
  id: string;
  username: string;
  email?: string;
  wallets: {
    [key in BlockchainType]?: string;
  };
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Beneficiary interfaces
export interface IBeneficiary {
  id: string;
  vaultId: string;
  userId: string;
  name: string;
  chain: BlockchainType;
  walletAddress: string;
  accessType: 'full' | 'limited' | 'view-only';
  createdAt: Date;
  updatedAt: Date;
}

// Attachment interfaces
export interface IAttachment {
  id: string;
  vaultId: string;
  name: string;
  description?: string;
  fileType: string;
  fileSize: number;
  url: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cross-chain transaction interfaces
export interface ICrossChainTransaction {
  id: string;
  vaultId: string;
  sourceChain: BlockchainType;
  targetChain: BlockchainType;
  sourceTransactionId: string;
  targetTransactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  amount?: string;
  asset?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Security incident interfaces
export interface ISecurityIncident {
  id: string;
  vaultId: string;
  type: 'access-attempt' | 'signature-failure' | 'cross-chain-verification-failure' | 'time-manipulation' | 'geolocation-spoofing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  sourceIp?: string;
  walletAddress?: string;
  chain?: BlockchainType;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Signature request interfaces
export interface ISignatureRequest {
  id: string;
  vaultId: string;
  requesterId: string;
  description: string;
  status: SignatureRequestStatus;
  requiredSignatures: number;
  confirmedSignatures: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Signature interfaces
export interface ISignature {
  id: string;
  requestId: string;
  signerId: string;
  chain: BlockchainType;
  walletAddress: string;
  signature: string;
  createdAt: Date;
}

// CVT token interfaces
export interface ICVTBalance {
  walletAddress: string;
  chain: BlockchainType;
  balance: string;
  staked: string;
  updatedAt: Date;
}

// Smart contract interfaces
export interface ISmartContract {
  id: string;
  name: string;
  description?: string;
  blockchain: BlockchainType;
  address: string;
  abi: string;
  createdAt: Date;
  updatedAt: Date;
}

// Cross-chain verification methods
export enum VerificationMethod {
  STANDARD = 'standard',
  DEEP = 'deep',
  ZERO_KNOWLEDGE = 'zero-knowledge',
  QUANTUM_RESISTANT = 'quantum-resistant',
  MERKLE_PROOF = 'merkle-proof',
  MULTI_SIGNATURE = 'multi-signature',
  CONSENSUS_VERIFICATION = 'consensus-verification',
  TIME_LOCKED_VERIFICATION = 'time-locked-verification',
}

// Cross-chain verification result
export interface VerificationResult {
  success: boolean;
  vaultId: string;
  method: VerificationMethod;
  sourceChain: BlockchainType;
  targetChains: BlockchainType[];
  verifiedOn: BlockchainType[];
  pendingOn: BlockchainType[];
  failedOn: BlockchainType[];
  timestamp: number;
  message: string;
}

// Multi-signature request
export interface MultiSignatureRequest {
  id: string;
  vaultId: string;
  description: string;
  requiredSignatures: number;
  confirmedSignatures: number;
  status: SignatureRequestStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

// ZK Proof result
export interface ZkProofResult {
  success: boolean;
  proofType: string;
  proof: any;
  publicInputs: any[];
  verified: boolean;
  timestamp: number;
}

// API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Development mode configuration
export interface DevModeConfig {
  enabled: boolean;
  bypassWalletConnection: boolean;
  simulateLatency: boolean;
  latencyMs: number;
  showDebugControls: boolean;
  mockBlockchainData: boolean;
}