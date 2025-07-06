import React, { useState } from 'react';
import { securityServiceAggregator } from '@/lib/cross-chain/SecurityServiceAggregator';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, Lock, UnlockKeyhole, ArrowRight, Shield, RefreshCw, History, Zap, Globe } from 'lucide-react';

interface ValidationResult {
  verified: boolean;
  sourceChain: BlockchainType;
  confirmations: number;
  tripleChainConsensus: boolean;
  validationChains: BlockchainType[];
  timestamp?: number;
}

export default function CrossChainValidationDemo() {
  const [txHash, setTxHash] = useState<string>('simulated_cross_chain_tx_' + Date.now());
  const [sourceChain, setSourceChain] = useState<BlockchainType>('ETH');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateTransaction = async () => {
    if (!txHash) {
      setError('Please enter a transaction hash');
      return;
    }
    
    setIsValidating(true);
    setError(null);
    
    try {
      const validationResult = await securityServiceAggregator.validateCrossChainTransaction(
        txHash,
        sourceChain
      );
      
      setResult({
        ...validationResult,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error('Validation error:', err);
      setError(err.message || 'An error occurred during validation');
      setResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleGenerateDemo = () => {
    setTxHash('simulated_cross_chain_tx_' + Date.now());
    setError(null);
    setResult(null);
  };

  return (
    <Card className="w-full shadow-2xl border border-[#2A2A42] bg-[#14141F]/80 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#6B00D7] opacity-10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#FF5AF7] opacity-10 blur-3xl"></div>
      
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B00D7] to-[#9747FF] flex items-center justify-center shadow-lg shadow-[#6B00D7]/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white text-2xl font-semibold">
            Triple-Chain Security Validator
          </CardTitle>
        </div>
        <CardDescription className="text-gray-400 font-light">
          Validate transactions with the Triple-Chain Security architecture combining 
          Ethereum security, Solana speed, and TON recovery capabilities.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Source Blockchain</label>
              <Select
                value={sourceChain}
                onValueChange={(value) => setSourceChain(value as BlockchainType)}
              >
                <SelectTrigger className="bg-[#1C1C2E] border-[#3A3A60] text-white">
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent className="bg-[#1C1C2E] border-[#3A3A60] text-white">
                  <SelectItem value="ETH" className="focus:bg-[#2A2A42] focus:text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-[#5D5FEF]/20">
                        <Shield className="h-4 w-4 text-[#5D5FEF]" />
                      </div>
                      Ethereum (Primary Security)
                    </div>
                  </SelectItem>
                  <SelectItem value="SOL" className="focus:bg-[#2A2A42] focus:text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-[#FF5AF7]/20">
                        <Zap className="h-4 w-4 text-[#FF5AF7]" />
                      </div>
                      Solana (Speed Verification)
                    </div>
                  </SelectItem>
                  <SelectItem value="TON" className="focus:bg-[#2A2A42] focus:text-white">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-[#6B00D7]/20">
                        <History className="h-4 w-4 text-[#6B00D7]" />
                      </div>
                      TON (Backup & Recovery)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-300">Transaction Hash</label>
              <div className="flex gap-2">
                <Input 
                  value={txHash} 
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter transaction hash"
                  className="bg-[#1C1C2E] border-[#3A3A60] text-white placeholder:text-gray-500"
                />
                <Button variant="outline" onClick={handleGenerateDemo} className="shrink-0 border-[#3A3A60] text-[#FF5AF7] hover:bg-[#2A2A42] hover:text-[#FF5AF7]">
                  Demo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={validateTransaction} 
              disabled={isValidating}
              className="bg-gradient-to-r from-[#6B00D7] to-[#9747FF] text-white hover:opacity-90 transition-all"
            >
              {isValidating ? 'Validating...' : 'Validate Transaction'}
              {!isValidating && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-[#341425] border-[#FF5A5A] text-[#FF8A8A]">
              <AlertCircle className="h-5 w-5 text-[#FF5A5A]" />
              <AlertTitle className="text-white font-medium">Error</AlertTitle>
              <AlertDescription className="text-gray-300">{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-6 space-y-8">
              <div className="flex items-center gap-3 p-4 border border-[#2A2A42] rounded-xl bg-gradient-to-r from-[#1C1C2E] to-[#14141F]">
                {result.verified ? (
                  <div className="w-12 h-12 rounded-full bg-[#143828]/30 flex items-center justify-center border border-[#25AB75]/30">
                    <CheckCircle2 className="h-6 w-6 text-[#25AB75]" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#341425]/30 flex items-center justify-center border border-[#FF5A5A]/30">
                    <AlertCircle className="h-6 w-6 text-[#FF5A5A]" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {result.verified ? 'Transaction Verified' : 'Validation Failed'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {result.verified 
                      ? 'All security protocols have been successfully verified'
                      : 'One or more security checks have failed'}
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 p-4 border border-[#2A2A42] rounded-xl bg-[#14141F]/60">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 font-medium">Transaction Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[#2A2A42]">
                      <span className="text-gray-400">Source Chain:</span>
                      <div className="flex items-center gap-2">
                        {result.sourceChain === 'ETH' && <Shield className="h-4 w-4 text-[#5D5FEF]" />}
                        {result.sourceChain === 'SOL' && <Zap className="h-4 w-4 text-[#FF5AF7]" />}
                        {result.sourceChain === 'TON' && <History className="h-4 w-4 text-[#6B00D7]" />}
                        <span className="font-medium text-white">{result.sourceChain}</span>
                      </div>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#2A2A42]">
                      <span className="text-gray-400">Confirmations:</span>
                      <span className="font-medium text-white">{result.confirmations}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[#2A2A42]">
                      <span className="text-gray-400">Triple-Chain Consensus:</span>
                      <span className={`font-medium ${result.tripleChainConsensus ? 'text-[#25AB75]' : 'text-[#FF5A5A]'}`}>
                        {result.tripleChainConsensus ? 'Achieved' : 'Not Achieved'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-[#2A2A42] rounded-xl bg-[#14141F]/60">
                  <h4 className="text-sm uppercase tracking-wider text-gray-400 font-medium mb-4">Validation Chains</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.validationChains.map((chain) => {
                      let bgColor = 'bg-[#2A2A42]';
                      let textColor = 'text-white';
                      let icon = <Globe className="h-3.5 w-3.5" />;
                      
                      if (chain === 'ETH') {
                        bgColor = 'bg-[#5D5FEF]/20';
                        textColor = 'text-[#5D5FEF]';
                        icon = <Shield className="h-3.5 w-3.5 text-[#5D5FEF]" />;
                      } else if (chain === 'SOL') {
                        bgColor = 'bg-[#FF5AF7]/20';
                        textColor = 'text-[#FF5AF7]';
                        icon = <Zap className="h-3.5 w-3.5 text-[#FF5AF7]" />;
                      } else if (chain === 'TON') {
                        bgColor = 'bg-[#6B00D7]/20';
                        textColor = 'text-[#6B00D7]';
                        icon = <History className="h-3.5 w-3.5 text-[#6B00D7]" />;
                      }
                      
                      return (
                        <Badge 
                          key={chain} 
                          variant="outline"
                          className={`${bgColor} ${textColor} border-transparent flex items-center gap-1 py-1.5 px-3`}
                        >
                          {icon}
                          {chain}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="p-5 rounded-xl border border-[#2A2A42] bg-gradient-to-br from-[#1C1C2E] to-[#14141F] relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#6B00D7] opacity-5 blur-3xl"></div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#6B00D7]" />
                  Triple-Chain Security Analysis
                </h4>
                <p className="text-gray-400 font-light leading-relaxed">
                  {result.verified 
                    ? 'This transaction has been successfully validated through Chronos Vault\'s Triple-Chain Security architecture. '
                    : 'This transaction could not be validated through the Triple-Chain Security architecture. '}
                  {result.tripleChainConsensus 
                    ? 'Multiple blockchains have confirmed the validity of this transaction, providing enhanced security beyond traditional single-chain verification.'
                    : 'Not enough blockchains could confirm this transaction\'s validity, indicating potential issues with cross-chain consistency.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-[#2A2A42] mt-4 pt-6 flex-col items-start gap-4 text-sm text-gray-400 font-light">
        <p className="text-gray-300">
          <strong className="text-white">Triple-Chain Security Architecture:</strong> Each blockchain plays a specific role in our security model.
        </p>
        <div className="grid gap-4 w-full md:grid-cols-3">
          <div className="p-3 rounded-lg border border-[#2A2A42] bg-[#1C1C2E] flex items-center gap-3 group hover:border-[#5D5FEF]/50 transition-all duration-300">
            <div className="p-2 rounded-lg bg-[#5D5FEF]/20 group-hover:bg-[#5D5FEF]/30 transition-colors">
              <Shield className="h-4 w-4 text-[#5D5FEF]" />
            </div>
            <span><strong className="text-white">Ethereum:</strong> Primary security & ownership verification</span>
          </div>
          <div className="p-3 rounded-lg border border-[#2A2A42] bg-[#1C1C2E] flex items-center gap-3 group hover:border-[#FF5AF7]/50 transition-all duration-300">
            <div className="p-2 rounded-lg bg-[#FF5AF7]/20 group-hover:bg-[#FF5AF7]/30 transition-colors">
              <Zap className="h-4 w-4 text-[#FF5AF7]" />
            </div>
            <span><strong className="text-white">Solana:</strong> High-speed transaction monitoring</span>
          </div>
          <div className="p-3 rounded-lg border border-[#2A2A42] bg-[#1C1C2E] flex items-center gap-3 group hover:border-[#6B00D7]/50 transition-all duration-300">
            <div className="p-2 rounded-lg bg-[#6B00D7]/20 group-hover:bg-[#6B00D7]/30 transition-colors">
              <History className="h-4 w-4 text-[#6B00D7]" />
            </div>
            <span><strong className="text-white">TON:</strong> Backup & recovery mechanisms</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
