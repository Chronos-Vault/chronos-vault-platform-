import React from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TransactionErrorProvider } from '@/contexts/transaction-error-context';
import { NavBar } from '@/components/navigation/NavBar';

// Pages
import HomePage from '@/pages/home';
import TransactionMonitorPage from '@/pages/transaction-monitor';
import VaultTypesPage from '@/pages/vault-types-new';
import VaultTypesSelector from '@/pages/vault-types-selector-new';
import VaultShowcase from '@/pages/stunning-vault-showcase';
import MyVaultsPage from '@/pages/my-vaults';
import VaultSchoolPage from '@/pages/vault-school';
import CrossChainMonitorPage from '@/pages/cross-chain-monitor';
import TonSecurityDemoPage from '@/pages/ton-security-demo';

// Vault Pages
import TimeLockVaultPage from '@/pages/time-lock-vault';
import MultiSignatureVaultPage from '@/pages/multi-signature-vault';
import GeoLocationVaultPage from '@/pages/geo-location-vault';
import BiometricVaultPage from '@/pages/biometric-vault';
import CrossChainVaultPage from '@/pages/cross-chain-vault';
import CrossChainFragmentVaultPage from '@/pages/cross-chain-fragment-vault';
import QuantumResistantVaultPage from '@/pages/quantum-resistant-vault';
import SovereignFortressVaultPage from '@/pages/sovereign-fortress-vault';
import NFTPoweredVaultPage from '@/pages/nft-powered-vault';
import AiAssistedInvestmentVaultPage from '@/pages/ai-assisted-investment-vault';
import IntentInheritanceVaultPage from '@/pages/intent-inheritance-vault';
import InvestmentDisciplineVaultPage from '@/pages/investment-discipline-vault';
import DynamicVaultFormPage from '@/pages/dynamic-vault-form';

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
                {/* Main Pages */}
                <Route path="/" component={HomePage} />
                <Route path="/my-vaults" component={MyVaultsPage} />
                <Route path="/vault-types" component={VaultTypesPage} />
                <Route path="/vault-selector" component={VaultTypesSelector} />
                <Route path="/vault-showcase" component={VaultShowcase} />
                <Route path="/vault-school" component={VaultSchoolPage} />
                
                {/* Monitoring & Security */}
                <Route path="/transaction-monitor" component={TransactionMonitorPage} />
                <Route path="/cross-chain-monitor" component={CrossChainMonitorPage} />
                <Route path="/ton-security" component={TonSecurityDemoPage} />
                
                {/* Basic Vault Types */}
                <Route path="/time-lock-vault" component={TimeLockVaultPage} />
                <Route path="/multi-signature-vault" component={MultiSignatureVaultPage} />
                <Route path="/geo-location-vault" component={GeoLocationVaultPage} />
                <Route path="/biometric-vault" component={BiometricVaultPage} />
                
                {/* Advanced Vault Types */}
                <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
                <Route path="/cross-chain-fragment-vault" component={CrossChainFragmentVaultPage} />
                <Route path="/quantum-resistant-vault" component={QuantumResistantVaultPage} />
                <Route path="/sovereign-fortress-vault" component={SovereignFortressVaultPage} />
                <Route path="/nft-powered-vault" component={NFTPoweredVaultPage} />
                
                {/* Specialized Vault Types */}
                <Route path="/ai-assisted-investment-vault" component={AiAssistedInvestmentVaultPage} />
                <Route path="/intent-inheritance-vault" component={IntentInheritanceVaultPage} />
                <Route path="/investment-discipline-vault" component={InvestmentDisciplineVaultPage} />
                <Route path="/dynamic-vault-form" component={DynamicVaultFormPage} />
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