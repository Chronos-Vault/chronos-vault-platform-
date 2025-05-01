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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-2">
          Triple-Chain Security Dashboard
        </h2>
        <p className="text-gray-300 max-w-3xl mx-auto">
          Real-time monitoring of Chronos Vault's revolutionary security architecture across Ethereum, Solana, and TON
        </p>
      </div>
      
      {/* Status overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(chainStatuses).map(([chain, status]) => {
          const isActive = status.active && status.synced;
          const chainGradient = chain === 'ETH' ? 'from-blue-600 to-blue-500' : 
                               chain === 'SOL' ? 'from-orange-600 to-orange-500' : 
                               'from-green-600 to-green-500';
          const chainBg = chain === 'ETH' ? 'bg-[#1A1A1A]' : 
                          chain === 'SOL' ? 'bg-[#1A1A1A]' : 
                          'bg-[#1A1A1A]';
          const chainBorder = chain === 'ETH' ? 'border-blue-600/30' : 
                              chain === 'SOL' ? 'border-orange-600/30' : 
                              'border-green-600/30';
          const chainText = chain === 'ETH' ? 'text-blue-400' : 
                            chain === 'SOL' ? 'text-orange-400' : 
                            'text-green-400';
          const statusClass = isActive ? 
            (chain === 'ETH' ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' : 
             chain === 'SOL' ? 'bg-orange-600/20 text-orange-400 border-orange-600/30' : 
             'bg-green-600/20 text-green-400 border-green-600/30') : 
            'bg-red-600/20 text-red-400 border-red-600/30';
          
          return (
            <Card key={chain} className={`bg-gradient-to-br from-[#121212] to-[#1A1A1A] border ${chainBorder} overflow-hidden shadow-lg hover:shadow-[#6B00D7]/10 transition-all group hover:translate-y-[-2px]`}>
              <div className={`h-2 w-full bg-gradient-to-r ${isActive ? chainGradient : 'from-gray-600 to-gray-500'}`}></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className={`text-xl font-bold ${chainText} group-hover:text-[#FF5AF7] transition-all`}>
                    {chain === 'ETH' ? 'Ethereum' : chain === 'SOL' ? 'Solana' : 'TON'}
                  </CardTitle>
                  <Badge 
                    variant="outline"
                    className={`${statusClass}`}
                  >
                    {status.active ? (status.synced ? 'Operational' : 'Syncing') : 'Offline'}
                  </Badge>
                </div>
                <CardDescription className="mt-1 text-gray-300 font-medium">
                  {chain === 'ETH' && 'Primary Security Layer'}
                  {chain === 'SOL' && 'Speed Verification Layer'}
                  {chain === 'TON' && 'Backup & Recovery Layer'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-400">Block Height</span>
                    <span className="font-bold text-white">{status.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-400">Latency</span>
                    <span className="font-bold text-white">{status.active ? formatLatency(status.latency) : 'N/A'}</span>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full bg-gradient-to-r ${isActive ? chainGradient : 'from-gray-700 to-gray-600'}`} 
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
      <Card className="border-[#6B00D7]/20 shadow-xl overflow-hidden bg-gradient-to-br from-[#121212] to-[#1A1A1A] hover:shadow-[#6B00D7]/20 transition-all">
        <div className="h-2 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2 group">
            <div className="rounded-full w-8 h-8 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center transition-all border border-[#6B00D7]/30">
              <ShieldIcon className="h-4 w-4 text-[#FF5AF7]" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">Security Metrics</span>
          </CardTitle>
          <CardDescription className="text-gray-300 font-medium pl-10">
            Real-time security analysis and cross-chain validation statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="overview">
            <TabsList className="w-full grid grid-cols-2 max-w-md mx-auto bg-[#1A1A1A]/50 border border-[#6B00D7]/20 p-1 backdrop-blur-sm">
              <TabsTrigger 
                value="overview" 
                className="text-xs sm:text-sm px-1 py-2 md:px-3 md:py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
              >
                Security Overview
              </TabsTrigger>
              <TabsTrigger 
                value="vaults" 
                className="text-xs sm:text-sm px-1 py-2 md:px-3 md:py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7]/40 data-[state=active]:to-[#FF5AF7]/40 data-[state=active]:border-[#6B00D7]/20 data-[state=active]:shadow-glow data-[state=active]:text-white data-[state=active]:font-medium rounded-md"
              >
                Vault Security
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Cross-Chain Consistency */}
                <Card className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] border border-[#6B00D7]/20 shadow-lg overflow-hidden hover:shadow-[#6B00D7]/20 transition-all group">
                  <div className="h-1 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-80"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 group-hover:text-[#FF5AF7] transition-colors">
                      <Network className="h-5 w-5 text-[#FF5AF7]" />
                      Cross-Chain Consistency
                    </h3>
                    <div className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                      {securityMetrics.crossChainConsistency}%
                    </div>
                    <Progress 
                      value={securityMetrics.crossChainConsistency} 
                      className="h-2.5 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-[#6B00D7] [&>div]:to-[#FF5AF7] mb-3"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Measures state synchronization across all chains
                    </p>
                  </CardContent>
                </Card>
                
                {/* Security Score */}
                <Card className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] border border-[#6B00D7]/20 shadow-lg overflow-hidden hover:shadow-[#6B00D7]/20 transition-all group">
                  <div className="h-1 w-full bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7] opacity-80"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 group-hover:text-[#FF5AF7] transition-colors">
                      <Shield className="h-5 w-5 text-[#FF5AF7]" />
                      Security Score
                    </h3>
                    <div className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#FF5AF7] to-[#6B00D7]">
                      {securityMetrics.securityScore}<span className="text-xl">/100</span>
                    </div>
                    <Progress 
                      value={securityMetrics.securityScore} 
                      className="h-2.5 bg-gray-800 [&>div]:bg-gradient-to-r [&>div]:from-[#FF5AF7] [&>div]:to-[#6B00D7] mb-3"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Overall security rating based on multiple factors
                    </p>
                  </CardContent>
                </Card>
                
                {/* Transaction Statistics */}
                <Card className="bg-gradient-to-br from-[#121212] to-[#1A1A1A] border border-[#6B00D7]/20 shadow-lg overflow-hidden hover:shadow-[#6B00D7]/20 transition-all group">
                  <div className="h-1 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-80"></div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2 group-hover:text-[#FF5AF7] transition-colors">
                      <Activity className="h-5 w-5 text-[#FF5AF7]" />
                      Transaction Status
                    </h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                        {securityMetrics.successfulTransactions + securityMetrics.failedTransactions > 0
                        ? ((
                            securityMetrics.successfulTransactions /
                            (securityMetrics.successfulTransactions + securityMetrics.failedTransactions)
                          ) * 100).toFixed(0)
                        : 0}
                      </span>
                      <span className="text-xl text-white">% Success</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-[#1E1E1E] p-3 rounded border border-[#6B00D7]/20">
                        <div className="text-sm text-[#FF5AF7]">Successful</div>
                        <div className="font-semibold text-white">{securityMetrics.successfulTransactions}</div>
                      </div>
                      <div className="bg-[#1E1E1E] p-3 rounded border border-[#6B00D7]/20">
                        <div className="text-sm text-red-400">Failed</div>
                        <div className="font-semibold text-white">{securityMetrics.failedTransactions}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Protection Status */}
              <Card className="mt-6 bg-gradient-to-br from-[#121212] to-[#1A1A1A] border-[#6B00D7]/20 shadow-lg overflow-hidden hover:shadow-[#6B00D7]/20 transition-all group">
                <div className="h-1 w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] opacity-80"></div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 group-hover:text-[#FF5AF7] transition-colors">
                    <div className="rounded-full w-8 h-8 bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/10 flex items-center justify-center border border-[#6B00D7]/30">
                      <Lock className="h-4 w-4 text-[#FF5AF7]" />
                    </div>
                    Protection Status
                  </h3>
                
                {Object.values(chainStatuses).every(status => status.active) ? (
                  <div className="bg-[#1E1E1E] border border-green-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full w-6 h-6 bg-green-600/20 flex items-center justify-center border border-green-600/30 flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <div>
                        <h4 className="text-green-400 font-semibold text-base">Triple-Chain Protection Active</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          All blockchain security layers are operational and synchronized, providing maximum protection for your vaults.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : Object.values(chainStatuses).some(status => status.active) ? (
                  <div className="bg-[#1E1E1E] border border-amber-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full w-6 h-6 bg-amber-600/20 flex items-center justify-center border border-amber-600/30 flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      </div>
                      <div>
                        <h4 className="text-amber-400 font-semibold text-base">Partial Protection Active</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Some blockchain security layers are currently unavailable. Your vaults remain secure with reduced redundancy.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#1E1E1E] border border-red-600/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full w-6 h-6 bg-red-600/20 flex items-center justify-center border border-red-600/30 flex-shrink-0 mt-0.5">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-red-400 font-semibold text-base">Security Alert</h4>
                        <p className="text-gray-400 text-sm mt-1">
                          All blockchain security layers are offline. Please contact support immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="vaults" className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Risk Distribution */}
                <div className="bg-gray-100 rounded-lg p-5 border border-gray-300 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Vault Risk Distribution</h3>
                  
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
                <div className="mt-6 bg-gray-100 rounded-lg p-5 border border-gray-300 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Security Incidents</h3>
                  
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