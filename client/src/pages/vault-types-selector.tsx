import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import VaultTypeSelector, { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, AlertCircle, ChevronRight, Shield, Star, LockKeyhole, Check } from 'lucide-react';
import { VaultCreationProgress, getDefaultVaultCreationSteps, Step } from '@/components/vault/create-vault-progress';

const VaultTypesSelector = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>('standard');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleVaultTypeSelect = (type: SpecializedVaultType) => {
    setSelectedVaultType(type);
    setValidationError(null);
  };
  
  const handleContinue = () => {
    // First validate that a vault type is selected
    if (!selectedVaultType) {
      setValidationError("Please select a vault type to continue");
      toast({
        title: "Selection Required",
        description: "Please select a vault type to continue",
        variant: "destructive",
      });
      return;
    }

    // Clear any validation error if we have a valid selection
    setValidationError(null);

    // Show success toast before redirecting
    toast({
      title: `${selectedVaultType === 'standard' ? 'Sovereign Fortress Vault™' : selectedVaultType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Selected`,
      description: "Continuing to vault configuration...",
      variant: "default",
    });

    // Redirect to the appropriate vault creation page based on the selected type
    if (selectedVaultType === 'multi-signature') {
      // Our new Multi-Signature Vault
      navigate('/multi-signature-vault-new');
    } else if (selectedVaultType === 'biometric') {
      // New dedicated Biometric Vault page
      navigate('/biometric-vault');
    } else if (selectedVaultType === 'cross-chain') {
      // Cross-Chain Vault - specialized URL for cross-chain vaults
      navigate(`/cross-chain-vault`);
    } else if (selectedVaultType === 'standard' || 
        selectedVaultType === 'time-lock') {
      // Basic and Advanced Security vaults
      navigate(`/specialized-vault?type=${selectedVaultType}`);
    } else if (selectedVaultType === 'ai-intent-inheritance') {
      // AI Intent Inheritance vault
      navigate('/intent-inheritance-vault');
    } else if (selectedVaultType === 'quantum-resistant') {
      // Send to the specialized vault creation page for the cryptocurrency options
      navigate(`/specialized-vault-creation?type=${selectedVaultType}`);
    } else if (selectedVaultType === 'diamond-hands') {
      // Investment Discipline Vault
      navigate('/investment-discipline-vault');
    } else if (
      selectedVaultType === 'geolocation' || 
      selectedVaultType === 'smart-contract' || 
      selectedVaultType === 'dynamic' || 
      selectedVaultType === 'nft-powered' || 
      selectedVaultType === 'unique' ||
      selectedVaultType === 'memory-vault' ||
      selectedVaultType === 'composite-vault' ||
      selectedVaultType === 'geo-temporal'
    ) {
      // Specialized vaults
      navigate(`/specialized-vault-creation?type=${selectedVaultType}`);
    }
  };
  
  const handleBack = () => {
    navigate('/my-vaults');
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
          Back to My Vaults
        </Button>
      </div>
      
      <div className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-4 sm:p-6 mb-8">
        {/* Progress Indicator */}
        <div className="mb-6">
          <VaultCreationProgress 
            steps={[
              {
                id: "select-type",
                name: "Select Vault Type",
                description: "Choose the best vault for your needs",
                status: "current",
                icon: <Shield className="h-5 w-5" />
              },
              ...getDefaultVaultCreationSteps("wallet").slice(1)
            ]} 
            currentStepId="select-type"
            variant="horizontal"
          />
        </div>
        
        {/* Validation Error Display */}
        {validationError && (
          <div className="mb-6 p-3 border border-red-500/50 bg-red-500/10 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-500 text-sm font-medium">{validationError}</p>
              <p className="text-xs text-gray-400 mt-1">Please select a vault type to continue to the next step.</p>
            </div>
          </div>
        )}
        
        {/* Triple Chain Technology Banner */}
        <div className="p-5 border-2 border-[#6B00D7]/50 rounded-lg bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-[#FF5AF7]/20 to-transparent w-40 h-40 rounded-bl-full"></div>
          
          <h2 className="text-xl font-semibold text-white mb-3">All Vaults Include Premium Features</h2>
          <p className="text-gray-300 text-sm mb-4 max-w-3xl">
            Every vault type includes our revolutionary technologies, making Chronos Vault the most secure solution in the world - accessible to everyone, with no blockchain knowledge required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-[#6B00D7]/40 p-4 rounded-lg flex items-start">
              <div className="p-2 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full mr-3 flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-base text-white">Triple-Chain Security</h3>
                <p className="text-xs text-gray-300 mt-1">Distributes security across Ethereum, Solana, and TON for unmatched protection</p>
              </div>
            </div>
            
            <div className="bg-black/40 border border-[#6B00D7]/40 p-4 rounded-lg flex items-start">
              <div className="p-2 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full mr-3 flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-base text-white">Cross-Chain Compatibility</h3>
                <p className="text-xs text-gray-300 mt-1">Store and access your assets across multiple blockchain networks</p>
              </div>
            </div>
            
            <div className="bg-black/40 border border-[#6B00D7]/40 p-4 rounded-lg flex items-start">
              <div className="p-2 bg-gradient-to-r from-[#6B00D7]/20 to-[#FF5AF7]/20 rounded-full mr-3 flex-shrink-0">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-base text-white">Flexible Payment Options</h3>
                <p className="text-xs text-gray-300 mt-1">Pay with CVT tokens, TON, ETH, SOL, or BTC with staking discounts</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-medium text-gray-200 mb-4">Vault Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Specialized Vaults */}
          <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-gradient-to-b from-[#FF5AF7]/10 to-transparent">
            <h3 className="text-[#FF5AF7] font-medium text-lg mb-2">Specialized Vaults</h3>
            <p className="text-sm text-gray-400 mb-2">
              Advanced vault types with unique security features and specialized functionality
            </p>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• AI Intent Inheritance</li>
              <li>• Geolocation Access Control</li>
              <li>• Smart Contract Automation</li>
              <li>• NFT-Powered Access</li>
              <li>• Dynamic Security Adaptation</li>
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
          
          {/* Security Features */}
          <div className="mt-6 flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
              Advanced Security Technologies
            </h3>
          </div>
          <p className="mt-2 text-sm text-gray-400 ml-10">
            Our revolutionary security features protect your assets across multiple blockchains
          </p>
          
          <div className="ml-10 mt-3 space-y-3">
            {/* Triple-Chain Security */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 bg-[#6B00D7]/20 rounded-full flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-[#6B00D7]" />
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium">Triple-Chain Security Architecture:</span>
                <span className="text-gray-400 text-sm ml-1">Distributes security across Ethereum, Solana, and TON</span>
              </div>
              <div className="bg-[#6B00D7]/10 text-[#6B00D7] text-xs px-2 py-0.5 rounded border border-[#6B00D7]/20">
                Default
              </div>
            </div>
            
            {/* Fortress Security */}
            <div className="flex items-center">
              <div className="flex-shrink-0 w-5 h-5 bg-[#FF5AF7]/20 rounded-full flex items-center justify-center mr-2">
                <Star className="h-3 w-3 text-[#FF5AF7]" />
              </div>
              <div className="flex-1">
                <span className="text-white text-sm font-medium">Sovereign Fortress™ Security:</span>
                <span className="text-gray-400 text-sm ml-1">Military-grade quantum-resistant encryption</span>
              </div>
              <Link href="/security-protocols">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 text-xs group bg-black/30 border-[#FF5AF7]/30 hover:border-[#FF5AF7]/100"
                >
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Configure</span>
                  <ChevronRight className="ml-1 h-3 w-3 text-[#FF5AF7] group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="mt-4 border-t border-gray-800 pt-4"></div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            <span className="text-[#FF5AF7]">*</span> Selection required to continue
          </div>
          <Button 
            onClick={handleContinue}
            className={cn(
              "transition-all duration-300 flex items-center",
              !selectedVaultType 
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 hover:shadow-lg hover:shadow-[#6B00D7]/20"
            )}
          >
            {selectedVaultType ? (
              <>
                Continue with {selectedVaultType === 'standard' ? 'Sovereign Fortress Vault™' : selectedVaultType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Vault'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Select a Vault Type to Continue
                <AlertCircle className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

function VaultTypesSelectorPage() {
  return <VaultTypesSelector />;
}

export default VaultTypesSelectorPage;