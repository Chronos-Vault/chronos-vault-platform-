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
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Military-Grade</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Quantum-Resistant</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Cross-Chain</span>
                  <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Ultra-Premium</span>
                </div>
                
                <div className="flex flex-col items-center gap-6 mt-10">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center max-w-md sm:max-w-none mx-auto">
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5300A8] hover:to-[#DC38D8] text-white font-bold rounded-lg px-6 sm:px-10 py-3 sm:py-6 text-sm sm:text-lg shadow-glow hover:shadow-lg hover:shadow-[#6B00D7]/40 transition-all"
                      onClick={() => setLocation("/create-vault")}
                    >
                      <span className="text-base sm:text-xl mr-2">🔒</span> Create Your Vault
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white font-bold rounded-lg px-6 sm:px-10 py-3 sm:py-6 text-sm sm:text-lg hover:bg-[#6B00D7]/10 transition-all"
                      onClick={() => setLocation("/multi-signature-vault")}
                    >
                      <span className="text-base sm:text-xl mr-2">👥</span> Multi-Signature Vault
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

        {/* Multi-Chain Architecture Section */}
        <section className="py-16 md:py-20 bg-[#121212] overflow-hidden relative border-t border-[#6B00D7]/20">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-full bg-[#6B00D7]/10 blur-3xl"></div>
            <div className="absolute bottom-[20%] right-[10%] w-32 h-32 rounded-full bg-[#FF5AF7]/10 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Triple-Chain Security Architecture</h2>
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
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Revolutionary Security Architecture</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Experience unparalleled security and innovation with our cutting-edge vault technology</p>
            </div>
              
            {/* Grid of features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 max-w-7xl mx-auto">
              
              {/* Feature cards would go here */}
              
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                    <i className="ri-lock-password-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Military-Grade Encryption</h3>
                  <p className="text-gray-300">End-to-end encryption with advanced algorithms ensures your assets remain secure against quantum computing threats.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                    <i className="ri-shield-keyhole-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Multi-Signature Security</h3>
                  <p className="text-gray-300">Require multiple authorized parties to approve vault access, creating a distribution of trust for unparalleled security.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:border-[#6B00D7]/40 hover:translate-y-[-4px]">
                <CardContent className="p-4 sm:p-6">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                    <i className="ri-fingerprint-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Zero-Knowledge Privacy</h3>
                  <p className="text-gray-300">Cryptographic proofs allow verification without revealing sensitive vault information, maintaining complete privacy.</p>
                </CardContent>
              </Card>
              
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <Card className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/10 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Legacy Vaults</h3>
                  <p className="text-gray-300 mb-6">Secure digital inheritance for your loved ones with time-locked assets that automatically transfer on predetermined conditions.</p>
                  <Link to="/create-vault" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-2 px-4 block text-center transition-colors">Create Legacy Vault</Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/10 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Multi-Signature Vaults</h3>
                  <p className="text-gray-300 mb-6">Distribute trust across multiple authorized parties with our advanced multi-signature technology for high-value assets.</p>
                  <Link to="/multi-signature-vault" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-2 px-4 block text-center transition-colors">Create Multi-Sig Vault</Link>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-[#1A1A1A] to-[#121212] border border-[#6B00D7]/20 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/10 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">Event-Triggered Vaults</h3>
                  <p className="text-gray-300 mb-6">Create vaults that respond to real-world events, blockchain conditions, or other programmable triggers with our smart contract logic.</p>
                  <Link to="/create-vault" className="bg-[#6B00D7]/20 hover:bg-[#6B00D7]/30 text-[#FF5AF7] border border-[#6B00D7]/40 rounded-lg py-2 px-4 block text-center transition-colors">Create Event Vault</Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CVT Token Section */}
        <section className="py-20 bg-[#121212] border-t border-[#6B00D7]/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">CVT Token Economics</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Chronos Vault Token (CVT) powers our ecosystem with three-tiered staking benefits</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Guardian</h3>
                  <div className="text-3xl font-bold mb-4">1,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    75% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Reduced vault creation fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Priority support access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Guardian security dashboard</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40 transform scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]"></div>
                <div className="absolute -top-6 left-0 right-0 text-center">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-xs px-4 py-1 rounded-full">POPULAR</span>
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Architect</h3>
                  <div className="text-3xl font-bold mb-4">10,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    90% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>All Guardian benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Advanced multi-sig features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Custom security templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]"></div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Sovereign</h3>
                  <div className="text-3xl font-bold mb-4">100,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    100% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>All Architect benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Unlimited vault creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Developer API access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
    </div>
  );
};

export default Home;
