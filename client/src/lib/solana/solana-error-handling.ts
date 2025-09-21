/**
 * Solana Error Handling
 * 
 * A collection of utilities for handling Solana blockchain errors,
 * with support for development mode fallbacks, error categorization,
 * and automated recovery strategies.
 */

/**
 * Error types specific to Solana blockchain operations
 */
export enum SolanaErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',           // Connection issues
  RPC_ERROR = 'RPC_ERROR',                   // RPC API errors
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',     // Rate limiting errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',     // Input validation failures
  WALLET_ERROR = 'WALLET_ERROR',             // Wallet connection issues
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',   // Transaction execution errors
  PROGRAM_ERROR = 'PROGRAM_ERROR',           // Solana program errors
  ACCOUNT_ERROR = 'ACCOUNT_ERROR',           // Account-related errors
  INSTRUCTION_ERROR = 'INSTRUCTION_ERROR',   // Instruction creation/execution errors
  LAMPORT_ERROR = 'LAMPORT_ERROR',           // Balance or fee issues
  CROSS_CHAIN_ERROR = 'CROSS_CHAIN_ERROR',   // Issues with cross-chain operations
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'            // Fallback category
}

/**
 * Recovery strategy options for blockchain errors
 */
export enum SolanaRecoveryStrategy {
  RETRY = 'RETRY',               // Attempt the operation again
  FALLBACK = 'FALLBACK',         // Use alternative implementation
  NOTIFY_USER = 'NOTIFY_USER',   // Display error to the user
  LOG_ONLY = 'LOG_ONLY',         // Just log the error
  ABORT = 'ABORT'                // Stop the operation entirely
}

/**
 * Context for Solana error handling
 */
export interface SolanaErrorContext {
  operation: string;
  retryAttempt?: number;
  details?: Record<string, any>;
  isDevelopmentMode?: boolean;
}

/**
 * Processed Solana error object with categorization and recovery
 */
export interface SolanaError {
  originalError: any;
  message: string;
  type: SolanaErrorType;
  recoveryStrategy: SolanaRecoveryStrategy;
  retryAfterMs?: number;
  context?: SolanaErrorContext;
}

/**
 * Process raw errors into categorized Solana errors 
 */
export function processSolanaError(
  error: any,
  context: SolanaErrorContext
): SolanaError {
  let type = SolanaErrorType.UNKNOWN_ERROR;
  let message = error?.message || 'Unknown Solana error';
  let recoveryStrategy = SolanaRecoveryStrategy.NOTIFY_USER;
  let retryAfterMs: number | undefined = undefined;
  
  // Extract Solana-specific error codes if available
  const errorCode = error?.code || null;
  
  // Check common Solana error patterns in message
  if (typeof message === 'string') {
    // Network errors
    if (
      message.includes('network') || 
      message.includes('connect') || 
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('unavailable')
    ) {
      type = SolanaErrorType.NETWORK_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.RETRY;
      retryAfterMs = 3000; // 3 seconds
    }
    // RPC errors
    else if (
      message.includes('rpc') || 
      message.includes('request failed') ||
      message.includes('rate limit')
    ) {
      type = SolanaErrorType.RPC_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.RETRY;
      retryAfterMs = 5000; // 5 seconds
    }
    // Program errors
    else if (
      message.includes('program') || 
      message.includes('instruction error')
    ) {
      type = SolanaErrorType.PROGRAM_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.NOTIFY_USER;
    }
    // Account errors
    else if (
      message.includes('account') || 
      message.includes('not found') || 
      message.includes('does not exist')
    ) {
      type = SolanaErrorType.ACCOUNT_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.NOTIFY_USER;
    }
    // Validation errors
    else if (
      message.includes('invalid') || 
      message.includes('format') || 
      message.includes('type')
    ) {
      type = SolanaErrorType.VALIDATION_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.ABORT;
    }
    // Transaction errors
    else if (
      message.includes('transaction') || 
      message.includes('signature') || 
      message.includes('blockhash')
    ) {
      type = SolanaErrorType.TRANSACTION_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.RETRY;
      retryAfterMs = 2000; // 2 seconds
    }
    // Wallet errors
    else if (
      message.includes('wallet') || 
      message.includes('signer') || 
      message.includes('keystore') ||
      message.includes('user rejected')
    ) {
      type = SolanaErrorType.WALLET_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.NOTIFY_USER;
    }
    // Lamport/balance errors
    else if (
      message.includes('lamport') || 
      message.includes('balance') ||
      message.includes('insufficient')
    ) {
      type = SolanaErrorType.LAMPORT_ERROR;
      recoveryStrategy = SolanaRecoveryStrategy.NOTIFY_USER;
    }
  }
  
  // For development mode, adjust recovery strategy to be more lenient
  if (context.isDevelopmentMode) {
    if (type === SolanaErrorType.NETWORK_ERROR || type === SolanaErrorType.RPC_ERROR) {
      recoveryStrategy = SolanaRecoveryStrategy.FALLBACK;
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
 * Handle Solana errors with consistent logging and reporting
 */
export function handleSolanaError(error: SolanaError): void {
  // Log the error with appropriate level
  switch (error.recoveryStrategy) {
    case SolanaRecoveryStrategy.ABORT:
    case SolanaRecoveryStrategy.NOTIFY_USER:
      console.error(`Solana Error [${error.type}]: ${error.message}`, {
        context: error.context,
        recoveryStrategy: error.recoveryStrategy
      });
      break;
    case SolanaRecoveryStrategy.RETRY:
    case SolanaRecoveryStrategy.FALLBACK:
      console.warn(`Solana Error [${error.type}]: ${error.message}`, {
        context: error.context,
        recoveryStrategy: error.recoveryStrategy,
        retryAfterMs: error.retryAfterMs
      });
      break;
    case SolanaRecoveryStrategy.LOG_ONLY:
    default:
      console.log(`Solana Info [${error.type}]: ${error.message}`, {
        context: error.context
      });
      break;
  }
  
  // Additional error reporting could be added here
  // e.g., sending to monitoring service, user notifications, etc.
}

/**
 * Execute a Solana operation with automatic error handling
 * 
 * @param operation The operation function to execute
 * @param context Error context information
 * @returns The result of the operation if successful
 */
export async function withSolanaErrorHandling<T>(
  operation: () => Promise<T>,
  context: SolanaErrorContext
): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    // Build full context with defaults
    const fullContext: SolanaErrorContext = {
      ...context,
      retryAttempt: context.retryAttempt || 0,
      isDevelopmentMode: context.isDevelopmentMode || false
    };
    
    // Process and handle the error
    const solanaError = processSolanaError(err, fullContext);
    handleSolanaError(solanaError);
    
    // Apply recovery strategy
    if (solanaError.recoveryStrategy === SolanaRecoveryStrategy.RETRY && solanaError.retryAfterMs) {
      // Wait for the retry delay
      await new Promise(resolve => setTimeout(resolve, solanaError.retryAfterMs));
      
      // Retry the operation with incremented retry count
      return withSolanaErrorHandling(operation, {
        ...context,
        retryAttempt: (fullContext.retryAttempt || 0) + 1
      });
    } 
    else if (solanaError.recoveryStrategy === SolanaRecoveryStrategy.FALLBACK) {
      // If we're in development mode, we might want to return a simulated result
      if (fullContext.isDevelopmentMode) {
        console.warn('Using fallback mechanism in development environment for Solana operation');
        
        // This should be replaced with an appropriate fallback for the specific operation
        throw new Error('Solana fallback not implemented for operation: ' + fullContext.operation);
      }
    }
    
    // Re-throw if recovery didn't happen
    throw solanaError;
  }
}