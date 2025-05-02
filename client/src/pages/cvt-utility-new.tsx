import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCVTToken } from "@/contexts/cvt-token-context";
import { ArrowRight, Clock, Lock, Shield, Sparkles, Zap, CreditCard, FileKey, CheckCircle2, KeyRound, Globe, Fingerprint } from "lucide-react";

const CVTUtilityPage = () => {
  const [_, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("ethereum");
  const { tokenBalance } = useCVTToken();
  
  // Chain-specific pricing and feature information aligned with CVT mathematical model
  const chainPricing = {
    ethereum: {
      color: "#6B73FF",
      symbol: "Ξ",
      features: [
        "Advanced smart contract functionality",
        "Ethereum DeFi ecosystem integration", 
        "ERC-20 and ERC-721 token support",
        "Layer-2 compatibility for gas optimization",
        "Programmable unlocking conditions",
        "Multi-signature security"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic Ethereum Vault",
          description: "Simple time-locking with ETH and ERC-20 support",
          price: 10, // More accessible entry price
          icon: <KeyRound className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["ETH and ERC-20 support", "Simple time-locking", "Basic recovery options", "Email notifications"]
        },
        {
          id: "enhanced",
          name: "Enhanced Ethereum Vault",
          description: "Advanced features for ETH, ERC-20, and NFT storage",
          price: 50, // Aligned with Vault Guardian tier
          icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Multi-signature security", "NFT support (ERC-721/1155)", "Advanced recovery options", "Conditional logic"]
        },
        {
          id: "premium",
          name: "Premium Ethereum Vault",
          description: "Enterprise-grade security with custom features",
          price: 100, // Aligned with Vault Architect tier
          icon: <CreditCard className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Custom smart contract logic", "Layer-2 optimization", "Cross-chain bridging", "Private transactions"]
        }
      ]
    },
    solana: {
      color: "#14F195",
      symbol: "◎",
      features: [
        "High-speed and low-cost transactions",
        "SPL token support for all Solana tokens",
        "Advanced program functionality",
        "Solana NFT compatibility",
        "Multi-wallet security",
        "Fast block confirmation"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic Solana Vault",
          description: "High-speed vault for SOL and SPL tokens",
          price: 8, // More accessible entry price
          icon: <KeyRound className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["SOL and SPL token support", "High-speed processing", "Basic automation", "Email notifications"]
        },
        {
          id: "enhanced",
          name: "Enhanced Solana Vault",
          description: "Advanced features with higher security",
          price: 40, // Aligned with Vault Guardian tier
          icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Solana NFT compatibility", "Low-latency transactions", "Program integration", "Advanced security"]
        },
        {
          id: "premium",
          name: "Premium Solana Vault",
          description: "Enterprise-grade features for institutions",
          price: 90, // Aligned with Vault Architect tier
          icon: <CreditCard className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Enterprise-grade security", "Custom program logic", "DeFi protocol integration", "Solana governance voting"]
        }
      ]
    },
    ton: {
      color: "#0098EA",
      symbol: "💎",
      features: [
        "Lightning-fast transaction processing",
        "Advanced smart contract functionality",
        "TON asset management and security",
        "Scalable vault infrastructure",
        "Future-proof architecture",
        "Native Telegram integration"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic TON Vault",
          description: "Fast and secure TON asset management",
          price: 5, // More accessible entry price
          icon: <KeyRound className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["TON asset storage", "Fast transaction finality", "Basic automation", "Email notifications"]
        },
        {
          id: "enhanced",
          name: "Enhanced TON Vault",
          description: "Advanced TON features and automation",
          price: 25, // Aligned with lower entry barrier
          icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Advanced TON functionality", "Smart contract automation", "Telegram bot integration", "Enhanced security"]
        },
        {
          id: "premium",
          name: "Premium TON Vault",
          description: "Enterprise-grade TON solutions",
          price: 75, // Aligned with Vault Architect tier
          icon: <CreditCard className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Custom TON contract integration", "Enterprise security", "Advanced recovery", "Priority support"]
        }
      ]
    }
  };

  // Specialized vault types that require CVT tokens - aligned with CVT tokenomics tiers
  const specializedVaults = [
    {
      id: "time-lock",
      name: "Advanced Time-Lock Vault",
      description: "Lock assets with precision time-based controls and conditions",
      price: 15, // Entry-level specialized vault
      icon: <Clock className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Programmable time schedules", "Calendar-based unlocking", "Recurring time windows", "Long-term cold storage"]
    },
    {
      id: "multi-sig",
      name: "Multi-Signature Vault",
      description: "Require multiple keys for enhanced security",
      price: 30, // Accessible security enhancement
      icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Multiple signature requirements", "Customizable quorum", "Governance capabilities", "Team access management"]
    },
    {
      id: "biometric",
      name: "Biometric Vault",
      description: "Advanced security using biometric authentication",
      price: 40, // Aligned with Vault Guardian benefits
      icon: <Fingerprint className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Fingerprint verification", "Facial recognition", "Multi-factor authentication", "Enhanced privacy"]
    },
    {
      id: "smart-contract",
      name: "Smart Contract Vault",
      description: "Create conditional logic for automated vault operations",
      price: 55, // Mid-tier specialized functionality
      icon: <FileKey className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Programmable conditions", "Event-triggered actions", "Cross-chain automation", "DeFi integration"]
    },
    {
      id: "dynamic",
      name: "Dynamic Security Vault",
      description: "Adaptive security that evolves based on threat detection",
      price: 70, // Approaching Vault Architect tier
      icon: <Sparkles className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["AI-powered security protocols", "Behavioral analysis", "Auto-adjusting protection levels", "Threat monitoring"]
    },
    {
      id: "enhanced-security",
      name: "Ultra-Secure Vault",
      description: "Military-grade encryption with our highest security protocol",
      price: 90, // Aligned with Vault Architect tier
      icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Triple-chain security", "Zero-knowledge proofs", "Multiple backup systems", "Advanced recovery options"]
    }
  ];

  const tokenPower = tokenBalance ? parseFloat(tokenBalance) : 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <main className="flex-1">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute w-full h-full top-0 left-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 blur-3xl opacity-30"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-[#FF5AF7]/20 to-[#6B00D7]/10 blur-3xl opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-4 py-1 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/40 backdrop-blur-sm">
                <span className="text-sm font-medium text-[#FF5AF7] flex items-center justify-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Power Your Vaults with CVT
                </span>
              </div>
            
              <h1 className="font-poppins font-bold text-4xl md:text-7xl leading-tight mb-8">
                <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                  CVT Token Utility
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                The Chronos Vault Token (CVT) is the essential utility token required for creating specialized vaults and accessing premium features across multiple blockchains.
              </p>
            </div>

            <div className="bg-black border-2 border-[#6B00D7]/40 rounded-2xl p-6 md:p-8 mb-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6B00D7]/20 to-transparent rounded-bl-full opacity-50"></div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Your CVT Balance</h2>
                    <p className="text-gray-400 mt-1">Use your tokens to unlock premium vault capabilities</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-xl blur-sm opacity-70"></div>
                      <div className="relative bg-black border border-[#6B00D7]/50 rounded-xl px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">CVT</span>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white">{tokenBalance || '0'}</div>
                            <div className="text-xs text-gray-400">Available Balance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium px-6 py-6 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all relative overflow-hidden group h-full"
                      onClick={() => setLocation("/cvt-token")}
                    >
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center font-bold">
                        Get More CVT
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger 
                    value="ethereum" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#6B73FF] data-[state=active]:shadow-[#6B73FF]/20 data-[state=active]:border-[#6B73FF]/50 border border-transparent"
                  >
                    <span className="text-lg mr-2">Ξ</span> Ethereum
                  </TabsTrigger>
                  <TabsTrigger 
                    value="solana" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#14F195] data-[state=active]:shadow-[#14F195]/20 data-[state=active]:border-[#14F195]/50 border border-transparent"
                  >
                    <span className="text-lg mr-2">◎</span> Solana
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ton" 
                    className="data-[state=active]:bg-[#1A1A1A] data-[state=active]:text-[#0098EA] data-[state=active]:shadow-[#0098EA]/20 data-[state=active]:border-[#0098EA]/50 border border-transparent"
                  >
                    <span className="text-lg mr-2">💎</span> TON
                  </TabsTrigger>
                </TabsList>

                {Object.entries(chainPricing).map(([chain, pricing]) => (
                  <TabsContent key={chain} value={chain} className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {pricing.vaultTypes.map((vault, index) => {
                        const canAfford = tokenPower >= vault.price;
                        return (
                          <div
                            key={index}
                            className={`relative ${canAfford ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
                            onClick={() => canAfford && setLocation('/create-vault')}
                          >
                            {/* Glowing border effect */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-xl ${canAfford ? 'opacity-70' : 'opacity-20'} blur-sm group-hover:opacity-100 transition-all duration-300`}></div>
                            
                            {/* Card Content */}
                            <div className="relative bg-black border border-[#6B00D7]/30 rounded-xl overflow-hidden h-full">
                              {/* Top Gradient Line */}
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-90"></div>
                              
                              {/* Header with Icon and Badge */}
                              <div className="bg-gradient-to-r from-black via-[#1A1A1A] to-black p-5 border-b border-[#6B00D7]/30">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-[#1E1E1E] to-black border-2 ${canAfford ? 'border-[#FF5AF7]' : 'border-gray-700'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                                      <div className={canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}>
                                        {vault.icon}
                                      </div>
                                    </div>
                                    <h3 className={`text-xl font-bold ${canAfford ? 'text-white group-hover:text-[#FF5AF7]' : 'text-gray-500'} transition-colors`}>
                                      {vault.name}
                                    </h3>
                                  </div>
                                  {canAfford ? (
                                    <Badge variant="outline" className="border-[#FF5AF7]/50 bg-black text-[#FF5AF7]">
                                      Available
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-gray-700 bg-black text-gray-500">
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              {/* Price and Features */}
                              <div className="p-5">
                                {/* Price display */}
                                <div className={`flex items-center justify-between p-3 mb-4 bg-gradient-to-r ${canAfford ? 'from-[#6B00D7]/20 to-[#1A1A1A]' : 'from-gray-900 to-black'} rounded-md border ${canAfford ? 'border-[#6B00D7]/30' : 'border-gray-800'} shadow-sm`}>
                                  <div className="flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                      <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#1A1A1A"/>
                                      <path d="M28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20Z" fill={canAfford ? '#FF5AF7' : '#444444'}/>
                                    </svg>
                                    <span className="text-xl font-bold mr-1 text-white">{vault.price}</span>
                                    <span className="text-sm text-gray-300">CVT Tokens</span>
                                  </div>
                                  {!canAfford && (
                                    <div className="text-sm text-red-400 flex items-center gap-1">
                                      <Lock className="h-3 w-3" />
                                      <span>Need {vault.price - tokenPower} more</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Features list */}
                                <div className="mb-4">
                                  <h4 className={`text-sm uppercase font-medium mb-3 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}`}>Features</h4>
                                  <ul className="space-y-3">
                                    {vault.features.map((feature, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <div className={`h-5 w-5 rounded-full ${canAfford ? 'bg-[#6B00D7]/20' : 'bg-gray-900'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                          <CheckCircle2 className={`h-3 w-3 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-600'}`} />
                                        </div>
                                        <span className={canAfford ? 'text-white' : 'text-gray-600'}>
                                          {feature}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {/* Call to action */}
                                {canAfford ? (
                                  <div className="flex items-center justify-between p-3 mt-auto bg-gradient-to-r from-[#6B00D7]/10 to-transparent rounded-md border border-[#6B00D7]/20 group-hover:border-[#6B00D7]/40 transition-colors">
                                    <div className="text-sm text-gray-300">
                                      {chain === 'ethereum' ? chainPricing.ethereum.features[index % chainPricing.ethereum.features.length] :
                                       chain === 'solana' ? chainPricing.solana.features[index % chainPricing.solana.features.length] :
                                       chainPricing.ton.features[index % chainPricing.ton.features.length]}
                                    </div>
                                    <div className="h-7 w-7 rounded-full bg-[#6B00D7] flex items-center justify-center group-hover:bg-[#FF5AF7] transition-colors">
                                      <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2 p-3 mt-auto bg-gray-900 rounded-md border border-gray-800">
                                    <Lock className="h-4 w-4 text-gray-600" />
                                    <span className="text-sm text-gray-500">Acquire {vault.price - tokenPower} more CVT to unlock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/20 mb-8">
                      <CardHeader>
                        <CardTitle className="text-2xl">
                          <span className="text-xl mr-2">
                            {chain === 'ethereum' ? 'Ξ' : chain === 'solana' ? '◎' : '💎'}
                          </span> 
                          {chain.charAt(0).toUpperCase() + chain.slice(1)} Vault Features
                        </CardTitle>
                        <CardDescription>
                          Key benefits of using CVT tokens for {chain.charAt(0).toUpperCase() + chain.slice(1)} vaults
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {(chain === 'ethereum' ? chainPricing.ethereum.features : 
                            chain === 'solana' ? chainPricing.solana.features : 
                            chainPricing.ton.features).map((feature, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6B00D7]/30 to-[#FF5AF7]/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-[#FF5AF7] font-bold">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{feature}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="font-poppins font-bold text-3xl mb-6">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    Specialized Vault Types
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Premium vault configurations requiring CVT tokens for advanced functionality
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specializedVaults.map((vault) => {
                  const canAfford = tokenPower >= vault.price;
                  return (
                    <div 
                      key={vault.id} 
                      className={`relative ${canAfford ? 'cursor-pointer' : 'cursor-not-allowed'} group`}
                      onClick={() => canAfford && setLocation(`/create-vault?type=${vault.id}`)}
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-xl ${canAfford ? 'opacity-70' : 'opacity-20'} blur-sm group-hover:opacity-100 transition-all duration-300`}></div>
                      
                      <div className="relative bg-black border border-[#6B00D7]/30 rounded-xl overflow-hidden h-full p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`h-14 w-14 rounded-full bg-gradient-to-br from-[#1E1E1E] to-black border-2 ${canAfford ? 'border-[#FF5AF7]' : 'border-gray-700'} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                            <div className={canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}>
                              {vault.icon}
                            </div>
                          </div>
                          <Badge variant={canAfford ? 'outline' : 'secondary'} className={canAfford ? 'border-[#FF5AF7]/40 bg-[#6B00D7]/10 text-[#FF5AF7]' : 'bg-gray-900 text-gray-500'}>
                            {vault.price} CVT
                          </Badge>
                        </div>
                        
                        <h3 className={`text-xl font-bold mb-2 ${canAfford ? 'text-white group-hover:text-[#FF5AF7]' : 'text-gray-500'} transition-colors`}>
                          {vault.name}
                        </h3>
                        <p className={`mb-6 ${canAfford ? 'text-gray-400' : 'text-gray-600'}`}>
                          {vault.description}
                        </p>
                        
                        <ul className="space-y-3 mb-6">
                          {vault.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className={`h-5 w-5 rounded-full ${canAfford ? 'bg-[#6B00D7]/20' : 'bg-gray-900'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                <CheckCircle2 className={`h-3 w-3 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-600'}`} />
                              </div>
                              <span className={canAfford ? 'text-white' : 'text-gray-600'}>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        {canAfford ? (
                          <Button 
                            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all relative overflow-hidden group"
                          >
                            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10 flex items-center justify-center">
                              Create {vault.name.split(' ')[0]}
                              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </Button>
                        ) : (
                          <div className="flex items-center justify-center gap-2 p-3 mt-auto bg-gray-900 rounded-xl border border-gray-800">
                            <Lock className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-500">Need {vault.price - tokenPower} more CVT</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="font-poppins font-bold text-3xl mb-6">
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    CVT Staking Tiers
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  Stake your CVT tokens to unlock advanced platform benefits and reduced fees
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Vault Guardian */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#6B00D7]/70 to-[#FF5AF7]/50 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-black border border-[#6B00D7]/40 rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Vault Guardian</h3>
                      <Badge className="bg-[#6B00D7]/20 text-[#FF5AF7] border-[#6B00D7]/40">
                        1,000+ CVT
                      </Badge>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">15% reduction on platform fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Basic portfolio analytics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Up to 10 time capsules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">1x base voting weight</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Vault Architect */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#6B00D7]/80 to-[#FF5AF7]/60 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-black border border-[#6B00D7]/40 rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Vault Architect</h3>
                      <Badge className="bg-[#6B00D7]/30 text-[#FF5AF7] border-[#6B00D7]/40">
                        10,000+ CVT
                      </Badge>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">30% reduction on platform fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Advanced analytics & AI insights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Up to 50 time capsules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">3x base voting weight</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Vault Sovereign */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-[#6B00D7]/90 to-[#FF5AF7]/70 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative bg-black border border-[#6B00D7]/40 rounded-2xl p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Vault Sovereign</h3>
                      <Badge className="bg-[#6B00D7]/40 text-[#FF5AF7] border-[#6B00D7]/40">
                        100,000+ CVT
                      </Badge>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">50% reduction on platform fees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Premium AI optimization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">Unlimited capsules & concierge service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3 w-3 text-[#FF5AF7]" />
                        </div>
                        <span className="text-white">10x base voting weight</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <h2 className="font-poppins font-bold text-3xl mb-6">
                <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                  Get Started with CVT Tokens
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                Unlock the full potential of Chronos Vault with our utility token
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-semibold py-6 px-8 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#6B00D7]/20 transition-all"
                  onClick={() => setLocation("/cvt-token")}
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Get CVT Tokens
                </Button>
                
                <Button 
                  variant="outline" 
                  className="border-[#6B00D7] text-[#FF5AF7] hover:bg-[#6B00D7]/10 font-semibold py-6 px-8 rounded-xl transition-all"
                  onClick={() => setLocation("/cvt-tokenomics")}
                >
                  <Globe className="mr-2 h-5 w-5" />
                  CVT Tokenomics
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CVTUtilityPage;