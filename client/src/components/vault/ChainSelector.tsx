import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Shield, Clock, TrendingDown, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface ChainOption {
  id: 'ethereum' | 'solana' | 'ton';
  name: string;
  symbol: string;
  icon: string;
  color: string;
  gradient: string;
}

interface ChainSelectorProps {
  onChainSelect: (chain: 'ethereum' | 'solana' | 'ton', feeData: any) => void;
  selectedChain?: 'ethereum' | 'solana' | 'ton';
  operationType?: string;
}

const chainOptions: ChainOption[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: '⟠',
    color: 'from-blue-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
  },
  {
    id: 'ton',
    name: 'TON',
    symbol: 'TON',
    icon: '💎',
    color: 'from-blue-400 to-cyan-400',
    gradient: 'bg-gradient-to-br from-blue-400/20 to-cyan-400/20'
  }
];

export function ChainSelector({ onChainSelect, selectedChain, operationType = 'vault_creation' }: ChainSelectorProps) {
  const [hoveredChain, setHoveredChain] = useState<string | null>(null);

  const { data: feeComparison, isLoading } = useQuery<any>({
    queryKey: ['/api/chain/fees/compare', operationType],
    refetchInterval: 30000
  });

  const handleSelect = (chainId: 'ethereum' | 'solana' | 'ton') => {
    if (feeComparison?.data) {
      onChainSelect(chainId, feeComparison.data);
    }
  };

  const getFeeForChain = (chainId: string) => {
    if (!feeComparison?.data) return null;
    return feeComparison.data[chainId];
  };

  const getSavings = (chainId: string) => {
    if (!feeComparison?.data) return null;
    const chainFee = parseFloat(getFeeForChain(chainId)?.estimatedFeeUsd || '0');
    const ethFee = parseFloat(getFeeForChain('ethereum')?.estimatedFeeUsd || '0');
    const savings = ethFee - chainFee;
    const percent = ethFee > 0 ? (savings / ethFee * 100).toFixed(1) : 0;
    return { amount: savings.toFixed(2), percent };
  };

  const getSpeedBadge = (chainId: string) => {
    const speeds = {
      ethereum: { label: '15-60s', color: 'bg-yellow-500/20 text-yellow-300' },
      solana: { label: '~1s', color: 'bg-green-500/20 text-green-300' },
      ton: { label: '~5s', color: 'bg-blue-500/20 text-blue-300' }
    };
    return speeds[chainId as keyof typeof speeds];
  };

  const getTrinityRole = (chainId: string) => {
    if (chainId === selectedChain) {
      return { role: 'Primary Vault', icon: Shield, color: 'text-green-400' };
    }
    return { role: 'Verifier', icon: CheckCircle2, color: 'text-blue-400' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Choose Your Primary Blockchain
        </h3>
        <p className="text-gray-400">
          Select where your vault will be deployed. Trinity Protocol secures across all chains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chainOptions.map((chain) => {
          const feeData = getFeeForChain(chain.id);
          const savings = getSavings(chain.id);
          const speed = getSpeedBadge(chain.id);
          const trinity = getTrinityRole(chain.id);
          const isSelected = selectedChain === chain.id;
          const isHovered = hoveredChain === chain.id;

          return (
            <Card
              key={chain.id}
              data-testid={`chain-selector-${chain.id}`}
              className={`relative cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                  : 'border-gray-700 hover:border-gray-600'
              } ${chain.gradient} backdrop-blur-sm`}
              onMouseEnter={() => setHoveredChain(chain.id)}
              onMouseLeave={() => setHoveredChain(null)}
              onClick={() => handleSelect(chain.id)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              )}

              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-4xl bg-gradient-to-br ${chain.color} bg-clip-text`}>
                      {chain.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{chain.name}</CardTitle>
                      <CardDescription className="text-xs">{chain.symbol}</CardDescription>
                    </div>
                  </div>
                  <Badge className={speed.color} data-testid={`speed-badge-${chain.id}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {speed.label}
                  </Badge>
                </div>

                {feeComparison?.data?.recommendation === chain.id && (
                  <Badge className="bg-green-500/20 text-green-300 w-fit" data-testid={`recommended-badge-${chain.id}`}>
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  </div>
                ) : feeData ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          Creation Fee
                        </span>
                        <span className="font-bold text-lg" data-testid={`fee-${chain.id}`}>
                          ${feeData.estimatedFeeUsd}
                        </span>
                      </div>

                      {savings && parseFloat(savings.amount) > 0 && (
                        <div className="flex items-center justify-between text-green-400 text-sm">
                          <span>vs Ethereum</span>
                          <span className="font-semibold" data-testid={`savings-${chain.id}`}>
                            -${savings.amount} ({savings.percent}%)
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <trinity.icon className={`w-4 h-4 ${trinity.color}`} />
                        <span className={trinity.color}>{trinity.role}</span>
                      </div>
                      {selectedChain === chain.id && (
                        <p className="text-xs text-gray-400 mt-1">
                          Secured by {chainOptions.filter(c => c.id !== chain.id).map(c => c.name).join(' + ')}
                        </p>
                      )}
                    </div>

                    {(isHovered || isSelected) && (
                      <div className="space-y-1 text-xs text-gray-400 pt-2 border-t border-gray-700">
                        <div className="flex justify-between">
                          <span>Network:</span>
                          <Badge variant="outline" className="text-xs">
                            {feeData.networkCongestion || 'low'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Confirmation:</span>
                          <span data-testid={`time-${chain.id}`}>{feeData.estimatedTime}s</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}

                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className="w-full"
                  data-testid={`button-select-${chain.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(chain.id);
                  }}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedChain && feeComparison?.data && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Trinity Protocol Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-300">
              Your vault will be deployed on <span className="font-bold text-blue-400">{chainOptions.find(c => c.id === selectedChain)?.name}</span>, 
              with mathematical 2-of-3 verification from the other chains ensuring maximum security.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {chainOptions.map((chain) => (
                <div key={chain.id} className="space-y-1">
                  <div className="text-2xl">{chain.icon}</div>
                  <div className="text-xs font-semibold">{chain.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {chain.id === selectedChain ? 'Primary' : 'Verifier'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
