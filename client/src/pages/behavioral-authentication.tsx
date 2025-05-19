/**
 * Behavioral Authentication Page
 * 
 * This page demonstrates and configures the platform's behavioral authentication system,
 * which analyzes user interaction patterns for continuous authentication.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Shield, Fingerprint, Activity, Clock, 
  MousePointer, Keyboard, Eye, CheckCircle, AlertCircle,
  CogIcon, Lock, Smartphone, Brain, MousePointerClick, Loader2
} from 'lucide-react';

// Modified to handle both Route component props and our custom tab prop
const BehavioralAuthenticationPage = (props: any) => {
  // Extract the tab prop if it exists, otherwise check for a tab parameter in the route
  const tabParam = props.tab || (props.params && props.params.tab);
  const [_, navigate] = useLocation();
  // Use the tab parameter if provided, otherwise default to 'overview'
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');
  const [isScanning, setIsScanning] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [simulationComplete, setSimulationComplete] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    enabled: true,
    sensitivityLevel: 'medium',
    continuousMonitoring: true,
    failedAttemptThreshold: 3,
    lockoutPeriod: 10,
    collectMouseMovements: true,
    collectKeyboardDynamics: true,
    collectTouchGestures: true,
    notifyOnSuspiciousActivity: true,
    backupAuthMethod: 'biometric',
    useAIEnhancement: true
  });
  
  // Metrics for visualization
  const [patternMetrics, setPatternMetrics] = useState({
    mouseMovement: 0,
    typingRhythm: 0,
    scrollBehavior: 0,
    interactionTiming: 0,
    touchDynamics: 0,
    overallMatch: 0
  });
  
  // Simulated behavioral pattern history
  const [patternHistory, setPatternHistory] = useState([
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      confidenceScore: 94,
      result: 'authenticated',
      deviceInfo: 'MacBook Pro (Home)',
      location: 'San Francisco, CA'
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      confidenceScore: 96,
      result: 'authenticated',
      deviceInfo: 'iPhone 14 Pro (Mobile)',
      location: 'San Francisco, CA'
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      confidenceScore: 65,
      result: 'failed',
      deviceInfo: 'Unknown Windows PC',
      location: 'Amsterdam, Netherlands'
    },
    {
      date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      confidenceScore: 92,
      result: 'authenticated',
      deviceInfo: 'MacBook Pro (Home)',
      location: 'San Francisco, CA'
    }
  ]);
  
  // Update setting
  const updateSetting = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  // Run simulation
  useEffect(() => {
    if (isScanning && !simulationComplete) {
      const simulationDuration = 3000; // 3 seconds
      const intervalDuration = 50; // 50ms updates
      const steps = simulationDuration / intervalDuration;
      let currentStep = 0;
      
      const interval = setInterval(() => {
        currentStep++;
        const progress = (currentStep / steps) * 100;
        
        // Update confidence score gradually
        setConfidenceScore(Math.min(Math.floor((progress / 100) * 94), 94));
        
        // Update pattern metrics with slightly different rates for visual interest
        setPatternMetrics({
          mouseMovement: Math.min(Math.floor((progress / 100) * 91), 91),
          typingRhythm: Math.min(Math.floor((progress / 100) * 88), 88),
          scrollBehavior: Math.min(Math.floor((progress / 100) * 95), 95),
          interactionTiming: Math.min(Math.floor((progress / 100) * 93), 93),
          touchDynamics: Math.min(Math.floor((progress / 100) * 85), 85),
          overallMatch: Math.min(Math.floor((progress / 100) * 92), 92)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setIsScanning(false);
          setSimulationComplete(true);
        }
      }, intervalDuration);
      
      return () => clearInterval(interval);
    }
  }, [isScanning, simulationComplete]);
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Start scanning simulation
  const handleStartScan = () => {
    setConfidenceScore(0);
    setPatternMetrics({
      mouseMovement: 0,
      typingRhythm: 0,
      scrollBehavior: 0,
      interactionTiming: 0,
      touchDynamics: 0,
      overallMatch: 0
    });
    setSimulationComplete(false);
    setIsScanning(true);
  };
  
  // Reset simulation
  const handleReset = () => {
    setConfidenceScore(0);
    setPatternMetrics({
      mouseMovement: 0,
      typingRhythm: 0,
      scrollBehavior: 0,
      interactionTiming: 0,
      touchDynamics: 0,
      overallMatch: 0
    });
    setSimulationComplete(false);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-[#6B00D7]/10"
        onClick={() => navigate('/security-dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Security Dashboard
      </Button>
      
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
          <Fingerprint className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Behavioral Authentication
        </h1>
      </div>
      
      <p className="text-gray-400 max-w-3xl mb-6">
        Our advanced behavioral authentication system provides continuous, passive security by analyzing your unique
        interaction patterns. Unlike traditional authentication that happens once at login, behavioral authentication
        works continuously in the background to ensure your identity.
      </p>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 bg-[#1A1A1A] border border-[#333] p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="demo" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Interactive Demo
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Settings
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Social Recovery
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">How Behavioral Authentication Works</CardTitle>
              <CardDescription className="text-gray-400">
                Understanding the advanced biometric security protecting your vaults
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <Fingerprint className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Passive Biometric Analysis</h3>
                      <p className="text-gray-400">
                        Our system analyzes micro-patterns in how you interact with your device, 
                        creating a unique behavioral fingerprint that's nearly impossible to replicate. 
                        This includes mouse movements, typing rhythm, scrolling behavior, and more.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <Brain className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">AI-Powered Pattern Recognition</h3>
                      <p className="text-gray-400">
                        Advanced neural networks continuously learn and adapt to subtle changes in your 
                        behavior while maintaining the ability to detect suspicious deviations that might 
                        indicate an unauthorized access attempt.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <Activity className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Continuous Authentication</h3>
                      <p className="text-gray-400">
                        Unlike traditional security that only checks identity at login, behavioral 
                        authentication works continuously throughout your session, providing real-time 
                        protection against session hijacking and unauthorized access.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <MousePointer className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Measured Interaction Factors</h3>
                      <p className="text-gray-400">
                        <span className="font-medium text-white block mb-1">We analyze:</span>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Mouse movement velocity and patterns</li>
                          <li>Keystroke dynamics and typing rhythm</li>
                          <li>Touch gesture characteristics (on mobile)</li>
                          <li>App navigation and interaction timing</li>
                          <li>Scroll speed and scrolling patterns</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Privacy-Preserving Security</h3>
                      <p className="text-gray-400">
                        Your behavioral data never leaves your device. Our zero-knowledge implementation
                        processes all behavioral patterns locally, with only encrypted confidence scores
                        transmitted to our servers when necessary.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-[#6B00D7]/20 p-2 rounded-full mt-1">
                      <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Multiple Layer Protection</h3>
                      <p className="text-gray-400">
                        Behavioral authentication works alongside other security measures, creating
                        multiple layers of protection. Even if a password is compromised, an attacker
                        cannot replicate your unique behavioral patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Authentication History */}
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Authentication History</CardTitle>
              <CardDescription className="text-gray-400">
                Recent behavioral authentication events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patternHistory.map((event, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-lg border ${
                      event.result === 'authenticated' 
                        ? 'border-green-500/30 bg-green-500/10' 
                        : 'border-red-500/30 bg-red-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {event.result === 'authenticated' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-white">
                            {event.result === 'authenticated' ? 'Successful Authentication' : 'Failed Authentication'}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatDate(event.date)} • {event.deviceInfo} • {event.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Confidence</div>
                          <div className={`font-medium ${
                            event.confidenceScore >= 90 ? 'text-green-500' :
                            event.confidenceScore >= 70 ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {event.confidenceScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-gray-400 border-[#333] hover:bg-[#242424]">
                View Complete History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Demo Tab */}
        <TabsContent value="demo" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Interactive Demonstration</CardTitle>
              <CardDescription className="text-gray-400">
                See how behavioral authentication analyzes your interaction patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-8">
                <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                  This demo simulates our behavioral authentication system analyzing your interaction
                  patterns. In a real scenario, this happens continuously in the background while you
                  use the application.
                </p>
                
                {!isScanning && !simulationComplete ? (
                  <Button 
                    className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90 text-white"
                    onClick={handleStartScan}
                  >
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Begin Behavioral Analysis
                  </Button>
                ) : isScanning ? (
                  <div className="bg-[#242424] border border-[#333] p-6 rounded-lg max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <Loader2 className="h-5 w-5 text-[#FF5AF7] animate-spin" />
                      <h3 className="text-lg font-medium text-white">Analyzing Behavior Patterns</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Please wait while we analyze your interaction patterns...
                    </p>
                    <Progress value={confidenceScore} max={100} className="h-2 bg-[#333]" />
                  </div>
                ) : (
                  <div className="bg-[#242424] border border-[#333] p-6 rounded-lg max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <h3 className="text-lg font-medium text-white">Analysis Complete</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Your behavior patterns have been analyzed and match your profile.
                    </p>
                    <div className="bg-[#1A1A1A] p-3 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Confidence Score:</span>
                        <span className="text-green-500 font-bold">{confidenceScore}%</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10"
                      onClick={handleReset}
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Run Again
                    </Button>
                  </div>
                )}
              </div>
              
              {(isScanning || simulationComplete) && (
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-white mb-4">Behavior Pattern Analysis</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <MousePointer className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-gray-400">Mouse Movement Pattern</span>
                        </div>
                        <span className="text-white">{patternMetrics.mouseMovement}%</span>
                      </div>
                      <Progress value={patternMetrics.mouseMovement} max={100} className="h-2 bg-[#333]" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Keyboard className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-gray-400">Typing Rhythm</span>
                        </div>
                        <span className="text-white">{patternMetrics.typingRhythm}%</span>
                      </div>
                      <Progress value={patternMetrics.typingRhythm} max={100} className="h-2 bg-[#333]" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <MousePointerClick className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-gray-400">Scroll Behavior</span>
                        </div>
                        <span className="text-white">{patternMetrics.scrollBehavior}%</span>
                      </div>
                      <Progress value={patternMetrics.scrollBehavior} max={100} className="h-2 bg-[#333]" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-gray-400">Interaction Timing</span>
                        </div>
                        <span className="text-white">{patternMetrics.interactionTiming}%</span>
                      </div>
                      <Progress value={patternMetrics.interactionTiming} max={100} className="h-2 bg-[#333]" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="text-gray-400">Touch Dynamics</span>
                        </div>
                        <span className="text-white">{patternMetrics.touchDynamics}%</span>
                      </div>
                      <Progress value={patternMetrics.touchDynamics} max={100} className="h-2 bg-[#333]" />
                    </div>
                    
                    <Separator className="my-4 bg-[#333]" />
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Fingerprint className="h-4 w-4 text-[#FF5AF7]" />
                          <span className="font-medium text-white">Overall Pattern Match</span>
                        </div>
                        <span className="text-white font-bold">{patternMetrics.overallMatch}%</span>
                      </div>
                      <Progress value={patternMetrics.overallMatch} max={100} className="h-3 bg-[#333]" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                <div className="flex items-center">
                  <CogIcon className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  Behavioral Authentication Settings
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your behavioral authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Basic Settings</h3>
                  <Separator className="bg-[#333]" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Enable Behavioral Authentication</Label>
                      <p className="text-xs text-gray-400">Use continuous behavioral analysis for authentication</p>
                    </div>
                    <Switch 
                      checked={settings.enabled}
                      onCheckedChange={(checked) => updateSetting('enabled', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Sensitivity Level</Label>
                    <p className="text-xs text-gray-400 mb-2">Adjust how sensitive the system is to variations in your behavior</p>
                    <Select 
                      value={settings.sensitivityLevel} 
                      onValueChange={(value) => updateSetting('sensitivityLevel', value)}
                    >
                      <SelectTrigger className="bg-[#242424] border-[#333] text-white">
                        <SelectValue placeholder="Select sensitivity level" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#242424] border-[#333]">
                        <SelectItem value="low" className="text-white hover:bg-[#333]">Low (More Permissive)</SelectItem>
                        <SelectItem value="medium" className="text-white hover:bg-[#333]">Medium (Balanced)</SelectItem>
                        <SelectItem value="high" className="text-white hover:bg-[#333]">High (More Strict)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Continuous Monitoring</Label>
                      <p className="text-xs text-gray-400">Continuously monitor behavior throughout the session</p>
                    </div>
                    <Switch 
                      checked={settings.continuousMonitoring}
                      onCheckedChange={(checked) => updateSetting('continuousMonitoring', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Failed Attempt Threshold</Label>
                      <p className="text-xs text-gray-400 mb-2">Number of failed attempts before lockout</p>
                      <Input
                        type="number"
                        min={1}
                        max={10}
                        value={settings.failedAttemptThreshold}
                        onChange={(e) => updateSetting('failedAttemptThreshold', parseInt(e.target.value))}
                        className="bg-[#242424] border-[#333] text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white">Lockout Period (minutes)</Label>
                      <p className="text-xs text-gray-400 mb-2">Time before allowing authentication again</p>
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        value={settings.lockoutPeriod}
                        onChange={(e) => updateSetting('lockoutPeriod', parseInt(e.target.value))}
                        className="bg-[#242424] border-[#333] text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Data Collection</h3>
                  <Separator className="bg-[#333]" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Mouse Movement Patterns</Label>
                      <p className="text-xs text-gray-400">Collect data on mouse movement velocity and patterns</p>
                    </div>
                    <Switch 
                      checked={settings.collectMouseMovements}
                      onCheckedChange={(checked) => updateSetting('collectMouseMovements', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Keyboard Dynamics</Label>
                      <p className="text-xs text-gray-400">Analyze typing rhythm and keyboard interaction patterns</p>
                    </div>
                    <Switch 
                      checked={settings.collectKeyboardDynamics}
                      onCheckedChange={(checked) => updateSetting('collectKeyboardDynamics', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Touch Gestures</Label>
                      <p className="text-xs text-gray-400">Collect touch gesture patterns on mobile devices</p>
                    </div>
                    <Switch 
                      checked={settings.collectTouchGestures}
                      onCheckedChange={(checked) => updateSetting('collectTouchGestures', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Advanced Settings</h3>
                  <Separator className="bg-[#333]" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Suspicious Activity Notifications</Label>
                      <p className="text-xs text-gray-400">Receive notifications about suspicious login attempts</p>
                    </div>
                    <Switch 
                      checked={settings.notifyOnSuspiciousActivity}
                      onCheckedChange={(checked) => updateSetting('notifyOnSuspiciousActivity', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Backup Authentication Method</Label>
                    <p className="text-xs text-gray-400 mb-2">Select secondary authentication method if behavioral fails</p>
                    <Select 
                      value={settings.backupAuthMethod} 
                      onValueChange={(value) => updateSetting('backupAuthMethod', value)}
                    >
                      <SelectTrigger className="bg-[#242424] border-[#333] text-white">
                        <SelectValue placeholder="Select backup method" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#242424] border-[#333]">
                        <SelectItem value="biometric" className="text-white hover:bg-[#333]">Biometric (Fingerprint/Face)</SelectItem>
                        <SelectItem value="mfa" className="text-white hover:bg-[#333]">Multi-Factor Authentication</SelectItem>
                        <SelectItem value="recovery" className="text-white hover:bg-[#333]">Recovery Codes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">AI-Enhanced Analysis</Label>
                      <p className="text-xs text-gray-400">Use neural networks to improve detection accuracy</p>
                    </div>
                    <Switch 
                      checked={settings.useAIEnhancement}
                      onCheckedChange={(checked) => updateSetting('useAIEnhancement', checked)}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#6B00D7] hover:bg-[#5A00B6] text-white">
                <Shield className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Social Recovery Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Social Recovery System</CardTitle>
              <CardDescription className="text-gray-400">
                Recover your vault access through trusted contacts in case of emergency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                <h3 className="text-white font-medium mb-2">How Social Recovery Works</h3>
                <p className="text-gray-400">
                  Social recovery enables you to regain access to your vault through trusted contacts
                  if you lose your authentication credentials. It's a secure backup system that doesn't 
                  compromise your vault's security.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-white">Enable Social Recovery</Label>
                    <p className="text-xs text-gray-400">Allow trusted contacts to help recover your vault access</p>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <Separator className="bg-[#333]" />
                
                <div className="space-y-2">
                  <Label className="text-white">Trusted Contacts</Label>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-[#242424] p-3 rounded-lg border border-[#333]">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#333] rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-sm text-white">JD</span>
                        </div>
                        <div>
                          <p className="text-white">John Doe</p>
                          <p className="text-xs text-gray-400">john.doe@example.com</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-[#333]">
                        Remove
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center bg-[#242424] p-3 rounded-lg border border-[#333]">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#333] rounded-full h-10 w-10 flex items-center justify-center">
                          <span className="text-sm text-white">AS</span>
                        </div>
                        <div>
                          <p className="text-white">Alice Smith</p>
                          <p className="text-xs text-gray-400">alice.smith@example.com</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-[#333]">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 border border-dashed border-[#6B00D7] bg-transparent hover:bg-[#6B00D7]/10 text-[#FF5AF7]">
                  Add Trusted Contact
                </Button>
              </div>
              
              <div className="bg-[#242424] rounded-lg p-4 border border-[#333]">
                <h3 className="text-white font-medium mb-2">Recovery Settings</h3>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-white">Required Confirmations</Label>
                    <p className="text-xs text-gray-400">Number of trusted contacts required to approve recovery</p>
                    <Select defaultValue="2">
                      <SelectTrigger className="bg-[#333] border-[#444] text-white">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-[#444] text-white">
                        <SelectItem value="1">1 contact (least secure)</SelectItem>
                        <SelectItem value="2">2 contacts (recommended)</SelectItem>
                        <SelectItem value="3">All contacts (most secure)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Recovery Time Delay</Label>
                    <p className="text-xs text-gray-400">Waiting period before recovery is processed</p>
                    <Select defaultValue="24h">
                      <SelectTrigger className="bg-[#333] border-[#444] text-white">
                        <SelectValue placeholder="Select delay" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#333] border-[#444] text-white">
                        <SelectItem value="12h">12 hours</SelectItem>
                        <SelectItem value="24h">24 hours (recommended)</SelectItem>
                        <SelectItem value="48h">48 hours</SelectItem>
                        <SelectItem value="72h">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#6B00D7] hover:bg-[#5A00B6] text-white">
                Save Recovery Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralAuthenticationPage;