import { Route, Switch } from 'wouter';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import CreateTonVaultPage from './pages/create-ton-vault';
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CvtStakingPage from './pages/cvt-staking';
import SmartContractVaultPage from './pages/smart-contract-vault';
import BiometricVaultPage from './pages/biometric-vault';
import CrossChainVaultPage from './pages/cross-chain-vault';
import GeoVaultPage from './pages/geo-vault';
import SpecializedVaultMemoryPage from './pages/specialized-vault-memory';
import InvestmentDisciplineVaultPage from './pages/investment-discipline-vault';
import VaultSchoolPage from './pages/vault-school';
import MultiSignatureVaultPage from './pages/multi-signature-vault';
import MultiSignatureVaultNewPage from './pages/multi-signature-vault-new';
import CrossChainMonitorPage from './pages/cross-chain-monitor';
import TransactionMonitorPage from './pages/transaction-monitor';
import TransactionVerificationPage from './pages/transaction-verification';
import CrossChainAtomicSwapPage from './pages/cross-chain-atomic-swap';
import CrossChainVsAtomicSwapPage from './pages/cross-chain-vs-atomic-swap';
import CrossChainSecurityPage from './pages/cross-chain-security';
import SecurityVerificationDemoPage from './pages/security-verification-demo';
import MyVaultsPage from './pages/my-vaults';
import CvtTokenPage from './pages/cvt-token';
import CvtUtilityPage from './pages/cvt-utility';
import CvtTokenomicsPage from './pages/cvt-tokenomics';
import BitcoinHalvingPage from './pages/bitcoin-halving';
import GiftCryptoPage from './pages/gift-crypto';
import TokenVaultsPage from './pages/token-vaults';
import WhitepaperPage from './pages/whitepaper';
import TechnicalSpecificationPage from './pages/technical-specification';
import SmartContractsPage from './pages/smart-contracts';
import RoadmapPage from './pages/roadmap';
import DocumentationPage from './pages/documentation';
import AuditTestPage from './pages/audit-test';
import AboutPage from './pages/about';
import FaqPage from './pages/faq';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          {/* Main pages */}
          <Route path="/" component={HomePage} />
          <Route path="/bridge" component={CrossChainBridgePage} />
          <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
          <Route path="/create-vault" component={CreateTonVaultPage} />
          <Route path="/staking" component={CvtStakingPage} />
          
          {/* Vault types pages */}
          <Route path="/smart-contract-vault" component={SmartContractVaultPage} />
          <Route path="/biometric-vault" component={BiometricVaultPage} />
          <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
          <Route path="/geo-vault" component={GeoVaultPage} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemoryPage} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVaultPage} />
          <Route path="/vault-school" component={VaultSchoolPage} />
          <Route path="/multi-signature-vault" component={MultiSignatureVaultPage} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNewPage} />
          
          {/* Explore section pages */}
          <Route path="/cross-chain-monitor" component={CrossChainMonitorPage} />
          <Route path="/transaction-monitor" component={TransactionMonitorPage} />
          <Route path="/transaction-verification" component={TransactionVerificationPage} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwapPage} />
          <Route path="/cross-chain-vs-atomic-swap" component={CrossChainVsAtomicSwapPage} />
          <Route path="/cross-chain-security" component={CrossChainSecurityPage} />
          <Route path="/security-verification-demo" component={SecurityVerificationDemoPage} />
          <Route path="/my-vaults" component={MyVaultsPage} />
          
          {/* Token section pages */}
          <Route path="/cvt-token" component={CvtTokenPage} />
          <Route path="/cvt-utility" component={CvtUtilityPage} />
          <Route path="/cvt-tokenomics" component={CvtTokenomicsPage} />
          <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
          <Route path="/gift-crypto" component={GiftCryptoPage} />
          <Route path="/token-vaults" component={TokenVaultsPage} />
          
          {/* Documentation section pages */}
          <Route path="/whitepaper" component={WhitepaperPage} />
          <Route path="/technical-specification" component={TechnicalSpecificationPage} />
          <Route path="/smart-contracts" component={SmartContractsPage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route path="/documentation" component={DocumentationPage} />
          <Route path="/audit-test" component={AuditTestPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/faq" component={FaqPage} />
          
          {/* 404 fallback */}
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;