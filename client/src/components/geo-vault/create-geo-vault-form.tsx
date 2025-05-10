/**
 * Create Geo Vault Form
 * 
 * Form component for creating location-based vaults with different boundary types
 * (circle, polygon, country).
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, MapPin, Globe, Circle, SquareEqual, Info } from 'lucide-react';

// Define the form schema
const geoVaultFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }).max(100),
  description: z.string().max(500).optional(),
  boundaryType: z.enum(['circle', 'polygon', 'country']),
  radius: z.number().min(10).max(10000).optional(),
  coordinates: z.any().optional(), // This will be processed depending on boundaryType
  countryCode: z.string().optional(),
  minAccuracy: z.number().min(5).max(1000).optional(),
  requiresRealTimeVerification: z.boolean().default(false),
  multiFactorUnlock: z.boolean().default(false),
});

// Form values type
type GeoVaultFormValues = z.infer<typeof geoVaultFormSchema>;

// Coordinate type
interface Coordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

// Country list for selection
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'IN', name: 'India' },
  { code: 'ZA', name: 'South Africa' },
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

export function CreateGeoVaultForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentCoordinates, setCurrentCoordinates] = useState<Coordinate | null>(null);
  const [polygonPoints, setPolygonPoints] = useState<Coordinate[]>([]);
  
  // Initialize the form
  const form = useForm<GeoVaultFormValues>({
    resolver: zodResolver(geoVaultFormSchema),
    defaultValues: {
      name: '',
      description: '',
      boundaryType: 'circle',
      radius: 100,
      minAccuracy: 50,
      requiresRealTimeVerification: false,
      multiFactorUnlock: false,
    },
  });
  
  // Extract the currently selected boundary type
  const boundaryType = form.watch('boundaryType');
  
  // Mutation to create a new vault
  const createVaultMutation = useMutation({
    mutationFn: async (values: GeoVaultFormValues) => {
      const response = await apiRequest('POST', '/api/geo-vaults', values);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vault');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Vault Created',
        description: 'Your geolocation vault has been created successfully',
      });
      
      // Invalidate queries and navigate to the vault detail page
      queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
      navigate(`/geo-vaults/${data.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Get current location for setting up boundaries
  const getCurrentLocation = () => {
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
        
        setCurrentCoordinates(location);
        
        // If creating a circle, use current location as the center
        if (boundaryType === 'circle') {
          form.setValue('coordinates', [location]);
        }
        
        // If creating a polygon, add this point to the polygon
        if (boundaryType === 'polygon') {
          setPolygonPoints(prev => [...prev, location]);
          form.setValue('coordinates', [...polygonPoints, location]);
        }
        
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
  
  // Handle form submission
  const onSubmit = (values: GeoVaultFormValues) => {
    // Prepare form data based on boundary type
    let formData = { ...values };
    
    switch (values.boundaryType) {
      case 'circle':
        if (!currentCoordinates) {
          toast({
            title: 'Error',
            description: 'Please set a location for your circular boundary',
            variant: 'destructive',
          });
          return;
        }
        formData.coordinates = [currentCoordinates];
        break;
        
      case 'polygon':
        if (polygonPoints.length < 3) {
          toast({
            title: 'Error',
            description: 'A polygon boundary requires at least 3 points',
            variant: 'destructive',
          });
          return;
        }
        formData.coordinates = polygonPoints;
        break;
        
      case 'country':
        if (!values.countryCode) {
          toast({
            title: 'Error',
            description: 'Please select a country for your boundary',
            variant: 'destructive',
          });
          return;
        }
        // Country code is already set
        break;
    }
    
    createVaultMutation.mutate(formData);
  };
  
  // Reset polygon points
  const resetPolygon = () => {
    setPolygonPoints([]);
    form.setValue('coordinates', []);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Create Geolocation Vault
        </CardTitle>
        <CardDescription>
          Define a geographic boundary where your vault can be accessed
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vault Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Geolocation Vault" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this vault..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Boundary Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Boundary Type</h3>
              
              <FormField
                control={form.control}
                name="boundaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <FormItem className="border rounded-lg p-4 space-y-2">
                          <FormControl>
                            <RadioGroupItem value="circle" className="sr-only" />
                          </FormControl>
                          <div className={`flex flex-col items-center gap-2 cursor-pointer ${field.value === 'circle' ? 'text-primary' : ''}`}>
                            <Circle className="h-8 w-8" />
                            <div className="text-center">
                              <FormLabel className="text-base cursor-pointer">Circle</FormLabel>
                              <FormDescription>Define a circular area with a specific radius</FormDescription>
                            </div>
                          </div>
                        </FormItem>
                        
                        <FormItem className="border rounded-lg p-4 space-y-2">
                          <FormControl>
                            <RadioGroupItem value="polygon" className="sr-only" />
                          </FormControl>
                          <div className={`flex flex-col items-center gap-2 cursor-pointer ${field.value === 'polygon' ? 'text-primary' : ''}`}>
                            <SquareEqual className="h-8 w-8" />
                            <div className="text-center">
                              <FormLabel className="text-base cursor-pointer">Polygon</FormLabel>
                              <FormDescription>Create a custom shape with multiple points</FormDescription>
                            </div>
                          </div>
                        </FormItem>
                        
                        <FormItem className="border rounded-lg p-4 space-y-2">
                          <FormControl>
                            <RadioGroupItem value="country" className="sr-only" />
                          </FormControl>
                          <div className={`flex flex-col items-center gap-2 cursor-pointer ${field.value === 'country' ? 'text-primary' : ''}`}>
                            <Globe className="h-8 w-8" />
                            <div className="text-center">
                              <FormLabel className="text-base cursor-pointer">Country</FormLabel>
                              <FormDescription>Use an entire country as the boundary</FormDescription>
                            </div>
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Boundary Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Boundary Configuration</h3>
              
              {/* Circle Configuration */}
              {boundaryType === 'circle' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radius (meters)</FormLabel>
                        <div className="space-y-2">
                          <FormControl>
                            <Slider
                              min={10}
                              max={10000}
                              step={10}
                              defaultValue={[field.value || 100]}
                              onValueChange={(values) => field.onChange(values[0])}
                            />
                          </FormControl>
                          <div className="flex justify-between">
                            <span className="text-xs text-muted-foreground">10m</span>
                            <span className="text-sm font-medium">{field.value || 100}m</span>
                            <span className="text-xs text-muted-foreground">10km</span>
                          </div>
                        </div>
                        <FormDescription>
                          The distance from the center point where the vault can be accessed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Center Location</FormLabel>
                    {currentCoordinates ? (
                      <div className="p-3 border rounded-md bg-muted/40 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-sm font-medium">Latitude</div>
                          <div className="text-sm">{currentCoordinates.latitude.toFixed(6)}</div>
                          
                          <div className="text-sm font-medium">Longitude</div>
                          <div className="text-sm">{currentCoordinates.longitude.toFixed(6)}</div>
                          
                          <div className="text-sm font-medium">Accuracy</div>
                          <div className="text-sm">{currentCoordinates.accuracy ? `${Math.round(currentCoordinates.accuracy)}m` : 'Unknown'}</div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                        >
                          {isGettingLocation ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 mr-2" />
                              Update Location
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="w-full"
                      >
                        {isGettingLocation ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Getting Location...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            Get Current Location
                          </>
                        )}
                      </Button>
                    )}
                    <FormDescription>
                      This is the central point of your circular boundary
                    </FormDescription>
                  </div>
                </div>
              )}
              
              {/* Polygon Configuration */}
              {boundaryType === 'polygon' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Polygon Points</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={resetPolygon}
                        disabled={polygonPoints.length === 0 || isGettingLocation}
                      >
                        Reset Points
                      </Button>
                    </div>
                    
                    {polygonPoints.length > 0 ? (
                      <div className="p-3 border rounded-md bg-muted/40 space-y-2">
                        <div className="text-sm">
                          {polygonPoints.length} point{polygonPoints.length !== 1 ? 's' : ''} defined
                        </div>
                        
                        <div className="max-h-40 overflow-y-auto">
                          {polygonPoints.map((point, index) => (
                            <div key={index} className="text-sm p-2 border-b last:border-0">
                              Point {index + 1}: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                        >
                          {isGettingLocation ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Adding Point...
                            </>
                          ) : (
                            <>
                              <MapPin className="h-4 w-4 mr-2" />
                              Add Current Location as Point
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="w-full"
                      >
                        {isGettingLocation ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Adding Point...
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 mr-2" />
                            Add Current Location as Point
                          </>
                        )}
                      </Button>
                    )}
                    <FormDescription>
                      Add multiple points to define a polygon boundary. A minimum of 3 points is required.
                    </FormDescription>
                  </div>
                </div>
              )}
              
              {/* Country Configuration */}
              {boundaryType === 'country' && (
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The vault will be accessible from anywhere within the selected country
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Advanced Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              
              <FormField
                control={form.control}
                name="minAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-1">
                        Minimum GPS Accuracy (meters)
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </div>
                    </FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <Slider
                          min={5}
                          max={1000}
                          step={5}
                          defaultValue={[field.value || 50]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">5m (High)</span>
                        <span className="text-sm font-medium">{field.value || 50}m</span>
                        <span className="text-xs text-muted-foreground">1000m (Low)</span>
                      </div>
                    </div>
                    <FormDescription>
                      The required GPS accuracy to access the vault. Lower values mean higher precision but may be harder to achieve.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requiresRealTimeVerification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Real-Time Verification</FormLabel>
                      <FormDescription>
                        Require continuous location verification while accessing the vault
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="multiFactorUnlock"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Multi-Factor Unlock</FormLabel>
                      <FormDescription>
                        Require additional authentication factors along with location verification
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/geo-vaults')}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              disabled={createVaultMutation.isPending}
            >
              {createVaultMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Vault...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Create Vault
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}