/**
 * Geolocation Vault API Routes
 * 
 * Endpoints for creating, managing, and accessing geolocation-based vaults
 * with advanced security features including location verification.
 */

import express, { Request, Response } from 'express';
import { z } from 'zod';
import { authenticateRequest } from '../middleware/auth';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { geolocationService } from '../services/geolocation-service';
import { insertGeoVaultSchema, GeoVaultSettings } from '@shared/schema';

const router = express.Router();

// Require authentication for all geo-vault routes
router.use(authenticateRequest);

/**
 * Create a new geolocation vault
 * POST /api/geo-vaults
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validation = insertGeoVaultSchema.safeParse(req.body);

    if (!validation.success) {
      securityLogger.warn(
        'Invalid geo-vault creation attempt',
        SecurityEventType.INPUT_VALIDATION_FAILURE,
        {
          userId: req.user?.id,
          errors: validation.error.errors,
        }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid vault data',
        errors: validation.error.errors,
      });
    }

    // Set user ID from authenticated user
    const vaultData = {
      ...validation.data,
      userId: req.user.id,
    };

    // Create the vault
    const newVault = await geolocationService.createVault(vaultData);

    return res.status(201).json({
      success: true,
      message: 'Geolocation vault created successfully',
      vault: newVault,
    });
  } catch (error) {
    securityLogger.error(
      `Error creating geolocation vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error creating geolocation vault',
    });
  }
});

/**
 * Get all geolocation vaults for the current user
 * GET /api/geo-vaults
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const vaults = await geolocationService.getVaultsForUser(req.user.id);

    // Transform vault data for frontend display
    const transformedVaults = vaults.map(vault => ({
      id: vault.id.toString(),
      name: vault.name,
      description: vault.description || '',
      boundaryCount: Array.isArray(vault.coordinates) ? vault.coordinates.length : 0,
      boundaryTypes: [vault.boundaryType],
      requiresRealTimeVerification: vault.requiresRealTimeVerification,
      multiFactorUnlock: vault.multiFactorUnlock,
      createdAt: vault.createdAt?.toISOString(),
    }));

    return res.json({
      success: true,
      vaults: transformedVaults,
    });
  } catch (error) {
    securityLogger.error(
      `Error fetching geolocation vaults: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error fetching geolocation vaults',
    });
  }
});

/**
 * Get a specific geolocation vault by ID
 * GET /api/geo-vaults/:id
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vault = await geolocationService.getVaultById(req.params.id);

    if (!vault) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found',
      });
    }

    // Check if the vault belongs to the current user
    if (vault.userId !== req.user.id) {
      securityLogger.warn(
        `Unauthorized access attempt to vault ${req.params.id}`,
        SecurityEventType.UNAUTHORIZED_ACCESS,
        {
          vaultId: req.params.id,
          requestingUserId: req.user.id,
          ownerUserId: vault.userId,
        }
      );

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this vault',
      });
    }

    return res.json({
      success: true,
      vault,
    });
  } catch (error) {
    securityLogger.error(
      `Error fetching vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        vaultId: req.params.id,
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error fetching vault details',
    });
  }
});

/**
 * Verify location for vault access
 * POST /api/geo-vaults/verify
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      vaultId: z.string(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number(),
        accuracy: z.number().optional(),
        timestamp: z.number().optional(),
      }),
    });

    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification data',
        errors: validation.error.errors,
      });
    }

    const { vaultId, location } = validation.data;

    // Verify location
    const verificationResult = await geolocationService.verifyLocation(
      vaultId,
      location,
      req.user.id
    );

    return res.json({
      success: verificationResult.success,
      message: verificationResult.message,
      details: verificationResult.details,
    });
  } catch (error) {
    securityLogger.error(
      `Error verifying location: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error verifying location',
    });
  }
});

/**
 * Update geolocation vault settings
 * PUT /api/geo-vaults/:id
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    // Validate request body (partial update)
    const partialSchema = insertGeoVaultSchema.partial();
    const validation = partialSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vault data',
        errors: validation.error.errors,
      });
    }

    // Update vault
    const updatedVault = await geolocationService.updateVault(
      req.params.id,
      req.user.id,
      validation.data
    );

    if (!updatedVault) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found or you do not have permission to modify it',
      });
    }

    return res.json({
      success: true,
      message: 'Vault updated successfully',
      vault: updatedVault,
    });
  } catch (error) {
    securityLogger.error(
      `Error updating vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        vaultId: req.params.id,
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error updating vault',
    });
  }
});

/**
 * Delete a geolocation vault
 * DELETE /api/geo-vaults/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await geolocationService.deleteVault(
      req.params.id,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Vault not found or you do not have permission to delete it',
      });
    }

    return res.json({
      success: true,
      message: 'Vault deleted successfully',
    });
  } catch (error) {
    securityLogger.error(
      `Error deleting vault: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        vaultId: req.params.id,
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error deleting vault',
    });
  }
});

/**
 * Get verification history for a vault
 * GET /api/geo-vaults/:id/history
 */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const history = await geolocationService.getAccessHistory(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      history,
    });
  } catch (error) {
    securityLogger.error(
      `Error fetching vault history: ${(error as Error).message}`,
      SecurityEventType.SYSTEM_ERROR,
      {
        vaultId: req.params.id,
        userId: req.user?.id,
        error,
      }
    );

    return res.status(500).json({
      success: false,
      message: 'Error fetching vault access history',
    });
  }
});

export default router;