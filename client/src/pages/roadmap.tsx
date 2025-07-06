import React from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { BitcoinVaultFeature } from '@/components/roadmap/BitcoinVaultRoadmap';
import { TripleChainSecurityRoadmap } from '@/components/roadmap/TripleChainSecurityRoadmap';
import { HardwareWalletRoadmap } from '@/components/roadmap/HardwareWalletRoadmap';
import { GeoVaultGameRoadmap } from '@/components/roadmap/GeoVaultGameRoadmap';
import { NFTCreatorRoadmap } from '@/components/roadmap/NFTCreatorRoadmap';
import { UniversalInteroperabilityRoadmap } from '@/components/roadmap/UniversalInteroperabilityRoadmap';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown } from "lucide-react";

export default function RoadmapPage() {
  return (
    <>
      <Helmet>
        <title>Product Roadmap | ChronosVault</title>
        <meta 
          name="description" 
          content="Explore the future of ChronosVault with our detailed product roadmap, including upcoming features and innovations." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="Product Roadmap" 
          description="Our vision for the future of secure, time-locked blockchain vaults and beyond" 
          separator
        />
        
        <div className="mt-8 mb-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#1D1D1D]/95 to-[#151515]/95 p-6 rounded-lg border border-[#333] backdrop-blur-md">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Vision Statement</h3>
            <p className="text-gray-300 mb-4">
              Chronos Vault aims to revolutionize digital asset security and management through innovative multi-chain technology, 
              becoming the universal standard for secure time-locked vaults across the global blockchain ecosystem.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-[#191919] p-3 rounded border border-[#333]">
                <h4 className="text-sm font-semibold text-[#FF5AF7] mb-1">Mission</h4>
                <p className="text-xs text-gray-400">To provide unparalleled security, privacy, and functionality for digital assets and information across all major blockchains.</p>
              </div>
              <div className="bg-[#191919] p-3 rounded border border-[#333]">
                <h4 className="text-sm font-semibold text-[#FF5AF7] mb-1">Goal</h4>
                <p className="text-xs text-gray-400">To connect, protect, and preserve digital assets and memories across time and blockchains, with military-grade security and user-friendly interfaces.</p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="2025" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-[#1A1A1A] border border-[#333]">
              <TabsTrigger 
                value="2024" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/20 data-[state=active]:to-[#FF5AF7]/20 data-[state=active]:text-white"
              >
                2024
              </TabsTrigger>
              <TabsTrigger 
                value="2025" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/20 data-[state=active]:to-[#FF5AF7]/20 data-[state=active]:text-white"
              >
                2025
              </TabsTrigger>
              <TabsTrigger 
                value="2026" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/20 data-[state=active]:to-[#FF5AF7]/20 data-[state=active]:text-white"
              >
                2026+
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="2024" className="mt-0">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-8">Recently Released</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 rounded-xl border border-gray-200 dark:border-gray-800/50 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300">Multi-Chain Support</h3>
                    <div className="rounded-full bg-gray-100 dark:bg-gray-900/70 text-gray-700 dark:text-gray-300 px-3 py-1 text-xs font-medium border border-gray-200 dark:border-gray-800/50">
                      Released
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    Support for multiple blockchains including TON, Ethereum, Solana, and Polygon with seamless cross-chain integration.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="2025" className="mt-0">
            <div className="space-y-16">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold">Q1-Q2 2025</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#FF5AF7] border border-[#6B00D7]/40">Core Technology</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <TripleChainSecurityRoadmap />
                  <HardwareWalletRoadmap />
                  <UniversalInteroperabilityRoadmap />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold">Q3-Q4 2025</h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#FF5AF7] border border-[#6B00D7]/40">User Experience</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <BitcoinVaultFeature />
                  <GeoVaultGameRoadmap />
                  <NFTCreatorRoadmap />
                  
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800/50 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">Enhanced Multi-Signature Controls</h3>
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 text-xs font-medium border border-purple-200 dark:border-purple-800/50">
                        Q4 2025
                      </div>
                    </div>
                    <p className="text-purple-700 dark:text-purple-400 mb-4">
                      Advanced multi-signature support with customizable threshold settings and role-based access control for enterprises and organizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="2026" className="mt-0">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <h2 className="text-2xl font-bold">2026 and Beyond</h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#6B00D7]/20 text-[#FF5AF7] border border-[#6B00D7]/40">Long-term Vision</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">Legacy Planning Suite</h3>
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-medium border border-emerald-200 dark:border-emerald-800/50">
                      Q1 2026
                    </div>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 mb-4">
                    Comprehensive inheritance planning tools with legal integration, beneficiary management, and gradual release options.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl border border-red-200 dark:border-red-800/50 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-red-900 dark:text-red-300">AI-Enhanced Vault Security</h3>
                    <div className="rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 text-xs font-medium border border-red-200 dark:border-red-800/50">
                      Q2 2026
                    </div>
                  </div>
                  <p className="text-red-700 dark:text-red-400 mb-4">
                    Advanced AI-powered security system that learns from user behavior to detect anomalies and prevent unauthorized access attempts.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 rounded-xl border border-sky-200 dark:border-sky-800/50 p-6 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-sky-900 dark:text-sky-300">Enterprise Vault Solutions</h3>
                    <div className="rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-3 py-1 text-xs font-medium border border-sky-200 dark:border-sky-800/50">
                      Q3 2026
                    </div>
                  </div>
                  <p className="text-sky-700 dark:text-sky-400 mb-4">
                    Complete vault management system for large organizations with compliance features, reporting tools, and role-based access controls.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-lg border border-[#6B00D7]/30 p-6">
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Join Our Journey</h3>
            <p className="text-gray-300 mb-6">
              The Chronos Vault roadmap is ambitious and evolving. We welcome community feedback and participation as we build the future of blockchain security together.
            </p>
            <button className="flex items-center gap-2 mx-auto bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#5500AB] hover:to-[#FF46E8] transition-all">
              Join Our Community
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}