import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { CreateVaultFormEnhanced } from '@/components/vault/create-vault-form-enhanced';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout';

const CreateVaultEnhancedPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [userId] = useState(1); // Default user ID (in a real app, this would come from auth context)
  
  // Handle successful vault creation
  const handleVaultCreated = (vault: any) => {
    toast({
      title: "Vault Created Successfully",
      description: `Your ${vault.vaultType} vault has been created and is now active.`,
    });
    
    // After a short delay, navigate to the vault details page
    setTimeout(() => {
      setLocation(`/vault/${vault.id}`);
    }, 1500);
  };
  
  // Parse URL params to get default settings (for example, if coming from gift flow)
  const params = new URLSearchParams(window.location.search);
  const defaultVaultType = params.get('type') || 'standard';
  
  return (
    <Layout>
      <div className="container max-w-7xl py-10">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            className="gap-2" 
            onClick={() => setLocation('/my-vaults')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Vaults
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Create New Vault</h1>
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#6B00D7]/10 rounded-lg p-6 border border-[#6B00D7]/20">
              <div className="flex gap-4 items-start">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-[#6B00D7]/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    Enhanced Vault Creation
                    <span className="inline-flex items-center rounded-md bg-[#FF5AF7]/20 px-2 py-1 text-xs font-medium text-[#FF5AF7]">
                      <Sparkles className="h-3 w-3 mr-1" /> Premium Features
                    </span>
                  </h2>
                  <p className="text-gray-400">
                    Create vaults with advanced security features including multi-signature control, geolocation-based unlocking,
                    and enhanced protection through CVT token staking.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                      Multi-Signature
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                      Geolocation
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                      Triple-Chain Security
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                      CVT Staking
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <CreateVaultFormEnhanced 
          userId={userId}
          onVaultCreated={handleVaultCreated}
          defaultVaultType={defaultVaultType as any}
        />
      </div>
    </Layout>
  );
};

export default CreateVaultEnhancedPage;
