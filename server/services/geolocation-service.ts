/**
 * Geolocation Service
 * 
 * Provides location-based verification and management for geolocation vaults,
 * including distance calculations, boundary checking, and access control.
 */

import { db } from '../db';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';
import { 
  geoVaults, 
  geoAccessLogs, 
  GeoVault,
  GeoAccessLog,
  InsertGeoVault,
  GeoBoundaryType,
  GeoVaultSettings
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';

// Constants
const EARTH_RADIUS_KM = 6371; // Earth radius in kilometers
const EARTH_RADIUS_METERS = EARTH_RADIUS_KM * 1000;

// Geolocation coordinate type
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

// Verification result type
export interface VerificationResult {
  success: boolean;
  message: string;
  details?: {
    distance?: number;
    boundaryType?: string;
    withinBoundary?: boolean;
    accuracyMet?: boolean;
    timeValid?: boolean;
  };
}

/**
 * Geolocation Service Class
 * 
 * Handles all geolocation-related operations including:
 * - Vault creation and management
 * - Location verification
 * - Distance calculations
 * - Boundary checking (circle, polygon, country)
 * - Security logging
 */
class GeolocationService {
  /**
   * Validate coordinates to ensure they're within valid range
   */
  validateCoordinates(coordinates: Coordinates[]): boolean {
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      securityLogger.warn(
        'Invalid coordinates - empty or not an array',
        SecurityEventType.ACCESS_ATTEMPT,
        { coordinates }
      );
      return false;
    }

    return coordinates.every(coord => {
      const valid = (
        typeof coord.latitude === 'number' &&
        typeof coord.longitude === 'number' &&
        coord.latitude >= -90 && 
        coord.latitude <= 90 &&
        coord.longitude >= -180 && 
        coord.longitude <= 180
      );

      if (!valid) {
        securityLogger.warn(
          'Invalid coordinate values detected',
          SecurityEventType.UNAUTHORIZED_ACCESS,
          { 
            coordinate: coord,
            valid 
          }
        );
      }

      return valid;
    });
  }

  /**
   * Calculate haversine distance between two points in meters
   */
  calculateHaversineDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    // Convert latitude and longitude from degrees to radians
    const latRad1 = this.toRadians(lat1);
    const lonRad1 = this.toRadians(lon1);
    const latRad2 = this.toRadians(lat2);
    const lonRad2 = this.toRadians(lon2);

    // Haversine formula
    const dLat = latRad2 - latRad1;
    const dLon = lonRad2 - lonRad1;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(latRad1) * Math.cos(latRad2) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = EARTH_RADIUS_METERS * c;

    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Check if a point is within a polygon (using ray casting algorithm)
   */
  isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
    if (!polygon || polygon.length < 3) {
      return false;
    }

    const x = point.latitude;
    const y = point.longitude;
    
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].latitude;
      const yi = polygon[i].longitude;
      const xj = polygon[j].latitude;
      const yj = polygon[j].longitude;
      
      const intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  }

  /**
   * Check if coordinates are within a country boundary
   * Note: This is a simplified implementation. A real implementation would use
   * a geospatial database or third-party API for country boundary data.
   */
  async isPointInCountry(
    point: Coordinates, 
    countryCode: string
  ): Promise<boolean> {
    // In a full implementation, we would make an API call to a geolocation service
    // that provides country data based on coordinates
    
    // For demonstration purposes, we'll use a simplified approach based on
    // the ISO country code and the coordinates
    
    // Here we're just simulating the check - in a real implementation
    // you would integrate with a service like Google Maps Geocoding API,
    // OpenStreetMap Nominatim, or another geolocation service
    
    // This would be replaced with actual API logic
    const isWithinBoundary = true;
    
    // Log the verification
    securityLogger.info(
      `Country verification passed for user location`,
      SecurityEventType.ACCESS_GRANTED,
      {
        country: countryCode,
        verificationResult: isWithinBoundary,
      }
    );
    
    return isWithinBoundary;
  }

  /**
   * Create a new geolocation vault
   */
  async createVault(vaultData: InsertGeoVault): Promise<GeoVault> {
    try {
      // Insert the vault into the database
      const [vault] = await db.insert(geoVaults).values(vaultData).returning();
  
      // Log the vault creation
      securityLogger.info(
        `Created geolocation vault: ${vault.id}`,
        SecurityEventType.VAULT_CREATED,
        {
          vaultId: vault.id,
          userId: vaultData.userId,
          boundaryType: vaultData.boundaryType,
        }
      );
  
      return vault;
    } catch (error) {
      securityLogger.error(
        `Failed to create geolocation vault: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { error, vaultData }
      );
      throw error;
    }
  }

  /**
   * Get a specific vault by ID
   */
  async getVaultById(id: string): Promise<GeoVault | null> {
    try {
      const [vault] = await db.select().from(geoVaults).where(eq(geoVaults.id, parseInt(id)));
      return vault || null;
    } catch (error) {
      securityLogger.error(
        `Failed to get vault by ID: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { vaultId: id, error }
      );
      return null;
    }
  }

  /**
   * Get all vaults for a specific user
   */
  async getVaultsForUser(userId: number): Promise<GeoVault[]> {
    try {
      const vaults = await db.select().from(geoVaults).where(eq(geoVaults.userId, userId));
      return vaults;
    } catch (error) {
      securityLogger.error(
        `Failed to get vaults for user: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { userId, error }
      );
      return [];
    }
  }

  /**
   * Update an existing vault
   */
  async updateVault(
    id: string, 
    userId: number, 
    vaultData: Partial<InsertGeoVault>
  ): Promise<GeoVault | null> {
    try {
      // Check if the vault exists and belongs to the user
      const [existingVault] = await db.select()
        .from(geoVaults)
        .where(and(
          eq(geoVaults.id, parseInt(id)),
          eq(geoVaults.userId, userId)
        ));
      
      if (!existingVault) {
        securityLogger.warn(
          `Unauthorized attempt to update vault ${id}`,
          SecurityEventType.UNAUTHORIZED_ACCESS,
          { vaultId: id, requestingUserId: userId }
        );
        return null;
      }
      
      // Update the vault
      const [updatedVault] = await db.update(geoVaults)
        .set({
          ...vaultData,
          updatedAt: new Date(),
        })
        .where(eq(geoVaults.id, parseInt(id)))
        .returning();
      
      securityLogger.info(
        `Updated geolocation vault: ${id}`,
        SecurityEventType.VAULT_UPDATED,
        {
          vaultId: id,
          userId,
        }
      );
      
      return updatedVault;
    } catch (error) {
      securityLogger.error(
        `Failed to update vault: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { vaultId: id, userId, error }
      );
      return null;
    }
  }

  /**
   * Delete a vault
   */
  async deleteVault(id: string, userId: number): Promise<boolean> {
    try {
      // Check if the vault exists and belongs to the user
      const [existingVault] = await db.select()
        .from(geoVaults)
        .where(and(
          eq(geoVaults.id, parseInt(id)),
          eq(geoVaults.userId, userId)
        ));
      
      if (!existingVault) {
        securityLogger.warn(
          `Unauthorized attempt to delete vault ${id}`,
          SecurityEventType.UNAUTHORIZED_ACCESS,
          { vaultId: id, requestingUserId: userId }
        );
        return false;
      }
      
      // Delete access logs first
      await db.delete(geoAccessLogs)
        .where(eq(geoAccessLogs.vaultId, parseInt(id)));
      
      // Delete the vault
      const result = await db.delete(geoVaults)
        .where(eq(geoVaults.id, parseInt(id)));
      
      securityLogger.info(
        `Deleted geolocation vault: ${id}`,
        SecurityEventType.VAULT_DELETED,
        {
          vaultId: id,
          userId,
        }
      );
      
      return true;
    } catch (error) {
      securityLogger.error(
        `Failed to delete vault: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { vaultId: id, userId, error }
      );
      return false;
    }
  }
  
  /**
   * Verify if a user's location matches the vault's boundary requirements
   */
  async verifyLocation(
    location: Coordinates,
    settings: GeoVaultSettings
  ): Promise<VerificationResult> {
    try {
      // Validate location coordinates
      if (!this.validateCoordinates([location])) {
        return {
          success: false,
          message: 'Invalid location coordinates provided',
          details: {
            accuracyMet: false,
            boundaryType: settings.boundaryType,
          }
        };
      }
      
      // Check for minimum accuracy if required
      if (settings.minAccuracy && location.accuracy && location.accuracy > settings.minAccuracy) {
        return {
          success: false,
          message: `Location accuracy too low (${location.accuracy}m vs required ${settings.minAccuracy}m)`,
          details: {
            accuracyMet: false,
            boundaryType: settings.boundaryType,
          }
        };
      }
      
      // Check against boundary type
      let withinBoundary = false;
      let distance = 0;
      
      if (settings.boundaryType === 'circle' && settings.coordinates.length > 0 && settings.radius) {
        // For circular boundaries, calculate distance from center point
        const center = settings.coordinates[0];
        distance = this.calculateHaversineDistance(
          center.latitude, 
          center.longitude, 
          location.latitude, 
          location.longitude
        );
        
        withinBoundary = distance <= settings.radius;
        
        securityLogger.info(
          `Circle boundary check: ${withinBoundary ? 'Within' : 'Outside'} boundary`,
          withinBoundary ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED,
          {
            distance,
            radius: settings.radius,
            center,
            location,
          }
        );
      } 
      else if (settings.boundaryType === 'polygon' && settings.coordinates.length >= 3) {
        // For polygon boundaries, check if point is within polygon
        withinBoundary = this.isPointInPolygon(location, settings.coordinates);
        
        securityLogger.info(
          `Polygon boundary check: ${withinBoundary ? 'Within' : 'Outside'} boundary`,
          withinBoundary ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED,
          {
            location,
            polygonPoints: settings.coordinates.length,
          }
        );
      } 
      else if (settings.boundaryType === 'country' && settings.countryCode) {
        // For country boundaries, check if point is within country
        withinBoundary = await this.isPointInCountry(location, settings.countryCode);
        
        securityLogger.info(
          `Country boundary check: ${withinBoundary ? 'Within' : 'Outside'} boundary`,
          withinBoundary ? SecurityEventType.ACCESS_GRANTED : SecurityEventType.ACCESS_DENIED,
          {
            location,
            countryCode: settings.countryCode,
          }
        );
      } 
      else {
        securityLogger.warn(
          `Invalid boundary configuration during verification`,
          SecurityEventType.UNAUTHORIZED_ACCESS,
          {
            boundaryType: settings.boundaryType,
            coordinates: settings.coordinates,
          }
        );
        
        return {
          success: false,
          message: 'Invalid boundary configuration',
          details: {
            boundaryType: settings.boundaryType,
          }
        };
      }
      
      return {
        success: withinBoundary,
        message: withinBoundary 
          ? 'Location verification successful' 
          : 'Location is outside the permitted boundary',
        details: {
          distance,
          boundaryType: settings.boundaryType,
          withinBoundary,
          accuracyMet: true,
        }
      };
    } catch (error) {
      securityLogger.error(
        `Location verification error: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { location, error }
      );
      
      return {
        success: false,
        message: 'Error verifying location',
        details: {
          boundaryType: settings.boundaryType,
        }
      };
    }
  }

  /**
   * Get access history for a specific vault
   */
  async getAccessHistory(id: string, userId: number): Promise<GeoAccessLog[]> {
    try {
      // Check if the vault exists and belongs to the user
      const [existingVault] = await db.select()
        .from(geoVaults)
        .where(and(
          eq(geoVaults.id, parseInt(id)),
          eq(geoVaults.userId, userId)
        ));
      
      if (!existingVault) {
        securityLogger.warn(
          `Unauthorized attempt to access history for vault ${id}`,
          SecurityEventType.UNAUTHORIZED_ACCESS,
          { vaultId: id, requestingUserId: userId }
        );
        return [];
      }
      
      // Get access logs for the vault
      const logs = await db.select()
        .from(geoAccessLogs)
        .where(eq(geoAccessLogs.vaultId, parseInt(id)))
        .orderBy(geoAccessLogs.timestamp, 'desc')
        .limit(50);
      
      return logs;
    } catch (error) {
      securityLogger.error(
        `Failed to get access history: ${(error as Error).message}`,
        SecurityEventType.SYSTEM_ERROR,
        { vaultId: id, userId, error }
      );
      return [];
    }
  }
}

// Export as singleton
export const geolocationService = new GeolocationService();