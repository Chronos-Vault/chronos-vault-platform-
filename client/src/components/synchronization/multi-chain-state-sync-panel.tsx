import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, AlertTriangle, RefreshCw, Server, Shield, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useDevMode } from '@/contexts/dev-mode-context';

export interface ChainHealthStatus {
  chain: string;
  isAvailable: boolean;
  isResponsive: boolean;
  responseTimeMs?: number;
  lastChecked: number;
  errorCount: number;
  consecutiveErrors: number;
  nextRetryTime?: number;
}

export interface ValidationResult {
  vaultId: string;
  tier: string;
  requirements: {
    minimumConfirmations: number;
    requiredChains: number;
    timeWindowSeconds: number;
    merkleProofRequired: boolean;
    doubleSignatureRequired: boolean;
  };
  isValid: boolean;
  confirmedChains: string[];
  missingChains: string[];
  confirmations: any[];
  timeWindowComplete: boolean;
  merkleProofVerified: boolean;
  resultTimestamp: number;
  metadata: Record<string, any>;
}

export interface RecoveryStatus {
  vaultId: string;
  isRecoveryActive: boolean;
  primaryChain: string;
  fallbackChains: string[];
  activeChain: string;
  recoveryStartTime: number;
  lastUpdated: number;
  recoveryTrigger: string;
  recoverySteps: {
    timestamp: number;
    action: string;
    chain?: string;
    success: boolean;
    details?: string;
  }[];
  metadata: Record<string, any>;
}

