import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { BlockchainType } from '@/contexts/multi-chain-context';
import { SiEthereum, SiSolana, SiTon } from 'react-icons/si';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LockIcon, TrendingUpIcon, ClockIcon, ArrowLeftRight } from 'lucide-react';

export function CrossChainDashboard() {
  const [_, navigate] = useLocation();
  const { isConnected: isEthConnected, walletInfo: ethInfo } = useEthereum();
  const { isConnected: isSolConnected, walletInfo: solInfo } = useSolana();
  const { isConnected: isTonConnected, walletInfo: tonInfo } = useTon();

  // This would come from real data in a production app
  const chainStats = [
    {
      id: 'ethereum',
      type: BlockchainType.ETHEREUM,
      name: 'Ethereum',
      icon: <SiEthereum className="h-4 w-4" />,
      connected: isEthConnected,
      color: 'from-blue-500 to-purple-500',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      percentage: 40,
      vaults: 2,
      totalLocked: ethInfo?.balance ? parseFloat(ethInfo.balance) * 0.4 : 0,
      currency: 'ETH'
    },
    {
      id: 'solana',
      type: BlockchainType.SOLANA,
      name: 'Solana',
      icon: <SiSolana className="h-4 w-4" />,
      connected: isSolConnected,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      percentage: 30,
      vaults: 1,
      totalLocked: solInfo?.balance ? parseFloat(solInfo.balance) * 0.3 : 0,
      currency: 'SOL'
    },
    {
      id: 'ton',
      type: BlockchainType.TON,
      name: 'TON',
      icon: <SiTon className="h-4 w-4" />,
      connected: isTonConnected,
      color: 'from-sky-500 to-blue-500',
      textColor: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/30',
      percentage: 30,
      vaults: 1,
      totalLocked: tonInfo?.balance ? parseFloat(tonInfo.balance) * 0.3 : 0,
      currency: 'TON'
    }
  ];

  const totalVaults = chainStats.reduce((sum, stat) => sum + (stat.connected ? stat.vaults : 0), 0);
  const totalAssets = chainStats.reduce((sum, stat) => sum + (stat.connected ? stat.totalLocked : 0), 0);
  const connectedChains = chainStats.filter(chain => chain.connected).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LockIcon className="h-6 w-6 text-purple-400" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-bold">
                  {totalAssets.toFixed(4)} <span className="text-xl text-muted-foreground">USD</span>
                </div>
                <p className="text-xs text-muted-foreground">Across {connectedChains} blockchains</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vaults</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-6 w-6 text-green-400" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-bold">
                  {totalVaults} <span className="text-xl text-muted-foreground">Vaults</span>
                </div>
                <p className="text-xs text-muted-foreground">Across {connectedChains} blockchains</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Unlock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-6 w-6 text-amber-400" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-bold">
                  14 <span className="text-xl text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">ETH Vault - Savings Plan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 backdrop-blur-sm border-purple-500/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Cross-Chain Overview</CardTitle>
            <CardDescription>
              Your assets distribution across blockchains
            </CardDescription>
          </div>
          <Button
            variant="outline" 
            size="sm"
            className="bg-[#8B00D7]/10 text-[#8B00D7] border-[#8B00D7]/30 hover:bg-[#8B00D7]/20"
            onClick={() => navigate('/cross-chain-atomic-swap')}
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Atomic Swaps
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chainStats.map((chain) => (
              <div key={chain.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {chain.icon}
                    <span className="font-medium">{chain.name}</span>
                    {chain.connected ? (
                      <Badge variant="outline" className={`${chain.bgColor} ${chain.borderColor}`}>
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10 border-gray-500/30">
                        Not Connected
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    {chain.connected ? (
                      <span>
                        {chain.totalLocked.toFixed(4)} {chain.currency}
                        {" "}({chain.percentage}%)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not available</span>
                    )}
                  </div>
                </div>
                <Progress 
                  value={chain.connected ? chain.percentage : 0} 
                  className={`h-2 ${chain.bgColor}`} 
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}