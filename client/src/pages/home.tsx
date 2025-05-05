import { useEffect } from "react";
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

  return (
    <>
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden pt-12 pb-20 md:pt-16 md:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-8">
              <div>
                <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl leading-none tracking-tight title-3d mb-4">
                  <span className="block">Chronos Vault</span>
                  <span className="block text-xl md:text-2xl mt-2 font-medium opacity-80 text-gray-200">Lock your assets today, secure your tomorrow</span>
                </h1>
              </div>
              
              <p className="text-gray-300 text-lg max-w-lg">
                Chronos Vault redefines time-locked assets for the decentralized world. 
                Secure, user-friendly, and unstoppable — the future of blockchain vaults.
              </p>
              
              <div className="mt-4 mb-6 rounded-xl bg-[#1A1A1A]/50 border border-[#6B00D7]/20 p-3 flex flex-wrap items-center">
                <span className="text-[#FF5AF7] mr-2">💰</span>
                <span className="text-white font-medium">Now with multi-chain payments!</span>
                <div className="w-full sm:w-auto sm:ml-2 mt-2 sm:mt-0 flex flex-wrap gap-2 items-center">
                  <span className="text-white font-medium sm:mr-2 w-full sm:w-auto text-center sm:text-left">Pay with:</span>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full sm:w-auto">
                    <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">ETH</span>
                    <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">SOL</span>
                    <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">TON</span>
                    <span className="px-2 py-1 bg-[#6B00D7]/20 rounded-md text-white font-semibold">BTC</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleCreateVault}
                  className="cta-button prismatic-border bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#FF5AF7]/30 transition-all w-full sm:w-auto"
                >
                  <div className="flex items-center justify-center w-full">
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
                  variant="outline"
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 text-white font-poppins font-medium hover:border-[#6B00D7] transition-all w-full sm:w-auto"
                  asChild
                >
                  <a href="#features" className="flex items-center justify-center w-full">Learn More</a>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <i className="ri-shield-check-line text-[#6B00D7] text-lg"></i>
                  <span>Trustless Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-time-line text-[#6B00D7] text-lg"></i>
                  <span>Time-Locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ri-global-line text-[#6B00D7] text-lg"></i>
                  <span>Decentralized</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="flex flex-col items-center">
                {/* Vault Type Selector */}
                <div className="mb-4 z-10 flex justify-center space-x-2 md:space-x-4">
                  <div className="flex overflow-hidden rounded-lg border border-[#6B00D7] bg-[#0A0A0A]/70 backdrop-blur-sm">
                    <button className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow text-white text-xs md:text-sm font-medium transition-all">
                      Heritage
                    </button>
                    <button className="px-3 py-2 md:px-4 md:py-2 text-white text-xs md:text-sm font-medium transition-all hover:bg-white/5">
                      Financial
                    </button>
                    <button className="px-3 py-2 md:px-4 md:py-2 text-white text-xs md:text-sm font-medium transition-all hover:bg-white/5">
                      Personal
                    </button>
                    <button className="px-3 py-2 md:px-4 md:py-2 text-white text-xs md:text-sm font-medium transition-all hover:bg-white/5">
                      Multi-Sig
                    </button>
                  </div>
                </div>
                
                <div className="relative w-[350px] h-[530px] md:w-[600px] md:h-[700px] flex items-center justify-center">
                  {/* Vault visualization - Orbital rings */}
                  <div className="absolute w-80 h-80 md:w-[550px] md:h-[550px] rounded-full border border-[#6B00D7]/30 animate-spin opacity-30" style={{animationDuration: '15s'}}></div>
                  <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] rounded-full border border-[#FF5AF7]/20 animate-spin opacity-30" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
                  <div className="absolute w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border-2 border-[#6B00D7]/10 animate-spin opacity-20" style={{animationDuration: '25s'}}></div>
                
                  <div className="relative w-80 h-[520px] md:w-[450px] md:h-[660px] bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl shadow-2xl border-4 border-[#333333] glow-border flex items-center justify-center animate-float overflow-hidden">
                    {/* Top gradient overlay */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20"></div>
                    
                    {/* Hologram security lines */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                      <div className="absolute top-0 left-0 right-0 h-full w-full">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute h-[1px] w-full bg-[#FF5AF7]"
                            style={{ 
                              top: `${i * 5}%`, 
                              left: 0, 
                              animationDelay: `${i * 0.1}s`,
                              opacity: 0.4,
                              animation: 'scanLine 3s linear infinite'
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Background glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/5 via-transparent to-[#FF5AF7]/5 animate-pulse-slow"></div>
                    
                    {/* Lock icon */}
                    <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow flex items-center justify-center text-white text-2xl shadow-xl shadow-[#FF5AF7]/40 border-2 border-white/30 z-20">
                      <i className="ri-lock-line"></i>
                    </div>
                    
                    {/* Security indicators */}
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF5AF7] to-[#C74DFF] animate-gradient-slow shadow-sm shadow-[#FF5AF7]/50"></div>
                      <div className="text-base font-bold text-white uppercase tracking-widest">MULTI-SIGNATURE SECURITY</div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center p-8 z-10 mt-4 w-full">
                      <div className="text-lg font-bold uppercase tracking-widest mb-5 animate-text-3d bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow">
                        MESSAGE FROM THE FUTURE
                      </div>
                      
                      <div className="font-poppins font-extrabold text-3xl md:text-5xl mb-5 title-3d">THE TIME VAULT</div>
                      
                      <div className="flex justify-center mb-6">
                        <div className="h-1 w-44 bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow rounded-full"></div>
                      </div>
                      
                      <div className="relative mb-8 p-5 text-base md:text-xl text-white leading-relaxed border-2 border-[#6B00D7]/50 rounded-lg backdrop-blur-sm bg-black/30">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 py-1 text-[#FF5AF7] text-sm font-bold uppercase tracking-wider border border-[#FF5AF7]/50 rounded-full">
                          2050 A.D.
                        </div>
                        
                        <p className="font-medium animate-text-3d tracking-wide">
                          "We trust in your power to protect this knowledge. When opened in 2050, may our message guide your civilization toward harmony with technology and nature. The power of our united vision flows through time to reach you."
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center text-base md:text-lg text-gray-300 mb-5 bg-[#111]/80 p-4 rounded-lg border-2 border-[#444] backdrop-blur-sm shadow-inner">
                        <span className="font-medium uppercase">PRESERVATION PROTOCOL</span>
                        <div className="flex items-center">
                          <span className="font-bold text-[#FF5AF7] text-2xl">16%</span>
                          <span className="ml-2 text-xs text-gray-400 uppercase">COMPLETE</span>
                        </div>
                      </div>
                      
                      <div className="animate-scan relative h-4 bg-[#222] rounded-full overflow-hidden mb-8 border border-[#444]">
                        <div className="absolute top-0 left-0 h-full w-[16%] bg-gradient-to-r from-[#6B00D7] via-[#C74DFF] to-[#FF5AF7] animate-gradient-slow"></div>
                      </div>
                      
                      <div className="flex flex-col gap-3 bg-[#111]/60 p-5 rounded-lg border-2 border-[#333] mb-6 shadow-inner">
                        <div className="flex justify-between items-center text-base">
                          <span className="text-gray-400 font-bold uppercase">SEALED</span>
                          <span className="text-gray-200 font-bold">APRIL 27, 2025</span>
                        </div>
                        <div className="flex justify-between items-center text-base">
                          <span className="text-gray-400 font-bold uppercase">UNLOCKS</span>
                          <span className="text-gray-200 font-bold">JANUARY 16, 2050</span>
                        </div>
                        <div className="flex justify-between items-center text-base">
                          <span className="text-gray-400 font-bold uppercase">TIME REMAINING</span>
                          <span className="text-gray-200 font-bold">9043 DAYS</span>
                        </div>
                      </div>
                      
                      <button 
                        className="w-full bg-[#111]/80 border-2 border-[#444] rounded-lg p-3 text-base text-white font-medium tracking-wide uppercase hover:bg-[#6B00D7]/10 transition-all hover:border-[#6B00D7]/40 flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled
                      >
                        <i className="ri-lock-2-line"></i>
                        <span>Timelock Active</span>
                      </button>
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