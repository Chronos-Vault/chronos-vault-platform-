import { useState, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useSecurityService } from '../hooks/use-security-service';

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

/**
 * Hook for managing multi-device authentication
 * 
 * This hook provides functionality for registering new devices,
 * approving device access requests, and revoking device access.
 */
export function useMultiDeviceAuth() {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<{id: string, deviceName: string}[]>([]);
  
  const { wallet } = useAuthContext();
  const { 
    proposeSecurityOperation, 
    signOperation, 
    executeOperation, 
    getOperationSignatureCount 
  } = useSecurityService();

  // Fetch registered devices from storage
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch from a blockchain or API
      // For development, we'll use localStorage
      const storedDevices = localStorage.getItem('registered_devices');
      
      if (storedDevices) {
        setDevices(JSON.parse(storedDevices));
      } else {
        // If no devices are stored, initialize with current device
        const currentDevice: DeviceInfo = {
          id: getDeviceId(),
          name: getDeviceName(),
          lastActive: Date.now(),
          status: 'active',
          isCurrentDevice: true
        };
        
        setDevices([currentDevice]);
        localStorage.setItem('registered_devices', JSON.stringify([currentDevice]));
      }
      
      // Fetch pending device requests
      const pendingOps = JSON.parse(localStorage.getItem('security_operations') || '{}');
      const deviceRequests = Object.entries(pendingOps)
        .filter(([_, op]: [string, any]) => 
          op.type === 'DEVICE_REGISTRATION' && 
          !op.executed && 
          op.signatures.length < 2
        )
        .map(([id, op]: [string, any]) => ({
          id,
          deviceName: op.params.deviceName
        }));
      
      setPendingRequests(deviceRequests);
      
    } catch (error) {
      console.error('Error fetching devices:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Register a new device
  const registerDevice = useCallback(async (deviceName: string): Promise<boolean> => {
    if (!wallet?.address) {
      console.error('No wallet connected');
      return false;
    }
    
    try {
      // Generate a device ID
      const deviceId = `device_${Math.random().toString(36).substring(2, 11)}`;
      
      // Propose a new device registration operation
      const operationId = await proposeSecurityOperation('DEVICE_REGISTRATION', {
        deviceId,
        deviceName,
        walletAddress: wallet.address,
        timestamp: Date.now()
      });
      
      // Sign the operation with the current device
      await signOperation(operationId);
      
      return true;
    } catch (error) {
      console.error('Error registering device:', error);
      return false;
    }
  }, [wallet, proposeSecurityOperation, signOperation]);
  
  // Approve a device registration request
  const approveDevice = useCallback(async (operationId: string): Promise<boolean> => {
    try {
      // Sign the operation with the current device
      await signOperation(operationId);
      
      // Check if we have enough signatures
      const signatureCount = await getOperationSignatureCount(operationId);
      
      if (signatureCount >= 2) {
        // Execute the operation if we have enough signatures
        const success = await executeOperation(operationId);
        
        if (success) {
          // Update the devices list
          const operations = JSON.parse(localStorage.getItem('security_operations') || '{}');
          const operation = operations[operationId];
          
          if (operation && operation.executed) {
            const newDevice: DeviceInfo = {
              id: operation.params.deviceId,
              name: operation.params.deviceName,
              lastActive: Date.now(),
              status: 'active',
              isCurrentDevice: false
            };
            
            const updatedDevices = [...devices, newDevice];
            setDevices(updatedDevices);
            localStorage.setItem('registered_devices', JSON.stringify(updatedDevices));
            
            // Remove the approved request from pending requests
            setPendingRequests(prev => prev.filter(req => req.id !== operationId));
          }
        }
        
        return success;
      }
      
      return true;
    } catch (error) {
      console.error('Error approving device:', error);
      return false;
    }
  }, [devices, signOperation, getOperationSignatureCount, executeOperation]);
  
  // Revoke access for a device
  const revokeDevice = useCallback(async (deviceId: string): Promise<boolean> => {
    if (!wallet?.address) {
      console.error('No wallet connected');
      return false;
    }
    
    try {
      // Propose a device revocation operation
      const operationId = await proposeSecurityOperation('DEVICE_REVOCATION', {
        deviceId,
        walletAddress: wallet.address,
        timestamp: Date.now()
      });
      
      // Sign the operation with the current device
      await signOperation(operationId);
      
      // For testing, immediately execute the revocation
      // In production, this might require multi-sig approval
      const success = await executeOperation(operationId);
      
      if (success) {
        // Update the devices list
        const updatedDevices = devices.map(device => 
          device.id === deviceId 
            ? { ...device, status: 'revoked' as const } 
            : device
        );
        
        setDevices(updatedDevices);
        localStorage.setItem('registered_devices', JSON.stringify(updatedDevices));
      }
      
      return success;
    } catch (error) {
      console.error('Error revoking device:', error);
      return false;
    }
  }, [wallet, devices, proposeSecurityOperation, signOperation, executeOperation]);
  
  // Helper to get a device ID
  const getDeviceId = (): string => {
    // In a real implementation, this would generate a unique device identifier
    // based on device characteristics and/or user authentication
    
    let deviceId = localStorage.getItem('device_id');
    
    if (!deviceId) {
      deviceId = `device_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('device_id', deviceId);
    }
    
    return deviceId;
  };
  
  // Helper to determine device name
  const getDeviceName = (): string => {
    // In a real implementation, this would detect the device type and OS
    // For development, we'll use a simple detection
    const userAgent = navigator.userAgent;
    let deviceType = 'Unknown Device';
    
    if (/iPhone/i.test(userAgent)) {
      deviceType = 'iPhone';
    } else if (/iPad/i.test(userAgent)) {
      deviceType = 'iPad';
    } else if (/Android/i.test(userAgent)) {
      deviceType = 'Android Device';
    } else if (/Mac/i.test(userAgent)) {
      deviceType = 'Mac';
    } else if (/Windows/i.test(userAgent)) {
      deviceType = 'Windows PC';
    } else if (/Linux/i.test(userAgent)) {
      deviceType = 'Linux Device';
    }
    
    return `${deviceType} (${new Date().toLocaleDateString()})`;
  };
  
  return {
    devices,
    isLoading,
    pendingRequests,
    fetchDevices,
    registerDevice,
    approveDevice,
    revokeDevice,
    getDeviceId,
    getDeviceName
  };
}