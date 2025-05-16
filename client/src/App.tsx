import { Route, Switch } from 'wouter';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import React from 'react';

// Import pages that we know work correctly
import Home from './pages/home';
import About from './pages/about';
import Faq from './pages/faq';
import NotFound from './pages/not-found';

// Add Documentation page
import Documentation from './pages/documentation';

// Try to add a few more essential pages
import CrossChainBridge from './pages/cross-chain-bridge';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/faq" component={Faq} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;