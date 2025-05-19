import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionErrorAlert } from '@/components/transactions/TransactionErrorAlert';
import { useTonTransactionError } from '@/hooks/use-ton-transaction-error';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { Activity, Shield, MapPin, Users } from 'lucide-react';

/**
 * Component for demonstrating TON transaction error handling capabilities
 */
export const TonTransactionHandler: React.FC = () => {
  const {
    isProcessing,
    handleTonError,
    handleMultiSigError,
    handleGeoLocationError,
    executeTonTransaction,
    clearTonError
  } = useTonTransactionError();

  const [error, setError] = useState<{
    message: string;
    category?: CrossChainErrorCategory;
    txHash?: string;
  } | null>(null);

  // Simulate a successful TON transaction
  const handleSuccessTransaction = async () => {
    const result = await executeTonTransaction(
      async () => {
        // Simulate successful TON transaction
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { 
          txHash: 'te6ccgEBAgEAkwABRYgAtt7QXvepPuHsp2py+DPsWYlP9YjlUubKkp43nrORu/rreMhMZRrB',
          status: 'success'
        };
      },
      {
        operation: 'Transfer TON',
        getTxHash: (result) => result.txHash,
        onSuccess: () => {
          // Clear any previous errors
          setError(null);
        }
      }
    );

    console.log('Transaction result:', result);
  };

  // Simulate a failed TON transaction
  const handleFailedTransaction = async () => {
    const result = await executeTonTransaction(
      async () => {
        // Simulate failed TON transaction
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('Insufficient TON balance for transaction');
      },
      {
        operation: 'Transfer TON',
        onSuccess: () => {
          // This won't be called due to the error
          setError(null);
        }
      }
    );

    // Set error for demonstration
    if (!result) {
      setError({
        message: 'Not enough TON to complete this transaction.',
        category: CrossChainErrorCategory.TRANSACTION_FAILURE,
        txHash: 'te6ccgEBAQEAOgAAcGbXU4oRYFHLTZG3XlBKZD0PDzSiL'
      });
    }
  };

  // Simulate a multi-signature verification error
  const handleMultiSignatureError = () => {
    handleMultiSigError(
      new Error('Multi-signature requirement not met'),
      {
        txHash: 'te6ccgEBAgEAhQABUlkl7SuBoRdfEjpBrjXsXWxUB0',
        operation: 'Vault Access',
        requiredSignatures: 3,
        currentSignatures: 1,
        recoveryFunction: async () => {
          console.log('Attempting recovery for multi-signature verification...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          clearTonError();
        }
      }
    );

    setError({
      message: 'Multi-signature requirement not met: 1 of 3 signatures received.',
      category: CrossChainErrorCategory.VALIDATION_FAILURE,
      txHash: 'te6ccgEBAgEAhQABUlkl7SuBoRdfEjpBrjXsXWxUB0',
    });
  };

  // Simulate a geolocation verification error
  const handleGeolocationError = () => {
    handleGeoLocationError(
      new Error('Geolocation verification failed'),
      {
        txHash: 'te6ccgEBAgEAjAABW5tHb0vgdsaE0SpP7CYL93uKIg',
        operation: 'Geo-Restricted Vault Access',
        requiredLocation: 'New York, USA',
        actualLocation: 'Unknown location',
        recoveryFunction: async () => {
          console.log('Attempting recovery for geolocation verification...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          clearTonError();
        }
      }
    );

    setError({
      message: 'Geolocation verification failed. You must be in New York, USA to complete this operation.',
      category: CrossChainErrorCategory.SECURITY_VIOLATION,
      txHash: 'te6ccgEBAgEAjAABW5tHb0vgdsaE0SpP7CYL93uKIg',
    });
  };

  // Clear all errors
  const handleClearErrors = () => {
    clearTonError();
    setError(null);
  };

  return (
    <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-400" />
          TON Transaction Security Handler
        </CardTitle>
        <CardDescription>
          Test TON-specific transaction handling with advanced security features
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <TransactionErrorAlert
            error={error}
            blockchain="TON"
            isRecovering={isProcessing}
          />
        )}
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/30 rounded-md border border-gray-800">
              <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Basic Transaction Operations
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Standard TON transaction handling with built-in error recovery
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-black/20 border-gray-800"
                  onClick={handleSuccessTransaction}
                  disabled={isProcessing}
                >
                  Simulate Success
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-black/20 border-gray-800"
                  onClick={handleFailedTransaction}
                  disabled={isProcessing}
                >
                  Simulate Failure
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-black/30 rounded-md border border-gray-800">
              <h3 className="text-sm font-medium text-purple-400 mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Advanced Security Features
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Enhanced TON security capabilities with cross-chain verification
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-black/20 border-gray-800 flex items-center"
                  onClick={handleMultiSignatureError}
                  disabled={isProcessing}
                >
                  <Users className="h-3 w-3 mr-1" />
                  Multi-Signature Error
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-black/20 border-gray-800 flex items-center"
                  onClick={handleGeolocationError}
                  disabled={isProcessing}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  Geolocation Error
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearErrors}
          className="ml-auto"
        >
          Clear All Errors
        </Button>
      </CardFooter>
    </Card>
  );
};