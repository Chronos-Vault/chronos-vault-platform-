/**
 * Incident Response System
 * 
 * Provides automated responses to security and system health incidents.
 * Integrates with the security logger and system health monitor to
 * detect and respond to critical events.
 */

import { securityLogger, SecurityEventType, SecurityLogLevel } from './security-logger';
import { systemHealthMonitor, SystemComponent as HealthSystemComponent, SystemHealthStatus } from './system-health-monitor';
import { performanceOptimizer } from '../performance/optimization-service';
import config from '../config';

// Re-export SystemComponent for use in incident routes
export { SystemComponent } from './system-health-monitor';

// Import SystemComponent type for internal use
import { SystemComponent } from './system-health-monitor';

// Incident severity levels
export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Incident types
export enum IncidentType {
  SECURITY_BREACH = 'SECURITY_BREACH',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
  BLOCKCHAIN_CONNECTIVITY = 'BLOCKCHAIN_CONNECTIVITY',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATA_INTEGRITY = 'DATA_INTEGRITY',
  RATE_LIMIT = 'RATE_LIMIT'
}

// Incident status
export enum IncidentStatus {
  DETECTED = 'DETECTED',
  INVESTIGATING = 'INVESTIGATING',
  MITIGATING = 'MITIGATING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

// Response action types
export enum ResponseActionType {
  LOG_ONLY = 'LOG_ONLY', 
  RATE_LIMIT_ADJUSTMENT = 'RATE_LIMIT_ADJUSTMENT',
  CACHE_CLEAR = 'CACHE_CLEAR',
  COMPONENT_RESTART = 'COMPONENT_RESTART',
  NOTIFICATION = 'NOTIFICATION',
  LOCKDOWN = 'LOCKDOWN',
  AUTO_SCALE = 'AUTO_SCALE'
}

// Response action status
export enum ResponseActionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

// Incident record
interface Incident {
  id: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  component?: SystemComponent;
  description: string;
  detectedAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  relatedLogs: string[]; // Log IDs
  responseActions: ResponseAction[];
  metadata?: any;
}

// Response action
interface ResponseAction {
  id: string;
  incidentId: string;
  type: ResponseActionType;
  status: ResponseActionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  result?: string;
  metadata?: any;
}

/**
 * Incident Response System
 * 
 * Monitors system events and provides automated responses to incidents
 */
class IncidentResponseSystem {
  private incidents: Map<string, Incident> = new Map();
  private responseActions: Map<string, ResponseAction> = new Map();
  private incidentIdCounter: number = 1;
  private actionIdCounter: number = 1;
  private monitoringInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    // Start monitoring for incidents
    this.monitoringInterval = setInterval(() => this.checkForIncidents(), 30000); // Every 30 seconds
  }
  
  /**
   * Check for potential incidents based on system status and logs
   */
  private async checkForIncidents(): Promise<void> {
    try {
      // Get system health status
      const healthStatus = systemHealthMonitor.getSystemHealth();
      
      // Check overall system status
      this.checkSystemHealthStatus(healthStatus);
      
      // Check component statuses
      this.checkComponentHealthStatus(healthStatus);
      
      // Check security logs for potential incidents
      // (In a production system, we'd use a more sophisticated algorithm)
      // For demo purposes, we'll just check for critical logs in the last hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const criticalLogs = securityLogger.getLogs({
        startTime: oneHourAgo,
        level: SecurityLogLevel.CRITICAL
      });
      
      // Process critical security logs
      for (const log of criticalLogs) {
        // Check if we already have an incident for this log
        const existingIncident = Array.from(this.incidents.values()).find(
          incident => incident.relatedLogs.includes(log.timestamp.toISOString())
        );
        
        if (!existingIncident && log.eventType) {
          // Create a new incident based on the log
          this.createIncidentFromSecurityLog(log);
        }
      }
      
