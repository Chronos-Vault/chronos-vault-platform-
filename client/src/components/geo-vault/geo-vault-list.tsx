import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, MoreHorizontal, MapPin, RefreshCw, Circle, Square, Globe } from 'lucide-react';
import { GeoVault } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface GeoVaultListProps {
  vaults: GeoVault[];
  onSelectVault: (vaultId: number) => void;
  onRefresh?: () => void;
}

const GeoVaultList: React.FC<GeoVaultListProps> = ({ 
  vaults, 
  onSelectVault,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBoundaryType, setFilterBoundaryType] = useState<string>('all');
  const { toast } = useToast();

  // Handle refresh button click
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast({
        title: "Refreshed",
        description: "The vault list has been refreshed.",
      });
    }
  };

  // Handle delete vault
  const handleDeleteVault = async (vaultId: number) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this vault?');
      if (!confirmed) return;

      const response = await apiRequest('DELETE', `/api/geo-vaults/${vaultId}`);
      
      if (!response.ok) {
        throw new Error('Failed to delete vault');
      }
      
      toast({
        title: "Vault Deleted",
        description: "The vault has been successfully deleted.",
      });
      
      // Refresh the vaults list
      queryClient.invalidateQueries({ queryKey: ['/api/geo-vaults'] });
      if (onRefresh) onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while deleting the vault.',
        variant: "destructive",
      });
    }
  };

  // Filter vaults by search query and boundary type
  const filteredVaults = vaults.filter(vault => {
    const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (vault.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesBoundaryType = filterBoundaryType === 'all' || vault.boundaryType === filterBoundaryType;
    
    return matchesSearch && matchesBoundaryType;
  });

  // Sort vaults by selected field and order
  const sortedVaults = [...filteredVaults].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'boundaryType':
        valueA = a.boundaryType.toLowerCase();
        valueB = b.boundaryType.toLowerCase();
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      default:
        valueA = a.id;
        valueB = b.id;
    }
    
    return sortOrder === 'asc' 
      ? (valueA > valueB ? 1 : -1)
      : (valueA < valueB ? 1 : -1);
  });

  const getBoundaryTypeIcon = (type: string) => {
    switch (type) {
      case 'circle':
        return <Circle className="h-4 w-4 mr-1" />;
      case 'polygon':
        return <Square className="h-4 w-4 mr-1" />;
      case 'country':
        return <Globe className="h-4 w-4 mr-1" />;
      default:
        return <MapPin className="h-4 w-4 mr-1" />;
    }
  };

  const getBoundaryTypeName = (type: string) => {
    switch (type) {
      case 'circle':
        return 'Circular Area';
      case 'polygon':
        return 'Custom Area';
      case 'country':
        return 'Country';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search vaults..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-row gap-2">
          <Select 
            value={filterBoundaryType} 
            onValueChange={setFilterBoundaryType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boundary Types</SelectItem>
              <SelectItem value="circle">Circular Area</SelectItem>
              <SelectItem value="polygon">Custom Area</SelectItem>
              <SelectItem value="country">Country</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {sortedVaults.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-3 text-lg font-semibold">No Vaults Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery || filterBoundaryType !== 'all'
                ? "No vaults match your search criteria"
                : "You haven't created any geolocation vaults yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => {
                    if (sortBy === 'name') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('name');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Name
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell" 
                  onClick={() => {
                    if (sortBy === 'boundaryType') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('boundaryType');
                      setSortOrder('asc');
                    }
                  }}
                >
                  Boundary Type
                  {sortBy === 'boundaryType' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell" 
                  onClick={() => {
                    if (sortBy === 'createdAt') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('createdAt');
                      setSortOrder('desc');
                    }
                  }}
                >
                  Created
                  {sortBy === 'createdAt' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVaults.map((vault) => (
                <TableRow key={vault.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onSelectVault(vault.id)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {vault.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 md:hidden">
                      {getBoundaryTypeName(vault.boundaryType)} · {new Date(vault.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="flex w-fit items-center">
                      {getBoundaryTypeIcon(vault.boundaryType)}
                      {getBoundaryTypeName(vault.boundaryType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(vault.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onSelectVault(vault.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteVault(vault.id)}
                        >
                          Delete Vault
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GeoVaultList;