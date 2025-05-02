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
        {/* Ultra-Premium 3D Hero Section */}
        <section className="min-h-[100vh] relative overflow-hidden flex items-center justify-center">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 bg-black overflow-hidden">
            {/* Deep space gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#050505]"></div>
            
            {/* Animated luxury gradient orbs */}
            <div className="absolute top-1/4 left-1/3 w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-[#6B00D7]/20 via-[#FF5AF7]/10 to-[#6B00D7]/5 blur-[120px] opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-[#FF5AF7]/10 via-[#6B00D7]/15 to-[#FF5AF7]/5 blur-[100px] opacity-20 animate-pulse-slow animation-delay-2000"></div>
            
            {/* Cosmic star field */}
            <div className="absolute inset-0">
              <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white opacity-70 animate-cosmic"></div>
              <div className="absolute top-[25%] left-[40%] w-1.5 h-1.5 bg-white opacity-80 animate-cosmic animation-delay-1000"></div>
              <div className="absolute top-[40%] left-[70%] w-1 h-1 bg-white opacity-60 animate-cosmic animation-delay-2000"></div>
              <div className="absolute top-[65%] left-[85%] w-1 h-1 bg-white opacity-70 animate-cosmic animation-delay-3000"></div>
              <div className="absolute top-[75%] left-[25%] w-2 h-2 bg-white opacity-80 animate-cosmic animation-delay-4000"></div>
              <div className="absolute top-[15%] left-[75%] w-1 h-1 bg-white opacity-60 animate-cosmic"></div>
              <div className="absolute top-[55%] left-[10%] w-1.5 h-1.5 bg-white opacity-70 animate-cosmic animation-delay-1000"></div>
              {/* More stars for a rich cosmos feel */}
              <div className="absolute top-[30%] left-[30%] w-1 h-1 bg-white opacity-80 animate-cosmic animation-delay-3000"></div>
              <div className="absolute top-[70%] left-[60%] w-1 h-1 bg-white opacity-90 animate-cosmic animation-delay-4000"></div>
              <div className="absolute top-[85%] left-[45%] w-1.5 h-1.5 bg-white opacity-70 animate-cosmic animation-delay-2000"></div>
              <div className="absolute top-[20%] left-[55%] w-1 h-1 bg-white opacity-80 animate-cosmic animation-delay-1000"></div>
              <div className="absolute top-[45%] left-[85%] w-1 h-1 bg-white opacity-70 animate-cosmic animation-delay-3000"></div>
              <div className="absolute top-[60%] left-[35%] w-2 h-2 bg-white opacity-60 animate-cosmic animation-delay-2000"></div>
            </div>
            
            {/* Premium luxury grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            
            {/* High-end diagonal accent lines */}
            <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-r from-[#6B00D7]/5 via-[#FF5AF7]/10 to-[#6B00D7]/5 transform rotate-1 translate-y-[-250px]"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-r from-[#FF5AF7]/5 via-[#6B00D7]/10 to-[#FF5AF7]/5 transform -rotate-1 translate-y-[250px]"></div>
            </div>
            
            {/* Dynamic scan line effect */}
            <div className="absolute inset-0 animate-scan opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 z-10 py-20">
            <div className="text-center max-w-5xl mx-auto">
              {/* Ultra-Premium Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 backdrop-blur-sm mb-8 mx-auto">
                <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                  <i className="ri-verified-badge-line mr-2"></i>
                  Ultra-Premium Blockchain Security <div className="mx-2 w-1 h-1 rounded-full bg-[#FF5AF7]"></div> Triple-Chain Architecture
                </span>
              </div>
              
              {/* Centered 3D Headline */}
              <h1 className="font-poppins font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-tight title-3d mb-6">
                <span className="block">Chronos Vault</span>
                <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-medium opacity-80">Timeless Security for Digital Assets</span>
              </h1>
              
              <p className="mt-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The most sophisticated digital vault system ever created, combining Triple-Chain Security, Zero-Knowledge Privacy, and Quantum-Resistant Encryption.  
              </p>
              
              {/* Premium 3D Rotating Vault Visualization */}
              <div className="mt-12 mb-16 relative">
                <div className="relative w-full max-w-3xl aspect-[16/9] mx-auto">
                  {/* 3D Vault Container */}
                  <div className="absolute inset-0 perspective-1000 transform-style-3d animate-float">
                    {/* 3D Vault - Back Panel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] rounded-3xl transform translate-z-[-100px] border border-[#6B00D7]/20 shadow-2xl">
                      {/* Grid pattern */}
                      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    </div>
                    
                    {/* 3D Holographic Interfaces - Left Panel */}
                    <div className="absolute left-[-15%] top-[15%] bottom-[15%] w-[25%] bg-gradient-to-br from-[#6B00D7]/10 to-[#6B00D7]/5 backdrop-blur-md rounded-2xl transform translate-z-[-50px] rotateY-15 border border-[#6B00D7]/30 shadow-lg animate-float animation-delay-1000">
                      {/* Decorative interface elements */}
                      <div className="absolute inset-4 border border-[#6B00D7]/20 rounded-xl grid grid-rows-4 gap-2 p-3">
                        <div className="h-2 w-3/4 bg-[#6B00D7]/40 rounded-full"></div>
                        <div className="h-2 w-1/2 bg-[#6B00D7]/30 rounded-full"></div>
                        <div className="h-2 w-2/3 bg-[#6B00D7]/20 rounded-full"></div>
                        <div className="h-2 w-1/3 bg-[#6B00D7]/40 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* 3D Holographic Interfaces - Right Panel */}
                    <div className="absolute right-[-15%] top-[15%] bottom-[15%] w-[25%] bg-gradient-to-br from-[#FF5AF7]/10 to-[#FF5AF7]/5 backdrop-blur-md rounded-2xl transform translate-z-[-50px] rotateY-neg-15 border border-[#FF5AF7]/30 shadow-lg animate-float animation-delay-2000">
                      {/* Decorative interface elements */}
                      <div className="absolute inset-4 border border-[#FF5AF7]/20 rounded-xl grid grid-rows-4 gap-2 p-3">
                        <div className="h-2 w-1/2 bg-[#FF5AF7]/30 rounded-full"></div>
                        <div className="h-2 w-3/4 bg-[#FF5AF7]/40 rounded-full"></div>
                        <div className="h-2 w-1/3 bg-[#FF5AF7]/30 rounded-full"></div>
                        <div className="h-2 w-2/3 bg-[#FF5AF7]/20 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Blockchain Streaming Data - Top */}
                    <div className="absolute top-[-10%] inset-x-[15%] h-[20%] bg-black/50 backdrop-blur-lg rounded-xl transform translate-z-[-30px] border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 p-2 font-mono text-[8px] text-[#6B00D7] opacity-70">
                        0xf7b8a865c831d9bd5ec48bc5dc95c63a103e056fb869c27c826fc6d6a5d31234...
                      </div>
                      <div className="absolute inset-0 animate-scan"></div>
                    </div>
                    
                    {/* Blockchain Streaming Data - Bottom */}
                    <div className="absolute bottom-[-10%] inset-x-[15%] h-[20%] bg-black/50 backdrop-blur-lg rounded-xl transform translate-z-[-30px] border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 p-2 font-mono text-[8px] text-[#FF5AF7] opacity-70">
                        EQBcp_kl_gSEtJygbLkwk-3pfPn6Iha6ODW2RJJAa-n0_HFZ...
                      </div>
                      <div className="absolute inset-0 animate-scan"></div>
                    </div>
                    
                    {/* Main Vault Body */}
                    <div className="absolute inset-[12%] bg-gradient-to-br from-[#151515] to-[#0A0A0A] rounded-2xl transform translate-z-[30px] border border-white/10 shadow-2xl overflow-hidden">
                      {/* Vault Door Seam */}
                      <div className="absolute inset-y-0 left-[48%] right-[48%] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      
                      {/* Vault Lock Interface */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full backdrop-blur-md border border-white/10 shadow-lg animate-pulse-slow">
                        <div className="absolute inset-2 rounded-full border border-white/20 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] blur-md opacity-60"></div>
                            <i className="ri-lock-2-line text-3xl text-white relative z-10"></i>
                          </div>
                        </div>
                      </div>
                      
                      {/* Security Indicators */}
                      <div className="absolute top-[20%] left-[20%] w-3 h-3 rounded-full bg-[#6B00D7] animate-pulse-slow shadow-glow-sm"></div>
                      <div className="absolute top-[20%] right-[20%] w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow animation-delay-1000 shadow-glow-sm"></div>
                      <div className="absolute bottom-[20%] left-[20%] w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow animation-delay-2000 shadow-glow-sm"></div>
                      <div className="absolute bottom-[20%] right-[20%] w-3 h-3 rounded-full bg-[#6B00D7] animate-pulse-slow animation-delay-3000 shadow-glow-sm"></div>
                    </div>
                    
                    {/* Floating Chain Icons */}
                    <div className="absolute top-[5%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#6B00D7]/30 shadow-lg shadow-[#6B00D7]/20 animate-float">
                      <i className="ri-ethereum-line text-xl text-[#6B00D7]"></i>
                    </div>
                    
                    <div className="absolute top-[15%] right-[25%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#FF5AF7]/30 shadow-lg shadow-[#FF5AF7]/20 animate-float animation-delay-2000">
                      <i className="ri-copper-coin-line text-xl text-[#FF5AF7]"></i>
                    </div>
                    
                    <div className="absolute bottom-[10%] left-[40%] transform -translate-x-1/2 translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#6B00D7]/30 shadow-lg shadow-[#6B00D7]/20 animate-float animation-delay-3000">
                      <Lock className="h-5 w-5 text-[#6B00D7]" />
                    </div>
                    
                    <div className="absolute bottom-[20%] right-[35%] transform translate-x-1/2 translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#FF5AF7]/30 shadow-lg shadow-[#FF5AF7]/20 animate-float animation-delay-1000">
                      <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                  </div>
                </div>
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
              
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto mt-16 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-text-shine bg-300%">
                    {formatNumber(10467)}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">Active Vaults</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-text-shine bg-300%">
                    {formatNumber(3)}+
                  </div>
                  <p className="text-sm text-gray-300 mt-1">Blockchains</p>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] animate-text-shine bg-300%">
                    100%
                  </div>
                  <p className="text-sm text-gray-300 mt-1">Security Rating</p>
                </div>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-16">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-1">
                  <Shield className="h-3 w-3 text-[#6B00D7]" /> Military-Grade Encryption
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-1">
                  <Layers className="h-3 w-3 text-[#FF5AF7]" /> Triple-Chain Security
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-1">
                  <Fingerprint className="h-3 w-3 text-[#6B00D7]" /> Zero-Knowledge Privacy
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ultra-Premium 3D Blockchain Security Showcase */}
        <section className="bg-gradient-to-b from-black to-[#050505] border-y border-white/5 py-20 relative overflow-hidden">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/5 via-transparent to-[#FF5AF7]/5"></div>
            
            {/* Radial Glow Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 blur-[100px] opacity-30"></div>
            
            {/* Digital Circuit Lines */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[10%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent animate-pulse-slow"></div>
              <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7]/30 to-transparent animate-pulse-slow animation-delay-1000"></div>
              <div className="absolute top-[70%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent animate-pulse-slow animation-delay-2000"></div>
              <div className="absolute top-[90%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7]/30 to-transparent animate-pulse-slow animation-delay-3000"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="text-center">
                <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-2">
                  <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                  TRIPLE-CHAIN SECURITY ARCHITECTURE
                  <div className="ml-2 w-6 h-px bg-[#FF5AF7]"></div>
                </h3>
                <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-2">Unbreakable Vault Technology</h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8">Pioneering the most sophisticated security architecture ever developed for digital assets</p>
              </div>
              
              {/* Premium 3D Vault Visualization - Customized for Security Display */}
              <div className="w-full max-w-4xl mx-auto perspective-1000">
                <div className="relative w-full aspect-[16/9] transform-style-3d group hover:rotateY-15 transition-transform duration-1000">
                  {/* Ultra Premium Background Glow */}
                  <div className="absolute inset-[-5%] bg-gradient-to-br from-[#6B00D7]/5 to-[#FF5AF7]/5 rounded-3xl blur-xl opacity-70 transform translate-z-[-200px]"></div>
                  
                  {/* 3D Vault - Back Panel with Grid Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] rounded-3xl transform translate-z-[-100px] border border-[#6B00D7]/20 shadow-2xl overflow-hidden">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    {/* Digital Pulse Wave */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-4 border-[#6B00D7]/20 animate-ping-slow opacity-20"></div>
                      <div className="absolute w-48 h-48 rounded-full border-4 border-[#FF5AF7]/10 animate-ping-slow animation-delay-1000 opacity-20"></div>
                      <div className="absolute w-64 h-64 rounded-full border-4 border-[#6B00D7]/5 animate-ping-slow animation-delay-2000 opacity-20"></div>
                    </div>
                  </div>
                  
                  {/* 3D Holographic Interfaces - Left Panel */}
                  <div className="absolute left-[-10%] top-[15%] bottom-[15%] w-[25%] bg-gradient-to-br from-[#6B00D7]/10 to-[#6B00D7]/5 backdrop-blur-md rounded-2xl transform translate-z-[-50px] rotateY-15 border border-[#6B00D7]/30 shadow-lg animate-float animation-delay-1000 overflow-hidden">
                    {/* Decorative interface elements */}
                    <div className="absolute inset-4 border border-[#6B00D7]/20 rounded-xl grid grid-rows-4 gap-2 p-3">
                      <div className="h-2 w-3/4 bg-[#6B00D7]/40 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-[#6B00D7]/30 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-[#6B00D7]/20 rounded-full"></div>
                      <div className="h-2 w-1/3 bg-[#6B00D7]/40 rounded-full"></div>
                    </div>
                    
                    {/* Animated scan effect */}
                    <div className="absolute inset-0 animate-scan opacity-30"></div>
                    
                    {/* Ethereum Integration Label */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-[#6B00D7]/30 text-xs text-[#6B00D7]">
                      <span className="flex items-center gap-1">
                        <i className="ri-ethereum-line"></i> ETH Secured
                      </span>
                    </div>
                  </div>
                  
                  {/* 3D Holographic Interfaces - Right Panel */}
                  <div className="absolute right-[-10%] top-[15%] bottom-[15%] w-[25%] bg-gradient-to-br from-[#FF5AF7]/10 to-[#FF5AF7]/5 backdrop-blur-md rounded-2xl transform translate-z-[-50px] rotateY-neg-15 border border-[#FF5AF7]/30 shadow-lg animate-float animation-delay-2000 overflow-hidden">
                    {/* Decorative interface elements */}
                    <div className="absolute inset-4 border border-[#FF5AF7]/20 rounded-xl grid grid-rows-4 gap-2 p-3">
                      <div className="h-2 w-1/2 bg-[#FF5AF7]/30 rounded-full"></div>
                      <div className="h-2 w-3/4 bg-[#FF5AF7]/40 rounded-full"></div>
                      <div className="h-2 w-1/3 bg-[#FF5AF7]/30 rounded-full"></div>
                      <div className="h-2 w-2/3 bg-[#FF5AF7]/20 rounded-full"></div>
                    </div>
                    
                    {/* Animated scan effect */}
                    <div className="absolute inset-0 animate-scan opacity-30"></div>
                    
                    {/* TON Integration Label */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full border border-[#FF5AF7]/30 text-xs text-[#FF5AF7]">
                      <span className="flex items-center gap-1">
                        <i className="ri-currency-line"></i> TON Secured
                      </span>
                    </div>
                  </div>
                  
                  {/* Blockchain Streaming Data - Top */}
                  <div className="absolute top-[-5%] inset-x-[15%] h-[18%] bg-black/50 backdrop-blur-lg rounded-xl transform translate-z-[-30px] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 p-2 font-mono text-[8px] text-[#6B00D7] opacity-70">
                      0xf7b8a865c831d9bd5ec48bc5dc95c63a103e056fb869c27c826fc6d6a5d31234...
                    </div>
                    <div className="absolute inset-0 animate-scan"></div>
                    
                    {/* Ethereum Network Label */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 rounded-full text-[7px] text-[#6B00D7] border border-[#6B00D7]/30">
                      ETH NETWORK
                    </div>
                  </div>
                  
                  {/* Blockchain Streaming Data - Bottom */}
                  <div className="absolute bottom-[-5%] inset-x-[15%] h-[18%] bg-black/50 backdrop-blur-lg rounded-xl transform translate-z-[-30px] border border-white/10 overflow-hidden">
                    <div className="absolute inset-0 p-2 font-mono text-[8px] text-[#FF5AF7] opacity-70">
                      EQBcp_kl_gSEtJygbLkwk-3pfPn6Iha6ODW2RJJAa-n0_HFZ...
                    </div>
                    <div className="absolute inset-0 animate-scan"></div>
                    
                    {/* TON Network Label */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 rounded-full text-[7px] text-[#FF5AF7] border border-[#FF5AF7]/30">
                      TON NETWORK
                    </div>
                  </div>
                  
                  {/* Main Vault Body */}
                  <div className="absolute inset-[12%] bg-gradient-to-br from-[#151515] to-[#0A0A0A] rounded-2xl transform translate-z-[30px] border border-white/10 shadow-2xl overflow-hidden">
                    {/* Vault Door Seam */}
                    <div className="absolute inset-y-0 left-[48%] right-[48%] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    {/* Vault Lock Interface */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full backdrop-blur-md border border-white/10 shadow-lg animate-pulse-slow">
                      <div className="absolute inset-2 rounded-full border border-white/20 flex items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] blur-md opacity-60"></div>
                          <Shield className="h-8 w-8 text-white relative z-10" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Security Indicators */}
                    <div className="absolute top-[20%] left-[20%] w-3 h-3 rounded-full bg-[#6B00D7] animate-pulse-slow shadow-glow-sm"></div>
                    <div className="absolute top-[20%] right-[20%] w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow animation-delay-1000 shadow-glow-sm"></div>
                    <div className="absolute bottom-[20%] left-[20%] w-3 h-3 rounded-full bg-[#FF5AF7] animate-pulse-slow animation-delay-2000 shadow-glow-sm"></div>
                    <div className="absolute bottom-[20%] right-[20%] w-3 h-3 rounded-full bg-[#6B00D7] animate-pulse-slow animation-delay-3000 shadow-glow-sm"></div>
                    
                    {/* Security Rating Display */}
                    <div className="absolute top-[5%] left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md font-mono text-xs">
                      <span className="text-white/70">SECURITY RATING: </span>
                      <span className="text-[#FF5AF7] font-bold">100%</span>
                    </div>
                  </div>
                  
                  {/* Floating Chain Icons */}
                  <div className="absolute top-[5%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#6B00D7]/30 shadow-lg shadow-[#6B00D7]/20 animate-float">
                    <i className="ri-ethereum-line text-xl text-[#6B00D7]"></i>
                  </div>
                  
                  <div className="absolute top-[15%] right-[25%] transform translate-x-1/2 -translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#FF5AF7]/30 shadow-lg shadow-[#FF5AF7]/20 animate-float animation-delay-2000">
                    <i className="ri-copper-coin-line text-xl text-[#FF5AF7]"></i>
                  </div>
                  
                  <div className="absolute bottom-[10%] left-[40%] transform -translate-x-1/2 translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#6B00D7]/30 shadow-lg shadow-[#6B00D7]/20 animate-float animation-delay-3000">
                    <Lock className="h-5 w-5 text-[#6B00D7]" />
                  </div>
                  
                  <div className="absolute bottom-[20%] right-[35%] transform translate-x-1/2 translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-[#FF5AF7]/30 shadow-lg shadow-[#FF5AF7]/20 animate-float animation-delay-1000">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  
                  {/* Solana Integration - New Floating Element */}
                  <div className="absolute bottom-[5%] right-[20%] transform translate-x-1/2 translate-y-1/2 p-3 bg-[#151515]/80 backdrop-blur-md rounded-xl border border-gradient-purple shadow-lg shadow-[#6B00D7]/20 animate-float animation-delay-1500">
                    <Layers className="h-5 w-5 text-[#B160FF]" />
                  </div>
                </div>
              </div>
              
              {/* Security Features Indicators */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto">
                <div className="px-4 py-2 bg-[#0A0A0A]/70 backdrop-blur-md rounded-full border border-[#6B00D7]/20 inline-flex items-center gap-2 group hover:border-[#6B00D7]/50 transition-all duration-300">
                  <div className="w-3 h-3 bg-[#6B00D7] rounded-full animate-pulse"></div>
                  <p className="text-sm text-white group-hover:text-[#6B00D7] transition-colors duration-300">Military-Grade Encryption</p>
                </div>
                
                <div className="px-4 py-2 bg-[#0A0A0A]/70 backdrop-blur-md rounded-full border border-[#FF5AF7]/20 inline-flex items-center gap-2 group hover:border-[#FF5AF7]/50 transition-all duration-300">
                  <div className="w-3 h-3 bg-[#FF5AF7] rounded-full animate-pulse"></div>
                  <p className="text-sm text-white group-hover:text-[#FF5AF7] transition-colors duration-300">Triple-Chain Verification</p>
                </div>
                
                <div className="px-4 py-2 bg-[#0A0A0A]/70 backdrop-blur-md rounded-full border border-[#B160FF]/20 inline-flex items-center gap-2 group hover:border-[#B160FF]/50 transition-all duration-300">
                  <div className="w-3 h-3 bg-[#B160FF] rounded-full animate-pulse"></div>
                  <p className="text-sm text-white group-hover:text-[#B160FF] transition-colors duration-300">Quantum-Resistant Algorithms</p>
                </div>
                
                <div className="px-4 py-2 bg-[#0A0A0A]/70 backdrop-blur-md rounded-full border border-[#6B00D7]/20 inline-flex items-center gap-2 group hover:border-[#6B00D7]/50 transition-all duration-300">
                  <div className="w-3 h-3 bg-[#6B00D7] rounded-full animate-pulse"></div>
                  <p className="text-sm text-white group-hover:text-[#6B00D7] transition-colors duration-300">Zero-Knowledge Privacy</p>
                </div>
              </div>
              
              {/* Trust Verification - Enhanced */}
              <div className="mt-8 px-6 py-3 bg-gradient-to-r from-[#0A0A0A]/80 via-[#151515]/80 to-[#0A0A0A]/80 backdrop-blur-md rounded-full border border-white/10 inline-flex items-center gap-3 animate-pulse-subtle shadow-glow-sm">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0A0A0A] border border-[#6B00D7]/30">
                  <div className="w-2 h-2 bg-[#6B00D7] rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">Vault Security Status: <span className="text-[#FF5AF7]">Active & Secure</span></p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Premium 3D 'How It Works' Section */}
        <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0A0A0A] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6B00D7]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF5AF7]/10 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-2 justify-center">
                <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                HOW CHRONOS VAULT WORKS
                <div className="ml-2 w-6 h-px bg-[#FF5AF7]"></div>
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-4">Secure Your Digital Legacy</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Cutting-edge blockchain technology meets intuitive design to create the most secure vault system in existence</p>
            </div>
            
            {/* 3D Animated Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 h-full transform transition-all duration-500 group-hover:translate-y-[-5px] overflow-hidden">
                  {/* Animated top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
                  
                  {/* Step number - 3D effect */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] rounded-full flex items-center justify-center font-bold text-xl transform rotate-12 shadow-lg shadow-[#6B00D7]/30">
                    <div className="transform -rotate-12">1</div>
                  </div>
                  
                  {/* Icon with 3D effect */}
                  <div className="perspective-1000 mb-6">
                    <div className="relative transform-style-3d hover:rotateY-15 transition-transform duration-700 w-16 h-16">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-xl transform translate-z-[-30px]"></div>
                      <div className="relative w-full h-full flex items-center justify-center bg-black rounded-xl border border-[#6B00D7]/30 shadow-xl">
                        <UserPlus className="h-8 w-8 text-[#FF5AF7]" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 relative group-hover:text-white transition-colors">Create Your Account</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors z-10 relative">Connect your wallet to our secure platform and set up your personal profile with advanced security options.</p>
                  
                  {/* Animated scan line effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 h-full transform transition-all duration-500 group-hover:translate-y-[-5px] overflow-hidden">
                  {/* Animated top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"></div>
                  
                  {/* Step number - 3D effect */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#FF5AF7] to-[#6B00D7] rounded-full flex items-center justify-center font-bold text-xl transform rotate-12 shadow-lg shadow-[#FF5AF7]/30">
                    <div className="transform -rotate-12">2</div>
                  </div>
                  
                  {/* Icon with 3D effect */}
                  <div className="perspective-1000 mb-6">
                    <div className="relative transform-style-3d hover:rotateY-15 transition-transform duration-700 w-16 h-16">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-xl transform translate-z-[-30px]"></div>
                      <div className="relative w-full h-full flex items-center justify-center bg-black rounded-xl border border-[#FF5AF7]/30 shadow-xl">
                        <Shield className="h-8 w-8 text-[#6B00D7]" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 relative group-hover:text-white transition-colors">Design Your Vault</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors z-10 relative">Choose specialized vault types with custom security features, time-locks, multi-signature requirements, and cross-chain protection.</p>
                  
                  {/* Animated scan line effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-black/80 backdrop-blur-sm border border-white/5 rounded-2xl p-8 h-full transform transition-all duration-500 group-hover:translate-y-[-5px] overflow-hidden">
                  {/* Animated top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
                  
                  {/* Step number - 3D effect */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] rounded-full flex items-center justify-center font-bold text-xl transform rotate-12 shadow-lg shadow-[#6B00D7]/30">
                    <div className="transform -rotate-12">3</div>
                  </div>
                  
                  {/* Icon with 3D effect */}
                  <div className="perspective-1000 mb-6">
                    <div className="relative transform-style-3d hover:rotateY-15 transition-transform duration-700 w-16 h-16">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-xl transform translate-z-[-30px]"></div>
                      <div className="relative w-full h-full flex items-center justify-center bg-black rounded-xl border border-[#6B00D7]/30 shadow-xl">
                        <Lock className="h-8 w-8 text-[#FF5AF7]" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 relative group-hover:text-white transition-colors">Secure Your Assets</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors z-10 relative">Deposit digital assets into your vault with military-grade encryption and triple-chain security across Ethereum, Solana, and TON.</p>
                  
                  {/* Animated scan line effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="flex justify-center mt-16">
              <Link 
                to="/create-vault" 
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg shadow-[#6B00D7]/20 hover:shadow-xl hover:shadow-[#FF5AF7]/30"
              >
                <span className="relative z-10 flex items-center">
                  <i className="ri-rocket-line mr-2 text-xl group-hover:animate-pulse"></i> Start Your Journey
                </span>
                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Ultra-Premium Testimonials & Partners Section */}
        <section className="py-24 bg-[#030303] relative overflow-hidden">
          {/* Luxury Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Premium grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            
            {/* Subtle gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-40"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6B00D7]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF5AF7]/10 rounded-full blur-3xl"></div>
            
            {/* Premium diagonal accents */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7]/30 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-2 justify-center">
                <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                TRUSTED BY INDUSTRY LEADERS
                <div className="ml-2 w-6 h-px bg-[#FF5AF7]"></div>
              </h3>
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-6">Testimonials & Partners</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">Join the finest organizations and individuals who trust Chronos Vault for unparalleled digital asset security</p>
            </div>

            {/* 3D Testimonials Carousel */}
            <div className="max-w-6xl mx-auto mb-20 perspective-1000">
              <div className="transform-style-3d">
                {/* Featured Testimonial */}
                <div className="relative transform hover:translate-z-[30px] transition-transform duration-500 group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-700"></div>
                  <div className="relative bg-gradient-to-b from-[#0A0A0A] to-black p-8 md:p-10 rounded-2xl border border-[#1A1A1A] group-hover:border-white/20 transition-all duration-500">
                    {/* Testimonial content */}
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                      {/* 3D Rotating Avatar */}
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24 md:w-28 md:h-28 perspective-1000">
                          <div className="relative w-full h-full rounded-full transform-style-3d group-hover:rotateY-15 transition-transform duration-700">
                            {/* Avatar shadow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/40 to-[#FF5AF7]/40 rounded-full transform translate-z-[-10px] blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>
                            {/* Avatar image */}
                            <div className="absolute inset-1 bg-gradient-to-br from-[#0D0D0D] to-black rounded-full border border-[#6B00D7]/30 group-hover:border-[#FF5AF7]/50 transition-colors duration-700 overflow-hidden">
                              <div className="absolute inset-2 rounded-full bg-[#151515] flex items-center justify-center">
                                <Users className="h-10 w-10 text-[#FF5AF7]" />
                              </div>
                            </div>
                            {/* Decorative ring */}
                            <div className="absolute inset-[-2px] border-2 border-[#6B00D7]/20 rounded-full animate-spin-slow"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Testimonial Text */}
                      <div className="flex-1">
                        <div className="mb-4">
                          <i className="ri-double-quotes-l text-4xl text-[#6B00D7]/40 group-hover:text-[#FF5AF7]/40 transition-colors duration-700"></i>
                        </div>
                        
                        <p className="text-gray-300 italic text-lg md:text-xl mb-6 font-light leading-relaxed">
                          Chronos Vault represents the pinnacle of blockchain security technology. Their triple-chain architecture and multi-signature capabilities have revolutionized how we protect our organization's digital assets.
                        </p>
                        
                        <div className="flex items-center">
                          <div>
                            <h4 className="font-semibold text-white">Alexander Quantum</h4>
                            <p className="text-[#FF5AF7] text-sm">Chief Security Officer, Nexus Blockchain</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated scan effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 overflow-hidden rounded-2xl">
                      <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 3D Rotating Partner Logos */}
            <h3 className="text-center text-xl font-semibold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white">Our Premium Partners</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 max-w-4xl mx-auto perspective-1000">
              {/* Partner 1 */}
              <div className="group">
                <div className="relative perspective-1000 flex items-center justify-center h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/0 to-[#FF5AF7]/0 group-hover:from-[#6B00D7]/5 group-hover:to-[#FF5AF7]/5 rounded-xl transform-style-3d group-hover:rotateY-15 transition-all duration-700"></div>
                  <div className="relative w-20 h-20 transform transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="p-4 bg-[#0A0A0A] rounded-full border border-[#1A1A1A] group-hover:border-[#6B00D7]/30 transition-colors duration-500 shadow-lg">
                        <i className="ri-ethereum-line text-4xl text-white group-hover:text-[#6B00D7] transition-colors duration-500 animate-pulse-slow"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-400 group-hover:text-white transition-colors duration-500 mt-4 text-sm">Ethereum Foundation</p>
              </div>
              
              {/* Partner 2 */}
              <div className="group">
                <div className="relative perspective-1000 flex items-center justify-center h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/0 to-[#6B00D7]/0 group-hover:from-[#FF5AF7]/5 group-hover:to-[#6B00D7]/5 rounded-xl transform-style-3d group-hover:rotateY-15 transition-all duration-700"></div>
                  <div className="relative w-20 h-20 transform transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="p-4 bg-[#0A0A0A] rounded-full border border-[#1A1A1A] group-hover:border-[#FF5AF7]/30 transition-colors duration-500 shadow-lg">
                        <i className="ri-bit-coin-line text-4xl text-white group-hover:text-[#FF5AF7] transition-colors duration-500 animate-pulse-slow animation-delay-1000"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-400 group-hover:text-white transition-colors duration-500 mt-4 text-sm">Bitcoin Alliance</p>
              </div>
              
              {/* Partner 3 */}
              <div className="group">
                <div className="relative perspective-1000 flex items-center justify-center h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7]/0 to-[#FF5AF7]/0 group-hover:from-[#6B00D7]/5 group-hover:to-[#FF5AF7]/5 rounded-xl transform-style-3d group-hover:rotateY-15 transition-all duration-700"></div>
                  <div className="relative w-20 h-20 transform transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="p-4 bg-[#0A0A0A] rounded-full border border-[#1A1A1A] group-hover:border-[#6B00D7]/30 transition-colors duration-500 shadow-lg">
                        <i className="ri-currency-line text-4xl text-white group-hover:text-[#6B00D7] transition-colors duration-500 animate-pulse-slow animation-delay-2000"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-400 group-hover:text-white transition-colors duration-500 mt-4 text-sm">TON Ecosystem</p>
              </div>
              
              {/* Partner 4 */}
              <div className="group">
                <div className="relative perspective-1000 flex items-center justify-center h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF5AF7]/0 to-[#6B00D7]/0 group-hover:from-[#FF5AF7]/5 group-hover:to-[#6B00D7]/5 rounded-xl transform-style-3d group-hover:rotateY-15 transition-all duration-700"></div>
                  <div className="relative w-20 h-20 transform transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>
                    <div className="relative h-full w-full flex items-center justify-center">
                      <div className="p-4 bg-[#0A0A0A] rounded-full border border-[#1A1A1A] group-hover:border-[#FF5AF7]/30 transition-colors duration-500 shadow-lg">
                        <i className="ri-copper-coin-line text-4xl text-white group-hover:text-[#FF5AF7] transition-colors duration-500 animate-pulse-slow animation-delay-3000"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-400 group-hover:text-white transition-colors duration-500 mt-4 text-sm">Solana Foundation</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Premium Vault Showcase */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#080808] relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7]/30 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6B00D7]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF5AF7]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
              <div>
                <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-4">
                  <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                  SPECIALIZED VAULTS
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-white">Premium Vault Solutions</span>
                </h2>
                <p className="text-gray-400 max-w-lg mt-4">Choose from specialized vault templates, each designed for unique security needs and blockchain interactions.</p>
              </div>
              
              <Link to="/create-vault" className="group flex items-center text-white hover:text-[#FF5AF7] transition-colors">
                <span>View All Vault Types</span>
                <ChevronRight className="ml-1 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Premium Vault Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Multi-Signature Vault Card - Premium Design */}
              <Card className="bg-[#0D0D0D] border-none overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <Link to="/multi-signature-vault">
                  <CardContent className="p-8 relative z-10">
                    <div className="bg-gradient-to-br from-[#151515] to-black rounded-2xl p-3 w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#6B00D7]/20 group-hover:to-[#FF5AF7]/10 transition-colors duration-500">
                      <Users className="h-6 w-6 text-[#FF5AF7]" />
                    </div>
                    
                    <Badge className="bg-[#FF5AF7]/10 text-[#FF5AF7] hover:bg-[#FF5AF7]/20 border-none mb-4">Enhanced Security</Badge>
                    
                    <h3 className="text-xl font-semibold mb-3">Multi-Signature Vault</h3>
                    <p className="text-gray-400 mb-6 line-clamp-2">Requires multiple authorized signatures to access or modify vault contents, ideal for team treasuries and joint assets.</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-white">2-15</span> Signers
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#FF5AF7] hover:text-[#FF7AF7] hover:bg-[#FF5AF7]/10 p-0 group-hover:translate-x-1 transition-transform">
                        Create <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Time-Lock Vault Card - Premium Design */}
              <Card className="bg-[#0D0D0D] border-none overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <Link to="/create-vault?type=timelock">
                  <CardContent className="p-8 relative z-10">
                    <div className="bg-gradient-to-br from-[#151515] to-black rounded-2xl p-3 w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#6B00D7]/20 group-hover:to-[#FF5AF7]/10 transition-colors duration-500">
                      <Clock className="h-6 w-6 text-[#6B00D7]" />
                    </div>
                    
                    <Badge className="bg-[#6B00D7]/10 text-[#6B00D7] hover:bg-[#6B00D7]/20 border-none mb-4">Popular</Badge>
                    
                    <h3 className="text-xl font-semibold mb-3">Time-Lock Vault</h3>
                    <p className="text-gray-400 mb-6 line-clamp-2">Lock assets until a specified future date. Perfect for long-term holdings, trust funds, and future planning.</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-white">1-30</span> Year Options
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#6B00D7] hover:text-[#8719FF] hover:bg-[#6B00D7]/10 p-0 group-hover:translate-x-1 transition-transform">
                        Create <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>

              {/* Bitcoin Halving Vault Card - Premium Design */}
              <Card className="bg-[#0D0D0D] border-none overflow-hidden group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <Link to="/bitcoin-halving-vault">
                  <CardContent className="p-8 relative z-10">
                    <div className="bg-gradient-to-br from-[#151515] to-black rounded-2xl p-3 w-12 h-12 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#6B00D7]/20 group-hover:to-[#FF5AF7]/10 transition-colors duration-500">
                      <Coins className="h-6 w-6 text-[#FF5AF7]" />
                    </div>
                    
                    <Badge className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 text-white hover:from-[#6B00D7]/20 hover:to-[#FF5AF7]/20 border-none mb-4">Limited Edition</Badge>
                    
                    <h3 className="text-xl font-semibold mb-3">Bitcoin Halving Vault</h3>
                    <p className="text-gray-400 mb-6 line-clamp-2">Special vault that unlocks after the next Bitcoin halving event. Perfect for strategic crypto investments.</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">
                        <span className="font-medium text-white">2025</span> Halving
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#FF5AF7] hover:text-[#FF7AF7] hover:bg-[#FF5AF7]/10 p-0 group-hover:translate-x-1 transition-transform">
                        Create <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
            
            {/* My Vaults Section - Premium Design */}
            {(vaults && vaults.length > 0) || true ? (
              <div className="mt-20 bg-[#0A0A0A] rounded-2xl p-8 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold">My Vaults</h3>
                    <p className="text-gray-400 mt-1">Manage your existing secure digital vaults</p>
                  </div>
                  
                  <Link to="/my-vaults">
                    <Button variant="outline" className="mt-4 md:mt-0 border-[#6B00D7] text-[#6B00D7] hover:bg-[#6B00D7]/10 hover:text-[#8719FF]">
                      View All Vaults <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {/* Vault Item Row - Sample */}
                  <div className="p-4 rounded-xl bg-[#111111] hover:bg-[#151515] transition-colors border border-white/5 hover:border-[#6B00D7]/20 group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-[#1A1A1A] text-[#FF5AF7] group-hover:bg-[#FF5AF7]/10 transition-colors">
                          <i className="ri-safe-2-line text-xl"></i>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{sampleVault.name}</h4>
                          <p className="text-sm text-gray-400">{sampleVault.assetType} · {sampleVault.assetAmount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="hidden md:block border-r border-gray-800 h-10 mx-2"></div>
                        
                        <div className="text-right md:text-left">
                          <p className="text-sm text-gray-400">Unlocks</p>
                          <p className="text-sm">{new Date(sampleVault.unlockDate).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="md:ml-8">
                          <Badge variant={sampleVault.isLocked ? "outline" : "secondary"} className="rounded-full px-3">
                            {sampleVault.isLocked ? "Locked" : "Unlocked"}
                          </Badge>
                        </div>
                        
                        <Link to={`/vault/${sampleVault.id}`} className="ml-auto">
                          <Button variant="ghost" size="sm" className="text-[#6B00D7] hover:text-[#8719FF] hover:bg-[#6B00D7]/10 group-hover:translate-x-1 transition-transform">
                            <span className="sr-only">View Details</span>
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* API-Fetched Vault Items */}
                  {vaults && vaults.length > 0 && vaults.map((vault: any) => (
                    <div key={vault.id} className="p-4 rounded-xl bg-[#111111] hover:bg-[#151515] transition-colors border border-white/5 hover:border-[#6B00D7]/20 group">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-[#1A1A1A] text-[#FF5AF7] group-hover:bg-[#FF5AF7]/10 transition-colors">
                            <i className="ri-safe-2-line text-xl"></i>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{vault.name}</h4>
                            <p className="text-sm text-gray-400">{vault.assetType} · {vault.assetAmount}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="hidden md:block border-r border-gray-800 h-10 mx-2"></div>
                          
                          <div className="text-right md:text-left">
                            <p className="text-sm text-gray-400">Unlocks</p>
                            <p className="text-sm">{new Date(vault.unlockDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div className="md:ml-8">
                            <Badge variant={vault.isLocked ? "outline" : "secondary"} className="rounded-full px-3">
                              {vault.isLocked ? "Locked" : "Unlocked"}
                            </Badge>
                          </div>
                          
                          <Link to={`/vault/${vault.id}`} className="ml-auto">
                            <Button variant="ghost" size="sm" className="text-[#6B00D7] hover:text-[#8719FF] hover:bg-[#6B00D7]/10 group-hover:translate-x-1 transition-transform">
                              <span className="sr-only">View Details</span>
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
        
        {/* Ultra-Premium 3D Security Features */}
        <section className="py-24 bg-[#030303] relative overflow-hidden">
          {/* Animated Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Particle grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            
            {/* Premium glow effects */}
            <div className="absolute top-1/3 left-1/4 w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 blur-[150px] opacity-30"></div>
            <div className="absolute bottom-1/4 right-1/3 w-[30vw] h-[30vw] rounded-full bg-gradient-to-r from-[#FF5AF7]/5 to-[#6B00D7]/5 blur-[120px] opacity-20"></div>
            
            {/* Digital security circuit pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-[10%] left-[20%] w-[60%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute top-[30%] left-[5%] w-[40%] h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute top-[50%] left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute top-[70%] left-[10%] w-[60%] h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute top-[90%] left-[25%] w-[50%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              
              <div className="absolute left-[20%] top-[10%] h-[80%] w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute left-[40%] top-[5%] h-[90%] w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute left-[60%] top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute left-[80%] top-[10%] h-[85%] w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="w-16 h-16 mx-auto mb-6 relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full blur-xl opacity-50"></div>
                <div className="absolute inset-1 bg-black rounded-full"></div>
                <div className="relative h-full w-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-[#FF5AF7]" />
                </div>
              </div>
            
              <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-4 justify-center">
                <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                MILITARY-GRADE PROTECTION
                <div className="ml-2 w-6 h-px bg-[#FF5AF7]"></div>
              </h3>
              
              <h2 className="title-3d text-3xl md:text-5xl font-bold mb-6">Revolutionary Security</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Chronos Vault combines quantum-resistant encryption with cutting-edge blockchain technology to create an impenetrable shield for your digital assets.</p>
            </div>
            
            {/* 3D Hexagonal Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto perspective-1000">
              {/* Triple-Chain Security */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#6B00D7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-[#6B00D7]/30 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <Shield className="h-8 w-8 text-[#6B00D7] animate-pulse-slow" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-white to-[#6B00D7] group-hover:opacity-100 transition-opacity duration-700">Triple-Chain Security</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    Assets secured with immutable cross-verification across Ethereum, Solana, and TON blockchains, providing redundant protection against platform-specific vulnerabilities or exploits.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Multi-Signature Access */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#FF5AF7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/20 to-[#FF5AF7]/5 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-[#FF5AF7]/30 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <Users className="h-8 w-8 text-[#FF5AF7] animate-pulse-slow animation-delay-1000" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] via-white to-[#FF5AF7] group-hover:opacity-100 transition-opacity duration-700">Multi-Signature Access</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    Configure ultra-secure vaults requiring approval from 2-15 trusted parties with customizable signature thresholds, time limits, and weighted authorization levels.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Zero-Knowledge Privacy */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#6B00D7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <Fingerprint className="h-8 w-8 text-white animate-pulse-slow animation-delay-2000" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] group-hover:opacity-100 transition-opacity duration-700">Zero-Knowledge Privacy</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    Cryptographically prove ownership or asset values without revealing sensitive data through advanced zk-SNARKs and selective disclosure protocols.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Geolocation Verification */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#FF5AF7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/20 to-[#FF5AF7]/5 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-[#FF5AF7]/30 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <Globe className="h-8 w-8 text-[#FF5AF7] animate-pulse-slow animation-delay-3000" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] via-white to-[#FF5AF7] group-hover:opacity-100 transition-opacity duration-700">Geolocation Verification</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    Create geofenced security zones requiring physical presence within defined safe locations for transaction authorization or vault access.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Permanent Storage */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#6B00D7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/20 to-[#6B00D7]/5 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-[#6B00D7]/30 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <FileText className="h-8 w-8 text-[#6B00D7] animate-pulse-slow animation-delay-1000" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] via-white to-[#6B00D7] group-hover:opacity-100 transition-opacity duration-700">Permanent Storage</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    Distributed immutable storage across IPFS and Arweave networks ensures permanent record accessibility regardless of individual blockchain conditions.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* Real-Time Monitoring */}
              <div className="group transform-style-3d hover:translate-z-[30px] transition-transform duration-500">
                <div className="relative bg-gradient-to-br from-[#0A0A0A] to-black p-8 rounded-2xl border border-[#1A1A1A] group-hover:border-[#FF5AF7]/40 shadow-xl transition-all duration-500 h-full overflow-hidden">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 via-transparent to-[#6B00D7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Decorative border highlight */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center"></div>
                  </div>
                  
                  {/* 3D Floating Icon */}
                  <div className="perspective-1000 mb-8">
                    <div className="relative w-16 h-16 transform-style-3d group-hover:rotateY-15 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/20 to-[#6B00D7]/20 rounded-xl transform translate-z-[-20px] group-hover:translate-z-[-30px] transition-transform duration-700 blur-sm"></div>
                      <div className="relative h-full w-full rounded-xl bg-black backdrop-blur-xl border border-white/20 shadow-xl flex items-center justify-center transform transition-transform duration-700 group-hover:scale-110">
                        <RefreshCw className="h-8 w-8 text-white animate-pulse-slow animation-delay-2000" />
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] via-[#6B00D7] to-[#FF5AF7] group-hover:opacity-100 transition-opacity duration-700">Real-Time Monitoring</span>
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors relative z-10">
                    AI-powered security scanning continuously analyzes transaction patterns and access requests to detect and prevent suspicious activity before breaches occur.
                  </p>
                  
                  {/* Animated scan effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium Call to Action */}
            <div className="flex justify-center mt-20">
              <Link to="/revolutionary-features">
                <Button variant="outline" className="border-[#6B00D7] text-[#6B00D7] hover:bg-[#6B00D7]/10 hover:text-[#8719FF] text-lg py-6 px-8 rounded-xl group relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#6B00D7]/0 via-[#6B00D7]/10 to-[#6B00D7]/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center gap-2">Explore All Security Features <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Immersive 3D Token Economics Visualization */}
        <section className="py-24 bg-[#030303] relative overflow-hidden">
          {/* Luxury Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Premium grid pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxQTFBMUEiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTIgMmg1NnY1NkgyVjJ6IiBmaWxsPSIjMDAwIi8+PC9nPjwvc3ZnPg==')] opacity-5"></div>
            
            {/* Subtle gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-30"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6B00D7]/10 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF5AF7]/10 rounded-full blur-3xl opacity-30"></div>
            
            {/* Digital circuit pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-[10%] left-[20%] w-[60%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute top-[30%] left-[5%] w-[40%] h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute top-[50%] left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute top-[70%] left-[10%] w-[60%] h-px bg-gradient-to-r from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute top-[90%] left-[25%] w-[50%] h-px bg-gradient-to-r from-transparent via-[#6B00D7] to-transparent"></div>
              
              <div className="absolute left-[20%] top-[10%] h-[80%] w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute left-[40%] top-[5%] h-[90%] w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent"></div>
              <div className="absolute left-[60%] top-[15%] h-[70%] w-px bg-gradient-to-b from-transparent via-[#6B00D7] to-transparent"></div>
              <div className="absolute left-[80%] top-[10%] h-[85%] w-px bg-gradient-to-b from-transparent via-[#FF5AF7] to-transparent"></div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 border border-[#6B00D7]/30 backdrop-blur-sm mb-6 mx-auto">
                <span className="flex items-center text-xs md:text-sm font-medium text-[#FF5AF7]">
                  <i className="ri-coin-line mr-2"></i>
                  Deflationary Token Model <div className="mx-2 w-1 h-1 rounded-full bg-[#FF5AF7]"></div> Utility-First Design
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white mb-6">CVT Token Economics</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">The ChronosVault Token (CVT) lies at the core of our ecosystem, powering transactions, reducing fees, and enabling premium features</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* 3D Token Distribution Chart */}
              <div className="perspective-1000">
                <div className="relative transform-style-3d rotate-3d bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 md:p-8 h-full overflow-hidden">
                  {/* Chart Title */}
                  <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Token Distribution</h3>
                  
                  {/* 3D Pie Chart */}
                  <div className="flex justify-center items-center h-64 perspective-1000 mb-6">
                    <div className="relative w-48 h-48 transform-style-3d group hover:rotateY-15 transition-transform duration-700">
                      {/* Pie Chart Segments - With advanced 3D floating effect */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 blur-xl opacity-50 transform translate-z-[-5px]"></div>
                      
                      {/* Base circle */}
                      <div className="absolute inset-0 bg-black rounded-full border border-[#6B00D7]/20 shadow-[0_0_25px_rgba(107,0,215,0.3)] transform translate-z-[-2px]"></div>
                      
                      {/* Segments with clip paths */}
                      <div className="absolute inset-0 rounded-full overflow-hidden transform translate-z-[2px]">
                        {/* Community - 40% */}
                        <div className="absolute inset-0 bg-[#6B00D7] chart-bar-1" style={{clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 70%, 50% 50%)'}}>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        
                        {/* Ecosystem - 25% */}
                        <div className="absolute inset-0 bg-[#8719FF] chart-bar-2" style={{clipPath: 'polygon(50% 50%, 100% 70%, 100% 100%, 60% 100%, 50% 50%)'}}>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        
                        {/* Team - 15% */}
                        <div className="absolute inset-0 bg-[#B160FF] chart-bar-3" style={{clipPath: 'polygon(50% 50%, 60% 100%, 30% 100%, 50% 50%)'}}>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        
                        {/* Reserve - 10% */}
                        <div className="absolute inset-0 bg-[#D896FF] chart-bar-4" style={{clipPath: 'polygon(50% 50%, 30% 100%, 0 100%, 0 85%, 50% 50%)'}}>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        
                        {/* Marketing - 10% */}
                        <div className="absolute inset-0 bg-[#FF5AF7] chart-bar-5" style={{clipPath: 'polygon(50% 50%, 0 85%, 0 0, 15% 0, 50% 50%)'}}>
                          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                      </div>
                      
                      {/* Center circle decoration */}
                      <div className="absolute inset-[30%] rounded-full bg-black border border-white/10 transform translate-z-[3px] flex items-center justify-center overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/5 to-[#FF5AF7]/5"></div>
                        <Coins className="h-5 w-5 text-[#FF5AF7] animate-pulse-slow" />
                      </div>
                      
                      {/* Holographic Glow Edge */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#6B00D7]/20 group-hover:border-[#FF5AF7]/30 transform translate-z-[4px] transition-colors duration-700 animate-spin-slow"></div>
                      
                      {/* Floating glint effect */}
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="absolute w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent rotate-45 transform -translate-x-full animate-shimmer opacity-50"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Distribution Legend */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#6B00D7]"></div>
                      <span className="text-sm text-gray-300">Community (40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#8719FF]"></div>
                      <span className="text-sm text-gray-300">Ecosystem (25%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#B160FF]"></div>
                      <span className="text-sm text-gray-300">Team (15%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#D896FF]"></div>
                      <span className="text-sm text-gray-300">Reserve (10%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#FF5AF7]"></div>
                      <span className="text-sm text-gray-300">Marketing (10%)</span>
                    </div>
                  </div>
                  
                  {/* Scan Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
              
              {/* 3D Staking Tiers */}
              <div className="perspective-1000">
                <div className="relative transform-style-3d rotate-3d bg-[#0A0A0A] rounded-2xl border border-[#1A1A1A] p-6 md:p-8 h-full overflow-hidden">
                  {/* Chart Title */}
                  <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Staking Tiers & Benefits</h3>
                  
                  {/* 3D Bar Chart */}
                  <div className="flex items-end justify-between h-64 gap-4 mb-6 px-2">
                    {/* Bar 1 */}
                    <div className="relative flex flex-col items-center w-1/3">
                      <div className="h-24 w-full bg-gradient-to-t from-[#6B00D7] to-[#8719FF] rounded-t-lg chart-bar-1 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                      </div>
                      <div className="mt-3 text-sm text-center">
                        <p className="font-semibold text-white">Guardian</p>
                        <p className="text-xs text-[#6B00D7]">1,000+ CVT</p>
                      </div>
                    </div>
                    
                    {/* Bar 2 */}
                    <div className="relative flex flex-col items-center w-1/3">
                      <div className="h-40 w-full bg-gradient-to-t from-[#8719FF] to-[#B160FF] rounded-t-lg chart-bar-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                      </div>
                      <div className="mt-3 text-sm text-center">
                        <p className="font-semibold text-white">Architect</p>
                        <p className="text-xs text-[#8719FF]">10,000+ CVT</p>
                      </div>
                    </div>
                    
                    {/* Bar 3 */}
                    <div className="relative flex flex-col items-center w-1/3">
                      <div className="h-56 w-full bg-gradient-to-t from-[#D896FF] to-[#FF5AF7] rounded-t-lg chart-bar-5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"></div>
                      </div>
                      <div className="mt-3 text-sm text-center">
                        <p className="font-semibold text-white">Sovereign</p>
                        <p className="text-xs text-[#FF5AF7]">100,000+ CVT</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Fee Reduction</span>
                      <div className="space-x-2">
                        <span className="text-[#6B00D7]">75%</span>
                        <span className="text-[#8719FF]">90%</span>
                        <span className="text-[#FF5AF7]">100%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Premium Features</span>
                      <div className="space-x-2">
                        <span className="text-[#6B00D7]">Basic</span>
                        <span className="text-[#8719FF]">Advanced</span>
                        <span className="text-[#FF5AF7]">All</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Governance Votes</span>
                      <div className="space-x-2">
                        <span className="text-[#6B00D7]">1×</span>
                        <span className="text-[#8719FF]">5×</span>
                        <span className="text-[#FF5AF7]">10×</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Scan Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-0 w-full h-full animate-scan"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Premium Call-to-Action */}
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link to="/cvt-token">
                <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white px-8 py-6 rounded-xl text-lg font-medium group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Coins className="mr-2 h-5 w-5" /> Explore CVT Token
                  </span>
                  <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </Button>
              </Link>
              
              <Link to="/create-vault">
                <Button variant="outline" className="border-[#FF5AF7] text-[#FF5AF7] hover:bg-[#FF5AF7]/10 px-8 py-6 rounded-xl text-lg font-medium group">
                  <span className="flex items-center">
                    Create Your First Vault <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
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