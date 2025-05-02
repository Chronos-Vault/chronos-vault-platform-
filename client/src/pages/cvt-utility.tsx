import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Wallet, Zap, ArrowRight, CheckCircle2, Lock, Globe, Clock, ShieldCheck, Users, FileKey, Shield, Sparkles } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";

const CVTUtilityPage = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();
  const [selectedTab, setSelectedTab] = useState("ethereum");

  // Pricing tiers for different blockchain vaults
  const chainPricing = {
    ethereum: {
      basic: 25,
      standard: 50,
      premium: 100,
      symbol: "Ξ",
      color: "#6B73FF",
      features: [
        "Smart Contract Security",
        "Enhanced EVM Integration",
        "Ethereum Cross-Chain Bridges",
        "Multi-signature Security",
        "Gas Optimization"
      ],
      vaultTypes: [
        { 
          name: "Basic ETH Vault", 
          price: 25,
          features: ["Simple time-locked storage", "Basic Ethereum security", "Standard recovery options"],
          icon: <Lock className="h-5 w-5" />
        },
        { 
          name: "Standard ETH Vault", 
          price: 50,
          features: ["Multi-signature protection", "Advanced ETH integration", "Enhanced recovery options", "Conditional unlocking"],
          icon: <ShieldCheck className="h-5 w-5" />
        },
        { 
          name: "Premium ETH Vault", 
          price: 100,
          features: ["Military-grade encryption", "Full EVM contract integration", "Comprehensive recovery system", "Programmable unlock conditions", "Cross-chain compatibility"],
          icon: <Shield className="h-5 w-5" />
        }
      ]
    },
    solana: {
      basic: 15,
      standard: 35,
      premium: 75,
      symbol: "◎",
      color: "#14F195",
      features: [
        "High-Performance Protection",
        "SPL Token Support",
        "Solana Program Integration",
        "Parallel Transaction Processing",
        "Low-latency Security"
      ],
      vaultTypes: [
        { 
          name: "Basic SOL Vault", 
          price: 15,
          features: ["Time-locked Solana assets", "SPL token support", "Fast transactions"],
          icon: <Lock className="h-5 w-5" />
        },
        { 
          name: "Standard SOL Vault", 
          price: 35,
          features: ["Advanced Solana program integration", "Multi-signature security", "Enhanced SPL token management", "Custom unlock conditions"],
          icon: <ShieldCheck className="h-5 w-5" />
        },
        { 
          name: "Premium SOL Vault", 
          price: 75,
          features: ["Enterprise-grade security", "Full Solana program integration", "Comprehensive recovery system", "Advanced conditional logic", "Cross-chain capabilities"],
          icon: <Shield className="h-5 w-5" />
        }
      ]
    },
    ton: {
      basic: 10,
      standard: 25,
      premium: 50,
      symbol: "💎",
      color: "#0098EA",
      features: [
        "Mobile-Friendly Security",
        "TON Wallet Integration",
        "Telegram Bot Control",
        "TON Smart Contract Security",
        "Low Transaction Fees"
      ],
      vaultTypes: [
        { 
          name: "Basic TON Vault", 
          price: 10,
          features: ["Simple TON asset storage", "Telegram integration", "Basic time-locking"],
          icon: <Lock className="h-5 w-5" />
        },
        { 
          name: "Standard TON Vault", 
          price: 25,
          features: ["Enhanced TON contract integration", "Mobile-first security", "Advanced Telegram controls", "Custom unlock conditions"],
          icon: <ShieldCheck className="h-5 w-5" />
        },
        { 
          name: "Premium TON Vault", 
          price: 50,
          features: ["Military-grade encryption", "Complete TON smart contract integration", "Enterprise recovery system", "Programmable conditions", "Cross-chain compatibility"],
          icon: <Shield className="h-5 w-5" />
        }
      ]
    }
  };

  const specializedVaults = [
    {
      id: "multi-signature",
      name: "Multi-Signature Vault",
      description: "Require multiple approvals for asset access and transfers",
      price: 50,
      icon: <Users className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Multi-party authorization", "Customizable approval thresholds", "Advanced security controls", "Perfect for team treasuries"]
    },
    {
      id: "geolocation",
      name: "Geolocation Vault",
      description: "Unlock assets only when in specified geographical locations",
      price: 65,
      icon: <Globe className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["GPS-based security", "Geofencing capabilities", "Location verification", "Multiple safe zones"]
    },
    {
      id: "time-lock",
      name: "Advanced Time-Lock Vault",
      description: "Lock assets with precision time-based controls and conditions",
      price: 40,
      icon: <Clock className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Programmable time schedules", "Calendar-based unlocking", "Recurring time windows", "Long-term cold storage"]
    },
    {
      id: "smart-contract",
      name: "Smart Contract Vault",
      description: "Create conditional logic for automated vault operations",
      price: 85,
      icon: <FileKey className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Programmable conditions", "Event-triggered actions", "Cross-chain automation", "DeFi integration"]
    },
    {
      id: "enhanced-security",
      name: "Ultra-Secure Vault",
      description: "Military-grade encryption with our highest security protocol",
      price: 120,
      icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Triple-chain security", "Zero-knowledge proofs", "Multiple backup systems", "Advanced recovery options"]
    },
    {
      id: "dynamic",
      name: "Dynamic Security Vault",
      description: "Adaptive security that evolves based on threat detection",
      price: 100,
      icon: <Sparkles className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["AI-powered security protocols", "Behavioral analysis", "Auto-adjusting protection levels", "Threat monitoring"]
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
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Unlock the full potential of Chronos Vault with CVT tokens across multiple blockchains
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mx-auto max-w-3xl bg-[#1E1E1E]/80 border border-[#6B00D7]/30 p-8 rounded-xl mb-12">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    Your CVT Balance
                  </h3>
                  <p className="text-gray-300 mb-4">Use your tokens to create premium vaults across chains</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10 border border-[#6B00D7]/40 flex items-center justify-center">
                    <Wallet className="h-7 w-7 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#FF5AF7]">{parseFloat(tokenBalance || '0').toFixed(2)}</div>
                    <div className="text-sm text-gray-400">CVT Balance</div>
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
                          <Card 
                            key={index} 
                            className={`bg-[#1A1A1A]/90 ${canAfford ? 'border-[#6B00D7]/50' : 'border-gray-800'} overflow-hidden relative p-6 transition-all duration-300 cursor-pointer group hover:border-[#6B00D7] h-full`}
                            onClick={() => canAfford && setLocation('/create-vault')}
                          >
                            <div className={`absolute top-0 left-0 w-full h-1 ${canAfford ? 'bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/50' : 'bg-gray-800'}`}></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7]/20 to-transparent rounded-bl-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            
                            <div className={`h-16 w-16 rounded-full ${canAfford ? 'bg-[#1E1E1E] border border-[#6B00D7]/40' : 'bg-gray-900 border border-gray-800'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                              <div className={canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}>
                                {vault.icon}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-3">
                              <h3 className={`text-xl font-semibold ${canAfford ? 'group-hover:text-[#FF5AF7]' : 'text-gray-400'} transition-colors`}>{vault.name}</h3>
                              {canAfford && (
                                <Badge variant="outline" className="border-[#6B00D7]/40 bg-[#6B00D7]/10 text-[#FF5AF7]">
                                  Available
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center mb-6">
                              <div className={`text-xl font-bold ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}`}>{vault.price}</div>
                              <div className={`text-sm ml-2 ${canAfford ? 'text-white' : 'text-gray-500'}`}>CVT</div>
                            </div>
                            
                            <ul className="space-y-2 mb-6">
                              {vault.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className={`h-4 w-4 mt-1 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-600'}`} />
                                  <span className={canAfford ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            
                            <div className="mt-auto pt-4">
                              {canAfford ? (
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-gray-400">
                                    {chain === 'ethereum' ? chainPricing.ethereum.features[index % chainPricing.ethereum.features.length] :
                                     chain === 'solana' ? chainPricing.solana.features[index % chainPricing.solana.features.length] :
                                     chainPricing.ton.features[index % chainPricing.ton.features.length]}
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-[#FF5AF7] group-hover:translate-x-1 transition-transform" />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2 p-2 rounded-md bg-gray-800/50 border border-gray-700">
                                  <Lock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-500">Need {vault.price - tokenPower} more CVT</span>
                                </div>
                              )}
                            </div>
                          </Card>
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
                    <Card 
                      key={vault.id} 
                      className={`bg-[#1A1A1A]/90 ${canAfford ? 'border-[#6B00D7]/30' : 'border-gray-800'} overflow-hidden relative`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-1 ${canAfford ? 'bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/50' : 'bg-gray-800'}`}></div>
                      
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className={`h-12 w-12 rounded-full ${canAfford ? 'bg-[#1A1A1A] border border-[#6B00D7]/40' : 'bg-gray-900 border border-gray-800'} flex items-center justify-center mb-3`}>
                            {vault.icon}
                          </div>
                          <Badge variant={canAfford ? 'outline' : 'secondary'} className={canAfford ? 'border-[#6B00D7]/40 bg-[#6B00D7]/10 text-[#FF5AF7]' : 'bg-gray-800 text-gray-500'}>
                            {vault.price} CVT
                          </Badge>
                        </div>
                        <CardTitle className={canAfford ? 'text-white' : 'text-gray-400'}>{vault.name}</CardTitle>
                        <CardDescription className={canAfford ? 'text-gray-400' : 'text-gray-600'}>
                          {vault.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {vault.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className={`h-4 w-4 mt-1 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-600'}`} />
                              <span className={canAfford ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {canAfford ? (
                          <Button 
                            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" 
                            onClick={() => setLocation(`/create-vault?type=${vault.id}`)}
                          >
                            Create {vault.name}
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full border-gray-700 text-gray-500" disabled>
                            <Lock className="h-4 w-4 mr-2" />
                            Need {vault.price - tokenPower} more CVT
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mb-16">
              <Card className="bg-[#1A1A1A]/80 border-[#6B00D7]/20">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                      CVT Token Ecosystem
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Explore the comprehensive utility of CVT tokens within Chronos Vault
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-white">Global Security Staking</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20">
                          <h4 className="font-medium mb-2 text-[#FF5AF7]">Basic Security</h4>
                          <p className="text-gray-300 text-sm mb-3">10-25 CVT staked</p>
                          <Progress value={25} className="h-2 bg-[#333333]" />
                        </div>
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20">
                          <h4 className="font-medium mb-2 text-[#FF5AF7]">Enhanced Security</h4>
                          <p className="text-gray-300 text-sm mb-3">25-75 CVT staked</p>
                          <Progress value={50} className="h-2 bg-[#333333]" />
                        </div>
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20">
                          <h4 className="font-medium mb-2 text-[#FF5AF7]">Premium Security</h4>
                          <p className="text-gray-300 text-sm mb-3">75+ CVT staked</p>
                          <Progress value={75} className="h-2 bg-[#333333]" />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#6B00D7]/20" />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-white">Cross-Chain Governance</h3>
                      <p className="text-gray-300 mb-4">
                        CVT tokens give you voting power on platform governance decisions across all supported blockchains
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-[#242424] rounded-full px-4 py-2">
                          <span className="text-lg">Ξ</span>
                          <span className="text-gray-300">Ethereum Governance</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#242424] rounded-full px-4 py-2">
                          <span className="text-lg">◎</span>
                          <span className="text-gray-300">Solana Governance</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#242424] rounded-full px-4 py-2">
                          <span className="text-lg">💎</span>
                          <span className="text-gray-300">TON Governance</span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#6B00D7]/20" />

                    <div>
                      <h3 className="text-xl font-semibold mb-4 text-white">Fee Reduction System</h3>
                      <p className="text-gray-300 mb-4">
                        Hold more CVT tokens to reduce platform fees across all blockchain operations
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20 text-center">
                          <div className="text-sm text-gray-400 mb-1">Standard</div>
                          <div className="text-xl font-bold text-white mb-1">0%</div>
                          <div className="text-xs text-gray-400">0 CVT</div>
                        </div>
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20 text-center">
                          <div className="text-sm text-gray-400 mb-1">Bronze</div>
                          <div className="text-xl font-bold text-white mb-1">10%</div>
                          <div className="text-xs text-gray-400">50+ CVT</div>
                        </div>
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20 text-center">
                          <div className="text-sm text-gray-400 mb-1">Silver</div>
                          <div className="text-xl font-bold text-white mb-1">25%</div>
                          <div className="text-xs text-gray-400">100+ CVT</div>
                        </div>
                        <div className="bg-[#242424] rounded-lg p-4 border border-[#6B00D7]/20 text-center">
                          <div className="text-sm text-gray-400 mb-1">Gold</div>
                          <div className="text-xl font-bold text-white mb-1">40%</div>
                          <div className="text-xs text-gray-400">250+ CVT</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5500AB] hover:to-[#FF46E8] text-white px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-lg hover:shadow-[#FF5AF7]/40 transition-all"
                onClick={() => setLocation("/cvt-token")}
              >
                <Wallet className="h-5 w-5 mr-2" />
                Manage Your CVT Tokens
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CVTUtilityPage;