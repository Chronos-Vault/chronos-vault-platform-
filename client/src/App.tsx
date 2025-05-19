import React from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TransactionErrorProvider } from '@/contexts/transaction-error-context';
import { NavBar } from '@/components/navigation/NavBar';

// Pages
import TransactionMonitorPage from '@/pages/transaction-monitor';
import TonSecurityDemoPage from '@/pages/ton-security-demo';
// Import other pages as needed

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary name="App">
      <QueryClientProvider client={queryClient}>
        <TransactionErrorProvider>
          <div className="min-h-screen bg-black text-white">
            <NavBar />
            <div className="pt-2">
              <Switch>
                <Route path="/" component={TransactionMonitorPage} />
                <Route path="/ton-security" component={TonSecurityDemoPage} />
                {/* Add other routes as needed */}
              </Switch>
            </div>
          </div>
          <Toaster />
        </TransactionErrorProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;