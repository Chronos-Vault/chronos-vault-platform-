import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';

import Home from './pages/home';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import NotFound from './pages/not-found';

// This ensures that the app works without trying to do complicated dynamic imports
function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/faq" component={Faq} />
          
          <Route path="/create-vault">
            {() => {
              try {
                // We use a direct require instead of import to avoid issues with the bundler
                const CreateVault = require('./pages/create-vault').default;
                return <CreateVault />;
              } catch (err) {
                console.error("Error loading Create Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/create-ton-vault">
            {() => {
              try {
                const CreateTonVault = require('./pages/create-ton-vault').default;
                return <CreateTonVault />;
              } catch (err) {
                console.error("Error loading Create TON Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/bridge">
            {() => {
              try {
                const CrossChainBridge = require('./pages/cross-chain-bridge').default;
                return <CrossChainBridge />;
              } catch (err) {
                console.error("Error loading Bridge page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/cross-chain-bridge">
            {() => {
              try {
                const CrossChainBridge = require('./pages/cross-chain-bridge').default;
                return <CrossChainBridge />;
              } catch (err) {
                console.error("Error loading Cross Chain Bridge page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/staking">
            {() => {
              try {
                const CvtStaking = require('./pages/cvt-staking').default;
                return <CvtStaking />;
              } catch (err) {
                console.error("Error loading Staking page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/my-vaults">
            {() => {
              try {
                const MyVaults = require('./pages/my-vaults').default;
                return <MyVaults />;
              } catch (err) {
                console.error("Error loading My Vaults page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/biometric-vault">
            {() => {
              try {
                const BiometricVault = require('./pages/biometric-vault').default;
                return <BiometricVault />;
              } catch (err) {
                console.error("Error loading Biometric Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/geo-vault">
            {() => {
              try {
                const GeoVault = require('./pages/geo-vault').default;
                return <GeoVault />;
              } catch (err) {
                console.error("Error loading Geo Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/smart-contract-vault">
            {() => {
              try {
                const SmartContractVault = require('./pages/smart-contract-vault').default;
                return <SmartContractVault />;
              } catch (err) {
                console.error("Error loading Smart Contract Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/multi-signature-vault">
            {() => {
              try {
                const MultiSignatureVault = require('./pages/multi-signature-vault').default;
                return <MultiSignatureVault />;
              } catch (err) {
                console.error("Error loading Multi Signature Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/specialized-vault-memory">
            {() => {
              try {
                const SpecializedVaultMemory = require('./pages/specialized-vault-memory').default;
                return <SpecializedVaultMemory />;
              } catch (err) {
                console.error("Error loading Specialized Vault Memory page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/investment-discipline-vault">
            {() => {
              try {
                const InvestmentDisciplineVault = require('./pages/investment-discipline-vault').default;
                return <InvestmentDisciplineVault />;
              } catch (err) {
                console.error("Error loading Investment Discipline Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/whitepaper">
            {() => {
              try {
                const Whitepaper = require('./pages/whitepaper').default;
                return <Whitepaper />;
              } catch (err) {
                console.error("Error loading Whitepaper page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/vault-school">
            {() => {
              try {
                const VaultSchool = require('./pages/vault-school').default;
                return <VaultSchool />;
              } catch (err) {
                console.error("Error loading Vault School page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/cross-chain-vault">
            {() => {
              try {
                const CrossChainVault = require('./pages/cross-chain-vault').default;
                return <CrossChainVault />;
              } catch (err) {
                console.error("Error loading Cross Chain Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route path="/ton-specific-vault">
            {() => {
              try {
                const TonSpecificVault = require('./pages/ton-specific-vault').default;
                return <TonSpecificVault />;
              } catch (err) {
                console.error("Error loading TON Specific Vault page:", err);
                return <NotFound />;
              }
            }}
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;