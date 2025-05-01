import React, { useState, useEffect } from 'react';
import { securityServiceAggregator } from '@/lib/cross-chain/SecurityServiceAggregator';
import { ChainStatus, ChainSecurityMetrics } from '@/lib/cross-chain/interfaces';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertCircle, Activity, CheckCircle2, AlertTriangle, ServerCrash, Lock, Network, Shield as ShieldIcon } from 'lucide-react';

type CrossChainSecurityDashboardProps = {
  vaultId?: string;
};

export default function CrossChainSecurityDashboard({ vaultId }: CrossChainSecurityDashboardProps) {
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
    // Periodically update chain statuses
    const fetchChainStatuses = async () => {
      try {
        const statuses = await securityServiceAggregator.getChainStatuses();
        setChainStatuses(statuses);
      } catch (error) {
        console.error('Error fetching chain statuses:', error);
      }
    };

    const fetchSecurityMetrics = async () => {
      try {
        const metrics = await securityServiceAggregator.getSecurityMetrics();
        setSecurityMetrics(metrics);
      } catch (error) {
        console.error('Error fetching security metrics:', error);
      }
    };

    // Initial fetch
    fetchChainStatuses();
    fetchSecurityMetrics();

    // Set up periodic updates
    const statusInterval = setInterval(() => {
      console.log('Updating chain statuses...');
      fetchChainStatuses();
      fetchSecurityMetrics();
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);

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
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 mb-2">
          Triple-Chain Security Dashboard
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Real-time monitoring of Chronos Vault's revolutionary security architecture across Ethereum, Solana, and TON
        </p>
      </div>
      
      {/* Status overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(chainStatuses).map(([chain, status]) => {
          const isActive = status.active && status.synced;
          const chainColor = chain === 'ETH' ? 'bg-blue-500' : chain === 'SOL' ? 'bg-orange-500' : 'bg-green-500';
          const chainBg = chain === 'ETH' ? 'bg-blue-50' : chain === 'SOL' ? 'bg-orange-50' : 'bg-green-50';
          const chainBorder = chain === 'ETH' ? 'border-blue-200' : chain === 'SOL' ? 'border-orange-200' : 'border-green-200';
          const chainText = chain === 'ETH' ? 'text-blue-800' : chain === 'SOL' ? 'text-orange-800' : 'text-green-800';
          
          return (
            <Card key={chain} className={`border ${chainBorder} ${chainBg} overflow-hidden`}>
              <div className={`h-2 w-full ${isActive ? chainColor : 'bg-gray-300'}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className={`text-xl font-bold ${chainText}`}>
                    {chain === 'ETH' ? 'Ethereum' : chain === 'SOL' ? 'Solana' : 'TON'}
                  </CardTitle>
                  <Badge 
                    variant={isActive ? "outline" : "destructive"}
                    className={isActive ? `bg-green-50 text-green-700 border-green-200` : ''}
                  >
                    {status.active ? (status.synced ? 'Operational' : 'Syncing') : 'Offline'}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {chain === 'ETH' && 'Primary Security Layer'}
                  {chain === 'SOL' && 'Speed Verification Layer'}
                  {chain === 'TON' && 'Backup & Recovery Layer'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Block Height</span>
                    <span className="font-medium">{status.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Latency</span>
                    <span className="font-medium">{status.active ? formatLatency(status.latency) : 'N/A'}</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${chainColor}`} 
                        style={{ width: `${status.active ? 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Metrics */}
      <Card className="border-purple-200 shadow-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-xl font-bold text-purple-800 flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Security Metrics
          </CardTitle>
          <CardDescription>
            Real-time security analysis and cross-chain validation statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-2 max-w-md mx-auto">
              <TabsTrigger 
                value="overview" 
                className="text-xs sm:text-sm md:text-base px-1 py-1.5 md:px-3 md:py-2"
              >
                Security Overview
              </TabsTrigger>
              <TabsTrigger 
                value="vaults" 
                className="text-xs sm:text-sm md:text-base px-1 py-1.5 md:px-3 md:py-2"
              >
                Vault Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Cross-Chain Consistency */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Cross-Chain Consistency</h3>
                  <div className="text-3xl font-bold text-purple-800 mb-2">
                    {securityMetrics.crossChainConsistency}%
                  </div>
                  <Progress 
                    value={securityMetrics.crossChainConsistency} 
                    className="h-2 bg-purple-100 [&>div]:bg-purple-600 mb-3"
                  />
                  <p className="text-sm text-purple-700">
                    Measures state synchronization across all chains
                  </p>
                </div>
                
                {/* Security Score */}
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <h3 className="text-lg font-semibold text-pink-900 mb-3">Security Score</h3>
                  <div className="text-3xl font-bold text-pink-800 mb-2">
                    {securityMetrics.securityScore}<span className="text-xl">/100</span>
                  </div>
                  <Progress 
                    value={securityMetrics.securityScore} 
                    className="h-2 bg-pink-100 [&>div]:bg-pink-600 mb-3"
                  />
                  <p className="text-sm text-pink-700">
                    Overall security rating based on multiple factors
                  </p>
                </div>
                
                {/* Transaction Statistics */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Transaction Status</h3>
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {securityMetrics.successfulTransactions + securityMetrics.failedTransactions > 0
                      ? ((
                          securityMetrics.successfulTransactions /
                          (securityMetrics.successfulTransactions + securityMetrics.failedTransactions)
                        ) * 100).toFixed(0)
                      : 0}
                    <span className="text-xl">% Success</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-white/60 p-2 rounded">
                      <div className="text-sm text-blue-600">Successful</div>
                      <div className="font-semibold text-blue-900">{securityMetrics.successfulTransactions}</div>
                    </div>
                    <div className="bg-white/60 p-2 rounded">
                      <div className="text-sm text-red-600">Failed</div>
                      <div className="font-semibold text-red-900">{securityMetrics.failedTransactions}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Protection Status */}
              <div className="mt-6 bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-700" />
                  Protection Status
                </h3>
                
                {Object.values(chainStatuses).every(status => status.active) ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 font-semibold">Triple-Chain Protection Active</AlertTitle>
                    <AlertDescription className="text-green-700">
                      All blockchain security layers are operational and synchronized, providing maximum protection for your vaults.
                    </AlertDescription>
                  </Alert>
                ) : Object.values(chainStatuses).some(status => status.active) ? (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 font-semibold">Partial Protection Active</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Some blockchain security layers are currently unavailable. Your vaults remain secure with reduced redundancy.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Security Alert</AlertTitle>
                    <AlertDescription>
                      All blockchain security layers are offline. Please contact support immediately.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="vaults" className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Risk Distribution */}
                <div className="bg-white rounded-lg p-5 border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Vault Risk Distribution</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">High Risk Vaults</span>
                        <span className="text-sm font-medium">
                          {securityMetrics.highRiskVaults}/{securityMetrics.totalVaults}
                        </span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.highRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2.5 bg-gray-200 [&>div]:bg-red-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Vaults with critical security vulnerabilities requiring immediate attention
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Medium Risk Vaults</span>
                        <span className="text-sm font-medium">
                          {securityMetrics.mediumRiskVaults}/{securityMetrics.totalVaults}
                        </span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.mediumRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2.5 bg-gray-200 [&>div]:bg-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Vaults with security concerns that should be addressed soon
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Low Risk Vaults</span>
                        <span className="text-sm font-medium">
                          {securityMetrics.lowRiskVaults}/{securityMetrics.totalVaults}
                        </span>
                      </div>
                      <Progress 
                        value={securityMetrics.totalVaults > 0 ? (securityMetrics.lowRiskVaults / securityMetrics.totalVaults) * 100 : 0} 
                        className="h-2.5 bg-gray-200 [&>div]:bg-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Vaults with minor security issues or concerns
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Security Architecture */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-purple-800">Triple-Chain Security Architecture</h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Ethereum Security Layer</h4>
                        <p className="text-sm text-blue-600">Primary ownership verification and access control</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-800">Solana Speed Layer</h4>
                        <p className="text-sm text-orange-600">High-frequency monitoring and rapid validation</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">TON Recovery Layer</h4>
                        <p className="text-sm text-green-600">Backup security and emergency recovery operations</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-purple-100">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Network className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-purple-800">Cross-Chain Consensus</h4>
                          <p className="text-sm text-purple-600">Requires validation from multiple chains for enhanced security</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Security Incidents */}
              {securityMetrics.securityIncidents.length > 0 && (
                <div className="mt-6 bg-white rounded-lg p-5 border shadow-sm">
                  <h3 className="text-lg font-semibold mb-4">Recent Security Incidents</h3>
                  
                  <div className="space-y-3">
                    {securityMetrics.securityIncidents.slice(0, 5).map((incident, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
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
                        <div>
                          <div className="font-medium">{incident.type}</div>
                          <div className="text-sm text-gray-500">
                            {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : 'Time unknown'}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={incident.resolved ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}
                        >
                          {incident.resolved ? 'Resolved' : 'Active'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}