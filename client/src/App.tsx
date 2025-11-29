import React from 'react';
import { Route, Switch, Link } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TransactionErrorProvider } from '@/contexts/transaction-error-context';
import { useAuthContext } from '@/contexts/auth-context';
import { NavBar } from '@/components/navigation/NavBar';
import ScrollToTop from '@/components/navigation/ScrollToTop';
import Footer from '@/components/layout/footer';
import DocumentationRouter from '@/components/documentation/DocumentationRouter';
// Removed old wallet auth modal import

// Main Pages
import HomePage from '@/pages/home';
import MyVaultsPage from '@/pages/my-vaults';
import AboutPage from '@/pages/about';
import FaqPage from '@/pages/faq';
import TeamPage from '@/pages/team';
import WhitepaperPage from '@/pages/whitepaper';
import ProjectWhitepaperPage from '@/pages/project-whitepaper';
import CvtTokenomicsPage from '@/pages/cvt-tokenomics';
import CvtUtilityPage from '@/pages/cvt-utility-new';
import TermsOfServicePage from '@/pages/terms-of-service';
import CookiePolicyPage from '@/pages/cookie-policy';
import PrivacyPolicyPage from '@/pages/privacy-policy';
import DocumentationPage from '@/pages/documentation';
import VaultSchoolPage from '@/pages/vault-school';
import RoadmapPage from '@/pages/roadmap';
import SmartContractsPage from '@/pages/smart-contracts';
import TechnicalSpecPage from '@/pages/technical-spec';
import RevolutionaryFeaturesPage from '@/pages/revolutionary-features';

// Documentation Pages
import APIDocumentationPage from '@/pages/api-documentation';
import SDKDocumentationPage from '@/pages/sdk-documentation';
import IntegrationExamplesPage from '@/pages/integration-examples';
import DeveloperPortalPage from '@/pages/developer-portal';
import IntegrationGuidePage from '@/pages/integration-guide';
import SmartContractSDKPage from '@/pages/smart-contract-sdk';
import DeveloperAPIKeysPage from '@/pages/DeveloperAPIKeys';
import WalletIntegrationDemoPage from '@/pages/WalletIntegrationDemo';
import WalletPage from '@/pages/wallet';
import SecurityDashboard from '@/pages/security-dashboard';
import DeFiDashboard from '@/pages/defi-dashboard';

// Vault Type Pages
import VaultTypesPage from '@/pages/vault-types-new';
import VaultTypesSelector from '@/pages/vault-types-selector';
import VaultShowcase from '@/pages/stunning-vault-showcase';

// Creation Pages
import CreateVaultPage from '@/pages/create-vault';
import CreateVaultEnhancedPage from '@/pages/create-vault-enhanced';
import SpecializedVaultCreationPage from '@/pages/specialized-vault-creation';
import CreateTonVaultPage from '@/pages/create-ton-vault';

// Monitoring Pages
import MonitoringPage from '@/pages/monitoring';
import TransactionMonitorPage from '@/pages/transaction-monitor';
import CrossChainMonitorPage from '@/pages/cross-chain-monitor';
import CrossChainFeesPage from '@/pages/cross-chain-fee-monitor';
import VaultExplorerPage from '@/pages/vault-explorer';
import DeviceManagementPage from '@/pages/device-management';
import DeviceRecoveryPage from '@/pages/device-recovery';
import MDLMonitoringDashboard from '@/pages/mdl-monitoring-dashboard';

// Security & Verification Pages
import TonSecurityPage from '@/pages/ton-security';
import CrossChainSecurityPage from '@/pages/cross-chain-security';
import SecurityVerificationPage from '@/pages/security-verification';
import SecurityVerificationDemoPage from '@/pages/security-verification-demo';
import SecurityTestingPage from '@/pages/security-testing';
import BehavioralAuthenticationPage from '@/pages/behavioral-authentication';
import ZeroKnowledgeVerificationPage from '@/pages/zero-knowledge-verification-page';
import ZkPrivacyDemoPage from '@/pages/zk-privacy-demo';
import TripleChainSecurityPage from '@/pages/triple-chain-security';
import HowItWorksPage from '@/pages/how-it-works';
import TrinityProtocolDashboard from '@/pages/trinity-protocol-dashboard';
import TrinityHTLCTest from '@/pages/trinity-htlc-test';
import ValidatorOnboardingPage from '@/pages/validator-onboarding';
import ValidatorDashboardPage from '@/pages/validator-dashboard';

// Integration Pages
import EthereumIntegrationPage from '@/pages/ethereum-integration';
import SolanaIntegrationPage from '@/pages/solana-integration';
import TonIntegrationPage from '@/pages/ton-integration';
import ConnectTonPage from '@/pages/connect-ton';

// Vault Pages - Basic
import TimeLockVaultPage from '@/pages/time-lock-vault';
import MultiSignatureVaultPage from '@/pages/multi-signature-vault';
import MultiSignatureVaultNewPage from '@/pages/multi-signature-vault-new';
import GeoLocationVaultPage from '@/pages/geo-location-vault';
import BiometricVaultPage from '@/pages/biometric-vault';
import SmartContractVaultPage from '@/pages/smart-contract-vault';

// Vault Pages - Advanced
import CrossChainVaultPage from '@/pages/cross-chain-vault';
import CrossChainVaultForm from '@/pages/cross-chain-vault-form';
import CrossChainFragmentVaultPage from '@/pages/cross-chain-fragment-vault';
import QuantumResistantVaultPage from '@/pages/quantum-resistant-vault';
import SovereignFortressVaultPage from '@/pages/sovereign-fortress-vault';
import NFTPoweredVaultPage from '@/pages/nft-powered-vault';
import UriqueSecurityVaultPage from '@/pages/unique-security-vault';
import EnhancedBiometricVaultPage from '@/pages/enhanced-biometric-vault';
import EnhancedSmartContractVaultPage from '@/pages/enhanced-smart-contract-vault';
import AdvancedTimeLockVaultPage from '@/pages/advanced-time-lock-vault';

// Vault Pages - Specialized
import AiAssistedInvestmentVaultPage from '@/pages/ai-assisted-investment-vault';
import IntentInheritanceVaultPage from '@/pages/intent-inheritance-vault';
// Using direct import of component
import TimeLockedMemoryVault from '@/pages/time-locked-memory-vault';
const TimeLockedMemoryVaultPage = TimeLockedMemoryVault;
// Using direct import of advanced component
import TimeLockedMemoryVaultNew from '@/pages/time-locked-memory-vault-new';
const TimeLockedMemoryVaultNewPage = TimeLockedMemoryVaultNew;
// Using direct import of advanced investment discipline vault component
import InvestmentDisciplineVaultAdvanced from '@/pages/investment-discipline-vault-advanced';
const InvestmentDisciplineVaultAdvancedPage = InvestmentDisciplineVaultAdvanced;
// Using direct import of milestone based vault form component
import MilestoneBasedVaultForm from '@/pages/milestone-based-vault-form';
const MilestoneBasedVaultFormPage = MilestoneBasedVaultForm;
// Direct import of bitcoin-halving component
import BitcoinHalvingComponent from '@/pages/bitcoin-halving';
import InvestmentDisciplineVaultPage from '@/pages/investment-discipline-vault';
import DynamicVaultFormPage from '@/pages/dynamic-vault-form';
import FamilyHeritageVaultFormPage from '@/pages/family-heritage-vault-form';
// Bitcoin Halving Vault now uses the advanced implementation

