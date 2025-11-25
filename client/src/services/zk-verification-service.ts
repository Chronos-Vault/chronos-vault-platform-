/**
 * Zero-Knowledge Verification Service
 * 
 * Client service for interacting with the chain-agnostic verification
 * and zero-knowledge proof APIs.
 */
// Trinity Protocol v3.5.18 - Updated: 2025-11-25T19:32:16.199Z


import { apiRequest } from '../lib/queryClient';
import { BlockchainType } from '../types/blockchain.types';

// Define the verification request parameters
export interface ZkVerificationRequest {
  vaultId: string;
  ownerAddress: string;
  blockchainType: BlockchainType;
  verificationLevel?: 'basic' | 'standard' | 'advanced';
  metadata?: Record<string, any>;
}

// Define the verification response
export interface ZkVerificationResponse {
  success: boolean;
  vaultId: string;
  timestamp: number;
  verificationId: string;
  proofId?: string;
  aggregatedProofId?: string;
  chains: BlockchainType[];
  errors?: Record<string, string>;
  metadata?: Record<string, any>;
}

// Define the proof generation request parameters
export interface ZkProofRequest {
  vaultId: string;
  ownerAddress: string;
  privateKey: string;
}

// Define the aggregated proof response
export interface AggregatedProofResponse {
  id: string;
  vaultId: string;
  timestamp: number;
  chains: BlockchainType[];
  primaryChain: BlockchainType;
  aggregationHash: string;
  validationThreshold: number;
  status: 'pending' | 'verified' | 'failed';
  validatedBy: BlockchainType[];
}

/**
 * Service for interacting with the chain-agnostic verification APIs
 */
class ZkVerificationService {
  /**
   * Verify a vault using the chain-agnostic protocol
   */
  async verifyVault(request: ZkVerificationRequest): Promise<ZkVerificationResponse> {
    try {
      const response = await apiRequest(
        'POST',
        '/api/chain-agnostic-verification/verify',
        request
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }
      
      return data.verification;
    } catch (error) {
      console.error('Error verifying vault with ZK proofs:', error);
      throw error;
    }
  }
  
  /**
   * Get a verification by ID
   */
  async getVerification(verificationId: string): Promise<ZkVerificationResponse> {
    try {
      const response = await apiRequest(
        'GET',
        `/api/chain-agnostic-verification/verification/${verificationId}`
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get verification');
      }
      
      return data.verification;
    } catch (error) {
      console.error('Error getting verification:', error);
      throw error;
    }
  }
  
  /**
   * Get an aggregated proof by ID
   */
  async getAggregatedProof(proofId: string): Promise<AggregatedProofResponse> {
    try {
      const response = await apiRequest(
        'GET',
        `/api/chain-agnostic-verification/aggregated-proof/${proofId}`
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get aggregated proof');
      }
      
      return data.proof;
    } catch (error) {
      console.error('Error getting aggregated proof:', error);
      throw error;
    }
  }
  
  /**
   * Generate a proof for a specific chain
   */
  async generateProof(chain: BlockchainType, request: ZkProofRequest): Promise<any> {
    try {
      const response = await apiRequest(
        'POST',
        `/api/chain-agnostic-verification/generate-proof/${chain}`,
        request
      );
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate proof');
      }
      
      return data.proof;
    } catch (error) {
      console.error(`Error generating proof for ${chain}:`, error);
      throw error;
    }
  }
  
  /**
   * Get ZK service status
   */
  async getZkServiceStatus(): Promise<any> {
    try {
      const response = await apiRequest('GET', '/api/zk/status');
      return await response.json();
    } catch (error) {
      console.error('Error getting ZK service status:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const zkVerificationService = new ZkVerificationService();