import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Shield, Clock, FileKey, Sparkles, Zap, Wallet, CheckCircle2, ArrowRight, Users, Globe, Key, KeyRound } from "lucide-react";
import { useCVTToken } from "@/contexts/cvt-token-context";

const CVTUtility = () => {
  const [_, setLocation] = useLocation();
  const { tokenBalance } = useCVTToken();
  const [selectedTab, setSelectedTab] = useState<string>("ethereum");
  
  // Parse the URL for initial tab selection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chain = params.get("chain");
    if (chain && ["ethereum", "solana", "ton"].includes(chain)) {
      setSelectedTab(chain);
    }
  }, []);
  
  // Chain-specific pricing and features
  const chainPricing = {
    ethereum: {
      name: "Ethereum",
      symbol: "Ξ",
      color: "#6B73FF",
      features: [
        "Smart contract automation",
        "Multi-signature capabilities",
        "Decentralized governance",
        "ERC-20 & NFT compatibility",
        "Cross-chain asset bridging",
        "Integration with DeFi protocols",
        "Advanced transaction scheduling",
        "Gas optimization technology"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic ETH Vault",
          description: "Standard Ethereum vault for secure asset storage",
          price: 50,
          icon: <Wallet className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Smart contract time-locking", "ERC-20 token support", "Transaction history", "Basic unlock conditions"]
        },
        {
          id: "multi-sig",
          name: "Multi-Signature Vault",
          description: "Enhanced security with multiple required signers",
          price: 120,
          icon: <Users className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Required multiple approvers", "Customizable quorum settings", "Integrated governance", "Security audit trail"]
        },
        {
          id: "premium",
          name: "Premium Smart Vault",
          description: "Enterprise-grade Ethereum vault with advanced features",
          price: 250,
          icon: <Shield className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Custom smart contract logic", "Cross-chain asset bridging", "DeFi protocol integration", "Advanced security features"]
        }
      ]
    },
    solana: {
      name: "Solana",
      symbol: "◎",
      color: "#14F195",
      features: [
        "Ultra-fast transaction speeds",
        "Low transaction fees",
        "SPL token compatibility",
        "Solana NFT integration",
        "Parallel transaction processing",
        "Web3 program integration",
        "Proof-of-history consensus",
        "High-performance architecture"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic SOL Vault",
          description: "High-performance Solana vault for digital assets",
          price: 40,
          icon: <Wallet className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Fast transaction processing", "SPL token support", "Low fee structure", "Rapid unlocking"]
        },
        {
          id: "advanced",
          name: "Enhanced SOL Vault",
          description: "Advanced capabilities with Solana's speed benefits",
          price: 80,
          icon: <Key className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Solana NFT compatibility", "Low-latency transaction locks", "Program-based automation", "Enhanced security"]
        },
        {
          id: "defi",
          name: "DeFi Integration Vault",
          description: "Connect your vault to Solana's DeFi ecosystem",
          price: 200,
          icon: <Sparkles className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Advanced Solana program logic", "DeFi protocol integration", "Yield strategy automation", "Real-time analytics"]
        }
      ]
    },
    ton: {
      name: "TON",
      symbol: "💎",
      color: "#0098EA",
      features: [
        "Lightning-fast finality",
        "Ultra-scalable architecture",
        "TON smart contract support",
        "Minimal transaction fees",
        "Telegram integration capabilities",
        "Auto-scaling sharding",
        "Cross-chain asset bridge",
        "Advanced TON contract functionality"
      ],
      vaultTypes: [
        {
          id: "basic",
          name: "Basic TON Vault",
          description: "Fast and secure TON Network vault storage",
          price: 30,
          icon: <Wallet className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["TON asset management", "Fast transaction finality", "Telegram notifications", "Low-cost operations"]
        },
        {
          id: "enhanced",
          name: "Enhanced TON Vault",
          description: "Advanced TON vault with smart features",
          price: 60,
          icon: <KeyRound className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Advanced TON functionality", "Smart contract automation", "Multi-wallet support", "Enhanced security"]
        },
        {
          id: "premium",
          name: "Premium TON Vault",
          description: "Enterprise-grade TON vault with custom capabilities",
          price: 150,
          icon: <Globe className="h-6 w-6 text-[#FF5AF7]" />,
          features: ["Custom TON contract integration", "Enterprise-grade security", "Global access controls", "Advanced automation"]
        }
      ]
    }
  };
  
  // Specialized vault types
  const specializedVaults = [
    {
      id: "multi-signature",
      name: "Multi-Signature Vault",
      description: "Require multiple approvers for enhanced security",
      price: 150,
      icon: <Users className="h-6 w-6 text-[#FF5AF7]" />,
      features: ["Customizable approval threshold", "Role-based permissions", "Transaction audit trail", "Anti-phishing protection"]
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
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mt-4 leading-relaxed">
                Unlock premium features and enhanced security with Chronos Vault Tokens (CVT)
              </p>
            </div>
            
            <div className="mb-16 bg-black/30 border border-[#6B00D7]/20 rounded-xl p-6 md:p-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                    Your Vault Power
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Chronos Vault Tokens (CVT) are the native utility currency that powers advanced vault features and unlocks premium functionality across multiple blockchains.
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-[#6B00D7] via-[#FF5AF7] to-[#6B00D7] p-[2px] animate-text-shine bg-300%">
                      <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                        <Wallet className="h-6 w-6 text-[#FF5AF7]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-white text-3xl font-bold flex items-center gap-2">
                        {tokenBalance || "0"} <span className="text-[#FF5AF7] text-xl">CVT</span>
                      </div>
                      <div className="text-gray-400 text-sm">Your Current Balance</div>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white hover:opacity-90 relative overflow-hidden group"
                    onClick={() => setLocation("/cvt-payment")}
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">Get More CVT Tokens</span>
                  </Button>
                </div>
                
                <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#6B00D7]/30">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    Token Benefits
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5AF7]" />
                      </div>
                      <span className="text-gray-200">Access to premium vault types across all supported blockchains</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5AF7]" />
                      </div>
                      <span className="text-gray-200">Enhanced security features including multi-signature and time-lock capabilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5AF7]" />
                      </div>
                      <span className="text-gray-200">Lower transaction fees and exclusive governance participation rights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF5AF7]" />
                      </div>
                      <span className="text-gray-200">Cross-chain functionality unlocking asset movement between blockchains</span>
                    </li>
                  </ul>
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
                      className={`relative ${canAfford ? 'cursor-pointer' : 'cursor-not-allowed'} group h-full`}
                      onClick={() => canAfford && setLocation(`/create-vault?type=${vault.id}`)}
                    >
                      {/* Glowing border effect */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-xl ${canAfford ? 'opacity-50' : 'opacity-20'} blur-sm group-hover:opacity-80 transition-all duration-300`}></div>
                      
                      {/* Card Content */}
                      <div className="relative bg-black border border-[#6B00D7]/30 rounded-xl overflow-hidden h-full flex flex-col">
                        {/* Top Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-90"></div>
                        
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className={`h-14 w-14 rounded-full bg-gradient-to-br from-[#1E1E1E] to-black border ${canAfford ? 'border-[#FF5AF7]' : 'border-gray-700'} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                              <div className={canAfford ? 'text-[#FF5AF7]' : 'text-gray-500'}>
                                {vault.icon}
                              </div>
                            </div>
                            <Badge variant={canAfford ? 'outline' : 'secondary'} className={canAfford ? 'border-[#FF5AF7]/40 bg-[#FF5AF7]/10 text-[#FF5AF7]' : 'bg-gray-900 text-gray-600 border-gray-800'}>
                              {vault.price} CVT
                            </Badge>
                          </div>
                          
                          <h3 className={`text-xl font-bold mb-2 ${canAfford ? 'text-white' : 'text-gray-500'}`}>{vault.name}</h3>
                          <p className={`mb-6 ${canAfford ? 'text-gray-400' : 'text-gray-600'}`}>{vault.description}</p>
                          
                          <div className="mb-6">
                            <ul className="space-y-3">
                              {vault.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className={`h-5 w-5 rounded-full ${canAfford ? 'bg-[#6B00D7]/20' : 'bg-gray-900'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <CheckCircle2 className={`h-3 w-3 ${canAfford ? 'text-[#FF5AF7]' : 'text-gray-600'}`} />
                                  </div>
                                  <span className={canAfford ? 'text-white' : 'text-gray-600'}>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-auto p-6 pt-0">
                          {canAfford ? (
                            <Button 
                              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 relative overflow-hidden group"
                            >
                              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              <span className="relative z-10 flex items-center">
                                Create Vault
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full border-gray-800 text-gray-500" disabled>
                              <Lock className="h-4 w-4 mr-2" />
                              Need {vault.price - tokenPower} more CVT
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={() => setLocation("/cvt-payment")} 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white font-medium px-6 py-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#6B00D7]/20 transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10 flex items-center text-lg">
                  Get More CVT Tokens
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CVTUtility;