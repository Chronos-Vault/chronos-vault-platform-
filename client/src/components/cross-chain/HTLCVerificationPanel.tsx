/**
 * HTLC Verification Panel
 * 
 * A component that verifies the status of Hash Time Locked Contracts across different blockchains
 * to ensure their integrity in a cross-chain atomic swap.
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BlockchainType } from "@/contexts/multi-chain-context";
import { SwapStatus } from "@/lib/cross-chain/atomic-swap-service";
import { HTLCStatus } from "@/lib/cross-chain/htlc-interface";
import { ArrowLeftRight, CheckCircle2, AlertCircle, Clock, Lock, Shield, RefreshCcw, Loader2 } from "lucide-react";
import { SiEthereum, SiSolana, SiTon } from "react-icons/si";

interface HTLCVerificationPanelProps {
  swapId?: string;
  sourceChain: BlockchainType;
  destinationChain: BlockchainType;
  sourceContractId?: string;
  destinationContractId?: string;
  swapStatus: SwapStatus;
  onVerify?: () => void;
  className?: string;
}

export function HTLCVerificationPanel({
  swapId = "",
  sourceChain,
  destinationChain,
  sourceContractId,
  destinationContractId,
  swapStatus,
  onVerify,
  className = ""
}: HTLCVerificationPanelProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{
    sourceStatus: HTLCStatus | null;
    destinationStatus: HTLCStatus | null;
    hashMatch: boolean | null;
    timelocksValid: boolean | null;
    securityScore: number;
    issues: string[];
  }>({
    sourceStatus: null,
    destinationStatus: null,
    hashMatch: null,
    timelocksValid: null,
    securityScore: 0,
    issues: []
  });

  // Function to verify the HTLC contracts with Trinity Protocol v3.0
  const verifyContracts = async () => {
    setIsVerifying(true);
    setVerificationComplete(false);
    
    try {
      // Query Trinity Protocol v3.0 contract at 0x4a8Bc58f441Ae7E7eC2879e434D9D7e31CF80e30
      const response = await fetch('/api/htlc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId,
          sourceChain,
          destinationChain,
          sourceContractId,
          destinationContractId
        })
      });

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map backend response to verification results
      const results = {
        sourceStatus: data.sourceStatus || HTLCStatus.INACTIVE,
        destinationStatus: data.destinationStatus || HTLCStatus.INACTIVE,
        hashMatch: data.hashMatch ?? null,
        timelocksValid: data.timelocksValid ?? null,
        securityScore: data.securityScore || 0,
        issues: data.issues || []
      };
      
      // Add Trinity Protocol consensus verification
      if (data.trinityConsensus) {
        results.securityScore += 10; // Bonus for 2-of-3 consensus
        if (data.trinityConsensus.achieved) {
          results.issues.push(`✅ Trinity 2-of-3 Consensus: ${data.trinityConsensus.count}/3 chains`);
        }
      }
      
      setVerificationResults(results);
      setVerificationComplete(true);
      
      if (onVerify) {
        onVerify();
      }
    } catch (error) {
      console.error("Error verifying contracts:", error);
      setVerificationResults({
        sourceStatus: null,
        destinationStatus: null,
        hashMatch: null,
        timelocksValid: null,
        securityScore: 0,
        issues: ["Verification failed: " + (error instanceof Error ? error.message : String(error))]
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper to get blockchain icon
  const getBlockchainIcon = (chain: BlockchainType) => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return <SiEthereum className="h-4 w-4" />;
      case BlockchainType.SOLANA:
        return <SiSolana className="h-4 w-4" />;
      case BlockchainType.TON:
        return <SiTon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Helper to get blockchain name
  const getBlockchainName = (chain: BlockchainType) => {
    switch (chain) {
      case BlockchainType.ETHEREUM:
        return "Ethereum";
      case BlockchainType.SOLANA:
        return "Solana";
      case BlockchainType.TON:
        return "TON";
      default:
        return "Unknown";
    }
  };

  // Helper to get status badge
  const getStatusBadge = (status: HTLCStatus | null) => {
    if (status === null) {
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
          Unknown
        </Badge>
      );
    }

    switch (status) {
      case HTLCStatus.INACTIVE:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
            Inactive
          </Badge>
        );
      case HTLCStatus.ACTIVE:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            Active
          </Badge>
        );
      case HTLCStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            Completed
          </Badge>
        );
      case HTLCStatus.REFUNDED:
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
            Refunded
          </Badge>
        );
      case HTLCStatus.EXPIRED:
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
            Unknown
          </Badge>
        );
    }
  };

  // Helper to get security score color
  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-lime-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-400";
  };

  // Helper to get security score progress color
  const getSecurityScoreProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-lime-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <Card className={`border border-[#8B00D7]/20 bg-gradient-to-r from-[#1A1A1A] to-[#231A2A] ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-[#8B00D7] font-semibold flex items-center gap-2">
          Cross-Chain Verification
          <Shield className="h-5 w-5 text-[#8B00D7]" />
        </CardTitle>
        <CardDescription className="text-gray-300">
          Verify the integrity and security of your atomic swap contracts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {swapId && (
          <div className="flex items-center justify-between p-3 bg-[#8B00D7]/5 border border-[#8B00D7]/20 rounded-md">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-[#8B00D7]" />
              <span className="text-sm">Swap ID:</span>
            </div>
            <div className="flex items-center space-x-2">
              <Input 
                value={swapId}
                readOnly
                className="h-8 bg-black/30 border-[#8B00D7]/20 text-xs font-mono w-44"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center py-2">
          <div className="relative flex items-center w-full max-w-xs">
            <div className="flex flex-col items-center z-10 bg-black/40 p-2 rounded-full border border-[#8B00D7]/30">
              {getBlockchainIcon(sourceChain)}
              <span className="text-xs mt-1">{getBlockchainName(sourceChain)}</span>
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-[#8B00D7] to-[#FF5AF7] mx-1"></div>
            <div className="absolute inset-x-0 flex justify-center">
              <div className="bg-black/60 p-1 rounded-full border border-[#8B00D7]/30 z-20">
                <ArrowLeftRight className="h-4 w-4 text-[#FF5AF7]" />
              </div>
            </div>
            <div className="flex flex-col items-center z-10 bg-black/40 p-2 rounded-full border border-[#FF5AF7]/30">
              {getBlockchainIcon(destinationChain)}
              <span className="text-xs mt-1">{getBlockchainName(destinationChain)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          <div className="p-3 bg-black/20 border border-[#8B00D7]/20 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium">Source Contract</h3>
              {isVerifying ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                getStatusBadge(verificationResults.sourceStatus)
              )}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {sourceContractId ? sourceContractId : "Not created yet"}
            </div>
          </div>

          <div className="p-3 bg-black/20 border border-[#FF5AF7]/20 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-medium">Destination Contract</h3>
              {isVerifying ? (
                <Skeleton className="h-6 w-20" />
              ) : (
                getStatusBadge(verificationResults.destinationStatus)
              )}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {destinationContractId ? destinationContractId : "Not created yet"}
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/20 border border-[#8B00D7]/20 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Security Score</h3>
            {isVerifying ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <div className={`text-xl font-bold ${getSecurityScoreColor(verificationResults.securityScore)}`}>
                {verificationResults.securityScore}%
              </div>
            )}
          </div>
          
          {isVerifying ? (
            <Skeleton className="h-2 w-full my-2" />
          ) : (
            <Progress 
              value={verificationResults.securityScore} 
              className={`h-2 ${getSecurityScoreProgressColor(verificationResults.securityScore)}`} 
            />
          )}
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 flex items-center justify-center">
                {isVerifying ? (
                  <Skeleton className="h-4 w-4 rounded-full" />
                ) : verificationResults.hashMatch === true ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : verificationResults.hashMatch === false ? (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <span className="text-xs">Hash Integrity Check</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 flex items-center justify-center">
                {isVerifying ? (
                  <Skeleton className="h-4 w-4 rounded-full" />
                ) : verificationResults.timelocksValid === true ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : verificationResults.timelocksValid === false ? (
                  <AlertCircle className="h-4 w-4 text-red-400" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <span className="text-xs">Timelock Configuration</span>
            </div>
          </div>
        </div>

        {verificationComplete && verificationResults.issues.length > 0 && (
          <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-md">
            <h3 className="text-xs font-medium text-red-400 mb-2">Issues Found:</h3>
            <ul className="space-y-1">
              {verificationResults.issues.map((issue, index) => (
                <li key={index} className="text-xs text-red-300 flex items-start space-x-2">
                  <AlertCircle className="h-3 w-3 text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={verifyContracts} 
          disabled={isVerifying}
          className="w-full bg-[#8B00D7] hover:bg-[#8B00D7]/90 text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying Contracts
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Verify Contracts
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default HTLCVerificationPanel;
