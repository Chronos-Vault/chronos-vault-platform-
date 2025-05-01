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
import { AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, Lock, UnlockKeyhole } from 'lucide-react';

interface ValidationResult {
  verified: boolean;
  sourceChain: BlockchainType;
  confirmations: number;
  tripleChainConsensus: boolean;
  validationChains: BlockchainType[];
  timestamp?: number;
}

export function CrossChainValidationDemo() {
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
    <Card className="w-full shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-purple-800/10 to-pink-600/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShieldCheck className="w-6 h-6 text-purple-700" />
          Triple-Chain Security Validator
        </CardTitle>
        <CardDescription>
          Validate transactions with the Triple-Chain Security architecture combining 
          Ethereum security, Solana speed, and TON recovery capabilities.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Source Blockchain</label>
              <Select
                value={sourceChain}
                onValueChange={(value) => setSourceChain(value as BlockchainType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">Ethereum (Primary Security)</SelectItem>
                  <SelectItem value="SOL">Solana (Speed Verification)</SelectItem>
                  <SelectItem value="TON">TON (Backup & Recovery)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Transaction Hash</label>
              <div className="flex gap-2">
                <Input 
                  value={txHash} 
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter transaction hash"
                />
                <Button variant="outline" onClick={handleGenerateDemo} className="shrink-0">
                  Demo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={validateTransaction} 
              disabled={isValidating}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isValidating ? 'Validating...' : 'Validate Transaction'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="mt-4 space-y-6">
              <div className="flex items-center gap-2">
                {result.verified ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-red-500" />
                )}
                <h3 className="text-xl font-semibold">
                  {result.verified ? 'Transaction Verified' : 'Validation Failed'}
                </h3>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Source Chain:</span>
                    <span className="font-medium">{result.sourceChain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Confirmations:</span>
                    <span className="font-medium">{result.confirmations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Triple-Chain Consensus:</span>
                    <span className={`font-medium ${result.tripleChainConsensus ? 'text-green-600' : 'text-red-600'}`}>
                      {result.tripleChainConsensus ? 'Achieved' : 'Not Achieved'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Validation Chains:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.validationChains.map((chain) => (
                      <Badge 
                        key={chain} 
                        variant="outline"
                        className="bg-purple-100 text-purple-800 border-purple-300"
                      >
                        {chain}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Triple-Chain Security Analysis</h4>
                <p className="text-sm text-gray-700">
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
      
      <CardFooter className="bg-gray-50 border-t flex-col items-start gap-4 text-sm text-gray-500">
        <p>
          <strong>Triple-Chain Security Architecture:</strong> Each blockchain plays a specific role in our security model.
        </p>
        <div className="grid gap-2 w-full md:grid-cols-3">
          <div className="flex gap-2 items-center">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span><strong>Ethereum:</strong> Primary security & ownership verification</span>
          </div>
          <div className="flex gap-2 items-center">
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            <span><strong>Solana:</strong> High-speed transaction monitoring</span>
          </div>
          <div className="flex gap-2 items-center">
            <Lock className="h-4 w-4 text-green-500" />
            <span><strong>TON:</strong> Backup & recovery mechanisms</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
