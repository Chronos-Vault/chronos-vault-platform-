/**
 * Security Logger
 * 
 * This module provides specialized logging for security-related events,
 * including cross-chain verification operations, multi-signature requests,
 * and potential security incidents.
 */

import config from '../config';

class SecurityLogger {
  private logLevel: 'debug' | 'info' | 'warn' | 'error';
  
  constructor() {
    this.logLevel = config.isDevelopmentMode ? 'debug' : 'info';
    console.log('[SecurityLogger] Initialized with log level:', this.logLevel);
  }
  
  private formatLogMessage(message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${message}${dataStr}`;
  }
  
  private shouldLog(level: 'debug' | 'info' | 'warn' | 'error'): boolean {
    const levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    
    return levels[level] >= levels[this.logLevel];
  }
  
  /**
   * Log debug information
   */
  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    console.debug(`[SECURITY:DEBUG] ${this.formatLogMessage(message, data)}`);
  }
  
  /**
   * Log informational events
   */
  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    console.info(`[SECURITY:INFO] ${this.formatLogMessage(message, data)}`);
  }
  
  /**
   * Log potential security issues (warnings)
   */
  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    console.warn(`[SECURITY:WARN] ${this.formatLogMessage(message, data)}`);
    
    // In a production implementation, this would:
    // 1. Send an alert to security monitoring systems
    // 2. Store the warning in a security log database
    // 3. Potentially trigger additional verification steps
  }
  
  /**
   * Log security incidents (errors)
   */
  error(message: string, error?: any): void {
    if (!this.shouldLog('error')) return;
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    
    console.error(`[SECURITY:ERROR] ${this.formatLogMessage(message, { error: errorMessage, stack })}`);
    
    // In a production implementation, this would:
    // 1. Send high-priority alerts to security monitoring systems
    // 2. Store the incident in a security log database
    // 3. Trigger incident response procedures
  }
  
  /**
   * Log critical security breaches
   */
  critical(message: string, data?: any): void {
    console.error(`[SECURITY:CRITICAL] ${this.formatLogMessage(message, data)}`);
    
    // In a production implementation, this would:
    // 1. Send immediate alerts to security teams
    // 2. Trigger automatic lockdown procedures
    // 3. Store the breach in a security log database
    // 4. Initiate incident response protocols
  }
  
  /**
   * Log blockchain-specific security events
   */
  blockchain(chain: string, message: string, data?: any): void {
    this.info(`[BLOCKCHAIN:${chain}] ${message}`, data);
  }
  
  /**
   * Log multi-signature security events
   */
  multiSig(message: string, data?: any): void {
    this.info(`[MULTISIG] ${message}`, data);
  }
  
  /**
   * Log zero-knowledge proof events
   */
  zkp(message: string, data?: any): void {
    this.info(`[ZKP] ${message}`, data);
  }
}

export const securityLogger = new SecurityLogger();