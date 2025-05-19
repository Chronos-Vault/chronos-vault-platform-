import { toast } from '@/hooks/use-toast';
import { CrossChainErrorCategory } from '@/components/ui/error-message';

export type BlockchainType = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin';

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
  switch (category) {
    case CrossChainErrorCategory.CONNECTION_FAILURE:
    case CrossChainErrorCategory.NETWORK_FAILURE:
    case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
    case CrossChainErrorCategory.NODE_SYNCING:
    case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
      return UserErrorType.NETWORK;
    
    case CrossChainErrorCategory.TRANSACTION_FAILURE:
    case CrossChainErrorCategory.VALIDATION_FAILURE:
    case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
    case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
      return UserErrorType.TRANSACTION;
      
    case CrossChainErrorCategory.SECURITY_VIOLATION:
      return UserErrorType.SECURITY;
      
    default:
      return UserErrorType.UNKNOWN;
  }
}

/**
 * Map error categories to severity levels
 */
function mapCategoryToSeverity(category?: CrossChainErrorCategory): ErrorSeverity {
  switch (category) {
    case CrossChainErrorCategory.SECURITY_VIOLATION:
      return ErrorSeverity.CRITICAL;
      
    case CrossChainErrorCategory.TRANSACTION_FAILURE:
    case CrossChainErrorCategory.VALIDATION_FAILURE:
    case CrossChainErrorCategory.CONNECTION_FAILURE:
    case CrossChainErrorCategory.NETWORK_FAILURE:
      return ErrorSeverity.ERROR;
      
    case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
    case CrossChainErrorCategory.NODE_SYNCING:
    case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
    case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
    case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
      return ErrorSeverity.WARNING;
      
    default:
      return ErrorSeverity.INFO;
  }
}

/**
 * Process blockchain error into a user-friendly format
 */
export function processBlockchainError(
  error: any,
  blockchain?: BlockchainType,
  category?: CrossChainErrorCategory,
  solution?: string,
  details?: any
): HandledError {
  const userErrorType = mapCategoryToUserType(category);
  const severity = mapCategoryToSeverity(category);
  
  // Get error message from the error object
  const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';
  
  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(errorMessage, userErrorType, blockchain);
  
  // Generate a unique error code for tracking
  const errorCode = generateErrorCode(userErrorType, blockchain, category);
  
  // Determine if error is recoverable
  const recoverable = [
    CrossChainErrorCategory.CONNECTION_FAILURE,
    CrossChainErrorCategory.NETWORK_FAILURE,
    CrossChainErrorCategory.RATE_LIMIT_EXCEEDED,
    CrossChainErrorCategory.NODE_SYNCING,
    CrossChainErrorCategory.CHAIN_UNAVAILABLE
  ].includes(category as CrossChainErrorCategory);
  
  return {
    originalError: error,
    message: errorMessage,
    userMessage,
    category,
    blockchain,
    solution,
    severity,
    userErrorType,
    errorCode,
    recoverable,
    timestamp: Date.now(),
    details
  };
}

/**
 * Generate a unique error code for tracking
 */
function generateErrorCode(
  userErrorType: UserErrorType,
  blockchain?: BlockchainType,
  category?: CrossChainErrorCategory
): string {
  const typeCode = userErrorType.substring(0, 3).toUpperCase();
  const chainCode = blockchain ? blockchain.substring(0, 3).toUpperCase() : 'GEN';
  const categoryCode = category ? category.substring(0, 3).toUpperCase() : 'UNK';
  const timestamp = Date.now().toString().substring(7);
  
  return `${typeCode}-${chainCode}-${categoryCode}-${timestamp}`;
}

/**
 * Get user-friendly error message based on error type
 */
function getUserFriendlyMessage(
  errorMessage: string,
  userErrorType: UserErrorType,
  blockchain?: BlockchainType
): string {
  const chainName = blockchain || 'blockchain';
  
  switch (userErrorType) {
    case UserErrorType.NETWORK:
      return `Unable to connect to the ${chainName} network. This could be due to network congestion or temporary outage.`;
      
    case UserErrorType.TRANSACTION:
      return `Your transaction on ${chainName} couldn't be completed. This might be due to network issues or insufficient funds.`;
      
    case UserErrorType.SECURITY:
      return `A security concern was detected while interacting with ${chainName}. The operation was halted for your protection.`;
      
    case UserErrorType.VALIDATION:
      return `The information provided for this ${chainName} operation couldn't be validated. Please check your inputs.`;
      
    case UserErrorType.AUTHENTICATION:
      return `Authentication failed for ${chainName}. Please reconnect your wallet or verify your credentials.`;
      
    default:
      // For unknown errors, return a simplified version of the original message
      const simplifiedMessage = errorMessage
        .replace(/(\w{63}).*/, '$1...') // Truncate long strings like addresses or hashes
        .replace(/Error:/i, '')
        .trim();
      
      return `An unexpected error occurred${blockchain ? ` with ${blockchain}` : ''}: ${simplifiedMessage}`;
  }
}

/**
 * Display error toast notification
 */
export function showErrorToast(handledError: HandledError) {
  toast({
    title: handledError.userErrorType === UserErrorType.UNKNOWN 
      ? 'Error' 
      : `${handledError.userErrorType.charAt(0).toUpperCase() + handledError.userErrorType.slice(1)} Error`,
    description: handledError.userMessage,
    variant: 'destructive',
  });
}

export function handleError(
  error: any, 
  options?: {
    blockchain?: BlockchainType;
    category?: CrossChainErrorCategory;
    solution?: string;
    details?: any;
    showToast?: boolean;
  }
): HandledError {
  const { 
    blockchain, 
    category = CrossChainErrorCategory.UNKNOWN,
    solution,
    details,
    showToast = false
  } = options || {};
  
  // Process the error
  const handledError = processBlockchainError(
    error,
    blockchain,
    category,
    solution,
    details
  );
  
  // Log the error to console for debugging
  console.error(`[${handledError.errorCode}]`, handledError);
  
  // Show toast notification if requested
  if (showToast) {
    showErrorToast(handledError);
  }
  
  return handledError;
}