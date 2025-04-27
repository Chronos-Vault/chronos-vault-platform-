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
    isLocked: true
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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Main Hero Content */}
          <div className="relative">
            {/* Headline and Primary Content */}
            <div className="text-center mb-12">
              <h1 className="font-poppins font-bold text-4xl md:text-6xl leading-tight mb-6">
                <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Decentralized Digital</span>
                <br />
                <span className="text-white">Chronos Vault Network</span>
              </h1>
              
              <div className="flex justify-center gap-3 items-center my-4">
                <span className="px-3 py-1 bg-[#6B00D7]/30 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm">TON</span>
                <span className="px-3 py-1 bg-[#6B00D7]/30 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm">ETH</span>
                <span className="px-3 py-1 bg-[#6B00D7]/30 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm">SOL</span>
                <span className="px-3 py-1 bg-[#6B00D7]/30 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm">BTC</span>
                <span className="px-3 py-1 bg-[#6B00D7]/30 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm">Military-Grade</span>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mt-6">
                Create tamper-proof digital and financial vaults with advanced unlock mechanisms, cross-chain redundancy, and secure multi-signature access protocols because we believe in your power to protect what matters most.
              </p>
              
              <div className="flex justify-center gap-6 mt-10">
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-bold rounded-lg px-8 py-4 text-lg shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                  onClick={() => setLocation("/create-vault")}
                >
                  Create Your Vault
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 hover:text-white font-bold rounded-lg px-8 py-4 text-lg transition-all"
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
            </div>
            
            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Security Feature Block */}
              <div className="bg-gradient-to-br from-[#151515] to-[#0A0A0A] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Quantum-Resistant Security</h3>
                <p className="text-gray-300">Military-grade encryption with zero-knowledge proofs and multi-signature authentication protect your assets across time.</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Multi-Sig</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Zero-Knowledge</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Post-Quantum</span>
                </div>
              </div>
              
              {/* Time Vault Block */}
              <div className="bg-gradient-to-br from-[#151515] to-[#0A0A0A] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10 md:translate-y-6">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Time-Locked Digital Vaults</h3>
                <p className="text-gray-300">Create secure vaults for assets, messages, and media that unlock at predetermined future dates or based on specific conditions.</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Bitcoin Halving</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Smart Triggers</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Legacy Planning</span>
                </div>
              </div>
              
              {/* Multi-Chain Block */}
              <div className="bg-gradient-to-br from-[#151515] to-[#0A0A0A] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Cross-Chain Architecture</h3>
                <p className="text-gray-300">Leverage the unique capabilities of multiple blockchains for enhanced security, reliability, and functionality.</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">TON</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Ethereum</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Solana</span>
                  <span className="px-2 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] text-xs rounded">Bitcoin</span>
                </div>
              </div>
            </div>
            
            {/* Vault Platform Demo */}
            <div className="mt-20 flex justify-center">
              <div className="relative w-full max-w-4xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl overflow-hidden border border-[#333] shadow-2xl">
                {/* Platform Header */}
                <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 p-4 border-b border-[#333]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-md">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white">
                          <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 7V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white">Chronos Vault Platform</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-full bg-[#6B00D7]/30 text-[#FF5AF7] text-xs font-medium">
                        Military-Grade Security
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#6B00D7]/30 text-[#FF5AF7] text-xs font-medium">
                        Cross-Chain
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Platform Body */}
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Vault Types */}
                  {["Heritage", "Financial", "Personal", "Multi-Sig"].map((type, index) => (
                    <div key={index} className={`rounded-lg p-4 border hover:shadow-md transition-all ${index === 0 ? 'bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 border-[#6B00D7]/30' : 'border-[#333] bg-[#121212] hover:border-[#6B00D7]/30'}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${index === 0 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-[#181818]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={index === 0 ? "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" : 
                                   index === 1 ? "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                                   index === 2 ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" :
                                   "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"} />
                          </svg>
                        </div>
                        <span className={`font-medium ${index === 0 ? 'text-white' : 'text-gray-300'}`}>{type}</span>
                        <span className="text-xs text-gray-400 mt-1">Vault</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Active Vault Showcase */}
                <div className="p-6 border-t border-[#333]">
                  <div className="rounded-lg bg-gradient-to-br from-[#0A0A0A] to-[#121212] border border-[#333] p-5 relative overflow-hidden">
                    {/* Security scan animation */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF5AF7]/10 animate-scan"></div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white">Heritage Time Vault #1337</h3>
                            <p className="text-[#FF5AF7]">Quantum-Encrypted • Multi-Chain • Private</p>
                          </div>
                          <div className="px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/30 text-[#FF5AF7] text-sm">
                            Unlocks in 25 Years
                          </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-[#0A0A0A] rounded p-2">
                            <div className="text-gray-400">Created</div>
                            <div className="text-white">April 27, 2025</div>
                          </div>
                          <div className="bg-[#0A0A0A] rounded p-2">
                            <div className="text-gray-400">Unlocks</div>
                            <div className="text-white">April 27, 2050</div>
                          </div>
                          <div className="bg-[#0A0A0A] rounded p-2">
                            <div className="text-gray-400">Security</div>
                            <div className="text-white">Military-Grade</div>
                          </div>
                          <div className="bg-[#0A0A0A] rounded p-2">
                            <div className="text-gray-400">Status</div>
                            <div className="text-[#FF5AF7]">Active</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm text-gray-400 mb-1 flex justify-between">
                            <span>Time Remaining</span>
                            <span>16% Complete</span>
                          </div>
                          <div className="w-full h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                            <div className="h-full w-[16%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 border-t border-[#333333] pt-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3">Multi-Chain Integration</h3>
              <p className="text-gray-300 max-w-2xl mx-auto mb-4">
                Chronos Vault operates seamlessly across multiple blockchain networks, providing a unified interface for managing your digital assets and time-locked vaults.
              </p>
              <span className="text-gray-400 text-sm uppercase">Supported Blockchain Networks</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-flashlight-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">TON</span>
                    <span className="text-xs text-gray-400 mt-1">Cross-Chain</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-ethereum-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">Ethereum</span>
                    <span className="text-xs text-gray-400 mt-1">EVM Compatible</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-layout-grid-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">Polygon</span>
                    <span className="text-xs text-gray-400 mt-1">Layer 2 Scaling</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-sun-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">Solana</span>
                    <span className="text-xs text-gray-400 mt-1">High Performance</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-bitcoin-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">Bitcoin</span>
                    <span className="text-xs text-gray-400 mt-1">Halving Vaults</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#0D0D0D] to-[#151515] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#181818] hover:to-[#121212] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-hard-drive-2-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">Arweave</span>
                    <span className="text-xs text-gray-400 mt-1">Permanent Storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#6B00D7] rounded-full filter blur-[100px] opacity-10 animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-[#FF5AF7] rounded-full filter blur-[100px] opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
      </section>

      {/* Special Vault Section */}
      <section id="bitcoin-halving" className="py-16 bg-[#0D0D0D]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl">Bitcoin <span className="text-[#FF5AF7]">Halving</span> Vault</h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Lock your assets until the next Bitcoin halving in 2028 and potentially benefit from price appreciation.</p>
            <div className="mt-4">
              <Link href="/bitcoin-halving-vault">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                  Explore Halving Vault Details
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="max-w-md mx-auto mt-8">
            <BitcoinHalvingVault />
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
                  <i className="ri-scales-line text-[#FF5AF7] text-2xl"></i>
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Smart Conditions</h3>
                <p className="text-gray-200">Create vaults with conditional access based on price triggers, blockchain events, or multi-signature requirements.</p>
              </CardContent>
            </Card>
            
            <Card className="vault-card bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
              <CardContent className="p-0">
                <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center">
                  <i className="ri-eye-line text-[#FF5AF7] text-2xl"></i>
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Transparent Security</h3>
                <p className="text-gray-200">Verify the security of your vault at any time with full transparency of the smart contract on the blockchain.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#1A1A1A] to-[#222222]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">How <span className="text-[#FF5AF7]">Chronos Vault</span> Works</h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Getting started with Chronos Vault is simple. Follow these steps to secure your digital legacy.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-16">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute left-0 top-0 ml-6 h-full w-[2px] bg-gradient-to-b from-[#6B00D7] to-[#FF5AF7]"></div>
                
                <div className="relative flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white shadow-glow z-10">1</div>
                  <div className="ml-6">
                    <h3 className="font-poppins font-semibold text-xl text-white mb-3">Connect Your Wallet</h3>
                    <p className="text-gray-200 mb-5">Connect your Web3 wallet to authenticate and get started with your vault creation process. We support multiple blockchain networks for maximum flexibility.</p>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333] flex overflow-x-auto gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded border border-[#444] min-w-max">
                        <i className="ri-wallet-3-line text-[#FF5AF7]"></i>
                        <span>MetaMask</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded border border-[#444] min-w-max">
                        <i className="ri-wallet-3-line text-[#FF5AF7]"></i>
                        <span>WalletConnect</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded border border-[#444] min-w-max">
                        <i className="ri-wallet-3-line text-[#FF5AF7]"></i>
                        <span>Phantom</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white shadow-glow z-10">2</div>
                  <div className="ml-6">
                    <h3 className="font-poppins font-semibold text-xl text-white mb-3">Choose Your Vault Type</h3>
                    <p className="text-gray-200 mb-5">Select from multiple vault types including personal, legacy, and investment vaults. Each comes with specialized features designed for specific purposes.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Legacy Vault</div>
                        <p className="text-sm text-gray-300">Secure your digital legacy for future generations with inheritance features.</p>
                      </div>
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Investment Vault</div>
                        <p className="text-sm text-gray-300">Lock assets for a specific period with automated investment strategies.</p>
                      </div>
                      <div className="p-4 bg-[#141414] rounded-lg border border-[#333] hover:border-[#6B00D7] transition-all">
                        <div className="font-semibold text-[#FF5AF7] mb-2">Multi-Signature Vault</div>
                        <p className="text-sm text-gray-300">Require multiple approvals for enhanced security and collaborative control.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white shadow-glow z-10">3</div>
                  <div className="ml-6">
                    <h3 className="font-poppins font-semibold text-xl text-white mb-3">Configure Time Lock & Security</h3>
                    <p className="text-gray-200 mb-5">Set your time lock period and security parameters. Choose from multiple security features including multi-signature authentication and conditional access rules.</p>
                    <div className="p-4 bg-[#141414] rounded-lg border border-[#333]">
                      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">Unlock Date</div>
                          <div className="p-2 bg-[#1A1A1A] rounded border border-[#444] text-center">January 16, 2050</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">Security Level</div>
                          <div className="p-2 bg-[#1A1A1A] rounded border border-[#444] text-center text-[#FF5AF7]">Military-Grade</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">Authentication</div>
                          <div className="p-2 bg-[#1A1A1A] rounded border border-[#444] text-center">Multi-Factor</div>
                        </div>
                      </div>
                      <div className="p-2 bg-[#1A1A1A] rounded border border-[#6B00D7]/40 text-center text-sm">Your vault will be secured across multiple blockchains for maximum security and redundancy.</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative">
                <div className="relative flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white shadow-glow z-10">4</div>
                  <div className="ml-6">
                    <h3 className="font-poppins font-semibold text-xl text-white mb-3">Deposit Assets & Finalize</h3>
                    <p className="text-gray-200 mb-5">Add your digital assets, messages, or files to your vault, review your configuration, and finalize the creation. Once created, your vault will be secured by the blockchain.</p>
                    <div className="flex justify-center">
                      <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF45ED] text-white font-medium rounded-lg px-8 py-3 shadow-glow transition-all">
                        Create My Vault Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sample Vaults Section */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">Explore <span className="text-[#6B00D7]">Vault Types</span></h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Discover the different types of vaults available for your specific needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VaultCard vault={{
              ...sampleVault,
              name: "Legacy Vault",
              vaultType: "legacy",
              assetType: "ETH",
              assetAmount: "25.45"
            }} variant="legacy" />
            
            <VaultCard vault={{
              ...sampleVault,
              name: "Investment Vault",
              vaultType: "investment",
              assetType: "BTC",
              assetAmount: "1.25"
            }} variant="investment" />
            
            <VaultCard vault={{
              ...sampleVault,
              name: "Project Vault",
              vaultType: "project",
              assetType: "TON",
              assetAmount: "5000"
            }} variant="project" />
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/create-vault">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF45ED] text-white font-medium rounded-lg px-8 py-3 shadow-glow transition-all">
                Create Your Vault
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-full w-full">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="absolute h-[1px] w-full bg-[#FF5AF7]"
                style={{
                  top: `${i * 7}%`,
                  left: 0,
                  animationDelay: `${i * 0.1}s`,
                  opacity: 0.4,
                  animation: 'scanLine 2s linear infinite'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-poppins font-bold text-4xl mb-6">Secure Your Digital <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Legacy</span> Today</h2>
            <p className="text-xl text-gray-200 mb-10">
              Join thousands of users who trust Chronos Vault with their most valuable digital assets. Start creating your time-locked vaults now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF45ED] text-white font-medium rounded-lg px-8 py-3 shadow-glow transition-all"
                onClick={() => setLocation("/create-vault")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 hover:text-white font-medium rounded-lg px-8 py-3 transition-all"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;