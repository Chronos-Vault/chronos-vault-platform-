import React, { useState, useEffect } from 'react';
import { securityServiceAggregator } from '@/lib/cross-chain/SecurityServiceAggregator';
import { ChainStatus, ChainSecurityMetrics } from '@/lib/cross-chain/interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertCircle, Activity, CheckCircle2, AlertTriangle, ServerCrash } from 'lucide-react';

export default function CrossChainSecurityDashboard() {
  const [chainStatuses, setChainStatuses] = useState<Record<string, ChainStatus>>({
    ETH: { active: false, blockHeight: 0, latency: 0, synced: false },
    SOL: { active: false, blockHeight: 0, latency: 0, synced: false },
    TON: { active: false, blockHeight: 0, latency: 0, synced: false }
  });
  
  const [securityMetrics, setSecurityMetrics] = useState<ChainSecurityMetrics>({
    highRiskVaults: 0,
    mediumRiskVaults: 0,
    lowRiskVaults: 0,
    totalVaults: 0,
    failedTransactions: 0,
    successfulTransactions: 0,
    securityScore: 0,
    crossChainConsistency: 0,
    securityIncidents: []
  });

  useEffect(() => {
    // Initial load
    updateDashboardData();
    
    // Set up interval to refresh data every 5 seconds
    const intervalId = setInterval(updateDashboardData, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const updateDashboardData = async () => {
    try {
      // Get chain statuses
      const statuses = await securityServiceAggregator.getChainStatuses();
      setChainStatuses(statuses);
      
      // Get security metrics
      const metrics = await securityServiceAggregator.getSecurityMetrics();
      setSecurityMetrics(metrics);
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  };

  const getChainStatusIndicator = (status: ChainStatus) => {
    if (!status.active) {
      return <ServerCrash className="h-5 w-5 text-red-500" />;
    }
    
    if (!status.synced) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  const formatLatency = (latency: number) => {
    if (latency < 1000) {
      return `${latency.toFixed(0)} ms`;
    }
    return `${(latency / 1000).toFixed(1)} s`;
  };

  return (
    <div className="space-y-6">
      {/* Chain Statuses */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-800/5 to-pink-600/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-700" />
            Cross-Chain Status
          </CardTitle>
          <CardDescription>
            Real-time status of blockchains in our Triple-Chain Security architecture
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(chainStatuses).map(([chain, status]) => (
              <div key={chain} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{chain}</h3>
                  <div className="flex items-center">
                    {getChainStatusIndicator(status)}
                    <span className="ml-2">
                      {status.active ? (status.synced ? 'Operational' : 'Syncing') : 'Offline'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Block Height:</span>
                    <span className="font-medium">
                      {status.blockHeight > 0 ? status.blockHeight.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Latency:</span>
                    <span className="font-medium">
                      {status.active ? formatLatency(status.latency) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Security Role:</span>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${chain === 'ETH' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                        ${chain === 'SOL' ? 'bg-orange-100 text-orange-800 border-orange-300' : ''}
                        ${chain === 'TON' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                      `}
                    >
                      {chain === 'ETH' && 'Primary Security'}
                      {chain === 'SOL' && 'Speed Verification'}
                      {chain === 'TON' && 'Backup & Recovery'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h3 className="font-semibold">Cross-Chain Consistency</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consistency Score:</span>
                <span className="font-medium">{securityMetrics.crossChainConsistency}%</span>
              </div>
              
              <Progress 
                value={securityMetrics.crossChainConsistency} 
                className={`h-2 bg-gray-200 ${securityMetrics.crossChainConsistency >= 90 ? '[&>div]:bg-green-500' : ''}
                ${securityMetrics.crossChainConsistency >= 70 && securityMetrics.crossChainConsistency < 90 ? '[&>div]:bg-amber-500' : ''}
                ${securityMetrics.crossChainConsistency < 70 ? '[&>div]:bg-red-500' : ''}`}
              />
              
              <p className="text-sm text-gray-500 mt-1">
                Cross-chain consistency measures how well synchronized the state is across all blockchains.
                A score below 90% may indicate network issues or potential security problems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Security Metrics */}
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-800/5 to-pink-600/5 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-700" />
            Security Metrics
          </CardTitle>
          <CardDescription>
            Key security indicators and transaction statistics
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="transactions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions" className="px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base">Transactions</TabsTrigger>
              <TabsTrigger value="vaults" className="px-2 py-1.5 md:px-3 md:py-2 text-sm md:text-base">Vault Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transactions" className="py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Transaction Success Rate</h3>
                  <div className="flex items-end">
                    <span className="text-3xl font-bold">
                      {securityMetrics.totalVaults > 0
                        ? ((
                            securityMetrics.successfulTransactions /
                            (securityMetrics.successfulTransactions + securityMetrics.failedTransactions)
                          ) * 100).toFixed(1)
                        : 0}
                      <span className="text-xl">%</span>
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4">
                    <div>
                      <span className="text-xs text-gray-500">Successful</span>
                      <div className="font-semibold">{securityMetrics.successfulTransactions}</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Failed</span>
                      <div className="font-semibold text-red-600">{securityMetrics.failedTransactions}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Overall Security Score</h3>
                  <div className="flex items-end mb-2">
                    <span className="text-3xl font-bold">
                      {securityMetrics.securityScore}
                      <span className="text-xl">/100</span>
                    </span>
                  </div>
                  <Progress 
                    value={securityMetrics.securityScore} 
                    className={`h-2 bg-gray-200 ${securityMetrics.securityScore >= 80 ? '[&>div]:bg-green-500' : ''}
                      ${securityMetrics.securityScore >= 60 && securityMetrics.securityScore < 80 ? '[&>div]:bg-amber-500' : ''}
                      ${securityMetrics.securityScore < 60 ? '[&>div]:bg-red-500' : ''}`}
                  />
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Recent Security Incidents</h3>
                  {securityMetrics.securityIncidents.length > 0 ? (
                    <div className="space-y-2">
                      {securityMetrics.securityIncidents.slice(0, 3).map((incident, index) => (
                        <div key={index} className="text-sm">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${incident.severity === 'high' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                              ${incident.severity === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : ''}
                              ${incident.severity === 'low' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                            `}
                          >
                            {incident.severity}
                          </Badge>
                          <span className="ml-2">{incident.type}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">No recent incidents detected</div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="vaults" className="py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Vault Risk Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>High Risk</span>
                        <span>{securityMetrics.highRiskVaults}</span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.highRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2 bg-gray-200 [&>div]:bg-red-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Medium Risk</span>
                        <span>{securityMetrics.mediumRiskVaults}</span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.mediumRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2 bg-gray-200 [&>div]:bg-amber-500"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Low Risk</span>
                        <span>{securityMetrics.lowRiskVaults}</span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.lowRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2 bg-gray-200 [&>div]:bg-green-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Cross-Chain Security Status</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Security Architecture</h4>
                      <p className="text-sm text-gray-600">
                        Chronos Vault implements a Triple-Chain Security architecture where each blockchain serves a specific security role. 
                        Ethereum provides primary security and ownership records, Solana delivers high-speed transaction monitoring, 
                        and TON ensures backup and recovery capabilities.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Current Protection Status</h4>
                      {Object.values(chainStatuses).every(status => status.active) ? (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-800">Fully Protected</AlertTitle>
                          <AlertDescription className="text-green-700">
                            All chains in the Triple-Chain Security architecture are operational and synchronized.
                          </AlertDescription>
                        </Alert>
                      ) : Object.values(chainStatuses).some(status => status.active) ? (
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertTitle className="text-amber-800">Partially Protected</AlertTitle>
                          <AlertDescription className="text-amber-700">
                            Some chains in the Triple-Chain Security architecture are offline or experiencing issues.
                            Your vaults remain secure, but with reduced redundancy.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Security Alert</AlertTitle>
                          <AlertDescription>
                            All chains in the Triple-Chain Security architecture are currently offline.
                            Please contact support immediately.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
