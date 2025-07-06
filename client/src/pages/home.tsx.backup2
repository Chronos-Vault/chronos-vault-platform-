import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

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
    crossChainEnabled: true,
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
    <div className="flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white font-poppins">
      <main className="flex-1">
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
                  <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Next-Generation</span>
                  <br />
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Digital Asset Security</span>
                </h1>
                
                <div className="flex flex-wrap justify-center gap-2 items-center my-6 max-w-md mx-auto">
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Triple-Chain Security</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">TON</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">ETH</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">SOL</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">BTC</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Zero-Knowledge</span>
                </div>
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mt-8 leading-relaxed">
                  Create tamper-proof digital and financial vaults with revolutionary technologies: Triple-Chain Security, Cross-Chain Atomic Swaps, and IPFS/Arweave permanent storage integration.
                </p>
                <p className="text-xl md:text-2xl bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] inline-block text-transparent bg-clip-text font-bold mt-2 animate-text-shine bg-300%">
                  The ultimate solution for protecting what matters most across time and chains.
                </p>
                <div className="flex items-center justify-center mt-4 mb-2">
                  <div className="px-6 py-3 bg-[#1A1A1A]/80 border border-[#6B00D7]/30 rounded-xl inline-flex items-center">
                    <span className="text-[#FF5AF7] mr-2">💰</span>
                    <span className="text-white font-medium">Now with multi-chain payments! Create vaults using</span>
                    <div className="ml-2 flex items-center space-x-2">
                      <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">ETH</span>
                      <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">SOL</span>
                      <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">TON</span>
                      <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">BTC</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-6 mt-10">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center max-w-md sm:max-w-none mx-auto">
                    <Button 
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all w-full sm:w-auto"
                      onClick={() => setLocation("/create-vault-enhanced")}
                    >
                      <div className="flex items-center">
                        <span>Create Your Vault</span>
                        <div className="flex -space-x-1 ml-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-bold">ETH</div>
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-bold">SOL</div>
                          <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] font-bold">TON</div>
                          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-[8px] font-bold">BTC</div>
                        </div>
                      </div>
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#00D7C3] to-[#6B00D7] hover:from-[#00C7B3] hover:to-[#5500AB] text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#00D7C3]/40 transition-all w-full sm:w-auto"
                      onClick={() => setLocation("/specialized-vault")}
                    >
                      <span className="mr-2">✨</span>Advanced Vaults
                    </Button>

                  </div>
                  
                  {/* Large security testing button */}
                  <div className="flex justify-center gap-4 mt-4 mb-6 w-full max-w-md mx-auto">
                    <Button
                      variant="default"
                      className="bg-[#FF5AF7] hover:bg-[#6B00D7] text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all animate-pulse-subtle w-full"
                      onClick={() => setLocation("/security-testing")}
                    >
                      <span className="text-base sm:text-xl mr-2">🔒</span> Security Dashboard
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 max-w-md sm:max-w-none mx-auto">
                    <Button
                      variant="outline"
                      className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-3 sm:px-5 py-2 text-xs sm:text-md flex items-center gap-1 sm:gap-2 transition-all w-[45%] sm:w-auto justify-center"
                      onClick={() => setLocation("/solana-integration")}
                    >
                      <span className="text-sm sm:text-lg">◎</span> <span>Solana</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-3 sm:px-5 py-2 text-xs sm:text-md flex items-center gap-1 sm:gap-2 transition-all w-[45%] sm:w-auto justify-center"
                      onClick={() => setLocation("/ton-integration")}
                    >
                      <span className="text-sm sm:text-lg">💎</span> <span>TON</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-3 sm:px-5 py-2 text-xs sm:text-md flex items-center gap-1 sm:gap-2 transition-all w-[92%] sm:w-auto justify-center"
                      onClick={() => setLocation("/cross-chain")}
                    >
                      <span className="text-sm sm:text-lg">🔄</span> <span>Cross-Chain Features</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Chain Architecture Section - Moved up as requested */}
        <section className="py-16 md:py-20 bg-[#121212] overflow-hidden relative border-t border-[#6B00D7]/20">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-full bg-[#6B00D7]/10 blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-[#FF5AF7]/10 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Multi-Blockchain Architecture</h2>
                <p className="text-gray-300 mb-8 text-lg">Chronos Vault leverages the unique capabilities of multiple blockchains to provide enhanced security, performance, and functionality.</p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <i className="ri-shield-check-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Triple-Chain Security</h3>
                      <p className="text-gray-400">Your assets are secured across multiple blockchains, creating redundancy and enhanced protection that no single-chain solution can match.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <i className="ri-link-m text-xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Cross-Chain Interoperability</h3>
                      <p className="text-gray-400">Seamlessly manage assets across TON, Ethereum, Solana, and other blockchains with our unified interface and cross-chain bridge technology.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <i className="ri-pie-chart-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Optimized Performance</h3>
                      <p className="text-gray-400">We select the ideal blockchain for each operation - TON for speed, Ethereum for smart contracts, Arweave for storage - giving you the best of each network.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 order-1 lg:order-2 relative">
                <div className="relative max-w-lg mx-auto">
                  {/* Main hexagon */}
                  <div className="relative h-72 md:h-96 border-2 border-[#6B00D7]/30 bg-gradient-to-br from-[#121212] to-[#1A1A1A] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#6B00D7]/10">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">CVT</span>
                      </div>
                    </div>
                    
                    {/* Blockchain connections */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* TON */}
                      <div className="absolute top-10 left-10 md:top-14 md:left-20 flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold">TON</span>
                        </div>
                        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-[#6B00D7] to-transparent transform rotate-45 origin-left"></div>
                      </div>
                      
                      {/* Ethereum */}
                      <div className="absolute top-10 right-10 md:top-14 md:right-20 flex items-center">
                        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-l from-[#6B00D7] to-transparent transform -rotate-45 origin-right"></div>
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold">ETH</span>
                        </div>
                      </div>
                      
                      {/* Solana */}
                      <div className="absolute bottom-10 left-10 md:bottom-14 md:left-20 flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold">SOL</span>
                        </div>
                        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-r from-[#6B00D7] to-transparent transform -rotate-45 origin-left"></div>
                      </div>
                      
                      {/* Arweave */}
                      <div className="absolute bottom-10 right-10 md:bottom-14 md:right-20 flex items-center">
                        <div className="w-16 md:w-24 h-0.5 bg-gradient-to-l from-[#6B00D7] to-transparent transform rotate-45 origin-right"></div>
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center shadow-lg">
                          <span className="text-white font-semibold text-xs">AR</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-7xl mx-auto">
              {/* Feature 1 */}
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
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
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 md:translate-y-4 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
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
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
                  <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Cross-Chain Architecture</h3>
                  <p className="text-gray-300 mb-4">Unified architecture across TON, Ethereum, Solana, and more with secure bridge mechanics for seamless operation.</p>
                  <Button variant="link" className="text-[#FF5AF7] p-0 hover:text-white" onClick={() => setLocation("/cross-chain")}>
                    Learn more →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CVT Token Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#121212] to-[#18121E]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">ChronosToken (CVT)</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">A revolutionary deflationary token model optimized for long-term value preservation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-[#1A1A1A]/70 border border-[#6B00D7]/20 shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Token Economics</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[#6B00D7]/10 pb-3">
                    <span className="text-lg text-gray-300">Total Supply</span>
                    <span className="text-xl font-bold text-white">21,000,000 CVT</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-[#6B00D7]/10 pb-3">
                    <span className="text-lg text-gray-300">Distribution Period</span>
                    <span className="text-xl font-bold text-white">21 Years</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-[#6B00D7]/10 pb-3">
                    <span className="text-lg text-gray-300">Mechanism</span>
                    <span className="text-xl font-bold text-white">Deflationary Burning</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-300">Primary Blockchain</span>
                    <span className="text-xl font-bold text-white">TON Network</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold py-3 rounded-lg shadow-glow"
                    onClick={() => setLocation("/cvt-tokenomics")}
                  >
                    View Full Tokenomics
                  </Button>
                </div>
              </div>
              
              <div className="bg-[#1A1A1A]/70 border border-[#6B00D7]/20 shadow-lg rounded-lg p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Token Utility</h3>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#FF5AF7] text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Platform Fee Payment</h4>
                      <p className="text-gray-300">Native token for all platform services with fee reductions for holders</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#FF5AF7] text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Security Staking</h4>
                      <p className="text-gray-300">Stake required for high-value vault access and enhanced security features</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#FF5AF7] text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">Governance Rights</h4>
                      <p className="text-gray-300">Proportional voting weight in platform governance decisions</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 hover:text-white font-bold py-3 rounded-lg"
                    onClick={() => setLocation("/whitepaper")}
                  >
                    Read Whitepaper
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Enhanced Security Architecture Section - Consolidated */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#18121E] to-[#1A0833] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-25">
            <div className="absolute top-[30%] left-[20%] w-64 h-64 rounded-full bg-[#6B00D7]/5 blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Advanced Security Architecture</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Military-grade protection through triple-chain security, advanced cryptography, and cross-chain verification</p>
            </div>
            
            {/* Security Architecture Overview */}
            <div className="bg-[#1A1A1A]/80 border border-[#6B00D7]/30 rounded-xl shadow-2xl p-6 md:p-10 max-w-5xl mx-auto mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Multi-Signature Security
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Customizable threshold signatures requiring multiple approvers for enhanced security</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Time-delayed execution with optional emergency cancellation</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Hierarchical role-based access for organizational control</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    Cryptographic Protection
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Zero-knowledge verification for privacy with state-of-the-art encryption</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Quantum-resistant cryptographic algorithms for future-proof security</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Homomorphic encryption allowing computations on encrypted data</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Triple-Chain Security
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Cross-chain validation requiring multiple blockchains to verify access</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Redundant storage across multiple chains with atomic verification</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">✓</span>
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm">Recovery mechanisms using secondary chain consensus if primary is compromised</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold py-3 px-8 rounded-lg shadow-glow"
                  onClick={() => setLocation("/security-testing")}
                >
                  Explore Security Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sample vault section */}
        <section className="py-16 md:py-20 bg-[#121212] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 -right-40 w-80 h-80 rounded-full bg-[#6B00D7]/10 blur-[100px]"></div>
          <div className="absolute bottom-40 -left-20 w-60 h-60 rounded-full bg-[#FF5AF7]/10 blur-[100px]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Explore Sample Vaults</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Discover how Chronos Vault can secure your digital wealth across time with our revolutionary vault templates</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Legacy Vault */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 shadow-xl hover:shadow-[#6B00D7]/30 transition-all hover:translate-y-[-5px] overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <CardContent className="p-6">
                  <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-all border border-[#6B00D7]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-all">Legacy Vault</h3>
                  <p className="text-gray-300 mb-5">Create a secure container for your digital assets with customizable time locks, beneficiaries, and multi-signature security.</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Customizable inheritance conditions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Multi-chain security verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Encrypted document storage</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg py-2 shadow-glow transition-all"
                    onClick={() => setLocation("/create-vault")}
                  >
                    Create Legacy Vault
                  </Button>
                </CardContent>
              </Card>
              
              {/* Investment Vault */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 shadow-xl hover:shadow-[#6B00D7]/30 transition-all overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]"></div>
                <CardContent className="p-6">
                  <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-all border border-[#6B00D7]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-all">Investment Vault</h3>
                  <p className="text-gray-300 mb-5">Lock your crypto assets for specific time periods with automated DeFi strategies to maximize returns while secured.</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Auto-compounding interest</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Customizable time-lock periods</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Cross-chain asset diversification</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:from-[#FF46E8] hover:to-[#5500AB] text-white font-bold rounded-lg py-2 shadow-glow transition-all"
                    onClick={() => setLocation("/create-vault")}
                  >
                    Create Investment Vault
                  </Button>
                </CardContent>
              </Card>
              
              {/* Bitcoin Halving Vault */}
              <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 shadow-xl hover:shadow-[#6B00D7]/30 transition-all hover:translate-y-[-5px] overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <CardContent className="p-6">
                  <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-all border border-[#6B00D7]/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-all">Bitcoin Halving Vault</h3>
                  <p className="text-gray-300 mb-5">Synchronize your asset unlocks with Bitcoin halving events for strategic long-term crypto investment planning.</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Bitcoin halving cycle alignment</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">On-chain verification of halving events</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                        <span className="text-[#FF5AF7] text-xs">✓</span>
                      </div>
                      <span className="text-gray-300">Auto-rebalancing portfolio options</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg py-2 shadow-glow transition-all"
                    onClick={() => setLocation("/bitcoin-halving-vault")}
                  >
                    Create BTC Halving Vault
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center mt-12">
              <Button 
                className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 hover:border-[#FF5AF7]/60 text-white font-bold rounded-lg px-8 py-3 text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/10 transition-all"
                onClick={() => setLocation("/advanced-vault-creation")}
              >
                Explore Advanced Vault Options
              </Button>
            </div>
          </div>
        </section>
        
        {/* Comprehensive Security Architecture Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#121212] to-[#1A1A1A] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-25">
            <div className="absolute top-[30%] left-[20%] w-64 h-64 rounded-full bg-[#6B00D7]/5 blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[30%] w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Comprehensive Security Architecture</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Military-grade protection through advanced cryptographic techniques, multi-layered defenses, and cutting-edge blockchain technology</p>
            </div>
            
            {/* Security Architecture Diagram */}
            <div className="mb-14 md:mb-20 relative mx-auto max-w-4xl px-4">
              <div className="bg-[#1A1A1A]/80 border border-[#6B00D7]/30 rounded-xl p-4 md:p-8 shadow-lg shadow-[#6B00D7]/10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="col-span-1 md:col-span-4 mb-4">
                    <div className="flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/30">
                      <h3 className="text-white font-semibold text-center">User Interface Layer <span className="text-[#FF5AF7]">→</span> Authentication <span className="text-[#FF5AF7]">→</span> Cryptographic Verification</h3>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                          <i className="ri-shield-line text-lg text-[#FF5AF7]"></i>
                        </div>
                        <h4 className="text-white text-sm font-medium text-center">Multi-Signature Validation</h4>
                      </div>
                      <div className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                          <i className="ri-lock-password-line text-lg text-[#FF5AF7]"></i>
                        </div>
                        <h4 className="text-white text-sm font-medium text-center">Zero-Knowledge Proofs</h4>
                      </div>
                      <div className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                          <i className="ri-fingerprint-2-line text-lg text-[#FF5AF7]"></i>
                        </div>
                        <h4 className="text-white text-sm font-medium text-center">Biometric Authentication</h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4 flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7]"></div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4 mb-2">
                    <div className="flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-[#6B00D7]/40 to-[#FF5AF7]/20 border border-[#6B00D7]/40">
                      <h3 className="text-white font-semibold text-center">Military-Grade Security Layer</h3>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4 flex justify-center my-2">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#FF5AF7] to-[#6B00D7]"></div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="py-3 px-2 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <span className="text-xs text-[#FF5AF7] font-medium mb-1">TON</span>
                        <span className="text-xs text-gray-400">Ultra Fast</span>
                      </div>
                      <div className="py-3 px-2 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <span className="text-xs text-[#FF5AF7] font-medium mb-1">Ethereum</span>
                        <span className="text-xs text-gray-400">Smart Contracts</span>
                      </div>
                      <div className="py-3 px-2 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <span className="text-xs text-[#FF5AF7] font-medium mb-1">Solana</span>
                        <span className="text-xs text-gray-400">High Performance</span>
                      </div>
                      <div className="py-3 px-2 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 flex flex-col items-center justify-center">
                        <span className="text-xs text-[#FF5AF7] font-medium mb-1">Arweave</span>
                        <span className="text-xs text-gray-400">Permanent Storage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Features Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Security Feature 1 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2 hover:translate-y-[-4px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                    <i className="ri-shield-keyhole-line text-2xl text-[#FF5AF7]"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Multi-Signature Mechanism</h3>
                  <p className="text-gray-300 mb-6">Enhance vault security by requiring multiple approvals for all critical actions. Perfect for team treasuries and shared assets.</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Multiple authorization keys</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Flexible approval thresholds</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Role-based permissions</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Feature 2 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2 md:translate-y-4 hover:translate-y-[-4px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                    <i className="ri-fingerprint-line text-2xl text-[#FF5AF7]"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Biometric Authentication</h3>
                  <p className="text-gray-300 mb-6">Implement advanced biometric options for accessing vaults, ensuring higher security through physical verification.</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Fingerprint verification</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Facial recognition support</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Multi-factor authentication</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Feature 3 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2 hover:translate-y-[-4px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-5">
                    <i className="ri-eye-off-line text-2xl text-[#FF5AF7]"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Zero-Knowledge Privacy</h3>
                  <p className="text-gray-300 mb-6">Verify the state and security of your vaults without revealing sensitive contents, maintaining complete confidentiality.</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Cryptographic proofs</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">Private verification</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7]"></div>
                    <p className="text-sm text-gray-400">End-to-end encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* CTA Button */}
            <div className="text-center mt-14">
              <Link to="/cross-chain-security" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[#6B00D7]/20">
                Explore Our Security Documentation <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Specialized Vault Types Section */}
        <section className="py-16 md:py-20 bg-[#0D0D0D]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Specialized Vault Types</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Tailor your digital vault experience to your specific needs with our specialized vault solutions</p>
            </div>
            
            {/* Vault Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Standard Time Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-time-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Standard Time Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Store messages, media, and documents that unlock at a specific future date.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Time-based unlocking</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Media support</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">TON & Arweave</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Personal memories, future messages, historical preservation.</p>
                </div>
              </div>

              {/* Financial Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-coins-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Financial Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Create time-locked financial investments with cross-chain asset diversification and yield strategies.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Cross-chain assets</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Yield strategies</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Portfolio tracking</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Long-term savings, education funds, retirement planning.</p>
                </div>
              </div>

              {/* Multi-Signature Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-group-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Multi-Signature Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Require multiple authorizations to unlock content with customizable signature thresholds.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Multiple approvals</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Role-based permissions</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Ethereum-based</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Family trusts, business partnerships, organizational governance.</p>
                </div>
              </div>

              {/* Bitcoin Halving Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-bit-coin-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Bitcoin Halving Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Specialized vaults synchronized with Bitcoin halving events with lower fees for BTC maximalists.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Halving synchronization</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Reduced fees (0.5%)</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Block height tracking</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Bitcoin maximalists, cycle-based investment strategies.</p>
                </div>
              </div>

              {/* Geographic Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-map-pin-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Geographic Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Unlock content when physically present at specific locations using GPS verification and zero-knowledge proofs.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Location-based</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Progressive revelation</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Zero-knowledge proofs</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Location-based experiences, treasure hunts, historical sites.</p>
                </div>
              </div>

              {/* Conditional Vault */}
              <div className="p-1 rounded-xl bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:scale-[1.02] transition-transform">
                <div className="bg-[#121212] h-full rounded-xl p-6 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-lg flex items-center justify-center mr-3">
                      <i className="ri-file-list-3-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    <h3 className="text-xl font-bold text-white">Conditional Vault</h3>
                  </div>
                  <p className="text-gray-400 mb-4 flex-grow">Unlock based on specified blockchain events or real-world triggers using oracle integration.</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Oracle integration</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Event monitoring</span>
                    <span className="text-xs px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Complex conditions</span>
                  </div>
                  <p className="text-sm text-gray-500 italic">Best for: Smart contract-based agreements, milestone-based unlocking.</p>
                </div>
              </div>
            </div>

            {/* CVT Token Utility Section */}
            <div className="mt-20 mb-16">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
                    Unlock Premium Features with CVT Tokens
                  </span>
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  Chronos Vault Token (CVT) is the utility token powering advanced vault functionality across multiple blockchains
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Ethereum Vaults */}
                <div className="bg-black border-[3px] border-[#6B00D7] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#6B00D7]/30 transition-all duration-300 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-30 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 bg-black">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">Ξ</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Ethereum Vaults</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                            <span className="text-xs text-white/80">Smart Contract Powered</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm">From 50 CVT</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <p className="text-white text-lg">Create advanced Ethereum-based vaults with multi-signature capabilities and smart contract automation</p>
                      
                      <div className="space-y-4">
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-crown-line text-[#FF5AF7]"></i> Basic Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">50 CVT</span>
                              <span className="text-white/70 text-sm">Standard Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Smart contract time-locking</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>ERC-20 token support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/10">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-shield-star-line text-[#FF5AF7]"></i> Enhanced Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">100 CVT</span>
                              <span className="text-white/70 text-sm">Advanced Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Multi-signature security</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>NFT and ERC-721 support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#FF5AF7] rounded-xl overflow-hidden shadow-md shadow-[#FF5AF7]/20">
                          <div className="p-4 border-b border-[#FF5AF7]/40 bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-diamond-fill text-[#FF5AF7]"></i> Premium Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">250 CVT</span>
                              <span className="text-white/70 text-sm">Enterprise Grade</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Custom smart contract logic</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Cross-chain asset bridging</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all relative overflow-hidden group"
                        onClick={() => setLocation("/cvt-utility?chain=ethereum")}
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative z-10 flex items-center justify-center">
                          Explore Ethereum Features
                          <i className="ri-arrow-right-line ml-2"></i>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Solana Vaults */}
                <div className="bg-black border-[3px] border-[#6B00D7] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#6B00D7]/30 transition-all duration-300 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-30 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 bg-black">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">◎</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Solana Vaults</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                            <span className="text-xs text-white/80">High Performance</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm">From 40 CVT</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <p className="text-white text-lg">Create high-performance Solana-based vaults with ultra-fast transaction speeds and lower fees</p>
                      
                      <div className="space-y-4">
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-crown-line text-[#FF5AF7]"></i> Basic Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">40 CVT</span>
                              <span className="text-white/70 text-sm">Standard Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Fast transaction processing</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>SPL token support</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/10">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-shield-star-line text-[#FF5AF7]"></i> Enhanced Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">80 CVT</span>
                              <span className="text-white/70 text-sm">Advanced Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Solana NFT compatibility</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Low-latency transaction locks</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#FF5AF7] rounded-xl overflow-hidden shadow-md shadow-[#FF5AF7]/20">
                          <div className="p-4 border-b border-[#FF5AF7]/40 bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-diamond-fill text-[#FF5AF7]"></i> Premium Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">200 CVT</span>
                              <span className="text-white/70 text-sm">Enterprise Grade</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Advanced Solana program logic</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>DeFi protocol integration</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all relative overflow-hidden group"
                        onClick={() => setLocation("/cvt-utility?chain=solana")}
                      >
                        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative z-10 flex items-center justify-center">
                          Explore Solana Features
                          <i className="ri-arrow-right-line ml-2"></i>
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* TON Vaults */}
                <div className="bg-black border-[3px] border-[#6B00D7] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-[#6B00D7]/30 transition-all duration-300 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-30 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 bg-black">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-black/80 flex items-center justify-center">
                          <span className="text-3xl font-bold text-white">💎</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">TON Vaults</h3>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                            <span className="text-xs text-white/80">Lightning Fast</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm">From 30 CVT</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-6">
                      <p className="text-white text-lg">Create TON-based vaults with ultra-secure storage and lightning-fast transaction processing</p>
                      
                      <div className="space-y-4">
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-crown-line text-[#FF5AF7]"></i> Basic Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">30 CVT</span>
                              <span className="text-white/70 text-sm">Standard Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>TON asset management</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Fast transaction finality</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#6B00D7] rounded-xl overflow-hidden">
                          <div className="p-4 border-b border-[#6B00D7]/40 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/10">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-shield-star-line text-[#FF5AF7]"></i> Enhanced Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">60 CVT</span>
                              <span className="text-white/70 text-sm">Advanced Package</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Advanced TON functionality</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Smart contract automation</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="border border-[#FF5AF7] rounded-xl overflow-hidden shadow-md shadow-[#FF5AF7]/20">
                          <div className="p-4 border-b border-[#FF5AF7]/40 bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              <i className="ri-vip-diamond-fill text-[#FF5AF7]"></i> Premium Vault
                            </h4>
                          </div>
                          <div className="p-4 bg-black">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[#FF5AF7] font-bold text-xl">150 CVT</span>
                              <span className="text-white/70 text-sm">Enterprise Grade</span>
                            </div>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Custom TON contract integration</span>
                              </li>
                              <li className="flex items-center gap-2 text-white/90">
                                <i className="ri-checkbox-circle-fill text-green-400"></i>
                                <span>Enterprise-grade security</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all"
                      onClick={() => setLocation("/cvt-utility?chain=ton")}
                    >
                      Explore TON Features
                      <i className="ri-arrow-right-line ml-2"></i>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Link 
                  to="/cvt-utility"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all gap-2 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></span>
                  <span className="relative z-10 flex items-center">
                    <i className="ri-wallet-3-line mr-2 text-lg"></i>
                    View Complete CVT Utility
                  </span>
                </Link>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="mt-16 flex justify-center">
              <Link 
                to="/create-vault" 
                className="px-10 py-5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white text-xl font-semibold rounded-2xl shadow-xl shadow-[#6B00D7]/20 hover:shadow-2xl hover:shadow-[#FF5AF7]/30 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                <i className="ri-add-circle-line text-2xl"></i> 
                <span>Create Your Vault Now</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      {/* Footer now managed by Layout component */}
    </div>
  );
};

export default Home;