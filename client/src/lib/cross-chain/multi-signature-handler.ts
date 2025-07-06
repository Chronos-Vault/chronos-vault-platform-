/**
 * Multi-Signature Handler for Atomic Swaps
 *
 * This module provides functionality for managing multi-signature operations
 * for atomic swaps across different blockchains.
 */

import { BlockchainType } from "@/lib/wallet/types";
import { v4 as uuidv4 } from "uuid";

interface Signer {
  address: string;
  hasApproved: boolean;
  approvedAt?: number;
  sigHash?: string;
}

export interface MultiSigRequest {
  id: string;
  swapId: string;
  requiredSignatures: number;
  signers: Signer[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
  completedAt?: number;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  actionType: 'initiate' | 'participate' | 'claim' | 'refund';
  initiatorAddress: string;
}

/**
 * Class for handling multi-signature operations on atomic swaps
 */
export class MultiSignatureHandler {
  private multiSigRequests: Map<string, MultiSigRequest>;
  private signersBySwap: Map<string, string[]>;

  constructor() {
    this.multiSigRequests = new Map();
    this.signersBySwap = new Map();
    this.loadStoredRequests();
  }

  /**
   * Creates a new multi-signature request for a specific swap action
   */
  createSignatureRequest(
    swapId: string,
    requiredSignatures: number,
    signerAddresses: string[],
    sourceChain: BlockchainType,
    destinationChain: BlockchainType,
    actionType: 'initiate' | 'participate' | 'claim' | 'refund',
    initiatorAddress: string
  ): MultiSigRequest {
    const signers: Signer[] = signerAddresses.map(address => ({
      address,
      hasApproved: address === initiatorAddress, // Auto-approve for the initiator
      approvedAt: address === initiatorAddress ? Date.now() : undefined,
    }));

    const requestId = uuidv4();
    const request: MultiSigRequest = {
      id: requestId,
      swapId,
      requiredSignatures,
      signers,
      status: 'pending',
      createdAt: Date.now(),
      sourceChain,
      destinationChain,
      actionType,
      initiatorAddress
    };

    this.multiSigRequests.set(requestId, request);
    
    // Track the request by swapId
    const swapRequests = this.signersBySwap.get(swapId) || [];
    swapRequests.push(requestId);
    this.signersBySwap.set(swapId, swapRequests);
    
    this.saveToStorage();
    return request;
  }

  /**
   * Adds a signature to an existing multi-signature request
   */
  addSignature(requestId: string, signerAddress: string): MultiSigRequest | null {
    const request = this.multiSigRequests.get(requestId);
    if (!request) {
      return null;
    }

    // Find the signer in the request
    const signerIndex = request.signers.findIndex(s => s.address === signerAddress);
    if (signerIndex === -1) {
      return null; // Signer not found in the request
    }

    // Update the signer's approval status
    request.signers[signerIndex].hasApproved = true;
    request.signers[signerIndex].approvedAt = Date.now();

    // Check if we have enough signatures
    const approvedCount = request.signers.filter(s => s.hasApproved).length;
    if (approvedCount >= request.requiredSignatures) {
      request.status = 'approved';
      request.completedAt = Date.now();
    }

    this.multiSigRequests.set(requestId, request);
    this.saveToStorage();
    return request;
  }

  /**
   * Rejects a multi-signature request
   */
  rejectRequest(requestId: string, signerAddress: string): boolean {
    const request = this.multiSigRequests.get(requestId);
    if (!request) {
      return false;
    }

    // Check if the signer is part of the request
    const signerIndex = request.signers.findIndex(s => s.address === signerAddress);
    if (signerIndex === -1) {
      return false;
    }

    request.status = 'rejected';
    request.completedAt = Date.now();
    this.multiSigRequests.set(requestId, request);
    this.saveToStorage();
    return true;
  }

  /**
   * Gets all signature requests for a specific swap
   */
  getRequestsBySwap(swapId: string): MultiSigRequest[] {
    const requestIds = this.signersBySwap.get(swapId) || [];
    return requestIds
      .map(id => this.multiSigRequests.get(id))
      .filter((req): req is MultiSigRequest => req !== undefined);
  }

  /**
   * Gets all pending signature requests for a specific signer
   */
  getPendingRequestsForSigner(signerAddress: string): MultiSigRequest[] {
    return Array.from(this.multiSigRequests.values())
      .filter(req => 
        req.status === 'pending' &&
        req.signers.some(s => s.address === signerAddress && !s.hasApproved)
      );
  }

  /**
   * Gets a specific signature request by ID
   */
  getRequestById(requestId: string): MultiSigRequest | null {
    return this.multiSigRequests.get(requestId) || null;
  }

  /**
   * Checks if a swap has the required signatures to proceed
   */
  hasRequiredSignatures(swapId: string, actionType: 'initiate' | 'participate' | 'claim' | 'refund'): boolean {
    const requests = this.getRequestsBySwap(swapId);
    const relevantRequest = requests.find(req => req.actionType === actionType);

    if (!relevantRequest) {
      return false; // No request found for this action
    }

    return relevantRequest.status === 'approved';
  }

  /**
   * Gets the approval status for a specific swap action
   */
  getApprovalStatus(swapId: string, actionType: 'initiate' | 'participate' | 'claim' | 'refund'): {
    status: 'not_required' | 'pending' | 'approved' | 'rejected';
    approvedCount: number;
    requiredCount: number;
  } {
    const requests = this.getRequestsBySwap(swapId);
    const relevantRequest = requests.find(req => req.actionType === actionType);

    if (!relevantRequest) {
      return { 
        status: 'not_required', 
        approvedCount: 0, 
        requiredCount: 0 
      };
    }

    const approvedCount = relevantRequest.signers.filter(s => s.hasApproved).length;
    
    return {
      status: relevantRequest.status,
      approvedCount,
      requiredCount: relevantRequest.requiredSignatures
    };
  }

  /**
   * Saves all multi-signature requests to local storage
   */
  private saveToStorage(): void {
    try {
      const requestsData = JSON.stringify(Array.from(this.multiSigRequests.entries()));
      const swapSignersData = JSON.stringify(Array.from(this.signersBySwap.entries()));
      
      localStorage.setItem('atomic_swap_multi_sig_requests', requestsData);
      localStorage.setItem('atomic_swap_multi_sig_by_swap', swapSignersData);
    } catch (error) {
      console.error('Error saving multi-signature data to storage:', error);
    }
  }

  /**
   * Loads multi-signature requests from local storage
   */
  private loadStoredRequests(): void {
    try {
      const requestsData = localStorage.getItem('atomic_swap_multi_sig_requests');
      const swapSignersData = localStorage.getItem('atomic_swap_multi_sig_by_swap');
      
      if (requestsData) {
        const entries = JSON.parse(requestsData) as [string, MultiSigRequest][];
        this.multiSigRequests = new Map(entries);
      }
      
      if (swapSignersData) {
        const entries = JSON.parse(swapSignersData) as [string, string[]][];
        this.signersBySwap = new Map(entries);
      }
    } catch (error) {
      console.error('Error loading multi-signature data from storage:', error);
    }
  }
}

// Singleton instance for application-wide use
export const multiSignatureHandler = new MultiSignatureHandler();
