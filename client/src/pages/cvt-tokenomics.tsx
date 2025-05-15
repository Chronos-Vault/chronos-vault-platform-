import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Download, FileText, Coins, Users, Flame, LockKeyhole, Share2, BarChart3, Shield } from "lucide-react";
// Token Distribution Chart Component (2D)
const TokenDistributionChart = () => {
  // Token allocation data
  const tokenAllocations = [
    { name: "Public Sale", percentage: 30, color: "#FF5AF7" },
    { name: "Team", percentage: 15, color: "#6B00D7" },
    { name: "Reserves", percentage: 20, color: "#14F195" },
    { name: "Ecosystem", percentage: 20, color: "#6B73FF" },
    { name: "Staking", percentage: 15, color: "#0098EA" }
  ];

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#6B00D7]/20 p-6">
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-center text-xl font-bold mb-6">Token Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {tokenAllocations.map((allocation) => (
            <div key={allocation.name} className="flex flex-col items-center">
              <div className="w-full h-24 md:h-40 rounded-t-lg relative" style={{ backgroundColor: allocation.color }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{allocation.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-black/50 p-2 rounded-b-lg">
                <p className="text-center text-sm font-medium">{allocation.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Time-Locked Token Release Chart Component
const TimeLockedReleaseChart = () => {
  // Time-locked token release data according to CVT tokenomics specification
  const releaseSchedule = [
    { year: 4, amount: 7350000, percentage: 50, color: "#FF5AF7" },
    { year: 8, amount: 3675000, percentage: 25, color: "#6B00D7" },
    { year: 12, amount: 1837500, percentage: 12.5, color: "#14F195" },
    { year: 16, amount: 918750, percentage: 6.25, color: "#6B73FF" },
    { year: 21, amount: 918750, percentage: 6.25, color: "#0098EA" }
  ];

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#6B00D7]/20 p-6">
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-center text-xl font-bold mb-6">Time-Locked Token Release Schedule</h3>
        <div className="grid grid-cols-1 gap-4">
          {releaseSchedule.map((release) => (
            <div key={release.year} className="flex items-center space-x-4">
              <div className="w-16 text-right font-bold">Year {release.year}</div>
              <div className="flex-1 h-10 bg-black/30 rounded-lg relative overflow-hidden">
                <div 
                  className="h-full absolute top-0 left-0 rounded-lg"
                  style={{ width: `${release.percentage}%`, backgroundColor: release.color }}
                />
                <div className="absolute inset-0 flex items-center pl-4">
                  <span className="text-sm font-medium text-white">{release.amount.toLocaleString()} CVT ({release.percentage}%)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-center text-gray-400">
          Total Time-Locked Tokens: 14,700,000 CVT (70% of Total Supply)
        </div>
      </div>
    </div>
  );
};

// Staking Tiers Chart Component (2D)
const StakingTiersChart = () => {
  // Staking tier data
  const stakingTiers = [
    { name: "Vault Guardian", amount: 1000, benefits: 75, color: "#6B00D7" },
    { name: "Vault Architect", amount: 10000, benefits: 90, color: "#FF5AF7" },
    { name: "Vault Sovereign", amount: 100000, benefits: 100, color: "#0098EA" }
  ];

  return (
    <div className="h-96 w-full rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#6B00D7]/20 p-6">
      <div className="flex flex-col h-full justify-center">
        <h3 className="text-center text-xl font-bold mb-6">Staking Tiers Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stakingTiers.map((tier) => (
            <div key={tier.name} className="flex flex-col items-center">
              <div className="w-full rounded-t-lg p-3 text-center" style={{ backgroundColor: tier.color }}>
                <h4 className="font-bold text-lg text-white">{tier.name}</h4>
              </div>
              <div className="w-full bg-black/50 p-4 rounded-b-lg flex flex-col items-center">
                <div className="text-2xl font-bold mb-2">{tier.amount.toLocaleString()} CVT</div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 flex items-center justify-center">
                    <span className="text-white font-bold">{tier.benefits}%</span>
                  </div>
                  <span>Fee Reduction</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CVTTokenomicsPage = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("distribution");
  const [totalSupply] = useState("21,000,000");
  const [circulatingSupply] = useState("5,250,000");
  const [currentPrice] = useState("$0.85");
  
  // Tokenomics data
  const tokenomicsData = {
    distribution: {
      publicSale: 30,
      team: 15,
      reserves: 20,
      ecosystem: 20,
      staking: 15
    },
    vesting: {
      publicSale: "No lock - Immediate",
      team: "2 year linear vesting, 6 month cliff",
      reserves: "Strategic allocation at protocol discretion",
      ecosystem: "5 year distribution for development and growth initiatives",
      staking: "Continuous rewards distribution"
    },
    utility: [
      "Fee reduction on all vault operations",
      "Priority access to specialized vault types",
      "Governance voting rights for protocol decisions",
      "Advanced security feature access",
      "Staking rewards from protocol fees"
    ]
  };

  // Staking tiers data
  const stakingTiers = [
    {
      name: "Vault Guardian",
      amount: "1,000+ CVT",
      benefits: [
        "75% fee reduction on all vault operations",
        "Access to premium vault templates",
        "Enhanced recovery options",
        "Priority support"
      ]
    },
    {
      name: "Vault Architect",
      amount: "10,000+ CVT",
      benefits: [
        "90% fee reduction on all vault operations",
        "Access to all vault types including experimental features",
        "Advanced cross-chain verification",
        "Customizable vault security profiles",
        "24/7 dedicated support"
      ]
    },
    {
      name: "Vault Sovereign",
      amount: "100,000+ CVT",
      benefits: [
        "100% fee reduction on all vault operations",
        "Early access to new vault types and features",
        "Unlimited vault creation",
        "Maximum security tier access by default",
        "Custom-branded vault solutions",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <Helmet>
        <title>CVT Tokenomics | Chronos Vault</title>
      </Helmet>
      
      <main className="flex-1">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mb-8">
              <Button
                variant="ghost"
                className="mb-8 hover:bg-[#6B00D7]/10 text-white/80 hover:text-white"
                onClick={() => setLocation("/cvt-utility")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to CVT Utility
              </Button>
              
              <div className="text-center mb-16">
                <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm">
                  <span className="text-sm font-medium text-[#FF5AF7] flex items-center justify-center">
                    <Coins className="h-4 w-4 mr-2" />
                    CVT Token Economics
                  </span>
                </div>
              
                <h1 className="font-poppins font-bold text-4xl md:text-7xl leading-tight mb-8">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    ChronosToken (CVT)
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                  The deflationary utility token powering the Chronos Vault ecosystem
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-100">Total Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                      {totalSupply}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Fixed supply</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-100">Circulating Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#FF5AF7]">{circulatingSupply}</div>
                    <div className="text-sm text-gray-400 mt-1">25% of total supply</div>
                    <Progress value={25} className="h-1 mt-3 bg-gray-800" />
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-100">Current Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#FF5AF7]">{currentPrice}</div>
                    <div className="text-sm text-gray-400 mt-1">+5.2% (24h)</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-100">Token Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Badge className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#6B00D7] hover:to-[#FF5AF7]">Deflationary</Badge>
                    <Badge className="bg-[#0098EA]">Multi-Chain</Badge>
                    <Badge className="bg-[#14F195]">Utility</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mb-16">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger 
                    value="distribution" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <Coins className="h-4 w-4 mr-2" /> Distribution
                  </TabsTrigger>
                  <TabsTrigger 
                    value="staking" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <LockKeyhole className="h-4 w-4 mr-2" /> Staking Tiers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="utility" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#FF5AF7] data-[state=active]:shadow-[#FF5AF7]/20 data-[state=active]:border-[#FF5AF7]/50 border border-transparent"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" /> Utility & Mechanics
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="distribution" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Token Distribution
                      </h3>
                      
                      <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30 mb-6">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {Object.entries(tokenomicsData.distribution).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-3" style={{ 
                                    backgroundColor: 
                                      key === "publicSale" ? "#FF5AF7" : 
                                      key === "team" ? "#6B00D7" : 
                                      key === "reserves" ? "#14F195" : 
                                      key === "ecosystem" ? "#6B73FF" : "#0098EA" 
                                  }}></div>
                                  <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                                <span className="font-bold text-white">{value}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Vesting Schedule
                      </h3>
                      
                      <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {Object.entries(tokenomicsData.vesting).map(([key, value]) => (
                              <div key={key} className="mb-4">
                                <div className="flex items-center mb-2">
                                  <div className="w-3 h-3 rounded-full mr-3" style={{ 
                                    backgroundColor: 
                                      key === "publicSale" ? "#FF5AF7" : 
                                      key === "team" ? "#6B00D7" : 
                                      key === "reserves" ? "#14F195" : 
                                      key === "ecosystem" ? "#6B73FF" : "#0098EA" 
                                  }}></div>
                                  <span className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                                <div className="text-gray-300 text-sm ml-6">{value}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Distribution Visualization
                      </h3>
                      
                      {/* 3D Chart for token distribution */}
                      <TokenDistributionChart />
                      
                      <div className="mt-6 text-center">
                        <p className="text-gray-300 text-sm">
                          CVT's fixed supply of 21,000,000 tokens ensures scarcity and long-term value appreciation.
                          The token follows a deflationary model with regular burn events from fee collection.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="staking" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Staking Tiers & Benefits
                      </h3>
                      
                      <div className="space-y-6">
                        {stakingTiers.map((tier, index) => (
                          <Card key={index} className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">
                                  <span className="font-bold" style={{ 
                                    color: 
                                      index === 0 ? "#6B00D7" : 
                                      index === 1 ? "#FF5AF7" : "#0098EA" 
                                  }}>
                                    {tier.name}
                                  </span>
                                </CardTitle>
                                <Badge className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">{tier.amount}</Badge>
                              </div>
                              <CardDescription>
                                {index === 0 ? "Entry-level tier for CVT holders" : 
                                 index === 1 ? "Advanced tier for serious vault users" : 
                                 "Ultimate tier for institutional users"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <h4 className="text-sm font-medium text-white mb-2">Benefits</h4>
                              <ul className="space-y-2">
                                {tier.benefits.map((benefit, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <div className="h-2 w-2 rounded-full bg-[#FF5AF7]"></div>
                                    </div>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Tier Comparison
                      </h3>
                      
                      {/* 3D Chart for staking tiers */}
                      <StakingTiersChart />
                      
                      <div className="mt-6">
                        <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                          <CardHeader>
                            <CardTitle className="text-lg">Staking Mechanics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300 text-sm mb-4">
                              Staking CVT tokens provides dual benefits: reducing operational fees for vault creation and maintenance
                              while enabling participation in the protocol's governance.
                            </p>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <LockKeyhole className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                </div>
                                <span>Staked tokens are locked for a minimum period of 30 days</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Flame className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                </div>
                                <span>5% of all protocol fees are used to buy back and burn CVT tokens, creating deflationary pressure</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm text-gray-300">
                                <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Users className="h-3.5 w-3.5 text-[#FF5AF7]" />
                                </div>
                                <span>Stakers earn additional CVT rewards from the protocol's fee collection</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="utility" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Core Utility
                      </h3>
                      
                      <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30 mb-6">
                        <CardContent className="pt-6">
                          <ul className="space-y-4">
                            {tokenomicsData.utility.map((utility, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[#FF5AF7] font-bold">{index + 1}</span>
                                </div>
                                <span className="text-gray-300">{utility}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Token Mechanics
                      </h3>
                      
                      <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30">
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Flame className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                                Deflationary Model
                              </h4>
                              <p className="text-gray-300 text-sm">
                                CVT implements a buy-back-and-burn mechanism where 5% of all protocol fees are used to purchase 
                                and permanently remove tokens from circulation, creating continuous deflationary pressure.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Share2 className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                                Cross-Chain Functionality
                              </h4>
                              <p className="text-gray-300 text-sm">
                                CVT exists as a wrapped token across multiple blockchains (Ethereum, Solana, TON), allowing 
                                users to leverage its utility regardless of their preferred chain.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium mb-2 flex items-center">
                                <Users className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                                Governance
                              </h4>
                              <p className="text-gray-300 text-sm">
                                CVT holders can participate in protocol governance decisions, including feature prioritization, 
                                fee adjustments, and security parameter updates. Voting power is proportional to CVT holdings.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Technical Implementation
                      </h3>
                      
                      <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/30 mb-6">
                        <CardHeader>
                          <CardTitle className="text-lg">Smart Contracts</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-white font-medium mb-2">Ethereum</h4>
                              <div className="bg-black/50 p-3 rounded-lg text-sm font-mono text-gray-300 break-all">
                                ERC-20: 0x7C5A6E2B5c98bbe45A82D92266AF2874eB8a54c3
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium mb-2">Solana</h4>
                              <div className="bg-black/50 p-3 rounded-lg text-sm font-mono text-gray-300 break-all">
                                SPL Token: CVTnKmRhiNPLjNMHaM5ueABCFn7SBdZTvxFgcNRJxvJ4
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-white font-medium mb-2">TON</h4>
                              <div className="bg-black/50 p-3 rounded-lg text-sm font-mono text-gray-300 break-all">
                                Jetton Master: EQAvDfYmkVV2zFXzC0Hs2e2RGWJyMXHpnMTXH4jnI2W3AwLb
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                        Token Resources
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <Button 
                          className="flex items-center justify-between w-full bg-gradient-to-br from-[#6B00D7]/90 to-[#1A1A1A] hover:from-[#5500AB] hover:to-[#222222] border border-[#6B00D7]/40 text-white py-6 rounded-xl shadow-glow hover:shadow-lg hover:shadow-[#6B00D7]/40 transition-all"
                          onClick={() => setLocation("/whitepaper")}
                        >
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-3" />
                            <span className="text-lg">Whitepaper</span>
                          </div>
                          <div className="text-xs bg-black/30 px-3 py-1 rounded-full">
                            Full Documentation
                          </div>
                        </Button>
                        
                        <Button 
                          className="flex items-center justify-between w-full bg-gradient-to-br from-[#FF5AF7]/90 to-[#1A1A1A] hover:from-[#FF46E8] hover:to-[#222222] border border-[#FF5AF7]/40 text-white py-6 rounded-xl shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                          onClick={() => window.open('https://example.com/cvt-audit', '_blank')}
                        >
                          <div className="flex items-center">
                            <Shield className="h-5 w-5 mr-3" />
                            <span className="text-lg">Security Audit</span>
                          </div>
                          <div className="text-xs bg-black/30 px-3 py-1 rounded-full">
                            External PDF
                          </div>
                        </Button>
                        
                        <Button 
                          className="flex items-center justify-between w-full bg-black hover:bg-black/80 border border-gray-800 text-white py-6 rounded-xl hover:shadow-lg transition-all"
                          onClick={() => window.open('https://example.com/cvt-tokenomics.pdf', '_blank')}
                        >
                          <div className="flex items-center">
                            <Download className="h-5 w-5 mr-3" />
                            <span className="text-lg">Technical Paper</span>
                          </div>
                          <div className="text-xs bg-[#6B00D7]/30 px-3 py-1 rounded-full">
                            Download PDF
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CVTTokenomicsPage;