/**
 * Geolocation Vault Page
 * 
 * Main interface for creating, managing, and accessing geolocation-based vaults
 * that leverage user's physical location for secure access control.
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin, Shield, Clock, Users, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { PageHeader } from '@/components/layout/page-header';
import { PageContainer } from '@/components/layout/page-container';
import { CreateGeoVaultForm } from '@/components/geo-vault/create-geo-vault-form';
import { GeoVaultList } from '@/components/geo-vault/geo-vault-list';
import { GeoVaultDetail } from '@/components/geo-vault/geo-vault-detail';
import { GeoLocationVerifier } from '@/components/geo-vault/geo-location-verifier';

// Define the geolocation vault type
interface GeoVault {
  id: string;
  name: string;
  description: string;
  boundaryCount: number;
  boundaryTypes: string[];
  requiresRealTimeVerification: boolean;
  multiFactorUnlock: boolean;
  createdAt?: string;
}

export default function GeoVaultPage() {
  const [activeTab, setActiveTab] = useState('my-vaults');
  const [selectedVaultId, setSelectedVaultId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch user's geolocation vaults
  const { data: vaults, isLoading, error } = useQuery<GeoVault[]>({
    queryKey: ['/api/geo-vaults'],
    // Don't fetch on mount if we're in the create tab
    enabled: activeTab !== 'create',
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If we're going to the vaults tab, refetch
    if (value === 'my-vaults') {
      queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
    }
    
    // Clear selected vault when changing tabs
    setSelectedVaultId(null);
  };

  // Select a vault for detailed view
  const selectVault = (id: string) => {
    setSelectedVaultId(id);
    setActiveTab('detail');
  };

  return (
    <PageContainer>
      <PageHeader
        title="Geolocation Vaults"
        description="Create and manage vaults that require specific geographic locations to access"
        icon={<MapPin className="w-10 h-10 text-primary" />}
      />
      
      <div className="space-y-4 mb-4">
        <Alert variant="default" className="bg-secondary/20">
          <Shield className="h-4 w-4" />
          <AlertTitle>Secure Location-Based Access</AlertTitle>
          <AlertDescription>
            Geolocation vaults add an extra layer of security by requiring you to be physically present at a specific location to access your assets.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="my-vaults">My Vaults</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="verify">Verify Location</TabsTrigger>
        </TabsList>

        {/* My Vaults Tab */}
        <TabsContent value="my-vaults" className="min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your geolocation vaults...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load your geolocation vaults. Please try again later.
              </AlertDescription>
            </Alert>
          ) : vaults && vaults.length > 0 ? (
            <GeoVaultList vaults={vaults} onSelect={selectVault} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Globe className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No Geolocation Vaults Found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't created any geolocation-based vaults yet. Create one to secure your assets with location-based protection.
              </p>
              <Button onClick={() => setActiveTab('create')}>Create Your First Vault</Button>
            </div>
          )}
        </TabsContent>

        {/* Create New Vault Tab */}
        <TabsContent value="create">
          <CreateGeoVaultForm 
            onSuccess={(vaultId) => {
              toast({
                title: "Vault Created",
                description: "Your geolocation vault has been created successfully",
                variant: "default",
              });
              setSelectedVaultId(vaultId);
              setActiveTab('detail');
              queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
            }}
          />
        </TabsContent>

        {/* Verify Location Tab */}
        <TabsContent value="verify">
          <GeoLocationVerifier />
        </TabsContent>
        
        {/* Vault Detail Tab */}
        <TabsContent value="detail">
          {selectedVaultId ? (
            <GeoVaultDetail vaultId={selectedVaultId} onBack={() => setActiveTab('my-vaults')} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-muted-foreground">No vault selected</p>
              <Button variant="ghost" onClick={() => setActiveTab('my-vaults')}>
                Back to My Vaults
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}