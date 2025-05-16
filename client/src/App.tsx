import { Route, Switch } from 'wouter';
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CreateTonVaultPage from './pages/create-ton-vault';
import CvtStakingPage from './pages/cvt-staking';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import { BlockchainProvider } from './hooks/blockchain-context';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/bridge" component={CrossChainBridgePage} />
            <Route path="/create-vault" component={CreateTonVaultPage} />
            <Route path="/staking" component={CvtStakingPage} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
        <Toaster />
      </div>
    </BlockchainProvider>
  );
}

export default App;