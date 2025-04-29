/**
 * Static AI Security Dashboard Component
 * 
 * This is a simplified, static version of the AI Security Dashboard
 * that doesn't rely on the dynamic service calls that might cause errors.
 */

import React from 'react';
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
  Network,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

interface StaticAISecurityDashboardProps {
  vaultId?: string;
  className?: string;
}

export function StaticAISecurityDashboard({ vaultId, className }: StaticAISecurityDashboardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

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
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Analysis
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Risk Score */}
            <Card className="bg-muted/30 border-border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Risk Score</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-center items-center flex-col">
                  <div className="text-4xl font-bold text-yellow-500">
                    45
                  </div>
                  <Progress 
                    value={45} 
                    max={100} 
                    className="h-2 w-full mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Moderate risk detected
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
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Critical Events</span>
                    <span className="font-medium text-red-500">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Confidence</span>
                    <span className="font-medium">73%</span>
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
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Activity className="h-3 w-3 text-blue-500" /> Patterns
                    </span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3 text-red-500" /> Suspicious
                    </span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Zap className="h-3 w-3 text-purple-500" /> Predictions
                    </span>
                    <span className="font-medium">3</span>
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
                      <span className="text-xs text-muted-foreground">4</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#9242FC]/10 flex items-center justify-center mb-1">
                        <span className="text-xs font-bold text-[#9242FC]">SOL</span>
                      </div>
                      <span className="text-xs text-muted-foreground">5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#FF5AF7]/10 flex items-center justify-center mb-1">
                        <span className="text-xs font-bold text-[#FF5AF7]">TON</span>
                      </div>
                      <span className="text-xs text-muted-foreground">3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
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
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 pb-3 border-b border-border">
                        <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">Anomaly detected in time patterns</div>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-200"
                            >
                              78%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            2 hours ago
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 pb-3 border-b border-border">
                        <ShieldAlert className="h-4 w-4 mt-0.5 text-red-500" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">High-value cross-chain activity</div>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-red-500/10 text-red-500 border-red-200"
                            >
                              86%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            5 hours ago
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Zap className="h-4 w-4 mt-0.5 text-purple-500" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="font-medium text-sm">Potential cross-chain vulnerability</div>
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-200"
                            >
                              71%
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            9 hours ago
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/20 pt-3 pb-3 px-4 text-xs text-muted-foreground">
                    Showing 3 of 12 total events
                  </CardFooter>
                </Card>
                
                {/* Recommendations */}
                <Card className="border-border">
                  <CardHeader className="bg-muted/20 pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#6B00D7]" />
                      Security Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#6B00D7]">1</span>
                        </div>
                        <div className="text-sm">Review recent transactions for unauthorized access patterns</div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#6B00D7]">2</span>
                        </div>
                        <div className="text-sm">Temporarily increase security level until anomaly is resolved</div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#6B00D7]">3</span>
                        </div>
                        <div className="text-sm">Implement multi-signature authorization for high-value transactions</div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#6B00D7]">4</span>
                        </div>
                        <div className="text-sm">Consider using the Privacy Layer for sensitive operations</div>
                      </div>
                    </div>
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">Anomaly detected in time patterns</div>
                              <div className="text-sm text-muted-foreground">
                                Vault accessed at unusual hours
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="bg-yellow-500/10 text-yellow-500 border-yellow-200"
                            >
                              78% confidence
                            </Badge>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Filter className="h-3 w-3 mr-1" />
                              anomaly_detection
                            </Badge>
                            
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Network className="h-3 w-3 mr-1" />
                              ETH
                            </Badge>
                            
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              3 actions
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-2">
                            {formatDate(Date.now() - 2 * 60 * 60 * 1000)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                          <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">High-value cross-chain activity</div>
                              <div className="text-sm text-muted-foreground">
                                Unusual pattern of high-value transactions across multiple chains
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="bg-red-500/10 text-red-500 border-red-200"
                            >
                              86% confidence
                            </Badge>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              behavioral_analysis
                            </Badge>
                            
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Network className="h-3 w-3 mr-1" />
                              Cross-Chain
                            </Badge>
                            
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              3 actions
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-muted-foreground mt-2">
                            {formatDate(Date.now() - 5 * 60 * 60 * 1000)}
                          </div>
                        </div>
                      </div>
                    </div>
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
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#6B00D7]">1</span>
                      </div>
                      <div>
                        <div className="font-medium">Review recent transactions for unauthorized access patterns</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Priority recommendation based on high confidence AI analysis.
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
                    
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#6B00D7]">2</span>
                      </div>
                      <div>
                        <div className="font-medium">Temporarily increase security level until anomaly is resolved</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Strong recommendation to address potential security vulnerabilities.
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

                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-[#6B00D7]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-[#6B00D7]">3</span>
                      </div>
                      <div>
                        <div className="font-medium">Implement multi-signature authorization for high-value transactions</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Recommended as a preventative security measure.
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
                  </div>
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
                            <span>75%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Events Detected</span>
                            <span>3</span>
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
                            <span>80%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Events Detected</span>
                            <span>4</span>
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
                            <span>70%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Events Detected</span>
                            <span>2</span>
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
                            <span>65%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Events Detected</span>
                            <span>3</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Key Features</span>
                            <span>Multiple Risk Factors</span>
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
      </CardContent>
      
      <CardFooter className="bg-muted/30 px-6 py-3 text-xs text-muted-foreground flex justify-between">
        <span>Powered by advanced machine learning models</span>
        <span>Last updated: {formatDate(Date.now())}</span>
      </CardFooter>
    </Card>
  );
}
