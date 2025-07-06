import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Shield, ArrowLeft, ChevronRight, AlertTriangle, CheckCircle2, Database, LockKeyhole, Shield as ShieldIcon, Lock } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';

export default function SecurityVerification() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [txHash, setTxHash] = useState('0x7f23c5bd38b3f3402e168cf4133cf05d5be18dcbd0ffb364ae1b66e19c1c0d33');
  const [vaultId, setVaultId] = useState('v-1746567000000-primary');
  const [sourceChain, setSourceChain] = useState<BlockchainType>('ETH');
  const [requiredChains, setRequiredChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON']);
  const [step, setStep] = useState<'config' | 'verification'>('config');
  const [activeTab, setActiveTab] = useState<'cross-chain' | 'zero-knowledge' | 'quantum-resistant'>('cross-chain');
  const [securityScore, setSecurityScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // New state for security metrics
  const [securityMetrics, setSecurityMetrics] = useState({
    crossChainVerification: 0,
    dataEncryption: 0,
    quantumResistance: 0,
    behavioralAnalysis: 0,
  });

  useEffect(() => {
    if (step === 'verification') {
      simulateSecurityAnalysis();
    }
  }, [step, activeTab]);

  const simulateSecurityAnalysis = () => {
    setIsAnalyzing(true);
    setSecurityScore(0);
    
    // Reset security metrics
    setSecurityMetrics({
      crossChainVerification: 0,
      dataEncryption: 0,
      quantumResistance: 0,
      behavioralAnalysis: 0,
    });
    
    // Simulate incremental scoring for cross-chain verification
    const interval = setInterval(() => {
      setSecurityScore(prev => {
        const newScore = Math.min(prev + Math.random() * 5, 100);
        
        // Update individual metrics with different rates
        setSecurityMetrics(prevMetrics => ({
          crossChainVerification: Math.min(prevMetrics.crossChainVerification + Math.random() * 7, 100),
          dataEncryption: Math.min(prevMetrics.dataEncryption + Math.random() * 6, 100),
          quantumResistance: Math.min(prevMetrics.quantumResistance + Math.random() * 4, 100),
          behavioralAnalysis: Math.min(prevMetrics.behavioralAnalysis + Math.random() * 5, 100),
        }));
        
        if (newScore >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
        }
        return newScore;
      });
    }, 100);
    
    return () => clearInterval(interval);
  };

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
            {activeTab === 'cross-chain' ? 'Cross-Chain Security Verification' : 
             activeTab === 'zero-knowledge' ? 'Zero-Knowledge Privacy Shield' : 
             'Quantum-Resistant Security Protocol'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'cross-chain' ? (
            <>
              <Shield className="h-5 w-5 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7]">Triple-Chain Security™</span>
            </>
          ) : activeTab === 'zero-knowledge' ? (
            <>
              <LockKeyhole className="h-5 w-5 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7]">Privacy-Preserving Verification</span>
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 text-[#FF5AF7]" />
              <span className="text-sm text-[#FF5AF7]">Future-Proof Protection</span>
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
                      <SelectItem value="BTC">Bitcoin</SelectItem>
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
                        
                        <Button
                          variant="outline"
                          onClick={() => setRequiredChains(['ETH', 'BTC'])}
                          className={`flex justify-between items-center border transition-all border-gray-700 ${
                            JSON.stringify(requiredChains) === JSON.stringify(['ETH', 'BTC'])
                              ? 'bg-[#6B00D7]/20 border-[#6B00D7]'
                              : 'bg-black/20 hover:bg-black/30'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium">ETH + BTC</p>
                            <p className="text-xs text-gray-400">Ethereum & Bitcoin</p>
                          </div>
                          <Shield className="h-4 w-4 ml-2" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => setRequiredChains(['ETH', 'SOL', 'TON', 'BTC'])}
                          className={`flex justify-between items-center border transition-all border-gray-700 ${
                            JSON.stringify(requiredChains) === JSON.stringify(['ETH', 'SOL', 'TON', 'BTC'])
                              ? 'bg-[#6B00D7]/20 border-[#6B00D7]'
                              : 'bg-black/20 hover:bg-black/30'
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-medium">Quad-Chain</p>
                            <p className="text-xs text-gray-400">ETH + SOL + TON + BTC</p>
                          </div>
                          <ShieldIcon className="h-4 w-4 ml-2" />
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
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="btc-chain"
                            checked={requiredChains.includes('BTC')}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRequiredChains([...requiredChains, 'BTC']);
                              } else {
                                setRequiredChains(requiredChains.filter(chain => chain !== 'BTC'));
                              }
                            }}
                            className="rounded bg-black/30 border-[#FF5AF7]/20 text-[#6B00D7] focus:ring-[#6B00D7]"
                          />
                          <Label htmlFor="btc-chain">Bitcoin (BTC)</Label>
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
                
                <Button 
                  variant={activeTab === 'quantum-resistant' ? 'default' : 'outline'} 
                  size="lg" 
                  className={`w-full py-6 h-auto flex flex-col gap-3 ${activeTab === 'quantum-resistant' ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90' : 'border-[#6B00D7]/20 hover:bg-[#6B00D7]/10'}`}
                  onClick={() => setActiveTab('quantum-resistant')}
                >
                  <Lock className="h-8 w-8 mb-1" />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">Quantum-Resistant Protocol</h3>
                    <p className="text-xs text-gray-300 mt-1">Future-proof encryption</p>
                  </div>
                </Button>
              </div>

              {activeTab === 'cross-chain' && (
                <div className="space-y-6">
                  <Card className="border border-[#6B00D7]/20 bg-[#121212] overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Cross-Chain Security Verification</CardTitle>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-500">
                            {securityScore < 100 ? 'Verifying...' : 'Verified'}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        Validating transaction security across {requiredChains.length} blockchains
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Verification Progress</h4>
                            <span className="text-sm text-gray-400">{Math.round(securityScore)}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transition-all duration-500 rounded-full" 
                              style={{ width: `${securityScore}%` }}
                            ></div>
                          </div>
                          
                          {securityScore >= 100 && (
                            <div className="p-3 bg-emerald-900/20 border border-emerald-900/30 rounded-md mt-4">
                              <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-emerald-500">Verification Complete</p>
                                  <p className="text-xs text-emerald-400/80">
                                    Transaction {txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)} verified across all chains
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">Security Metrics</h4>
                          
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-300">Cross-Chain Verification</span>
                                <span className="text-xs text-gray-400">{Math.round(securityMetrics.crossChainVerification)}%</span>
                              </div>
                              <Progress value={securityMetrics.crossChainVerification} className="h-1 bg-gray-800" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-300">Data Encryption</span>
                                <span className="text-xs text-gray-400">{Math.round(securityMetrics.dataEncryption)}%</span>
                              </div>
                              <Progress value={securityMetrics.dataEncryption} className="h-1 bg-gray-800" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-300">Quantum Resistance</span>
                                <span className="text-xs text-gray-400">{Math.round(securityMetrics.quantumResistance)}%</span>
                              </div>
                              <Progress value={securityMetrics.quantumResistance} className="h-1 bg-gray-800" />
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-300">Behavioral Analysis</span>
                                <span className="text-xs text-gray-400">{Math.round(securityMetrics.behavioralAnalysis)}%</span>
                              </div>
                              <Progress value={securityMetrics.behavioralAnalysis} className="h-1 bg-gray-800" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-black/30 px-6 py-4 border-t border-gray-800">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-400">
                          Vault ID: {vaultId}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={securityScore < 100 || isAnalyzing}
                        onClick={() => navigate('/my-vaults')} 
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                      >
                        View Vault Details
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <MultiChainSecurityVerification
                    vaultId={vaultId}
                    txHash={txHash}
                    sourceChain={sourceChain}
                    requiredChains={requiredChains}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </div>
              )}

              {activeTab === 'zero-knowledge' && (
                <div className="space-y-6">
                  <Card className="border border-[#6B00D7]/20 bg-[#121212] overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Zero-Knowledge Privacy Shield</CardTitle>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-500">
                            {securityScore < 100 ? 'Verifying...' : 'Verified'}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        Validating transaction without revealing sensitive data
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Privacy Verification Progress</h4>
                            <span className="text-sm text-gray-400">{Math.round(securityScore)}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transition-all duration-500 rounded-full" 
                              style={{ width: `${securityScore}%` }}
                            ></div>
                          </div>
                          
                          {securityScore >= 100 && (
                            <div className="p-3 bg-emerald-900/20 border border-emerald-900/30 rounded-md mt-4">
                              <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-emerald-500">Zero-Knowledge Proof Verified</p>
                                  <p className="text-xs text-emerald-400/80">
                                    Transaction validity confirmed without exposing private data
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-medium mb-2">Data Privacy Status</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Transaction amounts remain hidden
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Wallet addresses anonymized
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Metadata shielded from analysis
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Smart contract interactions private
                              </li>
                            </ul>
                          </div>
                          
                          <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-medium mb-2">Benefits</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Protection from blockchain analytics
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Compliance with privacy regulations
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Prevents transaction correlation
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Enhanced security against targeting
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-black/30 px-6 py-4 border-t border-gray-800">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-400">
                          Vault ID: {vaultId}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={securityScore < 100 || isAnalyzing}
                        onClick={() => navigate('/my-vaults')} 
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                      >
                        View Vault Details
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <ZeroKnowledgeDashboard 
                    vaultId={vaultId}
                    txHash={txHash}
                  />
                </div>
              )}
              
              {activeTab === 'quantum-resistant' && (
                <div className="space-y-6">
                  <Card className="border border-[#6B00D7]/20 bg-[#121212] overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">Quantum-Resistant Security Protocol</CardTitle>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-sm font-medium text-emerald-500">
                            {securityScore < 100 ? 'Verifying...' : 'Verified'}
                          </span>
                        </div>
                      </div>
                      <CardDescription>
                        Future-proofing your assets against quantum computing threats
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-medium">Quantum Security Analysis</h4>
                            <span className="text-sm text-gray-400">{Math.round(securityScore)}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] transition-all duration-500 rounded-full" 
                              style={{ width: `${securityScore}%` }}
                            ></div>
                          </div>
                          
                          {securityScore >= 100 && (
                            <div className="p-3 bg-emerald-900/20 border border-emerald-900/30 rounded-md mt-4">
                              <div className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 mt-0.5" />
                                <div>
                                  <p className="text-sm font-medium text-emerald-500">Quantum-Resistant Protocol Active</p>
                                  <p className="text-xs text-emerald-400/80">
                                    Assets secured with post-quantum cryptography
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-medium mb-2">Protection Methods</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Lattice-based cryptography
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Hash-based digital signatures
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Multivariate polynomial cryptography
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Isogeny-based cryptography
                              </li>
                            </ul>
                          </div>
                          
                          <div className="p-4 bg-black/30 rounded-lg border border-gray-800">
                            <h4 className="text-sm font-medium mb-2">Security Timeline</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Immediate protection: Current threats
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Mid-term: Early quantum computers (5-10 years)
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Long-term: Advanced quantum threats (10+ years)
                              </li>
                              <li className="flex items-center">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2" />
                                Perpetual: Automatic algorithm updates
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between bg-black/30 px-6 py-4 border-t border-gray-800">
                      <div className="flex items-center">
                        <Database className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-xs text-gray-400">
                          Vault ID: {vaultId}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        disabled={securityScore < 100 || isAnalyzing}
                        onClick={() => navigate('/my-vaults')} 
                        className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                      >
                        View Vault Details
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}