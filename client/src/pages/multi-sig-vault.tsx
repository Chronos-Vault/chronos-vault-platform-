import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Clock, ExternalLink } from 'lucide-react';
import { TransactionErrorHandler } from '@/components/transactions/TransactionErrorHandler';

/**
 * Multi-Signature Vault Page
 * 
 * Full-featured vault page with multi-signature verification
 * using TON blockchain for secure distributed access control.
 */
const MultiSigVaultPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Multi-Signature Vault</h1>
        <p className="text-muted-foreground">
          Enhanced security requiring multiple authorized signatures for sensitive operations
        </p>
      </div>
      
      {/* Display transaction errors if any */}
      <TransactionErrorHandler position="top" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Multi-Signature Configuration
              </CardTitle>
              <CardDescription>
                Configure security policies and authorized signers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-medium text-lg mb-2">Authorized Signers</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-700/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">0x8Ab...F3e1</p>
                          <p className="text-xs text-muted-foreground">Primary Owner</p>
                        </div>
                      </div>
                      <span className="bg-green-600/10 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">0x92c...A2b7</p>
                          <p className="text-xs text-muted-foreground">Recovery Guardian</p>
                        </div>
                      </div>
                      <span className="bg-green-600/10 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-mono text-sm">0x43F...B9c2</p>
                          <p className="text-xs text-muted-foreground">Time Guardian</p>
                        </div>
                      </div>
                      <span className="bg-green-600/10 text-green-500 text-xs px-2 py-1 rounded-full">Active</span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Add New Signer
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-medium text-lg mb-2">Signature Requirements</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vault Access</span>
                      <span className="font-semibold">2 of 3 signatures</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asset Transfer</span>
                      <span className="font-semibold">3 of 3 signatures</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Configuration Changes</span>
                      <span className="font-semibold">2 of 3 signatures</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Security Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-400 font-medium">Access Approved</p>
                      <p className="text-xs text-gray-400 mt-1">3 of 3 signatures verified for vault access</p>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-blue-400 font-medium">Configuration Changed</p>
                      <p className="text-xs text-gray-400 mt-1">Added new recovery guardian with 2/3 approval</p>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-amber-400 font-medium">Signature Pending</p>
                      <p className="text-xs text-gray-400 mt-1">Waiting for 1 more signature for asset transfer</p>
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>Vault Assets</CardTitle>
              <CardDescription>
                Protected by multi-signature verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-800/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">T</span>
                    </div>
                    <div>
                      <p className="font-medium">TON</p>
                      <p className="text-xs text-muted-foreground">Toncoin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">125.32</p>
                    <p className="text-xs text-muted-foreground">≈ $425.89</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-800/20 flex items-center justify-center">
                      <span className="text-purple-400 font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-medium">CVT</p>
                      <p className="text-xs text-muted-foreground">Chronos Tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">750.00</p>
                    <p className="text-xs text-muted-foreground">≈ $1,875.00</p>
                  </div>
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  Initiate Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>Smart Contract</CardTitle>
              <CardDescription>
                TON blockchain verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Contract Address</span>
                    <Button size="sm" variant="ghost" className="h-6 gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span className="text-xs">Explorer</span>
                    </Button>
                  </div>
                  <p className="font-mono text-xs break-all">EQDZr7KDKG2T6o6lPHJ8_VNBHJKr8RoWSsu7YnSIykDG9R2c</p>
                </div>
                
                <div className="flex justify-between text-sm p-3 bg-black/30 rounded-lg border border-gray-800">
                  <span className="text-muted-foreground">Deployment Date</span>
                  <span>May 15, 2025</span>
                </div>
                
                <div className="flex justify-between text-sm p-3 bg-black/30 rounded-lg border border-gray-800">
                  <span className="text-muted-foreground">Last Activity</span>
                  <span>2 hours ago</span>
                </div>
                
                <div className="flex justify-between text-sm p-3 bg-black/30 rounded-lg border border-gray-800">
                  <span className="text-muted-foreground">Security Audit</span>
                  <span className="text-green-400">Verified ✓</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MultiSigVaultPage;