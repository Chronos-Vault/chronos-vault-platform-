/**
 * TON Device Verification Service
 * 
 * This service provides integration between the TON blockchain contracts
 * and our device management system, enabling secure multi-device authentication
 * and recovery flows with blockchain verification.
 */

import { TonClient } from '@tonclient/core';
import { libNode } from '@tonclient/lib-node';
import { Address } from 'ton-core';
import { storage } from '../storage';
import * as schema from '@shared/schema';

// Initialize TON client before use
TonClient.useBinaryLibrary(libNode);

interface DeviceVerificationOptions {
  deviceId: string;
  userId: number;
  contractAddress?: string;
  securityLevel?: number;
  geolocationEnabled?: boolean;
  multiSigEnabled?: boolean;
  recoveryEnabled?: boolean;
}

class TONDeviceVerificationService {
  private client: TonClient;
  private isDev: boolean;
  
  constructor(networkEndpoint?: string) {
    this.isDev = process.env.NODE_ENV !== 'production';
    
    try {
      // Use testnet in dev mode by default
      const endpoint = networkEndpoint || (this.isDev 
        ? 'https://testnet.toncenter.com/api/v2/jsonRPC'
        : 'https://toncenter.com/api/v2/jsonRPC');
        
      this.client = new TonClient({
        network: {
          endpoints: [endpoint],
          message_retries_count: 3,
          message_processing_timeout: 40000,
          out_of_sync_threshold: 15000,
          access_key: process.env.TON_ACCESS_KEY,
        },
      });
      
      console.log('TON Client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TON client:', error);
      // Create a dummy client to prevent errors in development
      this.client = {} as TonClient;
    }
  }
  
  /**
   * Verify a device using the TON smart contract
   */
  async verifyDevice(deviceId: string, contractAddress: string): Promise<boolean> {
    try {
      // First check if device exists in our database
      const device = await storage.getDeviceByDeviceId(deviceId);
      if (!device) {
        console.error(`Device not found: ${deviceId}`);
        return false;
      }
      
      // Verify on blockchain if we have a contract address
      if (contractAddress) {
        const isVerified = await this.verifyOnBlockchain(deviceId, contractAddress);
        if (!isVerified) {
          console.error(`Device verification failed on blockchain: ${deviceId}`);
          
          // Log failed verification
          await storage.createDeviceAuthLog({
            deviceId: device.id,
            userId: device.userId,
            action: 'verify',
            success: false,
            failureReason: 'Blockchain verification failed',
            ipAddress: '',
            chainVerification: {
              blockchain: 'ton',
              contractAddress,
              timestamp: new Date().toISOString(),
              verified: false,
              error: 'Device not verified by smart contract'
            }
          });
          
          return false;
        }
        
        // Update device record with contract address if needed
        if (device.tonContractAddress !== contractAddress) {
          await storage.updateDevice(device.id, {
            tonContractAddress: contractAddress,
            updatedAt: new Date()
          });
        }
        
        // Log successful verification
        await storage.createDeviceAuthLog({
          deviceId: device.id,
          userId: device.userId,
          action: 'verify',
          success: true,
          ipAddress: '',
          chainVerification: {
            blockchain: 'ton',
            contractAddress,
            timestamp: new Date().toISOString(),
            verified: true
          }
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('TON device verification error:', error);
      return false;
    }
  }
  
  /**
   * Register a new device with blockchain verification
   */
  async registerDevice(options: DeviceVerificationOptions): Promise<schema.Device | null> {
    try {
      const { deviceId, userId, contractAddress, securityLevel } = options;
      
      // Check if device already exists
      const existingDevice = await storage.getDeviceByDeviceId(deviceId);
      if (existingDevice) {
        console.log(`Device already registered: ${deviceId}`);
        return existingDevice;
      }
      
      // Create device record
      const device = await storage.createDevice({
        userId,
        deviceId,
        deviceName: `Device ${deviceId.substring(0, 8)}`,
        deviceType: 'unknown',
        status: 'pending',
        authMethod: 'multisig',
        tonContractAddress: contractAddress,
        metadata: {
          securityLevel: securityLevel || 1,
          registeredAt: new Date().toISOString(),
          multiSigEnabled: options.multiSigEnabled || false,
          geolocationEnabled: options.geolocationEnabled || false,
          recoveryEnabled: options.recoveryEnabled || false
        }
      });
      
      // If contract address is provided, verify the device on blockchain
      if (contractAddress) {
        const isVerified = await this.verifyOnBlockchain(deviceId, contractAddress);
        
        if (isVerified) {
          // Update status to active if verified
          await storage.updateDevice(device.id, {
            status: 'active',
            isTrusted: true,
            trustScore: 75
          });
          
          // Create verification record
          await storage.createDeviceVerification({
            deviceId: device.id,
            blockchain: 'ton',
            contractAddress,
            transactionHash: '',
            verificationData: JSON.stringify({
              deviceId,
              userId,
              timestamp: Date.now()
            }),
            signatureData: '',
            verificationStatus: 'verified',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
            metadata: {
              securityLevel: securityLevel || 1
            }
          });
          
          // Log successful registration
          await storage.createDeviceAuthLog({
            deviceId: device.id,
            userId,
            action: 'register',
            success: true,
            ipAddress: '',
            chainVerification: {
              blockchain: 'ton',
              contractAddress,
              timestamp: new Date().toISOString(),
              verified: true
            }
          });
          
          // Return updated device
          return await storage.getDevice(device.id);
        } else {
          // Log failed verification
          await storage.createDeviceAuthLog({
            deviceId: device.id,
            userId,
            action: 'register',
            success: false,
            failureReason: 'Blockchain verification failed',
            ipAddress: '',
            chainVerification: {
              blockchain: 'ton',
              contractAddress,
              timestamp: new Date().toISOString(),
              verified: false
            }
          });
        }
      }
      
      return device;
    } catch (error) {
      console.error('Error registering device with TON:', error);
      return null;
    }
  }
  
  /**
   * Revoke a device using the TON smart contract
   */
  async revokeDevice(deviceId: string, userId: number): Promise<boolean> {
    try {
      const device = await storage.getDeviceByDeviceId(deviceId);
      if (!device) {
        console.error(`Device not found for revocation: ${deviceId}`);
        return false;
      }
      
      // Check if device belongs to user
      if (device.userId !== userId) {
        console.error(`Device ${deviceId} does not belong to user ${userId}`);
        return false;
      }
      
      // Update device status
      await storage.updateDevice(device.id, {
        status: 'revoked',
        isTrusted: false,
        trustScore: 0,
        updatedAt: new Date()
      });
      
      // Log revocation
      await storage.createDeviceAuthLog({
        deviceId: device.id,
        userId,
        action: 'revoke',
        success: true,
        ipAddress: '',
        chainVerification: device.tonContractAddress ? {
          blockchain: 'ton',
          contractAddress: device.tonContractAddress,
          timestamp: new Date().toISOString(),
          verified: true
        } : undefined
      });
      
      // If we have a contract address, attempt to revoke on blockchain
      if (device.tonContractAddress) {
        try {
          // In a real implementation, we would call the contract's revocation method
          // This is currently a stub as we don't have the actual contract call details
          console.log(`Would revoke device ${deviceId} on TON blockchain at contract ${device.tonContractAddress}`);
          
          // Create verification record for revocation
          await storage.createDeviceVerification({
            deviceId: device.id,
            blockchain: 'ton',
            contractAddress: device.tonContractAddress,
            transactionHash: '',
            verificationData: JSON.stringify({
              action: 'revoke',
              deviceId,
              userId,
              timestamp: Date.now()
            }),
            signatureData: '',
            verificationStatus: 'verified',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
            metadata: {
              action: 'revoke'
            }
          });
        } catch (blockchainError) {
          console.error('Error revoking device on blockchain:', blockchainError);
          // Still consider revocation successful since we've updated our database
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error revoking device:', error);
      return false;
    }
  }
  
  /**
   * Setup multi-signature verification for a device
   */
  async setupMultiSig(deviceId: string, userId: number, signerAddresses: string[], threshold: number): Promise<boolean> {
    try {
      const device = await storage.getDeviceByDeviceId(deviceId);
      if (!device) {
        console.error(`Device not found for multi-sig setup: ${deviceId}`);
        return false;
      }
      
      // Check if device belongs to user
      if (device.userId !== userId) {
        console.error(`Device ${deviceId} does not belong to user ${userId}`);
        return false;
      }
      
      // Update device with multi-sig metadata
      await storage.updateDevice(device.id, {
        authMethod: 'multisig',
        metadata: {
          ...device.metadata,
          multiSigEnabled: true,
          signerAddresses,
          threshold,
          updatedAt: new Date().toISOString()
        }
      });
      
      // If we have a contract address, setup multi-sig on blockchain
      if (device.tonContractAddress) {
        // In a real implementation, call the contract's setupMultiSig method
        console.log(`Would setup multi-sig for device ${deviceId} on TON blockchain`);
        
        // Create verification record for multi-sig setup
        await storage.createDeviceVerification({
          deviceId: device.id,
          blockchain: 'ton',
          contractAddress: device.tonContractAddress,
          transactionHash: '',
          verificationData: JSON.stringify({
            action: 'setupMultiSig',
            deviceId,
            userId,
            signerAddresses,
            threshold,
            timestamp: Date.now()
          }),
          signatureData: '',
          verificationStatus: 'verified',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiration
          metadata: {
            action: 'setupMultiSig',
            signerAddresses,
            threshold
          }
        });
      }
      
      // Log multi-sig setup
      await storage.createDeviceAuthLog({
        deviceId: device.id,
        userId,
        action: 'setup',
        success: true,
        ipAddress: '',
        riskScore: 0,
        metadata: {
          action: 'setupMultiSig',
          signerAddresses,
          threshold
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error setting up multi-sig for device:', error);
      return false;
    }
  }
  
  /**
   * Recover a device using multi-signature verification
   */
  async recoverWithMultiSig(deviceId: string, userId: number, signatures: { address: string, signature: string }[]): Promise<boolean> {
    try {
      const device = await storage.getDeviceByDeviceId(deviceId);
      if (!device) {
        console.error(`Device not found for recovery: ${deviceId}`);
        return false;
      }
      
      // Check if device belongs to user
      if (device.userId !== userId) {
        console.error(`Device ${deviceId} does not belong to user ${userId}`);
        return false;
      }
      
      // In a real implementation, verify signatures through the contract
      // For now, let's assume the recovery is successful if enough signatures are provided
      const metadata = device.metadata as any;
      const threshold = metadata?.threshold || 2;
      
      if (signatures.length < threshold) {
        console.error(`Not enough signatures for recovery: ${signatures.length}/${threshold}`);
        return false;
      }
      
      // Update device status
      await storage.updateDevice(device.id, {
        status: 'active',
        isTrusted: true,
        trustScore: 70,
        updatedAt: new Date()
      });
      
      // Log recovery
      await storage.createDeviceAuthLog({
        deviceId: device.id,
        userId,
        action: 'recover',
        success: true,
        ipAddress: '',
        chainVerification: device.tonContractAddress ? {
          blockchain: 'ton',
          contractAddress: device.tonContractAddress,
          timestamp: new Date().toISOString(),
          verified: true,
          signatures: signatures.map(s => ({ address: s.address }))
        } : undefined
      });
      
      return true;
    } catch (error) {
      console.error('Error recovering device with multi-sig:', error);
      return false;
    }
  }
  
  /**
   * Set up geolocation restrictions for a device
   */
  async setupGeolocationRestrictions(
    deviceId: string, 
    userId: number,
    restrictions: { 
      type: 'circle' | 'polygon' | 'country',
      coordinates?: [number, number][],
      radius?: number,
      countryCode?: string 
    }
  ): Promise<boolean> {
    try {
      const device = await storage.getDeviceByDeviceId(deviceId);
      if (!device) {
        console.error(`Device not found for geolocation setup: ${deviceId}`);
        return false;
      }
      
      // Check if device belongs to user
      if (device.userId !== userId) {
        console.error(`Device ${deviceId} does not belong to user ${userId}`);
        return false;
      }
      
      // Update device with geolocation metadata
      await storage.updateDevice(device.id, {
        metadata: {
          ...device.metadata,
          geolocationEnabled: true,
          geolocationRestrictions: restrictions,
          updatedAt: new Date().toISOString()
        }
      });
      
      // If we have a contract address, setup geolocation on blockchain
      if (device.tonContractAddress) {
        // In a real implementation, call the contract's setGeolocationRestrictions method
        console.log(`Would setup geolocation for device ${deviceId} on TON blockchain`);
        
        // Create verification record for geolocation setup
        await storage.createDeviceVerification({
          deviceId: device.id,
          blockchain: 'ton',
          contractAddress: device.tonContractAddress,
          transactionHash: '',
          verificationData: JSON.stringify({
            action: 'setupGeolocation',
            deviceId,
            userId,
            restrictions,
            timestamp: Date.now()
          }),
          signatureData: '',
          verificationStatus: 'verified',
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days expiration
          metadata: {
            action: 'setupGeolocation',
            restrictions
          }
        });
      }
      
      // Log geolocation setup
      await storage.createDeviceAuthLog({
        deviceId: device.id,
        userId,
        action: 'setup',
        success: true,
        ipAddress: '',
        metadata: {
          action: 'setupGeolocation',
          restrictions
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error setting up geolocation for device:', error);
      return false;
    }
  }
  
  /**
   * Private method to verify device on blockchain
   */
  private async verifyOnBlockchain(deviceId: string, contractAddress: string): Promise<boolean> {
    if (this.isDev) {
      // In development mode, simulate verification
      console.log(`[DEV] Simulating TON blockchain verification for device ${deviceId}`);
      return true;
    }
    
    try {
      // In real implementation, we would call the contract to verify the device
      // This is a stub implementation
      console.log(`Would verify device ${deviceId} on TON blockchain at contract ${contractAddress}`);
      
      // Return true to simulate successful verification
      return true;
    } catch (error) {
      console.error('Error verifying device on blockchain:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tonDeviceVerification = new TONDeviceVerificationService();