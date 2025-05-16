import { Route, Switch } from 'wouter';
import HomePage from './pages/home';
import NotFoundPage from './pages/not-found';
import CreateTonVaultPage from './pages/create-ton-vault';
import CrossChainBridgePage from './pages/cross-chain-bridge';
import CvtStakingPage from './pages/cvt-staking';
import { Toaster } from '@/components/ui/toaster';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/footer';

function App() {
  return (
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
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;