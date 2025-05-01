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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-purple-50 to-gray-100">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="text-center my-8 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 mb-2">
              Chronos Vault Security Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Monitor and verify real-time security status across multiple blockchains
            </p>
          </div>
          
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