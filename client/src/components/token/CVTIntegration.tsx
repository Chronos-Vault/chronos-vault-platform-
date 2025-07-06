import React, { useState, useEffect } from 'react';
import { Coins, Shield, Lock, Unlock, TrendingUp, BarChart, CheckCircle } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces for token data
interface TokenBalance {
  chain: string;
  balance: number;
  marketValue: number;
  address: string;
}

interface StakingPosition {
  id: number;
  amount: number;
  startDate: string;
  endDate: string;
  apr: number;
  chain: string;
  status: 'active' | 'matured' | 'withdrawn';
  securityBoost: number; // percentage boost to vault security score
}

interface TokenEconomics {
  totalSupply: number;
  circulatingSupply: number;
  marketCap: number;
  currentPrice: number;
  allTimeHigh: number;
  stakingApr: number;
  burnRate: number;
  stakingRatio: number; // percentage of supply staked
}

interface CVTIntegrationProps {
  vaultId?: number; // Optional - if provided, will link staking to this vault
  requiresTokens?: boolean; // Whether tokens are required for the current operation
  securityLevel?: 'standard' | 'enhanced' | 'maximum'; // Current security level
  onTokensStaked?: (amount: number, securityBoost: number) => void; // Callback for when tokens are staked
  className?: string;
}

