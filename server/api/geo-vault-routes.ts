/**
 * Geolocation Vault API Routes
 * 
 * Provides API endpoints for managing location-based vaults and verification
 */

import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { geolocationService, Coordinates } from '../services/geolocation-service';
import { insertGeoVaultSchema, insertGeoAccessLogSchema } from '@shared/schema';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  // In production, this would be replaced with proper authentication
  // For this implementation we'll use a simple check
  if (!req.session || !req.session.userId) {
    securityLogger.warn(
      'Unauthorized access attempt to geo vault API',
      SecurityEventType.UNAUTHORIZED_ACCESS,
      { path: req.path }
    );
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Router setup
const geoVaultRouter = Router();

/**
 * Create a new geolocation vault
 * 
 * POST /api/geo-vaults
 */
geoVaultRouter.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // Parse and validate request body
    const validationResult = insertGeoVaultSchema.safeParse({
      ...req.body,
      userId: req.session.userId, // Override with authenticated user ID
    });

    if (!validationResult.success) {
      securityLogger.warn(
        'Invalid geolocation vault data submitted',
        SecurityEventType.INPUT_VALIDATION_FAILURE,
        { errors: validationResult.error.format() }
      );
      
      return res.status(400).json({
        error: 'Invalid data',
        details: validationResult.error.format()
      });
    }

    // Create the vault
    const vault = await geolocationService.createVault(validationResult.data);
    
    return res.status(201).json(vault);
  } catch (error) {
    securityLogger.error(
      `Error creating geolocation vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error }
    );
    
    return res.status(500).json({
      error: 'Failed to create geolocation vault',
      message: (error as Error).message
    });
  }
});

/**
 * Get all vaults for the authenticated user
 * 
 * GET /api/geo-vaults
 */
geoVaultRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const vaults = await geolocationService.getVaultsForUser(userId);
    
    return res.status(200).json(vaults);
  } catch (error) {
    securityLogger.error(
      `Error retrieving geolocation vaults: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error }
    );
    
    return res.status(500).json({
      error: 'Failed to retrieve geolocation vaults',
      message: (error as Error).message
    });
  }
});

/**
 * Get a specific vault by ID
 * 
 * GET /api/geo-vaults/:id
 */
geoVaultRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    
    const vault = await geolocationService.getVaultById(id);
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    // Security check - ensure user can only access their own vaults
    if (vault.userId !== userId) {
      securityLogger.warn(
        `Unauthorized attempt to access vault ${id}`,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        { vaultId: id, requestingUserId: userId }
      );
      
      return res.status(403).json({ error: 'Access denied' });
    }
    
    return res.status(200).json(vault);
  } catch (error) {
    securityLogger.error(
      `Error retrieving geolocation vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error, vaultId: req.params.id }
    );
    
    return res.status(500).json({
      error: 'Failed to retrieve geolocation vault',
      message: (error as Error).message
    });
  }
});

/**
 * Verify location against a vault's boundary
 * 
 * POST /api/geo-vaults/:id/verify
 */
geoVaultRouter.post('/:id/verify', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    
    // Validate location data
    const locationSchema = z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().optional(),
      timestamp: z.number().optional(),
    });
    
    const validationResult = locationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      securityLogger.warn(
        'Invalid location data submitted for verification',
        SecurityEventType.INPUT_VALIDATION_FAILURE,
        { errors: validationResult.error.format() }
      );
      
      return res.status(400).json({
        error: 'Invalid location data',
        details: validationResult.error.format()
      });
    }
    
    const location = validationResult.data;
    
    // Get the vault
    const vault = await geolocationService.getVaultById(id);
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    // Verify location against vault settings
    const verificationResult = await geolocationService.verifyLocation(
      location as Coordinates,
      {
        userId: vault.userId,
        boundaryType: vault.boundaryType as any,
        coordinates: vault.coordinates as any,
        radius: vault.radius || undefined,
        countryCode: vault.countryCode || undefined,
        minAccuracy: vault.minAccuracy || undefined,
        requiresRealTimeVerification: vault.requiresRealTimeVerification || false,
        multiFactorUnlock: vault.multiFactorUnlock || false,
        name: vault.name,
        description: vault.description || undefined,
        metadata: vault.metadata as any,
      }
    );
    
    // Create access log entry
    await db.insert(insertGeoAccessLogSchema.table).values({
      vaultId: parseInt(id),
      userId: userId,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      accuracy: location.accuracy,
      success: verificationResult.success,
      failureReason: verificationResult.success ? null : verificationResult.message,
      deviceInfo: {
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || 'unknown',
        timestamp: new Date().toISOString(),
      },
    });
    
    return res.status(200).json({
      success: verificationResult.success,
      message: verificationResult.message,
      details: verificationResult.details,
    });
  } catch (error) {
    securityLogger.error(
      `Error verifying location against vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error, vaultId: req.params.id }
    );
    
    return res.status(500).json({
      error: 'Failed to verify location',
      message: (error as Error).message
    });
  }
});

