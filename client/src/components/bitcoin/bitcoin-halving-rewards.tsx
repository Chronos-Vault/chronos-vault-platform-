import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCVTToken, TimeMultiplier } from '@/contexts/cvt-token-context';
import { useBitcoin } from '@/contexts/bitcoin-context';
import { Bitcoin, TrendingUp, Calendar, Coins, Trophy, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

export const BitcoinHalvingRewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('rewards');
  const [btcAmount, setBtcAmount] = useState<number>(1);
  const [lockPeriod, setLockPeriod] = useState<number>(1); // Periods in quarters (3 months)
  
  const { 
    nextHalvingDate, 
    daysUntilHalving, 
    halvingInfo,
    priceData,
    isLoading 
  } = useBitcoin();
  const { estimateHalvingRewards } = useCVTToken();
  
  const [calculatedRewards, setCalculatedRewards] = useState<string>('0');
  
  // Update calculated rewards when inputs change
  useEffect(() => {
    setCalculatedRewards(estimateHalvingRewards(btcAmount.toString(), lockPeriod));
  }, [btcAmount, lockPeriod, estimateHalvingRewards]);
  
  // Calculate APY based on lock period
  const calculateAPY = (): string => {
    // Base APY for Bitcoin Halving Vaults
    const baseAPY = 8; // 8%
    
    // APY multiplier based on lock period
    let multiplier = 1.0;
    if (lockPeriod >= 16) { // 4 years
      multiplier = 2.5;
    } else if (lockPeriod >= 8) { // 2 years
      multiplier = 2.0;
    } else if (lockPeriod >= 4) { // 1 year
      multiplier = 1.5;
    } else if (lockPeriod >= 2) { // 6 months
      multiplier = 1.2;
    }
    
    return (baseAPY * multiplier).toFixed(1);
  };
  
  // Get period label
  const getPeriodLabel = (): string => {
    if (lockPeriod >= 16) {
      return '4 years (Diamond)';
    } else if (lockPeriod >= 8) {
      return '2 years (Gold)';
    } else if (lockPeriod >= 4) {
      return '1 year (Silver)';
    } else if (lockPeriod >= 2) {
      return '6 months (Bronze)';
    } else {
      return '3 months (Basic)';
    }
  };
  
  // Get badge for current lock period
  const getLockBadge = (): JSX.Element => {
    if (lockPeriod >= 16) {
      return (
        <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-purple-300">
          Diamond Hands
        </Badge>
      );
    } else if (lockPeriod >= 8) {
      return (
        <Badge variant="outline" className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-white border-yellow-300">
          Gold Tier
        </Badge>
      );
    } else if (lockPeriod >= 4) {
      return (
        <Badge variant="outline" className="bg-gradient-to-r from-gray-400 to-gray-600 text-white border-gray-300">
          Silver Tier
        </Badge>
      );
    } else if (lockPeriod >= 2) {
      return (
        <Badge variant="outline" className="bg-gradient-to-r from-amber-600 to-amber-800 text-white border-amber-300">
          Bronze Tier
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
          Basic Tier
        </Badge>
      );
    }
  };
  
  // Compute the challenge level based on lock period
  const getChallengeProgress = (): number => {
    // Max is 16 quarters (4 years)
    return (lockPeriod / 16) * 100;
  };
  
  return (
    <Card className="border-orange-200 dark:border-orange-800/50 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-b border-orange-200 dark:border-orange-800/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Coins className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-orange-900 dark:text-orange-300">Bitcoin Halving CVT Rewards</CardTitle>
          </div>
          {getLockBadge()}
        </div>
        <CardDescription className="text-orange-700 dark:text-orange-400">
          Earn CVT tokens by locking your Bitcoin through halving cycles
        </CardDescription>
      </CardHeader>
      <div className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 p-4 flex justify-between items-center border-b border-orange-200 dark:border-orange-800/50">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <div>
            <div className="text-sm font-medium text-orange-900 dark:text-orange-300">
              Next Bitcoin Halving
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {isLoading ? (
                <Skeleton className="h-3 w-24" />
              ) : (
                `${daysUntilHalving} days remaining`
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium text-orange-900 dark:text-orange-300">
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              `${nextHalvingDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}`
            )}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 text-right">
            {isLoading || !halvingInfo ? (
              <Skeleton className="h-3 w-16 ml-auto" />
            ) : (
              `Block reward: ${halvingInfo.nextReward} BTC`
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-0">
        <Tabs 
          defaultValue="rewards" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none bg-orange-100 dark:bg-orange-900/30 border-b border-orange-200 dark:border-orange-800/50">
            <TabsTrigger 
              value="rewards" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black/70 data-[state=active]:text-orange-900 dark:data-[state=active]:text-orange-300 rounded-none"
            >
              Rewards Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="diamond" 
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-black/70 data-[state=active]:text-orange-900 dark:data-[state=active]:text-orange-300 rounded-none"
            >
              Diamond Hands Challenge
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards" className="p-6 space-y-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                    Bitcoin Amount: {btcAmount.toFixed(2)} BTC
                  </span>
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    Max 10 BTC
                  </span>
                </div>
                <Slider
                  value={[btcAmount]}
                  min={0.01}
                  max={10}
                  step={0.01}
                  onValueChange={(value) => setBtcAmount(value[0])}
                  className="[&_[role=slider]]:bg-orange-600"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                    Lock Period: {getPeriodLabel()}
                  </span>
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    {lockPeriod * 3} months
                  </span>
                </div>
                <Slider
                  value={[lockPeriod]}
                  min={1}
                  max={16}
                  step={1}
                  onValueChange={(value) => setLockPeriod(value[0])}
                  className="[&_[role=slider]]:bg-orange-600"
                />
              </div>
              
              <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-5">
                <div className="flex justify-between mb-4">
                  <div className="space-y-1">
                    <div className="text-sm text-orange-600 dark:text-orange-400">Estimated Rewards</div>
                    <div className="text-3xl font-bold text-orange-900 dark:text-orange-300">
                      {parseInt(calculatedRewards).toLocaleString()} CVT
                    </div>
                  </div>
                  <div className="bg-orange-100 dark:bg-orange-900/30 h-14 w-14 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded p-3">
                    <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Annual Percentage Yield</div>
                    <div className="text-xl font-bold text-orange-900 dark:text-orange-300">{calculateAPY()}% APY</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded p-3">
                    <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">Special Bonus</div>
                    <div className="text-xl font-bold text-orange-900 dark:text-orange-300">+10% at Halving</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-orange-700 dark:text-orange-400">
              Lock your Bitcoin in a Halving Vault to earn CVT tokens as rewards. Longer lock periods earn 
              higher rewards and special tier badges. Your Bitcoin remains securely locked until the predetermined 
              unlock date, while earning CVT tokens throughout the lock period.
            </div>
          </TabsContent>
          
          <TabsContent value="diamond" className="p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-12 w-12 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300">Diamond Hands Challenge</h3>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Lock your Bitcoin for 4 years to earn the prestigious Diamond Hands badge
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-orange-700 dark:text-orange-400">Current Level: {getPeriodLabel()}</span>
                <span className="text-orange-700 dark:text-orange-400">Diamond Hands (4 years)</span>
              </div>
              <Progress 
                value={getChallengeProgress()} 
                className="h-2.5 bg-orange-100 dark:bg-orange-900/30"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-3 mt-4">
              <div className={`rounded border p-3 text-center ${lockPeriod >= 1 ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>
                <div className="text-xs font-semibold mb-1">Level 1</div>
                <div className="text-xs">3 Months</div>
              </div>
              <div className={`rounded border p-3 text-center ${lockPeriod >= 2 ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>
                <div className="text-xs font-semibold mb-1">Bronze</div>
                <div className="text-xs">6 Months</div>
              </div>
              <div className={`rounded border p-3 text-center ${lockPeriod >= 4 ? 'bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>
                <div className="text-xs font-semibold mb-1">Silver</div>
                <div className="text-xs">1 Year</div>
              </div>
              <div className={`rounded border p-3 text-center ${lockPeriod >= 16 ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'}`}>
                <div className="text-xs font-semibold mb-1">Diamond</div>
                <div className="text-xs">4 Years</div>
              </div>
            </div>
            
            <div className="space-y-3 mt-2">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                </div>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  <strong>Bronze Badge:</strong> Early access to new vaults + 20% CVT bonus
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                </div>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  <strong>Silver Badge:</strong> 50% CVT bonus + Reduced platform fees (0.5%)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 dark:text-orange-400 text-sm font-bold">✓</span>
                </div>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  <strong>Diamond Badge:</strong> Exclusive commemorative NFT + 200% CVT bonus + Zero platform fees
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-orange-50 dark:bg-orange-950/10 border-t border-orange-200 dark:border-orange-800/50 p-4 text-sm text-orange-700 dark:text-orange-400 flex gap-2 items-start">
        <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          The Bitcoin Halving occurs approximately every four years (210,000 blocks). Synchronizing your vault with 
          the halving cycle allows you to maximize potential gains while earning CVT rewards.
        </p>
      </CardFooter>
    </Card>
  );
};