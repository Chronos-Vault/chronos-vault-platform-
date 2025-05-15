import { Switch, Route, useLocation } from "wouter";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MultiChainProvider } from "@/contexts/multi-chain-context";
import { TonProvider } from "@/contexts/ton-context";
import { SolanaProvider } from "@/contexts/solana-context";
import { EthereumProvider } from "@/contexts/ethereum-context";
import { BitcoinProvider } from "@/contexts/bitcoin-context";
import { BitcoinWalletProvider } from "@/contexts/bitcoin-wallet-context";
import { CVTTokenProvider } from "@/contexts/cvt-token-context";
import { DevModeProvider } from "@/contexts/dev-mode-context";
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";
import { AuthProvider } from "@/contexts/auth-context";
import { TransactionMonitoringProvider } from "@/contexts/transaction-monitoring-context";
import { BlockchainProvider } from "@/hooks/use-blockchain";
import { OnboardingProvider } from "@/contexts/onboarding-context";
import { OnboardingRedirect } from "@/components/OnboardingRedirect";
import Layout from "@/components/layout/Layout";

// Pages
import Home from "@/pages/home-modern";
import OnboardingPage from "@/pages/onboarding-page";
import CreateVault from "@/pages/create-vault";
import CreateVaultEnhancedPage from "@/pages/create-vault-enhanced";
import AdvancedVaultCreationPage from "@/pages/advanced-vault-creation";
import AdvancedVaultCreationNewPage from "@/pages/advanced-vault-creation-new";
import VaultTypesSelector from "@/pages/vault-types-selector";
import SpecializedVaultCreationPage from "@/pages/specialized-vault-creation";
import SecurityProtocolsPage from "@/pages/security-protocols";
import MultiSignatureVaultPage from "@/pages/multi-signature-vault-page";
import IntentInheritanceVault from "@/pages/intent-inheritance-vault";
import MyVaults from "@/pages/my-vaults";
import VaultDetails from "@/pages/vault-details";
import About from "@/pages/about";
import BitcoinHalvingPage from "@/pages/bitcoin-halving";
import BitcoinHalvingVaultPage from "@/pages/bitcoin-halving-vault";
import RoadmapPage from "@/pages/roadmap";
import CVTTokenPage from "@/pages/cvt-token";
import TokenVaultsPage from "@/pages/token-vaults";
import CrossChainPage from "@/pages/cross-chain";
import CrossChainVaultPage from "@/pages/cross-chain-vault";
import CrossChainSecurityPage from "@/pages/cross-chain-security";
import CrossChainAtomicSwapPage from "@/pages/cross-chain-atomic-swap";
import CrossChainVsAtomicSwapPage from "@/pages/cross-chain-vs-atomic-swap";
import CrossChainBridgePage from "@/pages/cross-chain-bridge";
import TransactionVerificationPage from "@/pages/transaction-verification";
import CrossChainMonitorPage from "@/pages/cross-chain-monitor";
import TONIntegrationPage from "@/pages/ton-integration";
import SolanaIntegrationPage from "@/pages/solana-integration";
import EthereumIntegrationPage from "@/pages/ethereum-integration";
import GiftCryptoPage from "@/pages/gift-crypto";
import RevolutionaryFeaturesPage from "@/pages/revolutionary-features";
import DocumentationPage from "@/pages/documentation";
import TechnicalSpecificationPage from "@/pages/technical-specification";
import CVTTokenomicsPage from "@/pages/cvt-tokenomics";
import WhitepaperPage from "@/pages/whitepaper";
import ProjectWhitepaperPage from "@/pages/project-whitepaper";
import PrivacyDashboardPage from "@/pages/privacy-dashboard";
import SecurityTestingPage from "@/pages/security-testing";
import SecurityPage from "@/pages/security-page";
import SecurityDashboardPage from "@/pages/security-dashboard-page";
import SecurityVerificationDemo from "@/pages/security-verification-demo";
import TripleChainSecurityDemo from "@/pages/triple-chain-security-demo";
import VaultExplorer from "@/pages/vault-explorer";
import NotFound from "@/pages/not-found";
import TestContractPage from "@/pages/test-contract";
import WalletManagerPage from "@/pages/wallet-manager";
import PremiumPaymentPage from "@/pages/premium-payment";
import SubscriptionPage from "@/pages/subscription";
import CVTPaymentPage from "@/pages/cvt-payment";
import CVTUtilityPage from "@/pages/cvt-utility-new";
import PremiumFeaturesPage from "@/pages/premium-features";
import TechnicalDashboardPage from "@/pages/admin/technical-dashboard";
import StoragePage from "@/pages/storage-page";
import TransactionMonitorPage from "@/pages/transaction-monitor";
import SmartContractAuditTest from "@/pages/audit-test";
import CrossChainTestPage from "@/pages/cross-chain-test";
import ZkPrivacyDemoPage from "@/pages/zk-privacy-demo";
import QuantumVaultPage from "@/pages/quantum-vault";
import InvestmentDisciplineVaultPage from "@/pages/investment-discipline-vault";
import BiometricVaultPage from "@/pages/biometric-vault-page";
import ZeroKnowledgeVerificationPage from "@/pages/zero-knowledge-verification-page";
import MultiChainSyncPage from "@/pages/multi-chain-sync-page";
import GeoVaultPage from "@/pages/geo-vault-page";
import FAQPage from "@/pages/faq";
import SmartContractsPage from "@/pages/smart-contracts";
import SmartContractVaultPage from "@/pages/smart-contract-vault";
import VaultSchoolPage from "@/pages/vault-school";


