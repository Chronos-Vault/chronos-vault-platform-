/**
 * Cross-Chain Security Dashboard
 * 
 * A comprehensive visual dashboard showing the health, status and synchronization
 * of the multi-chain security architecture for the Chronos Vault platform.
 */
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Shield, 
  ShieldAlert, 
  Zap,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
// Define types locally until they are properly imported
type BlockchainType = 'ETH' | 'SOL' | 'TON' | 'BTC';

enum SecurityLevel {
  BASIC = 0,
  ADVANCED = 1,
  MAXIMUM = 2
}

enum RecoveryStrategy {
  NONE = 0,
  SWITCH_PRIMARY = 1,
  PARTIAL_VERIFICATION = 2,
  EMERGENCY_PROTOCOL = 3,
  RETRY = 4
}

// Chain status interface
interface ChainStatus {
  blockchain: BlockchainType;
  isAvailable: boolean;
  latency: number;
  lastBlockNumber?: number;
  lastSyncTimestamp: number;
  error?: string;
}

// Security Dashboard Status
interface SecurityDashboardStatus {
  chainStatuses: Record<BlockchainType, ChainStatus>;
  primaryChain: BlockchainType;
  securityLevel: SecurityLevel;
  crossChainSyncStatus: {
    isSynced: boolean;
    syncPercentage: number;
    lastSyncTime: number;
  };
  activeFailovers: {
    vaultId: string;
    primaryChain: BlockchainType;
    fallbackChain?: BlockchainType;
    strategy: RecoveryStrategy;
    reason: string;
    timestamp: number;
  }[];
  securityAlerts: {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: number;
    resolved: boolean;
  }[];
}