/**
 * Update an existing vault
 * 
 * PUT /api/geo-vaults/:id
 */
geoVaultRouter.put('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    
    // Get the vault first to verify ownership
    const vault = await geolocationService.getVaultById(id);
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    // Ensure user can only update their own vaults
    if (vault.userId !== userId) {
      securityLogger.warn(
        `Unauthorized attempt to update vault ${id}`,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        { vaultId: id, requestingUserId: userId }
      );
      
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Validate update data
    const updateSchema = insertGeoVaultSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      securityLogger.warn(
        'Invalid vault update data submitted',
        SecurityEventType.INPUT_VALIDATION_FAILURE,
        { errors: validationResult.error.format() }
      );
      
      return res.status(400).json({
        error: 'Invalid data',
        details: validationResult.error.format()
      });
    }
    
    // Update the vault
    const updatedVault = await geolocationService.updateVault(
      id,
      userId,
      validationResult.data
    );
    
    return res.status(200).json(updatedVault);
  } catch (error) {
    securityLogger.error(
      `Error updating geolocation vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error, vaultId: req.params.id }
    );
    
    return res.status(500).json({
      error: 'Failed to update geolocation vault',
      message: (error as Error).message
    });
  }
});

/**
 * Delete a vault
 * 
 * DELETE /api/geo-vaults/:id
 */
geoVaultRouter.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    
    // Get the vault first to verify ownership
    const vault = await geolocationService.getVaultById(id);
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    // Ensure user can only delete their own vaults
    if (vault.userId !== userId) {
      securityLogger.warn(
        `Unauthorized attempt to delete vault ${id}`,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        { vaultId: id, requestingUserId: userId }
      );
      
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Delete the vault
    const success = await geolocationService.deleteVault(id, userId);
    
    if (success) {
      return res.status(204).end();
    } else {
      return res.status(500).json({
        error: 'Failed to delete geolocation vault'
      });
    }
  } catch (error) {
    securityLogger.error(
      `Error deleting geolocation vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error, vaultId: req.params.id }
    );
    
    return res.status(500).json({
      error: 'Failed to delete geolocation vault',
      message: (error as Error).message
    });
  }
});

/**
 * Get access history for a vault
 * 
 * GET /api/geo-vaults/:id/history
 */
geoVaultRouter.get('/:id/history', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;
    
    // Get the vault first to verify ownership
    const vault = await geolocationService.getVaultById(id);
    
    if (!vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }
    
    // Ensure user can only access their own vault history
    if (vault.userId !== userId) {
      securityLogger.warn(
        `Unauthorized attempt to access vault history ${id}`,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        { vaultId: id, requestingUserId: userId }
      );
      
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get access history
    const history = await geolocationService.getAccessHistory(id, userId);
    
    return res.status(200).json(history);
  } catch (error) {
    securityLogger.error(
      `Error retrieving vault access history: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      { error, vaultId: req.params.id }
    );
    
    return res.status(500).json({
      error: 'Failed to retrieve vault access history',
      message: (error as Error).message
    });
  }
});

export default geoVaultRouter;