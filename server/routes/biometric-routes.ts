/**
 * Biometric Authentication API Routes
 * 
 * These routes handle the WebAuthn (biometric authentication) flow
 * including challenge generation, credential registration, and verification.
 */
import { Router, Request, Response } from 'express';
import { biometricService } from '../services/biometric-service';

const router = Router();

/**
 * Generate a registration challenge
 */
router.post('/challenge/registration', async (req: Request, res: Response) => {
  try {
    const { userId, username } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ error: 'User ID and username are required' });
    }
    
    const challenge = await biometricService.generateRegistrationChallenge(userId, username);
    res.json(challenge);
  } catch (error) {
    console.error('Error generating registration challenge:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

/**
 * Generate an authentication challenge
 */
router.post('/challenge/authentication', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const challenge = await biometricService.generateAuthenticationChallenge(userId);
    res.json(challenge);
  } catch (error) {
    console.error('Error generating authentication challenge:', error);
    res.status(500).json({ error: 'Failed to generate challenge' });
  }
});

/**
 * Register a new biometric credential
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const credential = await biometricService.registerCredential(req.body);
    res.json(credential);
  } catch (error) {
    console.error('Error registering credential:', error);
    res.status(500).json({ error: 'Failed to register credential' });
  }
});

/**
 * Verify a biometric credential for authentication
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const result = await biometricService.verifyCredential(req.body);
    
    if (result.verified) {
      // Successful authentication
      // Note: Session functionality is disabled for this demo since we're using 
      // a stateless authentication approach instead of sessions
      // In a production app we would store the verification in the session
      
      res.json({ verified: true, userId: result.userId });
    } else {
      res.status(401).json({ verified: false, error: 'Verification failed' });
    }
  } catch (error) {
    console.error('Error verifying credential:', error);
    res.status(500).json({ verified: false, error: 'Failed to verify credential' });
  }
});

/**
 * Get all biometric credentials for a user
 */
router.get('/credentials/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const credentials = await biometricService.getUserCredentials(userId);
    res.json(credentials);
  } catch (error) {
    console.error('Error getting user credentials:', error);
    res.status(500).json({ error: 'Failed to get user credentials' });
  }
});

/**
 * Delete a biometric credential
 */
router.delete('/credentials/:credentialId', async (req: Request, res: Response) => {
  try {
    const { credentialId } = req.params;
    const success = await biometricService.deleteCredential(credentialId);
    
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: 'Credential not found' });
    }
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ success: false, error: 'Failed to delete credential' });
  }
});

export default router;