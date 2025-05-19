/**
 * Security Dashboard Page
 * 
 * This page provides a comprehensive overview of the platform's security features,
 * security status across different chains, and security settings management.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Shield, AlertTriangle, CheckCircle2, Lock, ArrowLeft, 
  Activity, AlertCircle, Eye, EyeOff, XCircle, Clock,
  Fingerprint, ShieldAlert, ShieldCheck, Network, Zap, Key
} from 'lucide-react';

const SecurityDashboardPage = () => {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [securityScores, setSecurityScores] = useState({
    ethereum: 92,
    solana: 88,
    ton: 94,
    bitcoin: 90,
    overall: 91
  });
  
  // Mock security alerts for demonstration
  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 'alert-1',
      type: 'warning',
      message: 'Suspicious login attempt detected from unknown location',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      chainId: 'ethereum',
      resolved: false
    },
    {
      id: 'alert-2',
      type: 'info',
      message: 'Zero-knowledge proof verification successful for vault access',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      chainId: 'ton',
      resolved: true
    },
    {
      id: 'alert-3',
      type: 'critical',
      message: 'Multi-signature verification failed - additional signatures required',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      chainId: 'solana',
      resolved: true
    }
  ]);
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricEnabled: false,
    multiSignatureEnabled: true,
    anonymousTransactionsEnabled: false,
    quantumResistantEncryption: true,
    automaticLockEnabled: true,
    behavioralAnalysisEnabled: true,
    realTimeAlertsEnabled: true,
    deviceWhitelistEnabled: false,
    zeroKnowledgeProofsEnabled: true
  });

  // Toggle a security setting
  const toggleSetting = (setting: string) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: !securitySettings[setting as keyof typeof securitySettings]
    });
  };
  
  // Format alert time
  const formatAlertTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };
  
  // Alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <Button 
        variant="ghost" 
        className="mb-6 hover:bg-[#6B00D7]/10"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <div className="flex items-center mb-6">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30 mr-4">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
          Security Dashboard
        </h1>
      </div>
      
      <p className="text-gray-400 max-w-3xl mb-6">
        Monitor and manage the security of your vaults and cross-chain operations with our comprehensive security dashboard.
        Track security scores, manage alerts, and configure advanced security settings.
      </p>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Security Alerts
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
            Security Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Security Score Card */}
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  Security Score
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your overall security rating across all blockchains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-white font-semibold">Overall Security</div>
                  <div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      Excellent
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={securityScores.overall} 
                  className="h-3 bg-[#333]" 
                  indicatorClassName="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]" 
                />
                <div className="mt-1 text-right text-sm text-gray-400">{securityScores.overall}/100</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white">Ethereum</div>
                    <div className="text-sm text-gray-400">{securityScores.ethereum}/100</div>
                  </div>
                  <Progress 
                    value={securityScores.ethereum} 
                    className="h-2 bg-[#333]" 
                    indicatorClassName="bg-[#627EEA]" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white">Solana</div>
                    <div className="text-sm text-gray-400">{securityScores.solana}/100</div>
                  </div>
                  <Progress 
                    value={securityScores.solana} 
                    className="h-2 bg-[#333]" 
                    indicatorClassName="bg-[#9945FF]" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white">TON</div>
                    <div className="text-sm text-gray-400">{securityScores.ton}/100</div>
                  </div>
                  <Progress 
                    value={securityScores.ton} 
                    className="h-2 bg-[#333]" 
                    indicatorClassName="bg-[#0098EA]" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white">Bitcoin</div>
                    <div className="text-sm text-gray-400">{securityScores.bitcoin}/100</div>
                  </div>
                  <Progress 
                    value={securityScores.bitcoin} 
                    className="h-2 bg-[#333]" 
                    indicatorClassName="bg-[#F7931A]" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Security Features */}
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  Active Security Features
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Overview of your enabled security measures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <Fingerprint className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Multi-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm">Enhanced login security</p>
                  </div>
                </div>
                
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <Key className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Quantum-Resistant Encryption</h3>
                    <p className="text-gray-400 text-sm">Future-proof data protection</p>
                  </div>
                </div>
                
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <Network className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Cross-Chain Verification</h3>
                    <p className="text-gray-400 text-sm">Multi-blockchain security</p>
                  </div>
                </div>
                
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Behavioral Analysis</h3>
                    <p className="text-gray-400 text-sm">AI-powered threat detection</p>
                  </div>
                </div>
                
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Real-Time Monitoring</h3>
                    <p className="text-gray-400 text-sm">Continuous security checks</p>
                  </div>
                </div>
                
                <div className="bg-[#242424] rounded-lg p-4 border border-[#333] flex items-start space-x-3">
                  <div className="bg-[#6B00D7]/20 p-2 rounded-full">
                    <EyeOff className="h-5 w-5 text-[#FF5AF7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Zero-Knowledge Proofs</h3>
                    <p className="text-gray-400 text-sm">Privacy-preserving verification</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full text-[#FF5AF7] border-[#FF5AF7]/30 hover:bg-[#FF5AF7]/10"
                onClick={() => setActiveTab('settings')}
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                Manage Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  Security Alerts
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Recent security events and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.length > 0 ? (
                  securityAlerts.map(alert => (
                    <div 
                      key={alert.id} 
                      className={`p-4 rounded-lg border flex items-start space-x-3 ${
                        alert.type === 'critical' 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : alert.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30'
                            : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-white font-medium">{alert.message}</h3>
                          {alert.resolved && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 ml-2">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatAlertTime(alert.timestamp)}
                          <span className="mx-2">•</span>
                          <Badge variant="outline" className="bg-[#242424] text-gray-300 border-[#333] h-5">
                            {alert.chainId.charAt(0).toUpperCase() + alert.chainId.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white">All Clear</h3>
                    <p className="text-gray-400 mt-1">No security alerts detected</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="border-[#333] text-gray-400 hover:bg-[#242424]">
                <XCircle className="mr-2 h-4 w-4" />
                Clear All
              </Button>
              <Button className="bg-[#6B00D7] hover:bg-[#5A00B6] text-white">
                <Shield className="mr-2 h-4 w-4" />
                Run Security Scan
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-[#1A1A1A] border-[#333] shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                  Security Settings
                </div>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your security preferences and protection level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Authentication & Access</h3>
                  <Separator className="bg-[#333]" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Two-Factor Authentication</Label>
                      <p className="text-xs text-gray-400">Require 2FA code for all logins</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorEnabled}
                      onCheckedChange={() => toggleSetting('twoFactorEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Biometric Authentication</Label>
                      <p className="text-xs text-gray-400">Use fingerprint or face recognition</p>
                    </div>
                    <Switch 
                      checked={securitySettings.biometricEnabled}
                      onCheckedChange={() => toggleSetting('biometricEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Multi-Signature Verification</Label>
                      <p className="text-xs text-gray-400">Require multiple signatures for high-value transactions</p>
                    </div>
                    <Switch 
                      checked={securitySettings.multiSignatureEnabled}
                      onCheckedChange={() => toggleSetting('multiSignatureEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Automatic Lock</Label>
                      <p className="text-xs text-gray-400">Lock account after 15 minutes of inactivity</p>
                    </div>
                    <Switch 
                      checked={securitySettings.automaticLockEnabled}
                      onCheckedChange={() => toggleSetting('automaticLockEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Device Whitelist</Label>
                      <p className="text-xs text-gray-400">Only allow access from approved devices</p>
                    </div>
                    <Switch 
                      checked={securitySettings.deviceWhitelistEnabled}
                      onCheckedChange={() => toggleSetting('deviceWhitelistEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Advanced Protection</h3>
                  <Separator className="bg-[#333]" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Zero-Knowledge Proofs</Label>
                      <p className="text-xs text-gray-400">Enable privacy-preserving verification</p>
                    </div>
                    <Switch 
                      checked={securitySettings.zeroKnowledgeProofsEnabled}
                      onCheckedChange={() => toggleSetting('zeroKnowledgeProofsEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Quantum-Resistant Encryption</Label>
                      <p className="text-xs text-gray-400">Use post-quantum cryptography for data</p>
                    </div>
                    <Switch 
                      checked={securitySettings.quantumResistantEncryption}
                      onCheckedChange={() => toggleSetting('quantumResistantEncryption')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Behavioral Analysis</Label>
                      <p className="text-xs text-gray-400">AI-powered anomaly detection</p>
                    </div>
                    <Switch 
                      checked={securitySettings.behavioralAnalysisEnabled}
                      onCheckedChange={() => toggleSetting('behavioralAnalysisEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Anonymous Transactions</Label>
                      <p className="text-xs text-gray-400">Enable full privacy mode for transactions</p>
                    </div>
                    <Switch 
                      checked={securitySettings.anonymousTransactionsEnabled}
                      onCheckedChange={() => toggleSetting('anonymousTransactionsEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Real-Time Security Alerts</Label>
                      <p className="text-xs text-gray-400">Receive immediate notifications of security events</p>
                    </div>
                    <Switch 
                      checked={securitySettings.realTimeAlertsEnabled}
                      onCheckedChange={() => toggleSetting('realTimeAlertsEnabled')}
                      className="data-[state=checked]:bg-[#6B00D7]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#6B00D7] hover:bg-[#5A00B6] text-white">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboardPage;