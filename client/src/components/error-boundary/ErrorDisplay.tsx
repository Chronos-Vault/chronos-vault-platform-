import React from 'react';
import { ErrorMessage } from '@/components/ui/error-message';
import { CrossChainErrorCategory } from '@/components/ui/error-message';

interface ErrorDisplayProps {
  error: {
    message: string;
    category?: CrossChainErrorCategory;
    solution?: string;
    retry?: () => void;
    details?: any;
  } | null;
  className?: string;
}

/**
 * A reusable component for displaying errors from the useErrorHandler hook
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <div className={className}>
      <ErrorMessage
        title="Error Occurred"
        message={error.message}
        category={error.category}
        solution={error.solution}
        retry={error.retry}
        viewDetails={!!error.details}
        details={error.details}
      />
    </div>
  );
};