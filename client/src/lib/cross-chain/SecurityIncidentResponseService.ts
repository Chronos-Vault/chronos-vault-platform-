/**
 * Security Incident Response Service
 * 
 * This service handles security incidents across different blockchains,
 * providing incident tracking, notification, and resolution functions.
 * Implements automated response actions based on incident severity and type.
 */

import { BlockchainType } from './interfaces';

// For type checking in switch statements
const ETHEREUM: BlockchainType = 'ETH';
const SOLANA: BlockchainType = 'SOL';
const TON: BlockchainType = 'TON';
import { ethereumService } from '../ethereum/ethereum-service';
import { solanaContractService } from '../solana/solana-contract-service';
import { tonContractService } from '../ton/ton-contract-service';

/**
 * Security incident data structure
 */
export interface SecurityIncident {
  id: string;
  blockchain: BlockchainType;
  address: string;
  timestamp: number;
  type: 'unauthorized_access' | 'suspected_fraud' | 'abnormal_transfer' | 'multi_sig_failure' | 'protocol_vulnerability' | 'data_inconsistency' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  transactionHash?: string;
  resolved: boolean;
  resolutionDetails?: string;
  resolutionTimestamp?: number;
  responseActions?: ResponseAction[];
  vaultId?: string;
  relatedIncidents?: string[];
}

/**
 * Incident response options
 */
export interface IncidentResponseOptions {
  notifyAdmins: boolean;
  freezeAssets: boolean;
  requireMultiSigOverride: boolean;
  automaticResolution: boolean;
  enableAutomatedActions: boolean;
  automationLevel: AutomationLevel;
  customRules?: ResponseRule[];
}

/**
 * Automation level determines how aggressively the system responds to incidents
 */
export type AutomationLevel = 'passive' | 'moderate' | 'aggressive';

/**
 * Response action records what automated actions were taken
 */
export interface ResponseAction {
  timestamp: number;
  action: string;
  status: 'pending' | 'success' | 'failed';
  details?: string;
  transactionHash?: string;
}

/**
 * Response rule for custom incident handling
 */
export interface ResponseRule {
  id: string;
  conditions: {
    type?: SecurityIncident['type'][];
    severity?: SecurityIncident['severity'][];
    blockchain?: BlockchainType[];
  };
  actions: string[];
  priority: number;
}

/**
 * Incident severity classification system
 */
export enum IncidentSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

/**
 * Blockchain-specific response handlers
 */
export interface BlockchainResponseHandler {
  freezeAssets(address: string, reason: string): Promise<ResponseAction>;
  triggerBackup(vaultId: string): Promise<ResponseAction>;
  escalateToMultiSig(incidentId: string, address: string): Promise<ResponseAction>;
  notifyValidators(incidentId: string, details: string): Promise<ResponseAction>;
}

/**
 * Mock security incidents for development
 */
const mockIncidents: Record<string, SecurityIncident> = {};
const mockAddressIncidents: Record<string, string[]> = {};
const mockResponseOptions: Record<string, IncidentResponseOptions> = {};

/**
 * Default response options if none are set for an address
 */
const defaultResponseOptions: IncidentResponseOptions = {
  notifyAdmins: true,
  freezeAssets: false,
  requireMultiSigOverride: false,
  automaticResolution: false,
  enableAutomatedActions: true,
  automationLevel: 'moderate',
  customRules: []
};

/**
 * Get blockchain-specific response handlers
 */
