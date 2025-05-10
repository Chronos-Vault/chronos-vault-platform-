/**
 * Geo Vault Page
 * 
 * Main page for managing geolocation-based vaults,
 * with routes for listing, creating, and accessing vaults.
 */

import React, { useState } from 'react';
import { Switch, Route, useRoute, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, MapPin, Lock, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';

// Import layout components
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';

// Import geo vault components
import { CreateGeoVaultForm } from '@/components/geo-vault/create-geo-vault-form';
import { GeoVaultList } from '@/components/geo-vault/geo-vault-list';
import { GeoLocationVerifier } from '@/components/geo-vault/geo-location-verifier';

export function GeoVaultIndexPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Geolocation Vaults"
        description="Create and manage vaults that can only be accessed from specific geographic locations."
        icon={<MapPin className="h-6 w-6" />}
      />
      
      <GeoVaultList />
    </PageContainer>
  );
}

export function GeoVaultCreatePage() {
  const [, navigate] = useLocation();
  
  const handleBackClick = () => {
    navigate('/geo-vaults');
  };
  
  return (
    <PageContainer>
      <PageHeader
        title="Create Geolocation Vault"
        description="Define a geographic boundary to secure your vault."
        icon={<MapPin className="h-6 w-6" />}
        actions={
          <Button variant="outline" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vaults
          </Button>
        }
      />
      
      <div className="mt-6">
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Geolocation vaults can only be accessed when you're physically present at the specified location.
            Make sure to set up boundaries for locations you can reliably access.
          </AlertDescription>
        </Alert>
        
        <CreateGeoVaultForm />
      </div>
    </PageContainer>
  );
}

export function GeoVaultDetailPage() {
  const [match, params] = useRoute('/geo-vaults/:id');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  
  const vaultId = params?.id;
  
  const { data: vault, isLoading, error } = useQuery({
    queryKey: [`/api/geo-vaults/${vaultId}`],
    queryFn: async () => {
      if (!vaultId) throw new Error('No vault ID provided');
      
      const response = await fetch(`/api/geo-vaults/${vaultId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch vault details');
      }
      
      return response.json();
    },
  });
  
  const { data: accessHistory, isLoading: historyLoading } = useQuery({
    queryKey: [`/api/geo-vaults/${vaultId}/history`],
    queryFn: async () => {
      if (!vaultId) throw new Error('No vault ID provided');
      
      const response = await fetch(`/api/geo-vaults/${vaultId}/history`);
      
      if (!response.ok) {
        return [];
      }
      
      return response.json();
    },
    enabled: !!vaultId && activeTab === 'history',
  });
  
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!vaultId) throw new Error('No vault ID provided');
      
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
        description: 'The geolocation vault has been deleted successfully',
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
      navigate('/geo-vaults');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  const handleDeleteVault = () => {
    if (confirm('Are you sure you want to delete this vault? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };
  
  const handleVerificationSuccess = () => {
    setVaultUnlocked(true);
    setActiveTab('content');
  };
  
  const handleBackClick = () => {
    navigate('/geo-vaults');
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }
  
  if (error || !vault) {
    return (
      <PageContainer>
        <PageHeader
          title="Vault Not Found"
          description="The requested geolocation vault could not be found."
          icon={<AlertTriangle className="h-6 w-6" />}
          actions={
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vaults
            </Button>
          }
        />
        
        <div className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            {(error as Error)?.message || 'The vault may have been deleted or you may not have permission to access it.'}
          </p>
          <Button variant="outline" onClick={handleBackClick}>
            Return to Vault List
          </Button>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader
        title={vault.name}
        description={vault.description || 'Geolocation-secured vault'}
        icon={vaultUnlocked ? <Shield className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vaults
            </Button>
            
            <Button variant="destructive" onClick={handleDeleteVault} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Vault'}
            </Button>
          </div>
        }
      />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GeoLocationVerifier vault={vault} onVerificationSuccess={handleVerificationSuccess} />
        </div>
        
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Vault Details</TabsTrigger>
              <TabsTrigger value="content" disabled={!vaultUnlocked}>
                <Lock className={`h-4 w-4 mr-2 ${vaultUnlocked ? 'opacity-0' : 'opacity-100'}`} />
                Vault Content
              </TabsTrigger>
              <TabsTrigger value="history">Access History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="border rounded-md p-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Vault Configuration</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-sm font-medium">Boundary Type</div>
                  <div className="text-sm capitalize">{vault.boundaryType}</div>
                  
                  {vault.boundaryType === 'circle' && (
                    <>
                      <div className="text-sm font-medium">Radius</div>
                      <div className="text-sm">{vault.radius} meters</div>
                      
                      <div className="text-sm font-medium">Center Coordinates</div>
                      <div className="text-sm">
                        {(vault.coordinates as any)?.[0]?.latitude.toFixed(6)}, {' '}
                        {(vault.coordinates as any)?.[0]?.longitude.toFixed(6)}
                      </div>
                    </>
                  )}
                  
                  {vault.boundaryType === 'polygon' && (
                    <>
                      <div className="text-sm font-medium">Points</div>
                      <div className="text-sm">{(vault.coordinates as any)?.length || 0} coordinates</div>
                    </>
                  )}
                  
                  {vault.boundaryType === 'country' && (
                    <>
                      <div className="text-sm font-medium">Country</div>
                      <div className="text-sm">{vault.countryCode}</div>
                    </>
                  )}
                  
                  <div className="text-sm font-medium">Minimum GPS Accuracy</div>
                  <div className="text-sm">{vault.minAccuracy || 'Not specified'} meters</div>
                  
                  <div className="text-sm font-medium">Real-Time Verification</div>
                  <div className="text-sm">{vault.requiresRealTimeVerification ? 'Required' : 'Not required'}</div>
                  
                  <div className="text-sm font-medium">Multi-Factor Unlock</div>
                  <div className="text-sm">{vault.multiFactorUnlock ? 'Enabled' : 'Disabled'}</div>
                  
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm">{new Date(vault.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="border rounded-md p-6 mt-6">
              {!vaultUnlocked ? (
                <div className="py-8 text-center">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Vault Locked</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Verify your location using the verification panel to unlock this vault's content.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-4">Vault Content</h3>
                  
                  <div className="p-6 border rounded-md bg-muted/50">
                    <p className="text-center text-muted-foreground">
                      This is a secure vault that was unlocked based on your geolocation. 
                      In a real application, this would contain your protected content.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="border rounded-md p-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Access History</h3>
              
              {historyLoading ? (
                <div className="py-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : !accessHistory?.length ? (
                <div className="py-4 text-center border rounded-md bg-muted/50">
                  <p className="text-muted-foreground">
                    No access history available for this vault yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {accessHistory.map((log: any) => (
                    <div key={log.id} className="p-4 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">
                          {log.success ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Shield className="h-4 w-4" />
                              Successful Access
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Access Denied
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span>{log.latitude}, {log.longitude}</span>
                        </div>
                        
                        {log.accuracy && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Accuracy</span>
                            <span>{log.accuracy}m</span>
                          </div>
                        )}
                        
                        {!log.success && log.failureReason && (
                          <div className="mt-2 text-sm text-red-600">
                            Reason: {log.failureReason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}

// Main geo vault page router
export default function GeoVaultPage() {
  return (
    <Switch>
      <Route path="/geo-vaults/create" component={GeoVaultCreatePage} />
      <Route path="/geo-vaults/:id" component={GeoVaultDetailPage} />
      <Route path="/geo-vaults" component={GeoVaultIndexPage} />
    </Switch>
  );
}