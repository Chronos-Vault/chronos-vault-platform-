import { toast } from '@/hooks/use-toast';
import { CrossChainErrorCategory } from '../../components/ui/error-message';

// Define blockchain types
export type BlockchainType = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';

// Define error types for better categorization
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum UserErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  TRANSACTION = 'transaction',
  VALIDATION = 'validation',
  SECURITY = 'security',
  RECOVERY = 'recovery',
  UNKNOWN = 'unknown'
}

export interface HandledError {
  originalError: any;
  message: string;
  userMessage: string;
  category?: CrossChainErrorCategory;
  blockchain?: BlockchainType;
  solution?: string;
  severity: ErrorSeverity;
  userErrorType: UserErrorType;
  errorCode?: string;
  recoverable: boolean;
  timestamp: number;
  details?: any;
}

/**
 * Map technical error categories to user-friendly types
 */
function mapCategoryToUserType(category?: CrossChainErrorCategory): UserErrorType {
  if (!category) return UserErrorType.UNKNOWN;
  
  switch (category) {
    case CrossChainErrorCategory.CONNECTION_FAILURE:
    case CrossChainErrorCategory.NETWORK_FAILURE:
    case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
    case CrossChainErrorCategory.NODE_SYNCING:
    case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
      return UserErrorType.NETWORK;
      
    case CrossChainErrorCategory.TRANSACTION_FAILURE:
      return UserErrorType.TRANSACTION;
      
    case CrossChainErrorCategory.VALIDATION_FAILURE:
      return UserErrorType.VALIDATION;
      
    case CrossChainErrorCategory.SECURITY_VIOLATION:
      return UserErrorType.SECURITY;
      
    case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
    case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
      return UserErrorType.RECOVERY;
      
    default:
      return UserErrorType.UNKNOWN;
  }
}

/**
 * Map error categories to severity levels
 */
function mapCategoryToSeverity(category?: CrossChainErrorCategory): ErrorSeverity {
  if (!category) return ErrorSeverity.ERROR;
  
  switch (category) {
    case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
    case CrossChainErrorCategory.NODE_SYNCING:
      return ErrorSeverity.INFO;
      
    case CrossChainErrorCategory.CONNECTION_FAILURE:
    case CrossChainErrorCategory.NETWORK_FAILURE:
    case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
    case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
      return ErrorSeverity.WARNING;
      
    case CrossChainErrorCategory.TRANSACTION_FAILURE:
    case CrossChainErrorCategory.VALIDATION_FAILURE:
    case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
      return ErrorSeverity.ERROR;
      
    case CrossChainErrorCategory.SECURITY_VIOLATION:
      return ErrorSeverity.CRITICAL;
      
    default:
      return ErrorSeverity.ERROR;
  }
}

/**
 * Process blockchain error into a user-friendly format
 */
export function processBlockchainError(
  error: any,
  blockchain?: BlockchainType,
  category?: CrossChainErrorCategory,
  options: {
    recoverable?: boolean;
    solution?: string;
    details?: any;
    errorCode?: string;
  } = {}
): HandledError {
  const timestamp = Date.now();
  const errorMessage = error?.message || String(error);
  
  // Get user error type from category
  const userErrorType = mapCategoryToUserType(category);
  
  // Get severity level from category
  const severity = mapCategoryToSeverity(category);
  
  // Generate user-friendly message
  let userMessage = getUserFriendlyMessage(errorMessage, userErrorType, blockchain);
  
  return {
    originalError: error,
    message: errorMessage,
    userMessage,
    category,
    blockchain,
    solution: options.solution,
    severity,
    userErrorType,
    errorCode: options.errorCode || generateErrorCode(userErrorType, blockchain, timestamp),
    recoverable: options.recoverable ?? true,
    timestamp,
    details: options.details
  };
}

/**
 * Generate a unique error code for tracking
 */
