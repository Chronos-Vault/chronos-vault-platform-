import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCVTToken, StakingTier } from '@/contexts/cvt-token-context';
import { Coins, CoinsIcon, Award, TrendingUp, Lock, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/date-utils';

export const CVTTokenCard: React.FC = () => {
  const { 
    tokenBalance, 
    stakedBalance, 
    totalSupply, 
    currentStakingTier,
    stakingEndTime,
    isLoading,
    getTierBenefits
  } = useCVTToken();
  
  // Calculate total holdings
  const totalHoldings = parseFloat(tokenBalance) + parseFloat(stakedBalance);
  
  // Format numbers for display
  const formatNumber = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Get icon based on tier
  const getTierIcon = (tier: StakingTier) => {
    switch(tier) {
      case StakingTier.SOVEREIGN:
        return <Shield className="h-5 w-5 text-purple-500" />;
      case StakingTier.ARCHITECT:
        return <Award className="h-5 w-5 text-blue-500" />;
      case StakingTier.GUARDIAN:
        return <Lock className="h-5 w-5 text-green-500" />;
      default:
        return <CoinsIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get color class based on tier
  const getTierColorClass = (tier: StakingTier): string => {
    switch(tier) {
      case StakingTier.SOVEREIGN:
        return 'bg-gradient-to-r from-purple-700 to-purple-900 text-white';
      case StakingTier.ARCHITECT:
        return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white';
      case StakingTier.GUARDIAN:
        return 'bg-gradient-to-r from-green-600 to-green-800 text-white';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };
  
  // Calculate percentage of total supply
  const supplyPercentage = totalHoldings / parseFloat(totalSupply) * 100;
  
  // Get staking status text
  const getStakingStatusText = () => {
    if (parseFloat(stakedBalance) === 0) {
      return 'Not staking';
    }
    return stakingEndTime 
      ? `Staked until ${formatDate(stakingEndTime)}` 
      : 'Staking active';
  };
  
  const tierBenefits = getTierBenefits(currentStakingTier);
  
  return (
    <Card className="w-full overflow-hidden border border-[#6B00D7]/20 dark:border-[#6B00D7]/30">
      <CardHeader className={`py-4 ${getTierColorClass(currentStakingTier)}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6" />
            <CardTitle className="text-lg">CVT Token Balance</CardTitle>
          </div>
          <Badge variant="outline" className="border border-white/30 text-white">
            {currentStakingTier === StakingTier.NONE ? 'No Tier' : currentStakingTier}
          </Badge>
        </div>
        <CardDescription className={currentStakingTier === StakingTier.NONE ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'}>
          Your Chronos Vault Token holdings and staking status
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Available Balance</div>
              <div className="text-2xl font-bold">{formatNumber(tokenBalance)} CVT</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">Staked Balance</div>
              <div className="text-2xl font-bold">{formatNumber(stakedBalance)} CVT</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1.5">
              <span>Total Holdings: {formatNumber(totalHoldings)} CVT</span>
              <span>{supplyPercentage.toFixed(6)}% of supply</span>
            </div>
            <Progress value={supplyPercentage} max={100} className="h-2" />
          </div>
          
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              {getTierIcon(currentStakingTier)}
              <h3 className="font-semibold">{currentStakingTier} Benefits</h3>
            </div>
            <div className="space-y-1">
              {tierBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <span className="text-[#6B00D7] dark:text-[#FF5AF7]">✓</span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{benefit}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Status: {getStakingStatusText()}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400">+10% APY</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 pb-4 gap-4">
        <Button 
          variant="default" 
          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5900B3] hover:to-[#FF46E8] text-white flex-1"
          disabled={isLoading}
        >
          <Lock className="mr-2 h-4 w-4" />
          Stake CVT
        </Button>
        <Button 
          variant="outline" 
          className="border-[#6B00D7]/30 text-[#6B00D7] dark:text-[#FF5AF7] hover:bg-[#6B00D7]/10 flex-1"
          disabled={isLoading || parseFloat(stakedBalance) === 0}
        >
          Unstake CVT
        </Button>
      </CardFooter>
    </Card>
  );
};