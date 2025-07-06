import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { formatDate } from '@/utils/date-utils';
import { useToast } from '@/hooks/use-toast';

// Types for verification vaults
export interface VerificationVault {
  id: number;
  name: string;
  status: string;
  messageContent: string;
  creationDate: string;
  unlockDate: string;
  milestone: string;
  olympiadNumber: number;
  tokenAmount: number;
  tokenPercentage: number;
  isUnlocked: boolean;
}

const statusColors = {
  pending: 'bg-blue-500',
  scheduled: 'bg-purple-500',
  completed: 'bg-green-500',
  active: 'bg-amber-500',
  error: 'bg-red-500'
};

const VerificationVaultCard = ({ vault }: { vault: VerificationVault }) => {
  const now = new Date();
  const unlockDate = new Date(vault.unlockDate);
  const creationDate = new Date(vault.creationDate);
  const totalDuration = unlockDate.getTime() - creationDate.getTime();
  const elapsedDuration = now.getTime() - creationDate.getTime();
  const progressPercent = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  
  return (
    <Card className="overflow-hidden border border-purple-200 shadow-md hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-purple-900">{vault.name}</CardTitle>
          <Badge 
            className={`${statusColors[vault.status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}
          >
            {vault.status}
          </Badge>
        </div>
        <CardDescription className="text-sm text-gray-600">
          Verification #{vault.olympiadNumber} - {vault.milestone}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4">
          <p className="text-sm text-gray-700 line-clamp-3">{vault.messageContent}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-purple-100" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Created: {formatDate(creationDate)}</span>
            <span>Unlocks: {formatDate(unlockDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex justify-between items-center">
        <div className="text-xs text-gray-700">
          <span className="font-semibold">{vault.tokenAmount.toLocaleString()}</span> CVT
          <span className="text-gray-500 ml-2">({vault.tokenPercentage}%)</span>
        </div>
        {vault.isUnlocked ? (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Unlocked
          </Badge>
        ) : (
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            Time-Locked
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export const VerificationVaults = () => {
  const { toast } = useToast();
  
  const { 
    data: vaults, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['/api/vaults/verification'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/vaults/verification');
      return response.json();
    }
  });
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load verification vaults. Please try again.",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border shadow-md">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="pb-2">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-2 w-full mb-2" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4 flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!vaults || vaults.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-500">No verification vaults found</h3>
        <p className="text-sm text-gray-400 mt-1">Verification vaults will appear here once they're created</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vaults.map((vault: VerificationVault) => (
        <VerificationVaultCard key={vault.id} vault={vault} />
      ))}
    </div>
  );
};

export default VerificationVaults;