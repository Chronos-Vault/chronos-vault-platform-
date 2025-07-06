/**
 * Transaction Integrity Monitoring System
 * 
 * This system provides comprehensive monitoring for cross-chain transactions:
 * - Cross-blockchain consistency checks
 * - Anomaly detection for suspicious patterns
 * - Self-healing capabilities for minor inconsistencies
 * - Real-time monitoring with alert system
 * - Historical analysis and reporting
 */

import { CrossChainTransaction, BlockchainNetwork, TransactionStatus } from '@shared/transaction-types';
import { enhancedCrossChainVerifier, CrossChainVerificationResponse } from '../verification/enhanced-cross-chain-verifier';
import { ethereumService } from '../ethereum/ethereum-service';
import { solanaService } from '../solana/solana-service';
import { tonService } from '../ton/ton-service';
import { bitcoinService } from '../bitcoin/bitcoin-service';

// Transaction anomaly interface for describing detected issues
export interface TransactionAnomaly {
  id: string;
  timestamp: number;
  transactionId: string;
  correlationId: string;
  anomalyType: 'inconsistency' | 'timing' | 'value' | 'participant' | 'pattern' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  affectedNetworks: BlockchainNetwork[];
  autoResolved: boolean;
  resolutionStrategy?: string;
  metadata?: Record<string, any>;
}

// Transaction integrity check result
export interface IntegrityCheckResult {
  transactionId: string;
  correlationId: string;
  timestamp: number;
  isValid: boolean;
  consistencyScore: number; // 0-100
  anomalyCount: number;
  criticalAnomalyCount: number;
  selfHealedCount: number;
  verificationResponses: CrossChainVerificationResponse[];
  anomalies: TransactionAnomaly[];
  recommendations: string[];
  executionTimeMs: number;
}

// Monitoring status interface
export interface MonitoringStatus {
  isActive: boolean;
  transactionsMonitored: number;
  anomaliesDetected: number;
  anomaliesResolved: number;
  lastScanTimestamp: number | null;
  scanInterval: number;
  networkStatusMap: Record<BlockchainNetwork, {
    isOnline: boolean;
    averageResponseTimeMs: number;
    lastUpdated: number;
  }>;
}

// Monitoring configuration interface
export interface MonitoringConfig {
  scanIntervalMs: number;
  alertOnAnomalyTypes: ('inconsistency' | 'timing' | 'value' | 'participant' | 'pattern' | 'security')[];
  minSeverityForAlert: 'info' | 'warning' | 'error' | 'critical';
  autoHealEnabled: boolean;
  detectionSensitivity: number; // 1-10, higher means more sensitive
  storeHistoryDays: number;
  maxConcurrentChecks: number;
  networkTimeoutMs: number;
}

/**
 * Transaction Integrity Monitoring System
 */
class TransactionIntegrityMonitor {
  private monitoringActive: boolean = false;
  private scanIntervalId: number | null = null;
  private detectedAnomalies: TransactionAnomaly[] = [];
  private monitoredTransactions: Map<string, {
    transaction: CrossChainTransaction;
    lastCheckTimestamp: number;
    checkCount: number;
    anomalies: TransactionAnomaly[];
  }> = new Map();
  private integrityCheckHistory: IntegrityCheckResult[] = [];
  private selfHealingEnabled: boolean = true;
  private networkStatus: Record<BlockchainNetwork, {
    isOnline: boolean;
    responseTimes: number[];
    lastUpdated: number;
  }> = {
    'Ethereum': { isOnline: false, responseTimes: [], lastUpdated: 0 },
    'Solana': { isOnline: false, responseTimes: [], lastUpdated: 0 },
    'TON': { isOnline: false, responseTimes: [], lastUpdated: 0 },
    'Bitcoin': { isOnline: false, responseTimes: [], lastUpdated: 0 }
  };
  
