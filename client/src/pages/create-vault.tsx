import React from 'react';
import { useLocation } from 'wouter';
import { EnhancedVaultSystem } from '@/components/vault/enhanced-vault-system';
import { PageHeader } from '@/components/ui/page-header';

const CreateVault = () => {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Create New Vault"
        description="Choose from our comprehensive selection of specialized vault types"
        className="mb-8"
      />
      
      {/* Use the enhanced vault system with all 16 vault types */}
      <EnhancedVaultSystem />
    </div>
  );
};

export default CreateVault;