/**
 * Enhanced Storage Page
 * 
 * This page demonstrates the advanced permanent storage capabilities 
 * with multi-chain support (Arweave, IPFS, and Filecoin),
 * cross-chain verification, and quantum-resistant encryption
 */

import { useState, useEffect } from 'react';
import { FileUploader } from '@/components/storage/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, HardDrive, Database, AlertTriangle, Shield, Layers, Lock, Network } from 'lucide-react';
import { arweaveStorage } from '@/services/arweave-service';
import { motion } from 'framer-motion';
import type { StorageStatus } from '../../../shared/types/storage';

const StoragePage = () => {
  const [storageStatus, setStorageStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch storage status on page load
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const status = await arweaveStorage.getStatus();
        setStorageStatus(status);
        setError(null);
      } catch (err) {
        console.error('Error fetching storage status:', err);
        setError('Failed to connect to storage service');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format winston to AR
  const formatBalance = (winston?: string) => {
    if (!winston) return '0';
    
    // Convert winston to AR (1 AR = 1000000000000 winston)
    const ar = Number(winston) / 1000000000000;
    return ar.toFixed(6);
  };
  
  // Format cost per MB
  const formatCostPerMb = (costPerMb?: string) => {
    if (!costPerMb) return '0';
    
    // Convert winston to AR
    const ar = Number(costPerMb) / 1000000000000;
    return ar.toFixed(6);
  };
  
  // Storage network options
  const storageNetworks = [
    { 
      id: 'arweave', 
      name: 'Arweave', 
      description: 'Permanent, decentralized storage with one-time payment', 
      icon: <Database className="h-5 w-5 text-fuchsia-500" />,
      available: true,
      status: 'Active',
      costPerMb: '0.000015'
    },
    { 
      id: 'ipfs', 
      name: 'IPFS', 
      description: 'InterPlanetary File System for content-addressed storage', 
      icon: <Network className="h-5 w-5 text-blue-500" />,
      available: true,
      status: 'Active',
      costPerMb: '0.000005'
    },
    { 
      id: 'filecoin', 
      name: 'Filecoin', 
      description: 'Long-term storage with economic incentives', 
      icon: <HardDrive className="h-5 w-5 text-green-500" />,
      available: true,
      status: 'Active',
      costPerMb: '0.000010'
    },
  ];

  // Security features
  const securityFeatures = [
    {
      title: 'Quantum-Resistant Encryption',
      description: 'Files are encrypted with lattice-based cryptography resistant to quantum attacks',
      icon: <Shield className="h-10 w-10 text-purple-500" />,
      animation: 'fade-right'
    },
    {
      title: 'Multi-Chain Verification',
      description: 'Storage proofs are verified across ETH, TON, and Solana for maximum security',
      icon: <Layers className="h-10 w-10 text-fuchsia-600" />,
      animation: 'fade-up'
    },
    {
      title: 'Zero-Knowledge Privacy',
      description: 'Access control using ZK-proofs to maintain privacy while ensuring security',
      icon: <Lock className="h-10 w-10 text-purple-400" />,
      animation: 'fade-left'
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-12">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">Triple-Chain Decentralized Storage</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
          Experience unprecedented security with our revolutionary cross-chain permanent storage technology,
          leveraging Arweave, IPFS, and Filecoin with quantum-resistant encryption
        </p>
      </motion.div>
      
      {/* Security Feature Highlights */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {securityFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex flex-col items-center text-center space-y-4 p-6 rounded-xl bg-gradient-to-b from-background/80 to-background border border-border/50 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 * (index + 1) }}
          >
            <div className="p-3 rounded-full bg-purple-950/30">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Storage Networks Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card className="border-border/40 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              <span>Storage Network Status</span>
            </CardTitle>
            <CardDescription>
              Real-time status of our integrated decentralized storage networks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full" />
                <span className="ml-3 text-lg">Connecting to storage networks...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {storageNetworks.map((network) => (
                    <motion.div 
                      key={network.id}
                      className="relative overflow-hidden rounded-xl border border-border p-6 shadow-md"
                      whileHover={{ 
                        scale: 1.03,
                        boxShadow: "0 10px 30px -10px rgba(120, 0, 240, 0.2)",
                        borderColor: "rgba(180, 20, 240, 0.3)" 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="absolute top-0 right-0 m-2">
                        <Badge variant={network.available ? 'default' : 'destructive'} className="font-semibold">
                          {network.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col justify-between h-full pt-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            {network.icon}
                            <h3 className="text-lg font-semibold">{network.name}</h3>
                          </div>
                          <p className="text-muted-foreground text-sm mb-4">{network.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="font-medium text-muted-foreground">Storage Cost</div>
                            <div className="font-semibold text-purple-400">{network.costPerMb} USD/MB</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-muted-foreground">Redundancy</div>
                            <div>Triple verified</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {storageStatus && storageStatus.avgUploadTime && (
                  <div className="flex justify-center items-center p-4 bg-purple-950/20 rounded-lg border border-purple-500/20">
                    <div className="space-y-1 text-center">
                      <div className="text-sm font-medium text-muted-foreground">Average Upload Time</div>
                      <div className="text-lg font-semibold text-purple-400">{storageStatus.avgUploadTime} seconds</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Storage Features Tab */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-8 p-1 bg-background border border-border rounded-lg">
            <TabsTrigger value="upload" className="py-3 text-base font-medium">Upload Files</TabsTrigger>
            <TabsTrigger value="manage" className="py-3 text-base font-medium">Manage Storage</TabsTrigger>
            <TabsTrigger value="info" className="py-3 text-base font-medium">About Storage Technology</TabsTrigger>
          </TabsList>
          
          {/* File Uploader Tab */}
          <TabsContent value="upload" className="pt-2">
            <FileUploader 
              vaultId={1} // This would normally come from the selected vault
              maxFileSize={50 * 1024 * 1024} // 50MB limit for testing
              acceptedFileTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,text/plain"
            />
          </TabsContent>
          
          {/* Storage Management Tab */}
          <TabsContent value="manage" className="pt-2">
            <Card className="border-border/40 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20">
                <CardTitle>Manage Your Storage</CardTitle>
                <CardDescription>
                  View and manage your permanently stored files across multiple networks
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    <HardDrive className="h-16 w-16 text-purple-400 mb-5" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">No Files Found</h3>
                  <p className="text-muted-foreground max-w-md mb-6 text-base">
                    You haven't stored any files permanently yet. Files stored through our system are 
                    replicated across multiple networks with quantum-resistant encryption.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white"
                    onClick={() => {
                      const tabTrigger = document.querySelector('[data-value="upload"]');
                      if (tabTrigger && 'click' in tabTrigger) {
                        (tabTrigger as HTMLElement).click();
                      }
                    }}>
                    Start Storing Files
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Technology Information Tab */}
          <TabsContent value="info" className="pt-2">
            <Card className="border-border/40 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/20">
                <CardTitle>Chronos Vault Storage Technology</CardTitle>
                <CardDescription>
                  Understanding our revolutionary multi-chain decentralized storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Triple-Chain Architecture</h3>
                    <motion.div 
                      className="relative h-52 rounded-xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-fuchsia-950/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Database className="h-8 w-8 text-purple-400" />
                      </motion.div>
                      <motion.div className="absolute top-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30"
                        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      >
                        <Network className="h-6 w-6 text-fuchsia-400" />
                      </motion.div>
                      <motion.div className="absolute bottom-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      >
                        <HardDrive className="h-7 w-7 text-blue-400" />
                      </motion.div>
                      <motion.span 
                        className="absolute top-1/2 left-1/2 w-[80%] h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"
                        style={{ transformOrigin: "0% 0%" }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.span 
                        className="absolute top-1/2 left-1/2 w-[60%] h-0.5 bg-gradient-to-r from-fuchsia-500/30 to-transparent"
                        style={{ transformOrigin: "0% 0%" }}
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    <p className="text-muted-foreground mt-4">
                      Our system utilizes a revolutionary approach that stores your data across three complementary decentralized networks simultaneously: Arweave, IPFS, and Filecoin. This ensures maximum resilience and permanent availability.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Benefits of Chronos Storage</h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <motion.li 
                        className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div className="mt-1 text-purple-500">✓</div>
                        <div><strong className="text-foreground">Perpetual Storage:</strong> One-time payment for truly permanent data storage</div>
                      </motion.li>
                      <motion.li 
                        className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="mt-1 text-purple-500">✓</div>
                        <div><strong className="text-foreground">Quantum Security:</strong> Advanced lattice-based encryption immune to quantum computing attacks</div>
                      </motion.li>
                      <motion.li 
                        className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="mt-1 text-purple-500">✓</div>
                        <div><strong className="text-foreground">Triple Redundancy:</strong> Data is verified and stored on three separate blockchain networks</div>
                      </motion.li>
                      <motion.li 
                        className="flex items-start gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-950/20 to-transparent border border-purple-500/20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="mt-1 text-purple-500">✓</div>
                        <div><strong className="text-foreground">Zero-Knowledge Access:</strong> Privacy-preserving protocols that protect sensitive data</div>
                      </motion.li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">How Cross-Chain Storage Works</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <motion.div 
                        className="p-4 border border-purple-500/20 rounded-lg bg-purple-950/10 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <div className="absolute -right-3 -top-3 w-12 h-12 bg-purple-500/10 rounded-full" />
                        <div className="text-xl text-center font-bold text-purple-400 mb-2">1</div>
                        <h4 className="font-medium text-center mb-2">Quantum Encryption</h4>
                        <p className="text-sm">Your file is first encrypted using quantum-resistant algorithms</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 border border-purple-500/20 rounded-lg bg-fuchsia-950/10 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <div className="absolute -right-3 -top-3 w-12 h-12 bg-fuchsia-500/10 rounded-full" />
                        <div className="text-xl text-center font-bold text-fuchsia-400 mb-2">2</div>
                        <h4 className="font-medium text-center mb-2">Multi-Chain Upload</h4>
                        <p className="text-sm">Data is simultaneously uploaded to three decentralized networks</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 border border-purple-500/20 rounded-lg bg-purple-950/10 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="absolute -right-3 -top-3 w-12 h-12 bg-purple-500/10 rounded-full" />
                        <div className="text-xl text-center font-bold text-purple-400 mb-2">3</div>
                        <h4 className="font-medium text-center mb-2">Cross-Chain Verification</h4>
                        <p className="text-sm">Proofs of storage are verified on Ethereum, TON and Solana</p>
                      </motion.div>
                      
                      <motion.div 
                        className="p-4 border border-purple-500/20 rounded-lg bg-fuchsia-950/10 relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="absolute -right-3 -top-3 w-12 h-12 bg-fuchsia-500/10 rounded-full" />
                        <div className="text-xl text-center font-bold text-fuchsia-400 mb-2">4</div>
                        <h4 className="font-medium text-center mb-2">Access Control</h4>
                        <p className="text-sm">ZK-proofs enable secure access without compromising privacy</p>
                      </motion.div>
                    </div>
                    
                    <p className="mt-4 text-base">
                      This revolutionary approach ensures your data is:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Stored permanently with one-time payment</li>
                      <li>Secure against both classical and quantum threats</li>
                      <li>Verified across multiple blockchains for maximum security</li>
                      <li>Accessible only to authorized entities using zero-knowledge technology</li>
                      <li>Resistant to censorship, tampering, and single points of failure</li>
                    </ul>
                  </div>
                </div>
                
                <Alert className="bg-gradient-to-r from-purple-950/30 to-fuchsia-950/20 border-purple-500/30">
                  <Shield className="h-5 w-5 text-purple-400" />
                  <AlertTitle>Maximum Security Guarantee</AlertTitle>
                  <AlertDescription>
                    Files stored through Chronos Vault's triple-chain system benefit from our quantum-resistant 
                    encryption and zero-knowledge privacy features. Perfect for long-term storage of valuable 
                    digital assets and documents requiring the highest level of security.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default StoragePage;
