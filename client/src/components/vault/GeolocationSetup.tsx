import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, GlobeIcon, Shield } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Schema for geolocation safe zones
const safeZoneSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(0.1).max(100), // radius in kilometers
  address: z.string().optional(), // Optional human-readable address
});

// Schema for geolocation configuration
const geoConfigSchema = z.object({
  enforceGeolocation: z.boolean().default(true),
  requireAllZones: z.boolean().default(false), // If true, user must verify all zones; if false, any zone is sufficient
  safeZones: z.array(safeZoneSchema).min(1, { message: "At least one safe zone is required" }),
  verificationTimeout: z.number().min(1).max(60).default(5), // timeout in minutes
});

type SafeZone = z.infer<typeof safeZoneSchema>;
type GeoConfig = z.infer<typeof geoConfigSchema>;

interface GeolocationSetupProps {
  vaultId?: number;
  onConfigChange?: (config: GeoConfig) => void;
  className?: string;
  defaultConfig?: Partial<GeoConfig>;
}

export function GeolocationSetup({
  vaultId,
  onConfigChange,
  className,
  defaultConfig,
}: GeolocationSetupProps) {
  const { toast } = useToast();
  const [safeZones, setSafeZones] = useState<SafeZone[]>(defaultConfig?.safeZones || []);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  // Create form with default values
  const form = useForm<GeoConfig>({
    resolver: zodResolver(geoConfigSchema),
    defaultValues: {
      enforceGeolocation: defaultConfig?.enforceGeolocation ?? true,
      requireAllZones: defaultConfig?.requireAllZones ?? false,
      safeZones: defaultConfig?.safeZones || [],
      verificationTimeout: defaultConfig?.verificationTimeout || 5,
    },
  });

  // Watch form values for real-time updates
  const watchedValues = form.watch();
  
  useEffect(() => {
    if (safeZones.length > 0) {
      const currentConfig = {
        ...watchedValues,
        safeZones: safeZones,
      };
      onConfigChange?.(currentConfig);
    }
  }, [watchedValues, safeZones, onConfigChange]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
        
        toast({
          title: "Current location detected",
          description: `Lat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "Error getting location",
          description: error.message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Add new safe zone
  const addSafeZone = () => {
    const newZone: SafeZone = {
      name: `Zone ${safeZones.length + 1}`,
      latitude: currentLocation?.lat || 0,
      longitude: currentLocation?.lng || 0,
      radius: 1.0, // Default 1km radius
    };
    
    setSafeZones([...safeZones, newZone]);
  };

  // Remove safe zone
  const removeSafeZone = (index: number) => {
    if (safeZones.length <= 1) {
      toast({
        title: "Cannot remove zone",
        description: "At least one safe zone is required",
        variant: "destructive",
      });
      return;
    }
    
    const newZones = [...safeZones];
    newZones.splice(index, 1);
    setSafeZones(newZones);
  };

  // Update safe zone properties
  const updateZoneName = (index: number, name: string) => {
    const newZones = [...safeZones];
    newZones[index].name = name;
    setSafeZones(newZones);
  };

  const updateZoneLatitude = (index: number, lat: number) => {
    const newZones = [...safeZones];
    newZones[index].latitude = lat;
    setSafeZones(newZones);
  };

  const updateZoneLongitude = (index: number, lng: number) => {
    const newZones = [...safeZones];
    newZones[index].longitude = lng;
    setSafeZones(newZones);
  };

  const updateZoneRadius = (index: number, radius: number) => {
    const newZones = [...safeZones];
    newZones[index].radius = radius;
    setSafeZones(newZones);
  };

  const updateZoneAddress = (index: number, address: string) => {
    const newZones = [...safeZones];
    newZones[index].address = address;
    setSafeZones(newZones);
  };

  // Use current location for a zone
  const useCurrentLocationForZone = (index: number) => {
    if (!currentLocation) {
      toast({
        title: "No location detected",
        description: "Please use the 'Get Current Location' button first",
        variant: "destructive",
      });
      return;
    }
    
    const newZones = [...safeZones];
    newZones[index].latitude = currentLocation.lat;
    newZones[index].longitude = currentLocation.lng;
    setSafeZones(newZones);
    
    toast({
      title: "Location updated",
      description: `Updated ${newZones[index].name} to your current location`,
    });
  };

  return (
    <Card className={`${className || ''} border-[#6B00D7]/30 bg-gradient-to-br from-black/40 to-[#1A1A1A]/60 backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-white">
          <GlobeIcon className="h-5 w-5 text-[#FF5AF7]" />
          Geolocation Security
        </CardTitle>
        <CardDescription>
          Setup trusted locations for geolocation-based vault access verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
            {/* Location Detection */}
            <div className="flex items-center justify-between space-x-4 p-4 border border-[#6B00D7]/20 rounded-lg bg-[#6B00D7]/5">
              <div>
                <h3 className="text-sm font-medium mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF5AF7]" />
                  Current Location
                </h3>
                <p className="text-xs text-gray-400">
                  {currentLocation 
                    ? `Lat: ${currentLocation.lat.toFixed(6)}, Lng: ${currentLocation.lng.toFixed(6)}` 
                    : "No location detected yet"}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="border-[#FF5AF7]/50 hover:bg-[#FF5AF7]/10"
              >
                {isGettingLocation ? "Detecting..." : "Get Current Location"}
              </Button>
            </div>
            
            {/* Geolocation Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="enforceGeolocation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border border-[#6B00D7]/20 p-3 bg-[#6B00D7]/5">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#6B00D7]" />
                        Enforce Geolocation
                      </FormLabel>
                      <p className="text-xs text-gray-400">
                        Require geolocation verification for all vault actions
                      </p>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="accent-[#6B00D7] h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requireAllZones"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border border-[#6B00D7]/20 p-3 bg-[#6B00D7]/5">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#6B00D7]" />
                        Require All Zones
                      </FormLabel>
                      <p className="text-xs text-gray-400">
                        If enabled, users must verify from all zones. Otherwise, any zone is sufficient.
                      </p>
                    </div>
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="accent-[#6B00D7] h-4 w-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="verificationTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <span>Verification Timeout (minutes)</span>
                    <Badge variant="outline" className="text-xs font-normal bg-[#6B00D7]/10 border-[#6B00D7]/30">
                      {field.value} min
                    </Badge>
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    User must complete verification within this time window
                  </p>
                </FormItem>
              )}
            />
            
            <Separator className="my-4 bg-[#6B00D7]/20" />
            
            {/* Safe Zones */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#FF5AF7]" />
                  Safe Zones
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSafeZone}
                  className="gap-1 text-xs border-[#FF5AF7]/50 hover:bg-[#FF5AF7]/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Zone
                </Button>
              </div>
              
              <div className="space-y-3">
                {safeZones.map((zone, index) => (
                  <div key={index} className="rounded-md border border-[#6B00D7]/20 p-4 bg-black/20">
                    <div className="flex justify-between items-center mb-3">
                      <Input
                        value={zone.name}
                        onChange={(e) => updateZoneName(index, e.target.value)}
                        className="w-1/2 h-8 text-sm bg-black/30 border-[#6B00D7]/20"
                        placeholder="Zone Name"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => useCurrentLocationForZone(index)}
                          disabled={!currentLocation}
                          className="text-xs h-8 border-[#FF5AF7]/50 hover:bg-[#FF5AF7]/10"
                        >
                          <MapPin className="h-3 w-3 mr-1" />
                          Use Current
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSafeZone(index)}
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-700/10"
                          disabled={safeZones.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <FormLabel className="text-xs mb-1 block">Latitude</FormLabel>
                        <Input
                          type="number"
                          step="0.000001"
                          min="-90"
                          max="90"
                          value={zone.latitude}
                          onChange={(e) => updateZoneLatitude(index, parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs bg-black/30 border-[#6B00D7]/20"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs mb-1 block">Longitude</FormLabel>
                        <Input
                          type="number"
                          step="0.000001"
                          min="-180"
                          max="180"
                          value={zone.longitude}
                          onChange={(e) => updateZoneLongitude(index, parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs bg-black/30 border-[#6B00D7]/20"
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs mb-1 block">
                          Radius (km)
                          <Badge variant="outline" className="ml-2 text-xs font-normal bg-[#6B00D7]/10 border-[#6B00D7]/30">
                            {zone.radius} km
                          </Badge>
                        </FormLabel>
                        <Select
                          value={zone.radius.toString()}
                          onValueChange={(value) => updateZoneRadius(index, parseFloat(value))}
                        >
                          <SelectTrigger className="h-8 text-xs bg-black/30 border-[#6B00D7]/20">
                            <SelectValue placeholder="Select radius" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.1">100 meters</SelectItem>
                            <SelectItem value="0.5">500 meters</SelectItem>
                            <SelectItem value="1">1 kilometer</SelectItem>
                            <SelectItem value="5">5 kilometers</SelectItem>
                            <SelectItem value="10">10 kilometers</SelectItem>
                            <SelectItem value="25">25 kilometers</SelectItem>
                            <SelectItem value="50">50 kilometers</SelectItem>
                            <SelectItem value="100">100 kilometers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <FormLabel className="text-xs mb-1 block">Address (Optional)</FormLabel>
                      <Input
                        value={zone.address || ''}
                        onChange={(e) => updateZoneAddress(index, e.target.value)}
                        className="h-8 text-xs bg-black/30 border-[#6B00D7]/20"
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
