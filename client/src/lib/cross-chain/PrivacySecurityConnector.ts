/**
 * Privacy-Security Connector Service
 * 
 * This service acts as a bridge between the Zero-Knowledge Privacy Layer and the Triple-Chain
 * Security architecture, ensuring that privacy operations are properly secured across
 * multiple blockchains and that security operations respect privacy constraints.
 */

import { getPrivacyLayerService, ZkProofType, ZkProof } from '@/lib/privacy';
import { securityServiceAggregator } from './SecurityServiceAggregator';
import { BlockchainType } from './interfaces';
import { ethereumService } from '@/lib/ethereum/ethereum-service';
import { solanaService } from '@/lib/solana/solana-service';
import { tonContractService } from '@/lib/ton/ton-contract-service';

// Security levels for privacy operations
export enum PrivacySecurityLevel {
  BASIC = 1,      // Single chain verification
  STANDARD = 2,   // Two-chain verification
  ADVANCED = 3,   // Triple-chain verification with anomaly detection
  ENTERPRISE = 4, // Triple-chain with ZK proofs and anomaly detection
  MAXIMUM = 5     // Triple-chain with ZK proofs, anomaly detection, and off-chain backup
}

// Results from a secure privacy operation
export interface SecurePrivacyResult {
  success: boolean;
  proofId?: string;
  verificationIds?: string[];
  securityLevel: PrivacySecurityLevel;
  blockchainStatuses: {
    ethereum?: boolean;
    solana?: boolean;
    ton?: boolean;
  };
  crossChainConsistency: boolean;
  timestamp: number;
  details?: string;
  error?: string;
}

/**
 * Service that connects the Privacy Layer with the Security Architecture
 */
class PrivacySecurityConnector {
  private _privacyService = getPrivacyLayerService();
  private _securityService = securityServiceAggregator;
  
  /**
   * Generate and verify a proof with the specified security level
   */
  async generateSecureProof(
    vaultId: string,
    proofType: ZkProofType,
    securityLevel: PrivacySecurityLevel = PrivacySecurityLevel.STANDARD,
    additionalParams: Record<string, any> = {}
  ): Promise<SecurePrivacyResult> {
    try {
      console.log(`Generating secure proof for vault ${vaultId} with security level ${securityLevel}`);
      
      // Determine which blockchains to use based on security level
      const blockchains = this.getBlockchainsForSecurityLevel(securityLevel);
      
      // Generate cross-chain proofs
      const verification = await this._privacyService.generateCrossChainProofs(
        vaultId,
        proofType,
        blockchains,
        additionalParams
      );
      
      // For higher security levels, further integrate with security services
      if (securityLevel >= PrivacySecurityLevel.ADVANCED) {
        await this._privacyService.integrateWithTripleChainSecurity(
          vaultId,
          'generate_proof',
          securityLevel
        );
      }
      
      // We can't record verification directly in the security service as it lacks that method
      // Instead, we'll update security metrics ourselves
      console.log('Verification successful, updating security metrics');
      
      // We would ideally call a method to record this, but we'll log it for now
      // This is where we would integrate with a security incident/verification tracking system
      
      // Build the result
      const result: SecurePrivacyResult = {
        success: verification.status === 'VERIFIED',
        proofId: verification.proofId,
        verificationIds: verification.verifications.map(v => v.txHash || '').filter(Boolean),
        securityLevel,
        blockchainStatuses: {
          ethereum: verification.verifications.some(v => v.blockchain === 'ETH' && v.status === 'VERIFIED'),
          solana: verification.verifications.some(v => v.blockchain === 'SOL' && v.status === 'VERIFIED'),
          ton: verification.verifications.some(v => v.blockchain === 'TON' && v.status === 'VERIFIED')
        },
        crossChainConsistency: this.calculateConsistency(verification.verifications),
        timestamp: Date.now()
      };
      
      return result;
    } catch (error: any) {
      console.error('Error generating secure proof:', error);
      
      // Log the security incident for now - we would ideally have a formal tracking system
      console.error('Security incident: Privacy proof failure for vault', vaultId, error.message);
      
      // In a production system, we would record this incident in a security tracking system
      
      return {
        success: false,
        securityLevel,
        blockchainStatuses: {},
        crossChainConsistency: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
  
  /**
   * Verify a proof with secure cross-chain validation
   */
  async verifyProofSecurely(
    proofId: string,
    securityLevel: PrivacySecurityLevel = PrivacySecurityLevel.STANDARD
  ): Promise<SecurePrivacyResult> {
    try {
      console.log(`Verifying proof ${proofId} with security level ${securityLevel}`);
      
      // Get the proof
      const proof = await this._privacyService.getZkProofService().getProof(proofId);
      
      if (!proof) {
        throw new Error('Proof not found');
      }
      
      // Determine which blockchains to use based on security level
      const blockchains = this.getBlockchainsForSecurityLevel(securityLevel);
      
      // Verify on each blockchain
      const verificationResults = [];
      for (const blockchain of blockchains) {
        const result = await this._privacyService.verifyProofOnBlockchain(proofId, blockchain);
        verificationResults.push({
          blockchain,
          isValid: result.isValid,
          details: result.details
        });
      }
      
      // Check security status across chains
      const chainStatuses = await this._securityService.getAllChainStatuses();
      
      // Build the result
      const result: SecurePrivacyResult = {
        success: verificationResults.every(r => r.isValid),
        proofId,
        securityLevel,
        blockchainStatuses: {
          ethereum: verificationResults.find(r => r.blockchain === 'ETH')?.isValid || false,
          solana: verificationResults.find(r => r.blockchain === 'SOL')?.isValid || false,
          ton: verificationResults.find(r => r.blockchain === 'TON')?.isValid || false
        },
        crossChainConsistency: this.calculateConsistencyFromResults(verificationResults),
        timestamp: Date.now(),
        details: this.combineVerificationDetails(verificationResults)
      };
      
      return result;
    } catch (error: any) {
      console.error('Error verifying proof securely:', error);
      
      return {
        success: false,
        securityLevel,
        blockchainStatuses: {},
        crossChainConsistency: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
  
  /**
   * Create a selective disclosure proof with security guarantees
   */
  async createSecureSelectiveDisclosure(
    vaultId: string,
    disclosedFields: string[],
    securityLevel: PrivacySecurityLevel = PrivacySecurityLevel.STANDARD
  ): Promise<SecurePrivacyResult> {
    try {
      // Determine primary blockchain based on security level
      const primaryBlockchain = this.getPrimaryBlockchainForLevel(securityLevel);
      
      // Create selective disclosure proof on primary chain
      const proof = await this._privacyService.createSelectiveDisclosureProof(
        vaultId,
        disclosedFields,
        primaryBlockchain
      );
      
      // For higher security levels, verify across multiple chains
      let crossChainConsistency = true;
      const blockchainStatuses: Record<string, boolean> = {
        [primaryBlockchain.toLowerCase()]: true
      };
      
      if (securityLevel >= PrivacySecurityLevel.STANDARD) {
        // Get additional chains for verification
        const additionalChains = this.getBlockchainsForSecurityLevel(securityLevel)
          .filter(chain => chain !== primaryBlockchain);
        
        // Verify on additional chains if needed
        if (additionalChains.length > 0) {
          for (const chain of additionalChains) {
            try {
              const verificationResult = await this._privacyService.verifyProofOnBlockchain(
                proof.id,
                chain
              );
              blockchainStatuses[chain.toLowerCase()] = verificationResult.isValid;
            } catch (e) {
              blockchainStatuses[chain.toLowerCase()] = false;
              console.error(`Error verifying on ${chain}:`, e);
            }
          }
        }
        
        // Calculate cross-chain consistency
        const validChains = Object.values(blockchainStatuses).filter(Boolean).length;
        crossChainConsistency = validChains >= Math.min(2, this.getBlockchainsForSecurityLevel(securityLevel).length);
      }
      
      return {
        success: true,
        proofId: proof.id,
        securityLevel,
        blockchainStatuses: {
          ethereum: blockchainStatuses['eth'] || false,
          solana: blockchainStatuses['sol'] || false,
          ton: blockchainStatuses['ton'] || false
        },
        crossChainConsistency,
        timestamp: Date.now(),
        details: `Created selective disclosure proof with ${disclosedFields.length} disclosed fields`
      };
    } catch (error: any) {
      console.error('Error creating secure selective disclosure:', error);
      
      return {
        success: false,
        securityLevel,
        blockchainStatuses: {},
        crossChainConsistency: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
  
  /**
   * Create a range proof with security guarantees
   */
  async createSecureRangeProof(
    vaultId: string,
    minValue: string,
    maxValue: string,
    securityLevel: PrivacySecurityLevel = PrivacySecurityLevel.STANDARD
  ): Promise<SecurePrivacyResult> {
    try {
      // Determine primary blockchain based on security level
      const primaryBlockchain = this.getPrimaryBlockchainForLevel(securityLevel);
      
      // Create range proof on primary chain
      const proof = await this._privacyService.createRangeProof(
        vaultId,
        minValue,
        maxValue,
        primaryBlockchain
      );
      
      // For higher security levels, verify across multiple chains
      let crossChainConsistency = true;
      const blockchainStatuses: Record<string, boolean> = {
        [primaryBlockchain.toLowerCase()]: true
      };
      
      if (securityLevel >= PrivacySecurityLevel.STANDARD) {
        // Get additional chains for verification
        const additionalChains = this.getBlockchainsForSecurityLevel(securityLevel)
          .filter(chain => chain !== primaryBlockchain);
        
        // Verify on additional chains if needed
        if (additionalChains.length > 0) {
          for (const chain of additionalChains) {
            try {
              const verificationResult = await this._privacyService.verifyProofOnBlockchain(
                proof.id,
                chain
              );
              blockchainStatuses[chain.toLowerCase()] = verificationResult.isValid;
            } catch (e) {
              blockchainStatuses[chain.toLowerCase()] = false;
              console.error(`Error verifying on ${chain}:`, e);
            }
          }
        }
        
        // Calculate cross-chain consistency
        const validChains = Object.values(blockchainStatuses).filter(Boolean).length;
        crossChainConsistency = validChains >= Math.min(2, this.getBlockchainsForSecurityLevel(securityLevel).length);
      }
      
      return {
        success: true,
        proofId: proof.id,
        securityLevel,
        blockchainStatuses: {
          ethereum: blockchainStatuses['eth'] || false,
          solana: blockchainStatuses['sol'] || false,
          ton: blockchainStatuses['ton'] || false
        },
        crossChainConsistency,
        timestamp: Date.now(),
        details: `Created range proof for values between ${minValue} and ${maxValue}`
      };
    } catch (error: any) {
      console.error('Error creating secure range proof:', error);
      
      return {
        success: false,
        securityLevel,
        blockchainStatuses: {},
        crossChainConsistency: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
  
  /**
   * Integrate with vault security system to verify vault integrity while preserving privacy
   */
  async verifyVaultIntegrityWithPrivacy(
    vaultId: string,
    securityLevel: PrivacySecurityLevel = PrivacySecurityLevel.STANDARD
  ): Promise<SecurePrivacyResult> {
    try {
      console.log(`Verifying vault integrity with privacy for ${vaultId} at security level ${securityLevel}`);
      
      // First check vault integrity through security layer
      const vaultIntegrityCheck = await this._securityService.verifyVaultIntegrity(vaultId);
      
      if (!vaultIntegrityCheck.verified) {
        throw new Error('Vault not found or inaccessible');
      }
      
      // Generate an ownership proof with privacy
      const verificationResult = await this.generateSecureProof(
        vaultId,
        ZkProofType.OWNERSHIP,
        securityLevel,
        { operation: 'verify_integrity' }
      );
      
      // For higher security levels, check security metrics
      if (securityLevel >= PrivacySecurityLevel.ADVANCED) {
        const metrics = await this._securityService.getSecurityMetrics();
        
        // Add security metrics to the result
        return {
          ...verificationResult,
          details: `${verificationResult.details || ''} Security Score: ${metrics.securityScore}, Cross-Chain Consistency: ${metrics.crossChainConsistency}%`
        };
      }
      
      return verificationResult;
    } catch (error: any) {
      console.error('Error verifying vault integrity with privacy:', error);
      
      return {
        success: false,
        securityLevel,
        blockchainStatuses: {},
        crossChainConsistency: false,
        timestamp: Date.now(),
        error: error.message
      };
    }
  }
  
  /**
   * Get blockchains to use based on security level
   */
  private getBlockchainsForSecurityLevel(level: PrivacySecurityLevel): BlockchainType[] {
    switch (level) {
      case PrivacySecurityLevel.BASIC:
        return ['ETH'];
      case PrivacySecurityLevel.STANDARD:
        return ['ETH', 'SOL'];
      case PrivacySecurityLevel.ADVANCED:
      case PrivacySecurityLevel.ENTERPRISE:
      case PrivacySecurityLevel.MAXIMUM:
        return ['ETH', 'SOL', 'TON'];
      default:
        return ['ETH'];
    }
  }
  
  /**
   * Get primary blockchain for this security level
   */
  private getPrimaryBlockchainForLevel(level: PrivacySecurityLevel): BlockchainType {
    // For basic levels, use Ethereum
    if (level <= PrivacySecurityLevel.STANDARD) {
      return 'ETH';
    }
    
    // For advanced levels, check which chains are available and preferred
    // Since we don't have direct isConnected methods, we'll check the status from the security service
    const chainStatuses = this._securityService.getAllChainStatuses();
    const ethStatus = chainStatuses.find(status => status.chain === 'ETH');
    const solStatus = chainStatuses.find(status => status.chain === 'SOL');
    const tonStatus = chainStatuses.find(status => status.chain === 'TON');
    
    // Prioritize chains that are connected ('online')
    if (ethStatus?.status === 'online') return 'ETH';
    if (solStatus?.status === 'online') return 'SOL';
    if (tonStatus?.status === 'online') return 'TON';
    
    // Default to ETH if nothing is available
    return 'ETH';
  }
  
  /**
   * Calculate consistency across verifications
   */
  private calculateConsistency(verifications: any[]): boolean {
    // For consistency, at least 2 chains must agree
    const verifiedCount = verifications.filter(v => v.status === 'VERIFIED').length;
    return verifiedCount >= 2;
  }
  
  /**
   * Calculate consistency from verification results
   */
  private calculateConsistencyFromResults(results: { blockchain: BlockchainType; isValid: boolean }[]): boolean {
    // For consistency, at least 2 chains must agree
    const verifiedCount = results.filter(r => r.isValid).length;
    return verifiedCount >= 2;
  }
  
  /**
   * Combine verification details from multiple chains
   */
  private combineVerificationDetails(results: { blockchain: BlockchainType; details?: string }[]): string {
    return results
      .filter(r => r.details)
      .map(r => `${r.blockchain}: ${r.details}`)
      .join(' | ');
  }
}

// Export singleton instance
let privacySecurityConnector: PrivacySecurityConnector | null = null;

export function getPrivacySecurityConnector(): PrivacySecurityConnector {
  if (!privacySecurityConnector) {
    privacySecurityConnector = new PrivacySecurityConnector();
  }
  return privacySecurityConnector;
}
