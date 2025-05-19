import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";
import PrivacyPolicyPage from './pages/privacy-policy';
import TermsOfServicePage from './pages/terms-of-service';
import CookiePolicyPage from './pages/cookie-policy';

// Core Pages
import Home from './pages/home';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import NotFound from './pages/not-found';
import TestVaultCards from './pages/test-vault-cards';
import FinalVaultTest from './pages/final-vault-test';
import SimpleCardTest from './pages/simple-card-test';

// Vault Creation Pages
import CreateVault from './pages/create-vault';
import CreateTonVault from './pages/create-ton-vault';
import CreateVaultEnhanced from './pages/create-vault-enhanced';
import SpecializedVaultCreation from './pages/specialized-vault-creation';
import AdvancedVaultCreationPage from './pages/advanced-vault-creation';

// Vault Management Pages
import MyVaults from './pages/my-vaults';
import VaultSchool from './pages/vault-school';
import VaultTypesSelector from './pages/vault-types-selector';
import VaultTypesSelectorNew from './pages/vault-types-selector-new';
import VaultSelectionShowcase from './pages/vault-selection-showcase';
import VaultTypes from './pages/vault-types';
import VaultTypesClean from './pages/vault-types-clean';
import VaultDetails from './pages/vault-details';
import VaultExplorer from './pages/vault-explorer';

// Standard Vault Types
import BiometricVault from './pages/biometric-vault';
import GeoVault from './pages/geo-vault';
import GeoVaultDocPage from './pages/geo-vault-doc';
import GeoLocationVault from './pages/geo-location-vault';
import SmartContractVault from './pages/smart-contract-vault';
import EnhancedSmartContractVault from './pages/enhanced-smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import MultiSignatureVaultNew from './pages/multi-signature-vault-new';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import TimeLockedMemoryVault from './pages/time-locked-memory-vault-new';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import InvestmentDisciplineVaultAdvanced from './pages/investment-discipline-vault-advanced';
import UniqueSecurityVault from './pages/unique-security-vault';
import InvestmentDisciplineVaultDoc from './pages/investment-discipline-vault-doc';
import BitcoinHalvingVault from './pages/bitcoin-halving-vault';
import CrossChainVault from './pages/cross-chain-vault';
import CrossChainVaultForm from './pages/cross-chain-vault-form';
import AIInvestmentVaultPage from './pages/vault-types/ai-investment-vault';
import AIAssistedInvestmentVault from './pages/ai-assisted-investment-vault';
import MilestoneBasedVaultPage from './pages/vault-types/milestone-based-vault';
import MilestoneBasedVaultForm from './pages/milestone-based-vault-form';
import FamilyHeritageVaultPage from './pages/vault-types/family-heritage-vault';
import FamilyHeritageVaultForm from './pages/family-heritage-vault-form';
import DynamicVaultForm from './pages/dynamic-vault-form';
import DynamicVaultPage from './pages/vault-types/dynamic-vault';
import TimeLockVault from './pages/time-lock-vault';
import CrossChainFragmentVault from './pages/cross-chain-fragment-vault';
import CrossChainFragmentVaultDocumentation from './pages/documentation/cross-chain-fragment-vault';
import TimeLockedMemoryVaultDocumentation from './pages/documentation/time-locked-memory-vault';
import SovereignFortressVaultDocumentation from './pages/documentation/sovereign-fortress-vault';
import GeoLocationVaultDocumentation from './pages/documentation/geo-location-vault';
import LocationTimeVaultDocumentation from './pages/documentation/location-time-vault';
import NFTPoweredVaultDocumentation from './pages/documentation/nft-powered-vault';
import InvestmentDisciplineVaultDocumentation from './pages/documentation/investment-discipline-vault-new';
import QuantumResistantVaultDocumentation from './pages/documentation/quantum-resistant-vault';
import UniqueSecurityVaultDocumentation from './pages/documentation/unique-security-vault';
import InheritancePlanningVaultDocumentation from './pages/documentation/inheritance-planning-vault';
import PaymentChannelVaultDocumentation from './pages/documentation/payment-channel-vault';
import BitcoinHalvingVaultDocumentation from './pages/documentation/bitcoin-halving-vault';
import AIIntentInheritanceVaultDocumentation from './pages/documentation/ai-intent-inheritance-vault';
import AIAssistedInvestmentVaultDocumentation from './pages/documentation/ai-assisted-investment-vault';
import MilestoneBasedVaultDocumentation from './pages/documentation/milestone-based-vault';
import FamilyHeritageVaultDocumentation from './pages/documentation/family-heritage-vault';
import GiftCryptoVaultDocumentation from './pages/documentation/gift-crypto-vault-fixed';
import NFTPoweredVault from './pages/nft-powered-vault';
import QuantumResistantVault from './pages/quantum-resistant-vault';
import SovereignFortressVault from './pages/sovereign-fortress-vault';
import DynamicVaultLink from './pages/dynamic-vault-link';
import IntentInheritanceVault from './pages/intent-inheritance-vault';
import EnhancedBiometricVault from './pages/enhanced-biometric-vault';
import QuantumVault from './pages/quantum-vault';
import TonSpecificVault from './pages/ton-specific-vault';
import LocationTimeVault from './pages/location-time-vault';

