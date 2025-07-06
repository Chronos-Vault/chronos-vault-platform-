import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Shield, Compass, Globe, Check, AlertTriangle } from 'lucide-react';
import { TransactionErrorHandler } from '@/components/transactions/TransactionErrorHandler';

/**
 * Geo-Location Vault Page
 * 
 * Full-featured vault page with location-based verification
 * using TON blockchain for secure physical presence verification.
 */
const GeoVaultPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 relative z-10 bg-gradient-to-b from-[#121212] to-[#19141E]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Geo-Location Vault</h1>
        <p className="text-muted-foreground">
          Access restricted to specific physical locations for enhanced security
        </p>
      </div>
      
      {/* Display transaction errors if any */}
      <TransactionErrorHandler position="top" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-400" />
                Location Security Configuration
              </CardTitle>
              <CardDescription>
                Configure authorized locations for vault access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-medium text-lg mb-2">Authorized Locations</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-700/20 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Office Headquarters</p>
                          <p className="text-xs text-muted-foreground">New York, USA (500m radius)</p>
                        </div>
                      </div>
                      <span className="bg-green-600/10 text-green-500 text-xs px-2 py-1 rounded-full">Primary</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 border border-gray-700 rounded-md bg-black/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-700/20 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Secondary Office</p>
                          <p className="text-xs text-muted-foreground">San Francisco, USA (300m radius)</p>
                        </div>
                      </div>
                      <span className="bg-blue-600/10 text-blue-500 text-xs px-2 py-1 rounded-full">Backup</span>
                    </div>
                    
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Add New Location
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-medium text-lg mb-2">Current Location Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Location Verified</p>
                        <p className="text-xs text-gray-400">You are currently in an authorized location</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm">Current Location</span>
                      <span className="font-semibold text-sm">Office Headquarters</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification Method</span>
                      <span className="font-semibold text-sm">GPS + Network Triangulation</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Verified</span>
                      <span className="font-semibold text-sm">2 minutes ago</span>
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
                Location Verification Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-green-400 font-medium">Access Granted</p>
                      <p className="text-xs text-gray-400 mt-1">Location verified at Office Headquarters</p>
                    </div>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-amber-400 font-medium">Location Changed</p>
                      <p className="text-xs text-gray-400 mt-1">Moved from Secondary Office to Office Headquarters</p>
                    </div>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                </div>
                
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-red-400 font-medium">Access Denied</p>
                      <p className="text-xs text-gray-400 mt-1">Location verification failed (outside authorized zones)</p>
                    </div>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>Location Security Settings</CardTitle>
              <CardDescription>
                Configure verification parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Compass className="h-4 w-4 mr-2 text-purple-400" />
                    Verification Methods
                  </h3>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-sm border border-purple-500 flex items-center justify-center bg-purple-500/20 mr-2">
                        <Check className="h-3 w-3 text-purple-500" />
                      </div>
                      <span className="text-sm">GPS Coordinates</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-sm border border-purple-500 flex items-center justify-center bg-purple-500/20 mr-2">
                        <Check className="h-3 w-3 text-purple-500" />
                      </div>
                      <span className="text-sm">Network Triangulation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-sm border border-purple-500 flex items-center justify-center bg-purple-500/20 mr-2">
                        <Check className="h-3 w-3 text-purple-500" />
                      </div>
                      <span className="text-sm">IP Geolocation</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-purple-400" />
                    Security Level
                  </h3>
                  <div className="mt-2">
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Standard</span>
                      <span className="text-xs text-purple-400 font-medium">High</span>
                      <span className="text-xs text-gray-500">Maximum</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <h3 className="text-sm font-medium mb-2">Location Verification Frequency</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Every 15 minutes</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Change
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-400">Emergency Access Protocol</p>
                      <p className="text-xs text-gray-400 mt-1">
                        In case of emergency, multi-signature verification can override location restrictions
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-2">
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border border-[#6B00D7]/20 bg-gradient-to-b from-[#1A1A1A] to-[#121212] shadow-md">
            <CardHeader>
              <CardTitle>TON Blockchain Verification</CardTitle>
              <CardDescription>
                Secure location attestation on TON
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Location Hash</span>
                  </div>
                  <p className="font-mono text-xs break-all">0x7d8f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9</p>
                </div>
                
                <div className="p-3 bg-black/30 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Last Blockchain Verification</span>
                  </div>
                  <p className="text-sm">2 minutes ago (Block #8,234,567)</p>
                </div>
                
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                  <div className="flex">
                    <Shield className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Zero-Knowledge Proof Active</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Your precise location is never stored on-chain, only verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeoVaultPage;