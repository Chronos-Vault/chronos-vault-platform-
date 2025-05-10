/**
 * GeoVault List Component
 * 
 * Displays a list of geolocation vaults with their details and allows
 * selection for detailed view or access.
 */

import React from 'react';
import { MapPin, Shield, Clock, Users, Lock, Globe, ArrowUpRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

// GeoVault type definition
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

interface GeoVaultListProps {
  vaults: GeoVault[];
  onSelect: (id: string) => void;
}

export function GeoVaultList({ vaults, onSelect }: GeoVaultListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vaults.map(vault => (
        <Card key={vault.id} className="overflow-hidden transition-all hover:shadow-lg border-border/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {vault.name}
              </CardTitle>
              <Badge variant={vault.multiFactorUnlock ? "destructive" : "secondary"} className="py-1">
                {vault.multiFactorUnlock ? 'Multi-Factor' : 'Standard'}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {vault.description || 'No description provided.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {vault.boundaryCount} {vault.boundaryCount === 1 ? 'boundary' : 'boundaries'}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {vault.boundaryTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {type}
                  </Badge>
                ))}
              </div>
              
              {vault.requiresRealTimeVerification && (
                <div className="flex items-center text-sm text-amber-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Real-time verification required</span>
                </div>
              )}
              
              {vault.createdAt && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Created {formatDistanceToNow(new Date(vault.createdAt))} ago</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="ghost" onClick={() => onSelect(vault.id)}>
              View Details
            </Button>
            <Button size="sm" className="gap-1" onClick={() => onSelect(vault.id)}>
              <ArrowUpRight className="h-4 w-4" />
              Access
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}