import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { 
  Loader2, 
  CoinsIcon, 
  CheckCircle2, 
  Landmark, 
  Shield,
  LockIcon,
  TrendingUp,
  BarChart2 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/wallet-context';
import WalletConnect from '@/components/wallet/WalletConnect';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import cvtTokenService, { StakingTier } from '@/services/CVTTokenService';

// Form validation schema
const stakingFormSchema = z.object({
  amount: z.number().positive().min(100, { message: "Minimum staking amount is 100 CVT" }),
  lockPeriod: z.enum(['30', '90', '180', '365']),
});

type StakingFormValues = z.infer<typeof stakingFormSchema>;

export default function CVTStakingPage() {
  const { toast } = useToast();
  const { connectedWallet } = useWallet();
  
  const [isStaking, setIsStaking] = useState(false);
  const [hasStaked, setHasStaked] = useState(false);
  const [stakeResult, setStakeResult] = useState<any>(null);
  
  // Form setup
  const form = useForm<StakingFormValues>({
    resolver: zodResolver(stakingFormSchema),
    defaultValues: {
      amount: 0,
      lockPeriod: '30',
    },
  });
  
  // Get staking tiers info
  const { data: stakingTiers, isLoading: isLoadingTiers } = useQuery({
    queryKey: ['stakingTiers'],
    queryFn: () => cvtTokenService.getStakingTiers(),
  });
  
  // Get user's current staking position
  const { data: userStakingPosition, isLoading: isLoadingStakingPosition } = useQuery({
    queryKey: ['stakingPosition', connectedWallet?.address],
    queryFn: () => connectedWallet?.address 
      ? cvtTokenService.getUserStakingPosition(connectedWallet.address)
      : null,
    enabled: !!connectedWallet?.address,
  });
  
  // Get token balances
  const { data: tokenBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ['tokenBalances', connectedWallet?.address],
    queryFn: () => connectedWallet?.address 
      ? cvtTokenService.getTokenBalances(connectedWallet.address)
      : [],
    enabled: !!connectedWallet?.address,
  });
  
  // Get token price
  const { data: tokenPrice, isLoading: isLoadingPrice } = useQuery({
    queryKey: ['tokenPrice'],
    queryFn: () => cvtTokenService.getTokenPrice(),
  });
  
  // Calculate total balance across all chains
  const totalBalance = tokenBalances
    ? tokenBalances.reduce((sum, balance) => sum + balance.balance, 0)
    : 0;
  
  // Calculate total staked value
  const totalStaked = userStakingPosition ? userStakingPosition.stakedAmount : 0;
  
  // Calculate total value
  const tokenPriceUSD = tokenPrice?.usd || 0;
  const totalValueUSD = (totalBalance + totalStaked) * tokenPriceUSD;
  const stakedValueUSD = totalStaked * tokenPriceUSD;
  
  // Handle stake submission
  const onSubmit = async (values: StakingFormValues) => {
    if (!connectedWallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to stake CVT tokens",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsStaking(true);
      
      const result = await cvtTokenService.stakeTokens(
        values.amount,
        parseInt(values.lockPeriod) as 30 | 90 | 180 | 365
      );
      
      setStakeResult(result);
      setHasStaked(true);
      
      toast({
        title: "Staking Successful",
        description: `You have staked ${values.amount} CVT for ${values.lockPeriod} days`,
      });
    } catch (error) {
      console.error("Staking error:", error);
      toast({
        title: "Staking failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };
  
  // Calculate percentage for active tier
  const calculateTierProgress = () => {
    if (!userStakingPosition || !stakingTiers) return 0;
    
    const currentTier = stakingTiers.find(t => t.tier === userStakingPosition.tier);
    const nextTier = stakingTiers.find(t => t.minimumStake > currentTier!.minimumStake);
    
    if (!nextTier) return 100; // Already at max tier
    
    const range = nextTier.minimumStake - currentTier!.minimumStake;
    const progress = userStakingPosition.stakedAmount - currentTier!.minimumStake;
    
    return Math.min(Math.floor((progress / range) * 100), 100);
  };
  
  // Calculate rewards based on amount and lock period
  const calculateProjectedRewards = () => {
    const amount = form.getValues('amount');
    const lockPeriod = parseInt(form.getValues('lockPeriod'));
    
    const apyMap: Record<number, number> = {
      30: 0.10,  // 10% APY for 30 days
      90: 0.12,  // 12% APY for 90 days
      180: 0.15, // 15% APY for 180 days
      365: 0.20  // 20% APY for 365 days
    };
    
    const apy = apyMap[lockPeriod];
    return amount * (lockPeriod / 365) * apy;
  };
  
  // Get relevant tier for amount
  const getTierForAmount = (amount: number) => {
    if (!stakingTiers) return null;
    
    const eligibleTiers = stakingTiers.filter(tier => tier.minimumStake <= amount);
    return eligibleTiers.length > 0
      ? eligibleTiers.reduce((prev, current) => 
          prev.minimumStake > current.minimumStake ? prev : current
        )
      : stakingTiers[0];
  };
  
  // Projected tier based on form amount
  const projectedTier = getTierForAmount(
    (userStakingPosition?.stakedAmount || 0) + (form.watch('amount') || 0)
  );
  
  // Success view after staking
  const renderSuccessView = () => {
    if (!stakeResult) return null;
    
    return (
      <Card className="border border-green-500/20 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-green-500 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Staking Successful
          </CardTitle>
          <CardDescription>
            Your CVT tokens have been successfully staked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Amount Staked</div>
              <div className="text-xl font-semibold">{stakeResult.amount} CVT</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tier</div>
              <div className="text-xl font-semibold">{stakeResult.tier}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Projected Rewards</div>
              <div className="text-xl font-semibold">{stakeResult.projectedRewards.toFixed(2)} CVT</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Unlock Date</div>
              <div className="text-xl font-semibold">{new Date(stakeResult.unlockDate).toLocaleDateString()}</div>
            </div>
          </div>
          
          <Alert className="bg-secondary/30 border-primary/20">
            <LockIcon className="h-4 w-4" />
            <AlertTitle>Tokens Locked</AlertTitle>
            <AlertDescription>
              Your tokens are now locked until the unlock date. You'll earn staking rewards during this period.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            onClick={() => {
              setHasStaked(false);
              setStakeResult(null);
              form.reset();
            }}
            className="w-full"
          >
            Stake More CVT
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Dashboard view
  const renderDashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total CVT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingBalances ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                `${(totalBalance + totalStaked).toLocaleString()} CVT`
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ${totalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Staked CVT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStakingPosition ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : userStakingPosition ? (
                `${totalStaked.toLocaleString()} CVT`
              ) : (
                '0 CVT'
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              ${stakedValueUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStakingPosition ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : userStakingPosition ? (
                userStakingPosition.tier.split(' ')[1] || userStakingPosition.tier
              ) : (
                'None'
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {userStakingPosition?.tier === StakingTier.NONE ? (
                'No staking benefits'
              ) : (
                `${userStakingPosition?.tier === StakingTier.GUARDIAN ? '75%' : 
                  userStakingPosition?.tier === StakingTier.ARCHITECT ? '90%' : 
                  userStakingPosition?.tier === StakingTier.SOVEREIGN ? '100%' : '0%'} fee discount`
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Main staking form
  const renderStakingForm = () => {
    const amount = form.watch('amount');
    const lockPeriod = form.watch('lockPeriod');
    const projectedRewards = calculateProjectedRewards();
    
    return (
      <Card className="border border-purple-800/20">
        <CardHeader>
          <CardTitle>Stake CVT Tokens</CardTitle>
          <CardDescription>
            Stake your CVT tokens to earn rewards and unlock premium features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staking Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : value);
                        }}
                        className="text-xl"
                      />
                    </FormControl>
                    <div className="flex justify-between text-sm">
                      <FormDescription>
                        Minimum stake: 100 CVT
                      </FormDescription>
                      {connectedWallet && tokenBalances && (
                        <button
                          type="button"
                          className="text-primary text-sm hover:underline"
                          onClick={() => {
                            const tonBalance = tokenBalances.find(b => b.chain === 'ton')?.balance || 0;
                            form.setValue('amount', tonBalance);
                          }}
                        >
                          Max: {tokenBalances.find(b => b.chain === 'ton')?.balance.toLocaleString() || 0} CVT
                        </button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lockPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lock Period</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="30" id="30days" />
                          </FormControl>
                          <FormLabel htmlFor="30days" className="font-normal cursor-pointer">
                            30 Days (10% APY)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="90" id="90days" />
                          </FormControl>
                          <FormLabel htmlFor="90days" className="font-normal cursor-pointer">
                            90 Days (12% APY)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="180" id="180days" />
                          </FormControl>
                          <FormLabel htmlFor="180days" className="font-normal cursor-pointer">
                            180 Days (15% APY)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="365" id="365days" />
                          </FormControl>
                          <FormLabel htmlFor="365days" className="font-normal cursor-pointer">
                            365 Days (20% APY)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Longer lock periods earn higher rewards
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {amount > 0 && lockPeriod && (
                <div className="p-4 rounded-lg bg-secondary/30 space-y-4">
                  <div className="text-sm font-medium">Staking Summary</div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-muted-foreground">Amount to Stake:</div>
                    <div className="text-right font-medium">{amount.toLocaleString()} CVT</div>
                    
                    <div className="text-muted-foreground">Lock Period:</div>
                    <div className="text-right font-medium">{lockPeriod} Days</div>
                    
                    <div className="text-muted-foreground">Projected Rewards:</div>
                    <div className="text-right font-medium">{projectedRewards.toFixed(2)} CVT</div>
                    
                    <div className="text-muted-foreground">Unlock Date:</div>
                    <div className="text-right font-medium">
                      {new Date(Date.now() + parseInt(lockPeriod) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                    
                    <div className="text-muted-foreground">New Total Staked:</div>
                    <div className="text-right font-medium">
                      {(amount + (userStakingPosition?.stakedAmount || 0)).toLocaleString()} CVT
                    </div>
                    
                    <div className="text-muted-foreground">Projected Tier:</div>
                    <div className="text-right">
                      {projectedTier ? (
                        <Badge className="bg-gradient-to-r from-purple-600/10 to-pink-500/10 border-purple-600/30">
                          {projectedTier.tier}
                        </Badge>
                      ) : (
                        <span className="font-medium">None</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                disabled={isStaking}
              >
                {isStaking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>Stake CVT Tokens</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };
  
  // Render tier information
  const renderTiers = () => {
    if (isLoadingTiers) {
      return (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 gap-6">
        {stakingTiers?.map((tier) => (
          <Card 
            key={tier.tier}
            className={`border ${tier.tier === userStakingPosition?.tier ? 'border-purple-500' : 'border-purple-800/20'}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: tier.color }}>{tier.tier}</CardTitle>
                {tier.tier === userStakingPosition?.tier && (
                  <Badge className="bg-purple-500/20 text-purple-500 border-purple-500/50">
                    Your Current Tier
                  </Badge>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Minimum Stake</div>
                <div className="font-medium">{tier.minimumStake.toLocaleString()} CVT</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Fee Discount</div>
                <div className="font-medium">{tier.feeDiscount}%</div>
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm font-medium mb-2">Benefits</div>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {tier.tier === userStakingPosition?.tier && userStakingPosition && (
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <div>Progress to Next Tier</div>
                    <div>{calculateTierProgress()}%</div>
                  </div>
                  <Progress value={calculateTierProgress()} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {tier.tier !== userStakingPosition?.tier ? (
                <Button
                  className="w-full"
                  variant={tier.tier === StakingTier.NONE ? "outline" : "default"}
                  onClick={() => {
                    const stakeDifference = Math.max(0, tier.minimumStake - (userStakingPosition?.stakedAmount || 0));
                    form.setValue('amount', stakeDifference);
                    
                    // Scroll to the staking form
                    document.getElementById('staking-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  disabled={tier.tier === StakingTier.NONE}
                >
                  {tier.tier === StakingTier.NONE ? (
                    'No Staking Required'
                  ) : userStakingPosition ? (
                    `Upgrade to ${tier.tier}`
                  ) : (
                    `Stake ${tier.minimumStake.toLocaleString()} CVT`
                  )}
                </Button>
              ) : (
                <div className="text-center w-full text-sm text-muted-foreground">
                  You are currently enjoying all benefits of this tier
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text mb-2">
          CVT Token Staking
        </h1>
        <p className="text-muted-foreground">
          Stake your Chronos Vault Tokens to earn rewards and unlock premium features
        </p>
      </div>
      
      {!connectedWallet ? (
        <Card className="border border-purple-800/20 mb-8">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to manage your CVT token staking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>
      ) : (
        <>
          {renderDashboard()}
          
          <Tabs defaultValue="stake" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
              <TabsTrigger value="tiers">Staking Tiers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stake" className="pt-6">
              <div id="staking-form">
                {hasStaked ? renderSuccessView() : renderStakingForm()}
              </div>
            </TabsContent>
            
            <TabsContent value="tiers" className="pt-6">
              {renderTiers()}
            </TabsContent>
          </Tabs>
        </>
      )}
      
      <Separator className="my-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Earn Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Earn up to 20% APY by staking your CVT tokens for longer periods
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              Fee Discounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enjoy up to 100% discount on platform fees based on your staking tier
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-800/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-purple-500" />
              Governance Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Participate in platform governance and vote on protocol upgrades
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}