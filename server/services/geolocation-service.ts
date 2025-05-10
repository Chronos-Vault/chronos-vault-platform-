/**
 * Geolocation Service
 * 
 * Handles geolocation-based vault security features including:
 * - Location verification
 * - Geographic boundary checks
 * - Polygon-based security zones
 * - Location history tracking for vault access attempts
 */

import { EventEmitter } from 'events';
import { securityLogger, SecurityEventType } from '../monitoring/security-logger';

// Type definitions
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;  // in meters
  timestamp?: number;
}

export interface GeoBoundary {
  type: 'circle' | 'polygon' | 'country';
  coordinates: GeoCoordinates[];  // For polygon, multiple points. For circle, first point is center
  radius?: number;  // For circle boundary (in meters)
  countryCode?: string; // For country boundary
}

export interface GeoVaultSettings {
  id: string;
  ownerId: string;
  boundaries: GeoBoundary[];
  allowedTimeWindows?: {
    dayOfWeek: number; // 0-6 (Sunday to Saturday)
    startHour: number; // 0-23
    endHour: number;   // 0-23
  }[];
  minAccuracy?: number; // Minimum required GPS accuracy in meters
  requiresRealTimeVerification: boolean;
  multiFactorUnlock: boolean; // Requires additional authentication beyond location
}

export interface LocationVerificationResult {
  verified: boolean;
  boundary?: GeoBoundary; // Which boundary matched
  distance?: number;      // Distance from boundary if not verified (in meters)
  reason?: string;        // Reason for failure if not verified
  timestamp: number;
}

// Geolocation Service Implementation
export class GeolocationService extends EventEmitter {
  private vaultSettings: Map<string, GeoVaultSettings> = new Map();
  private verificationHistory: Map<string, LocationVerificationResult[]> = new Map();
  private static instance: GeolocationService;

  private constructor() {
    super();
    securityLogger.info('Geolocation Security Service initialized', 'GEO_SERVICE_INIT');
  }

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Register a new geolocation vault with security settings
   */
  public registerGeoVault(settings: GeoVaultSettings): void {
    this.vaultSettings.set(settings.id, settings);
    this.verificationHistory.set(settings.id, []);
    
    securityLogger.info(`Registered new geolocation vault: ${settings.id}`, {
      ownerId: settings.ownerId,
      boundaryCount: settings.boundaries.length,
      multiFactorRequired: settings.multiFactorUnlock
    });
    
    this.emit('vaultRegistered', settings);
  }

  /**
   * Update an existing geolocation vault's settings
   */
  public updateGeoVault(settings: GeoVaultSettings): boolean {
    if (!this.vaultSettings.has(settings.id)) {
      return false;
    }
    
    this.vaultSettings.set(settings.id, settings);
    securityLogger.info(`Updated geolocation vault settings: ${settings.id}`);
    this.emit('vaultUpdated', settings);
    return true;
  }

  /**
   * Remove a geolocation vault from the system
   */
  public removeGeoVault(vaultId: string): boolean {
    if (!this.vaultSettings.has(vaultId)) {
      return false;
    }
    
    this.vaultSettings.delete(vaultId);
    this.verificationHistory.delete(vaultId);
    securityLogger.info(`Removed geolocation vault: ${vaultId}`);
    this.emit('vaultRemoved', vaultId);
    return true;
  }

