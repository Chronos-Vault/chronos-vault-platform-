import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';
import { CrossChainErrorCategory } from '@/components/ui/error-message';

interface TransactionErrorContextType {
  // Error states
  error: {
    message: string;
    category?: CrossChainErrorCategory;
    blockchain?: string;
    txHash?: string;
    details?: any;
  } | null;
  isRecovering: boolean;
  
  // Error handling methods
  setTransactionError: (error: {
    message: string;
    category?: CrossChainErrorCategory;
    blockchain?: string;
    txHash?: string;
    details?: any;
  } | null) => void;
  
  clearError: () => void;
  recoverTransaction: (recovery: () => Promise<void>) => Promise<boolean>;
  showErrorNotification: (message: string, options?: { title?: string; variant?: 'default' | 'destructive' }) => void;
}

const TransactionErrorContext = createContext<TransactionErrorContextType | undefined>(undefined);

export const TransactionErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<TransactionErrorContextType['error']>(null);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);

  const setTransactionError = useCallback((newError: TransactionErrorContextType['error']) => {
    setError(newError);
    
    // Optionally show a toast notification for critical errors
    if (newError?.category === CrossChainErrorCategory.SECURITY_VIOLATION) {
      toast({
        title: "Security Alert",
        description: newError.message,
        variant: "destructive",
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const recoverTransaction = useCallback(async (recovery: () => Promise<void>): Promise<boolean> => {
    if (!error) return true;
    
    setIsRecovering(true);
    try {
      await recovery();
      clearError();
      toast({
        title: "Recovery Successful",
        description: "The transaction has been successfully recovered.",
      });
      return true;
    } catch (err) {
      setTransactionError({
        message: "Recovery attempt failed. Please try a different recovery method.",
        category: CrossChainErrorCategory.TRANSACTION_FAILURE,
        blockchain: error.blockchain,
        details: { 
          originalError: err,
          recoveryAttempt: true
        }
      });
      return false;
    } finally {
      setIsRecovering(false);
    }
  }, [error, clearError, setTransactionError]);

  const showErrorNotification = useCallback((message: string, options?: { title?: string; variant?: 'default' | 'destructive' }) => {
    toast({
      title: options?.title || "Error",
      description: message,
      variant: options?.variant || "destructive",
    });
  }, []);

  return (
    <TransactionErrorContext.Provider
      value={{
        error,
        isRecovering,
        setTransactionError,
        clearError,
        recoverTransaction,
        showErrorNotification,
      }}
    >
      {children}
    </TransactionErrorContext.Provider>
  );
};

export const useTransactionError = (): TransactionErrorContextType => {
  const context = useContext(TransactionErrorContext);
  if (context === undefined) {
    throw new Error('useTransactionError must be used within a TransactionErrorProvider');
  }
  return context;
};