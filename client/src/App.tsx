import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";

// Import pages using the correct filenames found in the pages directory
import Home from './pages/home';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import NotFound from './pages/not-found';
import CreateVault from './pages/create-vault';
import CreateTonVault from './pages/create-ton-vault';
import CrossChainBridge from './pages/cross-chain-bridge';
import CvtStaking from './pages/cvt-staking';
import MyVaults from './pages/my-vaults';
import Whitepaper from './pages/whitepaper';
import VaultSchool from './pages/vault-school';
import BiometricVault from './pages/biometric-vault';
import GeoVault from './pages/geo-vault';
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import CrossChainVault from './pages/cross-chain-vault';
import TonSpecificVault from './pages/ton-specific-vault';

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
          <Route path="/whitepaper" component={Whitepaper} />
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/vault-school" component={VaultSchool} />
          
          {/* Vault Creation Pages */}
          <Route path="/create-vault" component={CreateVault} />
          <Route path="/create-ton-vault" component={CreateTonVault} />
          
          {/* Cross Chain Pages */}
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-vault" component={CrossChainVault} />
          
          {/* CVT Token Pages */}
          <Route path="/staking" component={CvtStaking} />
          
          {/* Specialized Vault Types */}
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/ton-specific-vault" component={TonSpecificVault} />
          
          {/* 404 - must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;