import React from 'react';
import TestDashboard from '@/components/security/TestDashboard';
import CrossChainSecurityDashboard from '@/components/security/NewSecurityDashboard';
import { StaticAISecurityDashboard } from '@/components/security/StaticAISecurityDashboard';
import ContractDeploymentPanel from '@/components/security/ContractDeploymentPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function SecurityTestingPage() {
  const [location] = useLocation();
  
  // Extract vault ID from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const vaultId = params.get('vaultId') || undefined;
  
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <PageHeader 
            heading="Chronos Vault Security Testing Environment" 
            description="Monitor and verify real-time security status across multiple blockchains"
            separator
          />
          
          <div className="mt-8">
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="w-full max-w-4xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="dashboard" className="text-xs md:text-sm px-1 py-1.5 md:px-3 md:py-2">Security Dashboard</TabsTrigger>
                <TabsTrigger value="ai-security" className="text-xs md:text-sm px-1 py-1.5 md:px-3 md:py-2">AI Enhanced Security</TabsTrigger>
                <TabsTrigger value="testing" className="text-xs md:text-sm px-1 py-1.5 md:px-3 md:py-2">Test Environment</TabsTrigger>
                <TabsTrigger value="contracts" className="text-xs md:text-sm px-1 py-1.5 md:px-3 md:py-2">Contract Deployment</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <CrossChainSecurityDashboard vaultId={vaultId} />
              </TabsContent>
              <TabsContent value="ai-security">
                <StaticAISecurityDashboard vaultId={vaultId} />
              </TabsContent>
              <TabsContent value="testing">
                <TestDashboard />
              </TabsContent>
              <TabsContent value="contracts">
                <ContractDeploymentPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}