import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { EnhancedVaultSystem } from '@/components/vault/enhanced-vault-system';
import { PageHeader } from '@/components/ui/page-header';
import { useToast } from '@/hooks/use-toast';

const CreateVault = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  // Temporary user ID for demonstration purposes - this would normally come from auth context
  const [userId] = useState(1);
  
  // Handle successful vault creation
  const handleVaultCreated = (vault: any) => {
    toast({
      title: "Vault Created Successfully",
      description: `Your vault has been created and is now active.`,
    });
    
    // Navigate to the vault details page after creation
    setTimeout(() => {
      navigate(`/vault-details`);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Create New Vault"
        description="Choose from our comprehensive selection of specialized vault types"
        className="mb-8"
      />
      
      {/* Use the enhanced vault system with all 16 vault types */}
      <EnhancedVaultSystem 
        userId={userId}
        onVaultCreated={handleVaultCreated}
      />
    </div>
  );
};

export default CreateVault;