      // Check for resolved incidents
      this.checkForResolvedIncidents();
      
    } catch (error: any) {
      console.error('Error checking for incidents:', error);
      securityLogger.error(
        `Incident detection failed: ${error.message}`, 
        SecurityEventType.SYSTEM_ERROR,
        { error: error.stack }
      );
    }
  }
  
  /**
   * Check overall system health status
   */
  private checkSystemHealthStatus(healthStatus: any): void {
    if (healthStatus.status === SystemHealthStatus.CRITICAL) {
      // Create an incident if one doesn't already exist
      const existingIncident = Array.from(this.incidents.values()).find(
        incident => 
          incident.type === IncidentType.SERVICE_UNAVAILABLE && 
          incident.status !== IncidentStatus.RESOLVED &&
          incident.status !== IncidentStatus.CLOSED
      );
      
      if (!existingIncident) {
        this.createIncident({
          type: IncidentType.SERVICE_UNAVAILABLE,
          severity: IncidentSeverity.CRITICAL,
          description: 'System health status is CRITICAL',
          metadata: {
            systemStatus: healthStatus.status,
            lastChecked: healthStatus.lastChecked
          }
        });
      }
    }
  }
  
  /**
   * Check component health statuses
   */
  private checkComponentHealthStatus(healthStatus: any): void {
    // Check each component
    for (const [componentName, health] of Object.entries(healthStatus.components)) {
      const component = componentName as HealthSystemComponent;
      const componentHealth = health as any;
      
      if (componentHealth.status === SystemHealthStatus.CRITICAL) {
        // Check if we already have an active incident for this component
        const existingIncident = Array.from(this.incidents.values()).find(
          incident => 
            incident.component === component && 
            incident.status !== IncidentStatus.RESOLVED &&
            incident.status !== IncidentStatus.CLOSED
        );
        
        if (!existingIncident) {
          // Determine incident type based on component
          let incidentType: IncidentType;
          
          switch (component) {
            case SystemComponent.ETHEREUM_NODE:
            case SystemComponent.TON_NODE:
            case SystemComponent.SOLANA_NODE: 
            case SystemComponent.BITCOIN_NODE:
            case SystemComponent.CROSS_CHAIN_BRIDGE:
              incidentType = IncidentType.BLOCKCHAIN_CONNECTIVITY;
              break;
            case SystemComponent.API_GATEWAY:
            case SystemComponent.CACHE:
              incidentType = IncidentType.PERFORMANCE_DEGRADATION;
              break;
            case SystemComponent.AUTHENTICATION:
              incidentType = IncidentType.SECURITY_BREACH;
              break;
            default:
              incidentType = IncidentType.SERVICE_UNAVAILABLE;
          }
          
          this.createIncident({
            type: incidentType,
            severity: IncidentSeverity.HIGH,
            component,
            description: `Component ${component} health status is CRITICAL`,
            metadata: {
              componentStatus: componentHealth.status,
              latencyMs: componentHealth.latencyMs,
              errorRate: componentHealth.errorRate,
              lastChecked: componentHealth.lastChecked
            }
          });
        }
      }
    }
  }
  
  /**
   * Create an incident from a security log
   */
  private createIncidentFromSecurityLog(log: any): void {
    let incidentType: IncidentType;
    let severity: IncidentSeverity;
    
    // Determine incident type based on event type
    switch (log.eventType) {
      case SecurityEventType.AUTH_FAILURE:
        incidentType = IncidentType.SECURITY_BREACH;
        severity = IncidentSeverity.MEDIUM;
        break;
      case SecurityEventType.SUSPICIOUS_ACTIVITY:
        incidentType = IncidentType.SECURITY_BREACH;
        severity = IncidentSeverity.HIGH;
        break;
      case SecurityEventType.RATE_LIMIT_EXCEEDED:
        incidentType = IncidentType.RATE_LIMIT;
        severity = IncidentSeverity.MEDIUM;
        break;
      case SecurityEventType.CROSS_CHAIN_VERIFICATION:
        incidentType = IncidentType.BLOCKCHAIN_CONNECTIVITY;
        severity = IncidentSeverity.HIGH;
        break;
      default:
        incidentType = IncidentType.SERVICE_UNAVAILABLE;
        severity = IncidentSeverity.MEDIUM;
    }
    
    // For critical logs, escalate severity
    if (log.level === SecurityLogLevel.CRITICAL) {
      severity = IncidentSeverity.CRITICAL;
    }
    
    // Create the incident
    this.createIncident({
      type: incidentType,
      severity,
      description: log.message,
      relatedLogs: [log.timestamp.toISOString()],
      metadata: log.metadata
    });
  }
  
  /**
   * Create a new incident
   */
  private createIncident(params: {
    type: IncidentType;
    severity: IncidentSeverity;
    description: string;
    component?: SystemComponent;
    relatedLogs?: string[];
    metadata?: any;
  }): Incident {
    const now = new Date();
    const incidentId = `INC-${now.getTime()}-${this.incidentIdCounter++}`;
    
    const incident: Incident = {
      id: incidentId,
      type: params.type,
      severity: params.severity,
      status: IncidentStatus.DETECTED,
      description: params.description,
      component: params.component,
      detectedAt: now,
      updatedAt: now,
      relatedLogs: params.relatedLogs || [],
      responseActions: [],
      metadata: params.metadata
    };
    
    // Store the incident
    this.incidents.set(incidentId, incident);
    
    // Log the incident
    securityLogger.warn(
      `Incident detected: [${incident.id}] ${incident.description}`,
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      {
        incidentId: incident.id,
        type: incident.type,
        severity: incident.severity,
        component: incident.component
      }
    );
    
    // If in development mode, log to console
    if (config.isDevelopmentMode) {
      console.log(`🚨 INCIDENT DETECTED: [${incident.severity}] ${incident.description}`);
    }
    
    // Generate automated response based on incident type and severity
    this.generateAutomatedResponse(incident);
    
    return incident;
  }
  
  /**
   * Generate automated response based on incident type and severity
   */
  private generateAutomatedResponse(incident: Incident): void {
    incident.status = IncidentStatus.INVESTIGATING;
    incident.updatedAt = new Date();
    
    // Create appropriate response actions based on incident type and severity
    switch (incident.type) {
      case IncidentType.SECURITY_BREACH:
        this.handleSecurityBreach(incident);
        break;
      case IncidentType.PERFORMANCE_DEGRADATION:
        this.handlePerformanceDegradation(incident);
        break;
      case IncidentType.BLOCKCHAIN_CONNECTIVITY:
        this.handleBlockchainConnectivity(incident);
        break;
      case IncidentType.RATE_LIMIT:
        this.handleRateLimit(incident);
        break;
      case IncidentType.DATA_INTEGRITY:
        this.handleDataIntegrity(incident);
        break;
      case IncidentType.SERVICE_UNAVAILABLE:
        this.handleServiceUnavailable(incident);
        break;
    }
  }
  
  /**
   * Handle security breach incidents
   */
  private handleSecurityBreach(incident: Incident): void {
    // For critical security breaches
    if (incident.severity === IncidentSeverity.CRITICAL) {
      // Log action only (in production, this would send alerts)
      this.createResponseAction(incident, {
        type: ResponseActionType.NOTIFICATION,
        description: 'Send critical security breach notification to security team',
        metadata: { alertLevel: 'CRITICAL' }
      });
      
      // Additional protective action
      this.createResponseAction(incident, {
        type: ResponseActionType.RATE_LIMIT_ADJUSTMENT,
        description: 'Temporarily reduce rate limits to mitigate potential attack',
        metadata: { 
          reduction: '50%',
          duration: '1 hour'
        }
      });
    } else {
      // For less severe breaches
      this.createResponseAction(incident, {
        type: ResponseActionType.NOTIFICATION,
        description: 'Log security breach for later analysis',
        metadata: { alertLevel: 'WARNING' }
      });
    }
  }
  
  /**
   * Handle performance degradation incidents
   */
  private handlePerformanceDegradation(incident: Incident): void {
    // Clear caches to free up resources
    this.createResponseAction(incident, {
      type: ResponseActionType.CACHE_CLEAR,
      description: 'Clear non-essential caches to free up resources',
      metadata: { 
        cachesToClear: ['calculationResultsCache']
      }
    });
    
    // For severe performance issues
    if (incident.severity === IncidentSeverity.HIGH || 
        incident.severity === IncidentSeverity.CRITICAL) {
      // Reduce rate limits temporarily
      this.createResponseAction(incident, {
        type: ResponseActionType.RATE_LIMIT_ADJUSTMENT,
        description: 'Reduce rate limits to stabilize performance',
        metadata: { 
          reduction: '70%',
          duration: '15 minutes'
        }
      });
    }
  }
  
  /**
   * Handle blockchain connectivity incidents
   */
  private handleBlockchainConnectivity(incident: Incident): void {
    // Create action to log/notify about blockchain connectivity issues
    this.createResponseAction(incident, {
      type: ResponseActionType.NOTIFICATION,
      description: `Blockchain connectivity issue with ${incident.component}`,
      metadata: { 
        component: incident.component,
        severity: incident.severity
      }
    });
    
    // For critical blockchain connectivity issues
    if (incident.severity === IncidentSeverity.CRITICAL) {
      // Add component restart action
      this.createResponseAction(incident, {
        type: ResponseActionType.COMPONENT_RESTART,
        description: `Attempt to restart ${incident.component} connection`,
        metadata: { 
          component: incident.component,
          maxAttempts: 3
        }
      });
    }
  }
  
  /**
   * Handle rate limit incidents
   */
  private handleRateLimit(incident: Incident): void {
    // Log the rate limit incident
    this.createResponseAction(incident, {
      type: ResponseActionType.LOG_ONLY,
      description: 'Log rate limit exceeded for analysis',
      metadata: incident.metadata
    });
    
    // For severe rate limit issues that might indicate an attack
    if (incident.severity === IncidentSeverity.HIGH || 
        incident.severity === IncidentSeverity.CRITICAL) {
      // Add rate limit adjustment action
      this.createResponseAction(incident, {
        type: ResponseActionType.RATE_LIMIT_ADJUSTMENT,
        description: 'Implement stricter rate limiting temporarily',
        metadata: { 
          reduction: '90%',
          duration: '30 minutes'
        }
      });
    }
  }
  
  /**
   * Handle data integrity incidents
   */
  private handleDataIntegrity(incident: Incident): void {
    // Log data integrity issues
    this.createResponseAction(incident, {
      type: ResponseActionType.NOTIFICATION,
      description: 'Data integrity issue detected',
      metadata: incident.metadata
    });
    
    // For critical data integrity issues
    if (incident.severity === IncidentSeverity.CRITICAL) {
      // Add lockdown action for critical data integrity issues
      this.createResponseAction(incident, {
        type: ResponseActionType.LOCKDOWN,
        description: 'Prevent data modifications until issue resolved',
        metadata: { 
          lockdownType: 'read-only',
          duration: '1 hour'
        }
      });
    }
  }
  
  /**
   * Handle service unavailable incidents
   */
  private handleServiceUnavailable(incident: Incident): void {
    // Create notification action
    this.createResponseAction(incident, {
      type: ResponseActionType.NOTIFICATION,
      description: 'Service unavailable alert',
      metadata: { 
        component: incident.component,
        details: incident.metadata
      }
    });
    
    // Try to restart the component if specified
    if (incident.component) {
      this.createResponseAction(incident, {
        type: ResponseActionType.COMPONENT_RESTART,
        description: `Attempt to restart ${incident.component}`,
        metadata: { 
          component: incident.component,
          maxAttempts: 3
        }
      });
    }
  }
  
  /**
   * Create a response action for an incident
   */
  private createResponseAction(incident: Incident, params: {
    type: ResponseActionType;
    description: string;
    metadata?: any;
  }): ResponseAction {
    const now = new Date();
    const actionId = `ACT-${now.getTime()}-${this.actionIdCounter++}`;
    
    const action: ResponseAction = {
      id: actionId,
      incidentId: incident.id,
      type: params.type,
      status: ResponseActionStatus.PENDING,
      description: params.description,
      createdAt: now,
      updatedAt: now,
      metadata: params.metadata
    };
    
    // Store the action
    this.responseActions.set(actionId, action);
    
    // Add to incident's response actions
    incident.responseActions.push(action);
    
    // Execute the action
    this.executeResponseAction(action);
    
    return action;
  }
  
  /**
   * Execute a response action
   */
  private async executeResponseAction(action: ResponseAction): Promise<void> {
    try {
      // Update action status
      action.status = ResponseActionStatus.IN_PROGRESS;
      action.updatedAt = new Date();
      
      // Execute the action based on its type
      switch (action.type) {
        case ResponseActionType.LOG_ONLY:
          // Just log the action (already done by creating it)
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Action logged successfully';
          break;
          
        case ResponseActionType.NOTIFICATION:
          // In a real system, this would send notifications
          // For demo, we'll just log the notification
          console.log(
            `🔔 INCIDENT NOTIFICATION: ${action.description}`,
            action.metadata
          );
          
          // Mark as completed
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Notification processed';
          break;
          
        case ResponseActionType.CACHE_CLEAR:
          // Clear caches based on metadata
          if (action.metadata && action.metadata.cachesToClear) {
            const cachesToClear = action.metadata.cachesToClear;
            
            if (cachesToClear.includes('all')) {
              performanceOptimizer.clearAllCaches();
              action.result = 'All caches cleared successfully';
            } else {
              // Clear specific caches
              const results: string[] = [];
              
              if (cachesToClear.includes('vaultDataCache')) {
                performanceOptimizer.getCacheByType('vault').clear();
                results.push('Vault data cache cleared');
              }
              
              if (cachesToClear.includes('userDataCache')) {
                performanceOptimizer.getCacheByType('user').clear();
                results.push('User data cache cleared');
              }
              
              if (cachesToClear.includes('blockchainDataCache')) {
                performanceOptimizer.getCacheByType('blockchain').clear();
                results.push('Blockchain data cache cleared');
              }
              
              if (cachesToClear.includes('calculationResultsCache')) {
                performanceOptimizer.getCacheByType('calculation').clear();
                results.push('Calculation results cache cleared');
              }
              
              action.result = results.join(', ');
            }
            
            // Mark as completed
            action.status = ResponseActionStatus.COMPLETED;
          } else {
            // No caches specified
            action.status = ResponseActionStatus.FAILED;
            action.result = 'No caches specified to clear';
          }
          break;
          
        case ResponseActionType.RATE_LIMIT_ADJUSTMENT:
          // In a production system, this would adjust rate limits
          // For demo, we'll just log the adjustment
          console.log(
            `⚠️ RATE LIMIT ADJUSTMENT: ${action.description}`,
            action.metadata
          );
          
          // Mark as completed
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Rate limit adjustment processed';
          break;
          
        case ResponseActionType.COMPONENT_RESTART:
          // In a production system, this would restart components
          // For demo, we'll just log the restart
          console.log(
            `🔄 COMPONENT RESTART: ${action.description}`,
            action.metadata
          );
          
          // Mark as completed
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Component restart processed';
          break;
          
        case ResponseActionType.LOCKDOWN:
          // In a production system, this would enforce lockdown
          // For demo, we'll just log the lockdown
          console.log(
            `🔒 LOCKDOWN: ${action.description}`,
            action.metadata
          );
          
          // Mark as completed
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Lockdown processed';
          break;
          
        case ResponseActionType.AUTO_SCALE:
          // In a production system, this would trigger auto-scaling
          // For demo, we'll just log the scaling
          console.log(
            `⚖️ AUTO SCALE: ${action.description}`,
            action.metadata
          );
          
          // Mark as completed
          action.status = ResponseActionStatus.COMPLETED;
          action.result = 'Auto-scaling processed';
          break;
          
        default:
          // Unknown action type
          action.status = ResponseActionStatus.FAILED;
          action.result = `Unknown action type: ${action.type}`;
      }
      
      // Update action completion time
      if (action.status === ResponseActionStatus.COMPLETED) {
        action.completedAt = new Date();
      }
      
      // Log action execution
      securityLogger.info(
        `Response action executed: [${action.id}] ${action.description}`,
        SecurityEventType.SYSTEM_ERROR,
        {
          actionId: action.id,
          incidentId: action.incidentId,
          type: action.type,
          status: action.status,
          result: action.result
        }
      );
      
    } catch (error: any) {
      // Handle action execution failure
      action.status = ResponseActionStatus.FAILED;
      action.result = `Error executing action: ${error.message}`;
      
      // Log failure
      securityLogger.error(
        `Failed to execute response action: [${action.id}] ${error.message}`,
        SecurityEventType.SYSTEM_ERROR,
        {
          actionId: action.id,
          incidentId: action.incidentId,
          error: error.stack
        }
      );
    }
    
    // Update the incident
    const incident = this.incidents.get(action.incidentId);
    if (incident) {
      incident.updatedAt = new Date();
      
      // Check if all actions are completed or failed
      const allActionsComplete = incident.responseActions.every(
        action => action.status === ResponseActionStatus.COMPLETED || 
                action.status === ResponseActionStatus.FAILED
      );
      
      if (allActionsComplete) {
        incident.status = IncidentStatus.MITIGATING;
      }
    }
  }
  
  /**
   * Check for resolved incidents
   */
  private checkForResolvedIncidents(): void {
    // Get current health status
    const healthStatus = systemHealthMonitor.getSystemHealth();
    
    // Check active incidents to see if they're resolved
    for (const incident of this.incidents.values()) {
      // Skip already resolved or closed incidents
      if (incident.status === IncidentStatus.RESOLVED || 
          incident.status === IncidentStatus.CLOSED) {
        continue;
      }
      
      let isResolved = false;
      
      // Check if the incident is resolved based on its type
      switch (incident.type) {
        case IncidentType.SERVICE_UNAVAILABLE:
          // Resolved if system status is no longer critical
          isResolved = healthStatus.status !== SystemHealthStatus.CRITICAL;
          break;
          
        case IncidentType.BLOCKCHAIN_CONNECTIVITY:
          // Resolved if the component is healthy
          if (incident.component) {
            isResolved = systemHealthMonitor.isComponentHealthy(incident.component);
          }
          break;
          
        case IncidentType.PERFORMANCE_DEGRADATION:
          // Resolved if API Gateway and Cache are healthy
          isResolved = 
            systemHealthMonitor.isComponentHealthy(SystemComponent.API_GATEWAY) &&
            systemHealthMonitor.isComponentHealthy(SystemComponent.CACHE);
          break;
          
        default:
          // For other types, consider resolved if in MITIGATING state for over 10 minutes
          if (incident.status === IncidentStatus.MITIGATING) {
            const tenMinutesAgo = new Date();
            tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);
            
            isResolved = incident.updatedAt < tenMinutesAgo;
          }
      }
      
      // Update incident status if resolved
      if (isResolved) {
        incident.status = IncidentStatus.RESOLVED;
        incident.resolvedAt = new Date();
        incident.updatedAt = new Date();
        
        // Log resolution
        securityLogger.info(
          `Incident resolved: [${incident.id}] ${incident.description}`,
          SecurityEventType.SYSTEM_ERROR,
          {
            incidentId: incident.id,
            type: incident.type,
            severity: incident.severity,
            component: incident.component,
            resolvedAt: incident.resolvedAt
          }
        );
        
        // If in development mode, log to console
        if (config.isDevelopmentMode) {
          console.log(`✅ INCIDENT RESOLVED: [${incident.id}] ${incident.description}`);
        }
      }
    }
  }
  
  /**
   * Get all incidents
   */
  getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values()).sort(
      (a, b) => b.detectedAt.getTime() - a.detectedAt.getTime()
    );
  }
  
  /**
   * Get a specific incident by ID
   */
  getIncident(incidentId: string): Incident | undefined {
    return this.incidents.get(incidentId);
  }
  
  /**
   * Get incidents filtered by various criteria
   */
  getIncidents(options: {
    status?: IncidentStatus;
    type?: IncidentType;
    severity?: IncidentSeverity;
    component?: SystemComponent;
    limit?: number;
  } = {}): Incident[] {
    let filteredIncidents = Array.from(this.incidents.values());
    
    if (options.status) {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.status === options.status
      );
    }
    
    if (options.type) {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.type === options.type
      );
    }
    
    if (options.severity) {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.severity === options.severity
      );
    }
    
    if (options.component) {
      filteredIncidents = filteredIncidents.filter(
        incident => incident.component === options.component
      );
    }
    
    // Sort by detected time, newest first
    filteredIncidents.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
    
    // Apply limit if specified
    if (options.limit && options.limit > 0) {
      filteredIncidents = filteredIncidents.slice(0, options.limit);
    }
    
    return filteredIncidents;
  }
  
  /**
   * Get action by ID
   */
  getAction(actionId: string): ResponseAction | undefined {
    return this.responseActions.get(actionId);
  }
  
  /**
   * Manually close an incident
   */
  closeIncident(incidentId: string, notes?: string): boolean {
    const incident = this.incidents.get(incidentId);
    
    if (!incident) {
      return false;
    }
    
    // Only resolved incidents can be closed
    if (incident.status !== IncidentStatus.RESOLVED) {
      return false;
    }
    
    // Close the incident
    incident.status = IncidentStatus.CLOSED;
    incident.updatedAt = new Date();
    
    // Log closure
    securityLogger.info(
      `Incident closed: [${incident.id}] ${incident.description}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        incidentId: incident.id,
        notes
      }
    );
    
    return true;
  }
  
  /**
   * Get incident statistics
   */
  getIncidentStatistics(): any {
    const incidents = Array.from(this.incidents.values());
    const totalIncidents = incidents.length;
    
    // Count by status
    const byStatus: Record<string, number> = {};
    Object.values(IncidentStatus).forEach(status => {
      byStatus[status] = incidents.filter(i => i.status === status).length;
    });
    
    // Count by type
    const byType: Record<string, number> = {};
    Object.values(IncidentType).forEach(type => {
      byType[type] = incidents.filter(i => i.type === type).length;
    });
    
    // Count by severity
    const bySeverity: Record<string, number> = {};
    Object.values(IncidentSeverity).forEach(severity => {
      bySeverity[severity] = incidents.filter(i => i.severity === severity).length;
    });
    
    // Calculate average resolution time for resolved incidents
    const resolvedIncidents = incidents.filter(
      i => i.status === IncidentStatus.RESOLVED || i.status === IncidentStatus.CLOSED
    );
    
    let avgResolutionTimeMs = 0;
    
    if (resolvedIncidents.length > 0) {
      const totalResolutionTimeMs = resolvedIncidents.reduce((sum, incident) => {
        if (incident.resolvedAt) {
          return sum + (incident.resolvedAt.getTime() - incident.detectedAt.getTime());
        }
        return sum;
      }, 0);
      
      avgResolutionTimeMs = totalResolutionTimeMs / resolvedIncidents.length;
    }
    
    // Recent incidents (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentIncidents = incidents.filter(i => i.detectedAt >= oneDayAgo);
    
    return {
      totalIncidents,
      recentIncidents: recentIncidents.length,
      byStatus,
      byType,
      bySeverity,
      averageResolutionTimeMinutes: Math.round(avgResolutionTimeMs / (1000 * 60))
    };
  }
  
  /**
   * Generate a test incident (for development/testing)
   */
  generateTestIncident(params: {
    type?: IncidentType;
    severity?: IncidentSeverity;
    component?: SystemComponent;
    description?: string;
  } = {}): Incident {
    const type = params.type || IncidentType.PERFORMANCE_DEGRADATION;
    const severity = params.severity || IncidentSeverity.MEDIUM;
    const component = params.component;
    const description = params.description || `Test incident: ${type} (${severity})`;
    
    return this.createIncident({
      type,
      severity,
      component,
      description,
      metadata: {
        isTest: true,
        createdAt: new Date()
      }
    });
  }
  
  /**
   * Clean up resources when shutting down
   */
  shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}

// Export singleton instance
export const incidentResponseSystem = new IncidentResponseSystem();