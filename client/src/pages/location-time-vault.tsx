import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Image, 
  Video, 
  Calendar, 
  Users, 
  Key,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Network,
  Diamond,
  Layers,
  Server,
  HardDrive,
  Timer,
  MapPin,
  Globe,
  Lock,
  Unlock
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Define types
type VerificationMethod = "standard" | "enhanced" | "quantum";
type RecoveryOption = "standard" | "advanced" | "quantum";
type StorageRedundancy = "standard" | "enhanced" | "maximum";
type LocationVerification = "gps" | "cellular" | "wifi" | "bluetooth" | "ip" | "multiple";
type SuccessAction = "return" | "continue";
type Step = 1 | 2 | 3 | 4 | 5;
type Trustee = {
  id: string;
  address: string;
  type: "wallet" | "email";
  permissions: ("view" | "extract" | "modify" | "delete")[];
  notificationMethod: "email" | "onchain" | "both";
};
type UnlockEvent = {
  id: string;
  date: string;
  recurring: boolean;
  frequency?: "daily" | "weekly" | "monthly" | "yearly";
  notifyBefore: number;
};
type GeoFence = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  requiresTimeCondition: boolean;
};

// Main component for Location-Time Vault
export default function LocationTimeVault() {
  const [, setLocation] = useLocation();
  
  // Form state
  const [step, setStep] = useState<Step>(1);
  const [vaultName, setVaultName] = useState("");
  const [vaultDescription, setVaultDescription] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("standard");
  const [recoveryOption, setRecoveryOption] = useState<RecoveryOption>("standard");
  const [storageRedundancy, setStorageRedundancy] = useState<StorageRedundancy>("standard");
  const [locationMethod, setLocationMethod] = useState<LocationVerification>("gps");
  const [requireTimeCondition, setRequireTimeCondition] = useState(true);
  const [multiChainProtection, setMultiChainProtection] = useState(false);
  const [trustees, setTrustees] = useState<Trustee[]>([]);
  const [unlockEvents, setUnlockEvents] = useState<UnlockEvent[]>([]);
  const [geoFences, setGeoFences] = useState<GeoFence[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [locationAccuracy, setLocationAccuracy] = useState<number>(100); // meters
  const [locationFrequency, setLocationFrequency] = useState<number>(30); // minutes
  const [securityScore, setSecurityScore] = useState(0);
  const [complexityLevel, setComplexityLevel] = useState(0);
  
  // New trustee form
  const [newTrusteeAddress, setNewTrusteeAddress] = useState("");
  const [newTrusteeType, setNewTrusteeType] = useState<"wallet" | "email">("wallet");
  const [newTrusteePermissions, setNewTrusteePermissions] = useState<("view" | "extract" | "modify" | "delete")[]>(["view"]);
  const [newTrusteeNotification, setNewTrusteeNotification] = useState<"email" | "onchain" | "both">("onchain");
  
  // New unlock event form
  const [newUnlockDate, setNewUnlockDate] = useState("");
  const [newUnlockRecurring, setNewUnlockRecurring] = useState(false);
  const [newUnlockFrequency, setNewUnlockFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [newUnlockNotifyBefore, setNewUnlockNotifyBefore] = useState(7);
  
  // New geofence form
  const [newGeofenceName, setNewGeofenceName] = useState("");
  const [newGeofenceLatitude, setNewGeofenceLatitude] = useState<number | null>(null);
  const [newGeofenceLongitude, setNewGeofenceLongitude] = useState<number | null>(null);
  const [newGeofenceRadius, setNewGeofenceRadius] = useState(100); // Default 100m radius
  const [newGeofenceRequiresTime, setNewGeofenceRequiresTime] = useState(true);

  // Calculate security score whenever relevant fields change
  useEffect(() => {
    calculateSecurityScore();
  }, [verificationMethod, recoveryOption, storageRedundancy, trustees, unlockEvents, geoFences, locationMethod, multiChainProtection]);

  // Calculate security score based on form values
  const calculateSecurityScore = () => {
    let score = 0;
    
    // Base scores for verification methods
    if (verificationMethod === "standard") score += 10;
    if (verificationMethod === "enhanced") score += 20;
    if (verificationMethod === "quantum") score += 30;
    
    // Recovery options
    if (recoveryOption === "standard") score += 10;
    if (recoveryOption === "advanced") score += 20;
    if (recoveryOption === "quantum") score += 30;
    
    // Storage redundancy
    if (storageRedundancy === "standard") score += 10;
    if (storageRedundancy === "enhanced") score += 20;
    if (storageRedundancy === "maximum") score += 30;
    
    // Location verification methods
    if (locationMethod === "gps") score += 15;
    if (locationMethod === "multiple") score += 25;
    
    // Number of trustees adds security
    score += trustees.length * 5;
    
    // Number of geofences
    score += geoFences.length * 10;
    
    // Multi-chain protection is a major security boost
    if (multiChainProtection) score += 25;
    
    // Time conditions
    if (requireTimeCondition) score += 15;
    
    // Location accuracy - more precise is more secure
    score += Math.max(0, 20 - Math.floor(locationAccuracy / 10));
    
    // Cap score at 100
    const finalScore = Math.min(100, score);
    setSecurityScore(finalScore);
    
    // Set complexity level (1-5)
    let complexity = 1;
    if (finalScore > 20) complexity = 2;
    if (finalScore > 40) complexity = 3;
    if (finalScore > 60) complexity = 4;
    if (finalScore > 80) complexity = 5;
    
    setComplexityLevel(complexity);
  };

  // Add a new trustee
  const addTrustee = () => {
    if (!newTrusteeAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address or email",
        variant: "destructive",
      });
      return;
    }
    
    const newTrustee: Trustee = {
      id: Date.now().toString(),
      address: newTrusteeAddress,
      type: newTrusteeType,
      permissions: newTrusteePermissions,
      notificationMethod: newTrusteeNotification,
    };
    
    setTrustees([...trustees, newTrustee]);
    setNewTrusteeAddress("");
    setNewTrusteePermissions(["view"]);
    
    toast({
      title: "Trustee added",
      description: "The trustee has been added successfully",
    });
  };

  // Remove a trustee
  const removeTrustee = (id: string) => {
    setTrustees(trustees.filter(t => t.id !== id));
  };

  // Add a new unlock event
  const addUnlockEvent = () => {
    if (!newUnlockDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }
    
    const newEvent: UnlockEvent = {
      id: Date.now().toString(),
      date: newUnlockDate,
      recurring: newUnlockRecurring,
      frequency: newUnlockRecurring ? newUnlockFrequency : undefined,
      notifyBefore: newUnlockNotifyBefore,
    };
    
    setUnlockEvents([...unlockEvents, newEvent]);
    setNewUnlockDate("");
    setNewUnlockRecurring(false);
    
    toast({
      title: "Unlock event added",
      description: "The unlock event has been added successfully",
    });
  };

  // Remove an unlock event
  const removeUnlockEvent = (id: string) => {
    setUnlockEvents(unlockEvents.filter(e => e.id !== id));
  };

  // Add a new geofence
  const addGeofence = () => {
    if (!newGeofenceName || newGeofenceLatitude === null || newGeofenceLongitude === null) {
      toast({
        title: "Error",
        description: "Please enter all required geofence details",
        variant: "destructive",
      });
      return;
    }
    
    const newFence: GeoFence = {
      id: Date.now().toString(),
      name: newGeofenceName,
      latitude: newGeofenceLatitude,
      longitude: newGeofenceLongitude,
      radius: newGeofenceRadius,
      requiresTimeCondition: newGeofenceRequiresTime
    };
    
    setGeoFences([...geoFences, newFence]);
    setNewGeofenceName("");
    setNewGeofenceLatitude(null);
    setNewGeofenceLongitude(null);
    
    toast({
      title: "Geofence added",
      description: "The geofence has been added successfully",
    });
  };

  // Remove a geofence
  const removeGeofence = (id: string) => {
    setGeoFences(geoFences.filter(g => g.id !== id));
  };

  // Handle file uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...newImages]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedVideos([...uploadedVideos, ...newVideos]);
    }
  };

  // Remove uploaded media
  const removeImage = (url: string) => {
    setUploadedImages(uploadedImages.filter(img => img !== url));
  };

  const removeVideo = (url: string) => {
    setUploadedVideos(uploadedVideos.filter(vid => vid !== url));
  };

  // Handle form submission
  const handleCreateVault = () => {
    // Validate the form
    if (!vaultName) {
      toast({
        title: "Error",
        description: "Please enter a vault name",
        variant: "destructive",
      });
      return;
    }
    
    if (geoFences.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one geofence for a Location-Time Vault",
        variant: "destructive",
      });
      return;
    }
    
    if (requireTimeCondition && unlockEvents.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one time condition",
        variant: "destructive",
      });
      return;
    }
    
    // Show success message
    toast({
      title: "Success!",
      description: "Your Location-Time Vault has been created successfully",
    });
    
    // In a real application, we would submit the form data to the server here
    console.log("Creating vault with data:", {
      vaultName,
      vaultDescription,
      verificationMethod,
      recoveryOption,
      storageRedundancy,
      locationMethod,
      requireTimeCondition,
      multiChainProtection,
      trustees,
      unlockEvents,
      geoFences,
      uploadedImages,
      uploadedVideos,
      locationAccuracy,
      locationFrequency,
      securityScore,
      complexityLevel
    });
    
    // Redirect to dashboard
    setLocation("/dashboard");
  };

  // Generate permission label
  const getPermissionLabel = (permission: "view" | "extract" | "modify" | "delete") => {
    switch (permission) {
      case "view": return "View";
      case "extract": return "Extract Data";
      case "modify": return "Modify";
      case "delete": return "Delete";
    }
  };

  // Format recurring event description
  const formatRecurringEvent = (event: UnlockEvent) => {
    if (!event.recurring) return "One-time";
    return `${event.frequency?.charAt(0).toUpperCase() + event.frequency?.slice(1)}`;
  };

  // Custom components
  const SecurityBadge = ({ score }: { score: number }) => {
    let label = "Basic";
    let color = "bg-gray-400";
    
    if (score > 20) {
      label = "Standard";
      color = "bg-blue-400";
    }
    if (score > 40) {
      label = "Advanced";
      color = "bg-indigo-500";
    }
    if (score > 60) {
      label = "Superior";
      color = "bg-purple-500";
    }
    if (score > 80) {
      label = "Maximum";
      color = "bg-[#FF5AF7]";
    }
    
    return (
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm font-medium">{label} Security</span>
      </div>
    );
  };

  const SecurityMeter = ({ score }: { score: number }) => {
    const getColor = () => {
      if (score > 80) return "bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF]";
      if (score > 60) return "bg-gradient-to-r from-purple-500 to-violet-500";
      if (score > 40) return "bg-indigo-500";
      if (score > 20) return "bg-blue-400";
      return "bg-gray-400";
    };

    return (
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Security Level: {score}%</span>
          <SecurityBadge score={score} />
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full">
          <div 
            className={`h-2 rounded-full ${getColor()}`} 
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const StepIndicator = ({ currentStep, totalSteps = 5 }: { currentStep: number, totalSteps?: number }) => {
    return (
      <div className="flex items-center w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <React.Fragment key={i}>
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${i + 1 <= currentStep 
                  ? "bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] text-white"
                  : "bg-[#333] text-gray-400"}`}
            >
              {i + 1 <= currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            {i < totalSteps - 1 && (
              <div 
                className={`flex-1 h-1 mx-1
                  ${i + 1 < currentStep 
                    ? "bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF]" 
                    : "bg-[#333]"}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Return the component
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto py-6 px-4 md:px-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2D114D] to-[#1E0D35] border border-[#444] rounded-lg p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] bg-center bg-repeat"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#9D42FF] rounded-full filter blur-[80px] opacity-30"></div>
            <div className="absolute top-10 left-10 w-40 h-40 bg-[#FF5AF7] rounded-full filter blur-[80px] opacity-20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-start mb-6">
              <Button variant="ghost" size="icon" className="mr-4" onClick={() => setLocation("/create-vault")}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <MapPin className="text-[#FF5AF7]" /> 
                  <span>Location-Time Vault</span>
                </h1>
                <p className="text-gray-400 mt-1">Create a vault that can only be unlocked at specific locations and times</p>
              </div>
            </div>
          
            <div className="mt-4">
              <SecurityMeter score={securityScore} />
            </div>
          </div>
        </div>
        
        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} />
        </div>
        
        {/* Step content */}
        <div className="bg-[#111] border border-[#333] rounded-lg p-6 mb-8">
          {/* Step 1: Basic information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5AF7] text-white text-sm flex items-center justify-center">1</span>
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vault-name">Vault Name</Label>
                  <Input 
                    id="vault-name"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    className="bg-[#222] border-[#444] mt-2"
                    placeholder="My Location-Time Vault"
                  />
                </div>
                
                <div>
                  <Label htmlFor="vault-description">Description (Optional)</Label>
                  <Textarea 
                    id="vault-description"
                    value={vaultDescription}
                    onChange={(e) => setVaultDescription(e.target.value)}
                    className="bg-[#222] border-[#444] mt-2"
                    placeholder="Describe the purpose of this vault..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="verification-method">Verification Method</Label>
                  <Select value={verificationMethod} onValueChange={(value) => setVerificationMethod(value as VerificationMethod)}>
                    <SelectTrigger className="bg-[#222] border-[#444] mt-2">
                      <SelectValue placeholder="Select a verification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Verification</SelectItem>
                      <SelectItem value="enhanced">Enhanced Verification (2FA)</SelectItem>
                      <SelectItem value="quantum">Quantum-Resistant Verification</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="p-3 rounded-lg bg-[#252525]/50 border border-[#333] text-xs mt-3">
                    <div className="flex gap-2 items-center mb-2">
                      {verificationMethod === "standard" && (
                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                      )}
                      {verificationMethod === "enhanced" && (
                        <ShieldCheck className="h-4 w-4 text-indigo-400" />
                      )}
                      {verificationMethod === "quantum" && (
                        <ShieldCheck className="h-4 w-4 text-[#FF5AF7]" />
                      )}
                      <span className="font-medium text-gray-200">
                        {verificationMethod === "standard" && "Standard Security"}
                        {verificationMethod === "enhanced" && "Enhanced Security"}
                        {verificationMethod === "quantum" && "Quantum-Resistant Security"}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      {verificationMethod === "standard" && "Basic verification using blockchain signatures."}
                      {verificationMethod === "enhanced" && "Two-factor authentication with additional security layer."}
                      {verificationMethod === "quantum" && "Advanced quantum-resistant cryptographic algorithms for maximum security."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] hover:from-[#FF4AF0] hover:to-[#8D32FF]"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 2: Location Settings */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5AF7] text-white text-sm flex items-center justify-center">2</span>
                Location Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Location Verification Method</Label>
                  <Select value={locationMethod} onValueChange={(value) => setLocationMethod(value as LocationVerification)}>
                    <SelectTrigger className="bg-[#222] border-[#444] mt-2">
                      <SelectValue placeholder="Select a location verification method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gps">GPS Location</SelectItem>
                      <SelectItem value="cellular">Cellular Network</SelectItem>
                      <SelectItem value="wifi">WiFi Networks</SelectItem>
                      <SelectItem value="bluetooth">Bluetooth Beacons</SelectItem>
                      <SelectItem value="ip">IP Address</SelectItem>
                      <SelectItem value="multiple">Multiple Methods (Maximum Security)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="p-3 rounded-lg bg-[#252525]/50 border border-[#333] text-xs mt-3">
                    <div className="flex gap-2 items-center mb-2">
                      <MapPin className="h-4 w-4 text-[#FF5AF7]" />
                      <span className="font-medium text-gray-200">
                        {locationMethod === "gps" && "GPS Location Verification"}
                        {locationMethod === "cellular" && "Cellular Network Verification"}
                        {locationMethod === "wifi" && "WiFi Networks Verification"}
                        {locationMethod === "bluetooth" && "Bluetooth Beacons Verification"}
                        {locationMethod === "ip" && "IP Address Verification"}
                        {locationMethod === "multiple" && "Multi-Factor Location Verification"}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      {locationMethod === "gps" && "Uses precise GPS coordinates for location verification."}
                      {locationMethod === "cellular" && "Uses cellular network towers to verify approximate location."}
                      {locationMethod === "wifi" && "Uses nearby WiFi networks to confirm location."}
                      {locationMethod === "bluetooth" && "Uses Bluetooth beacons for precise indoor positioning."}
                      {locationMethod === "ip" && "Uses IP address geolocation (less precise but works indoors)."}
                      {locationMethod === "multiple" && "Combines multiple methods for maximum accuracy and security."}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>Location Accuracy (meters)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[locationAccuracy]}
                      min={10}
                      max={1000}
                      step={10}
                      onValueChange={(vals) => setLocationAccuracy(vals[0])}
                      className="flex-grow"
                    />
                    <span className="bg-[#222] px-3 py-1 rounded border border-[#444] min-w-[80px] text-center">
                      {locationAccuracy}m
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Lower values require more precise positioning for vault access
                  </p>
                </div>
                
                <div>
                  <Label>Location Check Frequency</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[locationFrequency]}
                      min={1}
                      max={60}
                      step={1}
                      onValueChange={(vals) => setLocationFrequency(vals[0])}
                      className="flex-grow"
                    />
                    <span className="bg-[#222] px-3 py-1 rounded border border-[#444] min-w-[80px] text-center">
                      {locationFrequency} min
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    How often the system will verify the location while the vault is open
                  </p>
                </div>
                
                <div className="border border-[#333] rounded-lg p-4">
                  <Label className="text-lg font-medium mb-3 block">Define Geofences</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="geofence-name">Geofence Name</Label>
                      <Input 
                        id="geofence-name"
                        value={newGeofenceName}
                        onChange={(e) => setNewGeofenceName(e.target.value)}
                        className="bg-[#222] border-[#444] mt-1"
                        placeholder="Home, Office, etc."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="geofence-radius">Radius (meters)</Label>
                      <Input 
                        id="geofence-radius"
                        type="number"
                        value={newGeofenceRadius}
                        onChange={(e) => setNewGeofenceRadius(parseInt(e.target.value) || 100)}
                        className="bg-[#222] border-[#444] mt-1"
                        min="10"
                        max="10000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="geofence-lat">Latitude</Label>
                      <Input 
                        id="geofence-lat"
                        type="number"
                        value={newGeofenceLatitude !== null ? newGeofenceLatitude : ''}
                        onChange={(e) => setNewGeofenceLatitude(e.target.value ? parseFloat(e.target.value) : null)}
                        className="bg-[#222] border-[#444] mt-1"
                        placeholder="e.g. 37.7749"
                        step="0.0001"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="geofence-lng">Longitude</Label>
                      <Input 
                        id="geofence-lng"
                        type="number"
                        value={newGeofenceLongitude !== null ? newGeofenceLongitude : ''}
                        onChange={(e) => setNewGeofenceLongitude(e.target.value ? parseFloat(e.target.value) : null)}
                        className="bg-[#222] border-[#444] mt-1"
                        placeholder="e.g. -122.4194"
                        step="0.0001"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox 
                      id="requires-time" 
                      checked={newGeofenceRequiresTime}
                      onCheckedChange={(checked) => setNewGeofenceRequiresTime(checked === true)}
                    />
                    <Label htmlFor="requires-time" className="text-sm">
                      Requires time condition (location + time required)
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={addGeofence}
                    className="w-full bg-[#333] hover:bg-[#444]"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Add Geofence
                  </Button>
                  
                  {geoFences.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Added Geofences:</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {geoFences.map(fence => (
                          <div key={fence.id} className="flex items-center justify-between bg-[#222] p-2 rounded border border-[#444]">
                            <div>
                              <div className="font-medium">{fence.name}</div>
                              <div className="text-xs text-gray-400">
                                {fence.latitude.toFixed(4)}, {fence.longitude.toFixed(4)} ({fence.radius}m radius)
                              </div>
                              {fence.requiresTimeCondition && (
                                <div className="text-xs text-[#FF5AF7]">Requires time condition</div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGeofence(fence.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="require-time" 
                    checked={requireTimeCondition}
                    onCheckedChange={setRequireTimeCondition}
                  />
                  <Label htmlFor="require-time">
                    Require Time Conditions (Time + Location)
                  </Label>
                </div>
                
                <div className="p-4 bg-[#252525]/50 border border-[#333] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#333] p-2 rounded-full">
                      <Sparkles className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Enhanced Security</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch 
                          id="multi-chain" 
                          checked={multiChainProtection}
                          onCheckedChange={setMultiChainProtection}
                        />
                        <Label htmlFor="multi-chain">
                          Enable Multi-Chain Protection
                        </Label>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Store location verification data across multiple blockchains for enhanced security
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="border-[#444] hover:bg-[#222]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button
                  onClick={() => {
                    if (geoFences.length === 0) {
                      toast({
                        title: "Warning",
                        description: "You should add at least one geofence for a location-based vault",
                        variant: "destructive",
                      });
                      return;
                    }
                    setStep(3);
                  }}
                  className="bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] hover:from-[#FF4AF0] hover:to-[#8D32FF]"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Time Settings */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5AF7] text-white text-sm flex items-center justify-center">3</span>
                Time Settings
              </h2>
              
              {requireTimeCondition ? (
                <div className="space-y-4">
                  <div className="border border-[#333] rounded-lg p-4">
                    <Label className="text-lg font-medium mb-3 block">Define Time Unlock Conditions</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="unlock-date">Unlock Date</Label>
                        <Input 
                          id="unlock-date"
                          type="date"
                          value={newUnlockDate}
                          onChange={(e) => setNewUnlockDate(e.target.value)}
                          className="bg-[#222] border-[#444] mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="notify-before">Notify Days Before</Label>
                        <Input 
                          id="notify-before"
                          type="number"
                          value={newUnlockNotifyBefore}
                          onChange={(e) => setNewUnlockNotifyBefore(parseInt(e.target.value) || 0)}
                          className="bg-[#222] border-[#444] mt-1"
                          min="0"
                          max="365"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="recurring" 
                        checked={newUnlockRecurring}
                        onCheckedChange={(checked) => setNewUnlockRecurring(checked === true)}
                      />
                      <Label htmlFor="recurring" className="text-sm">
                        Recurring event
                      </Label>
                    </div>
                    
                    {newUnlockRecurring && (
                      <div className="mb-4">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={newUnlockFrequency} onValueChange={(value) => setNewUnlockFrequency(value as "daily" | "weekly" | "monthly" | "yearly")}>
                          <SelectTrigger className="bg-[#222] border-[#444] mt-1">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <Button 
                      onClick={addUnlockEvent}
                      className="w-full bg-[#333] hover:bg-[#444]"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Add Time Condition
                    </Button>
                    
                    {unlockEvents.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Added Time Conditions:</h4>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                          {unlockEvents.map(event => (
                            <div key={event.id} className="flex items-center justify-between bg-[#222] p-2 rounded border border-[#444]">
                              <div>
                                <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                                <div className="text-xs text-gray-400">
                                  {formatRecurringEvent(event)}
                                  {event.notifyBefore > 0 && ` • Notify ${event.notifyBefore} days before`}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeUnlockEvent(event.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-[#252525]/50 border border-[#333] rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-[#333] p-2 rounded-full">
                        <Clock className="h-5 w-5 text-[#FF5AF7]" />
                      </div>
                      <div>
                        <h3 className="font-medium">Time-Location Relationship</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Your vault will require both correct location AND time conditions to be unlocked.
                          This creates a highly secure dual-factor geographical and temporal authentication system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-[#252525]/50 border border-[#333] rounded-lg text-center">
                  <Clock className="h-10 w-10 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-medium mb-2">Time Conditions Disabled</h3>
                  <p className="text-gray-400 mb-4">
                    You've chosen to use location-only verification without time conditions.
                    Your vault will be accessible at the defined locations at any time.
                  </p>
                  <Button
                    onClick={() => setRequireTimeCondition(true)}
                    variant="outline"
                    className="border-[#444] hover:bg-[#222]"
                  >
                    Enable Time Conditions
                  </Button>
                </div>
              )}
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="border-[#444] hover:bg-[#222]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button
                  onClick={() => {
                    if (requireTimeCondition && unlockEvents.length === 0) {
                      toast({
                        title: "Warning",
                        description: "You should add at least one time condition when time conditions are enabled",
                        variant: "destructive",
                      });
                      return;
                    }
                    setStep(4);
                  }}
                  className="bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] hover:from-[#FF4AF0] hover:to-[#8D32FF]"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 4: Access Control */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5AF7] text-white text-sm flex items-center justify-center">4</span>
                Access Control & Recovery
              </h2>
              
              <div className="space-y-4">
                <div className="border border-[#333] rounded-lg p-4">
                  <Label className="text-lg font-medium mb-3 block">Trusted Parties (Optional)</Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="trustee-address">Wallet Address or Email</Label>
                      <Input 
                        id="trustee-address"
                        value={newTrusteeAddress}
                        onChange={(e) => setNewTrusteeAddress(e.target.value)}
                        className="bg-[#222] border-[#444] mt-1"
                        placeholder="0x... or email@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trustee-type">Type</Label>
                      <Select value={newTrusteeType} onValueChange={(value) => setNewTrusteeType(value as "wallet" | "email")}>
                        <SelectTrigger id="trustee-type" className="bg-[#222] border-[#444] mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wallet">Blockchain Wallet</SelectItem>
                          <SelectItem value="email">Email Address</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label className="mb-2 block">Permissions</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["view", "extract", "modify", "delete"] as const).map((perm) => (
                        <div key={perm} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`perm-${perm}`} 
                            checked={newTrusteePermissions.includes(perm)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewTrusteePermissions([...newTrusteePermissions, perm]);
                              } else {
                                setNewTrusteePermissions(newTrusteePermissions.filter(p => p !== perm));
                              }
                            }}
                          />
                          <Label htmlFor={`perm-${perm}`} className="text-sm">
                            {getPermissionLabel(perm)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="trustee-notification">Notification Method</Label>
                    <Select value={newTrusteeNotification} onValueChange={(value) => setNewTrusteeNotification(value as "email" | "onchain" | "both")}>
                      <SelectTrigger id="trustee-notification" className="bg-[#222] border-[#444] mt-1">
                        <SelectValue placeholder="Select notification method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Only</SelectItem>
                        <SelectItem value="onchain">On-chain Only</SelectItem>
                        <SelectItem value="both">Email & On-chain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={addTrustee}
                    className="w-full bg-[#333] hover:bg-[#444]"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Add Trusted Party
                  </Button>
                  
                  {trustees.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Added Trusted Parties:</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {trustees.map(trustee => (
                          <div key={trustee.id} className="flex items-center justify-between bg-[#222] p-2 rounded border border-[#444]">
                            <div>
                              <div className="font-medium">{trustee.address}</div>
                              <div className="text-xs text-gray-400">
                                {trustee.type === "wallet" ? "Wallet" : "Email"} •
                                {trustee.permissions.map(p => ` ${getPermissionLabel(p)}`).join(", ")}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeTrustee(trustee.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Recovery Option</Label>
                  <Select value={recoveryOption} onValueChange={(value) => setRecoveryOption(value as RecoveryOption)}>
                    <SelectTrigger className="bg-[#222] border-[#444] mt-2">
                      <SelectValue placeholder="Select a recovery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Recovery</SelectItem>
                      <SelectItem value="advanced">Advanced Multi-Signature Recovery</SelectItem>
                      <SelectItem value="quantum">Quantum-Resistant Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="p-3 rounded-lg bg-[#252525]/50 border border-[#333] text-xs mt-3">
                    <div className="flex gap-2 items-center mb-2">
                      {recoveryOption === "standard" && (
                        <Key className="h-4 w-4 text-blue-400" />
                      )}
                      {recoveryOption === "advanced" && (
                        <Key className="h-4 w-4 text-indigo-400" />
                      )}
                      {recoveryOption === "quantum" && (
                        <Key className="h-4 w-4 text-[#FF5AF7]" />
                      )}
                      <span className="font-medium text-gray-200">
                        {recoveryOption === "standard" && "Standard Recovery"}
                        {recoveryOption === "advanced" && "Advanced Multi-Signature Recovery"}
                        {recoveryOption === "quantum" && "Quantum-Resistant Recovery"}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      {recoveryOption === "standard" && "Basic recovery using seed phrases and backup codes."}
                      {recoveryOption === "advanced" && "Advanced recovery requiring multiple signatures from trusted parties."}
                      {recoveryOption === "quantum" && "Future-proof recovery using quantum-resistant cryptographic techniques."}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Label>Storage Redundancy</Label>
                  <Select value={storageRedundancy} onValueChange={(value) => setStorageRedundancy(value as StorageRedundancy)}>
                    <SelectTrigger className="bg-[#222] border-[#444] mt-2">
                      <SelectValue placeholder="Select storage redundancy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Redundancy</SelectItem>
                      <SelectItem value="enhanced">Enhanced Redundancy</SelectItem>
                      <SelectItem value="maximum">Maximum Redundancy</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="p-3 rounded-lg bg-[#252525]/50 border border-[#333] text-xs mt-3">
                    <div className="flex gap-2 items-center mb-2">
                      {storageRedundancy === "standard" && (
                        <Server className="h-4 w-4 text-blue-400" />
                      )}
                      {storageRedundancy === "enhanced" && (
                        <Server className="h-4 w-4 text-indigo-400" />
                      )}
                      {storageRedundancy === "maximum" && (
                        <Server className="h-4 w-4 text-[#FF5AF7]" />
                      )}
                      <span className="font-medium text-gray-200">
                        {storageRedundancy === "standard" && "Standard Protection"}
                        {storageRedundancy === "enhanced" && "Enhanced Protection"}
                        {storageRedundancy === "maximum" && "Maximum Protection"}
                      </span>
                    </div>
                    <p className="text-gray-400">
                      {storageRedundancy === "standard" && "Basic redundancy with single blockchain storage."}
                      {storageRedundancy === "enhanced" && "Enhanced redundancy with dual blockchain storage."}
                      {storageRedundancy === "maximum" && "Maximum security with triple blockchain storage and advanced encryption."}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="border-[#444] hover:bg-[#222]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button
                  onClick={() => setStep(5)}
                  className="bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] hover:from-[#FF4AF0] hover:to-[#8D32FF]"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Step 5: Review & Create */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#FF5AF7] text-white text-sm flex items-center justify-center">5</span>
                Review & Create
              </h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-[#333] rounded-lg">
                  <h3 className="font-bold mb-3">Vault Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      <div>
                        <h4 className="text-sm text-gray-400">Vault Name</h4>
                        <p>{vaultName || "Unnamed Vault"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Security Level</h4>
                        <div className="flex items-center gap-2">
                          <span>{securityScore}%</span>
                          <SecurityBadge score={securityScore} />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Verification Method</h4>
                        <p className="capitalize">{verificationMethod} Verification</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Recovery Option</h4>
                        <p className="capitalize">{recoveryOption} Recovery</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Location Method</h4>
                        <p className="capitalize">{locationMethod === "multiple" ? "Multi-Factor" : locationMethod} Verification</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Time Conditions</h4>
                        <p>{requireTimeCondition ? `${unlockEvents.length} Conditions` : "Disabled"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Geofences</h4>
                        <p>{geoFences.length} Defined</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Trusted Parties</h4>
                        <p>{trustees.length} Added</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Multi-Chain Protection</h4>
                        <p>{multiChainProtection ? "Enabled" : "Disabled"}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-400">Storage Redundancy</h4>
                        <p className="capitalize">{storageRedundancy}</p>
                      </div>
                    </div>
                    
                    {vaultDescription && (
                      <div className="mt-4">
                        <h4 className="text-sm text-gray-400">Description</h4>
                        <p className="text-sm">{vaultDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-[#252525]/50 border border-[#333] rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#333] p-2 rounded-full mt-1">
                      <MapPin className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location-Time Vault Summary</h3>
                      <p className="text-sm text-gray-300 mt-2">
                        Your Location-Time Vault combines advanced geographical security with temporal authentication,
                        creating a dual-factor protection system that requires both the right place and the right time for access.
                      </p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-[#222] p-3 rounded-lg border border-[#444] flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-full bg-[#333]">
                              <MapPin className="h-4 w-4 text-[#FF5AF7]" />
                            </div>
                            <span className="font-medium">Location Security</span>
                          </div>
                          <p className="text-xs text-gray-400 flex-grow">
                            {geoFences.length} geofence{geoFences.length !== 1 ? 's' : ''} with {locationAccuracy}m accuracy
                          </p>
                        </div>
                        
                        <div className="bg-[#222] p-3 rounded-lg border border-[#444] flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-full bg-[#333]">
                              <Clock className="h-4 w-4 text-[#FF5AF7]" />
                            </div>
                            <span className="font-medium">Time Security</span>
                          </div>
                          <p className="text-xs text-gray-400 flex-grow">
                            {requireTimeCondition 
                              ? `${unlockEvents.length} time condition${unlockEvents.length !== 1 ? 's' : ''}` 
                              : "No time restrictions"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#2D114D]/40 to-[#1E0D35]/40 border border-[#444] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#FF5AF7]" />
                      <span className="font-medium">Advanced Security Features</span>
                    </div>
                    <div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < complexityLevel ? "bg-[#FF5AF7]" : "bg-[#444]"}`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${multiChainProtection ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {multiChainProtection && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Multi-Chain Protection</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${verificationMethod === "quantum" ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {verificationMethod === "quantum" && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Quantum-Resistant Encryption</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${locationMethod === "multiple" ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {locationMethod === "multiple" && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Multi-Factor Location Verification</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${trustees.length > 0 ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {trustees.length > 0 && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Trusted Party Access Control</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${storageRedundancy === "maximum" ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {storageRedundancy === "maximum" && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Maximum Storage Redundancy</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 flex items-center justify-center rounded-full ${recoveryOption === "quantum" ? "bg-[#FF5AF7] text-white" : "bg-[#333]"}`}>
                        {recoveryOption === "quantum" && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-sm">Advanced Recovery Mechanisms</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={() => setStep(4)}
                  variant="outline"
                  className="border-[#444] hover:bg-[#222]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                
                <Button
                  onClick={handleCreateVault}
                  className="bg-gradient-to-r from-[#FF5AF7] to-[#9D42FF] hover:from-[#FF4AF0] hover:to-[#8D32FF]"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create Location-Time Vault
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}