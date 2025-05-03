/**
 * Atomic Swap Context Provider
 * 
 * Provides atomic swap functionality to components across the application.
 */

import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { AtomicSwapService, SwapConfig, SwapInfo, SwapStatus } from "@/lib/cross-chain/atomic-swap-service";
import { BlockchainType } from "./multi-chain-context";
import { useEthereum } from "./ethereum-context";
import { useSolana } from "./solana-context";
import { useTon } from "./ton-context";
import { useToast } from "@/hooks/use-toast";
import { multiSignatureHandler, MultiSigRequest } from "@/lib/cross-chain/multi-signature-handler";
import { geoVerificationService, GeoVerificationRecord } from "@/lib/cross-chain/geo-verification-service";

interface AtomicSwapContextType {
  atomicSwapService: AtomicSwapService | null;
  isPreparing: boolean;
  userSwaps: SwapInfo[];
  selectedSwap: SwapInfo | null;
  setSelectedSwap: (swap: SwapInfo | null) => void;
  createSwap: (config: SwapConfig) => Promise<SwapInfo>;
  participateInSwap: (swapId: string) => Promise<SwapInfo>;
  claimSwap: (swapId: string) => Promise<SwapInfo>;
  completeSwap: (swapId: string) => Promise<SwapInfo>;
  refundSwap: (swapId: string, contractType: 'source' | 'destination') => Promise<SwapInfo>;
  refreshUserSwaps: () => void;
  // Security features
  addSignature: (swapId: string, signerAddress: string) => Promise<SwapInfo>;
  verifyGeolocation: (swapId: string, geolocationHash: string) => Promise<SwapInfo>;
  activateBackupRecovery: (swapId: string) => Promise<SwapInfo>;
  updateSecurityScore: (swapId: string) => Promise<SwapInfo>;
  performSecurityVerification: (swapId: string) => Promise<SwapInfo>;
  // MultiSig features
  createSignatureRequest: (swapId: string, requiredSignatures: number, signerAddresses: string[], sourceChain: BlockchainType, destinationChain: BlockchainType, actionType: 'initiate' | 'participate' | 'claim' | 'refund', initiatorAddress: string) => MultiSigRequest;
  getSignatureRequests: (swapId: string) => MultiSigRequest[];
  getPendingSignatureRequests: (signerAddress: string) => MultiSigRequest[];
  approveSignatureRequest: (requestId: string, signerAddress: string) => MultiSigRequest | null;
  rejectSignatureRequest: (requestId: string, signerAddress: string) => boolean;
  // Geolocation features
  requestGeoVerification: (swapId: string) => Promise<GeoVerificationRecord | null>;
  verifyGeoLocation: (swapId: string, allowedHashes: string[]) => Promise<boolean>;
  getGeoVerificationStatus: (swapId: string) => { verified: boolean; record: GeoVerificationRecord | null; };
}

const AtomicSwapContext = createContext<AtomicSwapContextType | null>(null);

export const AtomicSwapProvider = ({ children }: { children: ReactNode }) => {
  const [atomicSwapService, setAtomicSwapService] = useState<AtomicSwapService | null>(null);
  const [isPreparing, setIsPreparing] = useState(true);
  const [userSwaps, setUserSwaps] = useState<SwapInfo[]>([]);
  const [selectedSwap, setSelectedSwap] = useState<SwapInfo | null>(null);
  const { toast } = useToast();
  
  // Get blockchain services from contexts
  const { provider: ethProvider, account: ethAccount } = useEthereum();
  const { connection: solanaConnection, wallet: solanaWallet } = useSolana();
  const { ton, wallet: tonWallet } = useTon();
  
  // Initialize atomic swap service
  useEffect(() => {
    if (ethProvider && solanaConnection && ton) {
      try {
        const service = new AtomicSwapService(ton, ethProvider, solanaConnection);
        setAtomicSwapService(service);
        setIsPreparing(false);
      } catch (error) {
        console.error("Failed to initialize atomic swap service:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize cross-chain services",
          variant: "destructive",
        });
        setIsPreparing(false);
      }
    }
  }, [ethProvider, solanaConnection, ton, toast]);
  
  // Refresh user swaps when the service or user accounts change
  useEffect(() => {
    refreshUserSwaps();
  }, [atomicSwapService, ethAccount, solanaWallet, tonWallet?.account?.address]);
  
  // Get user's connected wallet address for a specific blockchain
  const getUserAddress = (chain: BlockchainType): string => {
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
  
  // Refresh user's swaps
  const refreshUserSwaps = () => {
    if (!atomicSwapService) return;
    
    const ethAddress = getUserAddress(BlockchainType.ETHEREUM);
    const solAddress = getUserAddress(BlockchainType.SOLANA);
    const tonAddress = getUserAddress(BlockchainType.TON);
    
    // Get swaps for all connected wallets
    const swaps: SwapInfo[] = [];
    if (ethAddress) swaps.push(...atomicSwapService.getAllSwapsForUser(ethAddress));
    if (solAddress) swaps.push(...atomicSwapService.getAllSwapsForUser(solAddress));
    if (tonAddress) swaps.push(...atomicSwapService.getAllSwapsForUser(tonAddress));
    
    // Remove duplicates (a swap might be associated with multiple addresses)
    const uniqueSwaps = Array.from(new Map(swaps.map(swap => [swap.id, swap])).values());
    
    // Sort by creation time (newest first)
    uniqueSwaps.sort((a, b) => b.createdAt - a.createdAt);
    
    setUserSwaps(uniqueSwaps);
  };
  
  // Create a new atomic swap
  const createSwap = async (config: SwapConfig): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.initiateSwap(config);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to create swap:", error);
      toast({
        title: "Swap Creation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Participate in an existing swap
  const participateInSwap = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.participateInSwap(swapId);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to participate in swap:", error);
      toast({
        title: "Swap Participation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Claim a swap
  const claimSwap = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.claimSwap(swapId);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to claim swap:", error);
      toast({
        title: "Swap Claim Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Complete a swap
  const completeSwap = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.completeSwap(swapId);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to complete swap:", error);
      toast({
        title: "Swap Completion Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Refund a swap
  const refundSwap = async (swapId: string, contractType: 'source' | 'destination'): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.refundSwap(swapId, contractType);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error(`Failed to refund ${contractType} contract for swap:`, error);
      toast({
        title: "Swap Refund Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // Security features implementation
  const addSignature = async (swapId: string, signerAddress: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.addSignature(swapId, signerAddress);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to add signature:", error);
      toast({
        title: "Signature Addition Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const verifyGeolocation = async (swapId: string, geolocationHash: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.verifyGeolocation(swapId, geolocationHash);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to verify geolocation:", error);
      toast({
        title: "Geolocation Verification Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const activateBackupRecovery = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.activateBackupRecovery(swapId);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to activate backup recovery:", error);
      toast({
        title: "Backup Recovery Activation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const updateSecurityScore = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    const swap = atomicSwapService.getSwapInfo(swapId);
    if (!swap) {
      throw new Error("Swap not found");
    }
    
    refreshUserSwaps();
    return swap;
  };
  
  const performSecurityVerification = async (swapId: string): Promise<SwapInfo> => {
    if (!atomicSwapService) {
      throw new Error("Atomic swap service not initialized");
    }
    
    try {
      const swap = await atomicSwapService.performSecurityVerification(swapId);
      refreshUserSwaps();
      return swap;
    } catch (error) {
      console.error("Failed to perform security verification:", error);
      toast({
        title: "Security Verification Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  // MultiSig features implementation
  const createSignatureRequest = (swapId: string, requiredSignatures: number, signerAddresses: string[], sourceChain: BlockchainType, destinationChain: BlockchainType, actionType: 'initiate' | 'participate' | 'claim' | 'refund', initiatorAddress: string): MultiSigRequest => {
    return multiSignatureHandler.createSignatureRequest(
      swapId,
      requiredSignatures,
      signerAddresses,
      sourceChain,
      destinationChain,
      actionType,
      initiatorAddress
    );
  };
  
  const getSignatureRequests = (swapId: string): MultiSigRequest[] => {
    return multiSignatureHandler.getRequestsBySwap(swapId);
  };
  
  const getPendingSignatureRequests = (signerAddress: string): MultiSigRequest[] => {
    return multiSignatureHandler.getPendingRequestsForSigner(signerAddress);
  };
  
  const approveSignatureRequest = (requestId: string, signerAddress: string): MultiSigRequest | null => {
    return multiSignatureHandler.addSignature(requestId, signerAddress);
  };
  
  const rejectSignatureRequest = (requestId: string, signerAddress: string): boolean => {
    return multiSignatureHandler.rejectRequest(requestId, signerAddress);
  };
  
  // Geolocation features implementation
  const requestGeoVerification = async (swapId: string): Promise<GeoVerificationRecord | null> => {
    return await geoVerificationService.requestVerification(swapId);
  };
  
  const verifyGeoLocation = async (swapId: string, allowedHashes: string[]): Promise<boolean> => {
    return await geoVerificationService.verifyLocation(swapId, allowedHashes);
  };
  
  const getGeoVerificationStatus = (swapId: string): { verified: boolean; record: GeoVerificationRecord | null; } => {
    const verified = geoVerificationService.hasValidVerification(swapId);
    const record = geoVerificationService.getLatestVerification(swapId);
    
    return { verified, record };
  };
  
  return (
    <AtomicSwapContext.Provider
      value={{
        atomicSwapService,
        isPreparing,
        userSwaps,
        selectedSwap,
        setSelectedSwap,
        createSwap,
        participateInSwap,
        claimSwap,
        completeSwap,
        refundSwap,
        refreshUserSwaps,
        // Security features
        addSignature,
        verifyGeolocation,
        activateBackupRecovery,
        updateSecurityScore,
        performSecurityVerification,
        // MultiSig features
        createSignatureRequest,
        getSignatureRequests,
        getPendingSignatureRequests,
        approveSignatureRequest,
        rejectSignatureRequest,
        // Geolocation features
        requestGeoVerification,
        verifyGeoLocation,
        getGeoVerificationStatus,
      }}
    >
      {children}
    </AtomicSwapContext.Provider>
  );
};

export const useAtomicSwap = () => {
  const context = useContext(AtomicSwapContext);
  if (!context) {
    throw new Error("useAtomicSwap must be used within an AtomicSwapProvider");
  }
  return context;
};
