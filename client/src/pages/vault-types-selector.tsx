import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import VaultTypeSelector, { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, ArrowRight, AlertCircle, ChevronRight, Shield, Star, 
  LockKeyhole, Check, Sparkles, Cpu, Braces, Fingerprint, Clock, BarChart4 as BarChart
} from 'lucide-react';
import { VaultCreationProgress, getDefaultVaultCreationSteps } from '@/components/vault/create-vault-progress';
import GlowingBackground from '../components/effects/glowing-background';
import { cn } from '@/lib/utils';

const VaultTypesSelector = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>('standard');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('innovative');
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  
  useEffect(() => {
    // Start animations after component mounts
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const vaultCategories = [
    {
      id: "innovative",
      name: "Innovative Smart Vaults",
      color: "#00E676",
      icon: <Sparkles className="h-5 w-5 text-[#00E676]" />,
      description: "Cutting-edge vaults with advanced AI and smart technology integration",
      vaultTypes: ["AI-Assisted Investment", "AI Intent Inheritance", "Milestone-Based Release", "Family Heritage"]
    },
    {
      id: "asset-management",
      name: "Asset & Investment Management",
      color: "#3F51FF",
      icon: <BarChart className="h-5 w-5 text-[#3F51FF]" />,
      description: "Specialized vaults for optimal investment strategies and asset protection",
      vaultTypes: ["Investment Discipline", "Cross-Chain Verification", "Fragment Vault", "Quantum-Resistant"]
    },
    {
      id: "specialized",
      name: "Specialized Purpose Vaults",
      color: "#FF5AF7",
      icon: <Cpu className="h-5 w-5 text-[#FF5AF7]" />,
      description: "Vaults designed for specific use cases and unique requirements",
      vaultTypes: ["Memory Vault", "Geolocation Vault", "Smart Contract Vault", "NFT-Powered Vault"]
    },
    {
      id: "advanced-security",
      name: "Advanced Security Vaults",
      color: "#9E00FF",
      icon: <Shield className="h-5 w-5 text-[#9E00FF]" />,
      description: "Enhanced protection with multiple verification layers and distributed security",
      vaultTypes: ["Multi-Signature Vault", "Biometric Vault", "Unique Security Vault", "Dynamic Vault"]
    },
    {
      id: "basic-time",
      name: "Basic Time Vaults",
      color: "#00D7C3",
      icon: <Clock className="h-5 w-5 text-[#00D7C3]" />,
      description: "Simple and reliable time-locked storage with essential security features",
      vaultTypes: ["Advanced Time-Lock Vault", "Sovereign Fortress Vault™"]
    }
  ];
  
  const handleCategorySelect = (categoryId: string) => {
    setActiveCategory(categoryId);
    
    // Set default vault type for the category
    switch(categoryId) {
      case 'innovative':
        setSelectedVaultType('ai-investment');
        break;
      case 'asset-management':
        setSelectedVaultType('diamond-hands');
        break;
      case 'specialized':
        setSelectedVaultType('memory-vault');
        break;
      case 'advanced-security':
        setSelectedVaultType('multi-signature');
        break;
      case 'basic-time':
        setSelectedVaultType('time-lock');
        break;
      default:
        setSelectedVaultType('standard');
    }
  };
  
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
    } else if (selectedVaultType === 'ai-investment') {
      // AI-Assisted Investment Vault
      navigate('/ai-investment-vault');
    } else if (selectedVaultType === 'milestone-based') {
      // Milestone-Based Release Vault
      navigate('/milestone-based-vault');
    } else if (selectedVaultType === 'family-heritage') {
      // Family Heritage Vault
      navigate('/family-heritage-vault');
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
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl perspective-1200">
      {/* Animated Header with 3D Text Effect */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
        <div className={`transform-style-3d ${showAnimation ? 'animate-fade-in-up' : ''}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] via-[#BB86FC] to-[#FF5AF7] bg-300% animate-text-shine text-transparent bg-clip-text title-3d-animated">
            Vault Selection
          </h1>
          <p className="text-gray-300 mt-2 text-lg">
            Choose from our <span className="text-[#FF5AF7] font-semibold">19 specialized vault solutions</span> with unmatched security
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex items-center bg-black/30 backdrop-blur-sm border-gray-700 hover:border-gray-500 hover:bg-black/40 mt-4 sm:mt-0 transition-all duration-300"
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      {/* Main Content Area with Glowing Background */}
      <div 
        className={`relative overflow-hidden rounded-xl mb-8 backdrop-blur-md p-6`}
      >
        {/* Background with subtle grid pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Glowing orbs based on active category */}
        <div
          className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl animate-float-slow"
          style={{ 
            background: vaultCategories.find(cat => cat.id === activeCategory)?.color || "#6B00D7", 
            opacity: 0.15 
          }}
        ></div>
        
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full blur-3xl animate-float-slow animation-delay-2000"
          style={{ 
            background: vaultCategories.find(cat => cat.id === activeCategory)?.color || "#6B00D7", 
            opacity: 0.15 
          }}
        ></div>
        
        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-scan-vertical">
            <div className="h-px w-full" 
              style={{ 
                background: `linear-gradient(90deg, transparent 0%, ${vaultCategories.find(cat => cat.id === activeCategory)?.color || "#6B00D7"}40 50%, transparent 100%)` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
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
              <li>• Quantum-Resistant Encryption</li>
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
        
        {/* New Innovative Vaults Section */}
        <div className="p-4 border-2 border-[#00E676]/30 rounded-lg bg-gradient-to-r from-[#00E676]/10 to-black/40 mb-6">
          <div className="flex items-center mb-3">
            <div className="bg-[#00E676]/20 p-2 rounded-full mr-3">
              <span className="text-xl">🔥</span>
            </div>
            <h3 className="text-[#00E676] font-bold text-lg">New Innovative Vaults</h3>
            <span className="ml-3 bg-[#00E676]/20 text-[#00E676] text-xs font-medium px-2 py-1 rounded-full">JUST ADDED</span>
          </div>
          
          <p className="text-sm text-gray-300 mb-4 ml-12">
            Experience our latest cutting-edge vault technologies - available exclusively on Chronos Vault
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-[#00E676]/30 p-4 rounded-lg hover:border-[#00E676] transition-all cursor-pointer" onClick={() => handleVaultTypeSelect('ai-investment')}>
              <div className="flex items-center mb-2">
                <div className="bg-[#00E676]/20 p-2 rounded-full mr-3">
                  <span className="text-xl">🤖</span>
                </div>
                <h4 className="text-white font-medium">AI-Assisted Investment</h4>
              </div>
              <p className="text-xs text-gray-400">
                AI-powered market analysis for optimal entry and exit points
              </p>
            </div>
            
            <div className="bg-black/40 border border-[#FF9800]/30 p-4 rounded-lg hover:border-[#FF9800] transition-all cursor-pointer" onClick={() => handleVaultTypeSelect('milestone-based')}>
              <div className="flex items-center mb-2">
                <div className="bg-[#FF9800]/20 p-2 rounded-full mr-3">
                  <span className="text-xl">🏆</span>
                </div>
                <h4 className="text-white font-medium">Milestone-Based Release</h4>
              </div>
              <p className="text-xs text-gray-400">
                Unlocks assets when specific personal achievements are completed
              </p>
            </div>
            
            <div className="bg-black/40 border border-[#E040FB]/30 p-4 rounded-lg hover:border-[#E040FB] transition-all cursor-pointer" onClick={() => handleVaultTypeSelect('family-heritage')}>
              <div className="flex items-center mb-2">
                <div className="bg-[#E040FB]/20 p-2 rounded-full mr-3">
                  <span className="text-xl">👪</span>
                </div>
                <h4 className="text-white font-medium">Family Heritage Vault</h4>
              </div>
              <p className="text-xs text-gray-400">
                Generational wealth transfer with integrated education modules
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Select Your Vault Type</h2>
          <p className="text-gray-300 text-sm mb-6">
            Explore our 16 specialized vault types with unique features and security levels
          </p>
          
          <VaultTypeSelector 
            selectedType={selectedVaultType} 
            onChange={handleVaultTypeSelect} 
          />
          
          {/* Security Configuration Banner */}
          <div className="mt-4 p-4 border border-[#FF5AF7]/30 rounded-lg bg-gradient-to-r from-black/40 to-[#6B00D7]/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF5AF7]/10 border border-[#FF5AF7]/20 flex items-center justify-center mr-4">
                  <Star className="h-6 w-6 text-[#FF5AF7]" />
                </div>
                <div>
                  <h3 className="text-[#FF5AF7] font-medium text-lg">Sovereign Fortress™ Security</h3>
                  <p className="text-sm text-gray-400">Configure quantum-resistant security protocols for your vault</p>
                </div>
              </div>
              <Link href="/security-protocols">
                <Button 
                  variant="outline" 
                  className="group border-[#FF5AF7] border-opacity-30 hover:border-opacity-100 bg-black/20 hover:bg-black/40 transition-all"
                >
                  <LockKeyhole className="mr-2 h-4 w-4 text-[#FF5AF7] group-hover:animate-pulse" />
                  <span className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">Configure Security</span>
                  <ChevronRight className="ml-2 h-4 w-4 text-[#FF5AF7] group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Triple-Chain Security Banner */}
          <div className="mt-4 p-4 border border-[#6B00D7]/30 rounded-lg bg-gradient-to-r from-black/40 to-[#6B00D7]/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#6B00D7]/10 border border-[#6B00D7]/20 flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-[#6B00D7]" />
                </div>
                <div>
                  <h3 className="text-[#6B00D7] font-medium text-lg">Triple-Chain Security Architecture</h3>
                  <p className="text-sm text-gray-400">Distributes your vault security across Ethereum, Solana, and TON blockchains</p>
                </div>
              </div>
              <div className="bg-[#6B00D7]/10 text-[#6B00D7] text-sm px-3 py-1 rounded-full border border-[#6B00D7]/20 flex items-center">
                <Check className="mr-1 h-4 w-4" /> Default for all vaults
              </div>
            </div>
          </div>
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
    </div>
  );
};

// Export the component as the default export
export default function VaultTypesSelectorPage() {
  return <VaultTypesSelector />;
}