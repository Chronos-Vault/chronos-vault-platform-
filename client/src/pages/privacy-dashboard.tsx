import React from 'react';
import { PageHeader } from '@/components/page-header';
import { Layout } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecurePrivacyPanel } from '@/components/privacy/SecurePrivacyPanel';
import { PrivacyDashboard } from '@/components/privacy/PrivacyDashboard';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';

export default function PrivacyDashboardPage() {
  return (
    <Layout>
      <div className="container px-4 py-6 lg:py-8">
        <PageHeader 
          heading="Zero-Knowledge Privacy Dashboard" 
          description="Generate and verify privacy-preserving proofs with cross-chain security integration"
          separator
        />
        
        <div className="mt-8">
          <Tabs defaultValue="secure-privacy">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
              <TabsTrigger value="secure-privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Secure Privacy
              </TabsTrigger>
              <TabsTrigger value="proof-generation" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Generate Proofs
              </TabsTrigger>
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Verify Proofs
              </TabsTrigger>
              <TabsTrigger value="disclosure" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Selective Disclosure
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="secure-privacy" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <SecurePrivacyPanel />
                </div>
                <div className="lg:col-span-5">
                  <div className="bg-[#6B00D7]/5 border border-[#6B00D7]/10 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">About Secure Privacy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The Secure Privacy feature combines our Zero-Knowledge Privacy Layer with the 
                      Triple-Chain Security architecture to provide cryptographic proofs with 
                      cross-chain verification.
                    </p>
                    <h4 className="font-medium text-sm mt-4 mb-2">Security Levels:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-[#6B00D7]/10 text-[#6B00D7] font-medium py-0.5 px-2 rounded text-xs">Level 1</span>
                        <span>Basic - Single chain verification on Ethereum</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-[#9242FC]/10 text-[#9242FC] font-medium py-0.5 px-2 rounded text-xs">Level 2</span>
                        <span>Standard - Dual chain verification across Ethereum and Solana</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-[#FF5AF7]/10 text-[#FF5AF7] font-medium py-0.5 px-2 rounded text-xs">Level 3</span>
                        <span>Advanced - Triple chain verification with anomaly detection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-[#FF5AF7]/10 text-[#FF5AF7] font-medium py-0.5 px-2 rounded text-xs">Level 4+</span>
                        <span>Enterprise/Maximum - Triple chain with advanced security features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="proof-generation" className="mt-6">
              <PrivacyDashboard activeTab="generate" />
            </TabsContent>
            
            <TabsContent value="verification" className="mt-6">
              <PrivacyDashboard activeTab="verify" />
            </TabsContent>
            
            <TabsContent value="disclosure" className="mt-6">
              <PrivacyDashboard activeTab="selective" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}