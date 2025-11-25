/**
 * Biometric Authentication Service
 * Provides WebAuthn (Web Authentication) functionality for biometric authentication
 * including fingerprint, face ID, and other biometric verification methods.
 */
// Trinity Protocol v3.5.18 - Updated: 2025-11-25T19:31:59.584Z


// The base URL for biometric authentication API endpoints
const BASE_URL = '/api/biometric';

/**
 * Check if the browser supports WebAuthn biometric authentication
 */
const isBiometricSupported = async (): Promise<boolean> => {
  try {
    // Check if the browser supports WebAuthn
    return (
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential === 'function' &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function' &&
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
  } catch (error) {
    console.error('Error checking WebAuthn support:', error);
    return false;
  }
};

/**
 * Convert a base64 string to an ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Convert an ArrayBuffer to a base64 string
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Parse the credentials from the server for use with WebAuthn
 */
const parseCredentials = (credentials: any) => {
  if (!credentials) return credentials;
  
  // For registration challenges
  if (credentials.challenge) {
    credentials.challenge = base64ToArrayBuffer(credentials.challenge);
  }
  
  // For authentication challenges
  if (credentials.allowCredentials) {
    credentials.allowCredentials = credentials.allowCredentials.map((cred: any) => ({
      ...cred,
      id: base64ToArrayBuffer(cred.id)
    }));
  }
  
  // For user verification
  if (credentials.publicKey) {
    if (credentials.publicKey.challenge) {
      credentials.publicKey.challenge = base64ToArrayBuffer(credentials.publicKey.challenge);
    }
    
    if (credentials.publicKey.user && credentials.publicKey.user.id) {
      credentials.publicKey.user.id = base64ToArrayBuffer(credentials.publicKey.user.id);
    }
    
    if (credentials.publicKey.allowCredentials) {
      credentials.publicKey.allowCredentials = credentials.publicKey.allowCredentials.map((cred: any) => ({
        ...cred,
        id: base64ToArrayBuffer(cred.id)
      }));
    }
  }
  
  return credentials;
};

/**
 * Get WebAuthn credentials for registration
 */
const getRegistrationCredentials = async (userId: string, username: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/challenge/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, username })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get registration challenge');
    }
    
    const credentials = await response.json();
    return parseCredentials(credentials.publicKey);
  } catch (error) {
    console.error('Error getting registration credentials:', error);
    throw error;
  }
};

/**
 * Get WebAuthn credentials for authentication
 */
const getAuthenticationCredentials = async (userId: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/challenge/authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get authentication challenge');
    }
    
    const credentials = await response.json();
    return parseCredentials(credentials.publicKey);
  } catch (error) {
    console.error('Error getting authentication credentials:', error);
    throw error;
  }
};

/**
 * Register a new biometric credential
 */
const registerBiometric = async (userId: string, username: string): Promise<any> => {
  try {
    // Get registration credentials
    const credentialOptions = await getRegistrationCredentials(userId, username);
    
    // Create new credential
    // TypeScript doesn't fully recognize WebAuthn properties
    const credential = await navigator.credentials.create({
      publicKey: credentialOptions
    } as any);
    
    if (!credential) {
      throw new Error('Failed to create credential');
    }
    
    // Prepare credential for registration
    // TypeScript doesn't fully recognize WebAuthn properties, so we need to cast
    const credentialResponse = (credential as any).response;
    const registrationData = {
      id: credential.id,
      rawId: arrayBufferToBase64((credential as any).rawId),
      type: credential.type,
      response: {
        clientDataJSON: arrayBufferToBase64(credentialResponse.clientDataJSON),
        attestationObject: arrayBufferToBase64(credentialResponse.attestationObject)
      }
    };
    
    // Register credential with server
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credential: registrationData,
        userId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register credential');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error registering biometric credential:', error);
    throw error;
  }
};

/**
 * Authenticate with a biometric credential
 */
const authenticate = async (userId: string): Promise<any> => {
  try {
    // Get authentication credentials
    const credentialOptions = await getAuthenticationCredentials(userId);
    
    // Request assertion
    // TypeScript doesn't fully recognize WebAuthn properties
    const assertion = await navigator.credentials.get({
      publicKey: credentialOptions
    } as any);
    
    if (!assertion) {
      throw new Error('Failed to get assertion');
    }
    
    // Prepare assertion for verification
    // Type casting for WebAuthn properties
    const assertionResponse = (assertion as any).response;
    const authData = {
      id: assertion.id,
      rawId: arrayBufferToBase64((assertion as any).rawId),
      type: assertion.type,
      response: {
        clientDataJSON: arrayBufferToBase64(assertionResponse.clientDataJSON),
        authenticatorData: arrayBufferToBase64(assertionResponse.authenticatorData),
        signature: arrayBufferToBase64(assertionResponse.signature),
        userHandle: assertionResponse.userHandle 
          ? arrayBufferToBase64(assertionResponse.userHandle) 
          : null
      }
    };
    
    // Verify assertion with server
    const response = await fetch(`${BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        credential: authData,
        userId
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify assertion');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error authenticating with biometric:', error);
    throw error;
  }
};

/**
 * Get all biometric credentials for a user
 */
const getUserCredentials = async (userId: string): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/credentials/${userId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user credentials');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user credentials:', error);
    return [];
  }
};

/**
 * Delete a biometric credential
 */
const deleteCredential = async (credentialId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/credentials/${credentialId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete credential');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error deleting credential:', error);
    return false;
  }
};

// Export the biometric authentication service
export const biometricAuthService = {
  isBiometricSupported,
  registerBiometric,
  authenticate,
  getUserCredentials,
  deleteCredential,
};