import { useState } from 'react';
import { Check, Zap, Shield, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type SupportedChain = 'ethereum' | 'solana' | 'ton';

interface ChainOption {
  id: SupportedChain;
  name: string;
  icon: string;
  fee: string;
  feeUSD: string;
  speed: string;
  benefits: string[];
  color: string;
  recommended?: boolean;
}

const CHAIN_OPTIONS: ChainOption[] = [
  {
    id: 'solana',
    name: 'Solana',
    icon: '◎',
    fee: '~$0.0003',
    feeUSD: '$0.0003',
    speed: 'Ultra-fast (400ms)',
    benefits: [
      'Lowest fees in crypto',
      'Lightning-fast transactions',
      'Perfect for frequent operations',
      'High-speed Trinity monitoring'
    ],
    color: 'from-purple-500 to-pink-500',
    recommended: true
  },
  {
    id: 'ton',
    name: 'TON',
    icon: '💎',
    fee: '~$0.01',
    feeUSD: '$0.01',
    speed: 'Fast (5 seconds)',
    benefits: [
      'Quantum-resistant security',
      'Low fees',
      'Telegram integration',
      'Future-proof technology'
    ],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: 'Ξ',
    fee: '~$5-50',
    feeUSD: '$5-50',
    speed: 'Standard (15 seconds)',
    benefits: [
      'Maximum security',
      'Largest ecosystem',
      'Most battle-tested',
      'Industry standard'
    ],
    color: 'from-indigo-500 to-purple-500'
  }
];

interface ChainSelectorProps {
  selectedChain: SupportedChain;
  onSelect: (chain: SupportedChain) => void;
}

export function ChainSelector({ selectedChain, onSelect }: ChainSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Choose Your Primary Blockchain
        </h3>
        <p className="text-sm text-muted-foreground">
          Select which blockchain will power your vault. All three chains work together for Trinity Protocol security!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CHAIN_OPTIONS.map((chain) => (
          <Card
            key={chain.id}
            data-testid={`chain-option-${chain.id}`}
            className={`relative cursor-pointer transition-all hover:shadow-lg border-2 ${
              selectedChain === chain.id
                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelect(chain.id)}
          >
            {chain.recommended && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Recommended
              </Badge>
            )}

            <div className="p-6 space-y-4">
              {/* Chain Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center text-white text-2xl font-bold`}>
                    {chain.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{chain.name}</h4>
                    <p className="text-xs text-muted-foreground">{chain.speed}</p>
                  </div>
                </div>
                {selectedChain === chain.id && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Fee Display */}
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Transaction Fee</div>
                <div className="text-2xl font-bold">{chain.fee}</div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                {chain.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Trinity Protocol Explanation */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <h4 className="font-semibold">Trinity Protocol Security</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Your chosen chain becomes PRIMARY for transactions. The other two chains serve as MONITOR and BACKUP, 
            creating a 2-of-3 mathematical consensus for emergency recovery. If one chain fails, your funds are still protected!
          </p>
        </div>
      </Card>

      {/* Fee Savings Example */}
      {selectedChain === 'solana' && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-green-700 dark:text-green-400">💰 You're Saving Money!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              vs Ethereum: Save ~99.99% on fees! Create 10,000+ vaults for the cost of 1 Ethereum vault.
            </p>
          </div>
        </Card>
      )}

      {selectedChain === 'ton' && (
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-blue-700 dark:text-blue-400">🛡️ Quantum-Resistant!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Your vault is protected against future quantum computers. Plus, you save ~99.8% on fees vs Ethereum!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
