import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Brain, Wallet, CheckCircle2, AlertTriangle, Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

// Define the schema for inheritance intent vault creation
const intentVaultFormSchema = z.object({
  name: z.string().min(3, "Vault name must be at least 3 characters"),
  intent: z.string().min(20, "Please describe your inheritance intentions in detail (minimum 20 characters)"),
  primaryChain: z.string().min(1, "Please select a primary blockchain"),
  conditions: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })).optional(),
  beneficiaries: z.array(z.object({
    address: z.string(),
    share: z.number().min(0).max(100),
    relationship: z.string().optional(),
  })).min(1, "At least one beneficiary is required"),
});

type IntentVaultFormValues = z.infer<typeof intentVaultFormSchema>;

// Example conditions that can be added to the intent
const conditionExamples = [
  {
    type: "time",
    name: "Time-Based",
    description: "Assets are unlocked after a specific date or time period",
    example: "My assets should be unlocked on my child's 18th birthday in 2030"
  },
  {
    type: "multi-sig",
    name: "Multi-Signature",
    description: "Requires approval from multiple trusted parties",
    example: "Release my assets only if both my spouse and lawyer approve"
  },
  {
    type: "market",
    name: "Market Conditions",
    description: "Assets are unlocked based on market or financial triggers",
    example: "Release assets when Bitcoin reaches $500,000"
  },
  {
    type: "geolocation",
    name: "Geographic",
    description: "Adds location-based requirements for asset access",
    example: "My heir must physically be in New York City to access funds"
  },
  {
    type: "milestone",
    name: "Life Milestone",
    description: "Unlocked upon specific life events of beneficiaries",
    example: "Release assets upon my child's college graduation"
  }
];

const IntentInheritanceVault: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { isAnyWalletConnected, connectChain, walletInfo, chainStatus } = useMultiChain();
  
  const [isCreating, setIsCreating] = useState(false);
  const [activeBlockchain, setActiveBlockchain] = useState<BlockchainType>(BlockchainType.ETH);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [inheritancePlan, setInheritancePlan] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [planId, setPlanId] = useState<string | null>(null);
  const [showSmartContractCode, setShowSmartContractCode] = useState(false);
  const [smartContractCode, setSmartContractCode] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  // Initialize form with default values
  const form = useForm<IntentVaultFormValues>({
    resolver: zodResolver(intentVaultFormSchema),
    defaultValues: {
      name: "",
      intent: "",
      primaryChain: BlockchainType.ETH,
      beneficiaries: [
        {
          address: "",
          share: 100,
          relationship: "self",
        },
      ],
    },
  });

  // Format display address for readability
  const formatAddress = (address: string) => {
    if (!address) return "";
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Check if wallet is connected for the selected blockchain
  const isWalletConnected = (blockchain: BlockchainType): boolean => {
    return chainStatus[blockchain]?.isConnected || false;
  };

  // Handle blockchain selection
  const handleBlockchainChange = (value: string) => {
    const chain = value as BlockchainType;
    setActiveBlockchain(chain);
    form.setValue("primaryChain", value);
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    setIsConnectingWallet(true);
    try {
      await connectChain(activeBlockchain);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${activeBlockchain} wallet`,
      });
      
      // Update first beneficiary with wallet address if empty
      const beneficiaries = form.getValues("beneficiaries");
      if (beneficiaries && beneficiaries.length > 0 && !beneficiaries[0].address) {
        const currentWalletInfo = walletInfo[activeBlockchain as keyof typeof walletInfo];
        if (currentWalletInfo?.address) {
          const updatedBeneficiaries = [...beneficiaries];
          updatedBeneficiaries[0].address = currentWalletInfo.address;
          form.setValue("beneficiaries", updatedBeneficiaries);
        }
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${activeBlockchain} wallet`,
        variant: "destructive",
      });
    } finally {
      setIsConnectingWallet(false);
    }
  };

  // Add a new beneficiary
  const addBeneficiary = () => {
    const beneficiaries = form.getValues("beneficiaries") || [];
    const totalShareSoFar = beneficiaries.reduce((sum, b) => sum + b.share, 0);
    
    form.setValue("beneficiaries", [
      ...beneficiaries, 
      { 
        address: "", 
        share: totalShareSoFar < 100 ? 100 - totalShareSoFar : 0,
        relationship: "" 
      }
    ]);
  };

  // Remove a beneficiary
  const removeBeneficiary = (index: number) => {
    const beneficiaries = form.getValues("beneficiaries");
    const updatedBeneficiaries = beneficiaries.filter((_, i) => i !== index);
    form.setValue("beneficiaries", updatedBeneficiaries);
  };

  // First step: Create the initial inheritance plan
  const createInheritancePlan = async (data: IntentVaultFormValues) => {
    setIsCreating(true);
    try {
      // Ensure wallet is connected
      if (!isWalletConnected(activeBlockchain)) {
        throw new Error("Wallet must be connected to create an inheritance vault");
      }

      // Create the inheritance plan
      const response = await apiRequest("POST", "/api/intent-inheritance/create", {
        name: data.name,
        intent: data.intent,
        primaryChain: data.primaryChain,
        ownerAddress: walletInfo[activeBlockchain as keyof typeof walletInfo]?.address,
        beneficiaries: data.beneficiaries
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create inheritance plan");
      }

      const planData = await response.json();
      setPlanId(planData.planId);
      setInheritancePlan(planData);
      
      toast({
        title: "Inheritance Plan Created",
        description: "Your intent has been processed. Now let's verify the AI interpretation.",
      });

      setStep(2);
    } catch (error: any) {
      toast({
        title: "Plan Creation Failed",
        description: error.message || "Something went wrong while creating your inheritance plan",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Second step: Verify the inheritance plan
  const verifyInheritancePlan = async () => {
    if (!planId) {
      toast({
        title: "Error",
        description: "No inheritance plan found to verify",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await apiRequest("POST", `/api/intent-inheritance/${planId}/verify`, {});
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify inheritance plan");
      }

      const verificationData = await response.json();
      setVerificationResult(verificationData);
      
      toast({
        title: "Verification Complete",
        description: verificationData.status === "verified" 
          ? "Your inheritance plan has been validated" 
          : "There are some issues with your inheritance plan that need attention",
      });

      if (verificationData.status === "verified") {
        setStep(3);
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Something went wrong during verification",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate smart contract code based on the plan
  const generateSmartContract = async () => {
    if (!planId) {
      toast({
        title: "Error",
        description: "No inheritance plan found",
        variant: "destructive",
      });
      return;
    }

    setGeneratingCode(true);
    try {
      const response = await apiRequest("GET", `/api/intent-inheritance/${planId}/generate-code/${activeBlockchain}`, {});
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate smart contract code");
      }

      const codeData = await response.json();
      setSmartContractCode(codeData.code);
      setShowSmartContractCode(true);
      
      toast({
        title: "Code Generated",
        description: `Smart contract code for ${activeBlockchain} generated successfully`,
      });
    } catch (error: any) {
      toast({
        title: "Code Generation Failed",
        description: error.message || "Something went wrong while generating the code",
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(false);
    }
  };

  // Final step: Create the vault
  const finalizeVault = async () => {
    if (!planId) {
      toast({
        title: "Error",
        description: "No inheritance plan found",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiRequest("POST", `/api/intent-inheritance/${planId}/activate`, {
        chain: activeBlockchain
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to activate inheritance vault");
      }

      const vaultData = await response.json();
      
      toast({
        title: "AI Inheritance Vault Created",
        description: "Your intent-based inheritance vault has been successfully created and activated",
      });

      // Navigate to vault details
      navigate("/my-vaults");
    } catch (error: any) {
      toast({
        title: "Vault Creation Failed",
        description: error.message || "Something went wrong while creating your vault",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Custom CSS classes for gradient accents
  const gradientBorderClasses = "relative before:absolute before:inset-0 before:p-[1px] before:rounded-lg before:bg-gradient-to-r before:from-[#6B00D7] before:via-[#FF5AF7] before:to-[#6B00D7] before:-z-10 before:opacity-50 hover:before:opacity-100 before:transition-all";

  return (
    <Layout>
      <section className="py-16 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#121212]">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost" 
            className="mb-8 text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-bold text-4xl mb-2 flex items-center justify-center">
                <span className="gradient-text bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] bg-clip-text text-transparent">
                  AI-Powered Intent-Based Inheritance
                </span>
                <Brain className="ml-2 h-8 w-8 text-[#FF5AF7]" />
              </h1>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Express your inheritance wishes in natural language. Our AI will interpret your intent and translate it 
                into secure smart contract logic, adapting to complex real-world conditions.
              </p>
            </div>
            
            {/* Step indicator */}
            <div className="flex justify-center mb-10">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white' : 'bg-gray-800 text-gray-500'}`}>
                  1
                </div>
                <div className={`h-1 w-12 ${step >= 2 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-gray-800'}`}></div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white' : 'bg-gray-800 text-gray-500'}`}>
                  2
                </div>
                <div className={`h-1 w-12 ${step >= 3 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-gray-800'}`}></div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white' : 'bg-gray-800 text-gray-500'}`}>
                  3
                </div>
                <div className={`h-1 w-12 ${step >= 4 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]' : 'bg-gray-800'}`}></div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white' : 'bg-gray-800 text-gray-500'}`}>
                  4
                </div>
              </div>
            </div>
            
            <Card className="border-[#6B00D7]/30 bg-gradient-to-br from-[#131313] to-[#1A1A1A] shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {step === 1 && "Express Your Intent"}
                  {step === 2 && "Verify AI Interpretation"}
                  {step === 3 && "Review Smart Contract"}
                  {step === 4 && "Finalize Vault Creation"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Describe your inheritance wishes in plain language"}
                  {step === 2 && "Confirm that the AI has correctly understood your intent"}
                  {step === 3 && "Examine the generated smart contract code for your intent"}
                  {step === 4 && "Deploy your intent-based inheritance vault to the blockchain"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {step === 1 && (
                  <>
                    <Tabs defaultValue={BlockchainType.ETH} onValueChange={handleBlockchainChange}>
                      <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value={BlockchainType.ETH}>Ethereum</TabsTrigger>
                        <TabsTrigger value={BlockchainType.SOLANA}>Solana</TabsTrigger>
                        <TabsTrigger value={BlockchainType.TON}>TON</TabsTrigger>
                        <TabsTrigger value={BlockchainType.BITCOIN}>Bitcoin</TabsTrigger>
                      </TabsList>
                      
                      <div className="mb-6">
                        {!isWalletConnected(activeBlockchain) ? (
                          <div className="p-4 border border-[#FF5AF7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertTriangle className="h-5 w-5 text-[#FF5AF7]" />
                              <h3 className="font-medium text-white">Wallet Connection Required</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                              Connect your {activeBlockchain} wallet to create an inheritance vault. This ensures your intent is securely linked to your identity.
                            </p>
                            <Button 
                              onClick={handleConnectWallet}
                              disabled={isConnectingWallet}
                              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white w-full sm:w-auto"
                            >
                              {isConnectingWallet ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                <>
                                  <Wallet className="h-4 w-4 mr-2" />
                                  Connect {activeBlockchain} Wallet
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="p-4 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F] mb-6">
                            <div className="flex items-center space-x-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              <div>
                                <h3 className="font-medium text-white">{activeBlockchain} Wallet Connected</h3>
                                <p className="text-gray-400 text-sm">
                                  {formatAddress(walletInfo[activeBlockchain as keyof typeof walletInfo]?.address || "")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Tabs>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(createInheritancePlan)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vault Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="My Inheritance Vault" 
                                  {...field} 
                                  className="bg-[#1A1A1A] border-[#6B00D7]/20" 
                                />
                              </FormControl>
                              <FormDescription>
                                Give your inheritance vault a descriptive name
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="intent"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Inheritance Wishes</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your inheritance intentions in natural language. For example: 'I want my cryptocurrency assets to be distributed equally among my three children when they each turn 25 years old. If the market value of Bitcoin exceeds $200,000, they should only receive 50% of the assets, with the remainder held until Bitcoin returns below $150,000.'"
                                  className="resize-none bg-[#1A1A1A] border-[#6B00D7]/20 min-h-[180px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Express your wishes in plain language. The AI will interpret complex conditions and relationships.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#6B00D7]/20">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Sparkles className="h-5 w-5 text-[#FF5AF7] mr-2" />
                            Example Conditions
                          </h3>
                          <p className="text-gray-400 mb-3 text-sm">
                            You can include these types of conditions in your natural language description:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {conditionExamples.map((condition, i) => (
                              <div key={i} className="bg-[#252525] p-3 rounded-lg">
                                <h4 className="font-medium text-white text-sm">{condition.name}</h4>
                                <p className="text-gray-400 text-xs mt-1">
                                  {condition.description}
                                </p>
                                <p className="text-[#FF5AF7] text-xs mt-2 italic">
                                  Example: "{condition.example}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Beneficiaries</h3>
                          <div className="space-y-4">
                            {form.watch("beneficiaries")?.map((_, index) => (
                              <div key={index} className="p-4 bg-[#1F1F1F] rounded-lg border border-[#6B00D7]/20">
                                <div className="flex justify-between mb-2">
                                  <h4 className="font-medium">Beneficiary {index + 1}</h4>
                                  {index > 0 && (
                                    <Button 
                                      type="button"
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeBeneficiary(index)}
                                      className="h-6 text-red-500 hover:text-red-700"
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor={`beneficiaries.${index}.address`}>Wallet Address</Label>
                                    <Input
                                      id={`beneficiaries.${index}.address`}
                                      placeholder="0x..."
                                      className="bg-[#1A1A1A] border-[#6B00D7]/20 mt-1"
                                      {...form.register(`beneficiaries.${index}.address` as const)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`beneficiaries.${index}.share`}>Percentage Share</Label>
                                    <Input
                                      id={`beneficiaries.${index}.share`}
                                      type="number"
                                      min="0"
                                      max="100"
                                      className="bg-[#1A1A1A] border-[#6B00D7]/20 mt-1"
                                      {...form.register(`beneficiaries.${index}.share` as const, {
                                        valueAsNumber: true,
                                      })}
                                    />
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <Label htmlFor={`beneficiaries.${index}.relationship`}>Relationship (Optional)</Label>
                                  <Input
                                    id={`beneficiaries.${index}.relationship`}
                                    placeholder="Spouse, Child, Friend, etc."
                                    className="bg-[#1A1A1A] border-[#6B00D7]/20 mt-1"
                                    {...form.register(`beneficiaries.${index}.relationship` as const)}
                                  />
                                </div>
                              </div>
                            ))}
                            
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addBeneficiary}
                              className="w-full border-dashed border-[#6B00D7]/50 text-[#6B00D7] hover:bg-[#6B00D7]/10"
                            >
                              + Add Another Beneficiary
                            </Button>
                          </div>
                        </div>
                        
                        <div className="pt-6">
                          <Button 
                            type="submit" 
                            disabled={isCreating || !isWalletConnected(activeBlockchain)}
                            className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                          >
                            {isCreating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              "Process My Intent"
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
                
                {step === 2 && inheritancePlan && (
                  <div className="space-y-6">
                    <div className="p-5 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F]">
                      <h3 className="text-xl font-medium mb-3">Your Original Intent</h3>
                      <p className="text-gray-300 bg-[#181818] p-3 rounded-lg whitespace-pre-wrap">
                        {inheritancePlan.intent}
                      </p>
                    </div>
                    
                    {verificationResult ? (
                      <div className={`p-5 border rounded-lg bg-[#1F1F1F] ${
                        verificationResult.status === "verified" 
                          ? "border-green-500/30" 
                          : "border-yellow-500/30"
                      }`}>
                        <div className="flex items-start space-x-3 mb-4">
                          {verificationResult.status === "verified" ? (
                            <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                          )}
                          <div>
                            <h3 className="text-xl font-medium">
                              {verificationResult.status === "verified" 
                                ? "Intent Verified Successfully" 
                                : "Review Required"}
                            </h3>
                            <p className="text-gray-400 mt-1">
                              {verificationResult.status === "verified"
                                ? "The AI has correctly interpreted your inheritance wishes."
                                : "Please review the following issues with your inheritance plan:"}
                            </p>
                          </div>
                        </div>
                        
                        {verificationResult.status !== "verified" && (
                          <div className="space-y-4 mt-5">
                            {verificationResult.securityChecks?.ambiguities?.length > 0 && (
                              <div className="bg-[#252525] p-3 rounded-lg">
                                <h4 className="font-medium text-yellow-400 mb-2">Ambiguities</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                  {verificationResult.securityChecks.ambiguities.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {verificationResult.securityChecks?.contradictions?.length > 0 && (
                              <div className="bg-[#252525] p-3 rounded-lg">
                                <h4 className="font-medium text-red-400 mb-2">Contradictions</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                  {verificationResult.securityChecks.contradictions.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {verificationResult.securityChecks?.potentialIssues?.length > 0 && (
                              <div className="bg-[#252525] p-3 rounded-lg">
                                <h4 className="font-medium text-orange-400 mb-2">Potential Issues</h4>
                                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                                  {verificationResult.securityChecks.potentialIssues.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {verificationResult.securityChecks?.recommendation && (
                              <div className="bg-[#1A1A2E] p-3 rounded-lg border border-[#6B00D7]/30">
                                <h4 className="font-medium text-[#FF5AF7] mb-2">AI Recommendation</h4>
                                <p className="text-gray-300">
                                  {verificationResult.securityChecks.recommendation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {verificationResult.status === "verified" && (
                          <div className="mt-6 bg-[#252525] p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Interpreted Conditions</h3>
                            <div className="space-y-3">
                              {verificationResult.conditions?.map((condition: any, i: number) => (
                                <div key={i} className="bg-[#1A1A1A] p-3 rounded-lg">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-[#FF5AF7]">{condition.type.charAt(0).toUpperCase() + condition.type.slice(1)} Condition</h4>
                                    <span className="text-xs bg-[#6B00D7]/20 px-2 py-1 rounded text-[#6B00D7]">
                                      {condition.chainImplementation?.[activeBlockchain] 
                                        ? "Supported" 
                                        : "Limited Support"}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 mt-1">{condition.description}</p>
                                  {condition.parameters && Object.keys(condition.parameters).length > 0 && (
                                    <div className="mt-2">
                                      <h5 className="text-sm text-gray-400 mb-1">Parameters:</h5>
                                      <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(condition.parameters).map(([key, value]: [string, any]) => (
                                          <div key={key} className="bg-[#252525] px-2 py-1 rounded text-xs">
                                            <span className="text-gray-400">{key}:</span> {value.toString()}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-5 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F]">
                        <h3 className="text-xl font-medium mb-3">AI Verification</h3>
                        <p className="text-gray-400 mb-4">
                          The AI will analyze your intent to ensure it can be accurately translated into secure smart contract logic.
                        </p>
                        <Button 
                          onClick={verifyInheritancePlan}
                          disabled={isVerifying}
                          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                        >
                          {isVerifying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            "Verify My Intent"
                          )}
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="border-[#6B00D7]/30 text-white"
                      >
                        Back to Edit
                      </Button>
                      
                      {verificationResult?.status === "verified" && (
                        <Button 
                          onClick={() => setStep(3)}
                          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                        >
                          Continue to Code Review
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="p-5 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F]">
                      <h3 className="text-xl font-medium mb-3 flex items-center">
                        <Brain className="h-5 w-5 text-[#FF5AF7] mr-2" />
                        Smart Contract Generation
                      </h3>
                      <p className="text-gray-400 mb-4">
                        The AI will generate blockchain-specific smart contract code based on your verified intent.
                      </p>
                      
                      <div className="bg-[#181818] p-4 rounded-lg mb-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Selected Blockchain:</h4>
                          <span className="text-[#FF5AF7]">{activeBlockchain}</span>
                        </div>
                        <div className="w-full h-[1px] bg-gray-800"></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Contract Language:</h4>
                          <span className="text-gray-300">
                            {activeBlockchain === BlockchainType.ETH 
                              ? 'Solidity' 
                              : activeBlockchain === BlockchainType.SOLANA
                                ? 'Rust'
                                : activeBlockchain === BlockchainType.TON
                                  ? 'FunC'
                                  : 'Bitcoin Script'}
                          </span>
                        </div>
                      </div>
                      
                      {!showSmartContractCode && (
                        <Button 
                          onClick={generateSmartContract}
                          disabled={generatingCode}
                          className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                        >
                          {generatingCode ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Code...
                            </>
                          ) : (
                            "Generate Smart Contract"
                          )}
                        </Button>
                      )}
                    </div>
                    
                    {showSmartContractCode && smartContractCode && (
                      <div className="p-5 border border-[#6B00D7]/30 rounded-lg bg-[#1F1F1F]">
                        <h3 className="text-xl font-medium mb-3">Generated Smart Contract Code</h3>
                        <div className="bg-[#111] p-4 rounded-lg max-h-[400px] overflow-auto custom-scrollbar">
                          <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
                            {smartContractCode}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between pt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)}
                        className="border-[#6B00D7]/30 text-white"
                      >
                        Back to Verification
                      </Button>
                      
                      {showSmartContractCode && (
                        <Button 
                          onClick={() => setStep(4)}
                          className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                        >
                          Continue to Finalization
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="p-5 border border-green-500/30 rounded-lg bg-[#1F1F1F]">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                          <CheckCircle className="h-10 w-10 text-green-500" />
                        </div>
                        <h3 className="text-xl font-medium">Ready for Deployment</h3>
                        <p className="text-gray-400 mt-2 max-w-md">
                          Your AI-Powered Intent-Based Inheritance Vault is ready to be deployed to the blockchain.
                        </p>
                      </div>
                      
                      <div className="bg-[#181818] p-4 rounded-lg my-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Vault Name:</h4>
                          <span className="text-gray-300">{inheritancePlan?.name}</span>
                        </div>
                        <div className="w-full h-[1px] bg-gray-800"></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Primary Blockchain:</h4>
                          <span className="text-[#FF5AF7]">{activeBlockchain}</span>
                        </div>
                        <div className="w-full h-[1px] bg-gray-800"></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Number of Beneficiaries:</h4>
                          <span className="text-gray-300">{inheritancePlan?.beneficiaries?.length || 0}</span>
                        </div>
                        <div className="w-full h-[1px] bg-gray-800"></div>
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Number of Conditions:</h4>
                          <span className="text-gray-300">{verificationResult?.conditions?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="bg-[#111] border border-yellow-500/20 p-4 rounded-lg mb-6">
                        <h4 className="font-medium text-yellow-500 mb-2 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Important Information
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Once deployed, this vault will operate according to the conditions you've specified. 
                          The smart contract will execute automatically when your conditions are met.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={finalizeVault}
                        disabled={isCreating}
                        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#7B10E7] hover:to-[#FF6AF7] text-white"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Vault...
                          </>
                        ) : (
                          "Create AI Inheritance Vault"
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-start pt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(3)}
                        className="border-[#6B00D7]/30 text-white"
                      >
                        Back to Code Review
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </Layout>
  );
};

export default IntentInheritanceVault;