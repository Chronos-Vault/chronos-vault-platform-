import { Route, Switch } from 'wouter';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import CreateTonVaultPage from './pages/create-ton-vault';
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CvtStakingPage from './pages/cvt-staking';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/footer';

// Import only pages that exist in the project
import CrossChainMonitor from './pages/cross-chain-monitor';
import TransactionMonitor from './pages/transaction-monitor';
import TransactionVerification from './pages/transaction-verification';
import CrossChainAtomicSwap from './pages/cross-chain-atomic-swap';
import CrossChainSecurity from './pages/cross-chain-security';
import MyVaults from './pages/my-vaults';
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVaultNew from './pages/multi-signature-vault-new';
import BiometricVault from './pages/biometric-vault';
import CrossChainVault from './pages/cross-chain-vault';
import GeoVault from './pages/geo-vault';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import SecurityVerificationDemo from './pages/security-verification-demo';
import BitcoinHalving from './pages/bitcoin-halving';
import CvtToken from './pages/cvt-token';
import CvtUtility from './pages/cvt-utility';
import CvtTokenomics from './pages/cvt-tokenomics';
import Whitepaper from './pages/whitepaper';
import TechnicalSpecification from './pages/technical-specification';
import SmartContracts from './pages/smart-contracts';
import Roadmap from './pages/roadmap';
import Documentation from './pages/documentation';
import VaultSchool from './pages/vault-school';
import GiftCrypto from './pages/gift-crypto';
import TokenVaults from './pages/token-vaults';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          {/* Vault Routes */}
          <Route path="/create-vault" component={CreateTonVaultPage} />
          <Route path="/my-vaults" component={MyVaults} />
          
          {/* Specialized Vault Types */}
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNew} />
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          
          {/* Blockchain and Bridge Routes */}
          <Route path="/cross-chain-monitor" component={CrossChainMonitor} />
          <Route path="/transaction-monitor" component={TransactionMonitor} />
          <Route path="/transaction-verification" component={TransactionVerification} />
          <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
          <Route path="/cross-chain-atomic-swap" component={CrossChainAtomicSwap} />
          <Route path="/cross-chain-security" component={CrossChainSecurity} />
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          
          {/* Token and Finance Routes */}
          <Route path="/staking" component={CvtStakingPage} />
          <Route path="/bitcoin-halving" component={BitcoinHalving} />
          <Route path="/cvt-token" component={CvtToken} />
          <Route path="/cvt-utility" component={CvtUtility} />
          <Route path="/cvt-tokenomics" component={CvtTokenomics} />
          <Route path="/gift-crypto" component={GiftCrypto} />
          <Route path="/token-vaults" component={TokenVaults} />
          
          {/* Documentation and Info Routes */}
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/technical-specification" component={TechnicalSpecification} />
          <Route path="/smart-contracts" component={SmartContracts} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/vault-school" component={VaultSchool} />
          
          {/* Fallback */}
          <Route component={NotFoundPage} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;