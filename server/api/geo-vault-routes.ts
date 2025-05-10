/**
 * Geolocation Vault API Routes
 * 
 * Endpoints for creating, managing, and accessing geolocation-based vaults
 * with advanced security features including:
 * - Location verification
 * - Geographic boundary checks
 * - Polygon-based security zones
 * - Time-window access restrictions
 */

import { Router, Request, Response } from 'express';
import { geolocationService, GeoCoordinates, GeoBoundary, GeoVaultSettings } from '../services/geolocation-service';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { z } from 'zod';

// Schema validation for creating a new geolocation vault
const createGeoVaultSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  ownerId: z.string().min(1),
  boundaries: z.array(z.object({
    type: z.enum(['circle', 'polygon', 'country']),
    coordinates: z.array(z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().optional(),
      timestamp: z.number().optional(),
    })),
    radius: z.number().optional(), // In meters, required for circle type
    countryCode: z.string().optional(), // Required for country type
  })).min(1),
  allowedTimeWindows: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startHour: z.number().min(0).max(23),
    endHour: z.number().min(0).max(23),
  })).optional(),
  minAccuracy: z.number().optional(), // In meters
  requiresRealTimeVerification: z.boolean().default(false),
  multiFactorUnlock: z.boolean().default(false),
});

// Schema validation for location verification
const verifyLocationSchema = z.object({
  vaultId: z.string().min(1),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
    timestamp: z.number().optional(),
  }),
});

// Create a router instance
const router = Router();

/**
 * Create a new geolocation vault
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const validatedData = createGeoVaultSchema.parse(req.body);
    
    // Generate a unique ID for the vault
    const vaultId = `geo-vault-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create vault settings from validated data
    const vaultSettings: GeoVaultSettings = {
      id: vaultId,
      ownerId: validatedData.ownerId,
      name: validatedData.name,
      description: validatedData.description || '',
      boundaries: validatedData.boundaries as GeoBoundary[],
      allowedTimeWindows: validatedData.allowedTimeWindows,
      minAccuracy: validatedData.minAccuracy,
      requiresRealTimeVerification: validatedData.requiresRealTimeVerification,
      multiFactorUnlock: validatedData.multiFactorUnlock,
    };
    
    // Register the new geolocation vault
    geolocationService.registerGeoVault(vaultSettings);
    
    securityLogger.info(`Created new geolocation vault: ${vaultId}`, SecurityEventType.VAULT_CREATION, {
      userId: req.user?.id || 'anonymous',
      vaultId,
      boundaryCount: vaultSettings.boundaries.length,
      requiresRealTimeVerification: vaultSettings.requiresRealTimeVerification,
      multiFactorEnabled: vaultSettings.multiFactorUnlock,
    });
    
    res.status(201).json({
      id: vaultId,
      name: vaultSettings.name,
      description: vaultSettings.description,
      boundaryCount: vaultSettings.boundaries.length,
      created: new Date(),
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      });
    }
    
    securityLogger.error(`Failed to create geolocation vault: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to create geolocation vault',
      message: error.message,
    });
  }
});

/**
 * Get geolocation vault details by ID
 */
router.get('/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const vault = geolocationService.getGeoVault(vaultId);
    
    if (!vault) {
      return res.status(404).json({
        error: 'Geolocation vault not found',
      });
    }
    
    // Check if user is authorized to access this vault
    if (req.user?.id !== vault.ownerId) {
      securityLogger.warn(`Unauthorized access attempt to geolocation vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to access this vault',
      });
    }
    
    // Return vault details (excluding sensitive coordinate details for security)
    res.json({
      id: vault.id,
      name: vault.name,
      description: vault.description,
      boundaryCount: vault.boundaries.length,
      boundaryTypes: vault.boundaries.map(b => b.type),
      requiresRealTimeVerification: vault.requiresRealTimeVerification,
      multiFactorUnlock: vault.multiFactorUnlock,
      allowedTimeWindows: vault.allowedTimeWindows,
    });
    
  } catch (error) {
    securityLogger.error(`Error retrieving geolocation vault: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      vaultId: req.params.vaultId,
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to retrieve geolocation vault',
      message: error.message,
    });
  }
});

/**
 * List all geolocation vaults for a user
 */
router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Check if user is authorized to access vaults for this userId
    if (req.user?.id !== userId) {
      securityLogger.warn(`Unauthorized attempt to list geolocation vaults for user: ${userId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        requestingUserId: req.user?.id || 'anonymous',
        targetUserId: userId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to access vaults for this user',
      });
    }
    
    const userVaults = geolocationService.getVaultsByOwner(userId);
    
    // Return vault list with minimal details
    res.json(userVaults.map(vault => ({
      id: vault.id,
      name: vault.name,
      description: vault.description,
      boundaryCount: vault.boundaries.length,
    })));
    
  } catch (error) {
    securityLogger.error(`Error listing geolocation vaults: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      targetUserId: req.params.userId,
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to list geolocation vaults',
      message: error.message,
    });
  }
});

