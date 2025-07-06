import { useState, useCallback } from 'react';
import { useTransactionError } from '@/contexts/transaction-error-context';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { handleError } from '@/lib/error-handling/error-handler';

/**
 * Custom hook for handling TON-specific transaction errors
 * 
 * This hook provides specialized error handling for TON blockchain operations,
 * including multi-signature validation and geolocation verification.
 */
export function useTonTransactionError() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { setTransactionError, clearError, recoverTransaction } = useTransactionError();

  /**
   * Handle TON-specific transaction errors
   */
  const handleTonError = useCallback((
    error: any, 
    options?: { 
      txHash?: string; 
      operation?: string;
      recoveryFunction?: () => Promise<void>;
    }
  ) => {
    // Get blockchain specific error handling
    const handledError = handleError(error, {
      blockchain: 'TON',
      showToast: true,
      details: {
        txHash: options?.txHash,
        operation: options?.operation || 'transaction',
      }
    });

    // Set the error in the context
    setTransactionError({
      message: handledError.userMessage,
      category: handledError.category,
      blockchain: 'TON',
      txHash: options?.txHash,
      details: {
        ...handledError.details,
        recoveryFunction: options?.recoveryFunction
      }
    });

    return handledError;
  }, [setTransactionError]);

  /**
   * Handle multi-signature verification errors
   */
  const handleMultiSigError = useCallback((
    error: any, 
    options?: { 
      txHash?: string; 
      operation?: string;
      requiredSignatures?: number;
      currentSignatures?: number;
      recoveryFunction?: () => Promise<void>;
    }
  ) => {
    const handledError = handleError(error, {
      blockchain: 'TON',
      category: CrossChainErrorCategory.VALIDATION_FAILURE,
      solution: 'Request the required number of signatures from authorized parties.',
      details: {
        txHash: options?.txHash,
        operation: options?.operation || 'multi-signature verification',
        requiredSignatures: options?.requiredSignatures,
        currentSignatures: options?.currentSignatures
      }
    });

    setTransactionError({
      message: `Multi-signature requirement not met: ${options?.currentSignatures || 0} of ${options?.requiredSignatures || 2} signatures received.`,
      category: CrossChainErrorCategory.VALIDATION_FAILURE,
      blockchain: 'TON',
      txHash: options?.txHash,
      details: {
        ...handledError.details,
        recoveryFunction: options?.recoveryFunction
      }
    });

    return handledError;
  }, [setTransactionError]);

  /**
   * Handle geolocation verification errors
   */
  const handleGeoLocationError = useCallback((
    error: any, 
    options?: { 
      txHash?: string; 
      operation?: string;
      requiredLocation?: string;
      actualLocation?: string;
      recoveryFunction?: () => Promise<void>;
    }
  ) => {
    const handledError = handleError(error, {
      blockchain: 'TON',
      category: CrossChainErrorCategory.SECURITY_VIOLATION,
      solution: 'Verify your location settings or try from an authorized location.',
      details: {
        txHash: options?.txHash,
        operation: options?.operation || 'geolocation verification',
        requiredLocation: options?.requiredLocation,
        actualLocation: options?.actualLocation
      }
    });

    setTransactionError({
      message: `Geolocation verification failed. You must be in ${options?.requiredLocation || 'an authorized location'} to complete this operation.`,
      category: CrossChainErrorCategory.SECURITY_VIOLATION,
      blockchain: 'TON',
      txHash: options?.txHash,
      details: {
        ...handledError.details,
        recoveryFunction: options?.recoveryFunction
      }
    });

    return handledError;
  }, [setTransactionError]);

  /**
   * Execute a TON transaction with error handling
   */
  const executeTonTransaction = useCallback(async <T>(
    transactionFn: () => Promise<T>,
    options?: {
      operation?: string;
      getTxHash?: (result: T) => string;
      onSuccess?: (result: T) => void;
    }
  ): Promise<T | null> => {
    try {
      setIsProcessing(true);
      clearError();
      
      const result = await transactionFn();
      
      // Get transaction hash if provided
      const txHash = options?.getTxHash ? options.getTxHash(result) : undefined;
      
      // Call success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      handleTonError(error, {
        operation: options?.operation || 'TON Transaction',
        recoveryFunction: async () => {
          await executeTonTransaction(transactionFn, options);
        }
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [clearError, handleTonError]);

  return {
    isProcessing,
    handleTonError,
    handleMultiSigError,
    handleGeoLocationError,
    executeTonTransaction,
    clearTonError: clearError,
    recoverTonTransaction: recoverTransaction
  };
}