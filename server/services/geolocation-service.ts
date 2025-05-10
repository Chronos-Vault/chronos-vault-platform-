/**
 * Geolocation Service
 * 
 * Service for handling geolocation-based verification and validation 
 * of location data against vault boundaries.
 */

import { db } from '../db';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { geoVaults, geoAccessLogs, type GeoVault, type GeoAccessLog } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

// Constants
const EARTH_RADIUS_METERS = 6371000; // Earth's radius in meters

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface VerificationOptions {
  realTimeVerification?: boolean;
  minAccuracy?: number;
}

interface VerificationResult {
  success: boolean;
  message: string;
  details?: {
    distanceFromBoundary?: number;
    insideBoundary?: boolean;
    accuracy?: number;
    requiredAccuracy?: number;
  };
}

class GeolocationService {
  /**
   * Validate coordinates array for proper format and value ranges
   */
  validateCoordinates(coordinates: any[]): boolean {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
      return false;
    }
    
    // Check each coordinate for valid latitude and longitude
    return coordinates.every(coord => {
      return (
        typeof coord === 'object' &&
        typeof coord.latitude === 'number' &&
        typeof coord.longitude === 'number' &&
        coord.latitude >= -90 && 
        coord.latitude <= 90 &&
        coord.longitude >= -180 && 
        coord.longitude <= 180
      );
    });
  }

  /**
   * Verify if a location is within the boundaries of a specific vault
   */
  async verifyLocation(
    vaultId: number | string, 
    location: Coordinates, 
    userId: number | string,
    options: VerificationOptions = {}
  ): Promise<VerificationResult> {
    try {
      // Convert vaultId and userId to numbers if they're strings
      const numericVaultId = typeof vaultId === 'string' ? parseInt(vaultId, 10) : vaultId;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      // Fetch vault details
      const [vault] = await db
        .select()
        .from(geoVaults)
        .where(eq(geoVaults.id, numericVaultId));
      
      if (!vault) {
        securityLogger.warn(`Vault not found during location verification: ${vaultId}`, SecurityEventType.ACCESS_DENIED, {
          vaultId,
          userId: numericUserId,
          location
        });
        
        return {
          success: false,
          message: 'Vault not found',
        };
      }
      
      // Check user permission (vault owner check)
      if (vault.userId !== numericUserId) {
        securityLogger.warn(`Unauthorized access attempt to vault ${vaultId}`, SecurityEventType.UNAUTHORIZED_ACCESS, {
          vaultId: numericVaultId,
          attemptedUserId: numericUserId,
          ownerId: vault.userId,
          location
        });
        
        return {
          success: false,
          message: 'You do not have permission to access this vault',
        };
      }
      
      // Validate minimum accuracy if required
      if (vault.minAccuracy && location.accuracy && location.accuracy > vault.minAccuracy) {
        // Log access attempt with insufficient accuracy
        await this.logAccess(numericVaultId, numericUserId, location, false, 'Insufficient location accuracy');
        
        return {
          success: false,
          message: `Location accuracy (±${location.accuracy}m) does not meet required minimum (±${vault.minAccuracy}m)`,
          details: {
            accuracy: location.accuracy,
            requiredAccuracy: vault.minAccuracy
          }
        };
      }
      
      // Verify location based on boundary type
      let isWithinBoundary = false;
      let distance = 0;
      
      switch (vault.boundaryType) {
        case 'circle':
          const result = this.isWithinCircularBoundary(
            location, 
            vault.coordinates[0], 
            vault.radius || 100
          );
          isWithinBoundary = result.isWithin;
          distance = result.distance;
          break;
          
        case 'polygon':
          isWithinBoundary = this.isWithinPolygonBoundary(location, vault.coordinates);
          break;
          
        case 'country':
          // For now we'll just check if the country code matches
          // In a real implementation, this would use a geolocation service to verify the country
          isWithinBoundary = true; // Placeholder for demo
          break;
          
        default:
          securityLogger.warn(`Unknown boundary type: ${vault.boundaryType}`, SecurityEventType.SYSTEM_ERROR, {
            vaultId: numericVaultId,
            boundaryType: vault.boundaryType
          });
          
          return {
            success: false,
            message: `Unknown boundary type: ${vault.boundaryType}`,
          };
      }
      
      // Log access attempt
      await this.logAccess(
        numericVaultId, 
        numericUserId, 
        location, 
        isWithinBoundary, 
        isWithinBoundary ? undefined : 'Location outside boundary'
      );
      
      // Return verification result
      if (isWithinBoundary) {
        return {
          success: true,
          message: 'Location verified successfully',
          details: vault.boundaryType === 'circle' ? { distanceFromBoundary: distance } : undefined
        };
      } else {
        return {
          success: false,
          message: `Location outside the ${vault.boundaryType} boundary`,
          details: vault.boundaryType === 'circle' ? { distanceFromBoundary: distance } : undefined
        };
      }
    } catch (error) {
      securityLogger.error(`Error verifying location: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        userId,
        error
      });
      
      return {
        success: false,
        message: `Error verifying location: ${(error as Error).message}`,
      };
    }
  }
  
  /**
   * Check if a point is within a circular boundary
   */
  isWithinCircularBoundary(
    point: Coordinates, 
    center: Coordinates, 
    radiusMeters: number
  ): { isWithin: boolean; distance: number } {
    const distance = this.calculateHaversineDistance(
      point.latitude, 
      point.longitude, 
      center.latitude, 
      center.longitude
    );
    
    return {
      isWithin: distance <= radiusMeters,
      distance: distance
    };
  }
  
  /**
   * Check if a point is within a polygon boundary
   */
  isWithinPolygonBoundary(point: Coordinates, vertices: Coordinates[]): boolean {
    if (vertices.length < 3) {
      return false; // Not a proper polygon
    }
    
    // Ray casting algorithm to determine if point is in polygon
    let isInside = false;
    const x = point.longitude;
    const y = point.latitude;
    
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].longitude;
      const yi = vertices[i].latitude;
      const xj = vertices[j].longitude;
      const yj = vertices[j].latitude;
      
      const intersect = ((yi > y) !== (yj > y)) && 
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                        
      if (intersect) {
        isInside = !isInside;
      }
    }
    
    return isInside;
  }
  
  /**
   * Calculate distance between two points using Haversine formula
   */
  calculateHaversineDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    // Convert latitude and longitude from degrees to radians
    const toRadians = (degrees: number) => degrees * Math.PI / 180;
    
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = EARTH_RADIUS_METERS * c;
    
    return distance;
  }
  
  /**
   * Get vaults for a specific user
   */
  async getVaultsForUser(userId: number | string): Promise<GeoVault[]> {
    try {
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      const vaults = await db
        .select()
        .from(geoVaults)
        .where(eq(geoVaults.userId, numericUserId));
      
      return vaults;
    } catch (error) {
      securityLogger.error(`Error fetching user vaults: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        userId,
        error
      });
      
      throw error;
    }
  }
  
  /**
   * Get a specific vault by ID
   */
  async getVaultById(vaultId: number | string): Promise<GeoVault | null> {
    try {
      const numericVaultId = typeof vaultId === 'string' ? parseInt(vaultId, 10) : vaultId;
      
      const [vault] = await db
        .select()
        .from(geoVaults)
        .where(eq(geoVaults.id, numericVaultId));
      
      return vault || null;
    } catch (error) {
      securityLogger.error(`Error fetching vault by ID: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        error
      });
      
      throw error;
    }
  }
  
  /**
   * Create a new geolocation vault
   */
  async createVault(vaultData: Omit<GeoVault, 'id' | 'createdAt' | 'updatedAt'>): Promise<GeoVault> {
    try {
      const [newVault] = await db
        .insert(geoVaults)
        .values({
          ...vaultData,
          createdAt: new Date(),
        })
        .returning();
      
      securityLogger.info(`New geolocation vault created: ${newVault.id}`, SecurityEventType.VAULT_CREATED, {
        vaultId: newVault.id,
        userId: newVault.userId,
        boundaryType: newVault.boundaryType
      });
      
      return newVault;
    } catch (error) {
      securityLogger.error(`Error creating vault: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultData,
        error
      });
      
      throw error;
    }
  }
  
  /**
   * Update an existing geolocation vault
   */
  async updateVault(
    vaultId: number | string, 
    userId: number | string, 
    updates: Partial<Omit<GeoVault, 'id' | 'userId' | 'createdAt'>>
  ): Promise<GeoVault | null> {
    try {
      const numericVaultId = typeof vaultId === 'string' ? parseInt(vaultId, 10) : vaultId;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      // First, ensure the vault exists and belongs to the user
      const [vault] = await db
        .select()
        .from(geoVaults)
        .where(
          and(
            eq(geoVaults.id, numericVaultId),
            eq(geoVaults.userId, numericUserId)
          )
        );
      
      if (!vault) {
        securityLogger.warn(`Unauthorized attempt to update vault: ${vaultId}`, SecurityEventType.UNAUTHORIZED_ACCESS, {
          vaultId: numericVaultId,
          userId: numericUserId
        });
        
        return null;
      }
      
      // Update the vault
      const [updatedVault] = await db
        .update(geoVaults)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(geoVaults.id, numericVaultId))
        .returning();
      
      securityLogger.info(`Geolocation vault updated: ${vaultId}`, SecurityEventType.VAULT_UPDATED, {
        vaultId: numericVaultId,
        userId: numericUserId,
        updates: Object.keys(updates)
      });
      
      return updatedVault;
    } catch (error) {
      securityLogger.error(`Error updating vault: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        userId,
        updates,
        error
      });
      
      throw error;
    }
  }
  
  /**
   * Delete a geolocation vault
   */
  async deleteVault(vaultId: number | string, userId: number | string): Promise<boolean> {
    try {
      const numericVaultId = typeof vaultId === 'string' ? parseInt(vaultId, 10) : vaultId;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      // First, ensure the vault exists and belongs to the user
      const [vault] = await db
        .select()
        .from(geoVaults)
        .where(
          and(
            eq(geoVaults.id, numericVaultId),
            eq(geoVaults.userId, numericUserId)
          )
        );
      
      if (!vault) {
        securityLogger.warn(`Unauthorized attempt to delete vault: ${vaultId}`, SecurityEventType.UNAUTHORIZED_ACCESS, {
          vaultId: numericVaultId,
          userId: numericUserId
        });
        
        return false;
      }
      
      // Delete the vault
      const result = await db
        .delete(geoVaults)
        .where(eq(geoVaults.id, numericVaultId));
      
      securityLogger.info(`Geolocation vault deleted: ${vaultId}`, SecurityEventType.VAULT_DELETED, {
        vaultId: numericVaultId,
        userId: numericUserId
      });
      
      return true;
    } catch (error) {
      securityLogger.error(`Error deleting vault: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        userId,
        error
      });
      
      throw error;
    }
  }
  
  /**
   * Log access attempts to geolocation vaults
   */
  private async logAccess(
    vaultId: number,
    userId: number,
    location: Coordinates,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await db
        .insert(geoAccessLogs)
        .values({
          vaultId,
          userId,
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          accuracy: location.accuracy ? Math.round(location.accuracy) : undefined,
          success,
          failureReason,
          timestamp: new Date(),
          deviceInfo: {} // This would be populated with device info in a real implementation
        });
      
      securityLogger.info(
        `Vault access ${success ? 'granted' : 'denied'}: ${vaultId}`,
        success ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED,
        {
          vaultId,
          userId,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy
          },
          reason: failureReason
        }
      );
    } catch (error) {
      securityLogger.error(`Error logging vault access: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        userId,
        location,
        success,
        failureReason,
        error
      });
    }
  }
  
  /**
   * Get access history for a specific vault
   */
  async getAccessHistory(
    vaultId: number | string, 
    userId: number | string,
    limit: number = 10
  ): Promise<GeoAccessLog[]> {
    try {
      const numericVaultId = typeof vaultId === 'string' ? parseInt(vaultId, 10) : vaultId;
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      
      // First, ensure the vault exists and belongs to the user
      const [vault] = await db
        .select()
        .from(geoVaults)
        .where(
          and(
            eq(geoVaults.id, numericVaultId),
            eq(geoVaults.userId, numericUserId)
          )
        );
      
      if (!vault) {
        securityLogger.warn(
          `Unauthorized attempt to access vault history: ${vaultId}`,
          SecurityEventType.UNAUTHORIZED_ACCESS,
          {
            vaultId: numericVaultId,
            userId: numericUserId
          }
        );
        
        return [];
      }
      
      // Get access logs
      const logs = await db
        .select()
        .from(geoAccessLogs)
        .where(eq(geoAccessLogs.vaultId, numericVaultId))
        .limit(limit);
      
      return logs;
    } catch (error) {
      securityLogger.error(`Error fetching access history: ${(error as Error).message}`, SecurityEventType.SYSTEM_ERROR, {
        vaultId,
        userId,
        error
      });
      
      throw error;
    }
  }
}

// Singleton instance
export const geolocationService = new GeolocationService();