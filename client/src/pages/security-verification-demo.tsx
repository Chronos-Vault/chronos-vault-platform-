import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Shield, ArrowLeft, ChevronRight, AlertTriangle, CheckCircle2, Database, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { MultiChainSecurityVerification } from '@/components/security/MultiChainSecurityVerification';
import { ZeroKnowledgeDashboard } from '@/components/security/ZeroKnowledgeDashboard';
import { useToast } from '@/hooks/use-toast';

export default function SecurityVerificationDemo() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState('0x7f23c5bd38b3f3402e168cf4133cf05d5be18dcbd0ffb364ae1b66e19c1c0d33');
  const [vaultId, setVaultId] = useState('v-1746567000000-demo');
  const [sourceChain, setSourceChain] = useState<BlockchainType>('ETH');
  const [requiredChains, setRequiredChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON']);
  const [step, setStep] = useState<'config' | 'verification'>('config');
  const [activeTab, setActiveTab] = useState<'cross-chain' | 'zero-knowledge'>('cross-chain');

  const handleSuccess = () => {
    toast({
      title: "Verification Successful",
      description: "Transaction has been verified across all required chains",
      variant: "default",
    });
  };

  const handleError = (error: Error) => {
    toast({
      title: "Verification Failed",
      description: error.message || "Failed to verify transaction across chains",
      variant: "destructive",
    });
  };

  const allChainsIncludeSource = requiredChains.includes(sourceChain);

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
            {activeTab === 'cross-chain' ? 'Cross-Chain Security Verification' : 'Zero-Knowledge Privacy Shield'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'cross-chain' ? (
            <>
              <Shield className="h-5 w-5 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7]">Triple-Chain Security™</span>
            </>
          ) : (
            <>
              <LockKeyhole className="h-5 w-5 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7]">Privacy-Preserving Verification</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {step === 'config' ? (
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-br from-black/60 to-[#6B00D7]/10 shadow-xl">
            <CardHeader>
              <CardTitle>Configure Verification Parameters</CardTitle>
              <CardDescription>
                Set up the cross-chain verification parameters for your vault
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vault-id">Vault ID</Label>
                <Input
                  id="vault-id"
                  value={vaultId}
                  onChange={(e) => setVaultId(e.target.value)}
                  className="bg-black/30 border-[#FF5AF7]/20"
                  placeholder="Enter vault ID"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tx-hash">Transaction Hash</Label>
                <Input
                  id="tx-hash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="bg-black/30 border-[#FF5AF7]/20 font-mono"
                  placeholder="Enter transaction hash"
                />
                <p className="text-xs text-gray-400">
                  Enter the transaction hash to verify across multiple blockchains
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="source-chain">Source Blockchain</Label>
                  <Select 
                    value={sourceChain} 
                    onValueChange={(value) => setSourceChain(value as BlockchainType)}
                  >
                    <SelectTrigger id="source-chain" className="bg-black/30 border-[#FF5AF7]/20">
                      <SelectValue placeholder="Select source blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ETH">Ethereum</SelectItem>
                      <SelectItem value="SOL">Solana</SelectItem>
                      <SelectItem value="TON">TON</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400">
                    The blockchain where the transaction originated
                  </p>
                </div>

                <div>
                  <Label className="mb-2 block">Required Blockchains</Label>
                  <Tabs defaultValue="preset" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preset">Presets</TabsTrigger>
                      <TabsTrigger value="custom">Custom</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preset" className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setRequiredChains(['ETH', 'SOL', 'TON'])}
                          className={`flex justify-between items-center border transition-all border-gray-700 ${
                            JSON.stringify(requiredChains) === JSON.stringify(['ETH', 'SOL', 'TON'])
                              ? 'bg-[#6B00D7]/20 border-[#6B00D7]'
                              : 'bg-black/20 hover:bg-black/30'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium">Triple-Chain</p>
                            <p className="text-xs text-gray-400">ETH + SOL + TON</p>
                          </div>
                          <Shield className="h-4 w-4 ml-2" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setRequiredChains(['ETH', 'SOL'])}
                          className={`flex justify-between items-center border transition-all border-gray-700 ${
                            JSON.stringify(requiredChains) === JSON.stringify(['ETH', 'SOL'])
                              ? 'bg-[#6B00D7]/20 border-[#6B00D7]'
                              : 'bg-black/20 hover:bg-black/30'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium">ETH + SOL</p>
                            <p className="text-xs text-gray-400">Ethereum & Solana</p>
                          </div>
                          <Shield className="h-4 w-4 ml-2" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setRequiredChains(['SOL', 'TON'])}
                          className={`flex justify-between items-center border transition-all border-gray-700 ${
                            JSON.stringify(requiredChains) === JSON.stringify(['SOL', 'TON'])
                              ? 'bg-[#6B00D7]/20 border-[#6B00D7]'
                              : 'bg-black/20 hover:bg-black/30'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium">SOL + TON</p>
                            <p className="text-xs text-gray-400">Solana & TON</p>
                          </div>
                          <Shield className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="custom" className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="eth-chain"
                            checked={requiredChains.includes('ETH')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequiredChains([...requiredChains, 'ETH']);
                              } else {
                                setRequiredChains(requiredChains.filter(chain => chain !== 'ETH'));
                              }
                            }}
                            className="rounded bg-black/30 border-[#FF5AF7]/20 text-[#6B00D7] focus:ring-[#6B00D7]"
                          />
                          <Label htmlFor="eth-chain">Ethereum (ETH)</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="sol-chain"
                            checked={requiredChains.includes('SOL')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequiredChains([...requiredChains, 'SOL']);
                              } else {
                                setRequiredChains(requiredChains.filter(chain => chain !== 'SOL'));
                              }
                            }}
                            className="rounded bg-black/30 border-[#FF5AF7]/20 text-[#6B00D7] focus:ring-[#6B00D7]"
                          />
                          <Label htmlFor="sol-chain">Solana (SOL)</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="ton-chain"
                            checked={requiredChains.includes('TON')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequiredChains([...requiredChains, 'TON']);
                              } else {
                                setRequiredChains(requiredChains.filter(chain => chain !== 'TON'));
                              }
                            }}
                            className="rounded bg-black/30 border-[#FF5AF7]/20 text-[#6B00D7] focus:ring-[#6B00D7]"
                          />
                          <Label htmlFor="ton-chain">TON</Label>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {!allChainsIncludeSource && (
                <div className="flex items-start p-3 rounded-md bg-amber-900/20 border border-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Source chain not included</p>
                    <p className="text-xs text-amber-400/80">
                      The source chain ({sourceChain}) should be included in the required chains for verification
                    </p>
                  </div>
                </div>
              )}

              {requiredChains.length < 2 && (
                <div className="flex items-start p-3 rounded-md bg-amber-900/20 border border-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-500">Insufficient chains selected</p>
                    <p className="text-xs text-amber-400/80">
                      Cross-chain verification requires at least 2 blockchains for effective security
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('verification')}
                disabled={requiredChains.length < 2 || !allChainsIncludeSource}
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 transition-opacity"
              >
                Proceed to Verification
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setStep('config')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Configuration
            </Button>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                <Button 
                  variant={activeTab === 'cross-chain' ? 'default' : 'outline'} 
                  size="lg" 
                  className={`w-full py-6 h-auto flex flex-col gap-3 ${activeTab === 'cross-chain' ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90' : 'border-[#6B00D7]/20 hover:bg-[#6B00D7]/10'}`}
                  onClick={() => setActiveTab('cross-chain')}
                >
                  <Shield className="h-8 w-8 mb-1" />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Triple-Chain Verification</h3>
                    <p className="text-xs text-gray-300 mt-1">ETH + SOL + TON Security</p>
                  </div>
                </Button>
                
                <Button 
                  variant={activeTab === 'zero-knowledge' ? 'default' : 'outline'} 
                  size="lg" 
                  className={`w-full py-6 h-auto flex flex-col gap-3 ${activeTab === 'zero-knowledge' ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90' : 'border-[#6B00D7]/20 hover:bg-[#6B00D7]/10'}`}
                  onClick={() => setActiveTab('zero-knowledge')}
                >
                  <LockKeyhole className="h-8 w-8 mb-1" />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Zero-Knowledge Privacy</h3>
                    <p className="text-xs text-gray-300 mt-1">Prove without revealing data</p>
                  </div>
                </Button>
              </div>

              {activeTab === 'cross-chain' && (
                <div className="space-y-6">
                  <MultiChainSecurityVerification
                    vaultId={vaultId}
                    txHash={txHash}
                    sourceChain={sourceChain}
                    requiredChains={requiredChains}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                  
                  <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-br from-black/60 to-[#6B00D7]/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Why Triple-Chain Verification Matters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Triple Security Layers:</span> Each blockchain adds an independent layer of protection, making attacks exponentially harder.
                          </p>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Specialized Chain Roles:</span> Ethereum provides robust ownership verification, Solana enables high-frequency monitoring, and TON creates a reliable backup layer.
                          </p>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">Zero-Knowledge Proofs:</span> Verify transaction validity without revealing sensitive details, preserving privacy while maintaining security.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'zero-knowledge' && (
                <div>
                  <ZeroKnowledgeDashboard />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}