/**
 * GeoLocation Verifier Component
 * 
 * Component for verifying a user's location against geolocation vault requirements.
 * Handles location collection, accuracy verification, and boundary checking.
 */

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  RefreshCw,
  Shield,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeoVault {
  id: string;
  name: string;
  boundaryType: string;
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

export function GeoLocationVerifier() {
  const [selectedVaultId, setSelectedVaultId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  // Fetch user's vaults
  const { data: vaults, isLoading, error } = useQuery<GeoVault[]>({
    queryKey: ['/api/geo-vaults'],
  });

  // Verification mutation
  const verifyLocationMutation = useMutation({
    mutationFn: async (data: { vaultId: string; location: { latitude: number; longitude: number; accuracy: number; timestamp: number } }) => {
      const response = await apiRequest('POST', '/api/geo-vaults/verify', data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setVerificationResult(data);
      
      if (data.success) {
        toast({
          title: 'Verification Successful',
          description: data.message,
          variant: 'default',
        });
      } else {
        toast({
          title: 'Verification Failed',
          description: data.message,
          variant: 'destructive',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Verification Error',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsVerifying(false);
    },
  });

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsVerifying(true);
    setLocationError(null);
    setVerificationResult(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        
        if (selectedVaultId) {
          verifyLocationMutation.mutate({
            vaultId: selectedVaultId,
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            },
          });
        } else {
          setIsVerifying(false);
          toast({
            title: 'Vault Not Selected',
            description: 'Please select a vault to verify your location',
            variant: 'destructive',
          });
        }
      },
      (error) => {
        let errorMessage = 'Failed to get your current location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
        setIsVerifying(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 
      }
    );
  };

  // Update location accuracy display
  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy < 10) return { label: 'Excellent', color: 'bg-green-500', percentage: 100 };
    if (accuracy < 30) return { label: 'Good', color: 'bg-green-400', percentage: 80 };
    if (accuracy < 100) return { label: 'Moderate', color: 'bg-yellow-400', percentage: 60 };
    if (accuracy < 500) return { label: 'Poor', color: 'bg-orange-400', percentage: 40 };
    return { label: 'Very Poor', color: 'bg-red-500', percentage: 20 };
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Verify Location Access
        </CardTitle>
        <CardDescription>
          Verify your current location against geolocation vault requirements
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Vault Selection */}
        <div>
          <h3 className="text-sm font-medium mb-2">Select a Vault to Verify</h3>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading vaults...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load vaults. Please try again later.
              </AlertDescription>
            </Alert>
          ) : vaults && vaults.length > 0 ? (
            <Select value={selectedVaultId} onValueChange={setSelectedVaultId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a geolocation vault" />
              </SelectTrigger>
              <SelectContent>
                {vaults.map(vault => (
                  <SelectItem key={vault.id} value={vault.id} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{vault.name}</span>
                      <Badge variant="outline" className="ml-2 capitalize">
                        {vault.boundaryType}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Alert variant="default" className="bg-muted">
              <AlertTitle>No Vaults Found</AlertTitle>
              <AlertDescription>
                You don't have any geolocation vaults. Create one to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <Separator />
        
        {/* Current Location Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Current Location Status
          </h3>
          
          {locationError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Location Error</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          ) : location ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Latitude:</span>{' '}
                  <span className="text-muted-foreground">{location.coords.latitude.toFixed(6)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Longitude:</span>{' '}
                  <span className="text-muted-foreground">{location.coords.longitude.toFixed(6)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Timestamp:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(location.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Accuracy:</span>{' '}
                  <span className="text-muted-foreground">{location.coords.accuracy.toFixed(1)} meters</span>
                </div>
                
                {location.coords.accuracy && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Accuracy Level</span>
                      <span className="font-medium">{getAccuracyLevel(location.coords.accuracy).label}</span>
                    </div>
                    <Progress 
                      value={getAccuracyLevel(location.coords.accuracy).percentage} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
              <MapPin className="h-8 w-8 mb-2 opacity-50" />
              <p>No location data available</p>
              <p className="text-sm">Click the verify button to check your current location</p>
            </div>
          )}
        </div>
        
        {/* Verification Result */}
        {verificationResult && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Verification Result
              </h3>
              
              <Alert variant={verificationResult.success ? "default" : "destructive"} className={verificationResult.success ? "bg-green-50 border-green-200" : undefined}>
                {verificationResult.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {verificationResult.success ? 'Access Granted' : 'Access Denied'}
                </AlertTitle>
                <AlertDescription>
                  {verificationResult.message}
                  
                  {verificationResult.details && (
                    <div className="mt-2 text-xs space-y-1">
                      {verificationResult.details.distanceFromBoundary !== undefined && (
                        <div>Distance from boundary: {verificationResult.details.distanceFromBoundary.toFixed(1)} meters</div>
                      )}
                      {verificationResult.details.accuracy !== undefined && (
                        <div>Your location accuracy: {verificationResult.details.accuracy.toFixed(1)} meters</div>
                      )}
                      {verificationResult.details.requiredAccuracy !== undefined && (
                        <div>Required accuracy: {verificationResult.details.requiredAccuracy} meters</div>
                      )}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {location ? `Last updated: ${new Date(location.timestamp).toLocaleTimeString()}` : 'No location data'}
        </div>
        
        <Button 
          onClick={getCurrentLocation}
          disabled={isVerifying || !vaults || vaults.length === 0}
          className="gap-2"
        >
          {isVerifying ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : verificationResult ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Verify Again
            </>
          ) : (
            <>
              {verificationResult === null ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              Verify Location
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}