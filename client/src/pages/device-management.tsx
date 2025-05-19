import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { 
  Shield, 
  Smartphone, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  AlertTriangle,
  Trash2,
  LockKeyhole,
  Clock,
  RefreshCw,
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useAuthContext } from '@/contexts/auth-context';
import { useMultiDeviceAuth } from '../hooks/use-multi-device-auth';

const DeviceManagementPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, address } = useAuthContext();
  const { 
    devices, 
    isLoading, 
    pendingRequests, 
    fetchDevices, 
    registerDevice, 
    approveDevice, 
    revokeDevice,
    getDeviceName
  } = useMultiDeviceAuth();
  
  const [newDeviceName, setNewDeviceName] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('devices');
  
  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);
  
  // Handle device registration
  const handleRegisterDevice = async () => {
    if (!newDeviceName) {
      toast({
        title: 'Error',
        description: 'Please enter a device name',
        variant: 'destructive',
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const success = await registerDevice(newDeviceName);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Device registration initiated. Approval required from another authorized device.',
          variant: 'default',
        });
        setNewDeviceName('');
        fetchDevices();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to register device',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error registering device:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while registering the device',
        variant: 'destructive',
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  // Handle device approval
  const handleApproveDevice = async (operationId: string) => {
    setIsApproving(true);
    
    try {
      const success = await approveDevice(operationId);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Device approved successfully',
          variant: 'default',
        });
        fetchDevices();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to approve device',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving device:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while approving the device',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };
  
  // Handle device revocation
  const handleRevokeDevice = async (deviceId: string) => {
    setIsRevoking(deviceId);
    
    try {
      const success = await revokeDevice(deviceId);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Device access revoked successfully',
          variant: 'default',
        });
        fetchDevices();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to revoke device access',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error revoking device access:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while revoking device access',
        variant: 'destructive',
      });
    } finally {
      setIsRevoking(null);
    }
  };
  
  // Format timestamp as relative time
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} min ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} hr ago`;
    } else {
      return `${Math.floor(diff / 86400000)} days ago`;
    }
  };
  
  // Get device status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'revoked':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Render security level badge
  const renderSecurityLevelBadge = (level: string) => {
    switch (level) {
      case 'high':
        return <Badge className="bg-green-700 hover:bg-green-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-700 hover:bg-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-red-700 hover:bg-red-800">Low</Badge>;
      default:
        return <Badge className="bg-blue-700 hover:bg-blue-800">Standard</Badge>;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Device Management | Chronos Vault</title>
        <meta name="description" content="Manage your trusted devices for Chronos Vault" />
      </Helmet>
      
      <div className="container py-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          
          <div className="ml-auto flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-400" />
            <h1 className="text-lg font-medium">Device Management</h1>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-800/20">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-4">
                <Smartphone className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Trusted Device Management</h2>
                <p className="text-sm text-gray-400">
                  Securely manage all devices that have access to your vaults
                </p>
              </div>
            </div>
            
            <div className="text-sm space-y-4 mb-6">
              <p>
                Multi-device authentication allows you to access your vaults securely from multiple devices
                while maintaining strict security protocols. Each device must be authorized and can be revoked 
                at any time if compromised.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center text-xs">
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">Trusted Devices</div>
                  <div className="text-gray-400">Control which devices can access your vaults</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">Pending Approvals</div>
                  <div className="text-gray-400">Approve new device access requests</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <div className="font-medium mb-1">Security Levels</div>
                  <div className="text-gray-400">Set different security levels for each device</div>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs 
            defaultValue="devices" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="devices">
                Trusted Devices
                {devices.filter(d => d.status === 'active').length > 0 && (
                  <Badge className="ml-2 bg-purple-600">{devices.filter(d => d.status === 'active').length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending Approvals
                {pendingRequests.length > 0 && (
                  <Badge className="ml-2 bg-yellow-600">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Trusted Devices Tab */}
            <TabsContent value="devices" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : devices.length === 0 ? (
                <Alert className="bg-blue-900/20 border-blue-500/40">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No devices found</AlertTitle>
                  <AlertDescription>
                    You don't have any registered devices yet. Add a new device below.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <Card key={device.id} className={`border-${device.status === 'active' ? 'purple' : 'gray'}-200/20 bg-black/40`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-2 text-purple-400" />
                            <CardTitle className="text-base">{device.name}</CardTitle>
                            {device.isCurrentDevice && (
                              <Badge className="ml-2 bg-purple-700">Current Device</Badge>
                            )}
                          </div>
                          <div className={`flex items-center text-xs ${getStatusColor(device.status)}`}>
                            {device.status === 'active' ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : device.status === 'pending' ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Revoked
                              </>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs mt-1">
                          Last active: {formatRelativeTime(device.lastActive)}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-0">
                        <div className="grid grid-cols-2 gap-4 text-xs py-2">
                          <div>
                            <p className="text-gray-400 mb-1">Device ID</p>
                            <p className="font-mono text-xs truncate">{device.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 mb-1">Security Level</p>
                            <div>
                              <Select defaultValue="standard">
                                <SelectTrigger className="h-7 text-xs bg-black/40">
                                  <SelectValue placeholder="Security Level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="high">High Security</SelectItem>
                                  <SelectItem value="standard">Standard Security</SelectItem>
                                  <SelectItem value="medium">Medium Security</SelectItem>
                                  <SelectItem value="low">Low Security</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs py-2">
                          <div>
                            <div className="flex items-center">
                              <Switch id={`req-approval-${device.id}`} defaultChecked={device.isCurrentDevice} />
                              <Label htmlFor={`req-approval-${device.id}`} className="ml-2">
                                Require approval for sensitive operations
                              </Label>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <Switch id={`activity-notif-${device.id}`} defaultChecked />
                              <Label htmlFor={`activity-notif-${device.id}`} className="ml-2">
                                Send activity notifications
                              </Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <LockKeyhole className="h-3 w-3 mr-1" />
                          Security Details
                        </Button>
                        
                        {device.status === 'active' && !device.isCurrentDevice && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="text-xs">
                                <Trash2 className="h-3 w-3 mr-1" />
                                Revoke Access
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-red-900/30">
                              <DialogHeader>
                                <DialogTitle>Revoke Device Access</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to revoke access for this device? 
                                  This action cannot be undone, and the device will need to 
                                  go through the recovery process to regain access.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="bg-red-950/20 border border-red-900/20 rounded-md p-3 my-2">
                                <p className="text-sm font-medium mb-1 flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                                  Device details:
                                </p>
                                <p className="text-sm">{device.name}</p>
                                <p className="text-xs text-gray-400 mt-1">Device ID: {device.id}</p>
                              </div>
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click()}
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  variant="destructive"
                                  onClick={() => {
                                    handleRevokeDevice(device.id);
                                    document.querySelector<HTMLButtonElement>('[data-dialog-close]')?.click();
                                  }}
                                  disabled={isRevoking === device.id}
                                >
                                  {isRevoking === device.id ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Revoking...
                                    </>
                                  ) : (
                                    'Revoke Access'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-8">
                <Card className="border-dashed border-gray-700 bg-black/30">
                  <CardHeader>
                    <CardTitle className="text-base">Add a New Device</CardTitle>
                    <CardDescription>
                      Register a new device for multi-device authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Enter device name"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="bg-black/30"
                      />
                      <Button 
                        onClick={handleRegisterDevice} 
                        disabled={isRegistering || !newDeviceName}
                      >
                        {isRegistering ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Note: New devices require approval from an existing authorized device
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Pending Approvals Tab */}
            <TabsContent value="pending" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
                </div>
              ) : pendingRequests.length === 0 ? (
                <Alert className="bg-blue-900/20 border-blue-500/40">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No pending requests</AlertTitle>
                  <AlertDescription>
                    There are no device access requests pending approval
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <Card key={request.id} className="border-yellow-500/20 bg-black/40">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Smartphone className="h-5 w-5 mr-2 text-yellow-400" />
                            <CardTitle className="text-base">{request.deviceName}</CardTitle>
                            <Badge className="ml-2 bg-yellow-700">Pending Approval</Badge>
                          </div>
                        </div>
                        <CardDescription className="text-xs mt-1">
                          Requested access to your Chronos Vault account
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-2">
                        <div className="bg-yellow-950/20 border border-yellow-900/20 rounded-md p-3 mb-3">
                          <p className="text-sm flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                            Approving this device will grant it access to your vaults
                          </p>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          <p>Request ID: {request.id.substring(0, 10)}...</p>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-end pt-2 space-x-2">
                        <Button variant="destructive" size="sm">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          onClick={() => handleApproveDevice(request.id)}
                          disabled={isApproving}
                        >
                          {isApproving ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <Alert className="bg-purple-900/20 border-purple-500/30">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Multi-Signature Security</AlertTitle>
                  <AlertDescription>
                    For maximum security, approved devices use multi-signature technology 
                    to ensure that only authorized devices can access your sensitive vault data.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Need help with device management? Visit our <a href="/security-documentation" className="text-purple-400 hover:underline">security documentation</a> for more information.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeviceManagementPage;