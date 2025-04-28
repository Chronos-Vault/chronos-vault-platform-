/**
 * Security Service Aggregator for Chronos Vault
 * 
 * This service aggregates security-related functionality from multiple services
 * to provide a comprehensive security dashboard and monitoring system.
 * It implements the Triple-Chain Security system by validating data across
 * Ethereum, Solana, and TON chains.
 * 
 * The enhanced version includes:
 * 1. Cross-chain incident correlation and monitoring
 * 2. Automated security level escalation for correlated incidents
 * 3. Real-time blockchain network status monitoring
 * 4. Suspicious multi-chain activity detection
 */

import { BlockchainType, SecurityRiskLevel } from './interfaces';
import { getAnomalyDetectionService, AnomalyDetectionResult } from './AnomalyDetectionService';
import { getIncidentResponseService, SecurityIncident } from './SecurityIncidentResponseService';
import { getTransactionMonitoringService, MonitoringAlert } from './TransactionMonitoringService';
import { getMultiSignatureService, SignatureRequest } from './MultiSignatureService';
import { secureCrossChainService } from './secure-service';
import { ethereumService } from '../ethereum/ethereum-service';
import { solanaService } from '../solana/solana-service';
import { tonContractService as tonService } from '../ton/ton-contract-service';

/**
 * Cross-chain correlation incident
 * Represents a security incident that spans multiple blockchains
 */
export interface CrossChainCorrelation {
  id: string;
  timestamp: number;
  address: string;
  relatedIncidents: SecurityIncident[];
  correlatedChains: BlockchainType[];
  correlationType: 'temporal' | 'pattern' | 'address' | 'asset';
  confidenceScore: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  status: 'active' | 'investigating' | 'resolved';
  timeWindow: number; // time window in milliseconds for correlation
  responseActions: {
    action: string;
    timestamp: number;
    status: 'pending' | 'completed' | 'failed';
    details?: string;
  }[];
}

/**
 * Network status for real-time blockchain monitoring
 */
export interface BlockchainNetworkStatus {
  blockchain: BlockchainType;
  status: 'online' | 'degraded' | 'offline' | 'unknown';
  latency: number; // in milliseconds
  lastBlock: number | string;
  lastBlockTime: number;
  nodeCount: number;
  apiStatus: 'operational' | 'issues' | 'down';
  lastChecked: number;
  historicalUptime: number; // percentage (0-100)
}

/**
 * Security status for a blockchain network
 */
export interface NetworkSecurityStatus {
  blockchain: BlockchainType;
  status: 'normal' | 'alert' | 'incident';
  incidentCount: number;
  alertCount: number;
  anomalyCount: number;
  lastIncident?: SecurityIncident;
  lastUpdated: number;
}

/**
 * Security metrics for user display
 */
export interface SecurityMetrics {
  securityScore: number;          // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  pendingSignatures: number;
  activeMonitoring: boolean;
  lastScan: number;
  networkStatuses: NetworkSecurityStatus[];
  securityIncidents: SecurityIncident[];
  monitoringAlerts: MonitoringAlert[];
  anomalies: AnomalyDetectionResult[];
}

/**
 * Cross-chain verification result
 */
export interface CrossChainVerificationResult {
  vaultId: string;
  verified: boolean;
  ethereumStatus: {
    verified: boolean;
    blockNumber?: number;
    timestamp?: number;
    error?: string;
  };
  solanaStatus: {
    verified: boolean;
    slot?: number;
    timestamp?: number;
    error?: string;
  };
  tonStatus: {
    verified: boolean;
    blockId?: string;
    timestamp?: number;
    error?: string;
  };
  overallStatus: 'verified' | 'partial' | 'failed';
  timestamp: number;
}

/**
 * Security Service Aggregator - Implements Triple-Chain Security
 */
class SecurityServiceAggregator {
  private incidentService = getIncidentResponseService();
  private monitoringService = getTransactionMonitoringService();
  private anomalyService = getAnomalyDetectionService();
  private signatureService = getMultiSignatureService();
  
  // Real-time monitoring intervals
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private securityLevels: Map<string, number> = new Map();
  private readonly MONITORING_INTERVAL = 30000; // 30 seconds
  
  // Cross-chain correlation monitoring
  private correlationMonitoringActive = false;
  private correlationMonitoringInterval: NodeJS.Timeout | null = null;
  private readonly CORRELATION_INTERVAL = 60000; // 1 minute
  private readonly INCIDENT_CORRELATION_WINDOW = 600000; // 10 minutes
  private crossChainCorrelations: Map<string, CrossChainCorrelation> = new Map();
  private networkStatuses: Map<BlockchainType, BlockchainNetworkStatus> = new Map();
  
  /**
   * Get security metrics for an address
   */
  async getSecurityMetrics(address: string): Promise<SecurityMetrics> {
    // Fetch data from various security services
    const [incidents, alerts, anomalies, signatureRequests] = await Promise.all([
      this.incidentService.getIncidentsForAddress(address),
      this.monitoringService.getAlertsForAddress(address),
      this.anomalyService.getAnomaliesForAddress(address),
      this.signatureService.getSignatureRequestsForAddress(address)
    ]);
    
    // Calculate security score based on incidents, alerts, and anomalies
    const securityScore = this.calculateSecurityScore(incidents, alerts, anomalies);
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(securityScore);
    
    // Generate network statuses
    const networkStatuses = this.generateNetworkStatuses(incidents, alerts, anomalies);
    
    return {
      securityScore,
      riskLevel,
      pendingSignatures: signatureRequests.filter(req => !req.signed).length,
      activeMonitoring: this.monitoringService.isMonitoringActive(address),
      lastScan: this.anomalyService.getLastScanTime(address),
      networkStatuses,
      securityIncidents: incidents,
      monitoringAlerts: alerts,
      anomalies
    };
  }
  
  /**
   * Activate enhanced security monitoring
   */
  async activateEnhancedMonitoring(address: string): Promise<boolean> {
    const success = await this.monitoringService.activateMonitoring(address);
    
    if (success) {
      // Start real-time monitoring
      this.startRealTimeMonitoring(address);
    }
    
    return success;
  }
  
  /**
   * Deactivate enhanced security monitoring
   */
  async deactivateEnhancedMonitoring(address: string): Promise<boolean> {
    const success = await this.monitoringService.deactivateMonitoring(address);
    
    if (success) {
      // Stop real-time monitoring
      this.stopRealTimeMonitoring(address);
    }
    
    return success;
  }
  
  /**
   * Set security level for an address (1-5)
   * Higher levels have more frequent checks and stricter validation
   */
  async setSecurityLevel(address: string, level: number): Promise<boolean> {
    if (level < 1 || level > 5) {
      throw new Error('Security level must be between 1 and 5');
    }
    
    this.securityLevels.set(address, level);
    
    // If monitoring is active, restart it with the new security level
    if (this.monitoringService.isMonitoringActive(address)) {
      this.stopRealTimeMonitoring(address);
      this.startRealTimeMonitoring(address);
    }
    
    return true;
  }
  
  /**
   * Get the current security level for an address
   */
  getSecurityLevel(address: string): number {
    return this.securityLevels.get(address) || 3; // Default to level 3
  }
  
  /**
   * Start real-time monitoring for an address
   */
  private startRealTimeMonitoring(address: string): void {
    // Stop existing monitoring if any
    this.stopRealTimeMonitoring(address);
    
    // Determine monitoring frequency based on security level
    const securityLevel = this.getSecurityLevel(address);
    const interval = Math.max(5000, this.MONITORING_INTERVAL / securityLevel);
    
    console.log(`Starting real-time monitoring for ${address} at level ${securityLevel} (interval: ${interval}ms)`);
    
    // Start interval check
    const monitoringInterval = setInterval(async () => {
      try {
        console.log(`Running scheduled security check for ${address}`);
        
        // Run anomaly detection
        const anomalies = await this.anomalyService.scanForAnomalies(address, {
          sensitivityLevel: securityLevel,
          lookbackDays: 1,
          includeHistory: false
        });
        
        // If anomalies detected, create alerts
        if (anomalies.length > 0) {
          console.warn(`Detected ${anomalies.length} anomalies for ${address}`);
          
          // Create alerts for high confidence anomalies
          for (const anomaly of anomalies) {
            if (anomaly.confidenceScore > 0.7) {
              await this.monitoringService.createAlert(
                anomaly.blockchain,
                address,
                'unusual_pattern',
                anomaly.confidenceScore > 0.9 ? 'high' : 'medium',
                `Detected ${anomaly.anomalyType} anomaly with ${Math.round(anomaly.confidenceScore * 100)}% confidence`
              );
            }
          }
        }
        
        // For high security levels (4-5), verify associated vaults every monitoring cycle
        if (securityLevel >= 4) {
          // Query for vaults associated with this address and verify them
          // In a real implementation, this would fetch vaults from the database
          // For now, we'll use a mock implementation
          const mockVaultIds = [`vault-${address.substring(0, 8)}`];
          
          for (const vaultId of mockVaultIds) {
            const result = await this.verifyVaultTripleChain(vaultId);
            
            if (!result.verified) {
              console.warn(`Real-time monitoring detected verification issues with vault ${vaultId}`);
            }
          }
        }
        
      } catch (error) {
        console.error(`Error in real-time monitoring for ${address}:`, error);
      }
    }, interval);
    
    // Store the interval reference
    this.monitoringIntervals.set(address, monitoringInterval);
  }
  
  /**
   * Stop real-time monitoring for an address
   */
  private stopRealTimeMonitoring(address: string): void {
    const existingInterval = this.monitoringIntervals.get(address);
    
    if (existingInterval) {
      clearInterval(existingInterval);
      this.monitoringIntervals.delete(address);
      console.log(`Stopped real-time monitoring for ${address}`);
    }
  }
  
  /**
   * Trigger a security scan
   */
  async triggerSecurityScan(address: string): Promise<{
    success: boolean;
    anomalies: AnomalyDetectionResult[];
  }> {
    const anomalies = await this.anomalyService.scanForAnomalies(address);
    return {
      success: true,
      anomalies
    };
  }
  
  /**
   * Resolve a security incident
   */
  async resolveIncident(incidentId: string): Promise<boolean> {
    return this.incidentService.resolveIncident(incidentId);
  }
  
  /**
   * Sign a pending signature request
   */
  async signRequest(requestId: string, signatureData: string): Promise<boolean> {
    return this.signatureService.submitSignature(requestId, signatureData);
  }
  
