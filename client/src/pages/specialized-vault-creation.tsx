import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { BlockchainType } from '@/contexts/multi-chain-context';
import { useTon } from '@/contexts/ton-context';
import { useEthereum } from '@/contexts/ethereum-context';
import { useSolana } from '@/contexts/solana-context';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
// Import both type and const from the component
import VaultTypeSelector, { SpecializedVaultType } from '@/components/vault/vault-type-selector';
import { VaultCreationProgress, getDefaultVaultCreationSteps } from '@/components/vault/create-vault-progress';
import { MediaUploader, UploadedMedia } from '@/components/vault/media-uploader';

function SpecializedVaultCreation() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  
  const [step, setStep] = useState<number>(1);
  const [selectedVaultType, setSelectedVaultType] = useState<SpecializedVaultType>(SpecializedVaultType.STANDARD);
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Effect to automatically proceed to next step when a vault type is selected
  useEffect(() => {
    if (selectedVaultType !== SpecializedVaultType.STANDARD && step === 1) {
      // Add a small delay to allow the animation to complete
      const timer = setTimeout(() => {
        setStep(2);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedVaultType, step]);
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [assetAmount, setAssetAmount] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [mediaAttachments, setMediaAttachments] = useState<UploadedMedia[]>([]);
  
  // Quantum-Progressive vault specific state
  const [selectedCryptoAsset, setSelectedCryptoAsset] = useState<string>('BTC');
  const [contractIntegrationType, setContractIntegrationType] = useState<string>('generate');
  const [contractAddress, setContractAddress] = useState<string>('');
  
  // Configuration state specific to vault types
  const [multiSigApprovers, setMultiSigApprovers] = useState<string[]>(['']);
  const [multiSigThreshold, setMultiSigThreshold] = useState<number>(2);
  
  // Geolocation vault state
  const [geolocations, setGeolocations] = useState<string[]>(['']);
  const [boundaryType, setBoundaryType] = useState<'circle' | 'polygon' | 'country'>('circle');
  const [radius, setRadius] = useState<string>('500');
  const [countryCode, setCountryCode] = useState<string>('');
  const [minAccuracy, setMinAccuracy] = useState<string>('100');
  const [requiresRealTimeVerification, setRequiresRealTimeVerification] = useState<boolean>(false);
  const [multiFactorUnlock, setMultiFactorUnlock] = useState<boolean>(false);
  
  // Time lock vault state
  const [scheduleType, setScheduleType] = useState<string>('fixed'); // fixed, periodic, conditional
  
  // Handlers
  const handleBlockchainSelect = (blockchain: BlockchainType) => {
    setSelectedBlockchain(blockchain);
  };
  
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    switch(blockchain) {
      case BlockchainType.TON:
        return Boolean(ton.isConnected && ton.walletInfo?.address);
      case BlockchainType.ETHEREUM:
        return Boolean(ethereum.isConnected);
      case BlockchainType.SOLANA:
        return Boolean(solana.isConnected);
      default:
        return false;
    };
  };
  
  const getWalletAddress = (blockchain: BlockchainType): string => {
    switch(blockchain) {
      case BlockchainType.TON:
        return ton.walletInfo?.address || 'Not connected';
      case BlockchainType.ETHEREUM:
        return ethereum.isConnected ? 'Connected' : 'Not connected';
      case BlockchainType.SOLANA:
        return solana.isConnected ? 'Connected' : 'Not connected';
      default:
        return 'Not connected';
    };
  };
  
  const handleMultiSigAddApprover = () => {
    setMultiSigApprovers([...multiSigApprovers, '']);
  };
  
  const handleMultiSigApproverChange = (index: number, value: string) => {
    const newApprovers = [...multiSigApprovers];
    newApprovers[index] = value;
    setMultiSigApprovers(newApprovers);
  };
  
  const handleAddGeolocation = () => {
    setGeolocations([...geolocations, '']);
  };
  
  const handleGeolocationChange = (index: number, value: string) => {
    const newGeolocations = [...geolocations];
    newGeolocations[index] = value;
    setGeolocations(newGeolocations);
  };
  
  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!selectedVaultType) {
        toast({
          title: "Vault Type Required",
          description: "Please select a vault type to continue",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      if (!vaultName) {
        toast({
          title: "Vault Name Required",
          description: "Please provide a name for your vault",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 3) {
      if (!selectedBlockchain) {
        toast({
          title: "Blockchain Required",
          description: "Please select a blockchain for deployment",
          variant: "destructive",
        });
        return;
      }
      if (!isWalletConnected(selectedBlockchain)) {
        toast({
          title: "Wallet Connection Required",
          description: `Please connect your ${selectedBlockchain} wallet first`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  const handlePreviousStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  const handleCreateVault = async () => {
    setIsLoading(true);
    
    try {
      // Calculate the unlock date based on the current time lock period
      const currentDate = new Date();
      const unlockDateObj = new Date(unlockDate || currentDate);
      if (!unlockDate) {
        // Default to 30 days if no date selected
        unlockDateObj.setDate(currentDate.getDate() + 30);
      }
      
      // Create specialized configuration based on vault type
      const specializedConfig: Record<string, any> = {};
      
      if (selectedVaultType === SpecializedVaultType.MULTI_SIGNATURE) {
        specializedConfig.approvers = multiSigApprovers.filter(approver => approver.trim() !== '');
        specializedConfig.threshold = multiSigThreshold;
      } else if (selectedVaultType === SpecializedVaultType.GEOLOCATION) {
        // Parse the location strings (format "latitude, longitude") into proper coordinates
        const coordinates = geolocations
          .filter(location => location.trim() !== '')
          .map(location => {
            const [latStr, lngStr] = location.split(',').map(s => s.trim());
            const latitude = parseFloat(latStr);
            const longitude = parseFloat(lngStr);
            
            if (isNaN(latitude) || isNaN(longitude)) {
              throw new Error(`Invalid coordinates: ${location}. Format should be "latitude, longitude"`);
            }
            
            return { latitude, longitude };
          });
          
        if (coordinates.length === 0) {
          throw new Error('At least one valid location coordinate is required');
        }
        
        // Instead of just setting safeZones, create a proper geo vault object
        const geoVaultData = {
          name: vaultName,
          description: vaultDescription,
          boundaryType: boundaryType,
          coordinates: coordinates,
          radius: boundaryType === 'circle' ? parseInt(radius) : undefined,
          countryCode: boundaryType === 'country' ? countryCode : undefined,
          minAccuracy: parseInt(minAccuracy) || undefined,
          requiresRealTimeVerification: requiresRealTimeVerification,
          multiFactorUnlock: multiFactorUnlock,
        };
        
        // Store this data - we'll need to make a separate API call
        specializedConfig.geoVault = geoVaultData;
      } else if (selectedVaultType === SpecializedVaultType.TIME_LOCK) {
        specializedConfig.scheduleType = scheduleType;
        specializedConfig.unlockDate = unlockDateObj.toISOString();
      } else if (selectedVaultType === SpecializedVaultType.BIOMETRIC) {
        specializedConfig.biometricRequired = true;
      } else if (selectedVaultType === SpecializedVaultType.UNIQUE) {
        specializedConfig.multiLayeredSecurity = true;
        specializedConfig.adaptiveAccessControls = true;
        specializedConfig.userControlledPrivacy = true;
      } else if (selectedVaultType === SpecializedVaultType.QUANTUM_RESISTANT) {
        specializedConfig.cryptoAsset = selectedCryptoAsset;
        specializedConfig.contractIntegrationType = contractIntegrationType;
        specializedConfig.contractAddress = contractAddress || '';
        specializedConfig.tripleChainSecurity = contractIntegrationType === 'multi-chain';
        
        // Security level calculation based on asset value
        const assetValue = parseFloat(assetAmount || '0');
        let securityTier = 'standard';
        let quantumAlgorithms = {
          signatures: 'Falcon-512',
          encryption: 'Kyber-512'
        };
        
        // Determine tier based on crypto type and amount
        if (selectedCryptoAsset === 'BTC') {
          const btcValue = assetValue * 102122; // Current BTC price in USD
          if (btcValue >= 1000000) {
            securityTier = 'maximum';
            quantumAlgorithms = { signatures: 'SPHINCS+', encryption: 'FrodoKEM-1344' };
          } else if (btcValue >= 100000) {
            securityTier = 'advanced';
            quantumAlgorithms = { signatures: 'CRYSTALS-Dilithium', encryption: 'Kyber-1024' };
          } else if (btcValue >= 10000) {
            securityTier = 'enhanced';
            quantumAlgorithms = { signatures: 'Falcon-1024', encryption: 'Kyber-768' };
          }
        } else if (selectedCryptoAsset === 'ETH') {
          const ethValue = assetValue * 3481; // Current ETH price in USD
          if (ethValue >= 1000000) {
            securityTier = 'maximum';
            quantumAlgorithms = { signatures: 'SPHINCS+', encryption: 'FrodoKEM-1344' };
          } else if (ethValue >= 100000) {
            securityTier = 'advanced';
            quantumAlgorithms = { signatures: 'CRYSTALS-Dilithium', encryption: 'Kyber-1024' };
          } else if (ethValue >= 10000) {
            securityTier = 'enhanced';
            quantumAlgorithms = { signatures: 'Falcon-1024', encryption: 'Kyber-768' };
          }
        } else if (selectedCryptoAsset === 'SOL' || selectedCryptoAsset === 'TON' || selectedCryptoAsset === 'HYBRID') {
          // Calculate for other assets
          const solValue = selectedCryptoAsset === 'SOL' ? assetValue * 168 : 0;
          const tonValue = selectedCryptoAsset === 'TON' ? assetValue * 7.24 : 0;
          // For hybrid, assume a flat higher security level
          const hybridValue = selectedCryptoAsset === 'HYBRID' ? 100000 : 0;
          
          const totalValue = solValue + tonValue + hybridValue;
          
          if (totalValue >= 1000000) {
            securityTier = 'maximum';
            quantumAlgorithms = { signatures: 'SPHINCS+', encryption: 'FrodoKEM-1344' };
          } else if (totalValue >= 100000) {
            securityTier = 'advanced';
            quantumAlgorithms = { signatures: 'CRYSTALS-Dilithium', encryption: 'Kyber-1024' };
          } else if (totalValue >= 10000) {
            securityTier = 'enhanced';
            quantumAlgorithms = { signatures: 'Falcon-1024', encryption: 'Kyber-768' };
          }
        }
        
        specializedConfig.securityTier = securityTier;
        specializedConfig.quantumAlgorithms = quantumAlgorithms;
        specializedConfig.zeroKnowledgeProofs = securityTier === 'advanced' || securityTier === 'maximum';
      }
      
      // Create blockchain-specific configuration
      const blockchainConfig: Record<string, string> = {};
      if (selectedBlockchain === BlockchainType.TON) {
        blockchainConfig.tonContractAddress = ton.walletInfo?.address || '';
      } else if (selectedBlockchain === BlockchainType.ETHEREUM) {
        blockchainConfig.ethereumContractAddress = ethereum.isConnected ? 'pending-deployment' : '';
      } else if (selectedBlockchain === BlockchainType.SOLANA) {
        blockchainConfig.solanaContractAddress = solana.isConnected ? 'pending-deployment' : '';
      }
      
      // Calculate asset value for security level determination
      let calculatedAssetValueUSD = 0;
      let securityLevelValue = 5; // Default maximum security
      
      if (selectedVaultType === SpecializedVaultType.QUANTUM_RESISTANT) {
        const assetValue = parseFloat(assetAmount || '0');
        
        // Calculate USD value based on asset type
        if (selectedCryptoAsset === 'BTC') {
          calculatedAssetValueUSD = assetValue * 102122;
        } else if (selectedCryptoAsset === 'ETH') {
          calculatedAssetValueUSD = assetValue * 3481;
        } else if (selectedCryptoAsset === 'SOL') {
          calculatedAssetValueUSD = assetValue * 168;
        } else if (selectedCryptoAsset === 'TON') {
          calculatedAssetValueUSD = assetValue * 7.24;
        } else if (selectedCryptoAsset === 'HYBRID') {
          calculatedAssetValueUSD = assetValue * 250;
        }
        
        // Assign security level based on value
        if (calculatedAssetValueUSD >= 1000000) {
          securityLevelValue = 5; // Maximum
        } else if (calculatedAssetValueUSD >= 100000) {
          securityLevelValue = 4; // Advanced
        } else if (calculatedAssetValueUSD >= 10000) {
          securityLevelValue = 3; // Enhanced
        } else {
          securityLevelValue = 2; // Standard
        }
      }
      
      // Create vault data for API call
      const vaultData = {
        userId: 1, // This should be the actual user ID from auth
        name: vaultName,
        description: vaultDescription,
        vaultType: selectedVaultType,
        assetType: selectedBlockchain,
        assetAmount: assetAmount || '0',
        assetValueUSD: calculatedAssetValueUSD.toString(),
        timeLockPeriod: 30, // Default to 30 days
        unlockDate: unlockDateObj.toISOString(),
        metadata: JSON.stringify({
          specializedType: selectedVaultType,
          configuration: specializedConfig,
          blockchain: selectedBlockchain,
          assetValueUSD: calculatedAssetValueUSD,
          calculatedAt: new Date().toISOString()
        }),
        ...blockchainConfig,
        securityLevel: securityLevelValue,
        crossChainEnabled: selectedVaultType === SpecializedVaultType.CROSS_CHAIN || contractIntegrationType === 'multi-chain',
        privacyEnabled: true
      };
      
      // First create the main vault
      const response = await apiRequest('POST', '/api/vaults', vaultData);
      const createdVault = await response.json();
      
      // If this is a geolocation vault, we need to create the geo vault separately
      if (selectedVaultType === SpecializedVaultType.GEOLOCATION && specializedConfig.geoVault) {
        try {
          // Get the geo vault data
          const geoVaultData = specializedConfig.geoVault;
          
          // Add the vault ID from the main vault to link them
          const geoVaultWithLinks = {
            ...geoVaultData,
            // This ensures we associate the geo vault with the main vault
            metadata: JSON.stringify({
              mainVaultId: createdVault.id,
              mainVaultType: selectedVaultType,
              blockchain: selectedBlockchain
            })
          };
          
          // Create the geo vault using the dedicated API
          const geoResponse = await apiRequest('POST', '/api/geo-vaults', geoVaultWithLinks);
          const createdGeoVault = await geoResponse.json();
          
          // Store the geo vault ID in the main vault metadata for reference
          if (createdGeoVault?.id) {
            // Update the main vault with the geo vault ID
            await apiRequest('PATCH', `/api/vaults/${createdVault.id}`, {
              metadata: JSON.stringify({
                ...JSON.parse(vaultData.metadata),
                geoVaultId: createdGeoVault.id
              })
            });
          }
        } catch (geoError: any) {
          // If the geo vault creation fails, let's still consider the main vault as created
          // but add a warning to the success message
          console.error('Error creating geo vault:', geoError);
          toast({
            title: "Warning",
            description: `Vault created but geolocation features could not be set up: ${geoError.message}`,
            variant: "destructive",
          });
        }
      }
      
      // Create a more detailed success message for quantum-resistant vaults
      let successMessage = `Your ${selectedVaultType.replace('-', ' ')} vault has been created on ${selectedBlockchain}`;
      
      if (selectedVaultType === SpecializedVaultType.QUANTUM_RESISTANT) {
        // Add security tier information to the message
        let securityTierName = "Standard Protection";
        
        if (calculatedAssetValueUSD >= 1000000) {
          securityTierName = "Maximum Protection";
        } else if (calculatedAssetValueUSD >= 100000) {
          securityTierName = "Advanced Protection";
        } else if (calculatedAssetValueUSD >= 10000) {
          securityTierName = "Enhanced Protection";
        }
        
        // Asset-specific information
        const cryptoInfo: Record<string, string> = {
          BTC: "Bitcoin",
          ETH: "Ethereum",
          SOL: "Solana",
          TON: "TON",
          HYBRID: "Multi-Chain"
        };
        
        // Use type assertion to fix the TypeScript error
        const assetName = cryptoInfo[selectedCryptoAsset as keyof typeof cryptoInfo] || selectedCryptoAsset;
        successMessage = `Your Quantum-Progressive vault has been created with ${assetName} asset protection. Security tier: ${securityTierName}.`;
      } else if (selectedVaultType === SpecializedVaultType.GEOLOCATION) {
        successMessage = `Your Geolocation vault has been created with ${boundaryType} boundary. Be sure to verify your location to access vault assets.`;
      }
      
      toast({
        title: "Vault Created Successfully",
        description: successMessage,
      });
      
      navigate('/my-vaults');
    } catch (error: any) {
      toast({
        title: "Error Creating Vault",
        description: error.message || "There was an error creating your vault",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Specialized config for different vault types
  const renderSpecializedConfig = () => {
    switch (selectedVaultType) {
      case SpecializedVaultType.MULTI_SIGNATURE:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#FF5AF7]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#FF5AF7] font-medium">Multi-Signature Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Required Approvals</label>
                <Input 
                  type="number" 
                  min="1" 
                  max={multiSigApprovers.length} 
                  value={multiSigThreshold} 
                  onChange={(e) => setMultiSigThreshold(parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Number of approvals required to execute transactions</p>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Approvers</label>
                {multiSigApprovers.map((approver, index) => (
                  <div key={index} className="flex mb-2">
                    <Input
                      value={approver}
                      onChange={(e) => handleMultiSigApproverChange(index, e.target.value)}
                      placeholder="Wallet address"
                      className="bg-gray-800 border-gray-700 mr-2"
                    />
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleMultiSigAddApprover}
                  className="w-full mt-2 border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10 text-[#FF5AF7]"
                >
                  Add Approver
                </Button>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.GEOLOCATION:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#00D74B]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#00D74B] font-medium">Geolocation Configuration</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-4">
                  <label className="text-sm text-gray-300 mb-1 block">Boundary Type</label>
                  <select 
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    value={boundaryType}
                    onChange={(e) => setBoundaryType(e.target.value as 'circle' | 'polygon' | 'country')}
                  >
                    <option value="circle">Circle (Radius)</option>
                    <option value="polygon">Polygon (Multiple Points)</option>
                    <option value="country">Country (Geofence)</option>
                  </select>
                </div>
                
                {boundaryType === 'circle' && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-1 block">Radius (meters)</label>
                    <Input
                      type="number"
                      min="100"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="500"
                      className="bg-gray-800 border-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Distance in meters from center point</p>
                  </div>
                )}

                {boundaryType === 'country' && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-300 mb-1 block">Country Code</label>
                    <Input
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      placeholder="US"
                      maxLength={2}
                      className="bg-gray-800 border-gray-700"
                    />
                    <p className="text-xs text-gray-500 mt-1">2-letter ISO country code (e.g. US, UK, JP)</p>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="text-sm text-gray-300 mb-1 block">Minimum GPS Accuracy (meters)</label>
                  <Input
                    type="number"
                    min="10"
                    max="1000"
                    value={minAccuracy}
                    onChange={(e) => setMinAccuracy(e.target.value)}
                    placeholder="100"
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower values require more precise location</p>
                </div>

                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requiresRealTimeVerification}
                      onChange={(e) => setRequiresRealTimeVerification(e.target.checked)}
                      className="w-4 h-4 bg-gray-800 rounded border-gray-700"
                    />
                    <span className="text-sm text-gray-300">Require Real-Time Verification</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">User must verify location in real-time to access vault</p>
                </div>

                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={multiFactorUnlock}
                      onChange={(e) => setMultiFactorUnlock(e.target.checked)}
                      className="w-4 h-4 bg-gray-800 rounded border-gray-700"
                    />
                    <span className="text-sm text-gray-300">Multi-Factor Unlock</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">Require additional authentication after location verification</p>
                </div>

                <label className="text-sm text-gray-300 mb-1 block mt-4">{boundaryType === 'circle' ? 'Center Point' : 'Boundary Points'}</label>
                {geolocations.map((location, index) => (
                  <div key={index} className="flex mb-2">
                    <Input
                      value={location}
                      onChange={(e) => handleGeolocationChange(index, e.target.value)}
                      placeholder="Latitude, Longitude"
                      className="bg-gray-800 border-gray-700 mr-2"
                    />
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => {
                          const newLocations = [...geolocations];
                          newLocations.splice(index, 1);
                          setGeolocations(newLocations);
                        }}
                        className="px-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddGeolocation}
                  className="w-full mt-2 border-[#00D74B]/30 hover:bg-[#00D74B]/10 text-[#00D74B]"
                >
                  Add Location
                </Button>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.TIME_LOCK:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#D76B00]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#D76B00] font-medium">Advanced Time-Lock Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Schedule Type</label>
                <select 
                  value={scheduleType} 
                  onChange={(e) => setScheduleType(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                >
                  <option value="fixed">Fixed Date</option>
                  <option value="periodic">Periodic Release</option>
                  <option value="conditional">Conditional Release</option>
                </select>
              </div>
              
              {scheduleType === 'fixed' && (
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Unlock Date</label>
                  <Input 
                    type="date" 
                    value={unlockDate} 
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              )}
              
              {scheduleType === 'periodic' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">Interval</label>
                    <Input 
                      type="number" 
                      placeholder="Interval"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-1 block">Unit</label>
                    <select className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white">
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              )}
              
              {scheduleType === 'conditional' && (
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Release Condition</label>
                  <select className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white">
                    <option value="price">Price Threshold</option>
                    <option value="event">Blockchain Event</option>
                    <option value="voting">Community Voting</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        );
        
      case SpecializedVaultType.BIOMETRIC:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#00D7C3]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#00D7C3] font-medium">Biometric Verification Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#00D7C3]/20 p-3 rounded-full mr-3">
                    <i className="ri-fingerprint-line text-[#00D7C3] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Biometric Setup Required</h4>
                    <p className="text-xs text-gray-400">Biometric verification will be configured during the final setup stage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case SpecializedVaultType.MEMORY_VAULT:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#9d03fc]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#9d03fc] font-medium">Memory Vault Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#9d03fc]/20 p-3 rounded-full mr-3">
                    <i className="ri-image-line text-[#9d03fc] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Multimedia Time Capsule</h4>
                    <p className="text-xs text-gray-400">Store photos, videos, and messages in a secure time-locked vault</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#9d03fc]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#9d03fc] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Photo & Video Storage</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#9d03fc]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#9d03fc] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Encrypted Message Attachments</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#9d03fc]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#9d03fc] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Time-Locked Reveal Effect</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#9d03fc]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#9d03fc] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Optional Countdown Display</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.UNIQUE:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#fca103]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#fca103] font-medium">Unique Security Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#fca103]/20 p-3 rounded-full mr-3">
                    <i className="ri-shield-lock-line text-[#fca103] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Advanced Security Features</h4>
                    <p className="text-xs text-gray-400">This vault utilizes multiple layers of security protection</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#fca103]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#fca103] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Multi-Layered Security</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#fca103]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#fca103] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Adaptive Access Controls</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#fca103]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#fca103] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">User-Controlled Privacy</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.QUANTUM_RESISTANT:
        return (
          <div className="space-y-6 mt-6 p-4 border border-[#00B8FF]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#00B8FF] font-medium">Quantum-Progressive Vault Configuration</h3>
            
            {/* Crypto Asset Selection */}
            <div className="space-y-4">
              <h4 className="text-white text-sm font-medium mb-2">1. Cryptocurrency Selection</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  className={`p-3 rounded-lg border border-[#00B8FF]/30 cursor-pointer hover:bg-[#00B8FF]/10 transition-colors ${selectedCryptoAsset === 'BTC' ? 'bg-[#00B8FF]/20' : 'bg-black/30'}`}
                  onClick={() => setSelectedCryptoAsset('BTC')}
                >
                  <div className="flex items-center">
                    <div className="bg-[#F7931A]/20 p-2 rounded-full mr-2">
                      <i className="ri-bitcoin-fill text-[#F7931A] text-lg"></i>
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-sm">Bitcoin (BTC)</h5>
                      <p className="text-gray-400 text-xs">First & largest cryptocurrency</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border border-[#00B8FF]/30 cursor-pointer hover:bg-[#00B8FF]/10 transition-colors ${selectedCryptoAsset === 'ETH' ? 'bg-[#00B8FF]/20' : 'bg-black/30'}`}
                  onClick={() => setSelectedCryptoAsset('ETH')}
                >
                  <div className="flex items-center">
                    <div className="bg-[#627EEA]/20 p-2 rounded-full mr-2">
                      <i className="ri-ethereum-fill text-[#627EEA] text-lg"></i>
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-sm">Ethereum (ETH)</h5>
                      <p className="text-gray-400 text-xs">Smart contract platform</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border border-[#00B8FF]/30 cursor-pointer hover:bg-[#00B8FF]/10 transition-colors ${selectedCryptoAsset === 'SOL' ? 'bg-[#00B8FF]/20' : 'bg-black/30'}`}
                  onClick={() => setSelectedCryptoAsset('SOL')}
                >
                  <div className="flex items-center">
                    <div className="bg-[#14F195]/20 p-2 rounded-full mr-2">
                      <i className="ri-coin-fill text-[#14F195] text-lg"></i>
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-sm">Solana (SOL)</h5>
                      <p className="text-gray-400 text-xs">High-speed blockchain</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border border-[#00B8FF]/30 cursor-pointer hover:bg-[#00B8FF]/10 transition-colors ${selectedCryptoAsset === 'TON' ? 'bg-[#00B8FF]/20' : 'bg-black/30'}`}
                  onClick={() => setSelectedCryptoAsset('TON')}
                >
                  <div className="flex items-center">
                    <div className="bg-[#0098EA]/20 p-2 rounded-full mr-2">
                      <i className="ri-flashlight-fill text-[#0098EA] text-lg"></i>
                    </div>
                    <div>
                      <h5 className="text-white font-medium text-sm">TON</h5>
                      <p className="text-gray-400 text-xs">Fast & scalable blockchain</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hybrid Option */}
              <div 
                className={`p-3 rounded-lg border border-[#00B8FF]/30 cursor-pointer hover:bg-[#00B8FF]/10 transition-colors ${selectedCryptoAsset === 'HYBRID' ? 'bg-[#00B8FF]/20' : 'bg-black/30'}`}
                onClick={() => setSelectedCryptoAsset('HYBRID')}
              >
                <div className="flex items-center">
                  <div className="bg-[#FF5AF7]/20 p-2 rounded-full mr-2">
                    <i className="ri-coin-line text-[#FF5AF7] text-lg"></i>
                  </div>
                  <div>
                    <h5 className="text-white font-medium text-sm">Hybrid Multi-Asset</h5>
                    <p className="text-gray-400 text-xs">Store multiple cryptocurrencies in one vault with cross-chain security</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Asset Amount Input */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">2. Asset Amount</h4>
              <div className="flex items-center space-x-3">
                <Input
                  type="number"
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
                  placeholder="Amount"
                  className="bg-black/30 border-[#00B8FF]/30 text-white"
                />
                <div className="text-lg font-medium text-white">{selectedCryptoAsset}</div>
              </div>
              {selectedCryptoAsset === 'BTC' && (
                <p className="text-xs text-gray-400">Value: ~${(parseFloat(assetAmount || '0') * 102122).toLocaleString()} USD</p>
              )}
              {selectedCryptoAsset === 'ETH' && (
                <p className="text-xs text-gray-400">Value: ~${(parseFloat(assetAmount || '0') * 3481).toLocaleString()} USD</p>
              )}
              {selectedCryptoAsset === 'SOL' && (
                <p className="text-xs text-gray-400">Value: ~${(parseFloat(assetAmount || '0') * 168).toLocaleString()} USD</p>
              )}
              {selectedCryptoAsset === 'TON' && (
                <p className="text-xs text-gray-400">Value: ~${(parseFloat(assetAmount || '0') * 7.24).toLocaleString()} USD</p>
              )}
            </div>
            
            {/* Smart Contract Integration */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">3. Smart Contract Integration</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Integration Type</label>
                  <select 
                    className="w-full p-2 rounded-md bg-black/30 border border-[#00B8FF]/30 text-white text-sm"
                    value={contractIntegrationType}
                    onChange={(e) => setContractIntegrationType(e.target.value)}
                  >
                    <option value="generate">Generate New Contract</option>
                    <option value="existing">Use Existing Contract</option>
                    <option value="multi-chain">Multi-Chain Verification</option>
                  </select>
                </div>
                
                {contractIntegrationType === 'existing' && (
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Contract Address</label>
                    <Input
                      placeholder="Enter smart contract address"
                      className="bg-black/30 border-[#00B8FF]/30 text-white"
                      onChange={(e) => setContractAddress(e.target.value)}
                      value={contractAddress}
                    />
                  </div>
                )}
                
                {contractIntegrationType === 'multi-chain' && (
                  <div className="p-3 bg-black/20 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-[#FF5AF7]/20 p-2 rounded-full mr-2 flex-shrink-0 mt-1">
                        <i className="ri-shield-check-line text-[#FF5AF7] text-sm"></i>
                      </div>
                      <div>
                        <h5 className="text-white text-xs font-medium">Triple-Chain Security</h5>
                        <p className="text-gray-400 text-xs mt-1">Your assets will be secured by all three blockchains with cross-verification:</p>
                        <ul className="text-gray-400 text-xs mt-1 space-y-1 ml-3">
                          <li>• Ethereum: Ownership verification</li>
                          <li>• Solana: High-frequency monitoring</li>
                          <li>• TON: Recovery operations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Security Tier Display based on current value */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">4. Security Tier</h4>
              <div className="p-3 rounded-lg bg-black/30 border border-[#00B8FF]/20">
                {(() => {
                  // Calculate USD value based on crypto selection and amount
                  const amount = parseFloat(assetAmount || '0');
                  if (isNaN(amount)) return null;
                  
                  let usdValue = 0;
                  if (selectedCryptoAsset === 'BTC') {
                    usdValue = amount * 102122;
                  } else if (selectedCryptoAsset === 'ETH') {
                    usdValue = amount * 3481;
                  } else if (selectedCryptoAsset === 'SOL') {
                    usdValue = amount * 168;
                  } else if (selectedCryptoAsset === 'TON') {
                    usdValue = amount * 7.24;
                  } else if (selectedCryptoAsset === 'HYBRID') {
                    usdValue = amount * 250;
                  }
                  
                  // Determine security tier
                  let tierName, progress, signatureAlgo, encryptionAlgo, zkp;
                  
                  if (usdValue >= 1000000) {
                    tierName = "Maximum Security";
                    progress = 100;
                    signatureAlgo = "SPHINCS+";
                    encryptionAlgo = "FrodoKEM-1344";
                    zkp = true;
                  } else if (usdValue >= 100000) {
                    tierName = "Advanced Security";
                    progress = 75;
                    signatureAlgo = "CRYSTALS-Dilithium";
                    encryptionAlgo = "Kyber-1024";
                    zkp = true;
                  } else if (usdValue >= 10000) {
                    tierName = "Enhanced Security";
                    progress = 50;
                    signatureAlgo = "Falcon-1024";
                    encryptionAlgo = "Kyber-768";
                    zkp = false;
                  } else {
                    tierName = "Standard Security";
                    progress = 25;
                    signatureAlgo = "Falcon-512";
                    encryptionAlgo = "Kyber-512";
                    zkp = false;
                  }
                  
                  return (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-[#00B8FF] font-medium text-sm">{tierName}</h5>
                        <span className="text-gray-400 text-xs">${usdValue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00B8FF] to-[#00D7FF]" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="flex items-center">
                          <i className="ri-lock-line text-[#00B8FF] mr-1"></i>
                          <span className="text-gray-400">Signatures: </span>
                          <span className="text-white ml-1">{signatureAlgo}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-shield-keyhole-line text-[#00B8FF] mr-1"></i>
                          <span className="text-gray-400">Encryption: </span>
                          <span className="text-white ml-1">{encryptionAlgo}</span>
                        </div>
                        <div className="flex items-center col-span-2 mt-1">
                          <i className="ri-eye-off-line text-[#00B8FF] mr-1"></i>
                          <span className="text-gray-400">Zero-Knowledge Proofs: </span>
                          <span className="text-white ml-1">{zkp ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Security Features */}
            <div className="space-y-3">
              <h4 className="text-white text-sm font-medium">5. Advanced Quantum Security</h4>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#00B8FF]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#00B8FF] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Post-Quantum Cryptography</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#00B8FF]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#00B8FF] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Value-Based Security Scaling</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#00B8FF]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#00B8FF] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Lattice-Based Encryption</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case SpecializedVaultType.COMPOSITE_VAULT:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#0097b2]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#0097b2] font-medium">Composite Vault Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#0097b2]/20 p-3 rounded-full mr-3">
                    <i className="ri-folders-line text-[#0097b2] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Multi-Asset Protection</h4>
                    <p className="text-xs text-gray-400">Store multiple assets with different unlock conditions in a single vault</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#0097b2]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#0097b2] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Multiple Asset Support</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#0097b2]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#0097b2] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Conditional Access Logic</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#0097b2]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#0097b2] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Phased Release Schedule</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.GEO_TEMPORAL:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#ff3e00]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#ff3e00] font-medium">Geo-Temporal Vault Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#ff3e00]/20 p-3 rounded-full mr-3">
                    <i className="ri-map-pin-time-line text-[#ff3e00] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Location + Time Lock</h4>
                    <p className="text-xs text-gray-400">Secure assets that can only be accessed at specific locations and times</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#ff3e00]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#ff3e00] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">GPS Verification</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#ff3e00]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#ff3e00] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Time-Based Unlock</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#ff3e00]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#ff3e00] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Dual-Factor Security</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case SpecializedVaultType.DIAMOND_HANDS:
        return (
          <div className="space-y-4 mt-6 p-4 border border-[#f7931a]/30 rounded-lg bg-gray-900/50">
            <h3 className="text-[#f7931a] font-medium">Diamond Hands Vault Configuration</h3>
            <div className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-[#f7931a]/20 p-3 rounded-full mr-3">
                    <i className="ri-bit-coin-line text-[#f7931a] text-xl"></i>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Bitcoin HODLing Vault</h4>
                    <p className="text-xs text-gray-400">Lock Bitcoin until next halving with enhanced security measures</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#f7931a]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#f7931a] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Multi-Signature Security (2-of-3)</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#f7931a]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#f7931a] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Halving-Synchronized Unlock</span>
                </div>
                <div className="flex items-center p-2 bg-black/20 rounded-md">
                  <div className="h-4 w-4 bg-[#f7931a]/20 flex items-center justify-center rounded mr-2">
                    <i className="ri-check-line text-[#f7931a] text-xs"></i>
                  </div>
                  <span className="text-sm text-gray-300">Emergency Recovery Options</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      // Add more specialized configurations as needed
        
      default:
        return null;
    }
  };
  
  // Helper function to map numeric steps to step IDs for the progress component
  const getStepId = (stepNumber: number): string => {
    switch(stepNumber) {
      case 1: return "wallet";
      case 2: return "details";
      case 3: return "security";
      case 4: return "assets";
      case 5: return "review";
      default: return "details";
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1: // Vault Type Selection
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Select Vault Type</h2>
              <p className="text-gray-400 mb-6">Choose the specialized vault type that best suits your needs and security requirements.</p>
            </div>
            
            <VaultTypeSelector 
              selectedType={selectedVaultType} 
              onChange={(type) => {
                setSelectedVaultType(type);
                // Move to next step after selection with a small delay
                setTimeout(() => setStep(2), 300);
              }}
            />
          </div>
        );
        
      case 2: // Basic Vault Information
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Basic Vault Information</h2>
              <p className="text-gray-400 mb-6">Provide essential details for your {selectedVaultType.replace('-', ' ')} vault.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Vault Name</label>
                <Input 
                  value={vaultName} 
                  onChange={(e) => setVaultName(e.target.value)}
                  placeholder="My Secure Vault"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Description</label>
                <Textarea 
                  value={vaultDescription} 
                  onChange={(e) => setVaultDescription(e.target.value)}
                  placeholder="Describe the purpose of this vault"
                  className="bg-gray-800 border-gray-700 resize-none h-24"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Asset Amount</label>
                <Input 
                  type="text" 
                  value={assetAmount} 
                  onChange={(e) => setAssetAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              {renderSpecializedConfig()}
            </div>
          </div>
        );
        
      case 3: // Blockchain Selection
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Blockchain Selection</h2>
              <p className="text-gray-400 mb-6">Select the blockchain network where your vault will be deployed.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedBlockchain === BlockchainType.TON ? 'border-2 border-[#0088CC] shadow-lg' : 'border border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.TON)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#0088CC] text-4xl mb-3">💎</div>
                    <h3 className="font-medium text-white mb-1">TON Blockchain</h3>
                    <p className="text-xs text-gray-400 mb-3">Fast, secure blockchain with high throughput</p>
                    
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs ${isWalletConnected(BlockchainType.TON) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.TON) ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedBlockchain === BlockchainType.ETHEREUM ? 'border-2 border-[#627EEA] shadow-lg' : 'border border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.ETHEREUM)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#627EEA] text-4xl mb-3">Ξ</div>
                    <h3 className="font-medium text-white mb-1">Ethereum</h3>
                    <p className="text-xs text-gray-400 mb-3">Established blockchain with smart contracts</p>
                    
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs ${isWalletConnected(BlockchainType.ETHEREUM) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.ETHEREUM) ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${selectedBlockchain === BlockchainType.SOLANA ? 'border-2 border-[#9945FF] shadow-lg' : 'border border-gray-700'}`}
                onClick={() => handleBlockchainSelect(BlockchainType.SOLANA)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="text-[#9945FF] text-4xl mb-3">◎</div>
                    <h3 className="font-medium text-white mb-1">Solana</h3>
                    <p className="text-xs text-gray-400 mb-3">High-performance blockchain with low fees</p>
                    
                    <div className={`mt-3 px-3 py-1 rounded-full text-xs ${isWalletConnected(BlockchainType.SOLANA) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.SOLANA) ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {selectedBlockchain && (
              <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <h3 className="font-medium text-white mb-3">Connected Wallet</h3>
                <div className="bg-black/20 p-2 rounded font-mono text-xs break-all">
                  {getWalletAddress(selectedBlockchain)}
                </div>
                {!isWalletConnected(selectedBlockchain) && (
                  <div className="mt-3">
                    <Button 
                      variant="outline"
                      onClick={() => toast({
                        title: "Connect Wallet",
                        description: `Please connect your ${selectedBlockchain} wallet using the Connect button in the top navbar`,
                      })}
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
        
      case 4: // Review & Create
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Review & Create Vault</h2>
              <p className="text-gray-400 mb-6">Review your vault details before finalizing creation.</p>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] p-3 rounded-full">
                  <i className="ri-safe-2-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{vaultName || 'Unnamed Vault'}</h3>
                  <p className="text-sm text-gray-400">{selectedVaultType.replace('-', ' ')} on {selectedBlockchain}</p>
                </div>
              </div>
              
              <Separator className="my-4 bg-gray-700" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Vault Details</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Vault Type</div>
                      <div className="text-white">{selectedVaultType.replace('-', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Description</div>
                      <div className="text-white text-sm">{vaultDescription || 'No description provided'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Asset Amount</div>
                      <div className="text-white">{assetAmount || '0.00'}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Deployment Details</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-500">Blockchain</div>
                      <div className="text-white">{selectedBlockchain}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Wallet Address</div>
                      <div className="text-white text-xs font-mono truncate">{getWalletAddress(selectedBlockchain)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Security Level</div>
                      <div className="text-white">Maximum</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedVaultType === SpecializedVaultType.MULTI_SIGNATURE && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Multi-Signature Configuration</h4>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-white text-sm mb-1">Required Approvals: {multiSigThreshold}</div>
                    <div className="text-xs text-gray-500 mb-2">Approvers:</div>
                    <ul className="space-y-1">
                      {multiSigApprovers.map((approver, index) => (
                        <li key={index} className="text-gray-400 text-xs font-mono">{approver || `Approver ${index + 1}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {selectedVaultType === SpecializedVaultType.GEOLOCATION && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Geolocation Configuration</h4>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-xs text-gray-500 mb-2">Safe Zones:</div>
                    <ul className="space-y-1">
                      {geolocations.map((location, index) => (
                        <li key={index} className="text-gray-400 text-xs">{location || `Location ${index + 1}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {selectedVaultType === SpecializedVaultType.TIME_LOCK && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Time-Lock Configuration</h4>
                  <div className="bg-black/20 p-3 rounded">
                    <div className="text-white text-sm mb-1">Schedule Type: {scheduleType}</div>
                    {scheduleType === 'fixed' && (
                      <div className="text-gray-400 text-xs">Unlock Date: {unlockDate || 'Not specified'}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Create Specialized Vault
        </h1>
        <p className="text-gray-400 mt-2">
          Create advanced vaults with specialized features for enhanced security and functionality.
        </p>
      </div>
      
      <div className="bg-[#121212] rounded-lg border border-gray-800 p-6">
        {/* Standardized Progress Indicator */}
        <div className="mb-6">
          <VaultCreationProgress 
            steps={getDefaultVaultCreationSteps(getStepId(step))}
            currentStepId={getStepId(step)}
            variant="horizontal"
          />
        </div>
        
        <div className="min-h-[500px]">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
          {step > 1 ? (
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              className="border-gray-700 hover:bg-gray-800"
            >
              Previous
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
          )}
          
          {step < 4 ? (
            <Button 
              onClick={handleNextStep}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleCreateVault}
              disabled={isLoading}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Creating...
                </>
              ) : (
                'Create Vault'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// This is a wrapper component to handle any Replit metadata props
function SpecializedVaultCreationPage() {
  return (
    <div className="specialized-vault-creation-wrapper">
      <SpecializedVaultCreation />
    </div>
  );
}

export default SpecializedVaultCreationPage;
