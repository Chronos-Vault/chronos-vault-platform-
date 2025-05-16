import { Route, Switch } from 'wouter';
import Home from './pages/home';
import NotFound from './pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';

// Direct imports to avoid any issues with lazy loading
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CvtStakingPage from './pages/cvt-staking';
import CreateTonVaultPage from './pages/create-ton-vault';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/bridge" component={CrossChainBridgePage} />
          <Route path="/cross-chain-bridge" component={CrossChainBridgePage} />
          <Route path="/create-vault" component={CreateTonVaultPage} />
          <Route path="/staking" component={CvtStakingPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;