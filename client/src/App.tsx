import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MultiChainProvider } from "@/contexts/multi-chain-context";
import { TonProvider } from "@/contexts/ton-context";
import { SolanaProvider } from "@/contexts/solana-context";
import { EthereumProvider } from "@/contexts/ethereum-context";
import { CVTTokenProvider } from "@/contexts/cvt-token-context";

// Header and Footer now imported via the Layout component on each page
import Home from "@/pages/home";
import CreateVault from "@/pages/create-vault";
import AdvancedVaultCreationPage from "@/pages/advanced-vault-creation";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/create-vault" component={CreateVault} />
      <Route path="/advanced-vault" component={AdvancedVaultCreationPage} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MultiChainProvider>
          <TonProvider>
            <SolanaProvider>
              <EthereumProvider>
                <CVTTokenProvider>
                  {/* We'll continue using the individual providers for now
                      alongside our unified MultiChainProvider for backward compatibility */}
                  <Router />
                </CVTTokenProvider>
              </EthereumProvider>
            </SolanaProvider>
          </TonProvider>
        </MultiChainProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
