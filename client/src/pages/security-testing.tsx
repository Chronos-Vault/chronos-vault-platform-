import React from 'react';
import TestDashboard from '@/components/security/TestDashboard';
import CrossChainSecurityDashboard from '@/components/security/CrossChainSecurityDashboard';
import { StaticAISecurityDashboard } from '@/components/security/StaticAISecurityDashboard';
import ContractDeploymentPanel from '@/components/security/ContractDeploymentPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';
import { Layout } from '@/components/layout';
import { PageHeader } from '@/components/page-header';

export default function SecurityTestingPage() {
  const [location] = useLocation();
  
  // Extract vault ID from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const vaultId = params.get('vaultId') || undefined;
  
  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <PageHeader 
          heading="Chronos Vault Security Testing Environment" 
          description="Monitor and verify real-time security status across multiple blockchains"
          separator
        />
        
        <div className="mt-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="w-full max-w-4xl mx-auto mb-6 grid grid-cols-4">
              <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
              <TabsTrigger value="ai-security">AI Enhanced Security</TabsTrigger>
              <TabsTrigger value="testing">Test Environment</TabsTrigger>
              <TabsTrigger value="contracts">Contract Deployment</TabsTrigger>
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
    </Layout>
  );
}