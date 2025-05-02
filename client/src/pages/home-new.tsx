import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight, Users, Shield } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();

  // Fetch user vaults 
  const { data: vaults, isLoading: isVaultsLoading } = useQuery({
    queryKey: ["/api/vaults/user/1"], // Using userId 1 for demo
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/vaults/user/1");
        if (response.ok) {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.error("Error fetching vaults:", error);
        return [];
      }
    },
  });

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
    metadata: {
      securityLayers: ["ethereum", "solana", "ton"],
      storageType: "ipfs",
      atomicSwapsEnabled: true,
      zkProofs: true
    }
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
                
                <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mt-8 leading-relaxed">
                  Create tamper-proof digital and financial vaults with revolutionary technologies: Triple-Chain Security, Cross-Chain Atomic Swaps, and IPFS/Arweave permanent storage integration.
                </p>
                <p className="text-xl md:text-2xl bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] inline-block text-transparent bg-clip-text font-bold mt-2 animate-text-shine bg-300%">
                  The ultimate solution for protecting what matters most across time and chains.
                </p>
              </div>
              
              <div className="mt-16 flex justify-center">
                <Link 
                  to="/create-vault" 
                  className="px-10 py-5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white text-xl font-semibold rounded-2xl shadow-xl shadow-[#6B00D7]/20 hover:shadow-2xl hover:shadow-[#FF5AF7]/30 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <i className="ri-add-circle-line text-2xl"></i> 
                  <span>Create Your Vault Now</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* My Vaults Section */}
        <section className="py-16 bg-gradient-to-r from-[#0E0E0E] to-[#151515]">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">My Vaults</h2>
              <Link to="/my-vaults">
                <Button variant="ghost" className="text-[#FF5AF7] hover:text-[#FF7AF7] hover:bg-[#FF5AF7]/10">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {/* Sample Vault Card */}
              <VaultCard vault={sampleVault} />

              {/* API-Fetched Vault Cards */}
              {vaults && vaults.length > 0 && vaults.map((vault: any) => (
                <VaultCard key={vault.id} vault={vault} />
              ))}

              {/* Multi-Signature Vault Promo Card */}
              <Card className="h-full bg-gradient-to-br from-[#151515] to-[#1A1A1A] border-[#FF5AF7]/30 hover:border-[#FF5AF7]/60 hover:shadow-md hover:shadow-[#FF5AF7]/10 transition-all cursor-pointer group">
                <Link to="/multi-signature-vault">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="h-7 w-7 text-[#FF5AF7]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Create Multi-Signature Vault</h3>
                      <p className="text-gray-400">Enhanced security with multiple signers required for every transaction.</p>
                    </div>
                    <Button className="mt-6 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] hover:from-[#FF6AF7] hover:to-[#7B10E7] text-white w-full">
                      Get Started
                    </Button>
                  </CardContent>
                </Link>
              </Card>

              {/* Bitcoin Halving Vault Promo Card */}
              <Card className="h-full bg-gradient-to-br from-[#151515] to-[#1A1A1A] border-[#6B00D7]/30 hover:border-[#6B00D7]/60 hover:shadow-md hover:shadow-[#6B00D7]/10 transition-all cursor-pointer group">
                <Link to="/bitcoin-halving-vault">
                  <CardContent className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Coins className="h-7 w-7 text-[#6B00D7]" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Bitcoin Halving Vault</h3>
                      <p className="text-gray-400">Special time-locked vault that unlocks after the 2024 Bitcoin halving.</p>
                    </div>
                    <Button className="mt-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full">
                      Create Vault
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Security Features</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">Chronos Vault offers cutting-edge security features to protect your digital assets.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-[#111] to-[#1A1A1A] border-[#6B00D7]/20 hover:border-[#6B00D7]/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-[#6B00D7]/10 mb-4">
                      <Shield className="h-8 w-8 text-[#6B00D7]" />
                    </div>
                    <h3 className="font-medium text-xl mb-3">Triple-Chain Security</h3>
                    <p className="text-gray-400">Your assets secured across multiple blockchains for redundant protection against exploits.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-[#111] to-[#1A1A1A] border-[#FF5AF7]/20 hover:border-[#FF5AF7]/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-[#FF5AF7]/10 mb-4">
                      <Users className="h-8 w-8 text-[#FF5AF7]" />
                    </div>
                    <h3 className="font-medium text-xl mb-3">Multi-Signature Access</h3>
                    <p className="text-gray-400">Require approval from multiple trusted parties to access or modify vault assets.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-[#111] to-[#1A1A1A] border-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 hover:from-[#6B00D7]/40 hover:to-[#FF5AF7]/40 transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 mb-4">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-medium text-xl mb-3">Zero-Knowledge Privacy</h3>
                    <p className="text-gray-400">Selectively disclose vault information without revealing sensitive data or assets.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/revolutionary-features">
                <Button variant="outline" className="border-[#FF5AF7]/50 text-[#FF5AF7] hover:bg-[#FF5AF7]/10">
                  Explore All Features <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;