/**
 * Verify location for vault access
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { vaultId, location } = verifyLocationSchema.parse(req.body);
    const vault = geolocationService.getGeoVault(vaultId);
    
    if (!vault) {
      return res.status(404).json({
        error: 'Geolocation vault not found',
      });
    }
    
    // Check if user is authorized to access this vault
    if (req.user?.id !== vault.ownerId) {
      securityLogger.warn(`Unauthorized verification attempt for geolocation vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to access this vault',
      });
    }
    
    // Verify the location
    const verificationResult = geolocationService.verifyLocation(vaultId, location as GeoCoordinates);
    
    // Log the verification attempt
    if (verificationResult.verified) {
      securityLogger.info(`Successful location verification for vault: ${vaultId}`, SecurityEventType.VAULT_ACCESS, {
        userId: req.user?.id || 'anonymous',
        vaultId,
        accuracy: location.accuracy,
      });
    } else {
      securityLogger.warn(`Failed location verification for vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
        reason: verificationResult.reason,
        distance: verificationResult.distance,
      });
    }
    
    // Return the verification result
    res.json({
      verified: verificationResult.verified,
      reason: verificationResult.reason,
      distance: verificationResult.distance,
      timestamp: verificationResult.timestamp,
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      });
    }
    
    securityLogger.error(`Error verifying location: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to verify location',
      message: error.message,
    });
  }
});

/**
 * Update geolocation vault settings
 */
router.put('/:vaultId', async (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const validatedData = createGeoVaultSchema.parse(req.body);
    const existingVault = geolocationService.getGeoVault(vaultId);
    
    if (!existingVault) {
      return res.status(404).json({
        error: 'Geolocation vault not found',
      });
    }
    
    // Check if user is authorized to modify this vault
    if (req.user?.id !== existingVault.ownerId) {
      securityLogger.warn(`Unauthorized modification attempt for geolocation vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to modify this vault',
      });
    }
    
    // Update vault settings from validated data
    const updatedSettings: GeoVaultSettings = {
      id: vaultId,
      ownerId: validatedData.ownerId,
      name: validatedData.name,
      description: validatedData.description || '',
      boundaries: validatedData.boundaries as GeoBoundary[],
      allowedTimeWindows: validatedData.allowedTimeWindows,
      minAccuracy: validatedData.minAccuracy,
      requiresRealTimeVerification: validatedData.requiresRealTimeVerification,
      multiFactorUnlock: validatedData.multiFactorUnlock,
    };
    
    // Update the geolocation vault
    const success = geolocationService.updateGeoVault(updatedSettings);
    
    if (!success) {
      return res.status(500).json({
        error: 'Failed to update geolocation vault',
      });
    }
    
    securityLogger.info(`Updated geolocation vault: ${vaultId}`, SecurityEventType.VAULT_MODIFICATION, {
      userId: req.user?.id || 'anonymous',
      vaultId,
      boundaryCount: updatedSettings.boundaries.length,
    });
    
    res.json({
      id: vaultId,
      name: updatedSettings.name,
      description: updatedSettings.description,
      boundaryCount: updatedSettings.boundaries.length,
      updated: new Date(),
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      });
    }
    
    securityLogger.error(`Failed to update geolocation vault: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      vaultId: req.params.vaultId,
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to update geolocation vault',
      message: error.message,
    });
  }
});

/**
 * Delete a geolocation vault
 */
router.delete('/:vaultId', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const vault = geolocationService.getGeoVault(vaultId);
    
    if (!vault) {
      return res.status(404).json({
        error: 'Geolocation vault not found',
      });
    }
    
    // Check if user is authorized to delete this vault
    if (req.user?.id !== vault.ownerId) {
      securityLogger.warn(`Unauthorized deletion attempt for geolocation vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to delete this vault',
      });
    }
    
    // Delete the geolocation vault
    const success = geolocationService.removeGeoVault(vaultId);
    
    if (!success) {
      return res.status(500).json({
        error: 'Failed to delete geolocation vault',
      });
    }
    
    securityLogger.info(`Deleted geolocation vault: ${vaultId}`, SecurityEventType.VAULT_MODIFICATION, {
      userId: req.user?.id || 'anonymous',
      vaultId,
    });
    
    res.json({
      success: true,
      message: `Geolocation vault ${vaultId} deleted successfully`,
    });
    
  } catch (error) {
    securityLogger.error(`Failed to delete geolocation vault: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      vaultId: req.params.vaultId,
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to delete geolocation vault',
      message: error.message,
    });
  }
});

/**
 * Get verification history for a vault
 */
router.get('/:vaultId/history', (req: Request, res: Response) => {
  try {
    const { vaultId } = req.params;
    const vault = geolocationService.getGeoVault(vaultId);
    
    if (!vault) {
      return res.status(404).json({
        error: 'Geolocation vault not found',
      });
    }
    
    // Check if user is authorized to access this vault
    if (req.user?.id !== vault.ownerId) {
      securityLogger.warn(`Unauthorized history access attempt for geolocation vault: ${vaultId}`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user?.id || 'anonymous',
        vaultId,
      });
      
      return res.status(403).json({
        error: 'Not authorized to access this vault',
      });
    }
    
    // Get verification history
    const history = geolocationService.getVerificationHistory(vaultId);
    
    // Return sanitized history for security
    res.json(history.map(entry => ({
      timestamp: entry.timestamp,
      verified: entry.verified,
      reason: entry.reason,
      distance: entry.distance,
    })));
    
  } catch (error) {
    securityLogger.error(`Failed to retrieve verification history: ${error.message}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user?.id || 'anonymous',
      vaultId: req.params.vaultId,
      error: error.message,
    });
    
    res.status(500).json({
      error: 'Failed to retrieve verification history',
      message: error.message,
    });
  }
});

export default router;