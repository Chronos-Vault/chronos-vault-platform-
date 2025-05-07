import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Shield, Activity, Server, BarChart4, Zap, FileText, AlertCircle, Clock, Bell } from 'lucide-react';

// Custom components
import { IncidentMonitor } from '@/components/incident-monitor';

// Types
import { SystemHealth, Incident, IncidentStatistics } from '@/types/monitoring';

// Types for test results
interface TestResults {
  timestamp: Date;
  overallHealth: {
    reliability: number;
    security: number;
    performance: number;
    robustness: number;
  };
  recommendations: string[];
}

interface BlockchainBenchmarkResult {
  rankings: {
    fastest: string;
    mostReliable: string;
    mostCostEffective: string;
    bestOverall: string;
  };
  chainResults: Record<string, {
    chainName: string;
    performanceScore: number;
    reliabilityScore: number;
    costEfficiencyScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  overallRecommendations: string[];
}

interface SecurityTestResults {
  overallStatus: 'passed' | 'failed' | 'warning';
  passedTests: number;
  failedTests: number;
  warningTests: number;
  totalTests: number;
  vulnerabilities: {
    name: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    description: string;
  }[];
  recommendations: { title: string; description: string; }[];
}

// Imported the incident monitoring types from @/types/monitoring

export default function TechnicalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [testInProgress, setTestInProgress] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState('all');
  const [incidentFilter, setIncidentFilter] = useState<string[]>(['DETECTED', 'INVESTIGATING', 'MITIGATING']);
  
  // Query to get latest test results
  const { data: testResults, isLoading, error, refetch } = 
    useQuery<TestResults>({ 
      queryKey: ['/api/admin/test-results'],
      enabled: false // Don't fetch on mount
    });
  
  // Query for blockchain benchmark results
  const { data: benchmarkResults, isLoading: benchmarkLoading } = 
    useQuery<BlockchainBenchmarkResult>({
      queryKey: ['/api/admin/benchmark-results'],
      enabled: activeTab === 'benchmark' // Only fetch when tab is active
    });
  
  // Query for security test results
  const { data: securityResults, isLoading: securityLoading } = 
    useQuery<SecurityTestResults>({
      queryKey: ['/api/admin/security-results'],
      enabled: activeTab === 'security' // Only fetch when tab is active
    });
    
  // Queries for incident monitoring system
  const { data: systemHealth, isLoading: healthLoading, refetch: refetchHealth } = 
    useQuery<SystemHealth>({
      queryKey: ['/api/health/status'],
      enabled: activeTab === 'incidents' || activeTab === 'overview',
      refetchInterval: activeTab === 'incidents' ? 10000 : false // Auto-refresh every 10 seconds if active
    });
    
  const { data: incidents, isLoading: incidentsLoading, refetch: refetchIncidents } = 
    useQuery<Incident[]>({
      queryKey: ['/api/incidents/incidents', { status: incidentFilter }],
      enabled: activeTab === 'incidents',
      refetchInterval: activeTab === 'incidents' ? 10000 : false // Auto-refresh every 10 seconds if active
    });
    
  const { data: incidentStats, isLoading: statsLoading, refetch: refetchStats } = 
    useQuery<IncidentStatistics>({
      queryKey: ['/api/incidents/statistics'],
      enabled: activeTab === 'incidents',
      refetchInterval: activeTab === 'incidents' ? 30000 : false // Auto-refresh every 30 seconds if active
    });
  
  // Mutation to run tests
  const runTestsMutation = useMutation({
    mutationFn: async (testType: string) => {
      setTestInProgress(true);
      const res = await apiRequest('POST', '/api/admin/run-tests', { 
        testType,
        blockchains: selectedBlockchain === 'all' ? undefined : [selectedBlockchain]
      });
      return await res.json();
    },
    onSuccess: () => {
      refetch();
      setTestInProgress(false);
    },
    onError: () => {
      setTestInProgress(false);
    }
  });
  
