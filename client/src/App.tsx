import { Route, Switch, Link } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';

// Import all pages directly
import Home from './pages/home';
import NotFound from './pages/not-found';
import Documentation from './pages/documentation';
import About from './pages/about';
import Faq from './pages/faq';
import CrossChainBridge from './pages/cross-chain-bridge';
import CreateVault from './pages/create-vault';
import CreateTonVault from './pages/create-ton-vault';
import CvtStaking from './pages/cvt-staking';
import BiometricVault from './pages/biometric-vault';
import CrossChainVault from './pages/cross-chain-vault';
import GeoVault from './pages/geo-vault';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import MultiSignatureVaultNew from './pages/multi-signature-vault-new';
import VaultSchool from './pages/vault-school';
import MyVaults from './pages/my-vaults';
import Whitepaper from './pages/whitepaper';
import AuditTest from './pages/audit-test';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={Faq} />
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route path="/create-vault" component={CreateVault} />
          <Route path="/create-ton-vault" component={CreateTonVault} />
          <Route path="/staking" component={CvtStaking} />
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/multi-signature-vault-new" component={MultiSignatureVaultNew} />
          <Route path="/vault-school" component={VaultSchool} />
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/audit-test" component={AuditTest} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;