// Cross-Chain Features
import BridgePage from '@/pages/bridge';
import CrossChainBridgePage from '@/pages/cross-chain-bridge';
import CrossChainAtomicSwapPage from '@/pages/cross-chain-atomic-swap';
import TonWalletCrossChainBridgePage from '@/pages/ton-wallet-cross-chain-bridge';
import CrossChainVsAtomicSwapPage from '@/pages/cross-chain-vs-atomic-swap';
import BridgeVsSwapPage from '@/pages/bridge-vs-swap';
import SecurityPage from '@/pages/security';
import SecurityDashboardPage from '@/pages/security-dashboard';
import TripleChainSecurityDashboardPage from '@/pages/security-dashboard-page';
import BitcoinHalvingAdvancedPage from '@/pages/bitcoin-halving';
import SecurityIntegrationGuide from '@/pages/security-integration-guide';
import SecurityTutorials from '@/pages/security-tutorials';
import MilitaryGradeSecurity from '@/pages/military-grade-security';
import TokenVaultsPage from '@/pages/token-vaults-redesign';
import SecurityDocumentation from '@/pages/security-documentation';
import StoragePage from '@/pages/storage-page';
// We already have the QuantumResistantVaultPage imported above

// Token & Payment Pages
import CvtStakingPage from '@/pages/cvt-staking';
import CvtTokenPage from '@/pages/cvt-token';
import CvtPaymentPage from '@/pages/cvt-payment';
import SubscriptionPage from '@/pages/subscription';
import GiftCryptoPage from '@/pages/gift-crypto';



