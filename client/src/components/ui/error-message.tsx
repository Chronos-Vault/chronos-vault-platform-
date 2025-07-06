import React from 'react';
import { AlertCircle, Zap, Shield, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export enum CrossChainErrorCategory {
  TRANSACTION_FAILURE = 'transaction_failure',
  NETWORK_FAILURE = 'network_failure',
  SECURITY_VIOLATION = 'security_violation',
  VALIDATION_FAILURE = 'validation_failure',
  CONNECTION_FAILURE = 'connection_failure',
  RECOVERY_FAILURE = 'recovery_failure',
  UNKNOWN = 'unknown'
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  category?: CrossChainErrorCategory;
  onRetry?: () => void;
  className?: string;
}

/**
 * Reusable error message component for cross-chain errors
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  category = CrossChainErrorCategory.TRANSACTION_FAILURE,
  onRetry,
  className = ''
}) => {
  const getErrorIcon = () => {
    switch (category) {
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return <Shield className="h-4 w-4" />;
      case CrossChainErrorCategory.NETWORK_FAILURE:
      case CrossChainErrorCategory.CONNECTION_FAILURE:
        return <WifiOff className="h-4 w-4" />;
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSeverityStyles = () => {
    switch (category) {
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return 'bg-red-500/10 border-red-500 text-red-500';
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return 'bg-amber-500/10 border-amber-500 text-amber-500';
      case CrossChainErrorCategory.NETWORK_FAILURE:
      case CrossChainErrorCategory.CONNECTION_FAILURE:
        return 'bg-blue-500/10 border-blue-500 text-blue-500';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-400';
    }
  };

  return (
    <Alert className={`${getSeverityStyles()} ${className}`}>
      {getErrorIcon()}
      <AlertTitle>{title || 'Error Occurred'}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onRetry && (
        <div className="mt-2">
          <button
            onClick={onRetry}
            className="text-xs underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}
    </Alert>
  );
};