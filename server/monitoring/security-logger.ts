/**
 * Security Logger
 * 
 * A specialized logger for security events and operations
 * with additional features like tamper detection and alert triggers.
 */

import config from '../config';

// Security log severity levels
export enum SecurityLogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Security event types
export enum SecurityEventType {
  AUTH_ATTEMPT = 'AUTH_ATTEMPT',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_FAILURE = 'AUTH_FAILURE',
  VAULT_ACCESS = 'VAULT_ACCESS',
  VAULT_CREATION = 'VAULT_CREATION',
  VAULT_MODIFICATION = 'VAULT_MODIFICATION',
  CROSS_CHAIN_VERIFICATION = 'CROSS_CHAIN_VERIFICATION', 
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  // Geo vault specific events
  VAULT_CREATED = 'VAULT_CREATED',
  VAULT_UPDATED = 'VAULT_UPDATED',
  VAULT_DELETED = 'VAULT_DELETED',
  ACCESS_ATTEMPT = 'ACCESS_ATTEMPT',
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  ACCESS_DENIED = 'ACCESS_DENIED',
  ACCESS_VERIFICATION = 'ACCESS_VERIFICATION',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  INPUT_VALIDATION_FAILURE = 'INPUT_VALIDATION_FAILURE'
}

// Structure of a security log entry
interface SecurityLogEntry {
  timestamp: Date;
  level: SecurityLogLevel;
  eventType: SecurityEventType;
  message: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  blockchainAddress?: string;
  vaultId?: string;
  chainId?: string;
  metadata?: any;
  hash?: string; // For tamper detection
}

/**
 * Security Logger Class
 * 
 * Handles logging of security-related events with support for:
 * - Multiple severity levels
 * - Tamper detection via hash chaining
 * - Alert triggering for critical events
 */
class SecurityLogger {
  private logs: SecurityLogEntry[] = [];
  private lastLogHash: string = '';
  private alertThresholds: Map<SecurityEventType, number> = new Map();
  private eventCounts: Map<SecurityEventType, { count: number, lastReset: Date }> = new Map();
  
  constructor() {
    this.initializeAlertThresholds();
    this.initializeEventCounts();
    
    // Start the periodic counter reset
    setInterval(() => this.resetEventCounts(), 3600000); // Reset counts every hour
  }
  
  /**
   * Initialize alert thresholds for different event types
   */
  private initializeAlertThresholds(): void {
    this.alertThresholds.set(SecurityEventType.AUTH_FAILURE, 5); // 5 failed auth attempts
    this.alertThresholds.set(SecurityEventType.RATE_LIMIT_EXCEEDED, 10); // 10 rate limit events
    this.alertThresholds.set(SecurityEventType.SUSPICIOUS_ACTIVITY, 3); // 3 suspicious activities
  }
  
  /**
   * Initialize event counters
   */
  private initializeEventCounts(): void {
    Object.values(SecurityEventType).forEach(eventType => {
      this.eventCounts.set(eventType as SecurityEventType, {
        count: 0,
        lastReset: new Date()
      });
    });
  }
  
  /**
   * Reset event counters periodically
   */
  private resetEventCounts(): void {
    for (const [eventType, data] of this.eventCounts.entries()) {
      data.count = 0;
      data.lastReset = new Date();
    }
    
    if (config.isDevelopmentMode) {
      console.log('Security event counters reset');
    }
  }
  
  /**
   * Log an informational message
   */
  info(message: string, eventType: SecurityEventType, metadata?: any): void {
    this.log(SecurityLogLevel.INFO, eventType, message, metadata);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, eventType: SecurityEventType, metadata?: any): void {
    this.log(SecurityLogLevel.WARNING, eventType, message, metadata);
  }
  
  /**
   * Log an error message
   */
  error(message: string, eventType: SecurityEventType, metadata?: any): void {
    this.log(SecurityLogLevel.ERROR, eventType, message, metadata);
  }
  
  /**
   * Log a critical security event (highest severity)
   */
  critical(message: string, eventType: SecurityEventType, metadata?: any): void {
    this.log(SecurityLogLevel.CRITICAL, eventType, message, metadata);
    this.triggerAlert(eventType, message, metadata);
  }
  
  /**
   * Internal logging method
   */
  private log(level: SecurityLogLevel, eventType: SecurityEventType, message: string, metadata?: any): void {
    const timestamp = new Date();
    
    // Create log entry
    const logEntry: SecurityLogEntry = {
      timestamp,
      level,
      eventType,
      message,
      metadata
    };
    
    // Add user info if available in metadata
    if (metadata) {
      if (metadata.userId) logEntry.userId = metadata.userId;
      if (metadata.ip) logEntry.ip = metadata.ip;
      if (metadata.userAgent) logEntry.userAgent = metadata.userAgent;
      if (metadata.blockchainAddress) logEntry.blockchainAddress = metadata.blockchainAddress;
      if (metadata.vaultId) logEntry.vaultId = metadata.vaultId;
      if (metadata.chainId) logEntry.chainId = metadata.chainId;
    }
    
    // Generate hash for tamper detection
    logEntry.hash = this.generateLogHash(logEntry);
    
    // Store the log
    this.logs.push(logEntry);
    
    // Update event counter
    this.incrementEventCounter(eventType);
    
    // Check if we need to trigger an alert based on threshold
    this.checkAlertThreshold(eventType);
    
    // Console output in development mode
    if (config.isDevelopmentMode) {
      console.log(`[SECURITY ${level}] [${eventType}] ${message}`);
      if (metadata) console.log('Metadata:', JSON.stringify(metadata));
    }
  }
  