  // Default configuration
  private config: MonitoringConfig = {
    scanIntervalMs: 60000, // 1 minute
    alertOnAnomalyTypes: ['inconsistency', 'value', 'security'],
    minSeverityForAlert: 'warning',
    autoHealEnabled: true,
    detectionSensitivity: 7, // Medium-high sensitivity
    storeHistoryDays: 7,
    maxConcurrentChecks: 5,
    networkTimeoutMs: 15000 // 15 seconds
  };
  
  // Registered callbacks for monitoring events
  private anomalyCallbacks: ((anomaly: TransactionAnomaly) => void)[] = [];
  private statusChangeCallbacks: ((status: MonitoringStatus) => void)[] = [];
  
  constructor() {
    this.updateNetworkStatuses();
  }
  
  /**
   * Start monitoring transactions
   */
  public startMonitoring(): boolean {
    if (this.monitoringActive) {
      console.log('Transaction monitoring already active');
      return false;
    }
    
    console.log('Starting transaction integrity monitoring');
    this.monitoringActive = true;
    
    // Schedule periodic scanning
    this.scanIntervalId = window.setInterval(() => {
      this.scanTransactions();
    }, this.config.scanIntervalMs);
    
    // Initial scan
    this.scanTransactions();
    
    // Notify status change
    this.notifyStatusChange();
    
    return true;
  }
  
  /**
   * Stop monitoring transactions
   */
  public stopMonitoring(): boolean {
    if (!this.monitoringActive) {
      console.log('Transaction monitoring not active');
      return false;
    }
    
    console.log('Stopping transaction integrity monitoring');
    this.monitoringActive = false;
    
    // Clear interval
    if (this.scanIntervalId !== null) {
      window.clearInterval(this.scanIntervalId);
      this.scanIntervalId = null;
    }
    
    // Notify status change
    this.notifyStatusChange();
    
    return true;
  }
  
  /**
   * Set monitoring configuration
   */
  public setConfig(config: Partial<MonitoringConfig>): void {
    const oldInterval = this.config.scanIntervalMs;
    
    // Update configuration with new values
    this.config = {
      ...this.config,
      ...config
    };
    
    // If scan interval changed and monitoring is active, restart the scan interval
    if (this.monitoringActive && oldInterval !== this.config.scanIntervalMs) {
      if (this.scanIntervalId !== null) {
        window.clearInterval(this.scanIntervalId);
      }
      
      this.scanIntervalId = window.setInterval(() => {
        this.scanTransactions();
      }, this.config.scanIntervalMs);
    }
    
    // Update self-healing enabled flag
    this.selfHealingEnabled = this.config.autoHealEnabled;
    
    console.log('Transaction monitoring configuration updated:', this.config);
  }
  
  /**
   * Update network statuses for all supported blockchains
   */
  private async updateNetworkStatuses(): Promise<void> {
    // Check Ethereum status
    if (ethereumService) {
      const startTime = Date.now();
      try {
        const isConnected = await ethereumService.isServiceConnected();
        const endTime = Date.now();
        
        this.networkStatus.Ethereum = {
          isOnline: isConnected,
          responseTimes: [...this.networkStatus.Ethereum.responseTimes.slice(-9), endTime - startTime],
          lastUpdated: Date.now()
        };
      } catch (error) {
        console.error('Error checking Ethereum status:', error);
        this.networkStatus.Ethereum.isOnline = false;
        this.networkStatus.Ethereum.lastUpdated = Date.now();
      }
    }
    
    // Check Solana status
    if (solanaService) {
      const startTime = Date.now();
      try {
        const isConnected = solanaService.isServiceConnected();
        const endTime = Date.now();
        
        this.networkStatus.Solana = {
          isOnline: isConnected,
          responseTimes: [...this.networkStatus.Solana.responseTimes.slice(-9), endTime - startTime],
          lastUpdated: Date.now()
        };
      } catch (error) {
        console.error('Error checking Solana status:', error);
        this.networkStatus.Solana.isOnline = false;
        this.networkStatus.Solana.lastUpdated = Date.now();
      }
    }
    
    // Check TON status
    if (tonService) {
      const startTime = Date.now();
      try {
        const isConnected = await tonService.isConnected();
        const endTime = Date.now();
        
        this.networkStatus.TON = {
          isOnline: isConnected,
          responseTimes: [...this.networkStatus.TON.responseTimes.slice(-9), endTime - startTime],
          lastUpdated: Date.now()
        };
      } catch (error) {
        console.error('Error checking TON status:', error);
        this.networkStatus.TON.isOnline = false;
        this.networkStatus.TON.lastUpdated = Date.now();
      }
    }
    
    // Check Bitcoin status (if available)
    if (bitcoinService) {
      const startTime = Date.now();
      try {
        const isConnected = await bitcoinService.isConnected();
        const endTime = Date.now();
        
        this.networkStatus.Bitcoin = {
          isOnline: isConnected,
          responseTimes: [...this.networkStatus.Bitcoin.responseTimes.slice(-9), endTime - startTime],
          lastUpdated: Date.now()
        };
      } catch (error) {
        console.error('Error checking Bitcoin status:', error);
        this.networkStatus.Bitcoin.isOnline = false;
        this.networkStatus.Bitcoin.lastUpdated = Date.now();
      }
    }
    
    // Notify status change
    this.notifyStatusChange();
  }
  
  /**
   * Register a transaction for monitoring
   */
  public async monitorTransaction(transaction: CrossChainTransaction): Promise<boolean> {
    if (!transaction.id || !transaction.correlationId) {
      console.error('Cannot monitor transaction without id and correlationId');
      return false;
    }
    
    if (this.monitoredTransactions.has(transaction.id)) {
      // Update existing entry
      const existingEntry = this.monitoredTransactions.get(transaction.id)!;
      existingEntry.transaction = transaction;
      // Don't reset lastCheckTimestamp or checkCount
      this.monitoredTransactions.set(transaction.id, existingEntry);
      console.log(`Updated monitored transaction: ${transaction.id}`);
    } else {
      // Add new entry
      this.monitoredTransactions.set(transaction.id, {
        transaction,
        lastCheckTimestamp: 0, // Never checked
        checkCount: 0,
        anomalies: []
      });
      console.log(`Added transaction to monitoring: ${transaction.id}`);
      
      // Perform immediate check for new transactions
      await this.checkTransactionIntegrity(transaction);
    }
    
    return true;
  }
  
  /**
   * Stop monitoring a specific transaction
   */
  public unmonitorTransaction(transactionId: string): boolean {
    if (!this.monitoredTransactions.has(transactionId)) {
      return false;
    }
    
    this.monitoredTransactions.delete(transactionId);
    console.log(`Removed transaction from monitoring: ${transactionId}`);
    return true;
  }
  
  /**
   * Scan all monitored transactions
   */
  private async scanTransactions(): Promise<void> {
    if (!this.monitoringActive) {
      return;
    }
    
    console.log(`Scanning ${this.monitoredTransactions.size} monitored transactions`);
    
    // Update network statuses before scanning
    await this.updateNetworkStatuses();
    
    // Create prioritized list of transactions to check
    const prioritizedTransactions: {
      transactionId: string;
      priority: number; // Higher = more important
      transaction: CrossChainTransaction;
    }[] = [];
    
    for (const [id, entry] of this.monitoredTransactions.entries()) {
      // Skip transactions that have completed all checks
      if (entry.transaction.status === 'confirmed' && entry.checkCount >= 3) {
        continue;
      }
      
      // Calculate priority based on:
      // 1. Time since last check (longer = higher priority)
      // 2. Transaction status (pending > confirming > confirmed)
      // 3. Number of anomalies (more = higher priority)
      // 4. Check count (fewer = higher priority, but with diminishing returns)
      const timeSinceLastCheck = Date.now() - entry.lastCheckTimestamp;
      const statusPriority = 
        entry.transaction.status === 'pending' ? 10 :
        entry.transaction.status === 'confirming' ? 5 :
        entry.transaction.status === 'failed' ? 3 : 1;
      const anomalyPriority = entry.anomalies.length * 2;
      const checkCountPriority = Math.max(0, 5 - entry.checkCount);
      
      const priority = 
        (timeSinceLastCheck / 60000) * 5 + // 5 points per minute since last check
        statusPriority +
        anomalyPriority +
        checkCountPriority;
      
      prioritizedTransactions.push({
        transactionId: id,
        priority,
        transaction: entry.transaction
      });
    }
    
    // Sort by priority (descending)
    prioritizedTransactions.sort((a, b) => b.priority - a.priority);
    
    // Check transactions up to the concurrent limit
    const transactionsToCheck = prioritizedTransactions
      .slice(0, this.config.maxConcurrentChecks);
    
    // Check each transaction in parallel
    await Promise.all(
      transactionsToCheck.map(({ transaction }) => 
        this.checkTransactionIntegrity(transaction)
      )
    );
    
    // Prune history based on configuration
    this.pruneHistory();
    
    // Notify status change
    this.notifyStatusChange();
  }
  
  /**
   * Check the integrity of a specific transaction
   */
  private async checkTransactionIntegrity(transaction: CrossChainTransaction): Promise<IntegrityCheckResult> {
    console.log(`Checking integrity of transaction ${transaction.id}`);
    
    const startTime = Date.now();
    let successful = false;
    
    // Get the entry for this transaction
    const entry = this.monitoredTransactions.get(transaction.id) || {
      transaction,
      lastCheckTimestamp: 0,
      checkCount: 0,
      anomalies: []
    };
    
    // Increment check count
    entry.checkCount++;
    entry.lastCheckTimestamp = Date.now();
    this.monitoredTransactions.set(transaction.id, entry);
    
    // The verification response(s)
    const verificationResponses: CrossChainVerificationResponse[] = [];
    
    // Detected anomalies during this check
    const newAnomalies: TransactionAnomaly[] = [];
    
    try {
      // Perform enhanced cross-chain verification
      const verification = await enhancedCrossChainVerifier.verifyTransaction({
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        sourceNetwork: transaction.network,
        initiatedAt: transaction.timestamp,
        securityLevel: transaction.securityLevel || 1,
        maxRetries: 2,
        timeout: this.config.networkTimeoutMs,
        requireAllPaths: false
      });
      
      // Store verification response
      verificationResponses.push(verification);
      
      // Process verification results
      const inconsistencies = verification.inconsistencies;
      const consistencyScore = verification.consistencyScore;
      
      // Create anomalies from inconsistencies
      for (const inconsistency of inconsistencies) {
        const anomaly: TransactionAnomaly = {
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          transactionId: transaction.id,
          correlationId: transaction.correlationId || transaction.id,
          anomalyType: 'inconsistency',
          severity: inconsistency.severity,
          description: inconsistency.description,
          affectedNetworks: inconsistency.networks,
          autoResolved: !!inconsistency.selfHealed,
          resolutionStrategy: inconsistency.selfHealed 
            ? 'Automatically resolved by the verification system' 
            : undefined,
          metadata: {
            field: inconsistency.field,
            verificationResponse: {
              requestId: verification.requestId,
              status: verification.status,
              consistencyScore: verification.consistencyScore
            }
          }
        };
        
        newAnomalies.push(anomaly);
        
        // If not already self-healed and self-healing is enabled, attempt to resolve
        if (!inconsistency.selfHealed && this.selfHealingEnabled) {
          if (await this.attemptToSelfHeal(anomaly, verification)) {
            anomaly.autoResolved = true;
            anomaly.resolutionStrategy = 'Self-healed by the monitoring system';
          }
        }
      }
      
      // Detect timing anomalies
      if (this.config.detectionSensitivity >= 5) {
        this.detectTimingAnomalies(transaction, verification, newAnomalies);
      }
      
      // Detect value anomalies (with higher sensitivity threshold)
      if (this.config.detectionSensitivity >= 7) {
        this.detectValueAnomalies(transaction, verification, newAnomalies);
      }
      
      // Detect security anomalies (with higher sensitivity threshold)
      if (this.config.detectionSensitivity >= 8) {
        this.detectSecurityAnomalies(transaction, verification, newAnomalies);
      }
      
      // Add anomalies to transaction entry
      for (const anomaly of newAnomalies) {
        entry.anomalies.push(anomaly);
        this.detectedAnomalies.push(anomaly);
        
        // Notify listeners about new anomalies
        if (this.shouldTriggerAlert(anomaly)) {
          this.notifyAnomaly(anomaly);
        }
      }
      
      // Store entry back
      this.monitoredTransactions.set(transaction.id, entry);
      
      // Calculate recommendations
      const recommendations = this.generateRecommendations(transaction, newAnomalies);
      
      // Create result
      const result: IntegrityCheckResult = {
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        timestamp: Date.now(),
        isValid: verification.overallResult,
        consistencyScore: verification.consistencyScore,
        anomalyCount: newAnomalies.length,
        criticalAnomalyCount: newAnomalies.filter(a => a.severity === 'critical').length,
        selfHealedCount: newAnomalies.filter(a => a.autoResolved).length,
        verificationResponses: verificationResponses,
        anomalies: newAnomalies,
        recommendations,
        executionTimeMs: Date.now() - startTime
      };
      
      // Store in history
      this.integrityCheckHistory.push(result);
      
      successful = true;
      return result;
      
    } catch (error) {
      console.error(`Error checking transaction integrity: ${transaction.id}`, error);
      
      // Create error anomaly
      const errorAnomaly: TransactionAnomaly = {
        id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        anomalyType: 'inconsistency',
        severity: 'error',
        description: `Error checking transaction integrity: ${error.message || 'Unknown error'}`,
        affectedNetworks: [transaction.network],
        autoResolved: false,
        metadata: {
          error: {
            message: error.message,
            stack: error.stack
          }
        }
      };
      
      // Add to new anomalies
      newAnomalies.push(errorAnomaly);
      
      // Add to transaction entry
      entry.anomalies.push(errorAnomaly);
      this.detectedAnomalies.push(errorAnomaly);
      
      // Notify listeners if appropriate
      if (this.shouldTriggerAlert(errorAnomaly)) {
        this.notifyAnomaly(errorAnomaly);
      }
      
      // Store entry back
      this.monitoredTransactions.set(transaction.id, entry);
      
      // Create error result
      const errorResult: IntegrityCheckResult = {
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        timestamp: Date.now(),
        isValid: false,
        consistencyScore: 0,
        anomalyCount: newAnomalies.length,
        criticalAnomalyCount: newAnomalies.filter(a => a.severity === 'critical').length,
        selfHealedCount: 0,
        verificationResponses: verificationResponses,
        anomalies: newAnomalies,
        recommendations: [
          'Retry verification when blockchain services are more responsive',
          'Check transaction manually using block explorers'
        ],
        executionTimeMs: Date.now() - startTime
      };
      
      // Store in history
      this.integrityCheckHistory.push(errorResult);
      
      return errorResult;
    } finally {
      // Always update last check timestamp
      entry.lastCheckTimestamp = Date.now();
      this.monitoredTransactions.set(transaction.id, entry);
      
      // Notify status change
      this.notifyStatusChange();
    }
  }
  
  /**
   * Attempt to self-heal an anomaly
   * Returns true if self-healing was successful
   */
  private async attemptToSelfHeal(
    anomaly: TransactionAnomaly, 
    verification: CrossChainVerificationResponse
  ): Promise<boolean> {
    console.log(`Attempting to self-heal anomaly: ${anomaly.id} (${anomaly.description})`);
    
    // Only handle certain types of anomalies
    switch (anomaly.anomalyType) {
      case 'inconsistency':
        if (anomaly.metadata?.field === 'confirmations') {
          // Confirmation inconsistencies can be "healed" by waiting
          // They resolve naturally with time, so just mark as resolved
          console.log('Self-healing confirmation count inconsistency (will resolve naturally)');
          return true;
        }
        
        if (anomaly.metadata?.field === 'timestamp' && anomaly.severity !== 'critical') {
          // Minor timestamp inconsistencies can be ignored
          console.log('Self-healing timestamp inconsistency (non-critical, can be ignored)');
          return true;
        }
        break;
        
      case 'timing':
        // For non-critical timing anomalies, self-healing is just acknowledging they're not problematic
        if (anomaly.severity !== 'critical') {
          console.log('Self-healing timing anomaly (non-critical, can be ignored)');
          return true;
        }
        break;
    }
    
    // For other anomalies, no self-healing is available
    return false;
  }
  
