import React from 'react';
import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TransactionErrorProvider } from '@/contexts/transaction-error-context';
import { CVTTokenProvider } from '@/contexts/cvt-token-context';
import { AuthProvider } from '@/contexts/auth-context';
import { MultiChainProvider } from '@/contexts/multi-chain-context';
import { NavBar } from '@/components/navigation/NavBar';
import Footer from '@/components/layout/footer';

// Main Pages
import HomePage from '@/pages/home';
import MyVaultsPage from '@/pages/my-vaults';
import AboutPage from '@/pages/about';
import FaqPage from '@/pages/faq';
import TeamPage from '@/pages/team';
import WhitepaperPage from '@/pages/whitepaper';
import CvtTokenomicsPage from '@/pages/cvt-tokenomics';
import CvtUtilityPage from '@/pages/cvt-utility-new';
import TermsOfServicePage from '@/pages/terms-of-service';
import CookiePolicyPage from '@/pages/cookie-policy';
import DocumentationPage from '@/pages/documentation';
import VaultSchoolPage from '@/pages/vault-school';
import RoadmapPage from '@/pages/roadmap';
import SmartContractsPage from '@/pages/smart-contracts';
import TechnicalSpecPage from '@/pages/technical-spec';

// Vault Type Pages
import VaultTypesPage from '@/pages/vault-types';
import VaultTypesSelector from '@/pages/vault-types-selector';
import VaultShowcase from '@/pages/stunning-vault-showcase';

// Creation Pages
import CreateVaultPage from '@/pages/create-vault';
import CreateVaultEnhancedPage from '@/pages/create-vault-enhanced';
import SpecializedVaultCreationPage from '@/pages/specialized-vault-creation';
import CreateTonVaultPage from '@/pages/create-ton-vault';

// Monitoring Pages
import TransactionMonitorPage from '@/pages/transaction-monitor';
import CrossChainMonitorPage from '@/pages/cross-chain-monitor';
import CrossChainFeesPage from '@/pages/cross-chain-fee-monitor';
import VaultExplorerPage from '@/pages/vault-explorer';
import DeviceManagementPage from '@/pages/device-management';
import DeviceRecoveryPage from '@/pages/device-recovery';

// Security & Verification Pages
import TonSecurityPage from '@/pages/ton-security';
import CrossChainSecurityPage from '@/pages/cross-chain-security';
import SecurityVerificationPage from '@/pages/security-verification';
import SecurityVerificationDemoPage from '@/pages/security-verification-demo';
import BehavioralAuthenticationPage from '@/pages/behavioral-authentication';
import ZeroKnowledgeVerificationPage from '@/pages/zero-knowledge-verification-page';
import ZkPrivacyDemoPage from '@/pages/zk-privacy-demo';
import TripleChainSecurityDemoPage from '@/pages/triple-chain-security-demo';

// Integration Pages
import EthereumIntegrationPage from '@/pages/ethereum-integration';
import SolanaIntegrationPage from '@/pages/solana-integration';
import TonIntegrationPage from '@/pages/ton-integration';
import ConnectTonPage from '@/pages/connect-ton';

// Vault Pages - Basic
import TimeLockVaultPage from '@/pages/time-lock-vault';
import MultiSignatureVaultPage from '@/pages/multi-signature-vault';
import GeoLocationVaultPage from '@/pages/geo-location-vault';
import BiometricVaultPage from '@/pages/biometric-vault';
import SmartContractVaultPage from '@/pages/smart-contract-vault';

// Vault Pages - Advanced
import CrossChainVaultPage from '@/pages/cross-chain-vault';
import CrossChainFragmentVaultPage from '@/pages/cross-chain-fragment-vault';
import QuantumResistantVaultPage from '@/pages/quantum-resistant-vault';
import SovereignFortressVaultPage from '@/pages/sovereign-fortress-vault';
import NFTPoweredVaultPage from '@/pages/nft-powered-vault';
import UriqueSecurityVaultPage from '@/pages/unique-security-vault';
import EnhancedBiometricVaultPage from '@/pages/enhanced-biometric-vault';
import EnhancedSmartContractVaultPage from '@/pages/enhanced-smart-contract-vault';

// Vault Pages - Specialized
import AiAssistedInvestmentVaultPage from '@/pages/ai-assisted-investment-vault';
import IntentInheritanceVaultPage from '@/pages/intent-inheritance-vault';
// Using direct import of component
import TimeLockedMemoryVault from '@/pages/time-locked-memory-vault';
const TimeLockedMemoryVaultPage = TimeLockedMemoryVault;
import InvestmentDisciplineVaultPage from '@/pages/investment-discipline-vault';
import DynamicVaultFormPage from '@/pages/dynamic-vault-form';
import FamilyHeritageVaultFormPage from '@/pages/family-heritage-vault-form';
import BitcoinHalvingVaultPage from '@/pages/bitcoin-halving-vault';

// Cross-Chain Features
import CrossChainBridgePage from '@/pages/cross-chain-bridge';
import CrossChainAtomicSwapPage from '@/pages/cross-chain-atomic-swap';
import TonWalletCrossChainBridgePage from '@/pages/ton-wallet-cross-chain-bridge';
import CrossChainVsAtomicSwapPage from '@/pages/cross-chain-vs-atomic-swap';
import BridgeVsSwapPage from '@/pages/bridge-vs-swap';
import SecurityDashboardPage from '@/pages/security-dashboard';
import TripleChainSecurityDashboardPage from '@/pages/security-dashboard-page';
import BitcoinHalvingPage from '@/pages/bitcoin-halving';
import SecurityTutorialsVideo from '@/pages/security-tutorials-video';
import SecurityTutorials from '@/pages/security-tutorials';
import MilitaryGradeSecurity from '@/pages/military-grade-security';

