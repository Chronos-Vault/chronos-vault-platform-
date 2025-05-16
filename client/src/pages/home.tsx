import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Shield, Lock, Zap, Users, Clock, ArrowRight, BarChart3, Hexagon, 
  Check, ChevronRight, Activity, Brain, EyeOff, LockKeyhole, 
  CheckCircle2, MapPin, Settings, ExternalLink, FileText,
  CheckCircle, Landmark, Diamond, KeyRound, ShieldCheck, Globe
} from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { motion } from "framer-motion";
import ThreeDHeroBackground from "@/components/hero/3DHeroBackground";
import StakingTiersSection from "@/components/token/StakingTiersSection";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced vault data for impressive display
  const securityRating = 100;
  const activeVaults = 10467;
  const blockchains = 4;

  // Mark onboarding as complete to prevent any redirects
  useEffect(() => {
    console.log('Home: Disabling onboarding redirects completely');
    localStorage.setItem('chronosVault.onboardingStep', JSON.stringify('complete'));
    localStorage.setItem('chronosVault.onboardingCompleted', 'true');
    localStorage.setItem('chronosVault.firstVisit', 'false');
  }, []);
  
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
            
            {/* Call to action buttons with premium styling - Centered */}
            <div className="flex flex-col items-center justify-center space-y-6 mt-12">
              {/* Create Vault Button with premium effect */}
              <div className="relative group">
                {/* Button glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                
                <Button 
                  onClick={() => setLocation('/specialized-vault-creation')} 
                  className="relative px-12 py-5 bg-black text-white text-xl font-bold rounded-full transition-all duration-300 hover:bg-black/50 hover:scale-105 shadow-[0_0_20px_rgba(107,0,215,0.7)]"
                >
                  Create Your Vault
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              {/* Explore Vaults Button with alternative premium effect */}
              <div className="relative group">
                {/* Button subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF5AF7]/40 via-transparent to-[#FF5AF7]/40 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
                
                <Button 
                  onClick={() => setLocation('/my-vaults')}
                  className="relative px-12 py-5 bg-transparent border border-[#FF5AF7]/60 text-white text-xl font-bold rounded-full transition-all duration-300 hover:bg-[#FF5AF7]/10 hover:scale-105 shadow-[0_0_15px_rgba(255,90,247,0.4)]"
                >
                  Explore Vaults
                  <ChevronRight className="inline-block ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Advanced Security Section */}
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
                Triple-Chain Defense System
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                Our proprietary security architecture synchronizes vault protection across Ethereum, Solana, and TON, with real-time monitoring and AI-enhanced threat detection.
              </motion.p>
            </div>
            
            {/* Stats Section with Real Data */}
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
            
            {/* Advanced Security Cards Grid - Matching Premium Triple-Chain Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* Real-Time Security Monitoring */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Core Security
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Activity className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Real-Time Monitoring</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Every 10 seconds, our security system monitors all blockchain networks for transaction anomalies and security threats.
                  </p>
                  
                  {/* Code Visualization with Premium Style */}
                  <div className="bg-black/60 rounded-md p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 text-xs font-mono text-gray-300 mb-4 overflow-x-auto transition-all duration-300">
                    <div className="text-purple-400">startMonitoring() {`{`}</div>
                    <div className="pl-4">this.monitoringInterval = setInterval(<span className="text-[#FF5AF7]">()</span> =&gt; {`{`}</div>
                    <div className="pl-8 text-emerald-400">this.updateChainStatuses();</div>
                    <div className="pl-8 text-emerald-400">this.performRealTimeSecurityAnalysis();</div>
                    <div className="pl-4">{`}`}, <span className="text-amber-400">10000</span>);</div>
                    <div className="text-purple-400">{`}`}</div>
                  </div>
                  
                  {/* Status Indicators with Premium Style */}
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
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Security Tier System - Based on Real Implementation with Premium Design */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Customizable
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Shield className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Security Tier System</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Choose from three distinct security levels, each with increasing protection features based on your specific needs.
                  </p>
                  
                  <div className="space-y-3">
                    {/* Tier 1: Standard with Premium Style */}
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/10 group-hover:border-[#6B00D7]/20 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">Standard</span>
                        <div className="text-xs py-0.5 px-2 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full">Multi-Sig: 2</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Behavioral Analysis</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Data Persistence</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></div>
                          <span className="text-gray-300 opacity-50">Zero-Knowledge</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></div>
                          <span className="text-gray-300 opacity-50">Quantum Resistant</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tier 2: Enhanced with Premium Style */}
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/30 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">Enhanced</span>
                        <div className="text-xs py-0.5 px-2 bg-[#6B00D7]/30 text-[#FF5AF7] rounded-full">Multi-Sig: 3</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Cross-Chain Verify</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Zero-Knowledge</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Geolocation Verify</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Quantum Resistant</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tier 3: Maximum with Premium Style */}
                    <div className="bg-black/40 rounded-xl p-3 border border-[#6B00D7]/30 group-hover:border-[#6B00D7]/40 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white">Maximum</span>
                        <div className="text-xs py-0.5 px-2 bg-[#6B00D7]/40 text-[#FF5AF7] rounded-full">Multi-Sig: 4</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Hardware Keys</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">6-Hour Backups</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">All other features</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></div>
                          <span className="text-gray-300">Enhanced AI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* AI Security Monitoring with Premium Design */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    AI-Enhanced
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <Brain className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Behavioral Analysis</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Advanced AI continually monitors your vault for suspicious activities, detecting anomalies before they become security threats.
                  </p>
                  
                  {/* AI Security Features with Premium Style */}
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
                  
                  {/* Sample Feature Vector with Premium Style */}
                  <div className="bg-black/60 rounded-md p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 text-xs font-mono text-gray-300 overflow-hidden transition-all duration-300">
                    <div className="text-gray-500">// Security Feature Vector Model</div>
                    <div>{`{`}</div>
                    <div className="pl-4"><span className="text-purple-400">recentTransactionCount</span>: <span className="text-amber-400">30</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">uniqueAddressInteractions</span>: <span className="text-amber-400">24</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">unusualTimePatterns</span>: <span className="text-amber-400">0.15</span>,</div>
                    <div className="pl-4"><span className="text-purple-400">unusualLocationPatterns</span>: <span className="text-amber-400">0.08</span>,</div>
                    <div>{`}`}</div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Zero-Knowledge Privacy with Premium Design */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)]">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Privacy-First
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-4 mb-3 flex items-center">
                    <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                      <EyeOff className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Zero-Knowledge Privacy</span>
                  </h3>
                  
                  <p className="text-gray-300 mb-5 pl-1">
                    Our custom ZK-Shield technology enables verification without revealing sensitive vault contents, ensuring complete data privacy.
                  </p>
                  
                  {/* ZK Feature Illustration with Premium Style */}
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
                  
                  {/* ZK Implementation with Premium Style */}
                  <div className="bg-black/60 rounded-md p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 text-xs font-mono text-gray-300 overflow-hidden transition-all duration-300">
                    <div className="text-purple-400">async createVaultAccessProof(vaultId, userId) {`{`}</div>
                    <div className="pl-4 text-emerald-400">// Generate zero-knowledge proof</div>
                    <div className="pl-4">const proof = <span className="text-[#FF5AF7]">await</span> this.generateProof({`{`}</div>
                    <div className="pl-8"><span className="text-yellow-400">privateInputs</span>: [userId, privateKey],</div>
                    <div className="pl-8"><span className="text-yellow-400">publicInputs</span>: [vaultId]</div>
                    <div className="pl-4">{`}`});</div>
                    <div className="text-purple-400">{`}`}</div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>
            
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
        
        {/* Specialized Vaults Section */}
        <section className="py-16 bg-black relative overflow-hidden">
          {/* Subtle particle background effect */}
          <div className="absolute inset-0 z-0 opacity-30">
            <div className="absolute h-2 w-2 rounded-full bg-[#FF5AF7]/30 top-[10%] left-[5%] animate-pulse-slow"></div>
            <div className="absolute h-3 w-3 rounded-full bg-[#6B00D7]/30 top-[20%] left-[25%] animate-pulse-slow delay-150"></div>
            <div className="absolute h-2 w-2 rounded-full bg-[#FF5AF7]/30 top-[15%] left-[75%] animate-pulse-slow delay-300"></div>
            <div className="absolute h-3 w-3 rounded-full bg-[#6B00D7]/30 top-[60%] left-[85%] animate-pulse-slow delay-200"></div>
            <div className="absolute h-2 w-2 rounded-full bg-[#FF5AF7]/30 top-[80%] left-[15%] animate-pulse-slow delay-700"></div>
            <div className="absolute h-2 w-2 rounded-full bg-[#6B00D7]/30 top-[70%] left-[45%] animate-pulse-slow delay-500"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex mb-6 items-center px-3 py-1 rounded-full bg-[#6B00D7]/20 border border-[#6B00D7]/40"
              >
                <span className="text-xs font-medium text-[#FF5AF7] tracking-wider uppercase flex items-center">
                  <Hexagon className="w-3.5 h-3.5 text-[#FF5AF7] mr-1.5" />
                  <span>SPECIALIZED VAULTS</span>
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white"
              >
                Premium Vault Solutions
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-300 max-w-3xl mx-auto"
              >
                Choose from specialized vault templates, each designed for unique security needs and blockchain interactions
              </motion.p>
            </div>
            
            {/* Specialized Vaults Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Vault Type 1: Multi-Signature Vault */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)] h-full">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Governance
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Vault Icon */}
                  <div className="mb-5 relative">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mx-auto">
                      <Users className="text-[#FF5AF7] w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF5AF7]/30 animate-spin-slow"></div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Multi-Signature Vault</span>
                  </h3>
                  
                  <p className="text-gray-300 text-sm text-center mb-5">
                    Secure assets with multiple approvers. Ideal for DAOs, teams, and organizations requiring collective authorization.
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">M-of-N signature scheme</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Multi-chain governance</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Customizable thresholds</span>
                    </div>
                  </div>
                  
                  {/* Interactive Element */}
                  <div className="bg-black/40 rounded-lg p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 transition-all duration-300">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Approval Threshold</span>
                      <span className="text-[#FF5AF7]">3 of 5</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-[60%]"></div>
                    </div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Vault Type 2: Timelock Vault */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)] h-full">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Time-Based
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Vault Icon */}
                  <div className="mb-5 relative">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mx-auto">
                      <Clock className="text-[#FF5AF7] w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF5AF7]/30 animate-spin-slow"></div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">Timelock Vault</span>
                  </h3>
                  
                  <p className="text-gray-300 text-sm text-center mb-5">
                    Lock assets until a specific date or block height. Perfect for long-term investments and scheduled distributions.
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Precise timestamp or block unlock</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Emergency override options</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Scheduled partial distributions</span>
                    </div>
                  </div>
                  
                  {/* Interactive Element */}
                  <div className="bg-black/40 rounded-lg p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 transition-all duration-300">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Time Remaining</span>
                      <span className="text-[#FF5AF7]">224 days</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] w-[38%] animate-pulse-slow"></div>
                    </div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Vault Type 3: GeoLocked Vault */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative group overflow-hidden"
              >
                {/* Premium Card Style with Better Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl"></div>
                
                <div className="relative bg-gradient-to-b from-black/80 to-[#0a0014] backdrop-blur-lg border border-[#6B00D7]/20 hover:border-[#6B00D7]/40 rounded-2xl p-6 transition-all duration-300 shadow-glow overflow-hidden group-hover:shadow-[0_0_25px_rgba(107,0,215,0.3)] h-full">
                  {/* Badge */}
                  <div className="absolute top-3 right-3 text-xs px-2.5 py-1 bg-[#6B00D7]/20 text-[#FF5AF7] rounded-full font-medium">
                    Location-Based
                  </div>
                  
                  {/* Top Gradient Line Effect */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5AF7]/50 to-transparent"></div>

                  {/* Vault Icon */}
                  <div className="mb-5 relative">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mx-auto">
                      <MapPin className="text-[#FF5AF7] w-8 h-8" />
                    </div>
                    <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FF5AF7]/30 animate-spin-slow"></div>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white via-[#FF5AF7] animate-gradient-text">GeoLocked Vault</span>
                  </h3>
                  
                  <p className="text-gray-300 text-sm text-center mb-5">
                    Access assets only from specific geographical locations. Enhanced security for physical presence verification.
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">GPS and IP verification</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Multiple approved locations</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF5AF7] mr-2"></div>
                      <span className="text-xs text-gray-300">Geofencing with radius control</span>
                    </div>
                  </div>
                  
                  {/* Interactive Element */}
                  <div className="bg-black/40 rounded-lg p-3 border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 transition-all duration-300">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Current Location</span>
                      <span className="text-green-500">✓ Authorized</span>
                    </div>
                    <div className="mt-2 flex space-x-1.5">
                      <div className="h-1.5 w-1/3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                      <div className="h-1.5 w-1/3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full opacity-70"></div>
                      <div className="h-1.5 w-1/3 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Shimmering Effect */}
                  <div className="absolute -inset-4 -z-10 opacity-0 group-hover:opacity-30 transition-opacity duration-700">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-2000 ease-in-out bg-gradient-to-r from-transparent via-white to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Learn More Button */}
            <div className="mt-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="inline-block"
              >
                <button 
                  onClick={() => setLocation('/specialized-vault-creation')}
                  className="relative px-8 py-3 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/60 to-[#FF5AF7]/60 opacity-50 group-hover:opacity-70 rounded-lg blur-sm transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2 bg-black rounded-lg border border-[#6B00D7]/40 px-6 py-2.5">
                    <span className="text-white font-medium">Create Specialized Vault</span>
                    <ArrowRight className="w-4 h-4 text-[#FF5AF7] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Triple-Chain Security Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-6 py-2 rounded-full border border-[#6B00D7]/50 bg-gradient-to-r from-black/80 via-[#6B00D7]/20 to-black/80 shadow-[0_0_10px_rgba(107,0,215,0.6)]">
                <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white uppercase tracking-wider animate-text-shine">Triple-Chain Security Architecture</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">Unbreakable Vault Technology</h2>
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
                  
                  {/* Action button to view security details */}
                  <div className="mt-6">
                    <Link to="/security" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#6B00D7]/30 hover:-translate-y-1 cta-button">
                      <Shield className="w-4 h-4 mr-2" />
                      Explore Triple-Chain Security
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
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
        
        {/* Next-Generation Vault Visualization */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex mb-3 items-center justify-center space-x-2 px-6 py-2 rounded-full border border-[#6B00D7]/50 bg-gradient-to-r from-black/80 via-[#6B00D7]/20 to-black/80 shadow-[0_0_10px_rgba(107,0,215,0.6)]">
                  <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white uppercase tracking-wider animate-text-shine">Revolutionary Security Architecture</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">Next-Generation Vault Visualization</h2>
                <p className="text-gray-300 max-w-3xl mx-auto text-lg">Experience the most sophisticated visual representation of blockchain vault security ever created</p>
              </div>
              
              <div className="relative mx-auto mb-8">
                {/* Animated glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7]/30 via-[#FF5AF7]/30 to-[#6B00D7]/30 rounded-xl blur-md"></div>
                
                {/* Main card */}
                <div className="relative bg-black border border-[#6B00D7]/40 rounded-xl p-6 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
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
              </div>
              
              <div className="mt-8 text-center">
                <Button className="bg-[#6B00D7] hover:bg-[#FF5AF7] text-white py-3 px-6 rounded-full shadow-glow-sm">
                  <Shield className="mr-2 h-5 w-5" /> Experience Superior Security
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Intentionally removed duplicate Specialized Vaults section */}
        
        {/* How Chronos Vault Works Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-6 py-2 rounded-full border border-[#6B00D7]/50 bg-gradient-to-r from-black/80 via-[#6B00D7]/20 to-black/80 shadow-[0_0_10px_rgba(107,0,215,0.6)]">
                <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white uppercase tracking-wider animate-text-shine">How Chronos Vault Works</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">Triple-Chain Security Architecture</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg">Our advanced multi-blockchain security system utilizes TON, Ethereum, and Solana to create an impenetrable vault system</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative mb-6 md:mb-0">
                {/* Animated glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-black border border-[#6B00D7]/40 rounded-xl p-6 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
                  <div className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                      <KeyRound className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Wallet Connection</h3>
                    </div>
                  </div>
                  <p className="text-gray-400">Connect any of our supported wallets (TON, Ethereum, or Solana) to securely authenticate and access our platform.</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center"><Activity className="w-4 h-4 mr-1 text-[#FF5AF7]" /> Real-time security monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative mb-6 md:mb-0">
                {/* Animated glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-black border border-[#6B00D7]/40 rounded-xl p-6 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
                  <div className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                      <Shield className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Vault Creation</h3>
                    </div>
                  </div>
                  <p className="text-gray-400">Create and configure your vault with options for time-locking, multi-signature requirements, and advanced security parameters.</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-[#FF5AF7]" /> AI security analysis active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                {/* Animated glow effects */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
                
                {/* Main card */}
                <div className="relative h-full bg-black border border-[#6B00D7]/40 rounded-xl p-6 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
                  <div className="absolute -right-4 -top-4 w-10 h-10 rounded-full bg-[#FF5AF7] flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-[#6B00D7]/20 p-3 rounded-lg">
                      <ExternalLink className="text-[#FF5AF7] w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Cross-Chain Verification</h3>
                    </div>
                  </div>
                  <p className="text-gray-400">Your vault is secured across three independent blockchains, creating a security architecture that prevents single points of failure.</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-[#FF5AF7]" /> Triple-chain monitoring</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security Status Dashboard Preview */}
            <div className="mt-16 max-w-4xl mx-auto bg-black/50 border border-[#6B00D7]/30 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="mr-2 text-[#FF5AF7]" /> Security Status Dashboard
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/70 border border-[#6B00D7]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Ethereum Status</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Block Height</span>
                    <span className="text-xs text-white">18,356,932</span>
                  </div>
                </div>
                
                <div className="bg-black/70 border border-[#6B00D7]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Solana Status</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Security Alerts</span>
                    <span className="text-xs text-white">None</span>
                  </div>
                </div>
                
                <div className="bg-black/70 border border-[#6B00D7]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">TON Status</span>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Vault Contracts</span>
                    <span className="text-xs text-white">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-[#6B00D7]/10 border border-[#6B00D7]/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Cross-Chain Security Score</span>
                  <span className="text-sm font-bold text-[#FF5AF7]">98/100</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] h-full rounded-full" style={{ width: '98%' }}></div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">AI-enhanced security monitoring active across three independent blockchain networks</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CVT Token Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex mb-3 items-center justify-center space-x-4">
                <div className="px-6 py-2 rounded-full border border-[#6B00D7]/50 bg-gradient-to-r from-black/80 via-[#6B00D7]/20 to-black/80 shadow-[0_0_10px_rgba(107,0,215,0.6)]">
                  <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white uppercase tracking-wider animate-text-shine">Deflationary Token Model</span>
                </div>
                <div className="px-6 py-2 rounded-full border border-[#6B00D7]/50 bg-gradient-to-r from-black/80 via-[#6B00D7]/20 to-black/80 shadow-[0_0_10px_rgba(107,0,215,0.6)]">
                  <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white uppercase tracking-wider animate-text-shine">Utility-First Design</span>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">CVT Token Economics</h2>
              <p className="text-gray-300 max-w-3xl mx-auto text-lg">The ChronosVault Token (CVT) lies at the core of our ecosystem, powering transactions, reducing fees, and enabling premium features</p>
            </div>
            
            {/* Token Distribution Chart */}
            <div className="max-w-md mx-auto mb-16 relative">
              {/* Animated glow effects */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-2xl blur-xl opacity-70 animate-pulse-slow"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7]/30 via-[#FF5AF7]/30 to-[#6B00D7]/30 rounded-xl blur-md"></div>
              
              {/* Main card */}
              <div className="relative bg-black border border-[#6B00D7]/40 rounded-xl p-8 backdrop-blur-xl z-10 shadow-[0_0_25px_rgba(255,90,247,0.15)]">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white mb-6 text-center animate-text-shine">Token Distribution</h3>
                
                <div className="relative h-64 w-64 mx-auto group">
                  {/* Enhanced circular chart with animation and glow effects */}
                  <div className="absolute inset-0 rounded-full border-8 border-[#6B00D7] opacity-40 animate-spin-slow"></div>
                  <div className="absolute inset-8 rounded-full border-8 border-[#FF5AF7] opacity-30 animate-spin-slow-reverse"></div>
                  <div className="absolute inset-16 rounded-full border-8 border-purple-800 opacity-50"></div>
                  <div className="absolute inset-24 rounded-full bg-black/80 backdrop-blur-sm border border-[#6B00D7]/40 flex items-center justify-center shadow-[0_0_15px_rgba(107,0,215,0.6)]">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#FF5AF7] to-[#6B00D7] animate-text-shine">CVT</span>
                  </div>
                  
                  {/* Animated dots around the circle */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-300"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-100"></div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse delay-200"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <div className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#6B00D7]/70 shadow-[0_0_8px_rgba(107,0,215,0.6)] group-hover:scale-125 transition-transform"></div>
                    <div className="text-sm text-white font-medium group-hover:text-[#FF5AF7] transition-colors">Community (40%)</div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.6)] group-hover:scale-125 transition-transform"></div>
                    <div className="text-sm text-white font-medium group-hover:text-[#FF5AF7] transition-colors">Ecosystem (25%)</div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.6)] group-hover:scale-125 transition-transform"></div>
                    <div className="text-sm text-white font-medium group-hover:text-[#FF5AF7] transition-colors">Team (15%)</div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#6B00D7]/60 to-[#6B00D7]/40 shadow-[0_0_8px_rgba(107,0,215,0.3)] group-hover:scale-125 transition-transform"></div>
                    <div className="text-sm text-white font-medium group-hover:text-[#FF5AF7] transition-colors">Reserve (10%)</div>
                  </div>
                  
                  <div className="flex items-center gap-3 group">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#FF5AF7] to-[#FF5AF7]/70 shadow-[0_0_8px_rgba(255,90,247,0.6)] group-hover:scale-125 transition-transform"></div>
                    <div className="text-sm text-white font-medium group-hover:text-[#FF5AF7] transition-colors">Marketing (10%)</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Staking Tiers and Benefits */}
            <StakingTiersSection />
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 bg-black relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#6B00D7]/5 to-black"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            {/* Decorative elements */}
            <div className="absolute left-1/4 top-0 w-24 h-24 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/5 blur-xl"></div>
            <div className="absolute right-1/4 bottom-0 w-32 h-32 rounded-full bg-gradient-to-r from-[#FF5AF7]/10 to-[#6B00D7]/20 blur-xl"></div>
            
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FF5AF7] to-white animate-text-shine">Ready to secure your digital legacy?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">Join thousands of users who trust Chronos Vault with their most valuable digital assets</p>
            
            <div className="relative inline-block group">
              {/* Button glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              
              <Button 
                onClick={() => setLocation("/create-vault")} 
                className="relative px-10 py-4 bg-black text-white text-lg font-bold rounded-full transition-all duration-300 hover:bg-black/50 hover:scale-105 shadow-[0_0_20px_rgba(107,0,215,0.7)]"
              >
                Create Your Vault Now
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            {/* Trust indicators */}
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