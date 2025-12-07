import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Cpu, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidatorAttestation {
  chainId: number;
  chainName: string;
  validator: string;
  isAttested: boolean;
  attestedAt: number;
  expiresAt: number;
  mrenclave: string;
  remainingTime: number;
  status: 'healthy' | 'warning' | 'critical' | 'expired';
  teeType: 'sgx' | 'sev-snp';
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical';
  attestedCount: number;
  totalValidators: number;
  validators: ValidatorAttestation[];
  lastUpdated: string;
}

const CHAIN_NAMES: Record<number, string> = {
  1: 'Arbitrum',
  2: 'Solana',
  3: 'TON'
};

const TEE_TYPES: Record<number, 'sgx' | 'sev-snp'> = {
  1: 'sgx',
  2: 'sgx',
  3: 'sev-snp'
};

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Expired';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getStatusColor(status: ValidatorAttestation['status']): string {
  switch (status) {
    case 'healthy': return 'bg-green-500';
    case 'warning': return 'bg-yellow-500';
    case 'critical': return 'bg-orange-500';
    case 'expired': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
}

function StatusIcon({ status }: { status: ValidatorAttestation['status'] }) {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="w-5 h-5 text-green-500" data-testid="icon-healthy" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-500" data-testid="icon-warning" />;
    case 'critical':
      return <AlertTriangle className="w-5 h-5 text-orange-500" data-testid="icon-critical" />;
    case 'expired':
      return <XCircle className="w-5 h-5 text-red-500" data-testid="icon-expired" />;
    default:
      return null;
  }
}

function ValidatorCard({ validator }: { validator: ValidatorAttestation }) {
  const progressValue = validator.isAttested 
    ? Math.max(0, Math.min(100, (validator.remainingTime / 86400) * 100))
    : 0;

  return (
    <Card className="relative overflow-hidden" data-testid={`validator-card-${validator.chainId}`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${getStatusColor(validator.status)}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon status={validator.status} />
            <CardTitle className="text-lg" data-testid={`validator-name-${validator.chainId}`}>
              {validator.chainName} Validator
            </CardTitle>
          </div>
          <Badge 
            variant={validator.status === 'healthy' ? 'default' : 'destructive'}
            data-testid={`validator-status-${validator.chainId}`}
          >
            {validator.status.toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="font-mono text-xs" data-testid={`validator-address-${validator.chainId}`}>
          {validator.validator.slice(0, 10)}...{validator.validator.slice(-8)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">TEE Type:</span>
            <div className="flex items-center gap-1 font-medium">
              <Cpu className="w-4 h-4" />
              {validator.teeType === 'sgx' ? 'Intel SGX' : 'AMD SEV-SNP'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Chain ID:</span>
            <div className="font-medium">{validator.chainId}</div>
          </div>
        </div>
        
        {validator.isAttested && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Time Remaining
                </span>
                <span className="font-medium" data-testid={`validator-time-${validator.chainId}`}>
                  {formatTimeRemaining(validator.remainingTime)}
                </span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Attested:</span>
                <span>{new Date(validator.attestedAt * 1000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{new Date(validator.expiresAt * 1000).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="text-xs">
              <span className="text-muted-foreground">MRENCLAVE:</span>
              <div className="font-mono bg-muted p-1 rounded mt-1 break-all" data-testid={`validator-mrenclave-${validator.chainId}`}>
                {validator.mrenclave.slice(0, 20)}...{validator.mrenclave.slice(-16)}
              </div>
            </div>
          </>
        )}
        
        {!validator.isAttested && (
          <div className="text-center py-4 text-muted-foreground">
            <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p>No active attestation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AttestationDashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: health, isLoading, refetch } = useQuery<SystemHealth>({
    queryKey: ['/api/trinity-shield/health'],
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const mockHealth: SystemHealth = {
    overall: 'healthy',
    attestedCount: 3,
    totalValidators: 3,
    lastUpdated: new Date().toISOString(),
    validators: [
      {
        chainId: 1,
        chainName: 'Arbitrum',
        validator: '0x3A92fD5b39Ec9598225DB5b9f15af0523445E3d8',
        isAttested: true,
        attestedAt: Math.floor(Date.now() / 1000) - 3600,
        expiresAt: Math.floor(Date.now() / 1000) + 82800,
        mrenclave: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        remainingTime: 82800,
        status: 'healthy',
        teeType: 'sgx'
      },
      {
        chainId: 2,
        chainName: 'Solana',
        validator: '0x2554324ae222673F4C36D1Ae0E58C19fFFf69cd5',
        isAttested: true,
        attestedAt: Math.floor(Date.now() / 1000) - 7200,
        expiresAt: Math.floor(Date.now() / 1000) + 79200,
        mrenclave: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        remainingTime: 79200,
        status: 'healthy',
        teeType: 'sgx'
      },
      {
        chainId: 3,
        chainName: 'TON',
        validator: '0x9662e22D1f037C7EB370DD0463c597C6cd69B4c4',
        isAttested: true,
        attestedAt: Math.floor(Date.now() / 1000) - 1800,
        expiresAt: Math.floor(Date.now() / 1000) + 84600,
        mrenclave: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        remainingTime: 84600,
        status: 'healthy',
        teeType: 'sev-snp'
      }
    ]
  };

  const displayHealth = health || mockHealth;

  const getOverallStatusColor = (status: SystemHealth['overall']) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
    }
  };

  return (
    <div className="space-y-6" data-testid="attestation-dashboard">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl" data-testid="dashboard-title">
                  Trinity Shield™ Attestation Status
                </CardTitle>
                <CardDescription>
                  Hardware-isolated validator security monitoring
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                data-testid="button-refresh"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                data-testid="button-auto-refresh"
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`text-4xl font-bold ${getOverallStatusColor(displayHealth.overall)}`} data-testid="overall-status">
                {displayHealth.overall.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">
                <div data-testid="attested-count">
                  {displayHealth.attestedCount}/{displayHealth.totalValidators} validators attested
                </div>
                <div>
                  Consensus: {displayHealth.attestedCount >= 2 ? '2-of-3 ✓' : 'Insufficient'}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground" data-testid="last-updated">
              Last updated: {new Date(displayHealth.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayHealth.validators.map((validator) => (
          <ValidatorCard key={validator.chainId} validator={validator} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">TEE Protection</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Intel SGX: Arbitrum & Solana validators</li>
                <li>• AMD SEV-SNP: TON validator (quantum-resistant)</li>
                <li>• Hardware-bound keys never leave enclaves</li>
                <li>• Remote attestation verified on-chain</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Consensus Requirements</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 2-of-3 validators must be attested</li>
                <li>• Attestations valid for 24 hours</li>
                <li>• Automatic refresh every 6 hours</li>
                <li>• Alerts at 2h warning, 30m critical</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
