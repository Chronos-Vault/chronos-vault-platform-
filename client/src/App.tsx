import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import MainHeader from './components/layout/MainHeader';
import Footer from './components/layout/footer';
import Home from './pages/home';
import NotFound from './pages/not-found';
import React from 'react';

// Directly import key pages
import Documentation from './pages/documentation';
import CrossChainBridge from './pages/cross-chain-bridge';
import CreateTonVault from './pages/create-ton-vault';
import CvtStaking from './pages/cvt-staking';

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MainHeader />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/documentation" component={Documentation} />
          <Route path="/bridge" component={CrossChainBridge} />
          <Route path="/cross-chain-bridge" component={CrossChainBridge} />
          <Route path="/create-vault" component={CreateTonVault} />
          <Route path="/staking" component={CvtStaking} />
          
          {/* Catch-all placeholder for other routes */}
          <Route path="/:rest*">
            {(params) => {
              const pagePath = params.rest || '';
              const formattedTitle = pagePath
                .split('-')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              return (
                <div className="container mx-auto px-4 py-16">
                  <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 p-12 rounded-2xl shadow-lg border border-purple-500/20">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-6">
                      {formattedTitle || 'Page Not Found'}
                    </h1>
                    <p className="text-xl text-gray-200 mb-8">
                      Our engineers are currently working on this page. It will be available soon.
                    </p>
                    <div className="flex items-center gap-4 text-gray-300">
                      <div className="animate-pulse w-4 h-4 rounded-full bg-[#FF5AF7]"></div>
                      <span>Secure connection established</span>
                    </div>
                  </div>
                </div>
              );
            }}
          </Route>
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;