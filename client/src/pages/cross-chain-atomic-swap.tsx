/**
 * Cross-Chain Atomic Swap Page
 * 
 * This page allows users to create and manage cross-chain atomic swaps.
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMultiChain, BlockchainType } from "@/contexts/multi-chain-context";
import { useAtomicSwap, AtomicSwapProvider } from "@/contexts/atomic-swap-context";
import { useEthereum } from "@/contexts/ethereum-context";
import { useSolana } from "@/contexts/solana-context";
import { useTon } from "@/contexts/ton-context";
import CrossChainSwapConfig from "@/components/vault/CrossChainSwapConfig";
import MultiSignatureSwapConfig from "@/components/vault/MultiSignatureSwapConfig";
import HTLCVerificationPanel from "@/components/cross-chain/HTLCVerificationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { SwapConfig, SwapInfo, SwapStatus } from "@/lib/cross-chain/atomic-swap-service";
import { ArrowLeftRight, ArrowRight, Clock, RefreshCcw, Loader2, Shield, LockKeyhole, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";

// Schema for form validation
const swapFormSchema = z.object({
  crossChainSource: z.string().min(1, "Source chain is required"),
  crossChainDestination: z.string().min(1, "Destination chain is required"),
  crossChainSourceAmount: z.string().min(1, "Amount is required"),
  crossChainDestAmount: z.string().min(1, "Destination amount is required"),
  htlcTimeout: z.string().min(1, "Timeout is required"),
  additionalChains: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof swapFormSchema>;

// Wrap component with provider to ensure context is available
const AtomicSwapPageContainer = () => {
  return (
    <AtomicSwapProvider>
      <AtomicSwapPage />
    </AtomicSwapProvider>
  );
};

// Main component
const AtomicSwapPage = () => {
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"create" | "history">("create");
  const [isCreating, setIsCreating] = useState(false);
  const { isChainConnected, blockchainStatuses } = useMultiChain();
  const { isPreparing, userSwaps, createSwap, participateInSwap, claimSwap, completeSwap, refundSwap, refreshUserSwaps } = useAtomicSwap();
  const { account: ethAccount } = useEthereum();
  const { wallet: solanaWallet } = useSolana();
  const { wallet: tonWallet } = useTon();

  // Form for creating new swaps
  const form = useForm<FormValues>({
    resolver: zodResolver(swapFormSchema),
    defaultValues: {
      crossChainSource: BlockchainType.TON,
      crossChainDestination: BlockchainType.ETHEREUM,
      crossChainSourceAmount: "",
      crossChainDestAmount: "",
      htlcTimeout: "24",
      additionalChains: [],
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsCreating(true);
    try {
      // Validate that both chains are connected
      if (!isChainConnected(data.crossChainSource as BlockchainType)) {
        throw new Error(`${data.crossChainSource} wallet is not connected`);
      }
      
      if (!isChainConnected(data.crossChainDestination as BlockchainType)) {
        throw new Error(`${data.crossChainDestination} wallet is not connected`);
      }
      
      // Get the appropriate addresses
      const sourceAddress = getWalletAddress(data.crossChainSource as BlockchainType);
      const destAddress = getWalletAddress(data.crossChainDestination as BlockchainType);
      
      if (!sourceAddress) {
        throw new Error(`No wallet address found for ${data.crossChainSource}`);
      }
      
      if (!destAddress) {
        throw new Error(`No wallet address found for ${data.crossChainDestination}`);
      }
      
      // Create the swap configuration
      const swapConfig: SwapConfig = {
        sourceChain: data.crossChainSource as BlockchainType,
        destChain: data.crossChainDestination as BlockchainType,
        sourceAmount: data.crossChainSourceAmount,
        destAmount: data.crossChainDestAmount,
        senderAddress: sourceAddress,
        receiverAddress: destAddress,
        timeLockHours: parseInt(data.htlcTimeout, 10),
        useTripleChainSecurity: data.additionalChains?.length === 3 ?? false,
      };
      
      // Create the swap
      const swap = await createSwap(swapConfig);
      
      toast({
        title: "Atomic Swap Initiated",
        description: `Cross-chain atomic swap created successfully with ID: ${swap.id.slice(0, 8)}...`,
      });
      
      // Switch to the history tab to see the created swap
      setActiveTab("history");
    } catch (error) {
      console.error("Failed to create atomic swap:", error);
      toast({
        title: "Failed to Create Swap",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Helper to get wallet address for a specific blockchain
  const getWalletAddress = (chain: BlockchainType): string => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return ethAccount || "";
      case BlockchainType.SOLANA:
        return solanaWallet?.publicKey?.toString() || "";
      case BlockchainType.TON:
        return tonWallet?.account?.address || "";
      default:
        return "";
    }
  };

  // Function to handle participating in a swap
  const handleParticipate = async (swapId: string) => {
    try {
      await participateInSwap(swapId);
      toast({
        title: "Participation Successful",
        description: "You have successfully participated in this atomic swap",
      });
      refreshUserSwaps();
    } catch (error) {
      toast({
        title: "Participation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Function to handle claiming a swap
  const handleClaim = async (swapId: string) => {
    try {
      await claimSwap(swapId);
      toast({
        title: "Claim Successful",
        description: "You have successfully claimed this atomic swap",
      });
      refreshUserSwaps();
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Function to handle completing a swap
  const handleComplete = async (swapId: string) => {
    try {
      await completeSwap(swapId);
      toast({
        title: "Completion Successful",
        description: "The atomic swap has been fully completed",
      });
      refreshUserSwaps();
    } catch (error) {
      toast({
        title: "Completion Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Function to handle refunding a swap
  const handleRefund = async (swapId: string, contractType: 'source' | 'destination') => {
    try {
      await refundSwap(swapId, contractType);
      toast({
        title: "Refund Successful",
        description: `The ${contractType} contract has been refunded`,
      });
      refreshUserSwaps();
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Function to get status badge for a swap
  const getStatusBadge = (status: SwapStatus) => {
    switch (status) {
      case SwapStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">Pending</Badge>;
      case SwapStatus.INITIATED:
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/50">Initiated</Badge>;
      case SwapStatus.CLAIMED:
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">Claimed</Badge>;
      case SwapStatus.REFUNDED:
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/50">Refunded</Badge>;
      case SwapStatus.FAILED:
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/50">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to render action buttons for a swap based on its status
  const renderSwapActions = (swap: SwapInfo) => {
    switch (swap.status) {
      case SwapStatus.PENDING:
        return null;
      case SwapStatus.INITIATED:
        if (!swap.destContractId) {
          return (
            <Button
              size="sm"
              onClick={() => handleParticipate(swap.id)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Participate
            </Button>
          );
        } else {
          return (
            <Button
              size="sm"
              onClick={() => handleClaim(swap.id)}
              className="bg-green-500 hover:bg-green-600"
            >
              Claim Funds
            </Button>
          );
        }
      case SwapStatus.CLAIMED:
        return (
          <Button
            size="sm"
            onClick={() => handleComplete(swap.id)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Complete Swap
          </Button>
        );
      case SwapStatus.REFUNDED:
      case SwapStatus.FAILED:
        return null;
      default:
        return null;
    }
  };

  // Check if the form is ready to submit
  const isFormValid = form.formState.isValid;

  // UI for the page
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/create-vault")}
        >
          <ArrowLeftRight className="mr-2 h-4 w-4" /> Back to Vault Creation
        </Button>
        
        <h1 className="text-3xl font-bold text-white mb-2">Cross-Chain Atomic Swaps</h1>
        <p className="text-gray-400">
          Securely exchange assets between different blockchains in a trustless, decentralized manner
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "create" | "history")}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create New Swap</TabsTrigger>
          <TabsTrigger value="history">Swap History</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card className="border border-[#8B00D7]/20 bg-black/10">
                <CardHeader>
                  <CardTitle className="text-xl text-[#8B00D7]">Create Atomic Swap</CardTitle>
                  <CardDescription>
                    Configure your cross-chain atomic swap parameters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <CrossChainSwapConfig form={form} />
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-[#FF5AF7]" />
                          <Label className="text-lg font-medium">Enhanced Security Options</Label>
                        </div>
                        <p className="text-sm text-gray-400">Configure additional security options for your atomic swap</p>
                      </div>
                      
                      <MultiSignatureSwapConfig form={form} />
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit" 
                          disabled={isCreating || !isFormValid || isPreparing}
                          className="bg-[#8B00D7] hover:bg-[#6A00B3] text-white"
                        >
                          {isCreating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Swap
                            </>
                          ) : (
                            <>
                              <LockKeyhole className="mr-2 h-4 w-4" />
                              Create Atomic Swap
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border border-[#8B00D7]/20 bg-black/10">
                <CardHeader>
                  <CardTitle className="text-xl text-[#8B00D7]">How Atomic Swaps Work</CardTitle>
                  <CardDescription>
                    Understanding the secure cross-chain exchange process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8B00D7]/10 p-2 rounded-full">
                      <LockKeyhole className="h-6 w-6 text-[#8B00D7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Hash Time-Locked Contracts (HTLCs)</h3>
                      <p className="text-xs text-gray-400">
                        HTLCs are smart contracts that lock assets until a cryptographic proof is revealed or a timeout occurs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8B00D7]/10 p-2 rounded-full">
                      <ArrowRight className="h-6 w-6 text-[#8B00D7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Trustless Exchange Process</h3>
                      <p className="text-xs text-gray-400">
                        1. You create an HTLC on the source chain with locked assets<br />
                        2. The counterparty creates a matching HTLC on the destination chain<br />
                        3. When you claim the destination assets, the secret is revealed<br />
                        4. The counterparty uses this revealed secret to claim the source assets
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8B00D7]/10 p-2 rounded-full">
                      <Clock className="h-6 w-6 text-[#8B00D7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Time-Lock Security</h3>
                      <p className="text-xs text-gray-400">
                        If the swap isn't completed within the timeout period, both parties can retrieve their locked funds.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#8B00D7]/10 p-2 rounded-full">
                      <Shield className="h-6 w-6 text-[#8B00D7]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Triple-Chain Security (Optional)</h3>
                      <p className="text-xs text-gray-400">
                        For maximum security, enable Triple-Chain verification which uses all three blockchains to secure the swap.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-[#8B00D7]/20 bg-black/10">
                <CardHeader>
                  <CardTitle className="text-xl text-[#8B00D7]">Connected Wallets</CardTitle>
                  <CardDescription>
                    Status of your connected blockchain wallets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>TON:</Label>
                      {blockchainStatuses.TON.connected ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/50">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label>Ethereum:</Label>
                      {blockchainStatuses.Ethereum.connected ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/50">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label>Solana:</Label>
                      {blockchainStatuses.Solana.connected ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/50">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/50">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-400">
                    You need to connect both source and destination chain wallets to create an atomic swap.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border border-[#8B00D7]/20 bg-black/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl text-[#8B00D7]">Your Atomic Swaps</CardTitle>
                <CardDescription>
                  View and manage your cross-chain atomic swaps
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshUserSwaps}
                className="text-[#8B00D7] border-[#8B00D7] hover:bg-[#8B00D7]/10"
              >
                <RefreshCcw className="mr-1 h-4 w-4" /> Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {userSwaps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">You haven't created any atomic swaps yet.</p>
                  <Button
                    variant="outline"
                    className="mt-4 text-[#8B00D7] border-[#8B00D7] hover:bg-[#8B00D7]/10"
                    onClick={() => setActiveTab("create")}
                  >
                    Create Your First Swap
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userSwaps.map((swap) => (
                    <Card key={swap.id} className="bg-black/20 border border-gray-800/50">
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium">Swap ID: {swap.id.slice(0, 8)}...</h3>
                            {getStatusBadge(swap.status)}
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(swap.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">Source Chain</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-black border-gray-700">
                                {swap.config.sourceChain}
                              </Badge>
                              <span className="text-sm">{swap.config.sourceAmount}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              From: {swap.config.senderAddress.slice(0, 6)}...{swap.config.senderAddress.slice(-4)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs font-medium text-gray-400 mb-1">Destination Chain</h4>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="bg-black border-gray-700">
                                {swap.config.destChain}
                              </Badge>
                              <span className="text-sm">{swap.config.destAmount}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              To: {swap.config.receiverAddress.slice(0, 6)}...{swap.config.receiverAddress.slice(-4)}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-400">
                            Time Lock: {swap.config.timeLockHours} hours
                            {swap.config.useTripleChainSecurity && (
                              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-500 border-purple-500/50">
                                Triple-Chain Security
                              </Badge>
                            )}
                          </div>
                          {renderSwapActions(swap)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AtomicSwapPageContainer;
