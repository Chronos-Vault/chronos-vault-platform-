import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, useSearch } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Shield, Server, Cpu, CheckCircle2, AlertCircle, Clock, RefreshCw, 
  ExternalLink, Search, Users, Activity, TrendingUp, XCircle
} from 'lucide-react';

interface Validator {
  id: number;
  operatorName: string;
  operatorEmail: string;
  organizationName: string | null;
  walletAddress: string;
  teeType: string;
  hardwareVendor: string | null;
  hardwareModel: string | null;
  region: string | null;
  consensusRole: string | null;
  status: string;
  statusReason: string | null;
  mrenclave: string | null;
  measurement: string | null;
  lastAttestationAt: string | null;
  attestationExpiresAt: string | null;
  onChainRegistered: boolean;
  registrationTxHash: string | null;
  createdAt: string;
}

interface Attestation {
  id: number;
  validatorId: number;
  quote: string;
  reportData: string;
  verificationStatus: string;
  txHash: string | null;
  submittedAt: string;
  verifiedAt: string | null;
}

interface StatusEvent {
  id: number;
  validatorId: number;
  statusFrom: string;
  statusTo: string;
  reason: string | null;
  actorType: string;
  createdAt: string;
}

interface Stats {
  total: number;
  byStatus: {
    draft: number;
    submitted: number;
    attesting: number;
    approved: number;
    rejected: number;
    suspended: number;
  };
  byTeeType: {
    sgx: number;
    sev: number;
    quantum: number;
  };
  byConsensusRole: {
    arbitrum: number;
    solana: number;
    ton: number;
  };
}

const statusColors: Record<string, string> = {
  draft: 'bg-slate-500',
  submitted: 'bg-blue-500',
  attesting: 'bg-amber-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  suspended: 'bg-orange-500'
};

const statusIcons: Record<string, any> = {
  draft: Clock,
  submitted: RefreshCw,
  attesting: Activity,
  approved: CheckCircle2,
  rejected: XCircle,
  suspended: AlertCircle
};

