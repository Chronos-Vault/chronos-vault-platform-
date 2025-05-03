/**
 * Cross-Chain Atomic Swap Service
 * 
 * Manages the atomic swap process between different blockchains using HTLCs.
 */

import { BlockchainType } from "@/contexts/multi-chain-context";
import { TonHTLCContract } from "./ton-htlc";
import { EthereumHTLCContract } from "./ethereum-htlc";
import { SolanaHTLCContract } from "./solana-htlc";
import { HTLCConfig, HTLCInfo, HTLCStatus, IHTLCContract } from "./htlc-interface";

export enum SwapStatus {
  PENDING = "pending",
  INITIATED = "initiated",
  CLAIMED = "claimed",
  REFUNDED = "refunded",
  FAILED = "failed"
}

export interface SwapConfig {
  sourceChain: BlockchainType;
  destChain: BlockchainType;
  sourceAmount: string;
  destAmount: string;
  senderAddress: string;
  receiverAddress: string;
  timeLockHours: number;
  useTripleChainSecurity: boolean;
}

export interface SwapInfo {
  id: string;
  config: SwapConfig;
  status: SwapStatus;
  sourceContractId?: string;
  destContractId?: string;
  secret?: string;
  hashLock?: string;
  createdAt: number;
  completedAt?: number;
  refundedAt?: number;
  failedAt?: number;
  failureReason?: string;
}

export class AtomicSwapService {
  private contractInstances: Map<BlockchainType, IHTLCContract>;
  private swapInfoStorage: Map<string, SwapInfo>;
  
  constructor(
    tonClient: any,
    ethProvider: any,
    solanaConnection: any
  ) {
    // Initialize contract instances for each blockchain
    this.contractInstances = new Map();
    this.contractInstances.set(BlockchainType.TON, new TonHTLCContract(tonClient));
    this.contractInstances.set(BlockchainType.ETHEREUM, new EthereumHTLCContract(ethProvider));
    this.contractInstances.set(BlockchainType.SOLANA, new SolanaHTLCContract(solanaConnection));
    
    // Initialize storage for swap information
    this.swapInfoStorage = new Map();
    
    // Load swaps from localStorage if available
    this.loadSwaps();
  }
  
  /**
   * Initiates a new atomic swap between two blockchains
   */
  async initiateSwap(config: SwapConfig): Promise<SwapInfo> {
    try {
      console.log(`Initiating atomic swap from ${config.sourceChain} to ${config.destChain}`);
      
      // Generate a swap ID
      const swapId = `swap_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Get contract instances
      const sourceContract = this.getContractInstance(config.sourceChain);
      const destContract = this.getContractInstance(config.destChain);
      
      // Generate secret and hash lock
      const { secret, hashLock } = await sourceContract.generateSecret();
      
      // Calculate time lock (current time + locktime in seconds)
      const timeLock = Math.floor(Date.now() / 1000) + (config.timeLockHours * 3600);
      
      // Create swap info
      const swapInfo: SwapInfo = {
        id: swapId,
        config,
        status: SwapStatus.PENDING,
        secret,
        hashLock,
        createdAt: Date.now()
      };
      
      // Store initial swap info
      this.swapInfoStorage.set(swapId, swapInfo);
      this.saveSwap(swapId, swapInfo);
      
      // Create HTLC on source chain
      const sourceConfig: HTLCConfig = {
        chain: config.sourceChain,
        sender: config.senderAddress,
        receiver: config.receiverAddress,
        amount: config.sourceAmount,
        hashLock,
        timeLock,
        feePayer: config.senderAddress
      };
      
      const sourceContractId = await sourceContract.create(sourceConfig);
      
      // Update swap info with source contract ID
      swapInfo.sourceContractId = sourceContractId;
      swapInfo.status = SwapStatus.INITIATED;
      
      // Store updated swap info
      this.swapInfoStorage.set(swapId, swapInfo);
      this.saveSwap(swapId, swapInfo);
      
      return swapInfo;
    } catch (error) {
      console.error("Failed to initiate atomic swap:", error);
      throw new Error(`Failed to initiate atomic swap: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Participates in an atomic swap by creating the HTLC on the destination chain
   */
  async participateInSwap(swapId: string): Promise<SwapInfo> {
    try {
      console.log(`Participating in atomic swap: ${swapId}`);
      
      // Get swap info
      const swapInfo = this.getSwapInfo(swapId);
      if (!swapInfo) {
        throw new Error(`Swap with ID ${swapId} not found`);
      }
      
      // Check swap status
      if (swapInfo.status !== SwapStatus.INITIATED) {
        throw new Error(`Swap is not in initiated state`);
      }
      
      // Get destination contract instance
      const destContract = this.getContractInstance(swapInfo.config.destChain);
      
      // Create HTLC on destination chain with the same hash lock
      const destConfig: HTLCConfig = {
        chain: swapInfo.config.destChain,
        sender: swapInfo.config.receiverAddress,
        receiver: swapInfo.config.senderAddress,
        amount: swapInfo.config.destAmount,
        hashLock: swapInfo.hashLock!,
        timeLock: Math.floor(Date.now() / 1000) + ((swapInfo.config.timeLockHours - 1) * 3600), // 1 hour less than source
        feePayer: swapInfo.config.receiverAddress
      };
      
      const destContractId = await destContract.create(destConfig);
      
      // Update swap info with destination contract ID
      swapInfo.destContractId = destContractId;
      
      // Store updated swap info
      this.swapInfoStorage.set(swapId, swapInfo);
      this.saveSwap(swapId, swapInfo);
      
      return swapInfo;
    } catch (error) {
      console.error("Failed to participate in atomic swap:", error);
      throw new Error(`Failed to participate in atomic swap: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Claims a swap by providing the secret to the destination HTLC
   */
  async claimSwap(swapId: string): Promise<SwapInfo> {
    try {
      console.log(`Claiming atomic swap: ${swapId}`);
      
      // Get swap info
      const swapInfo = this.getSwapInfo(swapId);
      if (!swapInfo) {
        throw new Error(`Swap with ID ${swapId} not found`);
      }
      
      // Check swap status and destination contract ID
      if (swapInfo.status !== SwapStatus.INITIATED || !swapInfo.destContractId) {
        throw new Error(`Swap is not ready to be claimed`);
      }
      
      // Get destination contract instance
      const destContract = this.getContractInstance(swapInfo.config.destChain);
      
      // Claim destination HTLC with secret
      await destContract.claim(swapInfo.destContractId, swapInfo.secret!);
      
      // Update swap status
      swapInfo.status = SwapStatus.CLAIMED;
      swapInfo.completedAt = Date.now();
      
      // Store updated swap info
      this.swapInfoStorage.set(swapId, swapInfo);
      this.saveSwap(swapId, swapInfo);
      
      return swapInfo;
    } catch (error) {
      console.error("Failed to claim atomic swap:", error);
      
      // Update swap status to failed
      const swapInfo = this.getSwapInfo(swapId);
      if (swapInfo) {
        swapInfo.status = SwapStatus.FAILED;
        swapInfo.failedAt = Date.now();
        swapInfo.failureReason = `Claim failed: ${error instanceof Error ? error.message : String(error)}`;
        
        this.swapInfoStorage.set(swapId, swapInfo);
        this.saveSwap(swapId, swapInfo);
      }
      
      throw new Error(`Failed to claim atomic swap: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Completes a swap by claiming the source HTLC using the now-revealed secret
   */
  async completeSwap(swapId: string): Promise<SwapInfo> {
    try {
      console.log(`Completing atomic swap: ${swapId}`);
      
      // Get swap info
      const swapInfo = this.getSwapInfo(swapId);
      if (!swapInfo) {
        throw new Error(`Swap with ID ${swapId} not found`);
      }
      
      // Check swap status and source contract ID
      if (swapInfo.status !== SwapStatus.CLAIMED || !swapInfo.sourceContractId) {
        throw new Error(`Swap is not ready to be completed`);
      }
      
      // Get source contract instance
      const sourceContract = this.getContractInstance(swapInfo.config.sourceChain);
      
      // Claim source HTLC with secret (which is now public from the destination claim)
      await sourceContract.claim(swapInfo.sourceContractId, swapInfo.secret!);
      
      // No need to update status as it's already claimed
      
      return swapInfo;
    } catch (error) {
      console.error("Failed to complete atomic swap:", error);
      throw new Error(`Failed to complete atomic swap: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Refunds a swap if it failed or expired
   */
  async refundSwap(swapId: string, contractType: 'source' | 'destination'): Promise<SwapInfo> {
    try {
      console.log(`Refunding ${contractType} contract for atomic swap: ${swapId}`);
      
      // Get swap info
      const swapInfo = this.getSwapInfo(swapId);
      if (!swapInfo) {
        throw new Error(`Swap with ID ${swapId} not found`);
      }
      
      // Check if the contract exists
      const contractId = contractType === 'source' ? swapInfo.sourceContractId : swapInfo.destContractId;
      if (!contractId) {
        throw new Error(`${contractType} contract not found`);
      }
      
      // Get contract instance
      const chain = contractType === 'source' ? swapInfo.config.sourceChain : swapInfo.config.destChain;
      const contract = this.getContractInstance(chain);
      
      // Refund contract
      await contract.refund(contractId);
      
      // Update swap status
      swapInfo.status = SwapStatus.REFUNDED;
      swapInfo.refundedAt = Date.now();
      
      // Store updated swap info
      this.swapInfoStorage.set(swapId, swapInfo);
      this.saveSwap(swapId, swapInfo);
      
      return swapInfo;
    } catch (error) {
      console.error(`Failed to refund ${contractType} contract for atomic swap:`, error);
      throw new Error(`Failed to refund ${contractType} contract: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Gets information about a swap
   */
  getSwapInfo(swapId: string): SwapInfo | undefined {
    return this.swapInfoStorage.get(swapId);
  }
  
  /**
   * Gets all swaps for a user address
   */
  getAllSwapsForUser(userAddress: string): SwapInfo[] {
    const swaps: SwapInfo[] = [];
    
    for (const swap of this.swapInfoStorage.values()) {
      if (swap.config.senderAddress === userAddress || swap.config.receiverAddress === userAddress) {
        swaps.push(swap);
      }
    }
    
    return swaps;
  }
  
  /**
   * Gets a contract instance for a blockchain
   */
  private getContractInstance(chain: BlockchainType): IHTLCContract {
    const contract = this.contractInstances.get(chain);
    if (!contract) {
      throw new Error(`Contract instance for ${chain} not found`);
    }
    return contract;
  }
  
  /**
   * Saves a swap to localStorage
   */
  private saveSwap(swapId: string, swapInfo: SwapInfo): void {
    try {
      const swapsJson = localStorage.getItem('atomic_swaps') || '{}';
      const swaps = JSON.parse(swapsJson);
      swaps[swapId] = swapInfo;
      localStorage.setItem('atomic_swaps', JSON.stringify(swaps));
    } catch (error) {
      console.error("Failed to save swap to localStorage:", error);
    }
  }
  
  /**
   * Loads all swaps from localStorage
   */
  private loadSwaps(): void {
    try {
      const swapsJson = localStorage.getItem('atomic_swaps');
      if (swapsJson) {
        const swaps = JSON.parse(swapsJson);
        for (const [swapId, swapInfo] of Object.entries(swaps)) {
          this.swapInfoStorage.set(swapId, swapInfo as SwapInfo);
        }
      }
    } catch (error) {
      console.error("Failed to load swaps from localStorage:", error);
    }
  }
}
