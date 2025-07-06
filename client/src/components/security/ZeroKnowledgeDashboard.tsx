import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BlockchainType } from "../../../shared/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldCheck, LockKeyhole, FileKey } from "lucide-react";

// Form schemas
const vaultOwnershipSchema = z.object({
  vaultId: z.string().min(1, "Vault ID is required"),
  ownerAddress: z.string().min(1, "Owner address is required"),
  privateKey: z.string().min(1, "Private key is required for proof generation"),
  blockchainType: z.string().min(1, "Blockchain type is required")
});

const multiSigSchema = z.object({
  vaultId: z.string().min(1, "Vault ID is required"),
  threshold: z.string().transform(val => parseInt(val, 10)),
  signatures: z.string().min(1, "Signatures are required"),
  blockchainType: z.string().min(1, "Blockchain type is required")
});

const verifyProofSchema = z.object({
  proof: z.string().min(1, "Proof is required"),
  proofType: z.string().min(1, "Proof type is required"),
  blockchainType: z.string().min(1, "Blockchain type is required")
});

const crossChainSchema = z.object({
  vaultId: z.string().min(1, "Vault ID is required"),
  sourceChain: z.string().min(1, "Source chain is required"),
  targetChains: z.string().min(1, "Target chains are required"),
  data: z.string().optional()
});

interface ZeroKnowledgeDashboardProps {
  className?: string;
}

export const ZeroKnowledgeDashboard: React.FC<ZeroKnowledgeDashboardProps> = ({ className }) => {
  const [serviceStatus, setServiceStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('status');
  const [ownershipProofResult, setOwnershipProofResult] = useState<any>(null);
  const [multiSigProofResult, setMultiSigProofResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [crossChainResult, setCrossChainResult] = useState<any>(null);
  const { toast } = useToast();

  // Forms
  const ownershipForm = useForm<z.infer<typeof vaultOwnershipSchema>>({
    resolver: zodResolver(vaultOwnershipSchema),
    defaultValues: {
      vaultId: "",
      ownerAddress: "",
      privateKey: "",
      blockchainType: "ETH"
    }
  });

  const multiSigForm = useForm<z.infer<typeof multiSigSchema>>({
    resolver: zodResolver(multiSigSchema),
    defaultValues: {
      vaultId: "",
      threshold: "2",
      signatures: "",
      blockchainType: "ETH"
    }
  });

  const verifyForm = useForm<z.infer<typeof verifyProofSchema>>({
    resolver: zodResolver(verifyProofSchema),
    defaultValues: {
      proof: "",
      proofType: "VAULT_OWNERSHIP",
      blockchainType: "ETH"
    }
  });

  const crossChainForm = useForm<z.infer<typeof crossChainSchema>>({
    resolver: zodResolver(crossChainSchema),
    defaultValues: {
      vaultId: "",
      sourceChain: "ETH",
      targetChains: "SOL,TON",
      data: "{}"
    }
  });

  // On component mount, fetch service status
  useEffect(() => {
    fetchServiceStatus();
  }, []);

  const fetchServiceStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/zk/status');
      if (!response.ok) {
        throw new Error(`Failed to fetch service status: ${response.statusText}`);
      }
      const data = await response.json();
      setServiceStatus(data);
    } catch (error) {
      console.error('Error fetching ZK service status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch Zero-Knowledge service status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnershipProofSubmit = async (data: z.infer<typeof vaultOwnershipSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/zk/prove/ownership', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate ownership proof');
      }
      
      setOwnershipProofResult(result);
      toast({
        title: "Success",
        description: "Vault ownership proof generated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating ownership proof:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate proof",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultiSigProofSubmit = async (data: z.infer<typeof multiSigSchema>) => {
    setIsLoading(true);
    try {
      // Convert comma-separated signatures to array
      const signatures = data.signatures.split(',').map(sig => sig.trim());
      
      const response = await fetch('/api/zk/prove/multisig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          signatures
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate multi-signature proof');
      }
      
      setMultiSigProofResult(result);
      toast({
        title: "Success",
        description: "Multi-signature proof generated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating multi-signature proof:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate proof",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyProofSubmit = async (data: z.infer<typeof verifyProofSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/zk/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to verify proof');
      }
      
      setVerifyResult(result);
      toast({
        title: result.success ? "Success" : "Failed",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error verifying proof:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify proof",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrossChainProofSubmit = async (data: z.infer<typeof crossChainSchema>) => {
    setIsLoading(true);
    try {
      // Convert comma-separated chains to array
      const targetChains = data.targetChains.split(',').map(chain => chain.trim());
      
      // Parse JSON data object if provided
      let jsonData = {};
      try {
        if (data.data) {
          jsonData = JSON.parse(data.data);
        }
      } catch (e) {
        throw new Error("Invalid JSON format in data field");
      }
      
      const response = await fetch('/api/zk/prove/cross-chain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vaultId: data.vaultId,
          sourceChain: data.sourceChain,
          targetChains,
          data: jsonData
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate cross-chain proof');
      }
      
      setCrossChainResult(result);
      toast({
        title: "Success",
        description: "Cross-chain proofs generated successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Error generating cross-chain proof:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate proof",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Tab change handler
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className={`w-full ${className || ""}`}>
      <Card className="border-purple-600/20 shadow-md shadow-purple-500/10">
        <CardHeader className="bg-gradient-to-r from-purple-900/20 to-fuchsia-900/10 border-b border-purple-600/20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
                Zero-Knowledge Privacy Dashboard
              </CardTitle>
              <CardDescription className="text-slate-300">
                Explore and test Chronos Vault's Zero-Knowledge proof infrastructure
              </CardDescription>
            </div>
            <Badge 
              variant={isLoading ? "outline" : (serviceStatus?.status === "operational" ? "success" : "destructive")}
              className="ml-2 px-3 py-1 text-sm"
            >
              {isLoading ? "Loading..." : serviceStatus?.status || "Not Available"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="status" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="ownership">Vault Ownership</TabsTrigger>
              <TabsTrigger value="multisig">Multi-Signature</TabsTrigger>
              <TabsTrigger value="verify">Verify Proof</TabsTrigger>
              <TabsTrigger value="crosschain">Cross-Chain</TabsTrigger>
            </TabsList>
            
            <TabsContent value="status" className="space-y-4">
              {serviceStatus ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center">
                          <InfoIcon className="h-5 w-5 mr-2 text-purple-400" />
                          Service Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Protocol:</span>
                            <span className="font-medium">{serviceStatus.implementationDetails?.protocol || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Library:</span>
                            <span className="font-medium">{serviceStatus.implementationDetails?.library || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Circuit Version:</span>
                            <span className="font-medium">{serviceStatus.implementationDetails?.circuitVersion || "N/A"}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center">
                          <ShieldCheck className="h-5 w-5 mr-2 text-purple-400" />
                          Supported Features
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div>
                            <span className="text-slate-400">Blockchains:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {serviceStatus.supportedBlockchains?.map((chain: string) => (
                                <Badge variant="outline" key={chain}>
                                  {chain}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400">Proof Types:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {serviceStatus.supportedProofTypes?.map((type: string) => (
                                <Badge variant="outline" key={type}>
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert className="bg-purple-950/20 border-purple-500/30">
                    <FileKey className="h-4 w-4 text-purple-400" />
                    <AlertTitle>Privacy Protection</AlertTitle>
                    <AlertDescription>
                      Zero-knowledge proofs allow for verifying the validity of data without revealing the data itself,
                      enhancing privacy and security in blockchain transactions. Our ZK-based system ensures that your
                      vault operations remain private while maintaining verifiability.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="flex justify-center items-center p-8">
                  {isLoading ? (
                    <div className="animate-pulse text-center">
                      <div className="h-6 w-40 bg-purple-700/20 rounded mx-auto"></div>
                      <div className="h-4 w-60 bg-purple-700/10 rounded mx-auto mt-2"></div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertTitle>Service Unavailable</AlertTitle>
                      <AlertDescription>
                        Zero-Knowledge service status could not be fetched. Please try again later.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="ownership">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <LockKeyhole className="h-5 w-5 mr-2 text-purple-400" />
                      Generate Ownership Proof
                    </CardTitle>
                    <CardDescription>
                      Create a zero-knowledge proof of vault ownership
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...ownershipForm}>
                      <form onSubmit={ownershipForm.handleSubmit(handleOwnershipProofSubmit)} className="space-y-4">
                        <FormField
                          control={ownershipForm.control}
                          name="vaultId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vault ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter vault ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ownershipForm.control}
                          name="ownerAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Owner Address</FormLabel>
                              <FormControl>
                                <Input placeholder="0x..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ownershipForm.control}
                          name="privateKey"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Private Key</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter private key for proof generation" type="password" {...field} />
                              </FormControl>
                              <FormDescription>
                                This is only used for proof generation and never sent to the server
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={ownershipForm.control}
                          name="blockchainType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blockchain</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select blockchain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ETH">Ethereum</SelectItem>
                                  <SelectItem value="SOL">Solana</SelectItem>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="POLYGON">Polygon</SelectItem>
                                  <SelectItem value="BTC">Bitcoin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Generating..." : "Generate Proof"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ownershipProofResult ? (
                      <div className="space-y-4">
                        <div className="bg-purple-950/20 rounded-md p-4">
                          <h4 className="font-medium mb-2">Proof Information</h4>
                          <div className="text-sm font-mono overflow-x-auto">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(ownershipProofResult.proof, null, 2)}
                            </pre>
                          </div>
                        </div>
                        
                        <Alert variant="success" className="bg-emerald-950/20 border-emerald-500/30">
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>
                            {ownershipProofResult.message}
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        Generate a proof to see the result
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="multisig">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <LockKeyhole className="h-5 w-5 mr-2 text-purple-400" />
                      Generate Multi-Signature Proof
                    </CardTitle>
                    <CardDescription>
                      Create a zero-knowledge proof of multi-signature verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...multiSigForm}>
                      <form onSubmit={multiSigForm.handleSubmit(handleMultiSigProofSubmit)} className="space-y-4">
                        <FormField
                          control={multiSigForm.control}
                          name="vaultId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vault ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter vault ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={multiSigForm.control}
                          name="threshold"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Threshold</FormLabel>
                              <FormControl>
                                <Input placeholder="2" type="number" min="1" {...field} />
                              </FormControl>
                              <FormDescription>
                                Minimum number of required signatures
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={multiSigForm.control}
                          name="signatures"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Signatures</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter signatures (comma-separated)" 
                                  className="resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter signatures as comma-separated values
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={multiSigForm.control}
                          name="blockchainType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blockchain</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select blockchain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ETH">Ethereum</SelectItem>
                                  <SelectItem value="SOL">Solana</SelectItem>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="POLYGON">Polygon</SelectItem>
                                  <SelectItem value="BTC">Bitcoin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Generating..." : "Generate Proof"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {multiSigProofResult ? (
                      <div className="space-y-4">
                        <div className="bg-purple-950/20 rounded-md p-4">
                          <h4 className="font-medium mb-2">Proof Information</h4>
                          <div className="text-sm font-mono overflow-x-auto">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(multiSigProofResult.proof, null, 2)}
                            </pre>
                          </div>
                        </div>
                        
                        <Alert variant="success" className="bg-emerald-950/20 border-emerald-500/30">
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>
                            {multiSigProofResult.message}
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        Generate a proof to see the result
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="verify">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-purple-400" />
                      Verify Zero-Knowledge Proof
                    </CardTitle>
                    <CardDescription>
                      Verify the validity of a previously generated zero-knowledge proof
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...verifyForm}>
                      <form onSubmit={verifyForm.handleSubmit(handleVerifyProofSubmit)} className="space-y-4">
                        <FormField
                          control={verifyForm.control}
                          name="proof"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proof</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Paste proof JSON here" 
                                  className="resize-y"
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={verifyForm.control}
                          name="proofType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Proof Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select proof type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="VAULT_OWNERSHIP">Vault Ownership</SelectItem>
                                  <SelectItem value="ASSET_VERIFICATION">Asset Verification</SelectItem>
                                  <SelectItem value="MULTI_SIGNATURE">Multi-Signature</SelectItem>
                                  <SelectItem value="ACCESS_AUTHORIZATION">Access Authorization</SelectItem>
                                  <SelectItem value="TRANSACTION_VERIFICATION">Transaction Verification</SelectItem>
                                  <SelectItem value="IDENTITY_VERIFICATION">Identity Verification</SelectItem>
                                  <SelectItem value="CROSS_CHAIN">Cross-Chain</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={verifyForm.control}
                          name="blockchainType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Blockchain</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select blockchain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ETH">Ethereum</SelectItem>
                                  <SelectItem value="SOL">Solana</SelectItem>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="POLYGON">Polygon</SelectItem>
                                  <SelectItem value="BTC">Bitcoin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Verifying..." : "Verify Proof"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {verifyResult ? (
                      <div className="space-y-4">
                        <div className="bg-slate-950/40 rounded-md p-4">
                          <h4 className="font-medium mb-2">Verification Details</h4>
                          <div className="text-sm overflow-x-auto">
                            {verifyResult.verification && (
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Status:</span>
                                  <Badge variant={verifyResult.verification.success ? "success" : "destructive"}>
                                    {verifyResult.verification.success ? "Valid" : "Invalid"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Proof Type:</span>
                                  <span>{verifyResult.verification.proofType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Chain:</span>
                                  <span>{verifyResult.verification.blockchainType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Timestamp:</span>
                                  <span>{new Date(verifyResult.verification.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">Method:</span>
                                  <span>{verifyResult.verification.verificationMethod}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Alert 
                          variant={verifyResult.success ? "success" : "destructive"}
                          className={verifyResult.success ? 
                            "bg-emerald-950/20 border-emerald-500/30" : 
                            "bg-red-950/20 border-red-500/30"
                          }
                        >
                          <AlertTitle>{verifyResult.success ? "Proof Verified" : "Verification Failed"}</AlertTitle>
                          <AlertDescription>
                            {verifyResult.message}
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        Submit a proof to verify and see the result
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="crosschain">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-purple-400" />
                      Generate Cross-Chain Proofs
                    </CardTitle>
                    <CardDescription>
                      Create zero-knowledge proofs that can be verified across multiple blockchains
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...crossChainForm}>
                      <form onSubmit={crossChainForm.handleSubmit(handleCrossChainProofSubmit)} className="space-y-4">
                        <FormField
                          control={crossChainForm.control}
                          name="vaultId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vault ID</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter vault ID" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={crossChainForm.control}
                          name="sourceChain"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source Chain</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source blockchain" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ETH">Ethereum</SelectItem>
                                  <SelectItem value="SOL">Solana</SelectItem>
                                  <SelectItem value="TON">TON</SelectItem>
                                  <SelectItem value="POLYGON">Polygon</SelectItem>
                                  <SelectItem value="BTC">Bitcoin</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={crossChainForm.control}
                          name="targetChains"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Chains</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter comma-separated chains (e.g., SOL,TON)" 
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Comma-separated list of target blockchains
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={crossChainForm.control}
                          name="data"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Data (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter JSON data" 
                                  className="resize-y"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                JSON-formatted additional data to include in the proof
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? "Generating..." : "Generate Cross-Chain Proofs"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {crossChainResult ? (
                      <div className="space-y-4">
                        <div className="bg-purple-950/20 rounded-md p-4">
                          <h4 className="font-medium mb-2">Cross-Chain Proof Information</h4>
                          <div className="text-sm font-mono overflow-x-auto max-h-72 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(crossChainResult.proofs, null, 2)}
                            </pre>
                          </div>
                        </div>
                        
                        <Alert variant="success" className="bg-emerald-950/20 border-emerald-500/30">
                          <AlertTitle>Success</AlertTitle>
                          <AlertDescription>
                            {crossChainResult.message}
                          </AlertDescription>
                        </Alert>
                      </div>
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        Generate cross-chain proofs to see the results
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="bg-slate-900/20 border-t border-purple-600/20 p-4 text-xs text-slate-400">
          Zero-Knowledge proofs provide strong privacy guarantees while maintaining verifiability. All operations are performed client-side when possible.
        </CardFooter>
      </Card>
    </div>
  );
};