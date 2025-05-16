import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';
import { BlockchainErrorDisplay } from "@/contexts/blockchain-error-boundary";

// Import core pages
import Home from './pages/home';
import NotFound from './pages/not-found';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import Whitepaper from './pages/whitepaper';

// Only import critical pages that need to be directly defined
function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <BlockchainErrorDisplay />
        <Switch>
          {/* Core pages with static imports */}
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/faq" component={Faq} />
          <Route path="/whitepaper" component={Whitepaper} />
          
          {/* Create Vault page */}
          <Route path="/create-vault">
            {() => {
              const CreateVault = require('./pages/create-vault').default;
              return <CreateVault />;
            }}
          </Route>
          
          {/* TON Vault page */}
          <Route path="/create-ton-vault">
            {() => {
              const CreateTonVault = require('./pages/create-ton-vault').default;
              return <CreateTonVault />;
            }}
          </Route>
          
          {/* Staking page */}
          <Route path="/staking">
            {() => {
              const CvtStaking = require('./pages/cvt-staking').default;
              return <CvtStaking />;
            }}
          </Route>
          
          {/* Cross-chain bridge page */}
          <Route path="/bridge">
            {() => {
              const CrossChainBridge = require('./pages/cross-chain-bridge').default;
              return <CrossChainBridge />;
            }}
          </Route>
          
          <Route path="/cross-chain-bridge">
            {() => {
              const CrossChainBridge = require('./pages/cross-chain-bridge').default;
              return <CrossChainBridge />;
            }}
          </Route>
          
          {/* My Vaults page */}
          <Route path="/my-vaults">
            {() => {
              const MyVaults = require('./pages/my-vaults').default;
              return <MyVaults />;
            }}
          </Route>
          
          {/* Specialized vault types */}
          <Route path="/smart-contract-vault">
            {() => {
              const SmartContractVault = require('./pages/smart-contract-vault').default;
              return <SmartContractVault />;
            }}
          </Route>
          
          <Route path="/biometric-vault">
            {() => {
              const BiometricVault = require('./pages/biometric-vault').default;
              return <BiometricVault />;
            }}
          </Route>
          
          <Route path="/geo-vault">
            {() => {
              const GeoVault = require('./pages/geo-vault').default;
              return <GeoVault />;
            }}
          </Route>
          
          <Route path="/multi-signature-vault">
            {() => {
              const MultiSignatureVault = require('./pages/multi-signature-vault').default;
              return <MultiSignatureVault />;
            }}
          </Route>
          
          <Route path="/multi-signature-vault-new">
            {() => {
              const MultiSignatureVaultNew = require('./pages/multi-signature-vault-new').default;
              return <MultiSignatureVaultNew />;
            }}
          </Route>
          
          <Route path="/specialized-vault-memory">
            {() => {
              const SpecializedVaultMemory = require('./pages/specialized-vault-memory').default;
              return <SpecializedVaultMemory />;
            }}
          </Route>
          
          <Route path="/investment-discipline-vault">
            {() => {
              const InvestmentDisciplineVault = require('./pages/investment-discipline-vault').default;
              return <InvestmentDisciplineVault />;
            }}
          </Route>
          
          {/* Cross-chain pages */}
          <Route path="/cross-chain-vault">
            {() => {
              const CrossChainVault = require('./pages/cross-chain-vault').default;
              return <CrossChainVault />;
            }}
          </Route>
          
          <Route path="/cross-chain-monitor">
            {() => {
              const CrossChainMonitor = require('./pages/cross-chain-monitor').default;
              return <CrossChainMonitor />;
            }}
          </Route>
          
          <Route path="/cross-chain-security">
            {() => {
              const CrossChainSecurity = require('./pages/cross-chain-security').default;
              return <CrossChainSecurity />;
            }}
          </Route>
          
          <Route path="/ton-specific-vault">
            {() => {
              const TonSpecificVault = require('./pages/ton-specific-vault').default;
              return <TonSpecificVault />;
            }}
          </Route>
          
          <Route path="/ton-wallet-cross-chain-bridge">
            {() => {
              const TonWalletCrossChainBridge = require('./pages/ton-wallet-cross-chain-bridge').default;
              return <TonWalletCrossChainBridge />;
            }}
          </Route>
          
          {/* 404 - must be last */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;