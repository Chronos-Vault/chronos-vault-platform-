import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Clock, Activity } from "lucide-react";
import { useMultiChain, BlockchainIcon, BlockchainType as UIBlockchainType } from "@/contexts/multi-chain-context";
import { BlockchainType, SecurityIncident, SecurityRiskLevel } from '@/lib/cross-chain/interfaces';
import { bridgeService } from '@/lib/cross-chain/bridge';

// Mock security data - in a real app this would come from a service
const mockSecurityData = {
  overallStatus: "healthy", // healthy, warning, critical
  networks: [
    {
      blockchain: "ETH" as BlockchainType,
      status: "healthy" as "healthy" | "warning" | "critical",
      riskLevel: SecurityRiskLevel.LOW,
      activeThreats: 0,
      healthScore: 92,
      timestamp: Date.now()
    },
    {
      blockchain: "TON" as BlockchainType,
      status: "healthy" as "healthy" | "warning" | "critical",
      riskLevel: SecurityRiskLevel.LOW,
      activeThreats: 0,
      healthScore: 95,
      timestamp: Date.now()
    },
    {
      blockchain: "SOL" as BlockchainType,
      status: "warning" as "healthy" | "warning" | "critical",
      riskLevel: SecurityRiskLevel.MEDIUM,
      activeThreats: 1,
      healthScore: 78,
      timestamp: Date.now(),
      lastIncident: {
        id: "incident-1",
        type: "network_congestion",
        blockchain: "SOL",
        description: "Increased network congestion affecting transaction finality",
        severity: SecurityRiskLevel.MEDIUM,
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: "active",
        mitigationSteps: [
          "Routing transactions through alternative validators",
          "Implementing additional confirmation requirements"
        ]
      }
    },
    {
      blockchain: "MATIC" as BlockchainType,
      status: "healthy" as "healthy" | "warning" | "critical",
      riskLevel: SecurityRiskLevel.LOW,
      activeThreats: 0,
      healthScore: 90,
      timestamp: Date.now()
    },
    {
      blockchain: "BNB" as BlockchainType,
      status: "healthy" as "healthy" | "warning" | "critical",
      riskLevel: SecurityRiskLevel.LOW,
      activeThreats: 0,
      healthScore: 89,
      timestamp: Date.now()
    }
  ],
  recentIncidents: [
    {
      id: "incident-1",
      type: "network_congestion",
      blockchain: "SOL",
      description: "Increased network congestion affecting transaction finality",
      severity: SecurityRiskLevel.MEDIUM,
      timestamp: Date.now() - 3600000, // 1 hour ago
      status: "active",
      mitigationSteps: [
        "Routing transactions through alternative validators",
        "Implementing additional confirmation requirements"
      ]
    },
    {
      id: "incident-2",
      type: "liquidity_shortage",
      blockchain: "BNB",
      description: "Temporary liquidity shortage in CVT/BNB pair",
      severity: SecurityRiskLevel.LOW,
      timestamp: Date.now() - 86400000, // 1 day ago
      status: "resolved",
      mitigationSteps: [
        "Added liquidity from reserve pool",
        "Implemented circuit breaker to prevent flash crashes"
      ]
    },
    {
      id: "incident-3",
      type: "network_congestion",
      blockchain: "ETH",
      description: "High gas prices due to NFT launch",
      severity: SecurityRiskLevel.LOW,
      timestamp: Date.now() - 172800000, // 2 days ago
      status: "resolved",
      mitigationSteps: [
        "Implemented gas price ceiling for transfers",
        "Temporarily routed through Polygon for small transfers"
      ]
    }
  ]
};

