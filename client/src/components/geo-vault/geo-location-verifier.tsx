import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface GeoLocationVerifierProps {
  vaultId: number;
  onVerificationResult?: (success: boolean, message: string) => void;
}

interface VerificationResult {
  success: boolean;
  message: string;
  details?: {
    distance?: number;
    accuracy?: number;
    boundaryType?: string;
  };
}

const GeoLocationVerifier: React.FC<GeoLocationVerifierProps> = ({ vaultId, onVerificationResult }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  const handleVerifyLocation = () => {
    setIsVerifying(true);
    setLocationError(null);
    setVerificationResult(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsVerifying(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setCurrentLocation(position);
        try {
          const response = await fetch(`/api/geo-vaults/${vaultId}/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            }),
          });

          if (!response.ok) {
            throw new Error('Error verifying location');
          }

          const result = await response.json();
          setVerificationResult(result);
          if (onVerificationResult) {
            onVerificationResult(result.success, result.message);
          }
        } catch (error) {
          setLocationError(error instanceof Error ? error.message : 'Unknown error verifying location');
        } finally {
          setIsVerifying(false);
        }
      },
      (error) => {
        let errorMessage = 'Unknown location error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access to verify your position.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again in a different area.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
        setLocationError(errorMessage);
        setIsVerifying(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Current location info */}
      {currentLocation && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Current Location</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>Latitude: {currentLocation.coords.latitude.toFixed(6)}</div>
            <div>Longitude: {currentLocation.coords.longitude.toFixed(6)}</div>
            <div>Accuracy: {Math.round(currentLocation.coords.accuracy)} meters</div>
            <div>Timestamp: {new Date(currentLocation.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Verification result */}
      {verificationResult && (
        <Alert variant={verificationResult.success ? "default" : "destructive"} className="mt-4">
          {verificationResult.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {verificationResult.success ? 'Verification Successful' : 'Verification Failed'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p>{verificationResult.message}</p>
            
            {verificationResult.details && (
              <div className="mt-2 space-y-1 text-xs">
                {verificationResult.details.distance !== undefined && (
                  <div>Distance: {verificationResult.details.distance} meters</div>
                )}
                {verificationResult.details.accuracy !== undefined && (
                  <div>Accuracy: {verificationResult.details.accuracy} meters</div>
                )}
                {verificationResult.details.boundaryType && (
                  <div>Boundary Type: {verificationResult.details.boundaryType}</div>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Location error */}
      {locationError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Error</AlertTitle>
          <AlertDescription>{locationError}</AlertDescription>
        </Alert>
      )}

      {/* Guidance */}
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold leading-none tracking-tight">Location Verification</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Click the button below to verify your current physical location against this vault's geographical boundaries.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <MapPin className="mr-1 h-3 w-3" /> Geolocation Required
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Info className="mr-1 h-3 w-3" /> High Accuracy Mode
          </Badge>
        </div>
      </div>

      {/* Verification button */}
      <Button 
        onClick={handleVerifyLocation} 
        disabled={isVerifying}
        className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white"
      >
        {isVerifying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying Location...
          </>
        ) : (
          <>
            <MapPin className="mr-2 h-4 w-4" />
            Verify My Location
          </>
        )}
      </Button>

      {/* Progress indicator */}
      {isVerifying && (
        <div className="space-y-2">
          <Progress value={45} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Acquiring precise location...</p>
        </div>
      )}
    </div>
  );
};

export default GeoLocationVerifier;