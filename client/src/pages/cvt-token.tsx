import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/page-header';
import { CVTTokenCard } from '@/components/token/cvt-token-card';
import { CVTStakingForm } from '@/components/token/cvt-staking-form';
import { CVTDistributionChart } from '@/components/token/cvt-distribution-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet';
import { useAuthContext } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CVTTokenProvider, StakingTier, useCVTToken } from '@/contexts/cvt-token-context';
import { Coins, Lock, TrendingUp, ArrowLeft, ArrowRight, ShieldCheck, Lightbulb, DollarSign, Loader2 } from 'lucide-react';

const TierBenefitsCard: React.FC = () => {
  const { stakingRequirements } = useCVTToken();
  
  return (
    <Card className="border border-[#6B00D7]/20 dark:border-[#6B00D7]/30">
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#6B00D7]" />
          <CardTitle className="text-lg">CVT Token Tier Benefits</CardTitle>
        </div>
        <CardDescription>
          Stake CVT tokens to unlock these exclusive benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Guardian Tier */}
          <div className="rounded-lg border border-green-200 dark:border-green-800/40 overflow-hidden">
            <div className="bg-green-100 dark:bg-green-900/30 p-4 border-b border-green-200 dark:border-green-800/40">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-green-800 dark:text-green-300">Guardian Tier</h3>
                <div className="text-xs font-medium text-green-700 dark:text-green-400 bg-white/50 dark:bg-black/30 rounded-full px-2 py-1">
                  {stakingRequirements[StakingTier.GUARDIAN].amount} CVT
                </div>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">Basic security tier</p>
            </div>
            <div className="p-4 bg-white dark:bg-black/20">
              <ul className="space-y-2">
                {stakingRequirements[StakingTier.GUARDIAN].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Architect Tier */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-800/40 overflow-hidden">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 border-b border-blue-200 dark:border-blue-800/40">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-blue-800 dark:text-blue-300">Architect Tier</h3>
                <div className="text-xs font-medium text-blue-700 dark:text-blue-400 bg-white/50 dark:bg-black/30 rounded-full px-2 py-1">
                  {stakingRequirements[StakingTier.ARCHITECT].amount} CVT
                </div>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">Advanced features access</p>
            </div>
            <div className="p-4 bg-white dark:bg-black/20">
              <ul className="space-y-2">
                {stakingRequirements[StakingTier.ARCHITECT].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Sovereign Tier */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-800/40 overflow-hidden">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 border-b border-purple-200 dark:border-purple-800/40">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-purple-800 dark:text-purple-300">Sovereign Tier</h3>
                <div className="text-xs font-medium text-purple-700 dark:text-purple-400 bg-white/50 dark:bg-black/30 rounded-full px-2 py-1">
                  {stakingRequirements[StakingTier.SOVEREIGN].amount} CVT
                </div>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400">Premium privileges</p>
            </div>
            <div className="p-4 bg-white dark:bg-black/20">
              <ul className="space-y-2">
                {stakingRequirements[StakingTier.SOVEREIGN].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TokenInfoCard: React.FC = () => {
  return (
    <Card className="border border-[#6B00D7]/20 dark:border-[#6B00D7]/30">
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-[#6B00D7]" />
          <CardTitle className="text-lg">About CVT Token</CardTitle>
        </div>
        <CardDescription>
          ChronosVault Token is the utility token powering the entire ecosystem
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 bg-[#6B00D7]/10 dark:bg-[#FF5AF7]/10 p-2 rounded-full">
              <Coins className="h-5 w-5 text-[#6B00D7] dark:text-[#FF5AF7]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fixed Supply</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total of 21,000,000 CVT tokens, never to be increased.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 bg-[#6B00D7]/10 dark:bg-[#FF5AF7]/10 p-2 rounded-full">
              <Lock className="h-5 w-5 text-[#6B00D7] dark:text-[#FF5AF7]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Staking Rewards</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earn rewards by locking your CVT tokens with time-based multipliers.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1 bg-[#6B00D7]/10 dark:bg-[#FF5AF7]/10 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-[#6B00D7] dark:text-[#FF5AF7]" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Deflationary Model</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Regular buyback and burn mechanism to reduce circulating supply.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
          <h3 className="font-semibold mb-3">Platform Utility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7] mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Pay transaction fees with lower rates</p>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7] mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Access premium vault features</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7] mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Vote on platform governance decisions</p>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-[#6B00D7] dark:text-[#FF5AF7] mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Unlock higher security authorization levels</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CVTTokenPage: React.FC = () => {
  const { isAuthenticated, login, loading } = useAuthContext();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Function to handle wallet connect
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      const success = await login({ wallet: 'auto' });
      if (success) {
        toast({
          title: "Connected successfully",
          description: "Your wallet is now connected to Chronos Vault",
        });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Make sure you have a compatible wallet installed (MetaMask, TON Wallet, etc.)",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>CVT Token | ChronosVault</title>
        <meta 
          name="description" 
          content="Manage your CVT tokens, stake for rewards, and access tier benefits in the ChronosVault platform." 
        />
      </Helmet>
      
      <Container className="py-12 md:py-16">
        <PageHeader 
          heading="ChronosVault Token (CVT)" 
          description="Manage your tokens, stake for rewards, and access tier benefits" 
          separator
        />
        
        {!isAuthenticated ? (
          <div className="mt-10">
            <Card className="max-w-xl mx-auto bg-gradient-to-br from-[#6B00D7]/5 to-[#FF5AF7]/5 border-[#6B00D7]/20 dark:border-[#6B00D7]/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 flex items-center justify-center">
                    <Coins className="h-8 w-8 text-[#6B00D7] dark:text-[#FF5AF7]" />
                  </div>
                </div>
                <CardTitle className="text-center">
                  Connect Wallet to Access CVT
                </CardTitle>
                <CardDescription className="text-center">
                  Please connect your wallet to view your CVT token balance and manage your tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  To manage your ChronosVault Tokens, stake for rewards, and access tier benefits, you need to connect your wallet first. 
                  This allows us to securely access your token balance.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5900B3] hover:to-[#FF46E8] text-white px-6"
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Note: To test without a wallet extension, you can visit the <a href="/ton-integration" className="text-[#6B00D7] underline">TON Integration</a> page which has a testing mode.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-10 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <CVTTokenCard />
              </div>
              <div className="lg:col-span-2">
                <CVTStakingForm />
              </div>
            </div>
            
            <CVTDistributionChart />
            
            <TierBenefitsCard />
            
            <TokenInfoCard />
          </div>
        )}
      </Container>
    </>
  );
};

export default function CVTTokenPageWithProvider() {
  return (
    <CVTTokenProvider>
      <CVTTokenPage />
    </CVTTokenProvider>
  );
}