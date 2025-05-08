import React, { useState } from 'react';
import { useLocation } from 'wouter';
import VaultTypeSelector, { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const VaultTypesSelector = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>('standard');
  
  const handleVaultTypeSelect = (type: SpecializedVaultType) => {
    setSelectedVaultType(type);
  };
  
  const handleContinue = () => {
    // Redirect to the appropriate vault creation page based on the selected type
    if (selectedVaultType === 'standard' || 
        selectedVaultType === 'time-lock' || 
        selectedVaultType === 'multi-signature' || 
        selectedVaultType === 'biometric' || 
        selectedVaultType === 'cross-chain') {
      // Basic and Advanced Security vaults
      navigate(`/create-vault?type=${selectedVaultType}`);
    } else if (
      selectedVaultType === 'geolocation' || 
      selectedVaultType === 'smart-contract' || 
      selectedVaultType === 'dynamic' || 
      selectedVaultType === 'nft-powered' || 
      selectedVaultType === 'unique'
    ) {
      // Specialized vaults
      navigate(`/specialized-vault-creation?type=${selectedVaultType}`);
    } else {
      toast({
        title: "Select a Vault Type",
        description: "Please select a vault type to continue",
        variant: "destructive",
      });
    }
  };
  
  const handleBack = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-transparent bg-clip-text">
            Choose Your Vault Type
          </h1>
          <p className="text-gray-400 mt-1">
            Select the type of vault that best fits your security needs
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="flex items-center text-gray-400 hover:text-white mt-2 sm:mt-0"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-4 sm:p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-200 mb-4">Vault Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Specialized Vaults */}
          <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-gradient-to-b from-[#FF5AF7]/10 to-transparent">
            <h3 className="text-[#FF5AF7] font-medium text-lg mb-2">Specialized Vaults</h3>
            <p className="text-sm text-gray-400 mb-2">
              Advanced vault types with unique security features and specialized functionality
            </p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Geolocation Access Control</li>
              <li>• Smart Contract Automation</li>
              <li>• NFT-Powered Access</li>
              <li>• Dynamic Security Adaptation</li>
              <li>• Unique Customized Security</li>
            </ul>
          </div>
          
          {/* Advanced Security Vaults */}
          <div className="p-4 border border-[#6B00D7]/30 rounded-lg bg-gradient-to-b from-[#6B00D7]/10 to-transparent">
            <h3 className="text-[#6B00D7] font-medium text-lg mb-2">Advanced Security</h3>
            <p className="text-sm text-gray-400 mb-2">
              Enhanced protection with multiple verification layers and distributed security
            </p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Multi-Signature Authorization</li>
              <li>• Biometric Verification</li>
              <li>• Cross-Chain Security</li>
            </ul>
          </div>
          
          {/* Basic Time Vaults */}
          <div className="p-4 border border-[#00D7C3]/30 rounded-lg bg-gradient-to-b from-[#00D7C3]/10 to-transparent">
            <h3 className="text-[#00D7C3] font-medium text-lg mb-2">Basic Time Vaults</h3>
            <p className="text-sm text-gray-400 mb-2">
              Simple and reliable time-locked storage with essential security features
            </p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Standard Time-Lock Vault</li>
              <li>• Advanced Time Scheduling</li>
              <li>• Owner & Beneficiary Controls</li>
            </ul>
          </div>
        </div>
        
        <div className="mb-6">
          <VaultTypeSelector 
            selectedType={selectedVaultType} 
            onChange={handleVaultTypeSelect} 
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
          >
            Continue with {selectedVaultType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Vault
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function VaultTypesSelectorPage() {
  return <VaultTypesSelector />;
}