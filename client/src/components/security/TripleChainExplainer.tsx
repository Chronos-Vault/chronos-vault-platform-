import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CheckCircle } from 'lucide-react';

/**
 * Triple-Chain Security Explainer Component
 * 
 * This component provides a user-friendly explanation of how Chronos Vault's
 * Triple-Chain Security Architecture protects user assets.
 */
export default function TripleChainExplainer() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Triple-Chain Security Architecture</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your digital assets are protected by an unprecedented three-layer blockchain security system
        </p>
      </div>
      
      {/* Visual representation of the triple-chain */}
      <div className="relative py-12 flex justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-900/10 via-pink-700/10 to-purple-900/10 opacity-30 rounded-xl"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {/* TON Chain */}
          <div className="relative bg-black/30 p-6 rounded-xl border border-purple-600 overflow-hidden transition-all duration-500 hover:bg-black/40 hover:border-purple-500 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full -mr-16 -mt-16 group-hover:bg-purple-600/30"></div>
            
            <Shield className="h-10 w-10 text-purple-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">Primary Chain</h3>
            <p className="text-sm text-muted-foreground">TON blockchain secures your vault's core data with military-grade cryptography</p>
            
            <div className="mt-4 flex items-center text-xs text-purple-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Active Protection</span>
            </div>
          </div>
          
          {/* Ethereum Chain */}
          <div className="relative bg-black/30 p-6 rounded-xl border border-purple-600 overflow-hidden transition-all duration-500 hover:bg-black/40 hover:border-purple-500 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full -mr-16 -mt-16 group-hover:bg-purple-600/30"></div>
            
            <Lock className="h-10 w-10 text-purple-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">Secondary Chain</h3>
            <p className="text-sm text-muted-foreground">Ethereum blockchain provides independent verification of vault integrity</p>
            
            <div className="mt-4 flex items-center text-xs text-purple-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Active Protection</span>
            </div>
          </div>
          
          {/* Solana Chain */}
          <div className="relative bg-black/30 p-6 rounded-xl border border-purple-600 overflow-hidden transition-all duration-500 hover:bg-black/40 hover:border-purple-500 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/20 rounded-full -mr-16 -mt-16 group-hover:bg-purple-600/30"></div>
            
            <Shield className="h-10 w-10 text-purple-500 mb-3" />
            <h3 className="text-xl font-bold mb-2">Tertiary Chain</h3>
            <p className="text-sm text-muted-foreground">Solana blockchain provides high-speed monitoring and rapid validation</p>
            
            <div className="mt-4 flex items-center text-xs text-purple-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Active Protection</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed explanation with tabs */}
      <Card>
        <CardHeader>
          <CardTitle>How Triple-Chain Security Protects You</CardTitle>
          <CardDescription>
            Our unique security approach uses three separate blockchains to provide unmatched protection for your digital assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="works">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="works">How It Works</TabsTrigger>
              <TabsTrigger value="benefits">Your Benefits</TabsTrigger>
              <TabsTrigger value="example">Security Example</TabsTrigger>
            </TabsList>
            <TabsContent value="works" className="p-4 space-y-4">
              <p>
                When you create a vault, information about your vault is securely stored across three independent blockchain networks: 
                TON, Ethereum, and Solana.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Triple Verification:</span> All critical operations require verification from all three chains
                </li>
                <li>
                  <span className="font-medium">Independent Security:</span> Even if one blockchain is compromised, your assets remain secure
                </li>
                <li>
                  <span className="font-medium">Cryptographic Proofs:</span> Cross-chain cryptographic proofs ensure data consistency
                </li>
              </ul>
            </TabsContent>
            
            <TabsContent value="benefits" className="p-4 space-y-4">
              <p>
                The Triple-Chain Security Architecture provides unprecedented security benefits:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">No Single Point of Failure:</span> Your assets are protected by three independent blockchain networks
                </li>
                <li>
                  <span className="font-medium">Hack Resistant:</span> An attacker would need to compromise three different blockchain networks simultaneously
                </li>
                <li>
                  <span className="font-medium">Consensus Verification:</span> Operations are only approved when all chains reach consensus
                </li>
                <li>
                  <span className="font-medium">Real-Time Monitoring:</span> Automated cross-chain verification identifies anomalies instantly
                </li>
              </ul>
            </TabsContent>
            
            <TabsContent value="example" className="p-4 space-y-4">
              <p className="font-medium">Example: Unlocking a Secure Vault</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  You request to unlock your vault when the time-lock expires
                </li>
                <li>
                  The unlock request is verified independently on the TON blockchain
                </li>
                <li>
                  A secondary verification occurs on the Ethereum blockchain
                </li>
                <li>
                  A tertiary verification occurs on the Solana blockchain
                </li>
                <li>
                  All three verifications are cross-checked for consistency
                </li>
                <li>
                  Only if all three chains agree is your vault unlocked
                </li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">
                This multi-layer approach makes Chronos Vault the most secure platform in the blockchain industry.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
