/**
 * Enhanced Error Handling for Blockchain Operations
 * 
 * Provides a robust error handling system for blockchain operations with:
 * - Standardized blockchain error types with contextual information
 * - Error categorization for intelligent recovery strategies
 * - Detailed error logging and analysis
 * - Cross-chain error correlation
 */

import { securityLogger } from '../monitoring/security-logger';
import { BlockchainType } from '../../shared/types';

export enum BlockchainErrorCategory {
  // Network-related errors (connectivity, timeout, rate limiting)
  NETWORK = 'NETWORK',
  
  // Smart contract errors (execution reverts, gas issues)
  CONTRACT = 'CONTRACT',
  
  // Transaction errors (failed, rejected, invalid)
  TRANSACTION = 'TRANSACTION',
  
  // Validation errors (invalid input, address, signature)
  VALIDATION = 'VALIDATION',
  
  // Cross-chain errors (bridge failure, verification error)
  CROSS_CHAIN = 'CROSS_CHAIN',
  
  // Authentication errors (wallet errors, signature issues)
  AUTHENTICATION = 'AUTHENTICATION',
  
  // Internal errors (client issues, unexpected state)
  INTERNAL = 'INTERNAL',
  
  // Unknown errors (catch-all for unclassified errors)
  UNKNOWN = 'UNKNOWN'
}

export enum RecoveryStrategy {
  // Retry the operation with the same parameters
  RETRY = 'RETRY',
  
  // Use an alternative chain or pathway to complete the operation
  FALLBACK_CHAIN = 'FALLBACK_CHAIN',
  
  // Operation needs manual intervention from administrators
  MANUAL_RESOLUTION = 'MANUAL_RESOLUTION',
  
  // Abort the operation and notify the user
  ABORT = 'ABORT',
  
  // No recovery action possible or necessary
  NONE = 'NONE'
}

export interface BlockchainErrorContext {
  operation?: string;
  transactionId?: string;
  contractAddress?: string;
  address?: string;
  functionName?: string;
  parameters?: Record<string, any>;
  timestamp?: number;
  [key: string]: any;
}

export class BlockchainError extends Error {
  originalError: Error | unknown;
  blockchain: BlockchainType;
  category: BlockchainErrorCategory;
  context: BlockchainErrorContext;
  recoveryStrategy?: RecoveryStrategy;
  correlationId?: string;
  
  constructor(
    originalError: Error | unknown,
    blockchain: BlockchainType,
    category: BlockchainErrorCategory,
    context: BlockchainErrorContext = {},
    message?: string
  ) {
    // Create appropriate error message
    const errorMessage = message || 
      (originalError instanceof Error ? originalError.message : 'Blockchain operation failed');
    
    super(`[${blockchain}] [${category}] ${errorMessage}`);
    
    this.name = 'BlockchainError';
    this.originalError = originalError;
    this.blockchain = blockchain;
    this.category = category;
    this.context = {
      ...context,
      timestamp: context.timestamp || Date.now()
    };
    
    // Generate a correlation ID for tracking related errors across chains
    this.correlationId = `err-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Determine recovery strategy
    this.recoveryStrategy = getRecoveryStrategy(this);
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockchainError);
    }
    
    // Log the error
    this.logError();
  }
  
  /**
   * Log detailed information about this error
   */
  private logError(): void {
    securityLogger.error(`Blockchain error on ${this.blockchain}`, {
      message: this.message,
      category: this.category,
      blockchain: this.blockchain,
      context: this.context,
      correlationId: this.correlationId,
      recoveryStrategy: this.recoveryStrategy,
      stack: this.stack,
      originalError: this.originalError instanceof Error ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : this.originalError
    });
  }
  
  /**
   * Create a related error on another blockchain with the same correlation ID
   */
  createRelatedError(
    blockchain: BlockchainType,
    category: BlockchainErrorCategory,
    context: BlockchainErrorContext = {},
    message?: string
  ): BlockchainError {
    const relatedError = new BlockchainError(
      this.originalError,
      blockchain,
      category,
      context,
      message || this.message
    );
    
    // Link the errors by using the same correlation ID
    relatedError.correlationId = this.correlationId;
    
    return relatedError;
  }
  
  /**
   * Get a user-friendly description of the error
   */
  getUserFriendlyMessage(): string {
    switch (this.category) {
      case BlockchainErrorCategory.NETWORK:
        return `Network connection issue with ${this.blockchain} blockchain. Please check your internet connection and try again.`;
        
      case BlockchainErrorCategory.CONTRACT:
        return `Smart contract error on ${this.blockchain} network. The operation could not be completed due to contract restrictions or limitations.`;
        
      case BlockchainErrorCategory.TRANSACTION:
        return `Transaction failed on ${this.blockchain} network. This could be due to insufficient funds, gas issues, or network congestion.`;
        
      case BlockchainErrorCategory.VALIDATION:
        return `Invalid data provided for ${this.blockchain} operation. Please check the information you entered and try again.`;
        
      case BlockchainErrorCategory.CROSS_CHAIN:
        return `Cross-chain operation between ${this.blockchain} and another blockchain failed. The system will try an alternative path.`;
        
      case BlockchainErrorCategory.AUTHENTICATION:
        return `Authentication error with your ${this.blockchain} wallet. Please check your wallet connection and try again.`;
        
      case BlockchainErrorCategory.INTERNAL:
        return `Internal system error while processing ${this.blockchain} operation. Our team has been notified.`;
        
      default:
        return `Error processing your request on ${this.blockchain} network. Please try again later.`;
    }
  }
  
  /**
   * Check if the error is transient (temporary) and can be retried
   */
  isTransient(): boolean {
    return this.recoveryStrategy === RecoveryStrategy.RETRY;
  }
  
  /**
   * Check if this error requires manual intervention
   */
  requiresManualIntervention(): boolean {
    return this.recoveryStrategy === RecoveryStrategy.MANUAL_RESOLUTION;
  }
}

/**
 * Creates a blockchain error with proper categorization
 */
export function createBlockchainError(
  error: Error | unknown,
  blockchain: BlockchainType,
  category: BlockchainErrorCategory,
  context: BlockchainErrorContext = {},
  message?: string
): BlockchainError {
  return new BlockchainError(error, blockchain, category, context, message);
}

/**
 * Determines the appropriate recovery strategy for a blockchain error
 */
export function getRecoveryStrategy(error: BlockchainError): RecoveryStrategy {
  // Start with a default strategy based on error category
  let strategy: RecoveryStrategy;
  
  switch (error.category) {
    case BlockchainErrorCategory.NETWORK:
      // Network errors are usually transient and can be retried
      strategy = RecoveryStrategy.RETRY;
      break;
      
    case BlockchainErrorCategory.CONTRACT:
      // Contract errors usually need manual review
      strategy = RecoveryStrategy.MANUAL_RESOLUTION;
      break;
      
    case BlockchainErrorCategory.TRANSACTION:
      // Transaction errors might be retried with adjusted parameters
      strategy = RecoveryStrategy.RETRY;
      break;
      
    case BlockchainErrorCategory.VALIDATION:
      // Validation errors typically cannot be automatically resolved
      strategy = RecoveryStrategy.ABORT;
      break;
      
    case BlockchainErrorCategory.CROSS_CHAIN:
      // Cross-chain errors can try an alternative chain
      strategy = RecoveryStrategy.FALLBACK_CHAIN;
      break;
      
    case BlockchainErrorCategory.AUTHENTICATION:
      // Authentication errors typically need user intervention
      strategy = RecoveryStrategy.ABORT;
      break;
      
    case BlockchainErrorCategory.INTERNAL:
      // Internal errors need manual review
      strategy = RecoveryStrategy.MANUAL_RESOLUTION;
      break;
      
    default:
      // Unknown errors are safest to abort
      strategy = RecoveryStrategy.ABORT;
  }
  
  // Further refine strategy based on the specific error
  if (error.originalError instanceof Error) {
    const errorMessage = error.originalError.message.toLowerCase();
    
    // Refine strategy based on error message patterns
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('timed out') || 
        errorMessage.includes('rate limit')) {
      return RecoveryStrategy.RETRY;
    }
    
    if (errorMessage.includes('nonce too low') || 
        errorMessage.includes('replacement transaction underpriced')) {
      return RecoveryStrategy.RETRY;
    }
    
    if (errorMessage.includes('insufficient funds') || 
        errorMessage.includes('out of gas')) {
      return RecoveryStrategy.ABORT;
    }
    
    if (errorMessage.includes('rejected') || 
        errorMessage.includes('denied')) {
      return RecoveryStrategy.ABORT;
    }
    
    if (errorMessage.includes('already exists') || 
        errorMessage.includes('duplicate')) {
      // Operation may have actually succeeded despite error
      return RecoveryStrategy.NONE;
    }
  }
  
  return strategy;
}

/**
 * Logs error details and returns a recovery plan object
 */
export function handleBlockchainError(
  error: BlockchainError
): {
  strategy: RecoveryStrategy;
  message: string;
  shouldAlert: boolean;
  retryAfter?: number;
  alternativeChain?: BlockchainType;
} {
  // Get the recovery strategy (if not already determined)
  const strategy = error.recoveryStrategy || getRecoveryStrategy(error);
  
  // Record detailed error data for analysis
  securityLogger.error(`Handling blockchain error: ${error.message}`, {
    blockchain: error.blockchain,
    category: error.category,
    correlationId: error.correlationId,
    context: error.context,
    recoveryStrategy: strategy
  });
  
  // Determine if this error should trigger alerts
  const shouldAlert = [
    RecoveryStrategy.MANUAL_RESOLUTION,
    RecoveryStrategy.ABORT
  ].includes(strategy);
  
  // Create a user-friendly message
  const message = error.getUserFriendlyMessage();
  
  // Default retry backoff is 3 seconds
  const retryAfter = 3000;
  
  // Determine alternative chain if needed
  let alternativeChain: BlockchainType | undefined = undefined;
  
  if (strategy === RecoveryStrategy.FALLBACK_CHAIN) {
    // Choose a fallback chain different from the current one
    if (error.blockchain === 'ETH') {
      alternativeChain = 'TON';
    } else if (error.blockchain === 'TON') {
      alternativeChain = 'SOL';
    } else if (error.blockchain === 'SOL') {
      alternativeChain = 'ETH';
    }
  }
  
  return {
    strategy,
    message,
    shouldAlert,
    ...(strategy === RecoveryStrategy.RETRY ? { retryAfter } : {}),
    ...(alternativeChain ? { alternativeChain } : {})
  };
}

/**
 * Safe wrapper for blockchain operations to catch and handle errors
 */
export async function withBlockchainErrorHandling<T>(
  operation: () => Promise<T>,
  blockchain: BlockchainType,
  operationName: string,
  context: BlockchainErrorContext = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Categorize the error
    let category = BlockchainErrorCategory.UNKNOWN;
    
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('network') || 
          errorMessage.includes('connection') || 
          errorMessage.includes('timeout')) {
        category = BlockchainErrorCategory.NETWORK;
      } else if (errorMessage.includes('contract') || 
                errorMessage.includes('execution') || 
                errorMessage.includes('revert')) {
        category = BlockchainErrorCategory.CONTRACT;
      } else if (errorMessage.includes('transaction') || 
                errorMessage.includes('gas') || 
                errorMessage.includes('fee')) {
        category = BlockchainErrorCategory.TRANSACTION;
      } else if (errorMessage.includes('invalid') || 
                errorMessage.includes('address') || 
                errorMessage.includes('validate')) {
        category = BlockchainErrorCategory.VALIDATION;
      } else if (errorMessage.includes('cross-chain') || 
                errorMessage.includes('bridge')) {
        category = BlockchainErrorCategory.CROSS_CHAIN;
      } else if (errorMessage.includes('wallet') || 
                errorMessage.includes('sign') || 
                errorMessage.includes('auth')) {
        category = BlockchainErrorCategory.AUTHENTICATION;
      } else if (errorMessage.includes('internal') || 
                errorMessage.includes('client')) {
        category = BlockchainErrorCategory.INTERNAL;
      }
    }
    
    // Create enhanced blockchain error
    const blockchainError = createBlockchainError(
      error,
      blockchain,
      category,
      {
        operation: operationName,
        ...context
      }
    );
    
    // Handle the error based on strategy
    const recovery = handleBlockchainError(blockchainError);
    
    // Implement automatic recovery if possible
    if (recovery.strategy === RecoveryStrategy.RETRY) {
      securityLogger.info(`Retrying operation '${operationName}' after error`, {
        blockchain,
        retryAfter: recovery.retryAfter
      });
      
      // Wait for retry backoff period
      await new Promise(resolve => setTimeout(resolve, recovery.retryAfter));
      
      // Retry the operation
      return await withBlockchainErrorHandling(
        operation,
        blockchain,
        operationName,
        {
          ...context,
          retryAttempt: (context.retryAttempt || 0) + 1
        }
      );
    }
    
    // Re-throw the enhanced error for caller to handle
    throw blockchainError;
  }
}