function getBlockchainHandlers(blockchain: BlockchainType): BlockchainResponseHandler {
  switch (blockchain) {
    case ETHEREUM:
      return {
        async freezeAssets(address: string, reason: string): Promise<ResponseAction> {
          console.log(`[Ethereum] Freezing assets for ${address}. Reason: ${reason}`);
          
          try {
            // In production, this would call a contract method to freeze assets
            // For now, we'll simulate a successful response
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'success',
              details: `Assets frozen on Ethereum for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async triggerBackup(vaultId: string): Promise<ResponseAction> {
          console.log(`[Ethereum] Triggering backup for vault ${vaultId}`);
          
          try {
            // In production, this would trigger a backup state snapshot
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'success',
              details: `Backup triggered for Ethereum vault ${vaultId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async escalateToMultiSig(incidentId: string, address: string): Promise<ResponseAction> {
          console.log(`[Ethereum] Escalating incident ${incidentId} to multi-sig holders for ${address}`);
          
          try {
            // In production, this would notify multi-sig key holders
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'success',
              details: `Escalated to Ethereum multi-sig holders for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async notifyValidators(incidentId: string, details: string): Promise<ResponseAction> {
          console.log(`[Ethereum] Notifying validators about incident ${incidentId}: ${details}`);
          
          try {
            // In production, this would notify blockchain validators
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'success',
              details: `Ethereum validators notified about incident ${incidentId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        }
      };
      
    case SOLANA:
      return {
        async freezeAssets(address: string, reason: string): Promise<ResponseAction> {
          console.log(`[Solana] Freezing assets for ${address}. Reason: ${reason}`);
          
          try {
            // In production, this would call Solana program to freeze assets
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'success',
              details: `Assets frozen on Solana for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async triggerBackup(vaultId: string): Promise<ResponseAction> {
          console.log(`[Solana] Triggering backup for vault ${vaultId}`);
          
          try {
            // In production, this would trigger a backup state snapshot
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'success',
              details: `Backup triggered for Solana vault ${vaultId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async escalateToMultiSig(incidentId: string, address: string): Promise<ResponseAction> {
          console.log(`[Solana] Escalating incident ${incidentId} to multi-sig holders for ${address}`);
          
          try {
            // In production, this would notify Solana multi-sig key holders
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'success',
              details: `Escalated to Solana multi-sig holders for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async notifyValidators(incidentId: string, details: string): Promise<ResponseAction> {
          console.log(`[Solana] Notifying validators about incident ${incidentId}: ${details}`);
          
          try {
            // In production, this would notify Solana validators
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'success',
              details: `Solana validators notified about incident ${incidentId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        }
      };
      
    case TON:
      return {
        async freezeAssets(address: string, reason: string): Promise<ResponseAction> {
          console.log(`[TON] Freezing assets for ${address}. Reason: ${reason}`);
          
          try {
            // In production, this would call TON contract to freeze assets
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'success',
              details: `Assets frozen on TON for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'freeze_assets',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async triggerBackup(vaultId: string): Promise<ResponseAction> {
          console.log(`[TON] Triggering backup for vault ${vaultId}`);
          
          try {
            // In production, this would trigger a TON state backup
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'success',
              details: `Backup triggered for TON vault ${vaultId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'trigger_backup',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async escalateToMultiSig(incidentId: string, address: string): Promise<ResponseAction> {
          console.log(`[TON] Escalating incident ${incidentId} to multi-sig holders for ${address}`);
          
          try {
            // In production, this would notify TON multi-sig key holders
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'success',
              details: `Escalated to TON multi-sig holders for ${address}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'escalate_to_multi_sig',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        },
        
        async notifyValidators(incidentId: string, details: string): Promise<ResponseAction> {
          console.log(`[TON] Notifying validators about incident ${incidentId}: ${details}`);
          
          try {
            // In production, this would notify TON validators
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'success',
              details: `TON validators notified about incident ${incidentId}`
            };
          } catch (error: any) {
            return {
              timestamp: Date.now(),
              action: 'notify_validators',
              status: 'failed',
              details: error.message || 'Unknown error occurred'
            };
          }
        }
      };
      
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}

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
    try {
      // Store options in mock storage
      mockResponseOptions[address] = {
        ...defaultResponseOptions,
        ...options
      };
      
      console.log(`Response options updated for ${address}`);
      console.log(`Automation level: ${mockResponseOptions[address].automationLevel}`);
      console.log(`Freeze assets: ${mockResponseOptions[address].freezeAssets}`);
      
      return true;
    } catch (error: any) {
      console.error(`Failed to set response options for ${address}:`, error);
      return false;
    }
  }
  
  /**
   * Add a custom response rule for an address
   */
  async addCustomRule(
    address: string,
    rule: ResponseRule
  ): Promise<boolean> {
    try {
      // Get current options
      const currentOptions = this.getResponseOptions(address);
      
      // Add rule to custom rules
      const customRules = [...(currentOptions.customRules || [])];
      
      // Check if rule with this ID already exists
      const existingRuleIndex = customRules.findIndex(r => r.id === rule.id);
      if (existingRuleIndex >= 0) {
        // Update existing rule
        customRules[existingRuleIndex] = rule;
      } else {
        // Add new rule
        customRules.push(rule);
      }
      
      // Update options
      return this.setResponseOptions(address, {
        ...currentOptions,
        customRules
      });
    } catch (error: any) {
      console.error(`Failed to add custom rule for ${address}:`, error);
      return false;
    }
  }
  
  /**
   * Get response options for an address
   */
  private getResponseOptions(address: string): IncidentResponseOptions {
    return mockResponseOptions[address] || defaultResponseOptions;
  }
  
  /**
   * Determine which automated actions should be taken based on incident and options
   */
  private determineAutomatedActions(
    incident: SecurityIncident, 
    options: IncidentResponseOptions
  ): string[] {
    // If automated actions are disabled, return empty array
    if (!options.enableAutomatedActions) {
      return [];
    }
    
    const actions: string[] = [];
    
    // Check custom rules first (if any)
    if (options.customRules && options.customRules.length > 0) {
      // Sort rules by priority (higher first)
      const sortedRules = [...options.customRules].sort((a, b) => b.priority - a.priority);
      
      for (const rule of sortedRules) {
        // Check if the rule applies to this incident
        const typeMatch = !rule.conditions.type || rule.conditions.type.includes(incident.type);
        const severityMatch = !rule.conditions.severity || rule.conditions.severity.includes(incident.severity);
        const blockchainMatch = !rule.conditions.blockchain || rule.conditions.blockchain.includes(incident.blockchain);
        
        if (typeMatch && severityMatch && blockchainMatch) {
          // Add rule actions
          actions.push(...rule.actions);
        }
      }
    }
    
    // If any custom rules matched, use those. Otherwise, apply default logic based on severity
    if (actions.length === 0) {
      // Default actions based on automation level and severity
      switch (incident.severity) {
        case 'critical':
          actions.push('notify_validators');
          
          if (options.automationLevel === 'moderate' || options.automationLevel === 'aggressive') {
            actions.push('escalate_to_multi_sig');
          }
          
          if (options.automationLevel === 'aggressive') {
            if (options.freezeAssets) {
              actions.push('freeze_assets');
            }
            actions.push('trigger_backup');
          }
          break;
          
        case 'high':
          if (options.automationLevel === 'moderate' || options.automationLevel === 'aggressive') {
            actions.push('notify_validators');
          }
          
          if (options.automationLevel === 'aggressive') {
            actions.push('escalate_to_multi_sig');
            actions.push('trigger_backup');
          }
          break;
          
        case 'medium':
          if (options.automationLevel === 'aggressive') {
            actions.push('notify_validators');
            actions.push('trigger_backup');
          }
          break;
          
        case 'low':
          if (options.automationLevel === 'aggressive') {
            actions.push('trigger_backup');
          }
          break;
      }
    }
    
    return actions;
  }
  
  /**
   * Execute response actions for an incident
   */
  private async executeResponseActions(
    incident: SecurityIncident, 
    actions: string[]
  ): Promise<ResponseAction[]> {
    const responseActions: ResponseAction[] = [];
    const blockchainHandlers = getBlockchainHandlers(incident.blockchain);
    
    for (const action of actions) {
      let responseAction: ResponseAction;
      
      try {
        switch (action) {
          case 'freeze_assets':
            responseAction = await blockchainHandlers.freezeAssets(
              incident.address,
              `Security incident: ${incident.type} (${incident.severity})`
            );
            break;
            
          case 'trigger_backup':
            responseAction = await blockchainHandlers.triggerBackup(
              incident.vaultId || incident.address
            );
            break;
            
          case 'escalate_to_multi_sig':
            responseAction = await blockchainHandlers.escalateToMultiSig(
              incident.id,
              incident.address
            );
            break;
            
          case 'notify_validators':
            responseAction = await blockchainHandlers.notifyValidators(
              incident.id,
              incident.description
            );
            break;
            
          default:
            responseAction = {
              timestamp: Date.now(),
              action,
              status: 'failed',
              details: `Unknown action: ${action}`
            };
        }
        
        responseActions.push(responseAction);
      } catch (error: any) {
        // If an action fails, log it but continue with other actions
        responseActions.push({
          timestamp: Date.now(),
          action,
          status: 'failed',
          details: error.message || 'Unknown error occurred'
        });
      }
    }
    
    return responseActions;
  }
  
  /**
   * Trigger incident response based on incident
   */
  private async triggerIncidentResponse(incident: SecurityIncident): Promise<void> {
    console.log(`SECURITY INCIDENT [${incident.severity.toUpperCase()}]: ${incident.type} on ${incident.blockchain}`);
    
    try {
      // Get response options for this address
      const options = this.getResponseOptions(incident.address);
      
      // Determine which actions to take
      const actions = this.determineAutomatedActions(incident, options);
      
      if (actions.length > 0) {
        console.log(`Executing automated actions for incident ${incident.id}:`, actions);
        
        // Execute actions
        const responseActions = await this.executeResponseActions(incident, actions);
        
        // Update incident with response actions
        mockIncidents[incident.id] = {
          ...mockIncidents[incident.id],
          responseActions: [
            ...(mockIncidents[incident.id].responseActions || []),
            ...responseActions
          ]
        };
        
        // If all actions succeeded and automatic resolution is enabled, resolve the incident
        if (options.automaticResolution && responseActions.every(action => action.status === 'success')) {
          await this.resolveIncident(
            incident.id,
            'Automatically resolved by security system'
          );
        }
      } else {
        console.log(`No automated actions to take for incident ${incident.id}`);
      }
    } catch (error: any) {
      console.error('Error in incident response:', error);
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