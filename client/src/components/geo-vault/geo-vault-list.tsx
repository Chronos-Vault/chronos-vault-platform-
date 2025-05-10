/**
 * Geo Vault List
 * 
 * Component for displaying a list of geolocation vaults with sorting
 * and filtering options.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { GeoVault } from '@shared/schema';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Search, Plus, Globe, Circle, Square } from 'lucide-react';

export function GeoVaultList() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [filterType, setFilterType] = useState<string>('all');
  
  // Fetch the list of geo vaults
  const { data: vaults, isLoading, error } = useQuery<GeoVault[]>({
    queryKey: ['/api/geo-vaults'],
    queryFn: async () => {
      const response = await fetch('/api/geo-vaults');
      if (!response.ok) {
        throw new Error('Failed to fetch vaults');
      }
      return response.json();
    },
  });
  
  // Helper to get the icon for a boundary type
  const getBoundaryIcon = (type: string) => {
    switch (type) {
      case 'circle':
        return <Circle className="h-4 w-4" />;
      case 'polygon':
        return <Square className="h-4 w-4" />;
      case 'country':
        return <Globe className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };
  
  // Filter and sort the vaults
  const filteredAndSortedVaults = React.useMemo(() => {
    if (!vaults) return [];
    
    // Apply search filter
    let filtered = vaults.filter(vault => 
      searchTerm === '' ||
      vault.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vault.description && vault.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Apply boundary type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(vault => vault.boundaryType === filterType);
    }
    
    // Sort the vaults
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [vaults, searchTerm, sortBy, filterType]);
  
  // Function to format creation date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Handle creating a new vault
  const handleCreateNew = () => {
    navigate('/geo-vaults/create');
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="text-lg font-medium text-destructive mb-2">
          Error Loading Vaults
        </div>
        <p className="text-muted-foreground mb-4">
          {(error as Error).message || 'An unexpected error occurred'}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vaults..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={filterType}
            onValueChange={setFilterType}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as 'newest' | 'oldest' | 'name')}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Vault
          </Button>
        </div>
      </div>
      
      {filteredAndSortedVaults.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/40">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Geolocation Vaults Found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Create your first geolocation vault to get started with location-based security.'}
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Vault
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedVaults.map((vault) => (
            <Card key={vault.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold truncate">
                    {vault.name}
                  </CardTitle>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    {getBoundaryIcon(vault.boundaryType)}
                    <span className="capitalize">{vault.boundaryType}</span>
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                  {vault.description || 'No description provided'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(vault.createdAt)}</span>
                  </div>
                  
                  {vault.boundaryType === 'circle' && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Radius</span>
                      <span>{vault.radius}m</span>
                    </div>
                  )}
                  
                  {vault.boundaryType === 'polygon' && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Points</span>
                      <span>{(vault.coordinates as any)?.length || 0} coordinates</span>
                    </div>
                  )}
                  
                  {vault.boundaryType === 'country' && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Country</span>
                      <span>{vault.countryCode}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Min. Accuracy</span>
                    <span>{vault.minAccuracy || 'Not specified'}m</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/geo-vaults/${vault.id}`)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View & Verify
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}