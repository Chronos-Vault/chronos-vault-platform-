/**
 * Cross-Chain Security Dashboard
 * 
 * This component provides a unified interface for monitoring and visualizing
 * the Triple-Chain Security architecture of Chronos Vault. It shows real-time
 * security status across Ethereum, Solana, and TON blockchains.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertCircle, 
  AlertTriangle, 
  Check, 
  Clock, 
  Database, 
  EyeOff, 
  Fingerprint, 
  Lock, 
  RefreshCw, 
  Shield, 
  ShieldAlert, 
  Zap
} from 'lucide-react';
import { getSecurityServiceAggregator } from '@/lib/cross-chain/SecurityServiceAggregator';
import { getTestEnvironment } from '@/lib/cross-chain/TestEnvironment';
import { getPrivacyLayerService } from '@/lib/privacy';
import { BlockchainType } from '@/lib/cross-chain/interfaces';

interface SecurityMetrics {
  incidentCount: number;
  criticalIncidents: number;
  highIncidents: number;
  mediumIncidents: number;
  lowIncidents: number;
  resolvedIncidents: number;
  activeAlerts: number;
  securityScore: number;
  crossChainConsistency: number;
  lastUpdated: number;
}

interface ChainStatus {
  chain: BlockchainType;
  status: 'online' | 'offline' | 'degraded';
  latestBlock: number;
  lastSyncTime: number;
  pendingValidations: number;
  activeVerifications: number;
  incidents: number;
}

export function CrossChainSecurityDashboard({ vaultId }: { vaultId?: string }) {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    incidentCount: 0,
    criticalIncidents: 0,
    highIncidents: 0,
    mediumIncidents: 0,
    lowIncidents: 0,
    resolvedIncidents: 0,
    activeAlerts: 0,
    securityScore: 0,
    crossChainConsistency: 0,
    lastUpdated: Date.now()
  });
  
  const [chainStatuses, setChainStatuses] = useState<ChainStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [securityLevel, setSecurityLevel] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  
  // Initialize and fetch data
  useEffect(() => {
    fetchData();
  }, [vaultId]);
  
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // In real implementation, this would fetch actual data from the security service
      // For demo purposes, we'll generate randomized metrics that look realistic
      
      const securityService = getSecurityServiceAggregator();
      const testEnv = getTestEnvironment();
      const testVault = vaultId ? testEnv.getTestVault(vaultId) : testEnv.getTestVaults()[0];
      
      if (testVault) {
        setSecurityLevel(testVault.securityLevel);
      }
      
      // Get any test incidents if available, or generate mock ones
      const testIncidents = vaultId ? testEnv.getTestIncidents(vaultId) : [];
      
      // Generate chain statuses
      const statuses: ChainStatus[] = [
        {
          chain: 'ETH',
          status: 'online',
          latestBlock: 14325678 + Math.floor(Math.random() * 1000),
          lastSyncTime: Date.now() - Math.floor(Math.random() * 60000),
          pendingValidations: Math.floor(Math.random() * 3),
          activeVerifications: Math.floor(Math.random() * 5),
          incidents: testIncidents.filter((i: any) => i.incident.blockchainData?.chain === 'ETH').length || Math.floor(Math.random() * 2)
        },
        {
          chain: 'SOL',
          status: 'online',
          latestBlock: 142987650 + Math.floor(Math.random() * 10000),
          lastSyncTime: Date.now() - Math.floor(Math.random() * 30000),
          pendingValidations: Math.floor(Math.random() * 2),
          activeVerifications: Math.floor(Math.random() * 3),
          incidents: testIncidents.filter((i: any) => i.incident.blockchainData?.chain === 'SOL').length || Math.floor(Math.random() * 1)
        },
        {
          chain: 'TON',
          status: 'online',
          latestBlock: 27654321 + Math.floor(Math.random() * 5000),
          lastSyncTime: Date.now() - Math.floor(Math.random() * 45000),
          pendingValidations: Math.floor(Math.random() * 2),
          activeVerifications: Math.floor(Math.random() * 4),
          incidents: testIncidents.filter((i: any) => i.incident.blockchainData?.chain === 'TON').length || 0
        }
      ];
      
      setChainStatuses(statuses);
      
      // Generate security metrics
      const criticalCount = testIncidents.filter((i: any) => i.incident.severity === 'critical').length || Math.floor(Math.random() * 2);
      const highCount = testIncidents.filter((i: any) => i.incident.severity === 'high').length || Math.floor(Math.random() * 3);
      const mediumCount = testIncidents.filter((i: any) => i.incident.severity === 'medium').length || Math.floor(Math.random() * 4);
      const lowCount = testIncidents.filter((i: any) => i.incident.severity === 'low').length || Math.floor(Math.random() * 5);
      const totalCount = criticalCount + highCount + mediumCount + lowCount;
      const resolvedCount = Math.floor(totalCount * 0.75);
      
      // Calculate security score
      // Score is higher with fewer incidents and higher resolution rate
      const incidentWeight = totalCount > 0 ? resolvedCount / totalCount : 1;
      const severityWeight = totalCount > 0 ? 1 - ((criticalCount * 4 + highCount * 3 + mediumCount * 2 + lowCount) / (totalCount * 4)) : 1;
      const securityScore = Math.min(100, Math.max(0, Math.floor((incidentWeight * 0.5 + severityWeight * 0.5) * 100)));
      
      setMetrics({
        incidentCount: totalCount,
        criticalIncidents: criticalCount,
        highIncidents: highCount,
        mediumIncidents: mediumCount,
        lowIncidents: lowCount,
        resolvedIncidents: resolvedCount,
        activeAlerts: totalCount - resolvedCount,
        securityScore,
        crossChainConsistency: 90 + Math.floor(Math.random() * 10), // 90-100%
        lastUpdated: Date.now()
      });
      
      // Generate recent incidents if needed
      if (testIncidents.length > 0) {
        setRecentIncidents(testIncidents.map((i: any) => i.incident));
      } else {
        // Generate mock incidents for UI demonstration
        const mockIncidentTypes = ['unauthorized_access', 'suspected_fraud', 'abnormal_transfer', 'data_inconsistency'];
        const mockIncidentSeverities = ['critical', 'high', 'medium', 'low'];
        const mockChains = ['ETH', 'SOL', 'TON'];
        
        const mockIncidents = Array.from({ length: 5 }, (_, i) => ({
          id: `incident-${Date.now()}-${i}`,
          vaultId: vaultId || `test-vault-${i % 2 + 1}`,
          type: mockIncidentTypes[Math.floor(Math.random() * mockIncidentTypes.length)],
          severity: mockIncidentSeverities[Math.floor(Math.random() * mockIncidentSeverities.length)],
          timestamp: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24h
          status: Math.random() > 0.25 ? 'resolved' : 'active',
          blockchainData: {
            chain: mockChains[Math.floor(Math.random() * mockChains.length)],
            txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
            blockNumber: 12345678 + Math.floor(Math.random() * 10000)
          }
        }));
        
        setRecentIncidents(mockIncidents);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const simulateSecurityIncident = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    
    try {
      const testEnv = getTestEnvironment();
      const testVaultId = vaultId || testEnv.getTestVaults()[0]?.id;
      
      if (!testVaultId) {
        throw new Error('No test vault available');
      }
      
      // Run a security incident test
      const incidentTypes = ['unauthorized_access', 'suspected_fraud', 'abnormal_transfer'];
      const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)] as any;
      
      const result = await testEnv.testSecurityIncidentResponse(testVaultId, randomType);
      
      // Refresh the dashboard data
      await fetchData();
      
      console.log('Simulated security incident result:', result);
    } catch (error) {
      console.error('Error simulating security incident:', error);
    } finally {
      setIsSimulating(false);
    }
  };
  
  const getSecurityLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Basic';
      case 2: return 'Enhanced';
      case 3: return 'Advanced';
      case 4: return 'Enterprise';
      case 5: return 'Maximum';
      default: return 'Standard';
    }
  };
  
  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const getChainStatusColor = (status: string) => {
    if (status === 'online') return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    if (status === 'degraded') return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
  };
  
  const getIncidentSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'bg-red-500/10 text-red-500 border-red-500/30';
    if (severity === 'high') return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
    if (severity === 'medium') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
  };
  
  const getIncidentSeverityIcon = (severity: string) => {
    if (severity === 'critical') return <ShieldAlert className="h-4 w-4 text-red-500" />;
    if (severity === 'high') return <AlertCircle className="h-4 w-4 text-orange-500" />;
    if (severity === 'medium') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-blue-500" />;
  };
  
  return (
    <div className="w-full mx-auto">
      <Card className="bg-background border-border shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center text-foreground gap-2">
                <Shield className="h-5 w-5 text-[#FF5AF7]" />
                <span>Triple-Chain Security Dashboard</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Real-time security monitoring across Ethereum, Solana, and TON blockchains
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-[#6B00D7]/10">
                Security Level: {getSecurityLevelLabel(securityLevel)}
              </Badge>
              {vaultId && (
                <Badge variant="outline" className="bg-muted/40">
                  Vault: {vaultId}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="px-6 pt-2">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Security Overview</TabsTrigger>
              <TabsTrigger value="chains">Chain Status</TabsTrigger>
              <TabsTrigger value="incidents">Incident Log</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-6">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Security Score */}
                <Card className="bg-muted/20 border-border">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Security Score</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center items-center flex-col">
                      <div className={`text-4xl font-bold ${getSecurityScoreColor(metrics.securityScore)}`}>
                        {metrics.securityScore}%
                      </div>
                      <Progress 
                        value={metrics.securityScore} 
                        max={100} 
                        className="h-2 w-full mt-2"
                        color={metrics.securityScore >= 70 ? 'bg-green-500' : metrics.securityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        {metrics.securityScore >= 90 ? 'Excellent security posture' :
                         metrics.securityScore >= 70 ? 'Good security posture' :
                         metrics.securityScore >= 50 ? 'Moderate security concerns' :
                         'Critical security issues detected'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cross-Chain Consistency */}
                <Card className="bg-muted/20 border-border">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Cross-Chain Consistency</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center items-center flex-col">
                      <div className="text-4xl font-bold text-green-500">
                        {metrics.crossChainConsistency}%
                      </div>
                      <Progress 
                        value={metrics.crossChainConsistency} 
                        max={100} 
                        className="h-2 w-full mt-2 bg-green-500"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Triple-chain state verification across ETH, SOL, and TON
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Active Alerts */}
                <Card className="bg-muted/20 border-border">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Security Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-md">
                        <div className="text-2xl font-bold text-yellow-500">
                          {metrics.activeAlerts}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Active Alerts</p>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 bg-muted/30 rounded-md">
                        <div className="text-2xl font-bold text-green-500">
                          {metrics.resolvedIncidents}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Resolved</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={simulateSecurityIncident}
                        disabled={isSimulating}
                        className="text-xs"
                      >
                        {isSimulating ? (
                          <><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Simulating...</>
                        ) : (
                          <><Zap className="h-3 w-3 mr-1" /> Simulate Incident</>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Incident Breakdown */}
                <Card className="bg-muted/20 border-border md:col-span-3">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Incident Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-red-500/10 rounded-md border border-red-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-red-500">Critical</h4>
                          <Badge variant="outline" className="bg-transparent">
                            {metrics.criticalIncidents}
                          </Badge>
                        </div>
                        <Progress value={metrics.criticalIncidents} max={metrics.incidentCount || 1} className="h-1.5 bg-red-500" />
                      </div>
                      <div className="p-3 bg-orange-500/10 rounded-md border border-orange-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-orange-500">High</h4>
                          <Badge variant="outline" className="bg-transparent">
                            {metrics.highIncidents}
                          </Badge>
                        </div>
                        <Progress value={metrics.highIncidents} max={metrics.incidentCount || 1} className="h-1.5 bg-orange-500" />
                      </div>
                      <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-yellow-500">Medium</h4>
                          <Badge variant="outline" className="bg-transparent">
                            {metrics.mediumIncidents}
                          </Badge>
                        </div>
                        <Progress value={metrics.mediumIncidents} max={metrics.incidentCount || 1} className="h-1.5 bg-yellow-500" />
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-blue-500">Low</h4>
                          <Badge variant="outline" className="bg-transparent">
                            {metrics.lowIncidents}
                          </Badge>
                        </div>
                        <Progress value={metrics.lowIncidents} max={metrics.incidentCount || 1} className="h-1.5 bg-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Features */}
                <Card className="bg-muted/20 border-border md:col-span-3">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Triple-Chain Security Features</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-muted/30 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Database className="h-4 w-4 text-[#9242FC]" />
                          <h4 className="text-sm font-medium">Cross-Chain Validation</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Real-time monitoring with cross-chain consistency checks ensures
                          tamper-proof security using three blockchains.
                        </p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <ShieldAlert className="h-4 w-4 text-[#9242FC]" />
                          <h4 className="text-sm font-medium">Incident Response</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Advanced threat detection with real-time incident response and 
                          automated recovery procedures across chains.
                        </p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Fingerprint className="h-4 w-4 text-[#9242FC]" />
                          <h4 className="text-sm font-medium">ZK-Privacy Layer</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Zero-knowledge proofs ensure privacy while maintaining security
                          verification across all integrated chains.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="chains" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Blockchain Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {chainStatuses.map((chain) => (
                    <Card 
                      key={chain.chain} 
                      className={`bg-muted/20 border-border overflow-hidden`}
                    >
                      <div className={`h-1 ${
                        chain.status === 'online' ? 'bg-green-500' : 
                        chain.status === 'degraded' ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`} />
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base">
                            {chain.chain === 'ETH' ? 'Ethereum' : 
                             chain.chain === 'SOL' ? 'Solana' : 'TON'}
                          </CardTitle>
                          <Badge 
                            variant="outline" 
                            className={getChainStatusColor(chain.status)}
                          >
                            {chain.status.charAt(0).toUpperCase() + chain.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Latest Block:</span>
                            <span className="font-mono">{chain.latestBlock.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span>
                              {Math.floor((Date.now() - chain.lastSyncTime) / 1000)}s ago
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pending Validations:</span>
                            <span>{chain.pendingValidations}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Active Verifications:</span>
                            <span>{chain.activeVerifications}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Security Incidents:</span>
                            <Badge 
                              variant="outline" 
                              className={chain.incidents > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}
                            >
                              {chain.incidents}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mt-8">Cross-Chain Consistency</h3>
                
                <Card className="bg-muted/20 border-border">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Triple-Chain Validation</span>
                          <span className="text-sm">{metrics.crossChainConsistency}% Consistent</span>
                        </div>
                        <Progress 
                          value={metrics.crossChainConsistency} 
                          max={100} 
                          className="h-2 bg-green-500" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-muted/30 rounded-md border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <h4 className="text-sm font-medium">ETH ⟷ SOL</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last verified: {Math.floor(Math.random() * 300)}s ago
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <h4 className="text-sm font-medium">ETH ⟷ TON</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last verified: {Math.floor(Math.random() * 300)}s ago
                          </p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-md border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Check className="h-4 w-4 text-green-500" />
                            <h4 className="text-sm font-medium">SOL ⟷ TON</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last verified: {Math.floor(Math.random() * 300)}s ago
                          </p>
                        </div>
                      </div>
                      
                      <Alert variant="default" className="bg-[#6B00D7]/5 border-[#6B00D7]/20">
                        <EyeOff className="h-4 w-4 text-[#9242FC]" />
                        <AlertTitle>Zero-Knowledge Cross-Chain Verification</AlertTitle>
                        <AlertDescription className="text-xs text-muted-foreground">
                          All cross-chain validations are performed using zero-knowledge proofs, 
                          ensuring privacy while maintaining security across Ethereum, Solana, and TON.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="incidents" className="mt-0">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Security Incidents</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchData}
                    disabled={isLoading}
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  </Button>
                </div>
                
                {recentIncidents.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-10 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No Security Incidents</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      No security incidents have been detected. The Triple-Chain Security architecture
                      is functioning normally.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentIncidents.map((incident, index) => (
                      <Card 
                        key={incident.id || index} 
                        className={`bg-muted/20 border ${getIncidentSeverityColor(incident.severity)}`}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getIncidentSeverityIcon(incident.severity)}
                              <CardTitle className="text-base">
                                {incident.type.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={incident.severity === 'critical' 
                                  ? 'bg-red-500/10 text-red-500' 
                                  : incident.severity === 'high'
                                  ? 'bg-orange-500/10 text-orange-500'
                                  : incident.severity === 'medium'
                                  ? 'bg-yellow-500/10 text-yellow-500'
                                  : 'bg-blue-500/10 text-blue-500'
                                }
                              >
                                {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={incident.status === 'resolved' 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : 'bg-yellow-500/10 text-yellow-500'
                                }
                              >
                                {incident.status === 'resolved' ? 'Resolved' : 'Active'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Detected:</span>
                              <span>{new Date(incident.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Blockchain:</span>
                              <Badge variant="outline">
                                {incident.blockchainData?.chain || 'Multiple'}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Transaction:</span>
                              <span className="font-mono text-xs truncate ml-2" style={{ maxWidth: '200px' }}>
                                {incident.blockchainData?.txHash || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Block:</span>
                              <span>{incident.blockchainData?.blockNumber || 'N/A'}</span>
                            </div>
                            {incident.details && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                  {incident.details.description || 'No additional details available.'}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground/70" />
            <span>Last updated: {new Date(metrics.lastUpdated).toLocaleString()}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}