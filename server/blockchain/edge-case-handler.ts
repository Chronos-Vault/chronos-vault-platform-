/**
 * Blockchain Connector Edge Case Handler
 * 
 * This module provides specialized handling for edge cases and failure scenarios
 * that can occur during blockchain interactions. It enhances reliability and 
 * provides graceful degradation when services are unavailable.
 */

// import { securityLogger } from '../monitoring/security-logger';
// import { crossChainErrorHandler } from '../security/cross-chain-error-handler';
import config from '../config';
import { BlockchainType } from '../../shared/types';

// Temporarily define a simple securityLogger until proper one is implemented
const securityLogger = {
  warn: (message: string, context?: any) => console.warn(`[SECURITY WARNING] ${message}`, context),
  error: (message: string, context?: any) => console.error(`[SECURITY ERROR] ${message}`, context),
  info: (message: string, context?: any) => console.info(`[SECURITY INFO] ${message}`, context)
};

// Define RetryStrategy interface
interface RetryStrategy {
  shouldRetry: boolean;
  delayMs: number;
  maxRetries: number;
  exponentialBackoff: boolean;
  alternativeEndpoint?: string;
  fallbackChain?: BlockchainType;
}

// Define minimal version of CrossChainError
interface CrossChainError {
  originalError: any;
  message: string;
  category: CrossChainErrorCategory;
  blockchain?: BlockchainType;
  recoverable: boolean;
  retryStrategy?: RetryStrategy;
  solution?: string;
  metadata?: Record<string, any>;
  recoveryAttempts?: number;
}

// Define minimal ErrorContext
interface ErrorContext {
  category?: CrossChainErrorCategory;
  blockchain?: BlockchainType;
  operation?: string;
  retryCount?: number;
  vaultId?: string;
  transactionId?: string;
  severity?: ErrorSeverity;
  recoveryStrategy?: RecoveryStrategy;
  metadata?: Record<string, any>;
}

// Simple implementation of crossChainErrorHandler
const crossChainErrorHandler = {
  handle: (error: any, context: ErrorContext): CrossChainError => {
    const message = typeof error === 'string' ? error : error?.message || 'Unknown error';
    
    return {
      originalError: error,
      message,
      category: context.category || CrossChainErrorCategory.UNKNOWN,
      blockchain: context.blockchain,
      recoverable: context.recoveryStrategy === RecoveryStrategy.RETRY,
      retryStrategy: {
        shouldRetry: context.recoveryStrategy === RecoveryStrategy.RETRY,
        delayMs: 1000,
        maxRetries: 3,
        exponentialBackoff: true
      },
      solution: 'retry operation',
      metadata: context.metadata || {},
      recoveryAttempts: context.retryCount || 0
    };
  },
  
  shouldAttemptRecovery: (error: CrossChainError): boolean => {
    return error.recoverable && (error.recoveryAttempts || 0) < 3;
  }
};

// Define CrossChainErrorCategory enum
enum CrossChainErrorCategory {
  CONNECTION_FAILURE = 'connection_failure',
  TRANSACTION_FAILURE = 'transaction_failure',
  VALIDATION_FAILURE = 'validation_failure', 
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  VERIFICATION_FAILURE = 'verification_failure',
  ASSET_MISMATCH = 'asset_mismatch',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  INVALID_PARAMETERS = 'invalid_parameters',
  NODE_SYNCING = 'node_syncing',
  UNKNOWN = 'unknown',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  TRANSACTION_REJECTED = 'transaction_rejected',
  TRANSACTION_NOT_FOUND = 'transaction_not_found'
}

// Retry configuration by operation type
export const retryConfig = {
  connection: {
    maxAttempts: 5,
    baseDelayMs: 1000, // 1 second
    maxDelayMs: 30000  // 30 seconds
  },
  transaction: {
    maxAttempts: 3,
    baseDelayMs: 2000, // 2 seconds
    maxDelayMs: 20000  // 20 seconds
  },
  validation: {
    maxAttempts: 4,
    baseDelayMs: 1500, // 1.5 seconds
    maxDelayMs: 15000  // 15 seconds
  }
};

// Define recovery strategies
enum RecoveryStrategy {
  RETRY = 'retry',
  NOTIFY_USER = 'notify_user',
  ABORT = 'abort',
  FALLBACK = 'fallback'
}

// Define error severity levels
enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Define additional error categories
enum AdditionalErrorCategory {
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  TRANSACTION_REJECTED = 'transaction_rejected',
  TRANSACTION_NOT_FOUND = 'transaction_not_found'
}

