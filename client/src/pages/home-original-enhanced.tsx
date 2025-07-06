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
    isLocked: true,
    securityLevel: 3,
    ethereumContractAddress: "0x1234...",
    solanaContractAddress: "9z4E...",
    tonContractAddress: "EQA9...",
    unlockConditionType: "date",
    privacyEnabled: true,
    crossChainEnabled: true,
    metadata: {}
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
                {/* Enhanced title with luxury animation */}
                <div className="text-center md:text-left mb-8">
                  <h1 className="font-poppins font-bold mb-4">
                    <div className="animate-slide-lr">
                      <span className="hero-title animate-glow whitespace-nowrap">Chronos Vault</span>
                    </div>
                  </h1>
                  <p className="text-xl sm:text-2xl md:text-3xl mt-4 text-gray-200 max-w-3xl leading-relaxed font-medium">
                    The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
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
                  <div className="absolute w-80 h-80 md:w-[550px] md:h-[550px] rounded-full border border-[#6B00D7]/30 animate-spin-slow opacity-30" style={{animationDuration: '15s'}}></div>
                  <div className="absolute w-72 h-72 md:w-[500px] md:h-[500px] rounded-full border border-[#FF5AF7]/20 animate-spin-slow opacity-30" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
                  <div className="absolute w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border-2 border-[#6B00D7]/10 animate-spin-slow opacity-20" style={{animationDuration: '25s'}}></div>
                
                  <div className="relative w-72 h-[520px] md:w-[450px] md:h-[660px] bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl shadow-2xl border-4 border-[#333333] glow-border flex items-center justify-center animate-float overflow-hidden">
                    {/* Top gradient overlay */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20"></div>
                    
                    {/* Hologram security lines */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
                      <div className="absolute top-0 left-0 right-0 h-full w-full">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute h-[1px] w-full bg-[#FF5AF7] animate-scan"
                            style={{ 
                              top: `${i * 5}%`, 
                              left: 0, 
                              animationDelay: `${i * 0.1}s`,
                              opacity: 0.4
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
                      
                      <div className="relative h-4 bg-[#222] rounded-full overflow-hidden mb-8 border border-[#444]">
                        <div className="absolute top-0 left-0 h-full w-[16%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                        <div className="absolute top-0 left-[15%] right-0 h-full w-full animate-scan opacity-30"></div>
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

      {/* Popular Collections */}
      <section id="popular-collections" className="py-20 bg-[#0D0D0D]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="font-poppins font-bold text-3xl">Popular <span className="text-[#FF5AF7]">Vaults</span></h2>
            <Link href="/my-vaults" className="text-[#6B00D7] hover:text-[#FF5AF7] transition-colors font-medium">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VaultCard vault={sampleVault} />
            <VaultCard vault={{...sampleVault, id: 2, name: "Anniversary Gift", vaultType: "gift", timeLockPeriod: 365}} />
            <VaultCard vault={{...sampleVault, id: 3, name: "College Fund", vaultType: "financial", timeLockPeriod: 1825}} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#10081B] to-[#1A0B1B] overflow-hidden relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
              <span className="animate-text-shine inline-block bg-300% bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7]">Ready to Secure Your Future?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Start creating your first vault today and experience the future of digital asset security. No technical knowledge required.
            </p>
            <Button
              onClick={handleCreateVault}
              className="cta-button prismatic-border bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] px-10 py-6 rounded-lg font-poppins font-medium text-white text-lg shadow-lg hover:shadow-xl shadow-[#6B00D7]/20 hover:shadow-[#6B00D7]/40 transition-all"
            >
              Create Your First Vault
            </Button>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute left-10 top-10 w-36 h-36 bg-[#6B00D7] rounded-full filter blur-[150px] opacity-20"></div>
          <div className="absolute right-10 bottom-10 w-60 h-60 bg-[#FF5AF7] rounded-full filter blur-[150px] opacity-15"></div>
          <div className="absolute right-1/4 top-1/3 w-20 h-20 bg-[#FF5AF7] rounded-full filter blur-[80px] opacity-20"></div>
          <div className="absolute left-1/3 bottom-1/4 w-24 h-24 bg-[#6B00D7] rounded-full filter blur-[80px] opacity-20"></div>
        </div>
      </section>
    </>
  );
};

export default Home;