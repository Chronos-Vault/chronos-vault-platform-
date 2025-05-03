import React from 'react';
// Header is now provided by the Layout component
import Footer from '@/components/layout/footer';
import CrossChainValidationDemo from '@/components/security/CrossChainValidationDemo';
import CrossChainSecurityDashboard from '@/components/security/NewSecurityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Server, Network, Lock, ArrowRight, Shield, RefreshCw, History } from 'lucide-react';

export default function CrossChainSecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D1F]">
      {/* Header is now provided by the Layout component */}
      
      <main className="flex-grow container mx-auto px-4 py-10 max-w-7xl">
        <div className="space-y-12">
          {/* Hero section */}
          <div className="text-center my-12 space-y-5 relative">
            <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full -z-10"></div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
              Triple-Chain Security Architecture
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Experience revolutionary protection with our Triple-Chain Security Architecture,
              leveraging the strengths of Ethereum, Solana, and TON blockchains.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button className="bg-gradient-to-r from-[#6B00D7] to-[#9747FF] text-white hover:opacity-90 transition-all px-6">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="text-white border-[#444] hover:bg-[#222] hover:text-white">
                View Documentation
              </Button>
            </div>
          </div>
          
          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-[#2A2A42] bg-[#14141F]/60 backdrop-blur-xl hover:border-[#6B00D7]/50 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6B00D7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B00D7] to-[#8C00FF] flex items-center justify-center mb-4 shadow-lg shadow-[#6B00D7]/20">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-medium">Enhanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light leading-relaxed">
                  Each blockchain has a specialized security role, requiring at least 2 chains to validate any transaction, making it significantly more secure than single-chain solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-[#2A2A42] bg-[#14141F]/60 backdrop-blur-xl hover:border-[#FF5AF7]/50 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5AF7]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF5AF7] to-[#FF47C2] flex items-center justify-center mb-4 shadow-lg shadow-[#FF5AF7]/20">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-medium">Specialized Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light leading-relaxed">
                  Ethereum provides primary security and ownership records, Solana delivers high-speed transaction monitoring, while TON ensures backup and recovery mechanisms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-[#2A2A42] bg-[#14141F]/60 backdrop-blur-xl hover:border-[#9747FF]/50 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9747FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="pb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#7C3AED] flex items-center justify-center mb-4 shadow-lg shadow-[#9747FF]/20">
                  <Network className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-medium">Cross-Chain Consensus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 font-light leading-relaxed">
                  Transactions require confirmation across multiple chains, eliminating single points of failure and providing true decentralized security.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#3A3A60] to-transparent"></div>
          
          {/* Demo section */}
          <div className="space-y-6 relative">
            <div className="absolute inset-0 blur-3xl opacity-10 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full -z-10 transform translate-y-1/2"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Experience Cross-Chain Security</h2>
            <p className="text-center text-gray-400 max-w-3xl mx-auto mb-8 font-light">
              Try our Triple-Chain Security validation system and monitor the status of our cross-chain architecture in real-time.
            </p>
            
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full max-w-full sm:max-w-md mx-auto grid-cols-2 bg-[#14141F] border border-[#2A2A42]">
                <TabsTrigger value="demo" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white text-gray-400 hover:text-white transition-colors">Validation Demo</TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white text-gray-400 hover:text-white transition-colors">Security Dashboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="py-6 mt-4">
                <CrossChainValidationDemo />
              </TabsContent>
              
              <TabsContent value="dashboard" className="py-6 mt-4">
                <CrossChainSecurityDashboard />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="my-16 h-px w-full bg-gradient-to-r from-transparent via-[#3A3A60] to-transparent"></div>
          
          {/* Technical explanation */}
          <div className="bg-[#14141F]/80 backdrop-blur-xl border border-[#2A2A42] shadow-2xl rounded-2xl p-8 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#6B00D7] opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#FF5AF7] opacity-20 blur-3xl"></div>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
              <div className="p-2 bg-[#6B00D7]/20 rounded-lg">
                <Lock className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              How Triple-Chain Security Works
            </h2>
            
            <div className="space-y-5 text-gray-300 font-light">
              <p>
                Our Triple-Chain Security architecture represents a significant advancement over traditional
                blockchain security models. Instead of relying on a single chain's consensus mechanism,
                we distribute security responsibilities across three major blockchains:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <div className="p-5 bg-[#1C1C2E] rounded-xl border border-[#2A2A42] transition-all duration-300 hover:border-[#5D5FEF] group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#5D5FEF]/20 group-hover:bg-[#5D5FEF]/30 transition-colors">
                      <Shield className="h-5 w-5 text-[#5D5FEF]" />
                    </div>
                    <h3 className="font-semibold text-white">Ethereum</h3>
                  </div>
                  <p className="text-sm text-gray-400">Primary security layer responsible for ownership records and access control. Provides robust smart contract security and transaction finality.</p>
                </div>
                
                <div className="p-5 bg-[#1C1C2E] rounded-xl border border-[#2A2A42] transition-all duration-300 hover:border-[#FF5AF7] group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#FF5AF7]/20 group-hover:bg-[#FF5AF7]/30 transition-colors">
                      <RefreshCw className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <h3 className="font-semibold text-white">Solana</h3>
                  </div>
                  <p className="text-sm text-gray-400">Speed verification layer that monitors transactions with high throughput and low latency, enabling rapid detection of suspicious activities.</p>
                </div>
                
                <div className="p-5 bg-[#1C1C2E] rounded-xl border border-[#2A2A42] transition-all duration-300 hover:border-[#6B00D7] group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-[#6B00D7]/20 group-hover:bg-[#6B00D7]/30 transition-colors">
                      <History className="h-5 w-5 text-[#6B00D7]" />
                    </div>
                    <h3 className="font-semibold text-white">TON</h3>
                  </div>
                  <p className="text-sm text-gray-400">Backup and recovery layer that maintains state redundancy and provides emergency recovery mechanisms if other chains are compromised.</p>
                </div>
              </div>
              
              <p>
                When a transaction is initiated, it must be validated by at least two chains to achieve consensus.
                This multi-chain validation approach creates a security system that is significantly more
                robust than traditional single-chain solutions, as it would require compromising multiple
                different blockchain architectures simultaneously to breach security.
              </p>
              
              <p>
                The system continuously monitors the status of all three chains, ensuring cross-chain
                consistency and automatically detecting any anomalies or security incidents. In the event
                of a security concern on one chain, the other two chains can maintain security and enable
                recovery operations.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer className="text-gray-400" />
    </div>
  );
}
