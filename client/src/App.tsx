import React from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TransactionErrorProvider } from '@/contexts/transaction-error-context';
import { NavBar } from '@/components/navigation/NavBar';

// Pages
import TransactionMonitorPage from '@/pages/transaction-monitor';
import VaultTypesPage from '@/pages/vault-types-new';
import VaultTypesSelector from '@/pages/vault-types-selector-new';
import VaultShowcase from '@/pages/stunning-vault-showcase';
import TimeLockVaultPage from '@/pages/time-lock-vault';
import HomePage from '@/pages/home';
import TonSecurityDemoPage from '@/pages/ton-security-demo';

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
                <Route path="/" component={HomePage} />
                <Route path="/transaction-monitor" component={TransactionMonitorPage} />
                <Route path="/vault-types" component={VaultTypesPage} />
                <Route path="/vault-selector" component={VaultTypesSelector} />
                <Route path="/vault-showcase" component={VaultShowcase} />
                <Route path="/time-lock-vault" component={TimeLockVaultPage} />
                <Route path="/ton-security" component={TonSecurityDemoPage} />
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