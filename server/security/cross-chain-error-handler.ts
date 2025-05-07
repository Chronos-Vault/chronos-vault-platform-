/**
 * Cross-Chain Error Handler
 * 
 * This module provides standardized error handling for cross-chain operations,
 * including categorization, logging, recovery strategies, and client-safe error reporting.
 */

import { securityLogger } from '../monitoring/security-logger';
import { BlockchainType } from '../../shared/types';

// Error categories for cross-chain operations
export enum CrossChainErrorCategory {
  // Connection errors
  CONNECTION_FAILURE = 'CONNECTION_FAILURE',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  
  // Transaction errors
  TRANSACTION_FAILURE = 'TRANSACTION_FAILURE',
  TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
  TRANSACTION_NOT_FOUND = 'TRANSACTION_NOT_FOUND',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  
  // Validation errors
  VALIDATION_FAILURE = 'VALIDATION_FAILURE',
  SIGNATURE_INVALID = 'SIGNATURE_INVALID',
  PROOF_VERIFICATION_FAILED = 'PROOF_VERIFICATION_FAILED',
  
  // Bridge errors
  BRIDGE_CONTRACT_ERROR = 'BRIDGE_CONTRACT_ERROR',
  BRIDGE_NOT_AVAILABLE = 'BRIDGE_NOT_AVAILABLE',
  
  // Data errors
  INVALID_DATA = 'INVALID_DATA',
  MISSING_PARAMETER = 'MISSING_PARAMETER',
  
  // Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  
  // Unknown errors
  UNKNOWN = 'UNKNOWN'
}

// Severity levels for errors
export enum ErrorSeverity {
  LOW = 'LOW',           // Minor issues, operation can continue
  MEDIUM = 'MEDIUM',     // Significant issues, operation may be affected
  HIGH = 'HIGH',         // Critical issues, operation likely to fail
  CRITICAL = 'CRITICAL'  // Fatal issues, operation cannot continue
}

// Recovery strategies for different error types
export enum RecoveryStrategy {
  RETRY = 'RETRY',                   // Retry the operation
  ALTERNATE_ROUTE = 'ALTERNATE_ROUTE', // Try an alternative path/method
  FALLBACK = 'FALLBACK',             // Use fallback data/service
  NOTIFY_USER = 'NOTIFY_USER',       // Alert the user for action
  ABORT = 'ABORT',                   // Abort the operation
  NONE = 'NONE'                      // No recovery possible
}

// Structured cross-chain error object
export interface CrossChainError {
  category: CrossChainErrorCategory;
  message: string;
  severity: ErrorSeverity;
  blockchain?: BlockchainType;
  transactionId?: string;
  recoveryStrategy: RecoveryStrategy;
  recoveryAttempts?: number;
  maxRecoveryAttempts?: number;
  originalError?: any;
  timestamp: number;
  correlationId?: string;
}

// Default recovery strategies mapped to error categories
const defaultRecoveryStrategies: Record<CrossChainErrorCategory, RecoveryStrategy> = {
  [CrossChainErrorCategory.CONNECTION_FAILURE]: RecoveryStrategy.RETRY,
  [CrossChainErrorCategory.TIMEOUT]: RecoveryStrategy.RETRY,
  [CrossChainErrorCategory.RATE_LIMIT]: RecoveryStrategy.RETRY,
  [CrossChainErrorCategory.TRANSACTION_FAILURE]: RecoveryStrategy.RETRY,
  [CrossChainErrorCategory.TRANSACTION_REJECTED]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.TRANSACTION_NOT_FOUND]: RecoveryStrategy.ALTERNATE_ROUTE,
  [CrossChainErrorCategory.INSUFFICIENT_FUNDS]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.VALIDATION_FAILURE]: RecoveryStrategy.ALTERNATE_ROUTE,
  [CrossChainErrorCategory.SIGNATURE_INVALID]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.PROOF_VERIFICATION_FAILED]: RecoveryStrategy.RETRY,
  [CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR]: RecoveryStrategy.ALTERNATE_ROUTE,
  [CrossChainErrorCategory.BRIDGE_NOT_AVAILABLE]: RecoveryStrategy.FALLBACK,
  [CrossChainErrorCategory.INVALID_DATA]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.MISSING_PARAMETER]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.UNAUTHORIZED]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.FORBIDDEN]: RecoveryStrategy.NOTIFY_USER,
  [CrossChainErrorCategory.INTERNAL_SERVER_ERROR]: RecoveryStrategy.FALLBACK,
  [CrossChainErrorCategory.NOT_IMPLEMENTED]: RecoveryStrategy.ABORT,
  [CrossChainErrorCategory.UNKNOWN]: RecoveryStrategy.NOTIFY_USER
};

