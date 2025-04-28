/**
 * Security Service Exports
 * 
 * This file provides access to security service instances and utilities
 * to avoid import errors and provide a clean interface.
 */

// Importing security services
// These would normally be imported from their respective modules
// but for the demo we're creating placeholder implementations

// Mock security service aggregator for the triple-chain security architecture
const securityServiceAggregator = {
  detectAndClassifyIncident: async (vaultId: string, incidentType: string, chain: string, details: any) => {
    console.log(`[SecurityServiceAggregator] Detecting incident for vault ${vaultId}`);
    return {
      incident: {
        id: `incident-${Date.now()}`,
        vaultId,
        type: incidentType,
        severity: incidentType.includes('unauthorized') ? 'critical' : 
                 incidentType.includes('fraud') ? 'high' : 'medium',
        timestamp: Date.now(),
        status: 'active',
        blockchainData: { chain, txHash: `0x${Math.random().toString(16).substring(2)}`, blockNumber: 12345678 },
        details
      }
    };
  },
  
  handleSecurityIncident: async (incident: any) => {
    console.log(`[SecurityServiceAggregator] Handling security incident: ${incident.type}`);
    // Return list of actions taken
    return [
      { type: 'notification', timestamp: Date.now(), details: 'Security alert notification sent' },
      { type: 'logging', timestamp: Date.now(), details: 'Incident logged to security database' },
      { type: 'monitoring', timestamp: Date.now(), details: 'Enhanced monitoring enabled for vault' }
    ];
  }
};

// Mock incident response service
const incidentResponseService = {
  // Implementation would go here
};

// Mock transaction monitoring service
const transactionMonitoringService = {
  // Implementation would go here
};

/**
 * Get a reference to the security service aggregator instance
 * This is the main entry point for all security services
 */
export function getSecurityServiceAggregator() {
  return securityServiceAggregator;
}

/**
 * Get a reference to the incident response service instance
 * Used for security incident detection and response
 */
export function getIncidentResponseService() {
  return incidentResponseService;
}

/**
 * Get a reference to the transaction monitoring service instance
 * Used for monitoring blockchain transactions
 */
export function getTransactionMonitoringService() {
  return transactionMonitoringService;
}

// Export security incident types for easier reference
export type SecurityIncidentType = 'unauthorized_access' | 'suspected_fraud' | 'abnormal_transfer' | 
  'multi_sig_failure' | 'protocol_vulnerability' | 'data_inconsistency' | 'other';

// Export security incident severity levels
export type SecurityIncidentSeverity = 'critical' | 'high' | 'medium' | 'low';