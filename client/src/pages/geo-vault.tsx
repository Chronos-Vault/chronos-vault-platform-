import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Shield, MapPin, Lock, Globe, Map, Radar, Navigation, Clock, Calendar, Landmark, ChevronsRight, Cog } from "lucide-react";
import { useTon } from "@/contexts/ton-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useSolana } from "@/contexts/solana-context";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { VaultCreationProgress, getDefaultVaultCreationSteps } from "@/components/vault/create-vault-progress";

const GeoVaultPage = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const ton = useTon();
  const ethereum = useEthereum();
  const solana = useSolana();
  
  const [step, setStep] = useState<number>(1);
  const [vaultName, setVaultName] = useState<string>("");
  const [vaultDescription, setVaultDescription] = useState<string>("");
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainType>(BlockchainType.TON);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Geolocation specific state
  const [boundaryType, setBoundaryType] = useState<'circle' | 'polygon' | 'country'>('circle');
  const [locations, setLocations] = useState<Array<{lat: string, lng: string}>>([{lat: '', lng: ''}]);
  const [radius, setRadius] = useState<string>('1000');
  const [countryCode, setCountryCode] = useState<string>('');
  const [minAccuracy, setMinAccuracy] = useState<string>('100');
  const [requiresRealTimeVerification, setRequiresRealTimeVerification] = useState<boolean>(true);
  const [multiFactorUnlock, setMultiFactorUnlock] = useState<boolean>(false);
  const [temporalRestriction, setTemporalRestriction] = useState<boolean>(false);
  const [timeWindow, setTimeWindow] = useState<{start: string, end: string}>({start: '09:00', end: '17:00'});
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [unlockDate, setUnlockDate] = useState<string>('');
  
  // Check URL params for temporal=true (combined geo-temporal vault)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const temporalParam = params.get('temporal');
    if (temporalParam === 'true') {
      setTemporalRestriction(true);
    }
  }, []);
  
  // Add another location coordinate
  const addLocationField = () => {
    setLocations([...locations, {lat: '', lng: ''}]);
  };
  
  // Update location at specific index
  const updateLocation = (index: number, field: 'lat' | 'lng', value: string) => {
    const newLocations = [...locations];
    newLocations[index][field] = value;
    setLocations(newLocations);
  };
  
  // Remove location at index
  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      const newLocations = [...locations];
      newLocations.splice(index, 1);
      setLocations(newLocations);
    }
  };
  
  // Toggle day selection in days of week
  const toggleDay = (day: string) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };
  
  // Handle blockchain selection
  const handleBlockchainSelect = (blockchain: BlockchainType) => {
    setSelectedBlockchain(blockchain);
  };
  
  // Check if wallet is connected for the selected blockchain
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
  
  // Get wallet address for display
  const getWalletAddress = (blockchain: BlockchainType): string => {
    switch(blockchain) {
      case BlockchainType.TON:
        return ton.walletInfo?.address || 'Not connected';
      case BlockchainType.ETHEREUM:
        return ethereum.account || 'Not connected';
      case BlockchainType.SOLANA:
        return solana.publicKey?.toString() || 'Not connected';
      default:
        return 'Not connected';
    };
  };
  
  // Validate current step and proceed to next
  const handleNextStep = () => {
    if (step === 1) {
      if (!vaultName) {
        toast({
          title: "Vault Name Required",
          description: "Please provide a name for your vault",
          variant: "destructive",
        });
        return;
      }
    } else if (step === 2) {
      // Validate location data based on boundary type
      if (boundaryType === 'circle') {
        if (!locations[0].lat || !locations[0].lng || !radius) {
          toast({
            title: "Location Data Required",
            description: "Please provide a center coordinate and radius",
            variant: "destructive",
          });
          return;
        }
      } else if (boundaryType === 'polygon') {
        if (locations.length < 3 || locations.some(loc => !loc.lat || !loc.lng)) {
          toast({
            title: "Location Data Required",
            description: "Please provide at least 3 coordinates for the polygon",
            variant: "destructive",
          });
          return;
        }
      } else if (boundaryType === 'country') {
        if (!countryCode) {
          toast({
            title: "Country Code Required",
            description: "Please provide a country code",
            variant: "destructive",
          });
          return;
        }
      }
      
      if (temporalRestriction) {
        if ((!timeWindow.start || !timeWindow.end) && daysOfWeek.length === 0) {
          toast({
            title: "Temporal Settings Required",
            description: "Please configure time window or days of week",
            variant: "destructive",
          });
          return;
        }
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
  
  // Go back to previous step
  const handlePreviousStep = () => {
    setStep(Math.max(1, step - 1));
  };
  
  // Create the geo vault
  const handleCreateVault = async () => {
    setIsLoading(true);
    
    try {
      // Format locations for API
      const formattedLocations = locations.map(loc => ({
        latitude: parseFloat(loc.lat),
        longitude: parseFloat(loc.lng)
      }));
      
      // Create geo vault configuration
      const geoVaultConfig = {
        name: vaultName,
        description: vaultDescription,
        boundaryType: boundaryType,
        coordinates: formattedLocations,
        radius: boundaryType === 'circle' ? parseInt(radius) : undefined,
        countryCode: boundaryType === 'country' ? countryCode : undefined,
        minAccuracy: parseInt(minAccuracy),
        requiresRealTimeVerification: requiresRealTimeVerification,
        multiFactorUnlock: multiFactorUnlock,
      };
      
      // Add temporal settings if enabled
      const temporalConfig = temporalRestriction ? {
        timeWindow: timeWindow,
        daysOfWeek: daysOfWeek,
        unlockDate: unlockDate || undefined
      } : undefined;
      
      // Create blockchain-specific configuration
      const blockchainConfig = {
        network: selectedBlockchain,
        address: getWalletAddress(selectedBlockchain)
      };
      
      // Combined vault data
      const vaultData = {
        geoVault: geoVaultConfig,
        temporal: temporalConfig,
        blockchain: blockchainConfig,
      };
      
      console.log("Creating geo vault with data:", vaultData);
      
      // Simulate vault creation success for development
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Vault Created Successfully",
          description: `Your ${temporalRestriction ? 'geo-temporal' : 'geolocation'} vault has been deployed to ${selectedBlockchain}`,
        });
        
        // Navigate to my vaults page
        navigate("/my-vaults");
      }, 2000);
      
    } catch (error) {
      console.error("Error creating vault:", error);
      setIsLoading(false);
      toast({
        title: "Error Creating Vault",
        description: "There was an error creating your vault. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Progress steps for vault creation
  const vaultCreationSteps = getDefaultVaultCreationSteps();
  if (temporalRestriction) {
    vaultCreationSteps[1].title = "Location & Time Settings";
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/vault-types")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D74B] to-[#47A0FF] flex items-center justify-center shadow-lg shadow-[#00D74B]/20 mr-4">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00D74B] to-[#47A0FF]">
          {temporalRestriction ? 'Location-Time Restricted Vault' : 'Geolocation Vault'}
        </h1>
      </div>
      
      <p className="text-lg text-gray-300 max-w-3xl mb-8">
        {temporalRestriction 
          ? 'Advanced vault security with both location and time-based restrictions for enhanced asset protection.'
          : 'Advanced vault security with location-based authentication, enabling physical presence requirements for asset access.'}
      </p>

      {/* Progress indicator */}
      <div className="mb-8">
        <VaultCreationProgress 
          steps={vaultCreationSteps} 
          currentStep={step} 
          onStepClick={(stepIndex) => setStep(stepIndex)} 
        />
      </div>
      
      {/* Step 1: Basic Vault Information */}
      {step === 1 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Vault Details</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="vaultName">Vault Name</Label>
                <Input
                  id="vaultName"
                  placeholder="Enter a name for your vault"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="vaultDescription">Description</Label>
                <Textarea
                  id="vaultDescription"
                  placeholder="Describe the purpose of this vault"
                  value={vaultDescription}
                  onChange={(e) => setVaultDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleNextStep}>
                  Continue
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 2: Location Configuration */}
      {step === 2 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">
              {temporalRestriction ? 'Location & Time Settings' : 'Location Settings'}
            </h2>
            
            <div className="space-y-8">
              {/* Boundary Type Selection */}
              <div>
                <Label>Boundary Type</Label>
                <RadioGroup 
                  value={boundaryType} 
                  onValueChange={(value) => setBoundaryType(value as 'circle' | 'polygon' | 'country')}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="circle" id="circle" />
                    <Label htmlFor="circle" className="cursor-pointer">Circle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="polygon" id="polygon" />
                    <Label htmlFor="polygon" className="cursor-pointer">Polygon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="country" id="country" />
                    <Label htmlFor="country" className="cursor-pointer">Country</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Circle Settings */}
              {boundaryType === 'circle' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Center Latitude</Label>
                      <Input
                        id="latitude"
                        placeholder="e.g. 37.7749"
                        value={locations[0].lat}
                        onChange={(e) => updateLocation(0, 'lat', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Center Longitude</Label>
                      <Input
                        id="longitude"
                        placeholder="e.g. -122.4194"
                        value={locations[0].lng}
                        onChange={(e) => updateLocation(0, 'lng', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      min="100"
                      placeholder="Enter radius in meters"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              
              {/* Polygon Settings */}
              {boundaryType === 'polygon' && (
                <div className="space-y-4">
                  <Label>Polygon Coordinates</Label>
                  {locations.map((location, index) => (
                    <div key={index} className="grid grid-cols-11 gap-2 items-end">
                      <div className="col-span-5">
                        <Label htmlFor={`lat-${index}`} className="sr-only">Latitude</Label>
                        <Input
                          id={`lat-${index}`}
                          placeholder="Latitude"
                          value={location.lat}
                          onChange={(e) => updateLocation(index, 'lat', e.target.value)}
                        />
                      </div>
                      <div className="col-span-5">
                        <Label htmlFor={`lng-${index}`} className="sr-only">Longitude</Label>
                        <Input
                          id={`lng-${index}`}
                          placeholder="Longitude"
                          value={location.lng}
                          onChange={(e) => updateLocation(index, 'lng', e.target.value)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => removeLocation(index)}
                          disabled={locations.length <= 1}
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addLocationField}
                    className="mt-2"
                  >
                    Add Coordinate
                  </Button>
                </div>
              )}
              
              {/* Country Settings */}
              {boundaryType === 'country' && (
                <div>
                  <Label htmlFor="countryCode">Country Code (ISO 3166-1 alpha-2)</Label>
                  <Input
                    id="countryCode"
                    placeholder="e.g. US, GB, JP"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    className="mt-1"
                    maxLength={2}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Enter a two-letter country code (e.g., US for United States, GB for United Kingdom)
                  </p>
                </div>
              )}
              
              {/* Advanced Options */}
              <div>
                <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="minAccuracy">Minimum GPS Accuracy (meters)</Label>
                    <Input
                      id="minAccuracy"
                      type="number"
                      min="10"
                      placeholder="Minimum required GPS accuracy"
                      value={minAccuracy}
                      onChange={(e) => setMinAccuracy(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Lower values require more precise location (recommended: 100-200m)
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="realTimeVerification" 
                      checked={requiresRealTimeVerification}
                      onCheckedChange={(checked) => setRequiresRealTimeVerification(checked === true)}
                    />
                    <Label htmlFor="realTimeVerification" className="cursor-pointer">
                      Require real-time location verification
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="multiFactorUnlock" 
                      checked={multiFactorUnlock}
                      onCheckedChange={(checked) => setMultiFactorUnlock(checked === true)}
                    />
                    <Label htmlFor="multiFactorUnlock" className="cursor-pointer">
                      Enable multi-factor authentication with location
                    </Label>
                  </div>
                </div>
              </div>
              
              {/* Temporal Settings */}
              {temporalRestriction && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Time Restrictions</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={timeWindow.start}
                          onChange={(e) => setTimeWindow({...timeWindow, start: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={timeWindow.end}
                          onChange={(e) => setTimeWindow({...timeWindow, end: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Days of Week</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <Button
                            key={day}
                            variant={daysOfWeek.includes(index.toString()) ? "default" : "outline"}
                            className="h-12 p-0"
                            onClick={() => toggleDay(index.toString())}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="unlockDate">Unlock Date (Optional)</Label>
                      <Input
                        id="unlockDate"
                        type="date"
                        value={unlockDate}
                        onChange={(e) => setUnlockDate(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        If set, the vault will only be accessible after this date
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleNextStep}>
                  Continue
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 3: Blockchain Selection */}
      {step === 3 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Select Blockchain</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card 
                  className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.TON ? 'border-[#0098EA]' : 'border-gray-800 hover:border-gray-700'}`}
                  onClick={() => handleBlockchainSelect(BlockchainType.TON)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-[#0098EA]/10 flex items-center justify-center mb-3">
                      <span className="text-2xl text-[#0098EA]">💎</span>
                    </div>
                    <h3 className="font-medium mb-1">TON Network</h3>
                    <p className="text-sm text-gray-400 mb-2">Fast & Low Fees</p>
                    <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.TON) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.TON) ? 'Connected' : 'Connect Wallet'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.ETHEREUM ? 'border-[#62688F]' : 'border-gray-800 hover:border-gray-700'}`}
                  onClick={() => handleBlockchainSelect(BlockchainType.ETHEREUM)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-[#62688F]/10 flex items-center justify-center mb-3">
                      <span className="text-2xl text-[#62688F]">⟠</span>
                    </div>
                    <h3 className="font-medium mb-1">Ethereum</h3>
                    <p className="text-sm text-gray-400 mb-2">Highest Security</p>
                    <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.ETHEREUM) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.ETHEREUM) ? 'Connected' : 'Connect Wallet'}
                    </div>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`border-2 cursor-pointer ${selectedBlockchain === BlockchainType.SOLANA ? 'border-[#9945FF]' : 'border-gray-800 hover:border-gray-700'}`}
                  onClick={() => handleBlockchainSelect(BlockchainType.SOLANA)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-[#9945FF]/10 flex items-center justify-center mb-3">
                      <span className="text-2xl text-[#9945FF]">◎</span>
                    </div>
                    <h3 className="font-medium mb-1">Solana</h3>
                    <p className="text-sm text-gray-400 mb-2">High Speed & Scale</p>
                    <div className={`text-xs px-2 py-1 rounded-full ${isWalletConnected(BlockchainType.SOLANA) ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {isWalletConnected(BlockchainType.SOLANA) ? 'Connected' : 'Connect Wallet'}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Wallet Connection Status */}
              <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-3">Connection Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Selected Blockchain:</span>
                    <span className="font-medium">{selectedBlockchain}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wallet Status:</span>
                    <span className={`${isWalletConnected(selectedBlockchain) ? 'text-green-400' : 'text-yellow-400'}`}>
                      {isWalletConnected(selectedBlockchain) ? 'Connected' : 'Not Connected'}
                    </span>
                  </div>
                  {isWalletConnected(selectedBlockchain) && (
                    <div className="flex justify-between items-center">
                      <span>Address:</span>
                      <span className="font-mono text-sm truncate max-w-[250px]">{getWalletAddress(selectedBlockchain)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Triple-Chain Protection Notice */}
              <div className="bg-[#2A1143] rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                  <h3 className="font-medium">Triple-Chain Protection Enabled</h3>
                </div>
                <p className="text-sm text-gray-300">
                  Your vault will be secured across TON, Ethereum, and Solana for maximum protection, regardless of your primary blockchain selection.
                </p>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button onClick={handleNextStep}>
                  Continue
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Step 4: Review & Create */}
      {step === 4 && (
        <Card className="bg-[#1A1A1A] border-[#333]">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Review & Create Vault</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-3">Vault Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span>{vaultName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span>{temporalRestriction ? 'Geo-Temporal Vault' : 'Geolocation Vault'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Blockchain:</span>
                      <span>{selectedBlockchain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Boundary:</span>
                      <span className="capitalize">{boundaryType}</span>
                    </div>
                    {temporalRestriction && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time Window:</span>
                        <span>{timeWindow.start} - {timeWindow.end}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-[#1c0c31] rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-[#6B00D7] mr-2" />
                    <h3 className="font-medium">Security Features</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#6B00D7] mr-2"></span>
                      <span>Triple-Chain Protection System</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#FF5AF7] mr-2"></span>
                      <span>Zero-Knowledge Location Proofs</span>
                    </li>
                    <li className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-[#00D7C3] mr-2"></span>
                      <span>Real-Time {requiresRealTimeVerification ? 'Verification Required' : 'Verification Optional'}</span>
                    </li>
                    {multiFactorUnlock && (
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#FFD700] mr-2"></span>
                        <span>Multi-Factor Authentication</span>
                      </li>
                    )}
                    {temporalRestriction && (
                      <li className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#47A0FF] mr-2"></span>
                        <span>Time-Based Access Restrictions</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePreviousStep}>
                  Back
                </Button>
                <Button 
                  onClick={handleCreateVault}
                  disabled={isLoading}
                  className="bg-[#6B00D7] hover:bg-[#7900F5] text-white"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Vault...
                    </>
                  ) : (
                    <>
                      Create Vault
                      <ChevronsRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Key Benefits Section - Always shown */}
      <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6 max-w-3xl mt-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Shield className="mr-2 h-5 w-5 text-[#FF5AF7]" /> Key Benefits
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Require physical presence at specific locations to access assets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Privacy-preserving location verification that protects user anonymity</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Customizable geofencing with variable radius and accuracy requirements</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Multi-location support for distributed teams or multi-party access</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
              <span className="text-gray-300">Combines with other security factors for enhanced protection</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Technical Overview Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Technical Overview
        </h2>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">
            The Geo-Location Vault implements a sophisticated location-based authentication system 
            that requires users to be physically present at specific coordinates to access their assets. 
            This creates a powerful additional security layer beyond standard digital authentication.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3 text-white">Key Technologies</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Zero-Knowledge Location Proofs</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Our proprietary zero-knowledge location proof system allows verification of a 
                user's physical location without exposing the actual coordinates to the 
                blockchain or third parties, preserving privacy while ensuring security.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <RadarIcon className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Dynamic Geofencing</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Configurable geofencing allows for definition of geographical boundaries with 
                adjustable precision. Options range from tight radius requirements (10-50 meters)
                to wider areas (1-5 kilometers) depending on security needs.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Multi-Location Authentication</h4>
              </div>
              <p className="text-gray-300 text-sm">
                The vault can be configured to allow access from multiple distinct locations, 
                enabling distributed teams or multi-party access scenarios while maintaining 
                strong security through physical presence requirements.
              </p>
            </div>
            
            <div className="bg-[#242424] border border-[#333] rounded-lg p-5">
              <div className="flex items-center mb-3">
                <Lock className="h-5 w-5 text-[#FF5AF7] mr-3" />
                <h4 className="text-lg font-medium text-white">Tamper-Resistant Verification</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Advanced anti-spoofing measures detect and block common location spoofing 
                techniques. The system uses multi-factor verification including device 
                signals, network characteristics, and environmental data points.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          How It Works
        </h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">1. Location Registration</h3>
            <p className="text-gray-300 mb-4">
              When creating a Geo-Location Vault, the initial setup involves:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Secure registration of one or more authorized locations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Definition of geofence radius and precision requirements</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Configuring additional security parameters and recovery options</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Cryptographic hashing of location data to protect privacy</span>
              </li>
            </ul>
            <p className="text-gray-300">
              Location information is stored as cryptographic commitments rather than raw coordinates, 
              ensuring that the actual locations are never exposed on-chain.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">2. Location Verification Process</h3>
            <p className="text-gray-300 mb-4">
              When a user attempts to access the vault:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The user's device generates a location proof using current GPS coordinates</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>A zero-knowledge proof confirms presence within the authorized geofence</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>The proof is submitted to the blockchain for verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Anti-spoofing verification checks are performed</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Location proof is combined with other authentication factors (if configured)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              The verification happens without exposing the user's actual location, preserving privacy 
              while proving presence within the authorized geofence.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">3. Multi-Location Authentication</h3>
            <p className="text-gray-300 mb-4">
              For vaults with multiple authorized locations:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Each location can have unique access parameters and permissions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Locations can be designated for specific users in multi-party scenarios</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Access logs record which location was used for each authentication</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Time restrictions can be applied to specific locations (e.g., business hours only)</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This flexibility allows for sophisticated access control patterns while maintaining 
              the physical presence requirement.
            </p>
          </div>
          
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">4. Cross-Chain Security Architecture</h3>
            <p className="text-gray-300 mb-4">
              Geo-Location Vaults leverage our Triple-Chain Security™ architecture:
            </p>
            <ul className="space-y-2 text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Ethereum manages ownership records and access control policies</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Solana handles high-frequency monitoring of location verification attempts</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>TON provides backup security and emergency recovery operations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF5AF7] mr-2">•</span>
                <span>Location metadata is verified across all chains for maximum security</span>
              </li>
            </ul>
            <p className="text-gray-300">
              This multi-chain approach ensures that even if a single blockchain is compromised, 
              the location verification remains secure.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Security Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Privacy & Security Guarantees
        </h2>
        
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Location Privacy Protection</h3>
            <p className="text-gray-300 mb-4">
              Our Geo-Location Vault maintains strict privacy with several technical measures:
            </p>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Zero-Knowledge Proofs:</strong> Location verification uses zero-knowledge proofs 
                  that confirm presence in a geofence without revealing exact coordinates.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Private Metadata:</strong> Location details are never publicly stored on 
                  any blockchain, using cryptographic commitments instead.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Local Processing:</strong> Location verification begins on the user's device, 
                  with only proof of verification (not location data) transmitted.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 mt-1 text-[#FF5AF7]"><Check className="h-4 w-4" /></span>
                <span>
                  <strong className="text-white">Obfuscated Access Logs:</strong> Authentication records show verification 
                  occurred but do not reveal which specific location was used in multi-location setups.
                </span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Map className="h-6 w-6 text-[#FF5AF7] mr-3" />
                <h3 className="text-lg font-semibold text-white">Anti-Spoofing Protection</h3>
              </div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Device Integrity:</strong> Verification of device security state and GPS tampering detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Network Analysis:</strong> Detection of VPN, proxies and location spoofing services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Multi-Signal Verification:</strong> Cell tower, WiFi, and other signals cross-checked</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Temporal Consistency:</strong> Verification of location movement patterns for authenticity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#FF5AF7] mr-2">•</span>
                  <span><strong className="text-white">Behavioral Analysis:</strong> Optional AI monitoring for unusual access patterns</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-[#FF5AF7] mr-3" />
                <h3 className="text-lg font-semibold text-white">Security Levels</h3>
              </div>
              <ul className="space-y-4 text-gray-300 text-sm">
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                    <strong className="text-white">Standard (Level 1)</strong>
                  </div>
                  <p className="ml-5 mt-1">Basic location verification with 500m radius geofence</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
                    <strong className="text-white">Enhanced (Level 2)</strong>
                  </div>
                  <p className="ml-5 mt-1">Precise location verification with 100m radius and anti-spoofing</p>
                </li>
                <li>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-400 mr-2"></div>
                    <strong className="text-white">Fortress™ (Level 3)</strong>
                  </div>
                  <p className="ml-5 mt-1">Military-grade verification with 50m radius, full anti-spoofing suite, and behavioral monitoring</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#333] pb-2">
          Ideal Use Cases
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Corporate Treasuries</h3>
            <p className="text-gray-300 text-sm">
              Restrict high-value treasury access to authorized office locations
              for additional corporate governance and security.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Secure Remote Teams</h3>
            <p className="text-gray-300 text-sm">
              Enable distributed teams to access shared resources only from 
              authorized office or secure home locations.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Regulatory Compliance</h3>
            <p className="text-gray-300 text-sm">
              Comply with geo-fencing requirements for regulated digital assets
              that must remain within specific jurisdictions.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Multi-Location Businesses</h3>
            <p className="text-gray-300 text-sm">
              Manage shared assets across multiple office locations with location-specific
              access permissions and security policies.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Secure Estate Planning</h3>
            <p className="text-gray-300 text-sm">
              Require beneficiaries to be physically present at specific locations
              (law office, bank, etc.) to access inheritance assets.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#242424] to-[#1E1E1E] border border-[#333] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">High-Security Storage</h3>
            <p className="text-gray-300 text-sm">
              Add an additional physical security layer for extremely sensitive
              digital assets requiring maximum protection.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <Link href="/vault-types">
          <Button className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg shadow-[#6B00D7]/30 transition-all hover:shadow-xl hover:shadow-[#6B00D7]/40">
            Create Geo-Location Vault
          </Button>
        </Link>
        <p className="text-gray-400 mt-4">
          Add a physical presence requirement to your digital asset security
        </p>
      </div>
    </div>
  );
};

export default GeoVaultPage;