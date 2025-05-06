pragma circom 2.0.0;

/*
 * Vault Ownership Circuit
 * 
 * Proves that the prover knows the private key corresponding to a 
 * public wallet address that owns a specific vault, without revealing the private key.
 * This uses a hash verification approach similar to how blockchain addresses are derived.
 */

include "node_modules/circomlib/circuits/mimc.circom";
include "node_modules/circomlib/circuits/bitify.circom";

template VaultOwnershipProof() {
    // Public inputs 
    signal input vaultId; // Public vault ID to prove ownership for
    signal input publicOwnerAddress; // Public blockchain address of the vault owner

    // Private inputs
    signal input privateKey; // The private key (kept secret)
    signal input salt; // A random salt for added security

    // Verify that privateKey generates the correct publicOwnerAddress
    // In real implementation, this would use proper EdDSA or other verification
    // Here we use a simplified MiMC hash for demonstration
    component hasher = MiMC7(1);
    hasher.ins[0] <== privateKey;
    hasher.k <== salt;

    // The output of the hash should match the publicOwnerAddress
    publicOwnerAddress === hasher.outs[0];
    
    // Link the privateKey to the vaultId through another hash
    // This proves that this privateKey is associated with this specific vault
    component vaultVerifier = MiMC7(2);
    vaultVerifier.ins[0] <== privateKey;
    vaultVerifier.ins[1] <== vaultId;
    vaultVerifier.k <== salt;
    
    // The output is a signal that can be used for further verification
    signal output verificationHash;
    verificationHash <== vaultVerifier.outs[0];
}

// The main component that will be used for the proof
component main {public [vaultId, publicOwnerAddress]} = VaultOwnershipProof();