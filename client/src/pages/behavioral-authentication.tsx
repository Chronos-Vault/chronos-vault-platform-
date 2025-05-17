import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Brain, Zap, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BehavioralAuthentication } from '@/components/security/BehavioralAuthentication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BehavioralAuthenticationPage() {
  const [_, navigate] = useLocation();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-[#FF5AF7] to-[#6B00D7] bg-clip-text text-transparent">
            Advanced Security Features
          </h1>
        </div>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="behavioral" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#1A1A1A] border border-[#333] rounded-lg overflow-hidden p-0.5">
            <TabsTrigger 
              value="behavioral" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            >
              Behavioral Authentication
            </TabsTrigger>
            <TabsTrigger 
              value="quantum" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            >
              Quantum-Resistant Cryptography
            </TabsTrigger>
            <TabsTrigger 
              value="social" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#6B00D7] data-[state=active]:to-[#FF5AF7] data-[state=active]:text-white"
            >
              Social Recovery
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="behavioral" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Behavioral Authentication System</h2>
                  <p className="text-gray-400">
                    Enhanced security that learns and adapts to your usage patterns
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Brain className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Machine Learning</CardTitle>
                    <CardDescription>
                      Advanced AI learns your unique behavioral patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    The system continuously analyzes your transaction patterns, login behaviors, and vault interactions to build a secure profile unique to you.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Real-Time Detection</CardTitle>
                    <CardDescription>
                      Immediate identification of unusual activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Continuously monitors transactions and interactions to detect and flag anomalies that don't match your established behavioral patterns.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Privacy-Preserving</CardTitle>
                    <CardDescription>
                      Zero-knowledge behavioral analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Uses zero-knowledge proofs to analyze behavioral patterns without exposing transaction details, keeping your sensitive information private.
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <BehavioralAuthentication />
          </TabsContent>
          
          <TabsContent value="quantum" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Quantum-Resistant Cryptography</h2>
                  <p className="text-gray-400">
                    Future-proof vault security against quantum computing threats
                  </p>
                </div>
              </div>
              
              <Card className="bg-[#1A1A1A] border-[#333] p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-400 max-w-md">
                  Our quantum-resistant cryptography module is currently in development and will be available in the next platform update. This innovative feature will protect your vaults against future quantum computing threats.
                </p>
                <Button 
                  className="mt-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                  onClick={() => navigate('/security-verification')}
                >
                  View Current Security Features
                </Button>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="mt-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#6B00D7] to-[#FF5AF7] flex items-center justify-center shadow-lg shadow-[#6B00D7]/30">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Social Recovery Enhancements</h2>
                  <p className="text-gray-400">
                    Tiered recovery system with designated trusted contacts
                  </p>
                </div>
              </div>
              
              <Card className="bg-[#1A1A1A] border-[#333] p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#6B00D7]/20 to-[#FF5AF7]/20 flex items-center justify-center mb-4">
                  <Lock className="h-7 w-7 text-[#FF5AF7]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-gray-400 max-w-md">
                  Our enhanced social recovery system will allow you to designate different trusted contacts with varying levels of recovery authority. This tiered approach provides flexible security options for vault recovery.
                </p>
                <Button 
                  className="mt-6 bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                  onClick={() => navigate('/multi-signature-vault')}
                >
                  View Multi-Signature Features
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}