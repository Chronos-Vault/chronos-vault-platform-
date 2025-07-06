/**
 * Privacy Dashboard
 * 
 * This component provides a comprehensive interface for managing and utilizing
 * the Zero-Knowledge Privacy Layer features in Chronos Vault.
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZeroKnowledgeProofForm } from './ZeroKnowledgeProofForm';
import { CrossChainProofVerification } from './CrossChainProofVerification';
import { SelectiveDisclosureForm } from './SelectiveDisclosureForm';
import { RangeProofGenerator } from './RangeProofGenerator';
import { ProofHistoryDisplay } from './ProofHistoryDisplay';
import { getPrivacyLayerService } from '@/lib/privacy';
import { ZkProof } from '@/lib/privacy/zk-proof-service';
import { Fingerprint, Lock, ShieldCheck, Eye, EyeOff, FileText, CheckSquare } from 'lucide-react';

interface PrivacyDashboardProps {
  vaultId?: string;
  activeTab?: string;
}

export function PrivacyDashboard({ vaultId, activeTab = 'generate' }: PrivacyDashboardProps) {
  const [proofs, setProofs] = useState<ZkProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(activeTab);
  
  useEffect(() => {
    if (vaultId) {
      loadProofs(vaultId);
    } else {
      setLoading(false);
    }
  }, [vaultId]);
  
  // Update the selected tab when activeTab prop changes
  useEffect(() => {
    if (activeTab) {
      setSelectedTab(activeTab);
    }
  }, [activeTab]);
  
  const loadProofs = async (id: string) => {
    setLoading(true);
    try {
      const privacyService = getPrivacyLayerService();
      const vaultProofs = await privacyService.getZkProofService().getProofsForVault(id);
      setProofs(vaultProofs);
    } catch (error) {
      console.error('Error loading proofs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProofGenerated = (proof: ZkProof) => {
    setProofs(prevProofs => [proof, ...prevProofs]);
    // Switch to the history tab
    setSelectedTab('history');
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-center text-foreground flex items-center justify-center gap-2">
          <Fingerprint className="h-6 w-6 text-[#FF5AF7]" />
          <span>Zero-Knowledge Privacy Layer</span>
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Protect your data while proving ownership and authenticity with zero-knowledge proofs.
          Our privacy layer ensures your sensitive information remains secure while maintaining verifiability.
        </p>
      </div>
      
      <Card className="bg-background border-border shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#6B00D7]/5 to-[#FF5AF7]/5 pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">Privacy Dashboard</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your privacy settings and zero-knowledge proofs
              </CardDescription>
            </div>
            {vaultId && (
              <Badge variant="outline" className="bg-muted/40 text-muted-foreground px-3 py-1">
                Vault: {vaultId.substring(0, 8)}...
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <div className="border-b border-border px-6">
              <TabsList className="bg-transparent h-14">
                <TabsTrigger 
                  value="generate" 
                  className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Generate Proof
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Proof History
                </TabsTrigger>
                <TabsTrigger 
                  value="selective" 
                  className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Selective Disclosure
                </TabsTrigger>
                <TabsTrigger 
                  value="range" 
                  className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Range Proofs
                </TabsTrigger>
                <TabsTrigger 
                  value="verify" 
                  className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Verify
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="generate" className="p-6">
              <ZeroKnowledgeProofForm 
                initialVaultId={vaultId} 
                onProofGenerated={handleProofGenerated}
              />
            </TabsContent>
            
            <TabsContent value="history" className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#9242FC]" />
                  <span>Proof History</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  View all previously generated zero-knowledge proofs for this vault
                </p>
              </div>
              
              <ProofHistoryDisplay 
                vaultId={vaultId} 
                proofs={loading ? undefined : proofs}
                onVerify={(proofId) => {
                  const proof = proofs.find(p => p.id === proofId);
                  if (proof) {
                    setSelectedTab('verify');
                  }
                }}
              />
            </TabsContent>
            
            <TabsContent value="selective" className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-[#9242FC]" />
                  <span>Selective Disclosure</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control exactly what data to reveal while keeping other information private
                </p>
              </div>
              
              <SelectiveDisclosureForm 
                initialVaultId={vaultId} 
                onProofGenerated={handleProofGenerated} 
                className="mt-6"
              />
            </TabsContent>
            
            <TabsContent value="range" className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#9242FC]" />
                  <span>Range Proofs</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate proofs that a value is within a specific range without revealing the exact amount
                </p>
              </div>
              
              <RangeProofGenerator 
                initialVaultId={vaultId} 
                onProofGenerated={handleProofGenerated} 
                className="mt-6"
              />
            </TabsContent>
            
            <TabsContent value="verify" className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#9242FC]" />
                  <span>Proof Verification</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verify zero-knowledge proofs across multiple blockchains with our Triple-Chain security architecture
                </p>
              </div>
              
              <CrossChainProofVerification className="mt-6" />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground/70" />
            <span>Triple-Chain Security with Zero-Knowledge Privacy Protection</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}