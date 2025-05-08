/**
 * Blockchain Types
 * 
 * Common type definitions for blockchain operations across
 * different blockchain connectors.
 */

// Vault creation parameters
export interface VaultCreationParams {
  unlockDate: Date | string;
  securityLevel?: 'low' | 'medium' | 'high';
  beneficiaries?: string | string[];
  metadata?: Record<string, any>;
}

// Status information for a vault
export interface VaultStatusInfo {
  id: string;
  owner: string;
  unlockDate: Date;
  isLocked: boolean;
  balance: string;
  chainId: string;
  network: string;
  securityLevel: 'low' | 'medium' | 'high';
  lastActivity: Date;
  halvingAligned?: boolean; // Bitcoin-specific property
}

// Result of a blockchain transaction
export interface TransactionResult {
  success: boolean;
  transactionHash?: string;
  vaultId?: string;
  error?: string;
  chainId: string;
}

// Security verification result
export interface SecurityVerification {
  isValid: boolean;
  signatures?: string[];
  error?: string;
  verifiedAt: Date;
  chainId: string;
}

// Multi-signature request status
export interface MultiSigRequestStatus {
  requestId: string;
  operation: string;
  vaultId: string;
  initiator: string;
  approvals: number;
  requiredApprovals: number;
  executed: boolean;
  executionTimestamp?: Date;
  chainId: string;
}

// Verification result across chains
export interface CrossChainVerificationResult {
  isVerified: boolean;
  primaryChainVerification: SecurityVerification;
  secondaryVerifications: Record<string, SecurityVerification>;
  timestamp: Date;
}

// Security event types for logging
export type SecurityEventType = 
  | { type: 'wallet_connected', address: string, chainId: string }
  | { type: 'wallet_disconnected', chainId: string }
  | { type: 'vault_created', vaultId: string, owner: string, chainId: string }
  | { type: 'assets_locked', vaultId: string, amount: string, chainId: string }
  | { type: 'assets_unlocked', vaultId: string, amount: string, chainId: string }
  | { type: 'beneficiary_added', vaultId: string, beneficiary: string, chainId: string }
  | { type: 'beneficiary_removed', vaultId: string, beneficiary: string, chainId: string }
  | { type: 'signature_created', message: string, address: string, chainId: string }
  | { type: 'signature_verified', isValid: boolean, address: string, chainId: string }
  | { type: 'multi_sig_requested', requestId: string, operation: string, vaultId: string, chainId: string }
  | { type: 'multi_sig_approved', requestId: string, approver: string, chainId: string }
  | { type: 'vault_verified', vaultId: string, isValid: boolean, chainId: string }
  | { type: 'cross_chain_verification', vaultId: string, primaryChain: string, verificationChains: string[], isValid: boolean }
  | { type: 'cross_chain_mirror_created', sourceVaultId: string, targetVaultId: string, sourceChain: string, targetChain: string }
  | { type: 'security_error', errorType: string, message: string, chainId: string };