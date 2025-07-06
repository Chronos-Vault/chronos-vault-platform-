/**
 * Geo-Verification Service for Atomic Swaps
 *
 * This module provides functionality for verifying geographical location
 * restrictions for atomic swaps as part of enhanced security measures.
 */

import { v4 as uuidv4 } from "uuid";

export interface GeoVerificationRecord {
  id: string;
  swapId: string;
  locationHash: string;
  verified: boolean;
  timestamp: number;
  expiresAt: number;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  accuracyMeters?: number;
}

export class GeoVerificationService {
  private verificationRecords: Map<string, GeoVerificationRecord>;
  private locationsBySwap: Map<string, string[]>;

  constructor() {
    this.verificationRecords = new Map();
    this.locationsBySwap = new Map();
    this.loadStoredVerifications();
  }

  /**
   * Request geolocation verification for a swap
   */
  async requestVerification(swapId: string): Promise<GeoVerificationRecord | null> {
    try {
      const locationHash = await this.getCurrentLocationHash();
      
      const record: GeoVerificationRecord = {
        id: uuidv4(),
        swapId,
        locationHash,
        verified: false,
        timestamp: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours expiration
      };

      this.verificationRecords.set(record.id, record);
      
      // Track the verification by swapId
      const swapVerifications = this.locationsBySwap.get(swapId) || [];
      swapVerifications.push(record.id);
      this.locationsBySwap.set(swapId, swapVerifications);
      
      this.saveToStorage();
      return record;
    } catch (error) {
      console.error('Error requesting geolocation verification:', error);
      return null;
    }
  }

  /**
   * Verify a location hash against the allowed hashes for a swap
   */
  async verifyLocation(swapId: string, allowedHashes: string[]): Promise<boolean> {
    try {
      const currentHash = await this.getCurrentLocationHash();
      const isAllowed = allowedHashes.includes(currentHash);
      
      if (isAllowed) {
        // Update all verification records for this swap
        const recordIds = this.locationsBySwap.get(swapId) || [];
        for (const id of recordIds) {
          const record = this.verificationRecords.get(id);
          if (record) {
            record.verified = true;
            this.verificationRecords.set(id, record);
          }
        }
        
        this.saveToStorage();
      }
      
      return isAllowed;
    } catch (error) {
      console.error('Error verifying geolocation:', error);
      return false;
    }
  }

  /**
   * Check if a swap has valid geolocation verification
   */
  hasValidVerification(swapId: string): boolean {
    const recordIds = this.locationsBySwap.get(swapId) || [];
    
    if (recordIds.length === 0) {
      return false;
    }
    
    // Check if any verification record is valid and not expired
    for (const id of recordIds) {
      const record = this.verificationRecords.get(id);
      if (record && record.verified && record.expiresAt > Date.now()) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get the most recent verification record for a swap
   */
  getLatestVerification(swapId: string): GeoVerificationRecord | null {
    const recordIds = this.locationsBySwap.get(swapId) || [];
    
    if (recordIds.length === 0) {
      return null;
    }
    
    // Find the most recent verification record
    let latestRecord: GeoVerificationRecord | null = null;
    let latestTimestamp = 0;
    
    for (const id of recordIds) {
      const record = this.verificationRecords.get(id);
      if (record && record.timestamp > latestTimestamp) {
        latestRecord = record;
        latestTimestamp = record.timestamp;
      }
    }
    
    return latestRecord;
  }

  /**
   * Get a hash representing the current location
   * 
   * In a real implementation, this would use the Geolocation API and/or IP-based
   * geolocation to determine the user's actual location and create a hash based on
   * the coordinates.
   */
  private async getCurrentLocationHash(): Promise<string> {
    // This is a simplified mock implementation
    // In a real system, this would use the browser's Geolocation API
    // and/or IP-based geolocation services
    
    return new Promise((resolve) => {
      // Simulate getting geolocation data with random coordinates
      setTimeout(() => {
        // For demo purposes, just return "current-location-hash"
        // In production, we would generate a real hash based on actual coordinates
        resolve("current-location-hash");
      }, 500); // Simulate a small delay
    });
  }

  /**
   * Saves all verification records to local storage
   */
  private saveToStorage(): void {
    try {
      const recordsData = JSON.stringify(Array.from(this.verificationRecords.entries()));
      const swapLocationsData = JSON.stringify(Array.from(this.locationsBySwap.entries()));
      
      localStorage.setItem('atomic_swap_geo_records', recordsData);
      localStorage.setItem('atomic_swap_geo_by_swap', swapLocationsData);
    } catch (error) {
      console.error('Error saving geolocation data to storage:', error);
    }
  }

  /**
   * Loads verification records from local storage
   */
  private loadStoredVerifications(): void {
    try {
      const recordsData = localStorage.getItem('atomic_swap_geo_records');
      const swapLocationsData = localStorage.getItem('atomic_swap_geo_by_swap');
      
      if (recordsData) {
        const entries = JSON.parse(recordsData) as [string, GeoVerificationRecord][];
        this.verificationRecords = new Map(entries);
      }
      
      if (swapLocationsData) {
        const entries = JSON.parse(swapLocationsData) as [string, string[]][];
        this.locationsBySwap = new Map(entries);
      }
    } catch (error) {
      console.error('Error loading geolocation data from storage:', error);
    }
  }
  
  /**
   * Clear expired verification records
   */
  cleanupExpiredRecords(): void {
    const now = Date.now();
    let recordsRemoved = false;
    
    // Remove expired records
    for (const [id, record] of this.verificationRecords.entries()) {
      if (record.expiresAt < now) {
        this.verificationRecords.delete(id);
        recordsRemoved = true;
      }
    }
    
    // Update the indices if records were removed
    if (recordsRemoved) {
      for (const [swapId, recordIds] of this.locationsBySwap.entries()) {
        const validRecordIds = recordIds.filter(id => this.verificationRecords.has(id));
        
        if (validRecordIds.length !== recordIds.length) {
          if (validRecordIds.length === 0) {
            this.locationsBySwap.delete(swapId);
          } else {
            this.locationsBySwap.set(swapId, validRecordIds);
          }
        }
      }
      
      this.saveToStorage();
    }
  }
}

// Singleton instance for application-wide use
export const geoVerificationService = new GeoVerificationService();