// Default severity levels mapped to error categories
const defaultSeverityLevels: Record<CrossChainErrorCategory, ErrorSeverity> = {
  [CrossChainErrorCategory.CONNECTION_FAILURE]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.TIMEOUT]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.RATE_LIMIT]: ErrorSeverity.LOW,
  [CrossChainErrorCategory.TRANSACTION_FAILURE]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.TRANSACTION_REJECTED]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.TRANSACTION_NOT_FOUND]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.INSUFFICIENT_FUNDS]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.VALIDATION_FAILURE]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.SIGNATURE_INVALID]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.PROOF_VERIFICATION_FAILED]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.BRIDGE_NOT_AVAILABLE]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.INVALID_DATA]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.MISSING_PARAMETER]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.UNAUTHORIZED]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.FORBIDDEN]: ErrorSeverity.HIGH,
  [CrossChainErrorCategory.INTERNAL_SERVER_ERROR]: ErrorSeverity.CRITICAL,
  [CrossChainErrorCategory.NOT_IMPLEMENTED]: ErrorSeverity.MEDIUM,
  [CrossChainErrorCategory.UNKNOWN]: ErrorSeverity.HIGH
};

// Max recovery attempts by severity
const maxRecoveryAttempts: Record<ErrorSeverity, number> = {
  [ErrorSeverity.LOW]: 5,
  [ErrorSeverity.MEDIUM]: 3,
  [ErrorSeverity.HIGH]: 2,
  [ErrorSeverity.CRITICAL]: 1
};

/**
 * Cross-Chain Error Handler class
 */
class CrossChainErrorHandler {
  /**
   * Handles a cross-chain error
   */
  handle(
    error: Error | unknown,
    options: {
      category?: CrossChainErrorCategory;
      blockchain?: BlockchainType;
      transactionId?: string;
      severity?: ErrorSeverity;
      recoveryStrategy?: RecoveryStrategy;
      recoveryAttempts?: number;
      correlationId?: string;
    } = {}
  ): CrossChainError {
    // Determine the error category
    const category = options.category || this.categorizeError(error);
    
    // Set severity based on category or override
    const severity = options.severity || defaultSeverityLevels[category];
    
    // Set recovery strategy based on category or override
    const recoveryStrategy = options.recoveryStrategy || defaultRecoveryStrategies[category];
    
    // Create structured error
    const crossChainError: CrossChainError = {
      category,
      message: this.extractErrorMessage(error),
      severity,
      blockchain: options.blockchain,
      transactionId: options.transactionId,
      recoveryStrategy,
      recoveryAttempts: options.recoveryAttempts || 0,
      maxRecoveryAttempts: maxRecoveryAttempts[severity],
      originalError: error,
      timestamp: Date.now(),
      correlationId: options.correlationId || `err-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`
    };
    
    // Log the error
    this.logError(crossChainError);
    
    return crossChainError;
  }
  
  /**
   * Try to categorize an error based on its properties and message
   */
  private categorizeError(error: Error | unknown): CrossChainErrorCategory {
    if (!error) {
      return CrossChainErrorCategory.UNKNOWN;
    }
    
    const errorMsg = this.extractErrorMessage(error).toLowerCase();
    
    if (errorMsg.includes('connection') || errorMsg.includes('network') || errorMsg.includes('connect')) {
      return CrossChainErrorCategory.CONNECTION_FAILURE;
    }
    
    if (errorMsg.includes('timeout') || errorMsg.includes('timed out')) {
      return CrossChainErrorCategory.TIMEOUT;
    }
    
    if (errorMsg.includes('rate limit') || errorMsg.includes('too many requests')) {
      return CrossChainErrorCategory.RATE_LIMIT;
    }
    
    if (errorMsg.includes('invalid signature') || errorMsg.includes('signature invalid')) {
      return CrossChainErrorCategory.SIGNATURE_INVALID;
    }
    
    if (errorMsg.includes('not found') && (errorMsg.includes('transaction') || errorMsg.includes('tx'))) {
      return CrossChainErrorCategory.TRANSACTION_NOT_FOUND;
    }
    
    if (errorMsg.includes('insufficient funds') || errorMsg.includes('not enough balance')) {
      return CrossChainErrorCategory.INSUFFICIENT_FUNDS;
    }
    
    if (errorMsg.includes('validation') || errorMsg.includes('invalid')) {
      return CrossChainErrorCategory.VALIDATION_FAILURE;
    }
    
    if (errorMsg.includes('unauthorized') || errorMsg.includes('not authorized')) {
      return CrossChainErrorCategory.UNAUTHORIZED;
    }
    
    if (errorMsg.includes('forbidden') || errorMsg.includes('access denied')) {
      return CrossChainErrorCategory.FORBIDDEN;
    }
    
    if (errorMsg.includes('parameter') && errorMsg.includes('missing')) {
      return CrossChainErrorCategory.MISSING_PARAMETER;
    }
    
    if (errorMsg.includes('bridge') || errorMsg.includes('contract')) {
      return CrossChainErrorCategory.BRIDGE_CONTRACT_ERROR;
    }
    
    if (errorMsg.includes('internal') || errorMsg.includes('server error')) {
      return CrossChainErrorCategory.INTERNAL_SERVER_ERROR;
    }
    
    if (errorMsg.includes('not implemented')) {
      return CrossChainErrorCategory.NOT_IMPLEMENTED;
    }
    
    return CrossChainErrorCategory.UNKNOWN;
  }
  
