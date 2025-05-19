/**
 * Bitcoin Halving Page
 * 
 * This page provides information about Bitcoin halving events,
 * their impact on the market, and how the Chronos Vault platform
 * offers specialized vaults for halving strategies.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Clock, TrendingUp, CreditCard, 
  ArrowRight, Calendar, BarChart, Lock,
  Shield, TimerReset, Rocket, Bitcoin
} from 'lucide-react';

const BitcoinHalvingPage = () => {
  const [_, navigate] = useLocation();
  
  // Calculate days until next halving (mock data)
  const [daysUntilHalving, setDaysUntilHalving] = useState(675);
  const [progress, setProgress] = useState(54); // percentage to next halving
  
  // Halving history data
  const halvingHistory = [
    {
      date: "November 28, 2012",
      blockHeight: 210000,
      rewardBefore: 50,
      rewardAfter: 25,
      priceImpact: "+10,317% (over the following 12 months)",
      hashrate: "27 TH/s",
    },
    {
      date: "July 9, 2016",
      blockHeight: 420000,
      rewardBefore: 25,
      rewardAfter: 12.5,
      priceImpact: "+2,920% (over the following 18 months)",
      hashrate: "1.56 EH/s",
    },
    {
      date: "May 11, 2020",
      blockHeight: 630000,
      rewardBefore: 12.5,
      rewardAfter: 6.25,
      priceImpact: "+559% (over the following 12 months)",
      hashrate: "121 EH/s",
    },
    {
      date: "April 20, 2024",
      blockHeight: 840000,
      rewardBefore: 6.25,
      rewardAfter: 3.125,
      priceImpact: "To be determined",
      hashrate: "~542 EH/s",
    }
  ];
  
  // Next halving data (projection)
  const nextHalving = {
    estimatedDate: "Late March, 2028",
    estimatedBlockHeight: 1050000,
    rewardBefore: 3.125,
    rewardAfter: 1.5625,
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-[#6B00D7]/10"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
          <Bitcoin className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Bitcoin Halving
        </h1>
      </div>
      
      <p className="text-gray-400 max-w-3xl mb-8">
        The Bitcoin halving is a pre-programmed event that occurs approximately every four years (210,000 blocks), 
        reducing the block reward for miners by 50%. This mechanism ensures Bitcoin's scarcity and has historically
        preceded significant price movements.
      </p>
      
      {/* Countdown Card */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Next Halving Countdown</CardTitle>
          <CardDescription className="text-gray-400">
            Track the time until the next Bitcoin halving event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#242424] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white mb-2">{daysUntilHalving}</div>
                <div className="text-sm text-gray-400">Days Remaining</div>
              </div>
              
              <div className="bg-[#242424] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white mb-2">{nextHalving.estimatedBlockHeight.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Target Block Height</div>
              </div>
              
              <div className="bg-[#242424] rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white mb-2">{nextHalving.estimatedDate}</div>
                <div className="text-sm text-gray-400">Estimated Date</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">Last Halving</div>
                <div className="text-sm text-gray-400">Next Halving</div>
              </div>
              <Progress value={progress} className="h-3 bg-[#333]" indicatorClassName="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" />
              <div className="flex justify-between items-center">
                <div className="text-sm text-white">Reward: {halvingHistory[3].rewardAfter} BTC</div>
                <div className="text-sm text-white">Future Reward: {nextHalving.rewardAfter} BTC</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
            onClick={() => navigate('/bitcoin-halving-vault')}
          >
            <Lock className="mr-2 h-4 w-4" />
            Create Halving Strategy Vault
          </Button>
        </CardFooter>
      </Card>
      
      {/* Halving Explained */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Understanding Bitcoin Halving</CardTitle>
          <CardDescription className="text-gray-400">
            How halving impacts Bitcoin's economics and market
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <TimerReset className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">What Is Halving?</h3>
                  <p className="text-gray-400">
                    Bitcoin halving is a process encoded in Bitcoin's protocol that reduces
                    the reward for mining new blocks by 50% approximately every four years.
                    This mechanism is designed to control inflation and maintain Bitcoin's
                    scarcity over time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <TrendingUp className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Market Impact</h3>
                  <p className="text-gray-400">
                    Historically, Bitcoin halving events have preceded significant bull markets.
                    The reduced supply of new bitcoins entering circulation creates a supply shock,
                    which, combined with increasing demand, has contributed to price appreciation
                    following each halving.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <CreditCard className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Mining Economics</h3>
                  <p className="text-gray-400">
                    For miners, the halving means a 50% reduction in block rewards. This
                    forces inefficient miners out of the network and encourages mining
                    operations to become more efficient or rely more on transaction fees
                    for revenue.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <Clock className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Halving Schedule</h3>
                  <p className="text-gray-400">
                    Bitcoin halvings occur every 210,000 blocks, which takes approximately
                    four years to mine. The first halving happened in 2012, followed by 
                    halvings in 2016, 2020, and 2024. The next is projected for 2028.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <BarChart className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Post-Halving Analysis</h3>
                  <p className="text-gray-400">
                    While past performance doesn't guarantee future results, Bitcoin has
                    shown significant price increases following each halving event. These
                    cycles typically play out over 12-18 months following the halving.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                  <Shield className="h-5 w-5 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Long-Term Implications</h3>
                  <p className="text-gray-400">
                    With a fixed supply cap of 21 million bitcoins, halvings ensure this
                    limit isn't reached until approximately the year 2140. Each halving
                    increases Bitcoin's stock-to-flow ratio, potentially enhancing its
                    store of value properties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Halving History */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Bitcoin Halving History</CardTitle>
          <CardDescription className="text-gray-400">
            Historical data from previous halving events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left p-3 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Block Height</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Block Reward</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Price Impact</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Network Hashrate</th>
                </tr>
              </thead>
              <tbody>
                {halvingHistory.map((event, index) => (
                  <tr key={index} className="border-b border-[#333] hover:bg-[#242424]">
                    <td className="p-3 text-white">{event.date}</td>
                    <td className="p-3 text-white">{event.blockHeight.toLocaleString()}</td>
                    <td className="p-3 text-white">{event.rewardBefore} → {event.rewardAfter} BTC</td>
                    <td className="p-3 text-white">{event.priceImpact}</td>
                    <td className="p-3 text-white">{event.hashrate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Halving Strategy Vaults */}
      <Card className="bg-[#1A1A1A] border-[#333] shadow-xl mb-10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Halving Strategy Vaults</CardTitle>
          <CardDescription className="text-gray-400">
            Specialized vaults designed to capitalize on Bitcoin halving cycles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#242424] rounded-lg p-5 border border-[#333] flex flex-col h-full">
              <div className="rounded-full w-12 h-12 bg-[#6B00D7]/20 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Halving Cycle Vault</h3>
              <p className="text-gray-400 mb-4 flex-grow">
                A time-locked vault programmed to automatically distribute assets based on the
                Bitcoin halving cycle. Optimize your strategy with automated position adjustments.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-auto text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10"
                onClick={() => navigate('/bitcoin-halving-vault?type=cycle')}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Create Cycle Vault
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#242424] rounded-lg p-5 border border-[#333] flex flex-col h-full">
              <div className="rounded-full w-12 h-12 bg-[#6B00D7]/20 flex items-center justify-center mb-3">
                <BarChart className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Post-Halving Accumulation Vault</h3>
              <p className="text-gray-400 mb-4 flex-grow">
                Designed to gradually accumulate Bitcoin following halving events, taking advantage
                of dollar-cost averaging during the potential post-halving bull market.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-auto text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10"
                onClick={() => navigate('/bitcoin-halving-vault?type=accumulation')}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Create Accumulation Vault
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-[#1D1D1D] to-[#242424] rounded-lg p-5 border border-[#333] flex flex-col h-full">
              <div className="rounded-full w-12 h-12 bg-[#6B00D7]/20 flex items-center justify-center mb-3">
                <Rocket className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Rebalancing Smart Vault</h3>
              <p className="text-gray-400 mb-4 flex-grow">
                Advanced vault that automatically rebalances your Bitcoin and altcoin allocations
                based on halving cycle phases, maximizing potential returns across market cycles.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-auto text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10"
                onClick={() => navigate('/bitcoin-halving-vault?type=rebalancing')}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Create Rebalancing Vault
              </Button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-[#242424] rounded-lg border border-[#333]">
            <h3 className="text-lg font-medium text-white mb-2">Why Use a Halving Strategy Vault?</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                <span>Automate your Bitcoin strategy based on historical halving cycles</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                <span>Reduce emotional decision-making during market volatility</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                <span>Secure your assets with our triple-chain security architecture</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-4 w-4 text-[#FF5AF7] mr-2 mt-1 flex-shrink-0" />
                <span>Customize your strategy with advanced parameters and time-based triggers</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
            onClick={() => navigate('/bitcoin-halving-vault')}
          >
            <Lock className="mr-2 h-4 w-4" />
            Explore All Halving Vaults
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BitcoinHalvingPage;