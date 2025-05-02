import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import VaultCard from "@/components/vault/vault-card";
import { BitcoinHalvingVault } from "@/components/bitcoin/BitcoinHalvingVault";
import { Zap, Coins, Sparkles, ArrowRight, Users, Shield, Clock, Lock, Key, Fingerprint, Globe, FileText, ChevronRight, RefreshCw, Layers } from "lucide-react";
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
        
        {/* Luxury Trusted By Section */}
        <section className="bg-[#080808] border-y border-white/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
                <p className="text-sm text-gray-400 uppercase tracking-widest font-medium">Trusted By Leading Blockchain Projects</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-8 opacity-70">
                <i className="ri-ethereum-line text-3xl"></i>
                <i className="ri-bit-coin-line text-3xl"></i>
                <i className="ri-currency-line text-3xl"></i>
                <i className="ri-coin-line text-3xl"></i>
                <i className="ri-copper-coin-line text-3xl"></i>
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
        
        {/* Upgraded Security Features Section */}
        <section className="py-20 bg-gradient-to-b from-[#080808] to-[#0A0A0A]">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h3 className="inline-flex items-center text-sm text-[#FF5AF7] mb-4 justify-center">
                <div className="mr-2 w-6 h-px bg-[#FF5AF7]"></div>
                REVOLUTIONARY TECHNOLOGY
                <div className="ml-2 w-6 h-px bg-[#FF5AF7]"></div>
              </h3>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-white">Military-Grade Security Features</h2>
              <p className="text-gray-300">Chronos Vault employs cutting-edge blockchain and cryptographic technologies to ensure your digital assets remain secure against all threats.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Triple-Chain Security */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-[#6B00D7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#6B00D7]/5 group-hover:to-[#6B00D7]/20 transition-colors mb-6">
                    <Shield className="h-8 w-8 text-[#6B00D7]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Triple-Chain Security</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Assets secured simultaneously across Ethereum, Solana, and TON blockchains for redundant protection against platform-specific exploits.</p>
                </div>
              </div>
              
              {/* Multi-Signature Access */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-[#FF5AF7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#FF5AF7]/5 group-hover:to-[#FF5AF7]/20 transition-colors mb-6">
                    <Users className="h-8 w-8 text-[#FF5AF7]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Multi-Signature Access</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Require approval from multiple trusted parties to access or modify vault assets with customizable signature thresholds and weights.</p>
                </div>
              </div>
              
              {/* Zero-Knowledge Privacy */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-gradient-to-r hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#6B00D7]/5 group-hover:to-[#FF5AF7]/10 transition-colors mb-6">
                    <Fingerprint className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Zero-Knowledge Privacy</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Selectively disclose vault information without revealing sensitive asset data through advanced zero-knowledge proof cryptography.</p>
                </div>
              </div>
              
              {/* Geolocation Verification */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-[#FF5AF7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#FF5AF7]/5 group-hover:to-[#FF5AF7]/20 transition-colors mb-6">
                    <Globe className="h-8 w-8 text-[#FF5AF7]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Geolocation Verification</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Add physical location requirements to vault access, ensuring assets can only be accessed from designated safe locations.</p>
                </div>
              </div>
              
              {/* Permanent Storage */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-[#6B00D7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#6B00D7]/5 group-hover:to-[#6B00D7]/20 transition-colors mb-6">
                    <FileText className="h-8 w-8 text-[#6B00D7]" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Permanent Storage</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Vault data stored immutably across IPFS and Arweave networks, ensuring permanent accessibility independent of individual blockchain health.</p>
                </div>
              </div>
              
              {/* Real-Time Monitoring */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-[#0D0D0D] to-[#0F0F0F] border border-[#1A1A1A] hover:border-gradient-to-r hover:from-[#6B00D7]/30 hover:to-[#FF5AF7]/30 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 via-transparent to-[#FF5AF7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F0F0F] to-[#151515] border border-[#1A1A1A] group-hover:from-[#6B00D7]/5 group-hover:to-[#FF5AF7]/10 transition-colors mb-6">
                    <RefreshCw className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-white transition-colors">Real-Time Monitoring</h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">AI-powered security incident detection constantly analyzes all vault activity to identify and prevent unauthorized access attempts.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/revolutionary-features">
                <Button variant="outline" className="border-[#6B00D7] text-[#6B00D7] hover:bg-[#6B00D7]/10 hover:text-[#8719FF]">
                  Explore All Security Features <ArrowRight className="ml-2 h-4 w-4" />
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