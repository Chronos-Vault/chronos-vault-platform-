import { Switch, Route, useLocation } from "wouter";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MultiChainProvider } from "@/contexts/multi-chain-context";
import { TonProvider } from "@/contexts/ton-context";
import { SolanaProvider } from "@/contexts/solana-context";
import { EthereumProvider } from "@/contexts/ethereum-context";
import { CVTTokenProvider } from "@/contexts/cvt-token-context";
import Layout from "@/components/layout/Layout";

// Pages
import Home from "@/pages/home";
import CreateVault from "@/pages/create-vault";
import CreateVaultEnhancedPage from "@/pages/create-vault-enhanced";
import AdvancedVaultCreationPage from "@/pages/advanced-vault-creation";
import AdvancedVaultCreationNewPage from "@/pages/advanced-vault-creation-new";
import VaultTypesSelector from "@/pages/vault-types-selector";
import SpecializedVaultCreationPage from "@/pages/specialized-vault-creation";
import MyVaults from "@/pages/my-vaults";
import VaultDetails from "@/pages/vault-details";
import About from "@/pages/about";
import BitcoinHalvingPage from "@/pages/bitcoin-halving";
import BitcoinHalvingVaultPage from "@/pages/bitcoin-halving-vault";
import RoadmapPage from "@/pages/roadmap";
import CVTTokenPage from "@/pages/cvt-token";
import TokenVaultsPage from "@/pages/token-vaults";
import CrossChainPage from "@/pages/cross-chain";
import CrossChainVaultPage from "@/pages/cross-chain-vault";
import CrossChainSecurityPage from "@/pages/cross-chain-security";
import TONIntegrationPage from "@/pages/ton-integration";
import SolanaIntegrationPage from "@/pages/solana-integration";
import EthereumIntegrationPage from "@/pages/ethereum-integration";
import GiftCryptoPage from "@/pages/gift-crypto";
import RevolutionaryFeaturesPage from "@/pages/revolutionary-features";
import DocumentationPage from "@/pages/documentation";
import TechnicalSpecificationPage from "@/pages/technical-specification";
import CVTTokenomicsPage from "@/pages/cvt-tokenomics";
import WhitepaperPage from "@/pages/whitepaper";
import PrivacyDashboardPage from "@/pages/privacy-dashboard";
import SecurityTestingPage from "@/pages/security-testing";
import NotFound from "@/pages/not-found";
import TestContractPage from "@/pages/test-contract";
import WalletManagerPage from "@/pages/wallet-manager";

// Redirect component for wouter
function Redirect({ to }: { to: string }) {
  const [_, navigate] = useLocation();
  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/create-vault" component={CreateVault} />
        <Route path="/create-vault-enhanced" component={() => <Redirect to="/create-vault" />} />
        <Route path="/vault-types" component={() => <Redirect to="/create-vault" />} />
        <Route path="/advanced-vault" component={() => <Redirect to="/create-vault" />} />
        <Route path="/advanced-vault-new" component={() => <Redirect to="/create-vault" />} />
        <Route path="/specialized-vault" component={() => <Redirect to="/create-vault" />} />
        <Route path="/specialized-vault-creation" component={() => <Redirect to="/create-vault" />} />
        <Route path="/my-vaults" component={MyVaults} />
        <Route path="/vault/:id" component={VaultDetails} />
        <Route path="/about" component={About} />
        <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
        <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVaultPage} />
        <Route path="/roadmap" component={RoadmapPage} />
        <Route path="/cvt-token" component={CVTTokenPage} />
        <Route path="/token-vaults" component={TokenVaultsPage} />
        <Route path="/cross-chain" component={CrossChainPage} />
        <Route path="/cross-chain-vault" component={CrossChainVaultPage} />
        <Route path="/cross-chain-security" component={CrossChainSecurityPage} />
        <Route path="/ton-integration" component={TONIntegrationPage} />
        <Route path="/solana-integration" component={SolanaIntegrationPage} />
        <Route path="/ethereum-integration" component={EthereumIntegrationPage} />
        <Route path="/gift-crypto" component={GiftCryptoPage} />
        <Route path="/revolutionary-features" component={RevolutionaryFeaturesPage} />
        <Route path="/documentation" component={DocumentationPage} />
        <Route path="/technical-specification" component={TechnicalSpecificationPage} />
        <Route path="/cvt-tokenomics" component={CVTTokenomicsPage} />
        <Route path="/whitepaper" component={WhitepaperPage} />
        <Route path="/privacy-dashboard" component={PrivacyDashboardPage} />
        <Route path="/security-testing" component={SecurityTestingPage} />
        <Route path="/test-contract" component={TestContractPage} />
        <Route path="/wallet-manager" component={WalletManagerPage} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </Layout>
  );
}

function App() {
  return (
    <TooltipProvider>
      <EthereumProvider>
        <SolanaProvider>
          <TonProvider>
            <MultiChainProvider>
              <CVTTokenProvider>
                <Router />
              </CVTTokenProvider>
            </MultiChainProvider>
          </TonProvider>
        </SolanaProvider>
      </EthereumProvider>
    </TooltipProvider>
  );
}

export default App;
