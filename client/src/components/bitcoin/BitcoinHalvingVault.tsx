import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Lock, ArrowRight, Wallet, Bitcoin, Clock, Coins, Link, Info, ExternalLink } from 'lucide-react';
import { useBlockchain } from '@/contexts/BlockchainContext';

interface BitcoinData {
  currentBlockHeight: number;
  currentPrice: number;
  subsidy?: {
    current: number;
    next: number;
  };
  nextHalving?: {
    blockHeight: number;
    blocksRemaining: number;
    estimatedTimeRemaining: {
      days: number;
      hours: number;
    };
    percentage: number;
  };
  totalBitcoin?: {
    mined: number;
    remaining: number;
    total: number;
  };
}

const BitcoinHalvingVault: React.FC = () => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const { connect, isConnected, walletAddress } = useBlockchain();
  
  // Fetch Bitcoin halving data
  const { data, isLoading, error } = useQuery<BitcoinData>({
    queryKey: ['/api/bitcoin/data'],
  });
  
  const handleConnectWallet = async () => {
    await connect('BTC');
  };
  
  const handleCreateVault = () => {
    // In a real implementation, this would open a modal for vault creation
    console.log('Creating Bitcoin Halving Vault...');
  };
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            <div className="flex items-center justify-center">
              <Coins className="mr-2 h-6 w-6 text-orange-500" />
              Bitcoin Halving Vault
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            Loading Bitcoin data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-red-500">Error Loading Bitcoin Data</CardTitle>
          <CardDescription className="text-center">
            Unable to load the latest Bitcoin information. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate progress for halving if available
  const halvingProgress = data.nextHalving ? data.nextHalving.percentage : 0;
  
  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-orange-500/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-500/10 to-purple-500/10">
        <CardTitle className="flex items-center justify-center text-2xl md:text-3xl">
          <Coins className="mr-2 h-7 w-7 text-orange-500" />
          Bitcoin Halving Vault
        </CardTitle>
        <CardDescription className="text-center text-base">
          Lock your Bitcoin until the next halving event for maximum value appreciation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <Bitcoin className="mr-2 h-5 w-5 text-orange-500" />
                Current Bitcoin Status
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-semibold">${data.currentPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Block Height</span>
                  <span className="font-semibold">{data.currentBlockHeight.toLocaleString()}</span>
                </div>
                {data.subsidy && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Block Reward</span>
                    <span className="font-semibold">{data.subsidy.current} BTC</span>
                  </div>
                )}
              </div>
            </div>
            
            {data.nextHalving && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-orange-500" />
                  Next Halving Event
                </h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Target Block</span>
                    <span className="font-semibold">{data.nextHalving.blockHeight.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Blocks Remaining</span>
                    <span className="font-semibold">{data.nextHalving.blocksRemaining.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Time</span>
                    <span className="font-semibold">
                      {data.nextHalving.estimatedTimeRemaining.days} days, {data.nextHalving.estimatedTimeRemaining.hours} hours
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress to Next Halving</span>
                      <span>{halvingProgress.toFixed(2)}%</span>
                    </div>
                    <Progress value={halvingProgress} className="h-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-5">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Info className="mr-2 h-5 w-5 text-orange-500" />
                Why Lock Until Halving?
              </h3>
              <p className="text-muted-foreground">
                Historically, Bitcoin price has increased significantly following halving events as new supply is reduced. 
                By locking your Bitcoin until the next halving, you:
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Prevent yourself from selling during price volatility</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Position for the historical post-halving bull market</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Eliminate emotional trading decisions</span>
                </li>
              </ul>
              
              <button 
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="text-primary mt-3 text-sm flex items-center hover:underline"
              >
                {showMoreInfo ? 'Show less' : 'Learn more'} 
                <ExternalLink className="ml-1 h-3 w-3" />
              </button>
              
              {showMoreInfo && (
                <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                  <p>
                    Bitcoin halvings occur approximately every 4 years (210,000 blocks) when the new 
                    Bitcoin supply is cut in half. After the next halving, the reward will decrease 
                    from {data.subsidy?.current || 3.125} BTC to {data.subsidy?.next || 1.5625} BTC per block.
                  </p>
                  <p className="mt-2">
                    Previous halving dates: May 2020, July 2016, November 2012. Each was followed by 
                    significant bull markets.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Vault Benefits</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Military-grade security with quantum-resistant encryption</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Multi-signature protection with biometric verification</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Emergency override options for critical situations</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 text-orange-500 mr-2 mt-1 shrink-0" />
                  <span>Smart contract enforced time lock until halving block height</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="p-6 flex flex-col sm:flex-row gap-4">
        {!isConnected ? (
          <Button 
            onClick={handleConnectWallet} 
            className="w-full sm:w-auto flex gap-2 items-center bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Wallet className="h-4 w-4" />
            Connect Bitcoin Wallet
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleCreateVault} 
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white flex gap-2 items-center"
            >
              <Lock className="h-4 w-4" />
              Create Halving Vault
            </Button>
            <div className="flex items-center text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 mr-2" />
              Connected: {walletAddress?.slice(0, 8)}...
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default BitcoinHalvingVault;