/**
 * ProofSecurityDashboard Component
 * 
 * A component that provides a comprehensive security dashboard for vault
 * verification, showing proof history and security metrics.
 */

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Shield, 
  LockKeyhole, 
  RefreshCw,
  BarChart3,
  Clock
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { formatDate } from '@/utils/date-utils';
import { ProofType, ProofRecord, VerificationStatus } from '@/hooks/use-proof-verification';
import { ProofVerificationSummary } from './ProofVerificationSummary';

interface SecurityMetric {
  name: string;
  value: string | number;
  icon: React.ReactNode;
  status: 'success' | 'warning' | 'danger' | 'info';
  tooltip: string;
}

interface ProofSecurityDashboardProps {
  vaultId: number;
  createdAt: string;
  unlockDate: string;
  isLocked: boolean;
  proofRecord?: ProofRecord | null;
  onGenerateProof?: () => void;
  className?: string;
}

export function ProofSecurityDashboard({ 
  vaultId, 
  createdAt, 
  unlockDate, 
  isLocked,
  proofRecord,
  onGenerateProof,
  className = ''
}: ProofSecurityDashboardProps) {
  // Calculate security metrics
  const securityMetrics: SecurityMetric[] = [
    {
      name: 'Vault Status',
      value: isLocked ? 'Locked' : 'Unlocked',
      icon: <LockKeyhole className="h-4 w-4" />,
      status: isLocked ? 'success' : 'info',
      tooltip: isLocked 
        ? 'Your assets are securely time-locked in the vault' 
        : 'Assets are available for withdrawal'
    },
    {
      name: 'Last Verified',
      value: proofRecord?.verifiedAt 
        ? formatDate(proofRecord.verifiedAt)
        : 'Not verified',
      icon: <Clock className="h-4 w-4" />,
      status: proofRecord?.status === VerificationStatus.VERIFIED ? 'success' : 'warning',
      tooltip: proofRecord?.status === VerificationStatus.VERIFIED
        ? 'Vault was successfully verified on this date'
        : 'Generating a proof will verify your assets are secure'
    },
    {
      name: 'Security Score',
      value: calculateSecurityScore(),
      icon: <BarChart3 className="h-4 w-4" />,
      status: getScoreStatus(calculateSecurityScore()),
      tooltip: 'Overall security rating based on verification history and vault settings'
    }
  ];
  
  function calculateSecurityScore(): number {
    let score = 70; // Base score
    
    // Add points for verification
    if (proofRecord?.status === VerificationStatus.VERIFIED) {
      score += 20;
    }
    
    // Add points for being locked
    if (isLocked) {
      score += 10;
    }
    
    return Math.min(score, 100); // Cap at 100
  }
  
  function getScoreStatus(score: number): 'success' | 'warning' | 'danger' | 'info' {
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    if (score >= 50) return 'warning';
    return 'danger';
  }
  
  function getStatusColor(status: 'success' | 'warning' | 'danger' | 'info'): string {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-500/10';
      case 'warning': return 'text-amber-500 bg-amber-500/10';
      case 'danger': return 'text-red-500 bg-red-500/10';
      case 'info': return 'text-[#6B00D7] bg-[#6B00D7]/10';
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="bg-[#1E1E1E] border-[#333333]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#6B00D7]" />
              Security Dashboard
            </CardTitle>
            
            {proofRecord?.status === VerificationStatus.VERIFIED && (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <CardDescription>
            Security metrics and verification status for your vault
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {securityMetrics.map((metric, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`rounded-lg p-3 ${getStatusColor(metric.status)} flex flex-col justify-center items-center text-center`}>
                      <div className="mb-1">{metric.icon}</div>
                      <div className="text-xs font-medium">{metric.name}</div>
                      <div className="font-bold mt-1">{metric.value}</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{metric.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          {!proofRecord && (
            <Button 
              onClick={onGenerateProof}
              className="w-full bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] text-white"
            >
              <Shield className="mr-2 h-4 w-4" />
              Generate Proof of Reservation
            </Button>
          )}
          
          {proofRecord?.status === VerificationStatus.VERIFIED && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Your vault assets have been verified and are securely locked as expected.</span>
            </div>
          )}
          
          {proofRecord?.status === VerificationStatus.FAILED && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span>Verification failed. Please regenerate a proof to verify your assets.</span>
              </div>
              <Button 
                onClick={onGenerateProof} 
                variant="outline" 
                size="sm" 
                className="self-end"
              >
                <RefreshCw className="mr-2 h-3 w-3" />
                Regenerate Proof
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {proofRecord && (
        <ProofVerificationSummary 
          proofRecord={proofRecord} 
          vaultId={vaultId} 
        />
      )}
    </div>
  );
}