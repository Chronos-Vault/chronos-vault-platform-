import React from 'react';
import { Shield, Fingerprint, Layers, Network, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const TripleChainSecurityRoadmap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200 dark:border-purple-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300">Triple-Chain Security Protocol</h3>
          </div>
          <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/50">
            Q1 2025
          </Badge>
        </div>
        
        <p className="text-purple-700 dark:text-purple-400">
          Revolutionary security architecture that distributes vault security across Ethereum, Solana, and TON blockchains
          to create unprecedented protection against chain-specific vulnerabilities.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Distributed Security</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Security spread across multiple chains</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Network className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Cross-Chain Consensus</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Multi-chain validation for critical operations</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Fingerprint className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">Zero-Knowledge Privacy Layer</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Maintain privacy with ZK-proofs</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <BrainCircuit className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">AI Security Monitoring</h4>
              <p className="text-xs text-purple-700 dark:text-purple-400">Smart anomaly detection system</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800/30">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-300">
              Security Certification Initiative
            </h4>
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 mb-3">
            The protocol will undergo rigorous third-party security audits and formal verification to become the gold standard
            in blockchain security architecture.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-purple-200 dark:border-purple-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Audit</span>
              <p className="text-[10px] text-purple-700 dark:text-purple-400">Q1 2025</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-purple-200 dark:border-purple-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Certification</span>
              <p className="text-[10px] text-purple-700 dark:text-purple-400">Q2 2025</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-purple-200 dark:border-purple-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-purple-900 dark:text-purple-300">Full Launch</span>
              <p className="text-[10px] text-purple-700 dark:text-purple-400">Q3 2025</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 w-full">
            Join security beta program
          </Button>
          <Button variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 w-full">
            Learn more about Triple-Chain Security
          </Button>
        </div>
      </div>
    </div>
  );
};