  /**
   * Extract a meaningful error message
   */
  private extractErrorMessage(error: Error | unknown): string {
    if (!error) {
      return 'Unknown error occurred';
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (typeof error === 'object') {
      // Try to extract message from common error object patterns
      const errorObj = error as any;
      
      if (errorObj.message) {
        return errorObj.message;
      }
      
      if (errorObj.error && typeof errorObj.error === 'string') {
        return errorObj.error;
      }
      
      if (errorObj.error && errorObj.error.message) {
        return errorObj.error.message;
      }
      
      if (errorObj.reason) {
        return errorObj.reason;
      }
      
      return JSON.stringify(error);
    }
    
    return String(error);
  }
  
  /**
   * Log the error with appropriate severity
   */
  private logError(error: CrossChainError): void {
    const logData = {
      category: error.category,
      blockchain: error.blockchain,
      transactionId: error.transactionId,
      severity: error.severity,
      recoveryStrategy: error.recoveryStrategy,
      correlationId: error.correlationId,
      timestamp: new Date(error.timestamp).toISOString()
    };
    
    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        securityLogger.error(`CRITICAL: ${error.message}`, logData);
        break;
      case ErrorSeverity.HIGH:
        securityLogger.error(`HIGH: ${error.message}`, logData);
        break;
      case ErrorSeverity.MEDIUM:
        securityLogger.warn(`MEDIUM: ${error.message}`, logData);
        break;
      case ErrorSeverity.LOW:
        securityLogger.info(`LOW: ${error.message}`, logData);
        break;
      default:
        securityLogger.info(`${error.message}`, logData);
    }
  }
  
  /**
   * Create a client-safe version of the error (removes sensitive info)
   */
  createClientSafeError(error: CrossChainError): Record<string, any> {
    // Only include properties safe for client viewing
    return {
      category: error.category,
      message: error.message,
      severity: error.severity,
      blockchain: error.blockchain,
      recoveryStrategy: error.recoveryStrategy,
      recoverable: error.recoveryStrategy !== RecoveryStrategy.ABORT && 
                   error.recoveryStrategy !== RecoveryStrategy.NONE,
      correlationId: error.correlationId,
      timestamp: error.timestamp
    };
  }
  
  /**
   * Determine if recovery should be attempted
   */
  shouldAttemptRecovery(error: CrossChainError): boolean {
    // Don't attempt recovery if the strategy doesn't support it
    if (
      error.recoveryStrategy === RecoveryStrategy.ABORT || 
      error.recoveryStrategy === RecoveryStrategy.NONE ||
      error.recoveryStrategy === RecoveryStrategy.NOTIFY_USER
    ) {
      return false;
    }
    
    // Don't attempt recovery if we've reached max attempts
    if (
      error.recoveryAttempts !== undefined && 
      error.maxRecoveryAttempts !== undefined &&
      error.recoveryAttempts >= error.maxRecoveryAttempts
    ) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Get recovery delay in ms based on attempt number and severity
   */
  getRecoveryDelayMs(error: CrossChainError): number {
    // Exponential backoff based on number of attempts
    const baseDelay = 1000; // 1 second base delay
    const attempts = error.recoveryAttempts || 0;
    
    // Calculate delay with exponential backoff: baseDelay * 2^attempts
    // With some randomness to avoid thundering herd problem
    const exponentialDelay = baseDelay * Math.pow(2, attempts);
    const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
    
    // For rate limit errors, use a longer delay
    if (error.category === CrossChainErrorCategory.RATE_LIMIT) {
      return exponentialDelay * 2 + jitter;
    }
    
    return exponentialDelay + jitter;
  }
}

export const crossChainErrorHandler = new CrossChainErrorHandler();