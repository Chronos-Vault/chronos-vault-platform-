/**
 * ProofSecurityDashboard Component
 * 
 * This component provides a comprehensive dashboard for monitoring
 * the security and verification status of all vaults in the system.
 */

import { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, AlertCircle, XCircle, 
  Clock, BarChart3, Link, Lock, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VerificationStatus } from '@/hooks/use-proof-verification';

// Types for the dashboard
interface SecurityMetric {
  name: string;
  value: number;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  percentage?: number;
  icon: React.ReactNode;
}

interface VaultSecurityStatus {
  id: number;
  name: string;
  lastVerified: string;
  blockchain: string;
  status: VerificationStatus;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  proofType: string;
  merkleRoot?: string;
}

interface ChainSecurityStatus {
  chain: string;
  securityScore: number;
  lastSync: string;
  nodesOnline: number;
  totalNodes: number;
  latestBlockHeight: number;
  status: 'online' | 'degraded' | 'offline';
}

export function ProofSecurityDashboard() {
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([]);
  const [vaultStatuses, setVaultStatuses] = useState<VaultSecurityStatus[]>([]);
  const [chainStatuses, setChainStatuses] = useState<ChainSecurityStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data fetching
  useEffect(() => {
    // Simulating API call to get security metrics
    setTimeout(() => {
      setSecurityMetrics([
        {
          name: 'Verified Vaults',
          value: 42,
          status: 'success',
          percentage: 87,
          icon: <CheckCircle className="h-4 w-4" />
        },
        {
          name: 'Pending Verification',
          value: 5,
          status: 'warning',
          percentage: 10,
          icon: <Clock className="h-4 w-4" />
        },
        {
          name: 'Verification Failed',
          value: 1,
          status: 'danger',
          percentage: 2,
          icon: <XCircle className="h-4 w-4" />
        },
        {
          name: 'Expired Proofs',
          value: 0,
          status: 'neutral',
          percentage: 0,
          icon: <AlertCircle className="h-4 w-4" />
        }
      ]);

      setVaultStatuses([
        {
          id: 2,
          name: 'Olympic Time Vault - TON',
          lastVerified: '2024-04-16T15:30:00Z',
          blockchain: 'TON',
          status: VerificationStatus.VERIFIED,
          riskLevel: 'low',
          proofType: 'Merkle Proof',
          merkleRoot: 'f7a8b9c7d6e5f4g3h2i1j0k9l8m7n6o5p4q3r2s1t0'
        },
        {
          id: 3,
          name: 'ETH 2028 Vault',
          lastVerified: '2024-04-17T09:15:00Z',
          blockchain: 'Ethereum',
          status: VerificationStatus.VERIFIED,
          riskLevel: 'low',
          proofType: 'Cross-Chain',
          merkleRoot: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
        },
        {
          id: 5,
          name: 'TON-ETH Bridge Reserve',
          lastVerified: '2024-04-16T18:45:00Z',
          blockchain: 'Cross-Chain',
          status: VerificationStatus.PENDING,
          riskLevel: 'medium',
          proofType: 'Cross-Chain',
          merkleRoot: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0'
        },
        {
          id: 8,
          name: 'Solana 2032 Vault',
          lastVerified: '2024-04-15T14:20:00Z',
          blockchain: 'Solana',
          status: VerificationStatus.VERIFIED,
          riskLevel: 'low',
          proofType: 'Merkle Proof',
          merkleRoot: 'z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1'
        },
        {
          id: 12,
          name: 'Arweave Archive Vault',
          lastVerified: '2024-04-14T11:10:00Z',
          blockchain: 'Arweave',
          status: VerificationStatus.FAILED,
          riskLevel: 'high',
          proofType: 'Merkle Proof',
          merkleRoot: 'p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1'
        }
      ]);

      setChainStatuses([
        {
          chain: 'TON',
          securityScore: 98,
          lastSync: '2024-04-17T12:15:30Z',
          nodesOnline: 5,
          totalNodes: 5,
          latestBlockHeight: 32948302,
          status: 'online'
        },
        {
          chain: 'Ethereum',
          securityScore: 97,
          lastSync: '2024-04-17T12:14:22Z',
          nodesOnline: 4,
          totalNodes: 5,
          latestBlockHeight: 19745632,
          status: 'online'
        },
        {
          chain: 'Solana',
          securityScore: 95,
          lastSync: '2024-04-17T12:10:45Z',
          nodesOnline: 3,
          totalNodes: 3,
          latestBlockHeight: 225689741,
          status: 'online'
        },
        {
          chain: 'Arweave',
          securityScore: 92,
          lastSync: '2024-04-17T11:45:18Z',
          nodesOnline: 2,
          totalNodes: 3,
          status: 'degraded',
          latestBlockHeight: 1234567
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: VerificationStatus | 'online' | 'degraded' | 'offline') => {
    switch (status) {
      case VerificationStatus.VERIFIED:
      case 'online':
        return 'bg-green-500 hover:bg-green-600';
      case VerificationStatus.PENDING:
      case 'degraded':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case VerificationStatus.FAILED:
      case 'offline':
        return 'bg-red-500 hover:bg-red-600';
      case VerificationStatus.EXPIRED:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Get risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800';
      case 'medium':
        return 'text-yellow-500 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800';
      case 'high':
        return 'text-orange-500 border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800';
      case 'critical':
        return 'text-red-500 border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800';
      default:
        return 'text-gray-500 border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-800';
    }
  };

  // Shorten hash for display
  const shortenHash = (hash?: string) => {
    if (!hash) return 'Unknown';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // Get status icon
  const getStatusIcon = (status: VerificationStatus | 'online' | 'degraded' | 'offline') => {
    switch (status) {
      case VerificationStatus.VERIFIED:
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case VerificationStatus.PENDING:
      case 'degraded':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case VerificationStatus.FAILED:
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case VerificationStatus.EXPIRED:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Proof of Reservation Verification Status
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Run System Verification
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <span className={`text-${metric.status === 'success' ? 'green' : metric.status === 'warning' ? 'yellow' : metric.status === 'danger' ? 'red' : 'gray'}-500`}>
                  {metric.icon}
                </span>
                {metric.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.percentage !== undefined && (
                <Progress
                  value={metric.percentage}
                  className="h-1 mt-2"
                  indicatorClassName={`bg-${metric.status === 'success' ? 'green' : metric.status === 'warning' ? 'yellow' : metric.status === 'danger' ? 'red' : 'gray'}-500`}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vaults">Vault Status</TabsTrigger>
          <TabsTrigger value="chains">Blockchain Status</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  System Security Status
                </CardTitle>
                <CardDescription>Overall security status of the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Overall Security Score</div>
                      <div className="text-sm font-medium text-green-600">96%</div>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          Verified Vaults
                        </div>
                        <div className="text-2xl font-bold">87%</div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-purple-500" />
                          Chain Security
                        </div>
                        <div className="text-2xl font-bold">98%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recent Security Events</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950/40 rounded border border-green-100 dark:border-green-900">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>System-wide verification completed</span>
                        </div>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-950/40 rounded border border-yellow-100 dark:border-yellow-900">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span>Arweave node synchronization</span>
                        </div>
                        <span className="text-xs text-muted-foreground">5h ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Chain Security Status
                </CardTitle>
                <CardDescription>Blockchain network security metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {chainStatuses.slice(0, 3).map((chain, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${chain.status === 'online' ? 'bg-green-500' : chain.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          <span className="font-medium">{chain.chain}</span>
                        </div>
                        <div className="text-sm font-medium">{chain.securityScore}%</div>
                      </div>
                      <Progress 
                        value={chain.securityScore} 
                        className="h-1.5"
                        indicatorClassName={chain.status === 'online' ? 'bg-green-500' : chain.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Nodes: {chain.nodesOnline}/{chain.totalNodes} online</span>
                        <span>Last synced: {formatDate(chain.lastSync)}</span>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full text-sm" size="sm">
                    View All Chains
                    <ArrowUpRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vaults Tab */}
        <TabsContent value="vaults">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vault Verification Status</CardTitle>
              <CardDescription>
                Security status of all vaults in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Blockchain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead>Proof Type</TableHead>
                    <TableHead>Merkle Root</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vaultStatuses.map((vault) => (
                    <TableRow key={vault.id}>
                      <TableCell className="font-medium">
                        <a href={`/vault-details?id=${vault.id}`} className="hover:underline flex items-center gap-1">
                          {vault.name}
                          <Link className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>{vault.blockchain}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {getStatusIcon(vault.status)}
                          <Badge className={getStatusColor(vault.status)}>
                            {vault.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getRiskColor(vault.riskLevel)}`}>
                          {vault.riskLevel}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(vault.lastVerified)}</TableCell>
                      <TableCell>{vault.proofType}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="font-mono text-xs">
                              {shortenHash(vault.merkleRoot)}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-mono text-xs break-all max-w-xs">{vault.merkleRoot}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Chains Tab */}
        <TabsContent value="chains">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Blockchain Network Status</CardTitle>
              <CardDescription>
                Security and operational status of connected blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {chainStatuses.map((chain, index) => (
                  <Card key={index} className={`border-l-4 ${
                    chain.status === 'online' 
                      ? 'border-l-green-500' 
                      : chain.status === 'degraded' 
                        ? 'border-l-yellow-500' 
                        : 'border-l-red-500'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            chain.status === 'online' 
                              ? 'bg-green-500' 
                              : chain.status === 'degraded' 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}></div>
                          {chain.chain}
                        </CardTitle>
                        <Badge className={getStatusColor(chain.status)}>
                          {chain.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Security Score</span>
                            <span className="font-medium">{chain.securityScore}%</span>
                          </div>
                          <Progress 
                            value={chain.securityScore} 
                            className="h-2"
                            indicatorClassName={
                              chain.securityScore > 95 
                                ? 'bg-green-500' 
                                : chain.securityScore > 90 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Nodes Online:</span>
                            <span className="float-right font-medium">
                              {chain.nodesOnline}/{chain.totalNodes}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Last Sync:</span>
                            <span className="float-right font-medium">
                              {formatDate(chain.lastSync)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Latest Block:</span>
                            <span className="float-right font-medium">
                              {chain.latestBlockHeight.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Verification:</span>
                            <span className="float-right font-medium text-green-500">
                              Passing
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}