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
import { cn } from '@/lib/utils';
import '../styles/animate-gradient.css';

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

  // Get current category color
  const getCategoryColor = (opacity = 1) => {
    const category = vaultCategories.find(cat => cat.id === activeCategory);
    return category ? `${category.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : '#6B00D7';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#150526] to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Floating orbs with dynamic colors */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-float-slow"
          style={{ background: getCategoryColor(0.2) }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float-slow animation-delay-2000"
          style={{ background: getCategoryColor(0.15) }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/3 w-40 h-40 rounded-full blur-3xl animate-float-slow animation-delay-1000"
          style={{ background: getCategoryColor(0.25) }}
        ></div>
        
        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-scan-vertical">
            <div 
              className="h-px w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${getCategoryColor(0.4)}, transparent)` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 sm:p-6 max-w-7xl relative z-10">
        {/* Animated Header with 3D Text Effect */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className={`transform ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6B00D7] via-[#BB86FC] to-[#FF5AF7]">
              Vault Selection
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Choose from our <span className="font-semibold" style={{ color: getCategoryColor() }}>19 specialized vault solutions</span> with unmatched security
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
        
        {/* Category Selector */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {vaultCategories.map((category, index) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm relative overflow-hidden ${
                activeCategory === category.id
                  ? 'bg-black/30 ring-2 shadow-lg'
                  : 'bg-black/20 border border-gray-800 hover:border-gray-700 hover:bg-black/25'
              }`}
              style={{
                boxShadow: activeCategory === category.id ? `0 0 15px ${category.color}40` : 'none',
                borderColor: activeCategory === category.id ? category.color : undefined,
                ringColor: category.color
              }}
              onClick={() => handleCategorySelect(category.id)}
            >
              {/* Background glow effect */}
              {activeCategory === category.id && (
                <div 
                  className="absolute inset-0 animate-pulse-glow" 
                  style={{ 
                    background: `radial-gradient(circle at center, ${category.color}30 0%, transparent 70%)`
                  }}
                ></div>
              )}
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform duration-300 ${
                    activeCategory === category.id ? 'scale-110' : ''
                  }`}
                  style={{ 
                    background: `${category.color}20`, 
                    boxShadow: activeCategory === category.id ? `0 0 10px ${category.color}40` : 'none'
                  }}
                >
                  <div style={{ color: category.color }}>{category.icon}</div>
                </div>
                
                <h3 
                  className="text-base font-medium mb-1"
                  style={{ color: activeCategory === category.id ? category.color : 'white' }}
                >
                  {category.name}
                </h3>
                
                <p className="text-xs text-gray-400 hidden md:block">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Main content area with backdrop and glow */}
        <div 
          className="rounded-xl backdrop-blur-md bg-black/20 p-6 border relative overflow-hidden transition-colors duration-500"
          style={{ borderColor: `${getCategoryColor(0.3)}` }}
        >
          {/* Glow effect based on active category */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              background: `radial-gradient(circle at 30% 30%, ${getCategoryColor()}, transparent 70%)`
            }}
          ></div>
          
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
            <div className="p-5 border-2 rounded-lg mb-6 relative overflow-hidden transition-colors duration-500"
                style={{ 
                  borderColor: `${getCategoryColor(0.5)}`,
                  background: `linear-gradient(to right, ${getCategoryColor(0.1)}, transparent)`
                }}>
              <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full"
                   style={{ background: `linear-gradient(to bottom left, ${getCategoryColor(0.2)}, transparent)` }}></div>
              
              <h2 className="text-xl font-semibold text-white mb-3">All Vaults Include Premium Features</h2>
              <p className="text-gray-300 text-sm mb-4 max-w-3xl">
                Every vault type includes our revolutionary technologies, making Chronos Vault the most secure solution in the world - accessible to everyone, with no blockchain knowledge required.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/40 border p-4 rounded-lg flex items-start transition-colors duration-500"
                     style={{ borderColor: `${getCategoryColor(0.4)}` }}>
                  <div className="p-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-500"
                       style={{ background: `linear-gradient(to right, ${getCategoryColor(0.2)}, ${getCategoryColor(0.2)})` }}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base text-white">Triple-Chain Security</h3>
                    <p className="text-xs text-gray-300 mt-1">Distributes security across Ethereum, Solana, and TON for unmatched protection</p>
                  </div>
                </div>
                
                <div className="bg-black/40 border p-4 rounded-lg flex items-start transition-colors duration-500"
                     style={{ borderColor: `${getCategoryColor(0.4)}` }}>
                  <div className="p-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-500"
                       style={{ background: `linear-gradient(to right, ${getCategoryColor(0.2)}, ${getCategoryColor(0.2)})` }}>
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base text-white">Cross-Chain Compatibility</h3>
                    <p className="text-xs text-gray-300 mt-1">Store and access your assets across multiple blockchain networks</p>
                  </div>
                </div>
                
                <div className="bg-black/40 border p-4 rounded-lg flex items-start transition-colors duration-500"
                     style={{ borderColor: `${getCategoryColor(0.4)}` }}>
                  <div className="p-2 rounded-full mr-3 flex-shrink-0 transition-colors duration-500"
                       style={{ background: `linear-gradient(to right, ${getCategoryColor(0.2)}, ${getCategoryColor(0.2)})` }}>
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

            {/* Vault Selection */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-white">Select Your Vault Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VaultTypeSelector 
                  vaultTypes={['standard', 'time-lock', 'multi-signature', 'cross-chain', 'ai-investment', 'milestone-based', 'family-heritage']}
                  selectedType={selectedVaultType}
                  onSelect={handleVaultTypeSelect}
                  categoryColor={getCategoryColor()}
                  activeCategory={activeCategory}
                />
                
                <div className="bg-black/40 border-2 rounded-lg p-5 h-full flex flex-col transition-colors duration-500"
                     style={{ borderColor: `${getCategoryColor(0.3)}` }}>
                  <h3 className="text-lg font-medium text-white mb-4">Selected Vault Benefits</h3>
                  
                  <div className="flex flex-col space-y-3 flex-grow">
                    {selectedVaultType === 'time-lock' && (
                      <>
                        <p className="text-gray-300 text-sm">The Time-Lock Vault is our most secure basic vault option, perfect for time-sensitive assets:</p>
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Triple-chain military-grade security protocol</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Time-based unlocking with precise scheduling</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Emergency access protocols with security verification</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Support for multiple digital asset types</span>
                          </li>
                        </ul>
                      </>
                    )}
                    
                    {selectedVaultType === 'multi-signature' && (
                      <>
                        <p className="text-gray-300 text-sm">The Multi-Signature Vault distributes control among trusted parties:</p>
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Require multiple approvals for any vault action</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Customizable quorum settings (e.g., 2-of-3, 3-of-5)</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Ideal for business, family, or team asset control</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Create complex approval hierarchies</span>
                          </li>
                        </ul>
                      </>
                    )}
                    
                    {selectedVaultType === 'ai-investment' && (
                      <>
                        <p className="text-gray-300 text-sm">The AI-Assisted Investment Vault optimizes your investment strategy:</p>
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Advanced AI analytics for optimal investment timing</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Smart portfolio diversification recommendations</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Market sentiment analysis and prediction</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Customizable risk tolerance and investment goals</span>
                          </li>
                        </ul>
                      </>
                    )}
                    
                    {/* Default content for other vault types */}
                    {(selectedVaultType !== 'time-lock' && selectedVaultType !== 'multi-signature' && selectedVaultType !== 'ai-investment') && (
                      <>
                        <p className="text-gray-300 text-sm">This specialized vault type includes our premium security features:</p>
                        <ul className="space-y-2 mt-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Triple-chain military-grade security protocol</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Zero-knowledge proof privacy protection</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Specialized features tailored to your needs</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-200">Advanced recovery and backup options</span>
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <Button
                      className="w-full mt-4 transition-colors duration-300 border-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${getCategoryColor(0.8)}, ${getCategoryColor()})`,
                        boxShadow: `0 4px 12px ${getCategoryColor(0.4)}`
                      }}
                      onClick={handleContinue}
                    >
                      Continue to Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer - Specialized Features Section */}
        <div className="mt-8 flex justify-center">
          <Link to="/vault-selection-showcase" className="text-gray-400 hover:text-white text-sm flex items-center transition-colors duration-300">
            <Star className="h-4 w-4 mr-1" />
            Explore our showcase of all 19 vault types
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VaultTypesSelector;