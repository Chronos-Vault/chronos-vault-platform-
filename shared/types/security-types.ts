/**
 * Security Types
 * 
 * This module contains the interfaces and types for the security audit framework
 * and monitoring system used in the Chronos Vault platform.
 */

import { ChainType } from './blockchain-types';

/**
 * Security Audit Levels
 */
export enum SecurityAuditLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Transaction Types monitored by security system
 */
export enum TransactionType {
  VAULT_CREATION = 'vault_creation',
  ASSET_LOCK = 'asset_lock',
  ASSET_UNLOCK = 'asset_unlock',
  BENEFICIARY_ADD = 'beneficiary_add',
  BENEFICIARY_REMOVE = 'beneficiary_remove',
  VAULT_UPDATE = 'vault_update',
  CROSS_CHAIN_SYNC = 'cross_chain_sync',
  MULTI_SIG_REQUEST = 'multi_sig_request',
  MULTI_SIG_APPROVAL = 'multi_sig_approval',
  ADMIN_ACTION = 'admin_action'
}

/**
 * Security Operation Types
 */
export enum OperationType {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin',
  SYSTEM = 'system'
}

/**
 * Security Threat Levels
 */
export enum SecurityThreatLevel {
  NONE = 'none',
  SUSPICIOUS = 'suspicious',
  WARNING = 'warning',
  ALERT = 'alert',
  CRITICAL = 'critical'
}

/**
 * Security Event Interface
 */
export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: TransactionType | string;
  chainId: ChainType | string;
  vaultId?: string;
  walletAddress?: string;
  auditLevel: SecurityAuditLevel;
  operationType: OperationType;
  threatLevel: SecurityThreatLevel;
  metadata: Record<string, any>;
  verified: boolean;
  hash?: string; // Hash for tamper-proof record
  previousEventHash?: string; // For hash chaining
  signature?: string; // Digital signature for verification
}

/**
 * Security Alert Interface
 */
export interface SecurityAlert {
  id: string;
  timestamp: Date;
  alertType: string;
  severity: SecurityThreatLevel;
  message: string;
  vaultId?: string;
  chainId?: ChainType | string;
  transactionHash?: string;
  walletAddress?: string;
  metadata: Record<string, any>;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolutionNotes?: string;
}

/**
 * Audit Result Interface
 */
export interface AuditResult {
  success: boolean;
  timestamp: Date;
  event?: SecurityEvent;
  alert?: SecurityAlert;
  message?: string;
  transactionHash?: string;
  validationResults?: Record<string, any>;
}

/**
 * Auditable Operation Interface
 */
export interface AuditableOperation {
  type: TransactionType;
  vaultId?: string;
  chainId: ChainType | string;
  walletAddress: string;
  operationType: OperationType;
  auditLevel: SecurityAuditLevel;
  metadata: Record<string, any>;
}

/**
 * Security Status Interface
 */
export interface SecurityStatus {
  overallStatus: 'optimal' | 'good' | 'degraded' | 'critical';
  lastUpdated: Date;
  chainStatuses: Record<string, ChainSecurityStatus>;
  alerts: SecurityAlert[];
  metrics: {
    transactionsVerified24h: number;
    failedVerifications24h: number;
    alertsTriggered24h: number;
    avgResponseTimeMs: number;
    crossChainSyncStatus: 'synced' | 'syncing' | 'failed';
  };
}

/**
 * Chain Security Status
 */
export interface ChainSecurityStatus {
  chainId: ChainType | string;
  status: 'online' | 'degraded' | 'offline';
  latestBlockHeight: number;
  latestBlockTime: Date;
  verificationLatencyMs: number;
  connectorHealthy: boolean;
  lastSuccessfulVerification: Date;
}

/**
 * Security Verification Protocol Options
 */
export interface SecurityVerificationOptions {
  crossChainVerification: boolean;
  deepInspection: boolean;
  simulationEnabled: boolean;
  callbackUrl?: string;
  timeoutMs?: number;
  minRequiredConfirmations?: number;
}

/**
 * Security Event Subscription Options
 */
export interface SecurityEventSubscription {
  id: string;
  types: (TransactionType | string)[];
  chainIds: (ChainType | string)[];
  vaultIds?: string[];
  minThreatLevel?: SecurityThreatLevel;
  callback: (event: SecurityEvent) => void;
  active: boolean;
}