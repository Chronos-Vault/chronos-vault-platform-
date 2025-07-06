import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

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

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white font-poppins">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-[#6B00D7]/30 to-[#FF5AF7]/10 blur-3xl opacity-50"></div>
            <div className="absolute top-80 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-40"></div>
            <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-30"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            {/* Main Hero Content */}
            <div className="relative">
              {/* Headline and Primary Content */}
              <div className="text-center mb-12">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm">
                  <span className="text-sm font-medium text-[#FF5AF7]">Introducing Revolutionary Multi-Chain Security</span>
                </div>
              
                <h1 className="font-poppins font-bold text-4xl md:text-7xl leading-tight mb-8">
                  <span className="animate-text-shine bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent bg-300% inline-block">Next-Generation</span>
                  <br />
                  <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">Digital Asset Security</span>
                </h1>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Button
                  onClick={() => setLocation("/create-vault")}
                  className="px-8 py-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white text-lg font-semibold shadow-lg hover:shadow-[#6B00D7]/20 transition-all rounded-xl"
                >
                  <i className="ri-shield-keyhole-line mr-2"></i> Create Your Vault
                </Button>
                
                <Button
                  onClick={() => setLocation("/multi-signature-vault")}
                  variant="outline"
                  className="px-8 py-6 border-2 border-[#6B00D7] hover:border-[#FF5AF7] text-white text-lg font-semibold transition-all rounded-xl"
                >
                  <i className="ri-user-shared-line mr-2"></i> Multi-Signature Vault
                </Button>
              </div>

              {/* Premium Security Tags */}
              <div className="flex flex-wrap justify-center gap-2 items-center my-6 max-w-2xl mx-auto">
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Triple-Chain Security</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">TON</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">ETH</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">SOL</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">BTC</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Zero-Knowledge</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Quantum-Resistant</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Military-Grade</span>
                <span className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-xs sm:text-sm font-medium backdrop-blur-sm">Cross-Chain</span>
              </div>
            </div>
          </div>
        </section>

        {/* Triple-Chain Security Section */}
        <section className="py-20 bg-[#121212] border-t border-[#6B00D7]/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">Triple-Chain Security Architecture</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">The most sophisticated security system ever created, combining security layers from multiple blockchains</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                    <i className="ri-shield-check-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Primary Security Layer</h3>
                  <p className="text-gray-300 mb-4">TON blockchain provides the main security layer with military-grade encryption and quantum-resistant algorithms.</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                    <i className="ri-check-double-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Secondary Verification</h3>
                  <p className="text-gray-300 mb-4">Ethereum blockchain adds a secondary verification layer with smart contract security and consensus verification.</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg hover:shadow-[#6B00D7]/10 transition-all hover:translate-y-[-5px]">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center mb-4">
                    <i className="ri-lock-2-line text-[#FF5AF7] text-2xl"></i>
                  </div>
                  <h3 className="font-poppins font-semibold text-xl mb-3">Tertiary Protection</h3>
                  <p className="text-gray-300 mb-4">Solana blockchain provides high-performance validation and monitoring with rapid response security checks.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* My Vaults Section */}
        <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#6B00D7]/20">
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

        {/* CVT Token Section */}
        <section className="py-20 bg-[#121212] border-t border-[#6B00D7]/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">CVT Token Economics</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">Chronos Vault Token (CVT) powers our ecosystem with three-tiered staking benefits</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Guardian</h3>
                  <div className="text-3xl font-bold mb-4">1,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    75% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Reduced vault creation fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Priority support access</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Guardian security dashboard</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40 transform scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7]"></div>
                <div className="absolute -top-6 left-0 right-0 text-center">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white text-xs px-4 py-1 rounded-full">POPULAR</span>
                </div>
                <CardContent className="p-8 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Architect</h3>
                  <div className="text-3xl font-bold mb-4">10,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    90% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>All Guardian benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Advanced multi-sig features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Custom security templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Early access to new features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A1A]/50 border border-[#6B00D7]/20 shadow-lg transition-all relative overflow-hidden group hover:border-[#FF5AF7]/40">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]"></div>
                <CardContent className="p-6 text-center">
                  <h3 className="font-poppins font-semibold text-xl mb-3 text-[#FF5AF7]">Vault Sovereign</h3>
                  <div className="text-3xl font-bold mb-4">100,000+ CVT</div>
                  <div className="bg-[#6B00D7]/20 rounded-lg py-2 px-4 mb-4 text-[#FF5AF7] font-semibold">
                    100% Fee Reduction
                  </div>
                  <ul className="text-gray-300 text-left space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>All Architect benefits</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Unlimited vault creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <i className="ri-check-line text-[#FF5AF7] mt-0.5"></i>
                      <span>Developer API access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#000] relative overflow-hidden">
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
                  onClick={() => setLocation("/create-vault")}
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
        </section>
      </main>
    </div>
  );
};

export default Home;
