/**
 * Geo Location Verifier Component
 * 
 * This component allows users to verify their location against a vault's
 * boundary requirements to gain access to the vault content.
 */

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GeoVault } from '@shared/schema';
import { MapPin, Shield, AlertTriangle, Check } from 'lucide-react';

interface GeoLocationVerifierProps {
  vault: GeoVault;
  onVerificationSuccess: () => void;
}

interface Coordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export function GeoLocationVerifier({ vault, onVerificationSuccess }: GeoLocationVerifierProps) {
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  
  // Verification mutation
  const verifyLocationMutation = useMutation({
    mutationFn: async (location: Coordinate) => {
      const response = await apiRequest('POST', `/api/geo-vaults/${vault.id}/verify`, location);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Verification Successful',
          description: 'Your location has been verified successfully',
        });
        onVerificationSuccess();
      } else {
        toast({
          title: 'Verification Failed',
          description: data.message || 'Your location could not be verified',
          variant: 'destructive',
        });
        setVerificationAttempts(prev => prev + 1);
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Verification Error',
        description: error.message,
        variant: 'destructive',
      });
      setVerificationAttempts(prev => prev + 1);
    },
  });

  // Get and verify the current location
  const verifyCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        setCurrentAccuracy(position.coords.accuracy);
        
        // Verify the location
        verifyLocationMutation.mutate(location);
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unknown error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission denied for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get location timed out';
            break;
        }
        
        toast({
          title: 'Geolocation Error',
          description: errorMessage,
          variant: 'destructive',
        });
        
        setIsGettingLocation(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  // Format boundary information for display
  const formatBoundaryInfo = () => {
    switch (vault.boundaryType) {
      case 'circle':
        return `Circular boundary with radius of ${vault.radius}m`;
      case 'polygon':
        return `Polygon boundary with ${(vault.coordinates as any)?.length || 0} points`;
      case 'country':
        return `Country boundary (${vault.countryCode})`;
      default:
        return 'Unknown boundary type';
    }
  };

  // Calculate estimated distance from target
  const calculateDistanceDescription = () => {
    // This would normally use the result from the verification
    // For now, we'll just return a placeholder
    if (verificationAttempts === 0) {
      return 'Not yet verified';
    } else if (verifyLocationMutation.data?.success) {
      return 'Within boundary';
    } else if (verifyLocationMutation.data?.details?.distance) {
      return `Approximately ${Math.round(verifyLocationMutation.data.details.distance)}m away`;
    } else {
      return 'Outside boundary';
    }
  };

  // Calculate GPS accuracy indicator
  const getAccuracyLevel = () => {
    if (currentAccuracy === null) return 'unknown';
    
    const minAccuracy = vault.minAccuracy || 100;
    
    if (currentAccuracy <= minAccuracy / 2) return 'excellent';
    if (currentAccuracy <= minAccuracy) return 'good';
    if (currentAccuracy <= minAccuracy * 2) return 'fair';
    return 'poor';
  };

  const accuracyLevel = getAccuracyLevel();
  const accuracyColors = {
    unknown: 'bg-gray-300',
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    fair: 'bg-yellow-500',
    poor: 'bg-red-500',
  };

  const accuracyProgress = () => {
    if (currentAccuracy === null) return 0;
    
    const minAccuracy = vault.minAccuracy || 100;
    
    if (currentAccuracy <= minAccuracy) {
      // If we're within the required accuracy, map 0-minAccuracy to 50-100%
      return 100 - (currentAccuracy / minAccuracy * 50);
    } else {
      // If worse than required accuracy, map to 0-50%
      return Math.max(0, 50 - (currentAccuracy - minAccuracy) / 10);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Location Verification
        </CardTitle>
        <CardDescription>
          Verify your location to access this vault
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Vault Boundary</div>
          <div className="p-3 bg-muted rounded-md">
            {formatBoundaryInfo()}
          </div>
        </div>
        
        {vault.minAccuracy && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center justify-between">
              <span>GPS Accuracy Required</span>
              {currentAccuracy && (
                <Badge variant={accuracyLevel === 'poor' ? 'destructive' : 'outline'}>
                  Current: {Math.round(currentAccuracy)}m
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Accurate</span>
                <span>Less Accurate</span>
              </div>
              <Progress 
                value={accuracyProgress()} 
                className={`h-2 ${accuracyColors[accuracyLevel as keyof typeof accuracyColors]}`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0m</span>
                <span>{vault.minAccuracy}m (Required)</span>
                <span>{vault.minAccuracy * 2}m+</span>
              </div>
            </div>
          </div>
        )}
        
        {verificationAttempts > 0 && !verifyLocationMutation.data?.success && (
          <div className="flex items-center p-3 rounded-md bg-destructive/10 text-destructive gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <div className="text-sm">
              {verifyLocationMutation.data?.message || 'Your location could not be verified. Please try again.'}
            </div>
          </div>
        )}
        
        {verifyLocationMutation.data?.success && (
          <div className="flex items-center p-3 rounded-md bg-green-500/10 text-green-600 gap-2">
            <Check className="h-4 w-4 flex-shrink-0" />
            <div className="text-sm">
              Location verified successfully! You can now access the vault.
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-sm font-medium">Distance from Target</div>
            <div className="text-sm text-muted-foreground">
              {calculateDistanceDescription()}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium">Verification Attempts</div>
            <div className="text-sm text-muted-foreground">
              {verificationAttempts} attempts made
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={verifyCurrentLocation}
          disabled={isGettingLocation || verifyLocationMutation.isPending || verifyLocationMutation.data?.success}
          className="w-full"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {isGettingLocation || verifyLocationMutation.isPending 
            ? 'Verifying Location...' 
            : verifyLocationMutation.data?.success 
              ? 'Location Verified' 
              : 'Verify My Location'}
        </Button>
      </CardFooter>
    </Card>
  );
}