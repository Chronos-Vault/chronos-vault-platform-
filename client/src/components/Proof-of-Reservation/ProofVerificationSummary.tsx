/**
 * ProofVerificationSummary Component
 * 
 * A component that displays a summary of the latest verification status
 * and history for a vault.
 */

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Shield, 
  Calendar,
  FileText
} from 'lucide-react';
import { ProofRecord, VerificationStatus, ProofType } from '@/hooks/use-proof-verification';

interface ProofVerificationSummaryProps {
  proofRecord?: ProofRecord | null;
  vaultId: number;
  className?: string;
}

export function ProofVerificationSummary({ proofRecord, vaultId, className = '' }: ProofVerificationSummaryProps) {
  if (!proofRecord) {
    return (
      <Card className={`bg-[#1E1E1E] border-[#333333] ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-[#6B00D7]" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center py-4">
            <div className="w-12 h-12 bg-[#121212] rounded-full flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium">No Verification History</p>
            <p className="text-xs text-gray-400 mt-1">
              Generate a proof to verify your vault assets
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (proofRecord.status) {
      case VerificationStatus.VERIFIED:
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case VerificationStatus.FAILED:
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case VerificationStatus.EXPIRED:
        return <Calendar className="h-6 w-6 text-amber-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (proofRecord.status) {
      case VerificationStatus.VERIFIED:
        return "Vault Verified";
      case VerificationStatus.FAILED:
        return "Verification Failed";
      case VerificationStatus.EXPIRED:
        return "Proof Expired";
      default:
        return "Pending Verification";
    }
  };

  const getProofTypeName = (type: ProofType | string) => {
    switch (type) {
      case ProofType.MERKLE:
        return "Merkle Proof";
      case ProofType.CROSS_CHAIN:
        return "Cross-Chain Proof";
      case ProofType.ZK:
        return "Zero-Knowledge Proof";
      default:
        return type;
    }
  };

  const getStatusBadge = () => {
    switch (proofRecord.status) {
      case VerificationStatus.VERIFIED:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case VerificationStatus.FAILED:
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case VerificationStatus.EXPIRED:
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className={`bg-[#1E1E1E] border-[#333333] ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-[#6B00D7]" />
            Verification Status
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#121212] rounded-full flex items-center justify-center">
              {getStatusIcon()}
            </div>
            <div>
              <h3 className="font-medium">{getStatusText()}</h3>
              <p className="text-xs text-gray-400">
                Last updated: {new Date(proofRecord.verifiedAt || proofRecord.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-[#121212] rounded-lg p-3 border border-[#333333]">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-gray-400">Proof ID:</div>
              <div className="font-mono text-xs truncate">{proofRecord.id.substring(0, 12)}...</div>
              
              <div className="text-gray-400">Type:</div>
              <div>{getProofTypeName(proofRecord.proofType)}</div>
              
              <div className="text-gray-400">Created:</div>
              <div>{new Date(proofRecord.createdAt).toLocaleDateString()}</div>
              
              {proofRecord.expiresAt && (
                <>
                  <div className="text-gray-400">Expires:</div>
                  <div>{new Date(proofRecord.expiresAt).toLocaleDateString()}</div>
                </>
              )}
              
              {proofRecord.blockchains && proofRecord.blockchains.length > 0 && (
                <>
                  <div className="text-gray-400">Blockchains:</div>
                  <div>{proofRecord.blockchains.join(', ')}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}