  /**
   * Increment the counter for a specific event type
   */
  private incrementEventCounter(eventType: SecurityEventType): void {
    if (!this.eventCounts.has(eventType)) {
      this.eventCounts.set(eventType, { count: 0, lastReset: new Date() });
    }
    
    const data = this.eventCounts.get(eventType)!;
    data.count++;
  }
  
  /**
   * Check if an event type has exceeded its alert threshold
   */
  private checkAlertThreshold(eventType: SecurityEventType): void {
    if (!this.alertThresholds.has(eventType)) return;
    
    const threshold = this.alertThresholds.get(eventType)!;
    const count = this.eventCounts.get(eventType)!.count;
    
    if (count >= threshold) {
      this.triggerAlert(
        eventType,
        `Alert threshold exceeded for ${eventType}: ${count} events`,
        { threshold, count }
      );
      
      // Reset counter after triggering alert
      this.eventCounts.get(eventType)!.count = 0;
    }
  }
  
  /**
   * Generate a hash for tamper detection
   * The hash includes the previous log's hash to create a chain
   */
  private generateLogHash(logEntry: SecurityLogEntry): string {
    // In a real implementation, this would use a secure hashing algorithm
    // For simplicity, we're creating a basic hash representation
    
    // Limit the message size to prevent buffer overflow errors
    const truncatedMessage = typeof logEntry.message === 'string' 
      ? logEntry.message.substring(0, 1000) 
      : String(logEntry.message).substring(0, 1000);
    
    // Create a compact event type representation to reduce string size
    const eventType = typeof logEntry.eventType === 'string'
      ? logEntry.eventType.substring(0, 100)
      : 'unknown';
    
    const dataString = `${this.lastLogHash.substring(0, 100)}|${logEntry.timestamp.toISOString()}|${logEntry.level}|${eventType}|${truncatedMessage}`;
    
    try {
      const hash = Buffer.from(dataString).toString('base64');
      
      // Store this hash for the next log entry (with size limit)
      this.lastLogHash = hash.substring(0, 100);
      
      return this.lastLogHash;
    } catch (error) {
      console.error('Error generating log hash:', error);
      // Fallback to a simple timestamp hash if we encounter errors
      return Date.now().toString(36);
    }
  }
  
  /**
   * Trigger an alert for critical security events
   */
  private triggerAlert(eventType: SecurityEventType, message: string, metadata?: any): void {
    // In a production system, this would:
    // 1. Send an email to security admins
    // 2. Send a webhook to an incident response system
    // 3. Potentially trigger an automated response
    
    console.log(`🚨 SECURITY ALERT: [${eventType}] ${message}`);
    if (metadata) console.log('Alert metadata:', JSON.stringify(metadata));
    
    // Log the alert itself
    this.logs.push({
      timestamp: new Date(),
      level: SecurityLogLevel.CRITICAL,
      eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
      message: `ALERT TRIGGERED: ${message}`,
      metadata: { originalEventType: eventType, ...metadata },
      hash: this.lastLogHash
    });
  }
  
  /**
   * Verify the integrity of the log chain
   * Returns true if the log chain is intact, false if tampering is detected
   */
  verifyLogIntegrity(): boolean {
    if (this.logs.length === 0) return true;
    
    let previousHash = '';
    
    for (let i = 0; i < this.logs.length; i++) {
      const log = this.logs[i];
      
      // Recalculate the hash
      const dataString = `${previousHash}|${log.timestamp.toISOString()}|${log.level}|${log.eventType}|${log.message}`;
      const calculatedHash = Buffer.from(dataString).toString('base64');
      
      // Compare with stored hash
      if (log.hash !== calculatedHash) {
        return false; // Tampering detected
      }
      
      previousHash = log.hash!;
    }
    
    return true;
  }
  
  /**
   * Get logs filtered by various criteria
   */
  getLogs(options: {
    startTime?: Date;
    endTime?: Date;
    level?: SecurityLogLevel;
    eventType?: SecurityEventType;
    userId?: string;
    limit?: number;
  } = {}): SecurityLogEntry[] {
    let filteredLogs = [...this.logs];
    
    if (options.startTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= options.startTime!);
    }
    
    if (options.endTime) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= options.endTime!);
    }
    
    if (options.level) {
      filteredLogs = filteredLogs.filter(log => log.level === options.level);
    }
    
    if (options.eventType) {
      filteredLogs = filteredLogs.filter(log => log.eventType === options.eventType);
    }
    
    if (options.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === options.userId);
    }
    
    // Sort by timestamp descending (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Apply limit if specified
    if (options.limit && options.limit > 0) {
      filteredLogs = filteredLogs.slice(0, options.limit);
    }
    
    return filteredLogs;
  }
  
  /**
   * Get aggregated security metrics
   */
  getSecurityMetrics(): any {
    const eventCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    
    // Initialize counts
    Object.values(SecurityEventType).forEach(type => {
      eventCounts[type] = 0;
    });
    
    Object.values(SecurityLogLevel).forEach(level => {
      levelCounts[level] = 0;
    });
    
    // Count events
    this.logs.forEach(log => {
      eventCounts[log.eventType]++;
      levelCounts[log.level]++;
    });
    
    // Get recent events (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentLogs = this.logs.filter(log => log.timestamp >= oneDayAgo);
    
    return {
      totalLogs: this.logs.length,
      recentLogs: recentLogs.length,
      byEventType: eventCounts,
      byLevel: levelCounts,
      logIntegrityIntact: this.verifyLogIntegrity()
    };
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();