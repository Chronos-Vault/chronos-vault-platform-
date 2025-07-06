/**
 * Audit Log Service
 * 
 * Comprehensive security audit logging system that records all security-related events
 * across the application and blockchain interactions with tamper-proof storage.
 */

import { websocketService } from '@/services/websocket-service';

export type AuditLogSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AuditLogCategory = 
  | 'access' 
  | 'authentication' 
  | 'transaction' 
  | 'vault_operation'
  | 'security_check'
  | 'cross_chain_verification'
  | 'quantum_resistant_operation'
  | 'zero_knowledge_proof'
  | 'system';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  category: AuditLogCategory;
  severity: AuditLogSeverity;
  action: string;
  description: string;
  userId?: string;
  ipAddress?: string;
  blockchainNetwork?: string;
  relatedTransaction?: string;
  relatedVaultId?: string;
  metadata?: Record<string, any>;
  verified: boolean;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];
  private readonly maxLocalLogs = 1000; // Maximum logs to keep in memory
  private isInitialized = false;
  private pendingLogs: AuditLogEntry[] = [];

  constructor() {
    console.log('Initializing Audit Log Service');
    this.initialize();
  }

  /**
   * Initialize the audit log service and set up event listeners
   */
  private async initialize() {
    try {
      // Fetch initial logs from the backend if available
      this.fetchLogs();
      
      // Subscribe to WebSocket for real-time log updates
      websocketService.connect().then(() => {
        websocketService.subscribe(
          'audit-log-service',
          ['AUDIT_LOG_EVENT', 'SECURITY_ALERT'],
          (message) => {
            if (message.type === 'AUDIT_LOG_EVENT' && message.data?.auditLog) {
              this.addLogToLocalCache(message.data.auditLog);
            }
          }
        );
      }).catch(error => {
        console.error('Failed to connect to WebSocket for audit logs:', error);
      });
      
      this.isInitialized = true;
      
      // Process any pending logs
      if (this.pendingLogs.length > 0) {
        this.pendingLogs.forEach(log => this.addLogToLocalCache(log));
        this.pendingLogs = [];
      }
    } catch (error) {
      console.error('Failed to initialize audit log service:', error);
    }
  }

  /**
   * Create and record a new audit log entry
   */
  public async logSecurityEvent(
    category: AuditLogCategory,
    severity: AuditLogSeverity,
    action: string,
    description: string,
    metadata: Record<string, any> = {}
  ): Promise<AuditLogEntry> {
    const logEntry: AuditLogEntry = {
      id: `auditlog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      category,
      severity,
      action,
      description,
      metadata,
      verified: false // Will be verified after blockchain confirmation
    };

    // If service is not initialized yet, queue the log
    if (!this.isInitialized) {
      this.pendingLogs.push(logEntry);
      return logEntry;
    }

    // Add to local cache
    this.addLogToLocalCache(logEntry);

    // Send to server for permanent storage and blockchain verification
    this.sendLogToServer(logEntry);

    return logEntry;
  }

  /**
   * Add a log entry to the local cache
   */
  private addLogToLocalCache(logEntry: AuditLogEntry) {
    this.logs.unshift(logEntry);
    
    // Limit the size of in-memory logs
    if (this.logs.length > this.maxLocalLogs) {
      this.logs = this.logs.slice(0, this.maxLocalLogs);
    }
  }

  /**
   * Send a log entry to the server for permanent storage
   */
  private async sendLogToServer(logEntry: AuditLogEntry) {
    try {
      const response = await fetch('/api/security/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auditLog: logEntry }),
      });

      if (!response.ok) {
        console.error('Failed to send audit log to server:', await response.text());
      }
    } catch (error) {
      console.error('Error sending audit log to server:', error);
    }
  }

  /**
   * Fetch logs from the server
   */
  public async fetchLogs(
    filters: {
      categories?: AuditLogCategory[];
      severities?: AuditLogSeverity[];
      fromTimestamp?: number;
      toTimestamp?: number;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<AuditLogEntry[]> {
    try {
      // For simulation in development, return local logs
      if (process.env.NODE_ENV === 'development') {
        // Filter logs based on criteria
        let filteredLogs = [...this.logs];
        
        if (filters.categories?.length) {
          filteredLogs = filteredLogs.filter(log => 
            filters.categories!.includes(log.category)
          );
        }
        
        if (filters.severities?.length) {
          filteredLogs = filteredLogs.filter(log => 
            filters.severities!.includes(log.severity)
          );
        }
        
        if (filters.fromTimestamp) {
          filteredLogs = filteredLogs.filter(log => 
            log.timestamp >= filters.fromTimestamp!
          );
        }
        
        if (filters.toTimestamp) {
          filteredLogs = filteredLogs.filter(log => 
            log.timestamp <= filters.toTimestamp!
          );
        }
        
        // Apply pagination
        const limit = filters.limit || 50;
        const offset = filters.offset || 0;
        
        return filteredLogs.slice(offset, offset + limit);
      }
      
      // In production, fetch from the server
      const queryParams = new URLSearchParams();
      
      if (filters.categories?.length) {
        filters.categories.forEach(category => queryParams.append('category', category));
      }
      
      if (filters.severities?.length) {
        filters.severities.forEach(severity => queryParams.append('severity', severity));
      }
      
      if (filters.fromTimestamp) {
        queryParams.append('fromTimestamp', filters.fromTimestamp.toString());
      }
      
      if (filters.toTimestamp) {
        queryParams.append('toTimestamp', filters.toTimestamp.toString());
      }
      
      if (filters.limit) {
        queryParams.append('limit', filters.limit.toString());
      }
      
      if (filters.offset) {
        queryParams.append('offset', filters.offset.toString());
      }
      
      const response = await fetch(`/api/security/audit-logs?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  /**
   * Get all logs in the local cache
   */
  public getLocalLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by category and/or severity
   */
  public getFilteredLogs(
    categories?: AuditLogCategory[],
    severities?: AuditLogSeverity[],
    limit: number = 50
  ): AuditLogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (categories?.length) {
      filteredLogs = filteredLogs.filter(log => 
        categories.includes(log.category)
      );
    }
    
    if (severities?.length) {
      filteredLogs = filteredLogs.filter(log => 
        severities.includes(log.severity)
      );
    }
    
    return filteredLogs.slice(0, limit);
  }

  /**
   * Export logs to a file for compliance and reporting
   */
  public exportLogs(
    format: 'json' | 'csv' = 'json',
    filters: {
      categories?: AuditLogCategory[];
      severities?: AuditLogSeverity[];
      fromTimestamp?: number;
      toTimestamp?: number;
    } = {}
  ): string {
    // Filter logs based on criteria
    let filteredLogs = [...this.logs];
    
    if (filters.categories?.length) {
      filteredLogs = filteredLogs.filter(log => 
        filters.categories!.includes(log.category)
      );
    }
    
    if (filters.severities?.length) {
      filteredLogs = filteredLogs.filter(log => 
        filters.severities!.includes(log.severity)
      );
    }
    
    if (filters.fromTimestamp) {
      filteredLogs = filteredLogs.filter(log => 
        log.timestamp >= filters.fromTimestamp!
      );
    }
    
    if (filters.toTimestamp) {
      filteredLogs = filteredLogs.filter(log => 
        log.timestamp <= filters.toTimestamp!
      );
    }
    
    if (format === 'json') {
      return JSON.stringify(filteredLogs, null, 2);
    } else {
      // CSV format
      const header = 'id,timestamp,category,severity,action,description,verified\n';
      const rows = filteredLogs.map(log => 
        `${log.id},${new Date(log.timestamp).toISOString()},${log.category},${log.severity},${log.action},${log.description},${log.verified}`
      ).join('\n');
      
      return header + rows;
    }
  }

  /**
   * Generate a sample set of audit logs for development and testing
   */
  public generateSampleLogs(count: number = 20): void {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Sample logs should only be generated in development mode');
      return;
    }
    
    const categories: AuditLogCategory[] = [
      'access', 'authentication', 'transaction', 'vault_operation',
      'security_check', 'cross_chain_verification', 'quantum_resistant_operation',
      'zero_knowledge_proof', 'system'
    ];
    
    const severities: AuditLogSeverity[] = [
      'critical', 'high', 'medium', 'low', 'info'
    ];
    
    const actions = [
      'Login Attempt', 'Vault Creation', 'Vault Access', 'Transaction Initiated',
      'Cross-Chain Verification', 'Security Check', 'Settings Changed',
      'Funds Transfer', 'Data Export', 'Password Change', 'API Access',
      'Zero-Knowledge Proof Verification', 'Quantum Encryption', 'User Created'
    ];
    
    const blockchains = ['ETH', 'SOL', 'TON', 'BTC'];
    
    for (let i = 0; i < count; i++) {
      const timestamp = Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000); // Random time in the last week
      const category = categories[Math.floor(Math.random() * categories.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const blockchain = blockchains[Math.floor(Math.random() * blockchains.length)];
      
      const logEntry: AuditLogEntry = {
        id: `samplelog-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        timestamp,
        category,
        severity,
        action,
        description: `Sample ${action} log entry for testing purposes`,
        blockchainNetwork: blockchain,
        relatedTransaction: Math.random() > 0.5 ? `0x${Math.random().toString(16).substring(2, 66)}` : undefined,
        relatedVaultId: Math.random() > 0.5 ? `vault-${Math.random().toString(36).substring(2, 9)}` : undefined,
        verified: Math.random() > 0.3 // 70% chance of being verified
      };
      
      this.logs.push(logEntry);
    }
    
    // Sort by timestamp (newest first)
    this.logs.sort((a, b) => b.timestamp - a.timestamp);
  }
}

// Create a singleton instance
export const auditLogService = new AuditLogService();

// Generate sample logs for development
if (process.env.NODE_ENV === 'development') {
  auditLogService.generateSampleLogs(50);
}