import React from 'react';
import { TonTransactionHandler } from '@/components/ton/TonTransactionHandler';
import { TransactionErrorHandler } from '@/components/transactions/TransactionErrorHandler';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShieldCheck, Fingerprint, Radio } from 'lucide-react';

/**
 * TON Security Features Page
 * 
 * Showcases the advanced security measures implemented for TON blockchain transactions
 * including geolocation verification, multi-signature authentication, and cross-chain
 * security verification.
 */
const TonSecurityPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">TON Security Features</h1>
        <p className="text-muted-foreground">
          Advanced security measures for TON blockchain transactions with comprehensive error handling
        </p>
      </div>
      
      {/* Display transaction errors if any */}
      <TransactionErrorHandler position="top" />
      
      <div className="mb-6">
        <TonTransactionHandler />
      </div>
      
      {/* Security Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              Multi-Signature Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Enhanced security requiring multiple authorized signatures for sensitive operations, with integrated error handling for incomplete signature sets.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-purple-400" />
              Geolocation Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Location-based authentication to ensure vault operations are performed from authorized physical locations with configurable geographic boundaries.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-purple-400" />
              Device Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Trusted device verification through biometric and cryptographic signatures, preventing unauthorized access even with stolen credentials.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Security Warning */}
      <Card className="border border-amber-500/20 bg-amber-950/10 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Security Testing Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-amber-200/60">
            This demonstrates TON transaction security features and error handling.
            In a production environment, these security measures are enforced by TON smart contracts
            across all 19 vault types supported by Chronos Vault.
          </CardDescription>
        </CardContent>
      </Card>
      
    </div>
  );
};

export default TonSecurityPage;