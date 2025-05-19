import React, { useState, useEffect } from 'react';
import { ErrorMessage } from '../ui/error-message';
import { handleError } from '../../lib/error-handling/error-handler';
import { CrossChainErrorCategory } from '../ui/error-message';

interface TransactionErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class TransactionErrorBoundary extends React.Component<
  TransactionErrorBoundaryProps,
  ErrorState
> {
  constructor(props: TransactionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
    
    // Process the error through our error handler
    handleError(error, {
      category: CrossChainErrorCategory.UNKNOWN,
      solution: "Please try refreshing the page or contact support if the issue persists.",
      details: {
        component: 'TransactionMonitor',
        errorInfo: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      // Render error message component
      return (
        <div className="p-6 max-w-4xl mx-auto">
          <ErrorMessage
            title="Transaction Monitor Error"
            message={this.state.error?.message || "An unexpected error occurred in the Transaction Monitor"}
            category={CrossChainErrorCategory.UNKNOWN}
            solution="Please try refreshing the page or contact support if the issue persists."
            retry={() => window.location.reload()}
            viewDetails={true}
            details={this.state.errorInfo?.componentStack || "No additional details available"}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for functional components
export function withTransactionErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => (
    <TransactionErrorBoundary>
      <Component {...props} />
    </TransactionErrorBoundary>
  );
}

// React Hook for handling async errors in functional components
export function useTransactionErrorHandler() {
  const [error, setError] = useState<{
    message: string;
    category?: CrossChainErrorCategory;
    details?: any;
  } | null>(null);

  const handleAsyncError = (
    err: any,
    category: CrossChainErrorCategory = CrossChainErrorCategory.UNKNOWN,
    details?: any
  ) => {
    const errorObj = handleError(err, {
      category,
      details,
      showToast: true,
    });

    setError({
      message: errorObj.userMessage,
      category: errorObj.category,
      details,
    });

    return errorObj;
  };

  const clearError = () => setError(null);

  // Component to display the error
  const ErrorDisplay = error ? (
    <ErrorMessage
      title="Transaction Error"
      message={error.message}
      category={error.category}
      retry={clearError}
      viewDetails={!!error.details}
      details={error.details}
    />
  ) : null;

  return {
    error,
    handleAsyncError,
    clearError,
    ErrorDisplay,
  };
}