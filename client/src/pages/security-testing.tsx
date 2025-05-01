import React from 'react';
import TestDashboard from '@/components/security/TestDashboard';
import CrossChainSecurityDashboard from '@/components/security/NewSecurityDashboard';
import { StaticAISecurityDashboard } from '@/components/security/StaticAISecurityDashboard';
import ContractDeploymentPanel from '@/components/security/ContractDeploymentPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import TestnetBadge from '@/components/blockchain/TestnetBadge';
import NetworkSelector from '@/components/blockchain/NetworkSelector';
import TestTransactionPanel from '@/components/testing/TestTransactionPanel';
import TestContractDeployment from '@/components/testing/TestContractDeployment';
import ContractVerification from '@/components/testing/ContractVerification';

export default function SecurityTestingPage() {
  const [location] = useLocation();
  
  // Extract vault ID from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const vaultId = params.get('vaultId') || undefined;
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#121212] to-[#1A1A1A] text-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="text-center my-8 space-y-3 relative">
            {/* Decorative elements */}
            <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-[#6B00D7]/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 -right-40 w-80 h-80 rounded-full bg-[#FF5AF7]/10 blur-[100px] pointer-events-none"></div>
            
            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-2 relative z-10">
              Chronos Vault Security Hub
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto relative z-10">
              Monitor and verify real-time security status across multiple blockchains
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 items-center my-6 relative z-10">
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">Triple-Chain Security</span>
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">Real-time Monitoring</span>
              <span className="px-4 py-1.5 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/20 border border-[#6B00D7]/40 rounded-full text-[#FF5AF7] text-sm font-medium backdrop-blur-sm">Cross-Chain Verification</span>
            </div>
            
            {/* Testnet Network Information */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 mb-2 relative z-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5 border border-[#6B00D7]/20 rounded-lg backdrop-blur-sm">
                <TestnetBadge chain={BlockchainType.ETHEREUM} showName={true} />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5 border border-[#6B00D7]/20 rounded-lg backdrop-blur-sm">
                <TestnetBadge chain={BlockchainType.SOLANA} showName={true} />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5 border border-[#6B00D7]/20 rounded-lg backdrop-blur-sm">
                <TestnetBadge chain={BlockchainType.TON} showName={true} />
              </div>
            </div>
          </div>
          
          <div className="mt-8 relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 right-0 w-72 h-72 rounded-full bg-[#6B00D7]/5 blur-[100px] pointer-events-none"></div>
            
            <Tabs defaultValue="dashboard" className="w-full relative z-10">
              <TabsList className="w-full max-w-4xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 bg-[#1A1A1A]/50 border border-[#6B00D7]/20 p-1.5 backdrop-blur-sm">
                <TabsTrigger 
                  value="dashboard" 
                  className="text-xs md:text-sm px-1 py-2 md:px-3 md:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
                >
                  Security Dashboard
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-security" 
                  className="text-xs md:text-sm px-1 py-2 md:px-3 md:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
                >
                  AI Enhanced Security
                </TabsTrigger>
                <TabsTrigger 
                  value="testing" 
                  className="text-xs md:text-sm px-1 py-2 md:px-3 md:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
                >
                  Test Environment
                </TabsTrigger>
                <TabsTrigger 
                  value="contracts" 
                  className="text-xs md:text-sm px-1 py-2 md:px-3 md:py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
                >
                  Contract Deployment
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <CrossChainSecurityDashboard vaultId={vaultId} />
              </TabsContent>
              <TabsContent value="ai-security">
                <StaticAISecurityDashboard vaultId={vaultId} />
              </TabsContent>
              <TabsContent value="testing">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <TestTransactionPanel className="h-full" />
                  <TestContractDeployment className="h-full" />
                </div>
                <TestDashboard />
              </TabsContent>
              <TabsContent value="contracts">
                <div className="mb-4 bg-gradient-to-r from-[#6B00D7]/10 to-[#6B00D7]/5 border border-[#6B00D7]/20 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-2 text-white">Testnet Development Environment</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    All contract deployments and transactions will execute on the selected testnet network.
                    Switch networks using the selector below if needed.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-white">Ethereum Network:</span>
                      <NetworkSelector chain={BlockchainType.ETHEREUM} />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-white">Solana Network:</span>
                      <div className="text-yellow-300 bg-yellow-900/30 text-xs px-2 py-1 rounded">
                        Connected to Devnet (fixed for testing)
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-sm font-medium text-white">TON Network:</span>
                      <div className="text-yellow-300 bg-yellow-900/30 text-xs px-2 py-1 rounded">
                        Connected to Testnet (fixed for testing)
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <ContractDeploymentPanel className="h-full" />
                  <ContractVerification className="h-full" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}