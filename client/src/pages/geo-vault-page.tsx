import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';
import { GeoVault } from '@shared/schema';

import PageHeader from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

// Import geolocation vault components
import CreateGeoVaultForm from '@/components/geo-vault/create-geo-vault-form';
import GeoVaultList from '@/components/geo-vault/geo-vault-list';
import GeoLocationVerifier from '@/components/geo-vault/geo-location-verifier';

const GeoVaultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('list');
  const [selectedVaultId, setSelectedVaultId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const params = useParams();
  const { toast } = useToast();

  // Get all vaults
  const { 
    data: vaults, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery<GeoVault[]>({
    queryKey: ['/api/geo-vaults'],
    retry: 1,
  });

  // Get single vault details
  const { 
    data: selectedVault, 
    isLoading: isLoadingVault,
    isError: isErrorVault,
  } = useQuery<GeoVault>({
    queryKey: ['/api/geo-vaults', selectedVaultId],
    queryFn: () => fetch(`/api/geo-vaults/${selectedVaultId}`).then(res => res.json()),
    enabled: !!selectedVaultId,
    retry: 1,
  });

  // Check URL params to determine active tab or selected vault
  useEffect(() => {
    if (params.id) {
      // If URL has vault ID, switch to details tab
      setSelectedVaultId(parseInt(params.id));
      setActiveTab('details');
    } else if (window.location.pathname.includes('/create')) {
      // If URL is for creation, switch to create tab
      setActiveTab('create');
    } else {
      // Default to list view
      setActiveTab('list');
    }
  }, [params]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab === 'details' && selectedVaultId) {
      navigate(`/geo-vaults/${selectedVaultId}`);
    } else if (activeTab === 'create') {
      navigate('/geo-vaults/create');
    } else {
      navigate('/geo-vaults');
    }
  }, [activeTab, selectedVaultId, navigate]);

  // Handle vault selection for viewing details
  const handleSelectVault = (vaultId: number) => {
    setSelectedVaultId(vaultId);
    setActiveTab('details');
  };

  // Handle vault creation success
  const handleVaultCreationSuccess = () => {
    toast({
      title: 'Success',
      description: 'Geolocation vault created successfully',
    });
    
    // Refresh vaults list and switch to list view
    refetch();
    setActiveTab('list');
  };

  // Check if device supports geolocation
  const isGeolocationSupported = !!navigator.geolocation;

  // Render content based on active tab
  const renderContent = () => {
    if (!isGeolocationSupported) {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Geolocation Not Supported</AlertTitle>
          <AlertDescription>
            Your device does not support geolocation, which is required for this feature.
            Please try using a different device or browser that supports geolocation.
          </AlertDescription>
        </Alert>
      );
    }
    
    switch (activeTab) {
      case 'list':
        return (
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : isError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error instanceof Error ? error.message : 'Failed to load vaults'}
                </AlertDescription>
              </Alert>
            ) : vaults && vaults.length > 0 ? (
              <GeoVaultList 
                vaults={vaults} 
                onSelectVault={handleSelectVault} 
                onRefresh={refetch}
              />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-3 text-lg font-semibold">No Geolocation Vaults Found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create your first vault to secure content behind geographical boundaries
                  </p>
                  <Button 
                    onClick={() => setActiveTab('create')} 
                    className="mt-4 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:from-[#FF5AF7] hover:to-[#6B00D7] text-white"
                  >
                    Create Your First Vault
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-6">
            {isLoadingVault ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : isErrorVault || !selectedVault ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load vault details. The vault may have been deleted or you don't have permission to access it.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{selectedVault.name}</h3>
                        {selectedVault.description && (
                          <p className="text-muted-foreground">{selectedVault.description}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Boundary Type</h4>
                          <p className="text-sm">
                            {selectedVault.boundaryType === 'circle' ? 'Circular Area' : 
                             selectedVault.boundaryType === 'polygon' ? 'Custom Area' : 
                             selectedVault.boundaryType === 'country' ? 'Country' : 
                             selectedVault.boundaryType}
                          </p>
                        </div>
                        
                        {selectedVault.boundaryType === 'circle' && selectedVault.radius && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Radius</h4>
                            <p className="text-sm">{selectedVault.radius} meters</p>
                          </div>
                        )}
                        
                        {selectedVault.minAccuracy && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Required Accuracy</h4>
                            <p className="text-sm">±{selectedVault.minAccuracy} meters</p>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Created On</h4>
                          <p className="text-sm">{new Date(selectedVault.createdAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Additional Security</h4>
                          <p className="text-sm">
                            {selectedVault.requiresRealTimeVerification ? 'Real-time verification required' : 'Cached location allowed'}
                            {selectedVault.multiFactorUnlock && ', Multi-factor unlock required'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Location Verification</h3>
                  <GeoLocationVerifier vaultId={selectedVault.id} />
                </div>
              </>
            )}
          </div>
        );
        
      case 'create':
        return <CreateGeoVaultForm onSuccess={handleVaultCreationSuccess} />;
        
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Geolocation Vaults"
        description="Create and manage vaults that only unlock in specific geographical locations"
        backButton={activeTab !== 'list'}
        backTo="/geo-vaults"
        showCreateButton={activeTab === 'list' && (vaults && vaults.length > 0)}
        onCreateClick={() => setActiveTab('create')}
        createButtonText="Create New Vault"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="list">Vault List</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedVaultId}>Vault Details</TabsTrigger>
          <TabsTrigger value="create">Create Vault</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {renderContent()}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default GeoVaultPage;