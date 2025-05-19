import React, { ErrorInfo } from 'react';
import { ErrorMessage } from '@/components/ui/error-message';
import { handleError } from '@/lib/error-handling/error-handler';
import { CrossChainErrorCategory } from '@/components/ui/error-message';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
    
    // Process the error through our error handler
    handleError(error, {
      category: CrossChainErrorCategory.UNKNOWN,
      details: {
        component: this.props.name || 'Unknown Component',
        errorInfo: errorInfo.componentStack,
      },
      showToast: true,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-4 max-w-4xl mx-auto">
          <ErrorMessage
            title="Something went wrong"
            message={this.state.error?.message || "An unexpected error occurred"}
            category={CrossChainErrorCategory.UNKNOWN}
            solution="Please try refreshing the page or contact support if the issue persists."
            retry={() => window.location.reload()}
            viewDetails={!!this.state.errorInfo}
            details={this.state.errorInfo?.componentStack || "No additional details available"}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easy wrapping of components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  name?: string,
  fallback?: React.ReactNode
): React.FC<P> {
  const displayName = name || Component.displayName || Component.name || 'Component';
  
  const WrappedComponent: React.FC<P> = (props: P) => (
    <ErrorBoundary name={displayName} fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
}