/**
 * AI Security Dashboard Component
 * 
 * This component provides visualization of the AI-enhanced security monitoring system,
 * showing anomaly detection, pattern recognition, behavioral analysis, and predictive security insights.
 * It integrates with the AI Security Monitoring Service to display real-time security event data.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Activity,
  AlertTriangle,
  BarChart,
  Brain,
  Check,
  FileBarChart,
  Filter,
  LayoutGrid,
  List,
  Loader2,
  LucideIcon,
  Network,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

import { getAISecurityMonitoringService, AISecurityEvent, AISecurityEventType, AISecurityModelType } from '@/lib/security/AISecurityMonitoringService';

interface AISecurityDashboardProps {
  vaultId?: string;
  className?: string;
  compact?: boolean;
}

interface AIDashboardMetrics {
  totalEvents: number;
  criticalEvents: number;
  anomalyCount: number;
  patternCount: number;
  suspiciousCount: number;
  predictionCount: number;
  averageConfidence: number;
  riskScore: number;
  recentEvents: AISecurityEvent[];
  recommendedActions: string[];
  lastUpdated: number;
}

const DEFAULT_VAULT_ID = 'vault-1';

export function AISecurityDashboard({ vaultId, className, compact = false }: AISecurityDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<AIDashboardMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    anomalyCount: 0,
    patternCount: 0,
    suspiciousCount: 0,
    predictionCount: 0,
    averageConfidence: 0,
    riskScore: 0,
    recentEvents: [],
    recommendedActions: [],
    lastUpdated: Date.now()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Load AI security insights on mount or when vault ID changes
  useEffect(() => {
    loadSecurityInsights();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      loadSecurityInsights();
    }, 120000); // 2 minutes
    
    return () => clearInterval(intervalId);
  }, [vaultId]);
  
  const loadSecurityInsights = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      const aiService = getAISecurityMonitoringService();
      const targetVaultId = vaultId || DEFAULT_VAULT_ID;
      
      // Get recent security events
      const events = aiService.getVaultSecurityEvents(targetVaultId, 24 * 60 * 60 * 1000);
      
      // Calculate metrics from events
      const anomalyEvents = events.filter(e => e.type === AISecurityEventType.ANOMALY_DETECTED);
      const patternEvents = events.filter(e => e.type === AISecurityEventType.UNUSUAL_PATTERN);
      const suspiciousEvents = events.filter(e => e.type === AISecurityEventType.SUSPICIOUS_ACTIVITY);
      const predictionEvents = events.filter(e => e.type === AISecurityEventType.PREDICTION_ALERT);
      
      const criticalEvents = events.filter(e => e.confidence > 0.8);
      const confidenceSum = events.reduce((sum, e) => sum + e.confidence, 0);
      const avgConfidence = events.length > 0 ? confidenceSum / events.length : 0;
      
      // Get risk score and recommendations
      const riskScore = aiService.calculateVaultRiskScore(targetVaultId);
      const recommendations = aiService.generateSecurityRecommendations(targetVaultId);
      
      setMetrics({
        totalEvents: events.length,
        criticalEvents: criticalEvents.length,
        anomalyCount: anomalyEvents.length,
        patternCount: patternEvents.length,
        suspiciousCount: suspiciousEvents.length,
        predictionCount: predictionEvents.length,
        averageConfidence: Math.round(avgConfidence * 100),
        riskScore,
        recentEvents: events.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5),
        recommendedActions: recommendations,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error loading AI security insights:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine risk color class
  const getRiskColorClass = (score: number): string => {
    if (score < 30) return 'text-green-500';
    if (score < 60) return 'text-yellow-500';
    if (score < 80) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Get icon for event type
  const getEventTypeIcon = (eventType: AISecurityEventType): LucideIcon => {
    switch (eventType) {
      case AISecurityEventType.ANOMALY_DETECTED:
        return AlertTriangle;
      case AISecurityEventType.UNUSUAL_PATTERN:
        return Activity;
      case AISecurityEventType.SUSPICIOUS_ACTIVITY:
        return ShieldAlert;
      case AISecurityEventType.PREDICTION_ALERT:
        return Zap;
      case AISecurityEventType.SECURITY_RECOMMENDATION:
        return ShieldCheck;
      default:
        return AlertTriangle;
    }
  };
  
  // Get color for event type
  const getEventTypeColor = (eventType: AISecurityEventType): string => {
    switch (eventType) {
      case AISecurityEventType.ANOMALY_DETECTED:
        return 'text-yellow-500';
      case AISecurityEventType.UNUSUAL_PATTERN:
        return 'text-blue-500';
      case AISecurityEventType.SUSPICIOUS_ACTIVITY:
        return 'text-red-500';
      case AISecurityEventType.PREDICTION_ALERT:
        return 'text-purple-500';
      case AISecurityEventType.SECURITY_RECOMMENDATION:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Get icon for model type
  const getModelTypeIcon = (modelType: AISecurityModelType): LucideIcon => {
    switch (modelType) {
      case AISecurityModelType.ANOMALY_DETECTION:
        return Filter;
      case AISecurityModelType.PATTERN_RECOGNITION:
        return LayoutGrid;
      case AISecurityModelType.BEHAVIORAL_ANALYSIS:
        return Activity;
      case AISecurityModelType.PREDICTIVE_SECURITY:
        return FileBarChart;
      default:
        return Brain;
    }
  };
  
  // Format timestamp to readable date
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Format time ago for recent events
  const formatTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Calculate how long until the metrics refresh
  const getRefreshTime = (): string => {
    const timeSinceUpdate = Date.now() - metrics.lastUpdated;
    const timeUntilRefresh = 120000 - timeSinceUpdate; // 2 minutes - time elapsed
    
    if (timeUntilRefresh <= 0) return 'refreshing...';
    return `refreshes in ${Math.ceil(timeUntilRefresh / 1000)}s`;
  };
  
  if (compact) {
    // Render a compact version of the dashboard for use in other components
    return (
      <Card className={`border-border ${className || ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#6B00D7]" />
              AI Security Insights
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`${getRiskColorClass(metrics.riskScore)} border-current`}
            >
              Risk Score: {metrics.riskScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : hasError ? (
            <Alert variant="destructive" className="my-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load AI security insights</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/40 p-2 rounded">
                  <div className="text-sm text-muted-foreground">Anomalies</div>
                  <div className="text-xl font-semibold">{metrics.anomalyCount}</div>
                </div>
                <div className="bg-muted/40 p-2 rounded">
                  <div className="text-sm text-muted-foreground">Predictions</div>
                  <div className="text-xl font-semibold">{metrics.predictionCount}</div>
                </div>
              </div>
              
              {metrics.recentEvents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Latest Event</h4>
                  <div className="bg-muted/40 p-2 rounded">
                    <div className="flex items-start gap-2">
                      {
                        React.createElement(
                          getEventTypeIcon(metrics.recentEvents[0].type), 
                          { className: `h-4 w-4 mt-0.5 ${getEventTypeColor(metrics.recentEvents[0].type)}` }
                        )
                      }
                      <div>
                        <div className="text-sm font-medium">{metrics.recentEvents[0].description}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(metrics.recentEvents[0].timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {metrics.recommendedActions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Recommendation</h4>
                  <div className="text-sm">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 mt-0.5 text-[#6B00D7]" />
                      <span>{metrics.recommendedActions[0]}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-2 text-xs text-muted-foreground flex justify-between">
          <span>Monitored by AI</span>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={loadSecurityInsights}>
            <RefreshCw className="h-3 w-3 mr-1" />
            {getRefreshTime()}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Full dashboard view
  return (
    <Card className={`border-border ${className || ''}`}>
      <CardHeader className="bg-gradient-to-r from-[#6B00D7]/10 to-[#FF5AF7]/10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#6B00D7]" />
              AI-Enhanced Security Monitoring
            </CardTitle>
            <CardDescription>
              Advanced machine learning models monitoring vault security in real-time
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadSecurityInsights} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {hasError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Security Data</AlertTitle>
            <AlertDescription>
              Unable to retrieve AI security analysis. Please try refreshing the dashboard.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Risk Score */}
              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Risk Score</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-center items-center flex-col">
                    <div className={`text-4xl font-bold ${getRiskColorClass(metrics.riskScore)}`}>
                      {metrics.riskScore}
                    </div>
                    <Progress 
                      value={metrics.riskScore} 
                      max={100} 
                      className="h-2 w-full mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {metrics.riskScore < 30 ? 'Low risk detected' :
                       metrics.riskScore < 60 ? 'Moderate risk detected' :
                       metrics.riskScore < 80 ? 'High risk detected' :
                       'Critical risk detected'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Event Summary */}
              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Event Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Events</span>
                      <span className="font-medium">{metrics.totalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Critical Events</span>
                      <span className="font-medium text-red-500">{metrics.criticalEvents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Confidence</span>
                      <span className="font-medium">{metrics.averageConfidence}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Model Distribution */}
              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Model Insights</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500" /> Anomalies
                      </span>
                      <span className="font-medium">{metrics.anomalyCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Activity className="h-3 w-3 text-blue-500" /> Patterns
                      </span>
                      <span className="font-medium">{metrics.patternCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3 text-red-500" /> Suspicious
                      </span>
                      <span className="font-medium">{metrics.suspiciousCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Zap className="h-3 w-3 text-purple-500" /> Predictions
                      </span>
                      <span className="font-medium">{metrics.predictionCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Chain Distribution */}
              <Card className="bg-muted/30 border-border">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Chain Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-center items-center h-full">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#6B00D7]/10 flex items-center justify-center mb-1">
                          <span className="text-xs font-bold text-[#6B00D7]">ETH</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {metrics.recentEvents.filter(e => e.blockchainData?.chain === 'ETH').length}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#9242FC]/10 flex items-center justify-center mb-1">
                          <span className="text-xs font-bold text-[#9242FC]">SOL</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {metrics.recentEvents.filter(e => e.blockchainData?.chain === 'SOL').length}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-[#FF5AF7]/10 flex items-center justify-center mb-1">
                          <span className="text-xs font-bold text-[#FF5AF7]">TON</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {metrics.recentEvents.filter(e => e.blockchainData?.chain === 'TON').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="events">Recent Events</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                <TabsTrigger value="models">AI Models</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recent Events Summary */}
                  <Card className="border-border">
                    <CardHeader className="bg-muted/20 pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-[#6B00D7]" />
                        Latest Security Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {metrics.recentEvents.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">
                          No security events detected in the last 24 hours
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {metrics.recentEvents.slice(0, 3).map((event) => (
                            <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                              {
                                React.createElement(
                                  getEventTypeIcon(event.type), 
                                  { className: `h-4 w-4 mt-0.5 ${getEventTypeColor(event.type)}` }
                                )
                              }
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div className="font-medium text-sm">{event.description}</div>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${event.confidence > 0.8 ? 'bg-red-500/10 text-red-500 border-red-200' : 'bg-yellow-500/10 text-yellow-500 border-yellow-200'}`}
                                  >
                                    {Math.round(event.confidence * 100)}%
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimeAgo(event.timestamp)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-3 pb-3 px-4 text-xs text-muted-foreground">
                      Showing {Math.min(3, metrics.recentEvents.length)} of {metrics.totalEvents} total events
                    </CardFooter>
                  </Card>
                  
                  {/* Risk Assessment */}
                  <Card className="border-border">
                    <CardHeader className="bg-muted/20 pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#6B00D7]" />
                        Security Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      {metrics.recommendedActions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6">
                          No security recommendations available
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {metrics.recommendedActions.slice(0, 4).map((action, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-[#6B00D7]">{index + 1}</span>
                              </div>
                              <div className="text-sm">{action}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-muted/20 pt-3 pb-3 px-4 text-xs text-muted-foreground">
                      Based on AI analysis of recent vault activity
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Events Tab */}
              <TabsContent value="events" className="mt-4">
                <Card className="border-border">
                  <CardHeader className="bg-muted/20 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Security Event Log</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <Filter className="h-3.5 w-3.5 mr-1" />
                          Filter
                        </Button>
                        <div className="flex border rounded-md overflow-hidden">
                          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-none border-r">
                            <LayoutGrid className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-none bg-muted/40">
                            <List className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {metrics.recentEvents.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          No security events detected
                        </div>
                      ) : (
                        metrics.recentEvents.map((event) => (
                          <div key={event.id} className="p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getEventTypeColor(event.type).replace('text-', 'bg-').replace('500', '100')} ${getEventTypeColor(event.type)}`}>
                                {
                                  React.createElement(
                                    getEventTypeIcon(event.type), 
                                    { className: 'h-5 w-5' }
                                  )
                                }
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{event.description}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {event.details.description || 'No additional details available'}
                                    </div>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className={`${event.confidence > 0.8 ? 'bg-red-500/10 text-red-500 border-red-200' : event.confidence > 0.7 ? 'bg-orange-500/10 text-orange-500 border-orange-200' : 'bg-yellow-500/10 text-yellow-500 border-yellow-200'}`}
                                  >
                                    {Math.round(event.confidence * 100)}% confidence
                                  </Badge>
                                </div>
                                
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="gap-1 text-xs">
                                    {
                                      React.createElement(
                                        getModelTypeIcon(event.modelType), 
                                        { className: 'h-3 w-3 mr-1' }
                                      )
                                    }
                                    {event.modelType.replace('_', ' ')}
                                  </Badge>
                                  
                                  {event.blockchainData?.chain && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                      <Network className="h-3 w-3 mr-1" />
                                      {event.blockchainData.chain === 'cross_chain' ? 'Cross-Chain' : event.blockchainData.chain}
                                    </Badge>
                                  )}
                                  
                                  {event.recommendedActions && event.recommendedActions.length > 0 && (
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                      <Check className="h-3 w-3 mr-1" />
                                      {event.recommendedActions.length} action{event.recommendedActions.length !== 1 ? 's' : ''}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-xs text-muted-foreground mt-2">
                                  {formatTimestamp(event.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Recommendations Tab */}
              <TabsContent value="recommendations" className="mt-4">
                <Card className="border-border">
                  <CardHeader className="bg-muted/20 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#6B00D7]" />
                      AI-Generated Security Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {metrics.recommendedActions.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No security recommendations available
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {metrics.recommendedActions.map((action, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-[#6B00D7]">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium">{action}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {index === 0 ? 'Priority recommendation based on high confidence AI analysis.' :
                                 index === 1 ? 'Strong recommendation to address potential security vulnerabilities.' :
                                 index === 2 ? 'Recommended as a preventative security measure.' :
                                 'General security recommendation for all vaults.'}
                              </div>
                              <div className="mt-3">
                                <Button variant="secondary" size="sm" className="h-7 text-xs mr-2">
                                  Implement Now
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Learn More
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* AI Models Tab */}
              <TabsContent value="models" className="mt-4">
                <Card className="border-border">
                  <CardHeader className="bg-muted/20 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#6B00D7]" />
                      AI Security Models
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                              <Filter className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                              <div className="font-medium">Anomaly Detection</div>
                              <div className="text-xs text-muted-foreground">Identifies unusual vault activity</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Confidence Threshold</span>
                              <span>{75}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Events Detected</span>
                              <span>{metrics.anomalyCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Key Features</span>
                              <span>Time & Location</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                              <LayoutGrid className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <div className="font-medium">Pattern Recognition</div>
                              <div className="text-xs text-muted-foreground">Detects suspicious transaction patterns</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Confidence Threshold</span>
                              <span>{80}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Events Detected</span>
                              <span>{metrics.patternCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Key Features</span>
                              <span>Transaction Patterns</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                              <Activity className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <div className="font-medium">Behavioral Analysis</div>
                              <div className="text-xs text-muted-foreground">Analyzes user interaction patterns</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Confidence Threshold</span>
                              <span>{70}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Events Detected</span>
                              <span>{metrics.suspiciousCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Key Features</span>
                              <span>Cross-Chain Activity</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-muted/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <FileBarChart className="h-4 w-4 text-purple-500" />
                            </div>
                            <div>
                              <div className="font-medium">Predictive Security</div>
                              <div className="text-xs text-muted-foreground">Forecasts potential security threats</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Confidence Threshold</span>
                              <span>{65}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Events Detected</span>
                              <span>{metrics.predictionCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Key Features</span>
                              <span>Multiple Risk Factors</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/20 p-4 rounded-lg">
                        <h3 className="font-medium mb-4">AI Model Enhancement Roadmap</h3>
                        <div className="space-y-6">
                          <div className="relative">
                            <div className="absolute left-3 top-1 bottom-0 w-px bg-border"></div>
                            <div className="space-y-6 ml-6">
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center absolute -left-3">
                                    <Check className="h-3 w-3" />
                                  </div>
                                  <h4 className="font-medium text-sm">Initial AI Security Models</h4>
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Basic anomaly detection and pattern recognition</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center absolute -left-3">
                                    <Check className="h-3 w-3" />
                                  </div>
                                  <h4 className="font-medium text-sm">Enhanced Behavioral Analysis</h4>
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Improved cross-chain activity monitoring</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 rounded-full bg-[#6B00D7]/10 text-[#6B00D7] flex items-center justify-center absolute -left-3">
                                    <div className="h-2 w-2 bg-[#6B00D7] rounded-full"></div>
                                  </div>
                                  <h4 className="font-medium text-sm">Advanced Predictive Security</h4>
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Real-time threat prediction with higher accuracy</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 rounded-full bg-border text-muted-foreground flex items-center justify-center absolute -left-3">
                                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                                  </div>
                                  <h4 className="font-medium text-sm text-muted-foreground">Generative Security Recommendations</h4>
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Customized security fixes using generative AI</p>
                              </div>
                              
                              <div>
                                <div className="flex items-center mb-1">
                                  <div className="w-6 h-6 rounded-full bg-border text-muted-foreground flex items-center justify-center absolute -left-3">
                                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                                  </div>
                                  <h4 className="font-medium text-sm text-muted-foreground">Autonomous Security Management</h4>
                                </div>
                                <p className="text-xs text-muted-foreground ml-1">Self-healing security systems with minimal user input</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground flex justify-between">
        <span>Data last updated: {formatTimestamp(metrics.lastUpdated)}</span>
        <span>{getRefreshTime()}</span>
      </CardFooter>
    </Card>
  );
}
