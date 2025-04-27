/**
 * ProofVerificationSummary Component
 * 
 * This component displays a summary of vault verification status
 * and cryptographic proof history.
 */

import { ShieldCheck, Fingerprint, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { VerificationStatus } from '@/hooks/use-proof-verification';

// Sample data structure for verification history
interface VerificationHistoryItem {
  timestamp: string;
  proofId: string;
  status: VerificationStatus;
  verifierId?: number;
  details?: string;
}

interface ProofVerificationSummaryProps {
  vaultId: number;
  lastVerified?: string;
  merkleRoot?: string;
  verificationStatus?: VerificationStatus;
  verificationHistory?: VerificationHistoryItem[];
  blockchainReferences?: Array<{
    chain: string;
    blockHeight: number;
    transactionHash?: string;
  }>;
}

export function ProofVerificationSummary({
  vaultId,
  lastVerified,
  merkleRoot,
  verificationStatus = VerificationStatus.PENDING,
  verificationHistory = [],
  blockchainReferences = []
}: ProofVerificationSummaryProps) {
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status color
  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return 'bg-green-500 hover:bg-green-600';
      case VerificationStatus.PENDING:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case VerificationStatus.FAILED:
        return 'bg-red-500 hover:bg-red-600';
      case VerificationStatus.EXPIRED:
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };
  
  // Shorten hash for display
  const shortenHash = (hash?: string) => {
    if (!hash) return 'Unknown';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <Card className="w-full shadow-sm border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          Vault Verification Summary
        </CardTitle>
        <CardDescription>
          Cryptographic proof of vault integrity and chain of custody
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex justify-between items-center border-b border-border/30 pb-3">
            <div className="text-sm font-medium">Current Status</div>
            <Badge className={getStatusColor(verificationStatus)}>
              {verificationStatus}
            </Badge>
          </div>
          
          {/* Last Verified */}
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">Last Verified</div>
            <div className="font-medium">{formatDate(lastVerified || '')}</div>
          </div>
          
          {/* Merkle Root */}
          {merkleRoot && (
            <div className="flex justify-between items-center text-sm">
              <div className="text-muted-foreground">Merkle Root</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="font-mono text-xs bg-primary/5 px-2 py-1 rounded flex items-center">
                      <Fingerprint className="w-3 h-3 mr-1 text-purple-500" />
                      {shortenHash(merkleRoot)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-mono text-xs break-all max-w-xs">{merkleRoot}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {/* Blockchain References */}
          {blockchainReferences && blockchainReferences.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Blockchain References</h4>
              <div className="space-y-2">
                {blockchainReferences.map((ref, index) => (
                  <div key={index} className="bg-primary/5 rounded-md p-2 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Chain</span>
                      <span className="font-medium">{ref.chain}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">Block</span>
                      <span>{ref.blockHeight.toLocaleString()}</span>
                    </div>
                    {ref.transactionHash && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Tx Hash</span>
                        <a 
                          href={`https://${ref.chain.toLowerCase() === 'ton' ? 'tonviewer.com' : 'etherscan.io'}/tx/${ref.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-purple-500 hover:text-purple-600"
                        >
                          {shortenHash(ref.transactionHash)}
                          <LinkIcon className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Verification History */}
          {verificationHistory && verificationHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Verification History</h4>
              <div className="text-xs space-y-2">
                {verificationHistory.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between py-1 border-b border-border/20 last:border-0">
                    <div className="text-muted-foreground">{formatDate(item.timestamp)}</div>
                    <Badge className={`${getStatusColor(item.status)} text-[10px] px-1.5`}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Warning for unverified vaults */}
          {verificationStatus !== VerificationStatus.VERIFIED && (
            <div className="mt-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start text-xs">
              <AlertCircle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-600 dark:text-yellow-400">Verification Required</p>
                <p className="mt-1 text-muted-foreground">
                  This vault hasn't been verified recently. Regular verification ensures 
                  the integrity of vault assets and guarantees they haven't been tampered with.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}