import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";

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
                  <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Decentralized Digital</span>
                  <br />
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Chronos Vault Network</span>
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
                
                <div className="flex flex-col items-center gap-6 mt-10">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center max-w-md sm:max-w-none mx-auto">
                    <Button 
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all w-full sm:w-auto"
                      onClick={() => setLocation("/create-vault-enhanced")}
                    >
                      Create Your Vault
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-[#00D7C3] to-[#6B00D7] hover:from-[#00C7B3] hover:to-[#5500AB] text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#00D7C3]/40 transition-all w-full sm:w-auto"
                      onClick={() => setLocation("/specialized-vault")}
                    >
                      <span className="mr-2">✨</span>Advanced Vaults
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 hover:text-white font-bold rounded-lg px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all w-full sm:w-auto"
                      onClick={() => {
                        const featuresSection = document.querySelector('#features');
                        if (featuresSection) {
                          featuresSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Explore Features
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
        
        {/* Security Model Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#18121E] to-[#1A0833]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Security Architecture</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Military-grade protection for your digital assets with multi-layered security</p>
            </div>
            
            <div className="bg-[#1A1A1A]/80 border border-[#6B00D7]/30 rounded-xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Economic Security
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Attack Cost Analysis</h4>
                        <p className="text-gray-300 text-sm">Economic cost to attack exceeds potential gain with multi-chain validation</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Penalty System</h4>
                        <p className="text-gray-300 text-sm">Slashing of staked tokens for malicious behavior with reputation scoring</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Treasury Security</h4>
                        <p className="text-gray-300 text-sm">Multi-signature requirements with time-delayed execution of fund movements</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    Technical Security
                  </h3>
                  
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Implementation Security</h4>
                        <p className="text-gray-300 text-sm">Formal verification of smart contracts with independent security audits</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Operational Security</h4>
                        <p className="text-gray-300 text-sm">Defense-in-depth approach with tiered access controls for admin functions</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-3">
                      <div className="h-6 w-6 rounded-full bg-[#6B00D7]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF5AF7] text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Long-term Security</h4>
                        <p className="text-gray-300 text-sm">Quantum-resistant cryptographic methods with cross-chain redundancy</p>
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
        
        {/* Testimonials section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-[#121212] to-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">What Our Users Say</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Join thousands of users who trust Chronos Vault for their digital asset security</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Testimonial 1 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-[#FF5AF7] mb-4">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-gray-300 mb-6 italic">"Chronos Vault has revolutionized how I think about my crypto legacy planning. The Triple-Chain security gives me peace of mind that my assets are truly protected."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                    <div>
                      <p className="font-medium text-white">Alex T.</p>
                      <p className="text-sm text-gray-400">Crypto Investor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Testimonial 2 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2 md:translate-y-4">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-[#FF5AF7] mb-4">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-gray-300 mb-6 italic">"The Bitcoin Halving Vault is ingenious. It's allowed me to create a strategic investment plan that aligns perfectly with Bitcoin's cycle, maximizing potential returns."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                    <div>
                      <p className="font-medium text-white">Sarah M.</p>
                      <p className="text-sm text-gray-400">Blockchain Developer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Testimonial 3 */}
              <Card className="bg-[#1A1A1A]/60 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all p-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-[#FF5AF7] mb-4">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <p className="text-gray-300 mb-6 italic">"The cross-chain capabilities are impressive. I can secure assets across multiple blockchains with a single interface and know they're all equally protected."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                    <div>
                      <p className="font-medium text-white">Michael K.</p>
                      <p className="text-sm text-gray-400">DeFi Enthusiast</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      {/* Footer now managed by Layout component */}
    </div>
  );
};

export default Home;