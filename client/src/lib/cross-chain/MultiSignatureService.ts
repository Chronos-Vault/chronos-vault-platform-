/**
 * Multi-Signature Service
 * 
 * This service handles multi-signature operations for cross-chain transactions,
 * including signature request creation, tracking, and verification.
 */

import { BlockchainType } from './interfaces';

/**
 * Signature request data structure
 */
export interface SignatureRequest {
  id: string;
  blockchain: BlockchainType;
  requesterAddress: string;
  targetAddress: string;
  timestamp: number;
  transactionHash?: string;
  transactionData: string;
  signed: boolean;
  signatureData?: string;
  signatureTimestamp?: number;
  expiresAt: number;
}

/**
 * Mock signature requests for development
 */
const mockSignatureRequests: Record<string, SignatureRequest> = {};
const mockAddressRequests: Record<string, string[]> = {};

/**
 * Multi-Signature Service
 */
class MultiSignatureService {
  /**
   * Create a new signature request
   */
  async createSignatureRequest(
    blockchain: BlockchainType,
    requesterAddress: string,
    targetAddress: string,
    transactionData: string,
    transactionHash?: string,
    expiresInMs: number = 24 * 60 * 60 * 1000 // 24 hours by default
  ): Promise<SignatureRequest> {
    // Generate ID for the request
    const id = `sig-req-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    
    // Create the request
    const request: SignatureRequest = {
      id,
      blockchain,
      requesterAddress,
      targetAddress,
      timestamp: Date.now(),
      transactionHash,
      transactionData,
      signed: false,
      expiresAt: Date.now() + expiresInMs
    };
    
    // Store the request
    mockSignatureRequests[id] = request;
    
    // Add to requester's requests
    if (!mockAddressRequests[requesterAddress]) {
      mockAddressRequests[requesterAddress] = [];
    }
    mockAddressRequests[requesterAddress].push(id);
    
    // Add to target's requests
    if (!mockAddressRequests[targetAddress]) {
      mockAddressRequests[targetAddress] = [];
    }
    mockAddressRequests[targetAddress].push(id);
    
    return request;
  }
  
  /**
   * Get all signature requests for an address
   */
  async getSignatureRequestsForAddress(address: string): Promise<SignatureRequest[]> {
    const requestIds = mockAddressRequests[address] || [];
    return requestIds.map(id => mockSignatureRequests[id]).filter(Boolean);
  }
  
  /**
   * Submit a signature for a request
   */
  async submitSignature(
    requestId: string,
    signatureData: string
  ): Promise<boolean> {
    const request = mockSignatureRequests[requestId];
    
    if (!request) {
      return false;
    }
    
    // Check if expired
    if (Date.now() > request.expiresAt) {
      return false;
    }
    
    // Update request
    mockSignatureRequests[requestId] = {
      ...request,
      signed: true,
      signatureData,
      signatureTimestamp: Date.now()
    };
    
    return true;
  }
  
  /**
   * Verify a signature
   */
  async verifySignature(
    requestId: string,
    signatureData: string
  ): Promise<boolean> {
    const request = mockSignatureRequests[requestId];
    
    if (!request || !request.signed) {
      return false;
    }
    
    // In a real implementation, this would perform cryptographic verification
    // For now, we'll just check if the signatures match
    return request.signatureData === signatureData;
  }
  
  /**
   * Get a specific signature request
   */
  async getSignatureRequest(id: string): Promise<SignatureRequest | null> {
    return mockSignatureRequests[id] || null;
  }
  
  /**
   * Extend the expiration time of a signature request
   */
  async extendExpirationTime(
    requestId: string,
    additionalTimeMs: number
  ): Promise<boolean> {
    const request = mockSignatureRequests[requestId];
    
    if (!request) {
      return false;
    }
    
    // Update expiration time
    mockSignatureRequests[requestId] = {
      ...request,
      expiresAt: request.expiresAt + additionalTimeMs
    };
    
    return true;
  }
  
  /**
   * Cancel a signature request
   */
  async cancelSignatureRequest(requestId: string): Promise<boolean> {
    // In a real implementation, this would mark the request as canceled
    // For now, we'll just remove it
    delete mockSignatureRequests[requestId];
    
    // Clean up address references
    Object.keys(mockAddressRequests).forEach(address => {
      mockAddressRequests[address] = mockAddressRequests[address].filter(id => id !== requestId);
    });
    
    return true;
  }
}

// Singleton accessor function
let signatureService: MultiSignatureService | null = null;

export function getMultiSignatureService(): MultiSignatureService {
  if (!signatureService) {
    signatureService = new MultiSignatureService();
  }
  return signatureService;
}