// New Innovative Vault Types
import AIInvestmentVault from './pages/vault-types/ai-investment-vault';
import MilestoneBasedVault from './pages/vault-types/milestone-based-vault';
import FamilyHeritageVault from './pages/vault-types/family-heritage-vault';

// Documentation Pages
import Whitepaper from './pages/whitepaper';
import ProjectWhitepaper from './pages/project-whitepaper';
import SecurityProtocols from './pages/security-protocols';
import CvtTokenomics from './pages/cvt-tokenomics';
import Roadmap from './pages/roadmap';
import Team from './pages/team';
// Bitcoin Halving Pages
import BitcoinHalvingPage from './pages/bitcoin-halving';
import CvtUtility from './pages/cvt-utility';
import CvtUtilityNew from './pages/cvt-utility-new';
import RevolutionaryFeatures from './pages/revolutionary-features';
import SmartContracts from './pages/smart-contracts';
import SecurityTutorials from './pages/security-tutorials';
import SecurityTutorialsVideo from './pages/security-tutorials-video';
import SecurityDocumentation from './pages/security-documentation';
import MilitaryGradeSecurity from './pages/military-grade-security';

// Cross-Chain Pages
import CrossChainBridge from './pages/cross-chain-bridge';
import CrossChainBridgeFixed from './pages/fixed-cross-chain-bridge';
import TonWalletCrossChainBridge from './pages/ton-wallet-cross-chain-bridge';
import CrossChainMonitor from './pages/cross-chain-monitor';
import CrossChainMetricsPage from './pages/cross-chain-metrics';
import CrossChainOperationsPage from './pages/cross-chain-operations';
import CrossChainSecurity from './pages/cross-chain-security';
import CrossChainAtomicSwap from './pages/cross-chain-atomic-swap';
import CrossChainVsCrosschainAtomicSwap from './pages/cross-chain-vs-atomic-swap';
import CrossChainFeeMonitorPage from './pages/cross-chain-fee-monitor';
import BehavioralAuthenticationPage from './pages/behavioral-authentication';

// Wallet Integration Pages
import ConnectTon from './pages/connect-ton';
import EthereumIntegration from './pages/ethereum-integration';
import SolanaIntegration from './pages/solana-integration';
import TonIntegration from './pages/ton-integration';

// Security & Technical Pages
import SecurityVerificationDemo from './pages/security-verification-demo';
import SecurityVerification from './pages/security-verification';
import SecurityPage from './pages/security-page';
import SecurityDashboardPage from './pages/security-dashboard-page';
import TechnicalSpecification from './pages/technical-specification';
import TransactionMonitor from './pages/transaction-monitor';
import TransactionVerification from './pages/transaction-verification';
import TripleChainSecurityDemo from './pages/triple-chain-security-demo';
import ZkPrivacyDemo from './pages/zk-privacy-demo';

// Token & Payment Pages
import CvtStaking from './pages/cvt-staking';
import CvtPayment from './pages/cvt-payment';
import CvtToken from './pages/cvt-token';
import TokenVaults from './pages/token-vaults';
import PremiumFeatures from './pages/premium-features';
import PremiumPayment from './pages/premium-payment';
import Subscription from './pages/subscription';
import GiftCrypto from './pages/gift-crypto';
import StoragePage from './pages/storage-page';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <BlockchainErrorDisplay />
        <Switch>
          {/* Core Pages */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/faq" component={Faq} />
          
          {/* Vault Creation Pages */}
          <Route path="/create-vault" component={CreateVault} />
          <Route path="/create-ton-vault" component={CreateTonVault} />
          <Route path="/create-vault-enhanced" component={CreateVaultEnhanced} />
          <Route path="/specialized-vault-creation" component={SpecializedVaultCreation} />
          <Route path="/advanced-vault-creation" component={AdvancedVaultCreationPage} />
          
          {/* Vault Management Pages */}
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/vault-school" component={VaultSchool} />
          <Route path="/vault-types-selector" component={VaultTypesSelector} />
          <Route path="/vault-types" component={VaultTypesClean} />
          <Route path="/vault-details" component={VaultDetails} />
          <Route path="/vault-explorer" component={VaultExplorer} />
          <Route path="/explorer" component={VaultExplorer} />
          <Route path="/vault-selection" component={VaultSelectionShowcase} />
          <Route path="/create-vault-selector" component={VaultTypesSelector} />
          
          {/* Standard Vault Types */}
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/geo-vault" component={GeoVaultDocPage} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNew} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/investment-discipline-vault-doc" component={InvestmentDisciplineVaultDoc} />
          <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVaultDocumentation} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/intent-inheritance-vault" component={IntentInheritanceVault} />
          <Route path="/inheritance-planning-vault" component={IntentInheritanceVault} />
          <Route path="/quantum-vault" component={QuantumVault} />
          <Route path="/ton-specific-vault" component={TonSpecificVault} />
          <Route path="/location-time-vault" component={LocationTimeVault} />
          {/* Sovereign Fortress Vault accessible through create-vault/standard */}
          
          {/* Vault Creation Routes */}
          <Route path="/create-vault/standard-enhanced" component={CreateVaultEnhanced} />
          <Route path="/create-vault/multi-signature" component={MultiSignatureVault} />
          <Route path="/create-vault/multi-sig" component={MultiSignatureVault} />
          <Route path="/create-vault/biometric" component={EnhancedBiometricVault} />
          <Route path="/create-vault/geo" component={GeoVaultDocPage} />
          <Route path="/create-vault/geo-location" component={GeoLocationVault} />
          <Route path="/create-vault/smart-contract-doc" component={SmartContractVault} />
          <Route path="/create-vault/smart-contract" component={EnhancedSmartContractVault} />
          <Route path="/create-vault/inheritance" component={IntentInheritanceVault} />
          <Route path="/create-vault/family-vault" component={IntentInheritanceVault} />
          <Route path="/create-vault/enhanced" component={CreateVaultEnhanced} />
          {/* Removed duplicate unique-security route, using the newer implementation below */}
          <Route path="/create-vault/ai-intent" component={AIIntentInheritanceVaultDocumentation} />
          <Route path="/create-vault/ai-investment" component={AIAssistedInvestmentVaultDocumentation} />
          <Route path="/create-vault/time-locked-memory" component={TimeLockedMemoryVaultDocumentation} />
          <Route path="/create-vault/standard-crypto" component={CreateVault} />
          <Route path="/create-vault/milestone-doc" component={MilestoneBasedVaultPage} />
          <Route path="/create-vault/milestone" component={MilestoneBasedVaultDocumentation} />
          <Route path="/create-vault/family-heritage-doc" component={FamilyHeritageVaultPage} />
          <Route path="/create-vault/family-heritage" component={FamilyHeritageVaultDocumentation} />
          <Route path="/create-vault/dynamic-doc" component={DynamicVaultPage} />
          <Route path="/create-vault/dynamic" component={DynamicVaultForm} />
          <Route path="/dynamic-vault-link" component={DynamicVaultLink} />
          <Route path="/create-vault/investment" component={InvestmentDisciplineVault} />
          <Route path="/create-vault/investment-discipline" component={InvestmentDisciplineVaultAdvanced} />
          <Route path="/create-vault/investment-discipline-advanced" component={InvestmentDisciplineVaultAdvanced} />
          <Route path="/create-vault/unique-security" component={UniqueSecurityVault} />
          <Route path="/create-vault/cross-chain-doc" component={CrossChainVault} />
          <Route path="/create-vault/cross-chain" component={CrossChainVaultForm} />
          <Route path="/create-vault/ai-assisted-doc" component={AIInvestmentVaultPage} />
          <Route path="/create-vault/ai-assisted" component={AIAssistedInvestmentVault} />
          <Route path="/create-vault/quantum" component={QuantumVault} />
          <Route path="/create-vault/ton-specific" component={TonSpecificVault} />
          <Route path="/create-vault/time-lock" component={TimeLockVault} />
          <Route path="/create-vault/cross-chain-fragment" component={CrossChainFragmentVault} />
          <Route path="/create-vault/nft-powered" component={NFTPoweredVault} />
          <Route path="/create-vault/quantum-resistant" component={QuantumResistantVault} />
          <Route path="/create-vault/standard" component={SovereignFortressVault} />
          <Route path="/create-vault/location-time" component={LocationTimeVault} />
          
          {/* New Innovative Vault Types */}
          <Route path="/ai-investment-vault" component={AIInvestmentVault} />
          <Route path="/milestone-based-vault" component={MilestoneBasedVault} />
          <Route path="/family-heritage-vault" component={FamilyHeritageVault} />
          
          {/* Vault Detail Pages */}
          <Route path="/vault/:id" component={VaultDetails} />
          <Route path="/quantum-vault/:id" component={QuantumVault} />
          
          {/* Documentation Pages */}
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/project-whitepaper" component={ProjectWhitepaper} />
          <Route path="/security-protocols" component={SecurityProtocols} />
          <Route path="/security-tutorials" component={SecurityTutorials} />
          <Route path="/security-tutorials-video" component={SecurityTutorialsVideo} />
          <Route path="/security-documentation" component={SecurityDocumentation} />
          <Route path="/military-grade-security" component={MilitaryGradeSecurity} />
          <Route path="/documentation/multi-signature-vault" component={MultiSignatureVaultNew} />
          <Route path="/documentation/dynamic-security-vault" component={DynamicVaultPage} />
          <Route path="/documentation/cross-chain-fragment-vault" component={CrossChainFragmentVaultDocumentation} />
          <Route path="/documentation/time-locked-memory-vault" component={TimeLockedMemoryVaultDocumentation} />
          <Route path="/documentation/sovereign-fortress-vault" component={SovereignFortressVaultDocumentation} />
          <Route path="/documentation/geo-location-vault" component={GeoLocationVaultDocumentation} />
          <Route path="/documentation/location-time-vault" component={LocationTimeVaultDocumentation} />
          <Route path="/documentation/nft-powered-vault" component={NFTPoweredVaultDocumentation} />
          <Route path="/documentation/investment-discipline-vault" component={InvestmentDisciplineVaultDocumentation} />
          <Route path="/documentation/quantum-resistant-vault" component={QuantumResistantVaultDocumentation} />
          <Route path="/documentation/unique-security-vault" component={UniqueSecurityVaultDocumentation} />
          <Route path="/documentation/inheritance-planning-vault" component={InheritancePlanningVaultDocumentation} />
          <Route path="/documentation/payment-channel-vault" component={PaymentChannelVaultDocumentation} />
          <Route path="/documentation/bitcoin-halving-vault" component={BitcoinHalvingVaultDocumentation} />
          <Route path="/documentation/ai-intent-inheritance-vault" component={AIIntentInheritanceVaultDocumentation} />
          <Route path="/documentation/ai-assisted-investment-vault" component={AIAssistedInvestmentVaultDocumentation} />
          <Route path="/documentation/milestone-based-vault" component={MilestoneBasedVaultDocumentation} />
          <Route path="/documentation/family-heritage-vault" component={FamilyHeritageVaultDocumentation} />
          <Route path="/documentation/gift-crypto-vault" component={GiftCryptoVaultDocumentation} />
          <Route path="/cvt-tokenomics" component={CvtTokenomics} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/team" component={Team} />
          <Route path="/cvt-utility" component={CvtUtility} />
          <Route path="/cvt-utility-new" component={CvtUtilityNew} />
          <Route path="/revolutionary-features" component={RevolutionaryFeatures} />
          <Route path="/smart-contracts" component={SmartContracts} />
          
          {/* Cross-Chain Pages */}
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route path="/fixed-cross-chain-bridge" component={CrossChainBridgeFixed} />
          <Route path="/ton-wallet-cross-chain-bridge" component={TonWalletCrossChainBridge} />
          <Route path="/cross-chain-monitor" component={CrossChainMonitor} />
          <Route path="/cross-chain-metrics" component={CrossChainMetricsPage} />
          <Route path="/cross-chain-operations" component={CrossChainOperationsPage} />
          <Route path="/cross-chain-security" component={CrossChainSecurity} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwap} />
          <Route path="/cross-chain-vs-atomic-swap" component={CrossChainVsCrosschainAtomicSwap} />
          <Route path="/cross-chain-fee-monitor" component={CrossChainFeeMonitorPage} />
          
          {/* Wallet Integration Pages */}
          <Route path="/connect-ton" component={ConnectTon} />
          <Route path="/ethereum-integration" component={EthereumIntegration} />
          <Route path="/solana-integration" component={SolanaIntegration} />
          <Route path="/ton-integration" component={TonIntegration} />
          
          {/* Security & Technical Pages */}
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          <Route path="/security-verification" component={SecurityVerification} />
          <Route path="/security-page" component={SecurityPage} />
          <Route path="/security-dashboard" component={SecurityDashboardPage} />
          <Route path="/technical-specification" component={TechnicalSpecification} />
          <Route path="/transaction-monitor" component={TransactionMonitor} />
          <Route path="/transaction-verification" component={TransactionVerification} />
          <Route path="/triple-chain-security-demo" component={TripleChainSecurityDemo} />
          <Route path="/zk-privacy-demo" component={ZkPrivacyDemo} />
          <Route path="/behavioral-authentication" component={BehavioralAuthenticationPage} />
          <Route path="/test-vault-cards" component={TestVaultCards} />
          <Route path="/final-vault-test" component={FinalVaultTest} />
          <Route path="/simple-card-test" component={SimpleCardTest} />
          
          {/* Token & Payment Pages */}
          <Route path="/staking" component={CvtStaking} />
          <Route path="/cvt-payment" component={CvtPayment} />
          <Route path="/cvt-token" component={CvtToken} />
          <Route path="/token-vaults" component={TokenVaults} />
          <Route path="/premium-features" component={PremiumFeatures} />
          <Route path="/premium-payment" component={PremiumPayment} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/gift-crypto" component={GiftCryptoVaultDocumentation} />
          <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
          <Route path="/storage" component={StoragePage} />
          <Route path="/privacy-policy" component={PrivacyPolicyPage} />
          <Route path="/terms-of-service" component={TermsOfServicePage} />
          <Route path="/cookie-policy" component={CookiePolicyPage} />
          
          {/* 404 - must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;