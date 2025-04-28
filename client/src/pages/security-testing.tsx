import React from 'react';
import { TestDashboard } from '@/components/security/TestDashboard';
import { CrossChainSecurityDashboard } from '@/components/security/CrossChainSecurityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'wouter';

export default function SecurityTestingPage() {
  const [location] = useLocation();
  
  // Extract vault ID from URL if available
  const params = new URLSearchParams(location.split('?')[1]);
  const vaultId = params.get('vaultId') || undefined;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
        Chronos Vault Security Testing Environment
      </h1>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6 grid grid-cols-2">
          <TabsTrigger value="dashboard">Security Dashboard</TabsTrigger>
          <TabsTrigger value="testing">Test Environment</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <CrossChainSecurityDashboard vaultId={vaultId} />
        </TabsContent>
        <TabsContent value="testing">
          <TestDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}