  // Health score card component
  const HealthScoreCard = ({ title, score, icon }: { title: string, score: number, icon: React.ReactNode }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative pt-4">
          <div className="text-3xl font-bold">{score}<span className="text-sm font-normal">/100</span></div>
          <Progress 
            value={score} 
            max={100} 
            className={`h-2 mt-2 ${score > 80 ? 'bg-green-500' : score > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Critical</span>
            <span>Excellent</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  // Health status overview
  const HealthOverview = () => {
    if (!testResults) return <EmptyState title="No test data available" description="Run a comprehensive test to see results" />;
    
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <HealthScoreCard 
            title="Reliability" 
            score={testResults.overallHealth.reliability} 
            icon={<Shield className="h-4 w-4 text-blue-500" />}
          />
          <HealthScoreCard 
            title="Security" 
            score={testResults.overallHealth.security} 
            icon={<Shield className="h-4 w-4 text-red-500" />}
          />
          <HealthScoreCard 
            title="Performance" 
            score={testResults.overallHealth.performance} 
            icon={<Activity className="h-4 w-4 text-green-500" />}
          />
          <HealthScoreCard 
            title="Overall Robustness" 
            score={testResults.overallHealth.robustness} 
            icon={<Server className="h-4 w-4 text-purple-500" />}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actions to improve platform robustness</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {testResults.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-purple-500" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => refetch()}>Refresh Data</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Blockchain benchmarks tab
  const BlockchainBenchmarks = () => {
    if (benchmarkLoading) return <LoadingState />;
    if (!benchmarkResults) return <EmptyState title="No benchmark data" description="Run benchmark tests to see results" />;
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Blockchain Rankings</CardTitle>
            <CardDescription>Performance comparison across blockchains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Fastest Chain</div>
                <div className="text-lg font-semibold mt-1">{benchmarkResults.rankings.fastest}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Most Reliable</div>
                <div className="text-lg font-semibold mt-1">{benchmarkResults.rankings.mostReliable}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Most Cost-Effective</div>
                <div className="text-lg font-semibold mt-1">{benchmarkResults.rankings.mostCostEffective}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Best Overall</div>
                <div className="text-lg font-semibold mt-1">{benchmarkResults.rankings.bestOverall}</div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-6">
              {Object.entries(benchmarkResults.chainResults).map(([chainId, chainResult]) => (
                <div key={chainId} className="space-y-2">
                  <h3 className="text-lg font-semibold">{chainResult.chainName}</h3>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Performance</div>
                      <Progress 
                        value={chainResult.performanceScore} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-sm">{chainResult.performanceScore}/100</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Reliability</div>
                      <Progress 
                        value={chainResult.reliabilityScore} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-sm">{chainResult.reliabilityScore}/100</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Cost Efficiency</div>
                      <Progress 
                        value={chainResult.costEfficiencyScore} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-sm">{chainResult.costEfficiencyScore}/100</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Overall</div>
                      <Progress 
                        value={chainResult.overallScore} 
                        max={100} 
                        className="h-2" 
                      />
                      <div className="text-sm">{chainResult.overallScore}/100</div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 mt-2">
                    <div>
                      <div className="text-sm font-medium mb-1">Strengths</div>
                      <ul className="text-sm space-y-1">
                        {chainResult.strengths.map((strength, i) => (
                          <li key={i} className="flex gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Weaknesses</div>
                      <ul className="text-sm space-y-1">
                        {chainResult.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => runTestsMutation.mutate('benchmark')} 
              disabled={testInProgress}
            >
              {testInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Blockchain Benchmarks
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Security tests tab
  const SecurityTests = () => {
    if (securityLoading) return <LoadingState />;
    if (!securityResults) return <EmptyState title="No security data" description="Run security tests to see results" />;
    
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'critical': return 'bg-red-500';
        case 'high': return 'bg-orange-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-blue-500';
        default: return 'bg-gray-500';
      }
    };
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Security Test Results</CardTitle>
                <CardDescription>Security test summary and vulnerabilities</CardDescription>
              </div>
              <Badge 
                className={securityResults.overallStatus === 'passed' ? 'bg-green-500' : 
                          securityResults.overallStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'}
              >
                {securityResults.overallStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-6">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Total Tests</div>
                <div className="text-2xl font-semibold mt-1">{securityResults.totalTests}</div>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-3">
                <div className="text-sm text-muted-foreground">Passed</div>
                <div className="text-2xl font-semibold mt-1 text-green-600 dark:text-green-400">
                  {securityResults.passedTests}
                </div>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-3">
                <div className="text-sm text-muted-foreground">Warnings</div>
                <div className="text-2xl font-semibold mt-1 text-amber-600 dark:text-amber-400">
                  {securityResults.warningTests}
                </div>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800 p-3">
                <div className="text-sm text-muted-foreground">Failed</div>
                <div className="text-2xl font-semibold mt-1 text-red-600 dark:text-red-400">
                  {securityResults.failedTests}
                </div>
              </div>
            </div>
            
            {securityResults.vulnerabilities.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-3">Detected Vulnerabilities</h3>
                <div className="space-y-3 mb-6">
                  {securityResults.vulnerabilities.map((vuln, i) => (
                    <Alert key={i} variant={vuln.severity === 'critical' || vuln.severity === 'high' ? 'destructive' : 'default'}>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity.toUpperCase()}
                        </Badge>
                        <AlertTitle>{vuln.name}</AlertTitle>
                      </div>
                      <AlertDescription className="mt-1">
                        {vuln.description}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </>
            )}
            
            <h3 className="text-lg font-semibold mb-3">Security Recommendations</h3>
            <div className="space-y-3">
              {securityResults.recommendations.map((rec, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{rec.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => runTestsMutation.mutate('security')} 
              disabled={testInProgress}
              variant="destructive"
            >
              {testInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Security Tests
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Empty state component
  const EmptyState = ({ title, description }: { title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <FileText className="h-16 w-16 text-muted-foreground opacity-30 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button 
        className="mt-4" 
        onClick={() => runTestsMutation.mutate('comprehensive')}
        disabled={testInProgress}
      >
        {testInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Run Comprehensive Tests
      </Button>
    </div>
  );
  
  // Loading state component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
      <h3 className="text-lg font-semibold">Loading test results</h3>
      <p className="text-sm text-muted-foreground">Please wait while we fetch the latest data</p>
    </div>
  );
  
  // Main render
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Technical Dashboard</h1>
          <p className="text-muted-foreground">Monitor and test platform robustness across blockchains</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={selectedBlockchain}
              onChange={(e) => setSelectedBlockchain(e.target.value)}
            >
              <option value="all">All Blockchains</option>
              <option value="ethereum">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="solana">Solana</option>
              <option value="ton">TON</option>
              <option value="bitcoin">Bitcoin</option>
            </select>
          </div>
          <Button 
            onClick={() => runTestsMutation.mutate('comprehensive')} 
            disabled={testInProgress}
          >
            {testInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Tests
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <Server className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertCircle className="h-4 w-4 mr-2" />
            Incident Monitor
          </TabsTrigger>
          <TabsTrigger value="benchmark">
            <BarChart4 className="h-4 w-4 mr-2" />
            Blockchain Benchmarks
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security Tests
          </TabsTrigger>
          <TabsTrigger value="stress">
            <Zap className="h-4 w-4 mr-2" />
            Stress Tests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {isLoading ? <LoadingState /> : <HealthOverview />}
        </TabsContent>
        
        <TabsContent value="incidents">
          <IncidentMonitor 
            systemHealth={systemHealth || null} 
            incidents={incidents || null} 
            incidentStats={incidentStats || null}
            incidentFilter={incidentFilter}
            setIncidentFilter={setIncidentFilter}
            healthLoading={healthLoading}
            incidentsLoading={incidentsLoading}
            statsLoading={statsLoading}
            refetchHealth={refetchHealth}
            refetchIncidents={refetchIncidents}
            refetchStats={refetchStats}
          />
        </TabsContent>
        
        <TabsContent value="benchmark">
          <BlockchainBenchmarks />
        </TabsContent>
        
        <TabsContent value="security">
          <SecurityTests />
        </TabsContent>
        
        <TabsContent value="stress">
          <EmptyState 
            title="Stress Testing" 
            description="Run stress tests to evaluate system performance under load"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