// Chain-specific error patterns and solutions
const chainSpecificErrorPatterns = {
  ethereum: {
    'nonce too low': {
      solution: 'incrementNonce',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'insufficient funds': {
      solution: 'checkBalance',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    },
    'gas required exceeds allowance': {
      solution: 'increaseGasLimit',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'transaction underpriced': {
      solution: 'increaseGasPrice',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'replacement transaction underpriced': {
      solution: 'increasePriorityFee',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'execution reverted': {
      solution: 'checkContractState',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    }
  },
  solana: {
    'blockhash not found': {
      solution: 'refreshBlockhash',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'insufficient funds': {
      solution: 'checkBalance',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    },
    'transaction too large': {
      solution: 'reduceInstructions',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    },
    'account does not exist': {
      solution: 'createAccount',
      recoveryStrategy: RecoveryStrategy.RETRY
    }
  },
  ton: {
    'invalid seqno': {
      solution: 'refreshSeqno',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'not enough coins': {
      solution: 'checkBalance',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    },
    'cell underflow': {
      solution: 'optimizeMessage',
      recoveryStrategy: RecoveryStrategy.RETRY
    }
  },
  bitcoin: {
    'insufficient priority': {
      solution: 'increaseFee',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'missing inputs': {
      solution: 'waitForConfirmation',
      recoveryStrategy: RecoveryStrategy.RETRY
    },
    'dust output': {
      solution: 'increaseTxAmount',
      recoveryStrategy: RecoveryStrategy.NOTIFY_USER
    }
  }
};

/**
 * Edge Case Handler Class
 */
export class EdgeCaseHandler {
  // Track connection failures per endpoint
  private connectionFailures: Map<string, { count: number, lastFailure: number }> = new Map();
  
  // Track rate limit status per endpoint
  private rateLimitStatus: Map<string, { rateLimited: boolean, resetAt: number }> = new Map();
  
  /**
   * Handle a connection error
   */
  public async handleConnectionError(
    error: Error | unknown,
    chain: BlockchainType,
    endpoint: string,
    context: Record<string, any> = {}
  ): Promise<{ shouldRetry: boolean, delayMs: number, crossChainError: any }> {
    // Create a cross-chain error object
    const crossChainError = crossChainErrorHandler.handle(error, {
      category: CrossChainErrorCategory.CONNECTION_FAILURE,
      blockchain: chain,
      severity: ErrorSeverity.MEDIUM,
      recoveryStrategy: RecoveryStrategy.RETRY,
      ...context
    });
    
    // Update connection failure tracking
    this.trackConnectionFailure(endpoint);
    
    // Check if we should back off due to repeated failures
    const failureInfo = this.connectionFailures.get(endpoint);
    const highFailureRate = failureInfo && failureInfo.count > 3;
    
    // Determine if we should retry
    const shouldRetry = crossChainErrorHandler.shouldAttemptRecovery(crossChainError) && 
                        !highFailureRate;
    
    // Calculate delay
    const delayMs = highFailureRate 
      ? retryConfig.connection.maxDelayMs 
      : this.calculateBackoff(
          failureInfo?.count || 1,
          retryConfig.connection.baseDelayMs,
          retryConfig.connection.maxDelayMs
        );
    
    // Log the decision
    securityLogger.warn(
      `Connection error for ${chain}${shouldRetry ? ': will retry' : ': will not retry'}`, 
      {
        endpoint,
        errorMessage: crossChainError.message,
        failureCount: failureInfo?.count || 1,
        delayMs,
        highFailureRate
      }
    );
    
    return { shouldRetry, delayMs, crossChainError };
  }
  
  /**
   * Handle a transaction error
   */
  public async handleTransactionError(
    error: Error | unknown,
    chain: BlockchainType,
    txData: Record<string, any>,
    context: Record<string, any> = {}
  ): Promise<{ shouldRetry: boolean, delayMs: number, solution: string | null, crossChainError: any }> {
    // Extract error message
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    
    // Check for chain-specific error patterns
    const patterns = chainSpecificErrorPatterns[chain as keyof typeof chainSpecificErrorPatterns] || {};
    let solution = null;
    let recoveryStrategy = RecoveryStrategy.NOTIFY_USER;
    
    // Find matching error pattern
    for (const [pattern, info] of Object.entries(patterns)) {
      if (errorMessage.includes(pattern)) {
        solution = info.solution;
        recoveryStrategy = info.recoveryStrategy;
        break;
      }
    }
    
    // Determine error category based on message
    let category = CrossChainErrorCategory.TRANSACTION_FAILURE;
    
    if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
      category = CrossChainErrorCategory.INSUFFICIENT_FUNDS;
    } else if (errorMessage.includes('reject') || errorMessage.includes('denied')) {
      category = CrossChainErrorCategory.TRANSACTION_REJECTED;
    } else if (errorMessage.includes('not found') || errorMessage.includes('unknown')) {
      category = CrossChainErrorCategory.TRANSACTION_NOT_FOUND;
    }
    
    // Create cross-chain error
    const crossChainError = crossChainErrorHandler.handle(error, {
      category,
      blockchain: chain,
      transactionId: txData.txId || txData.hash || txData.id,
      severity: category === CrossChainErrorCategory.INSUFFICIENT_FUNDS ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      recoveryStrategy,
      ...context
    });
    
    // Determine if we should retry
    const shouldRetry = recoveryStrategy === RecoveryStrategy.RETRY && 
                       crossChainErrorHandler.shouldAttemptRecovery(crossChainError);
    
    // Calculate delay
    const delayMs = this.calculateBackoff(
      crossChainError.recoveryAttempts || 1,
      retryConfig.transaction.baseDelayMs,
      retryConfig.transaction.maxDelayMs
    );
    
    // Log the decision
    securityLogger.warn(
      `Transaction error for ${chain}${shouldRetry ? ': will retry' : ': will not retry'}`, 
      {
        errorMessage: crossChainError.message,
        solution,
        recoveryAttempts: crossChainError.recoveryAttempts,
        delayMs
      }
    );
    
    return { shouldRetry, delayMs, solution, crossChainError };
  }
  
  /**
   * Handle rate limiting
   */
  public handleRateLimit(
    endpoint: string,
    chain: BlockchainType,
    resetTimeSeconds: number = 60
  ): { shouldBackOff: boolean, retryAfterMs: number } {
    // Mark endpoint as rate limited
    const resetAt = Date.now() + (resetTimeSeconds * 1000);
    this.rateLimitStatus.set(endpoint, { rateLimited: true, resetAt });
    
    // Log rate limit event
    securityLogger.warn(`Rate limit hit for ${chain} endpoint`, { 
      endpoint, 
      resetTimeSeconds,
      resetAt: new Date(resetAt).toISOString() 
    });
    
    return { 
      shouldBackOff: true, 
      retryAfterMs: resetTimeSeconds * 1000
    };
  }
  
  /**
   * Check if an endpoint is currently rate limited
   */
  public isRateLimited(endpoint: string): boolean {
    const status = this.rateLimitStatus.get(endpoint);
    
    if (!status) {
      return false;
    }
    
    // If we've passed the reset time, clear the rate limit
    if (status.rateLimited && Date.now() > status.resetAt) {
      this.rateLimitStatus.set(endpoint, { rateLimited: false, resetAt: 0 });
      return false;
    }
    
    return status.rateLimited;
  }
  
  /**
   * Track connection failures for an endpoint
   */
  private trackConnectionFailure(endpoint: string): void {
    const now = Date.now();
    const failureInfo = this.connectionFailures.get(endpoint);
    
    // If it's been more than 5 minutes since the last failure, reset the count
    if (failureInfo && (now - failureInfo.lastFailure > 5 * 60 * 1000)) {
      this.connectionFailures.set(endpoint, { count: 1, lastFailure: now });
      return;
    }
    
    // Increment failure count
    this.connectionFailures.set(endpoint, {
      count: (failureInfo?.count || 0) + 1,
      lastFailure: now
    });
  }
  
  /**
   * Calculate exponential backoff with jitter
   */
  private calculateBackoff(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
    // Calculate exponential backoff: baseDelay * 2^(attempt-1)
    const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
    
    // Add jitter (0-25% random variation) to avoid thundering herd problem
    const jitter = Math.random() * 0.25 * exponentialDelay;
    
    // Cap at maximum delay
    return Math.min(exponentialDelay + jitter, maxDelayMs);
  }
  
  /**
   * Extract error message from various error formats
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
   * Handle network outage detection
   */
  public isNetworkOutage(chain: BlockchainType): boolean {
    // Check all endpoints for a chain to determine if there's a network-wide outage
    const endpoints = Object.keys(this.connectionFailures)
      .filter(endpoint => endpoint.includes(chain));
    
    if (endpoints.length === 0) {
      return false;
    }
    
    // If all endpoints for this chain have high failure counts, likely network outage
    const now = Date.now();
    const recentFailures = endpoints.filter(endpoint => {
      const info = this.connectionFailures.get(endpoint);
      return info && 
             info.count > 3 && 
             (now - info.lastFailure < 2 * 60 * 1000); // Within last 2 minutes
    });
    
    return recentFailures.length === endpoints.length && endpoints.length > 0;
  }
  
  /**
   * Get fallback options for a chain during outages
   */
  public getFallbackOptions(chain: BlockchainType): Record<string, any> {
    // Return chain-specific fallback options based on blockchain type
    if (chain === 'ETH' || chain === 'ethereum') {
      return {
        useAlternateRpc: true,
        readOnly: true,
        cacheResults: true
      };
    } 
    else if (chain === 'SOL' || chain === 'solana') {
      return {
        useAlternateRpc: true,
        priorityLevel: 'low',
        cacheResults: true
      };
    }
    else if (chain === 'TON' || chain === 'ton') {
      return {
        useAlternateApi: true,
        readOnly: true,
        preferCache: true
      };
    }
    else if (chain === 'BTC' || chain === 'bitcoin') {
      return {
        useAlternateNode: true,
        preferIndexer: true,
        readOnly: true
      };
    }
    else {
      return {
        readOnly: true,
        preferCache: true
      };
    }
  }
  
  /**
   * Apply transaction optimizations based on error
   */
  public optimizeTransaction(chain: BlockchainType, txData: Record<string, any>, solution: string): Record<string, any> {
    // Create a copy of transaction data to modify
    const optimizedTx = { ...txData };
    
    switch(solution) {
      case 'incrementNonce':
        if (typeof optimizedTx.nonce === 'number') {
          optimizedTx.nonce = optimizedTx.nonce + 1;
        }
        break;
        
      case 'increaseGasLimit':
        if (typeof optimizedTx.gasLimit === 'number' || typeof optimizedTx.gas === 'number') {
          const currentLimit = optimizedTx.gasLimit || optimizedTx.gas;
          optimizedTx.gasLimit = Math.floor(currentLimit * 1.5);
          optimizedTx.gas = optimizedTx.gasLimit;
        }
        break;
        
      case 'increaseGasPrice':
        if (typeof optimizedTx.gasPrice === 'string' || typeof optimizedTx.gasPrice === 'number') {
          const currentPrice = typeof optimizedTx.gasPrice === 'string' 
            ? parseFloat(optimizedTx.gasPrice) 
            : optimizedTx.gasPrice;
          
          optimizedTx.gasPrice = Math.floor(currentPrice * 1.3);
        }
        break;
        
      case 'increasePriorityFee':
        if (optimizedTx.maxPriorityFeePerGas) {
          if (typeof optimizedTx.maxPriorityFeePerGas === 'string') {
            optimizedTx.maxPriorityFeePerGas = (parseFloat(optimizedTx.maxPriorityFeePerGas) * 1.5).toString();
          } else {
            optimizedTx.maxPriorityFeePerGas = Math.floor(optimizedTx.maxPriorityFeePerGas * 1.5);
          }
        }
        break;
        
      case 'refreshBlockhash':
        // This would normally call a Solana RPC to get a new blockhash
        optimizedTx.recentBlockhash = undefined; // Force recalculation in connector
        break;
        
      case 'refreshSeqno':
        // This would normally call a TON API to get the latest seqno
        optimizedTx.seqno = undefined; // Force recalculation in connector
        break;
        
      case 'increaseFee':
        if (optimizedTx.fee) {
          if (typeof optimizedTx.fee === 'string') {
            optimizedTx.fee = (parseFloat(optimizedTx.fee) * 1.5).toString();
          } else {
            optimizedTx.fee = Math.floor(optimizedTx.fee * 1.5);
          }
        }
        break;
        
      case 'waitForConfirmation':
        // Set flag to wait for previous transaction to confirm
        optimizedTx.waitForConfirmation = true;
        break;
    }
    
    return optimizedTx;
  }
  
  /**
   * Reset failure tracking for an endpoint (call after successful operations)
   */
  public resetEndpointStatus(endpoint: string): void {
    this.connectionFailures.delete(endpoint);
    this.rateLimitStatus.delete(endpoint);
  }
  
  /**
   * Create a retry wrapper function that handles edge cases
   */
  public async withRetry<T>(
    operation: () => Promise<T>,
    chain: BlockchainType,
    operationType: 'connection' | 'transaction' | 'validation',
    context: Record<string, any> = {}
  ): Promise<T> {
    const config = retryConfig[operationType];
    let attempts = 0;
    
    while (true) {
      attempts++;
      
      try {
        return await operation();
      } catch (error) {
        // If we've reached max attempts, rethrow
        if (attempts >= config.maxAttempts) {
          throw error;
        }
        
        // Handle the error and determine if we should retry
        const { shouldRetry, delayMs } = await this.handleConnectionError(
          error, 
          chain,
          context.endpoint || 'unknown',
          { ...context, recoveryAttempts: attempts }
        );
        
        if (!shouldRetry) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
}

export const edgeCaseHandler = new EdgeCaseHandler();