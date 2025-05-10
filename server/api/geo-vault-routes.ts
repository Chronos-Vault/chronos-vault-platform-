/**
 * Geolocation Vault API Routes
 * 
 * Provides API endpoints for managing location-based vaults and verification
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { geoVaults, geoAccessLogs, insertGeoVaultSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { authenticateRequest } from '../middleware/auth';

const geoVaultRouter = Router();

/**
 * Create a new geolocation vault
 * 
 * POST /api/geo-vaults
 */
geoVaultRouter.post('/', authenticateRequest, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = insertGeoVaultSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Invalid vault data',
        errors: validationResult.error.errors
      });
    }
    
    const vaultData = validationResult.data;
    
    // Add user ID from session
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Create new vault
    const [vault] = await db.insert(geoVaults).values({
      ...vaultData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.status(201).json(vault);
  } catch (error: any) {
    console.error('Error creating geo vault:', error);
    res.status(500).json({ message: 'Error creating vault', error: error.message });
  }
});

/**
 * Get all vaults for the authenticated user
 * 
 * GET /api/geo-vaults
 */
geoVaultRouter.get('/', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Get all vaults for the user
    const vaults = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.userId, userId))
      .orderBy(geoVaults.createdAt);
    
    res.json(vaults);
  } catch (error: any) {
    console.error('Error fetching geo vaults:', error);
    res.status(500).json({ message: 'Error fetching vaults', error: error.message });
  }
});

/**
 * Get a specific vault by ID
 * 
 * GET /api/geo-vaults/:id
 */
geoVaultRouter.get('/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vaultId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (isNaN(vaultId)) {
      return res.status(400).json({ message: 'Invalid vault ID' });
    }
    
    // Get the vault
    const [vault] = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.id, vaultId))
      .limit(1);
    
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Check if the user owns the vault
    if (vault.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(vault);
  } catch (error: any) {
    console.error('Error fetching geo vault:', error);
    res.status(500).json({ message: 'Error fetching vault', error: error.message });
  }
});

/**
 * Helper function to calculate distance between two coordinates in meters
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

/**
 * Helper function to check if a point is within a polygon
 */
function isPointInPolygon(point: {latitude: number, longitude: number}, polygon: Array<{latitude: number, longitude: number}>): boolean {
  const x = point.longitude;
  const y = point.latitude;
  
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude;
    const yi = polygon[i].latitude;
    const xj = polygon[j].longitude;
    const yj = polygon[j].latitude;
    
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
}

/**
 * Verify location against a vault's boundary
 * 
 * POST /api/geo-vaults/:id/verify
 */
geoVaultRouter.post('/:id/verify', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vaultId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (isNaN(vaultId)) {
      return res.status(400).json({ message: 'Invalid vault ID' });
    }
    
    // Validate request body
    const locationSchema = z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      accuracy: z.number().optional(),
      timestamp: z.number().optional(),
    });
    
    const validationResult = locationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Invalid location data',
        errors: validationResult.error.errors
      });
    }
    
    const location = validationResult.data;
    
    // Get the vault
    const [vault] = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.id, vaultId))
      .limit(1);
    
    if (!vault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Check if the user owns the vault
    if (vault.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Verify the location against the vault's boundary
    let verified = false;
    let distance = 0;
    let failureReason = '';
    
    // Check if accuracy meets minimum requirement
    if (vault.minAccuracy && location.accuracy && location.accuracy > vault.minAccuracy) {
      failureReason = `Location accuracy (${Math.round(location.accuracy)}m) does not meet minimum requirement (${vault.minAccuracy}m)`;
    } else {
      switch (vault.boundaryType) {
        case 'circle': {
          // For circular boundary, check distance from center
          if (!vault.coordinates || vault.coordinates.length === 0) {
            failureReason = 'Vault has no center coordinates defined';
            break;
          }
          
          const center = vault.coordinates[0];
          distance = calculateDistance(
            center.latitude, 
            center.longitude, 
            location.latitude, 
            location.longitude
          );
          
          if (!vault.radius) {
            failureReason = 'Vault has no radius defined';
            break;
          }
          
          verified = distance <= vault.radius;
          if (!verified) {
            failureReason = `Location is outside the vault's boundary (${Math.round(distance - vault.radius)}m away)`;
          }
          break;
        }
        
        case 'polygon': {
          // For polygon boundary, check if point is inside the polygon
          if (!vault.coordinates || vault.coordinates.length < 3) {
            failureReason = 'Vault has less than 3 coordinates defined for polygon';
            break;
          }
          
          verified = isPointInPolygon(location, vault.coordinates);
          if (!verified) {
            failureReason = 'Location is outside the vault\'s boundary polygon';
          }
          break;
        }
        
        case 'country': {
          // For country-based boundary, we'd need a geolocation service with country lookups
          // This is a simplified version that always fails
          failureReason = 'Country boundary verification is not implemented in this prototype';
          break;
        }
        
        default:
          failureReason = `Unknown boundary type: ${vault.boundaryType}`;
      }
    }
    
    // Log the verification attempt
    const logEntry = {
      vaultId,
      userId,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      accuracy: location.accuracy ? Math.round(location.accuracy) : null,
      timestamp: new Date(),
      success: verified,
      failureReason: failureReason || null,
      deviceInfo: {
        userAgent: req.headers['user-agent'] || null,
        ip: req.ip || null,
      },
    };
    
    await db.insert(geoAccessLogs).values(logEntry);
    
    // Return the verification result
    res.json({
      success: verified,
      message: verified ? 'Location verified successfully' : failureReason,
      details: {
        distance: Math.round(distance),
        accuracy: location.accuracy,
        boundaryType: vault.boundaryType
      }
    });
  } catch (error: any) {
    console.error('Error verifying location:', error);
    res.status(500).json({ message: 'Error verifying location', error: error.message });
  }
});

