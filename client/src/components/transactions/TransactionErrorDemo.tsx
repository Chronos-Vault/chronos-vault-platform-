import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionError } from '@/contexts/transaction-error-context';
import { CrossChainErrorCategory } from '@/components/ui/error-message';
import { AlertCircle, Shield, WifiOff, RefreshCw, ZapOff } from 'lucide-react';

/**
 * Error simulation component for testing error handling
 */
export const TransactionErrorDemo: React.FC = () => {
  const { 
    setTransactionError, 
    clearError, 
    showErrorNotification 
  } = useTransactionError();

  // Function to mock a blockchain network error
  const simulateNetworkError = () => {
    setTransactionError({
      message: "Unable to connect to the Ethereum network. This could be due to network congestion or temporary outage.",
      category: CrossChainErrorCategory.NETWORK_FAILURE,
      blockchain: "Ethereum",
      details: {
        timestamp: Date.now(),
        errorCode: "NET-ETH-NET-0482",
        recoveryFunction: async () => {
          // This would be a real recovery function in a production app
          await new Promise(resolve => setTimeout(resolve, 2000));
          return Promise.resolve();
        }
      }
    });
  };

  // Function to mock a transaction failure
  const simulateTransactionError = () => {
    setTransactionError({
      message: "Your transaction on TON couldn't be completed. This might be due to network issues or insufficient funds.",
      category: CrossChainErrorCategory.TRANSACTION_FAILURE,
      blockchain: "TON",
      txHash: "te6ccgICAQQAAQAAAADgAAAAaW52YWxpZA",
      details: {
        timestamp: Date.now(),
        errorCode: "TRX-TON-TRF-9821",
        errorType: "EXECUTION_FAILURE",
        gasUsed: "0.05 TON",
        reason: "Insufficient funds for transaction execution"
      }
    });
  };

  // Function to mock a security violation
  const simulateSecurityError = () => {
    setTransactionError({
      message: "A security concern was detected while interacting with the blockchain. The operation was halted for your protection.",
      category: CrossChainErrorCategory.SECURITY_VIOLATION,
      blockchain: "Cross-Chain",
      details: {
        timestamp: Date.now(),
        errorCode: "SEC-XCH-SEV-7723",
        anomalyType: "UNUSUAL_ACTIVITY",
        riskLevel: "HIGH"
      }
    });
  };

  // Function to mock a rate limit
  const simulateRateLimitError = () => {
    showErrorNotification(
      "Rate limit exceeded. Please wait a moment before trying again.",
      { title: "Service Limit Reached" }
    );
  };

  return (
    <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Error Handling Demonstration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-800 flex items-center"
            onClick={simulateNetworkError}
          >
            <WifiOff className="h-4 w-4 mr-2 text-red-500" />
            Simulate Network Error
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-800 flex items-center"
            onClick={simulateTransactionError}
          >
            <ZapOff className="h-4 w-4 mr-2 text-amber-500" />
            Simulate Transaction Error
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-800 flex items-center"
            onClick={simulateSecurityError}
          >
            <Shield className="h-4 w-4 mr-2 text-red-700" />
            Simulate Security Alert
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-800 flex items-center"
            onClick={simulateRateLimitError}
          >
            <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
            Simulate Rate Limit
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-800 flex items-center"
            onClick={clearError}
          >
            <RefreshCw className="h-4 w-4 mr-2 text-green-500" />
            Clear Errors
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};