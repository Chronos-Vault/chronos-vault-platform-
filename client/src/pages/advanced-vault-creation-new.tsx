import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Sparkles, Shield, ArrowLeft, ChevronRight, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockchainType } from '@/lib/web3Config';
import { useToast } from '@/hooks/use-toast';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useTon } from '@/contexts/ton-context';
import { MultiSignatureConfig } from '@/components/vault/MultiSignatureConfig';
import { GeolocationLockConfig } from '@/components/vault/GeolocationLockConfig';
import { VaultTransactionManager } from '@/components/vault/VaultTransactionManager';

interface VaultFormData {
  name: string;
  description: string;
  blockchain: BlockchainType;
  contractType: string;
  assetType: string;
  assetAmount: string;
  timeLockPeriod: number;
  unlockDate: Date;
  requireMultiSig: boolean;
  signers: { address: string; alias: string; status: string }[];
  threshold: number;
  enableGeolocation: boolean;
  geoLocation: {
    latitude: number;
    longitude: number;
    radius: number;
    enabled: boolean;
    requiredOnCreation: boolean;
    requiredOnAccess: boolean;
    lockLevel: 'strict' | 'moderate' | 'flexible';
  };
  attachments: any[];
  metadata: Record<string, any>;
}

const CONTRACT_TYPES = [
  { id: 'standard', name: 'Standard Vault', description: 'Basic time-locked vault' },
  { id: 'multisig', name: 'Multi-Signature Vault', description: 'Requires multiple signers for access' },
  { id: 'inheritance', name: 'Inheritance Vault', description: 'Asset transfer on predetermined conditions' },
  { id: 'halving', name: 'Bitcoin Halving Vault', description: 'Tied to Bitcoin halving events' },
];

