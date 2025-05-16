import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";

// Core Pages - Verified with exact file names
import Home from './pages/home';
import About from './pages/about';
import Faq from './pages/faq';
import NotFound from './pages/not-found';
import Documentation from './pages/documentation';

// Vault Creation Pages - Using exact file names
import CreateVault from './pages/create-vault-working';
import CreateTonVault from './pages/create-ton-vault';
import VaultSchool from './pages/vault-school';
import MyVaults from './pages/my-vaults';
import Whitepaper from './pages/whitepaper';

// Cross Chain Pages - Using exact file names
import CrossChainBridge from './pages/cross-chain-bridge';
import CrossChainVault from './pages/cross-chain-vault';

// Token Pages - Using exact file names
import CvtStaking from './pages/cvt-staking';
import CvtTokenomics from './pages/cvt-tokenomics';
import CvtUtility from './pages/cvt-utility';

// Specialized Vault Pages - Using exact file names
import BiometricVault from './pages/biometric-vault';
import GeoVault from './pages/geo-vault';
import SmartContractVault from './pages/smart-contract-vault';
import MultiSignatureVault from './pages/multi-signature-vault';
import SpecializedVaultMemory from './pages/specialized-vault-memory';
import InvestmentDisciplineVault from './pages/investment-discipline-vault';
import TonSpecificVault from './pages/ton-specific-vault';

// Security Pages - Using exact file names
import SecurityProtocols from './pages/security-protocols';
import CrossChainSecurity from './pages/cross-chain-security';
import SecurityVerificationDemo from './pages/security-verification-demo';

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
          
          {/* Token Pages */}
          <Route path="/staking" component={CvtStaking} />
          <Route path="/tokenomics" component={CvtTokenomics} />
          <Route path="/cvt-utility" component={CvtUtility} />
          
          {/* Specialized Vault Types */}
          <Route path="/biometric-vault" component={BiometricVault} />
          <Route path="/geo-vault" component={GeoVault} />
          <Route path="/smart-contract-vault" component={SmartContractVault} />
          <Route path="/multi-signature-vault" component={MultiSignatureVault} />
          <Route path="/specialized-vault-memory" component={SpecializedVaultMemory} />
          <Route path="/investment-discipline-vault" component={InvestmentDisciplineVault} />
          <Route path="/ton-specific-vault" component={TonSpecificVault} />
          
          {/* Security Pages */}
          <Route path="/security-protocols" component={SecurityProtocols} />
          <Route path="/cross-chain-security" component={CrossChainSecurity} />
          <Route path="/security-verification-demo" component={SecurityVerificationDemo} />
          
          {/* 404 - must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;