export default function ValidatorDashboardPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialId = params.get('id');
  
  const { toast } = useToast();
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedValidatorId, setSelectedValidatorId] = useState<number | null>(
    initialId ? parseInt(initialId) : null
  );

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/validators/summary']
  });

  const { data: validatorsData, isLoading: validatorsLoading, refetch: refetchValidators } = useQuery({
    queryKey: ['/api/validators']
  });

  const { data: validatorDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['/api/validators', selectedValidatorId],
    enabled: !!selectedValidatorId
  });

  const handleSearch = async () => {
    if (!searchAddress) return;
    
    try {
      const normalizedAddress = searchAddress.toLowerCase();
      const response = await fetch(`/api/validators/wallet/${normalizedAddress}`);
      const data = await response.json();
      
      if (data.success && data.validator) {
        setSelectedValidatorId(data.validator.id);
        toast({ title: 'Validator found', description: `ID: ${data.validator.id}` });
      } else {
        toast({ title: 'Not found', description: 'No validator with this address', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Search failed', variant: 'destructive' });
    }
  };

  const stats: Stats | undefined = (statsData as any)?.stats;
  const validators: Validator[] = (validatorsData as any)?.validators || [];
  const validator: Validator | undefined = (validatorDetail as any)?.validator;
  const attestations: Attestation[] = (validatorDetail as any)?.attestations || [];
  const statusHistory: StatusEvent[] = (validatorDetail as any)?.statusHistory || [];

  const StatusIcon = validator ? statusIcons[validator.status] || Clock : Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="h-8 w-8 text-cyan-400" />
              Validator Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Monitor validator status and attestation history
            </p>
          </div>
          <Button
            onClick={() => navigate('/validator-onboarding')}
            className="bg-cyan-600 hover:bg-cyan-700"
            data-testid="button-become-validator"
          >
            <Server className="mr-2 h-4 w-4" />
            Become a Validator
          </Button>
        </div>

        {stats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Validators</p>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-cyan-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Approved</p>
                    <p className="text-3xl font-bold text-emerald-400">{stats.byStatus.approved}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-emerald-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-amber-400">
                      {stats.byStatus.submitted + stats.byStatus.attesting}
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-400/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">SGX / SEV</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.byTeeType.sgx} / {stats.byTeeType.sev}
                    </p>
                  </div>
                  <Cpu className="h-10 w-10 text-slate-400/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">Search Validator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    placeholder="0x... wallet address"
                    className="bg-slate-800/50 border-slate-700 text-white font-mono text-sm"
                    data-testid="input-search-address"
                  />
                  <Button 
                    onClick={handleSearch}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    data-testid="button-search"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white text-lg">Recent Validators</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchValidators()}
                  className="text-slate-400 hover:text-white"
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {validatorsLoading ? (
                  <p className="text-slate-400 text-sm">Loading...</p>
                ) : validators.length === 0 ? (
                  <p className="text-slate-400 text-sm">No validators registered yet</p>
                ) : (
                  <div className="space-y-2">
                    {validators.slice(0, 10).map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedValidatorId(v.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedValidatorId === v.id 
                            ? 'bg-cyan-600/20 border border-cyan-500/50' 
                            : 'bg-slate-800/50 hover:bg-slate-800 border border-transparent'
                        }`}
                        data-testid={`button-validator-${v.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm truncate max-w-[120px]">
                            {v.operatorName}
                          </span>
                          <Badge className={`${statusColors[v.status]} text-white text-xs`}>
                            {v.status}
                          </Badge>
                        </div>
                        <p className="text-slate-500 text-xs font-mono mt-1 truncate">
                          {v.walletAddress.slice(0, 10)}...{v.walletAddress.slice(-8)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedValidatorId && validator ? (
              <Card className="bg-slate-900/50 border-slate-800" data-testid="card-validator-detail">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${
                          validator.status === 'approved' ? 'text-emerald-400' :
                          validator.status === 'rejected' ? 'text-red-400' :
                          'text-amber-400'
                        }`} />
                        {validator.operatorName}
                      </CardTitle>
                      <CardDescription className="text-slate-400 font-mono mt-1">
                        {validator.walletAddress}
                      </CardDescription>
                    </div>
                    <Badge className={`${statusColors[validator.status]} text-white`}>
                      {validator.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="attestations">Attestations</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-slate-400 text-sm mb-2">Operator</h4>
                          <p className="text-white">{validator.operatorName}</p>
                          <p className="text-slate-400 text-sm">{validator.operatorEmail}</p>
                          {validator.organizationName && (
                            <p className="text-slate-500 text-sm">{validator.organizationName}</p>
                          )}
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-slate-400 text-sm mb-2">Hardware</h4>
                          <p className="text-white">{validator.teeType?.toUpperCase()}</p>
                          <p className="text-slate-400 text-sm">
                            {validator.hardwareVendor} {validator.hardwareModel}
                          </p>
                          {validator.region && (
                            <p className="text-slate-500 text-sm">Region: {validator.region}</p>
                          )}
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-slate-400 text-sm mb-2">Consensus Role</h4>
                          <p className="text-white capitalize">{validator.consensusRole || 'Not assigned'}</p>
                          {validator.onChainRegistered && (
                            <p className="text-emerald-400 text-sm flex items-center gap-1 mt-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Registered on-chain
                            </p>
                          )}
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-slate-400 text-sm mb-2">Attestation</h4>
                          {validator.lastAttestationAt ? (
                            <>
                              <p className="text-white text-sm">
                                Last: {new Date(validator.lastAttestationAt).toLocaleDateString()}
                              </p>
                              {validator.attestationExpiresAt && (
                                <p className="text-slate-400 text-sm">
                                  Expires: {new Date(validator.attestationExpiresAt).toLocaleDateString()}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-slate-500 text-sm">No attestation yet</p>
                          )}
                        </div>
                      </div>

                      {validator.statusReason && (
                        <div className={`p-4 rounded-lg ${
                          validator.status === 'rejected' 
                            ? 'bg-red-500/10 border border-red-500/30' 
                            : 'bg-slate-800/50'
                        }`}>
                          <h4 className={`text-sm font-medium ${
                            validator.status === 'rejected' ? 'text-red-400' : 'text-slate-400'
                          }`}>
                            Status Reason
                          </h4>
                          <p className="text-white mt-1">{validator.statusReason}</p>
                        </div>
                      )}

                      {validator.mrenclave && (
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <h4 className="text-slate-400 text-sm mb-2">MRENCLAVE</h4>
                          <p className="text-cyan-400 font-mono text-xs break-all">
                            {validator.mrenclave}
                          </p>
                        </div>
                      )}

                      {validator.registrationTxHash && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400">Registration TX:</span>
                          <a
                            href={`https://sepolia.arbiscan.io/tx/${validator.registrationTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                          >
                            {validator.registrationTxHash.slice(0, 10)}...
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="attestations" className="mt-4">
                      {attestations.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No attestations submitted yet</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow className="border-slate-800">
                              <TableHead className="text-slate-400">Submitted</TableHead>
                              <TableHead className="text-slate-400">Status</TableHead>
                              <TableHead className="text-slate-400">TX Hash</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {attestations.map((a) => (
                              <TableRow key={a.id} className="border-slate-800">
                                <TableCell className="text-white text-sm">
                                  {new Date(a.submittedAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className={
                                    a.verificationStatus === 'verified' 
                                      ? 'bg-emerald-500' 
                                      : a.verificationStatus === 'failed'
                                      ? 'bg-red-500'
                                      : 'bg-amber-500'
                                  }>
                                    {a.verificationStatus}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-slate-400 font-mono text-xs">
                                  {a.txHash ? (
                                    <a
                                      href={`https://sepolia.arbiscan.io/tx/${a.txHash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                    >
                                      {a.txHash.slice(0, 10)}...
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  ) : '-'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                      {statusHistory.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No status changes yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {statusHistory.map((event) => (
                            <div 
                              key={event.id} 
                              className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-4"
                            >
                              <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[event.statusTo]}`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-slate-400 border-slate-600">
                                    {event.statusFrom}
                                  </Badge>
                                  <span className="text-slate-500">→</span>
                                  <Badge className={`${statusColors[event.statusTo]} text-white`}>
                                    {event.statusTo}
                                  </Badge>
                                </div>
                                {event.reason && (
                                  <p className="text-slate-400 text-sm mt-2">{event.reason}</p>
                                )}
                                <p className="text-slate-500 text-xs mt-2">
                                  {new Date(event.createdAt).toLocaleString()} • {event.actorType}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-12 pb-12 text-center">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a Validator
                  </h3>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Choose a validator from the list or search by wallet address to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