  /**
   * Detect timing anomalies in transaction verification
   */
  private detectTimingAnomalies(
    transaction: CrossChainTransaction,
    verification: CrossChainVerificationResponse,
    anomalies: TransactionAnomaly[]
  ): void {
    // If transaction is pending for too long
    if (transaction.status === 'pending' || transaction.status === 'confirming') {
      const ageMs = Date.now() - transaction.timestamp;
      
      // Different thresholds for different chains
      const timeoutThresholds: Record<BlockchainNetwork, number> = {
        'Ethereum': 15 * 60 * 1000, // 15 minutes
        'Solana': 5 * 60 * 1000,    // 5 minutes
        'TON': 10 * 60 * 1000,      // 10 minutes
        'Bitcoin': 30 * 60 * 1000   // 30 minutes
      };
      
      const threshold = timeoutThresholds[transaction.network] || 15 * 60 * 1000;
      
      if (ageMs > threshold) {
        anomalies.push({
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          transactionId: transaction.id,
          correlationId: transaction.correlationId || transaction.id,
          anomalyType: 'timing',
          severity: 'warning',
          description: `Transaction has been pending for ${Math.floor(ageMs / 60000)} minutes, which exceeds the expected threshold for ${transaction.network}`,
          affectedNetworks: [transaction.network],
          autoResolved: false
        });
      }
    }
    
    // Check for large execution time differences between verification paths
    const pathResults = verification.pathResults;
    if (Object.keys(pathResults).length > 1) {
      const executionTimes = Object.values(pathResults).map(r => r.executionTimeMs);
      const minTime = Math.min(...executionTimes);
      const maxTime = Math.max(...executionTimes);
      
      // If max time is more than 5x the min time, flag as anomaly
      if (maxTime > minTime * 5 && maxTime > 3000) {
        const slowPaths = Object.entries(pathResults)
          .filter(([_, result]) => result.executionTimeMs > minTime * 5)
          .map(([path, _]) => path);
        
        anomalies.push({
          id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: Date.now(),
          transactionId: transaction.id,
          correlationId: transaction.correlationId || transaction.id,
          anomalyType: 'timing',
          severity: 'info',
          description: `Large verification time differences detected between paths (min: ${minTime}ms, max: ${maxTime}ms)`,
          affectedNetworks: transaction.network ? [transaction.network] : [],
          autoResolved: true,
          resolutionStrategy: 'Acknowledged as informational only',
          metadata: {
            executionTimes: executionTimes,
            slowPaths
          }
        });
      }
    }
  }
  
  /**
   * Detect value anomalies in transaction verification
   */
  private detectValueAnomalies(
    transaction: CrossChainTransaction,
    verification: CrossChainVerificationResponse,
    anomalies: TransactionAnomaly[]
  ): void {
    // Only run this check for transactions with amounts
    if (!transaction.amount) {
      return;
    }
    
    // Convert amount to number for comparison
    let amount: number;
    try {
      amount = typeof transaction.amount === 'string' 
        ? parseFloat(transaction.amount) 
        : transaction.amount;
    } catch (error) {
      console.warn('Could not parse transaction amount', transaction.amount);
      return;
    }
    
    // Define unusual value thresholds per network
    const unusualAmountThresholds: Record<BlockchainNetwork, number> = {
      'Ethereum': 100, // 100 ETH is unusual
      'Solana': 10000, // 10,000 SOL is unusual
      'TON': 10000,    // 10,000 TON is unusual
      'Bitcoin': 10    // 10 BTC is unusual
    };
    
    const threshold = unusualAmountThresholds[transaction.network] || 1000;
    
    // Check for unusually large amounts
    if (amount > threshold) {
      anomalies.push({
        id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        anomalyType: 'value',
        severity: 'warning',
        description: `Unusually large transaction amount: ${amount} ${transaction.symbol || ''}`,
        affectedNetworks: [transaction.network],
        autoResolved: false
      });
    }
  }
  
