import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DocumentationLayout from "@/components/layout/DocumentationLayout";
import { 
  Shield, 
  Lock, 
  Clock, 
  Layers, 
  Cpu,
  BarChart, 
  Users,
  Map,
  Building,
  Brain,
  TrendingUp,
  FileText,
  MoveRight,
  Workflow,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Key,
  AlertTriangle,
  BookOpen
} from "lucide-react";

const HowItWorksPage = () => {
  return (
    <DocumentationLayout 
      title="How Chronos Vault Works" 
      description="Discover the technology behind our revolutionary secure digital vaults"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-4">How Chronos Vault Works</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the revolutionary technology behind our secure digital vaults and how it protects your assets
            </p>
          </div>
          
          {/* Simple Explanation Section */}
          <section className="mb-12 bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-[#333] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-2xl font-bold text-white">What is Chronos Vault? (Simple Version)</h2>
            </div>
            
            <div className="pl-11 space-y-6">
              <div className="bg-[#222] border border-[#333] rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Key className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  A Super-Secure Digital Safe
                </h3>
                <p className="text-gray-300">
                  Think of Chronos Vault as a digital safe for your valuable digital items (like cryptocurrency, tokens, NFTs). 
                  But unlike regular safes that can be broken into, ours uses multiple locks across different systems to keep your things extra secure.
                </p>
              </div>
              
              <div className="bg-[#222] border border-[#333] rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <Lock className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Why It's Better Than Other Solutions
                </h3>
                <p className="text-gray-300">
                  Most digital wallets use just one lock system. If someone figures out how to break that lock, all your valuables are gone. 
                  Our vault uses three separate lock systems at once (called "Triple-Chain Security"). This means that even if one lock gets 
                  compromised, your valuables stay safe behind the other two locks.
                </p>
              </div>
              
              <div className="bg-[#222] border border-[#333] rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  What You Can Do With It
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-[#FF5AF7] mt-1 flex-shrink-0" />
                    <span>Store your digital assets safely for as long as you want</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-[#FF5AF7] mt-1 flex-shrink-0" />
                    <span>Set timers to release assets on specific dates (great for gifts or savings plans)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-[#FF5AF7] mt-1 flex-shrink-0" />
                    <span>Require multiple people to approve before assets can be accessed (like a joint bank account)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 text-[#FF5AF7] mt-1 flex-shrink-0" />
                    <span>Earn interest on your stored digital assets while keeping them secure</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#222] border border-[#333] rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Why This Matters
                </h3>
                <p className="text-gray-300">
                  Digital theft is becoming more common every day. By using multiple security systems at once, Chronos Vault
                  makes it nearly impossible for hackers to steal your assets. Our approach is 400 times more secure than
                  traditional single-chain solutions.
                </p>
              </div>
            </div>
            
            <div className="mt-6 pl-11">
              <Button asChild variant="outline" className="bg-[#222] border-[#333] hover:bg-[#2a2a2a]">
                <Link href="#getting-started">
                  <BookOpen className="mr-2 h-4 w-4" /> Continue Reading For More Details
                </Link>
              </Button>
            </div>
          </section>
        
          {/* Triple-Chain Security Section */}
          <section id="getting-started" className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-3xl font-bold text-white">Triple-Chain Security™: The Foundation</h2>
            </div>
            <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl mb-8">
              <CardContent className="pt-6">
                <p className="text-gray-300 mb-6">
                  At the core of Chronos Vault is our revolutionary Triple-Chain Security™ technology that distributes 
                  your protection across TON, Ethereum, and Solana simultaneously.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">How It Works:</h3>
                <ol className="space-y-4 text-gray-300 mb-6">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-semibold">1</div>
                    <div>
                      <p>When you create a vault, our system fragments your security credentials across three separate blockchains</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-semibold">2</div>
                    <div>
                      <p>Each blockchain holds only a portion of the access keys, making it impossible for attackers to compromise your assets by targeting a single chain</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-semibold">3</div>
                    <div>
                      <p>To access your vault, our system verifies authorization across all three chains simultaneously</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#6B00D7] flex items-center justify-center text-white font-semibold">4</div>
                    <div>
                      <p>Even if one blockchain experiences issues, your assets remain secure through the other two chains</p>
                    </div>
                  </li>
                </ol>
                
                <div className="py-4 px-6 bg-[#111] rounded-lg border border-[#333]">
                  <p className="font-semibold text-[#FF5AF7]">Result:</p>
                  <p className="text-white">Protection that's 400x more resistant to exploits than traditional single-chain solutions.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-[#333] flex justify-center pt-4">
                <Button asChild variant="outline" className="w-auto">
                  <Link href="/triple-chain-security">Learn More About Triple-Chain Security <MoveRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              </CardFooter>
            </Card>
          </section>
          
          {/* Specialized Vault Types Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Layers className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-3xl font-bold text-white">Our 22 Specialized Vault Types</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Every digital asset need is unique. That's why we've created 22 different vault types, each optimized for specific purposes:
            </p>
            
            <Tabs defaultValue="personal" className="mb-8">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal" className="data-[state=active]:bg-[#6B00D7]">
                  <Users className="w-4 h-4 mr-2" /> Personal
                </TabsTrigger>
                <TabsTrigger value="investment" className="data-[state=active]:bg-[#6B00D7]">
                  <TrendingUp className="w-4 h-4 mr-2" /> Investment
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-[#6B00D7]">
                  <Brain className="w-4 h-4 mr-2" /> AI-Powered
                </TabsTrigger>
                <TabsTrigger value="business" className="data-[state=active]:bg-[#6B00D7]">
                  <Building className="w-4 h-4 mr-2" /> Business
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Clock className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Time-Lock Vaults</CardTitle>
                      <CardDescription>Set specific future dates when assets become accessible</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Perfect for saving for specific goals or creating gifts that unlock on special occasions.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/time-locked-memory-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Users className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Multi-Signature Vaults</CardTitle>
                      <CardDescription>Require approval from multiple trusted parties</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Ensures assets can only be accessed when multiple authorized parties provide consent.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/multi-signature-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Map className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Geo-Location Vaults</CardTitle>
                      <CardDescription>Add physical location verification for maximum security</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Requires presence at specific physical locations to access assets, adding a powerful layer of security.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/geo-location-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="investment">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <BarChart className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Yield Optimization Vaults</CardTitle>
                      <CardDescription>Generate returns while maintaining Triple-Chain Security™</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Put your digital assets to work without compromising on security.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/investment-discipline-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Layers className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>DeFi Strategy Vaults</CardTitle>
                      <CardDescription>Connect to verified protocols across multiple chains</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Access the best DeFi opportunities across the blockchain ecosystem with built-in security.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/ai-assisted-investment-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Shield className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Risk-Adjusted Vaults</CardTitle>
                      <CardDescription>Set your risk tolerance and investment goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Customize investment parameters based on your personal risk profile and financial goals.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/milestone-based-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="ai">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Shield className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Adaptive Security Vaults</CardTitle>
                      <CardDescription>Automatically adjust protection based on threat analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        AI-powered security that evolves in response to emerging threats.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/dynamic-security-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Cpu className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Predictive Protection Vaults</CardTitle>
                      <CardDescription>Identify and mitigate potential vulnerabilities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Anticipate security challenges before they occur using advanced machine learning.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/quantum-resistant-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <BarChart className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Market-Responsive Vaults</CardTitle>
                      <CardDescription>Optimize asset allocation based on market conditions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        AI analyzes market data to adjust portfolio composition for optimal performance.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/ai-intent-inheritance-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="business">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Building className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Treasury Management Vaults</CardTitle>
                      <CardDescription>Secure corporate assets with advanced governance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Enterprise-grade solutions for managing company treasuries with multi-level approvals.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/sovereign-fortress-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <Users className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Team Access Vaults</CardTitle>
                      <CardDescription>Provide controlled access to multiple team members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Granular permission systems for teams with customizable access controls.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/family-heritage-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-[#1A1A1A] border border-[#333]">
                    <CardHeader>
                      <FileText className="w-6 h-6 text-[#FF5AF7] mb-2" />
                      <CardTitle>Compliance-Optimized Vaults</CardTitle>
                      <CardDescription>Built-in regulatory reporting and audit trails</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-400">
                        Meet regulatory requirements with automatic record-keeping and reporting capabilities.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="outline" className="w-full" size="sm">
                        <Link href="/documentation/cross-chain-fragment-vault">Learn More</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-center">
              <Button asChild className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <Link href="/vault-types">Explore All 22 Vault Types</Link>
              </Button>
            </div>
          </section>
          
          {/* Creating Your First Vault Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Workflow className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-3xl font-bold text-white">Creating Your First Vault</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Getting started with Chronos Vault is simple:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-4">
                  <Layers className="w-8 h-8 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Choose Your Vault Type</h3>
                <p className="text-gray-400">
                  Select from our 22 specialized vault options based on your specific needs
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Set Your Parameters</h3>
                <p className="text-gray-400">
                  Configure security settings, time-locks, or investment strategies according to your preferences
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Deposit Assets</h3>
                <p className="text-gray-400">
                  Transfer your digital assets into your new vault securely and easily
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-4">
                  <BarChart className="w-8 h-8 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">4. Manage & Monitor</h3>
                <p className="text-gray-400">
                  Track performance and security through our intuitive dashboard
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button asChild className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <Link href="/vault-types">Create Your First Vault</Link>
              </Button>
            </div>
          </section>
          
          {/* Technology Behind Your Security Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-3xl font-bold text-white">The Technology Behind Your Security</h2>
            </div>
            <p className="text-gray-300 mb-6">
              Chronos Vault combines multiple innovations to deliver unmatched protection:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-[#1A1A1A] border border-[#333]">
                <CardHeader>
                  <Layers className="w-6 h-6 text-[#FF5AF7] mb-2" />
                  <CardTitle>Cross-Chain Fragmentation Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Distributes security across multiple blockchains, ensuring no single point of failure exists
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A] border border-[#333]">
                <CardHeader>
                  <Lock className="w-6 h-6 text-[#FF5AF7] mb-2" />
                  <CardTitle>Zero-Knowledge Privacy Shield</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Ensures your asset details remain private while still verifying security parameters
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A] border border-[#333]">
                <CardHeader>
                  <Clock className="w-6 h-6 text-[#FF5AF7] mb-2" />
                  <CardTitle>Time-Lock Mechanisms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Mathematically guaranteed future access without backdoors or override capabilities
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1A1A] border border-[#333]">
                <CardHeader>
                  <Brain className="w-6 h-6 text-[#FF5AF7] mb-2" />
                  <CardTitle>AI Security Layer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Continuous monitoring and adaptation to emerging threats using artificial intelligence
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Why Users Trust Chronos Vault Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle className="w-8 h-8 text-[#FF5AF7]" />
              <h2 className="text-3xl font-bold text-white">Why Users Trust Chronos Vault</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Uncompromising Security
                </h3>
                <p className="text-gray-300">
                  Protection across three blockchains simultaneously, making your vaults 400x more secure than traditional solutions
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Future-Proof Design
                </h3>
                <p className="text-gray-300">
                  Time-lock capabilities with mathematical guarantees that cannot be overridden, even by us
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Growth Potential
                </h3>
                <p className="text-gray-300">
                  Investment solutions that maintain security while generating returns across multiple blockchains
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Brain className="w-5 h-5 text-[#FF5AF7] mr-2" />
                  Intelligent Protection
                </h3>
                <p className="text-gray-300">
                  AI-powered systems that adapt to changing conditions and emerging security threats
                </p>
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-xl p-8 border border-[#6B00D7]/30 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Experience the future of digital asset security and management today
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of users who trust Chronos Vault to protect their most valuable digital assets with our revolutionary technology
            </p>
            <div className="flex justify-center gap-4 flex-wrap mb-10">
              <Button asChild className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                <Link href="/vault-types">Create Your First Vault</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/api-documentation">Developer Documentation</Link>
              </Button>
            </div>
            
            {/* Common Questions Section */}
            <div className="mt-20 pt-4 border-t border-[#333]">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="w-8 h-8 text-[#FF5AF7]" />
                <h2 className="text-3xl font-bold text-white">Common Questions</h2>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-[#222]">
                    <CardTitle className="text-xl">Do I need to understand blockchain to use Chronos Vault?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-300">
                      <strong>Not at all!</strong> We've designed Chronos Vault to be user-friendly for everyone. Our platform handles all the complex 
                      technical aspects behind the scenes. You'll find a simple, intuitive interface that guides you through each step.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-[#222]">
                    <CardTitle className="text-xl">What are digital assets and why should I secure them?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-300">
                      Digital assets are valuable items that exist in digital form, like cryptocurrencies (Bitcoin, Ethereum), NFTs (digital art), or tokens 
                      that represent ownership of something. These assets have real value and need protection from theft just like physical valuables. Our vaults 
                      provide that protection with industry-leading security features.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-[#222]">
                    <CardTitle className="text-xl">What makes Triple-Chain Security™ better than other solutions?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-300">
                      Think of it like this: Most security systems use one lock. If someone breaks that lock, they get all your valuables. 
                      Our Triple-Chain Security™ uses three completely different lock systems at once (on Ethereum, TON, and Solana). Even if 
                      someone breaks one lock, they still can't access your assets because the other two locks are still intact. This makes our 
                      security 400x more resistant to attacks than standard solutions.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-[#222]">
                    <CardTitle className="text-xl">How much does it cost to use Chronos Vault?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-300">
                      Chronos Vault offers both free and premium tiers. Basic personal vaults are always free to use. Premium features, 
                      additional vault types, and advanced security options are available with our subscription plans or by using CVT tokens, 
                      which provide discounts on all paid services.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border border-[#333] shadow-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-[#222]">
                    <CardTitle className="text-xl">What happens if I forget my access information?</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-300">
                      We offer secure recovery options, including social recovery (trusted friends or family members can help you regain access) 
                      and our advanced behavioral authentication system that can verify your identity through normal usage patterns. You'll never 
                      be permanently locked out of your vaults.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DocumentationLayout>
  );
};

export default HowItWorksPage;