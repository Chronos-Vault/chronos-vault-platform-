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
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2">
              <div className="space-y-6">
                <h1 className="font-poppins font-bold text-4xl md:text-5xl leading-tight">
                  The <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Swiss Bank</span> of Web3
                </h1>
                <p className="text-xl text-gray-200">
                  Secure your digital assets, messages, and files in decentralized, time-locked vaults across multiple blockchains.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF45ED] text-white font-medium rounded-lg px-8 py-3 shadow-glow transition-all"
                    onClick={() => setLocation("/create-vault")}
                  >
                    Create Vault
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#6B00D7] text-white hover:bg-[#6B00D7]/10 hover:text-white font-medium rounded-lg px-8 py-3 transition-all"
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
              
                <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] flex items-center justify-center">
                  {/* Vault visualization */}
                  <div className="absolute w-60 h-60 md:w-72 md:h-72 rounded-full border border-[#6B00D7]/30 animate-spin opacity-30" style={{animationDuration: '15s'}}></div>
                  <div className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full border border-[#FF5AF7]/20 animate-spin opacity-30" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
                  
                  <div className="relative w-64 h-72 md:w-[350px] md:h-[400px] bg-gradient-to-br from-[#1A1A1A] to-[#141414] rounded-3xl shadow-2xl border-2 border-[#333333] glow-border flex items-center justify-center animate-float overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20"></div>
                    
                    {/* Hologram security lines */}
                    <div className="absolute inset-0 overflow-hidden opacity-20">
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
                    
                    <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center text-white text-lg shadow-lg shadow-[#FF5AF7]/30 border-2 border-white/20 animate-pulse-slow">
                      <i className="ri-lock-line"></i>
                    </div>
                    
                    <div className="absolute top-5 left-5 flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#FF5AF7] animate-pulse-slow"></div>
                      <div className="text-sm font-medium text-white uppercase tracking-widest">MULTI-SIGNATURE</div>
                    </div>
                    
                    <div className="text-center p-6 z-10 mt-6 w-full">
                      <div className="text-sm text-gray-200 uppercase tracking-wider mb-2 font-medium bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text animate-text-3d">MESSAGE TO THE FUTURE</div>
                      <div className="font-poppins font-bold text-2xl md:text-3xl text-white mb-3 title-3d">TIME VAULT</div>
                      <div className="flex justify-center mb-4">
                        <div className="h-1 w-24 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                      </div>
                      
                      <div className="relative mb-5 p-3 text-sm md:text-base text-white leading-relaxed border-2 border-[#444] rounded-lg backdrop-blur-sm bg-black/30">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 text-[#FF5AF7] text-xs font-bold uppercase tracking-wider border border-[#444] rounded-full">
                          2050 A.D.
                        </div>
                        <p className="animate-text-3d tracking-wide">
                          "We trust in your power to protect this knowledge. May our message guide your civilization toward harmony."
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center text-base text-gray-300 mb-3 bg-[#111]/70 p-3 rounded-lg border border-[#444] backdrop-blur-sm shadow-inner">
                        <span className="font-medium uppercase">PRESERVATION</span>
                        <span className="font-bold text-[#FF5AF7] text-xl">16%</span>
                      </div>
                      
                      <div className="animate-scan relative h-3 bg-[#222] rounded-full overflow-hidden mb-5 border border-[#444]">
                        <div className="absolute top-0 left-0 h-full w-[16%] bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                      </div>
                      
                      <div className="flex flex-col gap-2 bg-[#111]/40 p-3 rounded-lg border border-[#333] mb-5">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium uppercase">CREATED</span>
                          <span className="text-gray-200 font-medium">TODAY</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium uppercase">UNLOCKS</span>
                          <span className="text-gray-200 font-medium">JAN 16, 2050</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-medium uppercase">REMAINING</span>
                          <span className="text-[#FF5AF7] font-bold">25 YEARS</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-[#444] flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <i className="ri-file-list-3-line text-[#6B00D7] text-lg"></i>
                          <span className="text-sm text-gray-300 font-medium">SMART CONTRACT</span>
                        </div>
                        <div className="text-sm text-[#FF5AF7] font-bold uppercase">MULTI-GEN</div>
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

      {/* Special Vault Section */}
      <section id="bitcoin-halving" className="py-16 bg-[#0D0D0D]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-poppins font-bold text-3xl">Bitcoin <span className="text-[#FF5AF7]">Halving</span> Vault</h2>
            <p className="text-gray-200 mt-3 max-w-2xl mx-auto">Lock your assets until the next Bitcoin halving in 2028 and potentially benefit from price appreciation.</p>
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