// Token & Payment Pages
import CvtStakingPage from '@/pages/cvt-staking';
import CvtTokenPage from '@/pages/cvt-token';
import CvtPaymentPage from '@/pages/cvt-payment';
import SubscriptionPage from '@/pages/subscription';

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
          <AuthProvider>
            <MultiChainProvider>
              <CVTTokenProvider>
                <div className="min-h-screen bg-black text-white">
                  <NavBar />
                  <div className="pt-2">
                    <Switch>
                      {/* Main Pages */}
                      <Route path="/" component={HomePage} />
                      <Route path="/my-vaults" component={MyVaultsPage} />
                      <Route path="/about" component={AboutPage} />
                      <Route path="/faq" component={FaqPage} />
                      <Route path="/team" component={TeamPage} />
                      <Route path="/whitepaper" component={WhitepaperPage} />
                      <Route path="/documentation" component={DocumentationPage} />
                      <Route path="/vault-school" component={VaultSchoolPage} />
                      <Route path="/terms-of-service" component={TermsOfServicePage} />
                      <Route path="/cookie-policy" component={CookiePolicyPage} />
                      
                      {/* Vault Selection & Showcase */}
                      <Route path="/vault-types" component={VaultTypesPage} />
                      <Route path="/vault-selector" component={VaultTypesSelector} />
                      <Route path="/vault-showcase" component={VaultShowcase} />
                      
                      {/* Vault Creation */}
                      <Route path="/create-vault" component={CreateVaultPage} />
                      <Route path="/create-vault-enhanced" component={CreateVaultEnhancedPage} />
                      <Route path="/specialized-vault-creation" component={SpecializedVaultCreationPage} />
                      <Route path="/create-ton-vault" component={CreateTonVaultPage} />
                      
                      {/* Monitoring & Management */}
                      <Route path="/transaction-monitor" component={TransactionMonitorPage} />
                      <Route path="/transaction-verification" component={SecurityVerificationPage} />
                      <Route path="/cross-chain-monitor" component={CrossChainMonitorPage} />
                      <Route path="/cross-chain-fee-monitor" component={CrossChainFeesPage} />
                      <Route path="/vault-explorer" component={VaultExplorerPage} />
                      <Route path="/device-management" component={DeviceManagementPage} />
                      <Route path="/device-recovery" component={DeviceRecoveryPage} />
                      
                      {/* Security Pages */}
                      <Route path="/security-dashboard" component={TripleChainSecurityDashboardPage} />
                      <Route path="/ton-security" component={TonSecurityPage} />
                      <Route path="/cross-chain-security" component={CrossChainSecurityPage} />
                      <Route path="/security-verification" component={SecurityVerificationPage} />
                      <Route path="/security-verification-demo" component={SecurityVerificationDemoPage} />
                      <Route path="/behavioral-authentication" component={BehavioralAuthenticationPage} />
                      <Route path="/behavioral-auth" component={BehavioralAuthenticationPage} />
                      <Route path="/quantum-resistant" component={QuantumResistantVaultPage} />
                      <Route path="/zero-knowledge-verification" component={ZeroKnowledgeVerificationPage} />
                      <Route path="/zk-privacy-demo" component={ZkPrivacyDemoPage} />
                      <Route path="/triple-chain-security-demo" component={TripleChainSecurityDemoPage} />
                      <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
                      
                      {/* Blockchain Integration */}
                      <Route path="/ethereum-integration" component={EthereumIntegrationPage} />
                      <Route path="/solana-integration" component={SolanaIntegrationPage} />
                      <Route path="/ton-integration" component={TonIntegrationPage} />
                      <Route path="/connect-ton" component={ConnectTonPage} />
                      
                      {/* Basic Vault Types */}
                      <Route path="/time-lock-vault" component={TimeLockVaultPage} />
                      <Route path="/multi-signature-vault" component={MultiSignatureVaultPage} />
                      <Route path="/geo-location-vault" component={GeoLocationVaultPage} />
                      <Route path="/biometric-vault" component={BiometricVaultPage} />
                      <Route path="/smart-contract-vault" component={SmartContractVaultPage} />
                      
                      {/* Advanced Vault Types */}
                      <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
                      <Route path="/cross-chain-fragment-vault" component={CrossChainFragmentVaultPage} />
                      <Route path="/quantum-resistant-vault" component={QuantumResistantVaultPage} />
                      <Route path="/vault-school-hub" component={VaultSchoolPage} />
                      <Route path="/sovereign-fortress-vault" component={SovereignFortressVaultPage} />
                      <Route path="/nft-powered-vault" component={NFTPoweredVaultPage} />
                      <Route path="/unique-security-vault" component={UriqueSecurityVaultPage} />
                      <Route path="/enhanced-biometric-vault" component={EnhancedBiometricVaultPage} />
                      <Route path="/enhanced-smart-contract-vault" component={EnhancedSmartContractVaultPage} />
                      
                      {/* Specialized Vault Types */}
                      <Route path="/ai-assisted-investment-vault" component={AiAssistedInvestmentVaultPage} />
                      <Route path="/intent-inheritance-vault" component={IntentInheritanceVaultPage} />
                      <Route path="/time-locked-memory-vault" component={TimeLockedMemoryVaultPage} />
                      <Route path="/investment-discipline-vault" component={InvestmentDisciplineVaultPage} />
                      <Route path="/dynamic-vault-form" component={DynamicVaultFormPage} />
                      <Route path="/family-heritage-vault-form" component={FamilyHeritageVaultFormPage} />
                      <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVaultPage} />
                      
                      {/* Cross-Chain Features */}
                      <Route path="/cross-chain-operations" component={CrossChainMonitorPage} />
                      <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
                      <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwapPage} />
                      <Route path="/ton-wallet-cross-chain-bridge" component={TonWalletCrossChainBridgePage} />
                      <Route path="/bridge-vs-swap" component={BridgeVsSwapPage} />
                      <Route path="/atomic-swaps" component={CrossChainAtomicSwapPage} />
                      
                      {/* Token & Payment */}
                      <Route path="/cvt-tokenomics" component={CvtTokenomicsPage} />
                      <Route path="/cvt-utility" component={CvtUtilityPage} />
                      <Route path="/cvt-token" component={CvtTokenPage} />
                      <Route path="/cvt-staking" component={CvtStakingPage} />
                      <Route path="/cvt-payment" component={CvtPaymentPage} />
                      <Route path="/subscription" component={SubscriptionPage} />
                      <Route path="/token-vaults" component={CvtTokenPage} />
                      <Route path="/gift-crypto" component={CvtPaymentPage} />
                      
                      {/* Documentation Pages */}
                      <Route path="/docs" component={DocumentationPage} />
                      <Route path="/roadmap" component={RoadmapPage} />
                      <Route path="/smart-contracts" component={SmartContractsPage} />
                      <Route path="/technical-spec" component={TechnicalSpecPage} />
                      <Route path="/tokenomics" component={CvtTokenomicsPage} />
                      <Route path="/technical-security-docs" component={DocumentationPage} />
                      <Route path="/security-video-guides" component={SecurityTutorialsVideo} />
                      <Route path="/security-tutorials" component={SecurityTutorials} />
                      <Route path="/military-grade-security" component={MilitaryGradeSecurity} />
                    </Switch>
                    
                    <Footer />
                  </div>
                  <Toaster />
                </div>
              </CVTTokenProvider>
            </MultiChainProvider>
          </AuthProvider>
        </TransactionErrorProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;