/**
 * Storage Page
 * 
 * This page demonstrates the permanent storage capabilities using Arweave/Bundlr
 */

import { useState, useEffect } from 'react';
import { FileUploader } from '@/components/storage/FileUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info, HardDrive, Database, AlertTriangle } from 'lucide-react';
import { arweaveStorage } from '@/services/arweave-service';
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
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Permanent Storage</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Store your important files permanently on the Arweave network for decentralized, tamper-proof storage
        </p>
      </div>
      
      {/* Storage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            <span>Storage Network Status</span>
          </CardTitle>
          <CardDescription>
            Current status of the Arweave permanent storage network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full" />
              <span className="ml-2">Checking storage status...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : storageStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Network Status</div>
                <div className="flex items-center">
                  <Badge variant={storageStatus.available ? 'default' : 'destructive'} className="mr-2">
                    {storageStatus.available ? 'Online' : 'Offline'}
                  </Badge>
                  <span className="text-sm">{storageStatus.network}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Gateway</div>
                <div className="truncate text-sm">{storageStatus.gateway}</div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Storage Cost</div>
                <div className="text-sm">
                  {storageStatus.costPerMb ? (
                    <span>{formatCostPerMb(storageStatus.costPerMb)} AR/MB</span>
                  ) : (
                    <span>Not available</span>
                  )}
                </div>
              </div>
              
              {storageStatus.balance && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Current Balance</div>
                  <div className="text-sm">{formatBalance(storageStatus.balance)} AR</div>
                </div>
              )}
              
              {storageStatus.avgUploadTime && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Upload Time</div>
                  <div className="text-sm">{storageStatus.avgUploadTime} seconds</div>
                </div>
              )}
            </div>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Data</AlertTitle>
              <AlertDescription>Storage status information is not available</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      
      {/* Storage Features Tab */}
      <Tabs defaultValue="upload">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="manage">Manage Storage</TabsTrigger>
          <TabsTrigger value="info">About Permanent Storage</TabsTrigger>
        </TabsList>
        
        {/* File Uploader Tab */}
        <TabsContent value="upload" className="mt-4">
          <FileUploader 
            vaultId={1} // This would normally come from the selected vault
            maxFileSize={50 * 1024 * 1024} // 50MB limit for testing
            acceptedFileTypes="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,text/plain"
          />
        </TabsContent>
        
        {/* Storage Management Tab */}
        <TabsContent value="manage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Your Storage</CardTitle>
              <CardDescription>
                View and manage your permanently stored files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <HardDrive className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Files Found</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  You haven't stored any files permanently yet. Upload files to the Arweave network to see them here.
                </p>
                <Button variant="outline" onClick={() => document.querySelector('[data-value="upload"]')?.click()}>Go to Upload</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Information Tab */}
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>About Permanent Storage</CardTitle>
              <CardDescription>
                Understanding Arweave and permanent data storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">What is Arweave?</h3>
                <p className="text-muted-foreground">
                  Arweave is a decentralized storage network that allows you to store data permanently. Unlike traditional cloud storage, 
                  files stored on Arweave are permanently accessible and cannot be deleted or modified, making it perfect for 
                  important documents, assets, and records.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Benefits of Permanent Storage</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>One-time payment for permanent storage</li>
                  <li>Tamper-proof and censorship-resistant</li>
                  <li>Decentralized across thousands of nodes</li>
                  <li>Perfect for long-term record keeping</li>
                  <li>Integrated with Chronos Vault's multi-chain security</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">How Storage Works in Chronos Vault</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    When a user uploads files in our system:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>First Upload:</strong> The file is uploaded through our interface to Bundlr</li>
                    <li><strong>Permanent Storage:</strong> Bundlr processes the payment and stores the file permanently on Arweave network</li>
                    <li><strong>Link to Vault:</strong> The transaction ID (like a receipt) is saved in our database and connected to the user's vault</li>
                    <li><strong>Cross-Chain Verification:</strong> We record proof of this storage across multiple blockchains for extra security</li>
                  </ol>
                  <p className="mt-4">
                    This means:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Files are stored permanently and can't be deleted</li>
                    <li>Data is completely decentralized (not on our servers)</li>
                    <li>Each file has a unique transaction ID that proves ownership</li>
                    <li>Your vault contains references to these files but not the files themselves</li>
                  </ul>
                  <p className="mt-4">
                    This approach gives users the benefits of both worlds:
                    the security and permanent storage of decentralized networks
                    and the user-friendly interface of Chronos Vault to manage everything.
                  </p>
                </div>
              </div>
              
              <Alert className="bg-purple-950/20 border-purple-500/30">
                <Info className="h-4 w-4 text-purple-500" />
                <AlertTitle>Important Note</AlertTitle>
                <AlertDescription>
                  Files stored on Arweave are permanent and cannot be deleted. Ensure you're uploading only files you want to preserve indefinitely.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoragePage;
