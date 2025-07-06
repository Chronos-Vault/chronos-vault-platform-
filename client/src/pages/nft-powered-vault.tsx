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
  Image as ImageIcon,
  Layers,
  Shield,
  Check,
  FileSymlink,
  Flame,
  ChevronDown,
  Lock,
  Star,
  Palette,
  Sparkles,
  Wand2,
  CreditCard,
  Eye,
  Zap
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

type SupportedChain = "ethereum" | "ton" | "solana" | "polygon" | "avalanche" | "flow" | "immutablex";
type NftType = "static" | "dynamic" | "interactive" | "generative" | "fractional";
type AccessType = "ownership" | "staking" | "reputation" | "multi-token" | "hybrid";
type RarityTier = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "unique";

interface VaultFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NftAttribute {
  trait: string;
  value: string;
}

interface NftCollection {
  id: string;
  name: string;
  description: string;
  chain: SupportedChain;
  standard: string;
  floorPrice: number;
  logo: string;
}

const NFTPoweredVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [progress, setProgress] = useState(20);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [vaultId, setVaultId] = useState("");
  
  // Basic vault details
  const [vaultName, setVaultName] = useState("My NFT-Powered Vault");
  const [vaultDescription, setVaultDescription] = useState("");
  const [selectedChain, setSelectedChain] = useState<SupportedChain>("ethereum");
  const [nftType, setNftType] = useState<NftType>("dynamic");
  const [accessType, setAccessType] = useState<AccessType>("ownership");
  const [nftStandard, setNftStandard] = useState("ERC-721");
  
  // NFT Configuration
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [nftCollectionAddress, setNftCollectionAddress] = useState("");
  const [rarityTier, setRarityTier] = useState<RarityTier>("rare");
  const [nftAttributes, setNftAttributes] = useState<NftAttribute[]>([
    { trait: "Background", value: "Nebula" },
    { trait: "Rarity", value: "Rare" },
    { trait: "Access Level", value: "Premium" },
    { trait: "Security Tier", value: "Advanced" }
  ]);
  
  // Vault Access Settings
  const [tokenGatedEnabled, setTokenGatedEnabled] = useState(true);
  const [requiredTokens, setRequiredTokens] = useState(1);
  const [unlockDate, setUnlockDate] = useState<Date | undefined>(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Default: 90 days from now
  );
  const [presetCollection, setPresetCollection] = useState("custom");
  
  // Collection suggestions
  const [popularCollections] = useState<NftCollection[]>([
    {
      id: "bored-ape",
      name: "Bored Ape Yacht Club",
      description: "A collection of 10,000 unique Bored Ape NFTs",
      chain: "ethereum",
      standard: "ERC-721",
      floorPrice: 30.5,
      logo: "🐵"
    },
    {
      id: "crypto-punks",
      name: "CryptoPunks",
      description: "10,000 uniquely generated characters on Ethereum",
      chain: "ethereum",
      standard: "ERC-721",
      floorPrice: 28.2,
      logo: "🤖"
    },
    {
      id: "azuki",
      name: "Azuki",
      description: "A collection of 10,000 anime-inspired avatars",
      chain: "ethereum",
      standard: "ERC-721",
      floorPrice: 8.3,
      logo: "👺"
    },
    {
      id: "degen-toonz",
      name: "Degen Toonz",
      description: "A collection of cartoon characters for the metaverse",
      chain: "ethereum",
      standard: "ERC-721",
      floorPrice: 0.95,
      logo: "🎭"
    },
    {
      id: "ton-diamonds",
      name: "TON Diamonds",
      description: "Exclusive digital diamonds on TON blockchain",
      chain: "ton",
      standard: "TON NFT",
      floorPrice: 12.4,
      logo: "💎"
    }
  ]);
  
  // Advanced Features
  const [features, setFeatures] = useState<VaultFeature[]>([
    {
      id: "dynamic-traits",
      name: "Dynamic Traits",
      description: "NFT attributes evolve based on vault activity",
      enabled: true
    },
    {
      id: "exclusive-content",
      name: "Exclusive Content Access",
      description: "Unlock special content with your NFT",
      enabled: true
    },
    {
      id: "cross-chain-bridge",
      name: "Cross-Chain Bridge",
      description: "Transfer your NFT across multiple blockchains",
      enabled: false
    },
    {
      id: "royalty-distribution",
      name: "Royalty Distribution",
      description: "Earn royalties from vault transactions",
      enabled: false
    },
    {
      id: "fractional-ownership",
      name: "Fractional Ownership",
      description: "Split ownership across multiple NFT holders",
      enabled: false
    },
    {
      id: "metaverse-integration",
      name: "Metaverse Integration",
      description: "Use your vault NFT in partner metaverses",
      enabled: true
    },
    {
      id: "progressive-reveal",
      name: "Progressive Reveal",
      description: "NFT reveals more features over time",
      enabled: true
    },
    {
      id: "quantum-resistant",
      name: "Quantum-Resistant Security",
      description: "Future-proof encryption techniques",
      enabled: false
    }
  ]);
  
  // Security settings
  const [aiSecurityMonitoringEnabled, setAiSecurityMonitoringEnabled] = useState(true);
  const [multiSignatureEnabled, setMultiSignatureEnabled] = useState(false);
  const [requiredSignatures, setRequiredSignatures] = useState(2);
  const [proofOfProvenance, setProofOfProvenance] = useState(true);
  
  // Update progress based on active tab
  React.useEffect(() => {
    switch(activeTab) {
      case "basic":
        setProgress(20);
        break;
      case "nft":
        setProgress(40);
        break;
      case "access":
        setProgress(60);
        break;
      case "features":
        setProgress(80);
        break;
      case "review":
        setProgress(100);
        break;
    }
  }, [activeTab]);
  
  // Add a new NFT attribute
  const addAttribute = () => {
    setNftAttributes([...nftAttributes, { trait: "", value: "" }]);
  };
  
  // Remove an NFT attribute
  const removeAttribute = (index: number) => {
    const updatedAttributes = [...nftAttributes];
    updatedAttributes.splice(index, 1);
    setNftAttributes(updatedAttributes);
  };
  
  // Update an NFT attribute
  const updateAttribute = (index: number, field: "trait" | "value", value: string) => {
    const updatedAttributes = [...nftAttributes];
    updatedAttributes[index][field] = value;
    setNftAttributes(updatedAttributes);
  };
  
  // Toggle a feature
  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };
  
  // Update chain specific settings
  React.useEffect(() => {
    // Update NFT standard based on selected chain
    switch(selectedChain) {
      case "ethereum":
      case "polygon":
        setNftStandard("ERC-721");
        break;
      case "solana":
        setNftStandard("Metaplex");
        break;
      case "ton":
        setNftStandard("TON NFT");
        break;
      case "flow":
        setNftStandard("Flow NFT");
        break;
      case "avalanche":
        setNftStandard("Avalanche NFT");
        break;
      case "immutablex":
        setNftStandard("IMX");
        break;
    }
  }, [selectedChain]);
  
  // Handle preset collection selection
  const handleCollectionSelect = (collectionId: string) => {
    setPresetCollection(collectionId);
    
    if (collectionId === "custom") {
      setNftCollectionAddress("");
      return;
    }
    
    const collection = popularCollections.find(c => c.id === collectionId);
    if (collection) {
      setSelectedChain(collection.chain);
      setNftStandard(collection.standard);
      setNftCollectionAddress(`0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`);
    }
  };
  
  // Get a color for each rarity tier
  const getRarityColor = (tier: RarityTier): string => {
    switch(tier) {
      case "common": return "bg-gray-500";
      case "uncommon": return "bg-green-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-orange-500";
      case "mythic": return "bg-pink-500";
      case "unique": return "bg-red-500";
    }
  };
  
  // Get an emoji for each rarity tier
  const getRarityEmoji = (tier: RarityTier): string => {
    switch(tier) {
      case "common": return "⚪";
      case "uncommon": return "🟢";
      case "rare": return "🔵";
      case "epic": return "🟣";
      case "legendary": return "🟠";
      case "mythic": return "🌟";
      case "unique": return "💎";
    }
  };
  
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
    
    if (tokenGatedEnabled && !nftCollectionAddress.trim()) {
      toast({
        title: "Collection address required",
        description: "Please provide an NFT collection address for token gating",
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
          const id = `nft-${Math.random().toString(36).substring(2, 10)}`;
          setVaultId(id);
          
          toast({
            title: "Vault Created Successfully",
            description: "Your NFT-powered vault is now active and ready to use",
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
              <CardTitle className="text-center text-2xl">NFT-Powered Vault Created!</CardTitle>
              <CardDescription className="text-center">
                Your vault is now secured with digital collectible technology
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
                    <p className="text-sm text-gray-500">Blockchain</p>
                    <p className="font-medium capitalize">{selectedChain}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">NFT Standard</p>
                    <p className="font-medium">{nftStandard}</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Vault Access NFT</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Dynamic NFT with evolving traits</p>
                  </div>
                  <div className="px-2 py-1 rounded-full text-xs font-medium flex items-center" 
                        style={{backgroundColor: `rgba(var(--${getRarityColor(rarityTier).split('-')[1]}-500-rgb), 0.2)`, 
                               color: `var(--${getRarityColor(rarityTier).split('-')[1]}-700)`}}>
                    {getRarityEmoji(rarityTier)} {rarityTier.charAt(0).toUpperCase() + rarityTier.slice(1)}
                  </div>
                </div>
                
                <div className="aspect-square w-full max-w-xs mx-auto mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  {!nftImageUrl ? (
                    <div className="text-center p-4">
                      <Sparkles className="h-12 w-12 mx-auto mb-2 text-white" />
                      <p className="font-medium text-white">Vault Access NFT</p>
                      <p className="text-xs text-white/80 mt-1">#{Math.floor(Math.random() * 10000)}</p>
                      <p className="text-xs font-medium text-white/70 mt-6">Minted on {format(new Date(), "MMM d, yyyy")}</p>
                    </div>
                  ) : (
                    <img src={nftImageUrl} alt="NFT" className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {nftAttributes.map((attr, index) => (
                    <div key={`success-attr-${index}`} className="px-3 py-2 rounded-md bg-white/50 dark:bg-black/20">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{attr.trait}</p>
                      <p className="font-medium">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                <Star className="h-4 w-4 text-purple-500" />
                <AlertTitle className="text-purple-700 dark:text-purple-400">NFT Features Activated</AlertTitle>
                <AlertDescription className="text-purple-600 dark:text-purple-300">
                  Your vault is now tokenized, enabling exclusive features and dynamic security based on your NFT.
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
              <CardTitle className="text-center">Creating Your NFT-Powered Vault</CardTitle>
              <CardDescription className="text-center">
                Please wait while we mint your vault access NFT and configure security
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-full max-w-md mb-6">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out"
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
                  {deploymentProgress >= 30 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
                  )}
                  <span>Generating smart contract</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 50 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-60" />
                  )}
                  <span className={deploymentProgress < 50 ? "text-gray-400" : ""}>Minting vault access NFT</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 70 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-40" />
                  )}
                  <span className={deploymentProgress < 70 ? "text-gray-400" : ""}>Configuring token gate and security settings</span>
                </div>
                <div className="flex items-center gap-3">
                  {deploymentProgress >= 90 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin opacity-20" />
                  )}
                  <span className={deploymentProgress < 90 ? "text-gray-400" : ""}>Finalizing deployment and verifying on chain</span>
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
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Create NFT-Powered Vault
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Secure your assets with digital collectibles and token gating technology
              </p>
            </div>
            <Badge className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600">Premium</Badge>
          </div>
        </motion.div>

        <div className="mb-8">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span className={activeTab === "basic" ? "font-medium text-purple-600" : ""}>Basics</span>
            <span className={activeTab === "nft" ? "font-medium text-purple-600" : ""}>NFT Config</span>
            <span className={activeTab === "access" ? "font-medium text-purple-600" : ""}>Access</span>
            <span className={activeTab === "features" ? "font-medium text-purple-600" : ""}>Features</span>
            <span className={activeTab === "review" ? "font-medium text-purple-600" : ""}>Review</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="basic">Basics</TabsTrigger>
              <TabsTrigger value="nft">NFT Config</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5 text-purple-500" />
                    Basic Configuration
                  </CardTitle>
                  <CardDescription>
                    Set up the fundamental details for your NFT-powered vault
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
                    <h3 className="text-lg font-medium">Blockchain & NFT Type</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                            <SelectItem value="ton">TON</SelectItem>
                            <SelectItem value="solana">Solana</SelectItem>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="avalanche">Avalanche</SelectItem>
                            <SelectItem value="flow">Flow</SelectItem>
                            <SelectItem value="immutablex">Immutable X</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nft-standard">NFT Standard</Label>
                        <Input 
                          id="nft-standard" 
                          value={nftStandard} 
                          readOnly
                          className="bg-gray-50 dark:bg-gray-900"
                        />
                        <p className="text-xs text-gray-500">
                          Standard automatically set based on blockchain
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>NFT Type</Label>
                      <RadioGroup 
                        value={nftType} 
                        onValueChange={(value: any) => setNftType(value)}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      >
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="static" id="static" className="mt-1" />
                          <div>
                            <Label htmlFor="static" className="font-medium cursor-pointer">Static NFT</Label>
                            <p className="text-xs text-gray-500">Standard non-changing digital collectible</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="dynamic" id="dynamic" className="mt-1" />
                          <div>
                            <Label htmlFor="dynamic" className="font-medium cursor-pointer">Dynamic NFT</Label>
                            <p className="text-xs text-gray-500">NFT that evolves based on time or activity</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="interactive" id="interactive" className="mt-1" />
                          <div>
                            <Label htmlFor="interactive" className="font-medium cursor-pointer">Interactive NFT</Label>
                            <p className="text-xs text-gray-500">User-interactive digital asset</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="generative" id="generative" className="mt-1" />
                          <div>
                            <Label htmlFor="generative" className="font-medium cursor-pointer">Generative NFT</Label>
                            <p className="text-xs text-gray-500">Algorithm-generated unique collectible</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                          <RadioGroupItem value="fractional" id="fractional" className="mt-1" />
                          <div>
                            <Label htmlFor="fractional" className="font-medium cursor-pointer">Fractional NFT</Label>
                            <p className="text-xs text-gray-500">Shared ownership NFT with multiple holders</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Access Method</h3>
                    <RadioGroup 
                      value={accessType} 
                      onValueChange={(value: any) => setAccessType(value)}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="ownership" id="ownership" className="mt-1" />
                        <div>
                          <Label htmlFor="ownership" className="font-medium cursor-pointer">Ownership-Based</Label>
                          <p className="text-xs text-gray-500">Access requires ownership of specific NFT</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="staking" id="staking" className="mt-1" />
                        <div>
                          <Label htmlFor="staking" className="font-medium cursor-pointer">Staking-Based</Label>
                          <p className="text-xs text-gray-500">Access requires staking NFT for specified time</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="reputation" id="reputation" className="mt-1" />
                        <div>
                          <Label htmlFor="reputation" className="font-medium cursor-pointer">Reputation-Based</Label>
                          <p className="text-xs text-gray-500">Access requires NFT with specific reputation score</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="multi-token" id="multi-token" className="mt-1" />
                        <div>
                          <Label htmlFor="multi-token" className="font-medium cursor-pointer">Multi-Token</Label>
                          <p className="text-xs text-gray-500">Access requires multiple specific NFTs or tokens</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                        <RadioGroupItem value="hybrid" id="hybrid" className="mt-1" />
                        <div>
                          <Label htmlFor="hybrid" className="font-medium cursor-pointer">Hybrid Access</Label>
                          <p className="text-xs text-gray-500">Customizable combination of multiple access methods</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Palette className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">NFT Access Advantage</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      NFT-powered vaults offer unprecedented control over access and unlock unique functionalities only available to digital collectible owners.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("nft")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="nft">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Flame className="mr-2 h-5 w-5 text-purple-500" />
                    NFT Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your vault's NFT properties and collection settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">NFT Collection</h3>
                    
                    <div className="space-y-3">
                      <Label>Collection Selection</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div 
                          className={cn(
                            "border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900",
                            presetCollection === "custom" ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" : ""
                          )}
                          onClick={() => handleCollectionSelect("custom")}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">🧰</span>
                            {presetCollection === "custom" && <Check className="h-4 w-4 text-purple-500" />}
                          </div>
                          <h4 className="font-medium">Custom Collection</h4>
                          <p className="text-xs text-gray-500">Create your own custom NFT collection</p>
                        </div>
                        
                        {popularCollections.map((collection) => (
                          <div 
                            key={collection.id}
                            className={cn(
                              "border rounded-md p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900",
                              presetCollection === collection.id ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" : ""
                            )}
                            onClick={() => handleCollectionSelect(collection.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{collection.logo}</span>
                              {presetCollection === collection.id && <Check className="h-4 w-4 text-purple-500" />}
                            </div>
                            <h4 className="font-medium">{collection.name}</h4>
                            <p className="text-xs text-gray-500">Floor: {collection.floorPrice} ETH</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="collection-address">Collection Address</Label>
                      <Input 
                        id="collection-address" 
                        value={nftCollectionAddress} 
                        onChange={(e) => setNftCollectionAddress(e.target.value)} 
                        placeholder={`Enter ${selectedChain} collection address`}
                        className={presetCollection !== "custom" ? "bg-gray-50 dark:bg-gray-900" : ""}
                        readOnly={presetCollection !== "custom"}
                      />
                      <p className="text-xs text-gray-500">
                        {presetCollection === "custom" 
                          ? "Enter the address of your NFT collection" 
                          : "Address set based on selected collection"}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">NFT Properties</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAttribute}
                        className="text-xs px-2 py-1 h-8"
                      >
                        Add Attribute
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Rarity Tier</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {(["common", "uncommon", "rare", "epic", "legendary", "mythic", "unique"] as RarityTier[]).map((tier) => (
                          <div 
                            key={tier}
                            className={cn(
                              "border rounded-md p-2 cursor-pointer flex items-center",
                              rarityTier === tier 
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30" 
                                : "hover:bg-slate-50 dark:hover:bg-slate-900"
                            )}
                            onClick={() => setRarityTier(tier)}
                          >
                            <div 
                              className={`w-3 h-3 rounded-full mr-2 ${getRarityColor(tier)}`}
                            ></div>
                            <span className="capitalize">{tier}</span>
                            {rarityTier === tier && (
                              <Check className="h-3 w-3 text-purple-500 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="nft-image">NFT Image URL (Optional)</Label>
                      <Input 
                        id="nft-image" 
                        value={nftImageUrl} 
                        onChange={(e) => setNftImageUrl(e.target.value)} 
                        placeholder="Enter image URL or leave blank for auto-generated NFT"
                      />
                      <p className="text-xs text-gray-500">
                        Leave blank to auto-generate a unique NFT for your vault
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>NFT Attributes</Label>
                      <div className="space-y-3">
                        {nftAttributes.map((attr, index) => (
                          <div key={`attr-${index}`} className="flex gap-3">
                            <div className="flex-1">
                              <Input
                                placeholder="Trait name"
                                value={attr.trait}
                                onChange={(e) => updateAttribute(index, "trait", e.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="Value"
                                value={attr.value}
                                onChange={(e) => updateAttribute(index, "value", e.target.value)}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeAttribute(index)}
                              className="shrink-0"
                              disabled={nftAttributes.length <= 1}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Add traits and properties to make your NFT unique
                      </p>
                    </div>
                  </div>
                  
                  <Alert className="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <AlertTitle className="text-pink-700 dark:text-pink-400">Dynamic NFT Capabilities</AlertTitle>
                    <AlertDescription className="text-pink-600 dark:text-pink-300">
                      With {nftType === "dynamic" ? "Dynamic NFTs" : `${nftType.charAt(0).toUpperCase() + nftType.slice(1)} NFTs`}, your vault's visual representation can evolve based on activity, time, or market conditions, creating a living digital asset tied to your vault's history.
                    </AlertDescription>
                  </Alert>
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                    <Lock className="mr-2 h-5 w-5 text-purple-500" />
                    Access Control
                  </CardTitle>
                  <CardDescription>
                    Configure how users can access your vault using NFTs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Token Gating</h3>
                        <p className="text-sm text-gray-500">Require specific NFTs to access vault</p>
                      </div>
                      <Switch 
                        id="token-gating" 
                        checked={tokenGatedEnabled}
                        onCheckedChange={setTokenGatedEnabled}
                      />
                    </div>
                    
                    {tokenGatedEnabled && (
                      <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <div className="space-y-2">
                          <Label htmlFor="required-tokens">Required NFTs</Label>
                          <div className="flex items-center space-x-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredTokens(Math.max(1, requiredTokens - 1))}
                              disabled={requiredTokens <= 1}
                            >
                              -
                            </Button>
                            <span className="font-medium">{requiredTokens}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setRequiredTokens(requiredTokens + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            Number of required NFTs from the collection to access vault
                          </p>
                        </div>
                        
                        {accessType === "multi-token" && (
                          <div className="mt-4 pt-4 border-t">
                            <Label>Multi-Token Configuration</Label>
                            <div className="flex items-center mt-2 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border">
                              <div className="flex-1">
                                <div className="text-sm font-medium">Primary NFT Collection</div>
                                <p className="text-xs text-gray-500">Collection set in NFT Config tab</p>
                              </div>
                              <Check className="h-4 w-4 text-green-500" />
                            </div>
                            
                            <div className="flex items-center mt-2 px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-dashed">
                              <div className="flex-1">
                                <div className="text-sm font-medium">Secondary Token Requirement</div>
                                <p className="text-xs text-gray-500">Add another token requirement</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Time Lock Settings</Label>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">Time-Lock Vault</h3>
                          <p className="text-sm text-gray-500">Lock assets until a future date</p>
                        </div>
                        <Switch id="time-lock" checked={!!unlockDate} onCheckedChange={(checked) => {
                          if (checked) {
                            setUnlockDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
                          } else {
                            setUnlockDate(undefined);
                          }
                        }} />
                      </div>
                      
                      {unlockDate && (
                        <div className="mt-3">
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
                          <p className="text-xs text-gray-500 mt-1">
                            Assets will be automatically unlocked on this date
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Access Levels</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <div>
                            <h4 className="font-medium flex items-center">
                              <Eye className="h-4 w-4 mr-1 text-blue-500" />
                              View Access
                            </h4>
                            <p className="text-xs text-gray-500">Can view vault information</p>
                          </div>
                          <Badge variant="outline" className="font-normal text-xs">
                            Required: 1 NFT
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <div>
                            <h4 className="font-medium flex items-center">
                              <CreditCard className="h-4 w-4 mr-1 text-purple-500" />
                              Transaction Access
                            </h4>
                            <p className="text-xs text-gray-500">Can make transactions</p>
                          </div>
                          <Badge variant="outline" className="font-normal text-xs">
                            Required: {accessType === "multi-token" ? "2 NFTs" : `${requiredTokens} NFT${requiredTokens > 1 ? 's' : ''}`}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-3">
                          <div>
                            <h4 className="font-medium flex items-center">
                              <Wand2 className="h-4 w-4 mr-1 text-pink-500" />
                              Admin Access
                            </h4>
                            <p className="text-xs text-gray-500">Can modify vault settings</p>
                          </div>
                          <Badge variant="outline" className="font-normal text-xs">
                            Required: {accessType === "multi-token" ? "All NFTs" : `${Math.max(2, requiredTokens)} NFT${Math.max(2, requiredTokens) > 1 ? 's' : ''} + ${rarityTier.charAt(0).toUpperCase() + rarityTier.slice(1)} Tier`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">Token Gating Technology</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      NFT gating provides superior security by ensuring only verified NFT holders can access your vault. This creates an exclusive experience unique to web3 technology.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("nft")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("features")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-purple-500" />
                    Advanced Features
                  </CardTitle>
                  <CardDescription>
                    Enable premium features exclusive to NFT-powered vaults
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Premium NFT Features</h3>
                    
                    <div className="space-y-3">
                      {features.map((feature) => (
                        <div 
                          key={feature.id}
                          className="flex items-center justify-between border rounded-md p-3"
                        >
                          <div>
                            <h4 className="font-medium">{feature.name}</h4>
                            <p className="text-sm text-gray-500">{feature.description}</p>
                          </div>
                          <Switch 
                            checked={feature.enabled}
                            onCheckedChange={() => toggleFeature(feature.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Security Features</h3>
                    
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="ai-security" className="text-base font-medium">AI Security Monitoring</Label>
                            <p className="text-sm text-gray-500">AI-powered anomaly detection and security monitoring</p>
                          </div>
                          <Switch 
                            id="ai-security" 
                            checked={aiSecurityMonitoringEnabled}
                            onCheckedChange={setAiSecurityMonitoringEnabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="multi-signature" className="text-base font-medium">Multi-Signature Protection</Label>
                            <p className="text-sm text-gray-500">Require multiple signatures for high-value transactions</p>
                          </div>
                          <Switch 
                            id="multi-signature" 
                            checked={multiSignatureEnabled}
                            onCheckedChange={setMultiSignatureEnabled}
                          />
                        </div>
                        
                        {multiSignatureEnabled && (
                          <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-900 ml-4">
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
                                Number of separate approvals required for high-value transactions
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between border rounded-md p-4">
                          <div>
                            <Label htmlFor="provenance" className="text-base font-medium">Proof of Provenance</Label>
                            <p className="text-sm text-gray-500">Cryptographic verification of NFT origin and history</p>
                          </div>
                          <Switch 
                            id="provenance" 
                            checked={proofOfProvenance}
                            onCheckedChange={setProofOfProvenance}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced Configuration</h3>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="font-medium">Integration Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" id="marketplace-integration" className="mr-2" defaultChecked />
                              <Label htmlFor="marketplace-integration">Marketplace Integration</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="social-share" className="mr-2" defaultChecked />
                              <Label htmlFor="social-share">Social Sharing</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="metadata-api" className="mr-2" />
                              <Label htmlFor="metadata-api">External Metadata API</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="analytics" className="mr-2" defaultChecked />
                              <Label htmlFor="analytics">Advanced Analytics</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="font-medium">Monetization Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="royalty-fee">Creator Royalty</Label>
                              <Select defaultValue="2.5">
                                <SelectTrigger id="royalty-fee" className="w-24">
                                  <SelectValue placeholder="Fee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">None</SelectItem>
                                  <SelectItem value="1">1%</SelectItem>
                                  <SelectItem value="2.5">2.5%</SelectItem>
                                  <SelectItem value="5">5%</SelectItem>
                                  <SelectItem value="10">10%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="transaction-fee">Transaction Fee</Label>
                              <Select defaultValue="0.5">
                                <SelectTrigger id="transaction-fee" className="w-24">
                                  <SelectValue placeholder="Fee" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">None</SelectItem>
                                  <SelectItem value="0.1">0.1%</SelectItem>
                                  <SelectItem value="0.5">0.5%</SelectItem>
                                  <SelectItem value="1">1%</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger className="font-medium">Display Settings</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input type="checkbox" id="public-visibility" className="mr-2" defaultChecked />
                              <Label htmlFor="public-visibility">Public Visibility</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="display-traits" className="mr-2" defaultChecked />
                              <Label htmlFor="display-traits">Display NFT Traits</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="history-timeline" className="mr-2" defaultChecked />
                              <Label htmlFor="history-timeline">Activity Timeline</Label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" id="animation" className="mr-2" defaultChecked />
                              <Label htmlFor="animation">Enable Animation</Label>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  <Alert className="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <AlertTitle className="text-pink-700 dark:text-pink-400">Premium Features Spotlight</AlertTitle>
                    <AlertDescription className="text-pink-600 dark:text-pink-300">
                      NFT-powered vaults offer exclusive features not available in standard vaults, including digital collectible ownership, token gating, and evolving visual representations of your assets.
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
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
                    <Check className="mr-2 h-5 w-5 text-purple-500" />
                    Review Your Vault
                  </CardTitle>
                  <CardDescription>
                    Review your NFT-powered vault configuration before creating
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
                          <span className="text-gray-500">NFT Standard:</span>
                          <span className="font-medium">{nftStandard}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">NFT Type:</span>
                          <span className="font-medium capitalize">{nftType}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500">Access Type:</span>
                          <span className="font-medium capitalize">{accessType.replace('-', ' ')}</span>
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
                      
                      <h3 className="text-lg font-semibold mt-4">NFT Access</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Token Gating:</span>
                          <span className="font-medium">{tokenGatedEnabled ? 'Enabled' : 'Disabled'}</span>
                        </p>
                        
                        {tokenGatedEnabled && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Required NFTs:</span>
                            <span className="font-medium">{requiredTokens}</span>
                          </p>
                        )}
                        
                        {unlockDate && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Time-Lock Until:</span>
                            <span className="font-medium">{format(unlockDate, "PPP")}</span>
                          </p>
                        )}
                        
                        <p className="flex justify-between">
                          <span className="text-gray-500">Collection:</span>
                          <span className="font-medium">
                            {presetCollection === "custom" 
                              ? "Custom Collection" 
                              : popularCollections.find(c => c.id === presetCollection)?.name || "Not specified"}
                          </span>
                        </p>
                        
                        {nftCollectionAddress && (
                          <p className="flex justify-between">
                            <span className="text-gray-500">Address:</span>
                            <span className="font-medium text-xs sm:text-sm font-mono">
                              {nftCollectionAddress.length > 20 
                                ? `${nftCollectionAddress.slice(0, 10)}...${nftCollectionAddress.slice(-5)}` 
                                : nftCollectionAddress}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">NFT Details</h3>
                      <div className="space-y-1">
                        <p className="flex justify-between">
                          <span className="text-gray-500">Rarity Tier:</span>
                          <span className="font-medium capitalize">
                            {getRarityEmoji(rarityTier)} {rarityTier}
                          </span>
                        </p>
                        
                        <div className="mt-3 mb-1">
                          <span className="text-gray-500">Attributes:</span>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {nftAttributes.map((attr, index) => (
                              <div key={`review-attr-${index}`} className="border rounded p-2 text-sm">
                                <span className="text-gray-500 text-xs">{attr.trait}:</span>
                                <p className="font-medium">{attr.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-4">Enabled Features</h3>
                      <div className="space-y-2">
                        {features.filter(f => f.enabled).map((feature) => (
                          <div key={`review-feature-${feature.id}`} className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>{feature.name}</span>
                          </div>
                        ))}
                        
                        {aiSecurityMonitoringEnabled && (
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>AI Security Monitoring</span>
                          </div>
                        )}
                        
                        {multiSignatureEnabled && (
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>Multi-Signature ({requiredSignatures} signatures)</span>
                          </div>
                        )}
                        
                        {proofOfProvenance && (
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-2" />
                            <span>Proof of Provenance</span>
                          </div>
                        )}
                        
                        {features.filter(f => f.enabled).length === 0 && 
                         !aiSecurityMonitoringEnabled && 
                         !multiSignatureEnabled && 
                         !proofOfProvenance && (
                          <p className="text-sm text-gray-500 italic">No premium features enabled</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <Star className="h-4 w-4 text-amber-500" />
                    <AlertTitle className="text-amber-700 dark:text-amber-400">Important Information</AlertTitle>
                    <AlertDescription className="text-amber-600 dark:text-amber-300">
                      After creation, an NFT will be minted to represent your vault. This NFT can be traded, but only holders will have access to the vault based on your configured settings.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <AlertTitle className="text-purple-700 dark:text-purple-400">NFT-Powered Advantages</AlertTitle>
                    <AlertDescription className="text-purple-600 dark:text-purple-300">
                      Your vault will be represented by a unique digital collectible that evolves with your vault's history. This NFT can be displayed in galleries, used across Web3 applications, and provides token-gated access to your assets.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("features")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Create NFT-Powered Vault
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

export default NFTPoweredVault;