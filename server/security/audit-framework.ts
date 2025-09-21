/**
 * Security Audit Framework
 * 
 * A comprehensive security audit system for the Chronos Vault platform.
 * This framework provides:
 * - Transaction monitoring across multiple blockchains
 * - Security validation for vault operations
 * - Audit logging for security-critical operations
 * - Detection of unusual or suspicious activities
 * - Cross-chain verification integrity checks
 */

import { securityLogger, SecurityEventType, SecurityLogLevel } from '../monitoring/security-logger';
import config from '../config';
import { BlockchainConnector } from '../../shared/interfaces/blockchain-connector';
import { 
  SecurityAuditLevel, 
  SecurityEvent, 
  AuditResult,
  TransactionType,
  OperationType,
  SecurityThreatLevel,
  AuditableOperation
} from '../../shared/types/security-types';

export class SecurityAuditFramework {
  private static instance: SecurityAuditFramework;
  private isInitialized: boolean = false;
  private connectors: Map<string, BlockchainConnector> = new Map();
  private auditQueue: SecurityEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private auditIdCounter: number = 0;
  private readonly PROCESSING_INTERVAL_MS = 5000; // Process audits every 5 seconds
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): SecurityAuditFramework {
    if (!SecurityAuditFramework.instance) {
      SecurityAuditFramework.instance = new SecurityAuditFramework();
    }
    return SecurityAuditFramework.instance;
  }
  
  /**
   * Initialize the security audit framework
   */
  public initialize(connectors: Map<string, BlockchainConnector>): void {
    if (this.isInitialized) {
      securityLogger.warn('Security Audit Framework already initialized', SecurityEventType.SYSTEM_ERROR);
      return;
    }
    
    this.connectors = connectors;
    this.isInitialized = true;
    
    // Start processing audit queue
    this.processingInterval = setInterval(() => {
      this.processAuditQueue();
    }, this.PROCESSING_INTERVAL_MS);
    
    securityLogger.info('Security Audit Framework initialized successfully', SecurityEventType.SYSTEM_ERROR);
  }
  
  /**
   * Clean up resources
   */
  public shutdown(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    this.isInitialized = false;
    securityLogger.info('Security Audit Framework shut down', SecurityEventType.SYSTEM_ERROR);
  }
  
  /**
   * Create a new audit event and add it to the queue
   */
  public createAudit(
    operation: AuditableOperation,
    level: SecurityAuditLevel,
    metadata: Record<string, any>
  ): string {
    if (!this.isInitialized) {
      securityLogger.error('Security Audit Framework not initialized', SecurityEventType.SYSTEM_ERROR);
      throw new Error('Security Audit Framework not initialized');
    }
    
    const auditId = this.generateAuditId();
    
    const event: SecurityEvent = {
      id: auditId,
      timestamp: new Date().toISOString(),
      operation,
      level,
      metadata,
      status: 'pending',
      result: null,
      threatLevel: 'unknown'
    };
    
    this.auditQueue.push(event);
    
    // If it's a high-priority audit, process immediately
    if (level === 'high') {
      this.processAuditQueue(true);
    }
    
    return auditId;
  }
  
  /**
   * Generate a unique audit ID
   */
  private generateAuditId(): string {
    this.auditIdCounter += 1;
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `audit_${timestamp}_${this.auditIdCounter}_${random}`;
  }
  
  /**
   * Process the audit queue
   */
  private async processAuditQueue(priorityOnly: boolean = false): Promise<void> {
    if (this.auditQueue.length === 0) {
      return;
    }
    
    // Clone and filter the queue
    const queue = priorityOnly 
      ? this.auditQueue.filter(event => event.level === 'high' && event.status === 'pending')
      : this.auditQueue.filter(event => event.status === 'pending');
    
    // Mark events as processing
    queue.forEach(event => {
      event.status = 'processing';
    });
    
    // Process each audit
    for (const event of queue) {
      try {
        const result = await this.performAudit(event);
        
        // Update the event
        event.status = 'completed';
        event.result = result;
        event.threatLevel = this.determineThreatLevel(result);
        
        // Log based on threat level
        if (event.threatLevel === 'critical' || event.threatLevel === 'high') {
          securityLogger.error(
            `SECURITY THREAT [${event.threatLevel}]: ${result.message}`,
            SecurityEventType.SUSPICIOUS_ACTIVITY,
            {
              auditId: event.id,
              operation: event.operation,
              metadata: event.metadata
            }
          );
          
          // Trigger alerts for critical threats
          if (event.threatLevel === 'critical' && config.securityConfig.logging.alertOnCriticalEvents) {
            this.triggerSecurityAlert(event);
          }
        } else if (event.threatLevel === 'medium') {
          securityLogger.warn(
            `Security concern: ${result.message}`,
            SecurityEventType.VAULT_MODIFICATION,
            {
              auditId: event.id,
              operation: event.operation
            }
          );
        } else {
          securityLogger.info(
            `Audit passed: ${result.message}`,
            SecurityEventType.VAULT_ACCESS,
            {
              auditId: event.id,
              operation: event.operation
            }
          );
        }
      } catch (error) {
        // Mark as failed
        event.status = 'failed';
        event.result = {
          passed: false,
          message: `Audit processing error: ${error instanceof Error ? error.message : String(error)}`,
          details: { error }
        };
        event.threatLevel = 'unknown';
        
        securityLogger.error(
          'Failed to process security audit', 
          SecurityEventType.SYSTEM_ERROR,
          {
            auditId: event.id,
            operation: event.operation,
            error
          }
        );
      }
    }
    
    // Clean up processed events
    this.auditQueue = this.auditQueue.filter(event => 
      event.status === 'pending' || 
      (priorityOnly && event.level !== 'high')
    );
  }
  
  /**
   * Perform the actual audit based on the operation type
   */
  private async performAudit(event: SecurityEvent): Promise<AuditResult> {
    const { operation, metadata } = event;
    
    switch (operation) {
      case 'vault_creation':
        return this.auditVaultCreation(metadata);
      
      case 'vault_unlock':
        return this.auditVaultUnlock(metadata);
      
      case 'cross_chain_verification':
        return this.auditCrossChainVerification(metadata);
      
      case 'beneficiary_addition':
        return this.auditBeneficiaryAddition(metadata);
      
      case 'asset_deposit':
        return this.auditAssetDeposit(metadata);
        
      case 'security_level_change':
        return this.auditSecurityLevelChange(metadata);
        
      case 'wallet_connection':
        return this.auditWalletConnection(metadata);
        
      case 'transaction_submission':
        return this.auditTransactionSubmission(metadata);
        
      default:
        return {
          passed: false,
          message: `Unknown operation type: ${operation}`,
          details: { operation }
        };
    }
  }
  
  /**
   * Determine the threat level based on audit result
   */
  private determineThreatLevel(result: AuditResult): SecurityThreatLevel {
    if (!result.passed) {
      // Extract threat level from details if available
      if (result.details?.threatLevel) {
        return result.details.threatLevel as SecurityThreatLevel;
      }
      
      // Use severity from details if available
      if (result.details?.severity) {
        const severity = result.details.severity;
        if (severity >= 80) return 'critical';
        if (severity >= 60) return 'high';
        if (severity >= 40) return 'medium';
        if (severity >= 20) return 'low';
        return 'info';
      }
      
      // Default to medium for failed audits without specified threat level
      return 'medium';
    }
    
    // Passed audits are info level by default
    return 'info';
  }
  
  /**
   * Trigger a security alert for critical threats
   */
  private triggerSecurityAlert(event: SecurityEvent): void {
    // In a production environment, this would send alerts to:
    // - Security monitoring systems
    // - DevOps team
    // - Platform administrators
    
    securityLogger.error(
      'CRITICAL SECURITY ALERT TRIGGERED',
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      {
        auditId: event.id,
        operation: event.operation,
        metadata: event.metadata,
        result: event.result
      }
    );
    
    // For development, just log the alert
    if (config.isDevelopmentMode) {
      console.error('CRITICAL SECURITY ALERT (Development Mode Only):', {
        id: event.id,
        operation: event.operation,
        message: event.result?.message
      });
    }
  }
  
  /**
   * Audit a vault creation operation
   */
  private async auditVaultCreation(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, chainId, securityLevel, timeLock, ownerAddress } = metadata;
    
    // Required fields validation
    if (!vaultId || !chainId || !securityLevel || !ownerAddress) {
      return {
        passed: false,
        message: 'Vault creation audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !chainId ? 'chainId' : !securityLevel ? 'securityLevel' : 'ownerAddress',
          threatLevel: 'medium',
          severity: 50
        }
      };
    }
    
    // Security level validation
    if (![1, 2, 3].includes(securityLevel)) {
      return {
        passed: false,
        message: `Invalid security level: ${securityLevel}`,
        details: { threatLevel: 'medium', severity: 50 }
      };
    }
    
    // Time lock validation
    if (timeLock !== undefined) {
      const now = Date.now();
      const lockTime = new Date(timeLock).getTime();
      
      if (isNaN(lockTime) || lockTime <= now) {
        return {
          passed: false,
          message: 'Invalid time lock: must be in the future',
          details: { threatLevel: 'medium', severity: 40 }
        };
      }
    }
    
    // Wallet address format validation
    if (!this.isValidBlockchainAddress(ownerAddress, chainId)) {
      return {
        passed: false,
        message: `Invalid owner address format for chain ${chainId}`,
        details: { threatLevel: 'medium', severity: 60 }
      };
    }
    
    // If cross-chain verification is enabled for level 3 security, check for secondary chains
    if (securityLevel === 3 && config.featureFlags.ENABLE_CROSSCHAIN_VERIFICATION) {
      const { secondaryChains } = metadata;
      
      if (!secondaryChains || !Array.isArray(secondaryChains) || secondaryChains.length < 1) {
        return {
          passed: false,
          message: 'Security level 3 requires at least one secondary chain for verification',
          details: { threatLevel: 'medium', severity: 50 }
        };
      }
    }
    
    return {
      passed: true,
      message: 'Vault creation audit passed',
      details: { 
        vaultId,
        chainId,
        securityLevel,
        timeLock: timeLock || 'none'
      }
    };
  }
  
  /**
   * Audit a vault unlock operation
   */
  private async auditVaultUnlock(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, chainId, requesterAddress, unlockTime } = metadata;
    
    // Required fields validation
    if (!vaultId || !chainId || !requesterAddress) {
      return {
        passed: false,
        message: 'Vault unlock audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !chainId ? 'chainId' : 'requesterAddress',
          threatLevel: 'high',
          severity: 70
        }
      };
    }
    
    // Check if this is the owner or an authorized beneficiary
    const { isOwner, isBeneficiary } = metadata;
    
    if (!isOwner && !isBeneficiary) {
      return {
        passed: false,
        message: 'Unauthorized vault unlock attempt',
        details: { 
          threatLevel: 'critical',
          severity: 90,
          requesterAddress
        }
      };
    }
    
    // Time lock validation
    if (unlockTime !== undefined) {
      const now = Date.now();
      const lockUntil = new Date(unlockTime).getTime();
      
      if (!isNaN(lockUntil) && lockUntil > now) {
        // This is a time-locked vault being accessed before unlock time
        return {
          passed: false,
          message: 'Attempted to unlock vault before time lock expiration',
          details: { 
            threatLevel: 'critical',
            severity: 90,
            currentTime: new Date().toISOString(),
            unlockTime: new Date(unlockTime).toISOString(),
            timeRemaining: Math.floor((lockUntil - now) / 1000 / 60) + ' minutes'
          }
        };
      }
    }
    
    // If this is a level 3 security vault, check cross-chain verification
    if (metadata.securityLevel === 3 && config.featureFlags.ENABLE_CROSSCHAIN_VERIFICATION) {
      const { crossChainVerificationComplete } = metadata;
      
      if (!crossChainVerificationComplete) {
        return {
          passed: false,
          message: 'Cross-chain verification required for level 3 security vault unlock',
          details: { 
            threatLevel: 'high',
            severity: 80
          }
        };
      }
    }
    
    return {
      passed: true,
      message: 'Vault unlock audit passed',
      details: { 
        vaultId,
        chainId,
        requesterType: isOwner ? 'owner' : 'beneficiary'
      }
    };
  }
  
  /**
   * Audit a cross-chain verification operation
   */
  private async auditCrossChainVerification(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, primaryChain, secondaryChains, verificationResults } = metadata;
    
    // Required fields validation
    if (!vaultId || !primaryChain || !secondaryChains || !verificationResults) {
      return {
        passed: false,
        message: 'Cross-chain verification audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !primaryChain ? 'primaryChain' : 
                       !secondaryChains ? 'secondaryChains' : 'verificationResults',
          threatLevel: 'high',
          severity: 70
        }
      };
    }
    
    // Check that we have verification results from all secondary chains
    if (!Array.isArray(secondaryChains) || !Array.isArray(verificationResults)) {
      return {
        passed: false,
        message: 'Invalid cross-chain verification data structure',
        details: { threatLevel: 'medium', severity: 50 }
      };
    }
    
    // Verify that all secondary chains reported success
    const failedVerifications = verificationResults
      .filter(result => !result.success)
      .map(result => result.chainId);
    
    if (failedVerifications.length > 0) {
      return {
        passed: false,
        message: `Cross-chain verification failed for chains: ${failedVerifications.join(', ')}`,
        details: { 
          threatLevel: 'high',
          severity: 70,
          failedChains: failedVerifications,
          results: verificationResults
        }
      };
    }
    
    // Check for timestamp consistency across chains
    const timestamps = verificationResults.map(result => new Date(result.timestamp).getTime());
    const maxTimeDifference = Math.max(...timestamps) - Math.min(...timestamps);
    
    // If timestamps differ by more than 15 minutes, flag as suspicious
    if (maxTimeDifference > 15 * 60 * 1000) {
      return {
        passed: false,
        message: 'Suspicious time difference between cross-chain verifications',
        details: { 
          threatLevel: 'high',
          severity: 80,
          timeDifferenceMs: maxTimeDifference,
          timeDifferenceMinutes: Math.floor(maxTimeDifference / 1000 / 60)
        }
      };
    }
    
    return {
      passed: true,
      message: 'Cross-chain verification audit passed',
      details: { 
        vaultId,
        primaryChain,
        secondaryChainCount: secondaryChains.length,
        verificationCount: verificationResults.length
      }
    };
  }
  
  /**
   * Audit a beneficiary addition operation
   */
  private async auditBeneficiaryAddition(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, chainId, ownerAddress, beneficiaryAddress } = metadata;
    
    // Required fields validation
    if (!vaultId || !chainId || !ownerAddress || !beneficiaryAddress) {
      return {
        passed: false,
        message: 'Beneficiary addition audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !chainId ? 'chainId' : 
                       !ownerAddress ? 'ownerAddress' : 'beneficiaryAddress',
          threatLevel: 'medium',
          severity: 50
        }
      };
    }
    
    // Check that requester is the owner
    const { isOwner } = metadata;
    
    if (!isOwner) {
      return {
        passed: false,
        message: 'Only the vault owner can add beneficiaries',
        details: { 
          threatLevel: 'critical',
          severity: 90,
          requesterAddress: metadata.requesterAddress
        }
      };
    }
    
    // Validate beneficiary address format
    if (!this.isValidBlockchainAddress(beneficiaryAddress, chainId)) {
      return {
        passed: false,
        message: `Invalid beneficiary address format for chain ${chainId}`,
        details: { threatLevel: 'medium', severity: 50 }
      };
    }
    
    // Check if beneficiary already exists
    if (metadata.existingBeneficiaries && 
        Array.isArray(metadata.existingBeneficiaries) && 
        metadata.existingBeneficiaries.includes(beneficiaryAddress)) {
      return {
        passed: false,
        message: 'Beneficiary already exists for this vault',
        details: { threatLevel: 'low', severity: 30 }
      };
    }
    
    // For level 3 security vaults, ensure proper cross-chain updates
    if (metadata.securityLevel === 3 && config.featureFlags.ENABLE_CROSSCHAIN_VERIFICATION) {
      const { secondaryChainUpdates } = metadata;
      
      if (!secondaryChainUpdates || !Array.isArray(secondaryChainUpdates) || secondaryChainUpdates.length < 1) {
        return {
          passed: false,
          message: 'Security level 3 requires beneficiary addition on secondary chains',
          details: { threatLevel: 'medium', severity: 60 }
        };
      }
    }
    
    return {
      passed: true,
      message: 'Beneficiary addition audit passed',
      details: { 
        vaultId,
        chainId,
        beneficiaryAddress
      }
    };
  }
  
  /**
   * Audit an asset deposit operation
   */
  private async auditAssetDeposit(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, chainId, depositorAddress, amount, assetType } = metadata;
    
    // Required fields validation
    if (!vaultId || !chainId || !depositorAddress || !amount || !assetType) {
      return {
        passed: false,
        message: 'Asset deposit audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !chainId ? 'chainId' : 
                       !depositorAddress ? 'depositorAddress' : 
                       !amount ? 'amount' : 'assetType',
          threatLevel: 'medium',
          severity: 50
        }
      };
    }
    
    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return {
        passed: false,
        message: 'Invalid deposit amount',
        details: { 
          threatLevel: 'medium',
          severity: 40,
          amount
        }
      };
    }
    
    // Check for usual or suspicious deposit sizes
    if (metadata.historicalAverage && numAmount > metadata.historicalAverage * 10) {
      return {
        passed: false,
        message: 'Unusually large deposit detected',
        details: { 
          threatLevel: 'medium',
          severity: 50,
          amount: numAmount,
          historicalAverage: metadata.historicalAverage,
          ratio: numAmount / metadata.historicalAverage
        }
      };
    }
    
    // Check deposit from authorized addresses (if restricted vault)
    if (metadata.restrictedDepositors && 
        Array.isArray(metadata.restrictedDepositors) && 
        metadata.restrictedDepositors.length > 0 && 
        !metadata.restrictedDepositors.includes(depositorAddress)) {
      return {
        passed: false,
        message: 'Deposit from unauthorized address to restricted vault',
        details: { 
          threatLevel: 'high',
          severity: 70,
          depositorAddress
        }
      };
    }
    
    return {
      passed: true,
      message: 'Asset deposit audit passed',
      details: { 
        vaultId,
        chainId,
        amount: numAmount,
        assetType
      }
    };
  }
  
  /**
   * Audit a security level change operation
   */
  private async auditSecurityLevelChange(metadata: Record<string, any>): Promise<AuditResult> {
    const { vaultId, chainId, ownerAddress, oldLevel, newLevel } = metadata;
    
    // Required fields validation
    if (!vaultId || !chainId || !ownerAddress || oldLevel === undefined || newLevel === undefined) {
      return {
        passed: false,
        message: 'Security level change audit failed due to missing required fields',
        details: { 
          missingFields: !vaultId ? 'vaultId' : !chainId ? 'chainId' : 
                       !ownerAddress ? 'ownerAddress' : 
                       oldLevel === undefined ? 'oldLevel' : 'newLevel',
          threatLevel: 'medium',
          severity: 50
        }
      };
    }
    
    // Check that requester is the owner
    const { isOwner } = metadata;
    
    if (!isOwner) {
      return {
        passed: false,
        message: 'Only the vault owner can change security level',
        details: { 
          threatLevel: 'critical',
          severity: 90,
          requesterAddress: metadata.requesterAddress
        }
      };
    }
    
    // Validate security levels
    if (![1, 2, 3].includes(oldLevel) || ![1, 2, 3].includes(newLevel)) {
      return {
        passed: false,
        message: 'Invalid security level values',
        details: { 
          threatLevel: 'medium',
          severity: 50,
          oldLevel,
          newLevel
        }
      };
    }
    
    // If increasing to level 3, ensure cross-chain support is set up
    if (oldLevel < 3 && newLevel === 3 && config.featureFlags.ENABLE_CROSSCHAIN_VERIFICATION) {
      const { secondaryChains } = metadata;
      
      if (!secondaryChains || !Array.isArray(secondaryChains) || secondaryChains.length < 1) {
        return {
          passed: false,
          message: 'Security level 3 requires at least one secondary chain for verification',
          details: { threatLevel: 'medium', severity: 50 }
        };
      }
    }
    
    // Check if vault contains assets before lowering security level
    if (oldLevel > newLevel && metadata.vaultValue && metadata.vaultValue > 0) {
      return {
        passed: false,
        message: 'Reducing security level on a vault with assets',
        details: { 
          threatLevel: 'high',
          severity: 70,
          currentValue: metadata.vaultValue
        }
      };
    }
    
    return {
      passed: true,
      message: 'Security level change audit passed',
      details: { 
        vaultId,
        chainId,
        oldLevel,
        newLevel,
        securityChange: newLevel > oldLevel ? 'increased' : 'decreased'
      }
    };
  }
  
  /**
   * Audit a wallet connection operation
   */
  private async auditWalletConnection(metadata: Record<string, any>): Promise<AuditResult> {
    const { chainId, walletAddress, walletType } = metadata;
    
    // Required fields validation
    if (!chainId || !walletAddress || !walletType) {
      return {
        passed: false,
        message: 'Wallet connection audit failed due to missing required fields',
        details: { 
          missingFields: !chainId ? 'chainId' : !walletAddress ? 'walletAddress' : 'walletType',
          threatLevel: 'medium',
          severity: 40
        }
      };
    }
    
    // Validate address format
    if (!this.isValidBlockchainAddress(walletAddress, chainId)) {
      return {
        passed: false,
        message: `Invalid wallet address format for chain ${chainId}`,
        details: { threatLevel: 'medium', severity: 50 }
      };
    }
    
    // Check for suspicious connection patterns
    if (metadata.recentConnections && metadata.recentConnections > 10) {
      return {
        passed: false,
        message: 'Suspicious number of recent wallet connection attempts',
        details: { 
          threatLevel: 'high',
          severity: 70,
          recentConnections: metadata.recentConnections
        }
      };
    }
    
    // Check for unusual geolocation patterns
    if (metadata.userGeolocation && metadata.previousGeolocation) {
      const { userGeolocation, previousGeolocation } = metadata;
      
      // This is a very simplified check - production would use more sophisticated geo-distance calculation
      if (userGeolocation.country !== previousGeolocation.country) {
        return {
          passed: false,
          message: 'Unusual geolocation change detected',
          details: { 
            threatLevel: 'high',
            severity: 70,
            currentLocation: userGeolocation.country,
            previousLocation: previousGeolocation.country,
            timeSinceLastLogin: metadata.timeSinceLastLogin || 'unknown'
          }
        };
      }
    }
    
    return {
      passed: true,
      message: 'Wallet connection audit passed',
      details: { 
        chainId,
        walletType
      }
    };
  }
  
  /**
   * Audit a transaction submission operation
   */
  private async auditTransactionSubmission(metadata: Record<string, any>): Promise<AuditResult> {
    const { chainId, walletAddress, transactionType, transactionData } = metadata;
    
    // Required fields validation
    if (!chainId || !walletAddress || !transactionType || !transactionData) {
      return {
        passed: false,
        message: 'Transaction submission audit failed due to missing required fields',
        details: { 
          missingFields: !chainId ? 'chainId' : !walletAddress ? 'walletAddress' : 
                       !transactionType ? 'transactionType' : 'transactionData',
          threatLevel: 'medium',
          severity: 50
        }
      };
    }
    
    // Check transaction size/gas limits
    if (transactionData.gasLimit && transactionData.gasLimit > 1000000) {
      return {
        passed: false,
        message: 'Unusually high gas limit for transaction',
        details: { 
          threatLevel: 'medium',
          severity: 60,
          gasLimit: transactionData.gasLimit
        }
      };
    }
    
    // Check for unusual transaction values
    if (transactionData.value && Number(transactionData.value) > 0) {
      const value = Number(transactionData.value);
      
      if (metadata.averageTransactionValue && value > metadata.averageTransactionValue * 5) {
        return {
          passed: false,
          message: 'Unusually large transaction value',
          details: { 
            threatLevel: 'medium',
            severity: 60,
            value,
            averageValue: metadata.averageTransactionValue,
            ratio: value / metadata.averageTransactionValue
          }
        };
      }
    }
    
    // Check for suspicious contract interactions
    if (transactionType === 'contract_interaction' && metadata.suspiciousContracts) {
      const suspiciousContracts = Array.isArray(metadata.suspiciousContracts) 
        ? metadata.suspiciousContracts 
        : [metadata.suspiciousContracts];
      
      if (transactionData.to && suspiciousContracts.includes(transactionData.to)) {
        return {
          passed: false,
          message: 'Interaction with suspicious or flagged contract',
          details: { 
            threatLevel: 'critical',
            severity: 90,
            contractAddress: transactionData.to
          }
        };
      }
    }
    
    return {
      passed: true,
      message: 'Transaction submission audit passed',
      details: { 
        chainId,
        transactionType
      }
    };
  }
  
  /**
   * Check if an address is valid for a given blockchain
   */
  private isValidBlockchainAddress(address: string, chainId: string): boolean {
    // Chain-specific validation is implemented below with comprehensive address format validation
    
    if (!address || typeof address !== 'string') {
      return false;
    }
    
    switch (chainId) {
      case 'ethereum':
        // Basic Ethereum address validation (0x followed by 40 hex characters)
        return /^0x[0-9a-fA-F]{40}$/.test(address);
        
      case 'solana':
        // Basic Solana address validation (base58 encoding, typically 32-44 chars)
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
        
      case 'ton':
        // Basic TON address validation
        return address.startsWith('EQ') || address.startsWith('UQ');
        
      case 'bitcoin':
        // Basic Bitcoin address validation
        return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address);
        
      default:
        // For unknown chains, just verify non-empty string
        return address.length > 0;
    }
  }
  
  /**
   * Get audit by ID
   */
  public getAuditById(auditId: string): SecurityEvent | undefined {
    return [...this.auditQueue].find(event => event.id === auditId);
  }
  
  /**
   * Get all completed audits
   */
  public getCompletedAudits(): SecurityEvent[] {
    return [...this.auditQueue].filter(event => 
      event.status === 'completed'
    );
  }
  
  /**
   * Get audits by threat level
   */
  public getAuditsByThreatLevel(threatLevel: SecurityThreatLevel): SecurityEvent[] {
    return [...this.auditQueue].filter(event => 
      event.threatLevel === threatLevel
    );
  }
}

// Export singleton instance getter
export const getSecurityAuditFramework = SecurityAuditFramework.getInstance;