/**
 * Ethereum Error Handling
 * 
 * A collection of utilities for handling Ethereum blockchain errors,
 * with support for development mode fallbacks, error categorization,
 * and automated recovery strategies.
 */

/**
 * Error types specific to Ethereum blockchain operations
 */
export enum EthereumErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',           // Connection issues
  API_ERROR = 'API_ERROR',                   // API rate limits or errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',     // Input validation failures
  WALLET_ERROR = 'WALLET_ERROR',             // Wallet connection issues
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',   // Transaction execution errors
  CONTRACT_ERROR = 'CONTRACT_ERROR',         // Smart contract related errors
  GAS_ERROR = 'GAS_ERROR',                   // Gas estimation or price issues
  SIGNATURE_ERROR = 'SIGNATURE_ERROR',       // Signature creation or verification
  CROSS_CHAIN_ERROR = 'CROSS_CHAIN_ERROR',   // Issues with cross-chain operations
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'            // Fallback category
}

/**
 * Recovery strategy options for blockchain errors
 */
export enum EthereumRecoveryStrategy {
  RETRY = 'RETRY',               // Attempt the operation again
  FALLBACK = 'FALLBACK',         // Use alternative implementation
  NOTIFY_USER = 'NOTIFY_USER',   // Display error to the user
  LOG_ONLY = 'LOG_ONLY',         // Just log the error
  ABORT = 'ABORT'                // Stop the operation entirely
}

/**
 * Context for Ethereum error handling
 */
export interface EthereumErrorContext {
  operation: string;
  retryAttempt?: number;
  details?: Record<string, any>;
  isDevelopmentMode?: boolean;
}

/**
 * Processed Ethereum error object with categorization and recovery
 */
export interface EthereumError {
  originalError: any;
  message: string;
  type: EthereumErrorType;
  recoveryStrategy: EthereumRecoveryStrategy;
  retryAfterMs?: number;
  context?: EthereumErrorContext;
}

/**
 * Process raw errors into categorized Ethereum errors 
 */
export function processEthereumError(
  error: any,
  context: EthereumErrorContext
): EthereumError {
  let type = EthereumErrorType.UNKNOWN_ERROR;
  let message = error?.message || 'Unknown Ethereum error';
  let recoveryStrategy = EthereumRecoveryStrategy.NOTIFY_USER;
  let retryAfterMs: number | undefined = undefined;
  
  // Check common Ethereum error patterns in message
  if (typeof message === 'string') {
    // Network errors
    if (
      message.includes('network') || 
      message.includes('connect') || 
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('unavailable')
    ) {
      type = EthereumErrorType.NETWORK_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.RETRY;
      retryAfterMs = 3000; // 3 seconds
    }
    // Contract errors
    else if (
      message.includes('contract') || 
      message.includes('execution reverted') ||
      message.includes('revert') ||
      message.includes('ABI')
    ) {
      type = EthereumErrorType.CONTRACT_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.NOTIFY_USER;
    }
    // Gas errors
    else if (
      message.includes('gas') || 
      message.includes('fee') || 
      message.includes('underpriced')
    ) {
      type = EthereumErrorType.GAS_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.RETRY;
      retryAfterMs = 5000; // 5 seconds
    }
    // Validation errors
    else if (
      message.includes('invalid') || 
      message.includes('format') || 
      message.includes('type')
    ) {
      type = EthereumErrorType.VALIDATION_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.ABORT;
    }
    // Wallet errors
    else if (
      message.includes('wallet') || 
      message.includes('account') || 
      message.includes('metamask') ||
      message.includes('user rejected')
    ) {
      type = EthereumErrorType.WALLET_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.NOTIFY_USER;
    }
    // Signature errors
    else if (
      message.includes('signature') || 
      message.includes('sign')
    ) {
      type = EthereumErrorType.SIGNATURE_ERROR;
      recoveryStrategy = EthereumRecoveryStrategy.NOTIFY_USER;
    }
  }
  
  // For development mode, adjust recovery strategy to be more lenient
  if (context.isDevelopmentMode) {
    if (type === EthereumErrorType.NETWORK_ERROR) {
      recoveryStrategy = EthereumRecoveryStrategy.FALLBACK;
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
 * Handle Ethereum errors with consistent logging and reporting
 */
export function handleEthereumError(error: EthereumError): void {
  // Log the error with appropriate level
  switch (error.recoveryStrategy) {
    case EthereumRecoveryStrategy.ABORT:
    case EthereumRecoveryStrategy.NOTIFY_USER:
      console.error(`Ethereum Error [${error.type}]: ${error.message}`, {
        context: error.context,
        recoveryStrategy: error.recoveryStrategy
      });
      break;
    case EthereumRecoveryStrategy.RETRY:
    case EthereumRecoveryStrategy.FALLBACK:
      console.warn(`Ethereum Error [${error.type}]: ${error.message}`, {
        context: error.context,
        recoveryStrategy: error.recoveryStrategy,
        retryAfterMs: error.retryAfterMs
      });
      break;
    case EthereumRecoveryStrategy.LOG_ONLY:
    default:
      console.log(`Ethereum Info [${error.type}]: ${error.message}`, {
        context: error.context
      });
      break;
  }
  
  // Additional error reporting could be added here
  // e.g., sending to monitoring service, user notifications, etc.
}

/**
 * Execute an Ethereum operation with automatic error handling
 * 
 * @param operation The operation function to execute
 * @param context Error context information
 * @returns The result of the operation if successful
 */
export async function withEthereumErrorHandling<T>(
  operation: () => Promise<T>,
  context: EthereumErrorContext
): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    // Build full context with defaults
    const fullContext: EthereumErrorContext = {
      ...context,
      retryAttempt: context.retryAttempt || 0,
      isDevelopmentMode: context.isDevelopmentMode || false
    };
    
    // Process and handle the error
    const ethereumError = processEthereumError(err, fullContext);
    handleEthereumError(ethereumError);
    
    // Apply recovery strategy
    if (ethereumError.recoveryStrategy === EthereumRecoveryStrategy.RETRY && ethereumError.retryAfterMs) {
      // Wait for the retry delay
      await new Promise(resolve => setTimeout(resolve, ethereumError.retryAfterMs));
      
      // Retry the operation with incremented retry count
      return withEthereumErrorHandling(operation, {
        ...context,
        retryAttempt: (fullContext.retryAttempt || 0) + 1
      });
    } 
    else if (ethereumError.recoveryStrategy === EthereumRecoveryStrategy.FALLBACK) {
      // If we're in development mode, we might want to return a simulated result
      if (fullContext.isDevelopmentMode) {
        console.warn('Using fallback mechanism in development environment for Ethereum operation');
        
        // This should be replaced with an appropriate fallback for the specific operation
        throw new Error('Ethereum fallback not implemented for operation: ' + fullContext.operation);
      }
    }
    
    // Re-throw if recovery didn't happen
    throw ethereumError;
  }
}