  /**
   * Verify a vault across all three blockchains (Ethereum, Solana, TON)
   * This is the core implementation of the Triple-Chain Security protocol
   */
  async verifyVaultTripleChain(vaultId: string): Promise<CrossChainVerificationResult> {
    console.log(`Starting Triple-Chain verification for vault: ${vaultId}`);
    
    // Initialize the verification result
    const result: CrossChainVerificationResult = {
      vaultId,
      verified: false,
      ethereumStatus: {
        verified: false
      },
      solanaStatus: {
        verified: false
      },
      tonStatus: {
        verified: false
      },
      overallStatus: 'failed',
      timestamp: Date.now()
    };
    
    // Run verifications in parallel with timeouts and retries
    const maxRetries = 2;
    const timeout = 10000; // 10 seconds timeout for each verification attempt
    
    const verifyWithRetries = async (
      verifier: (id: string) => Promise<any>,
      chainName: string,
      id: string
    ) => {
      let retries = 0;
      while (retries <= maxRetries) {
        try {
          // Create a timeout promise
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${chainName} verification timed out`)), timeout);
          });
          
          // Race between verification and timeout
          return await Promise.race([
            verifier(id),
            timeoutPromise
          ]);
        } catch (err: any) {
          console.error(`${chainName} verification error (attempt ${retries + 1}/${maxRetries + 1}): ${err.message}`);
          if (retries === maxRetries) {
            return { verified: false, error: err.message };
          }
          retries++;
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
        }
      }
      return { verified: false, error: 'Maximum retries exceeded' };
    };
    
    // Execute all chain verifications with retry logic
    const [ethereumVerification, solanaVerification, tonVerification] = await Promise.all([
      verifyWithRetries(this.verifyOnEthereum.bind(this), 'Ethereum', vaultId),
      verifyWithRetries(this.verifyOnSolana.bind(this), 'Solana', vaultId),
      verifyWithRetries(this.verifyOnTON.bind(this), 'TON', vaultId)
    ]);
    
    // Update result with verification outcomes
    result.ethereumStatus = { ...result.ethereumStatus, ...ethereumVerification };
    result.solanaStatus = { ...result.solanaStatus, ...solanaVerification };
    result.tonStatus = { ...result.tonStatus, ...tonVerification };
    
    // Cross-validate consistency of data between chains
    const isDataConsistent = await this.validateCrossChainConsistency(
      ethereumVerification, 
      solanaVerification, 
      tonVerification
    );
    
    // Determine overall verification status
    const verifiedCount = [
      ethereumVerification.verified,
      solanaVerification.verified,
      tonVerification.verified
    ].filter(Boolean).length;
    
    if (verifiedCount === 3 && isDataConsistent) {
      result.overallStatus = 'verified';
      result.verified = true;
      console.log(`Vault ${vaultId} successfully verified across all three chains`);
      
      // Record successful verification
      await this.recordSuccessfulVerification(vaultId, result);
    } else if (verifiedCount >= 1) {
      result.overallStatus = 'partial';
      result.verified = false;
      
      // Report security incident based on severity
      if (!isDataConsistent) {
        console.warn(`Cross-chain data inconsistency detected for vault ${vaultId}`);
        await this.reportCrossChainDataInconsistency(vaultId, result);
      } else if (verifiedCount < 2) {
        console.warn(`Partial verification (${verifiedCount}/3) for vault ${vaultId}`);
        await this.reportCrossChainDiscrepancy(vaultId, result);
      }
    } else {
      result.overallStatus = 'failed';
      result.verified = false;
      
      // Report critical security incident for complete verification failure
      console.error(`Complete verification failure for vault ${vaultId}`);
      await this.reportCriticalVerificationFailure(vaultId, result);
    }
    
    return result;
  }
  
  /**
   * Validate consistency of data across chains
   * Ensures that critical vault properties match across all three blockchains
   */
  private async validateCrossChainConsistency(
    ethereumData: any,
    solanaData: any,
    tonData: any
  ): Promise<boolean> {
    // Only check consistency if we have verified data from at least two chains
    if (!ethereumData.verified && !solanaData.verified && !tonData.verified) {
      return false;
    }
    
    try {
      // Extract vault details from each chain
      const ethereumDetails = ethereumData.details || {};
      const solanaDetails = solanaData.details || {};
      const tonDetails = tonData.vault || {};
      
      // Check timestamps are within acceptable range (5 minutes)
      const timestamps = [
        ethereumData.timestamp,
        solanaData.timestamp, 
        tonData.timestamp
      ].filter(ts => typeof ts === 'number');
      
      if (timestamps.length >= 2) {
        const maxTimeDiff = 5 * 60 * 1000; // 5 minutes
        const maxTimestamp = Math.max(...timestamps);
        const minTimestamp = Math.min(...timestamps);
        
        if (maxTimestamp - minTimestamp > maxTimeDiff) {
          console.warn('Timestamp inconsistency detected across chains');
          return false;
        }
      }
      
      // Verify critical vault properties match
      // Build comparison sets based on available data
      const comparisons = [];
      
      // Only add comparisons where both sides have verified data
      if (ethereumData.verified && solanaData.verified) {
        comparisons.push({
          ethereumUnlockTime: ethereumDetails.unlockTime,
          solanaUnlockTime: solanaDetails.unlockTime,
          match: Math.abs(ethereumDetails.unlockTime - solanaDetails.unlockTime) < 60 // Within 1 minute
        });
      }
      
      if (ethereumData.verified && tonData.verified) {
        comparisons.push({
          ethereumUnlockTime: ethereumDetails.unlockTime,
          tonUnlockTime: tonDetails.unlockTime,
          match: Math.abs(ethereumDetails.unlockTime - tonDetails.unlockTime) < 60 // Within 1 minute
        });
      }
      
      if (solanaData.verified && tonData.verified) {
        comparisons.push({
          solanaUnlockTime: solanaDetails.unlockTime,
          tonUnlockTime: tonDetails.unlockTime,
          match: Math.abs(solanaDetails.unlockTime - tonDetails.unlockTime) < 60 // Within 1 minute
        });
      }
      
      // If we have comparisons, check if any failed
      if (comparisons.length > 0) {
        const allMatch = comparisons.every(comp => comp.match);
        if (!allMatch) {
          console.warn('Vault property inconsistency detected across chains');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating cross-chain consistency:', error);
      return false;
    }
  }
  
  /**
   * Record a successful verification
   */
  private async recordSuccessfulVerification(
    vaultId: string,
    verificationResult: CrossChainVerificationResult
  ): Promise<void> {
    try {
      // In a production environment, this would store the verification
      // result in a database, allowing for future auditing
      console.log(`Recording successful verification for vault ${vaultId}`);
      
      // Update last verification timestamp in the monitoring service
      await this.monitoringService.updateLastVerification(vaultId, verificationResult);
    } catch (error) {
      console.error('Error recording successful verification:', error);
    }
  }
  
  /**
   * Report a cross-chain data inconsistency
   */
  private async reportCrossChainDataInconsistency(
    vaultId: string,
    verificationResult: CrossChainVerificationResult
  ): Promise<void> {
    // This is a more severe incident than a simple discrepancy
    const blockchains: BlockchainType[] = [];
    const errorMessages: string[] = [];
    
    // Determine which chains are inconsistent
    if (verificationResult.ethereumStatus.verified) {
      blockchains.push('ETH');
    }
    
    if (verificationResult.solanaStatus.verified) {
      blockchains.push('SOL');
    }
    
    if (verificationResult.tonStatus.verified) {
      blockchains.push('TON');
    }
    
    // Report the data inconsistency for all affected chains
    for (const blockchain of blockchains) {
      await this.incidentService.reportIncident(
        blockchain,
        vaultId,
        'data_inconsistency',
        `Cross-chain data inconsistency detected for vault ${vaultId}`,
        'critical'
      );
    }
  }
  
  /**
   * Verify vault status on Ethereum blockchain
   */
  private async verifyOnEthereum(vaultId: string): Promise<{
    verified: boolean;
    blockNumber?: number;
    timestamp?: number;
    error?: string;
  }> {
    try {
      // Get Ethereum connection status
      const isConnected = ethereumService.isConnected();
      if (!isConnected) {
        return {
          verified: false,
          error: 'Ethereum provider not connected'
        };
      }
      
      // Attempt to verify the vault on Ethereum
      // In a real implementation, this would call a smart contract method
      // For now, we'll implement the verification logic directly
      
      // Get the current block number for reference
      const blockNumber = await ethereumService.getBlockNumber();
      
      // Verify the vault exists and has the expected state
      const vaultExists = await ethereumService.checkVaultExists(vaultId);
      if (!vaultExists) {
        return {
          verified: false,
          blockNumber,
          error: 'Vault not found on Ethereum'
        };
      }
      
      // Get vault details from Ethereum
      const vaultDetails = await ethereumService.getVaultDetails(vaultId);
      
      // Get the timestamp from the block
      const block = await ethereumService.getBlock(blockNumber);
      const timestamp = block?.timestamp || Date.now() / 1000;
      
      return {
        verified: true,
        blockNumber,
        timestamp: timestamp * 1000 // Convert to milliseconds
      };
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || 'Unknown Ethereum verification error'
      };
    }
  }
  
  /**
   * Verify vault status on Solana blockchain
   */
  private async verifyOnSolana(vaultId: string): Promise<{
    verified: boolean;
    slot?: number;
    timestamp?: number;
    error?: string;
  }> {
    try {
      // Check if Solana service is available
      const isConnected = solanaService.isConnected();
      if (!isConnected) {
        return {
          verified: false,
          error: 'Solana service not connected'
        };
      }
      
      // Get current slot for reference
      const slot = await solanaService.getCurrentSlot();
      
      // Verify the vault on Solana
      const vaultAccount = await solanaService.getVaultAccount(vaultId);
      if (!vaultAccount) {
        return {
          verified: false,
          slot,
          error: 'Vault not found on Solana'
        };
      }
      
      // Get the current timestamp
      const timestamp = Date.now();
      
      return {
        verified: true,
        slot,
        timestamp
      };
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || 'Unknown Solana verification error'
      };
    }
  }
  
  /**
   * Verify vault status on TON blockchain
   */
  private async verifyOnTON(vaultId: string): Promise<{
    verified: boolean;
    blockId?: string;
    timestamp?: number;
    error?: string;
  }> {
    try {
      // Check if TON service is connected
      const connectionStatus = tonService.getConnectionStatus();
      if (connectionStatus !== 'connected') {
        return {
          verified: false,
          error: 'TON service not connected'
        };
      }
      
      // Verify the vault on TON
      const vaultInfo = await tonService.getVaultInfo(vaultId);
      if (!vaultInfo) {
        return {
          verified: false,
          error: 'Vault not found on TON'
        };
      }
      
      // Get the verification proof from the TON contract
      const verificationProof = await tonService.getVaultVerificationProof(vaultId);
      
      // Current timestamp
      const timestamp = Date.now();
      
      return {
        verified: true,
        blockId: vaultInfo.blockId,
        timestamp
      };
    } catch (error: any) {
      return {
        verified: false,
        error: error.message || 'Unknown TON verification error'
      };
    }
  }
  
  /**
   * Report a cross-chain discrepancy as a security incident
   */
  private async reportCrossChainDiscrepancy(
    vaultId: string,
    verificationResult: CrossChainVerificationResult
  ): Promise<void> {
    const blockchains: BlockchainType[] = [];
    const errorMessages: string[] = [];
    
    // Determine which chains failed verification
    if (!verificationResult.ethereumStatus.verified) {
      blockchains.push('ETH');
      if (verificationResult.ethereumStatus.error) {
        errorMessages.push(`ETH: ${verificationResult.ethereumStatus.error}`);
      }
    }
    
    if (!verificationResult.solanaStatus.verified) {
      blockchains.push('SOL');
      if (verificationResult.solanaStatus.error) {
        errorMessages.push(`SOL: ${verificationResult.solanaStatus.error}`);
      }
    }
    
    if (!verificationResult.tonStatus.verified) {
      blockchains.push('TON');
      if (verificationResult.tonStatus.error) {
        errorMessages.push(`TON: ${verificationResult.tonStatus.error}`);
      }
    }
    
    // Report the incident for each affected chain
    for (const blockchain of blockchains) {
      await this.incidentService.reportIncident(
        blockchain,
        vaultId,
        'multi_sig_failure',
        `Cross-chain verification failure: ${errorMessages.join(', ')}`,
        'high'
      );
    }
  }
  
  /**
   * Report a critical verification failure across all chains
   */
  private async reportCriticalVerificationFailure(
    vaultId: string,
    verificationResult: CrossChainVerificationResult
  ): Promise<void> {
    // Report as critical incident on all three chains
    const errorMessages = [
      `ETH: ${verificationResult.ethereumStatus.error || 'Verification failed'}`,
      `SOL: ${verificationResult.solanaStatus.error || 'Verification failed'}`,
      `TON: ${verificationResult.tonStatus.error || 'Verification failed'}`
    ].join(', ');
    
    const blockchains: BlockchainType[] = ['ETH', 'SOL', 'TON'];
    
    for (const blockchain of blockchains) {
      await this.incidentService.reportIncident(
        blockchain,
        vaultId,
        'multi_sig_failure',
        `Critical cross-chain verification failure: ${errorMessages}`,
        'critical'
      );
    }
  }
  
  /**
   * Calculate security score based on security data
   */
  private calculateSecurityScore(
    incidents: SecurityIncident[],
    alerts: MonitoringAlert[],
    anomalies: AnomalyDetectionResult[]
  ): number {
    // Base score of 100
    let score = 100;
    
    // Deduct for active incidents based on severity
    incidents.forEach(incident => {
      if (!incident.resolved) {
        switch (incident.severity) {
          case 'critical':
            score -= 25;
            break;
          case 'high':
            score -= 15;
            break;
          case 'medium':
            score -= 10;
            break;
          case 'low':
            score -= 5;
            break;
        }
      }
    });
    
    // Deduct for active alerts
    alerts.forEach(alert => {
      if (!alert.dismissed) {
        switch (alert.level) {
          case 'high':
            score -= 8;
            break;
          case 'medium':
            score -= 5;
            break;
          case 'low':
            score -= 2;
            break;
        }
      }
    });
    
    // Deduct for anomalies
    anomalies.forEach(anomaly => {
      if (anomaly.confidenceScore > 0.7) {
        score -= 7;
      } else if (anomaly.confidenceScore > 0.4) {
        score -= 3;
      } else {
        score -= 1;
      }
    });
    
    // Ensure score stays within 0-100 range
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * Determine risk level based on security score
   */
  private determineRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score >= 75) {
      return 'low';
    } else if (score >= 50) {
      return 'medium';
    } else {
      return 'high';
    }
  }
  
  /**
   * Generate network security statuses
   */
  private generateNetworkStatuses(
    incidents: SecurityIncident[],
    alerts: MonitoringAlert[],
    anomalies: AnomalyDetectionResult[]
  ): NetworkSecurityStatus[] {
    // Get all unique blockchains from incidents, alerts, and anomalies
    const blockchains = new Set<BlockchainType>();
    
    incidents.forEach(incident => blockchains.add(incident.blockchain));
    alerts.forEach(alert => blockchains.add(alert.blockchain));
    anomalies.forEach(anomaly => blockchains.add(anomaly.blockchain));
    
    // Add default blockchains if not present
    ['ETH', 'TON', 'SOL', 'MATIC', 'BNB'].forEach(chain => {
      blockchains.add(chain as BlockchainType);
    });
    
    // Generate status for each blockchain
    return Array.from(blockchains).map(blockchain => {
      const chainIncidents = incidents.filter(i => i.blockchain === blockchain && !i.resolved);
      const chainAlerts = alerts.filter(a => a.blockchain === blockchain && !a.dismissed);
      const chainAnomalies = anomalies.filter(a => a.blockchain === blockchain);
      
      // Determine status
      let status: 'normal' | 'alert' | 'incident' = 'normal';
      if (chainIncidents.length > 0) {
        status = 'incident';
      } else if (chainAlerts.length > 0) {
        status = 'alert';
      }
      
      // Find last incident
      const lastIncident = chainIncidents.length > 0 
        ? chainIncidents.sort((a, b) => b.timestamp - a.timestamp)[0]
        : undefined;
      
      return {
        blockchain,
        status,
        incidentCount: chainIncidents.length,
        alertCount: chainAlerts.length,
        anomalyCount: chainAnomalies.length,
        lastIncident,
        lastUpdated: Date.now()
      };
    });
  }
  /**
   * Start cross-chain correlation monitoring
   * This enables global monitoring for correlated incidents across all chains
   */
  async startCrossChainCorrelationMonitoring(): Promise<boolean> {
    if (this.correlationMonitoringActive) {
      console.log('Cross-chain correlation monitoring is already active');
      return true;
    }
    
    console.log('Starting cross-chain correlation monitoring');
    this.correlationMonitoringActive = true;
    
    // Start tracking blockchain network statuses
    await this.updateAllBlockchainNetworkStatuses();
    
    // Start interval for correlation monitoring
    this.correlationMonitoringInterval = setInterval(async () => {
      try {
        // Update blockchain network statuses
        await this.updateAllBlockchainNetworkStatuses();
        
        // Check for correlated incidents
        await this.checkForCorrelatedIncidents();
      } catch (error) {
        console.error('Error in cross-chain correlation monitoring:', error);
      }
    }, this.CORRELATION_INTERVAL);
    
    return true;
  }
  
  /**
   * Stop cross-chain correlation monitoring
   */
  stopCrossChainCorrelationMonitoring(): boolean {
    if (!this.correlationMonitoringActive) {
      return true;
    }
    
    if (this.correlationMonitoringInterval) {
      clearInterval(this.correlationMonitoringInterval);
      this.correlationMonitoringInterval = null;
    }
    
    this.correlationMonitoringActive = false;
    console.log('Stopped cross-chain correlation monitoring');
    
    return true;
  }
  
  /**
   * Get all cross-chain correlations
   */
  async getCrossChainCorrelations(): Promise<CrossChainCorrelation[]> {
    return Array.from(this.crossChainCorrelations.values());
  }
  
  /**
   * Get a specific cross-chain correlation
   */
  async getCrossChainCorrelation(id: string): Promise<CrossChainCorrelation | undefined> {
    return this.crossChainCorrelations.get(id);
  }
  
  /**
   * Get all blockchain network statuses
   */
  async getBlockchainNetworkStatuses(): Promise<BlockchainNetworkStatus[]> {
    return Array.from(this.networkStatuses.values());
  }
  
  /**
   * Mark a cross-chain correlation as resolved
   */
  async resolveCorrelation(id: string): Promise<boolean> {
    const correlation = this.crossChainCorrelations.get(id);
    
    if (!correlation) {
      return false;
    }
    
    // Update correlation status
    correlation.status = 'resolved';
    this.crossChainCorrelations.set(id, correlation);
    
    // Also resolve related incidents
    for (const incident of correlation.relatedIncidents) {
      await this.resolveIncident(incident.id);
    }
    
    return true;
  }
  
  /**
   * Update network status for all blockchains
   * This checks the health and performance of each blockchain network
   */
  private async updateAllBlockchainNetworkStatuses(): Promise<void> {
    // Update Ethereum network status
    this.networkStatuses.set('ethereum', await this.getBlockchainNetworkStatus('ethereum'));
    
    // Update Solana network status
    this.networkStatuses.set('solana', await this.getBlockchainNetworkStatus('solana'));
    
    // Update TON network status
    this.networkStatuses.set('ton', await this.getBlockchainNetworkStatus('ton'));
  }
  
  /**
   * Get network status for a specific blockchain
   */
  private async getBlockchainNetworkStatus(blockchain: BlockchainType): Promise<BlockchainNetworkStatus> {
    const startTime = Date.now();
    let status: BlockchainNetworkStatus = {
      blockchain,
      status: 'unknown',
      latency: 0,
      lastBlock: 0,
      lastBlockTime: 0,
      nodeCount: 0,
      apiStatus: 'operational',
      lastChecked: Date.now(),
      historicalUptime: 99.9
    };
    
    try {
      switch (blockchain) {
        case 'ethereum':
          // Get Ethereum network stats
          try {
            const blockNumber = await ethereumService.getCurrentBlockNumber();
            const block = await ethereumService.getBlock(blockNumber);
            
            status = {
              ...status,
              status: 'online',
              latency: Date.now() - startTime,
              lastBlock: blockNumber,
              lastBlockTime: block?.timestamp ? Number(block.timestamp) * 1000 : 0,
              nodeCount: 1, // Mock value, in real implementation would fetch from network
              apiStatus: 'operational'
            };
          } catch (error) {
            console.error('Error fetching Ethereum network status:', error);
            status.status = 'degraded';
            status.apiStatus = 'issues';
          }
          break;
          
        case 'solana':
          // Get Solana network stats
          try {
            const slot = await solanaService.getCurrentSlot();
            const timestamp = Date.now(); // In real impl, would get block time
            
            status = {
              ...status,
              status: 'online',
              latency: Date.now() - startTime,
              lastBlock: slot,
              lastBlockTime: timestamp,
              nodeCount: 1, // Mock value, in real implementation would fetch from network
              apiStatus: 'operational'
            };
          } catch (error) {
            console.error('Error fetching Solana network status:', error);
            status.status = 'degraded';
            status.apiStatus = 'issues';
          }
          break;
          
        case 'ton':
          // Get TON network stats
          try {
            const blockId = await tonService.getLatestBlockId();
            const timestamp = Date.now(); // In real impl, would get block time
            
            status = {
              ...status,
              status: 'online',
              latency: Date.now() - startTime,
              lastBlock: blockId || 'unknown',
              lastBlockTime: timestamp,
              nodeCount: 1, // Mock value, in real implementation would fetch from network
              apiStatus: 'operational'
            };
          } catch (error) {
            console.error('Error fetching TON network status:', error);
            status.status = 'degraded';
            status.apiStatus = 'issues';
          }
          break;
          
        default:
          throw new Error(`Unsupported blockchain: ${blockchain}`);
      }
    } catch (error) {
      console.error(`Error getting network status for ${blockchain}:`, error);
      status.status = 'degraded';
      status.apiStatus = 'issues';
    }
    
    return status;
  }
  
  /**
   * Check for correlated incidents across all blockchains
   * This is the core cross-chain security monitoring algorithm
   */
  private async checkForCorrelatedIncidents(): Promise<void> {
    console.log('Checking for cross-chain correlated incidents');
    
    // Get recent incidents from each blockchain
    const cutoffTime = Date.now() - this.INCIDENT_CORRELATION_WINDOW;
    
    // Fetch all recent incidents
    const allRecentIncidents = await this.getAllRecentIncidents(cutoffTime);
    
    if (allRecentIncidents.length === 0) {
      return;
    }
    
    console.log(`Found ${allRecentIncidents.length} recent incidents to analyze for correlations`);
    
    // Group incidents by address to detect multi-chain attacks on the same address
    const incidentsByAddress = this.groupIncidentsByAddress(allRecentIncidents);
    
    // Check for temporal correlations (incidents happening close in time)
    await this.detectTemporalCorrelations(allRecentIncidents);
    
    // Check for address-based correlations (multiple incidents for the same address)
    await this.detectAddressCorrelations(incidentsByAddress);
  }
  
  /**
   * Get all recent incidents across all blockchains
   */
  private async getAllRecentIncidents(cutoffTime: number): Promise<SecurityIncident[]> {
    // For a real implementation, this would query all incidents from a database
    // Here we'll use a mock implementation that gets all incidents and filters
    
    // Get all incidents
    const allIncidents: SecurityIncident[] = [];
    
    // Add mock incidents for demonstration
    const mockIncidentAddresses = ['0x123...', '0x456...', 'solana:123...', 'ton:456...'];
    
    for (const address of mockIncidentAddresses) {
      const incidents = await this.incidentService.getIncidentsForAddress(address);
      allIncidents.push(...incidents);
    }
    
    // Filter for recent incidents
    return allIncidents.filter(incident => incident.timestamp >= cutoffTime);
  }
  
  /**
   * Group incidents by address
   */
  private groupIncidentsByAddress(incidents: SecurityIncident[]): Map<string, SecurityIncident[]> {
    const result = new Map<string, SecurityIncident[]>();
    
    for (const incident of incidents) {
      if (!result.has(incident.address)) {
        result.set(incident.address, []);
      }
      
      result.get(incident.address)?.push(incident);
    }
    
    return result;
  }
  
  /**
   * Detect temporal correlations (incidents happening close in time)
   */
  private async detectTemporalCorrelations(incidents: SecurityIncident[]): Promise<void> {
    // Sort incidents by timestamp
    const sortedIncidents = [...incidents].sort((a, b) => a.timestamp - b.timestamp);
    
    // Look for clusters of incidents across different chains
    const timeWindowMs = 60000; // 1 minute window for temporal correlation
    
    // Sliding window approach to find temporal clusters
    for (let i = 0; i < sortedIncidents.length; i++) {
      const windowStart = sortedIncidents[i].timestamp;
      const windowEnd = windowStart + timeWindowMs;
      
      // Find all incidents in this time window
      const windowIncidents = sortedIncidents.filter(
        incident => incident.timestamp >= windowStart && incident.timestamp <= windowEnd
      );
      
      // Only interested in multi-chain correlations
      const blockchains = new Set(windowIncidents.map(incident => incident.blockchain));
      
      if (blockchains.size > 1 && windowIncidents.length >= 2) {
        // Found a potential correlation across multiple chains
        await this.createOrUpdateCorrelation(
          windowIncidents,
          'temporal',
          `Multiple incidents across ${blockchains.size} blockchains within ${timeWindowMs / 1000} seconds`,
          0.7 + (blockchains.size * 0.1) // Confidence increases with more chains involved
        );
      }
    }
  }
  
  /**
   * Detect address-based correlations (multiple incidents for the same address)
   */
  private async detectAddressCorrelations(
    incidentsByAddress: Map<string, SecurityIncident[]>
  ): Promise<void> {
    for (const [address, incidents] of incidentsByAddress.entries()) {
      // Only interested in multi-chain correlations
      const blockchains = new Set(incidents.map(incident => incident.blockchain));
      
      if (blockchains.size > 1) {
        // Found a correlation - same address has incidents on multiple chains
        await this.createOrUpdateCorrelation(
          incidents,
          'address',
          `Security incidents detected on ${blockchains.size} blockchains for the same address`,
          0.8 + (blockchains.size * 0.1) // Confidence increases with more chains involved
        );
        
        // Automatically escalate security level for this address
        const currentLevel = this.getSecurityLevel(address);
        if (currentLevel < 5) {
          await this.setSecurityLevel(address, Math.min(5, currentLevel + blockchains.size));
          console.warn(`Automatically escalated security level for ${address} to ${
            Math.min(5, currentLevel + blockchains.size)
          } due to cross-chain incidents`);
        }
      }
    }
  }
  
  /**
   * Create or update a correlation based on detected incidents
   */
  private async createOrUpdateCorrelation(
    incidents: SecurityIncident[],
    correlationType: CrossChainCorrelation['correlationType'],
    description: string,
    confidenceScore: number
  ): Promise<CrossChainCorrelation> {
    // Generate deterministic ID based on incident IDs
    const incidentIds = incidents.map(i => i.id).sort().join('-');
    const correlationId = `correlation-${correlationType}-${incidentIds.substring(0, 20)}`;
    
    // Check if correlation already exists
    const existingCorrelation = this.crossChainCorrelations.get(correlationId);
    
    if (existingCorrelation) {
      // Update existing correlation
      const updatedCorrelation: CrossChainCorrelation = {
        ...existingCorrelation,
        relatedIncidents: incidents,
        confidenceScore: Math.max(existingCorrelation.confidenceScore, confidenceScore),
        correlatedChains: [...new Set(incidents.map(i => i.blockchain))],
        status: existingCorrelation.status === 'resolved' ? 'active' : existingCorrelation.status
      };
      
      this.crossChainCorrelations.set(correlationId, updatedCorrelation);
      return updatedCorrelation;
    } else {
      // Determine severity based on incident severities and correlation type
      const highestSeverity = this.determineHighestSeverity(incidents);
      const correlationSeverity = this.escalateCorrelationSeverity(highestSeverity, correlationType);
      
      // Create new correlation
      const newCorrelation: CrossChainCorrelation = {
        id: correlationId,
        timestamp: Date.now(),
        address: incidents[0].address, // Use the first incident's address
        relatedIncidents: incidents,
        correlatedChains: [...new Set(incidents.map(i => i.blockchain))],
        correlationType,
        confidenceScore,
        severity: correlationSeverity,
        description,
        status: 'active',
        timeWindow: this.INCIDENT_CORRELATION_WINDOW,
        responseActions: []
      };
      
      this.crossChainCorrelations.set(correlationId, newCorrelation);
      
      // For critical correlations, trigger automated response
      if (correlationSeverity === 'critical') {
        await this.handleCriticalCorrelation(newCorrelation);
      }
      
      console.warn(`New cross-chain correlation detected: ${description}`);
      console.warn(`Correlation severity: ${correlationSeverity}, type: ${correlationType}`);
      console.warn(`Affected chains: ${newCorrelation.correlatedChains.join(', ')}`);
      
      return newCorrelation;
    }
  }
  
  /**
   * Determine the highest severity among a set of incidents
   */
  private determineHighestSeverity(incidents: SecurityIncident[]): SecurityIncident['severity'] {
    // Priority: critical > high > medium > low
    const severities = incidents.map(i => i.severity);
    
    if (severities.includes('critical')) return 'critical';
    if (severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  }
  
  /**
   * Escalate severity for correlations
   * Cross-chain correlations are generally more severe than single-chain incidents
   */
  private escalateCorrelationSeverity(
    baseSeverity: SecurityIncident['severity'],
    correlationType: CrossChainCorrelation['correlationType']
  ): CrossChainCorrelation['severity'] {
    // Escalate severity based on correlation type
    switch (baseSeverity) {
      case 'low':
        return correlationType === 'temporal' ? 'medium' : 'high';
        
      case 'medium':
        return correlationType === 'temporal' ? 'high' : 'critical';
        
      case 'high':
      case 'critical':
        return 'critical';
    }
  }
  
  /**
   * Handle critical cross-chain correlations
   * Takes immediate actions for the most severe correlated incidents
   */
  private async handleCriticalCorrelation(correlation: CrossChainCorrelation): Promise<void> {
    console.error(`CRITICAL CROSS-CHAIN CORRELATION DETECTED: ${correlation.description}`);
    console.error(`Affected address: ${correlation.address}`);
    console.error(`Affected chains: ${correlation.correlatedChains.join(', ')}`);
    
    // Set maximum security level for the address
    await this.setSecurityLevel(correlation.address, 5);
    
    // Trigger security scan
    await this.triggerSecurityScan(correlation.address);
    
    // Create a high-severity incident for the correlation itself
    const incidentId = await this.incidentService.reportIncident(
      correlation.correlatedChains[0], // Use the first chain for the incident
      correlation.address,
      'cross_chain_attack',
      `Cross-chain security correlation detected: ${correlation.description}`,
      'critical'
    );
    
    // Record the action
    correlation.responseActions.push({
      action: 'escalate_security',
      timestamp: Date.now(),
      status: 'completed',
      details: 'Maximum security level set and security scan triggered'
    });
    
    this.crossChainCorrelations.set(correlation.id, correlation);
  }
}

// Export singleton instance
export const securityServiceAggregator = new SecurityServiceAggregator();