import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCVTToken, TimeMultiplier } from '@/contexts/cvt-token-context';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Clock, TrendingUp, BarChart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '@/lib/utils';

// Define form schema with Zod
const stakingFormSchema = z.object({
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)), { message: 'Amount must be a number' })
    .refine(val => parseFloat(val) > 0, { message: 'Amount must be greater than 0' }),
  duration: z.enum([
    TimeMultiplier.MONTH_3, 
    TimeMultiplier.MONTH_6, 
    TimeMultiplier.YEAR_1, 
    TimeMultiplier.YEAR_2, 
    TimeMultiplier.YEAR_4
  ]),
});

type StakingFormValues = z.infer<typeof stakingFormSchema>;

export const CVTStakingForm: React.FC = () => {
  const { 
    tokenBalance, 
    calculateRewards,
    stakeTokens,
    timeMultipliers,
    isLoading
  } = useCVTToken();
  
  const [estimatedRewards, setEstimatedRewards] = useState<string>('0');
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Initialize form
  const form = useForm<StakingFormValues>({
    resolver: zodResolver(stakingFormSchema),
    defaultValues: {
      amount: '',
      duration: TimeMultiplier.MONTH_3,
    },
  });
  
  // Watch for form value changes to update estimated rewards
  const watchAmount = form.watch('amount');
  const watchDuration = form.watch('duration');
  
  useEffect(() => {
    if (watchAmount && !isNaN(parseFloat(watchAmount)) && parseFloat(watchAmount) > 0) {
      // Calculate estimated rewards
      setEstimatedRewards(calculateRewards(watchAmount, watchDuration));
      
      // Calculate end date
      const newEndDate = new Date();
      
      switch (watchDuration) {
        case TimeMultiplier.MONTH_3:
          newEndDate.setMonth(newEndDate.getMonth() + 3);
          break;
        case TimeMultiplier.MONTH_6:
          newEndDate.setMonth(newEndDate.getMonth() + 6);
          break;
        case TimeMultiplier.YEAR_1:
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
          break;
        case TimeMultiplier.YEAR_2:
          newEndDate.setFullYear(newEndDate.getFullYear() + 2);
          break;
        case TimeMultiplier.YEAR_4:
          newEndDate.setFullYear(newEndDate.getFullYear() + 4);
          break;
      }
      
      setEndDate(newEndDate);
    } else {
      setEstimatedRewards('0');
      setEndDate(null);
    }
  }, [watchAmount, watchDuration, calculateRewards]);
  
  const onSubmit = async (values: StakingFormValues) => {
    const result = await stakeTokens(values.amount, values.duration);
    
    if (result) {
      setSuccess(true);
      form.reset();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };
  
  return (
    <Card className="w-full border border-[#6B00D7]/20 dark:border-[#6B00D7]/30">
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-[#6B00D7]" />
          <CardTitle className="text-lg">Stake CVT Tokens</CardTitle>
        </div>
        <CardDescription>
          Stake your CVT tokens to earn rewards and gain tier benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50">
            <TrendingUp className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your CVT tokens have been successfully staked.
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount to Stake</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="text"
                        placeholder="Enter amount"
                        {...field}
                        className="pr-14"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">
                        CVT
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Available balance: {tokenBalance} CVT
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Staking Period</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      {Object.entries(timeMultipliers).map(([key, value]) => (
                        <FormItem key={key}>
                          <FormControl>
                            <RadioGroupItem
                              value={key}
                              id={key}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={key}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 dark:border-gray-800 bg-transparent p-4 hover:bg-gray-100/50 dark:hover:bg-gray-900/20 hover:border-[#6B00D7]/30 dark:hover:border-[#FF5AF7]/30 peer-data-[state=checked]:border-[#6B00D7] dark:peer-data-[state=checked]:border-[#FF5AF7] peer-data-[state=checked]:bg-[#6B00D7]/10 dark:peer-data-[state=checked]:bg-[#FF5AF7]/10 transition-all cursor-pointer"
                          >
                            <div className="mb-2 rounded-full bg-[#6B00D7]/10 dark:bg-[#FF5AF7]/10 p-2">
                              <Clock className="h-6 w-6 text-[#6B00D7] dark:text-[#FF5AF7]" />
                            </div>
                            <span className="text-base font-medium">{value.label}</span>
                            <span className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                              {value.description}
                            </span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700/50 space-y-3">
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-[#6B00D7] dark:text-[#FF5AF7]" />
                <h3 className="font-semibold">Staking Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">Amount:</div>
                <div className="text-sm font-medium text-right">{parseFloat(watchAmount || '0').toLocaleString()} CVT</div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">Duration:</div>
                <div className="text-sm font-medium text-right">
                  {watchDuration ? timeMultipliers[watchDuration].label : '-'}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">Unlock Date:</div>
                <div className="text-sm font-medium text-right">
                  {endDate ? formatDate(endDate) : '-'}
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Rewards:</div>
                <div className="text-sm font-medium text-right text-green-600 dark:text-green-400">
                  +{parseFloat(estimatedRewards).toLocaleString()} CVT
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">Reward Multiplier:</div>
                <div className="text-sm font-medium text-right">
                  {watchDuration ? `${timeMultipliers[watchDuration].factor}x` : '1.0x'}
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5900B3] hover:to-[#FF46E8] text-white"
              disabled={isLoading || !watchAmount || parseFloat(watchAmount) <= 0 || parseFloat(watchAmount) > parseFloat(tokenBalance)}
            >
              {isLoading ? 'Processing...' : 'Stake CVT Tokens'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-1">
            <TrendingUp className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7]" />
          </div>
          <p>
            Staking CVT tokens increases your tier level, unlocking platform benefits and earning rewards. 
            Longer staking periods provide higher reward multipliers. You can unstake after the lock period ends.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};