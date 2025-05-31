import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowUpDown,
  TrendingUp,
  Coins,
  Zap,
  BarChart3,
  PiggyBank,
  Wheat,
  Droplets,
  Activity,
  ExternalLink,
  RefreshCw,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SwapRoute {
  id: string;
  fromToken: string;
  toToken: string;
  estimatedOutput: string;
  priceImpact: number;
  dexes: string[];
  timeEstimate: number;
}

interface StakingPool {
  id: string;
  name: string;
  protocol: string;
  network: string;
  stakingToken: string;
  apy: number;
  tvl: string;
  riskLevel: string;
}

interface YieldFarm {
  id: string;
  name: string;
  protocol: string;
  network: string;
  token0: string;
  token1: string;
  apr: number;
  tvl: string;
}

export default function DeFiDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('swap');
  const [swapRoutes, setSwapRoutes] = useState<SwapRoute[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [yieldFarms, setYieldFarms] = useState<YieldFarm[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Swap form state
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('SOL');
  const [fromAmount, setFromAmount] = useState('');
  const [fromNetwork, setFromNetwork] = useState('ethereum');
  const [toNetwork, setToNetwork] = useState('solana');

  // Staking form state
  const [selectedStakingPool, setSelectedStakingPool] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');

  // Farming form state
  const [selectedFarm, setSelectedFarm] = useState('');
  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');

  const supportedTokens = ['ETH', 'SOL', 'TON', 'USDC', 'USDT', 'BTC'];
  const supportedNetworks = ['ethereum', 'solana', 'ton'];

  useEffect(() => {
    loadDeFiData();
  }, []);

  const loadDeFiData = async () => {
    setIsLoading(true);
    try {
      // Load staking pools
      const stakingResponse = await fetch('/api/defi/staking/pools');
      if (stakingResponse.ok) {
        const stakingData = await stakingResponse.json();
        if (stakingData.status === 'success') {
          setStakingPools(stakingData.data);
        }
      }

      // Load yield farms
      const farmingResponse = await fetch('/api/defi/farming/pools');
      if (farmingResponse.ok) {
        const farmingData = await farmingResponse.json();
        if (farmingData.status === 'success') {
          setYieldFarms(farmingData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load DeFi data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const findSwapRoutes = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/defi/swap/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromToken,
          toToken,
          amount: fromAmount,
          fromNetwork,
          toNetwork
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        setSwapRoutes(result.data);
        toast({
          title: "Routes Found",
          description: `Found ${result.data.length} swap route(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Route Search Failed",
        description: "Failed to find swap routes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (routeId: string) => {
    try {
      const response = await fetch('/api/defi/swap/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: 'user_address_here', // Would get from wallet context
          fromToken,
          toToken,
          fromAmount,
          minAmount: (parseFloat(fromAmount) * 0.95).toString(), // 5% slippage
          fromNetwork,
          toNetwork
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast({
          title: "Swap Initiated",
          description: `Atomic swap order created: ${result.data.id}`,
        });
      }
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: "Failed to create swap order",
        variant: "destructive",
      });
    }
  };

  const stakeTokens = async () => {
    if (!selectedStakingPool || !stakeAmount) {
      toast({
        title: "Missing Information",
        description: "Please select a pool and enter stake amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/defi/staking/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId: selectedStakingPool,
          userAddress: 'user_address_here',
          amount: stakeAmount
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast({
          title: "Staking Successful",
          description: `Staked ${stakeAmount} tokens successfully`,
        });
        setStakeAmount('');
      }
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens",
        variant: "destructive",
      });
    }
  };

  const addLiquidity = async () => {
    if (!selectedFarm || !token0Amount || !token1Amount) {
      toast({
        title: "Missing Information",
        description: "Please select a farm and enter token amounts",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/defi/farming/add-liquidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId: selectedFarm,
          userAddress: 'user_address_here',
          token0Amount,
          token1Amount
        })
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast({
          title: "Liquidity Added",
          description: "Successfully added liquidity to farm",
        });
        setToken0Amount('');
        setToken1Amount('');
      }
    } catch (error) {
      toast({
        title: "Add Liquidity Failed",
        description: "Failed to add liquidity",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            DeFi Dashboard
          </h1>
          <p className="text-gray-400">
            Cross-chain swaps, staking, and yield farming with atomic security
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="swap" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Atomic Swap
            </TabsTrigger>
            <TabsTrigger value="staking" className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="farming" className="flex items-center gap-2">
              <Wheat className="w-4 h-4" />
              Yield Farming
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Cross-Chain Atomic Swap Tab */}
          <TabsContent value="swap" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Cross-Chain Atomic Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* From Token */}
                  <div className="space-y-4">
                    <Label>From</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={fromToken} onValueChange={setFromToken}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedTokens.map(token => (
                            <SelectItem key={token} value={token}>{token}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={fromNetwork} onValueChange={setFromNetwork}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedNetworks.map(network => (
                            <SelectItem key={network} value={network} className="capitalize">
                              {network}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      type="number"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>

                  {/* To Token */}
                  <div className="space-y-4">
                    <Label>To</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={toToken} onValueChange={setToToken}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedTokens.map(token => (
                            <SelectItem key={token} value={token}>{token}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={toNetwork} onValueChange={setToNetwork}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {supportedNetworks.map(network => (
                            <SelectItem key={network} value={network} className="capitalize">
                              {network}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="h-10 bg-gray-800 border border-gray-600 rounded-md flex items-center px-3">
                      <span className="text-gray-400">Estimated output will appear here</span>
                    </div>
                  </div>
                </div>

                <Button onClick={findSwapRoutes} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Finding Routes...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Find Best Route
                    </>
                  )}
                </Button>

                {/* Swap Routes */}
                {swapRoutes.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Available Routes</h3>
                    {swapRoutes.map((route) => (
                      <div key={route.id} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{route.dexes.join(' → ')}</Badge>
                            <span className="text-sm text-gray-400">
                              ~{route.timeEstimate}s
                            </span>
                          </div>
                          <span className="font-mono">{route.estimatedOutput} {toToken}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400">
                            Price Impact: {route.priceImpact.toFixed(2)}%
                          </span>
                          <Button size="sm" onClick={() => executeSwap(route.id)}>
                            Execute Swap
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stake Interface */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="w-5 h-5 text-green-400" />
                    Stake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Staking Pool</Label>
                    <Select value={selectedStakingPool} onValueChange={setSelectedStakingPool}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Choose a staking pool" />
                      </SelectTrigger>
                      <SelectContent>
                        {stakingPools.map(pool => (
                          <SelectItem key={pool.id} value={pool.id}>
                            {pool.name} - {pool.apy}% APY
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount to Stake</Label>
                    <Input
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.0"
                      type="number"
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>

                  <Button onClick={stakeTokens} className="w-full">
                    <Coins className="w-4 h-4 mr-2" />
                    Stake Tokens
                  </Button>
                </CardContent>
              </Card>

              {/* Available Staking Pools */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Available Staking Pools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stakingPools.map((pool) => (
                      <div key={pool.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{pool.name}</h4>
                          <Badge variant={pool.riskLevel === 'low' ? 'default' : 'secondary'}>
                            {pool.riskLevel} risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">APY:</span>
                            <span className="font-semibold text-green-400 ml-2">
                              {pool.apy}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">TVL:</span>
                            <span className="ml-2">${pool.tvl}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Protocol:</span>
                            <span className="ml-2">{pool.protocol}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Network:</span>
                            <span className="ml-2 capitalize">{pool.network}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Yield Farming Tab */}
          <TabsContent value="farming" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Liquidity Interface */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    Add Liquidity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Select Farm</Label>
                    <Select value={selectedFarm} onValueChange={setSelectedFarm}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Choose a yield farm" />
                      </SelectTrigger>
                      <SelectContent>
                        {yieldFarms.map(farm => (
                          <SelectItem key={farm.id} value={farm.id}>
                            {farm.name} - {farm.apr}% APR
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Token 0 Amount</Label>
                      <Input
                        value={token0Amount}
                        onChange={(e) => setToken0Amount(e.target.value)}
                        placeholder="0.0"
                        type="number"
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label>Token 1 Amount</Label>
                      <Input
                        value={token1Amount}
                        onChange={(e) => setToken1Amount(e.target.value)}
                        placeholder="0.0"
                        type="number"
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                  </div>

                  <Button onClick={addLiquidity} className="w-full">
                    <Wheat className="w-4 h-4 mr-2" />
                    Add Liquidity
                  </Button>
                </CardContent>
              </Card>

              {/* Available Yield Farms */}
              <Card className="bg-gray-900/50 border-gray-700">
                <CardHeader>
                  <CardTitle>Available Yield Farms</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {yieldFarms.map((farm) => (
                      <div key={farm.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{farm.name}</h4>
                          <Badge variant="outline">{farm.protocol}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">APR:</span>
                            <span className="font-semibold text-green-400 ml-2">
                              {farm.apr}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">TVL:</span>
                            <span className="ml-2">${farm.tvl}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Pair:</span>
                            <span className="ml-2">{farm.token0}/{farm.token1}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Network:</span>
                            <span className="ml-2 capitalize">{farm.network}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-900/50 border-green-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-5 h-5" />
                    Total Staked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00</div>
                  <p className="text-sm text-gray-400">Across all pools</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-blue-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Activity className="w-5 h-5" />
                    Total Farmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00</div>
                  <p className="text-sm text-gray-400">Liquidity provided</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-400">
                    <Coins className="w-5 h-5" />
                    Total Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.00</div>
                  <p className="text-sm text-gray-400">Pending rewards</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle>Your DeFi Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
                  <p className="text-gray-400 mb-4">
                    Start staking or farming to see your positions here
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setActiveTab('staking')}>
                      Start Staking
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('farming')}>
                      Add Liquidity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}