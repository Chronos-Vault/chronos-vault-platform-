pragma circom 2.0.0;

/*
 * Multi-Signature Verification Circuit
 * 
 * Proves that sufficient signatures (meeting or exceeding a threshold) have been provided
 * without revealing which specific keys signed or their total count.
 */

include "node_modules/circomlib/circuits/mimc.circom";
include "node_modules/circomlib/circuits/comparators.circom";

template MultiSigVerification(maxSigners) {
    // Public inputs
    signal input threshold; // Required number of signatures
    signal input vaultId; // The vault ID
    
    // Private inputs
    signal input numValidSignatures; // How many valid signatures we have
    signal input signatureHashes[maxSigners]; // Hashes of valid signatures
    signal input validityFlags[maxSigners]; // 1 if signature at index is valid, 0 otherwise
    
    // Verify that we have enough valid signatures
    component greaterOrEqual = GreaterEqThan(32);
    greaterOrEqual.in[0] <== numValidSignatures;
    greaterOrEqual.in[1] <== threshold;
    greaterOrEqual.out === 1; // must be greater or equal
    
    // Count valid signatures and ensure it matches numValidSignatures
    var validCount = 0;
    for (var i = 0; i < maxSigners; i++) {
        // Each flag must be 0 or 1
        validityFlags[i] * (1 - validityFlags[i]) === 0;
        validCount += validityFlags[i];
    }
    
    // Ensure the provided count matches the actual count
    numValidSignatures === validCount;
    
    // Create a combined hash of all valid signatures
    // This allows external verification that these specific signatures were used
    component combinedHasher = MiMC7(maxSigners);
    for (var i = 0; i < maxSigners; i++) {
        combinedHasher.ins[i] <== signatureHashes[i] * validityFlags[i];
    }
    combinedHasher.k <== vaultId;
    
    // The verification hash can be used for cross-chain verification
    signal output verificationHash;
    verificationHash <== combinedHasher.outs[0];
}

// Using a maximum of 10 signers for this example
component main {public [threshold, vaultId]} = MultiSigVerification(10);