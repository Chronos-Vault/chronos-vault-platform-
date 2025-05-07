import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Incident, IncidentStatistics, SystemHealth } from '../types/monitoring';

interface IncidentMonitorProps {
  systemHealth: SystemHealth | null;
  incidents: Incident[] | null;
  incidentStats: IncidentStatistics | null;
  incidentFilter: string[];
  setIncidentFilter: (filter: string[]) => void;
  healthLoading: boolean;
  incidentsLoading: boolean;
  statsLoading: boolean;
  refetchHealth: () => void;
  refetchIncidents: () => void;
  refetchStats: () => void;
}

// EmptyState component
const EmptyState = ({ title, description }: { title: string, description: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-lg p-10 text-center">
    <FileText className="h-10 w-10 text-muted-foreground mb-3" />
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
  </div>
);

// LoadingState component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-sm text-muted-foreground">Loading data...</p>
  </div>
);

export const IncidentMonitor = ({ 
  systemHealth,
  incidents,
  incidentStats,
  incidentFilter,
  setIncidentFilter,
  healthLoading,
  incidentsLoading,
  statsLoading, 
  refetchHealth,
  refetchIncidents,
  refetchStats
}: IncidentMonitorProps) => {
  if (healthLoading || incidentsLoading || statsLoading) return <LoadingState />;
  if (!systemHealth || !incidents || !incidentStats) {
    return <EmptyState 
      title="Cannot load incident data" 
      description="Ensure the incident management system is running properly"
    />;
  }

  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL': return 'bg-green-500';
      case 'GOOD': return 'bg-green-300';
      case 'DEGRADED': return 'bg-amber-500';
      case 'CRITICAL': return 'bg-red-500';
      case 'DETECTED': return 'bg-blue-500';
      case 'INVESTIGATING': return 'bg-amber-500';
      case 'MITIGATING': return 'bg-purple-500';
      case 'RESOLVED': return 'bg-green-500';
      case 'CLOSED': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper to get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Event handler for status filter change
  const handleFilterChange = (status: string) => {
    if (incidentFilter.includes(status)) {
      setIncidentFilter(incidentFilter.filter(s => s !== status));
    } else {
      setIncidentFilter([...incidentFilter, status]);
    }
  };
  
  // Active incidents section
  const ActiveIncidents = () => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>Current system incidents requiring attention</CardDescription>
          </div>
          <div className="space-x-1">
            <Button 
              size="sm" 
              variant={incidentFilter.includes('DETECTED') ? 'default' : 'outline'}
              onClick={() => handleFilterChange('DETECTED')}
            >
              Detected
            </Button>
            <Button 
              size="sm" 
              variant={incidentFilter.includes('INVESTIGATING') ? 'default' : 'outline'}
              onClick={() => handleFilterChange('INVESTIGATING')}
            >
              Investigating
            </Button>
            <Button 
              size="sm" 
              variant={incidentFilter.includes('MITIGATING') ? 'default' : 'outline'}
              onClick={() => handleFilterChange('MITIGATING')}
            >
              Mitigating
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {incidents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active incidents matching the selected filters
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map(incident => (
              <div 
                key={incident.id} 
                className={`p-4 rounded-lg border ${
                  incident.severity === 'CRITICAL' ? 'border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800' : 
                  incident.severity === 'HIGH' ? 'border-orange-300 bg-orange-50 dark:bg-orange-950 dark:border-orange-800' :
                  incident.severity === 'MEDIUM' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800' :
                  'border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-800'
                }`}
              >
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    {incident.component && (
                      <Badge variant="outline">
                        {incident.component}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {incident.id}
                  </div>
                </div>
                
                <h3 className="font-medium mb-2">{incident.description}</h3>
                
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>Detected: {formatDate(incident.detectedAt)}</div>
                  <div>Updated: {formatDate(incident.updatedAt)}</div>
                </div>
                
                {incident.responseActions.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium mb-2">Response Actions</div>
                    <div className="max-h-28 overflow-y-auto">
                      {incident.responseActions.map(action => (
                        <div 
                          key={action.id} 
                          className="text-sm mb-1 p-2 rounded bg-white dark:bg-black bg-opacity-50"
                        >
                          <div className="flex justify-between">
                            <span>{action.description}</span>
                            <Badge variant="outline">
                              {action.status}
                            </Badge>
                          </div>
                          {action.result && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Result: {action.result}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchIncidents()}
        >
          <Loader2 className={`h-3 w-3 mr-2 ${incidentsLoading ? 'animate-spin' : ''}`} />
          Refresh Incidents
        </Button>
      </CardFooter>
    </Card>
  );

  // System health status
  const SystemStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current system component status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg mb-4 ${getStatusColor(systemHealth.status)}`}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">System Status: {systemHealth.status}</div>
              <div className="text-sm">Last checked: {formatDate(systemHealth.lastChecked)}</div>
            </div>
            <div className="text-3xl">
              {systemHealth.status === 'OPTIMAL' ? '✅' : 
               systemHealth.status === 'GOOD' ? '✅' : 
               systemHealth.status === 'DEGRADED' ? '⚠️' : '🚨'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(systemHealth.components).map(([name, component]) => (
            <div 
              key={name} 
              className={`rounded-lg border p-3 ${
                component.status === 'CRITICAL' ? 'border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800' : 
                component.status === 'DEGRADED' ? 'border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800' :
                'border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-800'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{name}</div>
                <Badge 
                  className={getStatusColor(component.status)}
                >
                  {component.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                <div>Latency: {component.latencyMs}ms</div>
                <div>Error Rate: {(component.errorRate * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchHealth()}
        >
          <Loader2 className={`h-3 w-3 mr-2 ${healthLoading ? 'animate-spin' : ''}`} />
          Refresh Health Status
        </Button>
      </CardFooter>
    </Card>
  );

  // Incident statistics
  const IncidentStatistics = () => (
    <Card>
      <CardHeader>
        <CardTitle>Incident Statistics</CardTitle>
        <CardDescription>Overview of system incidents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Total Incidents</div>
            <div className="text-2xl font-semibold mt-1">{incidentStats.totalIncidents}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Recent (24h)</div>
            <div className="text-2xl font-semibold mt-1">{incidentStats.recentIncidents}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-2xl font-semibold mt-1 text-red-600 dark:text-red-400">
              {incidentStats.bySeverity.CRITICAL || 0}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground">Avg. Resolution Time</div>
            <div className="text-2xl font-semibold mt-1">
              {incidentStats.averageResolutionTimeMinutes || 0} min
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium mb-2">By Type</h3>
            <div className="space-y-2">
              {Object.entries(incidentStats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center">
                  <div className="w-32 text-sm truncate">{type}:</div>
                  <div className="flex-1">
                    <Progress value={count} max={incidentStats.totalIncidents} className="h-2" />
                  </div>
                  <div className="w-8 text-right text-sm">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">By Status</h3>
            <div className="space-y-2">
              {Object.entries(incidentStats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center">
                  <div className="w-32 text-sm truncate">{status}:</div>
                  <div className="flex-1">
                    <Progress 
                      value={count} 
                      max={incidentStats.totalIncidents} 
                      className={`h-2 ${
                        status === 'CLOSED' || status === 'RESOLVED' ? 'bg-green-500' : 
                        status === 'MITIGATING' ? 'bg-purple-500' : 
                        status === 'INVESTIGATING' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} 
                    />
                  </div>
                  <div className="w-8 text-right text-sm">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchStats()}
        >
          <Loader2 className={`h-3 w-3 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
          Refresh Statistics
        </Button>
      </CardFooter>
    </Card>
  );

  // Main render for incident monitoring tab
  return (
    <div className="space-y-6">
      <SystemStatus />
      <ActiveIncidents />
      <IncidentStatistics />
    </div>
  );
};