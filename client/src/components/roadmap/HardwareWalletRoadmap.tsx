import React from 'react';
import { HardDrive, Key, Smartphone, Fingerprint, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const HardwareWalletRoadmap: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl border border-blue-200 dark:border-blue-800/50 overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <HardDrive className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">ChronosKey Hardware Wallet</h3>
          </div>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/50">
            Q2 2025
          </Badge>
        </div>
        
        <p className="text-blue-700 dark:text-blue-400">
          The ultimate physical security solution for your digital vaults. A specialized hardware wallet designed exclusively
          for Chronos Vault users with enhanced features for vault management and inheritance security.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Key className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Secure Enclave</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Military-grade hardware security module</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Mobile Integration</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Bluetooth LE and NFC compatibility</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Fingerprint className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Biometric Authentication</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Fingerprint and facial recognition options</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Inheritance Key Backup</h4>
              <p className="text-xs text-blue-700 dark:text-blue-400">Specialized backup system for beneficiaries</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
              ChronosKey Models
            </h4>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
            The hardware wallet will be available in different models to suit various security needs and budgets.
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-white dark:bg-black/40 rounded border border-blue-200 dark:border-blue-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Standard</span>
              <p className="text-[10px] text-blue-700 dark:text-blue-400">Basic security</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-blue-200 dark:border-blue-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Pro</span>
              <p className="text-[10px] text-blue-700 dark:text-blue-400">Advanced features</p>
            </div>
            <div className="bg-white dark:bg-black/40 rounded border border-blue-200 dark:border-blue-800/30 p-2 text-center">
              <span className="text-xs font-semibold text-blue-900 dark:text-blue-300">Enterprise</span>
              <p className="text-[10px] text-blue-700 dark:text-blue-400">Multi-user solution</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button 
            variant="outline" 
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 w-full"
            onClick={() => window.location.href = "/create-vault"}
          >
            Join hardware wallet waitlist
          </Button>
          <Button 
            variant="outline" 
            className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 w-full"
            onClick={() => window.location.href = "/advanced-vault-creation"}
          >
            Learn more about ChronosKey
          </Button>
        </div>
      </div>
    </div>
  );
};