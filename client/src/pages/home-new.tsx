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
      </main>
    </div>
  );
};

export default Home;