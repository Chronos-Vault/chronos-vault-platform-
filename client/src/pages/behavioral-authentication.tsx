import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Brain, Zap, Lock, Shield, KeySquare, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BehavioralAuthentication } from '@/components/security/BehavioralAuthentication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BehavioralAuthenticationPage() {
  const [location, navigate] = useLocation();
  
  // Parse the URL to get the tab from query parameters
  const getDefaultTab = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const tab = url.searchParams.get('tab');
      if (tab === 'quantum' || tab === 'social') {
        return tab;
      }
    }
    return 'behavioral';
  };

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
        <Tabs defaultValue={getDefaultTab()} className="w-full">
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
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Lattice-Based Encryption</CardTitle>
                    <CardDescription>
                      Post-quantum cryptographic algorithms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Our implementation uses lattice-based encryption, which is resistant to attacks from both classical and quantum computers, ensuring your vaults remain secure.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <KeySquare className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Dynamic Key Rotation</CardTitle>
                    <CardDescription>
                      Automatic cryptographic key management
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Keys are automatically rotated using quantum-resistant algorithms, maintaining security even as quantum computing advances.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <ServerCrash className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Future-Proof Security</CardTitle>
                    <CardDescription>
                      Adaptive protection against evolving threats
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Our system constantly monitors cryptographic advances and automatically upgrades security protocols to counter emerging quantum computing capabilities.
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                  onClick={() => navigate('/security-verification')}
                >
                  View All Security Features
                </Button>
              </div>
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
              
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Lock className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Tiered Recovery</CardTitle>
                    <CardDescription>
                      Multi-level guardian system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Designate different trusted contacts with varying levels of recovery authority, creating a secure and flexible recovery system.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Shield className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Time-Locked Recovery</CardTitle>
                    <CardDescription>
                      Enforced waiting periods for security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Recovery attempts require a waiting period with notifications, giving you time to cancel unauthorized recovery attempts.
                  </CardContent>
                </Card>
                
                <Card className="bg-[#1A1A1A] border-[#333]">
                  <CardHeader className="pb-2">
                    <div className="h-10 w-10 rounded-full bg-[#6B00D7]/20 flex items-center justify-center mb-2">
                      <Zap className="h-5 w-5 text-[#FF5AF7]" />
                    </div>
                    <CardTitle className="text-lg">Cross-Chain Recovery</CardTitle>
                    <CardDescription>
                      Multi-blockchain guardian verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400">
                    Guardians can verify recovery requests using any supported blockchain, adding flexibility and redundancy to the recovery process.
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <Button 
                  className="bg-gradient-to-r from-[#6B00D7] to-[#FF5AF7] hover:opacity-90"
                  onClick={() => navigate('/multi-signature-vault')}
                >
                  View Multi-Signature Features
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}