// Multi-Chain State Synchronization Panel
export function MultiChainStateSyncPanel({ vaultId }: { vaultId: string }) {
  const { toast } = useToast();
  const { isDevMode } = useDevMode();
  const [selectedChain, setSelectedChain] = useState<string>('ETH');
  const [vaultValue, setVaultValue] = useState<string>('10000');
  
  // Fetch chain health status
  const { data: chainHealthData, isLoading: isLoadingHealth, refetch: refetchHealth } = useQuery({
    queryKey: ['/api/multi-chain-sync/chain-health'],
    enabled: !!vaultId,
  });
  
  // Fetch state snapshot
  const { data: snapshotData, isLoading: isLoadingSnapshot, refetch: refetchSnapshot } = useQuery({
    queryKey: ['/api/multi-chain-sync/state/snapshot', vaultId],
    enabled: !!vaultId,
  });
  
  // Fetch validation status
  const { data: validationData, isLoading: isLoadingValidation, refetch: refetchValidation } = useQuery({
    queryKey: ['/api/multi-chain-sync/validation', vaultId],
    enabled: !!vaultId,
  });
  
  // Fetch recovery status
  const { data: recoveryData, isLoading: isLoadingRecovery, refetch: refetchRecovery } = useQuery({
    queryKey: ['/api/multi-chain-sync/recovery', vaultId],
    enabled: !!vaultId,
  });
  
  // Create snapshot mutation
  const createSnapshotMutation = useMutation({
    mutationFn: async () => {
      // In a real app, you would get real chain states
      // In dev mode, we simulate the data
      const simulatedChainStates = {
        ETH: {
          balance: '1.5 ETH',
          lockUntil: Date.now() + 86400000, // 1 day in the future
          owner: '0xabc123...',
          blockHeight: 12345678,
          transactionId: `eth_tx_${Date.now()}`,
          metadata: { network: 'mainnet' }
        },
        SOL: {
          balance: '25 SOL',
          lockUntil: Date.now() + 86400000,
          owner: 'sol123abcdef...',
          blockHeight: 987654321,
          transactionId: `sol_tx_${Date.now()}`,
          metadata: { network: 'mainnet' }
        },
        TON: {
          balance: '100 TON',
          lockUntil: Date.now() + 86400000,
          owner: 'EQA...',
          blockHeight: 56789,
          transactionId: `ton_tx_${Date.now()}`,
          metadata: { network: 'mainnet' }
        },
        BTC: {
          balance: '0.05 BTC',
          lockUntil: Date.now() + 86400000,
          owner: 'bc1qxyz...',
          blockHeight: 800123,
          transactionId: `btc_tx_${Date.now()}`,
          metadata: { network: 'mainnet' }
        }
      };
      
      const res = await apiRequest('POST', `/api/multi-chain-sync/state/snapshot/${vaultId}`, {
        chainStates: simulatedChainStates
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'State snapshot created',
        description: 'Vault state synchronized across chains',
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/multi-chain-sync/state/snapshot', vaultId] });
    },
    onError: (error) => {
      toast({
        title: 'Error creating snapshot',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  });
  
  // Initiate validation mutation
  const initiateValidationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/multi-chain-sync/validation/initiate/${vaultId}`, {
        value: parseFloat(vaultValue),
        primaryChain: selectedChain,
        merkleRoot: snapshotData?.snapshot?.rootHash,
        metadata: { source: isDevMode ? 'development' : 'production' }
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Validation initiated',
        description: `Vault validation started for ${selectedChain}`,
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/multi-chain-sync/validation', vaultId] });
      
      // In dev mode, we'll simulate validation confirmations
      if (isDevMode) {
        simulateValidationConfirmations();
      }
    },
    onError: (error) => {
      toast({
        title: 'Error initiating validation',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  });
  
  // Initiate recovery mutation
  const initiateRecoveryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/multi-chain-sync/recovery/initiate/${vaultId}`, {
        primaryChain: selectedChain,
        trigger: 'Manual recovery initiated by user',
        metadata: { 
          source: isDevMode ? 'development' : 'production',
          valueUSD: parseFloat(vaultValue)
        }
      });
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Recovery initiated',
        description: `Vault recovery started for ${selectedChain}`,
        variant: 'default',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/multi-chain-sync/recovery', vaultId] });
    },
    onError: (error) => {
      toast({
        title: 'Error initiating recovery',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  });
  
  // Simulate validation confirmations in dev mode
  const simulateValidationConfirmations = async () => {
    if (!isDevMode) return;
    
    const chains = ['ETH', 'SOL', 'TON', 'BTC'];
    const otherChains = chains.filter(chain => chain !== selectedChain);
    
    // Simulate adding confirmation for each chain with a delay
    for (const chain of otherChains) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        await apiRequest('POST', `/api/multi-chain-sync/validation/confirm/${vaultId}`, {
          chain,
          blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
          transactionId: `${chain.toLowerCase()}_tx_${Date.now()}`
        });
        
        toast({
          title: 'Validation confirmed',
          description: `Chain ${chain} confirmed validation`,
          variant: 'default',
        });
        
        queryClient.invalidateQueries({ queryKey: ['/api/multi-chain-sync/validation', vaultId] });
      } catch (error) {
        console.error('Error simulating validation confirmation:', error);
      }
    }
  };
  
  // Refresh all data
  const refreshAllData = () => {
    refetchHealth();
    refetchSnapshot();
    refetchValidation();
    refetchRecovery();
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Determine health status color
  const getHealthStatusColor = (chain: ChainHealthStatus) => {
    if (!chain.isAvailable) return 'destructive';
    if (chain.errorCount > 0) return 'warning';
    return 'success';
  };
  
  // Get health status icon
  const getHealthStatusIcon = (chain: ChainHealthStatus) => {
    if (!chain.isAvailable) return <AlertCircle className="h-4 w-4" />;
    if (chain.errorCount > 0) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };
  
  // Calculate time remaining for time window
  const getTimeWindowRemaining = (validation: ValidationResult) => {
    if (!validation) return '0%';
    
    const startTime = validation.metadata.initiatedAt || validation.resultTimestamp;
    const windowDuration = validation.requirements.timeWindowSeconds * 1000;
    const elapsed = Date.now() - startTime;
    const percentage = Math.min(100, Math.floor((elapsed / windowDuration) * 100));
    
    return `${percentage}%`;
  };
  
  return (
    <Card className="w-full shadow-lg border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-background to-primary/5">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg sm:text-xl">Multi-Chain State Synchronization</CardTitle>
            <CardDescription>
              Secure vault state across blockchains with automatic recovery
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAllData}
            disabled={isLoadingHealth || isLoadingSnapshot || isLoadingValidation || isLoadingRecovery}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="health">Chain Health</TabsTrigger>
            <TabsTrigger value="sync">State Sync</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>
          
          {/* Chain Health Tab */}
          <TabsContent value="health" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingHealth ? (
                <div className="col-span-full flex justify-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : chainHealthData?.chainHealth ? (
                Object.values(chainHealthData.chainHealth).map((chain: ChainHealthStatus) => (
                  <Card key={chain.chain} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md">
                          {chain.chain} Network
                        </CardTitle>
                        <Badge variant={getHealthStatusColor(chain)}>
                          <span className="flex items-center">
                            {getHealthStatusIcon(chain)}
                            <span className="ml-1">
                              {chain.isAvailable ? 'Operational' : 'Degraded'}
                            </span>
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div>Response Time:</div>
                        <div>{chain.responseTimeMs ? `${chain.responseTimeMs}ms` : 'N/A'}</div>
                        
                        <div>Error Count:</div>
                        <div>{chain.errorCount}</div>
                        
                        <div>Last Checked:</div>
                        <div>{formatTimestamp(chain.lastChecked)}</div>
                        
                        {chain.nextRetryTime && (
                          <>
                            <div>Next Retry:</div>
                            <div>{formatTimestamp(chain.nextRetryTime)}</div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No chain health data available
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* State Sync Tab */}
          <TabsContent value="sync" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="text-md font-medium">State Snapshot</h3>
                </div>
                
                {isLoadingSnapshot ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : snapshotData?.snapshot ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Root Hash:</span>
                      <span className="text-sm font-mono">{snapshotData.snapshot.rootHash.substring(0, 16)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Timestamp:</span>
                      <span className="text-sm">{formatTimestamp(snapshotData.snapshot.timestamp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Synced Chains:</span>
                      <div className="flex gap-1">
                        {snapshotData.snapshot.chains.map((chain: string) => (
                          <Badge key={chain} variant="outline">{chain}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No state snapshot available
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={() => createSnapshotMutation.mutate()}
                  disabled={createSnapshotMutation.isPending}
                  className="w-full"
                >
                  {createSnapshotMutation.isPending ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                      Creating Snapshot...
                    </>
                  ) : (
                    <>Create State Snapshot</>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Validation Configuration */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="chain-select">Primary Chain</Label>
                      <Select value={selectedChain} onValueChange={setSelectedChain}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETH">Ethereum</SelectItem>
                          <SelectItem value="SOL">Solana</SelectItem>
                          <SelectItem value="TON">TON</SelectItem>
                          <SelectItem value="BTC">Bitcoin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vault-value">Vault Value (USD)</Label>
                      <Input
                        id="vault-value"
                        type="number"
                        value={vaultValue}
                        onChange={(e) => setVaultValue(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => initiateValidationMutation.mutate()}
                    disabled={initiateValidationMutation.isPending || !snapshotData?.snapshot?.rootHash}
                    className="w-full mt-2"
                  >
                    {initiateValidationMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                        Initiating Validation...
                      </>
                    ) : (
                      <>Initiate Time-Weighted Validation</>
                    )}
                  </Button>
                </div>
                
                {/* Current Validation Status */}
                {isLoadingValidation ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : validationData?.validation ? (
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-md font-medium">Validation Status</h3>
                      </div>
                      <Badge variant={validationData.validation.isValid ? 'success' : 'secondary'}>
                        {validationData.validation.isValid ? 'Valid' : 'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tier:</span>
                        <Badge variant="outline">{validationData.validation.tier}</Badge>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confirmed Chains:</span>
                        <div className="flex gap-1">
                          {validationData.validation.confirmedChains.map((chain: string) => (
                            <Badge key={chain} variant="outline">{chain}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Missing Chains:</span>
                        <div className="flex gap-1">
                          {validationData.validation.missingChains.length > 0 ? (
                            validationData.validation.missingChains.map((chain: string) => (
                              <Badge key={chain} variant="outline" className="bg-destructive/20">{chain}</Badge>
                            ))
                          ) : (
                            <span className="text-sm">None</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Time Window:</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <div className="w-24 h-2 bg-muted-foreground/30 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: getTimeWindowRemaining(validationData.validation) }}
                            ></div>
                          </div>
                          <span>{validationData.validation.timeWindowComplete ? 'Complete' : 'In Progress'}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Merkle Proof:</span>
                        <Badge variant={validationData.validation.merkleProofVerified ? 'success' : 'secondary'}>
                          {validationData.validation.merkleProofVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground bg-muted rounded-lg">
                    No validation in progress
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Recovery Tab */}
          <TabsContent value="recovery" className="space-y-4 mt-4">
            <div className="space-y-4">
              <Button
                onClick={() => initiateRecoveryMutation.mutate()}
                disabled={initiateRecoveryMutation.isPending}
                className="w-full"
              >
                {initiateRecoveryMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                    Initiating Recovery...
                  </>
                ) : (
                  <>Initiate Recovery Process</>
                )}
              </Button>
              
              {/* Current Recovery Status */}
              {isLoadingRecovery ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : recoveryData?.recovery ? (
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary" />
                      <h3 className="text-md font-medium">Recovery Status</h3>
                    </div>
                    <Badge variant={!recoveryData.recovery.isRecoveryActive ? 'success' : 'secondary'}>
                      {!recoveryData.recovery.isRecoveryActive ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Primary Chain:</span>
                      <Badge variant="outline">{recoveryData.recovery.primaryChain}</Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Chain:</span>
                      <Badge variant="outline" className="bg-primary/20">{recoveryData.recovery.activeChain}</Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fallback Chains:</span>
                      <div className="flex gap-1">
                        {recoveryData.recovery.fallbackChains.map((chain: string) => (
                          <Badge key={chain} variant="outline">{chain}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{formatTimestamp(recoveryData.recovery.recoveryStartTime)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{formatTimestamp(recoveryData.recovery.lastUpdated)}</span>
                    </div>
                    
                    <div className="pt-2">
                      <span className="text-muted-foreground">Recovery Steps:</span>
                      <div className="mt-2 space-y-2">
                        {recoveryData.recovery.recoverySteps.map((step, index) => (
                          <div key={index} className="border-l-2 pl-3 py-1 text-xs border-primary/30">
                            <div className="flex justify-between">
                              <span className="font-medium">{step.action}</span>
                              <Badge variant={step.success ? 'success' : 'destructive'} className="text-[10px] h-4">
                                {step.success ? 'Success' : 'Failed'}
                              </Badge>
                            </div>
                            {step.details && <p className="mt-1 text-muted-foreground">{step.details}</p>}
                            <div className="mt-1 text-muted-foreground/70">{formatTimestamp(step.timestamp)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground bg-muted rounded-lg">
                  No recovery process active
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-between text-xs text-muted-foreground">
        <span>Multi-Chain State Synchronization</span>
        <span>Triple-Chain Security Architecture</span>
      </CardFooter>
    </Card>
  );
}