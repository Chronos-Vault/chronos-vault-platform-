import React from 'react';
import { PageHeader } from '@/components/page-header';
import { UnifiedWalletConnector } from '@/components/cross-chain/UnifiedWalletConnector';
import { VaultManagement } from '@/components/cross-chain/VaultManagement';
import { CrossChainDashboard } from '@/components/cross-chain/CrossChainDashboard';

export default function CrossChainVaultPage() {
  return (
    <div className="container max-w-screen-xl mx-auto py-6 space-y-8">
      <PageHeader
        heading="Cross-Chain Vault Management"
        description="Manage your time-locked vaults across multiple blockchains in one unified interface"
      />
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <UnifiedWalletConnector />
        </div>
        <div className="lg:col-span-2">
          <CrossChainDashboard />
        </div>
      </div>
      
      <VaultManagement />
    </div>
  );
}