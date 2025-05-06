import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Zap, Users, Clock, ArrowRight, BarChart3, Hexagon, Check, ChevronRight } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { motion } from "framer-motion";
import ThreeDHeroBackground from "@/components/hero/3DHeroBackground";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced vault data for impressive display
  const securityRating = 100;
  const activeVaults = 10467;
  const blockchains = 4;

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

  useEffect(() => {
    // Set visibility for animation effects after component mount
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  return (
    <div className="flex flex-col bg-black text-white min-h-screen overflow-hidden">
      {/* Advanced 3D Hero Background */}
      <div className="fixed inset-0 z-0">
        <ThreeDHeroBackground />
      </div>
      
      <main className="flex-1 relative z-10">
        {/* Status Badge */}
        <div className="w-full flex justify-center mt-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/50 border border-[#6B00D7]/30 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-2 max-w-sm"
          >
            <div className="h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
            <p className="text-sm">Vault Security Status: <span className="text-[#FF5AF7] font-medium">Active & Secure</span></p>
          </motion.div>
        </div>
        
        {/* Custom Hero Section */}
        <section className="py-12 mt-4 relative" ref={heroRef}>
          <div className="container relative z-20 mx-auto px-4 max-w-5xl">
            {/* Main header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6">
                <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
                  <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
                  <span>TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
                Unbreakable Vault Technology
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Pioneering the most sophisticated security architecture ever developed for digital assets
              </p>
            </div>
            
            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
              <Button 
                onClick={() => setLocation('/create-vault')} 
                className="bg-[#6B00D7] hover:bg-[#6B00D7]/90 text-white px-8 py-6 rounded-lg text-lg"
              >
                Create Your Vault
              </Button>
              
              <Button 
                onClick={() => setLocation('/my-vaults')}
                variant="outline" 
                className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10 px-8 py-6 rounded-lg text-lg"
              >
                Explore Vaults
              </Button>
            </div>
          </div>
        </section>
        
        {/* Security Statistics Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30"
              >
                <span className="text-sm font-medium text-[#FF5AF7]">ADVANCED BLOCKCHAIN SECURITY</span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl font-bold text-white mb-4"
              >
                Future-Proof Protection
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                Chronos Vault combines quantum-resistant encryption with cutting-edge blockchain technology to create an impenetrable shield for your digital assets.
              </motion.p>
            </div>
            
            {/* Stats Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-[#6B00D7]/20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{activeVaults.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Vaults</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{blockchains}+</div>
                <div className="text-sm text-gray-400">Blockchains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{securityRating}%</div>
                <div className="text-sm text-gray-400">Security Rating</div>
              </div>
            </motion.div>
            
            {/* Security Visualization Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-3xl mx-auto relative mb-16"
            >
              <div className="bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/30 rounded-xl p-8 shadow-glow">
                <div className="absolute top-0 left-0 right-0 text-xs overflow-hidden text-center text-gray-600 font-mono">
                  <div className="animate-marquee-slow">
                    {"0xf70648a8...1bd8a0ce25367b9d1d7c3386d0ad5...6ac72fb89361c5b99c71..."}
                  </div>
                </div>
                
                <div className="flex justify-center my-8">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-[#6B00D7]/5 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-4 bg-[#6B00D7]/10 rounded-full animate-pulse-slow delay-150"></div>
                    <div className="absolute inset-8 bg-black/80 backdrop-blur-md rounded-full border border-[#6B00D7]/40 flex items-center justify-center">
                      <Lock className="text-[#FF5AF7] w-10 h-10" />
                    </div>
                    
                    {/* Connection Dots with enhanced animation */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-300"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-100"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-200"></div>
                    
                    {/* Additional connection lines with glow effect */}
                    <div className="absolute top-0 left-1/2 w-[1px] h-16 -translate-x-1/2 bg-gradient-to-b from-[#FF5AF7] to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 left-1/2 w-[1px] h-16 -translate-x-1/2 bg-gradient-to-t from-[#FF5AF7] to-transparent opacity-50"></div>
                    <div className="absolute left-0 top-1/2 h-[1px] w-16 -translate-y-1/2 bg-gradient-to-r from-[#FF5AF7] to-transparent opacity-50"></div>
                    <div className="absolute right-0 top-1/2 h-[1px] w-16 -translate-y-1/2 bg-gradient-to-l from-[#FF5AF7] to-transparent opacity-50"></div>
                  </div>
                </div>
                
                <div className="text-center mb-4 text-sm font-semibold text-white">
                  <span className="text-[#FF5AF7]">MULTI-SIGNATURE</span> VAULT SYSTEM
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="flex items-center">
                    <Check className="mr-1 h-3 w-3 text-[#FF5AF7]" />
                    <span className="text-gray-300">Quantum Encryption</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-1 h-3 w-3 text-[#FF5AF7]" />
                    <span className="text-gray-300">Zero-Knowledge Proof</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-1 h-3 w-3 text-[#FF5AF7]" />
                    <span className="text-gray-300">Cross-Chain Security</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="mr-1 h-3 w-3 text-[#FF5AF7]" />
                    <span className="text-gray-300">Unhackable Architecture</span>
                  </div>
                </div>
                
                {/* Blockchain indicators */}
                <div className="flex justify-between mt-8 mb-4">
                  <div className="text-center">
                    <div className="text-xs text-[#FF5AF7] mb-1">ETH<br/>Secured</div>
                    <div className="h-1 w-12 bg-[#FF5AF7] rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-[#FF5AF7] mb-1">SOL<br/>Secured</div>
                    <div className="h-1 w-12 bg-[#FF5AF7] rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-[#FF5AF7] mb-1">TON<br/>Secured</div>
                    <div className="h-1 w-12 bg-[#FF5AF7] rounded-full mx-auto"></div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-[#FF5AF7] mb-1">BTC<br/>Secured</div>
                    <div className="h-1 w-12 bg-[#FF5AF7] rounded-full mx-auto"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 text-xs overflow-hidden text-center text-gray-600 font-mono">
                  <div className="animate-marquee-slow-reverse">
                    {"E0Bcq_k1_gBECryp9Lkwk-3pTn6Ifmw4UMhz...73Jaq2mjzCVrf14g25cF..."}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Security Features */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Shield className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Military-Grade Encryption</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Zap className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Triple-Chain Security</span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Lock className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Zero-Knowledge Privacy</span>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Triple-Chain Security Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30 animate-pulse-slow">
                <span className="text-sm font-medium text-[#FF5AF7]">TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-[#FF5AF7] neon-glow">Unbreakable Vault Technology</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg">Pioneering the most sophisticated security architecture ever developed for digital assets</p>
            </div>
            
            {/* Enhanced Security Visualization */}
            <div className="max-w-4xl mx-auto relative mb-16 mt-16">
              {/* Animated glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7]/30 via-[#FF5AF7]/30 to-[#6B00D7]/30 rounded-xl blur-md"></div>
              
              {/* Main card */}
              <div className="relative bg-black border border-[#6B00D7]/40 rounded-xl p-8 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
                {/* Laser grid background effect */}
                <div className="absolute inset-0 overflow-hidden rounded-xl opacity-10">
                  <div className="absolute inset-0 grid grid-cols-12 gap-0.5">
                    {Array(12).fill(0).map((_, i) => (
                      <div key={`col-${i}`} className="h-full w-full border-r border-[#FF5AF7]/20"></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 grid grid-rows-12 gap-0.5">
                    {Array(12).fill(0).map((_, i) => (
                      <div key={`row-${i}`} className="w-full h-full border-b border-[#FF5AF7]/20"></div>
                    ))}
                  </div>
                </div>
                
                {/* Header with hexagon badge */}
                <div className="flex flex-col items-center mb-8 relative">
                  <div className="w-24 h-24 relative mb-4">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#6B00D7] opacity-50 animate-ping-slow"></div>
                    <div className="absolute inset-[4px] rounded-full border-2 border-[#FF5AF7] opacity-30 animate-ping-slow animation-delay-500"></div>
                    <div className="absolute inset-[8px] rounded-full border-2 border-[#6B00D7] opacity-20 animate-ping-slow animation-delay-1000"></div>
                    
                    {/* Central shield with glow */}
                    <div className="absolute inset-[12px] bg-black rounded-full flex items-center justify-center border border-[#FF5AF7]/50 shadow-[0_0_15px_rgba(107,0,215,0.5)]">
                      <Shield className="w-9 h-9 text-[#FF5AF7]" />
                    </div>
                    
                    {/* Animated particles */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#6B00D7] animate-pulse delay-300"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FF5AF7] animate-pulse delay-100"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#6B00D7] animate-pulse delay-200"></div>
                  </div>
                  
                  <div className="text-center font-medium uppercase text-sm text-gray-400 mb-1">
                    SECURITY RATING
                  </div>
                  <div className="text-center font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] mb-1">
                    100%
                  </div>
                  <div className="text-xs text-gray-500 font-mono">QUANTUM-RESISTANT ENCRYPTION</div>
                  
                  {/* Animated security status */}
                  <div className="mt-2 flex items-center space-x-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <span className="text-xs text-gray-300 font-mono">SYSTEM ACTIVE</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] animate-pulse animation-delay-500"></div>
                  </div>
                </div>
                
                {/* Triple-Chain Architecture Diagram */}
                <div className="relative mx-auto max-w-3xl mb-10 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ethereum Layer */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                      <div className="relative bg-black p-4 rounded-lg border border-[#6B00D7]/50 h-full">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-[#6B00D7] mr-3 shadow-[0_0_10px_rgba(107,0,215,0.5)]">
                            <div className="text-[#FF5AF7] text-xs font-bold">ETH</div>
                          </div>
                          <div>
                            <span className="text-white text-sm font-semibold block">Ethereum Layer</span>
                            <span className="text-[#FF5AF7] text-xs">Primary Security</span>
                          </div>
                        </div>
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent mb-3 opacity-50"></div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Provides primary blockchain security for ownership records and access control with immutable contract verification.
                        </p>
                        <div className="mt-3 text-[10px] text-gray-500 font-mono flex items-center">
                          <div className="h-1 w-1 rounded-full bg-[#6B00D7] animate-pulse mr-1"></div>
                          NETWORK ACTIVE
                        </div>
                      </div>
                    </div>
                    
                    {/* Solana Layer */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                      <div className="relative bg-black p-4 rounded-lg border border-[#6B00D7]/50 h-full">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-[#6B00D7] mr-3 shadow-[0_0_10px_rgba(107,0,215,0.5)]">
                            <div className="text-[#FF5AF7] text-xs font-bold">SOL</div>
                          </div>
                          <div>
                            <span className="text-white text-sm font-semibold block">Solana Layer</span>
                            <span className="text-[#FF5AF7] text-xs">Rapid Validation</span>
                          </div>
                        </div>
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent mb-3 opacity-50"></div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          High-frequency monitoring and rapid validation system with millisecond security confirmation protocol.
                        </p>
                        <div className="mt-3 text-[10px] text-gray-500 font-mono flex items-center">
                          <div className="h-1 w-1 rounded-full bg-[#6B00D7] animate-pulse mr-1"></div>
                          NETWORK ACTIVE
                        </div>
                      </div>
                    </div>
                    
                    {/* TON Layer */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                      <div className="relative bg-black p-4 rounded-lg border border-[#6B00D7]/50 h-full">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center border border-[#6B00D7] mr-3 shadow-[0_0_10px_rgba(107,0,215,0.5)]">
                            <div className="text-[#FF5AF7] text-xs font-bold">TON</div>
                          </div>
                          <div>
                            <span className="text-white text-sm font-semibold block">TON Layer</span>
                            <span className="text-[#FF5AF7] text-xs">Recovery System</span>
                          </div>
                        </div>
                        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent mb-3 opacity-50"></div>
                        <p className="text-gray-400 text-xs leading-relaxed">
                          Backup security system with secure recovery operations and emergency validation protocols.
                        </p>
                        <div className="mt-3 text-[10px] text-gray-500 font-mono flex items-center">
                          <div className="h-1 w-1 rounded-full bg-[#6B00D7] animate-pulse mr-1"></div>
                          NETWORK ACTIVE
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection lines animation */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-30 md:block hidden">
                    <div className="absolute inset-0 rounded-full border border-[#FF5AF7] animate-pulse-slow"></div>
                    <div className="absolute inset-[4px] rounded-full border border-[#6B00D7] animate-pulse-slow delay-150"></div>
                    <div className="absolute inset-[8px] rounded-full border border-[#FF5AF7] animate-pulse-slow delay-300"></div>
                  </div>
                </div>
                
                {/* Security verification status */}
                <div className="flex flex-col items-center mt-8">
                  <div className="text-xs text-gray-400 font-mono mb-2">CROSS-CHAIN VERIFICATION STATUS</div>
                  <div className="flex space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-[#6B00D7] animate-pulse"></div>
                      <span className="text-xs text-white">ETH</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-[#6B00D7] animate-pulse delay-150"></div>
                      <span className="text-xs text-white">SOL</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 rounded-full bg-[#6B00D7] animate-pulse delay-300"></div>
                      <span className="text-xs text-white">TON</span>
                    </div>
                  </div>
                  
                  {/* Security verification pulse indicator */}
                  <div className="w-full max-w-sm h-1.5 bg-[#0f0f0f] rounded-full overflow-hidden mb-2">
                    <div className="h-full w-full bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-pulse-slow"></div>
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    VAULT ACCESS: TRIPLE VERIFICATION REQUIRED
                  </div>
                </div>
                
                {/* Security code scrolling effect */}
                <div className="absolute bottom-0 left-0 right-0 h-4 overflow-hidden text-xs text-gray-600 font-mono opacity-30">
                  <div className="animate-marquee-slow whitespace-nowrap">
                    {"{xA4F2}|AUTH_KEY:0xf70648a8...1bd8a0ce25|{xB773}|VAULT_ID:0x3386d0ad5...6ac72fb893|{xD98E}|CROSS_CHAIN_VERIFY:ACTIVE|{xC221}|STATUS:SECURED"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Revolutionary Security Features */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                <span className="text-sm font-medium text-[#FF5AF7]">MILITARY-GRADE PROTECTION</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-[#FF5AF7]">Revolutionary Security</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Chronos Vault combines quantum-resistant encryption with cutting-edge blockchain technology to create an impenetrable shield for your digital assets.
              </p>
            </div>
            
            {/* Security Feature Card */}
            <div className="max-w-xl mx-auto bg-black border border-[#6B00D7]/30 rounded-xl p-6 mb-12">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                  <Shield className="text-[#FF5AF7] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold"><span className="text-[#FF5AF7]">Triple</span>-Chain Security</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-4">Assets secured with immutable cross-verification across Ethereum, Solana, and TON networks for unparalleled security.</p>
            </div>
            
            {/* Next-Generation Vault Visualization */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                  <span className="text-sm font-medium text-[#FF5AF7]">REVOLUTIONARY SECURITY ARCHITECTURE</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Next-Generation Vault Visualization</h2>
                <p className="text-gray-300 max-w-3xl mx-auto">Experience the most sophisticated visual representation of blockchain vault security ever created</p>
              </div>
              
              <div className="bg-black border border-[#6B00D7]/30 rounded-xl p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-sm">
                    <div className="text-[#FF5AF7] mb-1 flex items-center gap-1">
                      <div className="h-2 w-2 bg-[#FF5AF7] rounded-full"></div>
                      Quantum Encryption:
                    </div>
                    <div className="text-white">Active</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-[#FF5AF7] mb-1 flex items-center gap-1">
                      <div className="h-2 w-2 bg-[#FF5AF7] rounded-full"></div>
                      Security Level:
                    </div>
                    <div className="text-white">Maximum</div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="text-[#FF5AF7] mb-1 flex items-center gap-1">
                      <div className="h-2 w-2 bg-[#FF5AF7] rounded-full"></div>
                      Triple-Chain Status:
                    </div>
                    <div className="text-white">Synced</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-gray-300">Vault ID: CVT-XP500</div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#FF5AF7] rounded-full"></div>
                    <div className="text-sm text-white">System Active</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-gray-300 mb-2 text-sm">Security Protocols</div>
                  <div className="relative pt-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 bg-[#FF5AF7] rounded-full"></div>
                      <div className="text-sm text-white">Quantum Encryption</div>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-[#6B00D7]/20">
                      <div className="w-[75%] shadow-none flex flex-col whitespace-nowrap text-white justify-center bg-[#FF5AF7]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-center text-gray-500 bg-black/50 rounded-full py-2 px-4">
                  Chronos Vault Secure Interface • Quantum Resistant • Triple-Chain Protection • Zero-Knowledge Privacy
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button className="bg-[#6B00D7] hover:bg-[#FF5AF7] text-white py-3 px-6 rounded-full shadow-glow-sm">
                  <Shield className="mr-2 h-5 w-5" /> Experience Superior Security
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Specialized Vault Types */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                <span className="text-sm font-medium text-[#FF5AF7]">SPECIALIZED VAULTS</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Premium Vault Solutions</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Choose from specialized vault templates, each designed for unique security needs and blockchain interactions.</p>
            </div>
            
            <div className="mt-8 max-w-md mx-auto text-right">
              <Link to="/vault-types" className="text-[#FF5AF7] font-medium inline-flex items-center hover:underline">
                View All Vault Types <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {/* Multi-Signature Vault Card */}
            <div className="max-w-md mx-auto bg-black border border-[#6B00D7]/30 rounded-xl p-6 mt-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                  <Users className="text-[#FF5AF7] w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#6B00D7]/20 text-[#FF5AF7] text-xs font-medium inline-block px-2 py-1 rounded-full mb-1">
                    Enhanced Security
                  </div>
                  <h3 className="text-xl font-semibold text-white">Multi-Signature Vault</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-6">Requires multiple authorized signatures to access or modify vault contents, ideal for high-value assets.</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  2-15 Signers
                </div>
                <Link to="/multi-signature-vault" className="text-[#FF5AF7] font-medium inline-flex items-center hover:underline">
                  Create <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* How Chronos Vault Works Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                <span className="text-sm font-medium text-[#FF5AF7]">HOW CHRONOS VAULT WORKS</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Secure Your Digital Legacy</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Cutting-edge blockchain technology meets intuitive design to create the most secure vault system in existence</p>
            </div>
            
            {/* Step 1 */}
            <div className="max-w-md mx-auto bg-black border border-[#6B00D7]/30 rounded-xl p-6 mb-12 relative">
              <div className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                  <Users className="text-[#FF5AF7] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Create Your Account</h3>
                </div>
              </div>
              <p className="text-gray-400">Connect your wallet to our secure platform and set up your personal profile with advanced security options.</p>
            </div>
          </div>
        </section>
        
        {/* CVT Token Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center">
                <div className="px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                  <span className="text-sm font-medium text-[#FF5AF7]">Deflationary Token Model</span>
                </div>
                <div className="w-4"></div>
                <div className="px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                  <span className="text-sm font-medium text-[#FF5AF7]">Utility-First Design</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">CVT Token Economics</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">The ChronosVault Token (CVT) lies at the core of our ecosystem, powering transactions, reducing fees, and enabling premium features</p>
            </div>
            
            {/* Token Distribution Chart */}
            <div className="max-w-md mx-auto mb-16">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Token Distribution</h3>
              <div className="relative h-64 w-64 mx-auto">
                {/* This would be a proper chart in a real implementation */}
                <div className="absolute inset-0 rounded-full border-8 border-[#6B00D7] opacity-25"></div>
                <div className="absolute inset-8 rounded-full border-8 border-[#FF5AF7] opacity-25"></div>
                <div className="absolute inset-16 rounded-full border-8 border-purple-800 opacity-25"></div>
                <div className="absolute inset-24 rounded-full bg-black flex items-center justify-center">
                  <div className="text-[#FF5AF7]">CVT</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6B00D7]"></div>
                  <div className="text-sm text-white">Community (40%)</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-600"></div>
                  <div className="text-sm text-white">Ecosystem (25%)</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                  <div className="text-sm text-white">Team (15%)</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#6B00D7]/40"></div>
                  <div className="text-sm text-white">Reserve (10%)</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF5AF7]"></div>
                  <div className="text-sm text-white">Marketing (10%)</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Ready to secure your digital assets?</h2>
            <Button 
              onClick={() => setLocation("/create-vault")} 
              className="bg-[#6B00D7] hover:bg-[#FF5AF7] text-white font-medium py-3 px-8 rounded-full shadow-glow-sm"
            >
              Create Your Vault Now
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;