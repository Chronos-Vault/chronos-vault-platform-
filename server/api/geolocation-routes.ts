/**
 * Geolocation Vault API Routes
 * 
 * This module provides API endpoints for geolocation-based vault functionality,
 * including vault creation, verification, and management.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { geolocationService } from '../services/geolocation-service';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { authenticateRequest } from '../middleware/auth';
import { vaults, geoVaults } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Schema for coordinate validation
const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
  timestamp: z.number().optional(),
});

// Schema for geolocation vault creation
const createGeoVaultSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  boundaryType: z.enum(['circle', 'polygon', 'country']),
  coordinates: z.array(coordinateSchema),
  radius: z.number().positive().optional(),
  countryCode: z.string().length(2).optional(),
  allowedTimeWindows: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startHour: z.number().min(0).max(23),
    endHour: z.number().min(0).max(23),
  })).optional(),
  minAccuracy: z.number().positive().optional(),
  requiresRealTimeVerification: z.boolean().default(false),
  multiFactorUnlock: z.boolean().default(false),
  vaultId: z.number().optional(), // If connecting to an existing vault
});

// Schema for location verification
const verifyLocationSchema = z.object({
  vaultId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().optional(),
});

/**
 * Create a new geolocation vault
 * POST /api/geo-vaults
 */
router.post('/geo-vaults', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const validatedData = createGeoVaultSchema.parse(req.body);
    
    // Create a unique ID for the vault
    const vaultId = `geo_vault_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Register the vault with the geolocation service
    geolocationService.registerGeoVault({
      id: vaultId,
      ownerId: req.user!.id.toString(),
      name: validatedData.name,
      description: validatedData.description || '',
      boundaries: [{
        type: validatedData.boundaryType,
        coordinates: validatedData.coordinates,
        radius: validatedData.radius,
        countryCode: validatedData.countryCode,
      }],
      allowedTimeWindows: validatedData.allowedTimeWindows,
      minAccuracy: validatedData.minAccuracy,
      requiresRealTimeVerification: validatedData.requiresRealTimeVerification,
      multiFactorUnlock: validatedData.multiFactorUnlock,
    });
    
    // If this is connected to an existing vault, link them
    if (validatedData.vaultId) {
      try {
        // SECURITY: Verify vault exists and belongs to the user
        const existingVault = await db.select().from(vaults)
          .where(eq(vaults.id, validatedData.vaultId))
          .limit(1);
          
        if (existingVault.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Vault not found'
          });
        }
        
        if (existingVault[0].userId !== req.user!.id) {
          securityLogger.warn('Unauthorized vault linking attempt', SecurityEventType.UNAUTHORIZED_ACCESS, {
            userId: req.user!.id,
            attemptedVaultId: validatedData.vaultId,
            actualOwnerId: existingVault[0].userId
          });
          return res.status(403).json({
            success: false,
            message: 'Access denied: vault does not belong to user'
          });
        }
        
        // Create geolocation vault record in database
        const geoVaultData = {
          userId: req.user!.id,
          name: validatedData.name,
          description: validatedData.description || null,
          boundaryType: validatedData.boundaryType,
          coordinates: validatedData.coordinates,
          radius: validatedData.radius || null,
          countryCode: validatedData.countryCode || null,
          minAccuracy: validatedData.minAccuracy || null,
          requiresRealTimeVerification: validatedData.requiresRealTimeVerification,
          multiFactorUnlock: validatedData.multiFactorUnlock,
          metadata: {
            vaultId: validatedData.vaultId, // Link to existing vault
            geoVaultId: vaultId,
            allowedTimeWindows: validatedData.allowedTimeWindows || [],
            createdAt: new Date().toISOString()
          }
        };
        
        // Insert geolocation vault record
        await db.insert(geoVaults).values(geoVaultData);
        
        securityLogger.info(`Geolocation vault linked to existing vault ${validatedData.vaultId}`, SecurityEventType.VAULT_CREATION, {
          userId: req.user!.id,
          geoVaultId: vaultId,
          linkedVaultId: validatedData.vaultId,
        });
      } catch (dbError) {
        console.error('Error linking geolocation vault to database:', dbError);
        securityLogger.error('Failed to link geolocation vault to database', SecurityEventType.SYSTEM_ERROR, {
          userId: req.user!.id,
          vaultId: validatedData.vaultId,
          error: dbError instanceof Error ? dbError.message : String(dbError)
        });
        return res.status(500).json({
          success: false,
          message: 'Database error during vault linking'
        });
      }
    }
    
    securityLogger.info(`User ${req.user!.id} created geolocation vault: ${vaultId}`, SecurityEventType.VAULT_CREATION, {
      userId: req.user!.id,
      vaultId,
      boundaryType: validatedData.boundaryType,
    });
    
    res.status(201).json({
      success: true,
      vaultId,
      message: 'Geolocation vault created successfully',
    });
  } catch (error) {
    console.error('Error creating geolocation vault:', error);
    
    securityLogger.error(`Failed to create geolocation vault for user ${req.user!.id}`, SecurityEventType.SYSTEM_ERROR, {
      userId: req.user!.id,
      error: error instanceof Error ? error.message : String(error),
    });
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vault data',
        errors: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating geolocation vault',
    });
  }
});

/**
 * Get all geolocation vaults for the current user
 * GET /api/geo-vaults
 */
router.get('/geo-vaults', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id.toString();
    const vaults = geolocationService.getVaultsByOwner(userId);
    
    res.json({
      success: true,
      vaults,
    });
  } catch (error) {
    console.error('Error fetching geolocation vaults:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching geolocation vaults',
    });
  }
});

/**
 * Get a specific geolocation vault by ID
 * GET /api/geo-vaults/:id
 */
router.get('/geo-vaults/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const vaultId = req.params.id;
    const vault = geolocationService.getGeoVault(vaultId);
    
    if (!vault) {
      return res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
    
    // Check if the user owns this vault
    if (vault.ownerId !== req.user!.id.toString()) {
      securityLogger.warn(`User ${req.user!.id} attempted to access geolocation vault ${vaultId} without permission`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user!.id,
        vaultId,
      });
      
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this vault',
      });
    }
    
    res.json({
      success: true,
      vault,
    });
  } catch (error) {
    console.error('Error fetching geolocation vault:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching geolocation vault',
    });
  }
});

/**
 * Verify a location for a vault
 * POST /api/geo-vaults/verify
 */
router.post('/geo-vaults/verify', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const { vaultId, latitude, longitude, accuracy } = verifyLocationSchema.parse(req.body);
    
    // Verify the location
    const result = geolocationService.verifyLocation(vaultId, {
      latitude,
      longitude,
      accuracy,
      timestamp: Date.now(),
    });
    
    // If this is for user's vault, check ownership
    const vault = geolocationService.getGeoVault(vaultId);
    if (vault && vault.ownerId !== req.user!.id.toString() && vault.multiFactorUnlock) {
      securityLogger.warn(`User ${req.user!.id} attempted to verify location for vault ${vaultId} without permission`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user!.id,
        vaultId,
      });
      
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to verify this vault',
      });
    }
    
    res.json({
      success: true,
      verified: result.verified,
      reason: result.reason,
      distance: result.distance,
    });
  } catch (error) {
    console.error('Error verifying location:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid location data',
        errors: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error verifying location',
    });
  }
});

/**
 * Update a geolocation vault
 * PUT /api/geo-vaults/:id
 */
router.put('/geo-vaults/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const vaultId = req.params.id;
    const validatedData = createGeoVaultSchema.parse(req.body);
    
    // Check if the vault exists
    const existingVault = geolocationService.getGeoVault(vaultId);
    if (!existingVault) {
      return res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
    
    // Check if the user owns this vault
    if (existingVault.ownerId !== req.user!.id.toString()) {
      securityLogger.warn(`User ${req.user!.id} attempted to update geolocation vault ${vaultId} without permission`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user!.id,
        vaultId,
      });
      
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this vault',
      });
    }
    
    // Update the vault
    const success = geolocationService.updateGeoVault({
      id: vaultId,
      ownerId: req.user!.id.toString(),
      name: validatedData.name,
      description: validatedData.description || '',
      boundaries: [{
        type: validatedData.boundaryType,
        coordinates: validatedData.coordinates,
        radius: validatedData.radius,
        countryCode: validatedData.countryCode,
      }],
      allowedTimeWindows: validatedData.allowedTimeWindows,
      minAccuracy: validatedData.minAccuracy,
      requiresRealTimeVerification: validatedData.requiresRealTimeVerification,
      multiFactorUnlock: validatedData.multiFactorUnlock,
    });
    
    if (success) {
      securityLogger.info(`User ${req.user!.id} updated geolocation vault: ${vaultId}`, SecurityEventType.VAULT_MODIFICATION, {
        userId: req.user!.id,
        vaultId,
      });
      
      res.json({
        success: true,
        message: 'Geolocation vault updated successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
  } catch (error) {
    console.error('Error updating geolocation vault:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vault data',
        errors: error.errors,
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating geolocation vault',
    });
  }
});

/**
 * Delete a geolocation vault
 * DELETE /api/geo-vaults/:id
 */
router.delete('/geo-vaults/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const vaultId = req.params.id;
    
    // Check if the vault exists
    const existingVault = geolocationService.getGeoVault(vaultId);
    if (!existingVault) {
      return res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
    
    // Check if the user owns this vault
    if (existingVault.ownerId !== req.user!.id.toString()) {
      securityLogger.warn(`User ${req.user!.id} attempted to delete geolocation vault ${vaultId} without permission`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user!.id,
        vaultId,
      });
      
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this vault',
      });
    }
    
    // Delete the vault
    const success = geolocationService.removeGeoVault(vaultId);
    
    if (success) {
      securityLogger.info(`User ${req.user!.id} deleted geolocation vault: ${vaultId}`, SecurityEventType.VAULT_MODIFICATION, {
        userId: req.user!.id,
        vaultId,
      });
      
      res.json({
        success: true,
        message: 'Geolocation vault deleted successfully',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
  } catch (error) {
    console.error('Error deleting geolocation vault:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error deleting geolocation vault',
    });
  }
});

/**
 * Get verification history for a vault
 * GET /api/geo-vaults/:id/history
 */
router.get('/geo-vaults/:id/history', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const vaultId = req.params.id;
    
    // Check if the vault exists
    const existingVault = geolocationService.getGeoVault(vaultId);
    if (!existingVault) {
      return res.status(404).json({
        success: false,
        message: 'Geolocation vault not found',
      });
    }
    
    // Check if the user owns this vault
    if (existingVault.ownerId !== req.user!.id.toString()) {
      securityLogger.warn(`User ${req.user!.id} attempted to access history for geolocation vault ${vaultId} without permission`, SecurityEventType.SUSPICIOUS_ACTIVITY, {
        userId: req.user!.id,
        vaultId,
      });
      
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this vault',
      });
    }
    
    // Get verification history
    const history = geolocationService.getVerificationHistory(vaultId);
    
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error fetching geolocation vault history:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error fetching verification history',
    });
  }
});

export default router;