import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VaultCard from "@/components/vault/vault-card";
import SmartContractInfoCard from "@/components/contract/smart-contract-info-card";
import LuxuryHero from "@/components/hero/LuxuryHero";
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
      {/* Tesla x Rolex x Web3 Luxury Hero */}
      <LuxuryHero onCreateVault={handleCreateVault} />

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