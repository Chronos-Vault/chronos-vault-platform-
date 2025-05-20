import React, { useState, useEffect } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Clock, 
  Shield, 
  Lock, 
  Calendar, 
  Key, 
  CheckCircle2, 
  Layers,
  RefreshCw,
  AlertCircle,
  Zap,
  Network,
  CalendarPlus,
  CalendarRange,
  User,
  Users,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enum for security tiers
enum SecurityTier {
  STANDARD = 'standard',
  ENHANCED = 'enhanced',
  MAXIMUM = 'maximum',
  FORTRESS = 'fortress'
}

// Enum for time lock type
enum TimeLockType {
  FIXED_DATE = 'fixed_date',
  DURATION = 'duration',
  RECURRING = 'recurring',
  CONDITIONAL = 'conditional'
}

// Enum for blockchain network
enum BlockchainNetwork {
  ETHEREUM = 'ethereum',
  SOLANA = 'solana',
  TON = 'ton',
  MULTI_CHAIN = 'multi_chain'
}

const AdvancedTimeLockVault: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [vaultName, setVaultName] = useState<string>('My Time-Lock Vault');
  const [vaultDescription, setVaultDescription] = useState<string>('');
  const [timeLockType, setTimeLockType] = useState<TimeLockType>(TimeLockType.FIXED_DATE);
  const [unlockDate, setUnlockDate] = useState<string>('');
  const [unlockDuration, setUnlockDuration] = useState<number>(30); // days
  const [recurring, setRecurring] = useState<string>('monthly');
  const [recurringDay, setRecurringDay] = useState<number>(1);
  const [securityTier, setSecurityTier] = useState<SecurityTier>(SecurityTier.ENHANCED);
  const [blockchainNetwork, setBlockchainNetwork] = useState<BlockchainNetwork>(BlockchainNetwork.MULTI_CHAIN);
  
  // Advanced settings
  const [enableExtension, setEnableExtension] = useState<boolean>(true);
  const [enableEarlyAccess, setEnableEarlyAccess] = useState<boolean>(false);
  const [enableEmergencyAccess, setEnableEmergencyAccess] = useState<boolean>(true);
  const [earlyAccessFee, setEarlyAccessFee] = useState<number>(5); // percentage
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);
  const [newBeneficiary, setNewBeneficiary] = useState<string>('');
  const [additionalConditions, setAdditionalConditions] = useState<string>('');
  
  // UI state
  const [currentTab, setCurrentTab] = useState<string>('basics');
  const [securityScore, setSecurityScore] = useState<number>(0);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [vaultId, setVaultId] = useState<string>('');
  
  // Calculate security score based on settings
  useEffect(() => {
    let score = 40; // Base score
    
    // Add points for each security feature
    if (securityTier === SecurityTier.ENHANCED) score += 10;
    if (securityTier === SecurityTier.MAXIMUM) score += 20;
    if (securityTier === SecurityTier.FORTRESS) score += 30;
    
    if (blockchainNetwork === BlockchainNetwork.MULTI_CHAIN) score += 15;
    else if (blockchainNetwork === BlockchainNetwork.TON) score += 10;
    else if (blockchainNetwork === BlockchainNetwork.SOLANA) score += 5;
    
    if (timeLockType === TimeLockType.CONDITIONAL) score += 10;
    if (timeLockType === TimeLockType.RECURRING) score += 5;
    
    if (enableEmergencyAccess) score += 5;
    if (!enableEarlyAccess) score += 5; // Early access is a convenience feature, not having it increases security
    if (beneficiaries.length > 0) score += 5;
    if (additionalConditions) score += 5;
    
    // Cap at 100
    setSecurityScore(Math.min(score, 100));
  }, [
    securityTier,
    blockchainNetwork,
    timeLockType,
    enableEmergencyAccess,
    enableEarlyAccess,
    beneficiaries,
    additionalConditions
  ]);
  
  // Add beneficiary
  const addBeneficiary = () => {
    if (newBeneficiary && !beneficiaries.includes(newBeneficiary)) {
      setBeneficiaries([...beneficiaries, newBeneficiary]);
      setNewBeneficiary('');
    }
  };
  
  // Remove beneficiary
  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries.splice(index, 1);
    setBeneficiaries(newBeneficiaries);
  };
  
  // Simulated vault deployment
  const deployVault = () => {
    // Validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your time-lock vault",
        variant: "destructive",
      });
      return;
    }
    
    if (timeLockType === TimeLockType.FIXED_DATE && !unlockDate) {
      toast({
        title: "Unlock date required",
        description: "Please select an unlock date for your time-lock vault",
        variant: "destructive",
      });
      return;
    }
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const deployInterval = setInterval(() => {
      setDeploymentProgress(prev => {
        if (prev >= 100) {
          clearInterval(deployInterval);
          setIsDeploying(false);
          setIsSuccess(true);
          
          // Generate fake vault ID
          const randomHex = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
          setVaultId(`tlv-${randomHex}`);
          
          toast({
            title: "Vault created successfully",
            description: "Your advanced time-lock vault has been deployed",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };
  
  // Get security tier description
  const getSecurityTierDescription = (tier: SecurityTier) => {
    switch(tier) {
      case SecurityTier.STANDARD:
        return "Basic time-lock security with essential protections";
      case SecurityTier.ENHANCED:
        return "Advanced time-lock security with additional safety features";
      case SecurityTier.MAXIMUM:
        return "High-security implementation with Triple-Chain Security™";
      case SecurityTier.FORTRESS:
        return "Maximum security with quantum-resistant encryption and advanced protocols";
      default:
        return "";
    }
  };
  
  // Get time lock type description
  const getTimeLockTypeDescription = (type: TimeLockType) => {
    switch(type) {
      case TimeLockType.FIXED_DATE:
        return "Unlocks on a specific date and time";
      case TimeLockType.DURATION:
        return "Unlocks after a set period of time from creation";
      case TimeLockType.RECURRING:
        return "Creates periodic unlock windows on a schedule";
      case TimeLockType.CONDITIONAL:
        return "Unlocks based on specific conditions or events";
      default:
        return "";
    }
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
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#6B00D7]/20 mb-8">
            <CheckCircle2 className="h-12 w-12 text-[#6B00D7]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Time-Lock Vault Created!</h1>
          <p className="text-xl text-gray-300 mb-8">
            Your vault has been successfully deployed on {blockchainNetwork === BlockchainNetwork.MULTI_CHAIN ? 'multiple blockchains' : blockchainNetwork}.
          </p>
          
          <Card className="bg-[#151515] border-[#333] mb-8">
            <CardHeader>
              <CardTitle>Vault Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-md mb-4">
                <div className="font-mono text-sm text-gray-300">{vaultId}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(vaultId);
                    toast({
                      title: "Vault ID copied",
                      description: "Vault ID copied to clipboard",
                    });
                  }}
                  className="text-[#6B00D7] hover:text-[#8B20F7] hover:bg-[#6B00D7]/10"
                >
                  Copy ID
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Unlock Type</p>
                  <p className="text-white">
                    {timeLockType === TimeLockType.FIXED_DATE ? 'Fixed Date' : 
                     timeLockType === TimeLockType.DURATION ? 'Time Duration' : 
                     timeLockType === TimeLockType.RECURRING ? 'Recurring Schedule' : 
                     'Conditional'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Security Level</p>
                  <p className="text-white">{securityTier.charAt(0).toUpperCase() + securityTier.slice(1)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Blockchain</p>
                  <p className="text-white">
                    {blockchainNetwork === BlockchainNetwork.MULTI_CHAIN ? 'Multi-Chain' : 
                     blockchainNetwork.charAt(0).toUpperCase() + blockchainNetwork.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="text-white">{securityScore}/100</p>
                </div>
                
                {timeLockType === TimeLockType.FIXED_DATE && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Unlock Date</p>
                    <p className="text-white">{unlockDate}</p>
                  </div>
                )}
                
                {timeLockType === TimeLockType.DURATION && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Unlock After</p>
                    <p className="text-white">{unlockDuration} days from creation</p>
                  </div>
                )}
                
                {timeLockType === TimeLockType.RECURRING && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Recurring Schedule</p>
                    <p className="text-white">
                      {recurring === 'daily' ? 'Daily' : 
                       recurring === 'weekly' ? `Weekly (day ${recurringDay})` : 
                       recurring === 'monthly' ? `Monthly (day ${recurringDay})` : 
                       `Quarterly (day ${recurringDay})`}
                    </p>
                  </div>
                )}
                
                {beneficiaries.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Beneficiaries</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {beneficiaries.map((b, i) => (
                        <Badge key={i} variant="outline" className="bg-[#1A1A1A]">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/dashboard">
              <Button 
                className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white px-8 py-6 h-auto text-lg rounded-xl shadow-lg"
              >
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline"
              className="border-[#6B00D7]/50 text-[#6B00D7] hover:bg-[#6B00D7]/10"
              onClick={() => {
                setIsSuccess(false);
                setVaultName('My Time-Lock Vault');
                setVaultDescription('');
                setDeploymentProgress(0);
                setVaultId('');
                setCurrentTab('basics');
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
          <Button variant="ghost" className="mb-4 hover:bg-[#6B00D7]/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault Types
          </Button>
        </Link>

        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
            Advanced Time-Lock Vault
          </h1>
        </div>
        
        <p className="text-lg text-gray-300 max-w-3xl">
          Create a sophisticated vault with customizable time-based restrictions and enhanced security features to protect your digital assets.
        </p>
        
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-[#6B00D7]/20 text-[#6B00D7] border-[#6B00D7]/50">
            <Clock className="h-3 w-3 mr-1" /> Time-Based Access
          </Badge>
          <Badge variant="secondary" className="bg-[#FF5AF7]/20 text-[#FF5AF7] border-[#FF5AF7]/50">
            <Shield className="h-3 w-3 mr-1" /> Triple Chain Security
          </Badge>
          <Badge variant="secondary" className="bg-[#00E5A0]/20 text-[#00E5A0] border-[#00E5A0]/50">
            <CalendarRange className="h-3 w-3 mr-1" /> Flexible Schedules
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
              <TabsTrigger value="basics" className="data-[state=active]:bg-[#6B00D7]/30">
                <div className="flex flex-col items-center py-1">
                  <Clock className="h-5 w-5 mb-1" />
                  <span>Basics</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#FF5AF7]/30">
                <div className="flex flex-col items-center py-1">
                  <Lock className="h-5 w-5 mb-1" />
                  <span>Security</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-[#00E5A0]/30">
                <div className="flex flex-col items-center py-1">
                  <Shield className="h-5 w-5 mb-1" />
                  <span>Advanced</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basics" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Basic Settings</h2>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="vaultName">Vault Name</Label>
                    <Input 
                      id="vaultName"
                      value={vaultName}
                      onChange={(e) => setVaultName(e.target.value)}
                      placeholder="My Time-Lock Vault"
                      className="bg-[#1A1A1A] border-[#333]"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="vaultDescription">Vault Description (Optional)</Label>
                    <Textarea 
                      id="vaultDescription"
                      value={vaultDescription}
                      onChange={(e) => setVaultDescription(e.target.value)}
                      placeholder="Describe the purpose of this vault..."
                      className="bg-[#1A1A1A] border-[#333] min-h-[100px]"
                    />
                  </div>
                </div>
                
                <Separator className="my-6 bg-gray-800" />
                
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">Time-Lock Configuration</h2>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Time-Lock Type</Label>
                      <RadioGroup 
                        value={timeLockType} 
                        onValueChange={(value) => setTimeLockType(value as TimeLockType)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={TimeLockType.FIXED_DATE} id="fixed-date" />
                          <Label htmlFor="fixed-date" className="flex items-center cursor-pointer">
                            <Calendar className="h-4 w-4 mr-2 text-[#6B00D7]" />
                            Fixed Date
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={TimeLockType.DURATION} id="duration" />
                          <Label htmlFor="duration" className="flex items-center cursor-pointer">
                            <Clock className="h-4 w-4 mr-2 text-[#FF5AF7]" />
                            Duration
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={TimeLockType.RECURRING} id="recurring" />
                          <Label htmlFor="recurring" className="flex items-center cursor-pointer">
                            <CalendarPlus className="h-4 w-4 mr-2 text-[#00E5A0]" />
                            Recurring
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={TimeLockType.CONDITIONAL} id="conditional" />
                          <Label htmlFor="conditional" className="flex items-center cursor-pointer">
                            <Zap className="h-4 w-4 mr-2 text-[#FFC107]" />
                            Conditional
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <p className="text-sm text-gray-400">
                      {getTimeLockTypeDescription(timeLockType)}
                    </p>
                    
                    {timeLockType === TimeLockType.FIXED_DATE && (
                      <div className="grid gap-2">
                        <Label htmlFor="unlockDate">Unlock Date</Label>
                        <Input 
                          id="unlockDate" 
                          type="date" 
                          value={unlockDate}
                          onChange={(e) => setUnlockDate(e.target.value)}
                          className="bg-[#1A1A1A] border-[#333]"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    )}
                    
                    {timeLockType === TimeLockType.DURATION && (
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <Label htmlFor="unlockDuration">Lock Duration (Days)</Label>
                          <span className="text-sm text-gray-400">{unlockDuration} days</span>
                        </div>
                        <Slider 
                          id="unlockDuration"
                          min={1}
                          max={365}
                          step={1}
                          value={[unlockDuration]}
                          onValueChange={(value) => setUnlockDuration(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 day</span>
                          <span>180 days</span>
                          <span>365 days</span>
                        </div>
                      </div>
                    )}
                    
                    {timeLockType === TimeLockType.RECURRING && (
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="recurring">Recurring Schedule</Label>
                          <Select 
                            value={recurring}
                            onValueChange={(value) => setRecurring(value)}
                          >
                            <SelectTrigger className="bg-[#1A1A1A] border-[#333]">
                              <SelectValue placeholder="Select schedule" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {recurring !== 'daily' && (
                          <div className="grid gap-2">
                            <div className="flex justify-between">
                              <Label htmlFor="recurringDay">
                                {recurring === 'weekly' ? 'Day of Week' : 'Day of Month'}
                              </Label>
                              <span className="text-sm text-gray-400">
                                Day {recurringDay}
                              </span>
                            </div>
                            <Slider 
                              id="recurringDay"
                              min={1}
                              max={recurring === 'weekly' ? 7 : 28}
                              step={1}
                              value={[recurringDay]}
                              onValueChange={(value) => setRecurringDay(value[0])}
                              className="py-4"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>1</span>
                              <span>{recurring === 'weekly' ? 7 : 28}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {timeLockType === TimeLockType.CONDITIONAL && (
                      <div className="grid gap-2">
                        <Label htmlFor="additionalConditions">Unlock Conditions</Label>
                        <Textarea 
                          id="additionalConditions"
                          value={additionalConditions}
                          onChange={(e) => setAdditionalConditions(e.target.value)}
                          placeholder="Describe conditions that must be met for unlocking (e.g., price thresholds, external events)..."
                          className="bg-[#1A1A1A] border-[#333] min-h-[100px]"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          These conditions will be encoded as smart contract logic in the vault.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Security Configuration</h2>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Security Tier</Label>
                    <RadioGroup 
                      value={securityTier} 
                      onValueChange={(value) => setSecurityTier(value as SecurityTier)}
                      className="grid gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={SecurityTier.STANDARD} id="standard" />
                        <Label htmlFor="standard" className="flex items-center cursor-pointer">
                          <Lock className="h-4 w-4 mr-2 text-blue-400" />
                          Standard Security
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={SecurityTier.ENHANCED} id="enhanced" />
                        <Label htmlFor="enhanced" className="flex items-center cursor-pointer">
                          <Shield className="h-4 w-4 mr-2 text-purple-400" />
                          Enhanced Security
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={SecurityTier.MAXIMUM} id="maximum" />
                        <Label htmlFor="maximum" className="flex items-center cursor-pointer">
                          <Layers className="h-4 w-4 mr-2 text-pink-400" />
                          Maximum Security
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={SecurityTier.FORTRESS} id="fortress" />
                        <Label htmlFor="fortress" className="flex items-center cursor-pointer">
                          <Zap className="h-4 w-4 mr-2 text-amber-400" />
                          Fortress Security
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <p className="text-sm text-gray-400 mt-1">
                      {getSecurityTierDescription(securityTier)}
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Blockchain Network</Label>
                    <RadioGroup 
                      value={blockchainNetwork} 
                      onValueChange={(value) => setBlockchainNetwork(value as BlockchainNetwork)}
                      className="grid gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={BlockchainNetwork.ETHEREUM} id="ethereum" />
                        <Label htmlFor="ethereum" className="flex items-center cursor-pointer">
                          <Network className="h-4 w-4 mr-2 text-blue-400" />
                          Ethereum
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={BlockchainNetwork.SOLANA} id="solana" />
                        <Label htmlFor="solana" className="flex items-center cursor-pointer">
                          <Network className="h-4 w-4 mr-2 text-purple-400" />
                          Solana
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={BlockchainNetwork.TON} id="ton" />
                        <Label htmlFor="ton" className="flex items-center cursor-pointer">
                          <Network className="h-4 w-4 mr-2 text-cyan-400" />
                          TON
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={BlockchainNetwork.MULTI_CHAIN} id="multi-chain" />
                        <Label htmlFor="multi-chain" className="flex items-center cursor-pointer">
                          <Layers className="h-4 w-4 mr-2 text-pink-400" />
                          Multi-Chain (Triple-Chain Security™)
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {blockchainNetwork === BlockchainNetwork.MULTI_CHAIN && (
                      <p className="text-sm text-gray-400 mt-1">
                        Uses our patented Triple-Chain Security™ architecture to distribute security across multiple blockchains
                      </p>
                    )}
                  </div>
                  
                  <Separator className="my-2 bg-gray-800" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Emergency Access</Label>
                        <p className="text-sm text-gray-400">
                          Allow trusted contacts to access vault in emergencies
                        </p>
                      </div>
                      <Switch 
                        checked={enableEmergencyAccess}
                        onCheckedChange={setEnableEmergencyAccess}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Early Access Option</Label>
                        <p className="text-sm text-gray-400">
                          Allow early access for a fee (reduces security score)
                        </p>
                      </div>
                      <Switch 
                        checked={enableEarlyAccess}
                        onCheckedChange={setEnableEarlyAccess}
                      />
                    </div>
                    
                    {enableEarlyAccess && (
                      <div className="grid gap-2 pl-6 border-l-2 border-[#333] ml-2">
                        <div className="flex justify-between">
                          <Label htmlFor="earlyAccessFee">Early Access Fee (%)</Label>
                          <span className="text-sm text-gray-400">{earlyAccessFee}%</span>
                        </div>
                        <Slider 
                          id="earlyAccessFee"
                          min={1}
                          max={20}
                          step={1}
                          value={[earlyAccessFee]}
                          onValueChange={(value) => setEarlyAccessFee(value[0])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1%</span>
                          <span>10%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Extension Option</Label>
                        <p className="text-sm text-gray-400">
                          Allow extending the lock period after creation
                        </p>
                      </div>
                      <Switch 
                        checked={enableExtension}
                        onCheckedChange={setEnableExtension}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Unlock Notifications</Label>
                        <p className="text-sm text-gray-400">
                          Send notifications about upcoming unlock events
                        </p>
                      </div>
                      <Switch 
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Advanced Settings</h2>
                
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label>Beneficiaries</Label>
                    <p className="text-sm text-gray-400">
                      Add wallet addresses that can access the vault after unlocking conditions are met
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-2 mt-2">
                      <Input 
                        value={newBeneficiary}
                        onChange={(e) => setNewBeneficiary(e.target.value)}
                        placeholder="Enter wallet address"
                        className="bg-[#1A1A1A] border-[#333]"
                      />
                      <Button 
                        onClick={addBeneficiary}
                        variant="secondary"
                        className="bg-[#6B00D7] text-white hover:bg-[#5900B3]"
                      >
                        Add
                      </Button>
                    </div>
                    
                    {beneficiaries.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <Label>Added Beneficiaries</Label>
                        <div className="bg-[#1A1A1A] rounded-md border border-[#333] p-2">
                          {beneficiaries.map((beneficiary, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-[#333] last:border-b-0">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm font-mono">{beneficiary}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeBeneficiary(index)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {securityTier === SecurityTier.FORTRESS && (
                    <div className="p-4 border border-[#333] rounded-md bg-gradient-to-r from-[#1A1A1A] to-[#2A1A3A]">
                      <h3 className="text-lg font-medium flex items-center text-[#FF5AF7] mb-2">
                        <Shield className="h-5 w-5 mr-2" />
                        Fortress Security Features Enabled
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-[#00E5A0] mt-0.5" />
                          Quantum-resistant encryption algorithms
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-[#00E5A0] mt-0.5" />
                          Zero-knowledge privacy shield
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-[#00E5A0] mt-0.5" />
                          Triple-Chain verification with redundancy
                        </li>
                        <li className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-[#00E5A0] mt-0.5" />
                          Behavioral anomaly detection
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right Column - Summary and Action */}
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle>Vault Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security Score</span>
                  <span className="font-medium">{securityScore}/100</span>
                </div>
                <Progress value={securityScore} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Security Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${securityTier !== SecurityTier.STANDARD ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span className={securityTier !== SecurityTier.STANDARD ? 'text-gray-300' : 'text-gray-500'}>
                      Advanced Security
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${blockchainNetwork === BlockchainNetwork.MULTI_CHAIN ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span className={blockchainNetwork === BlockchainNetwork.MULTI_CHAIN ? 'text-gray-300' : 'text-gray-500'}>
                      Multi-Chain
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${enableEmergencyAccess ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span className={enableEmergencyAccess ? 'text-gray-300' : 'text-gray-500'}>
                      Emergency Access
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className={`w-2 h-2 rounded-full mr-2 ${beneficiaries.length > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span className={beneficiaries.length > 0 ? 'text-gray-300' : 'text-gray-500'}>
                      Beneficiaries
                    </span>
                  </div>
                </div>
              </div>
              
              <Separator className="my-2 bg-gray-800" />
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="font-medium">
                    {timeLockType === TimeLockType.FIXED_DATE ? 'Fixed Date' : 
                     timeLockType === TimeLockType.DURATION ? 'Duration' : 
                     timeLockType === TimeLockType.RECURRING ? 'Recurring' : 
                     'Conditional'}
                  </span>
                </div>
                
                {timeLockType === TimeLockType.FIXED_DATE && unlockDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Unlocks</span>
                    <span className="font-medium">{unlockDate}</span>
                  </div>
                )}
                
                {timeLockType === TimeLockType.DURATION && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Lock Period</span>
                    <span className="font-medium">{unlockDuration} days</span>
                  </div>
                )}
                
                {timeLockType === TimeLockType.RECURRING && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Schedule</span>
                    <span className="font-medium">
                      {recurring === 'daily' ? 'Daily' : 
                       recurring === 'weekly' ? `Weekly (day ${recurringDay})` : 
                       recurring === 'monthly' ? `Monthly (day ${recurringDay})` : 
                       `Quarterly (day ${recurringDay})`}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Security</span>
                  <span className="font-medium">
                    {securityTier.charAt(0).toUpperCase() + securityTier.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Blockchain</span>
                  <span className="font-medium">
                    {blockchainNetwork === BlockchainNetwork.MULTI_CHAIN ? 'Multi-Chain' : 
                     blockchainNetwork.charAt(0).toUpperCase() + blockchainNetwork.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Beneficiaries</span>
                  <span className="font-medium">{beneficiaries.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                onClick={deployVault}
                disabled={isDeploying}
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating Vault...
                  </>
                ) : (
                  'Create Vault'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {isDeploying && (
            <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
              <CardContent className="pt-6">
                <h3 className="text-center font-medium mb-4">Deploying Vault</h3>
                <Progress value={deploymentProgress} className="h-2 mb-2" />
                <p className="text-xs text-center text-gray-400">{deploymentProgress}% Complete</p>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 mr-2 text-[#6B00D7]" /> Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-400 mt-0.5" />
                <p className="text-gray-300">Choose longer lock periods for enhanced security</p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-400 mt-0.5" />
                <p className="text-gray-300">Add multiple beneficiaries as recovery options</p>
              </div>
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-400 mt-0.5" />
                <p className="text-gray-300">Use Triple-Chain Security™ for critical assets</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedTimeLockVault;