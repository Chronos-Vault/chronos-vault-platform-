import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';

// Import core pages directly
import Home from './pages/home';
import NotFound from './pages/not-found';
import About from './pages/about';
import Documentation from './pages/documentation';
import Faq from './pages/faq';
import CreateVault from './pages/create-vault';
import CreateTonVault from './pages/create-ton-vault';
import CrossChainBridge from './pages/cross-chain-bridge';

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
          <Route path="/create-vault" component={CreateVault} />
          <Route path="/create-ton-vault" component={CreateTonVault} />
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;