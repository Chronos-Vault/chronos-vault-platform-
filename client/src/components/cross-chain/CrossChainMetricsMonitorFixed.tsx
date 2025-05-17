import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowUpDown, TrendingUp, TrendingDown, AlertTriangle, Shield, Clock, Zap } from "lucide-react";
import { BlockchainType } from '@/contexts/multi-chain-context';
import CrossChainMetricsService, { ChainMetrics, CrossChainComparisonData } from '@/services/cross-chain-metrics-service';

const CrossChainMetricsMonitorFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [chainData, setChainData] = useState<ChainMetrics[]>([]);
  const [comparisonData, setComparisonData] = useState<CrossChainComparisonData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // seconds
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Fetch chain metrics using our service
  const fetchChainMetrics = async () => {
    setLoading(true);
    try {
      const metricsService = CrossChainMetricsService.getInstance();
      const metrics = await metricsService.getAllChainMetrics();
      setChainData(metrics);
      
      const comparison = await metricsService.getComparisonData();
      setComparisonData(comparison);
    } catch (error) {
      console.error('Error fetching chain metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchChainMetrics();
    
    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchChainMetrics();
      }, refreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Get status color based on value (higher is better for performance and security scores)
  const getStatusColor = (value: number, isInverse: boolean = false): string => {
    if (isInverse) {
      // For metrics where lower is better (fees, congestion)
      if (value < 30) return 'bg-green-500';
      if (value < 70) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // For metrics where higher is better (security, performance)
      if (value > 80) return 'bg-green-500';
      if (value > 50) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  if (chainData.length === 0) {
    return (
      <div className="w-full p-8 text-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-[#333] rounded mb-4"></div>
          <div className="h-32 w-full max-w-3xl bg-[#1A1A1A] rounded"></div>
          <div className="mt-4 text-gray-400">Loading chain metrics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                Cross-Chain Metrics Monitor
              </CardTitle>
              <CardDescription className="text-gray-400">
                Real-time monitoring and optimization of multi-chain operations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className="px-3 py-1 border-[#6B00D7] text-[#FF5AF7]"
              >
                <Clock className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              {loading && (
                <div className="animate-pulse flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-[#6B00D7]"></div>
                  <span className="text-xs text-[#6B00D7]">Refreshing...</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6 bg-[#242424]">
              <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#333]">
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#333]">
                Performance
              </TabsTrigger>
              <TabsTrigger value="fees" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#333]">
                Transaction Fees
              </TabsTrigger>
              <TabsTrigger value="security" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#333]">
                Security
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {comparisonData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-[#242424] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Recommended Chain
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">
                          {chainData.find(c => c.chainId === comparisonData.recommendedChain)?.chainName}
                        </span>
                        <span className="text-xs text-[#6B00D7]">
                          Based on current metrics
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#242424] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Potential Fee Savings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">
                          ${comparisonData.potentialSavings.toFixed(2)}
                        </span>
                        <span className="text-xs text-[#6B00D7]">
                          Per transaction
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-[#242424] border-[#333]">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        Speed Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-white">
                          {comparisonData.speedImprovement.toFixed(0)}%
                        </span>
                        <span className="text-xs text-[#6B00D7]">
                          Compared to slowest chain
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-2">Chain Comparison</h3>
                {chainData.map((chain) => (
                  <div key={chain.chainId} className="bg-[#242424] rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className="font-bold text-white text-lg">{chain.chainName}</span>
                        {comparisonData?.recommendedChain === chain.chainId && (
                          <Badge className="ml-2 bg-[#6B00D7] text-white">Recommended</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        Updated {chain.lastUpdated.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Transaction Fee</div>
                        <div className="text-white font-semibold">${chain.transactionFee.toFixed(4)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Block Time</div>
                        <div className="text-white font-semibold">{chain.averageBlockTime} sec</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Security Score</div>
                        <div className="flex items-center">
                          <div className="text-white font-semibold mr-2">{chain.securityScore}/100</div>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(chain.securityScore)}`}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Network Congestion</div>
                        <div className="flex items-center">
                          <div className="text-white font-semibold mr-2">{chain.congestionLevel}%</div>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(chain.congestionLevel, true)}`}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Performance Score</span>
                        <span>{chain.performanceScore}%</span>
                      </div>
                      <Progress 
                        value={chain.performanceScore} 
                        className="h-2 bg-[#333]" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#242424] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Block Time Comparison</CardTitle>
                    <CardDescription className="text-gray-400">
                      Average time to confirm transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chainData.sort((a, b) => a.averageBlockTime - b.averageBlockTime).map((chain) => (
                        <div key={`block-${chain.chainId}`} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{chain.chainName}</span>
                            <span className="text-white font-semibold">{chain.averageBlockTime} sec</span>
                          </div>
                          <Progress 
                            value={100 - (chain.averageBlockTime / Math.max(...chainData.map(c => c.averageBlockTime)) * 100)} 
                            className="h-2 bg-[#333]"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#242424] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Network Congestion</CardTitle>
                    <CardDescription className="text-gray-400">
                      Current network load and transaction throughput
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chainData.sort((a, b) => a.congestionLevel - b.congestionLevel).map((chain) => (
                        <div key={`congestion-${chain.chainId}`} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{chain.chainName}</span>
                            <div className="flex items-center">
                              <span className="text-white font-semibold mr-2">{chain.congestionLevel}%</span>
                              {chain.congestionLevel > 70 ? (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              ) : chain.congestionLevel > 40 ? (
                                <TrendingUp className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <Zap className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                          <div className="bg-[#333] h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getStatusColor(chain.congestionLevel, true)}`} 
                              style={{width: `${chain.congestionLevel}%`}}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-[#242424] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Performance Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Comprehensive performance scoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {chainData.sort((a, b) => b.performanceScore - a.performanceScore).map((chain) => (
                      <div key={`perf-${chain.chainId}`} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-white">{chain.chainName}</span>
                          <Badge className={`${
                            chain.performanceScore > 80 ? 'bg-green-500' : 
                            chain.performanceScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          } text-white`}>
                            {chain.performanceScore}/100
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Transaction Speed</span>
                            <span className="text-white">{(100 - (chain.averageBlockTime / 15) * 100).toFixed(0)}/100</span>
                          </div>
                          
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Network Efficiency</span>
                            <span className="text-white">{(100 - chain.congestionLevel).toFixed(0)}/100</span>
                          </div>
                          
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Transaction Cost</span>
                            <span className="text-white">
                              {(100 - (chain.transactionFee / 3) * 100).toFixed(0)}/100
                            </span>
                          </div>
                        </div>
                        
                        <div className="bg-[#333] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatusColor(chain.performanceScore)}`} 
                            style={{width: `${chain.performanceScore}%`}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Transaction Fees Tab */}
            <TabsContent value="fees" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#242424] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Transaction Fee Comparison</CardTitle>
                    <CardDescription className="text-gray-400">
                      Current network fees in USD
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chainData.sort((a, b) => a.transactionFee - b.transactionFee).map((chain) => (
                        <div key={`fee-${chain.chainId}`} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">{chain.chainName}</span>
                            <span className="text-white font-semibold">${chain.transactionFee.toFixed(4)}</span>
                          </div>
                          <Progress 
                            value={100 - (chain.transactionFee / Math.max(...chainData.map(c => c.transactionFee)) * 100)} 
                            className="h-2 bg-[#333]"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-[#242424] border-[#333]">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-white">Fee Optimization Analysis</CardTitle>
                    <CardDescription className="text-gray-400">
                      Potential savings and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparisonData && (
                        <>
                          <div className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-md">
                            <div className="flex items-center">
                              <TrendingDown className="h-5 w-5 text-green-500 mr-2" />
                              <span className="text-white">Potential fee savings</span>
                            </div>
                            <span className="text-lg font-semibold text-white">
                              ${comparisonData.potentialSavings.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="p-3 bg-[#1A1A1A] rounded-md">
                            <div className="flex items-center mb-2">
                              <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                              <span className="text-white">Recommended action</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {comparisonData.potentialSavings > 1 ? (
                                `Use ${chainData.find(c => c.chainId === comparisonData.recommendedChain)?.chainName} for transactions to save up to ${(comparisonData.potentialSavings * 100).toFixed(0)}% on fees compared to the most expensive chain.`
                              ) : (
                                `Current chain selection is optimal for transaction fees. No action needed.`
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 bg-[#1A1A1A] rounded-md">
                            <div className="flex items-center mb-2">
                              <ArrowUpDown className="h-5 w-5 text-[#6B00D7] mr-2" />
                              <span className="text-white">Fee trend analysis</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {chainData.sort((a, b) => b.congestionLevel - a.congestionLevel)[0].congestionLevel > 70 ? (
                                `${chainData.sort((a, b) => b.congestionLevel - a.congestionLevel)[0].chainName} is experiencing high congestion (${chainData.sort((a, b) => b.congestionLevel - a.congestionLevel)[0].congestionLevel}%). Consider postponing non-urgent transactions or using an alternative chain.`
                              ) : (
                                `Network congestion levels are normal across all chains. Ideal time for transactions.`
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="bg-[#242424] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Chain Security Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Security metrics and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {chainData.sort((a, b) => b.securityScore - a.securityScore).map((chain) => (
                      <div key={`security-${chain.chainId}`} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-white">{chain.chainName}</span>
                          <Badge className={`${
                            chain.securityScore > 80 ? 'bg-green-500' : 
                            chain.securityScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          } text-white`}>
                            {chain.securityScore}/100
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Consensus Strength</span>
                            <span className="text-white">{Math.round(chain.securityScore * 0.7 + Math.random() * 10)}/100</span>
                          </div>
                          
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Decentralization</span>
                            <span className="text-white">{Math.round(chain.securityScore * 0.6 + Math.random() * 20)}/100</span>
                          </div>
                          
                          <div className="flex flex-col p-2 bg-[#1A1A1A] rounded-md">
                            <span className="text-gray-400 text-xs">Attack Resistance</span>
                            <span className="text-white">{Math.round(chain.securityScore * 0.8 + Math.random() * 5)}/100</span>
                          </div>
                        </div>
                        
                        <div className="bg-[#333] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getStatusColor(chain.securityScore)}`} 
                            style={{width: `${chain.securityScore}%`}}
                          />
                        </div>
                        
                        <div className="text-xs text-gray-400 mt-1">
                          {chain.securityScore > 90 ? (
                            "Extremely secure. Ideal for high-value transactions."
                          ) : chain.securityScore > 80 ? (
                            "Very secure. Suitable for most transaction types."
                          ) : chain.securityScore > 70 ? (
                            "Secure. Appropriate for moderate value transactions."
                          ) : chain.securityScore > 60 ? (
                            "Moderately secure. Consider additional validation for high-value transactions."
                          ) : (
                            "Security concerns detected. Consider using an alternative chain for important transactions."
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#242424] border-[#333]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Security Recommendations</CardTitle>
                  <CardDescription className="text-gray-400">
                    Optimizing security across chains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {comparisonData && (
                      <>
                        <div className="p-3 bg-[#1A1A1A] rounded-md">
                          <div className="flex items-center mb-2">
                            <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                            <span className="text-white">Most secure chain</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            {chainData.sort((a, b) => b.securityScore - a.securityScore)[0].chainName} 
                            {" "}currently offers the highest security level with a score of{" "}
                            {chainData.sort((a, b) => b.securityScore - a.securityScore)[0].securityScore}/100.
                            {" "}This chain is {comparisonData.securityDifference.toFixed(0)}% more secure than average.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-[#1A1A1A] rounded-md">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-5 w-5 text-[#6B00D7] mr-2" />
                            <span className="text-white">Security considerations</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            For high-value transactions (&gt;$10,000), prioritize security over transaction costs.
                            For transactions requiring maximum security,{" "}
                            {chainData.sort((a, b) => b.securityScore - a.securityScore)[0].chainName}{" "}
                            is recommended despite higher fees.
                          </p>
                        </div>
                        
                        <div className="p-3 bg-[#1A1A1A] rounded-md">
                          <div className="flex items-center mb-2">
                            <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                            <span className="text-white">Cross-chain security strategy</span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            For optimal security with reasonable fees, consider using{" "}
                            {chainData.find(c => c.chainId === comparisonData.recommendedChain)?.chainName}{" "}
                            as your primary chain, with critical transactions verified on{" "}
                            {chainData.sort((a, b) => b.securityScore - a.securityScore)[0].chainName}{" "}
                            for additional security.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t border-[#333] bg-[#1A1A1A]">
          <div className="w-full flex justify-between items-center">
            <div className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Auto refresh: {refreshInterval}s</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CrossChainMetricsMonitorFixed;