export function CVTIntegration({
  vaultId,
  requiresTokens = false,
  securityLevel = 'standard',
  onTokensStaked,
  className,
}: CVTIntegrationProps) {
  const { toast } = useToast();
  const { isConnected: isEthConnected, walletInfo: ethWallet } = useEthereum();
  const { isConnected: isSolConnected } = useSolana();
  const { isConnected: isTonConnected } = useTon();
  
  const [activeTab, setActiveTab] = useState('balance');
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState('30'); // days

  // Fetch token balances
  const { data: balances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['token/cvt/balances'],
    queryFn: async () => {
      // For development, we'll use mock data - in production this would call the API
      const mockBalances: TokenBalance[] = [
        {
          chain: 'ethereum',
          balance: 1000,
          marketValue: 1250,
          address: ethWallet.address || '0x...',
        },
        {
          chain: 'solana',
          balance: 500,
          marketValue: 625,
          address: 'SOLANA_ADDRESS', // This would come from the solana context
        },
        {
          chain: 'ton',
          balance: 750,
          marketValue: 937.5,
          address: 'TON_ADDRESS', // This would come from the ton context
        },
      ];
      
      // In production, this would be:
      // return await apiRequest('GET', '/api/token/cvt/balances');
      return mockBalances;
    },
    enabled: isEthConnected || isSolConnected || isTonConnected,
  });

  // Fetch staking positions
  const { data: stakingPositions, isLoading: isLoadingStaking } = useQuery({
    queryKey: ['token/cvt/staking', vaultId],
    queryFn: async () => {
      // For development, we'll use mock data
      const mockPositions: StakingPosition[] = [
        {
          id: 1,
          amount: 500,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
          apr: 12.5,
          chain: 'ethereum',
          status: 'active',
          securityBoost: 15,
        },
        {
          id: 2,
          amount: 250,
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          apr: 10,
          chain: 'ton',
          status: 'active',
          securityBoost: 7.5,
        },
      ];
      
      // In production, this would be:
      // return await apiRequest('GET', `/api/token/cvt/staking${vaultId ? `?vaultId=${vaultId}` : ''}`);
      return mockPositions;
    },
    enabled: isEthConnected || isSolConnected || isTonConnected,
  });

  // Fetch token economics
  const { data: tokenEconomics, isLoading: isLoadingEconomics } = useQuery({
    queryKey: ['token/cvt/economics'],
    queryFn: async () => {
      // For development, we'll use mock data
      const mockEconomics: TokenEconomics = {
        totalSupply: 100000000,
        circulatingSupply: 35000000,
        marketCap: 43750000,
        currentPrice: 1.25,
        allTimeHigh: 1.75,
        stakingApr: 12.5,
        burnRate: 2.5,
        stakingRatio: 42.5,
      };
      
      // In production, this would be:
      // return await apiRequest('GET', '/api/token/cvt/economics');
      return mockEconomics;
    },
  });

  // Stake tokens mutation
  const stakeTokensMutation = useMutation({
    mutationFn: async ({ amount, chain, duration }: { amount: number; chain: string; duration: number }) => {
      // For development, we'll simulate a successful stake
      // In production, this would call the API to initiate staking transaction
      // return await apiRequest('POST', '/api/token/cvt/stake', { amount, chain, duration, vaultId });
      
      // Calculate security boost based on amount and duration
      const securityBoost = calculateSecurityBoost(amount, duration);
      
      return {
        id: Math.floor(Math.random() * 1000) + 1,
        amount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        apr: amount > 500 ? 15 : 10,
        chain,
        status: 'active' as const,
        securityBoost,
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${data.amount} CVT tokens for ${stakeDuration} days`,
      });
      
      // Notify parent component about staking and security boost
      onTokensStaked?.(data.amount, data.securityBoost);
      
      // Reset form
      setStakeAmount('');
      setStakeDuration('30');
    },
    onError: (error: any) => {
      toast({
        title: "Staking Failed",
        description: error.message || "Failed to stake tokens. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate security boost based on amount and duration
  const calculateSecurityBoost = (amount: number, duration: number): number => {
    // Base boost is 5%
    let boost = 5;
    
    // Add boost based on amount
    if (amount >= 1000) boost += 10;
    else if (amount >= 500) boost += 7.5;
    else if (amount >= 100) boost += 5;
    else boost += 2.5;
    
    // Add boost based on duration
    if (duration >= 365) boost += 15; // 1 year+
    else if (duration >= 180) boost += 10; // 6 months+
    else if (duration >= 90) boost += 7.5; // 3 months+
    else if (duration >= 30) boost += 5; // 1 month+
    
    return boost;
  };

  // Handle staking form submission
  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    const duration = parseInt(stakeDuration);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid staking amount",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has enough balance
    const selectedChainBalance = balances?.find(b => b.chain === selectedChain);
    if (!selectedChainBalance || selectedChainBalance.balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough CVT tokens on ${selectedChain} for this operation`,
        variant: "destructive",
      });
      return;
    }
    
    // Execute staking
    stakeTokensMutation.mutate({ amount, chain: selectedChain, duration });
  };

  // Calculate total security boost from all staking positions
  const totalSecurityBoost = stakingPositions
    ?.filter(position => position.status === 'active')
    .reduce((total, position) => total + position.securityBoost, 0) || 0;

  // Calculate total staked value
  const totalStakedValue = stakingPositions
    ?.filter(position => position.status === 'active')
    .reduce((total, position) => total + position.amount, 0) || 0;

  // Check if connected to the selected chain
  const isSelectedChainConnected = () => {
    switch (selectedChain) {
      case 'ethereum':
        return isEthConnected;
      case 'solana':
        return isSolConnected;
      case 'ton':
        return isTonConnected;
      default:
        return false;
    }
  };

  return (
    <Card className={`${className || ''} border-[#6B00D7]/30 bg-black/40`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <Coins className="h-5 w-5 text-[#FF5AF7]" />
          Chronos Vault Token (CVT)
        </CardTitle>
        <CardDescription>
          Use CVT tokens to enhance vault security, earn rewards, and validate transactions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="balance" className="text-xs">
              Your Tokens
            </TabsTrigger>
            <TabsTrigger value="staking" className="text-xs">
              Staking
            </TabsTrigger>
            <TabsTrigger value="economics" className="text-xs">
              Tokenomics
            </TabsTrigger>
          </TabsList>
          
          {/* Token Balance Tab */}
          <TabsContent value="balance" className="space-y-6">
            {isLoadingBalances ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-[#6B00D7] border-t-transparent rounded-full" />
              </div>
            ) : balances && balances.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {balances.map((balance) => (
                    <Card key={balance.chain} className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex justify-between items-center">
                          <span className="capitalize">{balance.chain}</span>
                          <Badge variant="outline" className="bg-[#6B00D7]/10 border-[#6B00D7]/30">
                            {balance.chain === 'ethereum' ? '⟠ ETH' : balance.chain === 'solana' ? '◎ SOL' : '💎 TON'}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-xs truncate">
                          {balance.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-white">
                          {balance.balance.toLocaleString()} <span className="text-sm font-normal text-gray-400">CVT</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          ≈ ${balance.marketValue.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="p-4 border border-[#6B00D7]/20 rounded-lg bg-[#6B00D7]/5">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#FF5AF7]" />
                    Security Enhancement
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Stake your tokens to boost vault security up to 30% and earn rewards
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/80"
                    onClick={() => setActiveTab('staking')}
                  >
                    Stake Your Tokens
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <Shield className="h-12 w-12 mx-auto text-gray-400" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No CVT Tokens Found</h3>
                  <p className="text-sm text-gray-400">
                    You don't have any CVT tokens in your connected wallets.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-[#6B00D7]/50 hover:bg-[#6B00D7]/20"
                    onClick={() => window.open('https://chronosvault.org/purchase-cvt', '_blank')}
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Purchase CVT Tokens
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            {/* Staking Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Total Staked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {totalStakedValue.toLocaleString()} <span className="text-sm font-normal text-gray-400">CVT</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    ≈ ${(totalStakedValue * (tokenEconomics?.currentPrice || 0)).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Security Boost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    +{totalSecurityBoost.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    {securityLevel === 'maximum' ? 'Maximum' : securityLevel === 'enhanced' ? 'Enhanced' : 'Standard'} Security
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Current APR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {tokenEconomics?.stakingApr.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-400">
                    Annual Percentage Rate
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Stake new tokens form */}
            <Card className="border-[#6B00D7]/20 bg-[#6B00D7]/5">
              <CardHeader>
                <CardTitle className="text-sm">Stake CVT Tokens</CardTitle>
                <CardDescription>Earn rewards and enhance vault security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Amount</label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-black/30 border-[#6B00D7]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Duration (days)</label>
                      <Select
                        value={stakeDuration}
                        onValueChange={setStakeDuration}
                      >
                        <SelectTrigger className="bg-black/30 border-[#6B00D7]/20">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days (1 month)</SelectItem>
                          <SelectItem value="90">90 days (3 months)</SelectItem>
                          <SelectItem value="180">180 days (6 months)</SelectItem>
                          <SelectItem value="365">365 days (1 year)</SelectItem>
                          <SelectItem value="730">730 days (2 years)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Blockchain</label>
                      <Select
                        value={selectedChain}
                        onValueChange={setSelectedChain}
                      >
                        <SelectTrigger className="bg-black/30 border-[#6B00D7]/20">
                          <SelectValue placeholder="Select blockchain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="solana">Solana</SelectItem>
                          <SelectItem value="ton">TON Network</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-black/20 p-3 rounded-lg border border-[#6B00D7]/10">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Security Boost</span>
                      <span>
                        +{stakeAmount && stakeDuration ? calculateSecurityBoost(parseFloat(stakeAmount) || 0, parseInt(stakeDuration) || 0).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reward APR</span>
                      <span>{tokenEconomics?.stakingApr || 10}%</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Unlock Date</span>
                      <span>
                        {stakeDuration ? new Date(Date.now() + parseInt(stakeDuration) * 24 * 60 * 60 * 1000).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isSelectedChainConnected() ? (
                  <Button
                    variant="outline"
                    className="w-full border-[#6B00D7]/50 hover:bg-[#6B00D7]/20"
                    onClick={() => toast({
                      title: "Wallet Not Connected",
                      description: `Please connect your ${selectedChain} wallet first`,
                      variant: "destructive",
                    })}
                  >
                    Connect Wallet
                  </Button>
                ) : parseFloat(stakeAmount) > 0 ? (
                  <Button
                    variant="default"
                    className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/80"
                    onClick={handleStake}
                    disabled={stakeTokensMutation.isPending}
                  >
                    {stakeTokensMutation.isPending ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Staking...
                      </>
                    ) : (
                      <>Stake Tokens</>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="w-full bg-[#6B00D7] hover:bg-[#6B00D7]/80"
                    disabled={true}
                  >
                    Enter Amount to Stake
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Active Staking Positions */}
            {stakingPositions && stakingPositions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Your Staking Positions</h3>
                <div className="space-y-3">
                  {stakingPositions.map((position) => (
                    <Card key={position.id} className="border-[#6B00D7]/20 bg-black/20">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold">{position.amount.toLocaleString()} CVT</span>
                              <Badge variant="outline" className="capitalize bg-[#6B00D7]/10 border-[#6B00D7]/30">
                                {position.chain}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-400">
                              Staked on {new Date(position.startDate).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="text-gray-400 text-xs">Unlocks</div>
                              <div>{new Date(position.endDate).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">APR</div>
                              <div>{position.apr}%</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">Security Boost</div>
                              <div>+{position.securityBoost}%</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {position.status === 'active' ? (
                              <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : position.status === 'matured' ? (
                              <Button variant="outline" size="sm" className="h-8">
                                <Unlock className="h-3 w-3 mr-1" />
                                Claim
                              </Button>
                            ) : (
                              <Badge variant="outline" className="bg-gray-500/20 text-gray-400">
                                Withdrawn
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {/* Tokenomics Tab */}
          <TabsContent value="economics" className="space-y-6">
            {isLoadingEconomics ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-[#6B00D7] border-t-transparent rounded-full" />
              </div>
            ) : tokenEconomics ? (
              <div className="space-y-6">
                {/* Token Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Current Price
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        ${tokenEconomics.currentPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        ATH: ${tokenEconomics.allTimeHigh.toFixed(2)}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Market Cap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        ${(tokenEconomics.marketCap / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-400">
                        Fully Diluted: ${(tokenEconomics.totalSupply * tokenEconomics.currentPrice / 1000000).toFixed(1)}M
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Total Supply
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {(tokenEconomics.totalSupply / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-400">
                        Circulating: {(tokenEconomics.circulatingSupply / 1000000).toFixed(1)}M
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-black/60 to-[#6B00D7]/10 border-[#6B00D7]/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Staking APR
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {tokenEconomics.stakingApr.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {tokenEconomics.stakingRatio}% of supply staked
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Distribution Chart (placeholder) */}
                <Card className="border-[#6B00D7]/20 bg-black/20">
                  <CardHeader>
                    <CardTitle className="text-sm">Token Distribution</CardTitle>
                    <CardDescription>Allocation of CVT tokens across different categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#6B00D7] mr-2"></span>
                            Security Staking
                          </span>
                          <span>30%</span>
                        </div>
                        <Progress value={30} className="h-2 bg-[#6B00D7]/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#FF5AF7] mr-2"></span>
                            Treasury
                          </span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2 bg-[#6B00D7]/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#4A90E2] mr-2"></span>
                            Team & Advisors
                          </span>
                          <span>15%</span>
                        </div>
                        <Progress value={15} className="h-2 bg-[#6B00D7]/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#2ECC71] mr-2"></span>
                            Public Sale
                          </span>
                          <span>20%</span>
                        </div>
                        <Progress value={20} className="h-2 bg-[#6B00D7]/10" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <span className="h-3 w-3 rounded-full bg-[#E67E22] mr-2"></span>
                            Ecosystem & Development
                          </span>
                          <span>10%</span>
                        </div>
                        <Progress value={10} className="h-2 bg-[#6B00D7]/10" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Token Economics */}
                <Card className="border-[#6B00D7]/20 bg-black/20">
                  <CardHeader>
                    <CardTitle className="text-sm">Deflationary Mechanisms</CardTitle>
                    <CardDescription>How CVT token maintains security and scarcity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 border border-[#6B00D7]/20 rounded-lg bg-[#6B00D7]/5">
                        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#FF5AF7]" />
                          Security Validation Burn
                        </h3>
                        <p className="text-xs text-gray-400">
                          {tokenEconomics.burnRate}% of tokens used in security validation are burned, reducing supply and increasing value.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-[#6B00D7]/20 rounded-lg bg-[#6B00D7]/5">
                        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-[#FF5AF7]" />
                          Staking Lock-up
                        </h3>
                        <p className="text-xs text-gray-400">
                          Tokens staked for vault security are locked for the duration, reducing circulating supply.
                        </p>
                      </div>
                      
                      <div className="p-3 border border-[#6B00D7]/20 rounded-lg bg-[#6B00D7]/5">
                        <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-[#FF5AF7]" />
                          Tiered Security Model
                        </h3>
                        <p className="text-xs text-gray-400">
                          Higher security vaults require more tokens to be staked, creating natural demand.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="p-4 border border-[#6B00D7]/20 rounded-lg bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/10">
                  <h3 className="text-base font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    Enhanced Security with CVT
                  </h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Stake CVT tokens to significantly enhance your vault security. Tokens are locked and participate in the security verification network, providing both protection for your assets and rewards for your contribution.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="default" 
                      className="bg-[#6B00D7] hover:bg-[#6B00D7]/80"
                      onClick={() => setActiveTab('staking')}
                    >
                      Stake for Security
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#6B00D7]/50 hover:bg-[#6B00D7]/20"
                      onClick={() => window.open('https://chronosvault.org/cvt-whitepaper', '_blank')}
                    >
                      View Tokenomics Paper
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Failed to load token economics data</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
