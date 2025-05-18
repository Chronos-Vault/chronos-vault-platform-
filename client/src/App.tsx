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
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import MultiSignatureVaultNew from './pages/multi-signature-vault-new';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import InvestmentDisciplineVaultDoc from './pages/investment-discipline-vault-doc';
import BitcoinHalvingVault from './pages/bitcoin-halving-vault';
import CrossChainVault from './pages/cross-chain-vault';
import IntentInheritanceVault from './pages/intent-inheritance-vault';
import QuantumVault from './pages/quantum-vault';
import TonSpecificVault from './pages/ton-specific-vault';
import SovereignFortressVault from './pages/sovereign-fortress-vault';

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
          <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVault} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/intent-inheritance-vault" component={IntentInheritanceVault} />
          <Route path="/quantum-vault" component={QuantumVault} />
          <Route path="/ton-specific-vault" component={TonSpecificVault} />
          <Route path="/sovereign-fortress-vault" component={SovereignFortressVault} />
          
          {/* Vault Creation Routes */}
          <Route path="/create-vault/standard" component={CreateVaultEnhanced} />
          <Route path="/create-vault/multi-signature" component={MultiSignatureVault} />
          <Route path="/create-vault/biometric" component={CreateVaultEnhanced} />
          <Route path="/create-vault/geo" component={CreateVaultEnhanced} />
          <Route path="/create-vault/smart-contract" component={CreateVaultEnhanced} />
          <Route path="/create-vault/inheritance" component={CreateVaultEnhanced} />
          <Route path="/create-vault/dynamic" component={CreateVaultEnhanced} />
          <Route path="/create-vault/nft-powered" component={CreateVaultEnhanced} />
          <Route path="/create-vault/unique-security" component={CreateVaultEnhanced} />
          <Route path="/create-vault/ai-intent" component={CreateVaultEnhanced} />
          <Route path="/create-vault/time-locked-memory" component={CreateVaultEnhanced} />
          <Route path="/create-vault/standard-crypto" component={CreateVaultEnhanced} />
          <Route path="/create-vault/milestone" component={CreateVaultEnhanced} />
          <Route path="/create-vault/family-heritage" component={CreateVaultEnhanced} />
          <Route path="/create-vault/investment" component={CreateVaultEnhanced} />
          <Route path="/create-vault/cross-chain" component={CreateVaultEnhanced} />
          <Route path="/create-vault/quantum" component={CreateVaultEnhanced} />
          <Route path="/create-vault/ton-specific" component={CreateVaultEnhanced} />
          
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
          <Route path="/gift-crypto" component={GiftCrypto} />
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