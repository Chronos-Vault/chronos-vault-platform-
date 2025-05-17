import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { FeeMonitoringSystem } from '@/components/cross-chain/FeeMonitoringSystem';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import { ArrowLeft, Coins, DollarSign, Info, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function CrossChainFeeMonitorPage() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [feeThreshold, setFeeThreshold] = useState(2.0);
  const [transactionAmount, setTransactionAmount] = useState(1000);
  const [selectedChain, setSelectedChain] = useState<BlockchainType | null>(null);
  const [availableChains, setAvailableChains] = useState<BlockchainType[]>(['ETH', 'SOL', 'TON', 'BTC']);
  const [activeTab, setActiveTab] = useState<'monitor' | 'settings'>('monitor');

  const handleChainSelect = (chain: BlockchainType) => {
    setSelectedChain(chain);
    toast({
      title: "Chain Selected",
      description: `Selected ${getChainName(chain)} for transaction routing`,
      variant: "default",
    });
  };

  const getChainName = (chain: BlockchainType): string => {
    switch (chain) {
      case 'ETH': return 'Ethereum';
      case 'SOL': return 'Solana';
      case 'TON': return 'TON';
      case 'BTC': return 'Bitcoin';
      default: return chain;
    }
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your fee monitoring settings have been updated",
      variant: "default",
    });
    setActiveTab('monitor');
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/cross-chain-operations')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
            Cross-Chain Fee Monitoring System
          </h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 border-[#333]"
          onClick={() => setActiveTab(activeTab === 'monitor' ? 'settings' : 'monitor')}
        >
          {activeTab === 'monitor' ? (
            <>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span>Monitor</span>
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="monitor" value={activeTab} onValueChange={(value) => setActiveTab(value as 'monitor' | 'settings')}>
        <TabsContent value="monitor" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FeeMonitoringSystem 
                availableChains={availableChains}
                sourceFunds={transactionAmount}
                feeThreshold={feeThreshold}
                onChainSelect={handleChainSelect}
              />
            </div>

            <div className="space-y-4">
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Transaction Summary
                  </CardTitle>
                  <CardDescription>
                    Estimated costs for your transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Transaction Amount:</span>
                      <span className="font-medium">${transactionAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Selected Chain:</span>
                      <span className="font-medium">
                        {selectedChain ? getChainName(selectedChain) : 'None'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Maximum Fee Threshold:</span>
                      <span className="font-medium">${feeThreshold.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Fee % of Transaction:</span>
                        <span className="font-medium">
                          {selectedChain 
                            ? `${(getEstimatedFee(selectedChain) / transactionAmount * 100).toFixed(3)}%` 
                            : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400">Estimated Fee:</span>
                        <span className="font-medium">
                          {selectedChain 
                            ? `$${getEstimatedFee(selectedChain).toFixed(3)}` 
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                    disabled={!selectedChain}
                    onClick={() => {
                      toast({
                        title: "Transaction Optimized",
                        description: `Your transaction has been routed through ${getChainName(selectedChain as BlockchainType)} to minimize fees`,
                        variant: "default",
                      });
                      
                      // In a real application, this would initiate the cross-chain transaction
                      setTimeout(() => {
                        navigate('/cross-chain-operations');
                      }, 1500);
                    }}
                  >
                    Route Transaction
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-[#333] bg-[#121212]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Info className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                    Fee Optimization Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-400 space-y-4">
                  <p>
                    Our fee monitoring system continuously tracks transaction costs across multiple blockchains to find the most cost-effective route for your transactions.
                  </p>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-green-400">Low Congestion</span>
                      <span className="ml-auto">Recommended</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-yellow-400">Medium Congestion</span>
                      <span className="ml-auto">Consider alternatives</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-red-400">High Congestion</span>
                      <span className="ml-auto">Avoid if possible</span>
                    </div>
                  </div>
                  
                  <p>
                    Fee data is updated every 5-15 minutes and is drawn from on-chain data and major fee estimation services.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card className="border border-[#333] bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                Fee Monitoring Settings
              </CardTitle>
              <CardDescription>
                Configure your fee monitoring parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction Amount (USD)
                  </label>
                  <Input 
                    type="number" 
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(Number(e.target.value))}
                    min={1}
                    max={1000000}
                    className="bg-[#1A1A1A] border-[#333]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter the amount you plan to transact to calculate fee percentages
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Maximum Fee Threshold: ${feeThreshold.toFixed(2)}
                  </label>
                  <Slider 
                    defaultValue={[feeThreshold]} 
                    max={10}
                    min={0.1}
                    step={0.1}
                    onValueChange={(value) => setFeeThreshold(value[0])}
                    className="py-4"
                  />
                  <p className="text-xs text-gray-400">
                    Transactions with fees below this threshold will be highlighted as recommended
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium mb-2">
                    Blockchains to Monitor
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['ETH', 'SOL', 'TON', 'BTC'] as BlockchainType[]).map((chain) => (
                      <div 
                        key={chain}
                        className={`p-3 rounded-md border cursor-pointer transition-all ${
                          availableChains.includes(chain)
                            ? 'border-[#6B00D7] bg-[#6B00D7]/10' 
                            : 'border-[#333] hover:border-[#6B00D7]/50 hover:bg-[#6B00D7]/5'
                        }`}
                        onClick={() => {
                          if (availableChains.includes(chain)) {
                            if (availableChains.length > 1) {
                              setAvailableChains(availableChains.filter(c => c !== chain));
                            }
                          } else {
                            setAvailableChains([...availableChains, chain]);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{getChainName(chain)}</span>
                          <input 
                            type="checkbox"
                            checked={availableChains.includes(chain)}
                            onChange={() => {}}
                            className="rounded border-gray-700 bg-[#121212] text-[#6B00D7]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleUpdateSettings} className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90">
                    Update Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-[#333] bg-[#121212]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Coins className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                Advanced Fee Strategies
              </CardTitle>
              <CardDescription>
                Fine-tune your fee optimization strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-[#333] rounded-md">
                  <div>
                    <h3 className="font-medium">Auto-Optimization</h3>
                    <p className="text-xs text-gray-400">
                      Automatically select the optimal blockchain based on current fee data
                    </p>
                  </div>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      id="auto-optimization"
                      defaultChecked={true}
                      className="h-4 w-4 rounded border-gray-700 bg-[#121212] text-[#6B00D7]"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-[#333] rounded-md">
                  <div>
                    <h3 className="font-medium">Congestion Avoidance</h3>
                    <p className="text-xs text-gray-400">
                      Prioritize chains with low network congestion over raw fee cost
                    </p>
                  </div>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      id="congestion-avoidance"
                      defaultChecked={true}
                      className="h-4 w-4 rounded border-gray-700 bg-[#121212] text-[#6B00D7]"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-[#333] rounded-md">
                  <div>
                    <h3 className="font-medium">Time-Based Routing</h3>
                    <p className="text-xs text-gray-400">
                      Schedule transactions during periods of historically low fees
                    </p>
                  </div>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      id="time-based-routing"
                      defaultChecked={false}
                      className="h-4 w-4 rounded border-gray-700 bg-[#121212] text-[#6B00D7]"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-[#333] rounded-md">
                  <div>
                    <h3 className="font-medium">Fee Alerts</h3>
                    <p className="text-xs text-gray-400">
                      Receive notifications when fees drop below your threshold
                    </p>
                  </div>
                  <div className="flex items-center h-4">
                    <input
                      type="checkbox"
                      id="fee-alerts"
                      defaultChecked={false}
                      className="h-4 w-4 rounded border-gray-700 bg-[#121212] text-[#6B00D7]"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleUpdateSettings} className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90">
                Save Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to get estimated fees based on chain (in a real app this would come from the API)
function getEstimatedFee(chain: BlockchainType): number {
  switch (chain) {
    case 'ETH': return 3.25;
    case 'SOL': return 0.032;
    case 'TON': return 0.18;
    case 'BTC': return 5.75;
    default: return 0;
  }
}