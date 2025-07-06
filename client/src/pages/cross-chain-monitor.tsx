import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertTriangle,
  ArrowLeft, 
  BarChart3, 
  CheckCircle, 
  ExternalLink, 
  Info, 
  Layers, 
  LinkIcon, 
  Loader2, 
  LucideIcon, 
  Network, 
  RefreshCw, 
  Search, 
  Shield, 
  Terminal, 
  Zap 
} from 'lucide-react';
import TransactionVerificationPanel from '@/components/cross-chain/TransactionVerificationPanel';
import { useDevMode } from '@/contexts/dev-mode-context';
import { useToast } from '@/hooks/use-toast';
import { tonContractService } from '@/lib/ton/ton-contract-service';

// Define types for our dashboard data
interface ChainStatus {
  name: string;
  type: 'ethereum' | 'solana' | 'ton' | 'bitcoin';
  status: 'online' | 'degraded' | 'offline' | 'unknown';
  latency: number;
  lastBlock: number;
  transactions: number;
  peerCount: number;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'failed';
  lastUpdated: Date;
}

interface CrossChainEvent {
  id: string;
  type: 'verification' | 'transfer' | 'error' | 'security' | 'recovery';
  sourceChain: string;
  destinationChain?: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'failed';
  details: string;
  txHash?: string;
}

