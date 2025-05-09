import React, { useState } from 'react';
import { BiometricAuth } from './biometric-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Shield, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { biometricAuthService } from '@/services/biometric-auth-service';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VaultBiometricIntegrationProps {
  userId: string;
  username: string;
  onBiometricEnabled?: (enabled: boolean) => void;
  isEnabled?: boolean;
}

export function VaultBiometricIntegration({
  userId,
  username,
  onBiometricEnabled,
  isEnabled = false
}: VaultBiometricIntegrationProps) {
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(isEnabled);
  const [biometricRegistered, setBiometricRegistered] = useState<boolean>(false);
  const [authStatus, setAuthStatus] = useState<'none' | 'success' | 'error'>('none');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  
  // Check if biometric is supported
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  
  React.useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = await biometricAuthService.isBiometricSupported();
        setIsSupported(supported);
      } catch (err) {
        console.error('Error checking biometric support:', err);
        setIsSupported(false);
      }
    };
    
    const loadCredentials = async () => {
      if (userId) {
        try {
          const creds = await biometricAuthService.getUserCredentials(userId);
          setCredentials(creds);
          setBiometricRegistered(creds.length > 0);
        } catch (err) {
          console.error('Error loading credentials:', err);
        }
      }
    };
    
    checkSupport();
    loadCredentials();
  }, [userId]);
  
  const handleAuthSuccess = (userId: string) => {
    setAuthStatus('success');
    setBiometricEnabled(true);
    if (onBiometricEnabled) {
      onBiometricEnabled(true);
    }
  };
  
  const handleAuthFailure = (error: string) => {
    setAuthStatus('error');
    console.error('Biometric authentication failed:', error);
  };
  
  const handleRegisterSuccess = (credential: any) => {
    setBiometricRegistered(true);
    setCredentials(prev => [...prev, credential]);
  };
  
  const handleRemoveCredential = async (credentialId: string) => {
    try {
      await biometricAuthService.deleteCredential(credentialId);
      setCredentials(prev => prev.filter(cred => cred.id !== credentialId));
      setBiometricRegistered(credentials.length > 1);
    } catch (err) {
      console.error('Error removing credential:', err);
    }
  };
  
  if (isSupported === false) {
    return (
      <Card className="bg-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fingerprint className="w-5 h-5 mr-2 text-[#3F51FF]" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>Enhance vault security with biometric authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-red-900/20 border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your device or browser does not support biometric authentication.
              Try using a different device or updating your browser.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-black/40 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Fingerprint className="w-5 h-5 mr-2 text-[#3F51FF]" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>Enhance vault security with biometric authentication</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Status alerts */}
          {authStatus === 'success' && (
            <Alert className="bg-green-900/20 border-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Authentication Successful</AlertTitle>
              <AlertDescription>
                Biometric authentication is now enabled for this vault.
              </AlertDescription>
            </Alert>
          )}
          
          {authStatus === 'error' && (
            <Alert className="bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>
                There was a problem authenticating with your biometric data.
                Please try again or use another authentication method.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Biometric status summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${biometricEnabled ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="font-medium">{biometricEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-black/40 text-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-black/70 border-gray-800 text-white backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle>Biometric Authentication Settings</DialogTitle>
                  <DialogDescription>
                    Manage your biometric credentials for this vault
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue={biometricRegistered ? "manage" : "register"} className="mt-4">
                  <TabsList className="bg-black/60 w-full">
                    <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
                    <TabsTrigger value="manage" className="flex-1">Manage</TabsTrigger>
                    <TabsTrigger value="verify" className="flex-1">Verify</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="register" className="mt-4">
                    <BiometricAuth 
                      userId={userId}
                      username={username}
                      mode="register"
                      onRegisterSuccess={handleRegisterSuccess}
                    />
                  </TabsContent>
                  
                  <TabsContent value="manage" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Registered Credentials</h3>
                      
                      {credentials.length === 0 ? (
                        <div className="bg-black/40 p-4 rounded-md border border-gray-800 text-gray-400 text-center">
                          No biometric credentials registered
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {credentials.map(cred => (
                            <div 
                              key={cred.id} 
                              className="flex items-center justify-between bg-black/40 p-3 rounded-md border border-gray-800"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="bg-blue-900/30 p-2 rounded-full">
                                  <Fingerprint className="h-4 w-4 text-blue-400" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium">{cred.name}</div>
                                  <div className="text-xs text-gray-500">
                                    Created: {new Date(cred.createDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => handleRemoveCredential(cred.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="verify" className="mt-4">
                    <BiometricAuth 
                      userId={userId}
                      username={username}
                      mode="authenticate"
                      onAuthSuccess={handleAuthSuccess}
                      onAuthFailure={handleAuthFailure}
                    />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Information and benefits */}
          <div className="bg-black/30 p-4 rounded-lg border border-gray-800 mt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-[#3F51FF]" />
              Biometric Security Benefits
            </h4>
            <ul className="text-sm text-gray-400 space-y-1">
              <li className="flex items-start">
                <CheckCircle2 className="h-3 w-3 mr-2 mt-1 text-green-400" />
                Hardware-backed cryptographic security
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-3 w-3 mr-2 mt-1 text-green-400" />
                Resistant to phishing and replay attacks
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-3 w-3 mr-2 mt-1 text-green-400" />
                No shared secrets or passwords that can be stolen
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-3 w-3 mr-2 mt-1 text-green-400" />
                Biometric data never leaves your device
              </li>
            </ul>
            
            <Button
              className="w-full mt-4 bg-gradient-to-r from-[#3F51FF] to-[#8B5CF6] hover:from-[#3647E3] hover:to-[#7B50DE]"
              onClick={() => setDialogOpen(true)}
            >
              {biometricRegistered ? 'Manage Biometric Authentication' : 'Set Up Biometric Authentication'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}