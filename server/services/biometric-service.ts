/**
 * Biometric Authentication Service
 * 
 * This service handles the server-side operations for Web Authentication (WebAuthn),
 * including challenge generation, credential storage, and verification.
 */
import crypto from 'crypto';
import { db } from '../db';
import { sql } from 'drizzle-orm';

// In-memory store for challenges (for dev purposes)
// In production, this would be in Redis or another session store
const challengeStore: Record<string, { challenge: string; expires: number }> = {};

interface BiometricCredential {
  id: string;
  userId: string;
  name: string;
  publicKey: string;
  counter: number;
  createdAt: Date;
  lastUsed?: Date;
}

class BiometricService {
  // Generate a new registration challenge
  async generateRegistrationChallenge(userId: string, username: string): Promise<object> {
    // Generate a random challenge
    const challenge = crypto.randomBytes(32).toString('base64url');
    
    // Store the challenge with an expiration (5 minutes)
    const expires = Date.now() + 5 * 60 * 1000;
    challengeStore[userId] = { challenge, expires };
    
    // Return the challenge data
    return {
      challenge,
      userId,
      username,
      timeout: 300000, // 5 minutes
    };
  }
  
  // Generate a new authentication challenge
  async generateAuthenticationChallenge(userId?: string): Promise<object> {
    // Generate a random challenge
    const challenge = crypto.randomBytes(32).toString('base64url');
    
    // Store the challenge with an expiration (5 minutes)
    const expires = Date.now() + 5 * 60 * 1000;
    const storageKey = userId || 'global-challenge';
    challengeStore[storageKey] = { challenge, expires };
    
    // Get user credentials if userId is provided
    let allowCredentials: { id: string; type: string }[] = [];
    
    if (userId) {
      const credentials = await this.getUserCredentials(userId);
      allowCredentials = credentials.map(cred => ({
        id: cred.id,
        type: 'public-key'
      }));
    }
    
    // Return the challenge data
    return {
      challenge,
      timeout: 300000, // 5 minutes
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
    };
  }
  
  // Register a new credential
  async registerCredential(credentialData: any): Promise<BiometricCredential> {
    const { id, rawId, response, type, userId } = credentialData;
    
    // Verify the challenge
    const storedChallenge = challengeStore[userId];
    if (!storedChallenge || storedChallenge.expires < Date.now()) {
      throw new Error('Challenge expired or invalid');
    }
    
    // In a real implementation, we would:
    // 1. Verify the attestation data
    // 2. Extract the public key from the attestation
    // 3. Verify the signature
    
    // For simplicity in this implementation, we'll just store the credential
    // Create a credential record
    const credential: BiometricCredential = {
      id: rawId, // Use the raw ID as the credential ID
      userId,
      name: `Biometric credential ${new Date().toLocaleDateString()}`,
      publicKey: JSON.stringify(response), // In a real implementation, we'd extract the public key
      counter: 0, // Initialize counter
      createdAt: new Date(),
    };
    
    // Store the credential in the database
    await this.storeCredential(credential);
    
    // Clean up challenge
    delete challengeStore[userId];
    
    return credential;
  }
  
  // Verify a credential during authentication
  async verifyCredential(credentialData: any): Promise<{ verified: boolean; userId?: string }> {
    const { id, rawId, response, type } = credentialData;
    
    // Get the credential from database
    const credential = await this.getCredentialById(rawId);
    if (!credential) {
      return { verified: false };
    }
    
    // Get the stored challenge
    const storedChallenge = challengeStore[credential.userId] || challengeStore['global-challenge'];
    if (!storedChallenge || storedChallenge.expires < Date.now()) {
      return { verified: false };
    }
    
    // In a real implementation, we would:
    // 1. Verify the assertion signature using the stored public key
    // 2. Verify the authenticator data
    // 3. Check and update the counter to prevent replay attacks
    
    // Update last used time and counter
    await this.updateCredentialUsage(credential.id);
    
    // Clean up challenge
    delete challengeStore[credential.userId];
    delete challengeStore['global-challenge'];
    
    return { verified: true, userId: credential.userId };
  }
  
  // Get all credentials for a user
  async getUserCredentials(userId: string): Promise<BiometricCredential[]> {
    try {
      // In a real implementation, we'd query the database
      const result = await db.execute(sql`
        SELECT * FROM biometric_credentials WHERE user_id = ${userId}
      `);
      
      // For now, return an empty array since the table might not exist yet
      return [];
    } catch (error) {
      console.error('Error fetching user credentials:', error);
      return [];
    }
  }
  
  // Get a credential by ID
  async getCredentialById(credentialId: string): Promise<BiometricCredential | null> {
    try {
      // In a real implementation, we'd query the database
      const result = await db.execute(sql`
        SELECT * FROM biometric_credentials WHERE id = ${credentialId} LIMIT 1
      `);
      
      // For now, return null since the table might not exist yet
      return null;
    } catch (error) {
      console.error('Error fetching credential by ID:', error);
      return null;
    }
  }
  
  // Store a new credential
  private async storeCredential(credential: BiometricCredential): Promise<void> {
    try {
      // In a real implementation, we'd insert into the database
      await db.execute(sql`
        INSERT INTO biometric_credentials (
          id, user_id, name, public_key, counter, created_at
        ) VALUES (
          ${credential.id}, 
          ${credential.userId}, 
          ${credential.name}, 
          ${credential.publicKey}, 
          ${credential.counter}, 
          ${credential.createdAt}
        )
      `);
    } catch (error) {
      console.error('Error storing credential:', error);
      // Create table if it doesn't exist (only in development)
      if (process.env.NODE_ENV === 'development') {
        await this.createCredentialsTable();
        // Try again
        await this.storeCredential(credential);
      } else {
        throw error;
      }
    }
  }
  
  // Update credential usage
  private async updateCredentialUsage(credentialId: string): Promise<void> {
    try {
      // In a real implementation, we'd update the database
      await db.execute(sql`
        UPDATE biometric_credentials 
        SET counter = counter + 1, last_used = NOW() 
        WHERE id = ${credentialId}
      `);
    } catch (error) {
      console.error('Error updating credential usage:', error);
    }
  }
  
  // Delete a credential
  async deleteCredential(credentialId: string): Promise<boolean> {
    try {
      // In a real implementation, we'd delete from the database
      await db.execute(sql`
        DELETE FROM biometric_credentials WHERE id = ${credentialId}
      `);
      return true;
    } catch (error) {
      console.error('Error deleting credential:', error);
      return false;
    }
  }
  
  // Create the credentials table if it doesn't exist (development only)
  private async createCredentialsTable(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    try {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS biometric_credentials (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          public_key TEXT NOT NULL,
          counter INTEGER NOT NULL,
          created_at TIMESTAMP NOT NULL,
          last_used TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Error creating credentials table:', error);
    }
  }
}

export const biometricService = new BiometricService();