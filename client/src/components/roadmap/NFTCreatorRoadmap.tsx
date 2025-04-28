import React from 'react';
import { Brush, ImageIcon, Palette, Stars, SquareCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const NFTCreatorRoadmap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 rounded-xl border border-pink-200 dark:border-pink-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-pink-100 dark:bg-pink-900/30">
              <Brush className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-pink-900 dark:text-pink-300">NFT Gift & Creator Platform</h3>
          </div>
          <Badge variant="outline" className="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 border-pink-200 dark:border-pink-800/50">
            Q4 2025
          </Badge>
        </div>
        
        <p className="text-pink-700 dark:text-pink-400">
          A specialized platform for creators to design, mint, and sell unique digital gift cards, collectibles,
          and timed-release NFTs that integrate seamlessly with Chronos Vault's time-lock mechanisms.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <ImageIcon className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-pink-900 dark:text-pink-300">Creator Studio</h4>
              <p className="text-xs text-pink-700 dark:text-pink-400">Design tools for digital collectibles</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <SquareCode className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-pink-900 dark:text-pink-300">Smart Contract Templates</h4>
              <p className="text-xs text-pink-700 dark:text-pink-400">No-code NFT contract creation</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Palette className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-pink-900 dark:text-pink-300">Gift Card Templates</h4>
              <p className="text-xs text-pink-700 dark:text-pink-400">Customizable crypto gift cards</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Stars className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-pink-900 dark:text-pink-300">Marketplace Integration</h4>
              <p className="text-xs text-pink-700 dark:text-pink-400">Sell on popular NFT platforms</p>
            </div>
          </div>
        </div>
        
        <div className="bg-pink-100 dark:bg-pink-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Brush className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            <h4 className="text-sm font-semibold text-pink-900 dark:text-pink-300">
              Unique NFT Applications
            </h4>
          </div>
          <p className="text-xs text-pink-700 dark:text-pink-400 mb-3">
            The platform will unlock innovative NFT use cases that leverage Chronos Vault's time-lock and security features.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-pink-200 dark:border-pink-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-pink-900 dark:text-pink-300">Time Capsules</span>
              <p className="text-[10px] text-pink-700 dark:text-pink-400">Digital memories</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-pink-200 dark:border-pink-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-pink-900 dark:text-pink-300">Gift Cards</span>
              <p className="text-[10px] text-pink-700 dark:text-pink-400">Crypto gifts</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-pink-200 dark:border-pink-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-pink-900 dark:text-pink-300">Access Keys</span>
              <p className="text-[10px] text-pink-700 dark:text-pink-400">Exclusive content</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button variant="outline" className="border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 w-full">
            Join creator waitlist
          </Button>
          <Button variant="outline" className="border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 w-full">
            Learn more about NFT platform
          </Button>
        </div>
      </div>
    </div>
  );
};