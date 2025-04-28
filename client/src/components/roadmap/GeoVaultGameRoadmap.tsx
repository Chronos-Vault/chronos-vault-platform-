import React from 'react';
import { MapPin, Gamepad2, Trophy, Compass, GiftIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const GeoVaultGameRoadmap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30">
              <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300">GeoVault™ Treasure Hunt</h3>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800/50">
            Q3 2025
          </Badge>
        </div>
        
        <p className="text-green-700 dark:text-green-400">
          An innovative geo-location based treasure hunt game where players can discover, unlock, and claim digital vaults
          hidden in real-world locations around the globe.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Location-Based Vaults</h4>
              <p className="text-xs text-green-700 dark:text-green-400">Digital treasures at physical locations</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Gamepad2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">AR Interaction</h4>
              <p className="text-xs text-green-700 dark:text-green-400">Augmented reality vault discovery</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Leaderboards</h4>
              <p className="text-xs text-green-700 dark:text-green-400">Competitive treasure hunting</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <GiftIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">Real Prizes</h4>
              <p className="text-xs text-green-700 dark:text-green-400">Cryptocurrency rewards in vaults</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-300">
              Global Treasure Hunt Events
            </h4>
          </div>
          <p className="text-xs text-green-700 dark:text-green-400 mb-3">
            Seasonal worldwide treasure hunt events with significant rewards and media coverage to drive adoption.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-green-200 dark:border-green-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-green-900 dark:text-green-300">Beta Hunt</span>
              <p className="text-[10px] text-green-700 dark:text-green-400">Q3 2025</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-green-200 dark:border-green-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-green-900 dark:text-green-300">City Hunts</span>
              <p className="text-[10px] text-green-700 dark:text-green-400">Q4 2025</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-green-200 dark:border-green-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-green-900 dark:text-green-300">Global Hunt</span>
              <p className="text-[10px] text-green-700 dark:text-green-400">Q1 2026</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 w-full">
            Join beta tester program
          </Button>
          <Button variant="outline" className="border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 w-full">
            Learn more about GeoVault
          </Button>
        </div>
      </div>
    </div>
  );
};