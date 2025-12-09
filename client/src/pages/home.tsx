import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Shield, Lock, Zap, ArrowRight, 
  ChevronRight, Activity, Brain, EyeOff, LockKeyhole, 
  CheckCircle2, Hexagon, Gift, Repeat, Search, Vault, Info
} from "lucide-react";
import { motion } from "framer-motion";
import ThreeDHeroBackground from "@/components/hero/3DHeroBackground";

const Home = () => {
  const [_, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const supportedChains = 3;
  const feeReduction = 95;

  useEffect(() => {
    localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('complete'));
    localStorage.setItem('chronosVault.onboardingCompleted', 'true');
    localStorage.setItem('chronosVault.firstVisit', 'false');
  }, []);
  
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
    setTimeout(() => {
      setIsVisible(true);
    }, 300);
  }, []);

  return (
    <div className="flex flex-col bg-black text-white min-h-screen overflow-hidden">
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
        
        {/* Hero Section */}
        <section className="py-12 mt-4 relative" ref={heroRef}>
          <div className="container relative z-20 mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40 mb-6">
                <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
                  <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
                  <span>POWERED BY TRINITY PROTOCOL™</span>
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">
                Chronos Vault
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                The most sophisticated multi-chain vault ecosystem for securing, managing, and growing your digital assets
              </p>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-6 mt-12">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                
                <Button 
                  onClick={() => setLocation('/vault-types')} 
                  className="relative px-12 py-5 bg-black text-white text-xl font-bold rounded-full transition-all duration-300 hover:bg-black/50 hover:scale-105 shadow-[0_0_20px_rgba(107,0,215,0.7)]"
                  data-testid="button-create-vault"
                >
                  Create Your Vault
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5AF7]/40 via-transparent to-[#FF5AF7]/40 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
                
                <Button 
                  onClick={() => setLocation('/my-vaults')}
                  className="relative px-12 py-5 bg-transparent border border-[#FF5AF7]/60 text-white text-xl font-bold rounded-full transition-all duration-300 hover:bg-[#FF5AF7]/10 hover:scale-105 shadow-[0_0_15px_rgba(255,90,247,0.4)]"
                  data-testid="button-explore-vaults"
                >
                  Explore Vaults
                  <ChevronRight className="inline-block ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trinity Protocol Security Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex mb-6 items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40"
              >
                <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
                  <Shield className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
                  <span>ADVANCED BLOCKCHAIN SECURITY</span>
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white"
              >
                Trinity Protocol™ Security
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                Chronos Vault's proprietary 2-of-3 consensus architecture synchronizes vault protection across Arbitrum, Solana, and TON with real-time monitoring and AI-enhanced threat detection.
              </motion.p>
            </div>
            
            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-[#6B00D7]/20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{supportedChains}</div>
                <div className="text-sm text-gray-400">Blockchains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">{feeReduction}%</div>
                <div className="text-sm text-gray-400">Fee Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#FF5AF7] mb-1">2-of-3</div>
                <div className="text-sm text-gray-400">Trinity Verify</div>
              </div>
            </motion.div>
            
            {/* Security Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              
              {/* Trinity Protocol Architecture */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Layer 2 Optimized
                  </div>
                  
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Zap className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Trinity Protocol Security</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Fixed blockchain roles with Ethereum Layer 2 (Arbitrum) deployment for 95% lower fees. 2-of-3 mathematical consensus ensures maximum security.
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/20 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">⟠</span>
                          <span className="font-medium text-white">Arbitrum (ETH L2)</span>
                        </div>
                        <span className="text-[#FF5AF7] text-sm">Primary Security</span>
                      </div>
                      <div className="text-xs text-gray-400">Immutable ownership & access control</div>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/20 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">◎</span>
                          <span className="font-medium text-white">Solana</span>
                        </div>
                        <span className="text-[#FF5AF7] text-sm">Rapid Validation</span>
                      </div>
                      <div className="text-xs text-gray-400">High-frequency monitoring</div>
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/20 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">💎</span>
                          <span className="font-medium text-white">TON</span>
                        </div>
                        <span className="text-[#FF5AF7] text-sm">Recovery System</span>
                      </div>
                      <div className="text-xs text-gray-400">Quantum-resistant backup</div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-700">
                    <p className="text-xs text-gray-400">
                      <Shield className="w-3 h-3 inline mr-1 text-blue-400" />
                      Mathematical 2-of-3 consensus across all three blockchains
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Real-Time Security Monitoring */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Core Security
                  </div>
                  
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Activity className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Real-Time Monitoring</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Every 10 seconds, our security system monitors all blockchain networks for transaction anomalies and security threats.
                  </p>
                  
                  <div className="bg-black/60 rounded-md p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 text-xs font-mono text-gray-300 mb-4 overflow-x-auto transition-all duration-300">
                    <div className="text-purple-400">startMonitoring() {`{`}</div>
                    <div className="pl-4">this.monitoringInterval = setInterval(<span className="text-[#FF5AF7]">()</span> =&gt; {`{`}</div>
                    <div className="pl-8 text-emerald-400">this.updateChainStatuses();</div>
                    <div className="pl-8 text-emerald-400">this.performRealTimeSecurityAnalysis();</div>
                    <div className="pl-4">{`}`}, <span className="text-amber-400">10000</span>);</div>
                    <div className="text-purple-400">{`}`}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-black/40 rounded-xl p-2 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/30 transition-all duration-300">
                      <div className="text-xs text-[#FF5AF7] font-semibold mb-2">ETH Status</div>
                      <div className="flex justify-center">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-2 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/30 transition-all duration-300">
                      <div className="text-xs text-[#FF5AF7] font-semibold mb-2">SOL Status</div>
                      <div className="flex justify-center">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      </div>
                    </div>
                    <div className="bg-black/40 rounded-xl p-2 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/30 transition-all duration-300">
                      <div className="text-xs text-[#FF5AF7] font-semibold mb-2">TON Status</div>
                      <div className="flex justify-center">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Behavioral Analysis */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    AI-Enhanced
                  </div>
                  
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Brain className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Behavioral Analysis</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Advanced AI continually monitors your vault for suspicious activities, detecting anomalies before they become security threats.
                  </p>
                  
                  <div className="flex flex-col gap-3 mb-4 p-4 bg-black/40 rounded-xl border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-300">Pattern Recognition</span>
                      <div className="w-2/3 h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-[85%] animate-pulse-slow"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-300">Anomaly Detection</span>
                      <div className="w-2/3 h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-[92%] animate-pulse-slow delay-150"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-300">Threat Prediction</span>
                      <div className="w-2/3 h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-[78%] animate-pulse-slow delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Zero-Knowledge Privacy */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Privacy-First
                  </div>
                  
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <EyeOff className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7]">Zero-Knowledge Privacy</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Our custom ZK-Shield technology enables verification without revealing sensitive vault contents, ensuring complete data privacy.
                  </p>
                  
                  <div className="bg-black/40 rounded-xl p-4 mb-4 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/30 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 flex items-center justify-center">
                        <div className="absolute inset-1 rounded-full bg-black/80 flex items-center justify-center">
                          <LockKeyhole className="w-5 h-5 text-[#FF5AF7]" />
                        </div>
                      </div>
                      
                      <div className="flex-1 h-[2px] bg-gradient-to-r from-[#FF5AF7]/70 via-transparent to-[#6B00D7]/70 relative animate-pulse-slow">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-black border border-[#6B00D7]/30 text-xs text-[#FF5AF7] whitespace-nowrap">
                          ZK Proof
                        </div>
                      </div>
                      
                      <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/30 flex items-center justify-center">
                        <div className="absolute inset-1 rounded-full bg-black/80 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-[#FF5AF7]" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-center text-gray-400">
                      Verify without revealing: Only proofs are shared, never your private data
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Security Features Pills */}
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
                <span className="text-sm text-white">Trinity Protocol™</span>
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
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2"
              >
                <Brain className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">AI-Enhanced Monitoring</span>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Explore Features Section */}
        <section className="py-16 bg-gradient-to-b from-black via-[#0a0014] to-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white"
              >
                Explore Features
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-gray-400 max-w-2xl mx-auto"
              >
                Discover all the powerful tools in the Chronos Vault ecosystem
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {/* Gift Crypto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link href="/gift-crypto">
                  <div className="group relative bg-black/60 border border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,247,0.2)] h-full" data-testid="card-gift-crypto">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Gift className="w-6 h-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5AF7] transition-colors">Gift Crypto</h3>
                    <p className="text-sm text-gray-400">Send crypto gifts for birthdays, holidays & special occasions</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* HTLC Bridge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <Link href="/bridge">
                  <div className="group relative bg-black/60 border border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,247,0.2)] h-full" data-testid="card-bridge">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Repeat className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5AF7] transition-colors">HTLC Bridge</h3>
                    <p className="text-sm text-gray-400">Cross-chain atomic swaps with Trinity consensus</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* Trinity Scan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link href="/monitoring">
                  <div className="group relative bg-black/60 border border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,247,0.2)] h-full" data-testid="card-trinity-scan">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-[#6B00D7]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Search className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5AF7] transition-colors">Trinity Scan</h3>
                    <p className="text-sm text-gray-400">Multi-chain blockchain explorer & monitor</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* Vault Types */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <Link href="/vault-types">
                  <div className="group relative bg-black/60 border border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,247,0.2)] h-full" data-testid="card-vault-types">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Vault className="w-6 h-6 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5AF7] transition-colors">Vault Types</h3>
                    <p className="text-sm text-gray-400">Create time-locked, multi-sig & specialized vaults</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
              
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/about">
                  <div className="group relative bg-black/60 border border-[#6B00D7]/20 hover:border-[#FF5AF7]/50 rounded-xl p-6 transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(255,90,247,0.2)] h-full" data-testid="card-about">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Info className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#FF5AF7] transition-colors">About</h3>
                    <p className="text-sm text-gray-400">Learn about Trinity Protocol™ & our mission</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#6B00D7]/5 to-black"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="absolute left-1/4 top-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/5 blur-xl"></div>
            <div className="absolute right-1/4 bottom-0 w-32 h-32 rounded-full bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/20 blur-xl"></div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white">Ready to secure your digital legacy?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">Join thousands of users who trust Chronos Vault with their most valuable digital assets</p>
            
            <div className="relative inline-block group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              
              <Button 
                onClick={() => setLocation("/vault-types")} 
                className="relative px-10 py-4 bg-black text-white text-lg font-bold rounded-full transition-all duration-300 hover:bg-black/50 hover:scale-105 shadow-[0_0_20px_rgba(107,0,215,0.7)]"
                data-testid="button-create-vault-cta"
              >
                Create Your Vault Now
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <div className="flex items-center space-x-2">
                <Shield className="text-[#FF5AF7] w-5 h-5" />
                <span className="text-sm text-white">Military-Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="text-[#FF5AF7] w-5 h-5" />
                <span className="text-sm text-white">Zero-Knowledge Privacy</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hexagon className="text-[#FF5AF7] w-5 h-5" />
                <span className="text-sm text-white">Cross-Chain Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
