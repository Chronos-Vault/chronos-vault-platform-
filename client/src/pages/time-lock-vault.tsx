import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Clock, 
  Shield, 
  CalendarClock, 
  Layers, 
  Key,
  ChevronDown,
  Check
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TimeLockVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(25);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState("");
  
  // Basic vault details
  const [vaultName, setVaultName] = useState("My Time Lock Vault");
  const [vaultDescription, setVaultDescription] = useState("");
  const [assetType, setAssetType] = useState<"crypto" | "tokens" | "nft" | "document">("crypto");
  const [selectedChain, setSelectedChain] = useState<"ethereum" | "ton" | "solana" | "bitcoin">("ton");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  const [amount, setAmount] = useState("0.1");
  
  // Time lock settings
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days from now
  );
  const [earlyUnlockEnabled, setEarlyUnlockEnabled] = useState(false);
  const [earlyUnlockCondition, setEarlyUnlockCondition] = useState<"emergency" | "threshold" | "vote">("emergency");
  const [securityLevel, setSecurityLevel] = useState<"standard" | "enhanced" | "maximum">("standard");
  
  // Security settings
  const [multiSignatureEnabled, setMultiSignatureEnabled] = useState(false);
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [emergencyKeys, setEmergencyKeys] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [proofOfReserveEnabled, setProofOfReserveEnabled] = useState(false);
  
  // Update progress based on active tab
  React.useEffect(() => {
    switch(activeTab) {
      case "basic":
        setProgress(25);
        break;
      case "time":
        setProgress(50);
        break;
      case "security":
        setProgress(75);
        break;
      case "review":
        setProgress(100);
        break;
    }
  }, [activeTab]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!vaultName.trim()) {
      toast({
        title: "Vault name required",
        description: "Please provide a name for your vault",
        variant: "destructive"
      });
      return;
    }
    
    if (!unlockDate) {
      toast({
        title: "Unlock date required",
        description: "Please select when the vault should unlock",
        variant: "destructive"
      });
      return;
    }
    
    if (unlockDate < new Date()) {
      toast({
        title: "Invalid unlock date",
        description: "The unlock date must be in the future",
        variant: "destructive"
      });
      return;
    }
    
    if (Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to lock",
        variant: "destructive"
      });
      return;
    }
    
    // Start vault deployment process
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 5) + 1;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setIsSuccess(true);
          
          // Generate a random vault ID
          const id = `tlock-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Vault Created Successfully",
            description: "Your time lock vault is now secure until the unlock date",
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 120);
  };
  
  // If vault has been successfully created, show success screen
  if (isSuccess) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-center text-2xl">Time Lock Vault Created!</CardTitle>
              <CardDescription className="text-center">
                Your assets are now securely locked until the specified unlock date
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vault Name</p>
                    <p className="font-medium">{vaultName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vault ID</p>
                    <p className="font-medium">{vaultId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unlock Date</p>
                    <p className="font-medium">{unlockDate ? format(unlockDate, "PPP") : "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Locked</p>
                    <p className="font-medium">{amount} {selectedChain.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <Clock className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Secure Time Lock Active</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-300">
                  Your assets are now secured by military-grade encryption and will be accessible on {unlockDate ? format(unlockDate, "PPP 'at' p") : "the specified date"}.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/vaults')}
                  className="w-full"
                >
                  Go to My Vaults
                </Button>
                <Button 
                  onClick={() => {
                    setIsSuccess(false);
                    setActiveTab("basic");
                    setProgress(25);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create Another Vault
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // If vault is being deployed, show deployment progress
  if (isDeploying) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Creating Your Time Lock Vault</CardTitle>
              <CardDescription className="text-center">
                Please wait while we secure your assets with time lock encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{deploymentProgress}%</p>
              </div>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Initializing vault structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Setting up time lock mechanism</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 40 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
                  )}
                  <span>Configuring security parameters</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 70 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 70 ? "text-gray-400" : ""}>Securing assets on blockchain</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 90 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 90 ? "text-gray-400" : ""}>Finalizing vault deployment</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Main form
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                Create Time Lock Vault
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Lock your assets securely with blockchain technology until a future date
              </p>
            </div>
            <Badge className="ml-auto bg-blue-600">Secure</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === "basic" ? "font-medium text-blue-600" : ""}>Basic Info</span>
            <span className={activeTab === "time" ? "font-medium text-blue-600" : ""}>Time Settings</span>
            <span className={activeTab === "security" ? "font-medium text-blue-600" : ""}>Security</span>
            <span className={activeTab === "review" ? "font-medium text-blue-600" : ""}>Review</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="time">Time Settings</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-blue-500" />
                    Basic Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up the fundamental details for your time-locked vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vault-name">Vault Name</Label>
                      <Input 
                        id="vault-name" 
                        value={vaultName} 
                        onChange={(e) => setVaultName(e.target.value)} 
                        placeholder="Enter vault name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="vault-description">Description (Optional)</Label>
                      <Textarea 
                        id="vault-description" 
                        value={vaultDescription} 
                        onChange={(e) => setVaultDescription(e.target.value)} 
                        placeholder="Add details about this vault's purpose"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Asset Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="asset-type">Asset Type</Label>
                        <Select 
                          value={assetType} 
                          onValueChange={(value: any) => setAssetType(value)}
                        >
                          <SelectTrigger id="asset-type">
                            <SelectValue placeholder="Select asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                            <SelectItem value="tokens">Tokens</SelectItem>
                            <SelectItem value="nft">NFT</SelectItem>
                            <SelectItem value="document">Digital Document</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="blockchain">Blockchain</Label>
                        <Select 
                          value={selectedChain} 
                          onValueChange={(value: any) => setSelectedChain(value)}
                        >
                          <SelectTrigger id="blockchain">
                            <SelectValue placeholder="Select blockchain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="bitcoin">Bitcoin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount to Lock</Label>
                        <div className="flex">
                          <Input 
                            id="amount" 
                            type="number"
                            step="0.0001"
                            min="0"
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="Enter amount"
                            className="rounded-r-none"
                          />
                          <div className="bg-slate-100 dark:bg-slate-800 px-3 flex items-center font-medium border border-l-0 rounded-r-md">
                            {selectedChain.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="beneficiary">Beneficiary Address (Optional)</Label>
                        <Input 
                          id="beneficiary" 
                          value={beneficiaryAddress} 
                          onChange={(e) => setBeneficiaryAddress(e.target.value)} 
                          placeholder="Leave empty to use your wallet address"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("time")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="time">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Time Lock Settings
                  </CardTitle>
                  <CardDescription>
                    Configure when and how assets can be unlocked
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Unlock Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            {unlockDate ? format(unlockDate, "PPP") : "Select unlock date"}
                            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={unlockDate}
                            onSelect={setUnlockDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-gray-500">
                        Assets will be automatically unlocked on this date
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="early-unlock">Enable Early Unlock Conditions</Label>
                        <div className="flex h-6 items-center">
                          <input
                            id="early-unlock"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={earlyUnlockEnabled}
                            onChange={(e) => setEarlyUnlockEnabled(e.target.checked)}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Allow assets to be unlocked before the set date under specific conditions
                      </p>
                    </div>
                    
                    {earlyUnlockEnabled && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <Label>Early Unlock Condition</Label>
                        <RadioGroup 
                          value={earlyUnlockCondition} 
                          onValueChange={(value: any) => setEarlyUnlockCondition(value)}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="emergency" id="emergency" />
                            <Label htmlFor="emergency" className="font-normal cursor-pointer">Emergency Access (requires verification)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="threshold" id="threshold" />
                            <Label htmlFor="threshold" className="font-normal cursor-pointer">Price Threshold Reached</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="vote" id="vote" />
                            <Label htmlFor="vote" className="font-normal cursor-pointer">Multi-signature Approval</Label>
                          </div>
                        </RadioGroup>
                        
                        <p className="text-xs text-gray-500 italic mt-2">
                          {earlyUnlockCondition === "emergency" 
                            ? "Emergency access requires identity verification and security checks" 
                            : earlyUnlockCondition === "threshold" 
                            ? "Vault will unlock if asset price reaches a specified threshold"
                            : "Requires approval from multiple authorized signatures"}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Label htmlFor="security-level">Security Level</Label>
                    <Select 
                      value={securityLevel} 
                      onValueChange={(value: any) => setSecurityLevel(value)}
                    >
                      <SelectTrigger id="security-level">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Security</SelectItem>
                        <SelectItem value="enhanced">Enhanced Security</SelectItem>
                        <SelectItem value="maximum">Maximum Security</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="text-xs text-gray-500 space-y-1 mt-1">
                      {securityLevel === "standard" && (
                        <>
                          <p>• Basic blockchain security with single-key authentication</p>
                          <p>• Standard encryption for data protection</p>
                        </>
                      )}
                      {securityLevel === "enhanced" && (
                        <>
                          <p>• Two-factor authentication for all unlock attempts</p>
                          <p>• Enhanced encryption and additional verification steps</p>
                        </>
                      )}
                      {securityLevel === "maximum" && (
                        <>
                          <p>• Multi-signature requirements and advanced authentication</p>
                          <p>• Military-grade encryption with fallback security systems</p>
                          <p>• Cross-chain verification for maximum protection</p>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("basic")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("security")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-blue-500" />
                    Security Configuration
                  </CardTitle>
                  <CardDescription>
                    Set additional security features for your time-locked vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Multi-Signature Protection</h3>
                        <p className="text-sm text-gray-500">Require multiple signatures to unlock</p>
                      </div>
                      <div className="flex h-6 items-center">
                        <input
                          id="multi-signature"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={multiSignatureEnabled}
                          onChange={(e) => setMultiSignatureEnabled(e.target.checked)}
                        />
                      </div>
                    </div>
                    
                    {multiSignatureEnabled && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <Label htmlFor="required-signatures">Required Signatures</Label>
                          <div className="flex items-center space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredSignatures(Math.max(1, requiredSignatures - 1))}
                              disabled={requiredSignatures <= 1}
                            >
                              -
                            </Button>
                            <span className="font-medium">{requiredSignatures}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredSignatures(requiredSignatures + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Number of separate approvals required to unlock
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Emergency Access Keys</h3>
                        <p className="text-sm text-gray-500">Generate recovery keys for emergencies</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEmergencyKeys(Math.max(0, emergencyKeys - 1))}
                          disabled={emergencyKeys <= 0}
                        >
                          -
                        </Button>
                        <span className="font-medium">{emergencyKeys}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEmergencyKeys(emergencyKeys + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Unlock Notifications</h3>
                        <p className="text-sm text-gray-500">Get notified when vault unlocks or is accessed</p>
                      </div>
                      <div className="flex h-6 items-center">
                        <input
                          id="notifications"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={notificationsEnabled}
                          onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Proof of Reserve</h3>
                        <p className="text-sm text-gray-500">Enable cryptographic proof that assets exist</p>
                      </div>
                      <div className="flex h-6 items-center">
                        <input
                          id="proof-of-reserve"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={proofOfReserveEnabled}
                          onChange={(e) => setProofOfReserveEnabled(e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Security Recommendation</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      For maximum security, we recommend enabling multi-signature protection and at least one emergency access key.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("time")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("review")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-blue-500" />
                    Review Your Vault
                  </CardTitle>
                  <CardDescription>
                    Review your time lock vault configuration before creating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">{vaultName || 'Not specified'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Blockchain:</span>
                          <span className="font-medium capitalize">{selectedChain}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Asset Type:</span>
                          <span className="font-medium capitalize">{assetType}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Amount:</span>
                          <span className="font-medium">{amount} {selectedChain.toUpperCase()}</span>
                        </p>
                      </div>
                      
                      {vaultDescription && (
                        <div className="mt-2">
                          <p className="text-gray-500 mb-1">Description:</p>
                          <p className="text-sm border p-2 rounded bg-gray-50 dark:bg-gray-900">
                            {vaultDescription}
                          </p>
                        </div>
                      )}
                      
                      {beneficiaryAddress && (
                        <div className="mt-2">
                          <p className="text-gray-500 mb-1">Beneficiary:</p>
                          <p className="text-sm font-mono border p-2 rounded bg-gray-50 dark:bg-gray-900 truncate">
                            {beneficiaryAddress}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Time Lock Details</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Unlock Date:</span>
                          <span className="font-medium">{unlockDate ? format(unlockDate, "PPP") : 'Not set'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Security Level:</span>
                          <span className="font-medium capitalize">{securityLevel}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Early Unlock:</span>
                          <span className="font-medium">{earlyUnlockEnabled ? 'Enabled' : 'Disabled'}</span>
                        </p>
                        {earlyUnlockEnabled && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Unlock Condition:</span>
                            <span className="font-medium capitalize">{earlyUnlockCondition}</span>
                          </p>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-4">Security Features</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Multi-Signature:</span>
                          <span className="font-medium">{multiSignatureEnabled ? `Enabled (${requiredSignatures} required)` : 'Disabled'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Emergency Keys:</span>
                          <span className="font-medium">{emergencyKeys}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Notifications:</span>
                          <span className="font-medium">{notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Proof of Reserve:</span>
                          <span className="font-medium">{proofOfReserveEnabled ? 'Enabled' : 'Disabled'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <Key className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700 dark:text-amber-400">Important Information</AlertTitle>
                    <AlertDescription className="text-amber-600 dark:text-amber-300">
                      After creation, the time lock settings cannot be changed. Make sure all information is correct before proceeding.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Layers className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Military-Grade Security</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      Your assets will be secured by blockchain technology and military-grade encryption until the specified unlock date.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("security")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Time Lock Vault
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default TimeLockVault;