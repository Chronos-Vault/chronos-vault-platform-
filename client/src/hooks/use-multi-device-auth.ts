import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSecurityService } from '@/hooks/use-security-service';

/**
 * Interface for device information
 */
interface DeviceInfo {
  id: string;
  name: string;
  lastActive: number;
  status: 'active' | 'pending' | 'revoked';
  isCurrentDevice: boolean;
}

type SecurityLevel = 'standard' | 'enhanced' | 'maximum';

/**
 * Hook for managing multi-device authentication
 * 
 * This hook provides functionality for registering new devices,
 * approving device access requests, and revoking device access.
 */
export function useMultiDeviceAuth() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [securityLevel, setSecurityLevelState] = useState<SecurityLevel>('standard');
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const securityService = useSecurityService();
  
  // Load devices from storage
  useEffect(() => {
    const loadDevices = async () => {
      if (!user) {
        setDevices([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In a production environment, this would fetch devices from a backend API
        // For development/testing, we'll simulate a list of devices
        
        // Retrieve stored devices from localStorage, or initialize if not present
        const storedDevices = localStorage.getItem('user_devices');
        let deviceList: DeviceInfo[] = [];
        
        if (storedDevices) {
          deviceList = JSON.parse(storedDevices);
        } else {
          // Generate a simulated device list if none exists
          const currentDevice: DeviceInfo = {
            id: 'device_current',
            name: 'Current Device',
            lastActive: Date.now(),
            status: 'active',
            isCurrentDevice: true
          };
          
          const otherDevice: DeviceInfo = {
            id: 'device_other',
            name: 'Work Laptop',
            lastActive: Date.now() - 86400000, // 1 day ago
            status: 'active',
            isCurrentDevice: false
          };
          
          const pendingDevice: DeviceInfo = {
            id: 'device_pending',
            name: 'New iPhone',
            lastActive: Date.now() - 3600000, // 1 hour ago
            status: 'pending',
            isCurrentDevice: false
          };
          
          deviceList = [currentDevice, otherDevice, pendingDevice];
          localStorage.setItem('user_devices', JSON.stringify(deviceList));
        }
        
        // Load the security level
        const storedSecurityLevel = localStorage.getItem('security_level');
        if (storedSecurityLevel) {
          setSecurityLevelState(storedSecurityLevel as SecurityLevel);
        }
        
        setDevices(deviceList);
      } catch (err) {
        console.error('Error loading devices:', err);
        setError('Failed to load your connected devices. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDevices();
  }, [user]);
  
  // Register a new device
  const registerDevice = useCallback(async (deviceName: string): Promise<string> => {
    if (!user) {
      throw new Error('You must be logged in to register a device');
    }
    
    try {
      // In a production environment, this would call the backend API to register the device
      // and generate proper cryptographic proof for the device
      
      // For development/testing, we'll simulate registration
      const newDevice: DeviceInfo = {
        id: `device_${Math.random().toString(36).substring(2, 9)}`,
        name: deviceName,
        lastActive: Date.now(),
        status: 'pending',
        isCurrentDevice: false
      };
      
      // Add the new device to the list
      const updatedDevices = [...devices, newDevice];
      setDevices(updatedDevices);
      localStorage.setItem('user_devices', JSON.stringify(updatedDevices));
      
      // Simulate pairing code generation - in a real implementation,
      // this would create a secure pairing protocol
      return `PAIR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    } catch (err) {
      console.error('Error registering device:', err);
      throw new Error('Failed to register the device. Please try again.');
    }
  }, [devices, user]);
  
  // Approve a device (change status from pending to active)
  const approveDevice = useCallback(async (deviceId: string): Promise<void> => {
    try {
      // In a production environment, this would call the backend API
      
      // For development/testing, we'll update the local state
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'active' as const } 
          : device
      );
      
      setDevices(updatedDevices);
      localStorage.setItem('user_devices', JSON.stringify(updatedDevices));
    } catch (err) {
      console.error('Error approving device:', err);
      throw new Error('Failed to approve the device. Please try again.');
    }
  }, [devices]);
  
  // Revoke a device's access
  const revokeDevice = useCallback(async (deviceId: string): Promise<void> => {
    try {
      // In a production environment, this would call the backend API
      
      // For development/testing, we'll update the local state
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'revoked' as const } 
          : device
      );
      
      setDevices(updatedDevices);
      localStorage.setItem('user_devices', JSON.stringify(updatedDevices));
    } catch (err) {
      console.error('Error revoking device:', err);
      throw new Error('Failed to revoke the device. Please try again.');
    }
  }, [devices]);
  
  // Set a device as the primary device
  const setPrimaryDevice = useCallback(async (deviceId: string): Promise<void> => {
    // This functionality would typically be used in multi-device setups
    // where the primary device has special permissions
    
    try {
      // In a production environment, this would call the backend API
      
      // For development/testing, we'll update the local state
      const updatedDevices = devices.map(device => ({
        ...device,
        isCurrentDevice: device.id === deviceId
      }));
      
      setDevices(updatedDevices);
      localStorage.setItem('user_devices', JSON.stringify(updatedDevices));
    } catch (err) {
      console.error('Error setting primary device:', err);
      throw new Error('Failed to set the primary device. Please try again.');
    }
  }, [devices]);
  
  // Rename a device
  const renameDevice = useCallback(async (deviceId: string, newName: string): Promise<void> => {
    try {
      // In a production environment, this would call the backend API
      
      // For development/testing, we'll update the local state
      const updatedDevices = devices.map(device => 
        device.id === deviceId 
          ? { ...device, name: newName } 
          : device
      );
      
      setDevices(updatedDevices);
      localStorage.setItem('user_devices', JSON.stringify(updatedDevices));
    } catch (err) {
      console.error('Error renaming device:', err);
      throw new Error('Failed to rename the device. Please try again.');
    }
  }, [devices]);
  
  // Set the security level for the account
  const setSecurityLevel = useCallback(async (level: SecurityLevel): Promise<void> => {
    try {
      // In a production environment, this would call the backend API
      
      // For development/testing, we'll update the local state
      setSecurityLevelState(level);
      localStorage.setItem('security_level', level);
    } catch (err) {
      console.error('Error setting security level:', err);
      throw new Error('Failed to set the security level. Please try again.');
    }
  }, []);
  
  // Generate a recovery code for account recovery
  const generateRecoveryCode = useCallback(async (): Promise<void> => {
    try {
      // In a production environment, this would generate a cryptographically
      // secure recovery code and store a hash of it on the backend
      
      // For development/testing, we'll generate a random code
      const segments = [];
      for (let i = 0; i < 4; i++) {
        segments.push(Math.random().toString(36).substring(2, 8).toUpperCase());
      }
      const code = segments.join('-');
      
      setRecoveryCode(code);
      localStorage.setItem('recovery_code_hash', 'HASH_OF_' + code); // In a real implementation, only the hash would be stored
    } catch (err) {
      console.error('Error generating recovery code:', err);
      throw new Error('Failed to generate a recovery code. Please try again.');
    }
  }, []);
  
  return {
    devices,
    securityLevel,
    recoveryCode,
    isLoading,
    error,
    registerDevice,
    approveDevice,
    revokeDevice,
    setPrimaryDevice,
    renameDevice,
    setSecurityLevel,
    generateRecoveryCode
  };
}