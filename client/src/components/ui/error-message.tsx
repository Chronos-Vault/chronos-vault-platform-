import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, XCircle, CheckCircle, Clock, Info, ChevronDown, ChevronUp, RotateCw, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Export error categories to be used throughout the app
export enum CrossChainErrorCategory {
  // Network related
  CONNECTION_FAILURE = 'connection_failure',
  NETWORK_FAILURE = 'network_failure',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NODE_SYNCING = 'node_syncing',
  
  // Transaction related
  TRANSACTION_FAILURE = 'transaction_failure',
  VALIDATION_FAILURE = 'validation_failure',
  
  // Cross-chain specific
  CROSS_CHAIN_SYNC_ERROR = 'cross_chain_sync_error',
  CHAIN_UNAVAILABLE = 'chain_unavailable',
  VERIFICATION_TIMEOUT = 'verification_timeout',
  
  // Security related
  SECURITY_VIOLATION = 'security_violation',
  
  // Fallback
  UNKNOWN = 'unknown'
}

interface ErrorMessageProps {
  title: string;
  message: string;
  category?: CrossChainErrorCategory;
  solution?: string;
  retry?: () => void;
  viewDetails?: boolean;
  details?: any;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  category = CrossChainErrorCategory.UNKNOWN,
  solution,
  retry,
  viewDetails = false,
  details
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Function to get the appropriate icon based on error category
  const getIcon = () => {
    switch (category) {
      case CrossChainErrorCategory.CONNECTION_FAILURE:
      case CrossChainErrorCategory.NETWORK_FAILURE:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
      case CrossChainErrorCategory.NODE_SYNCING:
        return <Clock className="h-5 w-5 text-amber-500" />;
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return <AlertCircle className="h-5 w-5 text-red-700" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Get text for category badge
  const getCategoryText = () => {
    switch (category) {
      case CrossChainErrorCategory.CONNECTION_FAILURE:
        return 'Connection Failed';
      case CrossChainErrorCategory.NETWORK_FAILURE:
        return 'Network Error';
      case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
        return 'Rate Limited';
      case CrossChainErrorCategory.NODE_SYNCING:
        return 'Node Syncing';
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
        return 'Transaction Failed';
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return 'Validation Error';
      case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
        return 'Cross-Chain Sync Error';
      case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
        return 'Chain Unavailable';
      case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
        return 'Verification Timeout';
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return 'Security Alert';
      default:
        return 'Unknown Error';
    }
  };

  // Get badge variant based on error severity
  const getBadgeVariant = () => {
    switch (category) {
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return 'destructive';
      case CrossChainErrorCategory.CONNECTION_FAILURE:
      case CrossChainErrorCategory.NETWORK_FAILURE:
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return 'destructive';
      case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
      case CrossChainErrorCategory.NODE_SYNCING:
      case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
      case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
        return 'warning';
      case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="border border-red-500/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getIcon()}
            <CardTitle className="text-xl ml-2">{title}</CardTitle>
          </div>
          <Badge variant={getBadgeVariant() as any}>{getCategoryText()}</Badge>
        </div>
        <CardDescription className="text-gray-400 mt-2">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {solution && (
          <Alert variant="default" className="bg-blue-500/10 border-blue-500/20 my-2">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-base font-medium text-white">Solution</AlertTitle>
            <AlertDescription className="text-gray-300">
              {solution}
            </AlertDescription>
          </Alert>
        )}

        {viewDetails && details && (
          <Collapsible
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            className="mt-4 border border-gray-800 rounded-md"
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="flex w-full justify-between p-4">
                <span>Technical Details</span>
                {isDetailsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 text-xs font-mono bg-black/20 rounded-b-md overflow-auto max-h-48">
              {typeof details === 'string' ? (
                <pre>{details}</pre>
              ) : (
                <pre>{JSON.stringify(details, null, 2)}</pre>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      {retry && (
        <CardFooter className="flex justify-end space-x-2">
          <Button onClick={retry} size="sm" className="flex items-center">
            <RotateCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};