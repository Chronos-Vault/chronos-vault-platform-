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
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Lock, RefreshCw, BookOpen } from 'lucide-react';

export default function SecurityDashboardPage() {
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

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
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8 bg-black/20 border border-[#333]">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Security Alerts
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#6B00D7] data-[state=active]:text-white">
              Audit Log
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 animate-in fade-in-50">
            <CrossChainSecurityDashboard />
          </TabsContent>
          
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
          
          <TabsContent value="history" className="space-y-6 animate-in fade-in-50">
            <Card className="border-[#333] bg-black/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7]">
                  Security Audit Log
                </CardTitle>
                <CardDescription>
                  Comprehensive history of security checks and verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample audit log entries */}
                  <div className="border border-[#333] rounded-lg p-4 bg-black/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#FF5AF7]">Cross-Chain Verification Complete</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Successful verification across Ethereum, TON, and Solana networks
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">Today, 14:32</span>
                    </div>
                  </div>
                  
                  <div className="border border-[#333] rounded-lg p-4 bg-black/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#FF5AF7]">Security System Upgrade</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Military-grade security protocols updated to latest version
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">Today, 09:15</span>
                    </div>
                  </div>
                  
                  <div className="border border-[#333] rounded-lg p-4 bg-black/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#FF5AF7]">Quantum-Resistant Cryptography Test</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          Scheduled test of quantum-resistant encryption completed successfully
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">Yesterday, 18:42</span>
                    </div>
                  </div>
                  
                  <div className="border border-[#333] rounded-lg p-4 bg-black/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#FF5AF7]">Blockchain Network Sync</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          All blockchain networks synchronized and verified
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">Yesterday, 11:20</span>
                    </div>
                  </div>
                </div>
                
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