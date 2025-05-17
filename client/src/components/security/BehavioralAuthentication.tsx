import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Brain, ChevronDown, ChevronUp, Eye, Fingerprint, Info, LineChart, Lock, ShieldAlert, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface BehavioralPattern {
  id: string;
  type: 'transaction' | 'login' | 'interaction';
  description: string;
  confidence: number;
  lastSeen: string;
  status: 'active' | 'learning' | 'disabled';
}

interface AnomalyEvent {
  id: string;
  date: string;
  type: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'false_positive';
  chainType: string;
}

interface BehavioralAuthenticationProps {
  userId?: string;
  enableLearning?: boolean;
  enableRealTimeMonitoring?: boolean;
}

export function BehavioralAuthentication({
  userId = 'user-1747503234',
  enableLearning = true,
  enableRealTimeMonitoring = true
}: BehavioralAuthenticationProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [learningEnabled, setLearningEnabled] = useState(enableLearning);
  const [monitoringEnabled, setMonitoringEnabled] = useState(enableRealTimeMonitoring);
  const [behavioralScore, setBehavioralScore] = useState(87);
  const [learningProgress, setLearningProgress] = useState(72);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [showPatternDetails, setShowPatternDetails] = useState(false);
  
  // Sample behavioral patterns (in a real app, this would come from an API)
  const [behavioralPatterns, setBehavioralPatterns] = useState<BehavioralPattern[]>([
    {
      id: 'pattern-001',
      type: 'transaction',
      description: 'Regular ETH transfers to known address 0x742...f3c',
      confidence: 92,
      lastSeen: '2 hours ago',
      status: 'active',
    },
    {
      id: 'pattern-002',
      type: 'login',
      description: 'Login pattern from desktop device with hardware wallet',
      confidence: 95,
      lastSeen: '3 days ago',
      status: 'active',
    },
    {
      id: 'pattern-003',
      type: 'transaction',
      description: 'Weekly BTC transactions of 0.01-0.05 BTC',
      confidence: 78,
      lastSeen: '6 days ago',
      status: 'active',
    },
    {
      id: 'pattern-004',
      type: 'interaction',
      description: 'Regular interaction with DeFi platforms (Uniswap, Aave)',
      confidence: 85,
      lastSeen: '1 day ago',
      status: 'active',
    },
    {
      id: 'pattern-005',
      type: 'transaction',
      description: 'Small SOL transactions to multiple wallets',
      confidence: 63,
      lastSeen: '12 days ago',
      status: 'learning',
    },
  ]);
  
  // Sample anomaly events (in a real app, this would come from an API)
  const [anomalyEvents, setAnomalyEvents] = useState<AnomalyEvent[]>([
    {
      id: 'anomaly-001',
      date: '2025-05-15T14:32:00Z',
      type: 'Unusual Transaction',
      description: 'Large ETH transfer to unknown wallet',
      riskLevel: 'high',
      status: 'pending',
      chainType: 'ETH',
    },
    {
      id: 'anomaly-002',
      date: '2025-05-14T09:15:00Z',
      type: 'Login Pattern',
      description: 'Login attempt from new location (Berlin, Germany)',
      riskLevel: 'medium',
      status: 'verified',
      chainType: 'N/A',
    },
    {
      id: 'anomaly-003',
      date: '2025-05-10T23:45:00Z',
      type: 'Transaction Pattern',
      description: 'Multiple small transactions in short time period',
      riskLevel: 'low',
      status: 'false_positive',
      chainType: 'SOL',
    },
    {
      id: 'anomaly-004',
      date: '2025-05-08T18:20:00Z',
      type: 'API Access',
      description: 'Unusual API calls to vault management',
      riskLevel: 'medium',
      status: 'verified',
      chainType: 'ALL',
    },
    {
      id: 'anomaly-005',
      date: '2025-05-05T11:07:00Z',
      type: 'Cross-Chain Activity',
      description: 'Unexpected cross-chain bridge transaction',
      riskLevel: 'critical',
      status: 'verified',
      chainType: 'TON/ETH',
    },
  ]);
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Toggle learning mode
  const toggleLearning = () => {
    setLearningEnabled(!learningEnabled);
    
    toast({
      title: learningEnabled ? "Learning Mode Disabled" : "Learning Mode Enabled",
      description: learningEnabled 
        ? "The system will stop learning new behavioral patterns"
        : "The system will continue learning your behavioral patterns",
      variant: "default",
    });
  };
  
  // Toggle monitoring
  const toggleMonitoring = () => {
    setMonitoringEnabled(!monitoringEnabled);
    
    toast({
      title: monitoringEnabled ? "Monitoring Paused" : "Monitoring Enabled",
      description: monitoringEnabled
        ? "Real-time behavioral monitoring is now paused"
        : "Real-time behavioral monitoring is now active",
      variant: "default",
    });
  };
  
  // Handle marking an anomaly as a false positive
  const markAsFalsePositive = (id: string) => {
    setAnomalyEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, status: 'false_positive' } : event
      )
    );
    
    toast({
      title: "Marked as False Positive",
      description: "This event will be used to improve detection accuracy",
      variant: "default",
    });
  };
  
  // Handle marking an anomaly as verified
  const markAsVerified = (id: string) => {
    setAnomalyEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, status: 'verified' } : event
      )
    );
    
    toast({
      title: "Marked as Verified Threat",
      description: "This event has been confirmed as an actual anomaly",
      variant: "default",
    });
  };
  
  // Get risk level badge color
  const getRiskLevelColor = (riskLevel: 'low' | 'medium' | 'high' | 'critical') => {
    switch (riskLevel) {
      case 'low': return 'bg-green-500/80';
      case 'medium': return 'bg-yellow-500/80';
      case 'high': return 'bg-orange-500/80';
      case 'critical': return 'bg-red-500/80';
      default: return 'bg-gray-500/80';
    }
  };
  
  // Simulate learning process
  useEffect(() => {
    if (learningEnabled) {
      const interval = setInterval(() => {
        // Randomly adjust learning progress to simulate real-time learning
        setLearningProgress(prevProgress => {
          const newProgress = Math.min(prevProgress + (Math.random() * 0.5), 100);
          return parseFloat(newProgress.toFixed(1));
        });
        
        // Randomly adjust confidence in behavioral patterns
        setBehavioralPatterns(prevPatterns => 
          prevPatterns.map(pattern => {
            if (pattern.status === 'learning') {
              const newConfidence = Math.min(pattern.confidence + (Math.random() * 0.3), 100);
              return {
                ...pattern,
                confidence: parseFloat(newConfidence.toFixed(1)),
                status: newConfidence > 80 ? 'active' : 'learning'
              };
            }
            return pattern;
          })
        );
        
        // Adjust overall behavioral score
        setBehavioralScore(prevScore => {
          const change = (Math.random() * 0.4) - 0.2; // Slight fluctuations between -0.2 and 0.2
          const newScore = Math.max(0, Math.min(100, prevScore + change));
          return parseFloat(newScore.toFixed(1));
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [learningEnabled]);
  
  // Generate a simulated new anomaly event every 20-40 seconds
  useEffect(() => {
    if (monitoringEnabled) {
      const interval = setInterval(() => {
        const randomChance = Math.random();
        if (randomChance > 0.7) { // 30% chance of generating an anomaly
          const chains = ['ETH', 'SOL', 'TON', 'BTC', 'ETH/SOL', 'TON/ETH'];
          const anomalyTypes = [
            'Unusual Transaction', 
            'Login Attempt',
            'API Access Pattern',
            'Vault Access',
            'Cross-Chain Activity'
          ];
          const descriptions = [
            'Unusual transaction amount',
            'Access from new location',
            'Multiple failed authentication attempts',
            'Vault access during unusual hours',
            'Unusual pattern of cross-chain transfers'
          ];
          const riskLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
          
          const newAnomaly: AnomalyEvent = {
            id: `anomaly-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
            status: 'pending',
            chainType: chains[Math.floor(Math.random() * chains.length)],
          };
          
          setAnomalyEvents(prev => [newAnomaly, ...prev].slice(0, 8)); // Keep only the most recent 8 events
          
          // Show a toast for high or critical risk events
          if (newAnomaly.riskLevel === 'high' || newAnomaly.riskLevel === 'critical') {
            toast({
              title: `${newAnomaly.riskLevel === 'critical' ? 'Critical' : 'High'} Risk Activity Detected`,
              description: newAnomaly.description,
              variant: "destructive",
            });
          }
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [monitoringEnabled, toast]);
  
  // Function to trigger a refresh of behavioral patterns
  const refreshPatterns = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate a new behavioral pattern with status 'learning'
      const newPattern: BehavioralPattern = {
        id: `pattern-${Date.now().toString().slice(-6)}`,
        type: Math.random() > 0.5 ? 'transaction' : (Math.random() > 0.5 ? 'login' : 'interaction'),
        description: `New ${Math.random() > 0.5 ? 'transaction' : 'interaction'} pattern detected`,
        confidence: 20 + Math.random() * 30, // Between 20 and 50
        lastSeen: 'Just now',
        status: 'learning',
      };
      
      setBehavioralPatterns(prev => [...prev, newPattern].slice(0, 7)); // Keep it limited to 7 patterns
      setIsLoading(false);
      
      toast({
        title: "New Pattern Detected",
        description: "Started learning a new behavioral pattern",
        variant: "default",
      });
    }, 1500);
  };
  
  // Function to clear all pending anomalies
  const clearPendingAnomalies = () => {
    setAnomalyEvents(prev => 
      prev.filter(event => event.status !== 'pending')
    );
    
    toast({
      title: "Pending Anomalies Cleared",
      description: "All pending anomalies have been dismissed",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Main stats card */}
        <Card className="flex-1 border-[#333] bg-[#121212]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-[#FF5AF7]" />
              Behavioral Authentication System
            </CardTitle>
            <CardDescription>
              AI-powered authentication that learns and verifies your interaction patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Trust Score</span>
                  <Badge 
                    variant="outline" 
                    className={`${behavioralScore > 80 ? 'border-green-500 text-green-500' : 
                      behavioralScore > 60 ? 'border-yellow-500 text-yellow-500' : 
                      'border-red-500 text-red-500'}`}
                  >
                    {behavioralScore > 80 ? 'High' : behavioralScore > 60 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-2">{behavioralScore.toFixed(1)}%</div>
                <Progress 
                  value={behavioralScore} 
                  className="h-2 bg-gray-700"
                  style={{
                    background: 'linear-gradient(to right, #6B00D7 0%, #FF5AF7 100%)',
                    backgroundSize: `${behavioralScore}% 100%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Based on {behavioralPatterns.length} recognized patterns
                </p>
              </div>
              
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Learning Progress</span>
                  <Badge 
                    variant="outline" 
                    className={`${learningProgress > 80 ? 'border-green-500 text-green-500' : 
                      learningProgress > 40 ? 'border-yellow-500 text-yellow-500' : 
                      'border-red-500 text-red-500'}`}
                  >
                    {learningProgress > 80 ? 'Advanced' : learningProgress > 40 ? 'Learning' : 'Starting'}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-2">{learningProgress.toFixed(1)}%</div>
                <Progress 
                  value={learningProgress} 
                  className="h-2 bg-gray-700"
                  style={{
                    background: 'linear-gradient(to right, #FF5AF7 0%, #6B00D7 100%)',
                    backgroundSize: `${learningProgress}% 100%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  {learningEnabled ? 'Actively learning from your behavior' : 'Learning mode disabled'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-[#FF5AF7]" />
                  <span className="text-sm">Learning Mode</span>
                </div>
                <Switch
                  checked={learningEnabled}
                  onCheckedChange={toggleLearning}
                  className="data-[state=checked]:bg-[#6B00D7]"
                />
              </div>
              
              <div className="flex items-center justify-between bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-[#FF5AF7]" />
                  <span className="text-sm">Monitoring</span>
                </div>
                <Switch
                  checked={monitoringEnabled}
                  onCheckedChange={toggleMonitoring}
                  className="data-[state=checked]:bg-[#6B00D7]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs border-[#333] hover:bg-[#1A1A1A]"
              onClick={() => setShowPatternDetails(!showPatternDetails)}
            >
              {showPatternDetails ? 'Hide' : 'Show'} Pattern Details
              {showPatternDetails ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
            </Button>
            <Button 
              size="sm" 
              className="text-xs bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
              onClick={refreshPatterns}
              disabled={isLoading}
            >
              {isLoading ? 'Scanning...' : 'Scan for New Patterns'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Anomaly detection card */}
        <Card className="flex-1 border-[#333] bg-[#121212]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#FF5AF7]" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              Detection and management of unusual activity patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[270px] pr-4">
              <Table>
                <TableHeader className="bg-[#1A1A1A] sticky top-0">
                  <TableRow className="hover:bg-transparent border-b border-[#333]">
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px] text-right">Risk</TableHead>
                    <TableHead className="w-[80px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {anomalyEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-sm text-gray-400 py-6">
                        No anomalies detected
                      </TableCell>
                    </TableRow>
                  ) : (
                    anomalyEvents.map((anomaly) => (
                      <TableRow 
                        key={anomaly.id} 
                        className={`border-b border-[#333] cursor-pointer ${selectedAnomalyId === anomaly.id ? 'bg-[#6B00D7]/10' : 'hover:bg-[#1A1A1A]'}`}
                        onClick={() => setSelectedAnomalyId(anomaly.id === selectedAnomalyId ? null : anomaly.id)}
                      >
                        <TableCell className="font-mono text-xs">
                          {formatDate(anomaly.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{anomaly.type}</span>
                            <span className="text-xs text-gray-400">{anomaly.description}</span>
                            {selectedAnomalyId === anomaly.id && (
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {anomaly.chainType}
                                </Badge>
                                {anomaly.status === 'pending' && (
                                  <>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-6 px-2 text-[10px] border-green-500 text-green-500 hover:bg-green-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsFalsePositive(anomaly.id);
                                      }}
                                    >
                                      Mark False Positive
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-6 px-2 text-[10px] border-orange-500 text-orange-500 hover:bg-orange-500/10"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsVerified(anomaly.id);
                                      }}
                                    >
                                      Verify Threat
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={`${getRiskLevelColor(anomaly.riskLevel)} text-white`}>
                            {anomaly.riskLevel.charAt(0).toUpperCase() + anomaly.riskLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant="outline" 
                            className={`
                              ${anomaly.status === 'pending' ? 'border-yellow-500 text-yellow-500' : 
                                anomaly.status === 'verified' ? 'border-red-500 text-red-500' : 
                                'border-green-500 text-green-500'}
                            `}
                          >
                            {anomaly.status === 'pending' ? 'Pending' : 
                              anomaly.status === 'verified' ? 'Verified' : 
                              'False +ve'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-xs text-gray-400">Live monitoring</span>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs border-[#333] hover:bg-[#1A1A1A]"
              onClick={clearPendingAnomalies}
              disabled={!anomalyEvents.some(a => a.status === 'pending')}
            >
              Clear Pending
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Behavioral patterns details (expandable) */}
      {showPatternDetails && (
        <Card className="border-[#333] bg-[#121212]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-[#FF5AF7]" />
              Recognized Behavioral Patterns
            </CardTitle>
            <CardDescription>
              Patterns of behavior that the system has learned to recognize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-[#1A1A1A]">
                <TableRow className="hover:bg-transparent border-b border-[#333]">
                  <TableHead>Pattern Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                  <TableHead className="text-right w-[100px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {behavioralPatterns.map((pattern) => (
                  <TableRow key={pattern.id} className="border-b border-[#333] hover:bg-[#1A1A1A]">
                    <TableCell>
                      <Badge variant="outline" className="capitalize border-[#6B00D7] text-[#FF5AF7]">
                        {pattern.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{pattern.description}</span>
                        <span className="text-xs text-gray-400">Last seen: {pattern.lastSeen}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{pattern.confidence.toFixed(1)}%</span>
                        <div className="w-24 h-1.5 bg-gray-700 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full ${
                              pattern.confidence > 80 ? 'bg-green-500' : 
                              pattern.confidence > 60 ? 'bg-yellow-500' : 
                              'bg-orange-500'
                            }`}
                            style={{ width: `${pattern.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${pattern.status === 'active' ? 'border-green-500 text-green-500' : 
                            pattern.status === 'learning' ? 'border-yellow-500 text-yellow-500' : 
                            'border-gray-500 text-gray-500'}
                        `}
                      >
                        {pattern.status.charAt(0).toUpperCase() + pattern.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Information and settings card */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-[#333]">
          <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#FF5AF7]" />
              <span>About Behavioral Authentication</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-gray-400">
            <div className="space-y-4">
              <p>
                The Behavioral Authentication system uses machine learning to build a unique profile of 
                your transaction patterns, login behaviors, and vault interactions. When unusual activity 
                is detected, the system can require additional verification or block suspicious operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserRoundCheck className="h-5 w-5 text-[#FF5AF7]" />
                    <h3 className="font-medium text-white">Continuous Verification</h3>
                  </div>
                  <p className="text-sm">
                    Rather than a single point-in-time check, the system continuously verifies that 
                    your actions match your established behavioral patterns.
                  </p>
                </div>
                
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-[#FF5AF7]" />
                    <h3 className="font-medium text-white">Adaptive Security</h3>
                  </div>
                  <p className="text-sm">
                    The system adapts to your changing behavior over time, maintaining security 
                    while reducing false positives as it learns.
                  </p>
                </div>
                
                <div className="bg-[#1A1A1A] border border-[#333] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    <h3 className="font-medium text-white">Privacy-Preserving</h3>
                  </div>
                  <p className="text-sm">
                    All behavioral analysis is done on-device using zero-knowledge proofs, 
                    ensuring your transaction details remain private.
                  </p>
                </div>
              </div>
              
              <Alert className="bg-[#1A1A1A] border border-yellow-500/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-500">Important Privacy Information</AlertTitle>
                <AlertDescription className="text-gray-400">
                  Your behavioral patterns are stored encrypted and never leave your device. Pattern matching 
                  is done using privacy-preserving techniques to ensure your transaction details remain confidential.
                </AlertDescription>
              </Alert>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}