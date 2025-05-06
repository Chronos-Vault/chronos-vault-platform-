import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Zap, Users, Clock, ArrowRight } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

  // Sample vault data for display purposes
  const securityRating = 100;
  const activeVaults = 10467;
  const blockchains = 3;

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
    <div className="flex flex-col bg-black text-white min-h-screen">
      <main className="flex-1">
        {/* Status Badge */}
        <div className="w-full flex justify-center mt-4">
          <div className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-6 py-2 flex items-center gap-2 max-w-sm">
            <div className="h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
            <p className="text-sm">Vault Security Status: <span className="text-[#FF5AF7] font-medium">Active & Secure</span></p>
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-12 mt-4">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
              <span className="h-3 w-3 rounded-full bg-[#6B00D7]"></span>
              <span className="text-sm font-medium text-[#FF5AF7]">Ultra-Premium Blockchain Security</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm font-medium text-[#FF5AF7]">Triple-Chain Architecture</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 mt-8 text-[#FF5AF7] glow-text">
              Chronos Vault
              <div className="text-2xl md:text-3xl text-white/70 mt-1">The Future of Digital Vaults</div>
            </h1>
            
            <p className="text-gray-300 mb-10 max-w-3xl mx-auto">
              The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
            </p>
            
            {/* Security Visualization Card */}
            <div className="max-w-2xl mx-auto relative mb-16">
              <div className="bg-gradient-to-b from-black to-[#0a0014] border border-[#6B00D7]/30 rounded-xl p-8 shadow-glow">
                <div className="absolute top-0 left-0 right-0 text-xs overflow-hidden text-center text-gray-600 font-mono">
                  <div className="animate-marquee-slow">
                    {"0xf70648a8...1bd8a0ce25367b9d1d7c3386d0ad5...6ac72fb89361c5b99c71..."}
                  </div>
                </div>
                
                <div className="flex justify-center my-8">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-[#6B00D7]/5 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-4 bg-[#6B00D7]/10 rounded-full animate-pulse-slow delay-150"></div>
                    <div className="absolute inset-8 bg-black rounded-full border border-[#6B00D7]/40 flex items-center justify-center">
                      <Lock className="text-[#FF5AF7] w-10 h-10" />
                    </div>
                    
                    {/* Connection Dots */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 text-xs overflow-hidden text-center text-gray-600 font-mono">
                  <div className="animate-marquee-slow-reverse">
                    {"E0Bcq_k1_gBECryp9Lkwk-3pTn6Ifmw4UMhz...73Jaq2mjzCVrf14g25cF..."}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
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
            </div>
            
            {/* Security Features */}
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              <div className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Shield className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Military-Grade Encryption</span>
              </div>
              <div className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Zap className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Triple-Chain Security</span>
              </div>
              <div className="bg-black/50 border border-[#6B00D7]/30 rounded-full px-4 py-2 flex items-center gap-2">
                <Lock className="text-[#FF5AF7] w-4 h-4" />
                <span className="text-sm text-white">Zero-Knowledge Privacy</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Triple-Chain Security Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex mb-3 items-center justify-center space-x-2 px-4 py-1 rounded-full border border-[#6B00D7]/30 bg-black/30">
                <span className="text-sm font-medium text-[#FF5AF7]">TRIPLE-CHAIN SECURITY ARCHITECTURE</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Unbreakable Vault Technology</h2>
              <p className="text-gray-300 max-w-3xl mx-auto">Pioneering the most sophisticated security architecture ever developed for digital assets</p>
            </div>
            
            {/* Security Visualization */}
            <div className="max-w-3xl mx-auto relative mb-12 mt-16">
              <div className="bg-gradient-to-b from-black to-[#0a0014] border border-[#6B00D7]/30 rounded-xl p-8 shadow-glow">
                <div className="text-center font-medium mb-2 uppercase text-sm text-gray-400">
                  SECURITY RATING:
                </div>
                <div className="text-center font-bold text-2xl text-[#FF5AF7] mb-6">
                  100%
                </div>
                
                <div className="flex justify-center my-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-[#6B00D7]/5 rounded-full animate-pulse-slow"></div>
                    <div className="absolute inset-3 bg-[#6B00D7]/10 rounded-full animate-pulse-slow delay-150"></div>
                    <div className="absolute inset-6 bg-black rounded-full border border-[#6B00D7]/40 flex items-center justify-center">
                      <Shield className="text-[#FF5AF7] w-8 h-8" />
                    </div>
                    
                    {/* Connection Dots */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-[#FF5AF7] animate-pulse"></div>
                  </div>
                </div>
                
                {/* Blockchain Indicators */}
                <div className="flex justify-between mt-8">
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