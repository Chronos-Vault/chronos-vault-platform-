import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Layout } from "@/components/layout";

const Home = () => {
  const [_, setLocation] = useLocation();

  // Sample vault data for display purposes
  const sampleVault = {
    id: 1,
    userId: 1,
    name: "Legacy Vault",
    description: "My legacy assets for future generations",
    vaultType: "legacy",
    assetType: "ETH",
    assetAmount: "25.48",
    timeLockPeriod: 730, // 2 years
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    unlockDate: new Date(Date.now() + 640 * 24 * 60 * 60 * 1000), // ~1.75 years from now
    isLocked: true,
    securityLevel: 3,
    ethereumContractAddress: "0x1234...",
    solanaContractAddress: "9z4E...",
    tonContractAddress: "EQA9...",
    unlockConditionType: "date",
    privacyEnabled: true,
    metadata: {
      securityLayers: ["ethereum", "solana", "ton"],
      storageType: "ipfs",
      atomicSwapsEnabled: true,
      zkProofs: true
    }
  };

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.hash && anchor.hash.startsWith('#')) {
        e.preventDefault();
        const targetId = anchor.hash;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/10 blur-3xl opacity-50"></div>
          <div className="absolute top-80 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Main Hero Content */}
          <div className="relative">
            {/* Headline and Primary Content */}
            <div className="text-center mb-12">
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm">
                <span className="text-sm font-medium text-[#FF5AF7]">Introducing Revolutionary Multi-Chain Security</span>
              </div>
            
              <h1 className="font-poppins font-bold text-4xl md:text-7xl leading-tight mb-8">
                <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Decentralized Digital</span>
                <br />
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Chronos Vault Network</span>
              </h1>
              
              <div className="flex flex-wrap justify-center gap-3 items-center my-6">
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">Triple-Chain Security</span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">TON</span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">ETH</span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">SOL</span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">BTC</span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">Zero-Knowledge Proofs</span>
              </div>
            </div>
          </div>
        </div>
      </section>
          
      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-[#121212] to-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Revolutionary Features</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">Experience unparalleled security and innovation with our cutting-edge vault technology</p>
          </div>
            
          {/* Grid of features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Feature 1 */}
            <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40">
              <CardContent className="p-6">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Triple-Chain Security</h3>
                <p className="text-gray-300 mb-4">Leverage Ethereum for ownership, Solana for high-frequency monitoring, and TON for recovery mechanisms.</p>
                <Button variant="link" className="text-[#FF5AF7] p-0 hover:text-white" onClick={() => setLocation("/revolutionary-features")}>
                  Learn more →
                </Button>
              </CardContent>
            </Card>
            
            {/* Feature 2 */}
            <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 md:translate-y-4">
              <CardContent className="p-6">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Privacy</h3>
                <p className="text-gray-300 mb-4">Create vaults with zero-knowledge proofs for maximum privacy, allowing verification without revealing contents.</p>
                <Button variant="link" className="text-[#FF5AF7] p-0 hover:text-white" onClick={() => setLocation("/privacy-dashboard")}>
                  Learn more →
                </Button>
              </CardContent>
            </Card>
            
            {/* Feature 3 */}
            <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40">
              <CardContent className="p-6">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI-Enhanced Security</h3>
                <p className="text-gray-300 mb-4">Advanced machine learning models continuously monitor vault activity for anomaly detection and predictive security.</p>
                <Button variant="link" className="text-[#FF5AF7] p-0 hover:text-white" onClick={() => setLocation("/security-testing")}>
                  Learn more →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <Button
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-8 py-4 text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
              onClick={() => setLocation("/create-vault")}
            >
              Create Your First Vault
            </Button>
          </div>
        </div>
      </section>

      {/* Sample vault section */}
      <section className="py-16 md:py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Explore Sample Vaults</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">Discover how Chronos Vault can secure your assets across time with our sample vault templates</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VaultCard vault={sampleVault} onViewDetails={() => setLocation("/vault/1")} />
            
            <BitcoinHalvingVault onClick={() => setLocation("/bitcoin-halving-vault")} />
            
            <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] overflow-hidden border border-[#6B00D7]/30 hover:border-[#FF5AF7]/50 transition-all rounded-xl shadow-xl hover:shadow-[#6B00D7]/20 group">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 blur-2xl rounded-full opacity-60 pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#FF5AF7]/20 border border-[#FF5AF7]/30 text-[#FF5AF7] text-xs font-medium">
                    Cross-Chain
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-colors">Cross-Chain Gift Vault</h3>
                
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2 mr-3">
                    <div className="w-7 h-7 rounded-full bg-[#6B00D7]/30 flex items-center justify-center text-xs">Ξ</div>
                    <div className="w-7 h-7 rounded-full bg-[#6B00D7]/30 flex items-center justify-center text-xs">◎</div>
                    <div className="w-7 h-7 rounded-full bg-[#6B00D7]/30 flex items-center justify-center text-xs">₿</div>
                  </div>
                  <span className="text-sm text-gray-400">Multiple assets</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lock Period:</span>
                    <span className="text-white font-medium">Custom Trigger</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Security Level:</span>
                    <div className="flex">
                      <span className="h-4 w-4 rounded-full bg-[#FF5AF7]"></span>
                      <span className="h-4 w-4 rounded-full bg-[#FF5AF7]"></span>
                      <span className="h-4 w-4 rounded-full bg-[#FF5AF7]"></span>
                      <span className="h-4 w-4 rounded-full bg-[#FF5AF7]"></span>
                      <span className="h-4 w-4 rounded-full bg-gray-600"></span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 hover:from-[#6B00D7] hover:to-[#FF5AF7] text-white font-medium rounded transition-all border-none"
                  onClick={() => setLocation("/gift-crypto")}
                >
                  Explore Gift Vaults
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/create-vault">
              <Button variant="outline" className="border border-[#6B00D7] hover:bg-[#6B00D7]/10 text-white">
                View All Vault Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
