/**
 * Biometric Authentication Service
 * Provides WebAuthn (Web Authentication) functionality for biometric authentication
 * on the server side, handling credential registration, verification, and management.
 */

import { randomBytes } from 'crypto';

// In-memory storage for WebAuthn credentials and challenges
// In a production environment, this would be stored in a database
interface WebAuthnCredential {
  id: string;
  userId: string;
  name: string;
  publicKey: string;
  counter: number;
  createDate: Date;
  lastUsed?: Date;
}

interface Challenge {
  challenge: string;
  timeout: number;
  userId: string;
  username?: string;
  created: Date;
}

// In-memory storage
const credentials: WebAuthnCredential[] = [];
const challenges: Challenge[] = [];

// Constants
const CHALLENGE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const RP_NAME = 'Chronos Vault';
const RP_ID = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

/**
 * Generate a random challenge
 */
const generateChallenge = (): string => {
  return randomBytes(32).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Clean up expired challenges
 */
const cleanupChallenges = (): void => {
  const now = new Date();
  const validChallenges = challenges.filter(
    (challenge) => now.getTime() - challenge.created.getTime() < CHALLENGE_TIMEOUT
  );
  challenges.length = 0;
  challenges.push(...validChallenges);
};

/**
 * Generate registration options for a user
 */
const generateRegistrationChallenge = async (userId: string, username: string) => {
  cleanupChallenges();
  
  const challenge = generateChallenge();
  
  // Store the challenge for later verification
  challenges.push({
    challenge,
    timeout: CHALLENGE_TIMEOUT,
    userId,
    username,
    created: new Date()
  });
  
  // Get existing credentials for this user to exclude them
  const existingCredentials = credentials.filter(cred => cred.userId === userId);
  
  // Generate registration options
  return {
    publicKey: {
      challenge,
      rp: {
        name: RP_NAME,
        id: RP_ID
      },
      user: {
        id: userId,
        name: username,
        displayName: username
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 }, // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      timeout: CHALLENGE_TIMEOUT,
      attestation: 'direct',
      excludeCredentials: existingCredentials.map(cred => ({
        id: cred.id,
        type: 'public-key'
      })),
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred'
      }
    }
  };
};

/**
 * Generate authentication options for a user
 */
const generateAuthenticationChallenge = async (userId: string) => {
  cleanupChallenges();
  
  const challenge = generateChallenge();
  
  // Store the challenge for later verification
  challenges.push({
    challenge,
    timeout: CHALLENGE_TIMEOUT,
    userId,
    created: new Date()
  });
  
  // Get existing credentials for this user
  const userCredentials = credentials.filter(cred => cred.userId === userId);
  
  if (userCredentials.length === 0) {
    throw new Error('No credentials found for this user');
  }
  
  // Generate authentication options
  return {
    publicKey: {
      challenge,
      timeout: CHALLENGE_TIMEOUT,
      rpId: RP_ID,
      allowCredentials: userCredentials.map(cred => ({
        id: cred.id,
        type: 'public-key'
      })),
      userVerification: 'preferred'
    }
  };
};

/**
 * Register a new credential
 */
const registerCredential = async (
  data: { credential: any; userId: string }
) => {
  const { credential, userId } = data;
  
  // Find the challenge
  const challenge = challenges.find(c => c.userId === userId);
  
  if (!challenge) {
    throw new Error('Challenge not found or expired');
  }
  
  // Verify the registration data (this is a simplified version)
  // In a real implementation, you would:
  // 1. Verify that the challenge matches
  // 2. Verify the origin is correct
  // 3. Verify the signature using the attestation data
  // 4. Store the credential for future use
  
  // For this demo, we'll assume verification passes and store the credential
  const newCredential: WebAuthnCredential = {
    id: credential.id,
    userId,
    name: challenge.username || 'Authenticator',
    publicKey: credential.rawId, // In a real implementation, we'd extract the actual public key
    counter: 0,
    createDate: new Date()
  };
  
  credentials.push(newCredential);
  
  // Remove the used challenge
  const challengeIndex = challenges.findIndex(c => c.userId === userId);
  if (challengeIndex >= 0) {
    challenges.splice(challengeIndex, 1);
  }
  
  return newCredential;
};

/**
 * Verify a credential for authentication
 */
const verifyCredential = async (
  data: { credential: any; userId: string }
): Promise<{ verified: boolean; userId: string }> => {
  const { credential, userId } = data;
  
  // Find the challenge
  const challenge = challenges.find(c => c.userId === userId);
  
  if (!challenge) {
    throw new Error('Challenge not found or expired');
  }
  
  // Find the credential
  const storedCredential = credentials.find(c => c.id === credential.id);
  
  if (!storedCredential) {
    throw new Error('Credential not found');
  }
  
  // Verify the authentication data (this is a simplified version)
  // In a real implementation, you would:
  // 1. Verify that the challenge matches
  // 2. Verify the origin is correct
  // 3. Verify the signature using the public key
  // 4. Verify the counter is greater than the stored counter
  
  // For this demo, we'll assume verification passes
  // Update the credential information
  storedCredential.lastUsed = new Date();
  storedCredential.counter += 1;
  
  // Remove the used challenge
  const challengeIndex = challenges.findIndex(c => c.userId === userId);
  if (challengeIndex >= 0) {
    challenges.splice(challengeIndex, 1);
  }
  
  return { verified: true, userId };
};

/**
 * Get all credentials for a user
 */
const getUserCredentials = async (userId: string): Promise<any[]> => {
  return credentials
    .filter(cred => cred.userId === userId)
    .map(cred => ({
      id: cred.id,
      name: cred.name,
      createDate: cred.createDate,
      lastUsed: cred.lastUsed
    }));
};

/**
 * Delete a credential
 */
const deleteCredential = async (credentialId: string): Promise<boolean> => {
  const index = credentials.findIndex(cred => cred.id === credentialId);
  
  if (index === -1) {
    return false;
  }
  
  credentials.splice(index, 1);
  return true;
};

// Export the biometric service
export const biometricService = {
  generateRegistrationChallenge,
  generateAuthenticationChallenge,
  registerCredential,
  verifyCredential,
  getUserCredentials,
  deleteCredential
};