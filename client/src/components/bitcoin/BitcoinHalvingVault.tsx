import React, { useState } from 'react';
import { Link } from 'wouter';
import { Bitcoin, LockIcon, Calendar, ArrowRight, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { calculateTimeRemaining, formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Simulating the next Bitcoin halving date
const nextHalvingDate = new Date('2024-04-08');
// Calculating days until next halving
const daysUntilHalving = Math.max(0, Math.floor((nextHalvingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

export const BitcoinHalvingVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate the timeRemaining for the countdown
  const timeRemaining = calculateTimeRemaining(nextHalvingDate);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="relative h-[250px] rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-700 opacity-90"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 text-center">
            <Bitcoin className="h-16 w-16 mb-4 animate-pulse text-yellow-300" />
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Bitcoin Halving Vault</h1>
            <p className="max-w-2xl text-lg text-white/90">
              Secure your Bitcoin through market cycles with time-locked halvening-synchronized vaults
            </p>
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800/70 shadow-lg overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-300">
              <Calendar className="h-5 w-5 text-orange-600" />
              Next Bitcoin Halving Countdown
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-400">
              Lock until the next halving to maximize your HODL strength
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3 text-center my-4">
              <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3 shadow-inner">
                <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">{timeRemaining.days}</div>
                <div className="text-xs text-orange-600 dark:text-orange-500">Days</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3 shadow-inner">
                <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">{timeRemaining.hours}</div>
                <div className="text-xs text-orange-600 dark:text-orange-500">Hours</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3 shadow-inner">
                <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">{timeRemaining.minutes}</div>
                <div className="text-xs text-orange-600 dark:text-orange-500">Minutes</div>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/40 rounded-lg p-3 shadow-inner">
                <div className="text-3xl font-bold text-orange-800 dark:text-orange-300">{timeRemaining.seconds}</div>
                <div className="text-xs text-orange-600 dark:text-orange-500">Seconds</div>
              </div>
            </div>
            
            <div className="my-5">
              <div className="flex justify-between text-sm text-orange-700 dark:text-orange-400 mb-2">
                <span>Current Date</span>
                <span>Next Halving: {formatDate(nextHalvingDate)}</span>
              </div>
              <Progress 
                value={100 - (daysUntilHalving / 365 * 100)} 
                className="h-2 bg-orange-100 dark:bg-orange-900/30"
              />
              <div className="text-xs text-orange-600 dark:text-orange-500 mt-2 text-center">
                Only {daysUntilHalving} days left until the Bitcoin block reward halves!
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-orange-200 dark:border-orange-800/50 pt-4 pb-4">
            <div className="w-full grid grid-cols-2 gap-4">
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white"
              >
                <LockIcon className="h-4 w-4 mr-2" />
                Create Halving Vault
              </Button>
              <Button variant="outline" className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20">
                Learn More
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-8"
      >
        <TabsList className="grid grid-cols-3 bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 p-1">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black/70 data-[state=active]:text-orange-900 dark:data-[state=active]:text-orange-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="benefits" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black/70 data-[state=active]:text-orange-900 dark:data-[state=active]:text-orange-300"
          >
            Benefits
          </TabsTrigger>
          <TabsTrigger 
            value="strategy" 
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-black/70 data-[state=active]:text-orange-900 dark:data-[state=active]:text-orange-300"
          >
            Halving Strategy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-4">What is a Bitcoin Halving?</h3>
              <p className="text-orange-700 dark:text-orange-400 mb-4">
                Bitcoin halving is a pre-programmed event where the reward for mining Bitcoin transactions is cut in half, 
                effectively reducing the rate at which new bitcoins are created. This occurs approximately every four years.
              </p>
              <p className="text-orange-700 dark:text-orange-400">
                Historically, halving events have been followed by significant bull runs in the Bitcoin market as the 
                reduced supply meets increasing demand.
              </p>
            </div>
            
            <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
              <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-4">Why Create a Halving Vault?</h3>
              <p className="text-orange-700 dark:text-orange-400 mb-4">
                Our specialized Bitcoin Halving Vaults help you commit to your HODL strategy by time-locking your Bitcoin 
                until after the next halving, potentially maximizing your returns.
              </p>
              <p className="text-orange-700 dark:text-orange-400">
                This removes the temptation to sell during market volatility and allows you to take advantage of the 
                potential price appreciation that often follows halvings.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="benefits" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 mb-4">
                <LockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">Forced HODL</h3>
              <p className="text-orange-700 dark:text-orange-400">
                Remove the temptation to sell during market dips by locking your Bitcoin until after the halving event.
              </p>
            </div>
            
            <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">Potential Gains</h3>
              <p className="text-orange-700 dark:text-orange-400">
                Historically, Bitcoin has seen significant price appreciation in the months following halving events.
              </p>
            </div>
            
            <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 mb-4">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">Enhanced Security</h3>
              <p className="text-orange-700 dark:text-orange-400">
                Our vaults provide multi-signature security and optional inheritance planning for your Bitcoin assets.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="strategy" className="mt-6">
          <div className="bg-white dark:bg-black/20 rounded-xl border border-orange-200 dark:border-orange-800/50 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300 mb-4">Bitcoin Halving Investment Strategy</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 mt-1 flex-shrink-0">
                  <span className="font-bold text-orange-600 dark:text-orange-400">1</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-1">Create a Halving-Synchronized Vault</h4>
                  <p className="text-orange-700 dark:text-orange-400">
                    Set up a time-locked vault that automatically unlocks a predefined period after the next Bitcoin halving.
                    This helps you maintain your investment discipline during market volatility.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 mt-1 flex-shrink-0">
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-1">Choose Your Lock-up Period</h4>
                  <p className="text-orange-700 dark:text-orange-400">
                    Select from predetermined periods: Halving + 6 months, Halving + 12 months, or Halving + 18 months.
                    Longer lock-up periods earn additional CVT token rewards.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/50 mt-1 flex-shrink-0">
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-1">Receive a Bitcoin Halving NFT</h4>
                  <p className="text-orange-700 dark:text-orange-400">
                    Each vault comes with a unique Bitcoin Halving NFT that tracks your commitment and provides special
                    benefits within the ChronosVault ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Link href="/bitcoin-halving-vault">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
          >
            Create Your Bitcoin Halving Vault
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};