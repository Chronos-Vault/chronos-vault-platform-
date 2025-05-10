/**
 * GeoVault Detail Component
 * 
 * Displays detailed information about a specific geolocation vault,
 * including boundary information, security settings, and access options.
 */

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  ArrowLeft, 
  Shield, 
  Clock, 
  Download, 
  Trash2, 
  Edit, 
  Lock, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatRelative } from 'date-fns';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// GeoVault type definition
interface GeoVault {
  id: string;
  name: string;
  description: string;
  boundaryType: string;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  radius?: number;
  countryCode?: string;
  requiresRealTimeVerification: boolean;
  multiFactorUnlock: boolean;
  minAccuracy?: number;
  accessHistory?: {
    timestamp: string;
    success: boolean;
    location?: {
      latitude: number;
      longitude: number;
      accuracy: number;
    };
    reason?: string;
  }[];
  createdAt: string;
}

interface GeoVaultDetailProps {
  vaultId: string;
  onBack: () => void;
}

export function GeoVaultDetail({ vaultId, onBack }: GeoVaultDetailProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch vault details
  const { data: vault, isLoading, error } = useQuery<GeoVault>({
    queryKey: [`/api/geo-vaults/${vaultId}`],
  });

  // Delete vault mutation
  const deleteVaultMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/geo-vaults/${vaultId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete vault');
      }
      return true;
    },
    onSuccess: () => {
      toast({
        title: 'Vault Deleted',
        description: 'The geolocation vault has been permanently deleted',
        variant: 'default',
      });
      // Invalidate queries and navigate back
      queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
      onBack();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle vault deletion
  const handleDeleteVault = () => {
    deleteVaultMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading vault details...</p>
      </div>
    );
  }

  if (error || !vault) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vaults
        </Button>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load vault details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Vaults
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Geolocation Vault</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this vault? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteVault}
                  disabled={deleteVaultMutation.isPending}
                >
                  {deleteVaultMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Vault'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {vault.name}
              </CardTitle>
              <CardDescription>
                Created {formatRelative(new Date(vault.createdAt), new Date())}
              </CardDescription>
            </div>
            <Badge variant={vault.multiFactorUnlock ? "destructive" : "secondary"} className="py-1">
              {vault.multiFactorUnlock ? 'Multi-Factor' : 'Standard'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {vault.description && (
            <p className="text-sm text-muted-foreground">
              {vault.description}
            </p>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                Location Boundary
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <span className="font-medium mr-2">Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {vault.boundaryType}
                  </Badge>
                </div>
                
                {vault.boundaryType === 'circle' && (
                  <>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Center:</span>
                      <span className="text-muted-foreground">
                        {vault.coordinates[0]?.latitude.toFixed(6)}, {vault.coordinates[0]?.longitude.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Radius:</span>
                      <span className="text-muted-foreground">
                        {vault.radius} meters
                      </span>
                    </div>
                  </>
                )}
                
                {vault.boundaryType === 'country' && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Country:</span>
                    <span className="text-muted-foreground">
                      {vault.countryCode}
                    </span>
                  </div>
                )}
                
                {vault.boundaryType === 'polygon' && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Vertices:</span>
                    <span className="text-muted-foreground">
                      {vault.coordinates.length} points
                    </span>
                  </div>
                )}
                
                {vault.minAccuracy && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium mr-2">Min. Accuracy:</span>
                    <span className="text-muted-foreground">
                      {vault.minAccuracy} meters
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Security Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={`h-4 w-4 ${vault.requiresRealTimeVerification ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={vault.requiresRealTimeVerification ? 'font-medium' : 'text-muted-foreground'}>
                    Real-Time Verification
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={`h-4 w-4 ${vault.multiFactorUnlock ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <span className={vault.multiFactorUnlock ? 'font-medium' : 'text-muted-foreground'}>
                    Multi-Factor Unlock
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Recent Access History
            </h3>
            
            {vault.accessHistory && vault.accessHistory.length > 0 ? (
              <div className="space-y-2">
                {vault.accessHistory.slice(0, 3).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-md bg-secondary/10">
                    <div className="flex items-center gap-2">
                      {entry.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span>{formatRelative(new Date(entry.timestamp), new Date())}</span>
                    </div>
                    {entry.reason && !entry.success && (
                      <span className="text-red-400 text-xs">{entry.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No access history available
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button variant="default">
            <Lock className="mr-2 h-4 w-4" />
            Access Vault
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}