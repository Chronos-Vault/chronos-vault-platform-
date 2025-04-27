/**
 * Transaction Monitoring Service
 * 
 * This service monitors blockchain transactions for suspicious activities
 * and generates alerts based on configured rules.
 */

import { BlockchainType } from './interfaces';

/**
 * Monitoring alert data structure
 */
export interface MonitoringAlert {
  id: string;
  blockchain: BlockchainType;
  address: string;
  timestamp: number;
  type: 'unusual_volume' | 'unusual_frequency' | 'new_counterparty' | 'blacklisted_counterparty' | 'unusual_pattern' | 'other';
  level: 'high' | 'medium' | 'low';
  message: string;
  transactionHash?: string;
  dismissed: boolean;
  dismissReason?: string;
  dismissTimestamp?: number;
}

/**
 * Transaction monitoring rule
 */
export interface MonitoringRule {
  id: string;
  blockchain: BlockchainType;
  address: string;
  ruleType: 'volume_limit' | 'frequency_limit' | 'approved_counterparties' | 'time_restriction' | 'pattern_detection';
  parameters: Record<string, any>;
  active: boolean;
}

/**
 * Mock monitoring alerts for development
 */
const mockAlerts: Record<string, MonitoringAlert> = {};
const mockAddressAlerts: Record<string, string[]> = {};
const mockMonitoringStatus: Record<string, boolean> = {};

/**
 * Transaction Monitoring Service
 */
class TransactionMonitoringService {
  /**
   * Create a new monitoring rule
   */
  async createRule(
    blockchain: BlockchainType,
    address: string,
    ruleType: MonitoringRule['ruleType'],
    parameters: Record<string, any>
  ): Promise<MonitoringRule> {
    // Generate ID for the rule
    const id = `rule-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the rule
    const rule: MonitoringRule = {
      id,
      blockchain,
      address,
      ruleType,
      parameters,
      active: true
    };
    
    // In a real implementation, this would store the rule in a database
    
    return rule;
  }
  
  /**
   * Generate a monitoring alert
   */
  async createAlert(
    blockchain: BlockchainType,
    address: string,
    type: MonitoringAlert['type'],
    level: MonitoringAlert['level'],
    message: string,
    transactionHash?: string
  ): Promise<MonitoringAlert> {
    // Generate ID for the alert
    const id = `alert-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the alert
    const alert: MonitoringAlert = {
      id,
      blockchain,
      address,
      timestamp: Date.now(),
      type,
      level,
      message,
      transactionHash,
      dismissed: false
    };
    
    // Store the alert
    mockAlerts[id] = alert;
    
    // Add to address alerts
    if (!mockAddressAlerts[address]) {
      mockAddressAlerts[address] = [];
    }
    mockAddressAlerts[address].push(id);
    
    return alert;
  }
  
  /**
   * Get all alerts for an address
   */
  async getAlertsForAddress(address: string): Promise<MonitoringAlert[]> {
    const alertIds = mockAddressAlerts[address] || [];
    return alertIds.map(id => mockAlerts[id]).filter(Boolean);
  }
  
  /**
   * Dismiss an alert
   */
  async dismissAlert(
    id: string,
    dismissReason?: string
  ): Promise<boolean> {
    const alert = mockAlerts[id];
    
    if (!alert) {
      return false;
    }
    
    // Update alert
    mockAlerts[id] = {
      ...alert,
      dismissed: true,
      dismissReason,
      dismissTimestamp: Date.now()
    };
    
    return true;
  }
  
  /**
   * Activate monitoring for an address
   */
  async activateMonitoring(address: string): Promise<boolean> {
    mockMonitoringStatus[address] = true;
    return true;
  }
  
  /**
   * Deactivate monitoring for an address
   */
  async deactivateMonitoring(address: string): Promise<boolean> {
    mockMonitoringStatus[address] = false;
    return true;
  }
  
  /**
   * Check if monitoring is active for an address
   */
  isMonitoringActive(address: string): boolean {
    return mockMonitoringStatus[address] || false;
  }
  
  /**
   * Simulate monitoring data for demo purposes
   */
  async simulateMonitoringData(address: string): Promise<MonitoringAlert[]> {
    // Create some demo alerts
    const alerts: MonitoringAlert[] = [];
    
    // Only if monitoring is active
    if (this.isMonitoringActive(address)) {
      // Unusual volume alert
      const volumeAlert = await this.createAlert(
        'ETH',
        address,
        'unusual_volume',
        'medium',
        'Unusually large transaction detected (2.5x above normal patterns)',
        '0x' + Math.random().toString(16).substring(2, 66)
      );
      alerts.push(volumeAlert);
      
      // Blacklisted counterparty alert
      const blacklistAlert = await this.createAlert(
        'TON',
        address,
        'blacklisted_counterparty',
        'high',
        'Transaction with blacklisted address detected',
        '0x' + Math.random().toString(16).substring(2, 66)
      );
      alerts.push(blacklistAlert);
    }
    
    return alerts;
  }
}

// Singleton accessor function
let monitoringService: TransactionMonitoringService | null = null;

export function getTransactionMonitoringService(): TransactionMonitoringService {
  if (!monitoringService) {
    monitoringService = new TransactionMonitoringService();
  }
  return monitoringService;
}