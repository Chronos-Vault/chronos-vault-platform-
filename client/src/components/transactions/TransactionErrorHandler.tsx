import React from 'react';
import { TransactionErrorAlert } from './TransactionErrorAlert';
import { useTransactionError } from '@/contexts/transaction-error-context';
import { Card } from '@/components/ui/card';

interface TransactionErrorHandlerProps {
  position?: 'top' | 'bottom';
  className?: string;
}

/**
 * Component that displays transaction errors from the context
 * Can be placed anywhere in the application
 */
export const TransactionErrorHandler: React.FC<TransactionErrorHandlerProps> = ({ 
  position = 'top',
  className = ''
}) => {
  const { error, isRecovering, recoverTransaction, clearError } = useTransactionError();

  if (!error) return null;

  // Prepare the retry function if the error has recovery details
  const handleRetry = error.details?.recoveryFunction 
    ? () => recoverTransaction(error.details.recoveryFunction)
    : undefined;

  // Prepare the view details function if the error has detailed information
  const handleViewDetails = error.details 
    ? () => {
        // Show details in console for debugging
        console.info('Transaction Error Details:', error.details);
        
        // Could open a modal with error details in the future
        alert('Detailed error information has been logged to the console');
      }
    : undefined;

  return (
    <div className={`w-full ${position === 'top' ? 'mb-6' : 'mt-6'} ${className}`}>
      <Card className="border-none shadow-lg overflow-hidden">
        <TransactionErrorAlert
          error={{
            message: error.message,
            category: error.category,
            txHash: error.txHash
          }}
          blockchain={error.blockchain}
          isRecovering={isRecovering}
          onRetry={handleRetry}
          onViewDetails={error.details ? handleViewDetails : undefined}
        />
      </Card>
    </div>
  );
};