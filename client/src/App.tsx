import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";

// Core Pages
import Home from './pages/home';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import NotFound from './pages/not-found';

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
import VaultTypes from './pages/vault-types-new';
import VaultDetails from './pages/vault-details';
import VaultExplorer from './pages/vault-explorer';

// Standard Vault Types
import BiometricVault from './pages/biometric-vault';
import GeoVault from './pages/geo-vault';
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import BitcoinHalvingVault from './pages/bitcoin-halving-vault';
import CrossChainVault from './pages/cross-chain-vault';
import IntentInheritanceVault from './pages/intent-inheritance-vault';
import QuantumVault from './pages/quantum-vault';
import TonSpecificVault from './pages/ton-specific-vault';

// Documentation Pages
import Whitepaper from './pages/whitepaper';
import ProjectWhitepaper from './pages/project-whitepaper';
import SecurityProtocols from './pages/security-protocols';
import CvtTokenomics from './pages/cvt-tokenomics';
import CvtUtility from './pages/cvt-utility';
import CvtUtilityNew from './pages/cvt-utility-new';
import RevolutionaryFeatures from './pages/revolutionary-features';
import SmartContracts from './pages/smart-contracts';

// Cross-Chain Pages
import CrossChainBridge from './pages/cross-chain-bridge';
import CrossChainBridgeFixed from './pages/fixed-cross-chain-bridge';
import TonWalletCrossChainBridge from './pages/ton-wallet-cross-chain-bridge';
import CrossChainMonitor from './pages/cross-chain-monitor';
import CrossChainSecurity from './pages/cross-chain-security';
import CrossChainAtomicSwap from './pages/cross-chain-atomic-swap';
import CrossChainVsCrosschainAtomicSwap from './pages/cross-chain-vs-atomic-swap';

// Wallet Integration Pages
import ConnectTon from './pages/connect-ton';
import EthereumIntegration from './pages/ethereum-integration';
import SolanaIntegration from './pages/solana-integration';
import TonIntegration from './pages/ton-integration';

// Security & Technical Pages
import SecurityVerificationDemo from './pages/security-verification-demo';
import SecurityPage from './pages/security-page';
import TechnicalSpecification from './pages/technical-specification';
import TransactionMonitor from './pages/transaction-monitor';
import TransactionVerification from './pages/transaction-verification';
import TripleChainSecurityDemo from './pages/triple-chain-security-demo';
import ZkPrivacyDemo from './pages/zk-privacy-demo';

// Token & Payment Pages
import CvtStaking from './pages/cvt-staking';
import CvtPayment from './pages/cvt-payment';
import CvtToken from './pages/cvt-token';
import PremiumFeatures from './pages/premium-features';
import PremiumPayment from './pages/premium-payment';
import Subscription from './pages/subscription';

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
          <Route path="/vault-types" component={VaultTypes} />
          <Route path="/vault-details" component={VaultDetails} />
          <Route path="/vault-explorer" component={VaultExplorer} />
          
          {/* Standard Vault Types */}
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVault} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/intent-inheritance-vault" component={IntentInheritanceVault} />
          <Route path="/quantum-vault" component={QuantumVault} />
          <Route path="/ton-specific-vault" component={TonSpecificVault} />
          
          {/* Documentation Pages */}
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/project-whitepaper" component={ProjectWhitepaper} />
          <Route path="/security-protocols" component={SecurityProtocols} />
          <Route path="/cvt-tokenomics" component={CvtTokenomics} />
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
          <Route path="/cross-chain-security" component={CrossChainSecurity} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwap} />
          <Route path="/cross-chain-vs-atomic-swap" component={CrossChainVsCrosschainAtomicSwap} />
          
          {/* Wallet Integration Pages */}
          <Route path="/connect-ton" component={ConnectTon} />
          <Route path="/ethereum-integration" component={EthereumIntegration} />
          <Route path="/solana-integration" component={SolanaIntegration} />
          <Route path="/ton-integration" component={TonIntegration} />
          
          {/* Security & Technical Pages */}
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          <Route path="/security-page" component={SecurityPage} />
          <Route path="/technical-specification" component={TechnicalSpecification} />
          <Route path="/transaction-monitor" component={TransactionMonitor} />
          <Route path="/transaction-verification" component={TransactionVerification} />
          <Route path="/triple-chain-security-demo" component={TripleChainSecurityDemo} />
          <Route path="/zk-privacy-demo" component={ZkPrivacyDemo} />
          
          {/* Token & Payment Pages */}
          <Route path="/staking" component={CvtStaking} />
          <Route path="/cvt-payment" component={CvtPayment} />
          <Route path="/cvt-token" component={CvtToken} />
          <Route path="/premium-features" component={PremiumFeatures} />
          <Route path="/premium-payment" component={PremiumPayment} />
          <Route path="/subscription" component={Subscription} />
          
          {/* 404 - must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;