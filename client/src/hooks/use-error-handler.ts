import { useState, useCallback } from 'react';
import { handleError } from '@/lib/error-handling/error-handler';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { BlockchainType } from '@/lib/error-handling/error-handler';

/**
 * Custom hook for handling blockchain errors in async operations
 * 
 * @param blockchain Optional blockchain type for contextual error handling
 * @returns Error handling utilities
 */
export function useErrorHandler(blockchain?: BlockchainType) {
  const [error, setError] = useState<{
    message: string;
    category?: CrossChainErrorCategory;
    solution?: string;
    retry?: () => void;
    details?: any;
  } | null>(null);

  /**
   * Handle async errors with appropriate context
   */
  const handleAsyncError = useCallback(
    async <T>(
      promise: Promise<T>,
      options?: {
        category?: CrossChainErrorCategory;
        solution?: string;
        retry?: () => void;
        details?: any;
        showToast?: boolean;
      }
    ): Promise<T | null> => {
      try {
        return await promise;
      } catch (err) {
        const handledError = handleError(err, {
          blockchain,
          category: options?.category || CrossChainErrorCategory.UNKNOWN,
          solution: options?.solution,
          details: options?.details,
          showToast: options?.showToast ?? true,
        });

        setError({
          message: handledError.userMessage,
          category: handledError.category,
          solution: handledError.solution,
          retry: options?.retry,
          details: handledError.details,
        });

        return null;
      }
    },
    [blockchain]
  );

  /**
   * Reset the error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Wrap a function with error handling
   */
  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      options?: {
        category?: CrossChainErrorCategory;
        solution?: string;
        details?: any;
        showToast?: boolean;
      }
    ) => {
      return async (...args: T): Promise<R | null> => {
        return handleAsyncError(fn(...args), {
          ...options,
          retry: () => withErrorHandling(fn, options)(...args),
        });
      };
    },
    [handleAsyncError]
  );

  return {
    error,
    handleAsyncError,
    clearError,
    withErrorHandling,
  };
}