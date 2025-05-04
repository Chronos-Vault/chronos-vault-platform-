import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaultCard from "@/components/vault/vault-card";
import Hero from "@/components/layout/hero";

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
                <div className="text-center md:text-left mb-8">
                  <h1 className="font-poppins font-bold hero-title neon-purple animate-neon-glow mb-4">
                    Chronos Vault
                  </h1>
                  <p className="text-xl sm:text-2xl md:text-3xl mt-4 text-purple-300 font-light opacity-90">
                    Timeless Security for Digital Assets
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg max-w-lg">
                Chronos Vault redefines time-locked assets for the decentralized world. 
                Secure, user-friendly, and unstoppable — the future of blockchain vaults.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleCreateVault}
                  className="cta-button prismatic-border bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-4 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all"
                >
                  Create Your Vault
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-4 rounded-lg bg-[#1A1A1A] border border-[#6B00D7]/30 text-white font-poppins font-medium hover:border-[#6B00D7] transition-all"
                  asChild
                >
                  <a href="#features">Learn More</a>
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
                    <button className="px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-xs md:text-sm font-medium transition-all">
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
                
                  <div className="relative w-72 h-[520px] md:w-[450px] md:h-[660px] bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl shadow-2xl border-4 border-[#333333] glow-border flex items-center justify-center animate-float overflow-hidden">
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
                  <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white text-2xl shadow-lg shadow-[#FF5AF7]/30 border-2 border-white/30 animate-pulse-slow z-20">
                    <i className="ri-lock-line"></i>
                  </div>
                  
                  {/* Security indicators */}
                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FF5AF7] animate-pulse-slow"></div>
                    <div className="text-base font-bold text-white uppercase tracking-widest">MULTI-SIGNATURE SECURITY</div>
                  </div>
                  
                  {/* Content */}
                  <div className="text-center p-8 z-10 mt-4 w-full">
                    <div className="text-lg font-bold uppercase tracking-widest mb-5 animate-text-3d bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">
                      MESSAGE FROM THE FUTURE
                    </div>
                    
                    <div className="font-poppins font-extrabold text-3xl md:text-5xl mb-5 title-3d">THE TIME VAULT</div>
                    
                    <div className="flex justify-center mb-6">
                      <div className="h-1 w-44 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                    </div>
                    
                    <div className="relative mb-8 p-5 text-base md:text-xl text-white leading-relaxed border-2 border-[#6B00D7]/50 rounded-lg backdrop-blur-sm bg-black/30">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 py-1 text-[#FF5AF7] text-sm font-bold uppercase tracking-wider border border-[#6B00D7]/50 rounded-full">
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
                      <div className="absolute top-0 left-0 h-full w-[16%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
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
                        <span className="text-[#FF5AF7] font-bold text-xl">25 YEARS</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t-2 border-[#444] flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <i className="ri-file-list-3-line text-[#6B00D7] text-2xl"></i>
                        <span className="text-base text-white font-bold">TAMPER-PROOF CONTRACT</span>
                      </div>
                      <div className="text-base text-[#FF5AF7] font-bold uppercase tracking-wider">MULTI-GENERATIONAL</div>
                    </div>
                  </div>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#6B00D7] rounded-tl-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#FF5AF7] rounded-br-3xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 border-t border-[#333333] pt-8">
            <div className="text-center mb-8">
              <span className="text-gray-400 text-sm">TRUSTED BY BLOCKCHAIN LEADERS</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-flashlight-line mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> TON
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-ethereum-line mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> Ethereum
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-layout-grid-line mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> Polygon
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-sun-line mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> Solana
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-link mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> Chainlink
                </div>
              </div>
              <div className="flex justify-center">
                <div className="h-12 w-32 bg-[#1A1A1A] rounded-lg flex items-center justify-center text-gray-400 border border-[#333333] hover:border-[#6B00D7]/50 transition-all group">
                  <i className="ri-hard-drive-2-line mr-2 group-hover:text-[#FF5AF7] transition-colors"></i> Arweave
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
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Creating and managing your time-locked vaults is simple, secure, and transparent.</p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10">
              {/* Step 1 */}
              <div className="relative">
                <div className="hidden md:flex absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] border-2 border-white/20 shadow-lg shadow-[#6B00D7]/30 items-center justify-center font-poppins font-bold text-white text-lg">1</div>
                <Card className="bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 md:mt-12 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                  <CardContent className="p-0">
                    <div className="md:hidden flex w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] items-center justify-center font-poppins font-bold text-white text-lg">1</div>
                    <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Connect Your Wallet</h3>
                    <p className="text-gray-200">Link your Web3 wallet to Chronos Vault with a simple, secure connection process.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-200">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Compatible with MetaMask, Coinbase Wallet, and others</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>No personal data stored on our servers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="hidden md:flex absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] border-2 border-white/20 shadow-lg shadow-[#6B00D7]/30 items-center justify-center font-poppins font-bold text-white text-lg">2</div>
                <Card className="bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 md:mt-12 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                  <CardContent className="p-0">
                    <div className="md:hidden flex w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] items-center justify-center font-poppins font-bold text-white text-lg">2</div>
                    <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Create Your Vault</h3>
                    <p className="text-gray-200">Design your vault with customized time locks, conditions, and security features.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-200">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Set time lock periods from days to decades</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Add beneficiaries or multi-signature requirements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="hidden md:flex absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] border-2 border-white/20 shadow-lg shadow-[#6B00D7]/30 items-center justify-center font-poppins font-bold text-white text-lg">3</div>
                <Card className="bg-[#242424] border border-[#6B00D7]/30 rounded-xl p-6 md:mt-12 hover:border-[#FF5AF7] hover:shadow-lg hover:shadow-[#6B00D7]/30 transition-all">
                  <CardContent className="p-0">
                    <div className="md:hidden flex w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] items-center justify-center font-poppins font-bold text-white text-lg">3</div>
                    <h3 className="font-poppins font-semibold text-xl mb-3 text-white">Deposit & Monitor</h3>
                    <p className="text-gray-200">Securely deposit your assets and monitor your vault's status at any time.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-200">
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Verify your funds on-chain at any time</span>
                      </li>
                      <li className="flex items-start">
                        <i className="ri-checkbox-circle-line text-[#FF5AF7] mt-0.5 mr-2"></i>
                        <span>Receive notifications about your vault's status</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button
              onClick={handleCreateVault}
              className="cta-button bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-4 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all"
            >
              Start Creating Your Vault
            </Button>
          </div>
        </div>
      </section>

      {/* Vaults Showcase */}
      <section id="vaults" className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl">Explore <span className="text-[#FF5AF7]">Vault</span> Types</h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Choose from a variety of specialized vaults designed for different purposes and security needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Legacy Vault */}
            <VaultCard 
              vault={{
                ...sampleVault,
                name: "Legacy Vault",
                description: "Perfect for inheritance planning and ensuring your digital assets reach your loved ones."
              }} 
              variant="legacy" 
            />
            
            {/* Investment Vault */}
            <VaultCard 
              vault={{
                ...sampleVault,
                id: 2,
                name: "Investment Vault",
                description: "Lock your investments for a set period to enforce your long-term strategy and avoid emotional decisions.",
                vaultType: "investment"
              }} 
              variant="investment" 
            />
            
            {/* Project Vault */}
            <VaultCard 
              vault={{
                ...sampleVault,
                id: 3,
                name: "Project Vault",
                description: "Secure funding for DAOs, startups, and organizations with milestone-based unlocking.",
                vaultType: "project"
              }} 
              variant="project" 
            />
          </div>
          
          <div className="mt-12 text-center">
            <Link 
              href="/create-vault" 
              className="inline-flex items-center text-[#6B00D7] hover:text-[#FF5AF7] transition-colors"
            >
              <span>Need a custom vault solution?</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Create Vault CTA */}
      <section className="py-20 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
        
        {/* Background decoration */}
        <div className="absolute top-1/4 -left-10 w-60 h-60 rounded-full bg-[#6B00D7]/10 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-[#FF5AF7]/5 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-3xl mx-auto bg-[#242424] border border-[#6B00D7]/30 rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:shadow-[#6B00D7]/20 transition-all">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <h2 className="font-poppins font-bold text-3xl mb-4 text-white">Ready to Secure Your <span className="text-[#FF5AF7]">Digital Legacy</span>?</h2>
                <p className="text-gray-200">Start building your time-locked vault today and ensure your assets are protected for the future.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 shadow-inner shadow-[#6B00D7]/10 flex items-center justify-center mr-4">
                    <i className="ri-shield-check-line text-[#FF5AF7] text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-poppins font-semibold text-lg mb-1 text-white">Unbreakable Security</h3>
                    <p className="text-gray-200 text-sm">Smart contracts audited by leading security firms.</p>
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
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleCreateVault}
                  className="cta-button bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-8 py-4 rounded-lg font-poppins font-medium text-white shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all"
                >
                  Create Your Vault Now
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-4 rounded-lg bg-[#242424] border-2 border-[#FF5AF7]/30 text-white font-poppins font-medium hover:border-[#FF5AF7] hover:bg-[#FF5AF7]/10 transition-all"
                >
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Home;
