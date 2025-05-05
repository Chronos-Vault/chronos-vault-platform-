import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight, Users, Shield, Clock, Lock, Key, Fingerprint, Globe, FileText, ChevronRight, RefreshCw, Layers, UserPlus } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { formatNumber } from "@/lib/utils";

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
    <div className="flex flex-col text-white font-poppins bg-black">
      <main className="flex-1">
        {/* Hero Section with Animation */}
        <section className="min-h-[100vh] relative overflow-hidden flex items-center justify-center">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505]"></div>
            <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/10 to-[#6B00D7]/5 blur-[120px] opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-[#FF5AF7]/10 via-[#6B00D7]/15 to-[#FF5AF7]/5 blur-[100px] opacity-20 animate-pulse-slow animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 z-10 py-20">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge - Enhanced */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm mb-8 mx-auto shadow-sm shadow-[#FF5AF7]/20">
                <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                  <i className="ri-verified-badge-line mr-2 animate-pulse"></i>
                  Ultra-Premium Blockchain Security <div className="mx-2 w-1 h-1 rounded-full bg-[#FF5AF7]"></div> Triple-Chain Architecture
                </span>
              </div>
              
              {/* Mobile-friendly Centered Headline with Left-Right Animation */}
              <h1 className="font-poppins font-bold mb-8">
                <div className="animate-slide-lr">
                  <span className="hero-title animate-glow whitespace-nowrap">Chronos Vault</span>
                </div>
              </h1>
              
              <div className="mt-4 mb-8">
                <div className="animate-slide-lr" style={{ animationDelay: '0.5s' }}>
                  <p className="hero-subtitle animate-glow max-w-3xl mx-auto">
                    Timeless Security for Digital Assets
                  </p>
                </div>
                <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.  
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <Link 
                  to="/create-vault" 
                  className="px-8 py-5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white text-lg font-semibold rounded-xl shadow-xl shadow-[#6B00D7]/20 hover:shadow-2xl hover:shadow-[#FF5AF7]/30 flex items-center gap-3 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <i className="ri-shield-keyhole-line text-xl"></i> 
                  <span>Create New Vault</span>
                </Link>
                
                <Link 
                  to="/multi-signature-vault" 
                  className="px-8 py-5 bg-transparent border border-[#6B00D7] hover:border-[#FF5AF7] text-white text-lg font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-[#FF5AF7]/5"
                >
                  <i className="ri-user-shared-line text-xl"></i>
                  <span>Multi-Signature Vault</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Additional sections go here */}
        {/* This is a shortened version just to fix the structure */}
      </main>
    </div>
  );
};

export default Home;