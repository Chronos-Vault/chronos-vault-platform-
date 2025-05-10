/**
 * Create Geolocation Vault Form
 * 
 * Form component for creating a new geolocation-based vault with security settings
 * including boundary types (circle, polygon, country), access time windows, and 
 * additional security features.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { MapPin, Loader2, AlertCircle, Info, Clock, Shield } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Vault name must be at least 3 characters' }).max(100),
  description: z.string().optional(),
  boundaryType: z.enum(['circle', 'polygon', 'country'], {
    required_error: 'Please select a boundary type',
  }),
  // For circle boundary
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius: z.number().min(10).max(10000).optional(),
  // For country boundary
  countryCode: z.string().length(2).optional(),
  // Additional settings
  minAccuracy: z.number().min(10).max(1000).optional(),
  requiresRealTimeVerification: z.boolean().default(false),
  multiFactorUnlock: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGeoVaultFormProps {
  onSuccess: (vaultId: string) => void;
}

export function CreateGeoVaultForm({ onSuccess }: CreateGeoVaultFormProps) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      boundaryType: 'circle',
      radius: 100, // Default radius in meters
      requiresRealTimeVerification: false,
      multiFactorUnlock: false,
    },
  });

  // Watch selected boundary type to conditionally render form fields
  const boundaryType = form.watch('boundaryType');

  // Mutation for creating a new vault
  const createVaultMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Transform form data into API request format
      const apiData: any = {
        name: data.name,
        description: data.description || '',
        boundaryType: data.boundaryType,
        coordinates: [],
        minAccuracy: data.minAccuracy,
        requiresRealTimeVerification: data.requiresRealTimeVerification,
        multiFactorUnlock: data.multiFactorUnlock,
      };

      // Add boundary-specific data
      if (data.boundaryType === 'circle' && userLocation) {
        apiData.coordinates = [{
          latitude: data.latitude || userLocation.latitude,
          longitude: data.longitude || userLocation.longitude,
        }];
        apiData.radius = data.radius;
      } else if (data.boundaryType === 'country') {
        apiData.countryCode = data.countryCode;
      } else if (data.boundaryType === 'polygon') {
        // In a real implementation, we'd have a polygon editor component
        // For now, we'll use a simple square around the current location
        if (userLocation) {
          const offset = 0.001; // Approximately 100 meters at the equator
          apiData.coordinates = [
            { latitude: userLocation.latitude - offset, longitude: userLocation.longitude - offset },
            { latitude: userLocation.latitude - offset, longitude: userLocation.longitude + offset },
            { latitude: userLocation.latitude + offset, longitude: userLocation.longitude + offset },
            { latitude: userLocation.latitude + offset, longitude: userLocation.longitude - offset },
          ];
        }
      }

      // Send the request to the API
      const response = await apiRequest('POST', '/api/geo-vaults/create', apiData);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create geolocation vault');
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      onSuccess(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error Creating Vault',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        // Update form fields with current location
        form.setValue('latitude', latitude);
        form.setValue('longitude', longitude);
        
        setIsLoadingLocation(false);
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
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Get location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    // Validate location-specific fields
    if (data.boundaryType === 'circle') {
      if (!data.latitude || !data.longitude) {
        toast({
          title: 'Missing Location',
          description: 'Please use your current location or enter coordinates manually',
          variant: 'destructive',
        });
        return;
      }
      if (!data.radius) {
        toast({
          title: 'Missing Radius',
          description: 'Please specify a radius for the circular boundary',
          variant: 'destructive',
        });
        return;
      }
    } else if (data.boundaryType === 'country' && !data.countryCode) {
      toast({
        title: 'Missing Country',
        description: 'Please select a country for the country boundary',
        variant: 'destructive',
      });
      return;
    }

    createVaultMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Create Geolocation Vault
        </CardTitle>
        <CardDescription>
          Create a vault that requires you to be in a specific location to access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      <Input placeholder="Downtown Office Vault" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for your geolocation vault
                    </FormDescription>
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
                        placeholder="Access only when I'm at the office"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional details about this vault's purpose
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            {/* Boundary Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location Boundary</h3>
              
              <FormField
                control={form.control}
                name="boundaryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boundary Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a boundary type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="circle">Circular Area</SelectItem>
                        <SelectItem value="polygon">Custom Shape</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define the geographic area where the vault can be accessed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {boundaryType === 'circle' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Center Location</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Use My Current Location
                        </>
                      )}
                    </Button>
                  </div>

                  {locationError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Location Error</AlertTitle>
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="37.7749"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.000001"
                              placeholder="-122.4194"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radius (meters): {field.value || 100}</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value || 100]}
                            min={10}
                            max={1000}
                            step={10}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          The distance from the center point where the vault can be accessed
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

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
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="DE">Germany</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="BR">Brazil</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The vault can only be accessed while in this country
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {boundaryType === 'polygon' && (
                <div className="p-4 border border-dashed rounded-md">
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">
                      Polygon boundary editor is coming soon.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      For now, we'll create a square around your current location.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Advanced Settings */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced-settings">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Advanced Security Settings
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="minAccuracy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum GPS Accuracy (meters): {field.value || 'None'}</FormLabel>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value || 100]}
                            min={10}
                            max={1000}
                            step={10}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          Require a minimum GPS accuracy level for verification (lower is more precise)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requiresRealTimeVerification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Real-Time Verification
                          </FormLabel>
                          <FormDescription>
                            Require continuous location verification while the vault is open
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Multi-Factor Unlock
                          </FormLabel>
                          <FormDescription>
                            Require additional authentication beyond location
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle>Important Security Notice</AlertTitle>
              <AlertDescription>
                Geolocation vaults provide an additional layer of security by restricting access based on your physical location. For maximum security, consider combining with multi-factor authentication.
              </AlertDescription>
            </Alert>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-2">
              <Button type="reset" variant="outline">
                Reset Form
              </Button>
              <Button 
                type="submit"
                disabled={createVaultMutation.isPending}
              >
                {createVaultMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Vault...
                  </>
                ) : (
                  'Create Geolocation Vault'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}