function generateErrorCode(
  userErrorType: UserErrorType,
  blockchain?: BlockchainType,
  timestamp?: number
): string {
  const prefix = userErrorType.substring(0, 3).toUpperCase();
  const chainCode = blockchain ? blockchain.substring(0, 3).toUpperCase() : 'UNK';
  const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timeComponent = timestamp ? (timestamp % 10000).toString().padStart(4, '0') : '0000';
  
  return `${prefix}-${chainCode}-${randomId}-${timeComponent}`;
}

/**
 * Get user-friendly error message based on error type
 */
function getUserFriendlyMessage(
  errorMessage: string,
  userErrorType: UserErrorType,
  blockchain?: BlockchainType
): string {
  // Chain name for message formatting
  const chainName = blockchain || 'blockchain';
  
  switch (userErrorType) {
    case UserErrorType.NETWORK:
      if (errorMessage.includes('timeout')) {
        return `Connection to ${chainName} timed out. The network may be congested or temporarily unavailable.`;
      }
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        return `Too many requests to ${chainName}. Please wait a moment before trying again.`;
      }
      return `Network connection issue with ${chainName}. Please check your internet connection.`;
      
    case UserErrorType.AUTHENTICATION:
      return `Authentication failed. Please verify your wallet is properly connected.`;
      
    case UserErrorType.TRANSACTION:
      if (errorMessage.includes('insufficient') || errorMessage.includes('enough')) {
        return `Insufficient funds in your ${chainName} wallet to complete this transaction.`;
      }
      if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        return `Transaction was rejected. You may have declined the transaction in your wallet.`;
      }
      if (errorMessage.includes('nonce')) {
        return `Transaction sequence error. Please try again.`;
      }
      if (errorMessage.includes('gas')) {
        return `Transaction fee calculation error. Network may be congested.`;
      }
      return `Transaction failed on ${chainName}. Please try again or check transaction details.`;
      
    case UserErrorType.VALIDATION:
      if (errorMessage.includes('address')) {
        return `Invalid address format for ${chainName}. Please check the address and try again.`;
      }
      return `Validation error: The information provided doesn't meet ${chainName} requirements.`;
      
    case UserErrorType.SECURITY:
      return `Security protection activated. This transaction was blocked for your safety.`;
      
    case UserErrorType.RECOVERY:
      return `Cross-chain verification is taking longer than expected. Your transaction is safe and will complete soon.`;
      
    default:
      return `An unexpected error occurred with ${chainName}. Our team has been notified.`;
  }
}

/**
 * Display error toast notification
 */
export function showErrorToast(handledError: HandledError) {
  const { userMessage, severity, errorCode, solution } = handledError;
  
  let title = 'Error';
  switch (severity) {
    case ErrorSeverity.INFO:
      title = 'Information';
      break;
    case ErrorSeverity.WARNING:
      title = 'Warning';
      break;
    case ErrorSeverity.ERROR:
      title = 'Error';
      break;
    case ErrorSeverity.CRITICAL:
      title = 'Critical Error';
      break;
  }
  
  toast({
    title: `${title} ${errorCode ? `(${errorCode})` : ''}`,
    description: solution ? `${userMessage} ${solution}` : userMessage,
    variant: severity === ErrorSeverity.INFO ? 'default' : 'destructive',
  });
  
  // For critical errors, we can also log to our error monitoring service
  if (severity === ErrorSeverity.CRITICAL) {
    // In production, would send to error monitoring service
    console.error('CRITICAL ERROR:', handledError);
  }
  
  return handledError;
}

// The main exported error handler function
export function handleError(
  error: any,
  options: {
    blockchain?: BlockchainType;
    category?: CrossChainErrorCategory;
    recoverable?: boolean;
    solution?: string;
    details?: any;
    showToast?: boolean;
  } = {}
): HandledError {
  const { blockchain, category, showToast = true, ...rest } = options;
  
  // Process the error
  const handledError = processBlockchainError(error, blockchain, category, rest);
  
  // Show toast notification if requested
  if (showToast) {
    showErrorToast(handledError);
  }
  
  return handledError;
}