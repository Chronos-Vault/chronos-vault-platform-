/**
 * Security Types
 * 
 * Type definitions for the security audit framework and related security
 * monitoring functionality. These types are used throughout the application
 * to ensure consistent security reporting and validation.
 */

/**
 * Security audit levels to prioritize processing
 */
export type SecurityAuditLevel = 'low' | 'medium' | 'high';

/**
 * Security threat levels for audit results
 */
export type SecurityThreatLevel = 'info' | 'low' | 'medium' | 'high' | 'critical' | 'unknown';

/**
 * Status of a security event
 */
export type SecurityEventStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Types of auditable operations
 */
export type AuditableOperation = 
  | 'vault_creation'
  | 'vault_unlock'
  | 'cross_chain_verification'
  | 'beneficiary_addition'
  | 'asset_deposit'
  | 'security_level_change'
  | 'wallet_connection'
  | 'transaction_submission';

/**
 * Types of blockchain transactions
 */
export type TransactionType = 
  | 'vault_creation'
  | 'vault_unlock'
  | 'asset_deposit'
  | 'asset_withdrawal'
  | 'beneficiary_addition'
  | 'beneficiary_removal'
  | 'contract_interaction'
  | 'token_transfer'
  | 'cross_chain_verification';

/**
 * Types of operations
 */
export type OperationType = 
  | 'vault_management'
  | 'asset_management'
  | 'user_management'
  | 'security_management'
  | 'system_management';

/**
 * Result of a security audit
 */
export interface AuditResult {
  /**
   * Whether the audit passed
   */
  passed: boolean;
  
  /**
   * Human-readable message explaining the audit result
   */
  message: string;
  
  /**
   * Additional details about the audit
   */
  details?: Record<string, any>;
}

/**
 * A security event that needs to be audited
 */
export interface SecurityEvent {
  /**
   * Unique identifier for the audit event
   */
  id: string;
  
  /**
   * ISO timestamp of when the event was created
   */
  timestamp: string;
  
  /**
   * Type of operation being audited
   */
  operation: AuditableOperation;
  
  /**
   * Priority level for the audit
   */
  level: SecurityAuditLevel;
  
  /**
   * Additional data needed for the audit
   */
  metadata: Record<string, any>;
  
  /**
   * Current status of the audit process
   */
  status: SecurityEventStatus;
  
  /**
   * Result of the audit (null if not completed)
   */
  result: AuditResult | null;
  
  /**
   * Assessed threat level based on the audit result
   */
  threatLevel: SecurityThreatLevel;
}

/**
 * Security verification result for cross-chain operations
 */
export interface SecurityVerification {
  /**
   * Whether verification was successful
   */
  success: boolean;
  
  /**
   * Blockchain where verification was performed
   */
  chainId: string;
  
  /**
   * ISO timestamp of when verification was completed
   */
  timestamp: string;
  
  /**
   * Transaction hash or identifier for the verification
   */
  transactionId?: string;
  
  /**
   * Additional verification details
   */
  details?: Record<string, any>;
}

/**
 * Security event types for logging
 */
export interface SecurityEventType {
  /**
   * Event category
   */
  category: 'access' | 'transaction' | 'system' | 'wallet' | 'vault';
  
  /**
   * Event severity
   */
  severity: 'info' | 'warning' | 'error' | 'critical';
  
  /**
   * User or wallet address associated with the event
   */
  user?: string;
  
  /**
   * Event origin (IP, device, etc.)
   */
  origin?: string;
  
  /**
   * Additional event metadata
   */
  metadata?: Record<string, any>;
}

/**
 * Security analytics report
 */
export interface SecurityAnalyticsReport {
  /**
   * Report timeframe start (ISO timestamp)
   */
  startTime: string;
  
  /**
   * Report timeframe end (ISO timestamp)
   */
  endTime: string;
  
  /**
   * Critical level events count
   */
  criticalEvents: number;
  
  /**
   * High level events count
   */
  highEvents: number;
  
  /**
   * Medium level events count
   */
  mediumEvents: number;
  
  /**
   * Low level events count
   */
  lowEvents: number;
  
  /**
   * Info level events count
   */
  infoEvents: number;
  
  /**
   * Total number of events
   */
  totalEvents: number;
  
  /**
   * Events by category
   */
  eventsByCategory: Record<string, number>;
  
  /**
   * Top security concerns
   */
  topConcerns: Array<{
    category: string;
    count: number;
    description: string;
    threatLevel: SecurityThreatLevel;
  }>;
  
  /**
   * Security improvement recommendations
   */
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: string;
  }>;
}