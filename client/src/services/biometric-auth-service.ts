/**
 * Biometric Authentication Service
 * 
 * This service provides an interface to the Web Authentication API (WebAuthn)
 * which allows for biometric authentication using fingerprint, face ID, etc.
 * through the browser's credential management API.
 */

interface BiometricCredential {
  id: string;
  name: string;
  createDate: string;
  lastUsed?: string;
  userId: string;
}

class BiometricAuthService {
  private apiEndpoint = '/api/biometric';
  
  /**
   * Check if the device supports biometric authentication
   */
  async isBiometricSupported(): Promise<boolean> {
    // Check if the PublicKeyCredential API is available
    if (window.PublicKeyCredential === undefined) {
      console.warn('WebAuthn is not supported in this browser');
      return false;
    }
    
    // Check if the device has biometric capabilities
    try {
      // @ts-ignore - isUserVerifyingPlatformAuthenticatorAvailable is still experimental
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.warn('Error checking biometric support:', error);
      return false;
    }
  }
  
  /**
   * Register a new biometric credential
   * @param userId User identifier
   * @param username User readable name
   */
  async registerBiometric(userId: string, username: string): Promise<BiometricCredential | null> {
    if (!await this.isBiometricSupported()) {
      throw new Error('Biometric authentication is not supported on this device');
    }
    
    try {
      // 1. Get challenge from the server
      const challengeResponse = await fetch(`${this.apiEndpoint}/challenge/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, username }),
        credentials: 'include',
      });
      
      if (!challengeResponse.ok) {
        throw new Error('Failed to get registration challenge');
      }
      
      const { challenge, publicKey } = await challengeResponse.json();
      
      // 2. Create credential options with the challenge
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: this.base64UrlDecode(challenge),
        rp: {
          name: 'Chronos Vault',
          id: window.location.hostname,
        },
        user: {
          id: this.base64UrlDecode(userId),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Use platform authenticator (built-in biometric like TouchID, FaceID, etc.)
          userVerification: 'required', // Require biometric verification
          requireResidentKey: true, // Create a resident key (passwordless)
        },
        timeout: 60000, // 1 minute
        attestation: 'direct',
      };
      
      // 3. Create the credential
      // @ts-ignore - Type issues with PublicKeyCredential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      
      if (!credential) {
        throw new Error('Failed to create credential');
      }
      
      // 4. Send the credential to the server
      const response = await fetch(`${this.apiEndpoint}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: credential.id,
          rawId: this.arrayBufferToBase64(
            // @ts-ignore - Type issues with PublicKeyCredential
            new Uint8Array(credential.rawId)
          ),
          // @ts-ignore - Type issues with PublicKeyCredential
          response: {
            // @ts-ignore - Type issues with PublicKeyCredential
            clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON),
            // @ts-ignore - Type issues with PublicKeyCredential
            attestationObject: this.arrayBufferToBase64(credential.response.attestationObject),
          },
          type: credential.type,
          userId,
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to register credential on server');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering biometric credential:', error);
      return null;
    }
  }
  
  /**
   * Authenticate using biometric
   * @param userId Optional user ID when known
   */
  async authenticate(userId?: string): Promise<boolean> {
    if (!await this.isBiometricSupported()) {
      throw new Error('Biometric authentication is not supported on this device');
    }
    
    try {
      // 1. Get challenge from the server
      const challengeResponse = await fetch(`${this.apiEndpoint}/challenge/authentication`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });
      
      if (!challengeResponse.ok) {
        throw new Error('Failed to get authentication challenge');
      }
      
      const { challenge, allowCredentials } = await challengeResponse.json();
      
      // 2. Create credential request options with the challenge
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: this.base64UrlDecode(challenge),
        timeout: 60000, // 1 minute
        userVerification: 'required',
      };
      
      // Add allowCredentials if provided
      if (allowCredentials && Array.isArray(allowCredentials) && allowCredentials.length > 0) {
        // @ts-ignore - Type issues with PublicKeyCredential
        publicKeyCredentialRequestOptions.allowCredentials = allowCredentials.map(cred => ({
          id: this.base64UrlDecode(cred.id),
          type: 'public-key',
        }));
      }
      
      // 3. Get the credential
      // @ts-ignore - Type issues with PublicKeyCredential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });
      
      if (!credential) {
        throw new Error('Failed to get credential');
      }
      
      // 4. Send the credential to the server for verification
      const response = await fetch(`${this.apiEndpoint}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: credential.id,
          rawId: this.arrayBufferToBase64(
            // @ts-ignore - Type issues with PublicKeyCredential
            new Uint8Array(credential.rawId)
          ),
          // @ts-ignore - Type issues with PublicKeyCredential
          response: {
            // @ts-ignore - Type issues with PublicKeyCredential
            clientDataJSON: this.arrayBufferToBase64(credential.response.clientDataJSON),
            // @ts-ignore - Type issues with PublicKeyCredential
            authenticatorData: this.arrayBufferToBase64(credential.response.authenticatorData),
            // @ts-ignore - Type issues with PublicKeyCredential
            signature: this.arrayBufferToBase64(credential.response.signature),
            // @ts-ignore - Type issues with PublicKeyCredential
            userHandle: credential.response.userHandle 
              ? this.arrayBufferToBase64(credential.response.userHandle) 
              : null,
          },
          type: credential.type,
        }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to verify credential on server');
      }
      
      const result = await response.json();
      return result.verified === true;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  }
  
  /**
   * Get all biometric credentials for a user
   * @param userId User ID
   */
  async getUserCredentials(userId: string): Promise<BiometricCredential[]> {
    try {
      const response = await fetch(`${this.apiEndpoint}/credentials/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to get user credentials');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }
  
  /**
   * Delete a specific credential
   * @param credentialId Credential ID to delete
   */
  async deleteCredential(credentialId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiEndpoint}/credentials/${credentialId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete credential');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting credential:', error);
      return false;
    }
  }
  
  // Helper methods for encoding/decoding
  
  private arrayBufferToBase64(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }
  
  private base64UrlDecode(base64Url: string): ArrayBuffer {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const binaryString = atob(paddedBase64);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return bytes.buffer;
  }
}

export const biometricAuthService = new BiometricAuthService();