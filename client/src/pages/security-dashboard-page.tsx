/**
 * Security Dashboard Page
 * 
 * Main page displaying the cross-chain security status dashboard that provides
 * a comprehensive view of the Triple-Chain Security architecture status.
 * Includes real-time monitoring of all blockchain networks, cross-chain verification status,
 * and security alerts for users with enhanced visualization options.
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CrossChainSecurityDashboard from '@/components/security/CrossChainSecurityDashboard';
import SecurityEnhancementsPanel from '@/components/security/SecurityEnhancementsPanel';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Lock, RefreshCw, BookOpen, Key, FileDigit } from 'lucide-react';
import { auditLogService, AuditLogEntry } from '@/lib/security/AuditLogService';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SecurityDashboardPage() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(true);

  // Fetch audit logs when the audit tab is selected
  React.useEffect(() => {
    if (activeTab === 'history') {
      const fetchLogs = async () => {
        try {
          setIsLoadingLogs(true);
          const logs = await auditLogService.fetchLogs({
            limit: 20,
            offset: 0
          });
          setAuditLogs(logs);
        } catch (error) {
          console.error('Failed to fetch audit logs:', error);
        } finally {
          setIsLoadingLogs(false);
        }
      };
      
      fetchLogs();
    }
  }, [activeTab]);

  return (
    <>
      <Helmet>
        <title>Security Dashboard | Chronos Vault</title>
        <meta name="description" content="Triple-Chain Security Dashboard for Chronos Vault" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        {/* Hero section with security overview */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] rounded-full mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] mb-2">Triple-Chain Security Dashboard</h1>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Real-time monitoring of Chronos Vault's military-grade security architecture across Ethereum, TON, and Solana networks.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              onClick={() => navigate("/military-grade-security")}
              className="bg-black/30 border border-[#6B00D7] hover:bg-[#6B00D7]/20 text-white"
            >
              <Lock className="mr-2 h-4 w-4" /> Learn About Triple-Chain Security
            </Button>
            <Button 
              onClick={() => navigate("/security-documentation")}
              variant="outline" 
              className="border-[#6B00D7] text-white hover:bg-[#6B00D7]/10"
            >
              <BookOpen className="mr-2 h-4 w-4" /> Security Documentation
            </Button>
          </div>
        </div>
        
        {/* Dashboard tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto mb-8 bg-black/20 border border-[#333]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="enhancements" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Security Features
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Alerts
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Audit Log
            </TabsTrigger>
          </TabsList>
          
          {/* Main Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in-50">
            <CrossChainSecurityDashboard />
          </TabsContent>
          
          {/* Security Enhancements Tab */}
          <TabsContent value="enhancements" className="space-y-6 animate-in fade-in-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SecurityEnhancementsPanel />
              
              <div className="space-y-6">
                {/* Quantum Resistant Encryption */}
                <Card className="border-[#333] bg-gradient-to-br from-[#6B00D7]/20 to-black/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Key className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                      <span>Quantum-Resistant Encryption</span>
                    </CardTitle>
                    <CardDescription>
                      Future-proof cryptography secure against quantum computing attacks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Primary Algorithm</span>
                        <span className="font-mono text-[#FF5AF7]">CRYSTALS-Kyber</span>
                      </div>
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Signature Scheme</span>
                        <span className="font-mono text-[#FF5AF7]">CRYSTALS-Dilithium</span>
                      </div>
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Security Level</span>
                        <span className="font-mono text-[#FF5AF7]">ADVANCED (192-bit)</span>
                      </div>
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-500">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Rotation</span>
                        <span>12 hours ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Zero Knowledge Proof System */}
                <Card className="border-[#333] bg-gradient-to-br from-[#6B00D7]/20 to-black/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <FileDigit className="h-5 w-5 mr-2 text-[#FF5AF7]" />
                      <span>Zero-Knowledge Proof System</span>
                    </CardTitle>
                    <CardDescription>
                      Privacy-preserving verification without revealing sensitive data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Active Proof Types</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="border-[#6B00D7] text-[#FF5AF7]">Identity</Badge>
                          <Badge variant="outline" className="border-[#6B00D7] text-[#FF5AF7]">Asset</Badge>
                          <Badge variant="outline" className="border-[#6B00D7] text-[#FF5AF7]">Transaction</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Verifications Today</span>
                        <span className="font-mono text-[#FF5AF7]">37</span>
                      </div>
                      <div className="flex justify-between border-b border-[#333] pb-2">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-green-500">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6 animate-in fade-in-50">
            <Card className="border-[#333] bg-black/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  Security Alerts
                </CardTitle>
                <CardDescription>
                  Real-time and historical security incidents across all blockchain networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 text-center">
                  <RefreshCw className="h-12 w-12 text-[#6B00D7] mx-auto mb-4 animate-spin-slow" />
                  <h3 className="text-lg font-medium mb-2">Monitoring Security Events</h3>
                  <p className="text-gray-400 mb-6">
                    Our advanced security system is actively monitoring all chains for potential security threats.
                  </p>
                  <p className="text-green-500 font-medium text-lg">
                    No active security alerts detected
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Audit Log Tab */}
          <TabsContent value="history" className="space-y-6 animate-in fade-in-50">
            <Card className="border-[#333] bg-black/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  Security Audit Log
                </CardTitle>
                <CardDescription>
                  Comprehensive history of security checks and verifications
                </CardDescription>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm" className="text-xs h-8 border-[#6B00D7] text-[#FF5AF7]">
                    Export Log
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingLogs ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-700/30 rounded-lg"></div>
                    ))}
                  </div>
                ) : auditLogs.length > 0 ? (
                  <ScrollArea className="h-[400px] rounded-md">
                    <div className="space-y-4 p-1">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="border border-[#333] rounded-lg p-4 bg-black/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <Badge 
                                  variant="outline" 
                                  className={`mr-2 ${
                                    log.category === 'zero_knowledge_proof' 
                                      ? 'border-blue-500 text-blue-500' 
                                      : log.category === 'quantum_resistant_operation'
                                        ? 'border-purple-500 text-purple-500'
                                        : log.category === 'cross_chain_verification'
                                          ? 'border-green-500 text-green-500'
                                          : 'border-gray-500 text-gray-500'
                                  }`}
                                >
                                  {log.category.replace(/_/g, ' ')}
                                </Badge>
                                <h4 className="font-medium text-[#FF5AF7]">{log.action}</h4>
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {log.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleString()}
                              </span>
                              <Badge 
                                className={`block mt-2 w-fit ml-auto ${
                                  log.severity === 'critical' 
                                    ? 'bg-red-500/20 text-red-500 border border-red-500/50' 
                                    : log.severity === 'high'
                                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50'
                                      : log.severity === 'medium'
                                        ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'
                                        : 'bg-blue-500/20 text-blue-500 border border-blue-500/50'
                                }`}
                              >
                                {log.severity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No audit logs available
                  </div>
                )}
                
                <div className="mt-6 text-center">
                  <Button variant="link" className="text-[#FF5AF7]">
                    View Full Audit History <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}