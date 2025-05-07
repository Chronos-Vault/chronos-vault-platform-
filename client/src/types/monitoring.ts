export interface ResponseAction {
  id: string;
  incidentId: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, any>;
  result?: string;
  completedAt?: string;
}

export interface Incident {
  id: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'DETECTED' | 'INVESTIGATING' | 'MITIGATING' | 'RESOLVED' | 'CLOSED';
  description: string;
  component?: string;
  detectedAt: string;
  updatedAt: string;
  relatedLogs: string[];
  responseActions: ResponseAction[];
  metadata?: Record<string, any>;
}

export interface IncidentStatistics {
  totalIncidents: number;
  recentIncidents: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  averageResolutionTimeMinutes: number;
}

export interface ComponentHealth {
  status: 'OPTIMAL' | 'GOOD' | 'DEGRADED' | 'CRITICAL';
  latencyMs: number;
  errorRate: number;
  lastChecked: string;
  details?: Record<string, any>;
}

export interface SystemMetrics {
  vaultOperations: {
    creationSuccess: number;
    creationFailed: number;
    accessSuccess: number;
    accessFailed: number;
    totalOperations: number;
  };
  crossChainOperations: {
    verificationSuccess: number;
    verificationFailed: number;
    totalOperations: number;
  };
  securityMetrics: {
    criticalAlerts: number;
    suspiciousActivities: number;
    authFailures: number;
  };
  performanceMetrics: {
    apiLatencyMs: number;
    databaseLatencyMs: number;
    cacheHitRate: number;
    cpuUtilization: number;
    memoryUtilization: number;
  };
}

export interface SystemHealth {
  status: 'OPTIMAL' | 'GOOD' | 'DEGRADED' | 'CRITICAL';
  lastChecked: string;
  components: Record<string, ComponentHealth>;
  metrics: SystemMetrics;
}