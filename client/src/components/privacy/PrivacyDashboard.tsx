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
import { getPrivacyLayerService } from '@/lib/privacy';
import { ZkProof } from '@/lib/privacy/zk-proof-service';
import { Fingerprint, Lock, ShieldCheck, Eye, EyeOff, FileText, CheckSquare } from 'lucide-react';

interface PrivacyDashboardProps {
  vaultId?: string;
}

export function PrivacyDashboard({ vaultId }: PrivacyDashboardProps) {
  const [proofs, setProofs] = useState<ZkProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('generate');
  
  useEffect(() => {
    if (vaultId) {
      loadProofs(vaultId);
    } else {
      setLoading(false);
    }
  }, [vaultId]);
  
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
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : proofs.length === 0 ? (
                <div className="bg-muted/30 rounded-lg p-8 text-center">
                  <Lock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No Proofs Found</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {vaultId 
                      ? "You haven't generated any zero-knowledge proofs for this vault yet."
                      : "Enter a vault ID and generate a proof to get started."}
                  </p>
                  <Button 
                    className="mt-6"
                    variant="outline"
                    onClick={() => setSelectedTab('generate')}
                  >
                    Generate New Proof
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {proofs.map((proof) => (
                    <Card key={proof.id} className="bg-muted/20 border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                className={
                                  proof.status === 'verified' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                                  proof.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                                  proof.status === 'expired' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' :
                                  'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                }
                              >
                                {proof.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(proof.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <h4 className="font-medium text-foreground mb-1">
                              Proof ID: {proof.id.substring(0, 12)}...
                            </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Type: {proof.proofType} • Chain: {proof.blockchain}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Verify
                            </Button>
                            <Button size="sm" variant="outline">
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="selective" className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <EyeOff className="h-5 w-5 text-[#9242FC]" />
                  <span>Selective Disclosure</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control exactly what data to reveal while keeping other information private
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disclosure Templates */}
                <Card className="bg-muted/20 border-border h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#9242FC]" />
                      <span>Selective Disclosure Templates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-background p-3 rounded-md border border-border">
                        <h4 className="font-medium mb-1 flex items-center justify-between">
                          <span>Proof of Ownership</span>
                          <Badge variant="outline" className="text-xs">Basic</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prove you own the vault without revealing its contents
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                      </div>
                      
                      <div className="bg-background p-3 rounded-md border border-border">
                        <h4 className="font-medium mb-1 flex items-center justify-between">
                          <span>Value Range Proof</span>
                          <Badge variant="outline" className="text-xs">Advanced</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prove your vault value is within a certain range without revealing the exact amount
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                      </div>
                      
                      <div className="bg-background p-3 rounded-md border border-border">
                        <h4 className="font-medium mb-1 flex items-center justify-between">
                          <span>Time-Lock Verification</span>
                          <Badge variant="outline" className="text-xs">Premium</Badge>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Prove time conditions are met without revealing the exact unlock date
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Custom Disclosure */}
                <Card className="bg-muted/20 border-border h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#FF5AF7]" />
                      <span>Custom Disclosure Controls</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Create your own custom selective disclosure by choosing exactly what data to reveal
                      </p>
                      
                      <div className="bg-background p-4 rounded-md border border-border">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Vault Ownership</span>
                          </div>
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Creation Date</span>
                          </div>
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">Vault Contents</span>
                          </div>
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-muted-foreground mr-2" />
                            <span className="text-sm text-muted-foreground">Value Range</span>
                          </div>
                          <div className="flex items-center">
                            <CheckSquare className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">Chain Type</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full">Generate Custom Disclosure Proof</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
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