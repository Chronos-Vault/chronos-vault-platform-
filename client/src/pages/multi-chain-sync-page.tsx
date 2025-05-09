import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/ui/page-header';
import { Helmet } from 'react-helmet';
import { MultiChainStateSyncPanel } from '@/components/synchronization/multi-chain-state-sync-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, RefreshCw, Cpu } from 'lucide-react';
import { useDevMode } from '@/hooks/use-dev-mode';

export default function MultiChainSyncPage() {
  const { isDevMode } = useDevMode();
  const [testVaultId] = useState(() => `test-vault-${Date.now()}`);

  return (
    <>
      <Helmet>
        <title>Multi-Chain State Synchronization | Chronos Vault</title>
      </Helmet>
      
      <Container>
        <PageHeader
          title="Multi-Chain State Synchronization"
          subtitle="Advanced cross-chain vault state verification and recovery"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                State Merkle Trees
              </CardTitle>
              <CardDescription>
                Efficiently verify vault state consistency across multiple blockchains
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Creates a Merkle tree of vault state data from all chains</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Enables efficient verification with minimal data transfer</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Guarantees cross-chain state consistency</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                Time-Weighted Validation
              </CardTitle>
              <CardDescription>
                Adaptive security based on vault value and time sensitivity
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Higher value vaults require more validation confirmations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Premium protection includes longer time windows</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Merkle proof verification for enhanced security</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                Automated Recovery Protocol
              </CardTitle>
              <CardDescription>
                Automatic failover when blockchains become compromised
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Continuous monitoring of blockchain health</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Automatic switching to alternative chains</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Self-healing recovery with zero downtime</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {isDevMode && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-md text-sm">
            <div className="flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-yellow-500" />
              <span className="font-medium">Development Mode Active</span>
            </div>
            <p className="mt-1 text-muted-foreground">
              Using simulated blockchain data. Test vault ID: {testVaultId}
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <MultiChainStateSyncPanel vaultId={testVaultId} />
        </div>
        
        <div className="mb-16 bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">How Multi-Chain State Synchronization Works</h3>
          
          <div className="space-y-2">
            <h4 className="font-medium">1. State Merkle Trees</h4>
            <p className="text-muted-foreground text-sm">
              The system creates a Merkle tree from vault state across multiple blockchains, with each chain's state forming a leaf in the tree. This allows for efficient verification of state consistency without requiring the full state data to be transferred.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Time-Weighted Validation</h4>
            <p className="text-muted-foreground text-sm">
              Security requirements scale with vault value. Higher-value vaults require more validation confirmations across multiple chains and longer time windows, while smaller vaults can operate with lighter security for better performance.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Automated Recovery Protocol</h4>
            <p className="text-muted-foreground text-sm">
              The system continuously monitors the health of all connected blockchains. If a chain becomes unresponsive or compromised, the automated recovery protocol activates, switching operations to alternative chains while maintaining security guarantees.
            </p>
          </div>
          
          <div className="space-y-2 mt-4 border-t pt-4 border-primary/10">
            <h4 className="font-medium">Triple-Chain Security Model</h4>
            <p className="text-muted-foreground text-sm">
              Every vault is secured by a minimum of three independent blockchain networks, eliminating single points of failure. Each chain plays a specific role: Ethereum for ownership records, Solana for high-frequency monitoring, and TON for recovery operations.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}