import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MultiChainProvider } from "@/contexts/multi-chain-context";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import CreateVault from "@/pages/create-vault";
import MyVaults from "@/pages/my-vaults";
import VaultDetails from "@/pages/vault-details";
import About from "@/pages/about";
import BitcoinHalvingPage from "@/pages/bitcoin-halving";
import BitcoinHalvingVaultPage from "@/pages/bitcoin-halving-vault";
import RoadmapPage from "@/pages/roadmap";
import CVTTokenPage from "@/pages/cvt-token";
import TokenVaultsPage from "@/pages/token-vaults";
import CrossChainPage from "@/pages/cross-chain";
import TONIntegrationPage from "@/pages/ton-integration";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/create-vault" component={CreateVault} />
          <Route path="/my-vaults" component={MyVaults} />
          <Route path="/vault/:id" component={VaultDetails} />
          <Route path="/about" component={About} />
          <Route path="/bitcoin-halving" component={BitcoinHalvingPage} />
          <Route path="/bitcoin-halving-vault" component={BitcoinHalvingVaultPage} />
          <Route path="/roadmap" component={RoadmapPage} />
          <Route path="/cvt-token" component={CVTTokenPage} />
          <Route path="/token-vaults" component={TokenVaultsPage} />
          <Route path="/cross-chain" component={CrossChainPage} />
          <Route path="/ton-integration" component={TONIntegrationPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MultiChainProvider>
          <Router />
        </MultiChainProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
