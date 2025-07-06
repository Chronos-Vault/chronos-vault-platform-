import React from 'react';
import { BlockchainType } from '@/lib/cross-chain/interfaces';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Shield } from 'lucide-react';

type ChainResult = {
  chain: BlockchainType;
  status: 'success' | 'warning' | 'error';
  message: string;
  confirmations?: number;
  data?: any;
};

type CrossChainVerificationResultsProps = {
  verified: boolean;
  verificationChains: BlockchainType[];
  consistency: number;
  chainResults: ChainResult[];
  details: any;
};

export const CrossChainVerificationResults: React.FC<CrossChainVerificationResultsProps> = ({
  verified,
  verificationChains,
  consistency,
  chainResults,
  details
}) => {
  // Get status icon based on result status
  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Get status color based on result status
  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return '';
    }
  };

  // Get chain color based on chain type
  const getChainColor = (chain: BlockchainType) => {
    switch (chain) {
      case 'ETH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'SOL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'TON':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  // Get security level badge color
  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'Maximum':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100';
      case 'High':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Standard':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Cross-Chain Verification Results</CardTitle>
            <CardDescription>
              Transaction verification across multiple blockchains
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getSecurityLevelColor(details.securityLevel)}>
              {details.securityLevel} Security
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {consistency}% Consistency
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className={verified ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}>
          <div className="flex items-center gap-2">
            {verified ? 
              <Shield className="h-6 w-6 text-green-500" /> : 
              <AlertTriangle className="h-6 w-6 text-red-500" />
            }
            <AlertTitle className={verified ? 'text-green-700' : 'text-red-700'}>
              {verified ? 'Transaction Verified' : 'Verification Failed'}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            {verified 
              ? `Transaction has been verified across ${verificationChains.length} blockchains with ${details.primaryChainConfirmations} confirmations on the primary chain.` 
              : details.error || 'Could not verify transaction across multiple blockchains.'}
          </AlertDescription>
        </Alert>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Chain Verification Status</h3>
          <div className="space-y-3">
            {chainResults.map((result, index) => (
              <div 
                key={`${result.chain}-${index}`} 
                className={`p-3 rounded-md ${getStatusColor(result.status)} border ${result.status === 'success' ? 'border-green-200' : result.status === 'warning' ? 'border-yellow-200' : 'border-red-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <Badge className={getChainColor(result.chain)}>
                      {result.chain}
                    </Badge>
                    <span className="font-medium">{result.message}</span>
                  </div>
                  {result.confirmations && (
                    <Badge variant="outline">
                      {result.confirmations} {result.confirmations === 1 ? 'confirmation' : 'confirmations'}
                    </Badge>
                  )}
                </div>
                {result.data && (
                  <div className="mt-2 text-xs opacity-75">
                    {Object.entries(result.data).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="font-semibold">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 flex justify-between items-center">
        <div>
          Method: {details.verificationMethod}
        </div>
        <div>
          Timestamp: {new Date(details.timestamp).toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
};