  /**
   * Verify if current location is within the allowed boundaries for a vault
   */
  public verifyLocation(vaultId: string, currentLocation: GeoCoordinates): LocationVerificationResult {
    const settings = this.vaultSettings.get(vaultId);
    if (!settings) {
      const result: LocationVerificationResult = {
        verified: false,
        reason: 'Vault not found',
        timestamp: Date.now()
      };
      return result;
    }

    // Check location accuracy if minimum is specified
    if (settings.minAccuracy && currentLocation.accuracy && currentLocation.accuracy > settings.minAccuracy) {
      const result: LocationVerificationResult = {
        verified: false,
        reason: `Location accuracy insufficient: ${currentLocation.accuracy}m (required: ${settings.minAccuracy}m)`,
        timestamp: Date.now()
      };
      this.recordVerificationAttempt(vaultId, result);
      return result;
    }

    // Check time windows if specified
    if (settings.allowedTimeWindows && settings.allowedTimeWindows.length > 0) {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();
      
      const isWithinTimeWindow = settings.allowedTimeWindows.some(window => 
        window.dayOfWeek === currentDay && 
        currentHour >= window.startHour && 
        currentHour < window.endHour
      );
      
      if (!isWithinTimeWindow) {
        const result: LocationVerificationResult = {
          verified: false,
          reason: 'Current time outside allowed access windows',
          timestamp: Date.now()
        };
        this.recordVerificationAttempt(vaultId, result);
        return result;
      }
    }

    // Check each boundary
    for (const boundary of settings.boundaries) {
      const isWithinBoundary = this.isWithinBoundary(currentLocation, boundary);
      
      if (isWithinBoundary) {
        const result: LocationVerificationResult = {
          verified: true,
          boundary,
          timestamp: Date.now()
        };
        this.recordVerificationAttempt(vaultId, result);
        
        securityLogger.info(`Successful geolocation verification for vault: ${vaultId}`, {
          boundaryType: boundary.type,
          accuracy: currentLocation.accuracy || 'unknown'
        });
        
        this.emit('locationVerified', vaultId, result);
        return result;
      }
    }

    // If we get here, no boundaries matched
    const nearestBoundary = this.findNearestBoundary(currentLocation, settings.boundaries);
    const distance = this.calculateDistance(currentLocation, nearestBoundary);
    
    const result: LocationVerificationResult = {
      verified: false,
      boundary: nearestBoundary,
      distance,
      reason: `Location outside allowed boundaries (${distance.toFixed(0)}m from nearest)`,
      timestamp: Date.now()
    };
    
    this.recordVerificationAttempt(vaultId, result);
    
    securityLogger.warn(`Failed geolocation verification for vault: ${vaultId}`, {
      distance,
      boundaryType: nearestBoundary.type,
      accuracy: currentLocation.accuracy || 'unknown'
    });
    
    this.emit('locationVerificationFailed', vaultId, result);
    return result;
  }

  /**
   * Get verification history for a specific vault
   */
  public getVerificationHistory(vaultId: string): LocationVerificationResult[] {
    return this.verificationHistory.get(vaultId) || [];
  }

  /**
   * Get a geolocation vault by ID
   */
  public getGeoVault(vaultId: string): GeoVaultSettings | undefined {
    return this.vaultSettings.get(vaultId);
  }

  /**
   * Get all geolocation vaults owned by a specific user
   */
  public getVaultsByOwner(ownerId: string): GeoVaultSettings[] {
    const ownerVaults: GeoVaultSettings[] = [];
    this.vaultSettings.forEach((settings) => {
      if (settings.ownerId === ownerId) {
        ownerVaults.push(settings);
      }
    });
    return ownerVaults;
  }

  // Private helper methods
  private recordVerificationAttempt(vaultId: string, result: LocationVerificationResult): void {
    const history = this.verificationHistory.get(vaultId);
    if (history) {
      // Keep the last 50 entries only
      if (history.length >= 50) {
        history.shift();
      }
      history.push(result);
    }
  }

  private isWithinBoundary(location: GeoCoordinates, boundary: GeoBoundary): boolean {
    switch (boundary.type) {
      case 'circle':
        if (!boundary.radius || boundary.coordinates.length === 0) {
          return false;
        }
        const centerPoint = boundary.coordinates[0];
        const distance = this.calculateDistanceBetweenPoints(
          location.latitude, location.longitude,
          centerPoint.latitude, centerPoint.longitude
        );
        return distance <= (boundary.radius / 1000); // Convert meters to km for comparison
      
      case 'polygon':
        return this.isPointInPolygon(location, boundary.coordinates);
      
      case 'country':
        // In a real implementation, this would use a geolocation API to check country
        // For the sake of this example, we'll simulate it using the countryCode
        return this.simulateCountryCheck(location, boundary.countryCode || '');
      
      default:
        return false;
    }
  }

  private findNearestBoundary(location: GeoCoordinates, boundaries: GeoBoundary[]): GeoBoundary {
    let nearestBoundary = boundaries[0];
    let shortestDistance = Number.MAX_VALUE;
    
    for (const boundary of boundaries) {
      const distance = this.calculateDistance(location, boundary);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestBoundary = boundary;
      }
    }
    
