/**
 * Cross-Chain Security Dashboard
 * 
 * A comprehensive visual dashboard showing the health, status and synchronization
 * of the multi-chain security architecture for the Chronos Vault platform.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
  Shield,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';

// Import shared types
import { 
  BlockchainType, 
  SecurityLevel, 
  RecoveryStrategy,
  SecurityDashboardStatus,
  ChainStatus
} from '@shared/types';

// Default status for initial state
const DEFAULT_STATUS: SecurityDashboardStatus = {
  chainStatuses: {
    'ETH': {
      blockchain: 'ETH',
      isAvailable: true,
      latency: 150,
      lastBlockNumber: 20143587,
      lastSyncTimestamp: Date.now() - 60000
    },
    'SOL': {
      blockchain: 'SOL',
      isAvailable: true,
      latency: 80,
      lastBlockNumber: 234587921,
      lastSyncTimestamp: Date.now() - 30000
    },
    'TON': {
      blockchain: 'TON',
      isAvailable: true,
      latency: 200,
      lastBlockNumber: 5432100,
      lastSyncTimestamp: Date.now() - 90000
    },
    'BTC': {
      blockchain: 'BTC',
      isAvailable: true,
      latency: 350,
      lastBlockNumber: 789101,
      lastSyncTimestamp: Date.now() - 120000
    }
  },
  primaryChain: 'ETH',
  securityLevel: SecurityLevel.ADVANCED,
  crossChainSyncStatus: {
    isSynced: true,
    syncPercentage: 98,
    lastSyncTime: Date.now() - 180000
  },
  activeFailovers: [],
  securityAlerts: []
};

export default function CrossChainSecurityDashboard() {
  const [status, setStatus] = useState<SecurityDashboardStatus>(DEFAULT_STATUS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityStatus = async () => {
      try {
        setIsLoading(true);
        
        // Fetch security status from the backend API
        const response = await apiRequest('GET', '/api/security/status');
        
        if (!response.ok) {
          throw new Error('Failed to fetch security status');
        }
        
        const securityStatus = await response.json();
        
        // Update the status with the data from the API
        setStatus(securityStatus);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch security status:', err);
        setError('Failed to load security data. Please try again later.');
        // Keep the current status data
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch the initial data
    fetchSecurityStatus();
    
    // Set up polling to refresh data every 15 seconds
    const intervalId = setInterval(fetchSecurityStatus, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to get the security level name
  const getSecurityLevelName = (level: SecurityLevel): string => {
    switch (level) {
      case SecurityLevel.BASIC:
        return 'Basic';
      case SecurityLevel.ADVANCED:
        return 'Advanced';
      case SecurityLevel.MAXIMUM:
        return 'Maximum';
      default:
        return 'Unknown';
    }
  };

  // Helper function to get the recovery strategy name
  const getRecoveryStrategyName = (strategy: RecoveryStrategy): string => {
    switch (strategy) {
      case RecoveryStrategy.NONE:
        return 'None';
      case RecoveryStrategy.SWITCH_PRIMARY:
        return 'Switch Primary Chain';
      case RecoveryStrategy.PARTIAL_VERIFICATION:
        return 'Partial Verification';
      case RecoveryStrategy.EMERGENCY_PROTOCOL:
        return 'Emergency Protocol';
      case RecoveryStrategy.RETRY:
        return 'Retry';
      default:
        return 'Unknown';
    }
  };

  // Helper function to format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };



  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Triple-Chain Security Dashboard</h1>
        <p className="text-gray-400">
          Comprehensive monitoring of the cross-chain security architecture
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-[#6B00D7]" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="border-2 border-red-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main content */}
      {!isLoading && !error && (
        <>
          {/* Status overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall security status */}
            <Card className="border-[#6B00D7]/30 bg-gradient-to-b from-[#6B00D7]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-[#6B00D7]" />
                  <span>Security Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {status.crossChainSyncStatus.isSynced ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                    )}
                    <span className="text-xl font-semibold">
                      {status.crossChainSyncStatus.isSynced ? 'Secured' : 'Warning'}
                    </span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={
                      status.securityLevel === SecurityLevel.MAXIMUM 
                        ? "bg-green-500/20 text-green-500 border border-green-500/50" 
                        : status.securityLevel === SecurityLevel.ADVANCED
                          ? "bg-blue-500/20 text-blue-500 border border-blue-500/50"
                          : "bg-amber-500/20 text-amber-500 border border-amber-500/50"
                    }
                  >
                    {getSecurityLevelName(status.securityLevel)} Level
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-gray-400 mb-1 flex justify-between">
                    <span>Cross-Chain Sync</span>
                    <span>{status.crossChainSyncStatus.syncPercentage}%</span>
                  </div>
                  <Progress 
                    value={status.crossChainSyncStatus.syncPercentage} 
                    className={`h-2 bg-gray-700 ${
                      status.crossChainSyncStatus.syncPercentage > 95
                        ? "bg-green-500"
                        : status.crossChainSyncStatus.syncPercentage > 80
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }`}
                  />
                  <div className="mt-2 text-xs text-gray-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Last sync: {formatDate(status.crossChainSyncStatus.lastSyncTime)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Primary chain */}
            <Card className="border-[#6B00D7]/30 bg-gradient-to-b from-[#6B00D7]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <div className={`p-1 rounded-full ${status.chainStatuses[status.primaryChain].isAvailable ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {getBlockchainIcon(status.primaryChain, 'h-4 w-4')}
                  </div>
                  <span>Primary Chain</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{getBlockchainName(status.primaryChain)}</span>
                  <ChainStatusBadge status={status.chainStatuses[status.primaryChain]} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Block Height</span>
                    <span>{status.chainStatuses[status.primaryChain].lastBlockNumber?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Latency</span>
                    <span>{formatLatency(status.chainStatuses[status.primaryChain].latency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Update</span>
                    <span>{formatDate(status.chainStatuses[status.primaryChain].lastSyncTimestamp)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security alerts */}
            <Card className="border-[#6B00D7]/30 bg-gradient-to-b from-[#6B00D7]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-[#6B00D7]" />
                  <span>Security Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{status.securityAlerts.length}</span>
                  <Badge 
                    variant="secondary"
                    className={
                      status.securityAlerts.some(a => a.severity === 'critical' && !a.resolved)
                        ? "bg-red-500/20 text-red-500 border border-red-500/50" 
                        : status.securityAlerts.some(a => a.severity === 'high' && !a.resolved)
                          ? "bg-amber-500/20 text-amber-500 border border-amber-500/50"
                          : "bg-green-500/20 text-green-500 border border-green-500/50"
                    }
                  >
                    {
                      status.securityAlerts.some(a => a.severity === 'critical' && !a.resolved)
                        ? "Critical Issues" 
                        : status.securityAlerts.some(a => a.severity === 'high' && !a.resolved)
                          ? "Warnings"
                          : "All Clear"
                    }
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {status.securityAlerts.length > 0 ? (
                    status.securityAlerts
                      .filter(alert => !alert.resolved)
                      .slice(0, 2)
                      .map(alert => (
                        <div 
                          key={alert.id} 
                          className={`text-sm p-2 rounded-md ${
                            alert.severity === 'critical' 
                              ? 'bg-red-500/10 border border-red-500/30' 
                              : alert.severity === 'high'
                                ? 'bg-amber-500/10 border border-amber-500/30'
                                : alert.severity === 'medium'
                                  ? 'bg-yellow-500/10 border border-yellow-500/30'
                                  : 'bg-blue-500/10 border border-blue-500/30'
                          }`}
                        >
                          <div className="flex items-start">
                            {alert.severity === 'critical' && <AlertCircle className="h-4 w-4 text-red-500 mr-1 mt-0.5 flex-shrink-0" />}
                            {alert.severity === 'high' && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" />}
                            {alert.severity === 'medium' && <AlertCircle className="h-4 w-4 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />}
                            {alert.severity === 'low' && <AlertCircle className="h-4 w-4 text-blue-500 mr-1 mt-0.5 flex-shrink-0" />}
                            <span>{alert.message}</span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatDate(alert.timestamp)}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No active alerts
                    </div>
                  )}
                  {status.securityAlerts.length > 2 && (
                    <div className="text-center text-sm text-[#FF5AF7]">
                      +{status.securityAlerts.filter(a => !a.resolved).length - 2} more alerts
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active failovers */}
            <Card className="border-[#6B00D7]/30 bg-gradient-to-b from-[#6B00D7]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-[#6B00D7]" />
                  <span>Failover Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">{status.activeFailovers.length}</span>
                  <Badge 
                    variant="secondary"
                    className={
                      status.activeFailovers.length > 0
                        ? "bg-amber-500/20 text-amber-500 border border-amber-500/50" 
                        : "bg-green-500/20 text-green-500 border border-green-500/50"
                    }
                  >
                    {status.activeFailovers.length > 0 ? "Active" : "None"}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {status.activeFailovers.length > 0 ? (
                    status.activeFailovers.slice(0, 2).map(failover => (
                      <div 
                        key={failover.vaultId} 
                        className="text-sm p-2 rounded-md bg-amber-500/10 border border-amber-500/30"
                      >
                        <div className="flex items-start">
                          <RefreshCw className="h-4 w-4 text-amber-500 mr-1 mt-0.5 flex-shrink-0" />
                          <div>
                            <div>From {getBlockchainName(failover.primaryChain)} to {failover.fallbackChain ? getBlockchainName(failover.fallbackChain) : 'Unknown'}</div>
                            <div className="text-xs text-gray-400">
                              Strategy: {getRecoveryStrategyName(failover.strategy)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(failover.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No active failovers
                    </div>
                  )}
                  {status.activeFailovers.length > 2 && (
                    <div className="text-center text-sm text-[#FF5AF7]">
                      +{status.activeFailovers.length - 2} more failovers
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chain status grid */}
          <h2 className="text-xl font-bold mt-8 mb-4">
            Chain Health Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.keys(status.chainStatuses).map((chain) => (
              <ChainStatusCard 
                key={chain} 
                chain={chain as BlockchainType} 
                status={status.chainStatuses[chain as BlockchainType]}
                isPrimary={chain === status.primaryChain}
              />
            ))}
          </div>

          {/* Security alerts table */}
          {status.securityAlerts.length > 0 && (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">
                Security Alerts & Events
              </h2>
              <Card className="border-[#6B00D7]/30">
                <CardContent className="p-4">
                  <div className="rounded-md overflow-auto max-h-96">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Message</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status.securityAlerts.map(alert => (
                          <tr key={alert.id} className="border-b border-gray-800/60 hover:bg-gray-800/20">
                            <td className="py-3 px-4">
                              <Badge 
                                className={
                                  alert.severity === 'critical' 
                                    ? "bg-red-500/20 text-red-500 border border-red-500/50" 
                                    : alert.severity === 'high'
                                      ? "bg-amber-500/20 text-amber-500 border border-amber-500/50"
                                      : alert.severity === 'medium'
                                        ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50"
                                        : "bg-blue-500/20 text-blue-500 border border-blue-500/50"
                                }
                              >
                                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{alert.message}</td>
                            <td className="py-3 px-4 text-gray-400">{formatDate(alert.timestamp)}</td>
                            <td className="py-3 px-4">
                              <Badge variant={alert.resolved ? "outline" : "secondary"}>
                                {alert.resolved ? "Resolved" : "Active"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Failover events */}
          {status.activeFailovers.length > 0 && (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">
                Active Failover Events
              </h2>
              <Card className="border-[#6B00D7]/30">
                <CardContent className="p-4">
                  <div className="rounded-md overflow-auto max-h-96">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Vault ID</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Chains</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Strategy</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Reason</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status.activeFailovers.map(failover => (
                          <tr key={failover.vaultId} className="border-b border-gray-800/60 hover:bg-gray-800/20">
                            <td className="py-3 px-4">{failover.vaultId}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-800 mr-2">
                                  {getBlockchainIcon(failover.primaryChain, 'h-3 w-3')}
                                </span>
                                <ArrowUpDown className="h-3 w-3 mx-1 text-gray-400" />
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-800 ml-1">
                                  {failover.fallbackChain ? getBlockchainIcon(failover.fallbackChain, 'h-3 w-3') : '?'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getRecoveryStrategyName(failover.strategy)}</td>
                            <td className="py-3 px-4 text-gray-400">{failover.reason}</td>
                            <td className="py-3 px-4 text-gray-400">{formatDate(failover.timestamp)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

// Supporting component for chain status cards
function ChainStatusCard({ 
  chain, 
  status, 
  isPrimary 
}: { 
  chain: BlockchainType; 
  status: ChainStatus; 
  isPrimary: boolean;
}) {
  return (
    <Card 
      className={`border-[#6B00D7]/30 ${
        isPrimary 
          ? 'bg-gradient-to-b from-[#6B00D7]/10 to-transparent' 
          : ''
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getBlockchainIcon(chain, 'h-5 w-5')}
            <span>{getBlockchainName(chain)}</span>
          </div>
          {isPrimary && (
            <Badge className="bg-[#6B00D7]/20 text-[#6B00D7] border border-[#6B00D7]/50">
              Primary
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <ChainStatusBadge status={status} />
          <span className="text-sm text-gray-400">
            {formatLatency(status.latency)}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Block Height</span>
            <span>{status.lastBlockNumber?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Last Update</span>
            <span>{formatDate(status.lastSyncTimestamp)}</span>
          </div>
          {status.error && (
            <div className="mt-2 text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/30">
              Error: {status.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Chain status badge
function ChainStatusBadge({ status }: { status: ChainStatus }) {
  return (
    <Badge 
      variant="secondary"
      className={
        !status.isAvailable
          ? "bg-red-500/20 text-red-500 border border-red-500/50" 
          : status.latency > 300
            ? "bg-amber-500/20 text-amber-500 border border-amber-500/50"
            : "bg-green-500/20 text-green-500 border border-green-500/50"
      }
    >
      {!status.isAvailable
        ? "Unavailable" 
        : status.latency > 300
          ? "Slow"
          : "Healthy"
      }
    </Badge>
  );
}

// Format latency display
function formatLatency(latency: number): string {
  return `${latency} ms`;
}

// Get blockchain name
function getBlockchainName(chain: BlockchainType): string {
  switch (chain) {
    case 'ETH': return 'Ethereum';
    case 'SOL': return 'Solana';
    case 'TON': return 'TON';
    case 'BTC': return 'Bitcoin';
    default: return 'Unknown';
  }
}

// Get blockchain icon
function getBlockchainIcon(chain: BlockchainType, className: string = 'h-5 w-5'): JSX.Element {
  switch (chain) {
    case 'ETH':
      return <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#627EEA"/>
        <path d="M16.498 4V12.87L23.995 16.219L16.498 4Z" fill="white" fillOpacity="0.6"/>
        <path d="M16.498 4L9 16.219L16.498 12.87V4Z" fill="white"/>
        <path d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z" fill="white" fillOpacity="0.6"/>
        <path d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z" fill="white"/>
        <path d="M16.498 20.573L23.995 16.219L16.498 12.872V20.573Z" fill="white" fillOpacity="0.2"/>
        <path d="M9 16.219L16.498 20.573V12.872L9 16.219Z" fill="white" fillOpacity="0.6"/>
      </svg>;
    case 'SOL':
      return <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M64.9392 237.281L108.423 264.439C109.843 265.33 111.481 265.815 113.156 265.815H387.098C390.235 265.815 391.655 262.034 389.304 259.92L345.812 222.743C344.392 221.852 342.754 221.367 341.079 221.367H67.2816C64.1448 221.367 62.7245 225.148 64.9392 237.281Z" fill="url(#paint0_linear_1_36)"/>
        <path d="M64.9392 72.8018L108.423 40.6248C109.843 39.7337 111.481 39.2488 113.156 39.2488H387.098C390.235 39.2488 391.655 43.0296 389.304 45.1439L345.812 77.3302C344.392 78.2212 342.754 78.7061 341.079 78.7061H67.2816C64.1448 78.7061 62.7245 74.9253 64.9392 72.8018Z" fill="url(#paint1_linear_1_36)"/>
        <path d="M345.812 155.114L108.423 150.272C109.843 149.381 111.481 148.896 113.156 148.896H387.098C390.235 148.896 391.655 152.677 389.304 154.791L345.812 191.968C344.392 192.859 342.754 193.344 341.079 193.344H67.2816C64.1448 193.344 62.7245 189.564 64.9392 187.449L345.812 155.114Z" fill="url(#paint2_linear_1_36)"/>
        <defs>
        <linearGradient id="paint0_linear_1_36" x1="382.977" y1="48.0292" x2="169.588" y2="399.913" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1_36" x1="273.046" y1="-17.0019" x2="59.6574" y2="334.881" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint2_linear_1_36" x1="327.77" y1="15.235" x2="114.381" y2="367.119" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00FFA3"/>
        <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        </defs>
      </svg>;
    case 'TON':
      return <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z" fill="#0098EA"/>
        <path d="M16.061 34.964H18.3659C18.6659 34.964 18.7817 34.6466 18.7817 34.4449C18.7817 34.1275 18.7817 23.4866 18.7817 23.4866C18.7817 22.7189 19.1312 22.6331 19.3733 22.6331H28.2861C28.6356 22.6331 28.9093 22.9677 28.9093 23.285V34.4621C28.9093 34.7795 29.0251 34.9811 29.3251 34.9811H31.63C31.93 34.9811 32.0458 34.6638 32.0458 34.4621V19.5162C32.0458 18.9459 31.6963 18.7442 31.3469 18.7442C25.6335 18.7442 17.4233 18.7442 16.7243 18.7442C16.1411 18.7442 16.0253 19.0444 16.0253 19.2632V34.4621C16.0452 34.7795 16.061 34.964 16.061 34.964Z" fill="white"/>
        <path d="M20.4475 15.1536C20.4475 14.4887 20.9154 13.7895 21.7295 13.7895H26.0366C26.7659 13.7895 27.351 14.3427 27.351 15.1536V18.0267H30.7183V14.7716C30.7183 12.9038 29.3251 12 27.4649 12H20.3317C18.3846 12 17.1072 13.1008 17.1072 14.7716V18.0267H20.4476C20.4475 18.0267 20.4475 16.4487 20.4475 15.1536Z" fill="white"/>
      </svg>;
    case 'BTC':
      return <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F7931A"/>
        <path d="M23.189 14.02C23.503 11.924 21.906 10.797 19.723 10.045L20.352 7.748L18.918 7.35L18.306 9.581C17.909 9.484 17.499 9.392 17.092 9.3L17.708 7.054L16.274 6.656L15.645 8.953C15.316 8.878 14.994 8.804 14.683 8.726L14.685 8.716L12.662 8.172L12.25 9.719C12.25 9.719 13.293 9.964 13.272 9.982C13.971 10.159 14.094 10.636 14.074 11.018L13.356 13.627C13.403 13.638 13.461 13.654 13.525 13.677L13.351 13.633L12.344 17.199C12.26 17.414 12.044 17.741 11.558 17.618C11.571 17.642 10.536 17.355 10.536 17.355L9.766 19.033L11.679 19.545C12.041 19.635 12.394 19.729 12.741 19.819L12.104 22.146L13.536 22.543L14.166 20.241C14.578 20.349 14.977 20.448 15.368 20.542L14.741 22.832L16.175 23.23L16.812 20.909C19.792 21.429 22.026 21.227 22.915 18.535C23.633 16.355 22.815 15.105 21.218 14.296C22.362 14.055 23.213 13.337 23.189 14.02ZM19.896 17.468C19.385 19.648 15.858 18.43 14.74 18.158L15.59 15.066C16.707 15.34 20.433 15.205 19.896 17.468ZM20.408 14.002C19.94 15.979 17.032 14.942 16.098 14.717L16.87 11.92C17.805 12.145 20.899 11.951 20.408 14.002Z" fill="white"/>
      </svg>;
    default:
      return <div className={className} />;
  }
}