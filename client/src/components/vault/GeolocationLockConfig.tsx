import React, { useState, useEffect } from 'react';
import { MapPin, Lock, Globe, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GeolocationData {
  latitude: number;
  longitude: number;
  radius: number; // in km
  enabled: boolean;
  requiredOnCreation: boolean;
  requiredOnAccess: boolean;
  lockLevel: 'strict' | 'moderate' | 'flexible';
}

interface GeolocationLockConfigProps {
  onChange: (data: GeolocationData) => void;
  className?: string;
  initialValue?: Partial<GeolocationData>;
}

export function GeolocationLockConfig({
  onChange,
  className,
  initialValue
}: GeolocationLockConfigProps) {
  const [geoData, setGeoData] = useState<GeolocationData>({
    latitude: initialValue?.latitude || 0,
    longitude: initialValue?.longitude || 0,
    radius: initialValue?.radius || 10,
    enabled: initialValue?.enabled || false,
    requiredOnCreation: initialValue?.requiredOnCreation || true,
    requiredOnAccess: initialValue?.requiredOnAccess || true,
    lockLevel: initialValue?.lockLevel || 'moderate'
  });
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Update parent component when geoData changes
  useEffect(() => {
    onChange(geoData);
  }, [geoData, onChange]);
  
  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setErrorMessage('Geolocation is not supported by your browser');
      return;
    }
    
    setLocationStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        
        setGeoData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        
        setLocationStatus('success');
      },
      (error) => {
        setLocationStatus('error');
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage('User denied the request for geolocation');
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setErrorMessage('The request to get user location timed out');
            break;
          default:
            setErrorMessage('An unknown error occurred');
            break;
        }
      }
    );
  };
  
  // Toggle geolocation lock
  const toggleGeolocation = (enabled: boolean) => {
    setGeoData(prev => ({ ...prev, enabled }));
    
    // If enabling and we don't have a location yet, try to get it
    if (enabled && !currentLocation) {
      getCurrentLocation();
    }
  };
  
  // Handle radius change
  const handleRadiusChange = (value: number[]) => {
    setGeoData(prev => ({ ...prev, radius: value[0] }));
  };
  
  // Toggle required flags
  const toggleRequiredOnCreation = (enabled: boolean) => {
    setGeoData(prev => ({ ...prev, requiredOnCreation: enabled }));
  };
  
  const toggleRequiredOnAccess = (enabled: boolean) => {
    setGeoData(prev => ({ ...prev, requiredOnAccess: enabled }));
  };
  
  // Set lock level
  const setLockLevel = (level: 'strict' | 'moderate' | 'flexible') => {
    setGeoData(prev => ({ ...prev, lockLevel: level }));
  };
  
  return (
    <div className={className}>
      <Card className="border-[#6B00D7]/20 bg-[#121212]/60">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-[#6B00D7] mt-0.5" />
            <div>
              <h3 className="text-base font-semibold mb-1">Geolocation Protection</h3>
              <p className="text-sm text-gray-400">
                Add an additional layer of security by restricting vault access based on physical location.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="geolocation-toggle" className="font-medium">
                Enable Geolocation Lock
              </Label>
              {geoData.enabled && (
                <Badge variant="outline" className="bg-[#6B00D7]/10 text-[#6B00D7] border-[#6B00D7]/20">
                  <Lock className="h-3 w-3 mr-1" /> Active
                </Badge>
              )}
            </div>
            <Switch
              id="geolocation-toggle"
              checked={geoData.enabled}
              onCheckedChange={toggleGeolocation}
              className="data-[state=checked]:bg-[#6B00D7]"
            />
          </div>
          
          {geoData.enabled && (
            <div className="space-y-4">
              <Tabs defaultValue="location" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-[#121212]">
                  <TabsTrigger value="location" className="data-[state=active]:bg-[#6B00D7]/30">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="data-[state=active]:bg-[#6B00D7]/30">
                    <Globe className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="location" className="mt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-gray-400">Set Location</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={locationStatus === 'loading'}
                      className="h-8 text-xs border-[#6B00D7]/30 text-[#6B00D7]"
                    >
                      {locationStatus === 'loading' ? 'Getting location...' : 'Use Current Location'}
                    </Button>
                  </div>
                  
                  {locationStatus === 'error' && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Location Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude" className="text-xs text-gray-500 mb-1 block">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={geoData.latitude || ''}
                        onChange={(e) => setGeoData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                        placeholder="Latitude"
                        className="bg-black/20 border-[#6B00D7]/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude" className="text-xs text-gray-500 mb-1 block">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={geoData.longitude || ''}
                        onChange={(e) => setGeoData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                        placeholder="Longitude"
                        className="bg-black/20 border-[#6B00D7]/20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="radius" className="text-xs text-gray-500 mb-1 block">
                        Access Radius
                      </Label>
                      <span className="text-xs text-gray-400">{geoData.radius} km</span>
                    </div>
                    <Slider
                      id="radius"
                      value={[geoData.radius]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={handleRadiusChange}
                      className="[&>[role=slider]]:bg-[#6B00D7]"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-600">Strict (1km)</span>
                      <span className="text-xs text-gray-600">Flexible (100km)</span>
                    </div>
                  </div>
                  
                  {currentLocation && (
                    <div className="mt-3 p-2 rounded bg-[#6B00D7]/10 border border-[#6B00D7]/20">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-[#6B00D7] mr-2" />
                        <span className="text-xs font-medium">Location set successfully</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Vault access will be restricted to within {geoData.radius}km of the set coordinates.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="mt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="required-creation" className="text-sm">
                        Required during vault creation
                      </Label>
                      <Switch
                        id="required-creation"
                        checked={geoData.requiredOnCreation}
                        onCheckedChange={toggleRequiredOnCreation}
                        className="data-[state=checked]:bg-[#6B00D7]"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="required-access" className="text-sm">
                        Required for accessing the vault
                      </Label>
                      <Switch
                        id="required-access"
                        checked={geoData.requiredOnAccess}
                        onCheckedChange={toggleRequiredOnAccess}
                        className="data-[state=checked]:bg-[#6B00D7]"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Label className="text-xs text-gray-500 mb-2 block">Security Level</Label>
                    <Select
                      value={geoData.lockLevel}
                      onValueChange={(value: 'strict' | 'moderate' | 'flexible') => setLockLevel(value)}
                    >
                      <SelectTrigger className="bg-black/20 border-[#6B00D7]/20">
                        <SelectValue placeholder="Select security level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-red-500/20 text-red-500 border-0">
                              Strict
                            </Badge>
                            <span>Precise location match required</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="moderate">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-yellow-500/20 text-yellow-500 border-0">
                              Moderate
                            </Badge>
                            <span>Some location variance allowed</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="flexible">
                          <div className="flex items-center">
                            <Badge className="mr-2 bg-green-500/20 text-green-500 border-0">
                              Flexible
                            </Badge>
                            <span>Location verification with large radius</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Alert className="mt-3 bg-blue-500/10 border-blue-500/20">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-xs text-blue-400">
                      Adding geolocation security provides an extra layer of protection but may restrict access if your location changes significantly.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
