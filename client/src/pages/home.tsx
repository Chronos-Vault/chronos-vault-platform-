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
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white font-poppins">
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/10 blur-3xl opacity-50"></div>
          <div className="absolute top-80 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-40"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-30"></div>
          
          <div className="absolute top-1/4 right-1/4 h-40 w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent opacity-40"></div>
          <div className="absolute top-1/3 left-1/5 h-60 w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent opacity-30"></div>
          
          <div className="grid grid-cols-8 absolute w-full h-full top-0 left-0">
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
            <div className="border-r border-white/5 h-full"></div>
          </div>
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
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mt-8 leading-relaxed">
                Create tamper-proof digital and financial vaults with revolutionary technologies: Triple-Chain Security, Cross-Chain Atomic Swaps, and IPFS/Arweave permanent storage integration.
              </p>
              <p className="text-xl md:text-2xl bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] inline-block text-transparent bg-clip-text font-bold mt-2 animate-text-shine bg-300%">
                The ultimate solution for protecting what matters most across time and chains.
              </p>
              
              <div className="flex flex-col items-center gap-6 mt-10">
                <div className="flex justify-center gap-6">
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
                
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-5 py-2 text-md flex items-center gap-2 transition-all"
                    onClick={() => setLocation("/solana-integration")}
                  >
                    <span className="text-lg">◎</span> Solana Integration
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-5 py-2 text-md flex items-center gap-2 transition-all"
                    onClick={() => setLocation("/ton-integration")}
                  >
                    <span className="text-lg">💎</span> TON Integration
                  </Button>
                  <Button
                    variant="outline"
                    className="border border-[#FF5AF7] bg-[#1A1A1A] text-[#FF5AF7] hover:bg-[#6B00D7]/20 font-medium rounded-lg px-5 py-2 text-md flex items-center gap-2 transition-all"
                    onClick={() => setLocation("/cross-chain")}
                  >
                    <span className="text-lg">🔄</span> Cross-Chain Features
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {/* Security Feature Block */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10">
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
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10 md:translate-y-6">
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
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] rounded-xl overflow-hidden border border-[#333] hover:border-[#6B00D7]/50 transition-all group p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10">
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
                    <div 
                      key={index} 
                      className={`vault-type-button rounded-lg p-4 border cursor-pointer hover:shadow-md transition-all ${index === 0 ? 'bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 border-[#6B00D7]/30' : 'border-[#333] bg-[#121212] hover:border-[#6B00D7]/30'}`}
                      onClick={() => {
                        // This is where we would actually change vault types
                        // For now we'll just make it look interactive with CSS
                        const allVaultButtons = document.querySelectorAll('.vault-type-button');
                        allVaultButtons.forEach((btn, i) => {
                          if (i === index) {
                            btn.classList.add('bg-gradient-to-br', 'from-[#6B00D7]/20', 'to-[#FF5AF7]/10', 'border-[#6B00D7]/30');
                            btn.classList.remove('bg-[#121212]', 'border-[#333]');
                            const icon = btn.querySelector('.vault-icon');
                            if (icon) {
                              icon.classList.add('bg-gradient-to-r', 'from-[#6B00D7]', 'to-[#FF5AF7]');
                              icon.classList.remove('bg-[#181818]');
                            }
                            const label = btn.querySelector('.vault-label');
                            if (label) {
                              label.classList.add('text-white');
                              label.classList.remove('text-gray-300');
                            }
                          } else {
                            btn.classList.remove('bg-gradient-to-br', 'from-[#6B00D7]/20', 'to-[#FF5AF7]/10', 'border-[#6B00D7]/30');
                            btn.classList.add('bg-[#121212]', 'border-[#333]');
                            const icon = btn.querySelector('.vault-icon');
                            if (icon) {
                              icon.classList.remove('bg-gradient-to-r', 'from-[#6B00D7]', 'to-[#FF5AF7]');
                              icon.classList.add('bg-[#181818]');
                            }
                            const label = btn.querySelector('.vault-label');
                            if (label) {
                              label.classList.remove('text-white');
                              label.classList.add('text-gray-300');
                            }
                          }
                        });
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={`vault-icon w-12 h-12 rounded-full mb-2 flex items-center justify-center ${index === 0 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-[#181818]'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={index === 0 ? "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" : 
                                   index === 1 ? "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" :
                                   index === 2 ? "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" :
                                   "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"} />
                          </svg>
                        </div>
                        <span className={`vault-label font-medium ${index === 0 ? 'text-white' : 'text-gray-300'}`}>{type}</span>
                        <span className="text-xs text-gray-400 mt-1">Vault</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Active Vault Showcase */}
                <div className="p-6 border-t border-[#333]">
                  <div className="rounded-lg bg-gradient-to-br from-[#151515] to-[#1A1A1A] border border-[#333] p-5 relative overflow-hidden">
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
                          <div className="bg-[#121212] rounded p-2">
                            <div className="text-gray-300 font-light">Created</div>
                            <div className="text-white">January 16, 2025</div>
                          </div>
                          <div className="bg-[#121212] rounded p-2">
                            <div className="text-gray-300 font-light">Unlocks</div>
                            <div className="text-white">January 16, 2050</div>
                          </div>
                          <div className="bg-[#121212] rounded p-2">
                            <div className="text-gray-300 font-light">Security</div>
                            <div className="text-white">Military-Grade</div>
                          </div>
                          <div className="bg-[#121212] rounded p-2">
                            <div className="text-gray-300 font-light">Status</div>
                            <div className="text-[#FF5AF7]">Active</div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="text-sm text-gray-300 font-light mb-1 flex justify-between">
                            <span>Time Remaining</span>
                            <span>16% Complete</span>
                          </div>
                          <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                            <div className="h-full w-[16%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <button 
                            className="px-4 py-2 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 rounded-lg text-white font-medium flex items-center gap-2 hover:from-[#6B00D7] hover:to-[#FF5AF7] transition-all shadow-sm hover:shadow-[#FF5AF7]/20 hover:shadow-lg"
                            onClick={(e) => {
                              const button = e.currentTarget;
                              const originalText = button.innerHTML;
                              
                              // Simulate authentication attempt
                              button.innerHTML = '<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Verifying';
                              
                              setTimeout(() => {
                                button.innerHTML = 'Access Denied - Vault Locked';
                                button.classList.add('bg-red-600');
                                button.classList.add('hover:bg-red-700');
                                button.classList.remove('bg-gradient-to-r', 'from-[#6B00D7]/80', 'to-[#FF5AF7]/80', 'hover:from-[#6B00D7]', 'hover:to-[#FF5AF7]');
                                
                                // Reset after 2 seconds
                                setTimeout(() => {
                                  button.innerHTML = originalText;
                                  button.classList.remove('bg-red-600', 'hover:bg-red-700');
                                  button.classList.add('bg-gradient-to-r', 'from-[#6B00D7]/80', 'to-[#FF5AF7]/80', 'hover:from-[#6B00D7]', 'hover:to-[#FF5AF7]');
                                }, 2000);
                              }, 1500);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            Attempt Unlock
                          </button>
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
                <div className="h-16 w-full bg-gradient-to-br from-[#181818] to-[#222222] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#1D1D1D] hover:to-[#252525] hover:shadow-lg hover:shadow-[#6B00D7]/10">
                  <div className="flex flex-col items-center">
                    <i className="ri-flashlight-line text-xl group-hover:text-[#FF5AF7] transition-colors"></i>
                    <span className="mt-1 font-medium">TON</span>
                    <span className="text-xs text-gray-400 mt-1">Cross-Chain</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-16 w-full bg-gradient-to-br from-[#181818] to-[#222222] rounded-lg flex items-center justify-center text-white border border-[#333333] hover:border-[#6B00D7]/50 transition-all group hover:bg-gradient-to-br hover:from-[#1D1D1D] hover:to-[#252525] hover:shadow-lg hover:shadow-[#6B00D7]/10">
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

      {/* CVT Token Ecosystem Section */}
      <section id="cvt-ecosystem" className="py-20 bg-gradient-to-b from-[#121212] to-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl">CVT <span className="text-[#FF5AF7]">Token</span> Ecosystem</h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">
              The <strong className="text-[#FF5AF7]">ChronosToken (CVT)</strong> powers the entire Chronos Vault platform, providing utility, governance, and incentives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#333] p-6 relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#6B00D7] rounded-full blur-3xl opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FF5AF7] rounded-full blur-3xl opacity-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center animate-pulse-slow shadow-xl">
                      <span className="text-white font-bold text-lg">CVT</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">ChronosToken</h3>
                      <p className="text-[#FF5AF7]">Cross-Chain Utility Token</p>
                    </div>
                  </div>
                  <div className="bg-[#0A0A0A] px-4 py-2 rounded-lg border border-[#333]">
                    <span className="text-gray-400 text-sm">Price:</span>
                    <span className="ml-2 text-white font-bold">Coming Soon</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#222]">
                    <div className="text-gray-400 text-sm">Total Supply</div>
                    <div className="text-white font-bold text-2xl">21,000,000</div>
                    <div className="text-[#FF5AF7] text-sm">Fixed forever</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#222]">
                    <div className="text-gray-400 text-sm">Tokenomics</div>
                    <div className="text-white font-bold text-2xl">Deflationary</div>
                    <div className="text-[#FF5AF7] text-sm">Regular buyback & burn</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Token Distribution</h4>
                  <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#222]">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Community & Ecosystem</span>
                          <span className="text-white font-medium">50%</span>
                        </div>
                        <div className="h-2 bg-[#111] rounded-full overflow-hidden">
                          <div className="h-full w-[50%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Development Fund</span>
                          <span className="text-white font-medium">25%</span>
                        </div>
                        <div className="h-2 bg-[#111] rounded-full overflow-hidden">
                          <div className="h-full w-[25%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Team & Advisors</span>
                          <span className="text-white font-medium">15%</span>
                        </div>
                        <div className="h-2 bg-[#111] rounded-full overflow-hidden">
                          <div className="h-full w-[15%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Partners & Cross-Chain Liquidity</span>
                          <span className="text-white font-medium">10%</span>
                        </div>
                        <div className="h-2 bg-[#111] rounded-full overflow-hidden">
                          <div className="h-full w-[10%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Link href="/cvt-token">
                    <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white px-6 py-3">
                      Explore CVT Tokenomics
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#333] p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Multi-Chain Presence
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#222] text-center">
                    <div className="flex justify-center">
                      <i className="ri-flashlight-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div className="mt-2 font-medium text-white">TON</div>
                    <div className="text-xs text-gray-400">Native</div>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#222] text-center">
                    <div className="flex justify-center">
                      <i className="ri-ethereum-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div className="mt-2 font-medium text-white">Ethereum</div>
                    <div className="text-xs text-gray-400">Wrapped</div>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-lg border border-[#222] text-center">
                    <div className="flex justify-center">
                      <i className="ri-sun-line text-2xl text-[#FF5AF7]"></i>
                    </div>
                    <div className="mt-2 font-medium text-white">Solana</div>
                    <div className="text-xs text-gray-400">Wrapped</div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#333] p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF5AF7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  CVT Utility & Benefits
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <p className="text-gray-200">Platform fees and transaction costs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <p className="text-gray-200">Governance voting on platform upgrades</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <p className="text-gray-200">Discounted vault creation and premium features</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <p className="text-gray-200">Staking rewards with multi-level tiered benefits</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                    </div>
                    <p className="text-gray-200">Time-based multipliers for longer staking periods</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section className="py-20 bg-gradient-to-b from-[#0D0D0D] to-[#0A0A0A] relative overflow-hidden">
        <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-40 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 blur-3xl opacity-30"></div>
          <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/20 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40">
              <span className="text-sm font-medium text-[#FF5AF7]">Groundbreaking Technology</span>
            </div>
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Revolutionary </span>
              <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Security Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pioneering advanced security and privacy technologies across multiple blockchains, ensuring unparalleled protection for your digital assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Triple-Chain Security */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl overflow-hidden border border-[#333] p-6 hover:shadow-lg hover:shadow-[#6B00D7]/10 group transition-all hover:border-[#6B00D7]/50">
              <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF5AF7]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-all">Triple-Chain Security</h3>
              <p className="text-gray-300 mb-4">Our exclusive multi-chain protection ensures your vault has unprecedented security by utilizing the strengths of multiple blockchains simultaneously.</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">Ethereum Security Layer</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">Solana Speed Layer</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">TON Backup Layer</p>
                </div>
              </div>
            </div>
            
            {/* Cross-Chain Atomic Swaps */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl overflow-hidden border border-[#333] p-6 hover:shadow-lg hover:shadow-[#FF5AF7]/10 group transition-all hover:border-[#FF5AF7]/50">
              <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#FF5AF7]/30 to-[#6B00D7]/20 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#FF5AF7]">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                  <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                  <path d="M16 16h6"></path>
                  <path d="M2 16h6"></path>
                  <path d="M12 2v8"></path>
                  <path d="M12 14v8"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FF5AF7] transition-all">Cross-Chain Atomic Swaps</h3>
              <p className="text-gray-300 mb-4">Enable seamless asset type conversions within your vault with our revolutionary cross-chain atomic swap technology.</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">Automatic cross-chain conversions</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">Price-triggered auto-swaps</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#FF5AF7]"></i>
                  </div>
                  <p className="text-gray-200">Yield optimization strategies</p>
                </div>
              </div>
            </div>
            
            {/* IPFS & Arweave Integration */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl overflow-hidden border border-[#333] p-6 hover:shadow-lg hover:shadow-[#00C9FF]/10 group transition-all hover:border-[#00C9FF]/50">
              <div className="rounded-full w-16 h-16 bg-gradient-to-br from-[#00C9FF]/30 to-[#00C9FF]/10 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-[#00C9FF]">
                  <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
                  <path d="M14 2v6h6"></path>
                  <path d="M2 15h10"></path>
                  <path d="M9 18l3-3-3-3"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00C9FF] transition-all">Permanent Storage</h3>
              <p className="text-gray-300 mb-4">Store your vault data permanently with our integration of decentralized storage solutions like IPFS and Arweave.</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00C9FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#00C9FF]"></i>
                  </div>
                  <p className="text-gray-200">IPFS content-addressed storage</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00C9FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#00C9FF]"></i>
                  </div>
                  <p className="text-gray-200">Arweave's "pay once, store forever"</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#00C9FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="ri-checkbox-circle-fill text-[#00C9FF]"></i>
                  </div>
                  <p className="text-gray-200">Censorship-resistant data storage</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Revolutionary Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Zero-Knowledge Proofs */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl overflow-hidden border border-[#333] p-6 hover:shadow-lg hover:shadow-[#9242FC]/10 group transition-all hover:border-[#9242FC]/50">
              <div className="flex items-start gap-5">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#9242FC]/30 to-[#9242FC]/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#9242FC]">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#9242FC] transition-all">Zero-Knowledge Verification</h3>
                  <p className="text-gray-300 mb-3">Prove ownership or status without revealing actual assets or sensitive information.</p>
                  
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#9242FC] bg-[#1A1A1A] text-[#9242FC] hover:bg-[#9242FC]/20 font-medium rounded-lg px-4 py-1.5 text-sm transition-all"
                      onClick={() => setLocation("/revolutionary-features")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Multi-Chain Inheritance */}
            <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-xl overflow-hidden border border-[#333] p-6 hover:shadow-lg hover:shadow-[#00D7C3]/10 group transition-all hover:border-[#00D7C3]/50">
              <div className="flex items-start gap-5">
                <div className="rounded-full w-14 h-14 bg-gradient-to-br from-[#00D7C3]/30 to-[#00D7C3]/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-[#00D7C3]">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00D7C3] transition-all">Multi-Chain Inheritance Protocol</h3>
                  <p className="text-gray-300 mb-3">Distribute inheritance across multiple blockchains with smart failover mechanisms.</p>
                  
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      className="border border-[#00D7C3] bg-[#1A1A1A] text-[#00D7C3] hover:bg-[#00D7C3]/20 font-medium rounded-lg px-4 py-1.5 text-sm transition-all"
                      onClick={() => setLocation("/revolutionary-features")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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