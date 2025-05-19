import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Shield, KeyRound, Smartphone, QrCode, Check, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/hooks/use-auth';
import { useSecurityService } from '@/hooks/use-security-service';

/**
 * Device Recovery Flow Component
 * 
 * This component handles device recovery for users who need to authenticate
 * on a new device or have lost access to their primary device.
 * 
 * Supports multiple recovery methods:
 * 1. Multi-signature verification (with signers from the user's vault)
 * 2. Recovery key verification (backup key)
 * 3. QR-based device pairing
 */
const DeviceRecoveryFlow: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const securityService = useSecurityService();
  
  const [activeTab, setActiveTab] = useState<string>('multi-sig');
  const [recoveryPhase, setRecoveryPhase] = useState<'initial' | 'verification' | 'success' | 'error'>('initial');
  
  // Multi-signature recovery states
  const [operationId, setOperationId] = useState<string>('');
  const [signatureCount, setSignatureCount] = useState<number>(0);
  const [requiredSignatures, setRequiredSignatures] = useState<number>(3);
  const [isPollingSignatures, setIsPollingSignatures] = useState<boolean>(false);
  
  // Recovery key states
  const [recoveryKey, setRecoveryKey] = useState<string>('');
  const [isVerifyingKey, setIsVerifyingKey] = useState<boolean>(false);
  
  // QR pairing states
  const [qrCode, setQrCode] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>(`device_${Math.random().toString(36).substring(2, 9)}`);
  const [isPairingDevice, setIsPairingDevice] = useState<boolean>(false);
  const [pairingProgress, setPairingProgress] = useState<number>(0);
  
  // Initialize recovery operation if not authenticated
  useEffect(() => {
    // Skip initialization if user is already authenticated
    if (isAuthenticated) return;
    
    const initializeRecovery = async () => {
      try {
        // For multi-signature recovery, we need to create an operation that
        // other authorized signers can approve
        const newOperationId = await securityService.proposeSecurityOperation(
          'device_recovery',
          { deviceId, timestamp: Date.now() }
        );
        
        setOperationId(newOperationId);
        setSignatureCount(1); // The user's own signature is already added
        
        // For QR-based pairing, generate a pairing code
        const pairingCode = await securityService.generateQRPairingCode('0x123456789abcdef'); // Example address
        setQrCode(pairingCode);
        
      } catch (error) {
        console.error('Failed to initialize recovery:', error);
        toast({
          title: "Recovery Initialization Failed",
          description: "Could not initialize the recovery process. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    initializeRecovery();
  }, [isAuthenticated, securityService, deviceId, toast]);
  
  // Poll for signature count updates in multi-signature mode
  useEffect(() => {
    if (!operationId || activeTab !== 'multi-sig' || !isPollingSignatures) return;
    
    const pollInterval = setInterval(async () => {
      try {
        const count = await securityService.getOperationSignatureCount(operationId);
        setSignatureCount(count);
        
        // Check if we have enough signatures
        if (count >= requiredSignatures) {
          setIsPollingSignatures(false);
          clearInterval(pollInterval);
          
          // Execute the recovery operation
          const success = await securityService.executeOperation(operationId);
          if (success) {
            setRecoveryPhase('success');
          } else {
            setRecoveryPhase('error');
          }
        }
      } catch (error) {
        console.error('Error polling signature count:', error);
      }
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(pollInterval);
  }, [operationId, activeTab, isPollingSignatures, requiredSignatures, securityService]);
  
  // Simulate QR pairing progress
  useEffect(() => {
    if (!isPairingDevice || activeTab !== 'qr') return;
    
    const pairingInterval = setInterval(() => {
      setPairingProgress((prev) => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(pairingInterval);
          setIsPairingDevice(false);
          
          // Simulate successful pairing
          setTimeout(() => {
            setRecoveryPhase('success');
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 1000);
    
    return () => clearInterval(pairingInterval);
  }, [isPairingDevice, activeTab]);
  
  // Handle multi-signature recovery
  const startMultiSigRecovery = async () => {
    if (!operationId) return;
    
    try {
      setRecoveryPhase('verification');
      setIsPollingSignatures(true);
      
      toast({
        title: "Recovery Request Initiated",
        description: "Waiting for authorized signers to approve your request.",
      });
      
    } catch (error) {
      console.error('Error starting multi-signature recovery:', error);
      setRecoveryPhase('error');
      setIsPollingSignatures(false);
      
      toast({
        title: "Recovery Failed",
        description: "Could not initiate the recovery process. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle recovery key verification
  const verifyRecoveryKey = async () => {
    if (!recoveryKey.trim()) {
      toast({
        title: "Recovery Key Required",
        description: "Please enter your recovery key to continue.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsVerifyingKey(true);
      setRecoveryPhase('verification');
      
      // Simulate verification with delay
      setTimeout(async () => {
        // In production, this would verify the recovery key against a secure hash
        // For now, we'll simulate success/failure based on key format
        
        // Mock recovery key format validation (should be 4 groups of 6 characters)
        const isValidFormat = /^[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/.test(recoveryKey);
        
        if (isValidFormat) {
          const mockProof = {
            proofId: 'mock-proof-id',
            timestamp: Date.now(),
            signature: '0x1234567890abcdef',
            data: 'mock-data',
            expiresAt: Date.now() + 3600000 // 1 hour
          };
          
          const verified = await securityService.verifyRecoverySignature(mockProof);
          
          if (verified) {
            setRecoveryPhase('success');
          } else {
            setRecoveryPhase('error');
          }
        } else {
          setRecoveryPhase('error');
        }
        
        setIsVerifyingKey(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error verifying recovery key:', error);
      setRecoveryPhase('error');
      setIsVerifyingKey(false);
      
      toast({
        title: "Verification Failed",
        description: "Could not verify your recovery key. Please check and try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle QR code pairing
  const startQrPairing = async () => {
    if (!qrCode) return;
    
    try {
      setRecoveryPhase('verification');
      setIsPairingDevice(true);
      setPairingProgress(0);
      
      toast({
        title: "Pairing Started",
        description: "Scan the QR code with your authorized device to complete pairing.",
      });
      
    } catch (error) {
      console.error('Error starting QR pairing:', error);
      setRecoveryPhase('error');
      setIsPairingDevice(false);
      
      toast({
        title: "Pairing Failed",
        description: "Could not start the pairing process. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle recovery success
  const handleRecoverySuccess = () => {
    toast({
      title: "Recovery Successful",
      description: "Your account has been successfully recovered on this device.",
    });
    
    // Redirect to dashboard or home page
    setTimeout(() => {
      setLocation('/security-dashboard');
    }, 2000);
  };
  
  // Handle recovery retry
  const handleRetry = () => {
    setRecoveryPhase('initial');
    setIsPollingSignatures(false);
    setIsVerifyingKey(false);
    setIsPairingDevice(false);
    setPairingProgress(0);
    setRecoveryKey('');
  };
  
  // Render success state
  if (recoveryPhase === 'success') {
    return (
      <Card className="border-green-500/30 bg-green-500/10">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Recovery Successful</h2>
          <p className="text-muted-foreground mb-6">
            Your device has been successfully authorized to access your account.
          </p>
          <Button onClick={handleRecoverySuccess}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (recoveryPhase === 'error') {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Recovery Failed</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't complete the recovery process. Please try again or use a different recovery method.
          </p>
          <Button onClick={handleRetry}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 w-full mb-6">
        <TabsTrigger value="multi-sig" disabled={recoveryPhase === 'verification'}>
          <Shield className="h-4 w-4 mr-2" />
          Multi-Signature
        </TabsTrigger>
        <TabsTrigger value="recovery-key" disabled={recoveryPhase === 'verification'}>
          <KeyRound className="h-4 w-4 mr-2" />
          Recovery Key
        </TabsTrigger>
        <TabsTrigger value="qr" disabled={recoveryPhase === 'verification'}>
          <QrCode className="h-4 w-4 mr-2" />
          QR Pairing
        </TabsTrigger>
      </TabsList>
      
      {/* Multi-Signature Recovery */}
      <TabsContent value="multi-sig" className="focus:outline-none">
        <Card>
          <CardHeader>
            <CardTitle>Multi-Signature Recovery</CardTitle>
            <CardDescription>
              Recover access by requesting signatures from your authorized signers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recoveryPhase === 'verification' ? (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin-slow" />
                  <h3 className="text-lg font-medium mb-2">Awaiting Signatures</h3>
                  <p className="text-muted-foreground mb-6">
                    Send the operation ID below to your authorized signers to approve this recovery request.
                  </p>
                </div>
                
                <div className="p-4 bg-black/20 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">Operation ID</h4>
                  <div className="font-mono text-xs bg-black/40 p-3 rounded break-all">
                    {operationId}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Approval Progress</span>
                    <span>{signatureCount} of {requiredSignatures} signatures</span>
                  </div>
                  <Progress value={(signatureCount / requiredSignatures) * 100} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  This method requires approval from multiple authorized signers that you've previously set up on your account.
                </p>
                
                <Alert>
                  <AlertTitle>How it works</AlertTitle>
                  <AlertDescription className="text-sm">
                    1. Initiate a recovery request<br />
                    2. Share the operation ID with your trusted signers<br />
                    3. Once enough signers approve, your device will be authorized
                  </AlertDescription>
                </Alert>
                
                <Button onClick={startMultiSigRecovery} className="w-full">
                  Start Multi-Signature Recovery
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Recovery Key */}
      <TabsContent value="recovery-key" className="focus:outline-none">
        <Card>
          <CardHeader>
            <CardTitle>Recovery Key Verification</CardTitle>
            <CardDescription>
              Use your backup recovery key to restore access
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recoveryPhase === 'verification' ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary animate-spin-slow" />
                <h3 className="text-lg font-medium mb-2">Verifying Recovery Key</h3>
                <p className="text-muted-foreground">
                  Please wait while we verify your recovery key...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Enter the recovery key that was provided to you when you set up your account or created a backup.
                </p>
                
                <div className="space-y-2">
                  <label htmlFor="recovery-key" className="text-sm font-medium">
                    Recovery Key
                  </label>
                  <Input
                    id="recovery-key"
                    placeholder="e.g. ABCDEF-123456-GHIJKL-789012"
                    className="font-mono"
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your recovery key should be in the format: XXXXXX-XXXXXX-XXXXXX-XXXXXX
                  </p>
                </div>
                
                <Button 
                  onClick={verifyRecoveryKey} 
                  className="w-full"
                  disabled={!recoveryKey.trim()}
                >
                  Verify Recovery Key
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* QR Pairing */}
      <TabsContent value="qr" className="focus:outline-none">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Pairing</CardTitle>
            <CardDescription>
              Use another authorized device to grant access to this device
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recoveryPhase === 'verification' ? (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className="mx-auto w-48 h-48 bg-white p-4 rounded-md mb-4">
                    {/* In a real implementation, this would be an actual QR code */}
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,#333,#333_10px,#222_10px,#222_20px)]"></div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Scan with Authorized Device</h3>
                  <p className="text-muted-foreground mb-6">
                    Open the Chronos Vault app on your authorized device and scan this QR code
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pairing Progress</span>
                    <span>{pairingProgress}%</span>
                  </div>
                  <Progress value={pairingProgress} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  If you have access to another device that's already authorized with your account, you can use it to authorize this device.
                </p>
                
                <Alert>
                  <AlertTitle>How it works</AlertTitle>
                  <AlertDescription className="text-sm">
                    1. Generate a QR code on this device<br />
                    2. Scan it with your authorized device<br />
                    3. Approve the pairing request on your authorized device
                  </AlertDescription>
                </Alert>
                
                <Button onClick={startQrPairing} className="w-full">
                  Generate QR Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DeviceRecoveryFlow;