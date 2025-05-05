import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaultCard from "@/components/vault/vault-card";
import SmartContractInfoCard from "@/components/contract/smart-contract-info-card";
// import Hero from "@/components/layout/hero"; // Not used in Tesla x Rolex x Web3 design

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
    metadata: {},
    ethereumContractAddress: "0x1234...",
    solanaContractAddress: "5678...",
    tonContractAddress: "EQAbc...",
    bitCoinAddress: "bc1q...",
    multisigEnabled: false,
    geolocationEnabled: false,
    privacyEnabled: false,
    securityLevel: "high",
    crossChainEnabled: false
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

  const handleCreateVault = () => {
    setLocation("/create-vault");
  };

  const handleExploreVault = (type: string) => {
    setLocation(`/create-vault?type=${type}`);
  };

  // State for 3D effects and animations
  const [scanLineDelay, setScanLineDelay] = useState<number[]>([]);
  const vaultRef = useRef<HTMLDivElement>(null);
  const orbitalRef = useRef<HTMLDivElement>(null);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [particles, setParticles] = useState<Array<{id: number, size: number, top: string, left: string, delay: number, color: string}>>([]);
  
  // Initialize scanning animation lines with staggered delay
  useEffect(() => {
    const delays = Array.from({length: 20}, (_, i) => i * 0.1);
    setScanLineDelay(delays);
    
    // Generate random particles for the quantum effect
    const quantumParticles = Array.from({length: 20}, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 3,
      color: Math.random() > 0.5 ? '#6B00D7' : '#FF5AF7'
    }));
    setParticles(quantumParticles);
    
    // Rotate timer animation
    const timerInterval = setInterval(() => {
      setRotationDegree(prev => (prev + 1) % 360);
    }, 100);
    
    return () => clearInterval(timerInterval);
  }, []);
  
  // Add 3D effect with mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!vaultRef.current || !orbitalRef.current) return;
      
      // Get mouse position relative to viewport
      const { clientX, clientY } = e;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate tilt angle based on mouse position
      const tiltX = ((clientY / windowHeight) - 0.5) * 15; // -7.5 to 7.5 degrees
      const tiltY = ((clientX / windowWidth) - 0.5) * 20; // -10 to 10 degrees
      
      // Apply transformation with smooth transition
      vaultRef.current.style.transform = `perspective(1500px) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
      
      // Shift orbital rings in a parallax effect
      orbitalRef.current.style.transform = `perspective(1500px) rotateX(${-tiltX * 1.5}deg) rotateY(${tiltY * 1.5}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <>
      {/* Tesla x Rolex x Web3 Luxury Hero */}
      <section className="relative min-h-screen bg-[#080808] overflow-hidden">
        {/* Background design elements */}
        <div className="absolute inset-0 -z-10">
          {/* Radial gradients for depth */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[70vh] bg-[#6B00D7] opacity-[0.07] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-[#FF5AF7] opacity-[0.07] blur-[120px] rounded-full"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]"></div>
          
          {/* Horizontal grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={`h-line-${i}`}
              className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-[#6B00D7]/20 to-transparent"
              style={{ top: `${(i + 1) * 10}%`, opacity: 0.1 + (i * 0.01) }}
            ></div>
          ))}
          
          {/* Vertical grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={`v-line-${i}`}
              className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#FF5AF7]/20 to-transparent"
              style={{ left: `${(i + 1) * 10}%`, opacity: 0.1 + (i * 0.01) }}
            ></div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 pt-20 pb-12 md:pt-24 md:pb-20 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-center justify-between">
            {/* Left side - Content */}
            <div className="w-full md:w-5/12 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                <span className="text-sm font-medium text-[#FF5AF7]">Triple-Chain Security Active</span>
              </div>
              
              {/* Headline with animation */}
              <div className="space-y-4">
                <h1 className="animate-slide-lr">
                  <span className="hero-title font-bold font-poppins">Chronos Vault</span>
                  <div className="mt-3 text-xl md:text-2xl lg:text-3xl font-medium text-gray-200">
                    The Tesla × Rolex × Web3 of Digital Vaults
                  </div>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                  The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
                </p>
              </div>
              
              {/* Chain compatibility banner */}
              <div className="p-4 rounded-xl bg-[#121212] border border-[#333] backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-glow-sm mr-3">
                    <i className="ri-global-line text-white text-xl"></i>
                  </div>
                  <span className="text-lg font-semibold text-white">Multi-Chain Compatibility</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#3c3483]/30">
                    <i className="ri-ethereum-line text-white"></i>
                    <span className="text-sm font-medium text-white">Ethereum</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#9945FF]/30">
                    <i className="ri-sun-line text-white"></i>
                    <span className="text-sm font-medium text-white">Solana</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#0098EA]/30">
                    <i className="ri-bit-coin-line text-white"></i>
                    <span className="text-sm font-medium text-white">TON</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#f7931a]/30">
                    <i className="ri-bit-coin-line text-white"></i>
                    <span className="text-sm font-medium text-white">Bitcoin</span>
                  </div>
                </div>
              </div>
              
              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleCreateVault}
                  className="px-6 py-6 text-base md:text-lg bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow rounded-xl font-semibold shadow-lg hover:shadow-[#6B00D7]/30 transition-all duration-300"
                >
                  <div className="flex items-center">
                    <i className="ri-shield-keyhole-line mr-2 text-xl"></i>
                    <span>Create Your Vault</span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="px-6 py-6 text-base md:text-lg border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white rounded-xl transition-all duration-300"
                  asChild
                >
                  <a href="#features">
                    <div className="flex items-center">
                      <i className="ri-lock-password-line mr-2 text-xl"></i>
                      <span>Multi-Signature Vault</span>
                    </div>
                  </a>
                </Button>
              </div>
              
              {/* Security features */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <i className="ri-shield-check-line text-[#FF5AF7]"></i>
                  </div>
                  <span>Military-Grade Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <i className="ri-lock-line text-[#FF5AF7]"></i>
                  </div>
                  <span>Zero-Knowledge Privacy</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <i className="ri-time-line text-[#FF5AF7]"></i>
                  </div>
                  <span>Time-Locked Protocols</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
                    <i className="ri-global-line text-[#FF5AF7]"></i>
                  </div>
                  <span>Cross-Chain Compatibility</span>
                </div>
              </div>
            </div>
            
            {/* Right side - 3D Vault Visualization */}
            <div className="w-full md:w-7/12 flex justify-center items-center">
              <div className="relative w-full max-w-[600px] h-[600px] flex items-center justify-center">
                {/* 3D Orbital rings with perspective effect */}
                <div ref={orbitalRef} className="absolute inset-0 transition-transform duration-500 ease-out" style={{transformStyle: 'preserve-3d'}}>
                  {/* Orbital rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-[500px] h-[500px] rounded-full border border-[#6B00D7]/30 animate-spin-slow" style={{animationDuration: '25s', transform: 'rotateX(75deg)'}}></div>
                    <div className="absolute w-[400px] h-[400px] rounded-full border border-[#FF5AF7]/20 animate-spin-slow" style={{animationDuration: '20s', animationDirection: 'reverse', transform: 'rotateX(75deg) rotateY(15deg)'}}></div>
                    <div className="absolute w-[300px] h-[300px] rounded-full border border-[#6B00D7]/30 animate-spin-slow" style={{animationDuration: '15s', transform: 'rotateX(75deg) rotateY(-15deg)'}}></div>
                  </div>
                  
                  {/* Quantum particles */}
                  {particles.map(particle => (
                    <div 
                      key={`particle-${particle.id}`}
                      className="absolute rounded-full animate-float-slow"
                      style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        top: particle.top,
                        left: particle.left,
                        backgroundColor: particle.color,
                        boxShadow: `0 0 6px ${particle.color}`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${5 + particle.delay * 2}s`
                      }}
                    ></div>
                  ))}
                </div>
                
                {/* Main Vault Visualization */}
                <div 
                  ref={vaultRef} 
                  className="relative w-[320px] h-[500px] md:w-[350px] md:h-[550px] bg-gradient-to-br from-[#151515] to-black rounded-3xl border-4 border-[#333] shadow-2xl transition-transform duration-500 ease-out overflow-hidden"
                  style={{transformStyle: 'preserve-3d'}}
                >
                  {/* Holographic scan lines */}
                  <div className="absolute inset-0 overflow-hidden">
                    {scanLineDelay.map((delay, index) => (
                      <div 
                        key={`scan-line-${index}`}
                        className="absolute h-[1px] w-full bg-[#FF5AF7] opacity-20 animate-scan"
                        style={{
                          top: `${index * 5}%`,
                          animationDelay: `${delay}s`,
                          animationDuration: '3s'
                        }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Glass reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"></div>
                  
                  {/* Security badge */}
                  <div className="absolute -top-5 -right-5 w-[70px] h-[70px] rounded-full bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow flex items-center justify-center text-white text-2xl shadow-lg shadow-[#FF5AF7]/20 border-2 border-white/10 z-20">
                    <i className="ri-lock-line"></i>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-6 left-6 flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow"></div>
                    <span className="text-xs font-bold text-white tracking-widest">QUANTUM SECURED</span>
                  </div>
                  
                  {/* Vault Content */}
                  <div className="text-center p-6 pt-16 z-10 w-full h-full flex flex-col">
                    <div className="text-lg font-bold uppercase tracking-widest mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-gradient-slow">
                      CHRONO·VAULT
                    </div>
                    
                    <div className="font-poppins font-bold text-3xl mb-4 title-3d text-white">THE TIME VAULT</div>
                    
                    <div className="flex justify-center mb-6">
                      <div className="h-1 w-40 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                    </div>
                    
                    {/* Message Box */}
                    <div className="relative mb-8 p-5 text-base text-white leading-relaxed border-2 border-[#6B00D7]/30 rounded-lg backdrop-blur-sm bg-black/30">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 text-[#FF5AF7] text-xs font-bold uppercase tracking-wider border border-[#FF5AF7]/30 rounded-full">
                        2050 A.D.
                      </div>
                      
                      <p className="font-medium tracking-wide">
                        "We trust in your power to protect this knowledge. When opened in 2050, may our message guide your civilization toward harmony with technology and nature."
                      </p>
                    </div>
                    
                    {/* Rotating countdown timer */}
                    <div className="flex-1 flex items-center justify-center">
                      <div 
                        className="w-40 h-40 relative transition-all duration-100 ease-linear"
                        style={{ transform: `rotate(${rotationDegree}deg)` }}
                      >
                        <div className="absolute inset-0 rounded-full border-4 border-[#6B00D7]/30"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-[#FF5AF7]/20"></div>
                        <div className="absolute inset-4 rounded-full border-4 border-[#6B00D7]/10"></div>
                        
                        {/* Timer markers */}
                        {Array.from({ length: 12 }).map((_, i) => (
                          <div 
                            key={`marker-${i}`}
                            className="absolute w-1 h-3 bg-[#FF5AF7]/70"
                            style={{
                              top: '0',
                              left: '50%',
                              transformOrigin: 'bottom center',
                              transform: `translateX(-50%) rotate(${i * 30}deg) translateY(-20px)`,
                            }}
                          ></div>
                        ))}
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-white">9,043</div>
                            <div className="text-xs text-gray-400 uppercase mt-1">DAYS REMAINING</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status bar at bottom */}
                    <div className="mt-auto flex justify-between items-center bg-[#111]/80 p-3 rounded-lg border border-[#333] backdrop-blur-sm">
                      <span className="text-xs font-medium uppercase text-gray-400">STATUS</span>
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#FF5AF7] mr-2 animate-pulse"></span>
                        <span className="font-medium text-[#FF5AF7] text-sm">LOCKED</span>
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
      <section id="features" className="py-20 bg-[#080808]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl mb-4 tracking-tight title-3d">Revolutionary Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Chronos Vault combines cutting-edge blockchain technology with intuitive design to create the most secure digital vault ever.  
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-shield-keyhole-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Triple-Chain Security</h3>
              <p className="text-gray-300">
                Your assets are secured across Ethereum, Solana, and TON blockchains simultaneously, creating an unprecedented security architecture.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-time-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Time-Locked Vaults</h3>
              <p className="text-gray-300">
                Create vaults that unlock at precise future dates. Perfect for heritage planning, future gifts, or long-term investments.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-user-shared-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Multi-Signature Access</h3>
              <p className="text-gray-300">
                Require multiple authorized parties to unlock your vault, adding an additional layer of security and trust.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-map-pin-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Geolocation Unlocking</h3>
              <p className="text-gray-300">
                Create vaults that can only be unlocked from specific geographic locations, perfect for treasure hunts or location-based inheritances.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-eye-off-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Zero-Knowledge Privacy</h3>
              <p className="text-gray-300">
                Our advanced cryptographic protocols ensure your vault contents remain private while still being verifiably secure on the blockchain.
              </p>
            </div>
            
            <div className="bg-[#111111] rounded-xl p-8 border border-[#333] hover:border-[#6B00D7]/40 transition-all group">
              <div className="w-16 h-16 mb-6 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] text-white flex items-center justify-center text-2xl shadow-lg group-hover:shadow-[#FF5AF7]/25 transition-all">
                <i className="ri-global-line"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">Cross-Chain Compatibility</h3>
              <p className="text-gray-300">
                Store and manage assets from different blockchains in one unified interface, with automatic conversion between chains.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vault Types Section */}
      <section className="py-20 bg-gradient-to-b from-[#080808] to-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-4xl mb-4 tracking-tight title-3d">Specialized Vault Types</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from various vault categories designed for specific purposes and security needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Heritage Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-anchor-line text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Heritage Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Preserve your digital legacy for future generations with time-locked access.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  onClick={() => handleExploreVault('heritage')}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
            
            {/* Financial Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-coin-line text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Financial Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Secure cryptocurrency holdings with advanced protection and timed release schedules.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  onClick={() => handleExploreVault('financial')}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
            
            {/* Multi-Signature Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-group-line text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Multi-Signature Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Require approval from multiple trusted parties to access vault contents.
                </p>
                <Link to="/multi-signature-vault">
                  <Button 
                    variant="outline" 
                    className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  >
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Geolocation Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-map-pin-line text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Geolocation Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Create vaults that can only be unlocked at specific geographic coordinates.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  onClick={() => handleExploreVault('geolocation')}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
            
            {/* Smart Contract Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-code-box-line text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Smart Contract Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Program custom conditions for unlocking your vault based on blockchain events.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  onClick={() => handleExploreVault('smart-contract')}
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
            
            {/* Cross-Chain Vault */}
            <Card className="bg-[#0A0A0A] border border-[#333] hover:border-[#6B00D7]/40 transition-all group overflow-hidden">
              <div className="h-36 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-link-m text-6xl text-white"></i>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Cross-Chain Vault</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Store and manage assets across multiple blockchains in a single unified vault.
                </p>
                <Link to="/cross-chain-vault">
                  <Button 
                    variant="outline" 
                    className="w-full border border-[#6B00D7]/40 hover:border-[#FF5AF7] transition-all"
                  >
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Vaults */}
      <section className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="font-poppins font-bold text-4xl mb-4 tracking-tight title-3d">Example Vaults</h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Explore these sample vaults to see how Chronos Vault can be used.
              </p>
            </div>
            <Button 
              className="mt-4 md:mt-0 bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow text-white shadow-lg"
              onClick={handleCreateVault}
            >
              Create Your Own
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Vault 1 */}
            <VaultCard
              vault={{
                ...sampleVault,
                name: "Legacy Preservation Vault",
                description: "Family heirlooms and history for future generations",
                vaultType: "heritage",
                assetType: "Mixed",
                timeLockPeriod: 9125, // 25 years
                unlockDate: new Date(Date.now() + 9125 * 24 * 60 * 60 * 1000),
              }}
            />
            
            {/* Example Vault 2 */}
            <VaultCard
              vault={{
                ...sampleVault,
                id: 2,
                name: "College Fund",
                description: "ETH savings for my daughter's education",
                vaultType: "financial",
                assetAmount: "12.5",
                timeLockPeriod: 2190, // 6 years
                unlockDate: new Date(Date.now() + 2190 * 24 * 60 * 60 * 1000),
              }}
            />
            
            {/* Example Vault 3 */}
            <VaultCard
              vault={{
                ...sampleVault,
                id: 3,
                name: "Company Treasury",
                description: "Multi-signature corporate funds",
                vaultType: "multi-signature",
                assetType: "SOL",
                assetAmount: "1450",
                timeLockPeriod: 0, // No timelock
                unlockDate: new Date(),
                multisigEnabled: true,
                isLocked: true
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Smart Contract Info Section */}
      <section className="py-24 bg-[#080808] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-poppins font-bold text-4xl mb-6 tracking-tight title-3d">Powered by Advanced Smart Contracts</h2>
              <p className="text-xl text-gray-300 mb-8">
                Chronos Vault is built on cutting-edge smart contract technology deployed across Ethereum, Solana, and TON blockchains.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 mt-1 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white text-xl">
                    <i className="ri-shield-check-line"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Audited Security</h3>
                    <p className="text-gray-300">
                      All our smart contracts undergo rigorous security audits by leading blockchain security firms.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 mt-1 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white text-xl">
                    <i className="ri-lock-line"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quantum-Resistant</h3>
                    <p className="text-gray-300">
                      Our encryption methods are designed to withstand threats from quantum computing advancements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 mt-1 rounded-lg bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white text-xl">
                    <i className="ri-github-line"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Open Source</h3>
                    <p className="text-gray-300">
                      Our core contract code is open source and transparent, allowing for community verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0A0A0A] border border-[#333] rounded-xl p-8 shadow-xl">
              <SmartContractInfoCard 
                title="Vault Factory Contract"
                chain="Ethereum (Sepolia Testnet)"
                address="0x4B78aF7C8607C644651206f6894e9E6609190277"
                deployDate="April 1, 2023"
                stats={[
                  { label: "Total Vaults", value: "10,467" },
                  { label: "TVL", value: "$32.5M" },
                  { label: "Success Rate", value: "100%" }
                ]}
              />
              
              <div className="border-t border-[#333] my-8"></div>
              
              <SmartContractInfoCard 
                title="Time Lock Controller"
                chain="Solana (Devnet)"
                address="ChronoSVauLt111111111111111111111111111111111"
                deployDate="April 15, 2023"
                stats={[
                  { label: "Operations", value: "25,142" },
                  { label: "Avg Lock Time", value: "6.2 years" },
                  { label: "Oldest Vault", value: "25 years" }
                ]}
              />
              
              <div className="border-t border-[#333] my-8"></div>
              
              <SmartContractInfoCard 
                title="Cross-Chain Bridge"
                chain="TON (Testnet)"
                address="EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb"
                deployDate="May 1, 2023"
                stats={[
                  { label: "Bridges", value: "3" },
                  { label: "Cross-Chain Txs", value: "4,512" },
                  { label: "Success Rate", value: "99.97%" }
                ]}
              />
            </div>
          </div>
        </div>
        
        {/* Abstract circuit board background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#080808] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-poppins font-bold text-5xl mb-6 tracking-tight title-3d">
              Secure Your Digital Legacy Today
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands who trust Chronos Vault to protect their most valuable digital assets for future generations.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow text-white px-8 py-6 text-lg font-medium shadow-xl hover:shadow-[#FF5AF7]/20 transition-all"
                onClick={handleCreateVault}
              >
                <i className="ri-shield-keyhole-line mr-2"></i> 
                Create Your First Vault
              </Button>
              
              <Button 
                variant="outline" 
                className="border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white px-8 py-6 text-lg font-medium transition-all"
                asChild
              >
                <Link to="/documentation">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-10 blur-3xl"></div>
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-10 blur-3xl"></div>
      </section>
    </>
  );
};

export default Home;