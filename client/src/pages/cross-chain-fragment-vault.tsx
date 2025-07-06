import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
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
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Layers, 
  Shield, 
  Check,
  FileSymlink,
  Network,
  RefreshCcw,
  ChevronDown,
  Globe,
  Key,
  ChevronRight,
  User,
  LinkIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

type SupportedChain = "ethereum" | "ton" | "solana" | "bitcoin" | "polygon" | "avalanche" | "tezos";
type FragmentStrategy = "equal" | "dynamic" | "threshold" | "custom";
type AccessControl = "standard" | "multi-sig" | "time-locked" | "geo-restricted" | "dual-factor";
type RecoveryMode = "social" | "algorithmic" | "identity-based" | "emergency";

interface ChainFragment {
  chain: SupportedChain;
  percentage: number;
  address: string;
  autoPeriod: number;
  enabled: boolean;
}

interface AccessRule {
  type: string;
  condition: string;
  enabled: boolean;
}

const CrossChainFragmentVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(20);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState("");
  
  // Basic vault details
  const [vaultName, setVaultName] = useState("My Cross-Chain Fragment Vault");
  const [vaultDescription, setVaultDescription] = useState("");
  const [assetType, setAssetType] = useState<"crypto" | "tokens" | "nft" | "hybrid">("crypto");
  const [totalValue, setTotalValue] = useState("1.0");
  const [fragmentStrategy, setFragmentStrategy] = useState<FragmentStrategy>("equal");
  
  // Chain fragments
  const [fragments, setFragments] = useState<ChainFragment[]>([
    { chain: "ethereum", percentage: 25, address: "", autoPeriod: 7, enabled: true },
    { chain: "ton", percentage: 25, address: "", autoPeriod: 7, enabled: true },
    { chain: "solana", percentage: 25, address: "", autoPeriod: 7, enabled: true },
    { chain: "bitcoin", percentage: 25, address: "", autoPeriod: 7, enabled: true }
  ]);
  
  // Advanced settings
  const [accessControl, setAccessControl] = useState<AccessControl>("standard");
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>("social");
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [customSplitEnabled, setCustomSplitEnabled] = useState(false);
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days from now
  );
  
  // Security settings
  const [doubleEncryptionEnabled, setDoubleEncryptionEnabled] = useState(false);
  const [crossChainValidationEnabled, setCrossChainValidationEnabled] = useState(true);
  const [autoRebalanceEnabled, setAutoRebalanceEnabled] = useState(false);
  const [quantumResistanceEnabled, setQuantumResistanceEnabled] = useState(false);
  const [zkProofEnabled, setZkProofEnabled] = useState(false);
  
  // Fragment rules
  const [accessRules, setAccessRules] = useState<AccessRule[]>([
    { type: "time", condition: "After 30 days", enabled: true },
    { type: "price", condition: "If ETH > $5000", enabled: false },
    { type: "event", condition: "On market crash (>20%)", enabled: false },
    { type: "consensus", condition: "70% of signers approve", enabled: true }
  ]);
  
  // Update progress based on active tab
  React.useEffect(() => {
    switch(activeTab) {
      case "basic":
        setProgress(20);
        break;
      case "fragments":
        setProgress(40);
        break;
      case "access":
        setProgress(60);
        break;
      case "security":
        setProgress(80);
        break;
      case "review":
        setProgress(100);
        break;
    }
  }, [activeTab]);
  
  // Add a new chain fragment
  const addChainFragment = () => {
    // Only allow if there are less than 7 chains
    if (fragments.length >= 7) {
      toast({
        title: "Maximum chains reached",
        description: "You can't add more than 7 blockchain fragments",
        variant: "destructive"
      });
      return;
    }
    
    // Find an unused chain
    const usedChains = fragments.map(f => f.chain);
    const availableChains: SupportedChain[] = ["ethereum", "ton", "solana", "bitcoin", "polygon", "avalanche", "tezos"];
    const unusedChain = availableChains.find(c => !usedChains.includes(c));
    
    if (!unusedChain) return;
    
    // Calculate new percentages for equal distribution
    const newLength = fragments.length + 1;
    const newPercentage = Math.floor(100 / newLength);
    const updatedFragments = fragments.map(f => ({
      ...f,
      percentage: newPercentage
    }));
    
    // Add the new fragment
    updatedFragments.push({
      chain: unusedChain,
      percentage: newPercentage,
      address: "",
      autoPeriod: 7,
      enabled: true
    });
    
    // Fix any rounding issues to ensure total is 100%
    const total = updatedFragments.reduce((sum, f) => sum + f.percentage, 0);
    if (total < 100) {
      updatedFragments[0].percentage += (100 - total);
    } else if (total > 100) {
      updatedFragments[0].percentage -= (total - 100);
    }
    
    setFragments(updatedFragments);
  };
  
  // Remove a chain fragment
  const removeChainFragment = (index: number) => {
    if (fragments.length <= 2) {
      toast({
        title: "Minimum chains required",
        description: "Your vault must have at least 2 blockchain fragments",
        variant: "destructive"
      });
      return;
    }
    
    const updatedFragments = [...fragments];
    updatedFragments.splice(index, 1);
    
    // Recalculate percentages for equal distribution
    const newPercentage = Math.floor(100 / updatedFragments.length);
    const redistributed = updatedFragments.map(f => ({
      ...f,
      percentage: newPercentage
    }));
    
    // Fix any rounding issues
    const total = redistributed.reduce((sum, f) => sum + f.percentage, 0);
    if (total < 100) {
      redistributed[0].percentage += (100 - total);
    } else if (total > 100) {
      redistributed[0].percentage -= (total - 100);
    }
    
    setFragments(redistributed);
  };
  
  // Update a fragment's percentage
  const updateFragmentPercentage = (index: number, value: number) => {
    const newValue = Math.max(1, Math.min(99, value)); // Clamp between 1 and 99
    
    // Calculate the current total
    const currentTotal = fragments.reduce((sum, f, i) => i === index ? sum : sum + f.percentage, 0);
    const available = 100 - currentTotal;
    
    // Ensure we don't exceed 100% total
    const adjustedValue = Math.min(newValue, available);
    
    const updatedFragments = [...fragments];
    updatedFragments[index].percentage = adjustedValue;
    setFragments(updatedFragments);
  };
  
  // Toggle access rule
  const toggleAccessRule = (index: number) => {
    const updatedRules = [...accessRules];
    updatedRules[index].enabled = !updatedRules[index].enabled;
    setAccessRules(updatedRules);
  };
  
  // Get a color for each blockchain
  const getChainColor = (chain: SupportedChain): string => {
    switch(chain) {
      case "ethereum": return "bg-purple-600 dark:bg-purple-700";
      case "ton": return "bg-blue-600 dark:bg-blue-700";
      case "solana": return "bg-green-600 dark:bg-green-700";
      case "bitcoin": return "bg-orange-600 dark:bg-orange-700";
      case "polygon": return "bg-indigo-600 dark:bg-indigo-700";
      case "avalanche": return "bg-red-600 dark:bg-red-700";
      case "tezos": return "bg-cyan-600 dark:bg-cyan-700";
    }
  };
  
  // Calculate total percentage to ensure it's 100%
  const totalPercentage = fragments.reduce((sum, fragment) => sum + fragment.percentage, 0);
  
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
    
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid distribution",
        description: "The total distribution must equal 100%",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure all enabled fragments have addresses
    const missingAddresses = fragments.some(f => f.enabled && !f.address.trim());
    if (missingAddresses) {
      toast({
        title: "Missing addresses",
        description: "Please provide addresses for all enabled blockchain fragments",
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
          const id = `fragment-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Vault Created Successfully",
            description: "Your cross-chain fragment vault is now active across multiple blockchains",
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 150);
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
              <CardTitle className="text-center text-2xl">Cross-Chain Fragment Vault Created!</CardTitle>
              <CardDescription className="text-center">
                Your assets are now securely distributed across multiple blockchain networks
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
                    <p className="text-sm text-gray-500">Blockchains</p>
                    <p className="font-medium">{fragments.filter(f => f.enabled).length} networks</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="font-medium">${totalValue}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Fragment Distribution</h3>
                <div className="space-y-2">
                  {fragments.filter(f => f.enabled).map((fragment, index) => (
                    <div key={`${fragment.chain}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${getChainColor(fragment.chain)} mr-2`}></div>
                        <span className="capitalize">{fragment.chain}</span>
                      </div>
                      <span className="font-medium">{fragment.percentage}%</span>
                    </div>
                  ))}
                </div>
                
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                  {fragments.filter(f => f.enabled).map((fragment, index) => (
                    <div 
                      key={`bar-${fragment.chain}-${index}`}
                      className={`h-full ${getChainColor(fragment.chain)}`}
                      style={{ width: `${fragment.percentage}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                <FileSymlink className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-700 dark:text-blue-400">Cross-Chain Security Active</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-300">
                  Your assets are now protected by multi-chain fragmentation and advanced security protocols. Cross-chain validation is active.
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
                    setProgress(20);
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
              <CardTitle className="text-center">Creating Your Cross-Chain Fragment Vault</CardTitle>
              <CardDescription className="text-center">
                Please wait while we secure your assets across multiple blockchain networks
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{deploymentProgress}%</p>
              </div>
              
              <div className="space-y-4 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Initializing cross-chain vault structure</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 30 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin" />
                  )}
                  <span>Creating fragment shards across {fragments.filter(f => f.enabled).length} blockchains</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 50 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin opacity-60" />
                  )}
                  <span className={deploymentProgress < 50 ? "text-gray-400" : ""}>Establishing cross-chain verification mechanisms</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 70 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 70 ? "text-gray-400" : ""}>Setting up security protocols and access rules</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 90 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 90 ? "text-gray-400" : ""}>Finalizing vault and deploying smart contracts</span>
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
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Create Cross-Chain Fragment Vault
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Distribute your assets across multiple blockchains for maximum security and resilience
              </p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600">Advanced</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === "basic" ? "font-medium text-indigo-600" : ""}>Basics</span>
            <span className={activeTab === "fragments" ? "font-medium text-indigo-600" : ""}>Fragments</span>
            <span className={activeTab === "access" ? "font-medium text-indigo-600" : ""}>Access</span>
            <span className={activeTab === "security" ? "font-medium text-indigo-600" : ""}>Security</span>
            <span className={activeTab === "review" ? "font-medium text-indigo-600" : ""}>Review</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basics</TabsTrigger>
              <TabsTrigger value="fragments">Fragments</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileSymlink className="mr-2 h-5 w-5 text-indigo-500" />
                    Basic Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up the fundamental details for your cross-chain fragment vault
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
                            <SelectItem value="hybrid">Hybrid Assets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="total-value">Total Value (USD)</Label>
                        <div className="flex">
                          <div className="bg-slate-100 dark:bg-slate-800 px-3 flex items-center font-medium border border-r-0 rounded-l-md">
                            $
                          </div>
                          <Input 
                            id="total-value" 
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={totalValue} 
                            onChange={(e) => setTotalValue(e.target.value)} 
                            placeholder="Enter total value"
                            className="rounded-l-none"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Fragment Distribution Strategy</Label>
                      <RadioGroup 
                        value={fragmentStrategy} 
                        onValueChange={(value: any) => setFragmentStrategy(value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      >
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="equal" id="equal" className="mt-1" />
                          <div>
                            <Label htmlFor="equal" className="font-medium cursor-pointer">Equal Distribution</Label>
                            <p className="text-xs text-gray-500">Split evenly across all blockchains</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="dynamic" id="dynamic" className="mt-1" />
                          <div>
                            <Label htmlFor="dynamic" className="font-medium cursor-pointer">Dynamic Allocation</Label>
                            <p className="text-xs text-gray-500">Auto-adjust based on chain performance</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="threshold" id="threshold" className="mt-1" />
                          <div>
                            <Label htmlFor="threshold" className="font-medium cursor-pointer">Threshold Security</Label>
                            <p className="text-xs text-gray-500">Redundant fragments with recovery threshold</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="custom" id="custom" className="mt-1" />
                          <div>
                            <Label htmlFor="custom" className="font-medium cursor-pointer">Custom Allocation</Label>
                            <p className="text-xs text-gray-500">Manually set allocation percentages</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900">
                    <Network className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-indigo-700 dark:text-indigo-400">Cross-Chain Advantage</AlertTitle>
                    <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                      Fragments distribute your assets across multiple blockchains, significantly enhancing security and reducing risk exposure.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("fragments")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="fragments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="mr-2 h-5 w-5 text-indigo-500" />
                    Fragment Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure how your assets are distributed across blockchain networks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Blockchain Fragments</h3>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addChainFragment}
                        className="text-xs h-8"
                      >
                        Add Blockchain
                      </Button>
                    </div>
                  </div>
                  
                  {totalPercentage !== 100 && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>Invalid distribution</AlertTitle>
                      <AlertDescription>
                        Total distribution: {totalPercentage}%. Please adjust to exactly 100%.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    {fragments.map((fragment, index) => (
                      <div 
                        key={`fragment-${index}`} 
                        className="border rounded-lg p-4 space-y-4 relative"
                      >
                        {fragments.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeChainFragment(index)}
                            className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          >
                            ×
                          </Button>
                        )}
                        
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${getChainColor(fragment.chain)} mr-2`}></div>
                          <h4 className="font-medium capitalize">{fragment.chain} Fragment</h4>
                          <div className="ml-auto flex items-center">
                            <Label htmlFor={`fragment-${index}-enabled`} className="mr-2 text-sm">Enabled</Label>
                            <Switch 
                              id={`fragment-${index}-enabled`} 
                              checked={fragment.enabled}
                              onCheckedChange={(checked) => {
                                const updatedFragments = [...fragments];
                                updatedFragments[index].enabled = checked;
                                setFragments(updatedFragments);
                              }}
                            />
                          </div>
                        </div>
                        
                        {fragment.enabled && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`chain-${index}`}>Blockchain</Label>
                                <Select 
                                  value={fragment.chain} 
                                  onValueChange={(value: any) => {
                                    const updatedFragments = [...fragments];
                                    updatedFragments[index].chain = value;
                                    setFragments(updatedFragments);
                                  }}
                                >
                                  <SelectTrigger id={`chain-${index}`}>
                                    <SelectValue placeholder="Select blockchain" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ethereum">Ethereum</SelectItem>
                                    <SelectItem value="ton">TON</SelectItem>
                                    <SelectItem value="solana">Solana</SelectItem>
                                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                    <SelectItem value="polygon">Polygon</SelectItem>
                                    <SelectItem value="avalanche">Avalanche</SelectItem>
                                    <SelectItem value="tezos">Tezos</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`percentage-${index}`}>Allocation Percentage</Label>
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    id={`percentage-${index}`} 
                                    type="number"
                                    min="1"
                                    max="99"
                                    value={fragment.percentage}
                                    onChange={(e) => updateFragmentPercentage(index, parseInt(e.target.value) || 0)}
                                    disabled={fragmentStrategy !== "custom"}
                                    className={fragmentStrategy !== "custom" ? "bg-gray-100 dark:bg-gray-800" : ""}
                                  />
                                  <span className="text-gray-500">%</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`address-${index}`}>Wallet Address</Label>
                              <Input 
                                id={`address-${index}`} 
                                value={fragment.address} 
                                onChange={(e) => {
                                  const updatedFragments = [...fragments];
                                  updatedFragments[index].address = e.target.value;
                                  setFragments(updatedFragments);
                                }} 
                                placeholder={`Enter ${fragment.chain} wallet address`}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`period-${index}`}>Auto-Rebalance Period (Days)</Label>
                              <Select 
                                value={fragment.autoPeriod.toString()} 
                                onValueChange={(value: any) => {
                                  const updatedFragments = [...fragments];
                                  updatedFragments[index].autoPeriod = parseInt(value);
                                  setFragments(updatedFragments);
                                }}
                              >
                                <SelectTrigger id={`period-${index}`}>
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3">3 days</SelectItem>
                                  <SelectItem value="7">7 days</SelectItem>
                                  <SelectItem value="14">14 days</SelectItem>
                                  <SelectItem value="30">30 days</SelectItem>
                                  <SelectItem value="90">90 days</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Distribution Preview</h3>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                      {fragments.filter(f => f.enabled).map((fragment, index) => (
                        <div 
                          key={`preview-${fragment.chain}-${index}`}
                          className={`h-full ${getChainColor(fragment.chain)}`}
                          style={{ width: `${fragment.percentage}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {fragments.filter(f => f.enabled).map((fragment, index) => (
                        <div 
                          key={`legend-${fragment.chain}-${index}`}
                          className="flex items-center text-xs"
                        >
                          <div className={`w-2 h-2 rounded-full ${getChainColor(fragment.chain)} mr-1`}></div>
                          <span className="capitalize">{fragment.chain} ({fragment.percentage}%)</span>
                        </div>
                      ))}
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
                    onClick={() => setActiveTab("access")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="access">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5 text-indigo-500" />
                    Access Control
                  </CardTitle>
                  <CardDescription>
                    Configure who can access your vault and under what conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Access Control Method</Label>
                      <RadioGroup 
                        value={accessControl} 
                        onValueChange={(value: any) => setAccessControl(value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      >
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="standard" id="standard" className="mt-1" />
                          <div>
                            <Label htmlFor="standard" className="font-medium cursor-pointer">Standard Access</Label>
                            <p className="text-xs text-gray-500">Single-key wallet access</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="multi-sig" id="multi-sig" className="mt-1" />
                          <div>
                            <Label htmlFor="multi-sig" className="font-medium cursor-pointer">Multi-Signature</Label>
                            <p className="text-xs text-gray-500">Require multiple approvals to access</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="time-locked" id="time-locked" className="mt-1" />
                          <div>
                            <Label htmlFor="time-locked" className="font-medium cursor-pointer">Time-Locked</Label>
                            <p className="text-xs text-gray-500">Assets unlock at a future date</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="geo-restricted" id="geo-restricted" className="mt-1" />
                          <div>
                            <Label htmlFor="geo-restricted" className="font-medium cursor-pointer">Geo-Restricted</Label>
                            <p className="text-xs text-gray-500">Location-based access controls</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {accessControl === "multi-sig" && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <Label htmlFor="required-signatures">Required Signatures</Label>
                          <div className="flex items-center space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredSignatures(Math.max(2, requiredSignatures - 1))}
                              disabled={requiredSignatures <= 2}
                            >
                              -
                            </Button>
                            <span className="font-medium">{requiredSignatures}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredSignatures(Math.min(5, requiredSignatures + 1))}
                              disabled={requiredSignatures >= 5}
                            >
                              +
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Number of separate approvals required to access the vault
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {accessControl === "time-locked" && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <Label>Unlock Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
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
                      </div>
                    )}
                    
                    {accessControl === "geo-restricted" && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label className="font-medium">Geographical Access Restrictions</Label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center p-2 border rounded-md">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span>North America</span>
                            </div>
                            <div className="flex items-center p-2 border rounded-md">
                              <input type="checkbox" className="mr-2" defaultChecked />
                              <span>Europe</span>
                            </div>
                            <div className="flex items-center p-2 border rounded-md">
                              <input type="checkbox" className="mr-2" />
                              <span>Asia</span>
                            </div>
                            <div className="flex items-center p-2 border rounded-md">
                              <input type="checkbox" className="mr-2" />
                              <span>Other Regions</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Access will be restricted to the selected geographical regions only
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Access Rules</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {accessRules.map((rule, index) => (
                        <div 
                          key={`rule-${index}`}
                          className="flex items-center justify-between border rounded-md p-3"
                        >
                          <div className="flex items-center">
                            <div className="p-1 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-3">
                              <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <p className="font-medium">{rule.condition}</p>
                              <p className="text-xs text-gray-500 capitalize">{rule.type} trigger</p>
                            </div>
                          </div>
                          <Switch 
                            checked={rule.enabled}
                            onCheckedChange={() => toggleAccessRule(index)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Recovery Options</h3>
                    </div>
                    
                    <RadioGroup 
                      value={recoveryMode} 
                      onValueChange={(value: any) => setRecoveryMode(value)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    >
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="social" id="social-recovery" className="mt-1" />
                        <div>
                          <Label htmlFor="social-recovery" className="font-medium cursor-pointer">Social Recovery</Label>
                          <p className="text-xs text-gray-500">Recovery through trusted contacts</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="algorithmic" id="algorithmic" className="mt-1" />
                        <div>
                          <Label htmlFor="algorithmic" className="font-medium cursor-pointer">Algorithmic Recovery</Label>
                          <p className="text-xs text-gray-500">Cryptographic challenge-based recovery</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="identity-based" id="identity-based" className="mt-1" />
                        <div>
                          <Label htmlFor="identity-based" className="font-medium cursor-pointer">Identity Verification</Label>
                          <p className="text-xs text-gray-500">Recover through verified identity</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="emergency" id="emergency" className="mt-1" />
                        <div>
                          <Label htmlFor="emergency" className="font-medium cursor-pointer">Emergency Protocol</Label>
                          <p className="text-xs text-gray-500">Special emergency access procedures</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900">
                    <User className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-indigo-700 dark:text-indigo-400">Access Security Recommendation</AlertTitle>
                    <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                      For maximum security, we recommend multi-signature access with at least one additional access rule and social recovery.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("fragments")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("security")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
                    <Shield className="mr-2 h-5 w-5 text-indigo-500" />
                    Security Features
                  </CardTitle>
                  <CardDescription>
                    Configure advanced security features for your cross-chain vault
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Enhanced Security Options</h3>
                    
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="double-encryption" className="text-base font-medium">Double Encryption Layer</Label>
                            <p className="text-sm text-gray-500">Add a second layer of encryption for maximum protection</p>
                          </div>
                          <Switch 
                            id="double-encryption" 
                            checked={doubleEncryptionEnabled}
                            onCheckedChange={setDoubleEncryptionEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="cross-chain-validation" className="text-base font-medium">Cross-Chain Validation</Label>
                            <p className="text-sm text-gray-500">Validate transactions across multiple chains for authenticity</p>
                          </div>
                          <Switch 
                            id="cross-chain-validation" 
                            checked={crossChainValidationEnabled}
                            onCheckedChange={setCrossChainValidationEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="auto-rebalance" className="text-base font-medium">Automatic Rebalancing</Label>
                            <p className="text-sm text-gray-500">Automatically rebalance assets based on security metrics</p>
                          </div>
                          <Switch 
                            id="auto-rebalance" 
                            checked={autoRebalanceEnabled}
                            onCheckedChange={setAutoRebalanceEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="quantum-resistance" className="text-base font-medium">Quantum-Resistant Encryption</Label>
                            <p className="text-sm text-gray-500">Protect against theoretical quantum computing attacks</p>
                          </div>
                          <Switch 
                            id="quantum-resistance" 
                            checked={quantumResistanceEnabled}
                            onCheckedChange={setQuantumResistanceEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="zk-proof" className="text-base font-medium">Zero-Knowledge Proofs</Label>
                            <p className="text-sm text-gray-500">Enable verification without revealing sensitive data</p>
                          </div>
                          <Switch 
                            id="zk-proof" 
                            checked={zkProofEnabled}
                            onCheckedChange={setZkProofEnabled}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Monitoring</h3>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="font-medium">Real-time Security Monitoring</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">Configure how your vault will be monitored for security risks:</p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" id="anomaly-detection" className="mr-2" defaultChecked />
                              <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="transaction-monitoring" className="mr-2" defaultChecked />
                              <Label htmlFor="transaction-monitoring">Transaction Monitoring</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="blockchain-health" className="mr-2" defaultChecked />
                              <Label htmlFor="blockchain-health">Chain Health Monitoring</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="smart-contract-auditing" className="mr-2" />
                              <Label htmlFor="smart-contract-auditing">Smart Contract Auditing</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="font-medium">Notification Preferences</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">Choose when and how you want to be notified:</p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="security-events">Security Events</Label>
                              <Select defaultValue="all">
                                <SelectTrigger id="security-events" className="w-40">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Events</SelectItem>
                                  <SelectItem value="critical">Critical Only</SelectItem>
                                  <SelectItem value="none">None</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="notification-channel">Notification Channel</Label>
                              <Select defaultValue="email">
                                <SelectTrigger id="notification-channel" className="w-40">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="app">App Notification</SelectItem>
                                  <SelectItem value="both">Both</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="font-medium">Fraud Prevention</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm mb-3">Advanced fraud prevention features:</p>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" id="velocity-checks" className="mr-2" defaultChecked />
                              <Label htmlFor="velocity-checks">Transaction Velocity Checks</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="suspicious-activity" className="mr-2" defaultChecked />
                              <Label htmlFor="suspicious-activity">Suspicious Activity Detection</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="location-checks" className="mr-2" defaultChecked />
                              <Label htmlFor="location-checks">Geographical Location Verification</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="device-fingerprinting" className="mr-2" />
                              <Label htmlFor="device-fingerprinting">Device Fingerprinting</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <Alert className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <AlertTitle className="text-indigo-700 dark:text-indigo-400">Military-Grade Security</AlertTitle>
                    <AlertDescription className="text-indigo-600 dark:text-indigo-300">
                      Our cross-chain fragment vault employs military-grade encryption and distributed security to protect your assets across multiple blockchain networks.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("access")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("review")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
                    <Check className="mr-2 h-5 w-5 text-indigo-500" />
                    Review Your Vault
                  </CardTitle>
                  <CardDescription>
                    Review your cross-chain fragment vault configuration before creating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Basic Information</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium">{vaultName || 'Not specified'}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Asset Type:</span>
                          <span className="font-medium capitalize">{assetType}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Total Value:</span>
                          <span className="font-medium">${totalValue} USD</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Distribution Strategy:</span>
                          <span className="font-medium capitalize">{fragmentStrategy}</span>
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
                      
                      <h3 className="text-lg font-semibold mt-4">Fragment Distribution</h3>
                      <div className="space-y-2">
                        {fragments.filter(f => f.enabled).map((fragment, index) => (
                          <div key={`review-fragment-${index}`} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${getChainColor(fragment.chain)} mr-2`}></div>
                              <span className="capitalize">{fragment.chain}</span>
                            </div>
                            <span>{fragment.percentage}%</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex mt-2">
                        {fragments.filter(f => f.enabled).map((fragment, index) => (
                          <div 
                            key={`review-bar-${fragment.chain}-${index}`}
                            className={`h-full ${getChainColor(fragment.chain)}`}
                            style={{ width: `${fragment.percentage}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Access Configuration</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Access Method:</span>
                          <span className="font-medium capitalize">{accessControl === "multi-sig" ? "Multi-Signature" : accessControl}</span>
                        </p>
                        
                        {accessControl === "multi-sig" && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Required Signatures:</span>
                            <span className="font-medium">{requiredSignatures}</span>
                          </p>
                        )}
                        
                        {accessControl === "time-locked" && unlockDate && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Unlock Date:</span>
                            <span className="font-medium">{format(unlockDate, "PPP")}</span>
                          </p>
                        )}
                        
                        <p className="flex justify-between">
                          <span className="text-gray-500">Recovery Method:</span>
                          <span className="font-medium capitalize">{recoveryMode} Recovery</span>
                        </p>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-4">Active Rules</h3>
                      <div className="space-y-2">
                        {accessRules.filter(r => r.enabled).map((rule, index) => (
                          <div key={`review-rule-${index}`} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>{rule.condition}</span>
                          </div>
                        ))}
                        {accessRules.filter(r => r.enabled).length === 0 && (
                          <p className="text-sm text-gray-500 italic">No custom access rules enabled</p>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-4">Security Features</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          {crossChainValidationEnabled ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                          )}
                          <span className={!crossChainValidationEnabled ? "text-gray-400" : ""}>Cross-Chain Validation</span>
                        </div>
                        <div className="flex items-center">
                          {doubleEncryptionEnabled ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                          )}
                          <span className={!doubleEncryptionEnabled ? "text-gray-400" : ""}>Double Encryption Layer</span>
                        </div>
                        <div className="flex items-center">
                          {autoRebalanceEnabled ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                          )}
                          <span className={!autoRebalanceEnabled ? "text-gray-400" : ""}>Automatic Rebalancing</span>
                        </div>
                        <div className="flex items-center">
                          {quantumResistanceEnabled ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                          )}
                          <span className={!quantumResistanceEnabled ? "text-gray-400" : ""}>Quantum-Resistant Encryption</span>
                        </div>
                        <div className="flex items-center">
                          {zkProofEnabled ? (
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                          )}
                          <span className={!zkProofEnabled ? "text-gray-400" : ""}>Zero-Knowledge Proofs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <LinkIcon className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700 dark:text-amber-400">Important Information</AlertTitle>
                    <AlertDescription className="text-amber-600 dark:text-amber-300">
                      After creation, your assets will be securely distributed across multiple blockchains. Make sure all information is correct before proceeding.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-700 dark:text-blue-400">Cross-Chain Protection</AlertTitle>
                    <AlertDescription className="text-blue-600 dark:text-blue-300">
                      Your assets will be secured across {fragments.filter(f => f.enabled).length} blockchain networks, significantly enhancing security through diversification and redundancy.
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
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Create Cross-Chain Fragment Vault
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

export default CrossChainFragmentVault;