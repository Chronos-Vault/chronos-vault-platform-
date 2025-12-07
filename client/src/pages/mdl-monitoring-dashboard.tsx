/**
 * Mathematical Defense Layer Real-Time Monitoring Dashboard
 * 
 * Live visualization of:
 * - Trinity Protocol 2-of-3 consensus
 * - AI Governance decisions
 * - Cross-chain verification events
 * - MPC, VDF, ZK, Quantum security components
 * - Mathematical Defense Layer health
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Shield, Activity, CheckCircle2, XCircle, Clock, Eye, Lock, Zap } from 'lucide-react';
import { websocketService, WebSocketMessage } from '@/services/websocket-service';

interface MDLEvent {
  eventType: 'mdl_validation' | 'trinity_consensus' | 'ai_decision' | 'cross_chain_update' | 'security_alert';
  timestamp: number;
  data: any;
}

interface MDLValidation {
  vaultId: string;
  operationId: string;
  type: 'vault_creation' | 'vault_operation';
  allPassed: boolean;
  components: {
    trinity: boolean;
    aiGovernance: boolean;
    mpc: boolean;
    vdf: boolean;
    zk: boolean;
    quantum: boolean;
  };
}

export default function MDLMonitoringDashboard() {
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<MDLEvent[]>([]);
  const [mdlStatus, setMdlStatus] = useState<any>(null);
  const [latestValidation, setLatestValidation] = useState<MDLValidation | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect().then(() => {
      console.log('✅ Connected to Mathematical Defense Layer WebSocket');
      setConnected(true);
    }).catch((error) => {
      console.error('❌ Failed to connect to WebSocket:', error);
      setConnected(false);
    });

    // Subscribe to MDL events
    const subscriberId = 'mdl-dashboard-' + Math.random().toString(36).substring(7);
    websocketService.subscribe(
      subscriberId,
      ['MDL_EVENT'],
      (message: WebSocketMessage) => {
        const event = message.data as MDLEvent;
        console.log('📡 MDL Event received:', event);
        setEvents(prev => [event, ...prev].slice(0, 50)); // Keep last 50 events

        // Update latest validation if it's a validation event
        if (event.eventType === 'mdl_validation' && event.data) {
          setLatestValidation(event.data);
        }

        // Update system status if it's a security alert
        if (event.eventType === 'security_alert' && event.data.type === 'mdl_status') {
          setMdlStatus(event.data);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      websocketService.unsubscribe(subscriberId);
    };
  }, []);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'mdl_validation': return <CheckCircle2 className="h-4 w-4" />;
      case 'trinity_consensus': return <Shield className="h-4 w-4" />;
      case 'ai_decision': return <Activity className="h-4 w-4" />;
      case 'cross_chain_update': return <Zap className="h-4 w-4" />;
      case 'security_alert': return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'mdl_validation': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'trinity_consensus': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ai_decision': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'cross_chain_update': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'security_alert': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mathematical Defense Layer</h1>
          <p className="text-muted-foreground">Real-Time Security Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm">{connected ? 'Live' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Latest Validation */}
      {latestValidation && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Latest Validation
            </CardTitle>
            <CardDescription>
              {latestValidation.type === 'vault_creation' ? 'Vault Creation' : 'Vault Operation'} - {latestValidation.vaultId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ValidationComponent
                name="Trinity Protocol"
                status={latestValidation.components.trinity}
                description="2-of-3 consensus"
              />
              <ValidationComponent
                name="AI Governance"
                status={latestValidation.components.aiGovernance}
                description="Math-validated decision"
              />
              <ValidationComponent
                name="MPC Keys"
                status={latestValidation.components.mpc}
                description="Threshold signatures"
              />
              <ValidationComponent
                name="VDF Time-Lock"
                status={latestValidation.components.vdf}
                description="Provable delay"
              />
              <ValidationComponent
                name="ZK Proof"
                status={latestValidation.components.zk}
                description="Privacy layer"
              />
              <ValidationComponent
                name="Quantum Crypto"
                status={latestValidation.components.quantum}
                description="Post-quantum security"
              />
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status:</span>
              <Badge variant={latestValidation.allPassed ? 'default' : 'destructive'}>
                {latestValidation.allPassed ? 'All Validations Passed ✓' : 'Validation Failed ✗'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status */}
      {mdlStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusMetric
                label="Consensus Latency"
                value={`${mdlStatus.metrics?.consensusLatency || 0}ms`}
                icon={<Clock className="h-4 w-4" />}
              />
              <StatusMetric
                label="Active Vaults"
                value={mdlStatus.metrics?.activeVaults || 0}
                icon={<Lock className="h-4 w-4" />}
              />
              <StatusMetric
                label="Verifications"
                value={mdlStatus.metrics?.crossChainVerifications || 0}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Live Event Stream
          </CardTitle>
          <CardDescription>
            Real-time Mathematical Defense Layer events ({events.length} events)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {events.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Waiting for Mathematical Defense Layer events...
                </div>
              )}
              {events.map((event, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getEventColor(event.eventType)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getEventIcon(event.eventType)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {event.eventType.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm">
                        {event.data.type && <span className="font-medium">{event.data.type}: </span>}
                        {event.data.vaultId && <span className="text-muted-foreground">Vault {event.data.vaultId.slice(0, 8)}...</span>}
                        {event.data.status && <span className="text-muted-foreground"> - {event.data.status}</span>}
                      </div>
                      {event.data.allPassed !== undefined && (
                        <Badge variant={event.data.allPassed ? 'default' : 'destructive'} className="text-xs">
                          {event.data.allPassed ? 'Validated ✓' : 'Rejected ✗'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mathematical Guarantees */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Mathematical Guarantees
          </CardTitle>
          <CardDescription>
            Cryptographically proven security properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <GuaranteeItem text="Privacy: ∀ proof P: verified(P) ⟹ verifier_learns_nothing_beyond_validity(P)" />
            <GuaranteeItem text="Time-Lock: ∀ VDF: unlock_before_T_iterations = impossible" />
            <GuaranteeItem text="Distribution: ∀ MPC key K: reconstruct(K) requires ≥ k shares" />
            <GuaranteeItem text="Governance: ∀ AI proposal P: executed(P) ⟹ mathematically_proven(P)" />
            <GuaranteeItem text="Quantum: ∀ attack A: P(Shor_success) = negligible" />
            <GuaranteeItem text="Consensus: ∀ operation O: valid(O) ⟹ approved_by_2_of_3_chains(O)" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ValidationComponent({ name, status, description }: { name: string; status: boolean; description: string }) {
  return (
    <div className="flex items-start gap-2">
      {status ? (
        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
      )}
      <div className="flex-1">
        <div className="font-medium text-sm">{name}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

function StatusMetric({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="p-2 bg-background rounded-md">
        {icon}
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}

function GuaranteeItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
      <span className="text-muted-foreground font-mono text-xs">{text}</span>
    </div>
  );
}
