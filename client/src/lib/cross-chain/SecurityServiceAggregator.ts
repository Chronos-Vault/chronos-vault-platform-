/**
 * Security Service Aggregator for Chronos Vault
 * 
 * This service aggregates security-related functionality from multiple services
 * to provide a comprehensive security dashboard and monitoring system.
 * It implements the Triple-Chain Security system by validating data across
 * Ethereum, Solana, and TON chains.
 */

import { BlockchainType, SecurityRiskLevel } from './interfaces';
import { getAnomalyDetectionService, AnomalyDetectionResult } from './AnomalyDetectionService';
import { getIncidentResponseService, SecurityIncident } from './SecurityIncidentResponseService';
import { getTransactionMonitoringService, MonitoringAlert } from './TransactionMonitoringService';
import { getMultiSignatureService, SignatureRequest } from './MultiSignatureService';
import { secureCrossChainService } from './secure-service';
import { ethereumService } from '../ethereum/service';
import { solanaService } from '../solana/service';
import { tonService } from '../ton/service';

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
    return this.monitoringService.activateMonitoring(address);
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
}

// Export singleton instance
export const securityServiceAggregator = new SecurityServiceAggregator();