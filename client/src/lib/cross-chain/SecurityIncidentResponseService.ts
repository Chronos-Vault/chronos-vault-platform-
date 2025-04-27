/**
 * Security Incident Response Service
 * 
 * This service handles security incidents across different blockchains,
 * providing incident tracking, notification, and resolution functions.
 */

import { BlockchainType } from './interfaces';

/**
 * Security incident data structure
 */
export interface SecurityIncident {
  id: string;
  blockchain: BlockchainType;
  address: string;
  timestamp: number;
  type: 'unauthorized_access' | 'suspected_fraud' | 'abnormal_transfer' | 'multi_sig_failure' | 'protocol_vulnerability' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  transactionHash?: string;
  resolved: boolean;
  resolutionDetails?: string;
  resolutionTimestamp?: number;
}

/**
 * Incident response options
 */
export interface IncidentResponseOptions {
  notifyAdmins: boolean;
  freezeAssets: boolean;
  requireMultiSigOverride: boolean;
  automaticResolution: boolean;
}

/**
 * Mock security incidents for development
 */
const mockIncidents: Record<string, SecurityIncident> = {};
const mockAddressIncidents: Record<string, string[]> = {};

/**
 * Security Incident Response Service
 */
class SecurityIncidentResponseService {
  /**
   * Report a new security incident
   */
  async reportIncident(
    blockchain: BlockchainType,
    address: string,
    type: SecurityIncident['type'],
    description: string,
    severity: SecurityIncident['severity'],
    transactionHash?: string
  ): Promise<SecurityIncident> {
    // Generate ID for the incident
    const id = `incident-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the incident
    const incident: SecurityIncident = {
      id,
      blockchain,
      address,
      timestamp: Date.now(),
      type,
      severity,
      description,
      transactionHash,
      resolved: false
    };
    
    // Store the incident
    mockIncidents[id] = incident;
    
    // Add to address incidents
    if (!mockAddressIncidents[address]) {
      mockAddressIncidents[address] = [];
    }
    mockAddressIncidents[address].push(id);
    
    // In a real implementation, this would also trigger notifications
    this.triggerIncidentResponse(incident);
    
    return incident;
  }
  
  /**
   * Get all incidents for an address
   */
  async getIncidentsForAddress(address: string): Promise<SecurityIncident[]> {
    const incidentIds = mockAddressIncidents[address] || [];
    return incidentIds.map(id => mockIncidents[id]).filter(Boolean);
  }
  
  /**
   * Get a specific incident by ID
   */
  async getIncident(id: string): Promise<SecurityIncident | null> {
    return mockIncidents[id] || null;
  }
  
  /**
   * Resolve an incident
   */
  async resolveIncident(
    id: string,
    resolutionDetails?: string
  ): Promise<boolean> {
    const incident = mockIncidents[id];
    
    if (!incident) {
      return false;
    }
    
    // Update incident
    mockIncidents[id] = {
      ...incident,
      resolved: true,
      resolutionDetails,
      resolutionTimestamp: Date.now()
    };
    
    return true;
  }
  
  /**
   * Set response options for an address
   */
  async setResponseOptions(
    address: string,
    options: IncidentResponseOptions
  ): Promise<boolean> {
    // In a real implementation, this would update options in a database
    return true;
  }
  
  /**
   * Trigger incident response based on incident
   */
  private async triggerIncidentResponse(incident: SecurityIncident): Promise<void> {
    // In a real implementation, this would perform actions based on incident type and severity
    // For now, we'll just log the incident
    console.log(`SECURITY INCIDENT [${incident.severity.toUpperCase()}]: ${incident.type} on ${incident.blockchain}`);
    
    // For high severity incidents, we would typically:
    if (incident.severity === 'critical' || incident.severity === 'high') {
      // 1. Notify security team
      console.log('Security team notified');
      
      // 2. Temporarily freeze assets if configured
      console.log('Asset freeze evaluation triggered');
      
      // 3. Start monitoring systems
      console.log('Enhanced monitoring activated');
    }
  }
}

// Singleton accessor function
let incidentService: SecurityIncidentResponseService | null = null;

export function getIncidentResponseService(): SecurityIncidentResponseService {
  if (!incidentService) {
    incidentService = new SecurityIncidentResponseService();
  }
  return incidentService;
}