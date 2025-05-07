/**
 * Enhanced Error Handling for Blockchain Operations
 * 
 * This module provides specialized error handling for blockchain operations,
 * including categorization, recovery mechanisms, and detailed logging.
 */

import { securityLogger } from '../monitoring/security-logger';
import { BlockchainType } from '../../shared/types';

// Error categories for blockchain operations
export enum BlockchainErrorCategory {
  NETWORK = 'NETWORK',                 // Network connectivity issues
  VALIDATION = 'VALIDATION',           // Transaction/data validation failures
  AUTHENTICATION = 'AUTHENTICATION',   // Authentication/authorization failures
  CONTRACT = 'CONTRACT',               // Smart contract execution errors
  CROSS_CHAIN = 'CROSS_CHAIN',         // Cross-chain operation failures
  SIGNATURE = 'SIGNATURE',             // Signature verification failures
  RPC = 'RPC',                         // RPC endpoint errors
  UNKNOWN = 'UNKNOWN'                  // Uncategorized errors
}

// Detailed blockchain error structure
export interface BlockchainError {
  category: BlockchainErrorCategory;
  originalError: Error | unknown;
  message: string;
  blockchain: BlockchainType;
  code?: string | number;
  retryable: boolean;
  timestamp: number;
  context?: Record<string, any>;
}

// Recovery strategies for different error types
export enum RecoveryStrategy {
  RETRY,              // Simple retry with backoff
  ALTERNATE_RPC,      // Try with an alternate RPC endpoint
  FALLBACK_CHAIN,     // Use a fallback blockchain
  MANUAL_RESOLUTION,  // Requires manual intervention
  NONE                // No recovery possible
}

/**
 * Create a structured blockchain error
 */
export function createBlockchainError(
  error: Error | unknown,
  blockchain: BlockchainType,
  category: BlockchainErrorCategory = BlockchainErrorCategory.UNKNOWN,
  context?: Record<string, any>
): BlockchainError {
  let message = 'Unknown blockchain error';
  let code: string | number | undefined = undefined;
  let retryable = false;
  
  if (error instanceof Error) {
    message = error.message;
    
    // Extract error code if available
    const anyError = error as any;
    if (anyError.code) {
      code = anyError.code;
    }
    
    // Determine if the error is retryable
    retryable = isRetryableError(error, category);
  }
  
  const blockchainError: BlockchainError = {
    category,
    originalError: error,
    message,
    blockchain,
    code,
    retryable,
    timestamp: Date.now(),
    context
  };
  
  // Log the structured error
  logBlockchainError(blockchainError);
  
  return blockchainError;
}

/**
 * Determine if an error is retryable
 */
function isRetryableError(error: Error, category: BlockchainErrorCategory): boolean {
  // Network errors are generally retryable
  if (category === BlockchainErrorCategory.NETWORK) {
    return true;
  }
  
  // RPC errors may be retryable
  if (category === BlockchainErrorCategory.RPC) {
    const message = error.message.toLowerCase();
    
    // These typically indicate temporary issues
    if (
      message.includes('timeout') ||
      message.includes('rate limit') ||
      message.includes('too many requests') ||
      message.includes('server busy') ||
      message.includes('try again')
    ) {
      return true;
    }
  }
  
  // By default, other categories are not retryable
  return false;
}

/**
 * Log a blockchain error with appropriate severity
 */
function logBlockchainError(error: BlockchainError): void {
  const logData = {
    blockchain: error.blockchain,
    category: error.category,
    code: error.code,
    retryable: error.retryable,
    timestamp: error.timestamp,
    context: error.context
  };
  
  switch (error.category) {
    case BlockchainErrorCategory.NETWORK:
    case BlockchainErrorCategory.RPC:
      // Network and RPC errors are typically transient
      securityLogger.warn(`Blockchain error: ${error.message}`, logData);
      break;
    
    case BlockchainErrorCategory.AUTHENTICATION:
    case BlockchainErrorCategory.CONTRACT:
    case BlockchainErrorCategory.CROSS_CHAIN:
    case BlockchainErrorCategory.SIGNATURE:
      // These may indicate security concerns
      securityLogger.error(`Blockchain error: ${error.message}`, logData);
      break;
    
    case BlockchainErrorCategory.VALIDATION:
      // Validation errors need investigation
      securityLogger.error(`Blockchain validation error: ${error.message}`, logData);
      break;
    
    default:
      securityLogger.error(`Unspecified blockchain error: ${error.message}`, logData);
  }
}

/**
 * Get recommended recovery strategy for an error
 */
export function getRecoveryStrategy(error: BlockchainError): RecoveryStrategy {
  if (!error.retryable) {
    return RecoveryStrategy.NONE;
  }
  
  switch (error.category) {
    case BlockchainErrorCategory.NETWORK:
      return RecoveryStrategy.RETRY;
    
    case BlockchainErrorCategory.RPC:
      return RecoveryStrategy.ALTERNATE_RPC;
    
    case BlockchainErrorCategory.CROSS_CHAIN:
      return RecoveryStrategy.FALLBACK_CHAIN;
    
    case BlockchainErrorCategory.CONTRACT:
    case BlockchainErrorCategory.VALIDATION:
      // These typically need human review
      return RecoveryStrategy.MANUAL_RESOLUTION;
    
    default:
      return RecoveryStrategy.NONE;
  }
}

/**
 * Execute a blockchain operation with enhanced error handling
 */
export async function withBlockchainErrorHandling<T>(
  operation: () => Promise<T>,
  blockchain: BlockchainType,
  context?: Record<string, any>,
  maxRetries: number = 3
): Promise<T> {
  let retryCount = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      // Analyze and categorize the error
      const category = categorizeError(error);
      const blockchainError = createBlockchainError(error, blockchain, category, context);
      
      // If error is not retryable or we've exhausted retries, rethrow
      if (!blockchainError.retryable || retryCount >= maxRetries) {
        throw blockchainError;
      }
      
      // Apply an exponential backoff for retries
      const backoffMs = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      
      retryCount++;
      securityLogger.info(`Retrying blockchain operation (${retryCount}/${maxRetries})`, {
        blockchain,
        error: blockchainError.message,
        backoffMs
      });
    }
  }
}

/**
 * Categorize an error based on its characteristics
 */
function categorizeError(error: unknown): BlockchainErrorCategory {
  if (!(error instanceof Error)) {
    return BlockchainErrorCategory.UNKNOWN;
  }
  
  const message = error.message.toLowerCase();
  
  // Check for network errors
  if (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('unreachable')
  ) {
    return BlockchainErrorCategory.NETWORK;
  }
  
  // Check for RPC errors
  if (
    message.includes('rpc') ||
    message.includes('rate limit') ||
    message.includes('too many requests')
  ) {
    return BlockchainErrorCategory.RPC;
  }
  
  // Check for validation errors
  if (
    message.includes('invalid') ||
    message.includes('validation') ||
    message.includes('format')
  ) {
    return BlockchainErrorCategory.VALIDATION;
  }
  
  // Check for contract errors
  if (
    message.includes('contract') ||
    message.includes('execution') ||
    message.includes('reverted')
  ) {
    return BlockchainErrorCategory.CONTRACT;
  }
  
  // Check for auth errors
  if (
    message.includes('unauthorized') ||
    message.includes('forbidden') ||
    message.includes('permission')
  ) {
    return BlockchainErrorCategory.AUTHENTICATION;
  }
  
  // Check for cross-chain errors
  if (
    message.includes('cross-chain') ||
    message.includes('bridge')
  ) {
    return BlockchainErrorCategory.CROSS_CHAIN;
  }
  
  // Check for signature errors
  if (
    message.includes('signature') ||
    message.includes('signing')
  ) {
    return BlockchainErrorCategory.SIGNATURE;
  }
  
  return BlockchainErrorCategory.UNKNOWN;
}