  /**
   * Detect security anomalies in transaction verification
   */
  private detectSecurityAnomalies(
    transaction: CrossChainTransaction,
    verification: CrossChainVerificationResponse,
    anomalies: TransactionAnomaly[]
  ): void {
    // Check for low consistency score
    if (verification.consistencyScore < 50) {
      anomalies.push({
        id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        anomalyType: 'security',
        severity: 'error',
        description: `Low cross-chain consistency score: ${verification.consistencyScore}/100`,
        affectedNetworks: verification.targetNetworks,
        autoResolved: false
      });
    }
    
    // Check for critical security level transactions with verification issues
    if ((transaction.securityLevel || 1) >= 3 && verification.status !== 'completed') {
      anomalies.push({
        id: `anomaly-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        transactionId: transaction.id,
        correlationId: transaction.correlationId || transaction.id,
        anomalyType: 'security',
        severity: 'critical',
        description: `High security level transaction (${transaction.securityLevel}) with incomplete verification (${verification.status})`,
        affectedNetworks: verification.targetNetworks,
        autoResolved: false
      });
    }
  }
  
  /**
   * Generate recommendations based on transaction and anomalies
   */
  private generateRecommendations(
    transaction: CrossChainTransaction,
    anomalies: TransactionAnomaly[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Add recommendations based on transaction status
    if (transaction.status === 'pending' && Date.now() - transaction.timestamp > 10 * 60 * 1000) {
      recommendations.push('Transaction has been pending for a long time, consider checking gas price/fees');
    }
    
    if (transaction.status === 'failed') {
      recommendations.push('Transaction failed, check reason in blockchain explorer');
    }
    
    // Add recommendations based on anomaly types
    const hasCriticalAnomalies = anomalies.some(a => a.severity === 'critical');
    const hasErrorAnomalies = anomalies.some(a => a.severity === 'error');
    const hasInconsistencyAnomalies = anomalies.some(a => a.anomalyType === 'inconsistency');
    const hasSecurityAnomalies = anomalies.some(a => a.anomalyType === 'security');
    
    if (hasCriticalAnomalies) {
      recommendations.push('Critical anomalies detected, manual verification recommended');
    }
    
    if (hasErrorAnomalies) {
      recommendations.push('Error-level anomalies detected, review transaction details');
    }
    
    if (hasInconsistencyAnomalies) {
      recommendations.push('Cross-chain inconsistencies detected, verify transaction on all networks');
    }
    
    if (hasSecurityAnomalies) {
      recommendations.push('Security anomalies detected, additional verification recommended');
    }
    
    return recommendations;
  }
  
  /**
   * Determine if an anomaly should trigger an alert
   */
  private shouldTriggerAlert(anomaly: TransactionAnomaly): boolean {
    const severityLevels: Record<string, number> = {
      'info': 1,
      'warning': 2,
      'error': 3,
      'critical': 4
    };
    
    const configSeverityLevel = severityLevels[this.config.minSeverityForAlert];
    const anomalySeverityLevel = severityLevels[anomaly.severity];
    
    // Only alert if it's at or above the configured severity
    if (anomalySeverityLevel < configSeverityLevel) {
      return false;
    }
    
    // Check if this type of anomaly should trigger an alert
    return this.config.alertOnAnomalyTypes.includes(anomaly.anomalyType);
  }
  
  /**
   * Notify listeners about a detected anomaly
   */
  private notifyAnomaly(anomaly: TransactionAnomaly): void {
    this.anomalyCallbacks.forEach(callback => {
      try {
        callback(anomaly);
      } catch (error) {
        console.error('Error in anomaly callback:', error);
      }
    });
  }
  
  /**
   * Notify listeners about status changes
   */
  private notifyStatusChange(): void {
    const status = this.getMonitoringStatus();
    
    this.statusChangeCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status change callback:', error);
      }
    });
  }
  
  /**
   * Register a callback for anomaly detection
   */
  public onAnomaly(callback: (anomaly: TransactionAnomaly) => void): void {
    this.anomalyCallbacks.push(callback);
  }
  
  /**
   * Register a callback for status changes
   */
  public onStatusChange(callback: (status: MonitoringStatus) => void): void {
    this.statusChangeCallbacks.push(callback);
  }
  
  /**
   * Unregister a callback for anomaly detection
   */
  public offAnomaly(callback: (anomaly: TransactionAnomaly) => void): void {
    const index = this.anomalyCallbacks.indexOf(callback);
    if (index !== -1) {
      this.anomalyCallbacks.splice(index, 1);
    }
  }
  
  /**
   * Unregister a callback for status changes
   */
  public offStatusChange(callback: (status: MonitoringStatus) => void): void {
    const index = this.statusChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      this.statusChangeCallbacks.splice(index, 1);
    }
  }
  
  /**
   * Get detected anomalies for a specific transaction
   */
  public getAnomalies(transactionId?: string): TransactionAnomaly[] {
    if (transactionId) {
      const entry = this.monitoredTransactions.get(transactionId);
      return entry ? [...entry.anomalies] : [];
    }
    
    return [...this.detectedAnomalies];
  }
  
  /**
   * Get the current monitoring status
   */
  public getMonitoringStatus(): MonitoringStatus {
    // Calculate the number of anomalies detected and resolved
    const totalAnomalies = this.detectedAnomalies.length;
    const resolvedAnomalies = this.detectedAnomalies.filter(a => a.autoResolved).length;
    
    // Calculate average response times
    const networkStatusMap: MonitoringStatus['networkStatusMap'] = {};
    
    for (const [network, status] of Object.entries(this.networkStatus)) {
      const responseTimes = status.responseTimes;
      const avgResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;
      
      networkStatusMap[network as BlockchainNetwork] = {
        isOnline: status.isOnline,
        averageResponseTimeMs: avgResponseTime,
        lastUpdated: status.lastUpdated
      };
    }
    
    return {
      isActive: this.monitoringActive,
      transactionsMonitored: this.monitoredTransactions.size,
      anomaliesDetected: totalAnomalies,
      anomaliesResolved: resolvedAnomalies,
      lastScanTimestamp: this.monitoredTransactions.size > 0
        ? Math.max(...Array.from(this.monitoredTransactions.values()).map(entry => entry.lastCheckTimestamp))
        : null,
      scanInterval: this.config.scanIntervalMs,
      networkStatusMap
    };
  }
  
  /**
   * Get integrity check history
   */
  public getIntegrityCheckHistory(): IntegrityCheckResult[] {
    return [...this.integrityCheckHistory];
  }
  
  /**
   * Get the integrity check history for a specific transaction
   */
  public getTransactionIntegrityHistory(transactionId: string): IntegrityCheckResult[] {
    return this.integrityCheckHistory.filter(check => check.transactionId === transactionId);
  }
  
  /**
   * Prune old history based on configuration
   */
  private pruneHistory(): void {
    const cutoffTime = Date.now() - (this.config.storeHistoryDays * 24 * 60 * 60 * 1000);
    
    // Prune integrity check history
    this.integrityCheckHistory = this.integrityCheckHistory.filter(
      check => check.timestamp >= cutoffTime
    );
    
    // Prune detected anomalies
    this.detectedAnomalies = this.detectedAnomalies.filter(
      anomaly => anomaly.timestamp >= cutoffTime
    );
    
    // Prune anomalies from monitored transactions
    for (const [id, entry] of this.monitoredTransactions.entries()) {
      entry.anomalies = entry.anomalies.filter(
        anomaly => anomaly.timestamp >= cutoffTime
      );
      
      this.monitoredTransactions.set(id, entry);
    }
  }
}

// Create and export singleton instance
export const transactionIntegrityMonitor = new TransactionIntegrityMonitor();