import { toast } from '@/hooks/use-toast';
import { CrossChainErrorCategory } from '@/components/ui/error-message';

export type BlockchainType = 'Ethereum' | 'Solana' | 'TON' | 'Bitcoin' | 'Cross-Chain';

// Define error interface
export interface HandleErrorResult {
  userMessage: string;
  technicalMessage: string;
  category: CrossChainErrorCategory;
  solution?: string;
  details?: any;
}

/**
 * Identifies and categorizes blockchain errors
 */
export function categorizeBlockchainError(error: any, blockchain?: BlockchainType): CrossChainErrorCategory {
  const errorString = error.toString().toLowerCase();

  // Security violations
  if (
    errorString.includes('suspicious') ||
    errorString.includes('unauthorized') ||
    errorString.includes('forbidden') ||
    errorString.includes('invalid signature') ||
    errorString.includes('auth') ||
    errorString.includes('permission')
  ) {
    return CrossChainErrorCategory.SECURITY_VIOLATION;
  }

  // Network failures
  if (
    errorString.includes('network') ||
    errorString.includes('connection') ||
    errorString.includes('timeout') ||
    errorString.includes('unreachable') ||
    errorString.includes('no response') ||
    errorString.includes('offline')
  ) {
    return CrossChainErrorCategory.NETWORK_FAILURE;
  }

  // Validation failures
  if (
    errorString.includes('invalid') ||
    errorString.includes('validation') ||
    errorString.includes('format') ||
    errorString.includes('parameter') ||
    errorString.includes('argument')
  ) {
    return CrossChainErrorCategory.VALIDATION_FAILURE;
  }

  // Default to transaction failure
  return CrossChainErrorCategory.TRANSACTION_FAILURE;
}

/**
 * Maps blockchain specific error codes to user-friendly messages
 */
function getBlockchainSpecificMessage(error: any, blockchain?: BlockchainType): string {
  // Default message
  let message = 'An error occurred while processing your transaction.';
  
  if (!blockchain) {
    return message;
  }

  const errorString = error.toString().toLowerCase();
  
  switch (blockchain) {
    case 'Ethereum':
      if (errorString.includes('gas')) {
        return 'Not enough ETH to cover gas fees for this transaction.';
      } else if (errorString.includes('nonce')) {
        return 'Transaction nonce issue. You may have another pending transaction.';
      } else if (errorString.includes('rejected')) {
        return 'Transaction was rejected by the Ethereum network.';
      }
      break;
      
    case 'Solana':
      if (errorString.includes('blockhash')) {
        return 'Transaction blockhash expired. Please try again.';
      } else if (errorString.includes('lamport')) {
        return 'Not enough SOL to complete this transaction.';
      } else if (errorString.includes('slot')) {
        return 'Solana network is experiencing high load. Please try again later.';
      }
      break;
      
    case 'TON':
      if (errorString.includes('seqno')) {
        return 'TON transaction sequence number is outdated. Please refresh and try again.';
      } else if (errorString.includes('funds')) {
        return 'Not enough TON to complete this transaction.';
      } else if (errorString.includes('expired')) {
        return 'TON message expired. Please try again.';
      }
      break;
      
    case 'Bitcoin':
      if (errorString.includes('fee')) {
        return 'Bitcoin transaction fee is too low.';
      } else if (errorString.includes('utxo')) {
        return 'Issue with Bitcoin UTXO selection. Try splitting your transaction.';
      }
      break;
      
    case 'Cross-Chain':
      if (errorString.includes('bridge')) {
        return 'Issue with cross-chain bridge. The operation could not be completed.';
      } else if (errorString.includes('liquidity')) {
        return 'Insufficient liquidity in the cross-chain pool.';
      }
      break;
  }
  
  return message;
}

/**
 * Provides recovery solutions for different error categories
 */
function getSolutionByCategory(category: CrossChainErrorCategory, blockchain?: BlockchainType): string {
  switch (category) {
    case CrossChainErrorCategory.SECURITY_VIOLATION:
      return 'Verify your wallet connection and permissions. If this continues, contact support immediately.';
      
    case CrossChainErrorCategory.NETWORK_FAILURE:
      return 'Check your internet connection and try again. The blockchain network may be experiencing congestion.';
      
    case CrossChainErrorCategory.VALIDATION_FAILURE:
      return 'Double-check all transaction details and try again with valid parameters.';
      
    case CrossChainErrorCategory.TRANSACTION_FAILURE:
      if (blockchain === 'Ethereum') {
        return 'Try adjusting the gas price or waiting for network congestion to decrease.';
      } else if (blockchain === 'Solana') {
        return 'Try again when the Solana network is less congested.';
      } else if (blockchain === 'TON') {
        return 'Refresh your wallet state and try again.';
      } else if (blockchain === 'Bitcoin') {
        return 'Consider increasing the transaction fee or splitting your transaction.';
      }
      return 'Try the operation again or consider adjusting transaction parameters.';
      
    case CrossChainErrorCategory.CONNECTION_FAILURE:
      return 'Reconnect your wallet and try again. Make sure your blockchain node is online.';
      
    default:
      return 'Please try again later or contact support if the issue persists.';
  }
}

/**
 * Main error handler function for blockchain errors
 */
export function handleError(
  error: any,
  options?: {
    blockchain?: BlockchainType;
    category?: CrossChainErrorCategory;
    solution?: string;
    details?: any;
    showToast?: boolean;
  }
): HandleErrorResult {
  // Get error message
  const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
  
  // Determine error category
  const category = options?.category || categorizeBlockchainError(error, options?.blockchain);
  
  // Get user-friendly message
  const userMessage = getBlockchainSpecificMessage(error, options?.blockchain) || errorMessage;
  
  // Get solution
  const solution = options?.solution || getSolutionByCategory(category, options?.blockchain);
  
  // Show toast notification if requested
  if (options?.showToast) {
    toast({
      title: `${options?.blockchain || 'Transaction'} Error`,
      description: userMessage,
      variant: 'destructive',
    });
  }
  
  // Return structured error information
  return {
    userMessage,
    technicalMessage: errorMessage,
    category,
    solution,
    details: {
      ...options?.details,
      originalError: error,
      timestamp: new Date().toISOString(),
    },
  };
}