import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight, Users, Shield, Clock, Lock, Key, Fingerprint, Globe, FileText, ChevronRight, RefreshCw, Layers, UserPlus } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

  // Fetch user vaults 
  const { data: vaults, isLoading: isVaultsLoading } = useQuery({
    queryKey: ["/api/vaults/user/1"], // Using userId 1 for demo
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/vaults/user/1");
        if (response.ok) {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.error("Error fetching vaults:", error);
        return [];
      }
    },
  });

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
    <div className="flex flex-col text-white font-poppins bg-black">
      <main className="flex-1">
        {/* Hero Section with Animation */}
        <section className="min-h-[100vh] relative overflow-hidden flex items-center justify-center">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505]"></div>
            <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/10 to-[#6B00D7]/5 blur-[120px] opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-[#FF5AF7]/10 via-[#6B00D7]/15 to-[#FF5AF7]/5 blur-[100px] opacity-20 animate-pulse-slow animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 z-10 py-20">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge - Enhanced */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm mb-8 mx-auto shadow-sm shadow-[#FF5AF7]/20">
                <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                  <i className="ri-verified-badge-line mr-2 animate-pulse"></i>
                  Ultra-Premium Blockchain Security <div className="mx-2 w-1 h-1 rounded-full bg-[#FF5AF7]"></div> Triple-Chain Architecture
                </span>
              </div>
              
              {/* Mobile-friendly Centered Headline with Left-Right Animation */}
              <h1 className="font-poppins font-bold mb-8">
                <div className="animate-slide-lr">
                  <span className="hero-title animate-glow whitespace-nowrap">Chronos Vault</span>
                </div>
              </h1>
              
              <div className="mt-4 mb-8">
                <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
                  The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <Link 
                  to="/create-vault" 
                  className="px-8 py-5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white text-lg font-semibold rounded-xl shadow-xl shadow-[#6B00D7]/20 hover:shadow-2xl hover:shadow-[#FF5AF7]/30 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <i className="ri-shield-keyhole-line text-xl"></i> 
                  <span>Create New Vault</span>
                </Link>
                
                <Link 
                  to="/multi-signature-vault" 
                  className="px-8 py-5 bg-transparent border border-[#6B00D7] hover:border-[#FF5AF7] text-white text-lg font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-[#FF5AF7]/5"
                >
                  <i className="ri-user-shared-line text-xl"></i>
                  <span>Multi-Signature Vault</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-[#1A1A1A]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-poppins font-bold text-3xl">Future-Proof <span className="text-[#6B00D7]">Features</span></h2>
              <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Experience the next generation of blockchain vaults with innovative features designed for security, accessibility, and peace of mind.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-time-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Time-Locked Security</h3>
                  <p className="text-gray-200">Create vaults with custom time locks that cannot be accessed until the specified date, guaranteed by blockchain technology.</p>
                </CardContent>
              </Card>
              
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-shield-keyhole-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Decentralized Trust</h3>
                  <p className="text-gray-200">Your assets are secured by the blockchain, not by any institution. True decentralization means no single point of failure.</p>
                </CardContent>
              </Card>
              
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-user-heart-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Legacy Planning</h3>
                  <p className="text-gray-200">Set up vaults for future generations with inheritance features that ensure your assets reach your loved ones.</p>
                </CardContent>
              </Card>
              
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-lock-password-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Multi-Asset Support</h3>
                  <p className="text-gray-200">Lock multiple cryptocurrencies and NFTs in a single vault, with full visibility and management.</p>
                </CardContent>
              </Card>
              
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-user-shared-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Multi-Signature Security</h3>
                  <p className="text-gray-200">Require multiple approvals for vault access, adding layers of security for high-value assets.</p>
                </CardContent>
              </Card>
              
              <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                <CardContent className="p-0">
                  <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                    <i className="ri-global-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Cross-Chain Architecture</h3>
                  <p className="text-gray-200">Assets are secured across multiple blockchains, enhancing security and eliminating platform risk.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] to-black"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#6B00D7]/10 to-transparent"></div>
          <div className="absolute top-1/3 -left-64 w-[600px] h-[600px] rounded-full bg-[#6B00D7]/10 blur-[100px]"></div>
          <div className="absolute bottom-1/3 -right-64 w-[600px] h-[600px] rounded-full bg-[#FF5AF7]/10 blur-[100px]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <Card className="bg-gradient-to-br from-[#1E1E1E] to-[#141414] border-2 border-[#6B00D7]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#6B00D7]/10">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="md:w-1/2 space-y-8">
                    <h2 className="font-poppins font-bold text-3xl md:text-4xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Ready to secure your assets with cutting-edge technology?</h2>
                    <p className="text-gray-200 text-lg leading-relaxed">Join thousands who trust Chronos Vault for secure digital asset storage with multi-chain protection, programmable conditions, and unprecedented peace of mind.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center mr-4">
                          <i className="ri-shield-check-line text-[#FF5AF7] text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg mb-1 text-white">Industry-Leading Security</h3>
                          <p className="text-gray-200 text-sm">Triple-chain security with cross-chain verification.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center mr-4">
                          <i className="ri-global-line text-[#FF5AF7] text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg mb-1 text-white">Cross-Chain Support</h3>
                          <p className="text-gray-200 text-sm">Works across multiple blockchains for maximum flexibility.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center mr-4">
                          <i className="ri-wallet-3-line text-[#FF5AF7] text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg mb-1 text-white">Multi-Asset Compatible</h3>
                          <p className="text-gray-200 text-sm">Store cryptocurrencies, NFTs, and tokenized assets.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center mr-4">
                          <i className="ri-customer-service-2-line text-[#FF5AF7] text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-poppins font-semibold text-lg mb-1 text-white">24/7 Support</h3>
                          <p className="text-gray-200 text-sm">Our team is always available to assist you.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Link
                        to="/create-vault"
                        className="cta-button bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-4 rounded-xl font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all flex items-center gap-2"
                      >
                        <i className="ri-shield-keyhole-line"></i>
                        <span>Create Your Vault</span>
                      </Link>
                      <Link
                        to="/documentation"
                        className="px-8 py-4 rounded-xl bg-[#242424] border-2 border-[#FF5AF7]/30 text-white font-poppins font-medium hover:border-[#FF5AF7] hover:bg-[#FF5AF7]/10 transition-all flex items-center gap-2"
                      >
                        <i className="ri-file-text-line"></i>
                        <span>Documentation</span>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 flex justify-center items-center">
                    <div className="relative w-full max-w-md aspect-square">
                      {/* 3D Vault Animation Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-56 h-56 md:w-80 md:h-80">
                          {/* Animated rings */}
                          <div className="absolute w-full h-full rounded-full border-2 border-[#6B00D7]/30 animate-spin-slow" style={{animationDuration: '15s'}}></div>
                          <div className="absolute w-[90%] h-[90%] top-[5%] left-[5%] rounded-full border-2 border-[#FF5AF7]/20 animate-spin-slow" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
                          <div className="absolute w-[80%] h-[80%] top-[10%] left-[10%] rounded-full border border-[#6B00D7]/10 animate-spin-slow" style={{animationDuration: '25s'}}></div>
                          
                          {/* Central vault */}
                          <div className="absolute w-[70%] h-[70%] top-[15%] left-[15%] rounded-3xl bg-gradient-to-br from-[#1A1A1A] to-black border-2 border-[#6B00D7]/50 shadow-xl shadow-[#6B00D7]/20 flex items-center justify-center overflow-hidden">
                            {/* Animated highlight */}
                            <div className="absolute top-0 left-[-100%] w-[200%] h-[100%] bg-gradient-to-r from-transparent via-[#FF5AF7]/20 to-transparent transform rotate-45 animate-shine" style={{animationDuration: '3s'}}></div>
                            
                            {/* Vault icon */}
                            <div className="relative z-10">
                              <i className="ri-safe-2-line text-[#FF5AF7] text-6xl"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust indicators */}
        <section className="bg-black py-16 border-t border-[#333333]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-8">We Support <span className="text-[#FF5AF7]">Multiple Blockchains</span></h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8">
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-flashlight-line mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> TON
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-ethereum-line mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> Ethereum
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-layout-grid-line mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> Polygon
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-sun-line mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> Solana
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-link mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> Chainlink
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-14 w-36 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-hard-drive-2-line mr-2 text-xl group-hover:text-[#FF5AF7] transition-colors"></i> Arweave
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Link to="/technical-specification" className="inline-flex items-center text-[#FF5AF7] hover:underline gap-2 transition-all">
                <span>View Technical Specifications</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;