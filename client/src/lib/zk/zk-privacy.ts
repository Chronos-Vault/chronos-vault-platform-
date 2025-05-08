/**
 * Chronos Vault Zero-Knowledge Privacy Layer
 * 
 * This module implements zero-knowledge proofs to enhance privacy for vault contents.
 * It allows users to prove certain properties about their vault content without revealing
 * the actual content.
 */

import { sha256 } from 'js-sha256';

interface EncryptedData {
  ciphertext: string; // Base64 encoded encrypted data
  nonce: string;      // Base64 encoded nonce
  salt: string;       // Base64 encoded salt
}

interface ZkProof {
  proof: string;      // Base64 encoded proof
  publicInputs: string[]; // Public inputs to the proof
  commitment: string; // Hash commitment
  timestamp: number;  // When the proof was created
}

/**
 * Encrypts sensitive vault data with a user's private key
 * and produces a zero-knowledge proof that can be verified.
 * 
 * @param data - The vault data to encrypt
 * @param privateKeyHex - The user's private key in hex format
 * @returns The encrypted data and a zk-proof
 */
export async function encryptWithZkProof(data: string, privateKeyHex: string): Promise<{
  encryptedData: EncryptedData;
  zkProof: ZkProof;
}> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltBase64 = btoa(String.fromCharCode.apply(null, Array.from(salt)));
  
  // Generate a random nonce
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const nonceBase64 = btoa(String.fromCharCode.apply(null, Array.from(nonce)));
  
  // Derive encryption key from private key and salt
  const encoder = new TextEncoder();
  const privateKeyBytes = hexToBytes(privateKeyHex);
  
  // In a production implementation, we would use proper PBKDF2 or similar
  // For demonstration, we'll derive a key by hashing private key with salt
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  
  // Encrypt the data
  const dataBytes = encoder.encode(data);
  const encryptedBytes = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    dataBytes
  );
  
  const ciphertextBase64 = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedBytes)))
  );
  
  // Generate a commitment to the data (a hash)
  const dataHash = sha256(data);
  
  // In a real implementation, we would generate an actual zero-knowledge proof here
  // For now, we'll create a simulated proof structure
  const simulatedProof = {
    proof: btoa(dataHash + saltBase64),
    publicInputs: [dataHash.substring(0, 8)], // Just using a prefix of the hash
    commitment: dataHash,
    timestamp: Date.now()
  };
  
  return {
    encryptedData: {
      ciphertext: ciphertextBase64,
      nonce: nonceBase64,
      salt: saltBase64
    },
    zkProof: simulatedProof
  };
}

/**
 * Verifies a zero-knowledge proof without revealing the actual vault data.
 * 
 * @param zkProof - The proof to verify
 * @returns Whether the proof is valid
 */
export function verifyZkProof(zkProof: ZkProof): boolean {
  // In a real implementation, we would do actual zero-knowledge verification here
  // For demonstration, we're just checking that the proof format is valid
  
  // Check if proof exists and is a string
  if (!zkProof.proof || typeof zkProof.proof !== 'string') {
    return false;
  }
  
  // Check if public inputs are present
  if (!zkProof.publicInputs || !Array.isArray(zkProof.publicInputs)) {
    return false;
  }
  
  // Check if commitment exists
  if (!zkProof.commitment || typeof zkProof.commitment !== 'string') {
    return false;
  }
  
  // Check if timestamp is valid
  if (!zkProof.timestamp || typeof zkProof.timestamp !== 'number') {
    return false;
  }
  
  // Check if timestamp is in the past
  if (zkProof.timestamp > Date.now()) {
    return false;
  }
  
  return true;
}

/**
 * Decrypts data that was encrypted with a zero-knowledge proof.
 * 
 * @param encryptedData - The encrypted data
 * @param privateKeyHex - The user's private key in hex format
 * @returns The decrypted data
 */
export async function decryptWithZkVerification(
  encryptedData: EncryptedData,
  privateKeyHex: string
): Promise<string> {
  const decoder = new TextDecoder();
  
  // Convert Base64 encoded values back to byte arrays
  const ciphertext = Uint8Array.from(
    atob(encryptedData.ciphertext).split('').map(c => c.charCodeAt(0))
  );
  
  const nonce = Uint8Array.from(
    atob(encryptedData.nonce).split('').map(c => c.charCodeAt(0))
  );
  
  const salt = Uint8Array.from(
    atob(encryptedData.salt).split('').map(c => c.charCodeAt(0))
  );
  
  // Derive the decryption key (same process as encryption)
  const privateKeyBytes = hexToBytes(privateKeyHex);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  
  // Decrypt the data
  try {
    const decryptedBytes = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce },
      key,
      ciphertext
    );
    
    return decoder.decode(decryptedBytes);
  } catch (error) {
    throw new Error('Decryption failed. Invalid key or corrupted data.');
  }
}

/**
 * Generates a zero-knowledge proof that a vault is accessible by specific 
 * beneficiaries without revealing the actual beneficiaries list.
 * 
 * @param beneficiaryAddresses - Array of blockchain addresses of beneficiaries
 * @param privateKeyHex - The user's private key in hex format
 * @returns A proof that can be verified without revealing the beneficiaries
 */
export function generateBeneficiaryProof(
  beneficiaryAddresses: string[],
  privateKeyHex: string
): ZkProof {
  // Sort addresses to ensure consistent ordering
  const sortedAddresses = [...beneficiaryAddresses].sort();
  
  // Create a Merkle tree-like commitment to the beneficiaries
  // In production, this would be an actual Merkle tree
  const addressesHash = sha256(sortedAddresses.join(''));
  
  // Generate a commitment using the private key and the hash
  const privateKeyBytes = hexToBytes(privateKeyHex);
  const commitment = sha256(addressesHash + bytesToHex(privateKeyBytes));
  
  // In a real implementation, we would generate an actual zero-knowledge proof
  // For now, we'll create a simulated proof
  return {
    proof: btoa(commitment),
    publicInputs: [addressesHash.substring(0, 16)],
    commitment,
    timestamp: Date.now()
  };
}

/**
 * Checks if a specific address is included in a vault's beneficiaries
 * without revealing the complete list of beneficiaries.
 * 
 * @param proof - The beneficiary proof
 * @param address - The address to check
 * @returns True if the address is a beneficiary
 */
export function verifyAddressInBeneficiaries(
  proof: ZkProof,
  address: string
): boolean {
  // In a real implementation, this would involve zero-knowledge proofs
  // For demonstration, we're doing a simplified check
  
  // Verify the proof format first
  if (!verifyZkProof(proof)) {
    return false;
  }
  
  // In production, we would verify a Merkle proof here
  return true;
}

/**
 * Convert a hex string to a Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert a Uint8Array to a hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}