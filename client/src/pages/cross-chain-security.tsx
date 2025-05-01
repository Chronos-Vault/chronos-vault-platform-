import React from 'react';
// Header is now provided by the Layout component
import Footer from '@/components/layout/footer';
import CrossChainValidationDemo from '@/components/security/CrossChainValidationDemo';
import CrossChainSecurityDashboard from '@/components/security/NewSecurityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Server, Network, Lock } from 'lucide-react';

export default function CrossChainSecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-purple-50 to-gray-100">
      {/* Header is now provided by the Layout component */}
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-8">
          {/* Hero section */}
          <div className="text-center my-8 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
              Triple-Chain Security Architecture
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience revolutionary protection with our Triple-Chain Security Architecture,
              leveraging the strengths of Ethereum, Solana, and TON blockchains.
            </p>
          </div>
          
          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Enhanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Each blockchain has a specialized security role, requiring at least 2 chains to validate any transaction, making it significantly more secure than single-chain solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-pink-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                  <Server className="h-6 w-6 text-pink-700" />
                </div>
                <CardTitle>Specialized Roles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ethereum provides primary security and ownership records, Solana delivers high-speed transaction monitoring, while TON ensures backup and recovery mechanisms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-indigo-200 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <Network className="h-6 w-6 text-indigo-700" />
                </div>
                <CardTitle>Cross-Chain Consensus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Transactions require confirmation across multiple chains, eliminating single points of failure and providing true decentralized security.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Separator className="my-8" />
          
          {/* Demo section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-center">Experience Cross-Chain Security</h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
              Try our Triple-Chain Security validation system and monitor the status of our cross-chain architecture in real-time.
            </p>
            
            <Tabs defaultValue="demo" className="w-full">
              <TabsList className="grid w-full max-w-full sm:max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="demo" className="px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base">Validation Demo</TabsTrigger>
                <TabsTrigger value="dashboard" className="px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base">Security Dashboard</TabsTrigger>
              </TabsList>
              
              <TabsContent value="demo" className="py-4">
                <CrossChainValidationDemo />
              </TabsContent>
              
              <TabsContent value="dashboard" className="py-4">
                <CrossChainSecurityDashboard />
              </TabsContent>
            </Tabs>
          </div>
          
          <Separator className="my-8" />
          
          {/* Technical explanation */}
          <div className="bg-white/80 backdrop-blur-sm shadow rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-700" />
              How Triple-Chain Security Works
            </h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Our Triple-Chain Security architecture represents a significant advancement over traditional
                blockchain security models. Instead of relying on a single chain's consensus mechanism,
                we distribute security responsibilities across three major blockchains:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Ethereum</h3>
                  <p className="text-sm">Primary security layer responsible for ownership records and access control. Provides robust smart contract security and transaction finality.</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <h3 className="font-semibold text-orange-800 mb-2">Solana</h3>
                  <p className="text-sm">Speed verification layer that monitors transactions with high throughput and low latency, enabling rapid detection of suspicious activities.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">TON</h3>
                  <p className="text-sm">Backup and recovery layer that maintains state redundancy and provides emergency recovery mechanisms if other chains are compromised.</p>
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
      
      <Footer />
    </div>
  );
}
