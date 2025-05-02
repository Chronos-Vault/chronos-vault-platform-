import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useCVTToken } from '@/contexts/cvt-token-context';
import { useMultiChain, BlockchainType } from '@/contexts/multi-chain-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, ArrowRight, Shield, Lock, Sparkles, Diamond, Rocket, Coins, Wallet, AlertTriangle } from 'lucide-react';

const CVTUtilityPage = () => {
  const [_, navigate] = useLocation();
  const { tokenBalance, stakingRequirements, currentStakingTier } = useCVTToken();
  const { isAnyWalletConnected, chainStatus } = useMultiChain();
  const { toast } = useToast();
  
  // Define utility costs in CVT tokens
  const vaultCosts = {
    standard: {
      ethereum: 25,
      solana: 15,
      ton: 10
    },
    enhanced: {
      ethereum: 50,
      solana: 35,
      ton: 25
    },
    premium: {
      ethereum: 100,
      solana: 75, 
      ton: 50
    }
  };
  
  // Define features included in each tier
  const tierFeatures = {
    standard: [
      "Basic time-lock vault functionality",
      "Single blockchain security",
      "Standard encryption",
      "Basic notifications"
    ],
    enhanced: [
      "Multi-signature protection",
      "Advanced encryption",
      "Dual-chain verification",
      "Enhanced privacy controls",
      "Priority support"
    ],
    premium: [
      "Triple-chain security architecture",
      "Zero-knowledge privacy layer",
      "AI security monitoring",
      "Cross-chain compatibility",
      "Unlimited vault creations",
      "VIP support"
    ]
  };
  
  // Benefits per blockchain
  const blockchainBenefits = {
    ethereum: [
      "Smart contract automation",
      "DeFi integration capability",
      "NFT vault functionality",
      "ERC-4626 compliant tokenized vaults"
    ],
    solana: [
      "High-performance transactions",
      "Low-cost vault operations",
      "Rapid settlement times",
      "SPL token support"
    ],
    ton: [
      "Scalable and secure architecture",
      "TON ecosystem integration",
      "Low transaction fees",
      "Mobile-friendly vault management"
    ]
  };
  
  // Handle create vault with tokens
  const handleCreateVault = (blockchain: string, tier: string) => {
    if (!isAnyWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to use CVT tokens.",
        variant: "destructive",
      });
      navigate('/wallet-manager');
      return;
    }
    
    const cost = vaultCosts[tier as keyof typeof vaultCosts][blockchain as keyof typeof vaultCosts.standard];
    const userTokens = parseFloat(tokenBalance || '0');
    
    if (userTokens < cost) {
      toast({
        title: "Insufficient CVT Balance",
        description: `You need at least ${cost} CVT tokens. Your balance: ${userTokens.toFixed(2)} CVT.`,
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to create vault page with params
    navigate(`/create-vault?blockchain=${blockchain}&tier=${tier}&useCVT=true`);
  };
  
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212] py-16">
      <div className="container mx-auto px-4">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
              CVT Token Utility
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Use your CVT tokens to unlock powerful vault creation across multiple blockchains 
            with enhanced security and privacy features.
          </p>
          
          {isAnyWalletConnected ? (
            <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4 flex items-center justify-center">
                <Wallet className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                Your CVT Balance
              </h3>
              <div className="text-3xl font-bold text-[#FF5AF7] mb-4">
                {parseFloat(tokenBalance || '0').toFixed(2)} CVT
              </div>
              <div className="text-sm text-gray-400 mb-6">
                Current Tier: {currentStakingTier}
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                onClick={() => navigate('/cvt-token')}
              >
                <Coins className="h-4 w-4 mr-2" />
                Manage CVT Tokens
              </Button>
            </div>
          ) : (
            <div className="bg-[#1A1A1A] border border-[#6B00D7]/30 rounded-xl p-6 max-w-md mx-auto">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-[#FF5AF7]" />
              <h3 className="text-xl font-semibold mb-2">Wallet Not Connected</h3>
              <p className="text-gray-400 mb-6">Connect your wallet to see your CVT balance and create vaults</p>
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                onClick={() => navigate('/wallet-manager')}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
        
        {/* Main content */}
        <Tabs defaultValue="ethereum" className="mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-[#1A1A1A] border border-[#6B00D7]/30">
              <TabsTrigger value="ethereum" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                Ethereum Vaults
              </TabsTrigger>
              <TabsTrigger value="solana" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                Solana Vaults
              </TabsTrigger>
              <TabsTrigger value="ton" className="data-[state=active]:bg-[#6B00D7]/20 data-[state=active]:text-[#FF5AF7]">
                TON Vaults
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Ethereum Vaults */}
          <TabsContent value="ethereum">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Standard Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/30 overflow-hidden">
                <div className="h-2 bg-[#6B00D7]/50"></div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#6B00D7]" />
                    Standard Vault
                  </CardTitle>
                  <CardDescription>
                    Basic Ethereum vault functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.standard.ethereum}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.standard.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Ethereum Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ethereum[0]}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 hover:from-[#6B00D7] hover:to-[#FF5AF7]"
                    onClick={() => handleCreateVault('ethereum', 'standard')}
                  >
                    Create with {vaultCosts.standard.ethereum} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enhanced Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/60 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#9F72D6]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/20 text-[#FF5AF7] border-[#6B00D7]/40">
                    Recommended
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Diamond className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Enhanced Vault
                  </CardTitle>
                  <CardDescription>
                    Advanced security features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.enhanced.ethereum}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.enhanced.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Ethereum Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ethereum.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('ethereum', 'enhanced')}
                  >
                    Create with {vaultCosts.enhanced.ethereum} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Premium Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/30 text-[#FF5AF7] border-[#6B00D7]/50">
                    Premium
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Premium Vault
                  </CardTitle>
                  <CardDescription>
                    Ultimate security and functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.premium.ethereum}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.premium.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Ethereum Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ethereum.join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('ethereum', 'premium')}
                  >
                    Create with {vaultCosts.premium.ethereum} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Solana Vaults */}
          <TabsContent value="solana">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Standard Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/30 overflow-hidden">
                <div className="h-2 bg-[#6B00D7]/50"></div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#6B00D7]" />
                    Standard Vault
                  </CardTitle>
                  <CardDescription>
                    Basic Solana vault functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.standard.solana}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.standard.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Solana Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.solana[0]}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 hover:from-[#6B00D7] hover:to-[#FF5AF7]"
                    onClick={() => handleCreateVault('solana', 'standard')}
                  >
                    Create with {vaultCosts.standard.solana} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enhanced Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/60 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#9F72D6]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/20 text-[#FF5AF7] border-[#6B00D7]/40">
                    Recommended
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Diamond className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Enhanced Vault
                  </CardTitle>
                  <CardDescription>
                    Advanced security features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.enhanced.solana}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.enhanced.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Solana Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.solana.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('solana', 'enhanced')}
                  >
                    Create with {vaultCosts.enhanced.solana} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Premium Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/30 text-[#FF5AF7] border-[#6B00D7]/50">
                    Premium
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Premium Vault
                  </CardTitle>
                  <CardDescription>
                    Ultimate security and functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.premium.solana}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.premium.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Solana Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.solana.join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('solana', 'premium')}
                  >
                    Create with {vaultCosts.premium.solana} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* TON Vaults */}
          <TabsContent value="ton">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Standard Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/30 overflow-hidden">
                <div className="h-2 bg-[#6B00D7]/50"></div>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[#6B00D7]" />
                    Standard Vault
                  </CardTitle>
                  <CardDescription>
                    Basic TON vault functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.standard.ton}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.standard.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">TON Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ton[0]}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7]/80 to-[#FF5AF7]/80 hover:from-[#6B00D7] hover:to-[#FF5AF7]"
                    onClick={() => handleCreateVault('ton', 'standard')}
                  >
                    Create with {vaultCosts.standard.ton} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Enhanced Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7]/60 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#9F72D6]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/20 text-[#FF5AF7] border-[#6B00D7]/40">
                    Recommended
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Diamond className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Enhanced Vault
                  </CardTitle>
                  <CardDescription>
                    Advanced security features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.enhanced.ton}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.enhanced.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">TON Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ton.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('ton', 'enhanced')}
                  >
                    Create with {vaultCosts.enhanced.ton} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Premium Tier */}
              <Card className="bg-[#1A1A1A] border-[#6B00D7] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6B00D7] to-transparent opacity-10 rounded-bl-full"></div>
                <div className="h-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" />
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-[#6B00D7]/30 text-[#FF5AF7] border-[#6B00D7]/50">
                    Premium
                  </Badge>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Premium Vault
                  </CardTitle>
                  <CardDescription>
                    Ultimate security and functionality
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-6">
                    <div className="text-3xl font-bold text-white">{vaultCosts.premium.ton}</div>
                    <div className="text-lg ml-2 text-[#FF5AF7]">CVT</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">Features</div>
                    <ul className="space-y-2">
                      {tierFeatures.premium.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-[#FF5AF7] text-xs">✓</span>
                          </div>
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400 uppercase tracking-wider">TON Benefits</div>
                    <div className="text-xs text-gray-400">
                      {blockchainBenefits.ton.join(' • ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                    onClick={() => handleCreateVault('ton', 'premium')}
                  >
                    Create with {vaultCosts.premium.ton} CVT
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Cross-Chain Features */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] inline-block text-transparent bg-clip-text">
                Cross-Chain Capabilities
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Utilize CVT tokens to unlock advanced cross-chain vault functionality
            </p>
          </div>
          
          <Card className="border-[#6B00D7]/30 bg-[#1A1A1A]/90">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Rocket className="h-6 w-6 mr-2 text-[#FF5AF7]" />
                Triple-Chain Security Architecture
              </CardTitle>
              <CardDescription className="text-lg">
                The ultimate protection for your digital assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xl">
                    Ξ
                  </div>
                  <h3 className="text-xl font-semibold">Ethereum Layer</h3>
                  <p className="text-gray-400">
                    Smart contract intelligence with decentralized verification
                  </p>
                  <ul className="space-y-2">
                    {['ERC-4626 compatibility', 'DeFi integration', 'ENS support'].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#FF5AF7] text-xs">✓</span>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xl">
                    ◎
                  </div>
                  <h3 className="text-xl font-semibold">Solana Layer</h3>
                  <p className="text-gray-400">
                    High-performance transaction validation and security checkpoints
                  </p>
                  <ul className="space-y-2">
                    {['Low-cost operation', 'High throughput', 'SPL integration'].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#FF5AF7] text-xs">✓</span>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#6B00D7]/20 flex items-center justify-center text-xl">
                    💎
                  </div>
                  <h3 className="text-xl font-semibold">TON Layer</h3>
                  <p className="text-gray-400">
                    Robust scalability with advanced security protocols
                  </p>
                  <ul className="space-y-2">
                    {['Mobile-friendly', 'Telegram integration', 'Fast finality'].map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-[#6B00D7]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[#FF5AF7] text-xs">✓</span>
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <Separator className="my-8" />
              
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Unlock Cross-Chain Capabilities with CVT</h3>
                <p className="text-gray-400 mb-6 max-w-3xl mx-auto">
                  Premium vault features require CVT tokens to activate. Build the most secure digital vault 
                  with protection spanning multiple blockchains through a single interface.
                </p>
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5800B3] hover:to-[#FF46E8]"
                  onClick={() => navigate('/cvt-token')}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Get CVT Tokens
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CVTUtilityPage;