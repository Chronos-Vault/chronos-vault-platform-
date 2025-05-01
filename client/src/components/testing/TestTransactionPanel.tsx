import React, { useState } from 'react';
import { BlockchainType, useMultiChain } from '@/contexts/multi-chain-context';
import { TestTransactionUtility, TestTransactionConfig, TransactionResult } from '@/lib/testing/TestTransactionUtility';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import TestnetBadge from '@/components/blockchain/TestnetBadge';

interface TestTransactionPanelProps {
  className?: string;
}

export default function TestTransactionPanel({ className }: TestTransactionPanelProps) {
  const { chainStatus, isTestnet } = useMultiChain();
  const [activeChain, setActiveChain] = useState<BlockchainType>(BlockchainType.ETHEREUM);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<TransactionResult | null>(null);
  
  // Function to execute test transaction
  const executeTransaction = async (config: TestTransactionConfig) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setLastResult(null);
    
    try {
      const result = await TestTransactionUtility.executeTestTransaction(config);
      setLastResult(result);
    } catch (error: any) {
      setLastResult({
        success: false,
        error: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Get sample transactions for the active chain
  const sampleTransactions = TestTransactionUtility.getSampleTransactions(activeChain);
  
  // Check if wallet is connected and on testnet
  const isWalletReady = chainStatus[activeChain].isConnected && isTestnet(activeChain);
  
  return (
    <Card className={`${className} border border-[#6B00D7]/30 bg-gradient-to-br from-[#121212]/80 to-[#1A1A1A]/80 backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Test Transactions</CardTitle>
            <CardDescription className="text-gray-400">Execute test transactions on testnets</CardDescription>
          </div>
          <TestnetBadge chain={activeChain} showName={true} />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="ethereum" onValueChange={(value) => {
          switch(value) {
            case 'ethereum':
              setActiveChain(BlockchainType.ETHEREUM);
              break;
            case 'solana':
              setActiveChain(BlockchainType.SOLANA);
              break;
            case 'ton':
              setActiveChain(BlockchainType.TON);
              break;
          }
          // Reset last result when changing chains
          setLastResult(null);
        }}>
          <TabsList className="mb-4 bg-[#1A1A1A] border border-[#6B00D7]/20">
            <TabsTrigger value="ethereum" className="data-[state=active]:bg-[#6B00D7]/40">
              Ethereum
            </TabsTrigger>
            <TabsTrigger value="solana" className="data-[state=active]:bg-[#6B00D7]/40">
              Solana
            </TabsTrigger>
            <TabsTrigger value="ton" className="data-[state=active]:bg-[#6B00D7]/40">
              TON
            </TabsTrigger>
          </TabsList>
          
          {/* Content is the same for all tabs, just different chains */}
          {['ethereum', 'solana', 'ton'].map(chain => (
            <TabsContent key={chain} value={chain}>
              {!chainStatus[activeChain].isConnected ? (
                <Alert variant="destructive" className="mb-4 bg-red-950/30 border-red-700/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Wallet Not Connected</AlertTitle>
                  <AlertDescription>
                    You need to connect your {activeChain} wallet to execute test transactions.
                  </AlertDescription>
                </Alert>
              ) : !isTestnet(activeChain) ? (
                <Alert variant="destructive" className="mb-4 bg-orange-950/30 border-orange-700/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Mainnet Detected</AlertTitle>
                  <AlertDescription>
                    Test transactions can only be executed on testnets. Please switch to a testnet network.
                  </AlertDescription>
                </Alert>
              ) : null}
              
              <div className="space-y-4">
                <div className="text-sm font-medium text-white">Available Test Transactions:</div>
                
                {sampleTransactions.map((tx, index) => (
                  <div key={index} className="p-3 rounded-lg border border-[#6B00D7]/20 bg-[#1A1A1A]/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white capitalize">
                          {tx.type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {tx.type === 'transfer' && (
                            <span>Send {tx.amount} to {tx.recipient?.substring(0, 10)}...</span>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => executeTransaction(tx)}
                        disabled={isExecuting || !isWalletReady}
                        size="sm"
                        className="bg-gradient-to-r from-[#6B00D7] to-[#B100D7] hover:from-[#7B10E7] hover:to-[#C110E7] text-white"
                      >
                        {isExecuting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                        Execute
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Transaction Result */}
              {lastResult && (
                <div className={`mt-4 p-4 rounded-lg ${lastResult.success ? 'bg-green-950/30 border border-green-700/50' : 'bg-red-950/30 border border-red-700/50'}`}>
                  <div className="flex items-center">
                    {lastResult.success ? (
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <div className="text-sm font-medium text-white">
                      {lastResult.success ? 'Transaction Successful' : 'Transaction Failed'}
                    </div>
                  </div>
                  
                  {lastResult.hash && (
                    <div className="mt-2 text-xs text-gray-300">
                      <span className="font-medium">Transaction Hash:</span>
                      <div className="mt-1 bg-black/30 p-2 rounded-md overflow-auto">
                        {lastResult.hash}
                      </div>
                    </div>
                  )}
                  
                  {lastResult.error && (
                    <div className="mt-2 text-xs text-red-300">
                      <span className="font-medium">Error:</span>
                      <div className="mt-1 bg-black/30 p-2 rounded-md overflow-auto">
                        {lastResult.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start text-xs text-gray-400 pt-2 border-t border-[#6B00D7]/10">
        <p>All transactions execute on testnet only. Test tokens have no real-world value.</p>
      </CardFooter>
    </Card>
  );
}
