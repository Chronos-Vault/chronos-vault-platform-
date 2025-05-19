import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw, ExternalLink, HelpCircle, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// Import the error categories - temporarily defining here until shared types are properly set up
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

export interface ErrorMessageProps {
  title?: string;
  message: string;
  category?: string;
  blockchain?: string;
  solution?: string;
  errorCode?: string;
  timestamp?: number;
  retry?: () => void;
  contact?: () => void;
  viewDetails?: boolean;
  details?: any;
}

export function ErrorMessage({
  title,
  message,
  category,
  blockchain,
  solution,
  errorCode,
  timestamp,
  retry,
  contact,
  viewDetails = false,
  details
}: ErrorMessageProps) {
  const [showDetails, setShowDetails] = React.useState(viewDetails);

  // Select appropriate icon based on error category
  const getIcon = () => {
    if (!category) return AlertTriangle;

    switch (category) {
      case CrossChainErrorCategory.CONNECTION_FAILURE:
      case CrossChainErrorCategory.NETWORK_FAILURE:
        return ExternalLink;
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return AlertCircle;
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return ShieldAlert;
      case CrossChainErrorCategory.CROSS_CHAIN_SYNC_ERROR:
      case CrossChainErrorCategory.CHAIN_UNAVAILABLE:
        return RefreshCw;
      default:
        return AlertTriangle;
    }
  };

  // Get variant based on category severity
  const getVariant = () => {
    if (!category) return "destructive";

    switch (category) {
      case CrossChainErrorCategory.CONNECTION_FAILURE:
      case CrossChainErrorCategory.NETWORK_FAILURE:
      case CrossChainErrorCategory.RATE_LIMIT_EXCEEDED:
      case CrossChainErrorCategory.NODE_SYNCING:
        return "default"; // Less severe
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
      case CrossChainErrorCategory.VERIFICATION_TIMEOUT:
        return "destructive"; // More severe
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return "destructive"; // Most severe
      default:
        return "default";
    }
  };

  const Icon = getIcon();
  const variant = getVariant();

  // Format error timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Alert variant={variant} className="mb-4 border-2">
      <Icon className="h-5 w-5" />
      <AlertTitle className="ml-2">{title || "Error Encountered"}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="text-sm mt-2">{message}</div>
        
        {blockchain && (
          <div className="text-xs mt-2 flex items-center">
            <span className="font-semibold mr-1">Blockchain:</span> 
            <span className="bg-[#1A1A1A] px-2 py-0.5 rounded">{blockchain}</span>
          </div>
        )}
        
        {solution && (
          <div className="text-xs mt-2">
            <span className="font-semibold">Suggested Action:</span> {solution}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {retry && (
            <Button size="sm" variant="outline" onClick={retry} className="h-8">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          
          {contact && (
            <Button size="sm" variant="outline" onClick={contact} className="h-8">
              <HelpCircle className="h-3 w-3 mr-1" />
              Get Support
            </Button>
          )}
          
          {details && (
            <Collapsible open={showDetails} onOpenChange={setShowDetails} className="w-full mt-2">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="h-8 text-xs">
                  {showDetails ? "Hide Technical Details" : "Show Technical Details"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="text-xs bg-[#121212] p-2 rounded border border-[#333] font-mono overflow-x-auto">
                  {errorCode && <div className="mb-1"><span className="opacity-70">Error Code:</span> {errorCode}</div>}
                  {timestamp && <div className="mb-1"><span className="opacity-70">Time:</span> {formatTimestamp(timestamp)}</div>}
                  {typeof details === 'object' ? (
                    <pre>{JSON.stringify(details, null, 2)}</pre>
                  ) : (
                    <div>{String(details)}</div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}