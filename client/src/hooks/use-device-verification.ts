import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

/**
 * Hook for managing device verification through TON blockchain
 */
export function useDeviceVerification() {
  const queryClient = useQueryClient();
  
  // Get all devices for a user
  const getUserDevices = (userId: number) => {
    return useQuery({
      queryKey: ['/api/device-verification/user', userId],
      enabled: !!userId,
    });
  };
  
  // Get a specific device by ID
  const getDeviceDetails = (deviceId: number) => {
    return useQuery({
      queryKey: ['/api/device-verification', deviceId],
      enabled: !!deviceId,
    });
  };
  
  // Register a new device with blockchain verification
  const registerDevice = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      userId: number;
      contractAddress?: string;
      securityLevel?: number;
      geolocationEnabled?: boolean;
      multiSigEnabled?: boolean;
      recoveryEnabled?: boolean;
    }) => {
      return apiRequest('/api/device-verification/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification/user'] });
    },
  });
  
  // Verify a device using TON blockchain
  const verifyDevice = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      contractAddress: string;
      userId: number;
    }) => {
      return apiRequest('/api/device-verification/verify', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });
  
  // Revoke a device
  const revokeDevice = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      userId: number;
    }) => {
      return apiRequest('/api/device-verification/revoke', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification/user'] });
    },
  });
  
  // Set up multi-signature verification for a device
  const setupMultiSig = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      userId: number;
      signerAddresses: string[];
      threshold: number;
    }) => {
      return apiRequest('/api/device-verification/setup-multisig', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification', variables.deviceId] });
    },
  });
  
  // Recover device using multi-signature verification
  const recoverWithMultiSig = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      userId: number;
      signatures: { address: string; signature: string }[];
    }) => {
      return apiRequest('/api/device-verification/recover-multisig', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification', variables.deviceId] });
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification/user'] });
    },
  });
  
  // Set up geolocation restrictions for a device
  const setupGeolocationRestrictions = useMutation({
    mutationFn: async (data: {
      deviceId: string;
      userId: number;
      restrictions: {
        type: 'circle' | 'polygon' | 'country';
        coordinates?: [number, number][];
        radius?: number;
        countryCode?: string;
      };
    }) => {
      return apiRequest('/api/device-verification/setup-geolocation', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/device-verification', variables.deviceId] });
    },
  });
  
  return {
    getUserDevices,
    getDeviceDetails,
    registerDevice,
    verifyDevice,
    revokeDevice,
    setupMultiSig,
    recoverWithMultiSig,
    setupGeolocationRestrictions,
  };
}