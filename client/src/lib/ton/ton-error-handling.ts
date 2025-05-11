/**
 * TON Error Handling
 * 
 * A collection of utilities for handling TON blockchain errors,
 * with support for development mode fallbacks, error categorization,
 * and automated recovery strategies.
 */

/**
 * Error types specific to TON blockchain operations
 */
export enum TONErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',           // Connection issues
  API_ERROR = 'API_ERROR',                   // API rate limits or errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',     // Input validation failures
  WALLET_ERROR = 'WALLET_ERROR',             // Wallet connection issues
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',   // Transaction execution errors
  CONTRACT_ERROR = 'CONTRACT_ERROR',         // Smart contract related errors
  CROSS_CHAIN_ERROR = 'CROSS_CHAIN_ERROR',   // Issues with cross-chain operations
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'            // Fallback category
}

/**
 * Recovery strategy options for blockchain errors
 */
export enum TONRecoveryStrategy {
  RETRY = 'RETRY',               // Attempt the operation again
  FALLBACK = 'FALLBACK',         // Use alternative implementation
  NOTIFY_USER = 'NOTIFY_USER',   // Display error to the user
  LOG_ONLY = 'LOG_ONLY',         // Just log the error
  ABORT = 'ABORT'                // Stop the operation entirely
}

/**
 * Context for TON error handling
 */
export interface TONErrorContext {
  operation: string;
  retryAttempt?: number;
  details?: Record<string, any>;
  isDevelopmentMode?: boolean;
}

/**
 * Processed TON error object with categorization and recovery
 */
export interface TONError {
  originalError: any;
  message: string;
  type: TONErrorType;
  recoveryStrategy: TONRecoveryStrategy;
  retryAfterMs?: number;
  context?: TONErrorContext;
}

/**
 * Process raw errors into categorized TON errors 
 */
export function processTONError(
  error: any, 
  context: TONErrorContext
): TONError {
  // Default values
  let message = error?.message || 'Unknown TON error';
  let type = TONErrorType.UNKNOWN_ERROR;
  let recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
  let retryAfterMs: number | undefined = undefined;
  
  // Determine if development mode is active
  const isDevelopmentMode = context.isDevelopmentMode ?? (
    typeof import.meta !== 'undefined' && 
    (import.meta.env?.MODE === 'development' || import.meta.env?.DEV === true) ||
    typeof localStorage !== 'undefined' && localStorage.getItem('chronosVault_devMode') === 'true'
  );
  
  // Extract error message from various error formats
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object') {
    message = error.message || error.error || error.reason || JSON.stringify(error);
  }
  
  // Categorize error based on message and context
  if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
    type = TONErrorType.NETWORK_ERROR;
    recoveryStrategy = TONRecoveryStrategy.RETRY;
    retryAfterMs = 2000; // 2 seconds
  } 
  else if (message.includes('API') || message.includes('rate limit') || message.includes('too many requests')) {
    type = TONErrorType.API_ERROR;
    recoveryStrategy = TONRecoveryStrategy.RETRY;
    retryAfterMs = 5000; // 5 seconds
  }
  else if (message.includes('wallet') || message.includes('not connected') || message.includes('sign')) {
    type = TONErrorType.WALLET_ERROR;
    recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
  }
  else if (message.includes('transaction') || message.includes('execution') || message.includes('gas')) {
    type = TONErrorType.TRANSACTION_ERROR;
    
    // For transaction errors, we might retry with higher gas
    if (message.includes('gas')) {
      recoveryStrategy = TONRecoveryStrategy.RETRY;
      retryAfterMs = 3000; // 3 seconds
    } else {
      recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
    }
  }
  else if (message.includes('validation') || message.includes('invalid') || message.includes('format')) {
    type = TONErrorType.VALIDATION_ERROR;
    recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
  }
  else if (message.includes('contract') || message.includes('method') || message.includes('abi')) {
    type = TONErrorType.CONTRACT_ERROR;
    recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
  }
  else if (message.includes('cross-chain') || message.includes('bridge') || message.includes('verification')) {
    type = TONErrorType.CROSS_CHAIN_ERROR;
    
    // Cross-chain errors may need to retry as they involve external integrations
    recoveryStrategy = TONRecoveryStrategy.RETRY;
    retryAfterMs = 5000; // 5 seconds
  }
  
  // Special handling for development mode
  if (isDevelopmentMode) {
    // In development, we often use simulated fallbacks instead of failing
    if (type === TONErrorType.NETWORK_ERROR || type === TONErrorType.API_ERROR) {
      recoveryStrategy = TONRecoveryStrategy.FALLBACK;
      console.warn(`[TON Development Mode] Using fallback for ${type}: ${message}`);
    }
  }
  
  // Adjust retry strategy based on retry attempts
  if (recoveryStrategy === TONRecoveryStrategy.RETRY && context.retryAttempt) {
    // If we've tried too many times, stop retrying
    if (context.retryAttempt >= 3) {
      recoveryStrategy = TONRecoveryStrategy.NOTIFY_USER;
    } else {
      // Exponential backoff for retries
      retryAfterMs = retryAfterMs ? retryAfterMs * Math.pow(1.5, context.retryAttempt) : 2000;
    }
  }
  
  return {
    originalError: error,
    message,
    type,
    recoveryStrategy,
    retryAfterMs,
    context
  };
}