// Redirect component for wouter
function Redirect({ to }: { to: string }) {
  const [_, navigate] = useLocation();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

function Router() {
  const [_, navigate] = useLocation();
  
  // Import the dedicated reset page (using regular import at the top of file instead)
  // Import reset pages
  const ResetOnboardingPage = React.lazy(() => import('./pages/reset-onboarding-page'));
  const ForceResetPage = React.lazy(() => import('./pages/force-reset'));
  const MobileLandingPage = React.lazy(() => import('./pages/mobile-landing'));
  const MobileDirectPage = React.lazy(() => import('./pages/mobile-direct'));
  const MobileResetPage = React.lazy(() => import('./pages/mobile-reset'));
  
  return (
    <Layout>
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      }>
        <Switch>
          <Route path="/" component={Home} />
          
          {/* ONBOARDING DISABLED PER USER REQUEST */}
          <Route path="/onboarding">
            <Redirect to="/" />
          </Route>
          
          {/* All onboarding-related routes redirect to home */}
          <Route path="/resetOnboarding=true">
            <Redirect to="/" />
          </Route>
          <Route path="/resetonboarding=true">
            <Redirect to="/" />
          </Route>
          <Route path="/resetOnboarding">
            <Redirect to="/" />
          </Route>
          <Route path="/resetonboarding">
            <Redirect to="/" />
          </Route>
          <Route path="/reset-onboarding">
            <Redirect to="/" />
          </Route>
          <Route path="/force-reset">
            <Redirect to="/" />
          </Route>
          <Route path="/forcereset">
            <Redirect to="/" />
          </Route>
          <Route path="/reset">
            <Redirect to="/" />
          </Route>
          <Route path="/emergency-reset">
            <Redirect to="/" />
          </Route>
          <Route path="/mobile-reset">
            <Redirect to="/" />
          </Route>
          <Route path="/m-reset">
            <Redirect to="/" />
          </Route>
          <Route path="/m">
            <Redirect to="/" />
          </Route>
          <Route path="/mobile">
            <Redirect to="/" />
          </Route>
          <Route path="/mobile-landing">
            <Redirect to="/" />
          </Route>
          <Route path="/md">
            <Redirect to="/" />
          </Route>
          <Route path="/mobile-direct">
            <Redirect to="/" />
          </Route>
          <Route path="/mobile-app">
            <Redirect to="/" />
          </Route>
          
          {/* Important: Route order matters! More specific routes should come before less specific ones */}
          <Route path="/create-vault/cross-chain">
            <Redirect to="/vault-types" />
          </Route>
          <Route path="/create-vault">
            <Redirect to="/vault-types" />
          </Route>
          <Route path="/create-vault-enhanced">
            <Redirect to="/vault-types" />
          </Route>
          <Route path="/vault-types" component={VaultTypesSelector} />
          <Route path="/security-protocols" component={SecurityProtocolsPage} />
          <Route path="/advanced-vault" component={AdvancedVaultCreationPage} />
          <Route path="/advanced-vault-new" component={AdvancedVaultCreationNewPage} />
          <Route path="/specialized-vault" component={SpecializedVaultCreationPage} />
          <Route path="/specialized-vault-creation" component={SpecializedVaultCreationPage} />
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/vault/:id" component={VaultDetails} />
          <Route path="/about" component={About} />
          <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
          <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVaultPage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route path="/cvt-token" component={CVTTokenPage} />
          <Route path="/cvt-utility" component={CVTUtilityPage} />
          <Route path="/token-vaults" component={TokenVaultsPage} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultPage} />
          <Route path="/cross-chain" component={CrossChainPage} />
          <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
          <Route path="/cross-chain-security" component={CrossChainSecurityPage} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwapPage} />
          <Route path="/cross-chain-vs-atomic-swap" component={CrossChainVsAtomicSwapPage} />
          <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
          <Route path="/transaction-verification" component={TransactionVerificationPage} />
          <Route path="/cross-chain-monitor" component={CrossChainMonitorPage} />
          <Route path="/intent-inheritance-vault" component={IntentInheritanceVault} />
          <Route path="/ton-integration" component={TONIntegrationPage} />
          <Route path="/solana-integration" component={SolanaIntegrationPage} />
          <Route path="/ethereum-integration" component={EthereumIntegrationPage} />
          <Route path="/gift-crypto" component={GiftCryptoPage} />
          <Route path="/revolutionary-features" component={RevolutionaryFeaturesPage} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/technical-specification" component={TechnicalSpecificationPage} />
          <Route path="/cvt-tokenomics" component={CVTTokenomicsPage} />
          <Route path="/whitepaper" component={WhitepaperPage} />
          <Route path="/project-whitepaper" component={ProjectWhitepaperPage} />
          <Route path="/privacy-dashboard" component={PrivacyDashboardPage} />
          <Route path="/security-testing" component={SecurityTestingPage} />
          <Route path="/security" component={SecurityPage} />
          <Route path="/security-dashboard" component={SecurityDashboardPage} />
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          <Route path="/triple-chain-security-demo" component={TripleChainSecurityDemo} />
          <Route path="/vault-explorer" component={VaultExplorer} />
          {/* Development routes hidden from navigation */}
          <Route path="/test-contract" component={TestContractPage} />
          <Route path="/wallet-manager" component={WalletManagerPage} />
          <Route path="/premium-features" component={PremiumFeaturesPage} />
          <Route path="/premium-payment/:vaultId?" component={PremiumPaymentPage} />
          <Route path="/cvt-payment/:vaultId?" component={CVTPaymentPage} />
          <Route path="/subscription" component={SubscriptionPage} />
          <Route path="/admin/technical-dashboard" component={TechnicalDashboardPage} />
          <Route path="/storage" component={StoragePage} />
          <Route path="/transaction-monitor" component={TransactionMonitorPage} />
          <Route path="/audit-test" component={SmartContractAuditTest} />
          <Route path="/cross-chain-test" component={CrossChainTestPage} />
          <Route path="/zk-privacy-demo" component={ZkPrivacyDemoPage} />
          <Route path="/quantum-vault" component={QuantumVaultPage} />
          <Route path="/quantum-vault/:id" component={QuantumVaultPage} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVaultPage} />
          <Route path="/biometric-vault" component={BiometricVaultPage} />
          <Route path="/zero-knowledge-verification" component={ZeroKnowledgeVerificationPage} />
          <Route path="/multi-chain-sync" component={MultiChainSyncPage} />
          <Route path="/geo-vaults" component={GeoVaultPage} />
          <Route path="/geo-vaults/:id" component={GeoVaultPage} />
          <Route path="/geo-vaults/create" component={GeoVaultPage} />
          <Route path="/geo-vault" component={GeoVaultPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/smart-contracts" component={SmartContractsPage} />
          <Route path="/smart-contract-vault" component={SmartContractVaultPage} />
          <Route path="/vault-school" component={VaultSchoolPage} />

          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
      <Toaster />
    </Layout>
  );
}



function App() {
  return (
    <DevModeProvider>
      <TooltipProvider>
        <AuthProvider>
          <BlockchainProvider>
            <EthereumProvider>
              <SolanaProvider>
                <TonProvider>
                  <BitcoinProvider>
                    <BitcoinWalletProvider>
                      <MultiChainProvider>
                        <CVTTokenProvider>
                          <TransactionMonitoringProvider>
                            <OnboardingProvider>
                              <Router />
                              {/* <OnboardingRedirect /> - Disabled per user request */}
                              <BlockchainErrorDisplay />
                            </OnboardingProvider>
                          </TransactionMonitoringProvider>
                        </CVTTokenProvider>
                      </MultiChainProvider>
                    </BitcoinWalletProvider>
                  </BitcoinProvider>
                </TonProvider>
              </SolanaProvider>
            </EthereumProvider>
          </BlockchainProvider>
        </AuthProvider>
      </TooltipProvider>
    </DevModeProvider>
  );
}

export default App;