const TIME_LOCK_OPTIONS = [
  { value: 30, label: '30 Days' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' },
  { value: 730, label: '2 Years' },
  { value: 1825, label: '5 Years' },
  { value: 3650, label: '10 Years' },
];

const BLOCKCHAIN_ASSETS = {
  [BlockchainType.ETHEREUM]: [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
    { id: 'usdt', name: 'Tether', symbol: 'USDT' },
    { id: 'dai', name: 'Dai', symbol: 'DAI' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
  [BlockchainType.SOLANA]: [
    { id: 'sol', name: 'Solana', symbol: 'SOL' },
    { id: 'usdc', name: 'USD Coin', symbol: 'USDC' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
  [BlockchainType.TON]: [
    { id: 'ton', name: 'Toncoin', symbol: 'TON' },
    { id: 'cvt', name: 'Chronos Vault Token', symbol: 'CVT' },
  ],
};

const AdvancedVaultCreationPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isConnected: isEthConnected } = useEthereum();
  const { isConnected: isSolConnected } = useSolana();
  const { isConnected: isTonConnected } = useTon();
  
  // Form state
  const [formData, setFormData] = useState<VaultFormData>({
    name: '',
    description: '',
    blockchain: BlockchainType.ETHEREUM,
    contractType: 'standard',
    assetType: 'eth',
    assetAmount: '',
    timeLockPeriod: 365,
    unlockDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    requireMultiSig: false,
    signers: [],
    threshold: 2,
    enableGeolocation: false,
    geoLocation: {
      latitude: 0,
      longitude: 0,
      radius: 10,
      enabled: false,
      requiredOnCreation: true,
      requiredOnAccess: true,
      lockLevel: 'moderate',
    },
    attachments: [],
    metadata: {},
  });
  
  // UI state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [securityScore, setSecurityScore] = useState<number>(65);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [transactionReady, setTransactionReady] = useState<boolean>(false);
  const [transactionCompleted, setTransactionCompleted] = useState<boolean>(false);
  const [createdVaultAddress, setCreatedVaultAddress] = useState<string>('');
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState<boolean>(false);
  
  // Validation on form changes
  useEffect(() => {
    const isBasicInfoValid = 
      formData.name.trim().length >= 3 && 
      formData.assetAmount.trim() !== '' && 
      !isNaN(parseFloat(formData.assetAmount)) && 
      parseFloat(formData.assetAmount) > 0;
    
    const isMultiSigValid = !formData.requireMultiSig || 
      (formData.requireMultiSig && formData.signers.length >= formData.threshold);
    
    const isGeoValid = !formData.enableGeolocation || 
      (formData.enableGeolocation && 
       formData.geoLocation.enabled && 
       formData.geoLocation.latitude !== 0 && 
       formData.geoLocation.longitude !== 0);
    
    setIsFormValid(isBasicInfoValid && isMultiSigValid && isGeoValid);
    
    // Calculate security score
    let score = 65; // Base score
    
    // Add points for security features
    if (formData.requireMultiSig) score += 15;
    if (formData.enableGeolocation) score += 10;
    
    // Time-lock factor
    if (formData.timeLockPeriod > 365) score += 10;
    else if (formData.timeLockPeriod > 180) score += 5;
    
    // Cap at 100
    score = Math.min(100, score);
    setSecurityScore(score);
    
  }, [formData]);
  
  // Check if wallet is connected for selected blockchain
  const isWalletConnected = () => {
    switch (formData.blockchain) {
      case BlockchainType.ETHEREUM:
        return isEthConnected;
      case BlockchainType.SOLANA:
        return isSolConnected;
      case BlockchainType.TON:
        return isTonConnected;
      default:
        return false;
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle blockchain selection
  const handleBlockchainChange = (blockchain: BlockchainType) => {
    setFormData(prev => ({ 
      ...prev, 
      blockchain,
      // Reset asset type to the first one available for the selected blockchain
      assetType: BLOCKCHAIN_ASSETS[blockchain][0].id
    }));
  };
  
  // Handle contract type selection
  const handleContractTypeChange = (contractType: string) => {
    const newState = { ...formData, contractType };
    
    // If multi-signature vault is selected, enable multi-sig
    if (contractType === 'multisig' && !formData.requireMultiSig) {
      newState.requireMultiSig = true;
    }
    
    // If inheritance vault is selected, enable geo-location
    if (contractType === 'inheritance' && !formData.enableGeolocation) {
      newState.enableGeolocation = true;
      newState.geoLocation.enabled = true;
    }
    
    setFormData(newState);
  };
  
  // Handle time lock period selection
  const handleTimeLockChange = (days: number) => {
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + days);
    
    setFormData(prev => ({
      ...prev,
      timeLockPeriod: days,
      unlockDate
    }));
  };
  
  // Handle multi-signature configuration
  const handleMultiSigConfigChange = (config: {
    threshold: number;
    signers: { address: string; alias: string; status: string }[];
  }) => {
    setFormData(prev => ({
      ...prev,
      threshold: config.threshold,
      signers: config.signers
    }));
  };
  
  // Handle geolocation configuration
  const handleGeoLocationChange = (geoData: any) => {
    setFormData(prev => ({
      ...prev,
      enableGeolocation: geoData.enabled,
      geoLocation: geoData
    }));
  };
  
  // Handle transaction completion
  const handleTransactionComplete = (txHash: string, vaultAddress: string) => {
    setCreatedVaultAddress(vaultAddress);
    setTransactionCompleted(true);
    
    // After a delay, navigate to the vault details page
    setTimeout(() => {
      navigate(`/vault-details?id=${vaultAddress}`);
    }, 3000);
  };
  
  // Handle transaction error
  const handleTransactionError = (error: string) => {
    toast({
      title: 'Transaction Failed',
      description: error,
      variant: 'destructive'
    });
  };
  
  // Prepare transaction
  const prepareTransaction = () => {
    setTransactionReady(true);
    setCurrentStep(4); // Move to transaction step
  };
  
  // Move to next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Go to vault page
  const goToVault = () => {
    navigate(`/vault-details?id=${createdVaultAddress}`);
  };
  
  // Format security score color
  const getSecurityScoreColor = () => {
    if (securityScore >= 90) return 'text-green-500';
    if (securityScore >= 70) return 'text-blue-500';
    if (securityScore >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate('/create-vault')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Vault Creator
        </Button>
      </div>
      
      <PageHeader
        heading="Advanced Vault Creation"
        description="Create a secure, multi-chain vault with advanced security features and customization"
        separator={true}
      />
      
      <div className="my-8">
        <div className="relative">
          {/* Progress bar */}
          <div className="hidden md:flex w-full justify-between mb-8">
            <div className="relative w-full flex items-center">
              <div className="absolute h-1 w-full bg-[#1A1A1A] rounded-full">
                <div 
                  className="absolute h-1 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
              <div className="relative w-full flex justify-between">
                <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-[#6B00D7]' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep >= 1 ? 'bg-[#6B00D7] text-white' : 'bg-[#1A1A1A] text-gray-500'}`}>
                    1
                  </div>
                  <span className="text-xs font-medium">Basics</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-[#6B00D7]' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep >= 2 ? 'bg-[#6B00D7] text-white' : 'bg-[#1A1A1A] text-gray-500'}`}>
                    2
                  </div>
                  <span className="text-xs font-medium">Security</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-[#6B00D7]' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep >= 3 ? 'bg-[#6B00D7] text-white' : 'bg-[#1A1A1A] text-gray-500'}`}>
                    3
                  </div>
                  <span className="text-xs font-medium">Review</span>
                </div>
                <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-[#6B00D7]' : 'text-gray-500'}`}>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-2 ${currentStep >= 4 ? 'bg-[#6B00D7] text-white' : 'bg-[#1A1A1A] text-gray-500'}`}>
                    4
                  </div>
                  <span className="text-xs font-medium">Create</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card className="border-[#6B00D7]/20 bg-[#121212]/60">
                <CardContent className="pt-6 px-6">
                  <h2 className="text-xl font-semibold mb-4">Vault Configuration</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Vault Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="My Secure Vault"
                          className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B00D7]/50"
                          required
                          minLength={3}
                        />
                        <p className="text-xs text-gray-500">Give your vault a memorable name (min. 3 characters)</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Blockchain</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleBlockchainChange(BlockchainType.ETHEREUM)}
                            className={`px-3 py-2 rounded-md text-center text-sm ${formData.blockchain === BlockchainType.ETHEREUM ? 'bg-[#6B00D7]/30 border-[#6B00D7] text-white' : 'bg-[#1A1A1A] border-[#6B00D7]/20 text-gray-400'} border transition-colors`}
                          >
                            Ethereum
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBlockchainChange(BlockchainType.SOLANA)}
                            className={`px-3 py-2 rounded-md text-center text-sm ${formData.blockchain === BlockchainType.SOLANA ? 'bg-[#6B00D7]/30 border-[#6B00D7] text-white' : 'bg-[#1A1A1A] border-[#6B00D7]/20 text-gray-400'} border transition-colors`}
                          >
                            Solana
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBlockchainChange(BlockchainType.TON)}
                            className={`px-3 py-2 rounded-md text-center text-sm ${formData.blockchain === BlockchainType.TON ? 'bg-[#6B00D7]/30 border-[#6B00D7] text-white' : 'bg-[#1A1A1A] border-[#6B00D7]/20 text-gray-400'} border transition-colors`}
                          >
                            TON
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Select the blockchain for your vault</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">Vault Type</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {CONTRACT_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => handleContractTypeChange(type.id)}
                            className={`p-3 h-full rounded-md text-left flex flex-col border ${formData.contractType === type.id ? 'bg-[#6B00D7]/30 border-[#6B00D7] text-white' : 'bg-[#1A1A1A] border-[#6B00D7]/20 text-gray-400'} transition-colors`}
                          >
                            <span className="font-medium text-sm">{type.name}</span>
                            <span className="text-xs mt-1 opacity-80">{type.description}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Asset Type</label>
                        <select
                          name="assetType"
                          value={formData.assetType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B00D7]/50"
                        >
                          {BLOCKCHAIN_ASSETS[formData.blockchain].map((asset) => (
                            <option key={asset.id} value={asset.id}>
                              {asset.name} ({asset.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium block">Asset Amount</label>
                        <input
                          type="text"
                          name="assetAmount"
                          value={formData.assetAmount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B00D7]/50"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Amount to lock in your vault
                          {formData.assetType && ` (${BLOCKCHAIN_ASSETS[formData.blockchain].find(a => a.id === formData.assetType)?.symbol})`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">Time Lock Period</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
                        {TIME_LOCK_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleTimeLockChange(option.value)}
                            className={`px-3 py-2 rounded-md text-center text-sm ${formData.timeLockPeriod === option.value ? 'bg-[#6B00D7]/30 border-[#6B00D7] text-white' : 'bg-[#1A1A1A] border-[#6B00D7]/20 text-gray-400'} border transition-colors`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Assets will be locked until {formData.unlockDate.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">Description (Optional)</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the purpose of this vault"
                        className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#6B00D7]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B00D7]/50 h-24 resize-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Security Features */}
            {currentStep === 2 && (
              <Card className="border-[#6B00D7]/20 bg-[#121212]/60">
                <CardContent className="pt-6 px-6">
                  <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-[#6B00D7]" />
                          <h3 className="font-medium">Security Score</h3>
                        </div>
                        <div className={`text-lg font-bold ${getSecurityScoreColor()}`}>{
                          securityScore
                        }/100</div>
                      </div>
                      <div className="mt-3 w-full bg-gray-700/30 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${securityScore >= 90 ? 'bg-green-500' : securityScore >= 70 ? 'bg-blue-500' : securityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${securityScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Enhance your vault security by enabling multi-signature and geolocation features.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Multi-Signature Protection</h3>
                          <div className="bg-[#6B00D7]/20 text-[#6B00D7] text-xs rounded-full px-2 py-0.5">
                            +15 points
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.requireMultiSig}
                            onChange={() => setFormData(prev => ({ ...prev, requireMultiSig: !prev.requireMultiSig }))}
                            disabled={formData.contractType === 'multisig'}
                          />
                          <div className="w-11 h-6 bg-[#1A1A1A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B00D7]"></div>
                        </label>
                      </div>
                      
                      {formData.requireMultiSig && (
                        <div className="mb-6">
                          <MultiSignatureConfig
                            blockchain={formData.blockchain}
                            onConfigChange={handleMultiSigConfigChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-6 bg-[#6B00D7]/20" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">Geolocation Protection</h3>
                          <div className="bg-[#6B00D7]/20 text-[#6B00D7] text-xs rounded-full px-2 py-0.5">
                            +10 points
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={formData.enableGeolocation}
                            onChange={() => {
                              const newValue = !formData.enableGeolocation;
                              setFormData(prev => ({
                                ...prev,
                                enableGeolocation: newValue,
                                geoLocation: {
                                  ...prev.geoLocation,
                                  enabled: newValue
                                }
                              }));
                            }}
                            disabled={formData.contractType === 'inheritance'}
                          />
                          <div className="w-11 h-6 bg-[#1A1A1A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6B00D7]"></div>
                        </label>
                      </div>
                      
                      {formData.enableGeolocation && (
                        <div className="mb-6">
                          <GeolocationLockConfig
                            onChange={handleGeoLocationChange}
                            initialValue={formData.geoLocation}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setAdvancedSectionOpen(!advancedSectionOpen)}
                        className="flex items-center text-sm text-[#6B00D7] hover:text-[#8D44E0] transition-colors"
                      >
                        {advancedSectionOpen ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Advanced Security Options
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Advanced Security Options
                          </>
                        )}
                      </button>
                      
                      {advancedSectionOpen && (
                        <div className="mt-4 space-y-4 p-4 bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">Cross-Chain Security</h4>
                              <p className="text-xs text-gray-400 mt-1">Enable protection across multiple blockchains</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-[#6B00D7] mr-2">Coming Soon</span>
                              <div className="relative">
                                <input type="checkbox" disabled className="sr-only peer" />
                                <div className="w-11 h-6 bg-[#1A1A1A]/60 rounded-full peer cursor-not-allowed opacity-50"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">Biometric Verification</h4>
                              <p className="text-xs text-gray-400 mt-1">Require biometric confirmation for access</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-[#6B00D7] mr-2">Coming Soon</span>
                              <div className="relative">
                                <input type="checkbox" disabled className="sr-only peer" />
                                <div className="w-11 h-6 bg-[#1A1A1A]/60 rounded-full peer cursor-not-allowed opacity-50"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium">Zero-Knowledge Proofs</h4>
                              <p className="text-xs text-gray-400 mt-1">Enhanced privacy for vault transactions</p>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-[#6B00D7] mr-2">Coming Soon</span>
                              <div className="relative">
                                <input type="checkbox" disabled className="sr-only peer" />
                                <div className="w-11 h-6 bg-[#1A1A1A]/60 rounded-full peer cursor-not-allowed opacity-50"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Review */}
            {currentStep === 3 && (
              <Card className="border-[#6B00D7]/20 bg-[#121212]/60">
                <CardContent className="pt-6 px-6">
                  <h2 className="text-xl font-semibold mb-4">Review Your Vault</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Vault Configuration</h3>
                          <div className="bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20 p-4 space-y-3">
                            <div>
                              <div className="text-xs text-gray-500">Name</div>
                              <div className="font-medium">{formData.name}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Blockchain</div>
                              <div className="font-medium">{formData.blockchain}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Contract Type</div>
                              <div className="font-medium">
                                {CONTRACT_TYPES.find(t => t.id === formData.contractType)?.name}
                              </div>
                            </div>
                            {formData.description && (
                              <div>
                                <div className="text-xs text-gray-500">Description</div>
                                <div className="text-sm">{formData.description}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Asset Information</h3>
                          <div className="bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20 p-4 space-y-3">
                            <div>
                              <div className="text-xs text-gray-500">Asset</div>
                              <div className="font-medium">
                                {formData.assetAmount} {BLOCKCHAIN_ASSETS[formData.blockchain].find(a => a.id === formData.assetType)?.symbol}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Time Lock</div>
                              <div className="font-medium">
                                {formData.timeLockPeriod} days (until {formData.unlockDate.toLocaleDateString()})
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Security Features</h3>
                          <div className="bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20 p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">Security Score</div>
                              <div className={`font-bold ${getSecurityScoreColor()}`}>{securityScore}/100</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Features Enabled</div>
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                                  Time Lock
                                </span>
                                {formData.requireMultiSig && (
                                  <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                                    Multi-Signature ({formData.threshold} of {formData.signers.length})
                                  </span>
                                )}
                                {formData.enableGeolocation && (
                                  <span className="inline-flex items-center rounded-full bg-[#6B00D7]/10 px-2 py-1 text-xs font-medium text-[#6B00D7]">
                                    Geolocation Lock
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Wallet Connection</h3>
                          <div className="bg-[#1A1A1A] rounded-lg border border-[#6B00D7]/20 p-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">{formData.blockchain} Wallet</div>
                              <div>
                                {isWalletConnected() ? (
                                  <span className="inline-flex items-center rounded-full bg-green-500/20 border border-green-500/30 px-2 py-0.5 text-xs font-medium text-green-500">
                                    <Check className="h-3 w-3 mr-1" /> Connected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 text-xs font-medium text-yellow-500">
                                    Not Connected
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!isWalletConnected() && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-yellow-500 mb-1">Wallet Connection Required</h3>
                            <p className="text-xs text-yellow-400">
                              You need to connect your {formData.blockchain} wallet to proceed with vault creation.
                              This will be prompted in the next step.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: Transaction */}
            {currentStep === 4 && (
              <Card className="border-[#6B00D7]/20 bg-[#121212]/60">
                <CardContent className="pt-6 px-6">
                  <h2 className="text-xl font-semibold mb-4">Create Your Vault</h2>
                  
                  <div className="max-w-xl mx-auto">
                    <VaultTransactionManager
                      config={{
                        blockchain: formData.blockchain,
                        contractType: formData.contractType,
                        vaultName: formData.name,
                        assetType: formData.assetType,
                        assetAmount: formData.assetAmount,
                        timeLockPeriod: formData.timeLockPeriod,
                        requireMultiSig: formData.requireMultiSig,
                        threshold: formData.threshold,
                        signers: formData.signers,
                        geoLock: formData.enableGeolocation,
                        metadata: {
                          description: formData.description,
                          geoLocation: formData.geoLocation,
                        }
                      }}
                      onTransactionComplete={handleTransactionComplete}
                      onError={handleTransactionError}
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && currentStep < 4 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-[#6B00D7]/30 text-[#6B00D7] hover:bg-[#6B00D7]/10"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {currentStep === 1 && (
              <div className="ml-auto">
                <Button
                  onClick={nextStep}
                  disabled={!formData.name || !formData.assetAmount}
                  className="bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="ml-auto">
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                >
                  Review Vault
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="ml-auto">
                <Button
                  onClick={prepareTransaction}
                  disabled={!isFormValid}
                  className="bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Vault
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
            
            {currentStep === 4 && transactionCompleted && (
              <div className="ml-auto">
                <Button
                  onClick={goToVault}
                  className="bg-gradient-to-r from-[#6B00D7]/90 to-[#FF5AF7]/90 hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                >
                  View My Vault
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedVaultCreationPage;
