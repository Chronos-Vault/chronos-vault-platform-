/**
 * ProofVerificationCard Component
 * 
 * A card component that allows users to generate and verify cryptographic
 * proofs for their vaults, demonstrating that funds are safely locked without
 * revealing sensitive data.
 */

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Shield, CheckCircle2, AlertTriangle, Clock, FileText, RefreshCw } from 'lucide-react';
import { useProofVerification, ProofType, VerificationStatus } from '@/hooks/use-proof-verification';

interface ProofVerificationCardProps {
  vaultId: number;
  className?: string;
}

export function ProofVerificationCard({ vaultId, className = '' }: ProofVerificationCardProps) {
  const [selectedProofType, setSelectedProofType] = useState<string>(ProofType.MERKLE);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  
  const {
    proofRecord,
    isGenerating,
    isVerifying,
    error,
    generateProof,
    verifyProof,
    resetState
  } = useProofVerification();
  
  const handleGenerateProof = async () => {
    setVerificationStep(1);
    await generateProof(vaultId, selectedProofType);
    setVerificationStep(2);
  };
  
  const handleVerifyProof = async () => {
    if (!proofRecord) return;
    
    setVerificationStep(3);
    const success = await verifyProof(proofRecord.id, vaultId);
    if (success) {
      setVerificationStep(4);
    } else {
      setVerificationStep(2);
    }
  };
  
  const handleStartOver = () => {
    resetState();
    setVerificationStep(0);
  };
  
  const renderStatusBadge = () => {
    if (!proofRecord) return null;
    
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-[#6B00D7]" />
            Proof of Reservation
          </CardTitle>
          
          {proofRecord && renderStatusBadge()}
        </div>
        <CardDescription>
          Verify that your assets are securely locked in the vault with cryptographic proof
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {verificationStep === 0 && (
          <>
            <div className="bg-[#121212] rounded-lg p-4 border border-[#333333]">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-[#6B00D7]/10 h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-[#6B00D7]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Generate Cryptographic Proof</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    Generate a cryptographic proof that confirms your assets are safely stored without revealing sensitive details.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Proof Type</label>
              <Select onValueChange={(value) => setSelectedProofType(value)} defaultValue={ProofType.MERKLE}>
                <SelectTrigger className="bg-[#121212] border-[#333333]">
                  <SelectValue placeholder="Select a proof type" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] border-[#333333]">
                  <SelectItem value={ProofType.MERKLE}>Merkle Proof</SelectItem>
                  <SelectItem value={ProofType.CROSS_CHAIN}>Cross-Chain Proof</SelectItem>
                  <SelectItem value={ProofType.ZK}>Zero-Knowledge Proof</SelectItem>
                </SelectContent>
              </Select>
              
              <p className="text-xs text-gray-400 mt-1">
                {selectedProofType === ProofType.MERKLE && "Merkle proofs verify the inclusion of your assets in the vault without revealing other vault contents."}
                {selectedProofType === ProofType.CROSS_CHAIN && "Cross-chain proofs verify your assets across multiple blockchains for enhanced security."}
                {selectedProofType === ProofType.ZK && "Zero-knowledge proofs verify your assets without revealing any information about them."}
              </p>
            </div>
          </>
        )}
        
        {verificationStep > 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Verification Progress</span>
                <span className="text-[#FF5AF7]">{verificationStep}/4</span>
              </div>
              <Progress value={verificationStep * 25} className="h-2 bg-[#333333]" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`rounded-full p-1 ${verificationStep >= 1 ? 'bg-[#6B00D7] text-white' : 'bg-[#333333] text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${verificationStep >= 1 ? 'text-white' : 'text-gray-400'}`}>
                    Generating {selectedProofType} proof
                  </p>
                  {isGenerating && <p className="text-xs text-gray-400 animate-pulse">Processing...</p>}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`rounded-full p-1 ${verificationStep >= 2 ? 'bg-[#6B00D7] text-white' : 'bg-[#333333] text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${verificationStep >= 2 ? 'text-white' : 'text-gray-400'}`}>
                    Proof generated
                  </p>
                  {proofRecord && verificationStep >= 2 && (
                    <p className="text-xs text-gray-400">ID: {proofRecord.id.substring(0, 8)}...</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`rounded-full p-1 ${verificationStep >= 3 ? 'bg-[#6B00D7] text-white' : 'bg-[#333333] text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${verificationStep >= 3 ? 'text-white' : 'text-gray-400'}`}>
                    Verifying proof
                  </p>
                  {isVerifying && <p className="text-xs text-gray-400 animate-pulse">Processing...</p>}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`rounded-full p-1 ${verificationStep >= 4 ? 'bg-green-500 text-white' : 'bg-[#333333] text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${verificationStep >= 4 ? 'text-white' : 'text-gray-400'}`}>
                    Verification complete
                  </p>
                  {proofRecord && proofRecord.status === VerificationStatus.VERIFIED && (
                    <p className="text-xs text-green-400">Verified on {new Date(proofRecord.verifiedAt || '').toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Error: {error}</span>
                </div>
              </div>
            )}
            
            {proofRecord && proofRecord.status === VerificationStatus.VERIFIED && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Vault assets verified! Your assets are securely locked as expected.</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {verificationStep === 0 ? (
          <Button 
            onClick={handleGenerateProof} 
            disabled={isGenerating}
            className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white w-full"
          >
            Generate Proof
          </Button>
        ) : verificationStep === 2 ? (
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleStartOver} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
            <Button 
              onClick={handleVerifyProof} 
              disabled={isVerifying || !proofRecord}
              className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white flex-1"
            >
              Verify Proof
            </Button>
          </div>
        ) : verificationStep === 4 ? (
          <Button variant="outline" onClick={handleStartOver} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Proof
          </Button>
        ) : (
          <Button variant="outline" disabled className="w-full">
            <Clock className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}