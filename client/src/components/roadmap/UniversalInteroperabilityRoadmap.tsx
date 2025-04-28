import React from 'react';
import { LinkIcon, Webhook, GitMerge, PlugZap, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const UniversalInteroperabilityRoadmap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 rounded-xl border border-amber-200 dark:border-amber-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <LinkIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">Universal Chain Interoperability</h3>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
            Q2-Q4 2025
          </Badge>
        </div>
        
        <p className="text-amber-700 dark:text-amber-400">
          Pioneering protocol that enables Chronos Vault to seamlessly integrate with any major blockchain,
          becoming the universal standard for cross-chain vault operations and asset management.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <GitMerge className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Modular Adapter System</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">Plug-in architecture for new chains</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Webhook className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Cross-Chain Messaging</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">Standardized messaging protocol</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <PlugZap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Auto-Bridge Mechanism</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">Seamless asset transfers</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Globe className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">Open SDK</h4>
              <p className="text-xs text-amber-700 dark:text-amber-400">Developer tools for integration</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-100 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-center gap-2 mb-2">
            <LinkIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Expansion Roadmap
            </h4>
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mb-3">
            Phased integration of additional blockchains beyond our current supported networks.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-amber-200 dark:border-amber-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">Phase 1</span>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">Bitcoin, Avalanche</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-amber-200 dark:border-amber-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">Phase 2</span>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">Cosmos, Polkadot</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-amber-200 dark:border-amber-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-300">Phase 3</span>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">All major chains</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 w-full">
            Join interoperability beta program
          </Button>
          <Button variant="outline" className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20 w-full">
            Learn more about Universal Chain protocol
          </Button>
        </div>
      </div>
    </div>
  );
};