import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { insertGeoVaultSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Info, Map, Target, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Extended form schema for the frontend with validations
const formSchema = insertGeoVaultSchema.extend({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }).max(100, {
    message: "Name cannot be longer than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description cannot be longer than 500 characters.",
  }).optional(),
  boundaryType: z.enum(["circle", "polygon", "country"], {
    required_error: "Please select a boundary type.",
  }),
  radius: z.number().min(10, {
    message: "Radius must be at least 10 meters.",
  }).max(10000, {
    message: "Radius cannot be larger than 10,000 meters.",
  }).optional(),
  countryCode: z.string().max(2, {
    message: "Country code must be 2 characters.",
  }).optional(),
  minAccuracy: z.number().min(5, {
    message: "Minimum accuracy must be at least 5 meters.",
  }).max(1000, {
    message: "Minimum accuracy cannot be larger than 1,000 meters.",
  }).optional(),
  requiresRealTimeVerification: z.boolean().default(false),
  multiFactorUnlock: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

interface CreateGeoVaultFormProps {
  onSuccess?: () => void;
}

const CreateGeoVaultForm: React.FC<CreateGeoVaultFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [activeTab, setActiveTab] = useState<string>('circle');
  const { toast } = useToast();

  const defaultValues: Partial<FormValues> = {
    name: '',
    description: '',
    boundaryType: 'circle',
    radius: 100,
    countryCode: '',
    minAccuracy: 50,
    requiresRealTimeVerification: false,
    multiFactorUnlock: false,
    coordinates: []
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watchBoundaryType = form.watch('boundaryType');

  React.useEffect(() => {
    setActiveTab(watchBoundaryType);
  }, [watchBoundaryType]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Error',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position);

        // Update form with current location
        const updatedCoordinates = [{
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        }];

        form.setValue('coordinates', updatedCoordinates);
        
        toast({
          title: 'Location Updated',
          description: 'Current location has been set as the vault center',
        });
      },
      (error) => {
        let errorMessage = 'Unknown location error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please allow location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        toast({
          title: 'Location Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      // Validate coordinates exist
      if (!values.coordinates || values.coordinates.length === 0) {
        setFormError('Please set your current location to define the vault boundary');
        setIsSubmitting(false);
        return;
      }

      // Ensure polygon has at least 3 points (not implemented in this version)

      // Create payload based on boundary type
      const payload = {
        ...values,
        coordinates: values.coordinates,
      };

      // Remove unnecessary fields based on boundary type
      if (values.boundaryType !== 'circle') {
        delete payload.radius;
      }

      if (values.boundaryType !== 'country') {
        delete payload.countryCode;
      }

      const response = await apiRequest('POST', '/api/geo-vaults', payload);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create vault');
      }
      
      toast({
        title: 'Success',
        description: 'Geolocation vault created successfully',
      });
      
      // Reset form
      form.reset(defaultValues);
      setCurrentLocation(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create vault',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {formError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vault Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Home Vault" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give a descriptive name to your geolocation vault
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
                      placeholder="This vault requires me to be at my home location to unlock..."
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe what this vault is for or what type of location is required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Boundary Configuration</h3>
            
            <FormField
              control={form.control}
              name="boundaryType"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Boundary Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setActiveTab(value);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a boundary type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="circle">
                        <div className="flex items-center">
                          <span className="mr-2">⭕</span> Circular Area
                        </div>
                      </SelectItem>
                      <SelectItem value="polygon">
                        <div className="flex items-center">
                          <span className="mr-2">🔷</span> Custom Area (Polygon)
                        </div>
                      </SelectItem>
                      <SelectItem value="country">
                        <div className="flex items-center">
                          <span className="mr-2">🌎</span> Country
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how to define the geographical boundary for your vault
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="circle" onClick={() => form.setValue('boundaryType', 'circle')}>
                  Circular
                </TabsTrigger>
                <TabsTrigger value="polygon" onClick={() => form.setValue('boundaryType', 'polygon')}>
                  Custom Area
                </TabsTrigger>
                <TabsTrigger value="country" onClick={() => form.setValue('boundaryType', 'country')}>
                  Country
                </TabsTrigger>
              </TabsList>

              <TabsContent value="circle" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Target className="h-4 w-4 mr-2" /> 
                      Circular Boundary
                    </CardTitle>
                    <CardDescription>
                      Define a circular area around a central point
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <Button 
                        type="button" 
                        onClick={getCurrentLocation}
                        variant="outline"
                        className="w-full"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Set Current Location as Center
                      </Button>
                    </div>

                    {currentLocation && (
                      <div className="text-xs text-muted-foreground p-3 bg-secondary/50 rounded-md space-y-1">
                        <div>Latitude: {currentLocation.coords.latitude.toFixed(6)}</div>
                        <div>Longitude: {currentLocation.coords.longitude.toFixed(6)}</div>
                        <div>Accuracy: ±{Math.round(currentLocation.coords.accuracy)} meters</div>
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="radius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Radius (meters)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            How large the circular boundary should be (in meters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="polygon" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Map className="h-4 w-4 mr-2" /> 
                      Custom Area Boundary
                    </CardTitle>
                    <CardDescription>
                      Define a custom area by setting multiple points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Feature in development</AlertTitle>
                      <AlertDescription>
                        Custom polygon boundaries will be available in the next update. Please use circular boundaries for now.
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center justify-center mb-4">
                      <Button 
                        type="button" 
                        onClick={getCurrentLocation} 
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Add Current Location as Point
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="country" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center">
                      <Map className="h-4 w-4 mr-2" /> 
                      Country Boundary
                    </CardTitle>
                    <CardDescription>
                      Use a country's borders as the boundary
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert className="mb-4">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Feature in development</AlertTitle>
                      <AlertDescription>
                        Country boundaries will be available in the next update. Please use circular boundaries for now.
                      </AlertDescription>
                    </Alert>

                    <FormField
                      control={form.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country Code</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="US"
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormDescription>
                            Two-letter country code (ISO 3166-1 alpha-2)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Security settings */}
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium mb-4">Security Settings</h3>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="minAccuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum GPS Accuracy (meters)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum allowed GPS error margin in meters (smaller number = higher precision)
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
                      <FormLabel className="text-base">
                        Real-time Verification
                      </FormLabel>
                      <FormDescription>
                        Require verification to happen in real-time (no cached locations)
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
                      <FormLabel className="text-base">
                        Multi-factor Unlock
                      </FormLabel>
                      <FormDescription>
                        Require additional verification beyond location check
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
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Vault...
                </>
              ) : (
                <>Create Geolocation Vault</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateGeoVaultForm;