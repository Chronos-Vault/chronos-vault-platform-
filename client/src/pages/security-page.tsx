import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TripleChainExplainer from '@/components/security/TripleChainExplainer';
import SecurityFeatureCards from '@/components/security/SecurityFeatureCards';
import SecurityLevelSelector from '@/components/security/SecurityLevelSelector';

/**
 * Security Page for Chronos Vault
 * 
 * This page provides a comprehensive overview of the platform's advanced security features,
 * including the Triple-Chain Security Architecture, available security features, and
 * security level options.
 */
export default function SecurityPage() {
  // In a real implementation, these would come from your security API
  const currentSecurityLevel = 'enhanced' as const;
  const vaultId = 'v-12345';
  
  // Handle security level changes
  const handleSecurityLevelChange = (level: 'standard' | 'enhanced' | 'maximum') => {
    // In a real implementation, this would call an API to change the security level
    console.log(`Changing security level to: ${level}`);
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Chronos Vault Security</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Industry-leading protection for your digital assets
        </p>
      </header>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="features">Security Features</TabsTrigger>
          <TabsTrigger value="levels">Security Levels</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-12">
            {/* Hero section with key security stats */}
            <div className="bg-gradient-to-r from-purple-900/20 via-pink-700/20 to-purple-900/20 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Your Security Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/30 p-6 rounded-xl border border-purple-600">
                  <div className="text-4xl font-bold text-purple-400">Enhanced</div>
                  <div className="text-muted-foreground">Current Security Level</div>
                </div>
                
                <div className="bg-black/30 p-6 rounded-xl border border-purple-600">
                  <div className="text-4xl font-bold text-purple-400">92<span className="text-xl">/100</span></div>
                  <div className="text-muted-foreground">Security Health Score</div>
                </div>
                
                <div className="bg-black/30 p-6 rounded-xl border border-purple-600">
                  <div className="text-4xl font-bold text-purple-400">6<span className="text-xl">/8</span></div>
                  <div className="text-muted-foreground">Active Security Features</div>
                </div>
              </div>
            </div>
            
            {/* Triple-Chain Security Architecture Explainer */}
            <TripleChainExplainer />
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <SecurityFeatureCards />
        </TabsContent>
        
        <TabsContent value="levels" className="mt-6">
          <SecurityLevelSelector 
            currentLevel={currentSecurityLevel}
            vaultId={vaultId}
            onLevelSelect={handleSecurityLevelChange}
          />
        </TabsContent>
      </Tabs>
      
      {/* Security Trust Banner */}
      <div className="mt-12 p-6 bg-black/30 border border-purple-900 rounded-xl text-center">
        <h2 className="text-2xl font-bold mb-2">Military-Grade Security</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Chronos Vault implements zero-knowledge proofs, quantum-resistant encryption, and 
          triple-chain verification to provide unparalleled protection for your digital assets. 
          Our security architecture exceeds industry standards and is continuously monitored 24/7.
        </p>
      </div>
    </div>
  );
}
