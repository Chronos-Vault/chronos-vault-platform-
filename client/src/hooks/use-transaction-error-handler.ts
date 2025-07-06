import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { handleError } from '@/lib/error-handling/error-handler';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { BlockchainType } from '@/lib/error-handling/error-handler';

/**
 * Custom hook for handling blockchain transaction errors
 * 
 * @param blockchain The blockchain type (Ethereum, Solana, TON, Bitcoin)
 * @returns Transaction error handling utilities
 */
export function useTransactionErrorHandler(blockchain?: BlockchainType) {
  const [transactionError, setTransactionError] = useState<{
    message: string;
    category?: CrossChainErrorCategory;
    txHash?: string;
    solution?: string;
    retry?: () => Promise<void>;
    details?: any;
  } | null>(null);

  const [isRecovering, setIsRecovering] = useState(false);

  /**
   * Handle transaction execution errors
   */
  const handleTransactionError = useCallback(
    (
      error: any,
      options?: {
        txHash?: string;
        operation?: string;
        category?: CrossChainErrorCategory;
        solution?: string;
        retry?: () => Promise<void>;
        details?: any;
        showToast?: boolean;
      }
    ) => {
      const handledError = handleError(error, {
        blockchain,
        category: options?.category || CrossChainErrorCategory.TRANSACTION_FAILURE,
        solution: options?.solution,
        details: {
          ...options?.details,
          txHash: options?.txHash,
          operation: options?.operation || 'transaction',
        },
        showToast: options?.showToast ?? true,
      });

      setTransactionError({
        message: handledError.userMessage,
        category: handledError.category,
        txHash: options?.txHash,
        solution: handledError.solution,
        retry: options?.retry,
        details: handledError.details,
      });

      return handledError;
    },
    [blockchain]
  );

  /**
   * Clear the transaction error
   */
  const clearTransactionError = useCallback(() => {
    setTransactionError(null);
  }, []);

  /**
   * Attempt to recover from a transaction error
   */
  const recoverFromError = useCallback(async () => {
    if (!transactionError || !transactionError.retry) {
      return;
    }

    setIsRecovering(true);
    try {
      await transactionError.retry();
      clearTransactionError();
      toast({
        title: "Recovery successful",
        description: "The transaction has been successfully recovered.",
        variant: "default",
      });
    } catch (error) {
      handleTransactionError(error, {
        category: CrossChainErrorCategory.RECOVERY_FAILURE,
        solution: "Please try a different recovery method or contact support.",
        showToast: true,
      });
    } finally {
      setIsRecovering(false);
    }
  }, [transactionError, handleTransactionError, clearTransactionError]);

  /**
   * Wrap a transaction function with error handling
   */
  const wrapTransaction = useCallback(
    <T extends any[], R>(
      txFunction: (...args: T) => Promise<R>,
      options?: {
        operation?: string;
        getTxHash?: (result: R) => string;
        category?: CrossChainErrorCategory;
        solution?: string;
        details?: any;
        showToast?: boolean;
      }
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          const result = await txFunction(...args);
          const txHash = options?.getTxHash ? options.getTxHash(result) : undefined;
          
          if (txHash) {
            toast({
              title: "Transaction submitted",
              description: `Your ${options?.operation || 'transaction'} has been submitted.`,
              variant: "default",
            });
          }
          
          return result;
        } catch (error) {
          handleTransactionError(error, {
            operation: options?.operation,
            category: options?.category,
            solution: options?.solution,
            details: options?.details,
            showToast: options?.showToast,
            retry: () => wrapTransaction(txFunction, options)(...args),
          });
          
          return null;
        }
      };
    },
    [handleTransactionError]
  );

  return {
    transactionError,
    isRecovering,
    handleTransactionError,
    clearTransactionError,
    recoverFromError,
    wrapTransaction,
  };
}