const DEFAULT_STATUS: SecurityDashboardStatus = {
  chainStatuses: {
    'ETH': {
      blockchain: 'ETH',
      isAvailable: true,
      latency: 150,
      lastBlockNumber: 12345678,
      lastSyncTimestamp: Date.now() - 60000
    },
    'SOL': {
      blockchain: 'SOL',
      isAvailable: true,
      latency: 75,
      lastBlockNumber: 98765432,
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
        
        // In a real app, this would fetch from the backend
        const response = await apiRequest('GET', '/api/security/status');
        const securityStatus = await response.json();
        
        // In development mode, we'll just simulate random status changes
        simulateStatusChanges();
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load security status');
        setIsLoading(false);
        console.error('Failed to fetch security status:', err);
      }
    };

    // Simulate status changes in development mode
    const simulateStatusChanges = () => {
      // Create a deep copy of the current status
      const newStatus = JSON.parse(JSON.stringify(status));
      
      // Randomly update blockchain availability
      Object.keys(newStatus.chainStatuses).forEach(chain => {
        if (Math.random() < 0.1) {
          // 10% chance to flip availability
          newStatus.chainStatuses[chain].isAvailable = !newStatus.chainStatuses[chain].isAvailable;
        }
        
        // Update latency
        newStatus.chainStatuses[chain].latency = Math.floor(50 + Math.random() * 400);
        
        // Update last sync timestamp
        newStatus.chainStatuses[chain].lastSyncTimestamp = Date.now() - Math.floor(Math.random() * 300000);
        
        // Increment block number
        if (newStatus.chainStatuses[chain].lastBlockNumber) {
          newStatus.chainStatuses[chain].lastBlockNumber += Math.floor(Math.random() * 10) + 1;
        }
      });
      
      // Randomly trigger failover
      if (Math.random() < 0.05 && newStatus.activeFailovers.length < 2) {
        // 5% chance to add a failover
        const unavailableChain = Object.keys(newStatus.chainStatuses).find(
          chain => !newStatus.chainStatuses[chain].isAvailable
        );
        
        if (unavailableChain) {
          newStatus.activeFailovers.push({
            vaultId: `vault-${Math.floor(Math.random() * 1000)}`,
            primaryChain: unavailableChain as BlockchainType,
            fallbackChain: 'TON',
            strategy: RecoveryStrategy.SWITCH_PRIMARY,
            reason: `${unavailableChain} chain is unavailable`,
            timestamp: Date.now()
          });
        }
      }
      
      // Randomly add security alerts
      if (Math.random() < 0.03 && newStatus.securityAlerts.length < 3) {
        // 3% chance to add an alert
        const severity = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical';
        const messages = [
          'Unusual transaction pattern detected',
          'Delayed cross-chain verification',
          'Multiple failed verification attempts',
          'Potential cross-chain consensus conflict',
          'Bridge operation timeout'
        ];
        
        newStatus.securityAlerts.push({
          id: `alert-${Date.now()}`,
          severity,
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: Date.now(),
          resolved: false
        });
      }
      
      // Update cross-chain sync status
      newStatus.crossChainSyncStatus.syncPercentage = Math.min(100, 85 + Math.floor(Math.random() * 15));
      newStatus.crossChainSyncStatus.lastSyncTime = Date.now() - Math.floor(Math.random() * 300000);
      newStatus.crossChainSyncStatus.isSynced = newStatus.crossChainSyncStatus.syncPercentage > 95;
      
      setStatus(newStatus);
    };

    // Initial fetch
    fetchSecurityStatus();
    
    // Set up interval for periodic updates
    const intervalId = setInterval(fetchSecurityStatus, 15000);
    
    return () => clearInterval(intervalId);
  }, [status]);

  const formatTimeDifference = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} min ago`;
    } else {
      return `${Math.floor(diff / 3600000)} hr ago`;
    }
  };

  const getLatencyClass = (latency: number): string => {
    if (latency < 100) return 'text-green-500';
    if (latency < 250) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSecurityLevelName = (level: SecurityLevel): string => {
    switch (level) {
      case SecurityLevel.BASIC: return 'Basic';
      case SecurityLevel.ADVANCED: return 'Advanced';
      case SecurityLevel.MAXIMUM: return 'Maximum';
      default: return 'Unknown';
    }
  };

  const getRecoveryStrategyName = (strategy: RecoveryStrategy): string => {
    switch (strategy) {
      case RecoveryStrategy.NONE: return 'None';
      case RecoveryStrategy.SWITCH_PRIMARY: return 'Switch Primary';
      case RecoveryStrategy.PARTIAL_VERIFICATION: return 'Partial Verification';
      case RecoveryStrategy.EMERGENCY_PROTOCOL: return 'Emergency Protocol';
      case RecoveryStrategy.RETRY: return 'Retry';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-lg">
        <h3 className="font-semibold">Error Loading Security Dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
          Triple-Chain Security Dashboard
        </h2>
        <Badge 
          variant={status.crossChainSyncStatus.isSynced ? "outline" : "destructive"} 
          className={status.crossChainSyncStatus.isSynced ? "border-green-500 text-green-500" : ""}
        >
          {status.crossChainSyncStatus.isSynced ? "Synchronized" : "Synchronizing..."}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.values(status.chainStatuses).map((chainStatus) => (
          <Card key={chainStatus.blockchain} className={`overflow-hidden ${!chainStatus.isAvailable ? 'border-red-300' : 'border-gray-200'}`}>
            <div className={`h-1.5 w-full ${chainStatus.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {chainStatus.blockchain === 'ETH' && (
                    <div className="rounded-full bg-blue-100 p-1">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 128 128">
                        <path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm19.1 100.5L64 75.4l-19.3 25.1-10.2-15.5 29.5-38.4 29.7 38.4-10.6 15.5zM63.7 35.9L44.6 60.8h38.1L63.7 35.9z"/>
                      </svg>
                    </div>
                  )}
                  {chainStatus.blockchain === 'SOL' && (
                    <div className="rounded-full bg-purple-100 p-1">
                      <svg className="w-6 h-6 text-purple-600" viewBox="0 0 397.7 311.7">
                        <path fill="currentColor" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-163.7c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm317.4-58.2H73.8c-3.4 0-6.7 1.3-9.2 3.8L1.9 82.5c-4.1 4.1-1.2 11.1 4.6 11.1h317.4c3.4 0 6.7-1.3 9.2-3.8l62.7-62.7c4.1-4.1 1.2-11.1-4.6-11.1z" />
                      </svg>
                    </div>
                  )}
                  {chainStatus.blockchain === 'TON' && (
                    <div className="rounded-full bg-blue-100 p-1">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 48 48">
                        <path fill="currentColor" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2.13 26.26l-8.57-8.57c-.19-.19-.19-.51 0-.7l2.83-2.83c.19-.19.51-.19.7 0l5.04 5.04 10.17-10.17c.19-.19.51-.19.7 0l2.83 2.83c.19.19.19.51 0 .7L22.57 30.26c-.19.19-.5.19-.7 0z" />
                      </svg>
                    </div>
                  )}
                  {chainStatus.blockchain === 'BTC' && (
                    <div className="rounded-full bg-orange-100 p-1">
                      <svg className="w-6 h-6 text-orange-600" viewBox="0 0 512 512">
                        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z" />
                      </svg>
                    </div>
                  )}
                  {chainStatus.blockchain}
                </div>
                <div>
                  {chainStatus.isAvailable ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent>Chain is available and responding</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <XCircle className="text-red-500 h-5 w-5" />
                        </TooltipTrigger>
                        <TooltipContent>Chain is currently unavailable</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                {chainStatus.blockchain === status.primaryChain && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    Primary Chain
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Latency:</span>
                <span className={getLatencyClass(chainStatus.latency)}>
                  {chainStatus.latency}ms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Block:</span>
                <span>{chainStatus.lastBlockNumber?.toLocaleString() || 'N/A'}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="text-xs text-muted-foreground">
                Last updated: {formatTimeDifference(chainStatus.lastSyncTimestamp)}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Level Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-semibold">
                {getSecurityLevelName(status.securityLevel)}
              </span>
              <Badge 
                variant={status.securityLevel === SecurityLevel.MAXIMUM ? "default" : "outline"}
                className={status.securityLevel === SecurityLevel.MAXIMUM ? "bg-purple-600" : ""}
              >
                {status.securityLevel === SecurityLevel.BASIC ? "Standard" : 
                 status.securityLevel === SecurityLevel.ADVANCED ? "Enhanced" : "Maximum"}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  {status.securityLevel >= SecurityLevel.BASIC ? "Time-lock Protection" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${status.securityLevel >= SecurityLevel.ADVANCED ? "text-green-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${status.securityLevel >= SecurityLevel.ADVANCED ? "" : "text-muted-foreground"}`}>
                  Cross-Chain Verification
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${status.securityLevel >= SecurityLevel.MAXIMUM ? "text-green-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${status.securityLevel >= SecurityLevel.MAXIMUM ? "" : "text-muted-foreground"}`}>
                  Zero-Knowledge Proofs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 ${status.securityLevel >= SecurityLevel.MAXIMUM ? "text-green-500" : "text-muted-foreground"}`} />
                <span className={`text-sm ${status.securityLevel >= SecurityLevel.MAXIMUM ? "" : "text-muted-foreground"}`}>
                  Triple-Chain Consensus
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Cross-Chain Sync Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Cross-Chain Synchronization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Sync Progress</span>
                <span className="text-sm font-medium">{status.crossChainSyncStatus.syncPercentage}%</span>
              </div>
              <Progress value={status.crossChainSyncStatus.syncPercentage} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={status.crossChainSyncStatus.isSynced ? "outline" : "secondary"} className={status.crossChainSyncStatus.isSynced ? "border-green-500 text-green-500" : ""}>
                  {status.crossChainSyncStatus.isSynced ? "Fully Synced" : "Synchronizing..."}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Sync:</span>
                <span>{formatTimeDifference(status.crossChainSyncStatus.lastSyncTime)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Active Failovers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Active Failovers
            </CardTitle>
            <CardDescription>
              {status.activeFailovers.length > 0 
                ? `${status.activeFailovers.length} failover${status.activeFailovers.length > 1 ? 's' : ''} active` 
                : 'No active failovers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status.activeFailovers.length > 0 ? (
              <div className="space-y-4">
                {status.activeFailovers.map((failover) => (
                  <div key={failover.vaultId} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-medium">{failover.vaultId}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Strategy:</span>
                        <span className="font-medium">{getRecoveryStrategyName(failover.strategy)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Chain:</span>
                        <span>{failover.primaryChain}</span>
                        {failover.fallbackChain && (
                          <>
                            <ArrowRight className="h-3 w-3 mx-1" />
                            <span>{failover.fallbackChain}</span>
                          </>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{formatTimeDifference(failover.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Shield className="h-10 w-10 text-green-500 mb-2" />
                <p className="text-muted-foreground">All chains operating normally</p>
                <p className="text-xs text-muted-foreground mt-1">No failover actions required</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Security Alerts
          </CardTitle>
          <CardDescription>
            {status.securityAlerts.length > 0 
              ? `${status.securityAlerts.length} active alert${status.securityAlerts.length > 1 ? 's' : ''}` 
              : 'No active security alerts'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status.securityAlerts.length > 0 ? (
            <div className="space-y-3">
              {status.securityAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${getSeverityColor(alert.severity)}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${getSeverityColor(alert.severity)} bg-opacity-20 border-0 text-black`}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeDifference(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-24 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
              <p className="text-muted-foreground">No security alerts detected</p>
              <p className="text-xs text-muted-foreground mt-1">System operating securely</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Auto-refreshes every 15 seconds</span>
        </div>
      </div>
    </div>
  );
}