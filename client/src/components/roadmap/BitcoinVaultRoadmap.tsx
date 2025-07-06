import React from 'react';
import { Bitcoin, Lock, CalendarClock, Banknote, BarChart4, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const BitcoinVaultFeature: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl border border-orange-200 dark:border-orange-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Bitcoin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300">Diamond Hands Bitcoin Vault</h3>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800/50">
            Coming Q3 2025
          </Badge>
        </div>
        
        <p className="text-orange-700 dark:text-orange-400">
          A specialized vault designed exclusively for Bitcoin maximalists with enhanced security and
          Bitcoin-specific features to help you HODL through market volatility.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300">Multi-signature Security</h4>
              <p className="text-xs text-orange-700 dark:text-orange-400">2-of-3 keys for ultimate protection</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Banknote className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300">Lower Fees</h4>
              <p className="text-xs text-orange-700 dark:text-orange-400">0.5% vs standard 1%</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <CalendarClock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300">Halvening Date Bonuses</h4>
              <p className="text-xs text-orange-700 dark:text-orange-400">Special rewards aligned with Bitcoin halvenings</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <BarChart4 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300">Satoshi Counter</h4>
              <p className="text-xs text-orange-700 dark:text-orange-400">Track your growing sats over time</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-100 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-300">
              Diamond Hands Challenge
            </h4>
          </div>
          <p className="text-xs text-orange-700 dark:text-orange-400 mb-3">
            Lock your Bitcoin for 4 years to earn the prestigious "Diamond Hands" badge and exclusive benefits 
            in the ChronosVault ecosystem.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-orange-200 dark:border-orange-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-orange-900 dark:text-orange-300">1 Year</span>
              <p className="text-[10px] text-orange-700 dark:text-orange-400">Bronze Badge</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-orange-200 dark:border-orange-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-orange-900 dark:text-orange-300">4 Years</span>
              <p className="text-[10px] text-orange-700 dark:text-orange-400">Silver Badge</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-orange-200 dark:border-orange-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-orange-900 dark:text-orange-300">8 Years</span>
              <p className="text-[10px] text-orange-700 dark:text-orange-400">Diamond Badge</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 w-full"
            onClick={() => window.location.href = "/bitcoin-halving"}
          >
            Join waitlist for early access
          </Button>
          <Button 
            variant="outline" 
            className="border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20 w-full"
            onClick={() => window.location.href = "/bitcoin-halving-vault"}
          >
            Learn more about Bitcoin Vaults
          </Button>
        </div>
      </div>
    </div>
  );
};