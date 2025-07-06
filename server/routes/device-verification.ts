/**
 * Device Verification API Routes
 * 
 * These routes handle device registration, verification, and management
 * using TON blockchain for enhanced security.
 */

import { Router } from 'express';
import { z } from 'zod';
import { tonDeviceVerification } from '../blockchain/ton-device-verification';
import { storage } from '../storage';

const router = Router();

// Schema for device verification request
const verifyDeviceSchema = z.object({
  deviceId: z.string(),
  contractAddress: z.string(),
  userId: z.number(),
});

// Schema for device registration request
const registerDeviceSchema = z.object({
  deviceId: z.string(),
  userId: z.number(),
  contractAddress: z.string().optional(),
  securityLevel: z.number().optional(),
  geolocationEnabled: z.boolean().optional(),
  multiSigEnabled: z.boolean().optional(),
  recoveryEnabled: z.boolean().optional(),
});

// Schema for device revocation request
const revokeDeviceSchema = z.object({
  deviceId: z.string(),
  userId: z.number(),
});

// Schema for multi-signature setup request
const multiSigSetupSchema = z.object({
  deviceId: z.string(),
  userId: z.number(),
  signerAddresses: z.array(z.string()),
  threshold: z.number(),
});

// Schema for multi-signature recovery request
const multiSigRecoverySchema = z.object({
  deviceId: z.string(),
  userId: z.number(),
  signatures: z.array(z.object({
    address: z.string(),
    signature: z.string(),
  })),
});

// Schema for geolocation restrictions setup
const geoRestrictionSchema = z.object({
  deviceId: z.string(),
  userId: z.number(),
  restrictions: z.object({
    type: z.enum(['circle', 'polygon', 'country']),
    coordinates: z.array(z.tuple([z.number(), z.number()])).optional(),
    radius: z.number().optional(),
    countryCode: z.string().optional(),
  }),
});

// Verify a device using TON blockchain
router.post('/verify', async (req, res) => {
  try {
    const { deviceId, contractAddress, userId } = verifyDeviceSchema.parse(req.body);
    
    const isVerified = await tonDeviceVerification.verifyDevice(deviceId, contractAddress);
    
    if (isVerified) {
      res.json({ success: true, message: 'Device verified successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Device verification failed' });
    }
  } catch (error) {
    console.error('Error verifying device:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Device verification failed' 
    });
  }
});

// Register a new device with optional blockchain verification
router.post('/register', async (req, res) => {
  try {
    const registrationData = registerDeviceSchema.parse(req.body);
    
    const device = await tonDeviceVerification.registerDevice(registrationData);
    
    if (device) {
      res.json({ 
        success: true, 
        message: 'Device registered successfully',
        device,
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Device registration failed' 
      });
    }
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Device registration failed' 
    });
  }
});

// Revoke a device
router.post('/revoke', async (req, res) => {
  try {
    const { deviceId, userId } = revokeDeviceSchema.parse(req.body);
    
    const isRevoked = await tonDeviceVerification.revokeDevice(deviceId, userId);
    
    if (isRevoked) {
      res.json({ 
        success: true, 
        message: 'Device revoked successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Device revocation failed' 
      });
    }
  } catch (error) {
    console.error('Error revoking device:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Device revocation failed' 
    });
  }
});

// Set up multi-signature verification for a device
router.post('/setup-multisig', async (req, res) => {
  try {
    const { deviceId, userId, signerAddresses, threshold } = multiSigSetupSchema.parse(req.body);
    
    const isSetup = await tonDeviceVerification.setupMultiSig(deviceId, userId, signerAddresses, threshold);
    
    if (isSetup) {
      res.json({ 
        success: true, 
        message: 'Multi-signature setup successful' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Multi-signature setup failed' 
      });
    }
  } catch (error) {
    console.error('Error setting up multi-signature:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Multi-signature setup failed' 
    });
  }
});

// Recover a device using multi-signature verification
router.post('/recover-multisig', async (req, res) => {
  try {
    const { deviceId, userId, signatures } = multiSigRecoverySchema.parse(req.body);
    
    const isRecovered = await tonDeviceVerification.recoverWithMultiSig(deviceId, userId, signatures);
    
    if (isRecovered) {
      res.json({ 
        success: true, 
        message: 'Device recovered successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Device recovery failed' 
      });
    }
  } catch (error) {
    console.error('Error recovering device with multi-signature:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Device recovery failed' 
    });
  }
});

// Set up geolocation restrictions for a device
router.post('/setup-geolocation', async (req, res) => {
  try {
    const { deviceId, userId, restrictions } = geoRestrictionSchema.parse(req.body);
    
    const isSetup = await tonDeviceVerification.setupGeolocationRestrictions(deviceId, userId, restrictions);
    
    if (isSetup) {
      res.json({ 
        success: true, 
        message: 'Geolocation restrictions set up successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Geolocation restrictions setup failed' 
      });
    }
  } catch (error) {
    console.error('Error setting up geolocation restrictions:', error);
    res.status(400).json({ 
      success: false, 
      message: error instanceof z.ZodError 
        ? 'Invalid request data' 
        : 'Geolocation restrictions setup failed' 
    });
  }
});

// Get all devices for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    
    const devices = await storage.getDevicesByUser(userId);
    
    res.json({ 
      success: true, 
      devices 
    });
  } catch (error) {
    console.error('Error getting user devices:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get user devices' 
    });
  }
});

// Get detailed info for a specific device
router.get('/:id', async (req, res) => {
  try {
    const deviceId = parseInt(req.params.id);
    if (isNaN(deviceId)) {
      return res.status(400).json({ success: false, message: 'Invalid device ID' });
    }
    
    const device = await storage.getDevice(deviceId);
    
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }
    
    // Get additional data
    const authLogs = await storage.getDeviceAuthLogsByDevice(deviceId);
    const verifications = await storage.getDeviceVerificationsByDevice(deviceId);
    
    res.json({ 
      success: true, 
      device,
      authLogs,
      verifications
    });
  } catch (error) {
    console.error('Error getting device details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get device details' 
    });
  }
});

export default router;