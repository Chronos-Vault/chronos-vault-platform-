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
    metadata: {},
    ethereumContractAddress: "0x1234...",
    solanaContractAddress: "5678...",
    tonContractAddress: "EQAbc...",
    bitCoinAddress: "bc1q...",
    multisigEnabled: false,
    geolocationEnabled: false,
  };

  // Handle create vault button click
  const handleCreateVault = () => {
    setLocation("/create-vault");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-[#080808] to-[#121212] relative overflow-hidden flex items-center">
        <div className="container mx-auto px-4 py-16 md:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm mb-2">
                <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                  <i className="ri-verified-badge-line mr-2"></i>
                  Triple-Chain Security
                </span>
              </div>
              
              {/* Title with animation */}
              <h1 className="font-poppins font-bold mb-6">
                <div className="animate-slide-lr">
                  <span className="hero-title animate-glow whitespace-nowrap">Chronos Vault</span>
                </div>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-xl">
                The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={handleCreateVault}
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white px-6 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all"
                >
                  <i className="ri-shield-keyhole-line mr-2"></i> Create Your Vault
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white px-6 py-6 text-lg font-semibold rounded-xl transition-all"
                  asChild
                >
                  <Link to="/multi-signature-vault">Multi-Signature Vault</Link>
                </Button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              {/* 3D Vault Visualization */}
              <div className="relative w-[350px] h-[530px] md:w-[450px] md:h-[650px] flex items-center justify-center">
                {/* Orbital rings */}
                <div className="absolute w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border border-[#6B00D7]/30 animate-spin-slow opacity-30" style={{animationDuration: '15s'}}></div>
                <div className="absolute w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border border-[#FF5AF7]/20 animate-spin-slow opacity-30" style={{animationDuration: '20s', animationDirection: 'reverse'}}></div>
                <div className="absolute w-64 h-64 md:w-[350px] md:h-[350px] rounded-full border-2 border-[#6B00D7]/10 animate-spin-slow opacity-20" style={{animationDuration: '25s'}}></div>
              
                <div className="relative w-72 h-[520px] md:w-[400px] md:h-[620px] bg-gradient-to-br from-[#1A1A1A] to-black rounded-3xl shadow-2xl border-4 border-[#333333] glow-border flex items-center justify-center animate-float overflow-hidden">
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
                  
                  {/* Content */}
                  <div className="text-center p-8 z-10 mt-4 w-full">
                    <div className="text-lg font-bold uppercase tracking-widest mb-5 animate-text-3d bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]">
                      MESSAGE FROM THE FUTURE
                    </div>
                    
                    <div className="font-poppins font-extrabold text-3xl md:text-4xl mb-5 title-3d">THE TIME VAULT</div>
                    
                    <div className="flex justify-center mb-6">
                      <div className="h-1 w-44 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full"></div>
                    </div>
                    
                    <div className="relative mb-8 p-5 text-base text-white leading-relaxed border-2 border-[#6B00D7]/50 rounded-lg backdrop-blur-sm bg-black/30">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 py-1 text-[#FF5AF7] text-sm font-bold uppercase tracking-wider border border-[#6B00D7]/50 rounded-full">
                        2050 A.D.
                      </div>
                      
                      <p className="font-medium animate-text-3d tracking-wide">
                        "We trust in your power to protect this knowledge. When opened in 2050, may our message guide your civilization toward harmony with technology and nature."
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center text-base text-gray-300 mb-5 bg-[#111]/80 p-4 rounded-lg border-2 border-[#444] backdrop-blur-sm shadow-inner">
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-poppins font-bold text-3xl mb-4">Premium Security <span className="text-[#FF5AF7]">Features</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Chronos Vault combines revolutionary blockchain technologies to create the ultimate security for your digital assets.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#1A1A1A] border-0 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                  <i className="ri-shield-keyhole-line text-[#FF5AF7] text-2xl"></i>
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Triple-Chain Security</h3>
                <p className="text-gray-300">Your assets are secured across three separate blockchains, eliminating single points of failure and maximizing protection.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border-0 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                  <i className="ri-fingerprint-line text-[#FF5AF7] text-2xl"></i>
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Zero-Knowledge Privacy</h3>
                <p className="text-gray-300">Advanced cryptographic techniques ensure only you control access to your vaults while maintaining complete privacy.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border-0 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all">
              <CardContent className="p-6">
                <div className="w-14 h-14 mb-4 rounded-lg bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center">
                  <i className="ri-user-shared-line text-[#FF5AF7] text-2xl"></i>
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3">Multi-Signature Protection</h3>
                <p className="text-gray-300">Require multiple trusted parties to approve access, creating an unbreakable authorization mechanism for high-value vaults.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Vaults Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="font-poppins font-bold text-3xl mb-4 md:mb-0">Featured <span className="text-[#6B00D7]">Vaults</span></h2>
            <Link to="/my-vaults" className="text-[#FF5AF7] hover:underline flex items-center">
              View All <i className="ri-arrow-right-line ml-2"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VaultCard vault={{...sampleVault, name: "Legacy Trust Fund", vaultType: "inheritance"}} />
            <VaultCard vault={{...sampleVault, name: "Anniversary Gift", vaultType: "gift", unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}} />
            <VaultCard vault={{...sampleVault, name: "Company Treasury", vaultType: "financial", multisigEnabled: true}} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#000] relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-8">
              <span className="text-white">Ready to Secure Your</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Digital Legacy?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Start creating your first vault today and experience the future of digital asset security. No technical knowledge required.
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