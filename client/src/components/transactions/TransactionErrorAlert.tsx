import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface TransactionErrorAlertProps {
  error: {
    message: string;
    category?: CrossChainErrorCategory;
    txHash?: string;
  };
  blockchain?: string;
  isRecovering?: boolean;
  onRetry?: () => void;
  onViewDetails?: () => void;
}

/**
 * A specialized alert component for transaction errors
 */
export const TransactionErrorAlert: React.FC<TransactionErrorAlertProps> = ({
  error,
  blockchain,
  isRecovering = false,
  onRetry,
  onViewDetails
}) => {
  const getSeverityColor = () => {
    switch (error.category) {
      case CrossChainErrorCategory.SECURITY_VIOLATION:
        return 'bg-red-500/10 border-red-500 text-red-500';
      case CrossChainErrorCategory.TRANSACTION_FAILURE:
      case CrossChainErrorCategory.VALIDATION_FAILURE:
        return 'bg-amber-500/10 border-amber-500 text-amber-500';
      case CrossChainErrorCategory.CONNECTION_FAILURE:
      case CrossChainErrorCategory.NETWORK_FAILURE:
        return 'bg-blue-500/10 border-blue-500 text-blue-500';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-400';
    }
  };

  return (
    <Alert className={`${getSeverityColor()} my-4`}>
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle className="text-base">
        Transaction Error {blockchain ? `on ${blockchain}` : ''}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error.message}</p>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              disabled={isRecovering}
              className="bg-black/20 hover:bg-black/30"
            >
              <RefreshCw className={`h-3 w-3 mr-1.5 ${isRecovering ? 'animate-spin' : ''}`} />
              {isRecovering ? 'Recovering...' : 'Try Again'}
            </Button>
          )}
          
          {error.txHash && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-black/20 hover:bg-black/30"
              onClick={() => {
                // Open explorer based on blockchain
                const url = getExplorerUrl(error.txHash, blockchain);
                if (url) window.open(url, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1.5" />
              View on Explorer
            </Button>
          )}
          
          {onViewDetails && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-black/20 hover:bg-black/30"
              onClick={onViewDetails}
            >
              More Details
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

/**
 * Helper function to get the appropriate blockchain explorer URL
 */
function getExplorerUrl(txHash: string, blockchain?: string): string | null {
  if (!txHash) return null;

  switch (blockchain?.toLowerCase()) {
    case 'ethereum':
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case 'solana':
      return `https://explorer.solana.com/tx/${txHash}?cluster=devnet`;
    case 'ton':
      return `https://testnet.tonscan.org/tx/${txHash}`;
    case 'bitcoin':
      return `https://www.blockchain.com/explorer/transactions/btc-testnet/${txHash}`;
    default:
      return null;
  }
}