interface SecurityDashboardProps {
  address?: string;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ address }) => {
  const { activeChain } = useMultiChain();
  const [securityData, setSecurityData] = useState(mockSecurityData);
  
  // Get risk level badge color
  const getRiskLevelBadge = (level: SecurityRiskLevel) => {
    switch(level) {
      case SecurityRiskLevel.HIGH:
        return <Badge variant="destructive" className="bg-red-600">High Risk</Badge>;
      case SecurityRiskLevel.MEDIUM:
        return <Badge variant="default" className="bg-amber-500">Medium Risk</Badge>;
      case SecurityRiskLevel.LOW:
        return <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">Low Risk</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">No Risk</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical':
        return <Badge variant="destructive" className="bg-red-600">Critical</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-amber-500">Warning</Badge>;
      case 'healthy':
        return <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30">Healthy</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  // Format timestamp to relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return `${Math.floor(diff / 86400000)} days ago`;
  };
  
  // Get health score color
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return '[&>div]:bg-green-500';
    if (score >= 70) return '[&>div]:bg-amber-500';
    return '[&>div]:bg-red-500';
  };
  
  // Function to get simplified chain name without redundancy
  const getChainDisplayName = (blockchain: BlockchainType): string => {
    switch(blockchain) {
      case 'TON': return 'TON';
      case 'SOL': return 'Solana';
      case 'ETH': return 'Ethereum';
      case 'MATIC': return 'Polygon';
      case 'BNB': return 'Binance';
      default: return blockchain;
    }
  };
  
  // Convert API blockchain type to UI blockchain type
  const convertToUIBlockchainType = (blockchain: BlockchainType): UIBlockchainType => {
    switch(blockchain) {
      case 'TON': return UIBlockchainType.TON;
      case 'SOL': return UIBlockchainType.SOLANA;
      case 'ETH': return UIBlockchainType.ETHEREUM;
      default: return UIBlockchainType.TON; // Default fallback
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Overall Security Status */}
      <Card className="border-purple-900/30 backdrop-blur-sm bg-black/40 max-w-3xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-xl sm:text-2xl justify-center">
            <Shield className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
            Security Dashboard
          </CardTitle>
          <CardDescription className="text-center">
            Real-time security status across supported chains
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-3 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Status - Visible on both mobile and desktop */}
            <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between bg-gray-900/30 rounded-lg p-3 sm:p-4 border border-purple-900/30">
              <div className="flex items-center mb-2 sm:mb-0">
                <h3 className="text-base sm:text-lg font-medium">Overall Status:</h3>
                <div className="ml-2">
                  {securityData.overallStatus === "healthy" && (
                    <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/30 flex items-center">
                      <ShieldCheck className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Secure
                    </Badge>
                  )}
                  {securityData.overallStatus === "warning" && (
                    <Badge variant="default" className="bg-amber-500 flex items-center">
                      <AlertTriangle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Caution
                    </Badge>
                  )}
                  {securityData.overallStatus === "critical" && (
                    <Badge variant="destructive" className="bg-red-600 flex items-center">
                      <ShieldAlert className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      Alert
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 flex items-center">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" />
                Last updated: Just now
              </p>
            </div>
            
            {/* Left column - Alerts */}
            <div className="space-y-3 sm:space-y-4">
              {/* Active incidents */}
              {securityData.networks.find(n => n.activeThreats > 0) && (
                <Alert className="bg-amber-500/10 border-amber-500/30 py-2 px-3 sm:p-4">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertTitle className="text-amber-500 text-sm sm:text-base">Active Incidents Detected</AlertTitle>
                  <AlertDescription className="text-xs sm:text-sm">
                    There are active security incidents. 
                    Review details before transfers.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Recent incidents */}
              <div>
                <h3 className="text-sm sm:text-lg font-medium mb-2">Recent Incidents</h3>
                <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {securityData.recentIncidents.map(incident => (
                    <div 
                      key={incident.id}
                      className="p-2 sm:p-3 rounded-lg border border-purple-900/30 bg-gray-900/30"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <BlockchainIcon chainId={convertToUIBlockchainType(incident.blockchain as BlockchainType)} size="sm" />
                            <span className="font-medium text-xs sm:text-sm">{getChainDisplayName(incident.blockchain as BlockchainType)}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">{incident.description}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          {getRiskLevelBadge(incident.severity)}
                          <span className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatRelativeTime(incident.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {incident.status === 'active' && incident.mitigationSteps && (
                        <div className="mt-2 text-xs sm:text-sm">
                          <div className="text-amber-400 font-medium">Mitigation in progress:</div>
                          <ul className="list-disc list-inside text-gray-400 mt-1">
                            {incident.mitigationSteps.map((step, i) => (
                              <li key={i} className="line-clamp-2">{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {incident.status === 'resolved' && (
                        <div className="mt-2 flex items-center text-xs sm:text-sm text-green-400">
                          <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Resolved
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right column - Network Status */}
            <div className="overflow-hidden">
              <h3 className="text-sm sm:text-lg font-medium mb-2">Network Status</h3>
              <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-purple-900/30">
                      <TableHead className="w-[100px] py-2 px-2 sm:px-4 text-xs sm:text-sm">Network</TableHead>
                      <TableHead className="py-2 px-2 sm:px-4 text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-right py-2 px-2 sm:px-4 text-xs sm:text-sm">Health</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityData.networks.map(network => (
                      <TableRow key={network.blockchain} className="hover:bg-gray-900/30 border-purple-900/30">
                        <TableCell className="font-medium py-2 px-2 sm:px-4">
                          <div className="flex items-center gap-2">
                            <BlockchainIcon chainId={convertToUIBlockchainType(network.blockchain)} size="sm" />
                            <span className="text-xs sm:text-sm">{getChainDisplayName(network.blockchain)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 px-2 sm:px-4">
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(network.status)}
                            {network.activeThreats > 0 && (
                              <span className="text-xs text-amber-400 flex items-center mt-1">
                                <Activity className="h-3 w-3 mr-1" />
                                {network.activeThreats} issue{network.activeThreats > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 px-2 sm:px-4">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium text-xs sm:text-sm">{network.healthScore}</span>
                            <Progress 
                              value={network.healthScore} 
                              max={100} 
                              className={`h-1.5 sm:h-2 w-16 sm:w-24 ${getHealthScoreColor(network.healthScore)}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {address && (
                <div className="mt-3 text-xs sm:text-sm text-gray-400">
                  <p>Monitoring: {address.substring(0, 4)}...{address.substring(address.length - 4)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;