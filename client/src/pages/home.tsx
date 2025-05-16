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
    creationDate: new Date("2023-09-15"),
    unlockDate: new Date("2030-01-01"),
    lockPeriodDays: 2300,
    securityLevel: "Maximum",
    chain: "ton" as const,
    beneficiaries: [
      { id: 1, name: "Alexander Smith", relationship: "Son" },
      { id: 2, name: "Olivia Johnson", relationship: "Daughter" },
    ],
    vaultType: "MultiSig",
    totalValue: 24500,
    assetCount: 3,
  };

  useEffect(() => {
    // Dynamically adjust UI based on scroll position
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const parallaxElements = document.querySelectorAll(".parallax-bg");
      parallaxElements.forEach((element: any) => {
        element.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 z-0 opacity-30 parallax-bg">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-muted">
            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
            <span>Now with TON blockchain integration</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600">
            The Future of Digital Legacy
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mb-10">
            Chronos Vault provides military-grade security for your digital assets through 
            time-locked vaults across multiple blockchains. Your assets, secured for generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Button onClick={() => setLocation("/create-vault")} size="lg" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Create Your Vault
            </Button>
            <Button onClick={() => setLocation("/explore-vaults")} variant="outline" size="lg" className="w-full">
              Explore Vault Types
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 mb-4">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Triple-Chain Security</h3>
              <p className="text-muted-foreground text-center">Assets secured across multiple blockchains with quantum-resistant encryption</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-4">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Time-Locked Vaults</h3>
              <p className="text-muted-foreground text-center">Securely lock assets with precisely programmed unlock dates</p>
            </div>
            
            <div className="flex flex-col items-center p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <div className="rounded-full bg-cyan-100 dark:bg-cyan-900/20 p-3 mb-4">
                <Coins className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CVT Token Benefits</h3>
              <p className="text-muted-foreground text-center">Stake CVT for up to 100% fee discounts and enhanced security features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">TON Native Integration</h2>
            <p className="text-muted-foreground">
              Experience the power of TON blockchain with Chronos Vault's native integration. Lower fees, 
              faster transactions, and enhanced security features make TON the ideal blockchain for time-locked vaults.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border border-blue-500/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 mr-4">
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">95% Lower Fees</h3>
                    <p className="text-muted-foreground">TON blockchain provides significantly lower transaction fees compared to Ethereum, saving you up to 95% on vault operations.</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 border border-purple-500/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 mr-4">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Military-Grade Security</h3>
                    <p className="text-muted-foreground">Four security levels from Standard to our patent-pending Fortress™ level with quantum-resistant encryption.</p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 border border-cyan-500/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 mr-4">
                    <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Multi-Signature Protection</h3>
                    <p className="text-muted-foreground">Enhanced security with multi-signature vaults requiring approval from up to 16 authorized participants.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">3.2s</div>
                    <div className="text-sm text-muted-foreground">Average TON transaction confirmation</div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">16+</div>
                    <div className="text-sm text-muted-foreground">Specialized vault types</div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Fee discount with CVT staking</div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-cyan-400 to-cyan-600"></div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Security monitoring</div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-pink-400 to-pink-600"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Vault Types Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Specialized Vault Types</h2>
            <p className="text-muted-foreground">
              Choose from 16 specialized vault types designed for different needs and security requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VaultCard
              title="Time-Lock Memory Capsule"
              description="Create digital time capsules with multimedia content for future generations or personal milestones"
              chain="ton"
              securityLevel="Enhanced"
              primaryAction={() => setLocation("/specialized-vault-memory")}
              secondaryAction={() => setLocation("/specialized-vault-memory-documentation")}
              primaryActionLabel="Create Vault"
              secondaryActionLabel="Learn More"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3H4.2C3.54 3 3 3.54 3 4.2V19.8C3 20.46 3.54 21 4.2 21H19.8C20.46 21 21 20.46 21 19.8V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            
            <VaultCard
              title="Multi-Signature Vault"
              description="Enhanced security with required approvals from multiple authorized participants"
              chain="ton"
              securityLevel="Maximum"
              primaryAction={() => setLocation("/multi-signature-vault")}
              secondaryAction={() => setLocation("/multi-signature-vault-doc")}
              primaryActionLabel="Create Vault"
              secondaryActionLabel="Learn More"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 11H7C5.89543 11 5 11.8954 5 13V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V13C19 11.8954 18.1046 11 17 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 11V7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
            
            <VaultCard
              title="Cross-Chain Vault"
              description="Ultimate security with assets verified and secured across multiple blockchains"
              chain="multiple"
              securityLevel="Fortress™"
              primaryAction={() => setLocation("/cross-chain-vault")}
              secondaryAction={() => setLocation("/cross-chain-security")}
              primaryActionLabel="Create Vault"
              secondaryActionLabel="Learn More"
              icon={
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.6 9H20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.6 15H20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.5 3C9.29087 7.28637 8.15674 12.1334 8.15674 17C8.15674 18.3394 8.25389 19.6695 8.4472 20.988" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.5 3C14.7091 7.28637 15.8433 12.1334 15.8433 17C15.8433 18.3394 15.7461 19.6695 15.5528 20.988" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/vault-types-selector")} 
              className="inline-flex items-center"
            >
              Explore All Vault Types
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Bitcoin Halving Special */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <BitcoinHalvingVault />
        </div>
      </section>

      {/* CVT Token Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 mb-6 text-sm font-medium rounded-full bg-blue-500/10 text-blue-500">
                <Coins className="w-4 h-4 mr-2" />
                <span>Utility Token</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-6">CVT Token Benefits</h2>
              
              <p className="text-muted-foreground mb-6">
                Chronos Vault Token (CVT) provides significant benefits for holders, including fee discounts, 
                enhanced security features, and governance rights.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Tiered Fee Discounts</h4>
                    <p className="text-sm text-muted-foreground">Stake CVT tokens for up to 100% off all platform fees</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Enhanced Security Options</h4>
                    <p className="text-sm text-muted-foreground">Unlock premium security features with CVT staking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium">Governance Rights</h4>
                    <p className="text-sm text-muted-foreground">Vote on platform proposals and future development</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setLocation("/cvt-staking")} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  Stake CVT Tokens
                </Button>
                <Button onClick={() => setLocation("/cvt-utility")} variant="outline">
                  Learn More About CVT
                </Button>
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="text-xl font-semibold mb-6">CVT Staking Tiers</h3>
              
              <div className="space-y-6">
                {/* Vault Guardian Tier */}
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Vault Guardian</h4>
                        <p className="text-xs text-muted-foreground">1,000+ CVT staked</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-500">75%</span>
                      <p className="text-xs text-muted-foreground">Fee Discount</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Basic security enhancements and substantial fee reduction</p>
                </div>
                
                {/* Vault Architect Tier */}
                <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Vault Architect</h4>
                        <p className="text-xs text-muted-foreground">10,000+ CVT staked</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-purple-500">90%</span>
                      <p className="text-xs text-muted-foreground">Fee Discount</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Advanced security features and voting weight multiplier</p>
                </div>
                
                {/* Vault Sovereign Tier */}
                <div className="rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium">Vault Sovereign</h4>
                        <p className="text-xs text-muted-foreground">100,000+ CVT staked</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-amber-500">100%</span>
                      <p className="text-xs text-muted-foreground">Fee Discount</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Exclusive Fortress™ security tier and maximum governance power</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Your CVT Balance</h4>
                    <p className="text-sm text-muted-foreground">Current holdings and staking status</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{tokenBalance ? tokenBalance.toLocaleString() : '0'}</span>
                    <p className="text-sm text-muted-foreground">CVT Tokens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Digital Legacy?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            Start creating your secure time-locked vaults with military-grade encryption and the power of TON blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setLocation("/create-vault")} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Create Your First Vault
            </Button>
            <Button onClick={() => setLocation("/about")} variant="outline" size="lg">
              Learn More About Chronos Vault
            </Button>
          </div>
        </div>
      </section>

      {/* Sample Vault Preview */}
      <section className="py-10">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Your Active Vaults</h2>
            <Button variant="ghost" onClick={() => setLocation("/my-vaults")} className="inline-flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <Card className="border-border/50 hover:border-border transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 mr-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {sampleVault.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{sampleVault.name}</h3>
                      <p className="text-sm text-muted-foreground">{sampleVault.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Unlock Date</p>
                      <p className="font-medium">{sampleVault.unlockDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Security Level</p>
                      <p className="font-medium">{sampleVault.securityLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Blockchain</p>
                      <p className="font-medium capitalize">{sampleVault.chain}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vault Type</p>
                      <p className="font-medium">{sampleVault.vaultType}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {sampleVault.beneficiaries.map((beneficiary) => (
                      <div key={beneficiary.id} className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm">
                        <span className="mr-1 h-2 w-2 rounded-full bg-blue-500"></span>
                        {beneficiary.name}
                        <span className="ml-1 text-muted-foreground">({beneficiary.relationship})</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">${sampleVault.totalValue.toLocaleString()}</p>
                  </div>
                  
                  <Separator className="lg:hidden" />
                  
                  <div className="flex gap-3">
                    <Button onClick={() => setLocation(`/vault-details/${sampleVault.id}`)} variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button onClick={() => setLocation(`/vault-explorer/${sampleVault.id}`)} size="sm">
                      Manage Assets
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;