/**
 * Handle TON errors with consistent logging and reporting
 */
export function handleTONError(error: TONError): void {
  const { type, message, recoveryStrategy, context } = error;
  const operation = context?.operation || 'unknown operation';
  
  // Log based on error type and recovery strategy
  switch (type) {
    case TONErrorType.NETWORK_ERROR:
    case TONErrorType.API_ERROR:
      console.warn(`[TON ${type}] ${operation}: ${message}`);
      break;
    case TONErrorType.WALLET_ERROR:
      console.info(`[TON ${type}] ${operation}: ${message}`);
      break;
    case TONErrorType.CROSS_CHAIN_ERROR:
      console.error(`[TON ${type}] ${operation}: ${message}`);
      // Could trigger cross-chain recovery here
      break;
    default:
      console.error(`[TON ${type}] ${operation}: ${message}`);
  }
  
  // Log recovery approach
  if (recoveryStrategy === TONRecoveryStrategy.RETRY) {
    console.info(`[TON Recovery] Will retry ${operation} in ${error.retryAfterMs}ms`);
  } else if (recoveryStrategy === TONRecoveryStrategy.FALLBACK) {
    console.info(`[TON Recovery] Using fallback for ${operation}`);
  }
  
  // Implement additional error reporting/monitoring here
  // e.g., sending to an error tracking service, security monitoring, etc.
}

/**
 * Execute a TON operation with automatic error handling
 * 
 * @param operation The operation function to execute
 * @param context Error context information
 * @returns The result of the operation if successful
 */
export async function withTONErrorHandling<T>(
  operation: () => Promise<T>,
  context: Omit<TONErrorContext, 'retryAttempt'>
): Promise<T> {
  // Add default retry count if not provided
  const fullContext: TONErrorContext = {
    ...context,
    retryAttempt: 0
  };
  
  try {
    // Execute the operation
    return await operation();
  } catch (err) {
    // Process the error
    const tonError = processTONError(err, fullContext);
    
    // Handle the error (logging, etc.)
    handleTONError(tonError);
    
    // Implement recovery based on strategy
    if (tonError.recoveryStrategy === TONRecoveryStrategy.RETRY && tonError.retryAfterMs) {
      // Wait for the retry delay
      await new Promise(resolve => setTimeout(resolve, tonError.retryAfterMs));
      
      // Retry the operation with incremented retry count
      return withTONErrorHandling(operation, {
        ...context,
        retryAttempt: (fullContext.retryAttempt || 0) + 1 as any
      });
    } 
    else if (tonError.recoveryStrategy === TONRecoveryStrategy.FALLBACK) {
      // If we have a fallback mechanism, we could implement it here
      // For now, we'll just re-throw to be handled by the caller
      throw tonError;
    } 
    else {
      // For other strategies, just rethrow the enhanced error
      throw tonError;
    }
  }
}