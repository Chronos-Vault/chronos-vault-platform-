/**
 * Proof History Display Component
 * 
 * This component displays a history of generated zero-knowledge proofs
 * with detailed information and verification options.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Check, AlertTriangle, FileText, Shield, RefreshCw, Loader2, Copy } from 'lucide-react';
import { ZkProof, ZkProofStatus } from '@/lib/privacy/zk-proof-service';
import { getPrivacyLayerService } from '@/lib/privacy';
import { useToast } from '@/hooks/use-toast';

interface ProofHistoryDisplayProps {
  vaultId?: string;
  proofs?: ZkProof[];
  onVerify?: (proofId: string) => void;
  className?: string;
}

export function ProofHistoryDisplay({ 
  vaultId, 
  proofs: initialProofs,
  onVerify,
  className 
}: ProofHistoryDisplayProps) {
  const [proofs, setProofs] = useState<ZkProof[]>(initialProofs || []);
  const [loading, setLoading] = useState(!initialProofs && !!vaultId);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedProofId, setExpandedProofId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (vaultId && !initialProofs) {
      loadProofs(vaultId);
    }
  }, [vaultId, initialProofs]);

  const loadProofs = async (id: string) => {
    setLoading(true);
    try {
      const privacyService = getPrivacyLayerService();
      const vaultProofs = await privacyService.getZkProofService().getProofsForVault(id);
      setProofs(vaultProofs);
    } catch (error) {
      console.error('Error loading proofs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!vaultId) return;
    
    setRefreshing(true);
    await loadProofs(vaultId);
    setRefreshing(false);
  };

  const handleVerify = async (proofId: string) => {
    if (onVerify) {
      onVerify(proofId);
      return;
    }

    // Default verification if no onVerify handler provided
    try {
      const privacyService = getPrivacyLayerService();
      const proof = proofs.find(p => p.id === proofId);
      
      if (!proof) return;
      
      const result = await privacyService.verifyProofOnBlockchain(proofId, proof.blockchain);
      
      if (result.isValid) {
        toast({
          title: 'Proof Verified',
          description: 'The zero-knowledge proof is valid.',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Verification Failed',
          description: result.details || 'The proof could not be verified.',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Verification Error',
        description: error.message || 'An error occurred during verification',
        variant: 'destructive'
      });
    }
  };

  const handleCopyProofId = (proofId: string) => {
    navigator.clipboard.writeText(proofId);
    toast({
      title: 'Copied to Clipboard',
      description: 'Proof ID has been copied',
      variant: 'default'
    });
  };

  const toggleExpand = (proofId: string) => {
    setExpandedProofId(expandedProofId === proofId ? null : proofId);
  };

  const getStatusIcon = (status: ZkProofStatus) => {
    switch (status) {
      case ZkProofStatus.VERIFIED:
        return <Check className="h-4 w-4 text-green-500" />;
      case ZkProofStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case ZkProofStatus.EXPIRED:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case ZkProofStatus.REJECTED:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-10 ${className || ''}`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading proof history...</p>
        </div>
      </div>
    );
  }

  if (proofs.length === 0) {
    return (
      <div className={`bg-muted/30 rounded-lg p-6 text-center ${className || ''}`}>
        <Shield className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-foreground mb-2">No Proofs Found</h4>
        <p className="text-muted-foreground max-w-md mx-auto mb-4">
          {vaultId
            ? "There are no zero-knowledge proofs generated for this vault yet."
            : "Select a vault and generate a proof to get started."}
        </p>
        {vaultId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#9242FC]" />
          <span>Proof History</span>
        </h3>
        {vaultId && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {proofs.map((proof) => (
            <Card key={proof.id} className="bg-background border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={
                            proof.status === ZkProofStatus.VERIFIED ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' :
                            proof.status === ZkProofStatus.PENDING ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' :
                            proof.status === ZkProofStatus.EXPIRED ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20' :
                            'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                          }
                        >
                          <div className="flex items-center gap-1">
                            {getStatusIcon(proof.status)}
                            <span>{proof.status.toUpperCase()}</span>
                          </div>
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(proof.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground text-sm">
                          {proof.id.substring(0, 18)}...
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyProofId(proof.id)}
                        >
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Type: {proof.proofType}</span>
                        <span>•</span>
                        <span>Chain: {proof.blockchain}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(proof.id)}
                      >
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleExpand(proof.id)}
                      >
                        {expandedProofId === proof.id ? 'Hide' : 'Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedProofId === proof.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Created At</p>
                          <p>{new Date(proof.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expires At</p>
                          <p>{new Date(proof.expiresAt).toLocaleString()}</p>
                        </div>
                        {proof.verifiedAt && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Verified At</p>
                            <p>{new Date(proof.verifiedAt).toLocaleString()}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Blockchain</p>
                          <p>{proof.blockchain}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Public Inputs</p>
                        <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto mt-1 max-h-24">
                          {JSON.stringify(proof.publicInputs, null, 2)}
                        </pre>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyProofId(proof.id)}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                          Copy Proof ID
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
