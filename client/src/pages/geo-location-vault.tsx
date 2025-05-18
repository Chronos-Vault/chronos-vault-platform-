import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  MapPin, 
  Shield, 
  Globe, 
  Lock, 
  Clock, 
  PlusCircle, 
  X, 
  CheckCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Map component mock - in a real implementation, this would use a proper map library like Leaflet or Google Maps
const MapComponent = ({ 
  onLocationSelect, 
  boundaryType, 
  selectedLocation, 
  radius, 
  polygonPoints 
}: any) => {
  return (
    <div className="relative w-full h-[300px] rounded-lg overflow-hidden border border-[#00D74B]/30 bg-gray-900">
      {/* This would be replaced with an actual map in a real implementation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <MapPin className="h-8 w-8 text-[#00D74B] mb-2" />
        <p className="text-gray-300">
          Interactive map would be displayed here with {boundaryType} selection tools.
        </p>
        <p className="text-gray-400 text-sm mt-2">
          {boundaryType === 'circular' 
            ? `Center: ${selectedLocation || 'Not set'}, Radius: ${radius}m` 
            : boundaryType === 'polygon' 
              ? `Polygon with ${polygonPoints.length} points` 
              : `Selected country: ${selectedLocation || 'None'}`}
        </p>
        
        <Button 
          variant="outline" 
          className="mt-4 border-[#00D74B]/50 text-[#00D74B] hover:bg-[#00D74B]/10"
          onClick={() => {
            // Mock location selection - in a real app, this would come from the map
            if (boundaryType === 'circular') {
              onLocationSelect('New York City, NY');
            } else if (boundaryType === 'country') {
              onLocationSelect('United States');
            } else {
              // For polygon, in a real app we would add points to the polygonPoints array
              onLocationSelect('Polygon point added');
            }
          }}
        >
          Simulate Location Selection
        </Button>
      </div>
    </div>
  );
};

// Boundary type options
enum BoundaryType {
  CIRCULAR = 'circular',
  POLYGON = 'polygon',
  COUNTRY = 'country'
}

// Enum for verification methods
enum VerificationMethod {
  GPS = 'gps',
  IP = 'ip',
  CELL_TOWER = 'cell_tower',
  MULTI_METHOD = 'multi_method'
}

// Enum for accuracy levels
enum AccuracyLevel {
  PRECISE = '10',
  MODERATE = '100',
  GENERAL = '500',
  AREA = '1000'
}

const GeoLocationVault: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My Geo-Location Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [boundaryType, setBoundaryType] = useState<BoundaryType>(BoundaryType.CIRCULAR);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(500);
  const [polygonPoints, setPolygonPoints] = useState<string[]>([]);
  const [polygonPointInput, setPolygonPointInput] = useState<string>('');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(VerificationMethod.MULTI_METHOD);
  const [accuracyLevel, setAccuracyLevel] = useState<AccuracyLevel>(AccuracyLevel.MODERATE);
  
  // Advanced settings
  const [enableTimeLimits, setEnableTimeLimits] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [weekdaysOnly, setWeekdaysOnly] = useState<boolean>(true);
  const [enableMultiFactor, setEnableMultiFactor] = useState<boolean>(true);
  const [enableAntiSpoofing, setEnableAntiSpoofing] = useState<boolean>(true);
  const [enableEmergencyAccess, setEnableEmergencyAccess] = useState<boolean>(true);
  const [emergencyEmail, setEmergencyEmail] = useState<string>('');
  
  // UI state
  const [currentTab, setCurrentTab] = useState<string>('location');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLocationVerified, setIsLocationVerified] = useState<boolean>(false);
  
  // Add polygon point
  const addPolygonPoint = () => {
    if (polygonPointInput.trim()) {
      setPolygonPoints([...polygonPoints, polygonPointInput.trim()]);
      setPolygonPointInput('');
    }
  };
  
  // Remove polygon point
  const removePolygonPoint = (index: number) => {
    setPolygonPoints(polygonPoints.filter((_, i) => i !== index));
  };
  
  // Simulate location verification
  const verifyLocation = () => {
    // This would be a real GPS/location verification in a production app
    setIsLocationVerified(false);
    
    toast({
      title: "Verifying your location...",
      description: "Please wait while we verify your current location",
    });
    
    setTimeout(() => {
      setIsLocationVerified(true);
      toast({
        title: "Location verified",
        description: "Your current location has been verified and secured",
        variant: "default",
      });
    }, 2000);
  };
  
  // Handle vault creation
  const handleCreateVault = () => {
    // Validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your vault",
        variant: "destructive",
      });
      return;
    }
    
    if (boundaryType === BoundaryType.CIRCULAR && !selectedLocation) {
      toast({
        title: "Location required",
        description: "Please select a center location for your circular boundary",
        variant: "destructive",
      });
      return;
    }
    
    if (boundaryType === BoundaryType.POLYGON && polygonPoints.length < 3) {
      toast({
        title: "Insufficient polygon points",
        description: "Please add at least 3 points to define your polygon boundary",
        variant: "destructive",
      });
      return;
    }
    
    if (boundaryType === BoundaryType.COUNTRY && !selectedLocation) {
      toast({
        title: "Country selection required",
        description: "Please select a country for your boundary",
        variant: "destructive",
      });
      return;
    }
    
    // Proceed with creation
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsCreating(false);
      setIsSuccess(true);
      
      toast({
        title: "Geo-Location Vault Created",
        description: "Your location-based vault has been successfully created",
        variant: "default",
      });
    }, 2000);
  };
  
  // Render success state
  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#00D74B]/20 mb-8">
            <CheckCircle className="h-12 w-12 text-[#00D74B]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Geo-Location Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your location-based vault has been successfully created and is now protected by geographic authentication.
          </p>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#00D74B] to-[#47A0FF] hover:from-[#00E750] hover:to-[#50A8FF] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#00D74B]/50 text-[#00D74B] hover:bg-[#00D74B]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Geo-Location Vault');
                setVaultDescription('');
                setSelectedLocation('');
                setPolygonPoints([]);
                setCurrentTab('location');
              }}
            >
              Create Another Vault
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link href="/vault-types">
          <Button variant="ghost" className="mb-4 hover:bg-[#00D74B]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00D74B] to-[#47A0FF] flex items-center justify-center shadow-lg shadow-[#00D74B]/30 mr-4">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00D74B] to-[#47A0FF]">
            Geo-Location Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create a vault secured by geographic authentication, requiring physical presence for access.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Globe className="h-3 w-3 mr-1" /> Geographic Authentication
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <Shield className="h-3 w-3 mr-1" /> Physical Security Layer
          </Badge>
          <Badge variant="secondary" className="bg-[#00D74B]/20 text-[#00D74B] border-[#00D74B]/50">
            <MapPin className="h-3 w-3 mr-1" /> GPS-Verified Access
          </Badge>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Vault Setup */}
        <div className="lg:col-span-2">
          <Tabs 
            value={currentTab} 
            onValueChange={setCurrentTab}
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
          >
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="location" className="data-[state=active]:bg-[#00D74B]/30">
                <div className="flex flex-col items-center py-1">
                  <MapPin className="h-5 w-5 mb-1" />
                  <span>Location</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="verification" className="data-[state=active]:bg-[#00D74B]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Verification</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-[#00D74B]/30">
                <div className="flex flex-col items-center py-1">
                  <Clock className="h-5 w-5 mb-1" />
                  <span>Advanced</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="location" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Vault Details</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vault-name">Vault Name</Label>
                    <Input 
                      id="vault-name"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      className="bg-black/30 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vault-description">Description (Optional)</Label>
                    <Textarea
                      id="vault-description"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      className="bg-black/30 border-gray-700"
                      placeholder="Add details about this vault's purpose"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Location Boundary</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Boundary Type</Label>
                      <RadioGroup 
                        value={boundaryType} 
                        onValueChange={(value) => setBoundaryType(value as BoundaryType)}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={BoundaryType.CIRCULAR} id="circular" className="text-[#00D74B]" />
                          <Label htmlFor="circular" className="cursor-pointer">Circular (radius)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={BoundaryType.POLYGON} id="polygon" className="text-[#00D74B]" />
                          <Label htmlFor="polygon" className="cursor-pointer">Polygon (area)</Label>
                        </div>
                        <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={BoundaryType.COUNTRY} id="country" className="text-[#00D74B]" />
                          <Label htmlFor="country" className="cursor-pointer">Country</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="mt-6">
                      <MapComponent 
                        onLocationSelect={(location: string) => {
                          setSelectedLocation(location);
                          toast({
                            title: "Location Selected",
                            description: `Location set to: ${location}`,
                          });
                        }}
                        boundaryType={boundaryType}
                        selectedLocation={selectedLocation}
                        radius={radius}
                        polygonPoints={polygonPoints}
                      />
                    </div>
                    
                    {boundaryType === BoundaryType.CIRCULAR && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="radius">Radius (meters)</Label>
                            <span>{radius}m</span>
                          </div>
                          <Slider
                            id="radius"
                            min={10}
                            max={5000}
                            step={10}
                            value={[radius]}
                            onValueChange={(value) => setRadius(value[0])}
                            className="[&>span]:bg-[#00D74B]"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>10m (precise)</span>
                            <span>5000m (wide area)</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {boundaryType === BoundaryType.POLYGON && (
                      <div className="space-y-4 mt-4">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add polygon point (e.g., address or coordinates)"
                            value={polygonPointInput}
                            onChange={(e) => setPolygonPointInput(e.target.value)}
                            className="bg-black/30 border-gray-700 flex-1"
                          />
                          <Button 
                            onClick={addPolygonPoint} 
                            variant="outline" 
                            className="border-[#00D74B]/50 text-[#00D74B] hover:bg-[#00D74B]/10"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Point
                          </Button>
                        </div>
                        
                        {polygonPoints.length > 0 && (
                          <div className="space-y-2 mt-2">
                            <Label>Polygon Points</Label>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                              {polygonPoints.map((point, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-black/20 rounded border border-gray-800">
                                  <span className="text-sm text-gray-300">{point}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removePolygonPoint(index)}
                                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {polygonPoints.length > 0 && polygonPoints.length < 3 && (
                          <Alert className="bg-amber-950/30 border-amber-500/30">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <AlertTitle className="text-amber-500">More points needed</AlertTitle>
                            <AlertDescription className="text-gray-300">
                              Add at least 3 points to define a valid polygon area.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                    
                    {boundaryType === BoundaryType.COUNTRY && (
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="country-select">Select Country</Label>
                          <Select
                            value={selectedLocation}
                            onValueChange={setSelectedLocation}
                          >
                            <SelectTrigger id="country-select" className="bg-black/30 border-gray-700">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="United States">United States</SelectItem>
                              <SelectItem value="Canada">Canada</SelectItem>
                              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                              <SelectItem value="Germany">Germany</SelectItem>
                              <SelectItem value="Japan">Japan</SelectItem>
                              <SelectItem value="Australia">Australia</SelectItem>
                              <SelectItem value="Brazil">Brazil</SelectItem>
                              <SelectItem value="India">India</SelectItem>
                              <SelectItem value="China">China</SelectItem>
                              <SelectItem value="Russia">Russia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => setCurrentTab('verification')}
                  className="bg-[#00D74B] hover:bg-[#00C74B] text-black font-medium"
                >
                  Continue to Verification
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Verification Settings</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Method</Label>
                    <RadioGroup 
                      value={verificationMethod} 
                      onValueChange={(value) => setVerificationMethod(value as VerificationMethod)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationMethod.GPS} id="gps" className="text-[#00D74B]" />
                        <Label htmlFor="gps" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">GPS Only</span>
                            <span className="text-sm text-gray-400">Requires GPS permission on user device</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationMethod.IP} id="ip" className="text-[#00D74B]" />
                        <Label htmlFor="ip" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">IP Geolocation</span>
                            <span className="text-sm text-gray-400">Less precise but works without GPS</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationMethod.CELL_TOWER} id="cell_tower" className="text-[#00D74B]" />
                        <Label htmlFor="cell_tower" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Cell Tower Triangulation</span>
                            <span className="text-sm text-gray-400">Works indoors, requires mobile network</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                        <RadioGroupItem value={VerificationMethod.MULTI_METHOD} id="multi_method" className="text-[#00D74B]" />
                        <Label htmlFor="multi_method" className="cursor-pointer flex-1">
                          <div className="flex flex-col">
                            <span className="font-medium">Multi-Method Verification (Recommended)</span>
                            <span className="text-sm text-gray-400">Combines multiple methods for highest reliability</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Required Accuracy Level</Label>
                        <span>{parseInt(accuracyLevel)}m</span>
                      </div>
                      
                      <RadioGroup 
                        value={accuracyLevel} 
                        onValueChange={(value) => setAccuracyLevel(value as AccuracyLevel)}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4"
                      >
                        <div className="flex flex-col items-center space-y-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={AccuracyLevel.PRECISE} id="precise" className="text-[#00D74B]" />
                          <Label htmlFor="precise" className="cursor-pointer text-center">
                            <div className="text-lg font-medium">10m</div>
                            <div className="text-xs text-gray-400">Precise</div>
                          </Label>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={AccuracyLevel.MODERATE} id="moderate" className="text-[#00D74B]" />
                          <Label htmlFor="moderate" className="cursor-pointer text-center">
                            <div className="text-lg font-medium">100m</div>
                            <div className="text-xs text-gray-400">Moderate</div>
                          </Label>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={AccuracyLevel.GENERAL} id="general" className="text-[#00D74B]" />
                          <Label htmlFor="general" className="cursor-pointer text-center">
                            <div className="text-lg font-medium">500m</div>
                            <div className="text-xs text-gray-400">General</div>
                          </Label>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 border border-gray-800 rounded-lg p-3 hover:bg-[#00D74B]/5 cursor-pointer">
                          <RadioGroupItem value={AccuracyLevel.AREA} id="area" className="text-[#00D74B]" />
                          <Label htmlFor="area" className="cursor-pointer text-center">
                            <div className="text-lg font-medium">1000m</div>
                            <div className="text-xs text-gray-400">Area</div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Verify Your Current Location</h3>
                    <p className="text-gray-400">
                      To create a geo-location vault, we'll need to verify your current location.
                      This helps ensure the vault is set up correctly.
                    </p>
                    
                    <div className="bg-black/30 border border-gray-800 rounded-lg p-4">
                      {isLocationVerified ? (
                        <div className="flex items-center text-[#00D74B] space-x-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Location successfully verified</span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                          <div className="text-gray-300">
                            Location verification needed before creating vault
                          </div>
                          <Button 
                            onClick={verifyLocation}
                            className="bg-[#00D74B] hover:bg-[#00C74B] text-black font-medium"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Verify My Location
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('location')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => setCurrentTab('advanced')}
                  className="bg-[#00D74B] hover:bg-[#00C74B] text-black font-medium"
                  disabled={!isLocationVerified}
                >
                  Continue to Advanced Settings
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Advanced Settings</h2>
                
                <div className="space-y-4">
                  <Card className="bg-black/20 border-gray-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-[#00D74B]" />
                        Time-Location Integration
                      </CardTitle>
                      <CardDescription>
                        Restrict vault access to specific times
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="time-limits" className="cursor-pointer">Enable Time Restrictions</Label>
                        <Switch 
                          id="time-limits"
                          checked={enableTimeLimits}
                          onCheckedChange={setEnableTimeLimits}
                          className="data-[state=checked]:bg-[#00D74B]"
                        />
                      </div>
                      
                      {enableTimeLimits && (
                        <div className="space-y-4 pt-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="start-time">Start Time</Label>
                              <Input 
                                id="start-time"
                                type="time" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-black/30 border-gray-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end-time">End Time</Label>
                              <Input 
                                id="end-time"
                                type="time" 
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="bg-black/30 border-gray-700"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="weekdays-only" 
                              checked={weekdaysOnly}
                              onCheckedChange={(checked) => {
                                if (typeof checked === 'boolean') setWeekdaysOnly(checked);
                              }}
                              className="data-[state=checked]:bg-[#00D74B] data-[state=checked]:border-[#00D74B]"
                            />
                            <Label htmlFor="weekdays-only" className="cursor-pointer">
                              Weekdays only (Monday-Friday)
                            </Label>
                          </div>
                          
                          <Alert className="bg-[#00D74B]/10 border-[#00D74B]/30">
                            <Clock className="h-4 w-4 text-[#00D74B]" />
                            <AlertTitle className="text-[#00D74B]">Time Restrictions Active</AlertTitle>
                            <AlertDescription className="text-gray-300">
                              Your vault will only be accessible {weekdaysOnly ? 'on weekdays ' : ''}
                              between {startTime} and {endTime}.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-black/20 border-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-[#00D74B]" />
                          Security Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="multi-factor" className="cursor-pointer">Multi-Factor Authentication</Label>
                            <p className="text-xs text-gray-400">Require additional verification factors</p>
                          </div>
                          <Switch 
                            id="multi-factor"
                            checked={enableMultiFactor}
                            onCheckedChange={setEnableMultiFactor}
                            className="data-[state=checked]:bg-[#00D74B]"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="anti-spoofing" className="cursor-pointer">Anti-Spoofing Protection</Label>
                            <p className="text-xs text-gray-400">Prevent GPS spoofing and location falsification</p>
                          </div>
                          <Switch 
                            id="anti-spoofing"
                            checked={enableAntiSpoofing}
                            onCheckedChange={setEnableAntiSpoofing}
                            className="data-[state=checked]:bg-[#00D74B]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/20 border-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <Lock className="h-5 w-5 mr-2 text-[#00D74B]" />
                          Emergency Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="emergency-access" className="cursor-pointer">Emergency Access Option</Label>
                            <p className="text-xs text-gray-400">Allow access when location verification is impossible</p>
                          </div>
                          <Switch 
                            id="emergency-access"
                            checked={enableEmergencyAccess}
                            onCheckedChange={setEnableEmergencyAccess}
                            className="data-[state=checked]:bg-[#00D74B]"
                          />
                        </div>
                        
                        {enableEmergencyAccess && (
                          <div className="space-y-2 pt-2">
                            <Label htmlFor="emergency-email">Emergency Recovery Email</Label>
                            <Input 
                              id="emergency-email"
                              type="email" 
                              placeholder="your@email.com"
                              value={emergencyEmail}
                              onChange={(e) => setEmergencyEmail(e.target.value)}
                              className="bg-black/30 border-gray-700"
                            />
                            <p className="text-xs text-gray-400">
                              Emergency access instructions will be sent to this email if needed.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('verification')}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCreateVault}
                  className="bg-[#00D74B] hover:bg-[#00C74B] text-black font-medium"
                  disabled={isCreating || !isLocationVerified}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Geo-Location Vault'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#00D74B] to-[#47A0FF]" />
            <CardHeader>
              <CardTitle>Why Choose Geo-Location Vaults?</CardTitle>
              <CardDescription>
                Add a physical security layer to your digital assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#00D74B]/20 p-1.5 rounded-full">
                  <MapPin className="h-5 w-5 text-[#00D74B]" />
                </div>
                <div>
                  <h4 className="font-medium">Location-Based Security</h4>
                  <p className="text-sm text-gray-400">Require physical presence at specific locations to access your vault</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#00D74B]/20 p-1.5 rounded-full">
                  <Shield className="h-5 w-5 text-[#00D74B]" />
                </div>
                <div>
                  <h4 className="font-medium">Enhanced Fraud Prevention</h4>
                  <p className="text-sm text-gray-400">Prevent unauthorized access from non-approved locations</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#00D74B]/20 p-1.5 rounded-full">
                  <Globe className="h-5 w-5 text-[#00D74B]" />
                </div>
                <div>
                  <h4 className="font-medium">Travel Security</h4>
                  <p className="text-sm text-gray-400">Create country-specific vaults that only activate when abroad</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-[#00D74B]/20 p-1.5 rounded-full">
                  <Clock className="h-5 w-5 text-[#00D74B]" />
                </div>
                <div>
                  <h4 className="font-medium">Time-Location Integration</h4>
                  <p className="text-sm text-gray-400">Restrict access to specific times and locations for maximum security</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-[#00D74B]/20 to-[#47A0FF]/20 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D74B] to-[#47A0FF]">Use Cases</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-white">Business Transaction Security</h3>
                <p className="text-xs text-gray-300">
                  Limit high-value business transactions to your office location only.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white">Secure Inheritance Planning</h3>
                <p className="text-xs text-gray-300">
                  Ensure heirs must visit a specific location to access inheritance assets.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white">Physical Branch Banking</h3>
                <p className="text-xs text-gray-300">
                  Require physical presence at specific locations to access corporate accounts.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Alert className="bg-[#00D74B]/10 border-[#00D74B]/30">
            <Shield className="h-4 w-4 text-[#00D74B]" />
            <AlertTitle className="text-[#00D74B]">Privacy Protection</AlertTitle>
            <AlertDescription className="text-gray-300">
              Location data is verified on-device using zero-knowledge proofs, and is never stored on our servers.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default GeoLocationVault;