const App: React.FC = () => {
  return (
    <TransactionErrorProvider>
      <div className="min-h-screen bg-black text-white">
        <ErrorBoundary name="App">
          <ScrollToTop />
          <NavBar />
          <div className="pt-2">
                      <Switch>
                      {/* Main Pages */}
                      <Route path="/" component={HomePage} />
                      <Route path="/wallet" component={WalletPage} />
                      {/* Old create-wallet route removed */}
                      <Route path="/security" component={SecurityDashboard} />
                      <Route path="/defi" component={DeFiDashboard} />
                      <Route path="/my-vaults" component={MyVaultsPage} />
                      <Route path="/about" component={AboutPage} />
                      <Route path="/faq" component={FaqPage} />
                      <Route path="/team" component={TeamPage} />
                      <Route path="/whitepaper" component={WhitepaperPage} />
                      <Route path="/project-whitepaper" component={ProjectWhitepaperPage} />
                      <Route path="/documentation" component={DocumentationPage} />
                      {/* Important: The route below is disabled to fix conflict with multi-signature-vault-new */}
                      {/* <Route path="/documentation/multi-signature-vault" component={DocumentationPage} /> */}
                      <Route path="/revolutionary-features" component={RevolutionaryFeaturesPage} />
                      <Route path="/vault-school" component={VaultSchoolPage} />
                      <Route path="/terms-of-service" component={TermsOfServicePage} />
                      <Route path="/cookie-policy" component={CookiePolicyPage} />
                      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
                      
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
                      <Route path="/monitoring" component={MonitoringPage} />
                      <Route path="/mdl-monitor" component={MDLMonitoringDashboard} />
                      {/* Legacy routes - kept for backward compatibility */}
                      <Route path="/transaction-monitor" component={TransactionMonitorPage} />
                      <Route path="/transaction-verification" component={SecurityVerificationPage} />
                      <Route path="/cross-chain-monitor" component={CrossChainMonitorPage} />
                      <Route path="/cross-chain-fee-monitor" component={CrossChainFeesPage} />
                      <Route path="/cross-chain-operations" component={MonitoringPage} />
                      <Route path="/vault-explorer" component={VaultExplorerPage} />
                      <Route path="/device-management" component={DeviceManagementPage} />
                      <Route path="/device-recovery" component={DeviceRecoveryPage} />
                      
                      {/* Security Pages */}
                      <Route path="/security" component={SecurityPage} />
                      {/* Legacy routes - kept for backward compatibility */}
                      <Route path="/trinity-protocol" component={TrinityProtocolDashboard} />
                      <Route path="/trinity-htlc-test" component={TrinityHTLCTest} />
                      <Route path="/validator-onboarding" component={ValidatorOnboardingPage} />
                      <Route path="/validator-dashboard" component={ValidatorDashboardPage} />
                      <Route path="/security-dashboard" component={TripleChainSecurityDashboardPage} />
                      <Route path="/ton-security" component={TonSecurityPage} />
                      <Route path="/cross-chain-security" component={CrossChainSecurityPage} />
                      <Route path="/security-verification" component={SecurityVerificationPage} />
                      <Route path="/security-verification-demo" component={SecurityVerificationDemoPage} />
                      <Route path="/security-testing" component={SecurityTestingPage} />
                      <Route path="/behavioral-authentication">
                        {(params) => <BehavioralAuthenticationPage tab="overview" />}
                      </Route>
                      <Route path="/behavioral-auth">
                        {(params) => <BehavioralAuthenticationPage tab="overview" />}
                      </Route>
                      <Route path="/quantum-resistant">
                        {() => <DocumentationRouter vaultType="quantum-resistant-vault" />}
                      </Route>
                      <Route path="/zero-knowledge-verification" component={ZeroKnowledgeVerificationPage} />
                      <Route path="/zk-privacy-demo" component={ZkPrivacyDemoPage} />
                      <Route path="/triple-chain-security" component={TripleChainSecurityPage} />
                      <Route path="/how-it-works" component={HowItWorksPage} />
                      <Route path="/bitcoin-halving" component={BitcoinHalvingComponent} />
                      
                      {/* Blockchain Integration */}
                      <Route path="/ethereum-integration" component={EthereumIntegrationPage} />
                      <Route path="/solana-integration" component={SolanaIntegrationPage} />
                      <Route path="/ton-integration" component={TonIntegrationPage} />
                      <Route path="/connect-ton" component={ConnectTonPage} />
                      
                      {/* Basic Vault Types */}
                      <Route path="/time-lock-vault" component={TimeLockVaultPage} />
                      <Route path="/advanced-time-lock-vault" component={AdvancedTimeLockVaultPage} />
                      {/* Commented out old component route to prevent conflict */}
                      {/* <Route path="/multi-signature-vault" component={MultiSignatureVaultPage} /> */}
                      <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNewPage} />
                      <Route path="/geo-location-vault" component={GeoLocationVaultPage} />
                      <Route path="/biometric-vault" component={BiometricVaultPage} />
                      <Route path="/smart-contract-vault" component={SmartContractVaultPage} />
                      
                      {/* Advanced Vault Types */}
                      <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
                      <Route path="/cross-chain-vault-form" component={CrossChainVaultForm} />
                      <Route path="/cross-chain-fragment-vault" component={CrossChainFragmentVaultPage} />
                      <Route path="/quantum-resistant-vault" component={QuantumResistantVaultPage} />
                      <Route path="/vault-school-hub" component={VaultSchoolPage} />
                      <Route path="/vault-school" component={VaultSchoolPage} />
                      <Route path="/sovereign-fortress-vault" component={SovereignFortressVaultPage} />
                      <Route path="/nft-powered-vault" component={NFTPoweredVaultPage} />
                      <Route path="/unique-security-vault" component={UriqueSecurityVaultPage} />
                      <Route path="/enhanced-biometric-vault" component={EnhancedBiometricVaultPage} />
                      <Route path="/enhanced-smart-contract-vault" component={EnhancedSmartContractVaultPage} />
                      
                      {/* Specialized Vault Types */}
                      <Route path="/ai-assisted-investment-vault" component={AiAssistedInvestmentVaultPage} />
                      <Route path="/ai-investment-vault" component={AiAssistedInvestmentVaultPage} />
                      <Route path="/intent-inheritance-vault" component={IntentInheritanceVaultPage} />
                      <Route path="/ai-intent-inheritance-vault" component={IntentInheritanceVaultPage} />
                      <Route path="/time-locked-memory-vault" component={TimeLockedMemoryVaultPage} />
                      <Route path="/specialized-vault-memory" component={TimeLockedMemoryVaultNewPage} />
                      <Route path="/create-vault/time-locked-memory" component={TimeLockedMemoryVaultNewPage} />
                      <Route path="/investment-discipline-vault" component={InvestmentDisciplineVaultAdvancedPage} />
                      <Route path="/milestone-based-vault" component={MilestoneBasedVaultFormPage} />
                      <Route path="/dynamic-vault-form" component={DynamicVaultFormPage} />
                      <Route path="/family-heritage-vault" component={FamilyHeritageVaultFormPage} />
                      <Route path="/family-heritage-vault-form" component={FamilyHeritageVaultFormPage} />
                      <Route path="/bitcoin-halving-vault" component={BitcoinHalvingComponent} />
                      
                      {/* Developer Documentation Routes */}
                      <Route path="/api-documentation" component={APIDocumentationPage} />
                      <Route path="/sdk-documentation" component={SDKDocumentationPage} />
                      <Route path="/integration-examples" component={IntegrationExamplesPage} />
                      <Route path="/developer-portal" component={DeveloperPortalPage} />
                      <Route path="/integration-guide" component={IntegrationGuidePage} />
                      <Route path="/smart-contract-sdk" component={SmartContractSDKPage} />
                      <Route path="/developer-api-keys" component={DeveloperAPIKeysPage} />
                      <Route path="/wallet-integration-demo" component={WalletIntegrationDemoPage} />

                      {/* Vault Direct Access Routes - Based on Vault School documentation */}
                      {/* Switching to explicit routes instead of catch-all to avoid conflicts */}
                      {/* <Route path="/:vaultType-vault" component={CreateVaultEnhancedPage} /> */}
                      
                      {/* Cross-Chain Features */}
                      <Route path="/bridge" component={BridgePage} />
                      {/* Legacy routes - kept for backward compatibility */}
                      <Route path="/cross-chain-operations" component={MonitoringPage} />
                      <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
                      <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwapPage} />
                      <Route path="/ton-wallet-cross-chain-bridge" component={TonWalletCrossChainBridgePage} />
                      <Route path="/bridge-vs-swap" component={BridgeVsSwapPage} />
                      <Route path="/atomic-swaps" component={BridgePage} />
                      
                      {/* Token & Payment */}
                      <Route path="/cvt-tokenomics" component={CvtTokenomicsPage} />
                      <Route path="/cvt-utility" component={CvtUtilityPage} />
                      <Route path="/cvt-token" component={CvtTokenPage} />
                      <Route path="/cvt-staking" component={CvtStakingPage} />
                      <Route path="/cvt-payment" component={CvtPaymentPage} />
                      <Route path="/subscription" component={SubscriptionPage} />
                      <Route path="/token-vaults" component={TokenVaultsPage} />
                      <Route path="/gift-crypto" component={GiftCryptoPage} />
                      
                      {/* Documentation Pages */}
                      <Route path="/docs" component={DocumentationPage} />
                      <Route path="/roadmap" component={RoadmapPage} />
                      <Route path="/smart-contracts" component={SmartContractsPage} />
                      <Route path="/technical-spec" component={TechnicalSpecPage} />
                      <Route path="/tokenomics" component={CvtTokenomicsPage} />
                      <Route path="/technical-security-docs" component={() => <SecurityDocumentation />} />
                      <Route path="/security-integration-guide" component={SecurityIntegrationGuide} />
                      <Route path="/security-tutorials" component={SecurityTutorials} />
                      <Route path="/military-grade-security" component={MilitaryGradeSecurity} />
                      <Route path="/storage" component={StoragePage} />
                      <Route path="/social-recovery">
                        {(params) => <BehavioralAuthenticationPage tab="social" />}
                      </Route>
                      <Route path="/quantum-resistant" component={QuantumResistantVaultPage} />
                      
                      {/* Vault School and Documentation Routes */}
                      <Route path="/vault-school-hub" component={VaultSchoolPage} />
                      {/* SDK Documentation - SPECIFIC ROUTE FIRST to ensure it matches */}
                      <Route path="/documentation/sdk" component={SDKDocumentationPage} />
                      <Route path="/documentation/:vaultType">
                        {(params) => {
                          console.log('[App.tsx] Documentation route matched!', params);
                          console.log('[App.tsx] vaultType param:', params.vaultType);
                          return <DocumentationRouter vaultType={params.vaultType} />;
                        }}
                      </Route>
                    </Switch>
                    <Footer />
        </div>
      </ErrorBoundary>
    </div>
    </TransactionErrorProvider>
  );
};

export default App;