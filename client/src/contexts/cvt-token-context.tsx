import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthContext } from '@/contexts/auth-context';
import { useMultiChain } from '@/contexts/multi-chain-context';
import { ChainId } from '@/lib/contract-interfaces';
import { 
  cvtTokenService,
  calculateStakingRewards,
  calculateTransactionBurn,
  TOTAL_SUPPLY,
  ANNUAL_BURN_RATE
} from '@/lib/cvt/token-service';

// Define staking tier levels
export enum StakingTier {
  NONE = 'None',
  GUARDIAN = 'Guardian',
  ARCHITECT = 'Architect',
  SOVEREIGN = 'Sovereign'
}

// Define multiplier types for time-based rewards
export enum TimeMultiplier {
  MONTH_3 = 'month3',
  MONTH_6 = 'month6',
  YEAR_1 = 'year1',
  YEAR_2 = 'year2',
  YEAR_4 = 'year4',
}

// Staking Requirement Details
const STAKING_REQUIREMENTS = {
  [StakingTier.GUARDIAN]: { amount: '1000', benefits: ['Reduced fees (0.8%)', 'Basic vault templates', 'Community access'] },
  [StakingTier.ARCHITECT]: { amount: '10000', benefits: ['Reduced fees (0.5%)', 'All vault templates', 'Priority support', 'Governance voting'] },
  [StakingTier.SOVEREIGN]: { amount: '50000', benefits: ['Zero fees', 'Premium features', 'Advanced security', 'Governance proposal rights', 'Early access'] },
};

// Time multiplier details
const TIME_MULTIPLIERS = {
  [TimeMultiplier.MONTH_3]: { factor: 1.0, label: '3 Months', description: 'Base rewards' },
  [TimeMultiplier.MONTH_6]: { factor: 1.2, label: '6 Months', description: '20% bonus rewards' },
  [TimeMultiplier.YEAR_1]: { factor: 1.5, label: '1 Year', description: '50% bonus rewards' },
  [TimeMultiplier.YEAR_2]: { factor: 2.0, label: '2 Years', description: '100% bonus rewards' },
  [TimeMultiplier.YEAR_4]: { factor: 3.0, label: '4 Years', description: '200% bonus rewards' },
};

// CVT Token Context interfaces
interface CVTTokenContextType {
  // Token balances
  tokenBalance: string;
  stakedBalance: string;
  totalSupply: string;
  
  // Staking
  currentStakingTier: StakingTier;
  stakingRequirements: typeof STAKING_REQUIREMENTS;
  timeMultipliers: typeof TIME_MULTIPLIERS;
  stakingEndTime: Date | null;
  
  // Bitcoin Vault specific
  bitcoinHalvingRewards: Record<'3months' | '6months' | '1year' | '4years', string>;
  
  // Functions
  stakeTokens: (amount: string, duration: TimeMultiplier) => Promise<boolean>;
  unstakeTokens: () => Promise<boolean>;
  calculateRewards: (lockAmount: string, lockDuration: TimeMultiplier) => string;
  estimateHalvingRewards: (amount: string, periods: number) => string;
  getTierBenefits: (tier: StakingTier) => string[];
  
  // State
  isLoading: boolean;
  refreshBalances: () => Promise<void>;
}

// Create the context
const CVTTokenContext = createContext<CVTTokenContextType | undefined>(undefined);

// Provider component
interface CVTTokenProviderProps {
  children: ReactNode;
}

export function CVTTokenProvider({ children }: CVTTokenProviderProps) {
  const { isAuthenticated } = useAuthContext();
  const { currentChain } = useMultiChain();
  
  // State for balances
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [stakedBalance, setStakedBalance] = useState<string>('0');
  const [totalSupply] = useState<string>('21000000');
  const [currentStakingTier, setCurrentStakingTier] = useState<StakingTier>(StakingTier.NONE);
  const [stakingEndTime, setStakingEndTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Bitcoin halving specific rewards (per halving period)
  const [bitcoinHalvingRewards] = useState<Record<'3months' | '6months' | '1year' | '4years', string>>({
    '3months': '250',
    '6months': '750',
    '1year': '2000',
    '4years': '10000',
  });
  
  // Load balances when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshBalances();
    } else {
      // Reset balances when not authenticated
      setTokenBalance('0');
      setStakedBalance('0');
      setCurrentStakingTier(StakingTier.NONE);
      setStakingEndTime(null);
    }
  }, [isAuthenticated, currentChain]);
  
  // Determine staking tier based on staked amount
  useEffect(() => {
    const stakedAmount = parseFloat(stakedBalance);
    
    if (stakedAmount >= 50000) {
      setCurrentStakingTier(StakingTier.SOVEREIGN);
    } else if (stakedAmount >= 10000) {
      setCurrentStakingTier(StakingTier.ARCHITECT);
    } else if (stakedAmount >= 1000) {
      setCurrentStakingTier(StakingTier.GUARDIAN);
    } else {
      setCurrentStakingTier(StakingTier.NONE);
    }
  }, [stakedBalance]);
  
  // Refresh token balances
  const refreshBalances = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, these would be actual blockchain calls
      // Simulating blockchain data for development purposes
      if (isAuthenticated) {
        // This is placeholder logic - in production this would call actual contracts
        const mockFetchedBalance = '15000';
        const mockStakedBalance = '10000';
        const mockStakingEndDate = new Date();
        mockStakingEndDate.setFullYear(mockStakingEndDate.getFullYear() + 1);
        
        setTokenBalance(mockFetchedBalance);
        setStakedBalance(mockStakedBalance);
        setStakingEndTime(mockStakingEndDate);
      }
    } catch (error) {
      console.error('Failed to refresh token balances:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stake tokens
  const stakeTokens = async (amount: string, duration: TimeMultiplier): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get the current chain
      const chainId = currentChain;
      const chainType = chainId.toUpperCase() === 'ETHEREUM' ? 'ETH' : 
                      chainId.toUpperCase() === 'SOLANA' ? 'SOL' : 'TON';
      
      // Calculate duration in months
      let durationMonths = 3;
      const endDate = new Date();
      
      switch (duration) {
        case TimeMultiplier.MONTH_3:
          durationMonths = 3;
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case TimeMultiplier.MONTH_6:
          durationMonths = 6;
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case TimeMultiplier.YEAR_1:
          durationMonths = 12;
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case TimeMultiplier.YEAR_2:
          durationMonths = 24;
          endDate.setFullYear(endDate.getFullYear() + 2);
          break;
        case TimeMultiplier.YEAR_4:
          durationMonths = 48;
          endDate.setFullYear(endDate.getFullYear() + 4);
          break;
      }
      
      // Use our token service to stake with burn mechanism
      console.log(`Staking ${amount} CVT for ${durationMonths} months on ${chainType}`);
      const amountNum = parseFloat(amount);
      
      // Calculate the burn amount for this transaction (deflationary mechanism)
      const burnAmount = calculateTransactionBurn(amountNum);
      const actualStakedAmount = amountNum - burnAmount;
      
      // Call the token service to stake
      const result = await cvtTokenService.stakeTokens(
        actualStakedAmount,
        durationMonths,
        chainType as any
      );
      
      if (result) {
        // Also burn tokens
        await cvtTokenService.burnTokens(burnAmount, chainType as any);
        
        // Update staking end time
        setStakingEndTime(endDate);
        
        // Update balances
        setTokenBalance((parseFloat(tokenBalance) - amountNum).toString());
        setStakedBalance((parseFloat(stakedBalance) + actualStakedAmount).toString());
        
        console.log(`Successfully staked ${actualStakedAmount} CVT with ${burnAmount} CVT burned`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to stake tokens:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Unstake tokens
  const unstakeTokens = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get the current chain
      const chainId = currentChain;
      const chainType = chainId.toUpperCase() === 'ETHEREUM' ? 'ETH' : 
                      chainId.toUpperCase() === 'SOLANA' ? 'SOL' : 'TON';
      
      // This would be an actual contract call in production
      console.log(`Unstaking ${stakedBalance} CVT tokens from ${chainType}`);
      
      // In a complete implementation, this would involve calling the token service
      // to unstake tokens on the actual chain
      
      // Calculate transaction burn for deflationary mechanism
      const stakedAmount = parseFloat(stakedBalance);
      const burnAmount = calculateTransactionBurn(stakedAmount);
      const actualReturnedAmount = stakedAmount - burnAmount;
      
      // Burn a portion due to deflationary mechanism
      if (burnAmount > 0) {
        await cvtTokenService.burnTokens(burnAmount, chainType as any);
        console.log(`Burned ${burnAmount} CVT during unstaking (deflationary mechanism)`);
      }
      
      // Update balances
      setTokenBalance((parseFloat(tokenBalance) + actualReturnedAmount).toString());
      setStakedBalance('0');
      setStakingEndTime(null);
      
      return true;
    } catch (error) {
      console.error('Failed to unstake tokens:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate rewards based on amount and duration
  const calculateRewards = (lockAmount: string, lockDuration: TimeMultiplier): string => {
    // Convert duration to months
    let durationMonths = 3; // Default for 3 months
    
    switch (lockDuration) {
      case TimeMultiplier.MONTH_6:
        durationMonths = 6;
        break;
      case TimeMultiplier.YEAR_1:
        durationMonths = 12;
        break;
      case TimeMultiplier.YEAR_2:
        durationMonths = 24;
        break;
      case TimeMultiplier.YEAR_4:
        durationMonths = 48;
        break;
    }
    
    // Use our token service to calculate rewards with proper deflationary model
    const tierMultiplier = currentStakingTier === StakingTier.SOVEREIGN 
      ? 1.5 
      : currentStakingTier === StakingTier.ARCHITECT 
      ? 1.25 
      : 1.0;
    
    const rewards = calculateStakingRewards(
      parseFloat(lockAmount), 
      durationMonths, 
      tierMultiplier
    );
    
    return rewards.toFixed(2);
  };
  
  // Estimate rewards for Bitcoin halving
  const estimateHalvingRewards = (amount: string, periods: number): string => {
    // Base calculation for Bitcoin halving rewards, depends on lock period
    let periodKey: '3months' | '6months' | '1year' | '4years' = '3months';
    if (periods >= 16) { // 4 years (4 halvings × 4)
      periodKey = '4years';
    } else if (periods >= 4) { // 1 year
      periodKey = '1year';
    } else if (periods >= 2) { // 6 months
      periodKey = '6months';
    }
    
    const baseReward = parseFloat(bitcoinHalvingRewards[periodKey]);
    const amountFactor = Math.min(parseFloat(amount) / 1.0, 10) / 10; // Cap at 10 BTC
    
    return (baseReward * amountFactor).toFixed(0);
  };
  
  // Get benefits for a specific tier
  const getTierBenefits = (tier: StakingTier): string[] => {
    return tier === StakingTier.NONE 
      ? ['No benefits (not staking)'] 
      : STAKING_REQUIREMENTS[tier].benefits;
  };

  const contextValue: CVTTokenContextType = {
    tokenBalance,
    stakedBalance,
    totalSupply,
    currentStakingTier,
    stakingRequirements: STAKING_REQUIREMENTS,
    timeMultipliers: TIME_MULTIPLIERS,
    stakingEndTime,
    bitcoinHalvingRewards,
    stakeTokens,
    unstakeTokens,
    calculateRewards,
    estimateHalvingRewards,
    getTierBenefits,
    isLoading,
    refreshBalances,
  };

  return (
    <CVTTokenContext.Provider value={contextValue}>
      {children}
    </CVTTokenContext.Provider>
  );
}

// Hook to use the CVT token context
export function useCVTToken() {
  const context = useContext(CVTTokenContext);
  
  if (context === undefined) {
    throw new Error('useCVTToken must be used within a CVTTokenProvider');
  }
  
  return context;
}