export default function CrossChainMonitorPage() {
  const [, setLocation] = useLocation();
  const { devModeEnabled } = useDevMode();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for chain statuses
  const [chainStatuses, setChainStatuses] = useState<ChainStatus[]>([]);
  
  // State for recent events
  const [recentEvents, setRecentEvents] = useState<CrossChainEvent[]>([]);
  
  // State for verification metrics
  const [verificationMetrics, setVerificationMetrics] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    successRate: 0,
    averageTime: 0,
  });
  
  // State for quick verification
  const [txToVerify, setTxToVerify] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Load data in parallel
        await Promise.all([
          loadChainStatuses(),
          loadRecentEvents(),
          loadVerificationMetrics()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: 'Loading Error',
          description: 'Failed to load some dashboard data. Please refresh to try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
    
    // Set up polling for regular updates (every 30 seconds)
    const intervalId = setInterval(() => {
      refreshData(false);
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Load chain statuses
  const loadChainStatuses = async () => {
    // In a real implementation, we would fetch real-time data from backend
    // For now, we'll use simulated data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const now = new Date();
    
    // Build mock data for chain statuses
    const mockStatuses: ChainStatus[] = [
      {
        name: 'Ethereum',
        type: 'ethereum',
        status: Math.random() > 0.9 ? 'degraded' : 'online',
        latency: Math.floor(Math.random() * 500) + 100,
        lastBlock: 19283691,
        transactions: Math.floor(Math.random() * 1000) + 500,
        peerCount: Math.floor(Math.random() * 50) + 10,
        connectionQuality: Math.random() > 0.8 ? 'good' : 'excellent',
        lastUpdated: now
      },
      {
        name: 'Solana',
        type: 'solana',
        status: Math.random() > 0.9 ? 'degraded' : 'online',
        latency: Math.floor(Math.random() * 100) + 20,
        lastBlock: 237584921,
        transactions: Math.floor(Math.random() * 5000) + 2000,
        peerCount: Math.floor(Math.random() * 100) + 50,
        connectionQuality: Math.random() > 0.8 ? 'good' : 'excellent',
        lastUpdated: now
      },
      {
        name: 'TON',
        type: 'ton',
        status: Math.random() > 0.9 ? 'degraded' : 'online',
        latency: Math.floor(Math.random() * 300) + 100,
        lastBlock: 36581923,
        transactions: Math.floor(Math.random() * 2000) + 800,
        peerCount: Math.floor(Math.random() * 70) + 30,
        connectionQuality: Math.random() > 0.8 ? 'good' : 'excellent',
        lastUpdated: now
      },
      {
        name: 'Bitcoin',
        type: 'bitcoin',
        status: Math.random() > 0.9 ? 'degraded' : 'online',
        latency: Math.floor(Math.random() * 800) + 200,
        lastBlock: 896268,
        transactions: Math.floor(Math.random() * 500) + 200,
        peerCount: Math.floor(Math.random() * 30) + 5,
        connectionQuality: Math.random() > 0.8 ? 'good' : 'excellent',
        lastUpdated: now
      }
    ];
    
    if (devModeEnabled) {
      // In dev mode, randomly make one chain degraded or offline
      const randomIndex = Math.floor(Math.random() * mockStatuses.length);
      if (Math.random() > 0.7) {
        mockStatuses[randomIndex].status = Math.random() > 0.5 ? 'degraded' : 'offline';
        mockStatuses[randomIndex].connectionQuality = Math.random() > 0.5 ? 'poor' : 'failed';
      }
    }
    
    setChainStatuses(mockStatuses);
  };
  
  // Load recent events
  const loadRecentEvents = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate timestamps for the last 12 hours
    const now = new Date();
    const getRandomTime = (hoursPast: number) => {
      const time = new Date(now);
      time.setHours(time.getHours() - Math.random() * hoursPast);
      return time;
    };
    
    // Generate mock events
    const mockEvents: CrossChainEvent[] = [
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'verification',
        sourceChain: 'Ethereum',
        timestamp: getRandomTime(0.5),
        status: 'success',
        details: 'Transaction verified successfully across all chains',
        txHash: '0x' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'transfer',
        sourceChain: 'Ethereum',
        destinationChain: 'TON',
        timestamp: getRandomTime(1),
        status: 'success',
        details: 'Asset transfer completed successfully',
        txHash: '0x' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'verification',
        sourceChain: 'Solana',
        timestamp: getRandomTime(2),
        status: 'success',
        details: 'Transaction verified successfully across all chains',
        txHash: 'sol-' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'transfer',
        sourceChain: 'TON',
        destinationChain: 'Solana',
        timestamp: getRandomTime(3),
        status: 'success',
        details: 'Asset transfer completed successfully',
        txHash: 'ton-' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'error',
        sourceChain: 'Ethereum',
        timestamp: getRandomTime(5),
        status: 'failed',
        details: 'Network connection error during verification',
        txHash: '0x' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'security',
        sourceChain: 'TON',
        timestamp: getRandomTime(6),
        status: 'success',
        details: 'Security audit completed successfully',
        txHash: 'ton-' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'recovery',
        sourceChain: 'Solana',
        destinationChain: 'Ethereum',
        timestamp: getRandomTime(8),
        status: 'success',
        details: 'Cross-chain recovery mechanism activated',
        txHash: 'sol-' + Math.random().toString(36).substring(2, 40)
      },
      {
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'verification',
        sourceChain: 'Bitcoin',
        timestamp: getRandomTime(10),
        status: 'success',
        details: 'Bitcoin transaction verified successfully',
        txHash: 'btc-' + Math.random().toString(36).substring(2, 40)
      }
    ];
    
    // If in dev mode, add some failed events
    if (devModeEnabled) {
      mockEvents.push({
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'verification',
        sourceChain: 'Ethereum',
        timestamp: getRandomTime(0.2),
        status: 'failed',
        details: 'Transaction verification failed on TON blockchain',
        txHash: '0x' + Math.random().toString(36).substring(2, 40)
      });
      
      mockEvents.push({
        id: 'evt-' + Math.random().toString(36).substring(2, 10),
        type: 'transfer',
        sourceChain: 'Solana',
        destinationChain: 'TON',
        timestamp: getRandomTime(1.5),
        status: 'pending',
        details: 'Asset transfer waiting for finality',
        txHash: 'sol-' + Math.random().toString(36).substring(2, 40)
      });
    }
    
    // Sort by timestamp (newest first)
    mockEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setRecentEvents(mockEvents);
  };
  
  // Load verification metrics
  const loadVerificationMetrics = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Calculate mock metrics
    const total = Math.floor(Math.random() * 1000) + 1000;
    const successful = Math.floor(total * (Math.random() * 0.1 + 0.85)); // 85-95% success rate
    const failed = total - successful;
    
    setVerificationMetrics({
      total,
      successful,
      failed,
      successRate: Math.round((successful / total) * 1000) / 10, // 1 decimal place
      averageTime: Math.round((Math.random() * 2 + 1.5) * 10) / 10 // 1.5-3.5s, 1 decimal place
    });
  };
  
  // Refresh all data
  const refreshData = async (showToast = true) => {
    setIsRefreshing(true);
    
    try {
      // Refresh all data in parallel
      await Promise.all([
        loadChainStatuses(),
        loadRecentEvents(),
        loadVerificationMetrics()
      ]);
      
      if (showToast) {
        toast({
          title: 'Dashboard Updated',
          description: 'Dashboard data has been refreshed successfully.',
        });
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
      
      if (showToast) {
        toast({
          title: 'Refresh Error',
          description: 'Failed to refresh dashboard data. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle quick verification
  const handleVerification = () => {
    if (!txToVerify) {
      toast({
        title: 'Verification Error',
        description: 'Please enter a transaction ID or hash to verify.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Navigate to verification page with the transaction ID
    setLocation(`/transaction-verification?tx=${encodeURIComponent(txToVerify)}`);
  };
  
  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    
    return `${days}d ago`;
  };
  
  // Get icon for chain
  const getChainIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'ethereum': return Zap;
      case 'solana': return Network;
      case 'ton': return Shield;
      case 'bitcoin': return Layers;
      default: return Info;
    }
  };
  
  // Get status badge for chain
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'degraded':
        return <Badge variant="default" className="bg-yellow-500">Degraded</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get event icon
  const getEventIcon = (type: string): LucideIcon => {
    switch (type) {
      case 'verification': return CheckCircle;
      case 'transfer': return LinkIcon;
      case 'error': return Terminal;
      case 'security': return Shield;
      case 'recovery': return RefreshCw;
      default: return Info;
    }
  };
  
  // Get event status badge
  const getEventStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Filter events by search
  const filteredEvents = searchQuery 
    ? recentEvents.filter(event => 
        event.sourceChain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.destinationChain && event.destinationChain.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.txHash && event.txHash.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.details.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentEvents;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setLocation('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Cross-Chain Monitoring Dashboard</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refreshData()}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Verification Panel */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Transaction Verification</CardTitle>
            <CardDescription>
              Enter a transaction hash to verify it across multiple blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter transaction ID or hash..."
                value={txToVerify}
                onChange={(e) => setTxToVerify(e.target.value)}
              />
              <Button 
                onClick={handleVerification}
                disabled={!txToVerify || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Dashboard Content */}
        <div className="lg:col-span-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="chains">Chain Status</TabsTrigger>
              <TabsTrigger value="events">Recent Events</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading dashboard data...</span>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{verificationMetrics.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          All-time cross-chain verifications
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{verificationMetrics.successRate}%</div>
                        <div className="mt-2">
                          <Progress value={verificationMetrics.successRate} className="h-1" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{verificationMetrics.averageTime}s</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Average verification completion time
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Chain Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {chainStatuses.filter(s => s.status === 'online').length}/{chainStatuses.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Blockchains operating normally
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Activity & Status Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest cross-chain events and verifications</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentEvents.slice(0, 5).map(event => (
                            <div key={event.id} className="flex gap-3">
                              {React.createElement(getEventIcon(event.type), { 
                                className: `h-5 w-5 ${
                                  event.status === 'success' ? 'text-green-500' :
                                  event.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                                }` 
                              })}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{event.sourceChain}</span>
                                  {event.destinationChain && (
                                    <>
                                      <ArrowLeft className="h-3 w-3 rotate-180" />
                                      <span className="font-medium">{event.destinationChain}</span>
                                    </>
                                  )}
                                  {getEventStatusBadge(event.status)}
                                </div>
                                <p className="text-sm text-muted-foreground">{event.details}</p>
                                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                  <span>{formatTimeAgo(event.timestamp)}</span>
                                  {event.txHash && (
                                    <Button variant="link" size="sm" className="h-4 p-0 ml-2">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View Transaction
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setActiveTab('events')}>
                          View All Events
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Chain Status</CardTitle>
                        <CardDescription>Current status of supported blockchains</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {chainStatuses.map(chain => {
                            const ChainIcon = getChainIcon(chain.type);
                            return (
                              <div key={chain.type} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <ChainIcon className="h-5 w-5 text-primary" />
                                  <span className="font-medium">{chain.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-muted-foreground">
                                    Block: {chain.lastBlock.toLocaleString()}
                                  </span>
                                  {getStatusBadge(chain.status)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setActiveTab('chains')}>
                          View Detailed Status
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* System Alerts */}
                  {devModeEnabled && (
                    <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">Development Mode Active</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        You are running in development mode with simulated blockchain data.
                        Some features may use fallback values and simulated verifications.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {chainStatuses.some(s => s.status !== 'online') && (
                    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle className="text-red-800">Blockchain Service Degradation</AlertTitle>
                      <AlertDescription className="text-red-700">
                        One or more blockchains are experiencing issues. This may affect cross-chain
                        verification times and success rates.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </TabsContent>
            
            {/* Chain Status Tab */}
            <TabsContent value="chains" className="space-y-6">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading chain data...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {chainStatuses.map(chain => {
                    const ChainIcon = getChainIcon(chain.type);
                    return (
                      <Card key={chain.type}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ChainIcon className="h-5 w-5 text-primary" />
                            {chain.name}
                            {getStatusBadge(chain.status)}
                          </CardTitle>
                          <CardDescription>
                            Last updated {formatTimeAgo(chain.lastUpdated)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Last Block</p>
                              <p className="text-lg">{chain.lastBlock.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Transactions (24h)</p>
                              <p className="text-lg">{chain.transactions.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Network Latency</p>
                              <p className="text-lg">{chain.latency}ms</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Peers Connected</p>
                              <p className="text-lg">{chain.peerCount}</p>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Connection Quality</span>
                              <Badge variant="outline" className={
                                chain.connectionQuality === 'excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                                chain.connectionQuality === 'good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                chain.connectionQuality === 'poor' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-red-50 text-red-700 border-red-200'
                              }>
                                {chain.connectionQuality.charAt(0).toUpperCase() + chain.connectionQuality.slice(1)}
                              </Badge>
                            </div>
                            
                            {/* Quality meter visualization */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={
                                  chain.connectionQuality === 'excellent' ? 'bg-green-500' :
                                  chain.connectionQuality === 'good' ? 'bg-blue-500' :
                                  chain.connectionQuality === 'poor' ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }
                                style={{ 
                                  width: chain.connectionQuality === 'excellent' ? '100%' :
                                         chain.connectionQuality === 'good' ? '75%' :
                                         chain.connectionQuality === 'poor' ? '40%' : '15%',
                                  height: '100%'
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Explorer
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                  
                  {/* Health Summary */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Cross-Chain Health Summary</CardTitle>
                      <CardDescription>
                        Overall system health based on individual chain performance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* System health metrics */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Overall System Health</span>
                            <span className="text-sm font-medium">
                              {chainStatuses.every(s => s.status === 'online') ? '100%' : 
                               chainStatuses.some(s => s.status === 'offline') ? '70%' : '90%'}
                            </span>
                          </div>
                          <Progress 
                            value={
                              chainStatuses.every(s => s.status === 'online') ? 100 : 
                              chainStatuses.some(s => s.status === 'offline') ? 70 : 90
                            } 
                            className="h-2" 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Cross-Chain Verification Capability</span>
                            <span className="text-sm font-medium">
                              {chainStatuses.filter(s => s.status === 'online').length === chainStatuses.length ? '100%' : 
                               chainStatuses.filter(s => s.status === 'online').length >= chainStatuses.length - 1 ? '90%' : '75%'}
                            </span>
                          </div>
                          <Progress 
                            value={
                              chainStatuses.filter(s => s.status === 'online').length === chainStatuses.length ? 100 : 
                              chainStatuses.filter(s => s.status === 'online').length >= chainStatuses.length - 1 ? 90 : 75
                            }
                            className="h-2" 
                          />
                        </div>
                        
                        <Alert variant={
                          chainStatuses.every(s => s.status === 'online') ? 'default' : 
                          chainStatuses.some(s => s.status === 'offline') ? 'destructive' : undefined
                        }>
                          <AlertTitle>
                            {chainStatuses.every(s => s.status === 'online') ? 'All Systems Operational' : 
                             chainStatuses.some(s => s.status === 'offline') ? 'Service Degradation Detected' : 
                             'Minor Issues Detected'}
                          </AlertTitle>
                          <AlertDescription>
                            {chainStatuses.every(s => s.status === 'online') ? 
                              'All blockchain networks are operating normally. Cross-chain verification is fully functional.' : 
                             chainStatuses.some(s => s.status === 'offline') ? 
                              'One or more blockchain networks are experiencing issues. This may affect cross-chain verification.' :
                              'Some blockchain networks are experiencing minor issues. Most features remain operational.'}
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Chain Events</CardTitle>
                  <CardDescription>Recent events across all supported blockchains</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Loading events...</span>
                    </div>
                  ) : (
                    <>
                      {/* Search and filter */}
                      <div className="flex gap-2 mb-6">
                        <Input
                          placeholder="Search events..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="max-w-sm"
                        />
                        {searchQuery && (
                          <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                            Clear
                          </Button>
                        )}
                      </div>
                      
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          No events found matching your search criteria
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredEvents.map(event => (
                            <div key={event.id} className="p-4 border rounded-lg">
                              <div className="flex items-start gap-3">
                                {React.createElement(getEventIcon(event.type), { 
                                  className: `h-5 w-5 mt-0.5 ${
                                    event.status === 'success' ? 'text-green-500' :
                                    event.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
                                  }` 
                                })}
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                      </span>
                                      {getEventStatusBadge(event.status)}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                      {formatTimeAgo(event.timestamp)}
                                    </span>
                                  </div>
                                  
                                  <p className="mt-1">{event.details}</p>
                                  
                                  <div className="mt-2 flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1">
                                      <span className="text-muted-foreground">Source:</span>
                                      <span className="font-medium">{event.sourceChain}</span>
                                    </div>
                                    {event.destinationChain && (
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground">Destination:</span>
                                        <span className="font-medium">{event.destinationChain}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {event.txHash && (
                                    <div className="mt-2 flex items-center">
                                      <span className="text-sm text-muted-foreground">TX Hash: </span>
                                      <span className="text-sm font-mono ml-1">{event.txHash}</span>
                                      <Button variant="ghost" size="sm" className="h-6 ml-2">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredEvents.length} of {recentEvents.length} events
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={() => refreshData()}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Events
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Events Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Events Analytics</CardTitle>
                  <CardDescription>Overview of cross-chain events by type and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Events by Type</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Verification</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => e.type === 'verification').length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => e.type === 'verification').length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Transfer</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => e.type === 'transfer').length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => e.type === 'transfer').length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Other</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => !['verification', 'transfer'].includes(e.type)).length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => !['verification', 'transfer'].includes(e.type)).length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Events by Status</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Success</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => e.status === 'success').length}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full"
                            style={{ 
                              width: `${recentEvents.filter(e => e.status === 'success').length / recentEvents.length * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Pending</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => e.status === 'pending').length}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-yellow-500 h-full"
                            style={{ 
                              width: `${recentEvents.filter(e => e.status === 'pending').length / recentEvents.length * 100}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Failed</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => e.status === 'failed').length}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="bg-red-500 h-full"
                            style={{ 
                              width: `${recentEvents.filter(e => e.status === 'failed').length / recentEvents.length * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Events by Chain</h3>
                      {Array.from(new Set(recentEvents.map(e => e.sourceChain))).map(chain => (
                        <div key={chain} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm">{chain}</span>
                            <span className="text-sm font-medium">
                              {recentEvents.filter(e => e.sourceChain === chain).length}
                            </span>
                          </div>
                          <Progress 
                            value={recentEvents.filter(e => e.sourceChain === chain).length / recentEvents.length * 100} 
                            className="h-1" 
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Events Timeline</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Last hour</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 3600000).length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 3600000).length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Last 6 hours</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 21600000).length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 21600000).length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Last 24 hours</span>
                          <span className="text-sm font-medium">
                            {recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 86400000).length}
                          </span>
                        </div>
                        <Progress 
                          value={recentEvents.filter(e => (new Date().getTime() - e.timestamp.getTime()) < 86400000).length / recentEvents.length * 100} 
                          className="h-1" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}