import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorMessage, CrossChainErrorCategory } from '@/components/ui/error-message';

interface Props {
  children: ReactNode;
  name?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error caught by ${this.props.name || 'ErrorBoundary'}:`, error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, name } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallback) {
        return fallback;
      }

      return (
        <div className="p-4 border rounded-md shadow-sm my-4 bg-black/40">
          <h2 className="text-red-500 font-bold mb-2">
            An error occurred in {name || 'the application'}
          </h2>
          <ErrorMessage
            title="Unexpected Error"
            message={error?.message || 'An unknown error occurred'}
            category={CrossChainErrorCategory.TRANSACTION_FAILURE}
            onRetry={this.resetError}
          />
          <div className="mt-4">
            <button
              onClick={this.resetError}
              className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-md text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}