    return nearestBoundary;
  }

  private calculateDistance(location: GeoCoordinates, boundary: GeoBoundary): number {
    switch (boundary.type) {
      case 'circle':
        if (!boundary.radius || boundary.coordinates.length === 0) {
          return Number.MAX_VALUE;
        }
        const centerPoint = boundary.coordinates[0];
        const distance = this.calculateDistanceBetweenPoints(
          location.latitude, location.longitude,
          centerPoint.latitude, centerPoint.longitude
        );
        // Convert km to meters and subtract radius
        return Math.max(0, (distance * 1000) - (boundary.radius || 0));
      
      case 'polygon':
        // For polygon, find the closest edge
        return this.distanceToPolygon(location, boundary.coordinates);
      
      case 'country':
        // In a real implementation, this would calculate distance to country border
        // For this example, we'll return a simulated distance
        return this.simulateDistanceToCountry(location, boundary.countryCode || '');
      
      default:
        return Number.MAX_VALUE;
    }
  }

  // Haversine formula for calculating distance between two points on Earth
  private calculateDistanceBetweenPoints(
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private isPointInPolygon(point: GeoCoordinates, polygon: GeoCoordinates[]): boolean {
    if (polygon.length < 3) {
      return false;
    }
    
    let isInside = false;
    const x = point.longitude;
    const y = point.latitude;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].longitude;
      const yi = polygon[i].latitude;
      const xj = polygon[j].longitude;
      const yj = polygon[j].latitude;
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      
      if (intersect) {
        isInside = !isInside;
      }
    }
    
    return isInside;
  }

  private distanceToPolygon(point: GeoCoordinates, polygon: GeoCoordinates[]): number {
    if (this.isPointInPolygon(point, polygon)) {
      return 0; // Point is inside
    }
    
    let minDistance = Number.MAX_VALUE;
    
    // Calculate minimum distance to any edge of the polygon
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const distance = this.distanceToLine(
        point,
        polygon[i],
        polygon[j]
      );
      
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance * 1000; // Convert km to meters
  }

  private distanceToLine(point: GeoCoordinates, lineStart: GeoCoordinates, lineEnd: GeoCoordinates): number {
    const x = point.longitude;
    const y = point.latitude;
    const x1 = lineStart.longitude;
    const y1 = lineStart.latitude;
    const x2 = lineEnd.longitude;
    const y2 = lineEnd.latitude;
    
    // Check if line is a point
    if (x1 === x2 && y1 === y2) {
      return this.calculateDistanceBetweenPoints(y, x, y1, x1);
    }
    
    // Calculate the distance from point to line segment
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    return this.calculateDistanceBetweenPoints(y, x, yy, xx);
  }

  // Simulated methods (would use real geolocation APIs in production)
  private simulateCountryCheck(location: GeoCoordinates, countryCode: string): boolean {
    // In a real implementation, this would check against actual country boundaries
    // For demo purposes, we'll use hardcoded regions for a few countries
    
    // Simple check for USA (approximate)
    if (countryCode === 'US') {
      return location.latitude > 24.0 && location.latitude < 50.0 &&
             location.longitude > -125.0 && location.longitude < -66.0;
    }
    
    // Simple check for Canada (approximate)
    if (countryCode === 'CA') {
      return location.latitude > 41.0 && location.latitude < 83.0 &&
             location.longitude > -141.0 && location.longitude < -52.0;
    }
    
    // Simple check for UK (approximate)
    if (countryCode === 'GB') {
      return location.latitude > 49.0 && location.latitude < 61.0 &&
             location.longitude > -8.0 && location.longitude < 2.0;
    }
    
    // For other countries, in a real system we would use a geolocation API
    return false;
  }

  private simulateDistanceToCountry(location: GeoCoordinates, countryCode: string): number {
    // In production, use a real geolocation API to calculate distance to country border
    // This is a simplified simulation for demonstration purposes
    
    // USA approximate border points
    if (countryCode === 'US') {
      const borderPoints: GeoCoordinates[] = [
        { latitude: 49.0, longitude: -123.0 },  // Northwest
        { latitude: 49.0, longitude: -95.0 },   // North central
        { latitude: 49.0, longitude: -67.0 },   // Northeast
        { latitude: 25.0, longitude: -80.0 },   // Southeast
        { latitude: 25.0, longitude: -97.0 },   // South central
        { latitude: 32.0, longitude: -117.0 }   // Southwest
      ];
      
      return this.findMinDistanceToPoints(location, borderPoints) * 1000; // Convert km to meters
    }
    
    // For other countries, return a default large distance
    return 1000000; // 1000 km in meters
  }

  private findMinDistanceToPoints(location: GeoCoordinates, points: GeoCoordinates[]): number {
    let minDistance = Number.MAX_VALUE;
    
    for (const point of points) {
      const distance = this.calculateDistanceBetweenPoints(
        location.latitude, location.longitude,
        point.latitude, point.longitude
      );
      
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();