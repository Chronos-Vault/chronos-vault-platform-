import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

import Home from './pages/home';
import NotFound from './pages/not-found';

// Directly import all page components we need
import Documentation from './pages/documentation';
import CrossChainBridge from './pages/cross-chain-bridge';
import CreateTonVault from './pages/create-ton-vault';
import CvtStaking from './pages/cvt-staking';
import About from './pages/about';
import BiometricVault from './pages/biometric-vault';
import CrossChainVault from './pages/cross-chain-vault';
import GeoVault from './pages/geo-vault';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import VaultSchool from './pages/vault-school';
import MultiSignatureVault from './pages/multi-signature-vault';
import MultiSignatureVaultNew from './pages/multi-signature-vault-new';
import CrossChainMonitor from './pages/cross-chain-monitor';
import TransactionMonitor from './pages/transaction-monitor';
import TransactionVerification from './pages/transaction-verification';
import CrossChainAtomicSwap from './pages/cross-chain-atomic-swap';
import CrossChainVsAtomicSwap from './pages/cross-chain-vs-atomic-swap';
import CrossChainSecurity from './pages/cross-chain-security';
import SecurityVerificationDemo from './pages/security-verification-demo';
import MyVaults from './pages/my-vaults';
import CvtToken from './pages/cvt-token';
import CvtUtility from './pages/cvt-utility';
import CvtTokenomics from './pages/cvt-tokenomics';
import BitcoinHalving from './pages/bitcoin-halving';
import GiftCrypto from './pages/gift-crypto';
import TokenVaults from './pages/token-vaults';
import Whitepaper from './pages/whitepaper';
import TechnicalSpecification from './pages/technical-specification';
import SmartContracts from './pages/smart-contracts';
import Roadmap from './pages/roadmap';
import AuditTest from './pages/audit-test';
import Faq from './pages/faq';
import SmartContractVault from './pages/smart-contract-vault';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route path="/create-vault" component={CreateTonVault} />
          <Route path="/staking" component={CvtStaking} />
          <Route path="/about" component={About} />
          <Route path="/vault-school" component={VaultSchool} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNew} />
          <Route path="/cross-chain-monitor" component={CrossChainMonitor} />
          <Route path="/transaction-monitor" component={TransactionMonitor} />
          <Route path="/transaction-verification" component={TransactionVerification} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwap} />
          <Route path="/cross-chain-vs-atomic-swap" component={CrossChainVsAtomicSwap} />
          <Route path="/cross-chain-security" component={CrossChainSecurity} />
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/cvt-token" component={CvtToken} />
          <Route path="/cvt-utility" component={CvtUtility} />
          <Route path="/cvt-tokenomics" component={CvtTokenomics} />
          <Route path="/bitcoin-halving" component={BitcoinHalving} />
          <Route path="/gift-crypto" component={GiftCrypto} />
          <Route path="/token-vaults" component={TokenVaults} />
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/technical-specification" component={TechnicalSpecification} />
          <Route path="/smart-contracts" component={SmartContracts} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/audit-test" component={AuditTest} />
          <Route path="/faq" component={Faq} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;