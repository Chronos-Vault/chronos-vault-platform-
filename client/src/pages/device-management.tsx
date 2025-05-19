import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useMultiDeviceAuth } from "@/hooks/use-multi-device-auth";
import { useAuth } from "@/hooks/use-auth";
import { ShieldCheck, AlertTriangle, Smartphone, Fingerprint, Shield, Lock, Clock } from "lucide-react";

const DeviceManagementPage: React.FC = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { 
    devices, 
    approveDevice, 
    revokeDevice,
    setPrimaryDevice,
    renameDevice,
    setSecurityLevel,
    securityLevel,
    generateRecoveryCode,
    recoveryCode
  } = useMultiDeviceAuth();
  
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'revoke' | 'approve' | null>(null);
  
  // Security levels with their descriptions
  const securityLevels = [
    { 
      id: 'standard', 
      name: 'Standard', 
      description: 'Basic security features with standard verification requirements.',
      icon: <Shield className="h-6 w-6 mr-2" />
    },
    { 
      id: 'enhanced', 
      name: 'Enhanced', 
      description: 'Additional verification steps with multi-factor authentication for sensitive operations.',
      icon: <Lock className="h-6 w-6 mr-2" /> 
    },
    { 
      id: 'maximum', 
      name: 'Maximum', 
      description: 'Highest security level with time-delayed operations and mandatory multi-device approval.',
      icon: <ShieldCheck className="h-6 w-6 mr-2" /> 
    }
  ];

  const handleAction = (deviceId: string, action: 'revoke' | 'approve') => {
    setSelectedDevice(deviceId);
    setActionType(action);
    setConfirmDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedDevice || !actionType) return;
    
    try {
      if (actionType === 'revoke') {
        await revokeDevice(selectedDevice);
        toast({
          title: "Device access revoked",
          description: "The device can no longer access your account.",
        });
      } else {
        await approveDevice(selectedDevice);
        toast({
          title: "Device approved",
          description: "The device can now access your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
    
    setConfirmDialogOpen(false);
  };

  const handleSecurityLevelChange = async (level: string) => {
    try {
      await setSecurityLevel(level as 'standard' | 'enhanced' | 'maximum');
      toast({
        title: "Security level updated",
        description: `Your security level has been set to ${level}.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your security level. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateRecoveryCode = async () => {
    try {
      await generateRecoveryCode();
      toast({
        title: "Recovery code generated",
        description: "Your new recovery code has been generated. Please store it securely.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating a recovery code. Please try again.",
        variant: "destructive",
      });
    }
  };

  // For demonstration purposes, always show the UI
  // Note: In production, this would check authentication
  const demoMode = true; // Show the UI even if not authenticated
  
  if (!isAuthenticated && !demoMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to sign in to manage your devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/connect-ton">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Device Management</h1>
        <p className="text-muted-foreground">
          Manage devices that have access to your Chronos Vault account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Devices</CardTitle>
              <CardDescription>
                Devices that are authorized to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-6">
                  <Smartphone className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p>No devices have been connected to your account yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <Smartphone className={`h-10 w-10 ${device.isCurrentDevice ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{device.name}</h3>
                            {device.isCurrentDevice && (
                              <Badge variant="default" className="ml-2">Current Device</Badge>
                            )}
                            {device.status === 'pending' && (
                              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                                Pending Approval
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last active: {new Date(device.lastActive).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!device.isCurrentDevice && device.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleAction(device.id, 'approve')}
                          >
                            Approve
                          </Button>
                        )}
                        {!device.isCurrentDevice && (
                          <Button 
                            variant="destructive" 
                            onClick={() => handleAction(device.id, 'revoke')}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Security Level</CardTitle>
              <CardDescription>
                Set your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={securityLevel || 'standard'} onValueChange={handleSecurityLevelChange}>
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="enhanced">Enhanced</TabsTrigger>
                  <TabsTrigger value="maximum">Maximum</TabsTrigger>
                </TabsList>
                {securityLevels.map((level) => (
                  <TabsContent key={level.id} value={level.id}>
                    <div className="flex items-center mt-4 mb-2">
                      {level.icon}
                      <h3 className="font-semibold">{level.name} Security</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {level.description}
                    </p>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery Options</CardTitle>
              <CardDescription>
                Manage recovery methods for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Fingerprint className="h-5 w-5 mr-2" />
                  Recovery Code
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate a recovery code that can be used to access your account if you lose access to your devices.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleGenerateRecoveryCode}
                  className="w-full"
                >
                  Generate New Recovery Code
                </Button>
                
                {recoveryCode && (
                  <Alert className="mt-3">
                    <AlertTitle className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Store this code securely
                    </AlertTitle>
                    <AlertDescription>
                      <div className="font-mono bg-muted p-2 rounded-md mt-2 text-xs break-all">
                        {recoveryCode}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-1 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Auto-revocation
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Devices that haven't been active for 30 days will be automatically revoked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'revoke' ? 'Revoke Device Access' : 'Approve Device'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'revoke' 
                ? 'Are you sure you want to revoke access for this device? The user will need to go through the recovery process to regain access.'
                : 'Are you sure you want to approve this device? It will be able to access your account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={actionType === 'revoke' ? 'destructive' : 'default'}
              onClick={confirmAction}
            >
              {actionType === 'revoke' ? 'Revoke Access' : 'Approve Device'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceManagementPage;