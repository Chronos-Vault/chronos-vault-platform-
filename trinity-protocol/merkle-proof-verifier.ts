/**
 * Merkle Proof Verification System
 * 
 * Cryptographic proof generation and verification for cross-chain state validation
 * Part of Trinity Protocol Mathematical Defense Layer
 * 
 * Features:
 * - Merkle tree construction from vault states
 * - Proof generation for specific vault operations
 * - Cross-chain proof verification
 * - State root synchronization
 */

import { ethers } from 'ethers';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

export interface VaultStateData {
  vaultId: string;
  owner: string;
  unlockTime: number;
  balance: string;
  isLocked: boolean;
  chain: 'arbitrum' | 'solana' | 'ton';
  blockNumber?: number;
  slot?: number;
  timestamp: number;
}

export interface MerkleProof {
  root: string;
  leaf: string;
  proof: string[];
  verified: boolean;
  index: number;
}

export interface CrossChainStateProof {
  vaultId: string;
  arbitrumProof: MerkleProof;
  solanaProof: MerkleProof;
  tonProof: MerkleProof;
  consensusRoot: string;
  timestamp: number;
}

export class MerkleProofVerifier {
  private stateRoots: Map<string, string> = new Map(); // chain -> merkle root

  /**
   * Generate Merkle proof for vault state
   */
  generateProof(
    vaultStates: VaultStateData[],
    targetVaultId: string
  ): MerkleProof | null {
    if (vaultStates.length === 0) {
      securityLogger.warn('Cannot generate Merkle proof: no vault states provided', SecurityEventType.CROSS_CHAIN_VERIFICATION);
      return null;
    }

    try {
      // Sort vault states for deterministic tree construction
      const sortedStates = vaultStates.sort((a, b) => a.vaultId.localeCompare(b.vaultId));

      // Create leaf nodes (hash of each vault state)
      const leaves = sortedStates.map(state => this.hashVaultState(state));

      // Find target leaf index
      const targetIndex = sortedStates.findIndex(s => s.vaultId === targetVaultId);
      
      if (targetIndex === -1) {
        securityLogger.warn(`Vault ${targetVaultId} not found in state tree`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        return null;
      }

      // Build Merkle tree and generate proof
      const { root, proof } = this.buildMerkleTree(leaves, targetIndex);

      const merkleProof: MerkleProof = {
        root,
        leaf: leaves[targetIndex],
        proof,
        verified: false,
        index: targetIndex
      };

      // Verify the proof
      merkleProof.verified = this.verifyProof(merkleProof);

      securityLogger.info(`🌳 Merkle proof generated for ${targetVaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Root: ${root}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Leaf: ${merkleProof.leaf}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Proof length: ${proof.length}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      return merkleProof;
    } catch (error) {
      securityLogger.error('Error generating Merkle proof', SecurityEventType.SYSTEM_ERROR, error);
      return null;
    }
  }

  /**
   * Verify Merkle proof
   */
  verifyProof(proof: MerkleProof): boolean {
    try {
      let computedHash = proof.leaf;

      // Reconstruct root from proof
      for (const proofElement of proof.proof) {
        if (computedHash < proofElement) {
          computedHash = ethers.keccak256(ethers.concat([computedHash, proofElement]));
        } else {
          computedHash = ethers.keccak256(ethers.concat([proofElement, computedHash]));
        }
      }

      const verified = computedHash === proof.root;

      if (verified) {
        securityLogger.info(`✅ Merkle proof verified successfully`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      } else {
        securityLogger.warn(`❌ Merkle proof verification FAILED`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        securityLogger.warn(`   Expected root: ${proof.root}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
        securityLogger.warn(`   Computed root: ${computedHash}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      }

      return verified;
    } catch (error) {
      securityLogger.error('Error verifying Merkle proof', SecurityEventType.SYSTEM_ERROR, error);
      return false;
    }
  }

  /**
   * Generate cross-chain consensus proof
   */
  generateCrossChainProof(
    arbitrumStates: VaultStateData[],
    solanaStates: VaultStateData[],
    tonStates: VaultStateData[],
    vaultId: string
  ): CrossChainStateProof | null {
    try {
      securityLogger.info(`🔺 Generating cross-chain consensus proof for ${vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Generate individual chain proofs
      const arbitrumProof = this.generateProof(arbitrumStates, vaultId);
      const solanaProof = this.generateProof(solanaStates, vaultId);
      const tonProof = this.generateProof(tonStates, vaultId);

      if (!arbitrumProof || !solanaProof || !tonProof) {
        securityLogger.warn('Failed to generate proofs for all chains', SecurityEventType.CROSS_CHAIN_VERIFICATION);
        return null;
      }

      // Generate consensus root (hash of all chain roots)
      const consensusRoot = this.generateConsensusRoot([
        arbitrumProof.root,
        solanaProof.root,
        tonProof.root
      ]);

      // Store state roots
      this.stateRoots.set('arbitrum', arbitrumProof.root);
      this.stateRoots.set('solana', solanaProof.root);
      this.stateRoots.set('ton', tonProof.root);
      this.stateRoots.set('consensus', consensusRoot);

      const crossChainProof: CrossChainStateProof = {
        vaultId,
        arbitrumProof,
        solanaProof,
        tonProof,
        consensusRoot,
        timestamp: Date.now()
      };

      securityLogger.info(`✅ Cross-chain consensus proof generated`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Arbitrum root: ${arbitrumProof.root}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Solana root: ${solanaProof.root}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   TON root: ${tonProof.root}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Consensus root: ${consensusRoot}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      return crossChainProof;
    } catch (error) {
      securityLogger.error('Error generating cross-chain proof', SecurityEventType.SYSTEM_ERROR, error);
      return null;
    }
  }

  /**
   * Verify cross-chain consensus proof
   */
  verifyCrossChainProof(proof: CrossChainStateProof): boolean {
    try {
      securityLogger.info(`🔍 Verifying cross-chain consensus proof for ${proof.vaultId}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      // Verify individual chain proofs
      const arbitrumValid = this.verifyProof(proof.arbitrumProof);
      const solanaValid = this.verifyProof(proof.solanaProof);
      const tonValid = this.verifyProof(proof.tonProof);

      // Verify consensus root
      const expectedConsensusRoot = this.generateConsensusRoot([
        proof.arbitrumProof.root,
        proof.solanaProof.root,
        proof.tonProof.root
      ]);

      const consensusValid = proof.consensusRoot === expectedConsensusRoot;

      const allValid = arbitrumValid && solanaValid && tonValid && consensusValid;

      securityLogger.info(`   Arbitrum proof: ${arbitrumValid ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Solana proof: ${solanaValid ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   TON proof: ${tonValid ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      securityLogger.info(`   Consensus root: ${consensusValid ? '✅' : '❌'}`, SecurityEventType.CROSS_CHAIN_VERIFICATION);

      if (allValid) {
        securityLogger.info(`✅ Cross-chain consensus proof VERIFIED`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      } else {
        securityLogger.warn(`❌ Cross-chain consensus proof FAILED`, SecurityEventType.CROSS_CHAIN_VERIFICATION);
      }

      return allValid;
    } catch (error) {
      securityLogger.error('Error verifying cross-chain proof', SecurityEventType.SYSTEM_ERROR, error);
      return false;
    }
  }

  /**
   * Hash vault state to create leaf node
   */
  private hashVaultState(state: VaultStateData): string {
    const stateData = {
      vaultId: state.vaultId,
      owner: state.owner,
      unlockTime: state.unlockTime,
      balance: state.balance,
      isLocked: state.isLocked,
      chain: state.chain,
      timestamp: state.timestamp
    };

    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'string', 'uint256', 'string', 'bool', 'string', 'uint256'],
      [
        stateData.vaultId,
        stateData.owner,
        stateData.unlockTime,
        stateData.balance,
        stateData.isLocked,
        stateData.chain,
        stateData.timestamp
      ]
    );

    return ethers.keccak256(encoded);
  }

  /**
   * Build Merkle tree and generate proof
   */
  private buildMerkleTree(leaves: string[], targetIndex: number): { root: string; proof: string[] } {
    if (leaves.length === 0) {
      throw new Error('Cannot build Merkle tree with no leaves');
    }

    const proof: string[] = [];
    let currentLevel = [...leaves];
    let currentIndex = targetIndex;

    // Build tree level by level
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];

      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const left = currentLevel[i];
          const right = currentLevel[i + 1];
          const parent = this.hashPair(left, right);
          
          // Add sibling to proof if current index is in this pair
          if (i === currentIndex || i + 1 === currentIndex) {
            const sibling = (i === currentIndex) ? right : left;
            proof.push(sibling);
            currentIndex = Math.floor(currentIndex / 2);
          }

          nextLevel.push(parent);
        } else {
          // Odd node, promote to next level
          nextLevel.push(currentLevel[i]);
          if (i === currentIndex) {
            currentIndex = Math.floor(currentIndex / 2);
          }
        }
      }

      currentLevel = nextLevel;
    }

    return {
      root: currentLevel[0],
      proof
    };
  }

  /**
   * Hash a pair of nodes
   */
  private hashPair(left: string, right: string): string {
    // Sort to ensure deterministic hashing
    if (left < right) {
      return ethers.keccak256(ethers.concat([left, right]));
    } else {
      return ethers.keccak256(ethers.concat([right, left]));
    }
  }

  /**
   * Generate consensus root from chain roots
   */
  private generateConsensusRoot(chainRoots: string[]): string {
    const sortedRoots = [...chainRoots].sort();
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes32', 'bytes32', 'bytes32'],
      sortedRoots
    );
    return ethers.keccak256(encoded);
  }

  /**
   * Get state root for a chain
   */
  getStateRoot(chain: 'arbitrum' | 'solana' | 'ton' | 'consensus'): string | undefined {
    return this.stateRoots.get(chain);
  }

  /**
   * Get all state roots
   */
  getAllStateRoots(): Map<string, string> {
    return new Map(this.stateRoots);
  }

  /**
   * Clear cached state roots
   */
  clearCache(): void {
    this.stateRoots.clear();
    securityLogger.info('🧹 Merkle proof cache cleared', SecurityEventType.CROSS_CHAIN_VERIFICATION);
  }
}

export const merkleProofVerifier = new MerkleProofVerifier();
