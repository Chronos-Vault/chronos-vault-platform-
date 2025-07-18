import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Sparkles, Shield, ArrowLeft } from 'lucide-react';
import { EnhancedVaultSystem } from '@/components/vault/enhanced-vault-system';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/hooks/use-toast';

/**
 * Advanced Vault Creation Page integrating all vault features including gift functionality
 */
const AdvancedVaultCreationPage: React.FC = () => {
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
  const recipientAddress = params.get('recipient') || '';
  
  return (
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="gap-2"
            onClick={() => window.location.reload()}
          >
            Reset Form
          </Button>
        </div>
      </div>
      
      <PageHeader
        heading="Ultimate Vault Creator"
        description="Create advanced vaults with custom features, security, and timelock options"
        separator={true}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8"
      >
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#6B00D7]/10 rounded-lg p-6 mb-8 border border-[#6B00D7]/20">
          <div className="flex gap-4 items-start">
            <div className="h-12 w-12 shrink-0 rounded-lg bg-[#6B00D7]/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-[#6B00D7]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Revolutionary Multi-Chain Vault System
                <span className="inline-flex items-center rounded-md bg-[#FF5AF7]/20 px-2 py-1 text-xs font-medium text-[#FF5AF7]">
                  <Sparkles className="h-3 w-3 mr-1" /> Premium Feature
                </span>
              </h2>
              <p className="text-gray-400">
                Our ultimate vault creator gives you unparalleled control over your digital assets. 
                Create vaults across multiple blockchains with advanced security features, custom time-locking, 
                and flexible unlock conditions. Whether you're securing assets for the future, sending gifts, 
                or creating an inheritance plan, our comprehensive vault system has you covered.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Multi-Chain Support
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Enhanced Security
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Gift Features
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Time-Locking
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  Inheritance Planning
                </span>
                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                  File Attachments
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <EnhancedVaultSystem
          userId={userId}
          onVaultCreated={handleVaultCreated}
          defaultVaultType={defaultVaultType as string}
          initialGiftRecipient={recipientAddress}
        />
      </motion.div>
    </div>
  );
};

export default AdvancedVaultCreationPage;