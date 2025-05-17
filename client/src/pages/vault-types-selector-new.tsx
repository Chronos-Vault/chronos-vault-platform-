import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import VaultTypeSelector, { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, ArrowRight, AlertCircle, ChevronRight, Shield, Star, 
  LockKeyhole, Check, Sparkles, Cpu, Database, Clock, BarChart4
} from 'lucide-react';
import { VaultCreationProgress, getDefaultVaultCreationSteps } from '@/components/vault/create-vault-progress';

const VaultTypesSelectorNew = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>('standard');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('innovative');
  const [animateIn, setAnimateIn] = useState<boolean>(false);
  
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setAnimateIn(true);
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
      icon: <BarChart4 className="h-5 w-5 text-[#3F51FF]" />,
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
      navigate('/multi-signature-vault-new');
    } else if (selectedVaultType === 'biometric') {
      navigate('/biometric-vault');
    } else if (selectedVaultType === 'cross-chain') {
      navigate(`/cross-chain-vault`);
    } else if (selectedVaultType === 'standard' || 
        selectedVaultType === 'time-lock') {
      navigate(`/specialized-vault?type=${selectedVaultType}`);
    } else if (selectedVaultType === 'ai-intent-inheritance') {
      navigate('/intent-inheritance-vault');
    } else if (selectedVaultType === 'quantum-resistant') {
      navigate(`/specialized-vault-creation?type=${selectedVaultType}`);
    } else if (selectedVaultType === 'diamond-hands') {
      navigate('/investment-discipline-vault');
    } else if (selectedVaultType === 'ai-investment') {
      navigate('/ai-investment-vault');
    } else if (selectedVaultType === 'milestone-based') {
      navigate('/milestone-based-vault');
    } else if (selectedVaultType === 'family-heritage') {
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
      navigate(`/specialized-vault-creation?type=${selectedVaultType}`);
    }
  };
  
  const handleBack = () => {
    navigate('/my-vaults');
  };
  
  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl perspective-1000">
      {/* Animated Header with Gradient Text Effect */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
        <div className={`${animateIn ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6B00D7] via-[#BB86FC] to-[#FF5AF7] bg-300% animate-text-shine text-transparent bg-clip-text">
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

      {/* Main Content with Blurred Background and Glowing Effects */}
      <div className="relative p-6 rounded-xl border border-gray-800/50 backdrop-blur-md bg-black/30 mb-8 overflow-hidden">
        {/* Background Gradient Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-[#6B00D7] transform translate-x-1/3 -translate-y-1/3 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 bg-[#FF5AF7] transform -translate-x-1/3 translate-y-1/3 animate-pulse-slow animation-delay-1000"></div>
        
        {/* Progress Indicator */}
        <div className={`relative z-10 mb-8 ${animateIn ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
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
        
        {/* Validation Error Display with Animation */}
        {validationError && (
          <div className="mb-6 p-4 border-2 border-red-500/50 bg-black/60 backdrop-blur-md rounded-xl flex items-start animate-pulse">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-semibold">{validationError}</p>
              <p className="text-xs text-gray-400 mt-1">Please select a vault type to continue to the next step.</p>
            </div>
          </div>
        )}
        
        {/* Premium Security Features - 3D Card Effect */}
        <div className={`p-6 border-2 border-[#6B00D7]/60 rounded-xl bg-gradient-to-r from-[#120224] via-[#1C0533] to-[#290745] relative overflow-hidden mb-10 ${animateIn ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FF5AF7]/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#6B00D7]/30 to-transparent rounded-tr-full"></div>
          
          <h2 className="text-2xl font-bold text-white mb-4 relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
              Premium Security Features
            </span>
            <span className="ml-3 text-sm bg-[#6B00D7]/30 text-[#FF5AF7] px-3 py-1 rounded-full border border-[#6B00D7]/50">
              INCLUDED WITH ALL VAULTS
            </span>
          </h2>
          <p className="text-gray-300 text-sm mb-6 max-w-3xl leading-relaxed relative z-10">
            Every Chronos Vault delivers unparalleled protection through our revolutionary triple-chain technology, 
            making us the most secure digital asset solution in the world - accessible to everyone, with zero blockchain knowledge required.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Triple-Chain Security */}
            <div className="group bg-black/50 backdrop-blur-md border-2 border-[#6B00D7]/40 p-5 rounded-xl flex flex-col hover:border-[#6B00D7] transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-[#6B00D7]/30 to-[#6B00D7]/10 rounded-xl mb-4 self-start">
                <Shield className="h-6 w-6 text-[#BB86FC]" />
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-[#BB86FC] transition-colors">Triple-Chain Security</h3>
              <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full mb-3"></div>
              <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                Distributes security across Ethereum, Solana, and TON networks for unmatched protection
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-400">
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#6B00D7] mr-2" /> Multi-chain verification
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#6B00D7] mr-2" /> Military-grade encryption
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#6B00D7] mr-2" /> Cross-network recovery options
                </li>
              </ul>
            </div>
            
            {/* Cross-Chain Compatibility */}
            <div className="group bg-black/50 backdrop-blur-md border-2 border-[#BB86FC]/40 p-5 rounded-xl flex flex-col hover:border-[#BB86FC] transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-[#BB86FC]/30 to-[#BB86FC]/10 rounded-xl mb-4 self-start">
                <Database className="h-6 w-6 text-[#03DAC5]" />
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-[#03DAC5] transition-colors">Cross-Chain Compatibility</h3>
              <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#BB86FC] to-[#03DAC5] rounded-full mb-3"></div>
              <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                Seamlessly store and access your assets across multiple blockchain networks
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-400">
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#BB86FC] mr-2" /> Universal asset management
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#BB86FC] mr-2" /> Chain-agnostic security
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#BB86FC] mr-2" /> Smart cross-chain transfers
                </li>
              </ul>
            </div>
            
            {/* Quantum-Resistant Technology */}
            <div className="group bg-black/50 backdrop-blur-md border-2 border-[#03DAC5]/40 p-5 rounded-xl flex flex-col hover:border-[#03DAC5] transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-3 bg-gradient-to-r from-[#03DAC5]/30 to-[#03DAC5]/10 rounded-xl mb-4 self-start">
                <LockKeyhole className="h-6 w-6 text-[#FF5AF7]" />
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-[#FF5AF7] transition-colors">Quantum-Resistant Technology</h3>
              <div className="mt-1 h-0.5 w-12 bg-gradient-to-r from-[#03DAC5] to-[#FF5AF7] rounded-full mb-3"></div>
              <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors">
                Future-proof security that protects against next-generation computing threats
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-400">
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#03DAC5] mr-2" /> Post-quantum cryptography
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#03DAC5] mr-2" /> Lattice-based encryption
                </li>
                <li className="flex items-center">
                  <Check className="h-3 w-3 text-[#03DAC5] mr-2" /> Zero-knowledge safety layers
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Vault Categories Selection - Interactive 3D Cards */}
        <div className={`mb-10 ${animateIn ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold text-white mb-2 inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Vault Categories
          </h2>
          <p className="text-gray-400 mb-8 text-sm max-w-2xl">
            Our vaults are thoughtfully organized into five specialized categories to help you find the perfect solution for your unique requirements
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {vaultCategories.map((category) => (
              <div
                key={category.id}
                className={`group relative p-5 border-2 rounded-xl overflow-hidden transition-all duration-500 cursor-pointer transform-gpu hover:-translate-y-1 ${
                  activeCategory === category.id
                    ? 'animate-float'
                    : 'hover:shadow-lg'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${category.color}10 0%, rgba(0,0,0,0.4) 100%)`,
                  borderColor: activeCategory === category.id ? category.color : `${category.color}30`,
                  boxShadow: activeCategory === category.id ? `0 10px 25px ${category.color}20` : 'none'
                }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl transform translate-x-10 translate-y-10" style={{background: `${category.color}10`}}></div>
                
                <div className="flex items-center mb-3">
                  <div className="p-3 rounded-full mr-3" style={{background: `${category.color}15`}}>
                    {category.icon}
                  </div>
                  <h3 
                    className="text-lg font-bold relative z-10 transition-colors duration-300"
                    style={{ 
                      color: category.color,
                      textShadow: activeCategory === category.id ? `0 0 10px ${category.color}80` : 'none'
                    }}
                  >
                    {category.name}
                  </h3>
                </div>
                
                <div className="h-0.5 w-12 rounded-full mb-3" style={{ background: category.color }}></div>
                
                <p className="text-sm text-gray-300 mb-3 relative z-10 group-hover:text-white transition-colors">
                  {category.description}
                </p>
                
                <ul className="text-xs text-gray-400 space-y-2 relative z-10">
                  {category.vaultTypes.map((vault, idx) => (
                    <li key={idx} className="flex items-center transition-colors duration-300" 
                      style={{ 
                        color: activeCategory === category.id ? `${category.color}` : undefined
                      }}
                    >
                      <div className="w-2 h-2 rounded-full mr-2" style={{ background: category.color }}></div>
                      {vault}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Vault Selection Component - With Visual Enhancements */}
        <div className={`my-12 ${animateIn ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  All Available Vault Types
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Explore our complete collection of 19 specialized vault solutions, each with unique features and security levels
              </p>
            </div>
            <div className="flex items-center rounded-full bg-black/40 border border-gray-800 p-1.5 text-xs text-gray-400">
              <div className="px-3 py-1.5 rounded-full bg-[#6B00D7]/20 text-[#BB86FC]">19 Vault Types</div>
              <div className="px-3 py-1.5">5 Categories</div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md border border-gray-800/50 rounded-xl p-6">
            <VaultTypeSelector 
              selectedType={selectedVaultType} 
              onChange={handleVaultTypeSelect} 
            />
          </div>
        </div>
          
        {/* Action Confirmation Panel - Floating 3D Card */}
        <div className={`mt-10 p-6 border-2 border-[#6B00D7]/40 rounded-xl bg-gradient-to-r from-[#120224] to-[#290745] relative overflow-hidden ${animateIn ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}
            style={{boxShadow: '0 10px 25px rgba(107, 0, 215, 0.2)'}}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#6B00D7]/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF5AF7]/10 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 border border-[#6B00D7]/30 flex items-center justify-center mr-5">
                <Shield className="h-8 w-8 text-[#BB86FC]" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  Sovereign Fortress™ Security
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  Configure quantum-resistant security protocols for your selected vault type
                </p>
              </div>
            </div>
            <Button 
              onClick={handleContinue}
              className="px-8 py-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#5A00B8] hover:to-[#EE40E8] text-white font-bold text-lg shadow-lg shadow-[#6B00D7]/20 transform transition-transform duration-300 hover:scale-[1.02] focus:scale-[0.98]"
            >
              {selectedVaultType ? (
                <>
                  Continue with {selectedVaultType === 'standard' ? 'Sovereign Fortress Vault™' : selectedVaultType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Vault'}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              ) : (
                <>
                  Select a Vault Type to Continue
                  <AlertCircle className="ml-3 h-5 w-5" />
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
export default VaultTypesSelectorNew;