/**
 * Update an existing vault
 * 
 * PUT /api/geo-vaults/:id
 */
geoVaultRouter.put('/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vaultId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (isNaN(vaultId)) {
      return res.status(400).json({ message: 'Invalid vault ID' });
    }
    
    // Validate request body
    const updateSchema = insertGeoVaultSchema.partial();
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Invalid vault data',
        errors: validationResult.error.errors
      });
    }
    
    const vaultData = validationResult.data;
    
    // Get the vault to check ownership
    const [existingVault] = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.id, vaultId))
      .limit(1);
    
    if (!existingVault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Check if the user owns the vault
    if (existingVault.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Update the vault
    const [updatedVault] = await db.update(geoVaults)
      .set({
        ...vaultData,
        updatedAt: new Date()
      })
      .where(eq(geoVaults.id, vaultId))
      .returning();
    
    res.json(updatedVault);
  } catch (error: any) {
    console.error('Error updating geo vault:', error);
    res.status(500).json({ message: 'Error updating vault', error: error.message });
  }
});

/**
 * Delete a vault
 * 
 * DELETE /api/geo-vaults/:id
 */
geoVaultRouter.delete('/:id', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vaultId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (isNaN(vaultId)) {
      return res.status(400).json({ message: 'Invalid vault ID' });
    }
    
    // Get the vault to check ownership
    const [existingVault] = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.id, vaultId))
      .limit(1);
    
    if (!existingVault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Check if the user owns the vault
    if (existingVault.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Delete the vault
    await db.delete(geoVaults)
      .where(eq(geoVaults.id, vaultId));
    
    res.json({ success: true, message: 'Vault deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting geo vault:', error);
    res.status(500).json({ message: 'Error deleting vault', error: error.message });
  }
});

/**
 * Get access history for a vault
 * 
 * GET /api/geo-vaults/:id/history
 */
geoVaultRouter.get('/:id/history', authenticateRequest, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const vaultId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (isNaN(vaultId)) {
      return res.status(400).json({ message: 'Invalid vault ID' });
    }
    
    // Get the vault to check ownership
    const [existingVault] = await db.select()
      .from(geoVaults)
      .where(eq(geoVaults.id, vaultId))
      .limit(1);
    
    if (!existingVault) {
      return res.status(404).json({ message: 'Vault not found' });
    }
    
    // Check if the user owns the vault
    if (existingVault.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Get the access history
    const history = await db.select()
      .from(geoAccessLogs)
      .where(eq(geoAccessLogs.vaultId, vaultId))
      .orderBy(geoAccessLogs.timestamp, 'desc')
      .limit(50);
    
    res.json(history);
  } catch (error: any) {
    console.error('Error fetching vault history:', error);
    res.status(500).json({ message: 'Error fetching vault history', error: error.message });
  }
});

export default geoVaultRouter;